import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "../components/dashboard/Sidebar";
import { NavigationBar } from "../components/dashboard/NavigationBar";
import { CollectionList } from "../components/dashboard/CollectionList";
import { TokenListSection } from "../components/dashboard/TokenListSection";
import { TradesSection } from "../components/dashboard/TradesSection";
import { TopListsSection } from "../components/dashboard/TopListsSection";
import { CreatorsSection } from "../components/dashboard/CreatorsSection";
import { SocialFeed } from "../components/dashboard/SocialFeed";
import { WidgetSidebar } from "../components/dashboard/WidgetSidebar";
import { GenesisList } from "../components/dashboard/GenesisList";
import { DeploymentStatusDashboard } from "../components/dashboard/DeploymentStatus";
import { MarketStats } from "../components/dashboard/MarketStats";
import { ICPService } from "../lib/icp-service";
import { TokenCard, Badge } from "../lib/types";
import { agentRegistryService, Agent } from "../lib/agent-registry-service";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

// Helper function to convert backend agent data to token card format
const agentToTokenCard = (agent: Agent): TokenCard => {
  // Create appropriate badges based on agent data
  const badges: Badge[] = [];

  // Add badge based on launch type
  if (agent.details?.launchType && "genesis" in agent.details.launchType) {
    badges.push({
      type: "trending" as const,
      value: "Genesis",
      color: "bg-[rgba(249,108,36,0.5)]",
    });
  } else if (
    agent.details?.launchType &&
    "standard" in agent.details.launchType
  ) {
    badges.push({
      type: "trending" as const,
      value: "Standard",
      color: "bg-[rgba(76,186,105,0.5)]",
    });
  }

  // Add 'new' badge based on creation date
  const createdDate = new Date(
    Number(agent.details?.createdAt || Date.now()) / 1000000
  ); // Convert from nanoseconds
  const now = new Date();
  const daysSinceCreation = Math.floor(
    (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceCreation < 14) {
    // If created within the last two weeks
    const timeLabel = daysSinceCreation < 1 ? "New" : `${daysSinceCreation}d`;
    badges.push({
      type: "new" as const,
      value: timeLabel,
      color: "bg-[rgba(76,186,105,0.5)]",
    });
  }

  return {
    name: agent.details?.name || "Unknown Agent",
    symbol: `$${agent.details?.ticker || "AGENT"}`,
    marketCap: `$0`, // We don't have market cap data yet
    change: `+0%`, // We don't have change data yet
    changeColor: "rgba(83,227,122,1)", // Default to positive color
    backgroundColor: `bg-[${getAgentColor(
      agent.details?.category || agent.details?.agentType || "Utility"
    )}]`,
    logoUrl: agent.details?.imageUrl || "placeholder.svg",
    socialCount: `0`, // We don't have social count data yet
    badges: badges,
    hasLogo: !!agent.details?.imageUrl,
    id: agent.details?.id, // Add id for linking to agent page
  };
};

// Helper function to get a color based on agent category
const getAgentColor = (category: string): string => {
  const categoryColors = {
    Utility: "rgba(115,94,181,1)",
    Data: "rgba(1,0,253,1)",
    Productivity: "rgba(236,107,63,1)",
    Content: "rgba(121,98,217,1)",
    Research: "rgba(5,90,234,1)",
  };

  return (
    categoryColors[category as keyof typeof categoryColors] ||
    "rgba(115,94,181,1)"
  );
};

const Index: React.FC = () => {
  const [allAgents, setAllAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isServiceInitialized, setIsServiceInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Check if the agent registry service is initialized
        if (!isServiceInitialized) {
          // This would typically be handled by the wallet provider
          // but we'll just set the flag for now
          setIsServiceInitialized(true);
        }
      } catch (error) {
        console.error("Failed to initialize services:", error);
        setError("Failed to initialize services. Please try again later.");
      }
    };

    initializeServices();
  }, [isServiceInitialized]);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all agents from the registry
        let agents: Agent[] = [];
        try {
          agents = await agentRegistryService.getAllAgents();
          console.log("Fetched agents from backend:", agents);
        } catch (error) {
          console.error("Error fetching agents from registry:", error);
          // Use an empty array if we can't fetch data
          agents = [];
        }

        setAllAgents(agents);
      } catch (error) {
        console.error("Failed to fetch agent data:", error);
        setError("Failed to load agent data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isServiceInitialized) {
      fetchAgentData();
    }
  }, [isServiceInitialized]);

  // Filter agents by creation date (newest first)
  const recentAgents = [...allAgents]
    .sort(
      (a, b) =>
        Number(b.details?.createdAt || 0) - Number(a.details?.createdAt || 0)
    )
    .slice(0, 6); // Take only the 6 most recent

  // For now, we'll just distribute the agents we have into different categories
  // In a real app, you'd have more sophisticated filtering
  const trendingAgents = allAgents.slice(0, 6); // First 6 agents
  const topEarningAgents =
    allAgents.length > 6 ? allAgents.slice(6, 12) : allAgents; // Next 6 agents or repeat

  // Convert our agents to token cards
  const recentAgentTokens = recentAgents.map(agentToTokenCard);
  const trendingAgentTokens = trendingAgents.map(agentToTokenCard);
  const topAgentTokens = topEarningAgents.map(agentToTokenCard);

  // Loading skeleton for agent sections
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
      <div className="flex gap-4 overflow-x-hidden">
        <div className="bg-gray-700 rounded-xl h-40 w-60"></div>
        <div className="bg-gray-700 rounded-xl h-40 w-60"></div>
        <div className="bg-gray-700 rounded-xl h-40 w-60"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-[rgba(1,1,1,1)] flex items-start gap-[40px_100px] overflow-hidden  pr-[29px] pb-[4761px] max-md:pr-5 max-md:pb-[100px] ">
      <Sidebar />

      <main className="flex flex-col items-stretch mt-7 max-md:max-w-full ">
        <NavigationBar />

        {/* Hero banner for Agent Launchpad */}
        <div className="mt-[34px] mb-8 bg-gradient-to-r from-[rgba(115,94,181,0.8)] to-[rgba(76,59,125,0.8)] rounded-xl p-8 text-white">
          <div className="flex max-w-full">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-3">
                Deploy AI Agents on the Internet Computer
              </h1>
              <p className="text-lg mb-6">
                Create your own AI agent with DIP-20 token economics. Launch,
                monetize, and build a community around your agent on the
                decentralized ICP blockchain.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/launchpad"
                  className="inline-block bg-white text-[rgba(115,94,181,1)] px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  Launch Your Agent
                </Link>
                <Link
                  to="/explore"
                  className="inline-block bg-transparent text-white border border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  Explore Agents
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1677442135026-11c825e7cd31?q=80&w=3432&auto=format&fit=crop"
                alt="AI Agent"
                className="w-64 h-auto object-cover rounded-lg opacity-90"
              />
            </div>
          </div>
        </div>

        <div className="mt-[34px] max-md:max-w-full">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
            <div className="w-[67%] max-md:w-full max-md:ml-0">
              <div className="grow max-md:max-w-full max-md:mt-10">
                {isLoading ? (
                  <>
                    <LoadingSkeleton />
                    <div className="mt-8">
                      <LoadingSkeleton />
                    </div>
                    <div className="mt-8">
                      <LoadingSkeleton />
                    </div>
                  </>
                ) : error ? (
                  <div className="bg-red-500 bg-opacity-20 p-4 rounded-xl text-white mb-6">
                    <h3 className="text-lg font-medium mb-2">Error</h3>
                    <p>{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-3 bg-white bg-opacity-20 px-3 py-1 rounded hover:bg-opacity-30 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : allAgents.length === 0 ? (
                  <div className="bg-gray-800 p-6 rounded-xl text-white mb-6 text-center">
                    <h3 className="text-xl font-medium mb-3">
                      No Agents Found
                    </h3>
                    <p className="text-gray-300 mb-4">
                      There are no agents created yet. Be the first to create
                      one!
                    </p>
                    <Link
                      to="/launchpad"
                      className="inline-block bg-[rgba(115,94,181,1)] px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                    >
                      Create Your Agent
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Genesis Launches section */}
                    <GenesisList />

                    <CollectionList
                      title="Top Earning Agents"
                      author="@multiagent"
                      authorImage="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/dfebb7fdcc83665a7b602e3b878b2cb9872abb37?placeholderIfAbsent=true"
                      tokens={topAgentTokens}
                    />

                    {/* Market Statistics Section */}
                    <MarketStats />

                    {/* Agent Tokenomics Banner */}
                    <div className="bg-[rgba(0,0,0,0.3)] p-4 rounded-xl my-6 text-white">
                      <h3 className="text-lg font-bold mb-2">
                        Agent Tokenomics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[rgba(115,94,181,0.3)] p-3 rounded-lg">
                          <h4 className="font-medium text-sm">
                            Revenue Sharing
                          </h4>
                          <p className="text-xs text-gray-300 mt-1">
                            Agents distribute revenue: 70% to builders, 20% to
                            token stakers, 10% to treasury.
                          </p>
                        </div>
                        <div className="bg-[rgba(115,94,181,0.3)] p-3 rounded-lg">
                          <h4 className="font-medium text-sm">Token Utility</h4>
                          <p className="text-xs text-gray-300 mt-1">
                            Stake tokens to earn a share of agent revenue and
                            participate in governance.
                          </p>
                        </div>
                        <div className="bg-[rgba(115,94,181,0.3)] p-3 rounded-lg">
                          <h4 className="font-medium text-sm">
                            Agent Registry
                          </h4>
                          <p className="text-xs text-gray-300 mt-1">
                            All agents are registered on-chain with transparent
                            metrics and tokenomics.
                          </p>
                        </div>
                      </div>
                    </div>

                    <CollectionList
                      title="Trending Agents"
                      author="@army"
                      authorImage="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/26c6712222fd69981d032b6ac64a16bea6a6d1e5?placeholderIfAbsent=true"
                      tokens={trendingAgentTokens}
                    />

                    <TokenListSection />

                    <TradesSection />

                    <TopListsSection />

                    <CreatorsSection />

                    {/* New section for recently launched agents */}
                    <div className="mt-8 mb-4">
                      <h2 className="text-2xl font-bold text-white mb-4">
                        Recently Launched Agents
                      </h2>
                      <div className="bg-[rgba(0,0,0,0.3)] p-4 rounded-xl">
                        <p className="text-gray-300 mb-4">
                          Check out the newest AI agents deployed on the
                          Internet Computer. Be among the first to try them out
                          and stake your tokens!
                        </p>
                        <CollectionList
                          title="Recently Launched"
                          author="@launchpad"
                          authorImage="https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/911fbaa90a08fba773b938bd74b842882529ddd7?placeholderIfAbsent=true"
                          tokens={recentAgentTokens}
                        />
                      </div>
                    </div>

                    <SocialFeed />

                    {/* ICP Integration Footer */}
                    <div className="mt-8 p-4 bg-[rgba(0,0,0,0.3)] rounded-xl text-white">
                      <h3 className="text-lg font-bold mb-2">
                        Powered by Internet Computer
                      </h3>
                      <p className="text-sm text-gray-300">
                        All agents are deployed as canisters on the Internet
                        Computer Protocol (ICP) blockchain, with fully on-chain
                        DIP-20 tokens, transparent revenue sharing, and
                        decentralized governance.
                      </p>
                      <div className="mt-4 flex gap-4">
                        <a
                          href="https://internetcomputer.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[rgba(115,94,181,1)] hover:underline"
                        >
                          Learn about ICP
                        </a>
                        <a
                          href="/docs"
                          className="text-xs text-[rgba(115,94,181,1)] hover:underline"
                        >
                          Developer Docs
                        </a>
                        <a
                          href="/tokenomics"
                          className="text-xs text-[rgba(115,94,181,1)] hover:underline"
                        >
                          Tokenomics
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <WidgetSidebar />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 mb-8 bg-[rgba(0,0,0,0.2)] p-4 rounded-xl">
          <div className="text-white">
            <h3 className="text-lg font-bold">Ready to build your AI agent?</h3>
            <p className="text-sm text-gray-300 mt-1">
              Create a tokenized agent, configure revenue splitting, and join
              the decentralized AI economy.
            </p>
          </div>

          <Link
            to="/launchpad"
            className="bg-[rgba(115,94,181,1)] gap-0.5 text-sm text-white font-medium px-4 py-2 rounded-[18px] hover:bg-[rgba(95,78,150,1)] transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create New Agent
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
