// This file provides easy access to environment variables for use across the application

// Canister IDs
export const CANISTERS = {
  USER_REGISTRY:
    process.env.CANISTER_ID_USER_REGISTRY || "by6od-j4aaa-aaaaa-qaadq-cai",
  TOKEN_FACTORY:
    process.env.CANISTER_ID_TOKEN_FACTORY || "bw4dl-smaaa-aaaaa-qaacq-cai",
  TOKEN: process.env.CANISTER_ID_TOKEN || "be2us-64aaa-aaaaa-qaabq-cai",
  INTERNET_IDENTITY:
    process.env.CANISTER_ID_INTERNET_IDENTITY || "avqkn-guaaa-aaaaa-qaaea-cai",
  AGENT_REGISTRY:
    process.env.CANISTER_ID_AGENT_REGISTRY || "br5f7-7uaaa-aaaaa-qaaca-cai",
  LAUNCHPAD: process.env.CANISTER_ID_LAUNCHPAD || "b77ix-eeaaa-aaaaa-qaada-cai",
  ARMY_TOKEN:
    process.env.CANISTER_ID_ARMY_TOKEN || "bkyz2-fmaaa-aaaaa-qaaaq-cai",
};

// Network
export const NETWORK = {
  DFX_NETWORK: process.env.DFX_NETWORK || "local",
};

// Host
export const HOST =
  process.env.DFX_NETWORK === "local"
    ? "http://localhost:4943"
    : "https://ic0.app";

// Helper function to check if we're running in development mode
export const isDevelopment = () => {
  return NETWORK.DFX_NETWORK === "local";
};

// Export a utility to build actor URLs
export const getCanisterUrl = (canisterId: string) => {
  return `${HOST}/${canisterId}`;
};
