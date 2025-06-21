// Agent type definitions
export interface TokenDistribution {
  builder: number;
  publicSale: number;
  platform: number;
  stakers: number;
}

export interface RevenueSplit {
  builder: number;
  stakers: number;
  treasury: number;
}

export interface Metrics {
  totalUsers: number;
  totalUsage: number;
  totalRevenue: number;
  stakingApr: number;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  owner: string;
  token: string;
  canister: string;
  category: string;
  tags: string[];
  createdAt: string;
  imageUrl: string;
  tokenDistribution: TokenDistribution;
  revenueSplit: RevenueSplit;
  metrics: Metrics;
}

// Token type definitions
export interface Token {
  id: string;
  name: string;
  symbol: string;
  supply: string;
  decimals: string;
  price: number;
  marketCap: string;
  change24h: string;
  volume24h: string;
  holders: number;
  stakers: number;
}

// Simplified token for UI display
export interface TokenCard {
  name: string;
  symbol: string;
  marketCap: string;
  change: string;
  changeColor: string;
  backgroundColor: string;
  logoUrl: string;
  socialCount: string;
  badges?: Badge[];
  hasLogo: boolean;
  isImage?: boolean;
  imageUrl?: string;
}

export interface Badge {
  type: "trending" | "new" | "hot";
  value: string;
  color: string;
}

// Token sale definitions
export interface TokenSale {
  id: string;
  token: string;
  price: string;
  raised: string;
  hardCap: string;
  softCap: string;
  progress: number;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "ended" | "successful" | "failed";
}

// User profile
export interface UserProfile {
  principal: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  agents: string[]; // agent IDs
  tokens: UserToken[];
}

export interface UserToken {
  id: string;
  balance: string;
  staked: string;
}
