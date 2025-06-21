import React, { useState } from "react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { NavigationBar } from "../components/dashboard/NavigationBar";
import WalletConnection from "../components/dashboard/WalletConnection";
import { ICPService, DeploymentResult } from "../lib/icp-service";

// Interfaces for our component types
interface AgentTemplateProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface TokenConfigProps {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: string;
}

interface TokenDistributionProps {
  builder: number;
  publicSale: number;
  platform: number;
  stakers: number;
}

interface RevenueSplitProps {
  builder: number;
  stakers: number;
  treasury: number;
}

interface TokenSaleProps {
  enabled: boolean;
  price: string;
  softCap: string;
  hardCap: string;
  startDate: string;
  endDate: string;
  minPurchase: string;
  maxPurchase: string;
  whitelist: boolean;
  refundType: "refund" | "partial" | "burn";
}

const LaunchpadPage: React.FC = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState<number>(0); // Start at step 0 (wallet connection)
  const totalSteps = 5;

  // Auth state
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletType, setWalletType] = useState<
    "internet-identity" | "plug" | null
  >(null);
  const [principalId, setPrincipalId] = useState<string>("");

  // Deployment state
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentResult, setDeploymentResult] =
    useState<DeploymentResult | null>(null);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);

  // Form state
  const [agentName, setAgentName] = useState<string>("");
  const [agentDescription, setAgentDescription] = useState<string>("");
  const [agentCategory, setAgentCategory] = useState<string>("");
  const [agentTags, setAgentTags] = useState<string>("");
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<string>("scheduler");
  const [agentType, setAgentType] = useState<"template" | "custom" | "api">(
    "template"
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  // Token configuration
  const [tokenConfig, setTokenConfig] = useState<TokenConfigProps>({
    name: "",
    symbol: "",
    totalSupply: "1000000",
    decimals: "8",
  });

  // Tokenomics configuration
  const [tokenDistribution, setTokenDistribution] =
    useState<TokenDistributionProps>({
      builder: 30,
      publicSale: 40,
      platform: 5,
      stakers: 25,
    });

  // Token sale configuration
  const [tokenSale, setTokenSale] = useState<TokenSaleProps>({
    enabled: true,
    price: "0.001",
    softCap: "100",
    hardCap: "400",
    startDate: "",
    endDate: "",
    minPurchase: "0.1",
    maxPurchase: "10",
    whitelist: false,
    refundType: "refund",
  });

  // Revenue split configuration
  const [revenueSplit, setRevenueSplit] = useState<RevenueSplitProps>({
    builder: 70,
    stakers: 20,
    treasury: 10,
  });

  // Available agent templates
  const agentTemplates: AgentTemplateProps[] = [
    {
      id: "scheduler",
      name: "Scheduler Bot",
      description:
        "The Scheduler Bot template allows users to create and manage calendar events, set reminders, and coordinate scheduling between multiple participants. Perfect for administrative automation.",
      imageUrl:
        "https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=2748&auto=format&fit=crop",
    },
    {
      id: "chat",
      name: "Chat Agent",
      description:
        "A conversational AI agent that can engage in natural language dialogues with users, answer questions, and provide information on various topics.",
      imageUrl:
        "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=2748&auto=format&fit=crop",
    },
    {
      id: "data-analytics",
      name: "Data Analytics",
      description:
        "An agent specialized in processing and analyzing data, generating insights, and creating visualizations based on various data sources.",
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop",
    },
    {
      id: "content-generator",
      name: "Content Generator",
      description:
        "Creates various types of content, including blog posts, social media updates, product descriptions, and marketing copy based on provided topics or keywords.",
      imageUrl:
        "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?q=80&w=2940&auto=format&fit=crop",
    },
    {
      id: "research-assistant",
      name: "Research Assistant",
      description:
        "Helps with information gathering, summarization, and synthesis of research materials on specific topics or domains.",
      imageUrl:
        "https://images.unsplash.com/photo-1567177662154-dfeb4c93b6ae?q=80&w=2940&auto=format&fit=crop",
    },
  ];

  // Handle file selection for logo upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Handle wallet connection
  const handleWalletConnect = (
    type: "internet-identity" | "plug",
    principal: string
  ) => {
    setWalletType(type);
    setPrincipalId(principal);
    setIsWalletConnected(true);
    setCurrentStep(1); // Move to the first step after wallet connection
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!isWalletConnected) {
      setDeploymentError("Wallet connection required");
      return;
    }

    setIsDeploying(true);
    setDeploymentError(null);

    try {
      // Prepare the agent deployment parameters
      const agentParams = {
        name: agentName,
        description: agentDescription,
        category: agentCategory,
        tags: agentTags.split(",").map((tag) => tag.trim()),
        type: agentType,
        templateId: agentType === "template" ? selectedTemplateId : undefined,
      };

      // Deploy the agent, token, and configure everything
      const result = await ICPService.deployFullAgent(
        agentParams,
        tokenConfig,
        tokenDistribution,
        tokenSale,
        revenueSplit
      );

      setDeploymentResult(result);

      if (result.success) {
        // Navigate to success step
        setCurrentStep(6); // Step 6 would be a success/confirmation screen
      } else {
        setDeploymentError(result.error || "Deployment failed");
      }
    } catch (error) {
      console.error("Error during deployment:", error);
      setDeploymentError("An unexpected error occurred during deployment");
    } finally {
      setIsDeploying(false);
    }
  };

  // Handle navigation between steps
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === totalSteps) {
      handleSubmit(); // Submit on the last step
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render the correct step content
  const renderStepContent = () => {
    // Wallet connection step (step 0)
    if (currentStep === 0) {
      return <WalletConnection onConnect={handleWalletConnect} />;
    }

    // Deployment success/confirmation step (step 6)
    if (currentStep === 6) {
      return renderDeploymentSuccess();
    }

    // Regular steps
    switch (currentStep) {
      case 1:
        return renderAgentDetailsStep();
      case 2:
        return renderTokenCreationStep();
      case 3:
        return renderTokenomicsStep();
      case 4:
        return renderTokenSaleStep();
      case 5:
        return renderRevenueSplitStep();
      default:
        return renderAgentDetailsStep();
    }
  };

  // New step for deployment confirmation/success
  const renderDeploymentSuccess = () => {
    if (!deploymentResult) return null;

    return (
      <div className="space-y-6">
        <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6">
          <h3 className="text-white text-xl font-bold mb-4">
            Deployment Successful! 🚀
          </h3>

          <div className="space-y-4 mb-6">
            <p className="text-gray-300">
              Your agent has been successfully deployed to the Internet Computer
              blockchain.
            </p>

            <div className="bg-[rgba(0,0,0,0.2)] p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">
                Deployment Details
              </h4>

              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Agent Canister ID:</span>
                  <span className="text-white font-mono">
                    {deploymentResult.agentCanisterId}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Token Canister ID:</span>
                  <span className="text-white font-mono">
                    {deploymentResult.tokenCanisterId}
                  </span>
                </div>

                {deploymentResult.saleCanisterId && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sale Canister ID:</span>
                    <span className="text-white font-mono">
                      {deploymentResult.saleCanisterId}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-400">Transaction Hash:</span>
                  <span className="text-white font-mono">
                    {deploymentResult.txHash}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-300">
              Your agent is now live and registered in the global agent
              registry. You can monitor its performance and manage it from your
              dashboard.
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="/"
              className="bg-[rgba(115,94,181,1)] hover:bg-[rgba(95,78,150,1)] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Return to Dashboard
            </a>

            <button
              className="bg-[rgba(30,30,30,0.8)] hover:bg-[rgba(50,50,50,0.8)] text-white px-6 py-3 rounded-lg transition-colors"
              onClick={() => {
                // Reset the form to deploy another agent
                setCurrentStep(1);
                setDeploymentResult(null);
              }}
            >
              Deploy Another Agent
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Step 1: Agent Details
  const renderAgentDetailsStep = () => {
    return (
      <div className="space-y-6">
        <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6">
          <h3 className="text-white text-xl font-bold mb-4">
            Agent Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Agent Name
              </label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
                placeholder="Enter agent name"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Description
              </label>
              <textarea
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg min-h-[100px]"
                placeholder="Describe what your agent does"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Agent Category
              </label>
              <select
                value={agentCategory}
                onChange={(e) => setAgentCategory(e.target.value)}
                className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
              >
                <option value="">Select category</option>
                <option value="data-processing">Data Processing</option>
                <option value="content-creation">Content Creation</option>
                <option value="finance">Finance</option>
                <option value="research">Research</option>
                <option value="customer-support">Customer Support</option>
                <option value="development">Development</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={agentTags}
                onChange={(e) => setAgentTags(e.target.value)}
                className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
                placeholder="e.g., ai, analytics, automation"
              />
            </div>
          </div>
        </div>

        <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6">
          <h3 className="text-white text-xl font-bold mb-4">Agent Logic</h3>

          <div className="space-y-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="template"
                  name="agent-type"
                  checked={agentType === "template"}
                  onChange={() => setAgentType("template")}
                  className="text-[rgba(115,94,181,1)]"
                />
                <label htmlFor="template" className="text-white">
                  Use a pre-built template
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="custom"
                  name="agent-type"
                  checked={agentType === "custom"}
                  onChange={() => setAgentType("custom")}
                  className="text-[rgba(115,94,181,1)]"
                />
                <label htmlFor="custom" className="text-white">
                  Upload custom .wasm file
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="api"
                  name="agent-type"
                  checked={agentType === "api"}
                  onChange={() => setAgentType("api")}
                  className="text-[rgba(115,94,181,1)]"
                />
                <label htmlFor="api" className="text-white">
                  API Integration (OpenAI/Claude)
                </label>
              </div>
            </div>

            {agentType === "template" && (
              <div>
                <label className="text-white text-sm font-medium block mb-2">
                  Select Template
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
                >
                  {agentTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>

                {selectedTemplateId && (
                  <div className="mt-4 p-3 bg-[rgba(115,94,181,0.1)] rounded-lg border border-[rgba(115,94,181,0.3)]">
                    <h4 className="text-white font-medium mb-1">
                      Template Description
                    </h4>
                    <p className="text-gray-300 text-xs">
                      {
                        agentTemplates.find((t) => t.id === selectedTemplateId)
                          ?.description
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {agentType === "custom" && (
              <div>
                <label className="text-white text-sm font-medium block mb-2">
                  Upload .wasm File
                </label>
                <input
                  type="file"
                  accept=".wasm"
                  className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Upload a compiled WebAssembly module (.wasm)
                </p>
              </div>
            )}

            {agentType === "api" && (
              <div>
                <label className="text-white text-sm font-medium block mb-2">
                  API Configuration
                </label>
                <textarea
                  className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg min-h-[100px]"
                  placeholder="Enter API configuration details"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Specify API endpoints, keys, and integration details
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6">
          <h3 className="text-white text-xl font-bold mb-4">Agent Logo</h3>

          <div className="flex flex-col items-center justify-center">
            <div className="w-32 h-32 bg-[rgba(30,30,30,0.8)] border-2 border-dashed border-[rgba(80,80,80,0.8)] rounded-full flex items-center justify-center overflow-hidden mb-4">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Agent logo preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            <label className="bg-[rgba(30,30,30,0.8)] border border-[rgba(80,80,80,0.8)] hover:bg-[rgba(60,60,60,0.8)] text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
              Upload Logo
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>

            <div className="mt-4 p-3 bg-[rgba(115,94,181,0.1)] rounded-lg border border-[rgba(115,94,181,0.3)] w-full">
              <h4 className="text-white font-medium mb-1">Recommended</h4>
              <p className="text-gray-300 text-xs">
                Upload a square image at least 512x512 pixels. PNG or SVG format
                recommended for best quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Step 2: Token Creation
  const renderTokenCreationStep = () => {
    return (
      <div className="space-y-6">
        <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6">
          <h3 className="text-white text-xl font-bold mb-4">
            Token Information (DIP-20)
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Token Name
              </label>
              <input
                type="text"
                value={tokenConfig.name}
                onChange={(e) =>
                  setTokenConfig({ ...tokenConfig, name: e.target.value })
                }
                className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
                placeholder={`e.g., ${agentName} Token`}
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Token Symbol
              </label>
              <input
                type="text"
                value={tokenConfig.symbol}
                onChange={(e) =>
                  setTokenConfig({ ...tokenConfig, symbol: e.target.value })
                }
                className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
                placeholder="e.g., AGNT"
              />
              <p className="text-xs text-gray-400 mt-1">
                3-5 capital letters recommended
              </p>
            </div>

            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Total Supply
              </label>
              <input
                type="number"
                value={tokenConfig.totalSupply}
                onChange={(e) =>
                  setTokenConfig({
                    ...tokenConfig,
                    totalSupply: e.target.value,
                  })
                }
                className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
                placeholder="e.g., 1000000"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Decimals
              </label>
              <select
                value={tokenConfig.decimals}
                onChange={(e) =>
                  setTokenConfig({ ...tokenConfig, decimals: e.target.value })
                }
                className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
              >
                <option value="6">6 (0.000001)</option>
                <option value="8">8 (0.00000001)</option>
                <option value="18">18 (0.000000000000000001)</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Defines the smallest unit of your token
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6">
          <h3 className="text-white text-xl font-bold mb-4">Token Features</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Enable Transfers</p>
                <span className="text-xs text-gray-400">
                  Allow tokens to be transferred between users
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked className="sr-only peer" />
                <div className="w-11 h-6 bg-[rgba(60,60,60,0.8)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgba(115,94,181,1)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Enable Vesting</p>
                <span className="text-xs text-gray-400">
                  Lock tokens with a vesting schedule
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-[rgba(60,60,60,0.8)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgba(115,94,181,1)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Enable Staking</p>
                <span className="text-xs text-gray-400">
                  Allow users to stake tokens for rewards
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked className="sr-only peer" />
                <div className="w-11 h-6 bg-[rgba(60,60,60,0.8)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgba(115,94,181,1)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Enable Burning</p>
                <span className="text-xs text-gray-400">
                  Allow tokens to be permanently destroyed
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-[rgba(60,60,60,0.8)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgba(115,94,181,1)]"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6">
          <h3 className="text-white text-xl font-bold mb-4">DIP-20 Standard</h3>

          <div className="bg-[rgba(30,30,30,0.8)] rounded-lg p-4 mb-4 text-sm text-gray-300 font-mono">
            <p className="mb-2">DIP-20 Standard Features:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Internet Computer compatible</li>
              <li>Transfer & approvals</li>
              <li>Ledger integration</li>
              <li>Balance queries</li>
              <li>Metadata standard</li>
            </ul>
          </div>

          <div className="p-3 bg-[rgba(115,94,181,0.1)] rounded-lg border border-[rgba(115,94,181,0.3)]">
            <h4 className="text-white font-medium mb-1">
              Security Audit Status
            </h4>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-green-400 text-xs">Code Audited</span>
            </div>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-green-400 text-xs">Security Validated</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Step 3: Tokenomics
  const renderTokenomicsStep = () => {
    const updateDistribution = (
      key: keyof TokenDistributionProps,
      value: number
    ) => {
      // Ensure platform fee remains fixed at 5%
      if (key === "platform") return;

      // Create new distribution
      const newDistribution = { ...tokenDistribution, [key]: value };

      // Calculate remaining percentage
      const total = Object.values(newDistribution).reduce(
        (acc, val) => acc + val,
        0
      );

      // Adjust values to ensure they sum to 100%
      if (total !== 100) {
        // Keep platform fixed at 5%
        const adjustmentNeeded = 100 - total;
        const keysToAdjust = Object.keys(newDistribution).filter(
          (k) => k !== key && k !== "platform"
        ) as Array<keyof TokenDistributionProps>;

        // Distribute adjustment proportionally among other fields
        const totalOthers = keysToAdjust.reduce(
          (acc, k) => acc + newDistribution[k],
          0
        );

        if (totalOthers > 0) {
          keysToAdjust.forEach((k) => {
            const proportion = newDistribution[k] / totalOthers;
            newDistribution[k] += adjustmentNeeded * proportion;
            // Round to nearest integer
            newDistribution[k] = Math.round(newDistribution[k]);
          });
        }
      }

      setTokenDistribution(newDistribution);
    };

    return (
      <div className="space-y-6">
        <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6">
          <h3 className="text-white text-xl font-bold mb-4">
            Token Distribution
          </h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white text-sm font-medium">
                  Builder Allocation (You)
                </label>
                <span className="text-white">{tokenDistribution.builder}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={tokenDistribution.builder}
                onChange={(e) =>
                  updateDistribution("builder", parseInt(e.target.value))
                }
                className="w-full h-2 bg-[rgba(40,40,40,0.8)] rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-gray-400 mt-1">
                Tokens allocated to you as the creator
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white text-sm font-medium">
                  Public Sale
                </label>
                <span className="text-white">
                  {tokenDistribution.publicSale}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={tokenDistribution.publicSale}
                onChange={(e) =>
                  updateDistribution("publicSale", parseInt(e.target.value))
                }
                className="w-full h-2 bg-[rgba(40,40,40,0.8)] rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-gray-400 mt-1">
                Tokens available for public token sale
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white text-sm font-medium">
                  Platform Fee
                </label>
                <span className="text-white">
                  {tokenDistribution.platform}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={tokenDistribution.platform}
                disabled
                className="w-full h-2 bg-[rgba(40,40,40,0.8)] rounded-lg appearance-none cursor-not-allowed opacity-50"
              />
              <p className="text-xs text-gray-400 mt-1">
                Required platform allocation (fixed)
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white text-sm font-medium">
                  Staking Rewards
                </label>
                <span className="text-white">{tokenDistribution.stakers}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={tokenDistribution.stakers}
                onChange={(e) =>
                  updateDistribution("stakers", parseInt(e.target.value))
                }
                className="w-full h-2 bg-[rgba(40,40,40,0.8)] rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-gray-400 mt-1">
                Tokens reserved for staking rewards
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6">
          <h3 className="text-white text-xl font-bold mb-4">
            Distribution Preview
          </h3>

          <div className="flex items-center justify-center mb-6">
            {/* Simple chart visualization */}
            <div className="w-40 h-40 rounded-full relative">
              <div
                className="absolute inset-0 bg-[rgba(115,94,181,1)]"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${
                    50 + 3.6 * tokenDistribution.builder
                  }% 0%, ${
                    tokenDistribution.builder >= 50
                      ? 100
                      : 50 + 3.6 * tokenDistribution.builder
                  }% ${
                    tokenDistribution.builder >= 50
                      ? tokenDistribution.builder - 50
                      : 0
                  }%)`,
                }}
              ></div>
              <div
                className="absolute inset-0 bg-[rgba(95,78,150,1)]"
                style={{
                  clipPath: `polygon(50% 50%, ${
                    50 + 3.6 * tokenDistribution.builder
                  }% 0%, 100% ${
                    tokenDistribution.publicSale >= 50
                      ? 0
                      : 50 - tokenDistribution.publicSale
                  }%, 100% ${50 + 3.6 * tokenDistribution.publicSale}%)`,
                }}
              ></div>
              <div
                className="absolute inset-0 bg-[rgba(76,59,125,1)]"
                style={{
                  clipPath: `polygon(50% 50%, 100% ${
                    50 + 3.6 * tokenDistribution.publicSale
                  }%, 100% 100%, ${
                    100 - 3.6 * tokenDistribution.platform
                  }% 100%)`,
                }}
              ></div>
              <div
                className="absolute inset-0 bg-[rgba(54,41,95,1)]"
                style={{
                  clipPath: `polygon(50% 50%, ${
                    100 - 3.6 * tokenDistribution.platform
                  }% 100%, 0% 100%, 0% ${
                    100 - 3.6 * tokenDistribution.stakers
                  }%)`,
                }}
              ></div>
              <div
                className="absolute inset-0 bg-[rgba(42,32,74,1)]"
                style={{
                  clipPath: `polygon(50% 50%, 0% ${
                    100 - 3.6 * tokenDistribution.stakers
                  }%, 0% 0%, 50% 0%)`,
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-[rgba(20,20,20,0.8)] rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[rgba(115,94,181,1)]"></div>
                <span className="ml-2 text-white text-xs">Builder</span>
              </div>
              <span className="text-white text-xs">
                {tokenDistribution.builder}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[rgba(95,78,150,1)]"></div>
                <span className="ml-2 text-white text-xs">Public Sale</span>
              </div>
              <span className="text-white text-xs">
                {tokenDistribution.publicSale}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[rgba(76,59,125,1)]"></div>
                <span className="ml-2 text-white text-xs">Platform</span>
              </div>
              <span className="text-white text-xs">
                {tokenDistribution.platform}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[rgba(54,41,95,1)]"></div>
                <span className="ml-2 text-white text-xs">Staking</span>
              </div>
              <span className="text-white text-xs">
                {tokenDistribution.stakers}%
              </span>
            </div>
          </div>

          <div className="mt-6 p-3 bg-[rgba(115,94,181,0.1)] rounded-lg border border-[rgba(115,94,181,0.3)]">
            <h4 className="text-white font-medium mb-1">Allocation Summary</h4>
            <p className="text-gray-300 text-xs">
              With a total supply of{" "}
              {parseInt(tokenConfig.totalSupply).toLocaleString()} tokens:
            </p>
            <ul className="text-gray-300 text-xs mt-2 space-y-1">
              <li>
                {Math.floor(
                  (parseInt(tokenConfig.totalSupply) *
                    tokenDistribution.builder) /
                    100
                ).toLocaleString()}{" "}
                tokens to you (builder)
              </li>
              <li>
                {Math.floor(
                  (parseInt(tokenConfig.totalSupply) *
                    tokenDistribution.publicSale) /
                    100
                ).toLocaleString()}{" "}
                tokens for public sale
              </li>
              <li>
                {Math.floor(
                  (parseInt(tokenConfig.totalSupply) *
                    tokenDistribution.platform) /
                    100
                ).toLocaleString()}{" "}
                tokens to platform
              </li>
              <li>
                {Math.floor(
                  (parseInt(tokenConfig.totalSupply) *
                    tokenDistribution.stakers) /
                    100
                ).toLocaleString()}{" "}
                tokens for staking rewards
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Step 4: Token Sale
  const renderTokenSaleStep = () => {
    return (
      <div className="space-y-6">
        <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-xl font-bold">
              Token Sale Configuration
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">Enable Token Sale</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={tokenSale.enabled}
                  onChange={() =>
                    setTokenSale({ ...tokenSale, enabled: !tokenSale.enabled })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[rgba(60,60,60,0.8)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgba(115,94,181,1)]"></div>
              </label>
            </div>
          </div>

          {tokenSale.enabled && (
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium block mb-2">
                  Token Price (ICP)
                </label>
                <input
                  type="number"
                  value={tokenSale.price}
                  onChange={(e) =>
                    setTokenSale({ ...tokenSale, price: e.target.value })
                  }
                  className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
                  placeholder="e.g., 0.001"
                  step="0.001"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Price per token in ICP
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium block mb-2">
                    Soft Cap (ICP)
                  </label>
                  <input
                    type="number"
                    value={tokenSale.softCap}
                    onChange={(e) =>
                      setTokenSale({ ...tokenSale, softCap: e.target.value })
                    }
                    className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
                    placeholder="e.g., 100"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Minimum funding goal
                  </p>
                </div>

                <div>
                  <label className="text-white text-sm font-medium block mb-2">
                    Hard Cap (ICP)
                  </label>
                  <input
                    type="number"
                    value={tokenSale.hardCap}
                    onChange={(e) =>
                      setTokenSale({ ...tokenSale, hardCap: e.target.value })
                    }
                    className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
                    placeholder="e.g., 400"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Maximum funding goal
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium block mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={tokenSale.startDate}
                    onChange={(e) =>
                      setTokenSale({ ...tokenSale, startDate: e.target.value })
                    }
                    className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-white text-sm font-medium block mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={tokenSale.endDate}
                    onChange={(e) =>
                      setTokenSale({ ...tokenSale, endDate: e.target.value })
                    }
                    className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">
                    Enable Whitelist
                  </p>
                  <span className="text-xs text-gray-400">
                    Restrict token sale to approved addresses
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tokenSale.whitelist}
                    onChange={() =>
                      setTokenSale({
                        ...tokenSale,
                        whitelist: !tokenSale.whitelist,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[rgba(60,60,60,0.8)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgba(115,94,181,1)]"></div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium block mb-2">
                    Min Purchase (ICP)
                  </label>
                  <input
                    type="number"
                    value={tokenSale.minPurchase}
                    onChange={(e) =>
                      setTokenSale({
                        ...tokenSale,
                        minPurchase: e.target.value,
                      })
                    }
                    className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
                    placeholder="e.g., 0.1"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="text-white text-sm font-medium block mb-2">
                    Max Purchase (ICP)
                  </label>
                  <input
                    type="number"
                    value={tokenSale.maxPurchase}
                    onChange={(e) =>
                      setTokenSale({
                        ...tokenSale,
                        maxPurchase: e.target.value,
                      })
                    }
                    className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
                    placeholder="e.g., 10"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <label className="text-white text-sm font-medium block mb-2">
                  Refund Type
                </label>
                <select
                  value={tokenSale.refundType}
                  onChange={(e) =>
                    setTokenSale({
                      ...tokenSale,
                      refundType: e.target.value as
                        | "refund"
                        | "partial"
                        | "burn",
                    })
                  }
                  className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
                >
                  <option value="refund">Full Refund</option>
                  <option value="partial">Partial Tokens</option>
                  <option value="burn">Burn Excess</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  What happens if soft cap is not met
                </p>
              </div>
            </div>
          )}
        </div>

        {tokenSale.enabled && (
          <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6">
            <h3 className="text-white text-xl font-bold mb-4">Sale Summary</h3>

            <div className="bg-[rgba(30,30,30,0.8)] rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Tokens for Sale</span>
                <span className="text-white text-sm">
                  {Math.floor(
                    (parseInt(tokenConfig.totalSupply) *
                      tokenDistribution.publicSale) /
                      100
                  ).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Price per Token</span>
                <span className="text-white text-sm">
                  {tokenSale.price} ICP
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Soft Cap</span>
                <span className="text-white text-sm">
                  {tokenSale.softCap} ICP
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Hard Cap</span>
                <span className="text-white text-sm">
                  {tokenSale.hardCap} ICP
                </span>
              </div>

              {tokenSale.startDate && tokenSale.endDate && (
                <div className="border-t border-[rgba(60,60,60,0.8)] my-2 pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">
                      Token Sale Duration
                    </span>
                    <span className="text-white text-sm">
                      {Math.round(
                        (new Date(tokenSale.endDate).getTime() -
                          new Date(tokenSale.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 p-3 bg-[rgba(115,94,181,0.1)] rounded-lg border border-[rgba(115,94,181,0.3)]">
              <h4 className="text-white font-medium mb-1">Projected Raise</h4>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-xs">Minimum</span>
                <span className="text-white text-lg font-bold">
                  {tokenSale.softCap} ICP
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-xs">Maximum</span>
                <span className="text-white text-lg font-bold">
                  {tokenSale.hardCap} ICP
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Step 5: Revenue Split
  const renderRevenueSplitStep = () => {
    const updateRevenueSplit = (
      key: keyof RevenueSplitProps,
      value: number
    ) => {
      // Ensure treasury fee remains fixed at 10%
      if (key === "treasury") return;

      // Create new distribution
      const newSplit = { ...revenueSplit, [key]: value };

      // Calculate remaining percentage
      const total = Object.values(newSplit).reduce((acc, val) => acc + val, 0);

      // Adjust values to ensure they sum to 100%
      if (total !== 100) {
        // Keep treasury fixed at 10%
        const adjustmentNeeded = 100 - total;
        const keyToAdjust = key === "builder" ? "stakers" : "builder";

        newSplit[keyToAdjust] += adjustmentNeeded;
        // Round to nearest integer
        newSplit[keyToAdjust] = Math.round(newSplit[keyToAdjust]);
      }

      setRevenueSplit(newSplit);
    };

    return (
      <div className="space-y-6">
        <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6">
          <h3 className="text-white text-xl font-bold mb-4">
            Revenue Sharing Configuration
          </h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white text-sm font-medium">
                  Builder Revenue (You)
                </label>
                <span className="text-white">{revenueSplit.builder}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={revenueSplit.builder}
                onChange={(e) =>
                  updateRevenueSplit("builder", parseInt(e.target.value))
                }
                className="w-full h-2 bg-[rgba(40,40,40,0.8)] rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-gray-400 mt-1">
                Percentage of revenue allocated to you
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white text-sm font-medium">
                  Token Stakers
                </label>
                <span className="text-white">{revenueSplit.stakers}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={revenueSplit.stakers}
                onChange={(e) =>
                  updateRevenueSplit("stakers", parseInt(e.target.value))
                }
                className="w-full h-2 bg-[rgba(40,40,40,0.8)] rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-gray-400 mt-1">
                Percentage of revenue shared with token stakers
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white text-sm font-medium">
                  Platform Treasury
                </label>
                <span className="text-white">{revenueSplit.treasury}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={revenueSplit.treasury}
                disabled
                className="w-full h-2 bg-[rgba(40,40,40,0.8)] rounded-lg appearance-none cursor-not-allowed opacity-50"
              />
              <p className="text-xs text-gray-400 mt-1">
                Required platform fee (fixed)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6">
          <h3 className="text-white text-xl font-bold mb-4">
            Payment Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Payment Model
              </label>
              <select
                className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
                defaultValue="per-use"
              >
                <option value="per-use">Pay-per-use</option>
                <option value="subscription">Subscription</option>
                <option value="hybrid">Hybrid (Base + Usage)</option>
              </select>
            </div>

            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Base Fee (ICP)
              </label>
              <input
                type="number"
                defaultValue="0.01"
                className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-3 py-2 rounded-lg"
                step="0.001"
              />
              <p className="text-xs text-gray-400 mt-1">
                Cost per usage or monthly subscription
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white text-sm font-medium block mb-1">
                  Token Holder Discount
                </label>
                <span className="text-xs text-gray-400">
                  Discount for users who hold your token
                </span>
              </div>
              <div className="flex items-center bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] rounded-lg overflow-hidden">
                <input
                  type="number"
                  defaultValue="25"
                  className="w-16 bg-transparent text-white px-3 py-2 border-none focus:outline-none"
                />
                <span className="text-white px-2">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6">
          <h3 className="text-white text-xl font-bold mb-4">
            Revenue Distribution
          </h3>

          <div className="bg-[rgba(30,30,30,0.8)] rounded-lg p-4 mb-4">
            <div className="w-full h-32 flex flex-col justify-center">
              {/* Bar chart visualization */}
              <div className="w-full h-8 flex rounded-md overflow-hidden">
                <div
                  className="bg-[rgba(115,94,181,1)] h-full"
                  style={{ width: `${revenueSplit.builder}%` }}
                ></div>
                <div
                  className="bg-[rgba(95,78,150,1)] h-full"
                  style={{ width: `${revenueSplit.stakers}%` }}
                ></div>
                <div
                  className="bg-[rgba(76,59,125,1)] h-full"
                  style={{ width: `${revenueSplit.treasury}%` }}
                ></div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[rgba(115,94,181,1)]"></div>
                    <span className="ml-2 text-white text-xs">Builder</span>
                  </div>
                  <span className="text-white text-xs">
                    {revenueSplit.builder}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[rgba(95,78,150,1)]"></div>
                    <span className="ml-2 text-white text-xs">
                      Token Stakers
                    </span>
                  </div>
                  <span className="text-white text-xs">
                    {revenueSplit.stakers}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[rgba(76,59,125,1)]"></div>
                    <span className="ml-2 text-white text-xs">Platform</span>
                  </div>
                  <span className="text-white text-xs">
                    {revenueSplit.treasury}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 bg-[rgba(115,94,181,0.1)] rounded-lg border border-[rgba(115,94,181,0.3)]">
            <h4 className="text-white font-medium mb-1">Revenue Example</h4>
            <p className="text-gray-300 text-xs mb-2">
              For every 1 ICP your agent earns:
            </p>
            <ul className="text-gray-300 text-xs space-y-1">
              <li>{(revenueSplit.builder / 100).toFixed(2)} ICP goes to you</li>
              <li>
                {(revenueSplit.stakers / 100).toFixed(2)} ICP distributed to
                token stakers
              </li>
              <li>
                {(revenueSplit.treasury / 100).toFixed(2)} ICP to platform
                treasury
              </li>
            </ul>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-[rgba(115,94,181,1)] hover:bg-[rgba(95,78,150,1)] text-white font-medium py-2 rounded-lg transition-colors"
          >
            Deploy Agent & Token
          </button>

          <div className="mt-4 text-center text-gray-400 text-xs">
            Review all details carefully before deployment
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[rgba(1,1,1,1)] flex items-start gap-[40px_100px] overflow-hidden flex-wrap pr-[29px] max-md:pr-5">
      <Sidebar />

      <main className="flex flex-col items-stretch mt-7 flex-grow max-md:max-w-full">
        <NavigationBar />

        <div className="mt-[34px] max-md:max-w-full">
          <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6 mb-8">
            <h1 className="text-white text-3xl font-bold mb-2">
              Agent Launchpad
            </h1>
            <p className="text-gray-300">
              Deploy your AI agents on the ICP blockchain, mint tokens, and set
              up revenue splitting
            </p>
          </div>

          {/* If not connected to wallet, show the wallet step only */}
          {currentStep === 0 ? (
            <div className="bg-[rgba(20,20,20,0.8)] rounded-xl overflow-hidden mb-8">
              <div className="p-6">{renderStepContent()}</div>
            </div>
          ) : currentStep === 6 ? (
            /* Success step - show without the step indicator */
            <div>{renderStepContent()}</div>
          ) : (
            /* Regular steps - show with step indicator */
            <div className="bg-[rgba(20,20,20,0.8)] rounded-xl overflow-hidden mb-8">
              <div className="flex border-b border-[rgba(60,60,60,0.8)]">
                {[1, 2, 3, 4, 5].map((step) => (
                  <button
                    key={step}
                    onClick={() => isWalletConnected && setCurrentStep(step)}
                    className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
                      currentStep === step
                        ? "text-white border-b-2 border-[rgba(115,94,181,1)]"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                    disabled={!isWalletConnected}
                  >
                    {step === 1 && "Agent Details"}
                    {step === 2 && "Token Creation"}
                    {step === 3 && "Tokenomics"}
                    {step === 4 && "Token Sale"}
                    {step === 5 && "Revenue Split"}
                  </button>
                ))}
              </div>

              <div className="p-6">{renderStepContent()}</div>

              {/* Show any deployment errors */}
              {deploymentError && (
                <div className="mx-6 mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg">
                  <p className="text-red-400">{deploymentError}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons - don't show on wallet connection or success steps */}
          {currentStep > 0 && currentStep < 6 && (
            <div className="flex justify-between mb-8">
              {currentStep > 1 ? (
                <button
                  onClick={goToPreviousStep}
                  className="bg-[rgba(30,30,30,0.8)] hover:bg-[rgba(50,50,50,0.8)] text-white px-6 py-3 rounded-lg transition-colors"
                  disabled={isDeploying}
                >
                  Previous Step
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < totalSteps ? (
                <button
                  onClick={goToNextStep}
                  className="bg-[rgba(115,94,181,1)] hover:bg-[rgba(95,78,150,1)] text-white px-6 py-3 rounded-lg transition-colors"
                  disabled={isDeploying}
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-[rgba(115,94,181,1)] hover:bg-[rgba(95,78,150,1)] text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  disabled={isDeploying}
                >
                  {isDeploying ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deploying Agent...
                    </>
                  ) : (
                    "Deploy Agent"
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LaunchpadPage;
