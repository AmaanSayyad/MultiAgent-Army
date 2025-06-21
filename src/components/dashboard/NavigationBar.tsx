import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WalletConnectionNav } from "./WalletConnectionNav";
import { Agent } from "@/lib/types";
import { ICPService, agentRegistry } from "@/lib/icp-service";

// Sample data in case the agent registry is empty or unavailable
const fallbackAgents: Agent[] = [
  {
    id: "fallback-agent-1",
    name: "Demo Chat Agent",
    description: "A demonstration chat agent for testing search functionality",
    owner: "demo-owner",
    token: "demo-token",
    canister: "demo-canister",
    category: "Demo",
    tags: ["chat", "demo", "test"],
    createdAt: new Date().toISOString(),
    imageUrl: "https://via.placeholder.com/200",
    tokenDistribution: {
      builder: 30,
      publicSale: 40,
      platform: 5,
      stakers: 25,
    },
    revenueSplit: {
      builder: 70,
      stakers: 20,
      treasury: 10,
    },
    metrics: {
      totalUsers: 100,
      totalUsage: 500,
      totalRevenue: 200,
      stakingApr: 10,
    },
  },
  {
    id: "fallback-agent-2",
    name: "Demo Data Agent",
    description: "A demonstration data analysis agent for testing search",
    owner: "demo-owner",
    token: "demo-token-2",
    canister: "demo-canister-2",
    category: "Demo",
    tags: ["data", "demo", "analytics"],
    createdAt: new Date().toISOString(),
    imageUrl: "https://via.placeholder.com/200",
    tokenDistribution: {
      builder: 30,
      publicSale: 40,
      platform: 5,
      stakers: 25,
    },
    revenueSplit: {
      builder: 70,
      stakers: 20,
      treasury: 10,
    },
    metrics: {
      totalUsers: 100,
      totalUsage: 500,
      totalRevenue: 200,
      stakingApr: 10,
    },
  },
];

