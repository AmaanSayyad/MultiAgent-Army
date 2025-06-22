import React, { useState, useEffect, ReactNode, useCallback } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { WalletContext, WalletContextType } from "./wallet-context-types";
import {
  userRegistryService,
  UserProfile,
  forceReinitializeRegistry,
} from "./user-registry-service";
import { agentRegistryService } from "./agent-registry-service";
import { tokenService } from "./token-service";
import tokenFactoryService from "./token-factory-service";
import { launchpadService } from "./launchpad-service";

// Define the props for our provider component
interface WalletProviderProps {
  children: ReactNode;
}

// Create a provider component
export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [principalId, setPrincipalId] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<
    "internet-identity" | "plug" | null
  >(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [agent, setAgent] = useState<HttpAgent | null>(null);
  const [isPlugDetected, setIsPlugDetected] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);

  // Helper function to handle Plug disconnect state
  const handlePlugDisconnect = () => {
    setPrincipalId(null);
    setAccountId(null);
    setWalletType(null);
    setIsConnected(false);
    setAgent(null);
    // Clear Plug wallet info from localStorage
    window.localStorage.removeItem("wallet-type");
    window.localStorage.removeItem("plug-principal");
    window.localStorage.removeItem("plug-account");
  };

  // Initialize services when agent is available
  const [servicesInitialized, setServicesInitialized] =
    useState<boolean>(false);

  useEffect(() => {
    if (agent) {
      console.log("Initializing services with agent:", agent);
      setServicesInitialized(false);

      // Initialize all services in parallel to ensure they're all ready to use
      Promise.all([
        // Ensure the user registry service is properly initialized
        userRegistryService.initialize(agent),

        // Ensure the agent registry service is properly initialized
        agentRegistryService.initialize(agent),

        // Initialize token service
        tokenService.initialize(agent),

        // Initialize token factory service
        tokenFactoryService.initialize(agent),

        // Initialize launchpad service
        launchpadService.initialize(agent),
      ])
        .then(() => {
          console.log("All services initialized successfully");
          setServicesInitialized(true);
        })
        .catch((error) => {
          console.error("Failed to initialize services:", error);
          setServicesInitialized(false);
        });
    } else {
      setServicesInitialized(false);
    }
  }, [agent]);

  // Function to refresh user profile
  const refreshUserProfile = useCallback(async (): Promise<void> => {
    if (!principalId) return;

    // Check if the principal is anonymous (should not happen but adding as a safeguard)
    if (principalId === "2vxsx-fae") {
      console.log(
        "Anonymous principal detected in refreshUserProfile, not fetching profile"
      );
      return;
    }

    // Ensure services are initialized before attempting to fetch profile
    if (!servicesInitialized) {
      console.log("Services not yet initialized, skipping profile fetch");
      return;
    }

    setIsLoadingProfile(true);
    try {
      const principal = Principal.fromText(principalId);

      // Double-check for anonymous principal
      if (principal.isAnonymous()) {
        console.log("Anonymous principal detected, not fetching profile");
        setIsLoadingProfile(false);
        return;
      }

      console.log("Fetching profile for principal:", principalId);
      const profile = await userRegistryService.getProfile(principal);

      if (profile) {
        console.log("Profile found for user:", profile);
        setUserProfile(profile);
      } else {
        console.log("No profile found for principal:", principalId);
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
      // Set to null to trigger profile setup
      setUserProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [principalId, servicesInitialized]);

  // Load user profile when connected
  useEffect(() => {
    if (isConnected && principalId && servicesInitialized && agent) {
      console.log(
        "Attempting to refresh user profile for principal:",
        principalId
      );
      refreshUserProfile().catch((error) => {
        console.error("Failed to load user profile:", error);
      });
    } else {
      if (isConnected && principalId) {
        console.log(
          "Waiting for services to initialize before loading profile..."
        );
      }
      if (!isConnected || !principalId) {
        setUserProfile(null);
      }
    }
  }, [
    isConnected,
    principalId,
    refreshUserProfile,
    agent,
    servicesInitialized,
  ]);

  // Function to update user profile
  const updateUserProfile = async (
    updates: Partial<UserProfile>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!principalId) {
      return { success: false, error: "No principal ID available" };
    }

    try {
      const principal = Principal.fromText(principalId);

      // Get existing profile or create a new one
      const existingProfile = await userRegistryService.getProfile(principal);

      const profileToUpdate: UserProfile = {
        id: principal,
        username:
          updates.username !== undefined
            ? updates.username
            : existingProfile?.username || null,
        displayName:
          updates.displayName !== undefined
            ? updates.displayName
            : existingProfile?.displayName || null,
        avatarUrl:
          updates.avatarUrl !== undefined
            ? updates.avatarUrl
            : existingProfile?.avatarUrl || null,
        agents:
          updates.agents !== undefined
            ? updates.agents
            : existingProfile?.agents || [],
        socialLinks:
          updates.socialLinks !== undefined
            ? updates.socialLinks
            : existingProfile?.socialLinks || null,
        createdAt: existingProfile?.createdAt || BigInt(Date.now() * 1000000), // Convert to nanoseconds
        verifiedTwitter: existingProfile?.verifiedTwitter || false,
        verifiedWebsite: existingProfile?.verifiedWebsite || false,
      };

      const result = await userRegistryService.updateProfile(profileToUpdate);

      if (result.success) {
        // Refresh the profile after successful update
        await refreshUserProfile();
      }

      return result;
    } catch (error) {
      console.error("Failed to update profile:", error);
      return { success: false, error: String(error) };
    }
  };

  // Check if Plug wallet is available
  useEffect(() => {
    const checkPlug = () => {
      const isPlugAvailable = window.ic?.plug !== undefined;
      setIsPlugDetected(isPlugAvailable);
      console.log("Plug wallet detected:", isPlugAvailable);
    };

    checkPlug();
    window.addEventListener("load", checkPlug);

    return () => {
      window.removeEventListener("load", checkPlug);
    };
  }, []);

  // Initialize Internet Identity auth client
  useEffect(() => {
    const initAuthClient = async () => {
      try {
        console.log("Initializing AuthClient...");
        const client = await AuthClient.create({
          idleOptions: {
            disableIdle: true, // Disable automatic logout on idle
            disableDefaultIdleCallback: true, // Disable default idle callback
          },
          // Use localStorage for better persistence
          storage: {
            get: async (key) => {
              const item = window.localStorage.getItem(key);
              return item ? JSON.parse(item) : null;
            },
            set: async (key, value) => {
              window.localStorage.setItem(key, JSON.stringify(value));
            },
            remove: async (key) => {
              window.localStorage.removeItem(key);
            },
          },
        });
        setAuthClient(client);

        // Check if already authenticated with II
        if (client.isAuthenticated()) {
          console.log("User is already authenticated with Internet Identity");
          // Check if the identity is anonymous before setting the state
          const identity = client.getIdentity();
          const principal = identity.getPrincipal();
          const principalStr = principal.toString();

          // Check if principal represents anonymous identity
          if (principalStr === "2vxsx-fae" || principal.isAnonymous()) {
            console.log(
              "Anonymous principal detected, not setting as connected"
            );
            // Clear any stored auth data for anonymous identities
            try {
              window.localStorage.removeItem("wallet-type");
            } catch (err) {
              console.warn(
                "Failed to clear wallet type from localStorage:",
                err
              );
            }
            // Don't set connected state for anonymous identity
            return;
          }

          console.log("Valid Internet Identity Principal:", principalStr);
          setPrincipalId(principalStr);
          setWalletType("internet-identity");
          setIsConnected(true);

          // Create agent with the identity
          const newAgent = new HttpAgent({ identity });

          // Only fetch root key in local development
          if (isDevelopmentMode() && process.env.DFX_NETWORK !== "ic") {
            await newAgent.fetchRootKey().catch((err) => {
              console.warn("Unable to fetch root key. Error:", err);
              console.warn("Ensure the local replica is running");
            });
          }

          setAgent(newAgent);

          // Store auth method in localStorage for persistence
          try {
            window.localStorage.setItem("wallet-type", "internet-identity");
          } catch (err) {
            console.warn("Failed to save wallet type to localStorage:", err);
          }
        }
      } catch (error) {
        console.error("Failed to initialize AuthClient:", error);
      }
    };

    initAuthClient();
  }, []);

  // Check if already connected to Plug
  useEffect(() => {
    const checkPlugConnection = async () => {
      if (window.ic?.plug) {
        try {
          console.log("Checking Plug connection...");
          const connected = await window.ic.plug.isConnected();
          console.log("Plug connected:", connected);

          if (connected) {
            const principalId = window.ic.plug.principalId;
            const accountId = window.ic.plug.accountId;

            console.log("Plug Principal ID:", principalId);
            console.log("Plug Account ID:", accountId);

            setPrincipalId(principalId);
            setAccountId(accountId);
            setWalletType("plug");
            setIsConnected(true);
            setAgent(window.ic.plug.agent);

            // Store auth method in localStorage for persistence
            try {
              window.localStorage.setItem("wallet-type", "plug");
              window.localStorage.setItem("plug-principal", principalId);
              window.localStorage.setItem("plug-account", accountId || "");
            } catch (err) {
              console.warn(
                "Failed to save plug wallet info to localStorage:",
                err
              );
            }

            // Setup connection update listener
            window.ic.plug.onConnectionUpdate(() => {
              console.log("Plug wallet connection updated");
              // Re-check connection status
              window.ic.plug.isConnected().then((connected) => {
                if (!connected) {
                  console.log("Plug wallet disconnected");
                  handlePlugDisconnect();
                }
              });
            });
          } else if (window.localStorage.getItem("wallet-type") === "plug") {
            // We found a stored wallet type, but we'll wait for explicit user action
            // instead of automatically reconnecting
            console.log(
              "Found stored Plug wallet connection, waiting for user to connect manually"
            );

            // Clear the persisted wallet info to avoid automatic reconnection attempts
            window.localStorage.removeItem("wallet-type");
            window.localStorage.removeItem("plug-principal");
            window.localStorage.removeItem("plug-account");

            // Do not attempt automatic reconnection
            handlePlugDisconnect();
          } else {
            // Not connected
            handlePlugDisconnect();
          }
        } catch (error) {
          console.error("Error checking Plug connection:", error);
          handlePlugDisconnect();
        }
      }
    };

    // Helper function to handle Plug disconnect state
    const handlePlugDisconnect = () => {
      setPrincipalId(null);
      setAccountId(null);
      setWalletType(null);
      setIsConnected(false);
      setAgent(null);
      // Clear Plug wallet info from localStorage
      window.localStorage.removeItem("wallet-type");
      window.localStorage.removeItem("plug-principal");
      window.localStorage.removeItem("plug-account");
    };

    if (isPlugDetected) {
      checkPlugConnection();
    }
  }, [isPlugDetected]);

  // Helper function to check if we're in development mode
  const isDevelopmentMode = () => {
    return process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
  };

  // Connect to Internet Identity
  const connectInternetIdentity = async (): Promise<void> => {
    if (!authClient) {
      console.error("AuthClient not initialized");
      return;
    }

    try {
      console.log("Connecting to Internet Identity..."); // Use appropriate identity provider based on environment
      // For IC production network
      let identityProvider = "https://identity.ic0.app";

      // For local development
      if (isDevelopmentMode() && process.env.DFX_NETWORK !== "ic") {
        // Use the newly deployed Internet Identity canister
        identityProvider = "http://avqkn-guaaa-aaaaa-qaaea-cai.localhost:4943";
        console.log("Using local Internet Identity at:", identityProvider);
      }

      console.log("Using identity provider:", identityProvider);

      await new Promise<void>((resolve, reject) => {
        authClient.login({
          identityProvider,
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
          windowOpenerFeatures:
            "width=500,height=600,toolbar=0,location=0,menubar=0,resizable=1,scrollbars=1",
          onSuccess: () => {
            console.log("Successfully logged in with Internet Identity");
            resolve();
          },
          onError: (error) => {
            console.error("Error logging in with Internet Identity:", error);
            reject(error);
          },
        });
      });

      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal();
      const principalStr = principal.toString();

      console.log("Internet Identity Principal:", principalStr);

      // Check if principal represents anonymous identity
      if (principalStr === "2vxsx-fae" || principal.isAnonymous()) {
        console.error(
          "Anonymous principal detected during login, not setting as connected"
        );
        throw new Error("Authentication failed: Anonymous identity detected");
      }

      setPrincipalId(principalStr);
      setWalletType("internet-identity");
      setIsConnected(true);

      // Store auth method in localStorage for persistence
      try {
        window.localStorage.setItem("wallet-type", "internet-identity");
      } catch (err) {
        console.warn("Failed to save wallet type to localStorage:", err);
      }

      // Create agent with the identity
      const newAgent = new HttpAgent({ identity });

      // Only fetch root key in local development
      if (isDevelopmentMode() && process.env.DFX_NETWORK !== "ic") {
        await newAgent.fetchRootKey().catch((err) => {
          console.warn("Unable to fetch root key. Error:", err);
          console.warn("Ensure the local replica is running");
        });
      }

      setAgent(newAgent);
    } catch (error) {
      console.error("Failed to connect to Internet Identity:", error);
      throw error;
    }
  };

  // Connect to Plug wallet
  const connectPlug = async (whitelist: string[] = []): Promise<void> => {
    if (!window.ic?.plug) {
      console.error("Plug wallet not detected");
      window.open("https://plugwallet.ooo/", "_blank");
      return;
    }

    try {
      console.log("Connecting to Plug wallet...");

      // Use appropriate host based on environment
      const host =
        !isDevelopmentMode() || process.env.DFX_NETWORK === "ic"
          ? "https://icp0.io"
          : process.env.DFX_LOCAL_HOST || "http://localhost:4943";

      console.log("Using host:", host);
      console.log("Whitelist:", whitelist);

      const result = await window.ic.plug.requestConnect({
        whitelist,
        host,
      });

      console.log("Plug connection result:", result);

      if (result) {
        const principalId = window.ic.plug.principalId;
        const accountId = window.ic.plug.accountId;

        console.log("Plug Principal ID:", principalId);
        console.log("Plug Account ID:", accountId);
        setPrincipalId(principalId);
        setAccountId(accountId);
        setWalletType("plug");
        setIsConnected(true);
        setAgent(window.ic.plug.agent);

        // Store auth method in localStorage for persistence
        try {
          window.localStorage.setItem("wallet-type", "plug");
          window.localStorage.setItem("plug-principal", principalId);
          window.localStorage.setItem("plug-account", accountId || "");
        } catch (err) {
          console.warn("Failed to save plug wallet info to localStorage:", err);
        }

        // Setup connection update listener
        window.ic.plug.onConnectionUpdate(() => {
          console.log("Plug wallet connection updated");
          // Re-check connection status
          window.ic.plug.isConnected().then((connected) => {
            if (!connected) {
              console.log("Plug wallet disconnected");
              handlePlugDisconnect();
            }
          });
        });
      } else {
        console.error("User rejected connection to Plug wallet");
      }
    } catch (error) {
      console.error("Failed to connect to Plug wallet:", error);
      throw error;
    }
  };

  // Helper function to forcefully reset wallet state
  const forceReset = () => {
    // Reset all state
    setPrincipalId(null);
    setAccountId(null);
    setWalletType(null);
    setIsConnected(false);
    setAgent(null);

    // Clear any related items from localStorage
    try {
      const localStorageKeys = [
        "ic-identity",
        "ic-delegation",
        "ic-localStorage",
        "ic-agent",
        "wallet-type",
        "plug-principal",
        "plug-account",
      ];

      localStorageKeys.forEach((key) => {
        if (window.localStorage.getItem(key)) {
          window.localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn("Error clearing localStorage:", error);
    }

    console.log("Wallet state has been forcefully reset");
  };

  // Disconnect from wallet
  const disconnect = async (): Promise<void> => {
    console.log("Disconnecting wallet, type:", walletType);

    try {
      if (walletType === "internet-identity" && authClient) {
        // For Internet Identity, we need to clear the storage and logout
        await authClient.logout();
        console.log("Logged out from Internet Identity");

        // Clear Internet Identity info from localStorage
        try {
          window.localStorage.removeItem("wallet-type");
        } catch (storageError) {
          console.warn("Error clearing localStorage:", storageError);
        }
      } else if (walletType === "plug" && window.ic?.plug) {
        try {
          // For Plug wallet, we need to call the disconnect method
          // This might fail if the wallet is not connected, so we catch the error
          await window.ic.plug.disconnect();
          console.log("Disconnected from Plug wallet");

          // Clear Plug wallet info from localStorage
          try {
            window.localStorage.removeItem("wallet-type");
            window.localStorage.removeItem("plug-principal");
            window.localStorage.removeItem("plug-account");
          } catch (storageError) {
            console.warn("Error clearing localStorage:", storageError);
          }
        } catch (plugError) {
          console.warn("Error disconnecting from Plug wallet:", plugError);
          // Continue with cleanup anyway
        }
      }
    } catch (error) {
      console.error("Error during wallet disconnect:", error);
      // Continue with cleanup anyway
    } finally {
      // Always reset the state regardless of potential errors
      setPrincipalId(null);
      setAccountId(null);
      setWalletType(null);
      setIsConnected(false);
      setAgent(null);

      console.log("Wallet state has been reset");
    }
  };

  const value: WalletContextType = {
    isConnected,
    principalId,
    accountId,
    walletType,
    authClient,
    agent,
    connectInternetIdentity,
    connectPlug,
    disconnect,
    isPlugDetected,
    userProfile,
    isLoadingProfile,
    updateUserProfile,
    refreshUserProfile,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
