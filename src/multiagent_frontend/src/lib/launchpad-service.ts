import { Principal } from "@dfinity/principal";
import { HttpAgent } from "@dfinity/agent";
import { createActor } from "../../../declarations/launchpad";
import { CANISTERS } from "./config";

// Import the actual types from the DID file
import type {
  SaleId,
  TokenId,
  AgentId,
  CanisterId,
  LaunchType,
  SaleStatus,
  TokenSale as DIDTokenSale,
  _SERVICE as LaunchpadActor,
} from "../../../declarations/launchpad/launchpad.did";

// Extended LaunchpadActor interface to include missing methods
interface ExtendedLaunchpadActor extends LaunchpadActor {
  pledgePoints: (
    saleId: string,
    amount: bigint
  ) => Promise<{ ok: null } | { err: string }>;
  getUserPointPledges: (
    saleId: string,
    principal: Principal
  ) => Promise<bigint>;
  claimTokens: (saleId: string) => Promise<{ ok: null } | { err: string }>;
}

// Frontend-friendly interfaces for Launchpad
export interface TokenSale {
  id: string;
  tokenId: string;
  agentId: string;
  launchType: "genesis" | "standard";
  price: bigint;
  softCap: bigint;
  hardCap: bigint;
  raised: bigint;
  startTime: bigint;
  endTime: bigint;
  minPurchase: bigint;
  maxPurchase: bigint;
  status: "upcoming" | "active" | "ended" | "successful" | "failed";
  participants: [Principal, bigint][]; // Array of [Principal, amount] tuples
  owner: Principal;
  armyRequired: bigint;
  progress?: number; // Calculated progress percentage (not in DID)
  pointsPledged?: bigint; // Total points pledged (not in DID)
}

export interface Commitment {
  user: Principal;
  amount: bigint;
  timestamp: bigint;
}

// Helper functions to convert DID types to frontend types
const convertLaunchType = (launchType: LaunchType): "genesis" | "standard" => {
  if ("genesis" in launchType) return "genesis";
  return "standard";
};

const convertSaleStatus = (
  status: SaleStatus
): "upcoming" | "active" | "ended" | "successful" | "failed" => {
  if ("upcoming" in status) return "upcoming";
  if ("active" in status) return "active";
  if ("ended" in status) return "ended";
  if ("successful" in status) return "successful";
  return "failed";
};

// Convert DID TokenSale to our TokenSale interface
const convertDIDTokenSale = (didSale: DIDTokenSale): TokenSale => {
  const sale: TokenSale = {
    id: didSale.id,
    tokenId: didSale.tokenId,
    agentId: didSale.agentId,
    launchType: convertLaunchType(didSale.launchType),
    price: didSale.price,
    softCap: didSale.softCap,
    hardCap: didSale.hardCap,
    raised: didSale.raised,
    startTime: didSale.startTime,
    endTime: didSale.endTime,
    minPurchase: didSale.minPurchase,
    maxPurchase: didSale.maxPurchase,
    status: convertSaleStatus(didSale.status),
    participants: didSale.participants,
    owner: didSale.owner,
    armyRequired: didSale.armyRequired,
  };

  // Calculate progress percentage
  sale.progress = Number(
    (BigInt(100) * sale.raised) / (sale.hardCap > 0n ? sale.hardCap : 1n)
  );

  return sale;
};

class LaunchpadServiceImpl {
  private actor: ExtendedLaunchpadActor | null = null;
  private canisterId: string;

  constructor(canisterId: string) {
    this.canisterId = canisterId;
  }