export const NavigationBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Agent[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle clicks outside the search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      setSearchResults([]);
      setSearchQuery("");
      setIsSearchFocused(false);
    };
  }, []);

  // Search agents based on query
  useEffect(() => {
    const searchAgents = async () => {
      if (searchQuery.trim().length === 0) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        // Use both the direct agentRegistry and the service to ensure we get results
        // In a real app, you would only use the service call
        console.log("Searching for:", searchQuery);

        // Get source data - try multiple sources to ensure we have something to search
        const query = searchQuery.toLowerCase();
        let sourceAgents = [...agentRegistry]; // Start with direct registry

        // If registry is empty, use fallback data
        if (!sourceAgents || sourceAgents.length === 0) {
          console.log("Agent registry is empty, using fallback data");
          sourceAgents = [...fallbackAgents];
        }

        // Log the available agents
        console.log("Source Agents:", sourceAgents);

        // Filter agents from the source data
        const filteredAgents = sourceAgents.filter(
          (agent) =>
            agent.name.toLowerCase().includes(query) ||
            agent.description.toLowerCase().includes(query) ||
            agent.tags.some((tag) => tag.toLowerCase().includes(query))
        );

        console.log("Filtered Agents (direct):", filteredAgents);

        // If we got results from direct filtering, use those
        if (filteredAgents.length > 0) {
          setSearchResults(filteredAgents);
        } else {
          // As a backup, try the service call
          try {
            const allAgents = await ICPService.getAllAgents();
            console.log("All Agents from service:", allAgents);

            if (allAgents && allAgents.length > 0) {
              const serviceFilteredAgents = allAgents.filter(
                (agent) =>
                  agent.name.toLowerCase().includes(query) ||
                  agent.description.toLowerCase().includes(query) ||
                  agent.tags.some((tag) => tag.toLowerCase().includes(query))
              );

              console.log("Filtered Agents (service):", serviceFilteredAgents);

              if (serviceFilteredAgents.length > 0) {
                setSearchResults(serviceFilteredAgents);
              } else {
                // If no results from service, show filtered results from fallback
                const fallbackFiltered = fallbackAgents.filter(
                  (agent) =>
                    agent.name.toLowerCase().includes(query) ||
                    agent.description.toLowerCase().includes(query) ||
                    agent.tags.some((tag) => tag.toLowerCase().includes(query))
                );

                console.log("Filtered Agents (fallback):", fallbackFiltered);
                setSearchResults(fallbackFiltered);
              }
            } else {
              // If service returned empty, use fallback data
              const fallbackFiltered = fallbackAgents.filter(
                (agent) =>
                  agent.name.toLowerCase().includes(query) ||
                  agent.description.toLowerCase().includes(query) ||
                  agent.tags.some((tag) => tag.toLowerCase().includes(query))
              );

              console.log("Filtered Agents (fallback):", fallbackFiltered);
              setSearchResults(fallbackFiltered);
            }
          } catch (serviceError) {
            console.error(
              "Service error, using fallback results:",
              serviceError
            );
            // If service fails, try to filter the fallback data
            const fallbackFiltered = fallbackAgents.filter(
              (agent) =>
                agent.name.toLowerCase().includes(query) ||
                agent.description.toLowerCase().includes(query) ||
                agent.tags.some((tag) => tag.toLowerCase().includes(query))
            );

            setSearchResults(fallbackFiltered);
          }
        }
      } catch (error) {
        console.error("Error searching agents:", error);
        // Fallback to searching in the demo data
        try {
          const query = searchQuery.toLowerCase();
          const fallbackFiltered = fallbackAgents.filter(
            (agent) =>
              agent.name.toLowerCase().includes(query) ||
              agent.description.toLowerCase().includes(query) ||
              agent.tags.some((tag) => tag.toLowerCase().includes(query))
          );

          setSearchResults(fallbackFiltered);
        } catch (fallbackError) {
          console.error("Even fallback search failed:", fallbackError);
          setSearchResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search to avoid excessive API calls
    const debounceTimeout = setTimeout(() => {
      searchAgents();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  // Debug click functionality
  const handleDebugClick = (e: React.MouseEvent, agentId: string) => {
    console.log("Click event fired for agent:", agentId);
    console.log("Event target:", e.target);
    console.log("Current target:", e.currentTarget);
    e.stopPropagation();
    e.preventDefault();
    handleResultClick(agentId);
  };

  // Navigate to agent page when a result is clicked
  const handleResultClick = (agentId: string) => {
    if (!agentId) {
      console.error("No agent ID provided for navigation");
      return;
    }

    console.log("Navigating to agent:", agentId);

    // First close the search modal
    setIsSearchFocused(false);
    setSearchQuery("");

    // Add a small delay before navigation to ensure UI state is updated
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      navigate(`/agent/${agentId}`);
    }, 10);
  };

  return (
    <header className="flex w-full items-center justify-between py-4 relative">
      {/* Background overlay when search is focused */}
      {isSearchFocused && searchQuery.trim().length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[9000]"
          onClick={() => setIsSearchFocused(false)}
          style={{ pointerEvents: "auto" }}
        ></div>
      )}

      <div className="flex-1 max-w-4xl z-10">
        <nav className="bg-[rgba(8,9,14,0.95)] overflow-hidden rounded-xl border border-[rgba(255,255,255,0.03)] shadow-lg relative z-10">
          <div className="flex items-center h-12">
            <Link
              to="/"
              className="flex items-center h-full px-5 text-base text-white font-medium border-r border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <span>AI Agents</span>
            </Link>

            <Link
              to="/army"
              className="flex items-center h-full px-5 text-base text-white font-medium border-r border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <span>ARMY</span>
            </Link>

            <Link
              to="/explore"
              className="flex items-center h-full px-5 text-base text-white font-medium border-r border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <span>Explore</span>
            </Link>

            <Link
              to="/about"
              className="flex items-center h-full px-5 text-base text-white font-medium border-r border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <span>About</span>
            </Link>

            <div className="flex-1 flex items-center px-4" ref={searchRef}>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  placeholder="Search for agents & tokens"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className={`w-full pl-10 pr-3 py-2 bg-transparent text-white border-none outline-none placeholder-gray-400 text-sm ${
                    isSearchFocused ? "bg-[rgba(255,255,255,0.05)]" : ""
                  }`}
                />

                {/* Search Results Dropdown */}
                {isSearchFocused && searchQuery.trim().length > 0 && (
                  <div
                    className="fixed inset-0 z-[9999] flex items-start justify-center sm:pt-16 pt-4 px-4"
                    style={{ pointerEvents: "auto" }}
                  >
                    <div
                      className="relative w-full max-w-2xl bg-[rgba(20,21,33,0.98)] rounded-lg border border-[rgba(255,255,255,0.1)] shadow-xl overflow-hidden"
                      style={{ pointerEvents: "auto" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center p-3 border-b border-[rgba(255,255,255,0.1)] sticky top-0 bg-[rgba(20,21,33,0.98)]">
                        <h3 className="text-white font-medium truncate pr-2">
                          Results for "{searchQuery}"
                        </h3>
                        <button
                          onClick={() => setIsSearchFocused(false)}
                          className="text-gray-400 hover:text-white flex-shrink-0"
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

                      {isLoading ? (
                        <div className="p-6 text-center text-gray-400">
                          <div className="animate-spin inline-block w-6 h-6 border-t-2 border-purple-500 border-r-2 border-b-2 border-transparent rounded-full mb-2"></div>
                          <p>Searching agents...</p>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div
                          className="max-h-[60vh] overflow-y-auto py-2"
                          style={{ position: "relative", zIndex: 10001 }}
                        >
                          {searchResults.map((agent, index) => (
                            <div
                              key={agent.id || `agent-${index}`}
                              onClick={(e) => {
                                handleDebugClick(e, agent.id);
                              }}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-[rgba(255,255,255,0.05)] cursor-pointer transition-colors border-b border-[rgba(255,255,255,0.03)]"
                              style={{
                                pointerEvents: "auto",
                                position: "relative",
                                zIndex: 10000,
                              }}
                            >
                              <img
                                src={
                                  agent.imageUrl ||
                                  "https://via.placeholder.com/40"
                                }
                                alt={agent.name}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                  // If image fails to load, replace with a placeholder
                                  e.currentTarget.src =
                                    "https://via.placeholder.com/40";
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium truncate flex items-center gap-2">
                                  {agent.name || "Unknown Agent"}
                                  <button
                                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-0.5 rounded ml-auto"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleResultClick(agent.id);
                                    }}
                                  >
                                    View
                                  </button>
                                </h4>
                                <p className="text-gray-400 text-xs line-clamp-1">
                                  {agent.description ||
                                    "No description available"}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {Array.isArray(agent.tags) &&
                                    agent.tags.slice(0, 3).map((tag, index) => (
                                      <span
                                        key={index}
                                        className="text-xs px-2 py-0.5 bg-[rgba(255,255,255,0.1)] text-gray-300 rounded-full"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  {(!Array.isArray(agent.tags) ||
                                    agent.tags.length === 0) && (
                                    <span className="text-xs px-2 py-0.5 bg-[rgba(255,255,255,0.1)] text-gray-300 rounded-full">
                                      No tags
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-400">
                          No results found for "{searchQuery}"
                        </div>
                      )}

                      {searchResults.length > 0 && (
                        <div className="p-2 border-t border-[rgba(255,255,255,0.1)]">
                          <Link
                            to={`/explore?q=${encodeURIComponent(searchQuery)}`}
                            className="block w-full text-center text-purple-400 text-sm py-2 hover:bg-[rgba(255,255,255,0.05)] rounded-md transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsSearchFocused(false);
                            }}
                            style={{
                              pointerEvents: "auto",
                              position: "relative",
                              zIndex: 10000,
                            }}
                          >
                            See all results
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div className="flex items-center gap-4 ml-4 relative z-10">
        <button className="bg-[rgba(8,9,14,0.95)] hover:bg-[rgba(16,18,35,0.95)] border border-[rgba(255,255,255,0.03)] flex items-center justify-center w-10 h-10 rounded-full transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <Link
          to="/create-agent"
          className="bg-[#735EB5] hover:bg-[rgba(95,78,150,1)] text-white font-medium px-4 py-2 rounded-full flex items-center gap-1 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
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

        <WalletConnectionNav />
      </div>
    </header>
  );
};
