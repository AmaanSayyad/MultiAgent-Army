import { Principal } from "@dfinity/principal";
import { HttpAgent, Actor } from "@dfinity/agent";
import { createActor } from "../../../declarations/agent_registry";
import { CANISTERS } from "./config";

// Import the actual types from the DID file
import type {
  AgentDetails as DIDAgentDetails,
  TeamMember as DIDTeamMember,
  TokenDistribution as DIDTokenDistribution,
  VestingSchedule as DIDVestingSchedule,
  LaunchType,
  Result,
  _SERVICE as AgentRegistryActor,
} from "../../../declarations/agent_registry/agent_registry.did";

// Create interfaces that match the Motoko types
export interface AgentDetails {
  id: string;
  name: string;
  ticker: string;
  agentType: string;
  shortPitch: string;
  agentOverview: string;
  framework: string;
  owner: Principal;
  tokenId: string | null;
  canisterId: string | null;
  launchType: LaunchType;
  twitterUrl: string | null;
  websiteUrl: string | null;
  createdAt: bigint;
  imageUrl: string | null;
  category: string;
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string | null;
  bio: string | null;
  socialLinks: {
    twitter: string | null;
    github: string | null;
    linkedin: string | null;
  } | null;
  wallet: string | null;
  expertise: string[];
}

export interface TokenDistribution {
  developer: number;
  publicSale: number;
  liquidityPool: number;
}

export interface VestingSchedule {
  developerMonths: bigint;
  publicSaleMonths: bigint;
  liquidityPoolMonths: bigint;
}

export interface Agent {
  details: AgentDetails;
  teamMembers: TeamMember[];
  tokenDistribution: TokenDistribution | null;
  vestingSchedule: VestingSchedule | null;
  launchDate: bigint | null;
  totalSupply: bigint | null;
  saleCanisterId: string | null;
}

// Helper functions to convert between DID optionals and nullables
const optionalToNullable = <T>(optional: [] | [T]): T | null => {
  return optional.length > 0 ? optional[0] : null;
};

const nullableToOptional = <T>(nullable: T | null): [] | [T] => {
  return nullable !== null ? [nullable] : [];
};

// Convert DID AgentDetails to our AgentDetails interface
const convertDIDAgentDetails = (didDetails: DIDAgentDetails): AgentDetails => {
  return {
    id: didDetails.id,
    name: didDetails.name,
    ticker: didDetails.ticker,
    agentType: didDetails.agentType,
    shortPitch: didDetails.shortPitch,
    agentOverview: didDetails.agentOverview,
    framework: didDetails.framework,
    owner: didDetails.owner,
    tokenId: optionalToNullable(didDetails.tokenId),
    canisterId: optionalToNullable(didDetails.canisterId),
    launchType: didDetails.launchType,
    twitterUrl: optionalToNullable(didDetails.twitterUrl),
    websiteUrl: optionalToNullable(didDetails.websiteUrl),
    createdAt: didDetails.createdAt,
    imageUrl: optionalToNullable(didDetails.imageUrl),
    category: didDetails.category,
    tags: didDetails.tags,
  };
};

// Convert our AgentDetails to DID AgentDetails
const convertToDIDAgentDetails = (details: AgentDetails): DIDAgentDetails => {
  return {
    id: details.id,
    name: details.name,
    ticker: details.ticker,
    agentType: details.agentType,
    shortPitch: details.shortPitch,
    agentOverview: details.agentOverview,
    framework: details.framework,
    owner: details.owner,
    tokenId: nullableToOptional(details.tokenId),
    canisterId: nullableToOptional(details.canisterId),
    launchType: details.launchType,
    twitterUrl: nullableToOptional(details.twitterUrl),
    websiteUrl: nullableToOptional(details.websiteUrl),
    createdAt: details.createdAt,
    imageUrl: nullableToOptional(details.imageUrl),
    category: details.category,
    tags: details.tags,
  };
};

// Convert DID TeamMember to our TeamMember interface
const convertDIDTeamMember = (didMember: DIDTeamMember): TeamMember => {
  return {
    id: didMember.id,
    name: didMember.name,
    role: didMember.role,
    avatarUrl: optionalToNullable(didMember.avatarUrl),
    bio: optionalToNullable(didMember.bio),
    socialLinks:
      didMember.socialLinks.length > 0
        ? {
            twitter: optionalToNullable(didMember.socialLinks[0].twitter),
            github: optionalToNullable(didMember.socialLinks[0].github),
            linkedin: optionalToNullable(didMember.socialLinks[0].linkedin),
          }
        : null,
    wallet: optionalToNullable(didMember.wallet),
    expertise: didMember.expertise,
  };
};

