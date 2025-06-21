import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavigationBar } from "@/components/dashboard/NavigationBar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { GenesisList } from "@/components/dashboard/GenesisList";
import { ICPService } from "@/lib/icp-service";
import { Agent } from "@/lib/types";

const ExplorePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filter, setFilter] = useState("All");
  const [searchResults, setSearchResults] = useState<Agent[]>([]);
  const location = useLocation();

  // Get search query from URL if present
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true);
      try {
        // Fetch all agent data
        const allAgents = await ICPService.getAllAgents();
        setAgents(allAgents);

        // If there's a search query, filter results
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const filteredAgents = allAgents.filter(
            (agent) =>
              agent.name.toLowerCase().includes(query) ||
              agent.description.toLowerCase().includes(query) ||
              agent.tags.some((tag) => tag.toLowerCase().includes(query))
          );
          setSearchResults(filteredAgents);
          // Set filter to "Search Results" to indicate we're showing search results
          setFilter("Search Results");
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
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
    // Other filter logic would go here
    return agents;
  };

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
                    onClick={() => setFilter("Live")}
                    className={`px-4 py-2 rounded-lg ${
                      filter === "Live"
                        ? "bg-[rgba(115,94,181,1)] text-white"
                        : "bg-[rgba(255,255,255,0.05)] text-gray-300"
                    }`}
                  >
                    Live
                  </button>
                  <button
                    onClick={() => setFilter("Trending")}
                    className={`px-4 py-2 rounded-lg ${
                      filter === "Trending"
                        ? "bg-[rgba(115,94,181,1)] text-white"
                        : "bg-[rgba(255,255,255,0.05)] text-gray-300"
                    }`}
                  >
                    Trending
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
              <LoadingSkeleton />
            ) : filter === "Search Results" && searchResults.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-xl font-medium text-white mb-2">
                  No agents found
                </h3>
                <p className="text-gray-400">
                  Try a different search term or browse all agents
                </p>
              </div>
            ) : (
              <GenesisList />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Loading skeleton for when agents are loading
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-gray-700 rounded-xl h-64"></div>
      ))}
    </div>
  </div>
);

export default ExplorePage;
