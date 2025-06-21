import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ICPService } from "@/lib/icp-service";
import { Agent } from "@/lib/types";

interface GenesisLaunchProps {
  title: string;
  description: string;
  price?: string;
  allocation?: string;
  badges?: string[];
  backgroundClass?: string;
}

export const GenesisList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  // Get search query from URL if present
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        let fetchedAgents;

        // If search query exists, filter agents
        if (searchQuery) {
          const allAgents = await ICPService.getAllAgents();
          const query = searchQuery.toLowerCase();
          fetchedAgents = allAgents.filter(
            (agent) =>
              agent.name.toLowerCase().includes(query) ||
              agent.description.toLowerCase().includes(query) ||
              agent.tags.some((tag) => tag.toLowerCase().includes(query))
          );
        } else {
          // Otherwise get all agents
          fetchedAgents = await ICPService.getAllAgents();
        }

        setAgents(fetchedAgents);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [searchQuery]);

  const genesis: GenesisLaunchProps = {
    title: "Genesis Launches",
    description:
      "Co-owning AI agents at a minimum 112,000 $ARMY (~191.52k USD) FDV, with equal early access for all Armys via Army Point pledges. Allocations are determined after a 24-hour point-bidding period. If the funding goal isn't met, no tokens are minted and all $ARMY and points are fully refunded.",
    backgroundClass:
      "bg-gradient-to-r from-[rgba(31,28,54,0.95)] to-[rgba(31,28,54,0.8)]",
  };

  return (
    <div className="w-full my-6">
      <div className="flex flex-col bg-[rgba(255,255,255,0.03)] rounded-xl overflow-hidden">
        {/* Button Tabs */}
        <div className="flex gap-2 p-2 bg-[rgba(0,0,0,0.2)] overflow-x-auto">
          <button
            className={`py-1 px-3 rounded-md ${
              activeTab === "Genesis Launches New"
                ? "bg-[rgba(255,255,255,0.1)]"
                : ""
            } text-white text-sm`}
            onClick={() => setActiveTab("Genesis Launches New")}
          >
            Genesis Launches New
          </button>
          <button
            className={`py-1 px-3 rounded-md ${
              activeTab === "Sentient Agents"
                ? "bg-[rgba(255,255,255,0.1)]"
                : ""
            } text-white text-sm`}
            onClick={() => setActiveTab("Sentient Agents")}
          >
            Sentient Agents
          </button>
          <button
            className={`py-1 px-3 rounded-md ${
              activeTab === "Prototype Agents"
                ? "bg-[rgba(255,255,255,0.1)]"
                : ""
            } text-white text-sm`}
            onClick={() => setActiveTab("Prototype Agents")}
          >
            Prototype Agents
          </button>
          <div className="flex-grow"></div>
          <button
            className={`py-1 px-3 rounded-md ${
              activeTab === "All" ? "bg-[rgba(255,255,255,0.1)]" : ""
            } text-white text-sm`}
            onClick={() => setActiveTab("All")}
          >
            All
          </button>
        </div>

        {/* Genesis Launch Card */}
        <div className="p-6 flex flex-col md:flex-row gap-6">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-white mb-2">
              {genesis.title}
            </h2>
            <p className="text-gray-300 text-sm">{genesis.description}</p>
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <div className="w-48 h-48 bg-gradient-to-br from-[#2c2a5a] to-[#1d1c39] rounded-lg flex items-center justify-center p-4">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">
                  ARMY
                  <br />
                  POINTS
                </h3>
                <p className="text-lg">
                  Fair launch
                  <br />
                  for all Armys
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tab Section */}
        <div className="border-t border-[rgba(255,255,255,0.1)] px-6 py-3">
          <div className="flex gap-4 overflow-x-auto">
            <button
              className={`py-1 px-3 rounded-md ${
                activeTab === "All" ? "text-white" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("All")}
            >
              All
            </button>
            <button
              className={`py-1 px-3 rounded-md ${
                activeTab === "Live" ? "text-white" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("Live")}
            >
              Live
            </button>
            <button
              className={`py-1 px-3 rounded-md ${
                activeTab === "Upcoming" ? "text-white" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("Upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`py-1 px-3 rounded-md ${
                activeTab === "Ended" ? "text-white" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("Ended")}
            >
              Ended
            </button>
          </div>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="mt-6">
        {loading ? (
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-700 rounded-xl h-64"></div>
              ))}
            </div>
          </div>
        ) : agents.length > 0 ? (
          <AgentsCardGrid agents={agents} />
        ) : (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium text-white mb-2">
              No agents found
            </h3>
            <p className="text-gray-400">
              Try a different search term or browse all agents
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface AgentsCardGridProps {
  agents: Agent[];
}

const AgentsCardGrid: React.FC<AgentsCardGridProps> = ({ agents }) => {
  // For this example, we'll map the real Agent data to the display format
  const displayAgents = agents.map((agent) => ({
    id: agent.id,
    name: agent.name,
    symbol: agent.token,
    description: agent.description,
    participants: Math.floor(Math.random() * 400) + 20, // Random numbers for demo
    subscribed: `${(Math.random() * 50).toFixed(2)}%`,
    unlockingIn: Math.floor(Math.random() * 120) + 1,
    image: agent.imageUrl,
    countdown: `00d ${Math.floor(Math.random() * 24)}h ${Math.floor(
      Math.random() * 60
    )}m ${Math.floor(Math.random() * 60)}s`,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {displayAgents.map((agent) => (
        <div
          key={agent.id}
          className="bg-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-colors"
        >
          <Link to={`/agent/${agent.id}`} className="block">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <img
                    src={agent.image}
                    className="w-14 h-14 rounded-full object-cover"
                    alt={`${agent.name} logo`}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-blue-400 rounded-full w-5 h-5 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-white text-lg font-bold">{agent.name}</h3>
                  <p className="text-gray-400 text-sm">{agent.symbol}</p>
                </div>
              </div>

              <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center">
                  <div className="flex gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-white text-sm font-medium">
                      Tokens Unlocking in {agent.unlockingIn} days
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-gray-400 text-sm">
                  <span>Participants</span>
                  <p className="text-white text-lg font-bold">
                    {agent.participants}
                  </p>
                </div>
                <div className="text-gray-400 text-sm text-right">
                  <span>Subscribed</span>
                  <p className="text-white text-lg font-bold">
                    {agent.subscribed}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm font-medium">
                    Live
                  </span>
                  <span className="text-white text-sm ml-2">
                    {agent.countdown}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};
