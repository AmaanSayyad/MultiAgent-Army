import React, { useState, useEffect } from "react";
import { LaunchTypeSelector } from "./LaunchTypeSelector_new";
import { AgentDetailsForm } from "./AgentDetailsForm";
import { ProjectPitch } from "./ProjectPitch";
import { TeamBackground } from "./TeamBackground";
import { TokenomicsDesign } from "./TokenomicsDesign_new";
import { AdditionalDetails } from "./AdditionalDetails";
import { LaunchDatePicker } from "./LaunchDatePicker";
import { Summary } from "./AgentSummary";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { Principal } from "@dfinity/principal";
import { agentRegistryService } from "@/lib/agent-registry-service";
import tokenFactoryService from "@/lib/token-factory-service";
import launchpadService from "@/lib/launchpad-service";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  wallet?: string;
  expertise?: string[];
}

interface TokenDistribution {
  developer: number;
  publicSale: number;
  liquidityPool: number;
}

interface VestingSchedule {
  developerMonths: number;
  publicSaleMonths: number;
  liquidityPoolMonths: number;
}

interface AgentFormData {
  launchType: "genesis" | "standard" | "existing" | null;
  agentPicture: string | null;
  agentName: string;
  ticker: string;
  agentType: string;
  shortPitch: string;
  agentOverview: string;
  framework: string;
  twitterConnected: boolean;
  websiteVerified: boolean;
  twitterUrl?: string;
  websiteUrl?: string;
  preBuyAmount: string;
  teamMembers: TeamMember[];
  tokenDistribution?: TokenDistribution;
  vestingSchedule?: VestingSchedule;
  totalSupply?: number;
  launchDate?: string;
  launchTime?: {
    hour: string;
    minute: string;
  };
}

