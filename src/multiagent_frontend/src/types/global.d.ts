import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

declare global {
  interface Window {
    ic?: {
      plug?: {
        agent: HttpAgent;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        createActor: <T>(options: {
          canisterId: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          interfaceFactory: any;
        }) => T;
        requestConnect: (options?: {
          whitelist?: string[];
          host?: string;
          timeout?: number;
          onConnectionUpdate?: () => void;
        }) => Promise<unknown>;
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
        onExternalDisconnect: (callback: () => void) => void;
        onLockStateChange: (callback: (isLocked: boolean) => void) => void;
        isWalletLocked: boolean;
      };
    };
  }
}
