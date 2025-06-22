import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavigationBar } from "@/components/dashboard/NavigationBar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { GenesisList } from "@/components/dashboard/GenesisList";
import { ICPService } from "@/lib/icp-service";
import { agentRegistryService, Agent } from "@/lib/agent-registry-service";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const ExplorePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filter, setFilter] = useState("All");
  const [searchResults, setSearchResults] = useState<Agent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  // Get search query from URL if present
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all agent data from the registry
        let allAgents: Agent[] = [];
        try {
          allAgents = await agentRegistryService.getAllAgents();
          console.log("Fetched agents from backend:", allAgents);
        } catch (error) {
          console.error("Error fetching agents from registry:", error);
          setError("Failed to fetch agents. Please try again later.");
          allAgents = [];
        }

        setAgents(allAgents);

        // If there's a search query, filter results
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const filteredAgents = allAgents.filter(
            (agent) =>
              agent.details.name.toLowerCase().includes(query) ||
              agent.details.shortPitch.toLowerCase().includes(query) ||
              agent.details.category.toLowerCase().includes(query) ||
              agent.details.tags.some((tag) =>
                tag.toLowerCase().includes(query)
              )
          );
          setSearchResults(filteredAgents);
          // Set filter to "Search Results" to indicate we're showing search results
          setFilter("Search Results");
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
        setError("Failed to load agent data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, [searchQuery]);

  // Filter the displayed agents based on filter selection
  const getFilteredAgents = () => {
    if (filter === "Search Results") {
      return searchResults;
    }

    if (filter === "Genesis") {
      return agents.filter(
        (agent) =>
          agent.details.launchType && "genesis" in agent.details.launchType
      );
    }

    if (filter === "New") {
      // Show agents created in the last 14 days
      const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000 * 1000000; // Convert to nanoseconds
      return agents.filter(
        (agent) => Number(agent.details.createdAt) > twoWeeksAgo
      );
    }

    // Default to showing all agents
    return agents;
  };

  const filteredAgents = getFilteredAgents();

  return (
    <div className="bg-[rgb(8,9,14)] min-h-screen">
      <div className="container mx-auto flex min-h-screen">
        <Sidebar />

        <main className="flex-1 px-4 py-6">
          <NavigationBar />

          <div className="mt-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">
                {searchQuery ? "Search Results" : "Explore Agents"}
              </h1>
              <p className="text-gray-400 mt-2">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : "Discover and invest in AI agents on the Multiagent Army platform"}
              </p>
            </div>

            {/* Hero Banner - Only show if not searching */}
            {!searchQuery && (
              <div className="mb-8 bg-gradient-to-r from-[rgba(115,94,181,0.8)] to-[rgba(76,59,125,0.8)] rounded-xl p-8 text-white">
                <div className="flex max-w-full">
                  <div className="max-w-2xl">
                    <h2 className="text-2xl font-bold mb-3">
                      Find and Invest in the Best AI Agents
                    </h2>
                    <p className="text-lg mb-6">
                      Browse through our collection of AI agents with $ARMY
                      token economics. Invest in agents early and earn rewards
                      as they grow.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Controls */}
            <div className="mb-6 bg-[rgba(255,255,255,0.03)] rounded-xl p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="text-white font-medium">Filter By:</div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setFilter("All")}
                    className={`px-4 py-2 rounded-lg ${
                      filter === "All"
                        ? "bg-[rgba(115,94,181,1)] text-white"
                        : "bg-[rgba(255,255,255,0.05)] text-gray-300"
                    }`}
                  >
                    All Agents
                  </button>
                  <button
                    onClick={() => setFilter("Genesis")}
                    className={`px-4 py-2 rounded-lg ${
                      filter === "Genesis"
                        ? "bg-[rgba(115,94,181,1)] text-white"
                        : "bg-[rgba(255,255,255,0.05)] text-gray-300"
                    }`}
                  >
                    Genesis
                  </button>
                  <button
                    onClick={() => setFilter("New")}
                    className={`px-4 py-2 rounded-lg ${
                      filter === "New"
                        ? "bg-[rgba(115,94,181,1)] text-white"
                        : "bg-[rgba(255,255,255,0.05)] text-gray-300"
                    }`}
                  >
                    New
                  </button>
                  {searchQuery && (
                    <button
                      onClick={() => setFilter("Search Results")}
                      className={`px-4 py-2 rounded-lg ${
                        filter === "Search Results"
                          ? "bg-[rgba(115,94,181,1)] text-white"
                          : "bg-[rgba(255,255,255,0.05)] text-gray-300"
                      }`}
                    >
                      Search Results
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Agents Grid */}
            {isLoading ? (
              <div className="py-8 flex justify-center">
                <LoadingSpinner size="large" />
              </div>
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
            ) : filter === "Search Results" && searchResults.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-xl font-medium text-white mb-2">
                  No agents found
                </h3>
                <p className="text-gray-400">
                  Try a different search term or browse all agents
                </p>
              </div>
            ) : filteredAgents.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-xl font-medium text-white mb-2">
                  No agents found
                </h3>
                <p className="text-gray-400 mb-6">
                  There are no agents in this category yet
                </p>
                <Link
                  to="/launchpad"
                  className="inline-block bg-[rgba(115,94,181,1)] px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors text-white"
                >
                  Create Your Agent
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAgents.map((agent) => (
                  <Link
                    key={agent.details.id}
                    to={`/agent/${agent.details.id}`}
                    className="bg-[rgba(255,255,255,0.03)] rounded-xl overflow-hidden hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={agent.details.imageUrl || "/placeholder.svg"}
                          alt={agent.details.name}
                          className="w-12 h-12 rounded-lg object-cover bg-[rgba(115,94,181,0.3)]"
                        />
                        <div>
                          <h3 className="text-white font-bold">
                            {agent.details.name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            ${agent.details.ticker}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {agent.details.shortPitch}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {agent.details.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs bg-[rgba(115,94,181,0.2)] text-gray-300 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExplorePage;
