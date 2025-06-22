/**
 * Module     : agent_registry.mo
 * Copyright  : 2025 Multiagent Army Team
 * License    : Apache 2.0 with LLVM Exception
 * Maintainer : Multiagent Army Team
 * Stability  : Experimental
 */

import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";

actor AgentRegistry {
    // Type definitions
    public type AgentId = Text;
    public type TokenId = Text;
    public type CanisterId = Text;

    public type LaunchType = {
        #genesis;
        #standard;
        #existing;
    };

    public type AgentDetails = {
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
        launchType : LaunchType;
        twitterUrl : ?Text;
        websiteUrl : ?Text;
        createdAt : Int;
        imageUrl : ?Text;
        category : Text;
        tags : [Text];
    };

    public type TeamMember = {
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
    };

    public type TokenDistribution = {
        developer : Float;
        publicSale : Float;
        liquidityPool : Float;
    };

    public type VestingSchedule = {
        developerMonths : Nat;
        publicSaleMonths : Nat;
        liquidityPoolMonths : Nat;
    };

    public type RevenueSplit = {
        builder : Float;
        stakers : Float;
        treasury : Float;
    };

    public type Metrics = {
        totalUsers : Nat;
        totalUsage : Nat;
        totalRevenue : Float;
        stakingApr : Float;
    };

    public type Agent = {
        details : AgentDetails;
        teamMembers : [TeamMember];
        tokenDistribution : ?TokenDistribution;
        vestingSchedule : ?VestingSchedule;
        revenueSplit : ?RevenueSplit;
        metrics : ?Metrics;
        launchDate : ?Int;
        totalSupply : ?Nat;
        saleCanisterId : ?CanisterId;
    };

    // Stable storage
    private stable var agentEntries : [(AgentId, Agent)] = [];
    private stable var agentCounter : Nat = 0;
    private stable var owner : Principal = Principal.fromText("aaaaa-aa"); // Will be set during deployment

    // Runtime storage
    private var agents = HashMap.HashMap<AgentId, Agent>(10, Text.equal, Text.hash);

    // Initialize owner
    public shared (msg) func initialize(newOwner : Principal) : async () {
        assert (owner == Principal.fromText("aaaaa-aa") or msg.caller == owner);
        owner := newOwner;
    };

    // Generate a unique agent ID
    private func generateAgentId() : AgentId {
        agentCounter += 1;
        return "agent_" # Nat.toText(agentCounter);
    };

    // Verify agent ownership
    private func isOwner(agent : Agent, caller : Principal) : Bool {
        return agent.details.owner == caller or caller == owner;
    };

    // Create a new agent
    public shared (msg) func createAgent(
        details : AgentDetails,
        teamMembers : [TeamMember],
        tokenDistribution : ?TokenDistribution,
        vestingSchedule : ?VestingSchedule,
        totalSupply : ?Nat,
        launchDate : ?Int,
    ) : async Result.Result<AgentId, Text> {
        let agentId = generateAgentId();

        let newDetails : AgentDetails = {
            id = agentId;
            name = details.name;
            ticker = details.ticker;
            agentType = details.agentType;
            shortPitch = details.shortPitch;
            agentOverview = details.agentOverview;
            framework = details.framework;
            owner = msg.caller;
            tokenId = details.tokenId;
            canisterId = details.canisterId;
            launchType = details.launchType;
            twitterUrl = details.twitterUrl;
            websiteUrl = details.websiteUrl;
            createdAt = Time.now();
            imageUrl = details.imageUrl;
            category = details.category;
            tags = details.tags;
        };

        let newAgent : Agent = {
            details = newDetails;
            teamMembers = teamMembers;
            tokenDistribution = tokenDistribution;
            vestingSchedule = vestingSchedule;
            revenueSplit = null;
            metrics = null;
            launchDate = launchDate;
            totalSupply = totalSupply;
            saleCanisterId = null;
        };

        agents.put(agentId, newAgent);
        return #ok(agentId);
    };

    // Get agent by ID
    public query func getAgent(id : AgentId) : async ?Agent {
        return agents.get(id);
    };

    // Get all agents
    public query func getAllAgents() : async [Agent] {
        return Iter.toArray(agents.vals());
    };

    // Get agents by owner
    public query func getAgentsByOwner(owner : Principal) : async [Agent] {
        let buffer = Buffer.Buffer<Agent>(10);
        for ((_, agent) in agents.entries()) {
            if (agent.details.owner == owner) {
                buffer.add(agent);
            };
        };
        return Buffer.toArray(buffer);
    };

    // Update agent details
    public shared (msg) func updateAgent(id : AgentId, agent : Agent) : async Result.Result<(), Text> {
        switch (agents.get(id)) {
            case (null) {
                return #err("Agent not found");
            };
            case (?existingAgent) {
                if (not isOwner(existingAgent, msg.caller)) {
                    return #err("Unauthorized: only the agent owner or registry owner can update it");
                };

                // Preserve the original ID and creation timestamp
                let updatedDetails : AgentDetails = {
                    id = existingAgent.details.id;
                    createdAt = existingAgent.details.createdAt;
                    name = agent.details.name;
                    ticker = agent.details.ticker;
                    agentType = agent.details.agentType;
                    shortPitch = agent.details.shortPitch;
                    agentOverview = agent.details.agentOverview;
                    framework = agent.details.framework;
                    owner = existingAgent.details.owner; // Preserve the original owner
                    tokenId = agent.details.tokenId;
                    canisterId = agent.details.canisterId;
                    launchType = agent.details.launchType;
                    twitterUrl = agent.details.twitterUrl;
                    websiteUrl = agent.details.websiteUrl;
                    imageUrl = agent.details.imageUrl;
                    category = agent.details.category;
                    tags = agent.details.tags;
                };

                let updatedAgent : Agent = {
                    details = updatedDetails;
                    teamMembers = agent.teamMembers;
                    tokenDistribution = agent.tokenDistribution;
                    vestingSchedule = agent.vestingSchedule;
                    revenueSplit = agent.revenueSplit;
                    metrics = agent.metrics;
                    launchDate = agent.launchDate;
                    totalSupply = agent.totalSupply;
                    saleCanisterId = agent.saleCanisterId;
                };

                agents.put(id, updatedAgent);
                return #ok();
            };
        };
    };

    // Delete agent
    public shared (msg) func deleteAgent(id : AgentId) : async Result.Result<(), Text> {
        switch (agents.get(id)) {
            case (null) {
                return #err("Agent not found");
            };
            case (?existingAgent) {
                if (not isOwner(existingAgent, msg.caller)) {
                    return #err("Unauthorized: only the agent owner or registry owner can delete it");
                };

                agents.delete(id);
                return #ok();
            };
        };
    };

    // Update agent metrics
    public shared (msg) func updateAgentMetrics(id : AgentId, metrics : Metrics) : async Result.Result<(), Text> {
        switch (agents.get(id)) {
            case (null) {
                return #err("Agent not found");
            };
            case (?existingAgent) {
                if (not isOwner(existingAgent, msg.caller)) {
                    return #err("Unauthorized: only the agent owner or registry owner can update metrics");
                };

                let updatedAgent : Agent = {
                    details = existingAgent.details;
                    teamMembers = existingAgent.teamMembers;
                    tokenDistribution = existingAgent.tokenDistribution;
                    vestingSchedule = existingAgent.vestingSchedule;
                    revenueSplit = existingAgent.revenueSplit;
                    metrics = ?metrics;
                    launchDate = existingAgent.launchDate;
                    totalSupply = existingAgent.totalSupply;
                    saleCanisterId = existingAgent.saleCanisterId;
                };

                agents.put(id, updatedAgent);
                return #ok();
            };
        };
    };

    // Set token ID for an agent
    public shared (msg) func setAgentToken(agentId : AgentId, tokenId : TokenId, canisterId : CanisterId) : async Result.Result<(), Text> {
        switch (agents.get(agentId)) {
            case (null) {
                return #err("Agent not found");
            };
            case (?existingAgent) {
                if (not isOwner(existingAgent, msg.caller)) {
                    return #err("Unauthorized: only the agent owner or registry owner can set the token");
                };

                let updatedDetails : AgentDetails = {
                    id = existingAgent.details.id;
                    name = existingAgent.details.name;
                    ticker = existingAgent.details.ticker;
                    agentType = existingAgent.details.agentType;
                    shortPitch = existingAgent.details.shortPitch;
                    agentOverview = existingAgent.details.agentOverview;
                    framework = existingAgent.details.framework;
                    owner = existingAgent.details.owner;
                    tokenId = ?tokenId;
                    canisterId = ?canisterId;
                    launchType = existingAgent.details.launchType;
                    twitterUrl = existingAgent.details.twitterUrl;
                    websiteUrl = existingAgent.details.websiteUrl;
                    createdAt = existingAgent.details.createdAt;
                    imageUrl = existingAgent.details.imageUrl;
                    category = existingAgent.details.category;
                    tags = existingAgent.details.tags;
                };

                let updatedAgent : Agent = {
                    details = updatedDetails;
                    teamMembers = existingAgent.teamMembers;
                    tokenDistribution = existingAgent.tokenDistribution;
                    vestingSchedule = existingAgent.vestingSchedule;
                    revenueSplit = existingAgent.revenueSplit;
                    metrics = existingAgent.metrics;
                    launchDate = existingAgent.launchDate;
                    totalSupply = existingAgent.totalSupply;
                    saleCanisterId = existingAgent.saleCanisterId;
                };

                agents.put(agentId, updatedAgent);
                return #ok();
            };
        };
    };

    // Set sale canister ID for an agent
    public shared (msg) func setSaleCanister(agentId : AgentId, saleCanisterId : CanisterId) : async Result.Result<(), Text> {
        switch (agents.get(agentId)) {
            case (null) {
                return #err("Agent not found");
            };
            case (?existingAgent) {
                if (not isOwner(existingAgent, msg.caller)) {
                    return #err("Unauthorized: only the agent owner or registry owner can set the sale canister");
                };

                let updatedAgent : Agent = {
                    details = existingAgent.details;
                    teamMembers = existingAgent.teamMembers;
                    tokenDistribution = existingAgent.tokenDistribution;
                    vestingSchedule = existingAgent.vestingSchedule;
                    revenueSplit = existingAgent.revenueSplit;
                    metrics = existingAgent.metrics;
                    launchDate = existingAgent.launchDate;
                    totalSupply = existingAgent.totalSupply;
                    saleCanisterId = ?saleCanisterId;
                };

                agents.put(agentId, updatedAgent);
                return #ok();
            };
        };
    };

    // System upgrade hooks
    system func preupgrade() {
        agentEntries := Iter.toArray(agents.entries());
    };

    system func postupgrade() {
        agents := HashMap.fromIter<AgentId, Agent>(agentEntries.vals(), 10, Text.equal, Text.hash);
        agentEntries := [];
    };
};