export const AgentCreationForm: React.FC = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [startNew, setStartNew] = useState<boolean>(false);
  const [hasPendingAgent, setHasPendingAgent] = useState<boolean>(false);
  const [showDraftModal, setShowDraftModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<AgentFormData>({
    launchType: null,
    agentPicture: null,
    agentName: "",
    ticker: "",
    agentType: "",
    shortPitch: "",
    agentOverview: "",
    framework: "",
    twitterConnected: false,
    websiteVerified: false,
    preBuyAmount: "",
    teamMembers: [
      {
        id: "owner",
        name: "You",
        role: "Owner",
      },
    ],
    tokenDistribution: {
      developer: 50.0,
      publicSale: 37.5,
      liquidityPool: 12.5,
    },
    vestingSchedule: {
      developerMonths: 12,
      publicSaleMonths: 1,
      liquidityPoolMonths: 6,
    },
    totalSupply: 1000000,
    // Initialize launch date to be 3 days in the future
    launchDate: (() => {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 3);
      return defaultDate.toISOString().split("T")[0];
    })(),
    launchTime: {
      hour: "12",
      minute: "00",
    },
  });

  // Check for saved form data in localStorage when component mounts
  useEffect(() => {
    const savedFormData = localStorage.getItem("agentCreationFormData");
    const savedStep = localStorage.getItem("agentCreationStep");

    // Check if there's a pending agent creation
    if (savedFormData) {
      setHasPendingAgent(true);

      // Show the modal on initial load if there's a draft and we're not explicitly starting new
      if (!startNew && currentStep === 0) {
        setShowDraftModal(true);
      }

      // Only load the data if not starting fresh
      if (!startNew) {
        try {
          const parsedData = JSON.parse(savedFormData);
          setFormData(parsedData);

          // Only show toast if we have recovered from a non-trivial step and not showing the modal
          if (savedStep && parseInt(savedStep, 10) > 1 && !showDraftModal) {
            toast({
              title: "Agent creation resumed",
              description: "Your previous progress has been restored",
              variant: "default",
            });
          }
        } catch (error) {
          console.error("Error parsing saved form data:", error);
        }
      }
    }

    if (savedStep && !startNew) {
      try {
        const parsedStep = parseInt(savedStep, 10);
        setCurrentStep(parsedStep);
      } catch (error) {
        console.error("Error parsing saved step:", error);
      }
    }
  }, [toast, startNew, showDraftModal, currentStep]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    // Only save if we've started the form (selected a launch type)
    if (formData.launchType) {
      localStorage.setItem("agentCreationFormData", JSON.stringify(formData));
      localStorage.setItem("agentCreationStep", currentStep.toString());
    }
  }, [formData, currentStep]); // Function to start a new agent creation
  const startNewAgent = () => {
    setStartNew(true);
    setCurrentStep(0);
    setShowDraftModal(false);
    // Reset form data to initial state but don't clear localStorage yet
    setFormData({
      launchType: null,
      agentPicture: null,
      agentName: "",
      ticker: "",
      agentType: "",
      shortPitch: "",
      agentOverview: "",
      framework: "",
      twitterConnected: false,
      websiteVerified: false,
      preBuyAmount: "",
      teamMembers: [
        {
          id: "owner",
          name: "You",
          role: "Owner",
        },
      ],
      tokenDistribution: {
        developer: 50.0,
        publicSale: 37.5,
        liquidityPool: 12.5,
      },
      vestingSchedule: {
        developerMonths: 12,
        publicSaleMonths: 1,
        liquidityPoolMonths: 6,
      },
      totalSupply: 1000000,
      launchDate: (() => {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 3);
        return defaultDate.toISOString().split("T")[0];
      })(),
      launchTime: {
        hour: "12",
        minute: "00",
      },
    });

    toast({
      title: "Starting new agent",
      description: "Your previous draft is preserved and can be accessed later",
      variant: "default",
    });
  };

  // Function to continue with pending agent
  const continuePendingAgent = () => {
    setStartNew(false);
    setShowDraftModal(false);
    // The form data will be loaded from localStorage by the useEffect

    toast({
      title: "Continuing draft",
      description: "Picking up where you left off",
      variant: "default",
    });
  };

  const handleLaunchTypeSelect = (
    type: "genesis" | "standard" | "existing"
  ) => {
    setFormData({
      ...formData,
      launchType: type,
    });

    // No toast here - this is a normal interaction
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    // Save progress on step change
    localStorage.setItem("agentCreationStep", (currentStep + 1).toString());

    // No toast notification for regular navigation
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    // Save step on navigation
    localStorage.setItem("agentCreationStep", (currentStep - 1).toString());
  };

  const handleCancel = () => {
    // Handle cancellation logic here
    if (
      window.confirm(
        "Are you sure you want to cancel? All your progress will be lost."
      )
    ) {
      // Clear localStorage data
      localStorage.removeItem("agentCreationFormData");
      localStorage.removeItem("agentCreationStep");

      // Reset state
      setHasPendingAgent(false);
      setStartNew(false);
      setShowDraftModal(false);
      setCurrentStep(0);
      setFormData({
        launchType: null,
        agentPicture: null,
        agentName: "",
        ticker: "",
        agentType: "",
        shortPitch: "",
        agentOverview: "",
        framework: "",
        twitterConnected: false,
        websiteVerified: false,
        preBuyAmount: "",
        teamMembers: [
          {
            id: "owner",
            name: "You",
            role: "Owner",
          },
        ],
        tokenDistribution: {
          developer: 50.0,
          publicSale: 37.5,
          liquidityPool: 12.5,
        },
        vestingSchedule: {
          developerMonths: 12,
          publicSaleMonths: 1,
          liquidityPoolMonths: 6,
        },
        totalSupply: 1000000,
        // Initialize launch date to be 3 days in the future
        launchDate: (() => {
          const defaultDate = new Date();
          defaultDate.setDate(defaultDate.getDate() + 3);
          return defaultDate.toISOString().split("T")[0];
        })(),
        launchTime: {
          hour: "12",
          minute: "00",
        },
      });

      // Add toast notification for cancellation
      toast({
        title: "Form canceled",
        description: "Your agent creation has been canceled.",
        variant: "default",
      });
    }
  }; // Function to clear saved form data
  const clearSavedForm = () => {
    if (window.confirm("Are you sure you want to clear your saved progress?")) {
      localStorage.removeItem("agentCreationFormData");
      localStorage.removeItem("agentCreationStep");

      // Reset state
      setHasPendingAgent(false);
      setStartNew(false);
      setShowDraftModal(false);
      setCurrentStep(0);
      setFormData({
        launchType: null,
        agentPicture: null,
        agentName: "",
        ticker: "",
        agentType: "",
        shortPitch: "",
        agentOverview: "",
        framework: "",
        twitterConnected: false,
        websiteVerified: false,
        preBuyAmount: "",
        teamMembers: [
          {
            id: "owner",
            name: "You",
            role: "Owner",
          },
        ],
        tokenDistribution: {
          developer: 50.0,
          publicSale: 37.5,
          liquidityPool: 12.5,
        },
        vestingSchedule: {
          developerMonths: 12,
          publicSaleMonths: 1,
          liquidityPoolMonths: 6,
        },
        totalSupply: 1000000,
        launchDate: (() => {
          const defaultDate = new Date();
          defaultDate.setDate(defaultDate.getDate() + 3);
          return defaultDate.toISOString().split("T")[0];
        })(),
        launchTime: {
          hour: "12",
          minute: "00",
        },
      });

      // Add toast notification for clearing the form
      toast({
        title: "Draft cleared",
        description: "You can now start fresh with a new agent",
        variant: "default",
      });
    }
  };

  const updateFormData = (data: Partial<AgentFormData>) => {
    setFormData({
      ...formData,
      ...data,
    });

    // Auto-save to localStorage
    localStorage.setItem(
      "agentCreationFormData",
      JSON.stringify({
        ...formData,
        ...data,
      })
    );
  };

  const { isConnected, principalId, agent } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize agent registry service when agent is available
  useEffect(() => {
    if (agent) {
      agentRegistryService.initialize(agent).catch(console.error);
    }
  }, [agent]);

  const handleSubmit = async () => {
    // Validate that user is connected
    if (!isConnected || !principalId) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create an agent",
        variant: "destructive",
      });
      return;
    }

    // Start submitting
    setIsSubmitting(true);

    try {
      // Prepare the data for submission
      const launchDate =
        formData.launchDate && formData.launchTime
          ? new Date(
              `${formData.launchDate}T${formData.launchTime.hour}:${formData.launchTime.minute}:00`
            ).getTime() * 1000000 // Convert to nanoseconds for Motoko
          : null;

      // Prepare agent details
      const agentDetails = {
        name: formData.agentName,
        ticker: formData.ticker,
        agentType: formData.agentType,
        shortPitch: formData.shortPitch,
        agentOverview: formData.agentOverview,
        framework: formData.framework,
        tokenId: null, // Will be assigned later if token is created
        canisterId: null, // Will be assigned later if canister is created
        launchType:
          formData.launchType === "genesis"
            ? { genesis: null }
            : formData.launchType === "standard"
            ? { standard: null }
            : formData.launchType === "existing"
            ? { existing: null }
            : { genesis: null }, // Default to genesis
        twitterUrl: formData.twitterUrl,
        websiteUrl: formData.websiteUrl,
        imageUrl: formData.agentPicture,
        category: formData.agentType || "General",
        tags: [], // Could be derived from other fields or added as a separate step
      };

      // Prepare team members
      const teamMembers = formData.teamMembers.map((member) => ({
        name: member.name,
        role: member.role,
        avatarUrl: member.avatarUrl || null,
        bio: member.bio || null,
        socialLinks: member.socialLinks
          ? {
              twitter: member.socialLinks.twitter || null,
              github: member.socialLinks.github || null,
              linkedin: member.socialLinks.linkedin || null,
            }
          : null,
        wallet: member.wallet || null,
        expertise: member.expertise || [],
      }));

      // Prepare token distribution
      const tokenDistribution = formData.tokenDistribution
        ? {
            developer: formData.tokenDistribution.developer,
            publicSale: formData.tokenDistribution.publicSale,
            liquidityPool: formData.tokenDistribution.liquidityPool,
          }
        : null;

      // Prepare vesting schedule
      const vestingSchedule = formData.vestingSchedule
        ? {
            developerMonths: BigInt(formData.vestingSchedule.developerMonths),
            publicSaleMonths: BigInt(formData.vestingSchedule.publicSaleMonths),
            liquidityPoolMonths: BigInt(
              formData.vestingSchedule.liquidityPoolMonths
            ),
          }
        : null;

      // Prepare total supply
      const totalSupply = formData.totalSupply
        ? BigInt(formData.totalSupply)
        : null;

      // Submit to the backend
      const principal = Principal.fromText(principalId);
      const result = await agentRegistryService.createAgent(
        agentDetails,
        teamMembers,
        tokenDistribution,
        vestingSchedule,
        totalSupply,
        launchDate ? BigInt(launchDate) : null,
        principal
      );

      if (result.success) {
        toast({
          title: "Agent creation successful",
          description: `Your agent has been created with ID: ${result.agentId}`,
          variant: "default",
        });

        // Launch the token for the agent if needed
        if (formData.launchType !== "existing" && result.agentId) {
          await launchToken(result.agentId);
        }

        // Clear form data from localStorage after successful submission
        localStorage.removeItem("agentCreationFormData");
        localStorage.removeItem("agentCreationStep");

        // Reset state
        setHasPendingAgent(false);
        setStartNew(false);

        // Redirect to the agent page or dashboard
        window.location.href = `/agent/${result.agentId}`;
      } else {
        toast({
          title: "Agent creation failed",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting agent:", error);
      toast({
        title: "Agent creation failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Launch the token for the agent
  const launchToken = async (agentId: string) => {
    // Validate that user is connected
    if (!isConnected || !principalId) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to launch a token",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Initialize services if they haven't been initialized yet
      if (agent) {
        await tokenFactoryService.initialize(agent);
        await launchpadService.initialize(agent);
      }

      // Create token config
      const totalSupply = formData.totalSupply || 1000000;
      const tokenConfig = {
        name: formData.agentName,
        symbol: formData.ticker,
        decimals: 8, // Standard decimals
        totalSupply: BigInt(totalSupply * 10 ** 8), // Convert to smallest units (8 decimals)
        owner: Principal.fromText(principalId),
        fee: BigInt(0), // No transfer fee
      };

      // Create token distribution
      const tokenDistribution = formData.tokenDistribution
        ? {
            developer: formData.tokenDistribution.developer / 100, // Convert from percentage to decimal
            publicSale: formData.tokenDistribution.publicSale / 100,
            liquidityPool: formData.tokenDistribution.liquidityPool / 100,
          }
        : null;

      // Create vesting schedule
      const vestingSchedule = formData.vestingSchedule
        ? {
            developerMonths: BigInt(formData.vestingSchedule.developerMonths),
            publicSaleMonths: BigInt(formData.vestingSchedule.publicSaleMonths),
            liquidityPoolMonths: BigInt(
              formData.vestingSchedule.liquidityPoolMonths
            ),
          }
        : null;

      // Create the token using token factory
      const tokenResult = await tokenFactoryService.createToken(
        tokenConfig,
        agentId,
        tokenDistribution,
        vestingSchedule
      );

      if (!tokenResult.success) {
        toast({
          title: "Token creation failed",
          description: tokenResult.error || "Failed to create token",
          variant: "destructive",
        });
        return false;
      }

      // Token created successfully
      toast({
        title: "Token created",
        description: `Token ${formData.ticker} created with ID: ${tokenResult.tokenId}`,
        variant: "default",
      });

      // Now create a token sale
      const tokenId = tokenResult.tokenId!;
      const launchDate =
        formData.launchDate && formData.launchTime
          ? new Date(
              `${formData.launchDate}T${formData.launchTime.hour}:${formData.launchTime.minute}:00`
            ).getTime() * 1000000 // Convert to nanoseconds for Motoko
          : Date.now() * 1000000;

      // Calculate sale end date (7 days after launch date)
      const endDate = launchDate + 7 * 24 * 60 * 60 * 1000000000; // 7 days in nanoseconds

      // Hard-coded values for demonstration
      const price = BigInt(10000000); // Price in smallest units (1 ARMY)
      const hardCap = BigInt(42425 * 10000000); // 42,425 ARMY tokens in smallest units
      const softCap = hardCap / BigInt(2); // 50% of hard cap
      const minPurchase = BigInt(1 * 10000000); // 1 ARMY token in smallest units
      const maxPurchase = BigInt(500 * 10000000); // 500 ARMY tokens in smallest units
      const armyRequired = hardCap; // Same as hard cap for now
      const isGenesis = formData.launchType === "genesis";

      // Create the sale using launchpad service
      const saleResult = await launchpadService.createSale(
        tokenId,
        agentId,
        isGenesis,
        price,
        hardCap,
        softCap,
        BigInt(launchDate),
        BigInt(endDate),
        minPurchase,
        maxPurchase,
        armyRequired
      );

      if (!saleResult.success) {
        toast({
          title: "Sale creation failed",
          description: saleResult.error || "Failed to create token sale",
          variant: "destructive",
        });
        return false;
      }

      // Sale created successfully
      toast({
        title: "Token sale created",
        description: `Token sale created with ID: ${saleResult.saleId}`,
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error("Error launching token:", error);
      toast({
        title: "Token launch failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Add a wallet connection check component
  const WalletConnectionCheck = () => {
    if (!isConnected) {
      return (
        <div className="mb-6 p-4 bg-[rgba(255,100,100,0.2)] border border-[rgba(255,100,100,0.4)] rounded-lg">
          <div className="flex items-start">
            <div className="mr-3 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">
                Wallet not connected
              </h3>
              <p className="text-gray-300 text-sm mb-3">
                You need to connect your wallet to create an agent. Your agent
                will be associated with your wallet address.
              </p>
              <button
                onClick={() => window.scrollTo(0, 0)} // Scroll to top where wallet connect button is typically located
                className="px-4 py-2 bg-[rgba(255,100,100,0.8)] rounded text-sm text-white hover:bg-[rgba(255,80,80,0.9)] transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Render different steps based on currentStep
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <LaunchTypeSelector
            onSelect={handleLaunchTypeSelect}
            onNext={nextStep}
            onCancel={handleCancel}
          />
        );
      case 1:
        return (
          <AgentDetailsForm
            formData={{
              agentPicture: formData.agentPicture,
              agentName: formData.agentName,
              ticker: formData.ticker,
              agentType: formData.agentType,
            }}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrevious={prevStep}
            onCancel={handleCancel}
          />
        );
      case 2:
        return (
          <ProjectPitch
            formData={{
              shortPitch: formData.shortPitch,
              agentOverview: formData.agentOverview,
            }}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrevious={prevStep}
            onCancel={handleCancel}
          />
        );
      case 3:
        return (
          <TeamBackground
            formData={{
              teamMembers: formData.teamMembers,
            }}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrevious={prevStep}
            onCancel={handleCancel}
          />
        );
      case 4:
        return (
          <TokenomicsDesign
            formData={{
              tokenDistribution: formData.tokenDistribution,
              vestingSchedule: formData.vestingSchedule,
              totalSupply: formData.totalSupply,
              launchType: formData.launchType,
            }}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrevious={prevStep}
            onCancel={handleCancel}
          />
        );
      case 5:
        return (
          <AdditionalDetails
            formData={{
              framework: formData.framework,
              twitterConnected: formData.twitterConnected,
              websiteVerified: formData.websiteVerified,
              twitterUrl: formData.twitterUrl,
              websiteUrl: formData.websiteUrl,
            }}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrevious={prevStep}
            onCancel={handleCancel}
          />
        );
      case 6:
        return (
          <LaunchDatePicker
            formData={{
              launchDate: formData.launchDate,
              launchTime: formData.launchTime,
              launchType: formData.launchType,
            }}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrevious={prevStep}
            onCancel={handleCancel}
          />
        );
      case 7:
        return (
          <Summary
            formData={formData as Required<AgentFormData>}
            onPrevious={prevStep}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[rgb(8,9,14)] p-6 rounded-xl">
      {/* Show wallet connection warning if not connected */}
      <WalletConnectionCheck />

      {/* Show "Draft Available" notification if there's saved data but user has chosen to start new */}
      {hasPendingAgent && currentStep === 0 && startNew && !showDraftModal && (
        <div className="mb-4 p-4 bg-[rgba(115,94,181,0.2)] border border-[rgba(115,94,181,0.4)] rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-medium mb-1">Draft Available</h3>
              <p className="text-gray-300 text-sm">
                You have a saved draft. You can switch back to it anytime.
              </p>
            </div>
            <button
              onClick={() => setShowDraftModal(true)}
              className="px-3 py-1 bg-[rgba(115,94,181,1)] rounded text-sm text-white hover:bg-[rgba(95,78,150,1)] transition-colors"
            >
              Switch to Draft
            </button>
          </div>
        </div>
      )}

      <WalletConnectionCheck />

      {renderStep()}

      {/* Draft Continue Modal - similar to the image */}
      {showDraftModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-75"></div>

          {/* Modal Content */}
          <div className="bg-[rgb(15,16,25)] border border-gray-800 rounded-xl p-6 w-full max-w-md relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                Continue Editing Your Draft?
              </h2>
              <button
                onClick={startNewAgent}
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

            <div className="text-gray-400 text-center mb-6">
              This draft will be deleted if you start a new one
            </div>

            {/* Agent Info */}
            <div className="bg-[rgb(20,21,33)] border border-gray-800 rounded-lg p-4 mb-8">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-[rgb(25,26,40)] rounded-full flex items-center justify-center mr-4">
                  {formData.agentPicture ? (
                    <img
                      src={formData.agentPicture}
                      alt="Agent"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-white text-lg font-medium">
                    {formData.agentName || "Unknown"}
                  </h3>
                  <p className="text-gray-400">
                    {formData.ticker ? `$${formData.ticker}` : "$-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={continuePendingAgent}
                className="flex-1 py-3 px-4 bg-[rgba(115,94,181,1)] hover:bg-[rgba(95,78,150,1)] text-white font-medium rounded-lg transition-colors"
              >
                Continue
              </button>
              <button
                onClick={startNewAgent}
                className="flex-1 py-3 px-4 border border-gray-600 text-gray-300 hover:bg-[rgba(40,40,40,0.8)] rounded-lg transition-colors"
              >
                Start New
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
