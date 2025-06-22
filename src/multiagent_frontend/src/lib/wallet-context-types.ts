import { createContext } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { UserProfile } from "./user-registry-service";

// Define the type for our context
export interface WalletContextType {
  isConnected: boolean;
  principalId: string | null;
  accountId: string | null;
  walletType: "internet-identity" | "plug" | null;
  authClient: AuthClient | null;
  agent: HttpAgent | null;
  connectInternetIdentity: () => Promise<void>;
  connectPlug: (whitelist?: string[]) => Promise<void>;
  disconnect: () => Promise<void>;
  isPlugDetected: boolean;
  userProfile: UserProfile | null;
  isLoadingProfile: boolean;
  updateUserProfile: (
    updates: Partial<UserProfile>
  ) => Promise<{ success: boolean; error?: string }>;
  refreshUserProfile: () => Promise<void>;
}

// Create the context with default values
export const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  principalId: null,
  accountId: null,
  walletType: null,
  authClient: null,
  agent: null,
  connectInternetIdentity: async () => {},
  connectPlug: async () => {},
  disconnect: async () => {},
  isPlugDetected: false,
  userProfile: null,
  isLoadingProfile: false,
  updateUserProfile: async () => ({ success: false }),
  refreshUserProfile: async () => {},
});