// Convert our TeamMember to DID TeamMember
const convertToDIDTeamMember = (member: TeamMember): DIDTeamMember => {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    avatarUrl: nullableToOptional(member.avatarUrl),
    bio: nullableToOptional(member.bio),
    socialLinks: member.socialLinks
      ? [
          {
            twitter: nullableToOptional(member.socialLinks.twitter),
            github: nullableToOptional(member.socialLinks.github),
            linkedin: nullableToOptional(member.socialLinks.linkedin),
          },
        ]
      : [],
    wallet: nullableToOptional(member.wallet),
    expertise: member.expertise,
  };
};

class AgentRegistryServiceImpl {
  private actor: AgentRegistryActor | null = null;
  private canisterId: string;

  constructor(canisterId: string) {
    this.canisterId = canisterId;
  }

  // Initialize the actor with an agent
  async initialize(agent: HttpAgent): Promise<void> {
    try {
      console.log("Initializing agent registry service with agent:", agent);

      // FORCE using the hardcoded AGENT_REGISTRY canister ID to avoid any confusion
      const AGENT_REGISTRY_CANISTER_ID = "br5f7-7uaaa-aaaaa-qaaca-cai";

      console.log(
        "FORCED AGENT_REGISTRY canister ID:",
        AGENT_REGISTRY_CANISTER_ID
      );

      this.actor = createActor(AGENT_REGISTRY_CANISTER_ID, {
        agent,
      });
      this.canisterId = AGENT_REGISTRY_CANISTER_ID; // Update the stored canister ID

      console.log(
        "Agent registry service initialized successfully with canister:",
        this.canisterId
      );
    } catch (error) {
      console.error("Failed to initialize agent registry service:", error);
      throw error;
    }
  }

