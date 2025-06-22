import React from "react";
import { useWallet } from "@/hooks/use-wallet";

interface WalletConnectionProps {
  onConnect?: (
    walletType: "internet-identity" | "plug",
    principalId: string
  ) => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ onConnect }) => {
  const {
    isConnected,
    principalId,
    walletType,
    connectInternetIdentity,
    connectPlug,
    isPlugDetected,
  } = useWallet();

  // Generate avatar based on principal ID
  const getAvatarUrl = (id: string) => {
    if (!id) return "https://api.dicebear.com/9.x/pixel-art/svg?seed=anonymous";
    // Use a consistent slice of the principal ID as the seed
    const seed = id.replace(/-/g, "").substring(0, 10);
    return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`;
  };

  const handleConnectII = async () => {
    try {
      await connectInternetIdentity();
      if (onConnect && principalId) {
        onConnect("internet-identity", principalId);
      }
    } catch (error) {
      console.error("Failed to connect to Internet Identity:", error);
    }
  };

  const handleConnectPlug = async () => {
    try {
      // You can specify canister IDs that your app needs to interact with
      const whitelist = [
        // Add your canister IDs here
        // Example: "ryjl3-tyaaa-aaaaa-aaaba-cai"
      ];

      await connectPlug(whitelist);
      if (onConnect && principalId) {
        onConnect("plug", principalId);
      }
    } catch (error) {
      console.error("Failed to connect to Plug Wallet:", error);
    }
  };

  if (isConnected && principalId) {
    return (
      <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6 mb-6">
        <h3 className="text-white text-xl font-bold mb-4">Wallet Connected</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src={getAvatarUrl(principalId)}
              alt="User Avatar"
              className="w-full h-full"
            />
          </div>
          <div>
            <p className="text-white font-medium mb-1">
              {walletType === "internet-identity"
                ? "Internet Identity"
                : "Plug Wallet"}
            </p>
            <p className="text-gray-400 mb-1">
              Principal ID:
              <span className="text-xs ml-2 text-white">
                {principalId.substring(0, 10)}...
                {principalId.substring(principalId.length - 5)}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6 mb-6">
      <h3 className="text-white text-xl font-bold mb-4">Connect Your Wallet</h3>
      <p className="text-gray-400 mb-6">
        Connect your wallet to deploy agents, create tokens, and configure
        tokenomics on the Internet Computer.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleConnectII}
          className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] text-white p-4 rounded-xl flex items-center justify-between transition-colors"
        >
          <div className="flex items-center">
            <div className="relative w-8 h-8 mr-3 flex-shrink-0">
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <img
                  src="https://api.dicebear.com/9.x/pixel-art/svg?seed=internet-identity"
                  alt="Internet Identity"
                  className="w-full h-full"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <img
                  src="https://internetcomputer.org/img/IC-logo.svg"
                  alt="Internet Identity"
                  className="w-2 h-2"
                />
              </div>
            </div>
            <span className="font-medium">Internet Identity</span>
          </div>
        </button>

        <button
          onClick={handleConnectPlug}
          disabled={!isPlugDetected}
          className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] text-white p-4 rounded-xl flex items-center justify-between transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center">
            <div className="relative w-8 h-8 mr-3 flex-shrink-0">
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <img
                  src="https://api.dicebear.com/9.x/pixel-art/svg?seed=plug-wallet"
                  alt="Plug Wallet"
                  className="w-full h-full"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <img
                  src="https://plugwallet.ooo/assets/images/plug-logo.svg"
                  alt="Plug Wallet"
                  className="w-2 h-2"
                />
              </div>
            </div>
            <span className="font-medium">Plug Wallet</span>
          </div>
          {!isPlugDetected && (
            <span className="text-xs text-yellow-400">Not detected</span>
          )}
        </button>
      </div>

      {!isPlugDetected && (
        <p className="text-xs text-yellow-400 mt-3">
          Plug Wallet extension not detected.{" "}
          <a
            href="https://plugwallet.ooo/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Install Plug
          </a>{" "}
          to use this feature.
        </p>
      )}
    </div>
  );
};

export default WalletConnection;
