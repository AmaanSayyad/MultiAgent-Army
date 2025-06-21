// This file simulates backend services that would interact with the Internet Computer blockchain
// In a real implementation, these would be replaced with actual API calls to canisters
import { Agent } from "./types";

export interface AgentDeploymentParams {
  name: string;
  description: string;
  category: string;
  tags: string[];
  type: "template" | "custom" | "api";
  templateId?: string;
  customCode?: string;
  apiEndpoint?: string;
}

export interface TokenConfig {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: string;
}

export interface TokenDistribution {
  builder: number;
  publicSale: number;
  platform: number;
  stakers: number;
}

export interface TokenSale {
  enabled: boolean;
  price: string;
  softCap: string;
  hardCap: string;
  startDate: string;
  endDate: string;
  minPurchase: string;
  maxPurchase: string;
  whitelist: boolean;
  refundType: "refund" | "partial" | "burn";
}

export interface RevenueSplit {
  builder: number;
  stakers: number;
  treasury: number;
}

export interface DeploymentResult {
  success: boolean;
  agentCanisterId?: string;
  tokenCanisterId?: string;
  saleCanisterId?: string;
  txHash?: string;
  error?: string;
}

// Mock registry of deployed agents
export const agentRegistry: Agent[] = [
  {
    id: "xor7x-eiaaa-aaaaa-qaada-cai",
    name: "ChatAssistant",
    description:
      "An AI-powered chat assistant that can engage in natural language conversations.",
    owner: "x4zp3-kxh7s-cikzm-qbvoh-wfpji-iffax-jj4rn-k54ue-g7jqo-xalcl-zqe",
    token: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    canister: "rdmx6-jaaaa-aaaaa-aaadq-cai",
    category: "Utility",
    tags: ["chat", "assistant", "support"],
    createdAt: "2025-05-15T14:30:00Z",
    imageUrl:
      "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=2748&auto=format&fit=crop",
    tokenDistribution: {
      builder: 30,
      publicSale: 40,
      platform: 5,
      stakers: 25,
    },
    revenueSplit: {
      builder: 70,
      stakers: 20,
      treasury: 10,
    },
    metrics: {
      totalUsers: 1253,
      totalUsage: 28756,
      totalRevenue: 1437.5,
      stakingApr: 12.6,
    },
  },
  {
    id: "qoctq-giaaa-aaaaa-aaaea-cai",
    name: "DataAnalyzer",
    description:
      "An agent that specializes in processing and analyzing data sets to extract insights.",
    owner: "tvmvt-piaaa-aaaaa-aabzq-cai",
    token: "renrk-eyaaa-aaaaa-aaada-cai",
    canister: "qaa6y-5yaaa-aaaaa-aaafa-cai",
    category: "Data",
    tags: ["analytics", "data", "insights"],
    createdAt: "2025-05-20T09:15:00Z",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop",
    tokenDistribution: {
      builder: 40,
      publicSale: 35,
      platform: 5,
      stakers: 20,
    },
    revenueSplit: {
      builder: 75,
      stakers: 15,
      treasury: 10,
    },
    metrics: {
      totalUsers: 487,
      totalUsage: 3215,
      totalRevenue: 9645,
      stakingApr: 18.4,
    },
  },
  {
    id: "jzg5e-hiaaa-aaaaa-aaagq-cai",
    name: "ScheduleBot",
    description:
      "Automated scheduling and calendar management agent that coordinates meetings and events.",
    owner: "x4zp3-kxh7s-cikzm-qbvoh-wfpji-iffax-jj4rn-k54ue-g7jqo-xalcl-zqe",
    token: "utozz-siaaa-aaaar-qaama-cai",
    canister: "qoctq-giaaa-aaaaa-aaaea-cai",
    category: "Productivity",
    tags: ["calendar", "scheduling", "automation"],
    createdAt: "2025-06-01T11:45:00Z",
    imageUrl:
      "https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=2748&auto=format&fit=crop",
    tokenDistribution: {
      builder: 35,
      publicSale: 40,
      platform: 5,
      stakers: 20,
    },
    revenueSplit: {
      builder: 70,
      stakers: 20,
      treasury: 10,
    },
    metrics: {
      totalUsers: 972,
      totalUsage: 12584,
      totalRevenue: 4532.25,
      stakingApr: 14.8,
    },
  },
  {
    id: "h5aet-waaaa-aaaaa-qaada-cai",
    name: "ContentGen",
    description:
      "Creates various types of content, including blog posts, social media updates, and marketing copy.",
    owner: "tvmvt-piaaa-aaaaa-aabzq-cai",
    token: "jzg5e-hiaaa-aaaaa-aaagq-cai",
    canister: "rdmx6-jaaaa-aaaaa-aaadq-cai",
    category: "Content",
    tags: ["writing", "marketing", "creative"],
    createdAt: "2025-06-10T16:20:00Z",
    imageUrl:
      "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?q=80&w=2940&auto=format&fit=crop",
    tokenDistribution: {
      builder: 30,
      publicSale: 45,
      platform: 5,
      stakers: 20,
    },
    revenueSplit: {
      builder: 65,
      stakers: 25,
      treasury: 10,
    },
    metrics: {
      totalUsers: 1852,
      totalUsage: 24781,
      totalRevenue: 7432.5,
      stakingApr: 21.3,
    },
  },
  {
    id: "rrkah-fqaaa-aaaaa-aaaaq-cai",
    name: "ResearchAssistant",
    description:
      "Helps with information gathering, summarization, and synthesis of research materials.",
    owner: "x4zp3-kxh7s-cikzm-qbvoh-wfpji-iffax-jj4rn-k54ue-g7jqo-xalcl-zqe",
    token: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    canister: "qoctq-giaaa-aaaaa-aaaea-cai",
    category: "Research",
    tags: ["academic", "research", "information"],
    createdAt: "2025-06-15T10:10:00Z",
    imageUrl:
      "https://images.unsplash.com/photo-1567177662154-dfeb4c93b6ae?q=80&w=2940&auto=format&fit=crop",
    tokenDistribution: {
      builder: 25,
      publicSale: 50,
      platform: 5,
      stakers: 20,
    },
    revenueSplit: {
      builder: 70,
      stakers: 20,
      treasury: 10,
    },
    metrics: {
      totalUsers: 731,
      totalUsage: 8965,
      totalRevenue: 3578.75,
      stakingApr: 16.7,
    },
  },
];