  // Initialize the actor with an agent
  async initialize(agent: HttpAgent): Promise<void> {
    try {
      console.log("Initializing launchpad service with agent:", agent);

      // Force using the correct canister ID from the environment or hardcoded value
      const correctCanisterId =
        process.env.CANISTER_ID_LAUNCHPAD || "b77ix-eeaaa-aaaaa-qaada-cai";

      // Override the canisterId to ensure we're using the correct one
      this.canisterId = correctCanisterId;

      console.log("Using LAUNCHPAD canister ID:", this.canisterId);

      // Cast to ExtendedLaunchpadActor to access the missing methods
      this.actor = createActor(this.canisterId, {
        agent,
      }) as unknown as ExtendedLaunchpadActor;
      console.log("Launchpad service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize launchpad actor:", error);
      throw error;
    }
  }

  // Get sale by ID
  async getSale(id: string): Promise<TokenSale | null> {
    if (!this.actor) {
      throw new Error("Launchpad actor not initialized");
    }

    try {
      const result = await this.actor.getSale(id);
      if (!result.length) {
        return null;
      }
      return convertDIDTokenSale(result[0]);
    } catch (error) {
      console.error(`Error getting sale with ID ${id}:`, error);
      return null;
    }
  }

  // Get all active sales
  async getActiveSales(): Promise<TokenSale[]> {
    if (!this.actor) {
      throw new Error("Launchpad actor not initialized");
    }

    try {
      const didSales = await this.actor.getActiveSales();
      return didSales.map(convertDIDTokenSale);
    } catch (error) {
      console.error("Error getting active sales:", error);
      return [];
    }
  }

  // Get sales by status
  async getSalesByStatus(
    status: "upcoming" | "active" | "ended" | "successful" | "failed"
  ): Promise<TokenSale[]> {
    if (!this.actor) {
      throw new Error("Launchpad actor not initialized");
    }

    try {
      let didStatus: SaleStatus;

      switch (status) {
        case "upcoming":
          didStatus = { upcoming: null };
          break;
        case "active":
          didStatus = { active: null };
          break;
        case "ended":
          didStatus = { ended: null };
          break;
        case "successful":
          didStatus = { successful: null };
          break;
        case "failed":
          didStatus = { failed: null };
          break;
        default:
          didStatus = { active: null };
      }

      const didSales = await this.actor.getSalesByStatus(didStatus);
      return didSales.map(convertDIDTokenSale);
    } catch (error) {
      console.error(`Error getting sales with status ${status}:`, error);
      return [];
    }
  }

  // Get sales by agent ID
  async getSales(): Promise<TokenSale[]> {
    if (!this.actor) {
      return [];
    }

    try {
      // Fetch all sales
      const activeSales = await this.actor.getSalesByStatus({ active: null });
      const upcomingSales = await this.actor.getSalesByStatus({
        upcoming: null,
      });
      const endedSales = await this.actor.getSalesByStatus({ ended: null });
      const successfulSales = await this.actor.getSalesByStatus({
        successful: null,
      });
      const failedSales = await this.actor.getSalesByStatus({ failed: null });

      // Combine all sales
      const allSales = [
        ...activeSales.map(convertDIDTokenSale),
        ...upcomingSales.map(convertDIDTokenSale),
        ...endedSales.map(convertDIDTokenSale),
        ...successfulSales.map(convertDIDTokenSale),
        ...failedSales.map(convertDIDTokenSale),
      ];

      return allSales;
    } catch (error) {
      console.error("Error fetching sales:", error);
      return [];
    }
  }

