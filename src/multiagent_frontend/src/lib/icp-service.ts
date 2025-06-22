import { Actor, HttpAgent, ActorSubclass } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { CANISTERS, HOST } from "./config";
import { Agent } from "./types";

// Define a simpler interface factory type that works with our code
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InterfaceFactory = any;

/**
 * ICPServiceClass - Core service for Internet Computer Protocol interactions
 *
 * This class provides central authentication and connection services for the ICP,
 * as well as functionality that doesn't fit into more specialized services.
 */
class ICPServiceClass {
  private agent: HttpAgent | null = null;

  constructor() {
    // Agent will be initialized on demand when needed
  }

  /**
   * Get or create the HttpAgent used for ICP interactions
   */
  async getAgent(): Promise<HttpAgent> {
    if (!this.agent) {
      // Create a new agent
      this.agent = new HttpAgent({
        host: HOST,
      });

      // In development, we need to fetch the root key
      if (process.env.DFX_NETWORK !== "ic") {
        try {
          await this.agent.fetchRootKey();
        } catch (err) {
          console.warn(
            "Unable to fetch root key. Check if your local replica is running"
          );
          console.error(err);
        }
      }
    }

    return this.agent;
  }

  /**
   * Creates an actor for the specified canister
   *
   * @param canisterId The ID of the canister
   * @param idlFactory The IDL factory for the canister
   * @returns The actor instance
   */
  async createActor<T>(
    canisterId: string,
    idlFactory: InterfaceFactory
  ): Promise<ActorSubclass<T>> {
    const agent = await this.getAgent();
    return Actor.createActor<T>(idlFactory, {
      agent,
      canisterId,
    });
  }

  /**
   * Reset the agent, useful when authentication state changes
   */
  resetAgent(): void {
    this.agent = null;
  }

  /**
   * Check if the agent is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const agent = await this.getAgent();
      const principal = await agent.getPrincipal();
      return !principal.isAnonymous();
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }

  /**
   * Get the current user's principal
   */
  async getPrincipal(): Promise<Principal | null> {
    try {
      const agent = await this.getAgent();
      const principal = await agent.getPrincipal();
      return principal.isAnonymous() ? null : principal;
    } catch (error) {
      console.error("Error getting principal:", error);
      return null;
    }
  }
}

// Create a singleton instance
export const ICPService = new ICPServiceClass();

// DEPRECATED: Mock agent registry export for backwards compatibility
// This will be removed once all code is migrated to use the agent-registry-service.ts module
export const agentRegistry = {
  getAllAgents: async (): Promise<Agent[]> => {
    return [
      {
        id: "example-agent-1",
        name: "Example Agent 1",
        description: "This is an example agent",
        owner: "Example Owner",
        token: "EXT1",
        canister: "rrkah-fqaaa-aaaaa-aaaaq-cai",
        category: "AI",
        tags: ["ai", "assistant"],
        createdAt: new Date().toISOString(),
        imageUrl: "https://via.placeholder.com/150",
        tokenDistribution: {
          builder: 40,
          publicSale: 30,
          platform: 20,
          stakers: 10,
        },
        revenueSplit: {
          builder: 70,
          stakers: 20,
          treasury: 10,
        },
        metrics: {
          totalUsers: 100,
          totalUsage: 500,
          totalRevenue: 1000,
          stakingApr: 5.5,
        },
      },
      {
        id: "example-agent-2",
        name: "Example Agent 2",
        description: "Another example agent",
        owner: "Example Owner",
        token: "EXT2",
        canister: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        category: "ML",
        tags: ["ml", "data"],
        createdAt: new Date().toISOString(),
        imageUrl: "https://via.placeholder.com/150",
        tokenDistribution: {
          builder: 35,
          publicSale: 35,
          platform: 20,
          stakers: 10,
        },
        revenueSplit: {
          builder: 65,
          stakers: 25,
          treasury: 10,
        },
        metrics: {
          totalUsers: 80,
          totalUsage: 400,
          totalRevenue: 800,
          stakingApr: 4.5,
        },
      },
    ];
  },

  getAgentById: async (id: string): Promise<Agent> => {
    return {
      id,
      name: `Agent ${id}`,
      description: "This is an example agent details",
      owner: "Example Owner",
      token: "EXT1",
      canister: "rrkah-fqaaa-aaaaa-aaaaq-cai",
      category: "AI",
      tags: ["ai", "assistant"],
      createdAt: new Date().toISOString(),
      imageUrl: "https://via.placeholder.com/150",
      tokenDistribution: {
        builder: 40,
        publicSale: 30,
        platform: 20,
        stakers: 10,
      },
      revenueSplit: {
        builder: 70,
        stakers: 20,
        treasury: 10,
      },
      metrics: {
        totalUsers: 100,
        totalUsage: 500,
        totalRevenue: 1000,
        stakingApr: 5.5,
      },
    };
  },
};