  // Create a new agent
  async createAgent(
    details: Omit<AgentDetails, "id" | "owner" | "createdAt">,
    teamMembers: Omit<TeamMember, "id">[],
    tokenDistribution: TokenDistribution | null,
    vestingSchedule: VestingSchedule | null,
    totalSupply: bigint | null,
    launchDate: bigint | null,
    principal: Principal
  ): Promise<{ success: boolean; agentId?: string; error?: string }> {
    if (!this.actor) {
      return { success: false, error: "Agent registry actor not initialized" };
    }

    try {
      console.log("=== CREATE AGENT DEBUG ===");
      console.log("Current canister ID:", this.canisterId);
      console.log(
        "Expected AGENT_REGISTRY canister ID: br5f7-7uaaa-aaaaa-qaaca-cai"
      );
      console.log(
        "Is using correct canister?",
        this.canisterId === "br5f7-7uaaa-aaaaa-qaaca-cai"
      );
      console.log(
        `Attempting to create agent for user ${principal.toString()}`
      );
      console.log("=== END DEBUG ===");

      // Create DID agent details
      const didDetails: DIDAgentDetails = {
        id: "", // Will be generated by the backend
        name: details.name,
        ticker: details.ticker,
        agentType: details.agentType,
        shortPitch: details.shortPitch,
        agentOverview: details.agentOverview,
        framework: details.framework,
        owner: principal,
        tokenId: nullableToOptional(details.tokenId),
        canisterId: nullableToOptional(details.canisterId),
        launchType: details.launchType,
        twitterUrl: nullableToOptional(details.twitterUrl),
        websiteUrl: nullableToOptional(details.websiteUrl),
        createdAt: BigInt(0), // Will be set by backend
        imageUrl: nullableToOptional(details.imageUrl),
        category: details.category,
        tags: details.tags,
      };

      // Convert team members
      const didTeamMembers: DIDTeamMember[] = teamMembers.map((member) => ({
        id: `member-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`,
        name: member.name,
        role: member.role,
        avatarUrl: nullableToOptional(member.avatarUrl),
        bio: nullableToOptional(member.bio),
        socialLinks: member.socialLinks
          ? [
              {
                twitter: nullableToOptional(member.socialLinks.twitter),
                github: nullableToOptional(member.socialLinks.github),
                linkedin: nullableToOptional(member.socialLinks.linkedin),
              },
            ]
          : [],
        wallet: nullableToOptional(member.wallet),
        expertise: member.expertise || [],
      }));

      // Convert token distribution
      const didTokenDistribution = tokenDistribution
        ? {
            developer: tokenDistribution.developer,
            publicSale: tokenDistribution.publicSale,
            liquidityPool: tokenDistribution.liquidityPool,
          }
        : null;

      // Convert vesting schedule
      const didVestingSchedule = vestingSchedule
        ? {
            developerMonths: vestingSchedule.developerMonths,
            publicSaleMonths: vestingSchedule.publicSaleMonths,
            liquidityPoolMonths: vestingSchedule.liquidityPoolMonths,
          }
        : null;

      const result = await this.actor.createAgent(
        didDetails,
        didTeamMembers,
        nullableToOptional(didTokenDistribution),
        nullableToOptional(didVestingSchedule),
        nullableToOptional(totalSupply),
        nullableToOptional(launchDate)
      );

      if ("ok" in result) {
        return { success: true, agentId: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error("Error creating agent:", error);
      console.error("Canister ID that failed:", this.canisterId);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Get agent by ID
  async getAgent(id: string): Promise<Agent | null> {
    if (!this.actor) {
      throw new Error("Agent registry actor not initialized");
    }

    try {
      const result = await this.actor.getAgent(id);

      if (!result.length) {
        return null;
      }

      const didAgent = result[0];

      return {
        details: convertDIDAgentDetails(didAgent.details),
        teamMembers: didAgent.teamMembers.map(convertDIDTeamMember),
        tokenDistribution: optionalToNullable(didAgent.tokenDistribution),
        vestingSchedule: optionalToNullable(didAgent.vestingSchedule),
        launchDate: optionalToNullable(didAgent.launchDate),
        totalSupply: optionalToNullable(didAgent.totalSupply),
        saleCanisterId: optionalToNullable(didAgent.saleCanisterId),
      };
    } catch (error) {
      console.error(`Error getting agent with ID ${id}:`, error);
      return null;
    }
  }

  // Get all agents
  async getAllAgents(): Promise<Agent[]> {
    if (!this.actor) {
      throw new Error("Agent registry actor not initialized");
    }

    try {
      const didAgents = await this.actor.getAllAgents();

      return didAgents.map((didAgent) => ({
        details: convertDIDAgentDetails(didAgent.details),
        teamMembers: didAgent.teamMembers.map(convertDIDTeamMember),
        tokenDistribution: optionalToNullable(didAgent.tokenDistribution),
        vestingSchedule: optionalToNullable(didAgent.vestingSchedule),
        launchDate: optionalToNullable(didAgent.launchDate),
        totalSupply: optionalToNullable(didAgent.totalSupply),
        saleCanisterId: optionalToNullable(didAgent.saleCanisterId),
      }));
    } catch (error) {
      console.error("Error getting all agents:", error);
      return [];
    }
  }

  // Get agents by owner
  async getAgentsByOwner(owner: Principal): Promise<Agent[]> {
    if (!this.actor) {
      throw new Error("Agent registry actor not initialized");
    }

    try {
      const didAgents = await this.actor.getAgentsByOwner(owner);

      return didAgents.map((didAgent) => ({
        details: convertDIDAgentDetails(didAgent.details),
        teamMembers: didAgent.teamMembers.map(convertDIDTeamMember),
        tokenDistribution: optionalToNullable(didAgent.tokenDistribution),
        vestingSchedule: optionalToNullable(didAgent.vestingSchedule),
        launchDate: optionalToNullable(didAgent.launchDate),
        totalSupply: optionalToNullable(didAgent.totalSupply),
        saleCanisterId: optionalToNullable(didAgent.saleCanisterId),
      }));
    } catch (error) {
      console.error(
        `Error getting agents for owner ${owner.toString()}:`,
        error
      );
      return [];
    }
  }
}

// Create a singleton instance with hardcoded canister ID to avoid any confusion
const AGENT_REGISTRY_CANISTER_ID = "br5f7-7uaaa-aaaaa-qaaca-cai";
export const agentRegistryService = new AgentRegistryServiceImpl(
  AGENT_REGISTRY_CANISTER_ID
);

// Log the canister ID being used for debugging
console.log(
  "Agent Registry Service initialized with hardcoded canister ID:",
  AGENT_REGISTRY_CANISTER_ID
);

// Export the service
export default agentRegistryService;
