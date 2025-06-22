import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

declare global {
  interface Window {
    ic?: {
      plug?: {
        agent: HttpAgent;
        createActor: <T>(options: {
          canisterId: string;
          interfaceFactory: unknown;
        }) => T;
        requestConnect: (options?: {
          whitelist?: string[];
          host?: string;
          timeout?: number;
          onConnectionUpdate?: () => void;
        }) => Promise<boolean>;
        isConnected: () => Promise<boolean>;
        disconnect: () => Promise<void>;
        createAgent: (options?: {
          whitelist: string[];
          host?: string;
        }) => Promise<void>;
        getPrincipal: () => Promise<Principal>;
        getAccountId: () => Promise<string>;
        principalId: string;
        accountId: string;
        onConnectionUpdate: (callback: () => void) => void;
      };
    };
  }
}