// Simulated backend service
export const ICPService = {
  // Connect to wallet
  connectWallet: async (
    walletType: "internet-identity" | "plug"
  ): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return a mock principal ID
    return walletType === "internet-identity"
      ? "x4zp3-kxh7s-cikzm-qbvoh-wfpji-iffax-jj4rn-k54ue-g7jqo-xalcl-zqe"
      : "tvmvt-piaaa-aaaaa-aabzq-cai";
  },

  // Deploy agent canister
  deployAgent: async (params: AgentDeploymentParams): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Return a mock canister ID
    return "ryjl3-tyaaa-aaaaa-aaaba-cai";
  },

  // Create DIP-20 token
  createToken: async (config: TokenConfig): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return a mock token canister ID
    return "utozz-siaaa-aaaam-qaaxq-cai";
  },

  // Configure token distribution
  configureTokenomics: async (
    tokenCanisterId: string,
    distribution: TokenDistribution
  ): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return success
    return true;
  },

  // Set up token sale
  configureTokenSale: async (
    tokenCanisterId: string,
    saleConfig: TokenSale
  ): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Return a mock sale canister ID
    return "qoctq-giaaa-aaaaa-aaaea-cai";
  },

  // Configure revenue split
  configureRevenueSplit: async (
    agentCanisterId: string,
    splitConfig: RevenueSplit
  ): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Return success
    return true;
  },

  // Deploy everything at once
  deployFullAgent: async (
    agentParams: AgentDeploymentParams,
    tokenConfig: TokenConfig,
    distribution: TokenDistribution,
    saleConfig: TokenSale,
    splitConfig: RevenueSplit
  ): Promise<DeploymentResult> => {
    // Simulate API delay for a complex operation
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Return mock deployment results
    return {
      success: true,
      agentCanisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
      tokenCanisterId: "utozz-siaaa-aaaam-qaaxq-cai",
      saleCanisterId: "qoctq-giaaa-aaaaa-aaaea-cai",
      txHash:
        "0x7af11e6864a35aa33b3a3e5f90e33f0c4d3e6329ada21f976b4536a1fa7ce87e",
    };
  },

  // Get all agents from the registry
  getAllAgents: async (): Promise<Agent[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return agentRegistry;
  },

  // Get agent by ID
  getAgentById: async (id: string): Promise<Agent | null> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    return agentRegistry.find((agent) => agent.id === id) || null;
  },

  // Get trending agents
  getTrendingAgents: async (): Promise<Agent[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return [agentRegistry[3], agentRegistry[0], agentRegistry[2]]; // ContentGen, ChatAssistant, ScheduleBot
  },

  // Get top-earning agents
  getTopEarningAgents: async (): Promise<Agent[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return [agentRegistry[1], agentRegistry[3], agentRegistry[4]]; // DataAnalyzer, ContentGen, ResearchAssistant
  },

  // Get recently launched agents
  getRecentAgents: async (): Promise<Agent[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return [agentRegistry[4], agentRegistry[3], agentRegistry[2]]; // ResearchAssistant, ContentGen, ScheduleBot
  },

  // Stake tokens for an agent
  stakeTokens: async (agentId: string, amount: number): Promise<boolean> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful staking
    return true;
  },

  // Buy tokens in a token sale
  buyTokens: async (saleId: string, amount: number): Promise<boolean> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock successful purchase
    return true;
  },
};
