import { Principal } from "@dfinity/principal";
import { HttpAgent } from "@dfinity/agent";
import { createActor } from "../../../declarations/user_registry";
import { CANISTERS } from "./config";

// Import the actual types from the DID file
import type {
  UserProfile as DIDUserProfile,
  TokenHolding as DIDTokenHolding,
  Result,
  _SERVICE as UserRegistryActor,
} from "../../../declarations/user_registry/user_registry.did";

// Create a more user-friendly interface that converts optionals to nullables
export interface UserProfile {
  id: Principal;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: bigint;
  agents: string[];
  socialLinks: {
    twitter: string | null;
    github: string | null;
    discord: string | null;
  } | null;
  verifiedTwitter: boolean;
  verifiedWebsite: boolean;
}

export interface TokenHolding {
  tokenId: string;
  balance: bigint;
  staked: bigint;
}

// Helper functions to convert between DID optionals and nullables
const optionalToNullable = <T>(optional: [] | [T]): T | null => {
  return optional.length > 0 ? optional[0] : null;
};

const nullableToOptional = <T>(nullable: T | null): [] | [T] => {
  return nullable !== null ? [nullable] : [];
};

// Convert DID UserProfile to our UserProfile interface
const convertDIDUserProfile = (didProfile: DIDUserProfile): UserProfile => {
  return {
    id: didProfile.id,
    username: optionalToNullable(didProfile.username),
    displayName: optionalToNullable(didProfile.displayName),
    avatarUrl: optionalToNullable(didProfile.avatarUrl),
    createdAt: didProfile.createdAt,
    agents: didProfile.agents,
    socialLinks:
      didProfile.socialLinks.length > 0
        ? {
            twitter: optionalToNullable(didProfile.socialLinks[0].twitter),
            github: optionalToNullable(didProfile.socialLinks[0].github),
            discord: optionalToNullable(didProfile.socialLinks[0].discord),
          }
        : null,
    verifiedTwitter: didProfile.verifiedTwitter,
    verifiedWebsite: didProfile.verifiedWebsite,
  };
};

// Convert our UserProfile to DID UserProfile
const convertToDIDUserProfile = (profile: UserProfile): DIDUserProfile => {
  return {
    id: profile.id,
    username: nullableToOptional(profile.username),
    displayName: nullableToOptional(profile.displayName),
    avatarUrl: nullableToOptional(profile.avatarUrl),
    createdAt: profile.createdAt,
    agents: profile.agents,
    socialLinks: profile.socialLinks
      ? [
          {
            twitter: nullableToOptional(profile.socialLinks.twitter),
            github: nullableToOptional(profile.socialLinks.github),
            discord: nullableToOptional(profile.socialLinks.discord),
          },
        ]
      : [],
    verifiedTwitter: profile.verifiedTwitter,
    verifiedWebsite: profile.verifiedWebsite,
  };
};

class UserRegistryServiceImpl {
  private actor: UserRegistryActor | null = null;
  private canisterId: string;

  constructor(canisterId: string) {
    this.canisterId = canisterId;
  }

  // Initialize the actor with an agent
  async initialize(agent: HttpAgent): Promise<void> {
    try {
      console.log("Initializing user registry service with agent:", agent);

      // FORCE using the hardcoded USER_REGISTRY canister ID to avoid any confusion
      const USER_REGISTRY_CANISTER_ID = "by6od-j4aaa-aaaaa-qaadq-cai";

      console.log(
        "FORCED USER_REGISTRY canister ID:",
        USER_REGISTRY_CANISTER_ID
      );

      this.actor = createActor(USER_REGISTRY_CANISTER_ID, { agent });
      this.canisterId = USER_REGISTRY_CANISTER_ID; // Update the stored canister ID

      console.log(
        "User registry service initialized successfully with canister:",
        this.canisterId
      );
    } catch (error) {
      console.error("Failed to initialize user registry actor:", error);
      throw error;
    }
  }

  // Create or update user profile
  async updateProfile(
    profile: UserProfile
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.actor) {
      throw new Error("UserRegistry actor not initialized");
    }

    try {
      console.log("=== PROFILE UPDATE DEBUG ===");
      console.log("Current canister ID:", this.canisterId);
      console.log(
        "Expected USER_REGISTRY canister ID: by6od-j4aaa-aaaaa-qaadq-cai"
      );
      console.log(
        "Is using correct canister?",
        this.canisterId === "by6od-j4aaa-aaaaa-qaadq-cai"
      );
      console.log(
        `Attempting to update profile for user ${profile.id.toString()}`
      );
      console.log("=== END DEBUG ===");

      const didProfile = convertToDIDUserProfile(profile);
      const result = await this.actor.updateProfile(didProfile);

      if ("ok" in result) {
        return { success: true };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      console.error("Canister ID that failed:", this.canisterId);
      return { success: false, error: String(error) };
    }
  }

