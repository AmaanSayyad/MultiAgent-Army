import { useContext } from "react";
import { WalletContext, WalletContextType } from "../lib/wallet-context-types";

// Export the hook from a separate file
export const useWallet = (): WalletContextType => useContext(WalletContext);