  // Create a new token sale
  async createSale(
    tokenId: string,
    agentId: string,
    isGenesis: boolean,
    price: bigint,
    hardCap: bigint,
    softCap: bigint,
    startTime: bigint,
    endTime: bigint,
    minPurchase: bigint,
    maxPurchase: bigint,
    armyRequired: bigint
  ): Promise<{ success: boolean; saleId?: string; error?: string }> {
    if (!this.actor) {
      return { success: false, error: "Launchpad actor not initialized" };
    }

    try {
      const launchType: LaunchType = isGenesis
        ? { genesis: null }
        : { standard: null };

      const result = await this.actor.createSale(
        tokenId,
        agentId,
        launchType,
        price,
        hardCap,
        softCap,
        startTime,
        endTime,
        minPurchase,
        maxPurchase,
        armyRequired
      );

      if ("ok" in result) {
        return { success: true, saleId: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error("Error creating sale:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Commit to genesis sale
  async commitToGenesisSale(
    saleId: string,
    amount: bigint
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.actor) {
      return { success: false, error: "Launchpad actor not initialized" };
    }

    try {
      const result = await this.actor.commitToGenesisSale(saleId, amount);

      if ("ok" in result) {
        return { success: true };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error(`Error committing to genesis sale ${saleId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Buy tokens in standard sale
  async buyTokens(
    saleId: string,
    amount: bigint
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.actor) {
      return { success: false, error: "Launchpad actor not initialized" };
    }

    try {
      const result = await this.actor.buyTokens(saleId, amount);

      if ("ok" in result) {
        return { success: true };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error(`Error buying tokens in sale ${saleId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Get user's commitments
  async getUserCommitments(
    principal: Principal
  ): Promise<{ saleId: string; amount: bigint }[]> {
    if (!this.actor) {
      throw new Error("Launchpad actor not initialized");
    }

    try {
      const commitments = await this.actor.getUserCommitments(principal);
      return commitments.map((commitment) => ({
        saleId: commitment[0],
        amount: commitment[1],
      }));
    } catch (error) {
      console.error(
        `Error getting commitments for user ${principal.toString()}:`,
        error
      );
      return [];
    }
  }

  // Finalize a sale
  async finalizeSale(
    saleId: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.actor) {
      return { success: false, error: "Launchpad actor not initialized" };
    }

    try {
      const result = await this.actor.finalizeSale(saleId);

      if ("ok" in result) {
        return { success: true };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error(`Error finalizing sale ${saleId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Cancel a sale
  async cancelSale(
    saleId: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.actor) {
      return { success: false, error: "Launchpad actor not initialized" };
    }

    try {
      const result = await this.actor.cancelSale(saleId);

      if ("ok" in result) {
        return { success: true };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error(`Error canceling sale ${saleId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Get sales by agent ID
  async getSalesByAgentId(agentId: string): Promise<TokenSale[]> {
    if (!this.actor) {
      return [];
    }

    try {
      // Fetch all sales
      const allSales = await this.getSales();

      // Filter by agent ID
      return allSales.filter((sale) => sale.agentId === agentId);
    } catch (error) {
      console.error(`Error fetching sales for agent ${agentId}:`, error);
      return [];
    }
  }

  // Pledge points to a sale
  async pledgePoints(
    saleId: string,
    amount: bigint
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.actor) {
      return { success: false, error: "Launchpad actor not initialized" };
    }

    try {
      const result = await this.actor.pledgePoints(saleId, amount);

      if ("ok" in result) {
        return { success: true };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error(`Error pledging points to sale ${saleId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Get user point pledges
  async getUserPointPledges(
    saleId: string,
    principal: Principal
  ): Promise<bigint> {
    if (!this.actor) {
      return 0n;
    }

    try {
      return await this.actor.getUserPointPledges(saleId, principal);
    } catch (error) {
      console.error(`Error getting point pledges:`, error);
      return 0n;
    }
  }

  // Claim tokens after successful sale
  async claimTokens(
    saleId: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.actor) {
      return { success: false, error: "Launchpad actor not initialized" };
    }

    try {
      // Check if sale is successful first
      const sale = await this.getSale(saleId);
      if (!sale) {
        return { success: false, error: "Sale not found" };
      }

      if (sale.status !== "successful") {
        return { success: false, error: "Sale is not successful" };
      }

      const result = await this.actor.claimTokens(saleId);

      if ("ok" in result) {
        return { success: true };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error(`Error claiming tokens from sale ${saleId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

// Create a singleton instance
export const launchpadService = new LaunchpadServiceImpl(CANISTERS.LAUNCHPAD);

// Export the service
export default launchpadService;
