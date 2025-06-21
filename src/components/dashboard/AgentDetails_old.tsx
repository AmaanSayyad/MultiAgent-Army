import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface ParticipantItem {
  id: number;
  address: string;
  pointsPledged: number;
  virtualCommitted: number;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

export const AgentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pledgeAmount, setPledgeAmount] = useState<string>("");
  const [commitAmount, setCommitAmount] = useState<string>("");

  // Map of agent IDs to data
  const agentsData = {
    feen: {
      name: "FEEN",
      symbol: "$FEEN",
      image:
        "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/c5e37802a82236bf478174f32d4630fd260b1fc2",
      website: "feencoin.io",
      status: "live",
      timeRemaining: "14h 22m 03s",
      totalVirtualCommitted: 410,
      maxCommitment: 42425,
      completionPercentage: 37.41,
      participantsCount: 340,
      description: `FEEN is a decentralized token that rewards the community for their engagement and support. Our mission is to build a strong, active ecosystem that benefits all participants equally.`,
    },
    govbot: {
      name: "GovBot",
      symbol: "$GOVBOT",
      image:
        "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/62dc1643bcc55c1a54b975bdbd59d22356686703",
      website: "gftyrobot.com",
      status: "live",
      timeRemaining: "07h 14m 51s",
      totalVirtualCommitted: 219,
      maxCommitment: 42425,
      completionPercentage: 0.52,
      participantsCount: 87,
      description: `INTRODUCTION A common issue faced across the globe is the citizens frustration which relates to service delivery. The common frustrations usually relate access to information and how it is untimely relayed back to them examples of this would a status of a complaint or how do I apply for a specific service these type of issues can easily be resolved BUT due to the following reasons the information is not presented to the customer on time. A subscription based model.`,
    },
    xknown: {
      name: "xKnown.ai",
      symbol: "$XKNOWN",
      image:
        "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/0c82a7db6a49e5d91236b6779fad677c06992157",
      website: "xknown.ai",
      status: "live",
      timeRemaining: "22h 41m 15s",
      totalVirtualCommitted: 156,
      maxCommitment: 42425,
      completionPercentage: 7.08,
      participantsCount: 31,
      description: `xKnown.ai is building a revolutionary AI platform that combines machine learning with deep knowledge systems to deliver insights that were previously impossible. Our token fuels the ecosystem by incentivizing both developers and users.`,
    },
  };

  // Default to govbot if ID not found
  const agentData =
    agentsData[id as keyof typeof agentsData] || agentsData.govbot;

  // Mock data for participants
  const participants: ParticipantItem[] = [
    {
      id: 1,
      address: "0xC54111bea08F786ADEd1c34YsA673AAGUUNsp1D",
      pointsPledged: 6000,
      virtualCommitted: 4,
    },
    {
      id: 2,
      address: "0xCBa0d122F8C345A93F3a434580i4DcBb60FFad",
      pointsPledged: 3954,
      virtualCommitted: 1,
    },
    {
      id: 3,
      address: "0xcTERN0e3ed5eA9lA7FV3aB8A7sWdL6TSd9E3ecfF",
      pointsPledged: 3500,
      virtualCommitted: 1,
    },
    {
      id: 4,
      address: "0xa9B0e1F679d122F82Z6b8F38p4c72rc208df5bea",
      pointsPledged: 1005,
      virtualCommitted: 24,
    },
    {
      id: 5,
      address: "0xABe8A5A3ef7A900867AFE38UC210259B4c3A79FF",
      pointsPledged: 3001,
      virtualCommitted: 1,
    },
    {
      id: 6,
      address: "0a297e2ScfEC7mZPw1xXZ030BOR4Gdaf0abaec3e",
      pointsPledged: 1700,
      virtualCommitted: 1,
    },
    {
      id: 7,
      address: "0x1CF4768AF3518FD1498Esd7Z3a0086d2W983",
      pointsPledged: 1191,
      virtualCommitted: 1,
    },
    {
      id: 8,
      address: "0xDeFF7B932A5Z8c9S25b35QbBGH91Bfw2e01F",
      pointsPledged: 2000,
      virtualCommitted: 18,
    },
    {
      id: 9,
      address: "0x977Wm70922L4F1CR56CbmFsOdA042qpZ9FV609",
      pointsPledged: 1000,
      virtualCommitted: 2,
    },
    {
      id: 10,
      address: "0xFzCd0F92PcWsVP93FeDCzZc10B3d0FBSFbBGf",
      pointsPledged: 1000,
      virtualCommitted: 5,
    },
  ];

  // Mock team data
  const teamMembers = [
    {
      id: 1,
      name: "@Shivashena",
      role: "Owner",
      image:
        "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/0b6000a749298ca038f1f983ff63020d9a13eb63",
    },
    {
      id: 2,
      name: "@HgalealNoazi",
      role: "Developer",
      image:
        "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/c5e37802a82236bf478174f32d4630fd260b1fc2",
    },
  ];

  const formatAddress = (address: string): string => {
    if (address === "You") return address;
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 6
    )}`;
  };

  const handleSetMaxPledge = () => {
    setPledgeAmount("10000");
  };

  const handleSetMaxCommit = () => {
    setCommitAmount("500");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Main content area */}
      <div className="w-full md:w-2/3">
        {/* Agent Header */}
        <div className="bg-[rgba(16,18,35,0.95)] rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={agentData.image}
                className="w-16 h-16 rounded-xl object-cover"
                alt={agentData.name}
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-white">
                      {agentData.name}
                    </h2>
                    <span className="text-gray-400">{agentData.symbol}</span>
                  </div>
                  <a
                    href="#"
                    className="text-gray-400 text-sm hover:text-gray-300"
                  >
                    {agentData.website}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 font-medium">Live</span>
                  <span className="text-white ml-2">
                    {agentData.timeRemaining}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Launch Status */}
        <div className="bg-[rgba(16,18,35,0.95)] rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Launch Status</h3>
          <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
            <span>Total $ARMY Committed</span>
            <div className="flex items-center gap-2 text-white">
              <span>{agentData.totalVirtualCommitted} VIRTUAL</span>
              <span className="text-xs text-gray-400">
                / {agentData.maxCommitment}
              </span>
              <span className="text-xs bg-green-400/20 text-green-400 px-1.5 rounded">
                {agentData.completionPercentage}%
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[rgba(255,255,255,0.1)] h-1.5 rounded-full overflow-hidden mb-6">
            <div
              className="bg-green-500 h-full rounded-full"
              style={{ width: `${agentData.completionPercentage}%` }}
            ></div>
          </div>

          {/* Participants table */}
          <h3 className="text-lg font-bold text-white mb-4">
            {agentData.participantsCount} Participants
          </h3>
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-[rgba(255,255,255,0.05)]">
                  <th className="text-left py-2">#</th>
                  <th className="text-left py-2">Address</th>
                  <th className="text-right py-2">Points Pledged</th>
                  <th className="text-right py-2">$ARMY committed</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr
                    key={participant.id}
                    className="border-b border-[rgba(255,255,255,0.05)] text-white text-sm"
                  >
                    <td className="py-3">{participant.id}</td>
                    <td className="py-3 font-mono">
                      {formatAddress(participant.address)}
                    </td>
                    <td className="py-3 text-right">
                      {participant.pointsPledged.toLocaleString()}
                    </td>
                    <td className="py-3 text-right">
                      {participant.virtualCommitted}
                    </td>
                  </tr>
                ))}
                <tr className="text-white text-sm">
                  <td className="py-3">0</td>
                  <td className="py-3">You</td>
                  <td className="py-3 text-right">0</td>
                  <td className="py-3 text-right">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Why This Agent Is Bullish */}
        <div className="bg-[rgba(16,18,35,0.95)] rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Why This Agent Is Bullish
          </h3>
          <p className="text-gray-300 text-sm mb-6">{agentData.description}</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="text-white">Twitter</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </span>
              <span className="text-white">Discord</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4 text-xs">
            <div className="text-gray-400">
              FRAMEWORKS: <span className="text-blue-400">Gov Framework</span>
            </div>
            <div className="text-gray-400">
              CONTRIBUTORS: <span className="text-green-400">89%</span>
            </div>
          </div>
        </div>

        {/* Submit Alpha Thesis */}
        <div className="bg-[rgba(16,18,35,0.95)] rounded-xl p-6 mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              Submit your Alpha Thesis
            </h3>
            <p className="text-gray-400 text-sm">Help this agent stand out</p>
          </div>
          <div>
            <button className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[rgba(255,255,255,0.1)] mb-6">
          {["Team Details", "Project Details", "Tokenomics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm ${
                activeTab === tab
                  ? "text-white border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Team Members */}
        {activeTab === "Team Details" && (
          <div className="bg-[rgba(16,18,35,0.95)] rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-6">Our Team</h3>
            <div className="flex flex-wrap gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
                    <img
                      src={member.image}
                      className="w-full h-full object-cover"
                      alt={member.name}
                    />
                  </div>
                  <h4 className="text-white font-medium text-center">
                    {member.name}
                  </h4>
                  <p className="text-gray-400 text-sm text-center">
                    {member.role}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button className="text-gray-400 hover:text-gray-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-gray-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Details Tab Content */}
        {activeTab === "Project Details" && (
          <div className="bg-[rgba(16,18,35,0.95)] rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Project Details
            </h3>
            <p className="text-gray-300 text-sm">
              Project details content will be displayed here once available.
            </p>
          </div>
        )}

        {/* Tokenomics Tab Content */}
        {activeTab === "Tokenomics" && (
          <div className="bg-[rgba(16,18,35,0.95)] rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Tokenomics</h3>
            <p className="text-gray-300 text-sm">
              Tokenomics details and distribution will be displayed here.
            </p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-1/3">
        <div className="bg-[rgba(16,18,35,0.95)] rounded-xl p-6 mb-6 sticky top-4">
          <h3 className="text-lg font-bold text-white mb-6">Pledge & Commit</h3>

          {/* Pledge Points */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-white font-medium">Pledge Points</h4>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-400">Balance:</span>
                <span className="text-sm text-white">10,000</span>
              </div>
            </div>
            <div className="relative">
              <input
                type="number"
                value={pledgeAmount}
                onChange={(e) => setPledgeAmount(e.target.value)}
                className="bg-[rgba(255,255,255,0.05)] text-white w-full rounded-lg px-3 py-2 border border-[rgba(255,255,255,0.1)] outline-none focus:border-blue-500 transition-colors"
                placeholder="0"
              />
              <button
                onClick={handleSetMaxPledge}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 text-xs hover:text-blue-400 transition-colors"
              >
                Max
              </button>
            </div>
          </div>

          {/* Suggested VIRTUAL to commit */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-gray-400 text-sm">
                Suggested $ARMY to commit
              </h4>
              <span className="text-white text-sm">≈ 0</span>
            </div>
          </div>

          {/* Commit VIRTUAL */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-white font-medium">Commit $ARMY</h4>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-400">Balance:</span>
                <span className="text-sm text-white">566 Max</span>
              </div>
            </div>
            <div className="relative">
              <input
                type="number"
                value={commitAmount}
                onChange={(e) => setCommitAmount(e.target.value)}
                className="bg-[rgba(255,255,255,0.05)] text-white w-full rounded-lg px-3 py-2 border border-[rgba(255,255,255,0.1)] outline-none focus:border-blue-500 transition-colors"
                placeholder="0"
              />
              <button
                onClick={handleSetMaxCommit}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 text-xs hover:text-blue-400 transition-colors"
              >
                Max
              </button>
            </div>
          </div>

          {/* Estimated Allocation */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-gray-400 text-sm">Estimated Allocation</h4>
              <span className="text-white text-sm">≈ 0</span>
            </div>
          </div>

          {/* Commit Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">
            Commit
          </button>

          {/* How to Participate */}
          <div className="mt-8">
            <h4 className="text-white font-medium mb-4">How to Participate</h4>

            <div className="mb-4">
              <div className="flex gap-2 mb-1">
                <span className="text-blue-500 font-medium">1.</span>
                <h5 className="text-blue-500 font-medium">Pledge points</h5>
              </div>
              <p className="text-gray-400 text-xs ml-6">
                Pledge your Army Points to receive an allocation. You can
                pledge up to 5.0% of total supply.
              </p>
              <p className="text-gray-400 text-xs ml-6 mt-2">
                Your final allocation depends on your pledged points relative to
                the total points pledged.
              </p>
              <p className="text-gray-400 text-xs ml-6 mt-2">
                Over-pledging increases your chance of winning the allocation.
              </p>
            </div>

            <div className="mb-4">
              <div className="flex gap-2 mb-1">
                <span className="text-blue-500 font-medium">2.</span>
                <h5 className="text-blue-500 font-medium">Commit $ARMY</h5>
              </div>
              <p className="text-gray-400 text-xs ml-6">
                Commit up to 500 $ARMY to automatically secure your maximum
                allocation.
              </p>
              <p className="text-gray-400 text-xs ml-6 mt-2">
                If participation exceeds expectations, your allocation will be
                diluted and any excess $ARMY will be refunded.
              </p>
            </div>

            <div>
              <div className="flex gap-2 mb-1">
                <span className="text-blue-500 font-medium">3.</span>
                <h5 className="text-blue-500 font-medium">Claim your tokens</h5>
              </div>
              <p className="text-gray-400 text-xs ml-6">
                After the launch hit the required funding minimum, you can claim
                your purchased tokens.
              </p>
              <p className="text-gray-400 text-xs ml-6 mt-2">
                If the launch fails, all points and $ARMY will be refunded.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
