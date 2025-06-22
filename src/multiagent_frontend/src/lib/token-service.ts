import { Principal } from "@dfinity/principal";
import { HttpAgent } from "@dfinity/agent";
import { createActor } from "../../../declarations/token";
import { CANISTERS } from "./config";

// Import the actual types from the DID file
import type {
  TxReceipt,
  VestingInfo,
  _SERVICE as TokenActor,
} from "../../../declarations/token/token.did";

class TokenServiceImpl {
  private actor: TokenActor | null = null;
  private canisterId: string;

  constructor(canisterId: string) {
    this.canisterId = canisterId;
  }

  // Initialize the actor with an agent
  async initialize(agent: HttpAgent): Promise<void> {
    try {
      console.log("Initializing token service with agent:", agent);

      // Force using the correct canister ID from the environment or hardcoded value
      const correctCanisterId =
        process.env.CANISTER_ID_TOKEN || "be2us-64aaa-aaaaa-qaabq-cai";

      // Override the canisterId to ensure we're using the correct one
      this.canisterId = correctCanisterId;

      console.log("Using TOKEN canister ID:", this.canisterId);

      this.actor = createActor(this.canisterId, { agent });
      console.log("Token service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize token actor:", error);
      throw error;
    }
  }

  // Get token balance
  async getBalance(principal: Principal): Promise<bigint> {
    if (!this.actor) {
      throw new Error("Token actor not initialized");
    }

    try {
      const balance = await this.actor.balanceOf(principal);
      return balance;
    } catch (error) {
      console.error(
        `Error getting balance for ${principal.toString()}:`,
        error
      );
      return BigInt(0);
    }
  }

  // Transfer tokens
  async transfer(
    to: Principal,
    amount: bigint
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.actor) {
      throw new Error("Token actor not initialized");
    }

    try {
      const result = await this.actor.transfer(to, amount);
      if ("Ok" in result) {
        return { success: true };
      } else {
        return { success: false, error: JSON.stringify(result.Err) };
      }
    } catch (error) {
      console.error("Error transferring tokens:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Get token symbol
  async getSymbol(): Promise<string> {
    if (!this.actor) {
      throw new Error("Token actor not initialized");
    }

    try {
      return await this.actor.symbol();
    } catch (error) {
      console.error("Error getting token symbol:", error);
      return "";
    }
  }

  // Get token name
  async getName(): Promise<string> {
    if (!this.actor) {
      throw new Error("Token actor not initialized");
    }

    try {
      return await this.actor.name();
    } catch (error) {
      console.error("Error getting token name:", error);
      return "";
    }
  }

  // Get token decimals
  async getDecimals(): Promise<number> {
    if (!this.actor) {
      throw new Error("Token actor not initialized");
    }

    try {
      return Number(await this.actor.decimals());
    } catch (error) {
      console.error("Error getting token decimals:", error);
      return 0;
    }
  }

  // Get total supply
  async getTotalSupply(): Promise<bigint> {
    if (!this.actor) {
      throw new Error("Token actor not initialized");
    }

    try {
      return await this.actor.totalSupply();
    } catch (error) {
      console.error("Error getting total supply:", error);
      return BigInt(0);
    }
  }

  // Stake tokens
  async stakeTokens(
    amount: bigint
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.actor) {
      throw new Error("Token actor not initialized");
    }

    try {
      const result = await this.actor.stake(amount);
      if ("Ok" in result) {
        return { success: true };
      } else {
        return { success: false, error: JSON.stringify(result.Err) };
      }
    } catch (error) {
      console.error("Error staking tokens:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Unstake tokens
  async unstakeTokens(
    amount: bigint
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.actor) {
      throw new Error("Token actor not initialized");
    }

    try {
      const result = await this.actor.unstake(amount);
      if ("Ok" in result) {
        return { success: true };
      } else {
        return { success: false, error: JSON.stringify(result.Err) };
      }
    } catch (error) {
      console.error("Error unstaking tokens:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Get staking stats
  async getStakingStats(): Promise<{
    stakersCount: bigint;
    totalStaked: bigint;
  }> {
    if (!this.actor) {
      throw new Error("Token actor not initialized");
    }

    try {
      const stats = await this.actor.getStakingStats();
      return {
        stakersCount: stats.stakersCount,
        totalStaked: stats.totalStaked,
      };
    } catch (error) {
      console.error("Error getting staking stats:", error);
      return { stakersCount: BigInt(0), totalStaked: BigInt(0) };
    }
  }
}

// Create a singleton instance
export const tokenService = new TokenServiceImpl(CANISTERS.TOKEN);

// Export the service
export default tokenService;
