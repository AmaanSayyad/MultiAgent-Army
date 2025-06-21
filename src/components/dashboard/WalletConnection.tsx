import React, { useState } from "react";

interface WalletConnectionProps {
  onConnect: (
    walletType: "internet-identity" | "plug",
    principalId: string
  ) => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ onConnect }) => {
  const [connecting, setConnecting] = useState(false);

  const handleConnectII = async () => {
    setConnecting(true);
    try {
      // Simulating connection to Internet Identity
      // In a real implementation, this would integrate with the II SDK
      setTimeout(() => {
        const mockPrincipalId =
          "x4zp3-kxh7s-cikzm-qbvoh-wfpji-iffax-jj4rn-k54ue-g7jqo-xalcl-zqe";
        onConnect("internet-identity", mockPrincipalId);
        setConnecting(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to connect to Internet Identity:", error);
      setConnecting(false);
    }
  };

  const handleConnectPlug = async () => {
    setConnecting(true);
    try {
      // Simulating connection to Plug Wallet
      // In a real implementation, this would integrate with the Plug SDK
      setTimeout(() => {
        const mockPrincipalId = "tvmvt-piaaa-aaaaa-aabzq-cai";
        onConnect("plug", mockPrincipalId);
        setConnecting(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to connect to Plug Wallet:", error);
      setConnecting(false);
    }
  };

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
          disabled={connecting}
          className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] text-white p-4 rounded-xl flex items-center justify-between transition-colors"
        >
          <div className="flex items-center">
            <img
              src="https://internetcomputer.org/img/IC-logo.svg"
              alt="Internet Identity"
              className="w-8 h-8 mr-3"
            />
            <span className="font-medium">Internet Identity</span>
          </div>
          {connecting && <span className="animate-pulse">Connecting...</span>}
        </button>

        <button
          onClick={handleConnectPlug}
          disabled={connecting}
          className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] text-white p-4 rounded-xl flex items-center justify-between transition-colors"
        >
          <div className="flex items-center">
            <img
              src="https://plugwallet.ooo/assets/images/plug-logo.svg"
              alt="Plug Wallet"
              className="w-8 h-8 mr-3"
            />
            <span className="font-medium">Plug Wallet</span>
          </div>
          {connecting && <span className="animate-pulse">Connecting...</span>}
        </button>
      </div>
    </div>
  );
};

export default WalletConnection;