  // Get user profile
  async getProfile(userId: Principal): Promise<UserProfile | null> {
    if (!this.actor) {
      throw new Error("UserRegistry actor not initialized");
    }

    try {
      console.log("=== GET PROFILE DEBUG ===");
      console.log("Current canister ID:", this.canisterId);
      console.log(
        "Expected USER_REGISTRY canister ID: by6od-j4aaa-aaaaa-qaadq-cai"
      );
      console.log(
        "Is using correct canister?",
        this.canisterId === "by6od-j4aaa-aaaaa-qaadq-cai"
      );
      console.log(`Attempting to get profile for user ${userId.toString()}`);
      console.log("Actor available:", !!this.actor);
      console.log("=== END DEBUG ===");

      const result = await this.actor.getProfile(userId);

      console.log("Profile fetch result:", result);

      if (result.length > 0) {
        const profile = convertDIDUserProfile(result[0]);
        console.log("Converted profile:", profile);
        return profile;
      }

      console.log("No profile found for user:", userId.toString());
      return null;
    } catch (error) {
      console.error("Failed to get profile:", error);
      console.error("Canister ID that failed:", this.canisterId);
      console.error("User ID that failed:", userId.toString());
      return null;
    }
  }

  // Get user token holdings
  async getUserTokens(userId: Principal): Promise<TokenHolding[]> {
    if (!this.actor) {
      throw new Error("UserRegistry actor not initialized");
    }

    try {
      const result = await this.actor.getUserTokens(userId);
      return result.map((token) => ({
        tokenId: token.tokenId,
        balance: token.balance,
        staked: token.staked,
      }));
    } catch (error) {
      console.error("Failed to get user tokens:", error);
      return [];
    }
  }

  // Add agent to user's profile
  async addUserAgent(
    userId: Principal,
    agentId: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.actor) {
      throw new Error("UserRegistry actor not initialized");
    }

    try {
      const result = await this.actor.addUserAgent(userId, agentId);

      if ("ok" in result) {
        return { success: true };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error("Failed to add user agent:", error);
      return { success: false, error: String(error) };
    }
  }

  // Remove agent from user's profile
  async removeUserAgent(
    userId: Principal,
    agentId: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.actor) {
      throw new Error("UserRegistry actor not initialized");
    }

    try {
      const result = await this.actor.removeUserAgent(userId, agentId);

      if ("ok" in result) {
        return { success: true };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error("Failed to remove user agent:", error);
      return { success: false, error: String(error) };
    }
  }

  // Verify Twitter account
  async verifyTwitter(
    twitterHandle: string,
    proof: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.actor) {
      throw new Error("UserRegistry actor not initialized");
    }

    try {
      const result = await this.actor.verifyTwitter(twitterHandle, proof);

      if ("ok" in result) {
        return { success: true };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error("Failed to verify Twitter:", error);
      return { success: false, error: String(error) };
    }
  }

  // Verify website
  async verifyWebsite(
    domain: string,
    proof: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.actor) {
      throw new Error("UserRegistry actor not initialized");
    }

    try {
      const result = await this.actor.verifyWebsite(domain, proof);

      if ("ok" in result) {
        return { success: true };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error("Failed to verify website:", error);
      return { success: false, error: String(error) };
    }
  }
}

// Create a singleton instance with hardcoded canister ID to avoid any confusion
const USER_REGISTRY_CANISTER_ID = "by6od-j4aaa-aaaaa-qaadq-cai";
export const userRegistryService = new UserRegistryServiceImpl(
  USER_REGISTRY_CANISTER_ID
);

// Force reinitialize function for debugging
export const forceReinitializeRegistry = async (agent: HttpAgent) => {
  console.log("Force reinitializing user registry service");
  // Create a new instance with the correct canister ID
  const correctCanisterId = "by6od-j4aaa-aaaaa-qaadq-cai";
  console.log("Using hardcoded canister ID:", correctCanisterId);

  // Since we can't access private fields, we'll initialize a new service
  // and replace the global export
  const newService = new UserRegistryServiceImpl(correctCanisterId);
  await newService.initialize(agent);

  // Return the new service for immediate use
  console.log(
    "Created new user registry service with canister ID:",
    correctCanisterId
  );
  return newService;
};

// Log the canister ID being used for debugging
console.log(
  "User Registry Service initialized with hardcoded canister ID:",
  USER_REGISTRY_CANISTER_ID
);

export default userRegistryService;
