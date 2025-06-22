/**
 * Module     : launchpad.mo
 * Copyright  : 2025 Multiagent Army Team
 * License    : Apache 2.0 with LLVM Exception
 * Maintainer : Multiagent Army Team
 * Stability  : Experimental
 */

import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Float "mo:base/Float";
import List "mo:base/List";
// Import shared types
import _Types "./types";

actor Launchpad {
    // Type definitions
    public type SaleId = Text;
    public type TokenId = Text;
    public type AgentId = Text;
    public type CanisterId = Text;

    public type LaunchType = {
        #genesis;
        #standard;
    };

    public type SaleStatus = {
        #upcoming;
        #active;
        #ended;
        #successful;
        #failed;
    };

    // Add PointPledge record type for tracking point pledges
    public type PointPledge = {
        user : Principal;
        points : Nat;
        timestamp : Int;
    };

    public type TokenSale = {
        id : SaleId;
        tokenId : TokenId;
        agentId : AgentId;
        launchType : LaunchType;
        price : Nat;
        softCap : Nat;
        hardCap : Nat;
        raised : Nat;
        startTime : Int;
        endTime : Int;
        minPurchase : Nat;
        maxPurchase : Nat;
        status : SaleStatus;
        participants : [(Principal, Nat)];
        owner : Principal;
        armyRequired : Nat; // Required Army tokens for success
    };

    public type CommitmentRecord = {
        user : Principal;
        amount : Nat;
        timestamp : Int;
    };

    // DIP-20 token interface for inter-canister calls
    public type DIP20Interface = actor {
        balanceOf : query (who : Principal) -> async Nat;
        transfer : shared (to : Principal, value : Nat) -> async Result.Result<Nat, Text>;
        transferFrom : shared (from : Principal, to : Principal, value : Nat) -> async Result.Result<Nat, Text>;
    };

    // Agent Registry interface for inter-canister calls
    public type AgentRegistryInterface = actor {
        getAgent : query (id : AgentId) -> async ?{
            details : {
                id : AgentId;
                name : Text;
                ticker : Text;
                agentType : Text;
                shortPitch : Text;
                agentOverview : Text;
                framework : Text;
                owner : Principal;
                tokenId : ?TokenId;
                canisterId : ?CanisterId;
                launchType : { #genesis; #standard; #existing };
                twitterUrl : ?Text;
                websiteUrl : ?Text;
                createdAt : Int;
                imageUrl : ?Text;
                category : Text;
                tags : [Text];
            };
            teamMembers : [{
                id : Text;
                name : Text;
                role : Text;
                avatarUrl : ?Text;
                bio : ?Text;
                socialLinks : ?{
                    twitter : ?Text;
                    github : ?Text;
                    linkedin : ?Text;
                };
                wallet : ?Text;
                expertise : [Text];
            }];
            tokenDistribution : ?{
                developer : Float;
                publicSale : Float;
                liquidityPool : Float;
            };
            vestingSchedule : ?{
                developerMonths : Nat;
                publicSaleMonths : Nat;
                liquidityPoolMonths : Nat;
            };
            revenueSplit : ?{
                builder : Float;
                stakers : Float;
                treasury : Float;
            };
            metrics : ?{
                totalUsers : Nat;
                totalUsage : Nat;
                totalRevenue : Float;
                stakingApr : Float;
            };
            launchDate : ?Int;
            totalSupply : ?Nat;
            saleCanisterId : ?CanisterId;
        };
        setSaleCanister : shared (agentId : AgentId, saleCanisterId : CanisterId) -> async Result.Result<(), Text>;
    };

    // Token Factory interface for inter-canister calls
    public type TokenFactoryInterface = actor {
        getToken : query (id : TokenId) -> async ?{
            id : TokenId;
            canisterId : CanisterId;
            config : {
                name : Text;
                symbol : Text;
                decimals : Nat8;
                totalSupply : Nat;
                owner : Principal;
            };
            agentId : ?AgentId;
            distribution : ?{
                developer : Float;
                publicSale : Float;
                liquidityPool : Float;
            };
            vestingSchedule : ?{
                developerMonths : Nat;
                publicSaleMonths : Nat;
                liquidityPoolMonths : Nat;
            };
            createdAt : Int;
        };
    };

    // Stable storage
    private stable var saleEntries : [(SaleId, TokenSale)] = [];
    private stable var commitmentEntries : [(SaleId, [CommitmentRecord])] = [];
    private stable var pointPledgeEntries : [(SaleId, [PointPledge])] = []; // Added for point pledges
    private stable var saleCounter : Nat = 0;
    private stable var owner : Principal = Principal.fromText("aaaaa-aa");
    private stable var agentRegistryCanisterId : ?CanisterId = null;
    private stable var tokenFactoryCanisterId : ?CanisterId = null;
    private stable var armyTokenCanisterId : ?CanisterId = null;

    // Runtime storage
    private var sales = HashMap.HashMap<SaleId, TokenSale>(10, Text.equal, Text.hash);
    private var commitments = HashMap.HashMap<SaleId, List.List<CommitmentRecord>>(10, Text.equal, Text.hash);
    private var pointPledges = HashMap.HashMap<SaleId, List.List<PointPledge>>(10, Text.equal, Text.hash); // Added for point pledges

    // Initialize owner
    public shared (msg) func initialize(newOwner : Principal) : async () {
        assert (owner == Principal.fromText("aaaaa-aa") or msg.caller == owner);
        owner := newOwner;
    };

    // Set canister IDs
    public shared (msg) func setCanisterIds(
        agentRegistry : ?CanisterId,
        tokenFactory : ?CanisterId,
        armyToken : ?CanisterId,
    ) : async () {
        assert (msg.caller == owner);

        if (Option.isSome(agentRegistry)) {
            agentRegistryCanisterId := agentRegistry;
        };

        if (Option.isSome(tokenFactory)) {
            tokenFactoryCanisterId := tokenFactory;
        };

        if (Option.isSome(armyToken)) {
            armyTokenCanisterId := armyToken;
        };
    };

    // Generate a unique sale ID
    private func generateSaleId() : SaleId {
        saleCounter += 1;
        return "sale_" # Nat.toText(saleCounter);
    };

    // Create a new token sale
    public shared (msg) func createSale(
        tokenId : TokenId,
        agentId : AgentId,
        launchType : LaunchType,
        price : Nat,
        hardCap : Nat,
        softCap : Nat,
        startTime : Int,
        endTime : Int,
        minPurchase : Nat,
        maxPurchase : Nat,
        armyRequired : Nat,
    ) : async Result.Result<SaleId, Text> {
        // Check if token exists via TokenFactory
        switch (tokenFactoryCanisterId) {
            case (null) {
                return #err("Token factory canister ID not set");
            };
            case (?factoryId) {
                let tokenFactory = actor (factoryId) : TokenFactoryInterface;
                let tokenInfo = await tokenFactory.getToken(tokenId);

                switch (tokenInfo) {
                    case (null) {
                        return #err("Token not found");
                    };
                    case (?_info) {
                        // Check if agent exists via AgentRegistry
                        switch (agentRegistryCanisterId) {
                            case (null) {
                                return #err("Agent registry canister ID not set");
                            };
                            case (?registryId) {
                                let agentRegistry = actor (registryId) : AgentRegistryInterface;
                                let agentInfo = await agentRegistry.getAgent(agentId);

                                switch (agentInfo) {
                                    case (null) {
                                        return #err("Agent not found");
                                    };
                                    case (?agent) {
                                        // Check if caller is the owner of the agent
                                        if (agent.details.owner != msg.caller and msg.caller != owner) {
                                            return #err("Unauthorized: only the agent owner or platform owner can create a sale");
                                        };

                                        // Validate sale parameters
                                        if (startTime >= endTime) {
                                            return #err("Start time must be before end time");
                                        };

                                        if (softCap > hardCap) {
                                            return #err("Soft cap cannot be greater than hard cap");
                                        };

                                        if (minPurchase > maxPurchase) {
                                            return #err("Minimum purchase cannot be greater than maximum purchase");
                                        };

                                        // Create sale
                                        let saleId = generateSaleId();

                                        let status : SaleStatus = if (startTime > Time.now()) {
                                            #upcoming;
                                        } else if (Time.now() < endTime) {
                                            #active;
                                        } else {
                                            #ended;
                                        };

                                        let sale : TokenSale = {
                                            id = saleId;
                                            tokenId = tokenId;
                                            agentId = agentId;
                                            launchType = launchType;
                                            price = price;
                                            softCap = softCap;
                                            hardCap = hardCap;
                                            raised = 0;
                                            startTime = startTime;
                                            endTime = endTime;
                                            minPurchase = minPurchase;
                                            maxPurchase = maxPurchase;
                                            status = status;
                                            participants = [];
                                            owner = msg.caller;
                                            armyRequired = armyRequired;
                                        };

                                        // Store sale
                                        sales.put(saleId, sale);
                                        commitments.put(saleId, List.nil<CommitmentRecord>());

                                        // Update agent record with sale canister ID
                                        ignore await agentRegistry.setSaleCanister(agentId, Principal.toText(Principal.fromActor(Launchpad)));

                                        return #ok(saleId);
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };

    // Get sale information
    public query func getSale(id : SaleId) : async ?TokenSale {
        return sales.get(id);
    };

    // Get all active sales
    public query func getActiveSales() : async [TokenSale] {
        let buffer = Buffer.Buffer<TokenSale>(10);
        for ((_, sale) in sales.entries()) {
            if (sale.status == #active) {
                buffer.add(sale);
            };
        };
        return Buffer.toArray(buffer);
    };

    // Get sales by status
    public query func getSalesByStatus(status : SaleStatus) : async [TokenSale] {
        let buffer = Buffer.Buffer<TokenSale>(10);
        for ((_, sale) in sales.entries()) {
            if (sale.status == status) {
                buffer.add(sale);
            };
        };
        return Buffer.toArray(buffer);
    };

    // Update sale status based on current time
    private func updateSaleStatus(saleId : SaleId) : async () {
        switch (sales.get(saleId)) {
            case (null) {
                return;
            };
            case (?sale) {
                let currentTime = Time.now();
                var newStatus = sale.status;

                if (currentTime < sale.startTime and sale.status != #upcoming) {
                    newStatus := #upcoming;
                } else if (currentTime >= sale.startTime and currentTime < sale.endTime and sale.status != #active) {
                    newStatus := #active;
                } else if (currentTime >= sale.endTime and (sale.status == #active or sale.status == #upcoming)) {
                    newStatus := #ended;

                    // We'll handle finalization separately in finalizeSale()
                };

                if (newStatus != sale.status) {
                    let updatedSale : TokenSale = {
                        id = sale.id;
                        tokenId = sale.tokenId;
                        agentId = sale.agentId;
                        launchType = sale.launchType;
                        price = sale.price;
                        softCap = sale.softCap;
                        hardCap = sale.hardCap;
                        raised = sale.raised;
                        startTime = sale.startTime;
                        endTime = sale.endTime;
                        minPurchase = sale.minPurchase;
                        maxPurchase = sale.maxPurchase;
                        status = newStatus;
                        participants = sale.participants;
                        owner = sale.owner;
                        armyRequired = sale.armyRequired;
                    };

                    sales.put(saleId, updatedSale);
                };
            };
        };
    };

    // Commit tokens to a Genesis sale
    public shared (msg) func commitToGenesisSale(id : SaleId, amount : Nat) : async Result.Result<(), Text> {
        await updateSaleStatus(id);

        switch (sales.get(id)) {
            case (null) {
                return #err("Sale not found");
            };
            case (?sale) {
                if (sale.launchType != #genesis) {
                    return #err("This is not a Genesis sale");
                };

                if (sale.status != #active) {
                    return #err("Sale is not active");
                };

                if (amount < sale.minPurchase) {
                    return #err("Amount is below minimum purchase");
                };

                if (amount > sale.maxPurchase) {
                    return #err("Amount exceeds maximum purchase");
                };

                // Check if user has enough Army tokens
                switch (armyTokenCanisterId) {
                    case (null) {
                        return #err("Army token canister ID not set");
                    };
                    case (?armyId) {
                        let armyToken = actor (armyId) : DIP20Interface;
                        let armyBalance = await armyToken.balanceOf(msg.caller);

                        if (armyBalance < sale.armyRequired) {
                            return #err("Insufficient Army tokens for Genesis sale participation");
                        };

                        // Check if adding this amount would exceed hard cap
                        if (sale.raised + amount > sale.hardCap) {
                            return #err("Sale hard cap would be exceeded");
                        };

                        // Add commitment
                        let commitment : CommitmentRecord = {
                            user = msg.caller;
                            amount = amount;
                            timestamp = Time.now();
                        };

                        let existingCommitments = switch (commitments.get(id)) {
                            case (null) { List.nil<CommitmentRecord>() };
                            case (?list) { list };
                        };

                        commitments.put(id, List.push(commitment, existingCommitments));

                        // Update sale raised amount and participants
                        let currentRaised = sale.raised + amount;

                        // Find existing participant or add new one
                        var participantFound = false;
                        let updatedParticipants = Array.map<(Principal, Nat), (Principal, Nat)>(
                            sale.participants,
                            func(p : (Principal, Nat)) : (Principal, Nat) {
                                if (p.0 == msg.caller) {
                                    participantFound := true;
                                    return (p.0, p.1 + amount);
                                } else {
                                    return p;
                                };
                            },
                        );

                        let finalParticipants = if (participantFound) {
                            updatedParticipants;
                        } else {
                            Array.append(updatedParticipants, [(msg.caller, amount)]);
                        };

                        let updatedSale : TokenSale = {
                            id = sale.id;
                            tokenId = sale.tokenId;
                            agentId = sale.agentId;
                            launchType = sale.launchType;
                            price = sale.price;
                            softCap = sale.softCap;
                            hardCap = sale.hardCap;
                            raised = currentRaised;
                            startTime = sale.startTime;
                            endTime = sale.endTime;
                            minPurchase = sale.minPurchase;
                            maxPurchase = sale.maxPurchase;
                            status = sale.status;
                            participants = finalParticipants;
                            owner = sale.owner;
                            armyRequired = sale.armyRequired;
                        };

                        sales.put(id, updatedSale);

                        return #ok();
                    };
                };
            };
        };
    };

    // Buy tokens in a Standard sale
    public shared (msg) func buyTokens(id : SaleId, amount : Nat) : async Result.Result<(), Text> {
        await updateSaleStatus(id);

        switch (sales.get(id)) {
            case (null) {
                return #err("Sale not found");
            };
            case (?sale) {
                if (sale.launchType != #standard) {
                    return #err("This is not a Standard sale");
                };

                if (sale.status != #active) {
                    return #err("Sale is not active");
                };

                if (amount < sale.minPurchase) {
                    return #err("Amount is below minimum purchase");
                };

                if (amount > sale.maxPurchase) {
                    return #err("Amount exceeds maximum purchase");
                };

                // Check if adding this amount would exceed hard cap
                if (sale.raised + amount > sale.hardCap) {
                    return #err("Sale hard cap would be exceeded");
                };

                // In a real implementation, we would handle payment here
                // For simplicity, we're just recording the purchase

                // Add commitment
                let commitment : CommitmentRecord = {
                    user = msg.caller;
                    amount = amount;
                    timestamp = Time.now();
                };

                let existingCommitments = switch (commitments.get(id)) {
                    case (null) { List.nil<CommitmentRecord>() };
                    case (?list) { list };
                };

                commitments.put(id, List.push(commitment, existingCommitments));

                // Update sale raised amount and participants
                let currentRaised = sale.raised + amount;

                // Find existing participant or add new one
                var participantFound = false;
                let updatedParticipants = Array.map<(Principal, Nat), (Principal, Nat)>(
                    sale.participants,
                    func(p : (Principal, Nat)) : (Principal, Nat) {
                        if (p.0 == msg.caller) {
                            participantFound := true;
                            return (p.0, p.1 + amount);
                        } else {
                            return p;
                        };
                    },
                );

                let finalParticipants = if (participantFound) {
                    updatedParticipants;
                } else {
                    Array.append(updatedParticipants, [(msg.caller, amount)]);
                };

                let updatedSale : TokenSale = {
                    id = sale.id;
                    tokenId = sale.tokenId;
                    agentId = sale.agentId;
                    launchType = sale.launchType;
                    price = sale.price;
                    softCap = sale.softCap;
                    hardCap = sale.hardCap;
                    raised = currentRaised;
                    startTime = sale.startTime;
                    endTime = sale.endTime;
                    minPurchase = sale.minPurchase;
                    maxPurchase = sale.maxPurchase;
                    status = sale.status;
                    participants = finalParticipants;
                    owner = sale.owner;
                    armyRequired = sale.armyRequired;
                };

                sales.put(id, updatedSale);

                return #ok();
            };
        };
    };

    // Get user's commitments
    public query func getUserCommitments(user : Principal) : async [(SaleId, Nat)] {
        let buffer = Buffer.Buffer<(SaleId, Nat)>(10);

        for ((saleId, sale) in sales.entries()) {
            for ((participant, amount) in sale.participants.vals()) {
                if (participant == user) {
                    buffer.add((saleId, amount));
                };
            };
        };

        return Buffer.toArray(buffer);
    };

    // Finalize sale based on soft cap achievement
    public shared (msg) func finalizeSale(id : SaleId) : async Result.Result<(), Text> {
        await updateSaleStatus(id);

        switch (sales.get(id)) {
            case (null) {
                return #err("Sale not found");
            };
            case (?sale) {
                if (sale.status != #ended) {
                    return #err("Sale has not ended yet");
                };

                let finalStatus = if (sale.raised >= sale.softCap) {
                    #successful;
                } else {
                    #failed;
                };

                let updatedSale : TokenSale = {
                    id = sale.id;
                    tokenId = sale.tokenId;
                    agentId = sale.agentId;
                    launchType = sale.launchType;
                    price = sale.price;
                    softCap = sale.softCap;
                    hardCap = sale.hardCap;
                    raised = sale.raised;
                    startTime = sale.startTime;
                    endTime = sale.endTime;
                    minPurchase = sale.minPurchase;
                    maxPurchase = sale.maxPurchase;
                    status = finalStatus;
                    participants = sale.participants;
                    owner = sale.owner;
                    armyRequired = sale.armyRequired;
                };

                sales.put(id, updatedSale);

                return #ok();
            };
        };
    };

    // Get user's point pledges for a sale
    public query func getUserPointPledges(saleId : SaleId, user : Principal) : async Nat {
        switch (pointPledges.get(saleId)) {
            case (null) {
                return 0;
            };
            case (?pledgeList) {
                var totalPoints = 0;
                for (pledge in List.toArray(pledgeList).vals()) {
                    if (pledge.user == user) {
                        totalPoints += pledge.points;
                    };
                };
                return totalPoints;
            };
        };
    };

    // Get total points pledged to a sale
    public query func getTotalPointsPledged(saleId : SaleId) : async Nat {
        switch (pointPledges.get(saleId)) {
            case (null) {
                return 0;
            };
            case (?pledgeList) {
                var totalPoints = 0;
                for (pledge in List.toArray(pledgeList).vals()) {
                    totalPoints += pledge.points;
                };
                return totalPoints;
            };
        };
    };

    // Pledge points to a sale
    public shared (msg) func pledgePoints(id : SaleId, points : Nat) : async Result.Result<(), Text> {
        await updateSaleStatus(id);

        switch (sales.get(id)) {
            case (null) {
                return #err("Sale not found");
            };
            case (?sale) {
                if (sale.launchType != #genesis) {
                    return #err("This is not a Genesis sale");
                };

                if (sale.status != #active) {
                    return #err("Sale is not active");
                };

                if (points == 0) {
                    return #err("Cannot pledge 0 points");
                };

                // Check if user has enough points
                // For now, we'll assume users have unlimited points for testing
                // In a production environment, you would verify the user's point balance

                // Add point pledge
                let newPledge : PointPledge = {
                    user = msg.caller;
                    points = points;
                    timestamp = Time.now();
                };

                let existingPledges = switch (pointPledges.get(id)) {
                    case (null) { List.nil<PointPledge>() };
                    case (?list) { list };
                };

                pointPledges.put(id, List.push(newPledge, existingPledges));

                return #ok();
            };
        };
    };

    // Claim tokens after a sale
    public shared (msg) func claimTokens(id : SaleId) : async Result.Result<(), Text> {
        await updateSaleStatus(id);

        switch (sales.get(id)) {
            case (null) {
                return #err("Sale not found");
            };
            case (?sale) {
                if (sale.status != #successful) {
                    return #err("Sale is not successful");
                };

                // Check if user participated in the sale
                var userCommitment : ?Nat = null;

                label participantLoop for ((participant, amount) in sale.participants.vals()) {
                    if (participant == msg.caller) {
                        userCommitment := ?amount;
                        break participantLoop;
                    };
                };

                switch (userCommitment) {
                    case (null) {
                        return #err("You did not participate in this sale");
                    };
                    case (?amount) {
                        // In a real implementation, you would:
                        // 1. Check if tokens have already been claimed
                        // 2. Transfer the appropriate amount of tokens to the user
                        // 3. Mark the claim as processed

                        // For this simplified implementation, we'll just return success
                        return #ok();
                    };
                };
            };
        };
    };

    // System upgrade hooks
    system func preupgrade() {
        saleEntries := Iter.toArray(sales.entries());
        commitmentEntries := Iter.toArray(
            Iter.map<(SaleId, List.List<CommitmentRecord>), (SaleId, [CommitmentRecord])>(
                commitments.entries(),
                func((saleId, commitmentList)) : (SaleId, [CommitmentRecord]) {
                    (saleId, List.toArray(commitmentList));
                },
            )
        );
        pointPledgeEntries := Iter.toArray(
            Iter.map<(SaleId, List.List<PointPledge>), (SaleId, [PointPledge])>(
                pointPledges.entries(),
                func((saleId, pledgeList)) : (SaleId, [PointPledge]) {
                    (saleId, List.toArray(pledgeList));
                },
            )
        );
    };

    system func postupgrade() {
        sales := HashMap.fromIter<SaleId, TokenSale>(saleEntries.vals(), saleEntries.size(), Text.equal, Text.hash);

        commitments := HashMap.fromIter<SaleId, List.List<CommitmentRecord>>(
            Iter.map<(SaleId, [CommitmentRecord]), (SaleId, List.List<CommitmentRecord>)>(
                commitmentEntries.vals(),
                func((saleId, commitmentArray)) : (SaleId, List.List<CommitmentRecord>) {
                    (saleId, List.fromArray(commitmentArray));
                },
            ),
            commitmentEntries.size(),
            Text.equal,
            Text.hash,
        );

        pointPledges := HashMap.fromIter<SaleId, List.List<PointPledge>>(
            Iter.map<(SaleId, [PointPledge]), (SaleId, List.List<PointPledge>)>(
                pointPledgeEntries.vals(),
                func((saleId, pledgeArray)) : (SaleId, List.List<PointPledge>) {
                    (saleId, List.fromArray(pledgeArray));
                },
            ),
            pointPledgeEntries.size(),
            Text.equal,
            Text.hash,
        );

        saleEntries := [];
        commitmentEntries := [];
        pointPledgeEntries := [];
    };
};
