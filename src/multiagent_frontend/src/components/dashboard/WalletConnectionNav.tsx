import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "@/hooks/use-wallet";

const WalletConnectionNav: React.FC = () => {
  const {
    isConnected,
    principalId,
    accountId,
    walletType,
    connectInternetIdentity,
    connectPlug,
    disconnect,
    isPlugDetected,
  } = useWallet();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleConnectII = async () => {
    try {
      await connectInternetIdentity();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Failed to connect to Internet Identity:", error);
    }
  };

  const handleConnectPlug = async () => {
    try {
      // You can specify canister IDs that your app needs to interact with
      const whitelist: string[] = [
        // Add your canister IDs here
        // Example: "ryjl3-tyaaa-aaaaa-aaaba-cai"
      ];

      await connectPlug(whitelist);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Failed to connect to Plug Wallet:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  // Generate avatar based on principal ID
  const getAvatarUrl = (id: string) => {
    if (!id) return "https://api.dicebear.com/9.x/pixel-art/svg?seed=anonymous";
    // Use a consistent slice of the principal ID as the seed
    const seed = id.replace(/-/g, "").substring(0, 10);
    return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`;
  };

  // Format the principal ID for display
  const formatPrincipalId = (id: string) => {
    if (!id) return "";
    return `${id.substring(0, 5)}...${id.substring(id.length - 4)}`;
  };

  return (
    <div className="relative" ref={menuRef}>
      {isConnected && principalId ? (
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-[rgba(8,9,14,0.95)] hover:bg-[rgba(16,18,35,0.95)] border border-[rgba(255,255,255,0.1)] flex items-center gap-2 py-2 px-3 rounded-full transition-colors"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src={getAvatarUrl(principalId)}
              alt="User Avatar"
              className="w-full h-full"
            />
          </div>
          <span className="text-white text-sm font-medium">
            {formatPrincipalId(principalId)}
          </span>
        </button>
      ) : (
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-[rgba(8,9,14,0.95)] hover:bg-[rgba(16,18,35,0.95)] border border-[rgba(255,255,255,0.1)] flex items-center gap-2 py-2 px-3 rounded-full transition-colors"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <img
              src="https://api.dicebear.com/9.x/pixel-art/svg?seed=anonymous"
              alt="Anonymous"
              className="w-full h-full"
            />
          </div>
          <span className="text-white text-sm font-medium">Connect</span>
        </button>
      )}

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[rgba(16,18,35,0.98)] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-xl z-50 overflow-hidden">
          {isConnected && principalId ? (
            <div className="p-4">
              <div className="text-white font-medium mb-2">
                Connected Wallet
              </div>
              <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-3 mb-3">
                <div className="text-gray-400 text-xs mb-1">Avatar</div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={getAvatarUrl(principalId)}
                      alt="User Avatar"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="text-white text-sm">
                    {walletType === "internet-identity"
                      ? "Internet Identity"
                      : "Plug Wallet"}{" "}
                    User
                  </div>
                </div>
              </div>

              <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-3 mb-3">
                <div className="text-gray-400 text-xs mb-1">Wallet Type</div>
                <div className="text-white text-sm font-medium flex items-center gap-2">
                  {walletType === "internet-identity" ? (
                    <>
                      <img
                        src="https://internetcomputer.org/img/IC-logo.svg"
                        alt="Internet Identity"
                        className="w-4 h-4"
                      />
                      Internet Identity
                    </>
                  ) : (
                    <>
                      <img
                        src="https://plugwallet.ooo/assets/images/plug-logo.svg"
                        alt="Plug Wallet"
                        className="w-4 h-4"
                      />
                      Plug Wallet
                    </>
                  )}
                </div>
              </div>

              <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-3 mb-3">
                <div className="text-gray-400 text-xs mb-1">Wallet Status</div>
                <div className="text-white text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Connected
                </div>
              </div>

              <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-3 mb-3">
                <div className="text-gray-400 text-xs mb-1">Principal ID</div>
                <div className="text-white text-sm font-medium truncate">
                  {principalId}
                </div>
              </div>

              {accountId && (
                <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-3 mb-3">
                  <div className="text-gray-400 text-xs mb-1">Account ID</div>
                  <div className="text-white text-sm font-medium truncate">
                    {accountId}
                  </div>
                </div>
              )}

              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="w-full bg-[rgba(76,186,105,0.1)] hover:bg-[rgba(76,186,105,0.2)] text-green-400 py-2 rounded-lg mb-3 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                View Dashboard
              </Link>

              <button
                onClick={handleDisconnect}
                className="w-full bg-[rgba(255,50,50,0.1)] hover:bg-[rgba(255,50,50,0.2)] text-red-400 py-2 rounded-lg mt-3 transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="p-4">
              <div className="text-white font-medium mb-3">Connect Wallet</div>

              <button
                onClick={handleConnectII}
                className="w-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white p-3 rounded-lg mb-2 flex items-center gap-3 transition-colors"
              >
                <div className="relative w-6 h-6 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <img
                      src="https://api.dicebear.com/9.x/pixel-art/svg?seed=internet-identity"
                      alt="Internet Identity"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                    <img
                      src="https://internetcomputer.org/img/IC-logo.svg"
                      alt="Internet Identity"
                      className="w-2 h-2"
                    />
                  </div>
                </div>
                <span>Internet Identity</span>
              </button>

              <button
                onClick={handleConnectPlug}
                disabled={!isPlugDetected}
                className="w-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white p-3 rounded-lg flex items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="relative w-6 h-6 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <img
                      src="https://api.dicebear.com/9.x/pixel-art/svg?seed=plug-wallet"
                      alt="Plug Wallet"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                    <img
                      src="https://plugwallet.ooo/assets/images/plug-logo.svg"
                      alt="Plug Wallet"
                      className="w-2 h-2"
                    />
                  </div>
                </div>
                <span>Plug Wallet</span>
                {!isPlugDetected && (
                  <span className="text-xs text-yellow-400 ml-auto">
                    Not detected
                  </span>
                )}
              </button>

              {!isPlugDetected && (
                <div className="text-xs text-yellow-400 mt-2">
                  Plug Wallet extension not detected.{" "}
                  <a
                    href="https://plugwallet.ooo/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    Install Plug
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnectionNav;
