import React, { useState } from "react";

export const WalletConnectionNav: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState("0");
  const [showDialog, setShowDialog] = useState(false);

  const handleConnect = () => {
    // Simulate connection success
    setConnected(true);
    setBalance("10");
    setShowDialog(false);
  };

  return (
    <div className="flex items-center">
      {!connected ? (
        <button
          onClick={() => setShowDialog(true)}
          className="bg-[rgba(115,94,181,1)] hover:bg-[rgba(95,78,150,1)] transition-colors text-sm text-white font-medium px-4 py-2 rounded-full"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <div className="bg-[rgba(50,50,70,0.8)] text-white text-sm px-3 py-1 rounded-full flex items-center gap-1.5">
            <span>{balance} Pt</span>
          </div>
          <button className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full w-9 h-9 flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/0b6000a749298ca038f1f983ff63020d9a13eb63?placeholderIfAbsent=true"
              className="w-full h-full rounded-full object-cover"
              alt="Profile"
            />
          </button>
        </div>
      )}

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[rgba(30,30,40,0.95)] rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-xl font-bold">Connect Wallet</h3>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleConnect}
                className="w-full flex items-center gap-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors rounded-lg p-4"
              >
                <div className="bg-white rounded-full p-2 h-10 w-10 flex items-center justify-center">
                  <img
                    src="https://cryptologos.cc/logos/internet-computer-icp-logo.png"
                    alt="Internet Identity"
                    className="h-6"
                  />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-white font-medium">Internet Identity</h4>
                  <p className="text-gray-400 text-sm">
                    Connect using Internet Identity
                  </p>
                </div>
              </button>

              <button
                onClick={handleConnect}
                className="w-full flex items-center gap-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors rounded-lg p-4"
              >
                <div className="bg-white rounded-full p-2 h-10 w-10 flex items-center justify-center">
                  <img
                    src="https://docs.plugwallet.ooo/imgs/logo.svg"
                    alt="Plug Wallet"
                    className="h-6"
                  />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-white font-medium">Plug Wallet</h4>
                  <p className="text-gray-400 text-sm">
                    Connect using Plug Wallet
                  </p>
                </div>
              </button>
            </div>

            <p className="text-gray-400 text-xs mt-6 text-center">
              By connecting, you agree to the Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
