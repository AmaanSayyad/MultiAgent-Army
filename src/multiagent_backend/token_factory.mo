/**
 * Module     : token_factory.mo
 * Copyright  : 2025 Multiagent Army Team
 * License    : Apache 2.0 with LLVM Exception
 * Maintainer : Multiagent Army Team
 * Stability  : Experimental
 */

import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Float "mo:base/Float";
import Blob "mo:base/Blob";
import Error "mo:base/Error";
import Types "./types";

actor TokenFactory {
    type CanisterId = Types.CanisterId;
    type TokenId = Types.TokenId;
    type TokenConfig = Types.TokenConfig;
    type TokenInfo = Types.TokenInfo;
    type AgentId = Types.AgentId;
    type TokenDistribution = Types.TokenDistribution;
    type VestingSchedule = Types.VestingSchedule;
    type Result<A, B> = Result.Result<A, B>;
    type DIP20Interface = Types.DIP20Interface;

    // IC Management Canister Interface
    type IC = actor {
        create_canister : { settings : ?CanisterSettings } -> async {
            canister_id : Principal;
        };
        install_code : {
            mode : { #install; #reinstall; #upgrade };
            canister_id : Principal;
            wasm_module : Blob;
            arg : Blob;
        } -> async ();
        canister_status : { canister_id : Principal } -> async CanisterStatusResult;
        start_canister : { canister_id : Principal } -> async ();
        stop_canister : { canister_id : Principal } -> async ();
        delete_canister : { canister_id : Principal } -> async ();
    };

    type CanisterSettings = {
        controllers : ?[Principal];
        compute_allocation : ?Nat;
        memory_allocation : ?Nat;
        freezing_threshold : ?Nat;
    };

    type CanisterStatusResult = {
        status : { #running; #stopping; #stopped };
        memory_size : Nat;
        cycles : Nat;
        settings : CanisterSettings;
        module_hash : ?Blob;
    };

    // IC Management Canister
    let ic : IC = actor "aaaaa-aa";

    // Token storage
    private stable var nextTokenId : Nat = 1;
    private var tokens = HashMap.HashMap<TokenId, TokenInfo>(10, Text.equal, Text.hash);
    private var agentTokens = HashMap.HashMap<AgentId, TokenId>(10, Text.equal, Text.hash);
    private var ownerTokens = HashMap.HashMap<Principal, [TokenId]>(10, Principal.equal, Principal.hash);

    // Initialization
    public shared (msg) func init() : async () {
        // Initialization logic if needed
        Debug.print("Token Factory initialized by: " # Principal.toText(msg.caller));
    };

    // Create a new token canister
    public shared (msg) func createToken(
        config : TokenConfig,
        agentId : ?AgentId,
        distribution : ?TokenDistribution,
        vestingSchedule : ?VestingSchedule,
    ) : async Result<TokenId, Text> {
        let caller = msg.caller;

        // Basic validation
        if (config.totalSupply == 0) {
            return #err("Total supply must be greater than zero");
        };

        if (Text.size(config.name) == 0 or Text.size(config.symbol) == 0) {
            return #err("Token name and symbol must not be empty");
        };

        // Deploy the token canister
        let canisterResult = await deployTokenCanister(config);
        let canisterId = switch (canisterResult) {
            case (#ok(id)) { id };
            case (#err(msg)) {
                return #err("Failed to deploy token canister: " # msg);
            };
        };

        // Generate a token ID
        let tokenId = generateTokenId();

        // Create token info record
        let tokenInfo : TokenInfo = {
            id = tokenId;
            canisterId = canisterId;
            config = config;
            agentId = agentId;
            distribution = distribution;
            vestingSchedule = vestingSchedule;
            createdAt = Time.now();
        };

        // Store token information
        tokens.put(tokenId, tokenInfo);

        // Link token to agent if provided
        switch (agentId) {
            case (null) {};
            case (?id) {
                agentTokens.put(id, tokenId);
            };
        };

        // Add to owner's tokens
        switch (ownerTokens.get(caller)) {
            case (null) {
                ownerTokens.put(caller, [tokenId]);
            };
            case (?existingTokens) {
                ownerTokens.put(caller, Array.append<TokenId>(existingTokens, [tokenId]));
            };
        };

        // Configure token distribution if provided
        switch (distribution) {
            case (null) {};
            case (?dist) {
                await configureDistribution(canisterId, dist);
            };
        };

        // Set up vesting schedule if provided
        switch (vestingSchedule) {
            case (null) {};
            case (?schedule) {
                await configureVesting(canisterId, schedule);
            };
        };

        return #ok(tokenId);
    };

    // Get token information
    public query func getToken(id : TokenId) : async ?TokenInfo {
        tokens.get(id);
    };

    // Get all tokens
    public query func getAllTokens() : async [TokenInfo] {
        Iter.toArray(tokens.vals());
    };

    // Get tokens by owner
    public query func getTokensByOwner(owner : Principal) : async [TokenInfo] {
        switch (ownerTokens.get(owner)) {
            case (null) { [] };
            case (?tokenIds) {
                Array.mapFilter<TokenId, TokenInfo>(
                    tokenIds,
                    func(id : TokenId) : ?TokenInfo { tokens.get(id) },
                );
            };
        };
    };

    // Get token by agent ID
    public query func getTokenByAgent(agentId : AgentId) : async ?TokenInfo {
        switch (agentTokens.get(agentId)) {
            case (null) { null };
            case (?tokenId) { tokens.get(tokenId) };
        };
    };

    // Get canister status for a token
    public shared func getTokenCanisterStatus(tokenId : TokenId) : async Result<CanisterStatusResult, Text> {
        switch (tokens.get(tokenId)) {
            case (null) { return #err("Token not found") };
            case (?tokenInfo) {
                try {
                    let canisterId = Principal.fromText(tokenInfo.canisterId);
                    let status = await ic.canister_status({
                        canister_id = canisterId;
                    });
                    return #ok(status);
                } catch (error) {
                    return #err("Failed to get canister status: " # Error.message(error));
                };
            };
        };
    };

    // Stop a token canister (admin function)
    public shared (msg) func stopTokenCanister(tokenId : TokenId) : async Result<(), Text> {
        switch (tokens.get(tokenId)) {
            case (null) { return #err("Token not found") };
            case (?tokenInfo) {
                // Check if caller is authorized (token owner or this canister)
                if (tokenInfo.config.owner != msg.caller and msg.caller != Principal.fromActor(TokenFactory)) {
                    return #err("Unauthorized: Only token owner can stop canister");
                };

                try {
                    let canisterId = Principal.fromText(tokenInfo.canisterId);
                    await ic.stop_canister({ canister_id = canisterId });
                    Debug.print("Stopped token canister: " # tokenInfo.canisterId);
                    return #ok(());
                } catch (error) {
                    return #err("Failed to stop canister: " # Error.message(error));
                };
            };
        };
    };

    // Start a token canister (admin function)
    public shared (msg) func startTokenCanister(tokenId : TokenId) : async Result<(), Text> {
        switch (tokens.get(tokenId)) {
            case (null) { return #err("Token not found") };
            case (?tokenInfo) {
                // Check if caller is authorized
                if (tokenInfo.config.owner != msg.caller and msg.caller != Principal.fromActor(TokenFactory)) {
                    return #err("Unauthorized: Only token owner can start canister");
                };

                try {
                    let canisterId = Principal.fromText(tokenInfo.canisterId);
                    await ic.start_canister({ canister_id = canisterId });
                    Debug.print("Started token canister: " # tokenInfo.canisterId);
                    return #ok(());
                } catch (error) {
                    return #err("Failed to start canister: " # Error.message(error));
                };
            };
        };
    };

    // Get token canister principal for direct interaction
    public shared func getTokenCanisterId(tokenId : TokenId) : async Result<Principal, Text> {
        switch (tokens.get(tokenId)) {
            case (null) { return #err("Token not found") };
            case (?tokenInfo) {
                try {
                    let canisterId = Principal.fromText(tokenInfo.canisterId);
                    return #ok(canisterId);
                } catch (_) {
                    return #err("Invalid canister ID format");
                };
            };
        };
    };

    // Bulk create tokens (for batch operations)
    public shared func createTokensBatch(
        configs : [TokenConfig],
        agentIds : ?[?AgentId],
        distributions : ?[?TokenDistribution],
        vestingSchedules : ?[?VestingSchedule],
    ) : async [Result<TokenId, Text>] {
        let results = Array.init<Result<TokenId, Text>>(configs.size(), #err("Not processed"));

        for (i in configs.keys()) {
            let agentId = switch (agentIds) {
                case (null) { null };
                case (?ids) { if (i < ids.size()) ids[i] else null };
            };

            let distribution = switch (distributions) {
                case (null) { null };
                case (?dists) { if (i < dists.size()) dists[i] else null };
            };

            let vestingSchedule = switch (vestingSchedules) {
                case (null) { null };
                case (?schedules) {
                    if (i < schedules.size()) schedules[i] else null;
                };
            };

            let result = await createToken(configs[i], agentId, distribution, vestingSchedule);
            results[i] := result;
        };

        Array.freeze(results);
    };

    // Deploy a new DIP-20 token canister
    private func deployTokenCanister(config : TokenConfig) : async Result<CanisterId, Text> {
        try {
            // Create canister with proper settings
            // Note: This is a simplified version for testing
            // In production, you'll need proper cycle management
            let createResult = await ic.create_canister({
                settings = ?{
                    controllers = ?[Principal.fromActor(TokenFactory), config.owner];
                    compute_allocation = null;
                    memory_allocation = null;
                    freezing_threshold = null;
                };
            });

            let canisterId = createResult.canister_id;

            // For now, we'll skip WASM installation to avoid empty blob issues
            // In production, you would install the actual DIP-20 token WASM here
            Debug.print("Created token canister (WASM installation skipped): " # Principal.toText(canisterId));
            Debug.print("Token name: " # config.name # ", Symbol: " # config.symbol);
            Debug.print("Total supply: " # Nat.toText(config.totalSupply));

            return #ok(Principal.toText(canisterId));

        } catch (error) {
            Debug.print("Error creating token canister: " # Error.message(error));
            return #err("Failed to create token canister: " # Error.message(error));
        };
    };

    // Generate a unique token ID
    private func generateTokenId() : TokenId {
        let id = "token_" # Nat.toText(nextTokenId);
        nextTokenId += 1;
        id;
    };

    // Configure token distribution according to launch type
    private func configureDistribution(canisterId : CanisterId, distribution : TokenDistribution) : async () {
        // TODO: Implement actual distribution logic
        // This would involve minting tokens to specific addresses based on the distribution
        Debug.print("Configuring distribution for canister: " # canisterId);
        Debug.print("Developer: " # Float.toText(distribution.developer * 100.0) # "%");
        Debug.print("Public Sale: " # Float.toText(distribution.publicSale * 100.0) # "%");
        Debug.print("Liquidity Pool: " # Float.toText(distribution.liquidityPool * 100.0) # "%");
    };

    // Set up vesting schedule
    private func configureVesting(canisterId : CanisterId, vestingSchedule : VestingSchedule) : async () {
        // TODO: Implement actual vesting logic
        // This would involve setting up vesting schedules in the token canister
        Debug.print("Configuring vesting for canister: " # canisterId);
        Debug.print("Developer vesting: " # Nat.toText(vestingSchedule.developerMonths) # " months");
        Debug.print("Public sale vesting: " # Nat.toText(vestingSchedule.publicSaleMonths) # " months");
        Debug.print("Liquidity pool vesting: " # Nat.toText(vestingSchedule.liquidityPoolMonths) # " months");
    };

    // System method to handle preupgrade
    system func preupgrade() {
        // TODO: Save state before upgrade - implement stable storage of the HashMaps
        Debug.print("Token Factory preparing for upgrade");
    };

    // System method to handle postupgrade
    system func postupgrade() {
        // TODO: Restore state after upgrade
        Debug.print("Token Factory upgraded successfully");
    };
};
