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
  const teamMembers: TeamMember[] = [
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main content area - 2/3 of width on large screens */}
      <div className="lg:col-span-2 space-y-6">
        {/* Agent Header Card */}
        <Card className="p-6 bg-[rgba(8,9,14,0.95)] border-none">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={agentData.image}
                className="w-16 h-16 rounded-xl object-cover"
                alt={agentData.name}
              />
              <div className="absolute -bottom-1 -right-1 bg-[#735EB5] rounded-full w-5 h-5 flex items-center justify-center">
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
                    href={`https://${agentData.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 text-sm hover:text-blue-400 transition-colors"
                  >
                    {agentData.website}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#4CBA69] rounded-full animate-pulse"></div>
                  <span className="text-[#4CBA69] font-medium">Live</span>
                  <span className="text-white ml-2 bg-[rgba(255,255,255,0.1)] px-2 py-1 rounded text-xs">
                    {agentData.timeRemaining}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Launch Status Card */}
        <Card className="p-6 bg-[rgba(8,9,14,0.95)] border-none">
          <h3 className="text-lg font-bold text-white mb-4">Launch Status</h3>
          <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
            <span>Total $ARMY Committed</span>
            <div className="flex items-center gap-2 text-white">
              <span>{agentData.totalVirtualCommitted} ARMY</span>
              <span className="text-xs text-gray-400">
                / {agentData.maxCommitment}
              </span>
              <span className="text-xs bg-[#4CBA69]/20 text-[#4CBA69] px-1.5 rounded">
                {agentData.completionPercentage}%
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <Progress
            value={agentData.completionPercentage}
            className="h-1.5 mb-6 bg-[rgba(255,255,255,0.1)]"
          />

          {/* Participants table */}
          <h3 className="text-lg font-bold text-white mb-4">
            {agentData.participantsCount} Participants
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-[rgba(255,255,255,0.05)]">
                  <th className="text-left py-2 font-medium">#</th>
                  <th className="text-left py-2 font-medium">Address</th>
                  <th className="text-right py-2 font-medium">
                    Points Pledged
                  </th>
                  <th className="text-right py-2 font-medium">
                    $ARMY committed
                  </th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr
                    key={participant.id}
                    className="border-b border-[rgba(255,255,255,0.05)] text-white text-sm hover:bg-[rgba(255,255,255,0.02)] transition-colors"
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
                <tr className="text-white text-sm hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-3">-</td>
                  <td className="py-3 font-medium text-blue-400">You</td>
                  <td className="py-3 text-right">0</td>
                  <td className="py-3 text-right">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Why This Agent Is Bullish */}
        <Card className="p-6 bg-[rgba(8,9,14,0.95)] border-none">
          <h3 className="text-lg font-bold text-white mb-4">
            Why This Agent Is Bullish
          </h3>
          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            {agentData.description}
          </p>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="flex items-center gap-2 hover:text-blue-400 transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </span>
              <span className="text-white">Twitter</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 hover:text-indigo-400 transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </span>
              <span className="text-white">Discord</span>
            </a>
          </div>

          <div className="mt-6 flex items-center gap-4 text-xs">
            <div className="text-gray-400">
              FRAMEWORKS: <span className="text-[#735EB5]">Gov Framework</span>
            </div>
            <div className="text-gray-400">
              CONTRIBUTORS: <span className="text-green-400">89%</span>
            </div>
          </div>
        </Card>

        {/* Submit Alpha Thesis */}
        <Card className="p-6 bg-[rgba(8,9,14,0.95)] border-none flex items-center justify-between group hover:bg-[rgba(12,13,20,0.95)] transition-colors cursor-pointer">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              Submit your Alpha Thesis
            </h3>
            <p className="text-gray-400 text-sm">Help this agent stand out</p>
          </div>
          <div className="bg-[#735EB5]/10 rounded-full p-2 text-[#735EB5] group-hover:text-[#735EB5]/80 group-hover:bg-[#735EB5]/20 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </Card>

        {/* Tabs Navigation and Content */}
        <Tabs defaultValue="team" className="w-full">
          <TabsList className="mb-6 bg-transparent border-b border-[rgba(255,255,255,0.1)] w-full justify-start h-auto rounded-none">
            <TabsTrigger
              value="team"
              className="px-6 py-3 text-sm data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#735EB5] data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none"
            >
              Team Details
            </TabsTrigger>
            <TabsTrigger
              value="project"
              className="px-6 py-3 text-sm data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#735EB5] data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none"
            >
              Project Details
            </TabsTrigger>
            <TabsTrigger
              value="tokenomics"
              className="px-6 py-3 text-sm data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#735EB5] data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none"
            >
              Tokenomics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="mt-0">
            <Card className="p-6 bg-[rgba(8,9,14,0.95)] border-none">
              <h3 className="text-lg font-bold text-white mb-4">
                Team Details
              </h3>
              <div className="flex flex-wrap gap-8">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-[rgba(255,255,255,0.1)]">
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
                      <button className="text-gray-400 hover:text-blue-400 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-indigo-400 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="project" className="mt-0">
            <Card className="p-6 bg-[rgba(8,9,14,0.95)] border-none">
              <h3 className="text-lg font-bold text-white mb-4">
                Project Details
              </h3>
              <p className="text-gray-300 text-sm">
                Project details content will be displayed here once available.
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">
                    Technology Stack
                  </h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#735EB5] rounded-full"></span>
                      Multiagent Army Integration
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#735EB5] rounded-full"></span>
                      AI Engine (GPT-based)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#735EB5] rounded-full"></span>
                      Blockchain Security
                    </li>
                  </ul>
                </div>

                <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Market Focus</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      Decentralized Applications
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      Community Governance
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      Token Utility
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tokenomics" className="mt-0">
            <Card className="p-6 bg-[rgba(8,9,14,0.95)] border-none relative overflow-hidden">
              {/* Subtle background gradient effect */}
              <div className="absolute inset-0 bg-gradient-radial from-[rgba(115,94,181,0.07)] to-transparent opacity-70"></div>

              {/* Top design element */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[rgba(115,94,181,0.8)] via-[rgba(76,186,105,0.8)] to-[rgba(249,108,36,0.8)]"></div>

              <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-3 relative group">
                <div className="relative transition-transform duration-700 group-hover:rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[rgba(115,94,181,1)]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                  <div className="absolute inset-0 rounded-full bg-[rgba(115,94,181,0.3)] blur-md -z-10 group-hover:bg-[rgba(115,94,181,0.5)] transition-colors duration-500"></div>
                </div>
                <div className="relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-[rgba(115,94,181,0.8)]">
                    Tokenomics Overview
                  </span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[rgba(115,94,181,0.8)] to-[rgba(76,186,105,0.8)] group-hover:w-full transition-all duration-700"></div>
                </div>
                <div className="hidden md:flex items-center ml-2 bg-[rgba(255,255,255,0.05)] px-2 py-1 rounded-full">
                  <span className="text-xs font-medium text-gray-300">
                    Token Type:
                  </span>
                  <span className="text-xs font-mono ml-1 text-[rgba(76,186,105,1)]">
                    UTILITY
                  </span>
                </div>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
                <div>
                  <h4 className="text-white font-medium mb-4 flex items-center gap-2 relative">
                    <div className="flex items-center space-x-1">
                      <span className="inline-block w-1.5 h-1.5 bg-[rgba(115,94,181,1)] rounded-full animate-pulse"></span>
                      <span className="inline-block w-1.5 h-1.5 bg-[rgba(76,186,105,1)] rounded-full animate-pulse delay-150"></span>
                      <span className="inline-block w-1.5 h-1.5 bg-[rgba(249,108,36,1)] rounded-full animate-pulse delay-300"></span>
                    </div>
                    <span className="text-base font-semibold ml-1 tracking-wide">
                      Token Distribution
                    </span>
                    <span className="text-xs text-gray-400 font-normal ml-2 bg-[rgba(255,255,255,0.08)] px-2 py-0.5 rounded-full">
                      Interactive Chart
                    </span>
                  </h4>
                  <div className="bg-[rgba(255,255,255,0.05)] rounded-xl p-6 relative backdrop-blur-sm border border-[rgba(255,255,255,0.06)] shadow-xl shadow-[rgba(0,0,0,0.2)] hover:shadow-[rgba(115,94,181,0.1)] transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[rgba(115,94,181,0.8)] via-[rgba(76,186,105,0.8)] to-[rgba(249,108,36,0.8)]"></div>
                    {/* Ultra-premium perfectly circular donut chart with enhanced animations */}
                    <div className="flex justify-center mb-10">
                      <div className="relative w-64 h-64 transform hover:scale-105 transition-transform duration-700">
                        {/* Ultra-precise donut chart with circular mask */}
                        <svg
                          viewBox="0 0 100 100"
                          className="w-full h-full filter drop-shadow-lg"
                        >
                          {/* Base circle - ensures perfect roundness with subtle texture */}
                          <defs>
                            <linearGradient
                              id="baseGradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="rgba(8,9,14,0.3)" />
                              <stop
                                offset="100%"
                                stopColor="rgba(8,9,14,0.1)"
                              />
                            </linearGradient>
                            <filter id="glow">
                              <feGaussianBlur
                                stdDeviation="2.5"
                                result="blur"
                              />
                              <feComposite
                                in="SourceGraphic"
                                in2="blur"
                                operator="over"
                              />
                            </filter>
                            <filter id="hover-shadow">
                              <feDropShadow
                                dx="0"
                                dy="0"
                                stdDeviation="3"
                                floodColor="rgba(115,94,181,0.9)"
                              />
                            </filter>
                            <radialGradient
                              id="highlight"
                              cx="50%"
                              cy="50%"
                              r="50%"
                              fx="50%"
                              fy="50%"
                            >
                              <stop
                                offset="0%"
                                stopColor="rgba(255,255,255,0.2)"
                              />
                              <stop
                                offset="100%"
                                stopColor="rgba(255,255,255,0)"
                              />
                            </radialGradient>
                          </defs>

                          <circle
                            cx="50"
                            cy="50"
                            r="50"
                            fill="url(#baseGradient)"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="50"
                            fill="url(#highlight)"
                            className="opacity-0 hover:opacity-100 transition-opacity duration-700"
                          />

                          {/* Enhanced donut chart with stroke-dasharray technique and premium effects */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="rgba(115,94,181,1)"
                            strokeWidth="20"
                            strokeDasharray="234 100"
                            strokeDashoffset="0"
                            className="transform -rotate-90 origin-center transition-all duration-700 hover:stroke-[rgba(115,94,181,0.9)] hover:filter hover:brightness-125"
                            style={{
                              filter:
                                "drop-shadow(0 0 4px rgba(115,94,181,0.7))",
                            }}
                            data-segment="community"
                          >
                            <animate
                              attributeName="stroke-dashoffset"
                              from="-10"
                              to="0"
                              dur="1.5s"
                              begin="0s"
                              fill="freeze"
                            />
                            <animate
                              attributeName="stroke-width"
                              values="20;22;20"
                              dur="2s"
                              repeatCount="indefinite"
                              begin="mouseover"
                            />
                            <title>Community Pool: 65%</title>
                          </circle>
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="rgba(121,98,217,1)"
                            strokeWidth="20"
                            strokeDasharray="72 262"
                            strokeDashoffset="-234"
                            className="transform -rotate-90 origin-center transition-all duration-700 hover:stroke-[rgba(121,98,217,0.9)] hover:filter hover:brightness-125"
                            style={{
                              filter:
                                "drop-shadow(0 0 4px rgba(121,98,217,0.7))",
                            }}
                            data-segment="team"
                          >
                            <animate
                              attributeName="stroke-dashoffset"
                              from="-244"
                              to="-234"
                              dur="1.5s"
                              begin="0.2s"
                              fill="freeze"
                            />
                            <animate
                              attributeName="stroke-width"
                              values="20;22;20"
                              dur="2s"
                              repeatCount="indefinite"
                              begin="mouseover"
                            />
                            <title>Team & Advisors: 20%</title>
                          </circle>
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="rgba(76,186,105,1)"
                            strokeWidth="20"
                            strokeDasharray="54 280"
                            strokeDashoffset="-306"
                            className="transform -rotate-90 origin-center transition-all duration-700 hover:stroke-[rgba(76,186,105,0.9)] hover:filter hover:brightness-125"
                            style={{
                              filter:
                                "drop-shadow(0 0 4px rgba(76,186,105,0.7))",
                            }}
                            data-segment="treasury"
                          >
                            <animate
                              attributeName="stroke-dashoffset"
                              from="-316"
                              to="-306"
                              dur="1.5s"
                              begin="0.4s"
                              fill="freeze"
                            />
                            <animate
                              attributeName="stroke-width"
                              values="20;22;20"
                              dur="2s"
                              repeatCount="indefinite"
                              begin="mouseover"
                            />
                            <title>Treasury Fund: 15%</title>
                          </circle>
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="rgba(83,227,122,1)"
                            strokeWidth="20"
                            strokeDasharray="36 298"
                            strokeDashoffset="-360"
                            className="transform -rotate-90 origin-center transition-all duration-700 hover:stroke-[rgba(83,227,122,0.9)] hover:filter hover:brightness-125"
                            style={{
                              filter:
                                "drop-shadow(0 0 4px rgba(83,227,122,0.7))",
                            }}
                            data-segment="staking"
                          >
                            <animate
                              attributeName="stroke-dashoffset"
                              from="-370"
                              to="-360"
                              dur="1.5s"
                              begin="0.6s"
                              fill="freeze"
                            />
                            <animate
                              attributeName="stroke-width"
                              values="20;22;20"
                              dur="2s"
                              repeatCount="indefinite"
                              begin="mouseover"
                            />
                            <title>Staking Rewards: 10%</title>
                          </circle>
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="rgba(249,108,36,1)"
                            strokeWidth="20"
                            strokeDasharray="36 298"
                            strokeDashoffset="-396"
                            className="transform -rotate-90 origin-center transition-all duration-700 hover:stroke-[rgba(249,108,36,0.9)] hover:filter hover:brightness-125"
                            style={{
                              filter:
                                "drop-shadow(0 0 4px rgba(249,108,36,0.7))",
                            }}
                            data-segment="partnerships"
                          >
                            <animate
                              attributeName="stroke-dashoffset"
                              from="-406"
                              to="-396"
                              dur="1.5s"
                              begin="0.8s"
                              fill="freeze"
                            />
                            <animate
                              attributeName="stroke-width"
                              values="20;22;20"
                              dur="2s"
                              repeatCount="indefinite"
                              begin="mouseover"
                            />
                            <title>Strategic Partnerships: 10%</title>
                          </circle>

                          {/* Premium inner circle with token info - enhanced with glass effect */}
                          <circle
                            cx="50"
                            cy="50"
                            r="30"
                            fill="rgba(8,9,14,0.95)"
                            className="stroke-[rgba(255,255,255,0.2)] stroke-1"
                          >
                            <animate
                              attributeName="r"
                              values="28;30;28"
                              dur="3s"
                              repeatCount="indefinite"
                            />
                          </circle>

                          {/* Token symbol - larger and more prominent with animation */}
                          <text
                            x="50"
                            y="45"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-white font-bold"
                            style={{ fontSize: "12px" }}
                          >
                            {agentData.symbol}
                            <animate
                              attributeName="opacity"
                              values="0;1"
                              dur="2s"
                              begin="1s"
                              fill="freeze"
                            />
                            <animate
                              attributeName="font-size"
                              values="10;12;10"
                              dur="4s"
                              repeatCount="indefinite"
                              begin="2s"
                            />
                          </text>

                          {/* Token name - improved style with animation */}
                          <text
                            x="50"
                            y="55"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-gray-400"
                            style={{ fontSize: "7px" }}
                          >
                            TOKEN
                            <animate
                              attributeName="opacity"
                              values="0;1"
                              dur="2s"
                              begin="1.2s"
                              fill="freeze"
                            />
                          </text>
                        </svg>

                        {/* Premium glowing effect with animation */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[rgba(115,94,181,0.6)] via-[rgba(76,186,105,0.6)] to-[rgba(249,108,36,0.6)] opacity-20 blur-xl -z-10 animate-pulse"></div>

                        {/* Improved percentage labels directly on chart with enhanced tooltips */}
                        <div
                          className="absolute top-3 left-1/2 transform -translate-x-1/2 text-white font-bold text-xs bg-[rgba(115,94,181,0.9)] px-3 py-1 rounded-full shadow-lg shadow-[rgba(115,94,181,0.3)] hover:bg-[rgba(115,94,181,1)] hover:scale-110 transition-all cursor-pointer flex items-center gap-1.5 opacity-0 animate-fadeIn"
                          style={{
                            animationDelay: "1.5s",
                            animationFillMode: "forwards",
                          }}
                        >
                          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                          65%
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-max bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                            Community Pool
                          </div>
                        </div>
                        <div
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white font-bold text-xs bg-[rgba(121,98,217,0.9)] px-3 py-1 rounded-full shadow-lg shadow-[rgba(121,98,217,0.3)] hover:bg-[rgba(121,98,217,1)] hover:scale-110 transition-all cursor-pointer flex items-center gap-1.5 opacity-0 animate-fadeIn"
                          style={{
                            animationDelay: "1.7s",
                            animationFillMode: "forwards",
                          }}
                        >
                          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                          20%
                          <div className="absolute top-1/2 right-full transform -translate-y-1/2 mr-1 w-max bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                            Team & Advisors
                          </div>
                        </div>
                        <div
                          className="absolute bottom-10 right-8 text-white font-bold text-xs bg-[rgba(76,186,105,0.9)] px-3 py-1 rounded-full shadow-lg shadow-[rgba(76,186,105,0.3)] hover:bg-[rgba(76,186,105,1)] hover:scale-110 transition-all cursor-pointer flex items-center gap-1.5 opacity-0 animate-fadeIn"
                          style={{
                            animationDelay: "1.9s",
                            animationFillMode: "forwards",
                          }}
                        >
                          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                          15%
                          <div className="absolute bottom-full right-0 mb-1 w-max bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                            Treasury Fund
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ultra-premium card-based legend with glass morphism and enhanced interactivity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="bg-gradient-to-br from-[rgba(115,94,181,0.15)] to-[rgba(115,94,181,0.05)] rounded-xl p-4 transition-all hover:bg-[rgba(115,94,181,0.18)] hover:-translate-y-[3px] hover:shadow-xl hover:shadow-[rgba(115,94,181,0.15)] cursor-pointer group border border-[rgba(115,94,181,0.15)] relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 w-16 h-16 bg-[rgba(115,94,181,0.3)] rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity"></div>
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                          <div className="w-5 h-5 bg-[rgba(115,94,181,1)] rounded-full flex-shrink-0 shadow-md shadow-[rgba(115,94,181,0.3)] group-hover:scale-110 transition-transform group-hover:animate-pulse"></div>
                          <span className="text-white text-sm font-semibold tracking-wide group-hover:text-[rgba(115,94,181,0.9)]">
                            Community Pool
                          </span>
                          <span className="ml-auto text-white text-sm font-bold bg-[rgba(115,94,181,0.3)] px-2 py-0.5 rounded-full group-hover:bg-[rgba(115,94,181,0.5)] transition-all">
                            65%
                          </span>
                        </div>
                        <div className="flex items-center justify-between pl-8 relative z-10">
                          <span className="text-gray-400 text-xs">
                            Total Allocation
                          </span>
                          <span className="text-[rgba(115,94,181,1)] text-xs font-medium">
                            3,250,000{" "}
                            <span className="text-white font-semibold">
                              {agentData.symbol}
                            </span>
                          </span>
                        </div>
                        <div className="mt-2 pl-8 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Initial unlocked:{" "}
                          <span className="text-white">10%</span> • Vesting:{" "}
                          <span className="text-white">24 months</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-[rgba(121,98,217,0.15)] to-[rgba(121,98,217,0.05)] rounded-xl p-4 transition-all hover:bg-[rgba(121,98,217,0.18)] hover:-translate-y-[3px] hover:shadow-xl hover:shadow-[rgba(121,98,217,0.15)] cursor-pointer group border border-[rgba(121,98,217,0.15)] relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 w-16 h-16 bg-[rgba(121,98,217,0.3)] rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity"></div>
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                          <div className="w-5 h-5 bg-[rgba(121,98,217,1)] rounded-full flex-shrink-0 shadow-md shadow-[rgba(121,98,217,0.3)] group-hover:scale-110 transition-transform group-hover:animate-pulse"></div>
                          <span className="text-white text-sm font-semibold tracking-wide group-hover:text-[rgba(121,98,217,0.9)]">
                            Team & Advisors
                          </span>
                          <span className="ml-auto text-white text-sm font-bold bg-[rgba(121,98,217,0.3)] px-2 py-0.5 rounded-full group-hover:bg-[rgba(121,98,217,0.5)] transition-all">
                            20%
                          </span>
                        </div>
                        <div className="flex items-center justify-between pl-8 relative z-10">
                          <span className="text-gray-400 text-xs">
                            Total Allocation
                          </span>
                          <span className="text-[rgba(121,98,217,1)] text-xs font-medium">
                            1,000,000{" "}
                            <span className="text-white font-semibold">
                              {agentData.symbol}
                            </span>
                          </span>
                        </div>
                        <div className="mt-2 pl-8 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Initial unlocked:{" "}
                          <span className="text-white">0%</span> • Vesting:{" "}
                          <span className="text-white">36 months</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-[rgba(76,186,105,0.15)] to-[rgba(76,186,105,0.05)] rounded-xl p-4 transition-all hover:bg-[rgba(76,186,105,0.18)] hover:-translate-y-[3px] hover:shadow-xl hover:shadow-[rgba(76,186,105,0.15)] cursor-pointer group border border-[rgba(76,186,105,0.15)] relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 w-16 h-16 bg-[rgba(76,186,105,0.3)] rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity"></div>
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                          <div className="w-5 h-5 bg-[rgba(76,186,105,1)] rounded-full flex-shrink-0 shadow-md shadow-[rgba(76,186,105,0.3)] group-hover:scale-110 transition-transform group-hover:animate-pulse"></div>
                          <span className="text-white text-sm font-semibold tracking-wide group-hover:text-[rgba(76,186,105,0.9)]">
                            Treasury Fund
                          </span>
                          <span className="ml-auto text-white text-sm font-bold bg-[rgba(76,186,105,0.3)] px-2 py-0.5 rounded-full group-hover:bg-[rgba(76,186,105,0.5)] transition-all">
                            15%
                          </span>
                        </div>
                        <div className="flex items-center justify-between pl-8 relative z-10">
                          <span className="text-gray-400 text-xs">
                            Total Allocation
                          </span>
                          <span className="text-[rgba(76,186,105,1)] text-xs font-medium">
                            750,000{" "}
                            <span className="text-white font-semibold">
                              {agentData.symbol}
                            </span>
                          </span>
                        </div>
                        <div className="mt-2 pl-8 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Initial unlocked:{" "}
                          <span className="text-white">5%</span> • Usage:{" "}
                          <span className="text-white">Development</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-[rgba(83,227,122,0.15)] to-[rgba(83,227,122,0.05)] rounded-xl p-4 transition-all hover:bg-[rgba(83,227,122,0.18)] hover:-translate-y-[3px] hover:shadow-xl hover:shadow-[rgba(83,227,122,0.15)] cursor-pointer group border border-[rgba(83,227,122,0.15)] relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 w-16 h-16 bg-[rgba(83,227,122,0.3)] rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity"></div>
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                          <div className="w-5 h-5 bg-[rgba(83,227,122,1)] rounded-full flex-shrink-0 shadow-md shadow-[rgba(83,227,122,0.3)] group-hover:scale-110 transition-transform group-hover:animate-pulse"></div>
                          <span className="text-white text-sm font-semibold tracking-wide group-hover:text-[rgba(83,227,122,0.9)]">
                            Staking Rewards
                          </span>
                          <span className="ml-auto text-white text-sm font-bold bg-[rgba(83,227,122,0.3)] px-2 py-0.5 rounded-full group-hover:bg-[rgba(83,227,122,0.5)] transition-all">
                            10%
                          </span>
                        </div>
                        <div className="flex items-center justify-between pl-8 relative z-10">
                          <span className="text-gray-400 text-xs">
                            Total Allocation
                          </span>
                          <span className="text-[rgba(83,227,122,1)] text-xs font-medium">
                            500,000{" "}
                            <span className="text-white font-semibold">
                              {agentData.symbol}
                            </span>
                          </span>
                        </div>
                        <div className="mt-2 pl-8 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Release: <span className="text-white">Linear</span> •
                          Duration:{" "}
                          <span className="text-white">60 months</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-[rgba(249,108,36,0.15)] to-[rgba(249,108,36,0.05)] rounded-xl p-4 transition-all hover:bg-[rgba(249,108,36,0.18)] hover:-translate-y-[3px] hover:shadow-xl hover:shadow-[rgba(249,108,36,0.15)] cursor-pointer group border border-[rgba(249,108,36,0.15)] sm:col-span-2 relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 w-16 h-16 bg-[rgba(249,108,36,0.3)] rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity"></div>
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                          <div className="w-5 h-5 bg-[rgba(249,108,36,1)] rounded-full flex-shrink-0 shadow-md shadow-[rgba(249,108,36,0.3)] group-hover:scale-110 transition-transform group-hover:animate-pulse"></div>
                          <span className="text-white text-sm font-semibold tracking-wide group-hover:text-[rgba(249,108,36,0.9)]">
                            Strategic Partnerships
                          </span>
                          <span className="ml-auto text-white text-sm font-bold bg-[rgba(249,108,36,0.3)] px-2 py-0.5 rounded-full group-hover:bg-[rgba(249,108,36,0.5)] transition-all">
                            10%
                          </span>
                        </div>
                        <div className="flex items-center justify-between pl-8 relative z-10">
                          <span className="text-gray-400 text-xs">
                            Total Allocation
                          </span>
                          <span className="text-[rgba(249,108,36,1)] text-xs font-medium">
                            500,000{" "}
                            <span className="text-white font-semibold">
                              {agentData.symbol}
                            </span>
                          </span>
                        </div>
                        <div className="mt-2 pl-8 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Initial unlocked:{" "}
                          <span className="text-white">20%</span> • Vesting:{" "}
                          <span className="text-white">12 months</span>
                        </div>
                      </div>

                      {/* Premium total supply section with gradients, better styling and animations */}
                      <div className="mt-6 sm:col-span-2 bg-gradient-to-r from-[rgba(115,94,181,0.2)] to-[rgba(76,186,105,0.2)] rounded-xl p-5 border border-[rgba(255,255,255,0.1)] relative overflow-hidden group hover:shadow-lg hover:shadow-[rgba(115,94,181,0.15)] transition-all duration-500">
                        {/* Animated particle effects */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-radial from-[rgba(115,94,181,0.4)] to-transparent rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-radial from-[rgba(76,186,105,0.4)] to-transparent rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>

                        {/* Floating particles */}
                        <div className="absolute w-2 h-2 rounded-full bg-[rgba(115,94,181,0.7)] top-1/4 left-1/4 opacity-0 group-hover:opacity-100 transition-opacity animate-float"></div>
                        <div className="absolute w-1.5 h-1.5 rounded-full bg-[rgba(76,186,105,0.7)] top-3/4 left-2/3 opacity-0 group-hover:opacity-100 transition-opacity animate-float animation-delay-300"></div>
                        <div className="absolute w-1 h-1 rounded-full bg-[rgba(249,108,36,0.7)] top-1/2 left-1/3 opacity-0 group-hover:opacity-100 transition-opacity animate-float animation-delay-700"></div>

                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-[rgba(115,94,181,0.9)] to-[rgba(76,186,105,0.9)] p-2.5 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-white"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                <path
                                  fillRule="evenodd"
                                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.3)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </div>
                            <div>
                              <h4 className="text-white text-sm font-semibold group-hover:text-[rgba(115,94,181,0.9)] transition-colors">
                                Total Token Supply
                              </h4>
                              <p className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors">
                                Max cap for the token's lifetime
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2">
                              <span className="text-white text-xl font-bold tracking-tight group-hover:text-[rgba(115,94,181,0.9)] transition-colors group-hover:scale-105 transform-gpu">
                                5,000,000
                              </span>
                              <span className="bg-[rgba(115,94,181,0.3)] text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center gap-1 group-hover:bg-[rgba(115,94,181,0.5)] transition-all">
                                <span className="w-1.5 h-1.5 bg-[rgba(115,94,181,1)] rounded-full"></span>
                                {agentData.symbol}
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              <p className="text-gray-400 text-xs mr-1.5 group-hover:text-gray-300 transition-colors">
                                Fixed supply with no additional minting
                              </p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-[rgba(76,186,105,1)]"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-4 flex items-center gap-2 relative">
                    <div className="flex items-center space-x-1">
                      <span className="inline-block w-1.5 h-1.5 bg-[rgba(115,94,181,1)] rounded-full animate-pulse delay-75"></span>
                      <span className="inline-block w-1.5 h-1.5 bg-[rgba(76,186,105,1)] rounded-full animate-pulse delay-225"></span>
                      <span className="inline-block w-1.5 h-1.5 bg-[rgba(249,108,36,1)] rounded-full animate-pulse delay-375"></span>
                    </div>
                    <span className="text-base font-semibold ml-1 tracking-wide">
                      Token Details
                    </span>
                    <span className="text-xs text-gray-400 font-normal ml-2 bg-[rgba(255,255,255,0.08)] px-2 py-0.5 rounded-full">
                      Key Metrics
                    </span>
                  </h4>
                  <div className="bg-[rgba(255,255,255,0.05)] rounded-xl p-6 space-y-4 h-full flex flex-col justify-between backdrop-blur-sm border border-[rgba(255,255,255,0.06)] shadow-xl shadow-[rgba(0,0,0,0.2)] hover:shadow-[rgba(115,94,181,0.1)] transition-all duration-500 overflow-hidden relative">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[rgba(115,94,181,0.8)] via-[rgba(76,186,105,0.8)] to-[rgba(249,108,36,0.8)]"></div>

                    {/* Premium token card with enhanced styling */}
                    <div className="p-5 border border-[rgba(255,255,255,0.15)] rounded-xl bg-gradient-to-b from-[rgba(115,94,181,0.15)] to-[rgba(8,9,14,0.5)] flex items-center gap-5 relative overflow-hidden group hover:shadow-lg hover:shadow-[rgba(115,94,181,0.1)] transition-all duration-300">
                      <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-radial from-[rgba(115,94,181,0.4)] to-transparent rounded-full blur-xl opacity-30"></div>
                      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-radial from-[rgba(76,186,105,0.4)] to-transparent rounded-full blur-xl opacity-30"></div>

                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[rgba(115,94,181,0.9)] to-[rgba(115,94,181,0.7)] flex items-center justify-center overflow-hidden ring-2 ring-[rgba(255,255,255,0.2)] ring-offset-2 ring-offset-[rgba(8,9,14,0.9)] group-hover:scale-105 transition-transform">
                        <img
                          src={agentData.image}
                          alt={agentData.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="z-10">
                        <h5 className="text-white font-semibold text-lg mb-1 tracking-wide group-hover:text-[rgba(115,94,181,0.9)] transition-colors">
                          {agentData.name}
                        </h5>
                        <div className="flex items-center gap-2">
                          <p className="text-[#A394DB] text-sm font-medium">
                            {agentData.symbol}
                          </p>
                          <span className="bg-[rgba(115,94,181,0.25)] text-white px-2.5 py-0.5 rounded-full text-xs font-medium">
                            UTILITY TOKEN
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mt-5">
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] rounded-xl hover:from-[rgba(255,255,255,0.07)] hover:to-[rgba(255,255,255,0.04)] transition-colors cursor-pointer group border border-[rgba(255,255,255,0.08)]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[rgba(115,94,181,0.2)] flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-[rgba(115,94,181,1)]"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                              <path
                                fillRule="evenodd"
                                d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">
                            Total Supply
                          </span>
                        </div>
                        <span className="text-white text-sm font-medium bg-[rgba(115,94,181,0.2)] px-3.5 py-1.5 rounded-lg flex items-center gap-2 group-hover:bg-[rgba(115,94,181,0.3)] transition-colors">
                          <span className="h-1.5 w-1.5 bg-[rgba(115,94,181,1)] rounded-full"></span>
                          5,000,000 {agentData.symbol}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] rounded-xl hover:from-[rgba(255,255,255,0.07)] hover:to-[rgba(255,255,255,0.04)] transition-colors cursor-pointer group border border-[rgba(255,255,255,0.08)]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[rgba(76,186,105,0.2)] flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-[rgba(76,186,105,1)]"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 4a1 1 0 000 2 1 1 0 011 1v1H7a1 1 0 000 2h1v3a3 3 0 106 0v-1a1 1 0 10-2 0v1a1 1 0 11-2 0v-3h3a1 1 0 100-2h-3V7a3 3 0 00-3-3H7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">
                            Initial Market Cap
                          </span>
                        </div>
                        <span className="text-white text-sm font-medium bg-[rgba(76,186,105,0.2)] px-3.5 py-1.5 rounded-lg flex items-center gap-2 group-hover:bg-[rgba(76,186,105,0.3)] transition-colors">
                          <span className="h-1.5 w-1.5 bg-[rgba(76,186,105,1)] rounded-full"></span>
                          $1,200,000
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] rounded-xl hover:from-[rgba(255,255,255,0.07)] hover:to-[rgba(255,255,255,0.04)] transition-colors cursor-pointer group border border-[rgba(255,255,255,0.08)]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[rgba(83,227,122,0.2)] flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-[rgba(83,227,122,1)]"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">
                            Annual Staking APR
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-[rgba(83,227,122,0.2)] text-white px-3.5 py-1.5 rounded-lg text-sm font-medium group-hover:bg-[rgba(83,227,122,0.3)] transition-colors flex items-center gap-2">
                            <span className="h-1.5 w-1.5 bg-[rgba(83,227,122,1)] rounded-full"></span>
                            12% - 18%
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-[rgba(83,227,122,1)]"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] rounded-xl hover:from-[rgba(255,255,255,0.07)] hover:to-[rgba(255,255,255,0.04)] transition-colors cursor-pointer group border border-[rgba(255,255,255,0.08)]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.2)] flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">
                            Blockchain Network
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.1)] px-3.5 py-1.5 rounded-lg group-hover:bg-[rgba(255,255,255,0.15)] transition-colors">
                          <div className="w-6 h-6 rounded-full bg-white overflow-hidden shadow-md">
                            <svg
                              viewBox="0 0 128 128"
                              className="w-full h-full"
                            >
                              <path
                                fill="#fff"
                                d="M64 128C28.7 128 0 99.3 0 64S28.7 0 64 0s64 28.7 64 64-28.7 64-64 64z"
                              ></path>
                              <path
                                fill="#000"
                                d="M65.2 87.2h-7.4V59.1l-15.1 4.5v-6.6l21.5-8.2h1v38.4z"
                              ></path>
                              <path
                                fill="#000"
                                d="M85.6 59.2c0 3.6-.8 6.2-2.3 8-1.5 1.8-3.7 2.7-6.5 2.7-2.7 0-4.8-.9-6.3-2.6-1.5-1.7-2.3-4.4-2.4-7.9v-4.4c0-3.7.8-6.4 2.3-8.1 1.5-1.8 3.7-2.7 6.4-2.7 2.8 0 4.9.9 6.4 2.6 1.5 1.7 2.3 4.3 2.4 7.7v4.7zm-6.9-4.9c0-2-.3-3.6-.9-4.5-.6-1-1.5-1.5-2.8-1.5-1.2 0-2.1.5-2.7 1.4-.6.9-.9 2.2-1 4v6.1c0 2 .3 3.6.9 4.6.6 1 1.6 1.5 2.9 1.5 1.3 0 2.2-.5 2.7-1.4.6-.9.9-2.3.9-4.2v-6z"
                              ></path>
                            </svg>
                          </div>
                          <span className="text-white text-sm font-medium">
                            Internet Computer (ICP)
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] rounded-xl hover:from-[rgba(255,255,255,0.07)] hover:to-[rgba(255,255,255,0.04)] transition-colors cursor-pointer group border border-[rgba(255,255,255,0.08)]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[rgba(249,108,36,0.2)] flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-[rgba(249,108,36,1)]"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">
                            Token Launch Date
                          </span>
                        </div>
                        <span className="text-white text-sm font-medium bg-[rgba(249,108,36,0.2)] px-3.5 py-1.5 rounded-lg flex items-center gap-2 group-hover:bg-[rgba(249,108,36,0.3)] transition-colors">
                          <span className="h-1.5 w-1.5 bg-[rgba(249,108,36,1)] rounded-full"></span>
                          July 15, 2023
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-[rgba(115,94,181,1)]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                Vesting Schedule
              </h4>
              <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-6 backdrop-blur-sm border border-[rgba(255,255,255,0.03)]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.1)]">
                        <th className="text-left py-3 font-medium text-gray-300">
                          Allocation
                        </th>
                        <th className="text-center py-3 font-medium text-gray-300">
                          TGE
                        </th>
                        <th className="text-center py-3 font-medium text-gray-300">
                          Cliff
                        </th>
                        <th className="text-center py-3 font-medium text-gray-300">
                          Vesting
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <td className="py-4 text-white flex items-center gap-2">
                          <div className="w-2 h-2 rounded-sm bg-[#735EB5]"></div>
                          Community
                        </td>
                        <td className="py-4 text-center">
                          <span className="text-white px-2 py-1 bg-[rgba(255,255,255,0.05)] rounded">
                            10%
                          </span>
                        </td>
                        <td className="py-4 text-center text-gray-300">None</td>
                        <td className="py-4 text-center">
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-[rgba(255,255,255,0.05)] rounded">
                            <span className="h-1.5 w-1.5 bg-[#4CBA69] rounded-full"></span>
                            <span className="text-white">12 months</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <td className="py-4 text-white flex items-center gap-2">
                          <div className="w-2 h-2 rounded-sm bg-[#A394DB]"></div>
                          Team
                        </td>
                        <td className="py-4 text-center">
                          <span className="text-white px-2 py-1 bg-[rgba(255,255,255,0.05)] rounded">
                            0%
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-[rgba(255,255,255,0.05)] rounded">
                            <span className="h-1.5 w-1.5 bg-[#F96C24] rounded-full"></span>
                            <span className="text-white">12 months</span>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-[rgba(255,255,255,0.05)] rounded">
                            <span className="h-1.5 w-1.5 bg-[#4CBA69] rounded-full"></span>
                            <span className="text-white">24 months</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <td className="py-4 text-white flex items-center gap-2">
                          <div className="w-2 h-2 rounded-sm bg-[#4CBA69]"></div>
                          Treasury
                        </td>
                        <td className="py-4 text-center">
                          <span className="text-white px-2 py-1 bg-[rgba(255,255,255,0.05)] rounded">
                            5%
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-[rgba(255,255,255,0.05)] rounded">
                            <span className="h-1.5 w-1.5 bg-[#F96C24] rounded-full"></span>
                            <span className="text-white">3 months</span>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-[rgba(255,255,255,0.05)] rounded">
                            <span className="h-1.5 w-1.5 bg-[#4CBA69] rounded-full"></span>
                            <span className="text-white">18 months</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <td className="py-4 text-white flex items-center gap-2">
                          <div className="w-2 h-2 rounded-sm bg-[#F96C24]"></div>
                          Partners
                        </td>
                        <td className="py-4 text-center">
                          <span className="text-white px-2 py-1 bg-[rgba(255,255,255,0.05)] rounded">
                            0%
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-[rgba(255,255,255,0.05)] rounded">
                            <span className="h-1.5 w-1.5 bg-[#F96C24] rounded-full"></span>
                            <span className="text-white">6 months</span>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-[rgba(255,255,255,0.05)] rounded">
                            <span className="h-1.5 w-1.5 bg-[#4CBA69] rounded-full"></span>
                            <span className="text-white">12 months</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sidebar - 1/3 of width on large screens */}
      <div className="lg:col-span-1">
        <Card className="p-6 bg-[rgba(8,9,14,0.95)] border-none sticky top-4">
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
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#735EB5] text-xs hover:text-[rgba(95,78,150,1)] transition-colors"
              >
                Max
              </button>
            </div>
          </div>

          {/* Suggested ARMY to commit */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-gray-400 text-sm">
                Suggested $ARMY to commit
              </h4>
              <span className="text-white text-sm">≈ 0</span>
            </div>
          </div>

          {/* Commit ARMY */}
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
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#735EB5] text-xs hover:text-[rgba(95,78,150,1)] transition-colors"
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
          <button className="w-full bg-[#735EB5] hover:bg-[rgba(95,78,150,1)] text-white font-medium py-3 rounded-lg transition-colors">
            Commit
          </button>

          {/* How to Participate */}
          <div className="mt-8">
            <h4 className="text-white font-medium mb-4">How to Participate</h4>

            <div className="mb-4">
              <div className="flex gap-2 mb-1">
                <span className="text-[#735EB5] font-medium">1.</span>
                <h5 className="text-[#735EB5] font-medium">Pledge points</h5>
              </div>
              <p className="text-gray-400 text-xs ml-6">
                Pledge your Army Points to receive an allocation. You can pledge
                up to 5.0% of total supply.
              </p>
              <p className="text-gray-400 text-xs ml-6 mt-2">
                Your final allocation depends on your pledged points relative to
                the total points pledged.
              </p>
            </div>

            <div className="mb-4">
              <div className="flex gap-2 mb-1">
                <span className="text-[#735EB5] font-medium">2.</span>
                <h5 className="text-[#735EB5] font-medium">Commit $ARMY</h5>
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
                <span className="text-[#735EB5] font-medium">3.</span>
                <h5 className="text-[#735EB5] font-medium">
                  Claim your tokens
                </h5>
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
        </Card>
      </div>
    </div>
  );
};
