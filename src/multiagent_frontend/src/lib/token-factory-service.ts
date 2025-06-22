import { Principal } from "@dfinity/principal";
import { HttpAgent } from "@dfinity/agent";
import { createActor } from "../../../declarations/token_factory";
import { CANISTERS } from "./config";

// Import the actual types from the DID file
import type {
  TokenId,
  TokenConfig as DIDTokenConfig,
  TokenDistribution as DIDTokenDistribution,
  VestingSchedule as DIDVestingSchedule,
  TokenInfo as DIDTokenInfo,
  Result,
  _SERVICE as TokenFactoryActor,
} from "../../../declarations/token_factory/token_factory.did";

// Frontend-friendly interfaces
export interface TokenConfig {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  owner: Principal;
  fee: bigint;
}

export interface TokenDistribution {
  developer: number; // as decimal (0.5 for 50%)
  publicSale: number; // as decimal (0.375 for 37.5%)
  liquidityPool: number; // as decimal (0.125 for 12.5%)
}

export interface VestingSchedule {
  developerMonths: bigint;
  publicSaleMonths: bigint;
  liquidityPoolMonths: bigint;
}

export interface TokenInfo {
  id: string;
  canisterId: string;
  config: {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: bigint;
    owner: Principal;
  };
  agentId: string | null;
  distribution: TokenDistribution | null;
  vestingSchedule: VestingSchedule | null;
  createdAt: bigint;
}

// Helper functions to convert between DID optionals and nullables
const optionalToNullable = <T>(optional: [] | [T]): T | null => {
  return optional.length > 0 ? optional[0] : null;
};

const nullableToOptional = <T>(nullable: T | null): [] | [T] => {
  return nullable !== null ? [nullable] : [];
};

// Convert DID TokenInfo to our TokenInfo interface
const convertDIDTokenInfo = (didTokenInfo: DIDTokenInfo): TokenInfo => {
  return {
    id: didTokenInfo.id,
    canisterId: didTokenInfo.canisterId,
    config: {
      name: didTokenInfo.config.name,
      symbol: didTokenInfo.config.symbol,
      decimals: Number(didTokenInfo.config.decimals),
      totalSupply: didTokenInfo.config.totalSupply,
      owner: didTokenInfo.config.owner,
    },
    agentId: optionalToNullable(didTokenInfo.agentId),
    distribution: optionalToNullable(didTokenInfo.distribution),
    vestingSchedule: optionalToNullable(didTokenInfo.vestingSchedule),
    createdAt: didTokenInfo.createdAt,
  };
};

class TokenFactoryServiceImpl {
  private actor: TokenFactoryActor | null = null;
  private canisterId: string;

  constructor(canisterId: string) {
    this.canisterId = canisterId;
  }

  // Initialize the actor with an agent
  async initialize(agent: HttpAgent): Promise<void> {
    try {
      console.log("Initializing token factory service with agent:", agent);

      // Force using the correct canister ID from the environment or hardcoded value
      const correctCanisterId =
        process.env.CANISTER_ID_TOKEN_FACTORY || "bw4dl-smaaa-aaaaa-qaacq-cai";

      // Override the canisterId to ensure we're using the correct one
      this.canisterId = correctCanisterId;

      console.log("Using TOKEN_FACTORY canister ID:", this.canisterId);

      this.actor = createActor(this.canisterId, { agent });
      console.log("Token factory service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize token factory actor:", error);
      throw error;
    }
  }

  // Create a new token
  async createToken(
    config: TokenConfig,
    agentId: string | null,
    distribution: TokenDistribution | null,
    vestingSchedule: VestingSchedule | null
  ): Promise<{ success: boolean; tokenId?: string; error?: string }> {
    if (!this.actor) {
      return { success: false, error: "Token factory actor not initialized" };
    }

    try {
      const result = await this.actor.createToken(
        config,
        nullableToOptional(agentId),
        nullableToOptional(distribution),
        nullableToOptional(vestingSchedule)
      );

      if ("ok" in result) {
        return { success: true, tokenId: result.ok };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error("Error creating token:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Get token information
  async getToken(tokenId: string): Promise<TokenInfo | null> {
    if (!this.actor) {
      return null;
    }

    try {
      const tokenInfo = await this.actor.getToken(tokenId);
      return tokenInfo ? convertDIDTokenInfo(tokenInfo[0]) : null;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  // Get all tokens
  async getAllTokens(): Promise<TokenInfo[]> {
    if (!this.actor) {
      return [];
    }

    try {
      const tokens = await this.actor.getAllTokens();
      return tokens.map(convertDIDTokenInfo);
    } catch (error) {
      console.error("Error getting all tokens:", error);
      return [];
    }
  }

  // Get tokens by owner
  async getTokensByOwner(owner: Principal): Promise<TokenInfo[]> {
    if (!this.actor) {
      return [];
    }

    try {
      const tokens = await this.actor.getTokensByOwner(owner);
      return tokens.map(convertDIDTokenInfo);
    } catch (error) {
      console.error("Error getting tokens by owner:", error);
      return [];
    }
  }

  // Get token by agent ID
  async getTokenByAgent(agentId: string): Promise<TokenInfo | null> {
    if (!this.actor) {
      return null;
    }

    try {
      const tokenInfo = await this.actor.getTokenByAgent(agentId);
      return tokenInfo ? convertDIDTokenInfo(tokenInfo[0]) : null;
    } catch (error) {
      console.error("Error getting token by agent:", error);
      return null;
    }
  }
}

// Create singleton instance
const tokenFactoryService = new TokenFactoryServiceImpl(
  CANISTERS.TOKEN_FACTORY
);

export default tokenFactoryService;
export { TokenFactoryServiceImpl };
