/**
 * Module     : user_registry.mo
 * Copyright  : 2025 Multiagent Army Team
 * License    : Apache 2.0 with LLVM Exception
 * Maintainer : Multiagent Army Team
 * Stability  : Experimental
 */

import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";

actor UserRegistry {
    // Type definitions
    public type UserId = Principal;
    public type AgentId = Text;
    public type TokenId = Text;

    public type UserProfile = {
        id : UserId;
        username : ?Text;
        displayName : ?Text;
        avatarUrl : ?Text;
        createdAt : Int;
        agents : [Text]; // agent IDs
        socialLinks : ?{
            twitter : ?Text;
            github : ?Text;
            discord : ?Text;
        };
        verifiedTwitter : Bool;
        verifiedWebsite : Bool;
    };

    public type TokenHolding = {
        tokenId : Text;
        balance : Nat;
        staked : Nat;
    };

    public type SocialVerification = {
        proofText : Text;
        timestamp : Int;
        verified : Bool;
    };

    // DIP-20 token interface for inter-canister calls
    public type DIP20Interface = actor {
        balanceOf : query (who : Principal) -> async Nat;
        getStakedAmount : query (who : Principal) -> async Nat;
    };

    // Token Factory interface for inter-canister calls
    public type TokenFactoryInterface = actor {
        getAllTokens : query () -> async [{
            id : Text;
            canisterId : Text;
            config : {
                name : Text;
                symbol : Text;
                decimals : Nat8;
                totalSupply : Nat;
                owner : Principal;
            };
            agentId : ?Text;
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
        }];
    };

    // Stable storage
    private stable var profileEntries : [(UserId, UserProfile)] = [];
    private stable var twitterVerificationEntries : [(Text, (UserId, SocialVerification))] = [];
    private stable var websiteVerificationEntries : [(Text, (UserId, SocialVerification))] = [];
    private stable var owner : Principal = Principal.fromText("aaaaa-aa");
    private stable var tokenFactoryCanisterId : ?Text = null;

    // Runtime storage
    private var profiles = HashMap.HashMap<UserId, UserProfile>(10, Principal.equal, Principal.hash);
    private var twitterVerifications = HashMap.HashMap<Text, (UserId, SocialVerification)>(10, Text.equal, Text.hash);
    private var websiteVerifications = HashMap.HashMap<Text, (UserId, SocialVerification)>(10, Text.equal, Text.hash);

    // Initialize owner
    public shared (msg) func initialize(newOwner : Principal) : async () {
        assert (owner == Principal.fromText("aaaaa-aa") or msg.caller == owner);
        owner := newOwner;
    };

    // Set Token Factory canister ID
    public shared (msg) func setTokenFactoryCanisterId(canisterId : Text) : async () {
        assert (msg.caller == owner);
        tokenFactoryCanisterId := ?canisterId;
    };

    // Create or update user profile
    public shared (msg) func updateProfile(profile : UserProfile) : async Result.Result<(), Text> {
        if (profile.id != msg.caller and msg.caller != owner) {
            return #err("Unauthorized: you can only update your own profile");
        };

        let existingProfile = profiles.get(msg.caller);

        // Preserve verification status and creation time if profile exists
        let updatedProfile : UserProfile = switch (existingProfile) {
            case (null) {
                {
                    id = msg.caller;
                    username = profile.username;
                    displayName = profile.displayName;
                    avatarUrl = profile.avatarUrl;
                    createdAt = Time.now();
                    agents = profile.agents;
                    socialLinks = profile.socialLinks;
                    verifiedTwitter = false;
                    verifiedWebsite = false;
                };
            };
            case (?existing) {
                {
                    id = msg.caller;
                    username = profile.username;
                    displayName = profile.displayName;
                    avatarUrl = profile.avatarUrl;
                    createdAt = existing.createdAt;
                    agents = profile.agents;
                    socialLinks = profile.socialLinks;
                    verifiedTwitter = existing.verifiedTwitter;
                    verifiedWebsite = existing.verifiedWebsite;
                };
            };
        };

        profiles.put(msg.caller, updatedProfile);
        return #ok();
    };

    // Get user profile
    public query func getProfile(userId : UserId) : async ?UserProfile {
        return profiles.get(userId);
    };

    // Get user token holdings
    public shared func getUserTokens(userId : UserId) : async [TokenHolding] {
        let buffer = Buffer.Buffer<TokenHolding>(10);

        switch (tokenFactoryCanisterId) {
            case (null) {
                return [];
            };
            case (?factoryId) {
                let tokenFactory = actor (factoryId) : TokenFactoryInterface;
                let allTokens = await tokenFactory.getAllTokens();

                for (tokenInfo in allTokens.vals()) {
                    let tokenActor = actor (tokenInfo.canisterId) : DIP20Interface;

                    try {
                        let balance = await tokenActor.balanceOf(userId);
                        var staked : Nat = 0;

                        try {
                            staked := await tokenActor.getStakedAmount(userId);
                        } catch (_e) {
                            // Staking might not be supported by all tokens
                        };

                        if (balance > 0 or staked > 0) {
                            buffer.add({
                                tokenId = tokenInfo.id;
                                balance = balance;
                                staked = staked;
                            });
                        };
                    } catch (_e) {
                        // Skip tokens that fail to respond
                    };
                };

                return Buffer.toArray(buffer);
            };
        };
    };

    // Verify Twitter account
    public shared (msg) func verifyTwitter(twitterHandle : Text, proof : Text) : async Result.Result<(), Text> {
        // In a real implementation, we would verify the proof by checking a tweet
        // For now, we'll just store the verification request

        let verification : SocialVerification = {
            proofText = proof;
            timestamp = Time.now();
            verified = false; // This would be set to true after actual verification
        };

        twitterVerifications.put(twitterHandle, (msg.caller, verification));

        // Update user profile to mark Twitter as verified
        switch (profiles.get(msg.caller)) {
            case (null) {
                return #err("User profile not found");
            };
            case (?profile) {
                let updatedProfile : UserProfile = {
                    id = profile.id;
                    username = profile.username;
                    displayName = profile.displayName;
                    avatarUrl = profile.avatarUrl;
                    createdAt = profile.createdAt;
                    agents = profile.agents;
                    socialLinks = switch (profile.socialLinks) {
                        case (null) {
                            ?{
                                twitter = ?twitterHandle;
                                github = null;
                                discord = null;
                            };
                        };
                        case (?links) {
                            ?{
                                twitter = ?twitterHandle;
                                github = links.github;
                                discord = links.discord;
                            };
                        };
                    };
                    verifiedTwitter = true;
                    verifiedWebsite = profile.verifiedWebsite;
                };

                profiles.put(msg.caller, updatedProfile);
                return #ok();
            };
        };
    };

    // Verify website ownership
    public shared (msg) func verifyWebsite(domain : Text, proof : Text) : async Result.Result<(), Text> {
        // In a real implementation, we would verify the proof by checking for a file on the website
        // For now, we'll just store the verification request

        let verification : SocialVerification = {
            proofText = proof;
            timestamp = Time.now();
            verified = false; // This would be set to true after actual verification
        };

        websiteVerifications.put(domain, (msg.caller, verification));

        // Update user profile to mark website as verified
        switch (profiles.get(msg.caller)) {
            case (null) {
                return #err("User profile not found");
            };
            case (?profile) {
                let updatedProfile : UserProfile = {
                    id = profile.id;
                    username = profile.username;
                    displayName = profile.displayName;
                    avatarUrl = profile.avatarUrl;
                    createdAt = profile.createdAt;
                    agents = profile.agents;
                    socialLinks = profile.socialLinks;
                    verifiedTwitter = profile.verifiedTwitter;
                    verifiedWebsite = true;
                };

                profiles.put(msg.caller, updatedProfile);
                return #ok();
            };
        };
    };

    // Add agent to user's list
    public shared (msg) func addUserAgent(userId : UserId, agentId : Text) : async Result.Result<(), Text> {
        if (userId != msg.caller and msg.caller != owner) {
            return #err("Unauthorized: you can only update your own profile");
        };

        switch (profiles.get(userId)) {
            case (null) {
                return #err("User profile not found");
            };
            case (?profile) {
                // Check if agent is already in the list
                for (id in profile.agents.vals()) {
                    if (id == agentId) {
                        return #ok(); // Agent already in list
                    };
                };

                // Add agent to list
                let updatedAgents = Array.append(profile.agents, [agentId]);
                let updatedProfile : UserProfile = {
                    id = profile.id;
                    username = profile.username;
                    displayName = profile.displayName;
                    avatarUrl = profile.avatarUrl;
                    createdAt = profile.createdAt;
                    agents = updatedAgents;
                    socialLinks = profile.socialLinks;
                    verifiedTwitter = profile.verifiedTwitter;
                    verifiedWebsite = profile.verifiedWebsite;
                };

                profiles.put(userId, updatedProfile);
                return #ok();
            };
        };
    };

    // Remove agent from user's list
    public shared (msg) func removeUserAgent(userId : UserId, agentId : Text) : async Result.Result<(), Text> {
        if (userId != msg.caller and msg.caller != owner) {
            return #err("Unauthorized: you can only update your own profile");
        };

        switch (profiles.get(userId)) {
            case (null) {
                return #err("User profile not found");
            };
            case (?profile) {
                // Remove agent from list
                let updatedAgents = Array.filter<Text>(
                    profile.agents,
                    func(id : Text) : Bool {
                        return id != agentId;
                    },
                );

                let updatedProfile : UserProfile = {
                    id = profile.id;
                    username = profile.username;
                    displayName = profile.displayName;
                    avatarUrl = profile.avatarUrl;
                    createdAt = profile.createdAt;
                    agents = updatedAgents;
                    socialLinks = profile.socialLinks;
                    verifiedTwitter = profile.verifiedTwitter;
                    verifiedWebsite = profile.verifiedWebsite;
                };

                profiles.put(userId, updatedProfile);
                return #ok();
            };
        };
    };

    // Get users by agent
    public query func getUsersByAgent(agentId : Text) : async [UserProfile] {
        let buffer = Buffer.Buffer<UserProfile>(10);

        for ((_, profile) in profiles.entries()) {
            label checking for (id in profile.agents.vals()) {
                if (id == agentId) {
                    buffer.add(profile);
                    break checking;
                };
            };
        };

        return Buffer.toArray(buffer);
    };

    // Get all verified Twitter handles
    public query func getAllVerifiedTwitterHandles() : async [(Text, Principal)] {
        let buffer = Buffer.Buffer<(Text, Principal)>(10);

        for ((handle, (userId, verification)) in twitterVerifications.entries()) {
            if (verification.verified) {
                buffer.add((handle, userId));
            };
        };

        return Buffer.toArray(buffer);
    };

    // Get all verified websites
    public query func getAllVerifiedWebsites() : async [(Text, Principal)] {
        let buffer = Buffer.Buffer<(Text, Principal)>(10);

        for ((domain, (userId, verification)) in websiteVerifications.entries()) {
            if (verification.verified) {
                buffer.add((domain, userId));
            };
        };

        return Buffer.toArray(buffer);
    };

    // System upgrade hooks
    system func preupgrade() {
        profileEntries := Iter.toArray(profiles.entries());
        twitterVerificationEntries := Iter.toArray(twitterVerifications.entries());
        websiteVerificationEntries := Iter.toArray(websiteVerifications.entries());
    };

    system func postupgrade() {
        profiles := HashMap.fromIter<UserId, UserProfile>(profileEntries.vals(), 10, Principal.equal, Principal.hash);
        twitterVerifications := HashMap.fromIter<Text, (UserId, SocialVerification)>(twitterVerificationEntries.vals(), 10, Text.equal, Text.hash);
        websiteVerifications := HashMap.fromIter<Text, (UserId, SocialVerification)>(websiteVerificationEntries.vals(), 10, Text.equal, Text.hash);

        profileEntries := [];
        twitterVerificationEntries := [];
        websiteVerificationEntries := [];
    };
};
