import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { agentRegistryService, Agent } from "@/lib/agent-registry-service";
import launchpadService, { TokenSale } from "@/lib/launchpad-service";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { Countdown } from "./Countdown";
import { formatBigInt, shortenAddress } from "@/lib/utils";
import { Principal } from "@dfinity/principal";

interface ParticipantItem {
  address: string;
  pointsPledged: number;
  virtualCommitted: number;
}

interface TeamMember {
  name: string;
  role: string;
  image?: string;
}

export const AgentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pledgeAmount, setPledgeAmount] = useState<string>("");
  const [commitAmount, setCommitAmount] = useState<string>("");
  const { toast } = useToast();
  const {
    isConnected,
    principalId,
    agent: walletAgent,
    connectInternetIdentity,
  } = useWallet();

  const [loading, setLoading] = useState(true);
  const [agentData, setAgentData] = useState<Agent | null>(null);
  const [tokenSale, setTokenSale] = useState<TokenSale | null>(null);
  const [userCommitment, setUserCommitment] = useState<bigint>(0n);
  const [userPointPledge, setUserPointPledge] = useState<bigint>(0n);
  const [participants, setParticipants] = useState<ParticipantItem[]>([]);
  const [maxPoints, setMaxPoints] = useState<number>(10000); // User's max points (could be fetched from backend)

  // Fetch token sale data for the agent
  const fetchTokenSale = useCallback(
    async (agent: Agent) => {
      try {
        // Use the new getSalesByAgentId method
        const agentSales = await launchpadService.getSalesByAgentId(id!);

        if (agentSales && agentSales.length > 0) {
          setTokenSale(agentSales[0]);

          // Get real participants from the sale
          const participants: ParticipantItem[] =
            agentSales[0].participants.map(([principal, amount]) => ({
              address: shortenAddress(principal.toString()),
              pointsPledged: 0, // Will be updated below if we have point data
              virtualCommitted: Number(formatBigInt(amount)),
            }));

          setParticipants(participants);

          // If user is connected, fetch their commitment and point pledges
          if (principalId) {
            const commitments = await launchpadService.getUserCommitments(
              Principal.fromText(principalId)
            );
            const userCommitment = commitments.find(
              (commitment) => commitment.saleId === agentSales[0].id
            );

            if (userCommitment) {
              setUserCommitment(userCommitment.amount);
            }

            // Fetch user's point pledges for this sale
            const userPrincipal = Principal.fromText(principalId);
            const pointPledge = await launchpadService.getUserPointPledges(
              agentSales[0].id,
              userPrincipal
            );
            setUserPointPledge(pointPledge);

            // Store the principal in localStorage for simulation purposes
            localStorage.setItem("userPrincipal", principalId);
          }
        } else {
          // No sales found
          setTokenSale(null);
          setParticipants([]);
          setUserCommitment(0n);
          setUserPointPledge(0n);
        }
      } catch (error) {
        console.error("Error fetching token sale:", error);
        toast({
          title: "Error",
          description: "Failed to load token sale data",
          variant: "destructive",
        });
      }
    },
    [id, principalId, toast]
  );

  // Initialize services when agent is available
  useEffect(() => {
    if (walletAgent) {
      agentRegistryService.initialize(walletAgent).catch(console.error);
      launchpadService.initialize(walletAgent).catch(console.error);
    }
  }, [walletAgent]);

  // Fetch agent data
  useEffect(() => {
    if (!id) return;

    const fetchAgentData = async () => {
      setLoading(true);
      try {
        const agent = await agentRegistryService.getAgent(id);
        if (agent) {
          setAgentData(agent);

          // If agent has a sale, fetch the sale data
          if (agent.saleCanisterId) {
            fetchTokenSale(agent);
          }
        } else {
          toast({
            title: "Agent not found",
            description: "Could not find the requested agent",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching agent:", error);
        toast({
          title: "Error",
          description: "Failed to load agent data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [id, toast, fetchTokenSale]);

  const handlePledgePoints = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to pledge points",
        variant: "default",
      });
      connectInternetIdentity();
      return;
    }

    if (!pledgeAmount || parseInt(pledgeAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to pledge",
        variant: "destructive",
      });
      return;
    }

    if (parseInt(pledgeAmount) > maxPoints) {
      toast({
        title: "Insufficient points",
        description: `You only have ${maxPoints} points available to pledge`,
        variant: "destructive",
      });
      return;
    }

    if (!tokenSale) {
      toast({
        title: "No active sale",
        description: "There is no active token sale for this agent",
        variant: "destructive",
      });
      return;
    }

    try {
      const pointsAmount = BigInt(parseInt(pledgeAmount));
      const result = await launchpadService.pledgePoints(
        tokenSale.id,
        pointsAmount
      );

      if (result.success) {
        toast({
          title: "Success",
          description: `Successfully pledged ${pledgeAmount} points to the sale`,
          variant: "default",
        });

        // Update user's point pledge
        setUserPointPledge(userPointPledge + pointsAmount);

        // Refresh token sale data
        if (agentData) {
          fetchTokenSale(agentData);
        }

        // Clear input
        setPledgeAmount("");
      } else {
        toast({
          title: "Transaction failed",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error pledging points:", error);
      toast({
        title: "Transaction error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleCommitArmy = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to commit ARMY tokens",
        variant: "default",
      });
      connectInternetIdentity();
      return;
    }

    if (!commitAmount || parseInt(commitAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to commit",
        variant: "destructive",
      });
      return;
    }

    if (!tokenSale) {
      toast({
        title: "No active sale",
        description: "There is no active token sale for this agent",
        variant: "destructive",
      });
      return;
    }

    try {
      const amount = BigInt(parseInt(commitAmount) * 10000000); // Convert to smallest units (assuming 8 decimals)
      const result = await launchpadService.commitToGenesisSale(
        tokenSale.id,
        amount
      );

      if (result.success) {
        toast({
          title: "Success",
          description: `Successfully committed ${commitAmount} ARMY to the sale`,
          variant: "default",
        });

        // Refresh token sale data
        if (agentData) {
          fetchTokenSale(agentData);
        }

        // Clear input
        setCommitAmount("");
      } else {
        toast({
          title: "Transaction failed",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error committing ARMY:", error);
      toast({
        title: "Transaction error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleClaimTokens = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to claim tokens",
        variant: "default",
      });
      connectInternetIdentity();
      return;
    }

    if (!tokenSale) {
      toast({
        title: "No sale found",
        description: "There is no token sale associated with this agent",
        variant: "destructive",
      });
      return;
    }

    if (tokenSale.status !== "successful") {
      toast({
        title: "Sale not successful",
        description: "Tokens can only be claimed after a successful sale",
        variant: "destructive",
      });
      return;
    }

    if (userCommitment <= 0n) {
      toast({
        title: "No commitment found",
        description: "You did not commit tokens to this sale",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await launchpadService.claimTokens(tokenSale.id);

      if (result.success) {
        toast({
          title: "Success",
          description: "Successfully claimed your tokens",
          variant: "default",
        });

        // Refresh token sale data
        if (agentData) {
          fetchTokenSale(agentData);
        }
      } else {
        toast({
          title: "Transaction failed",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error claiming tokens:", error);
      toast({
        title: "Transaction error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Helper functions
  const handleSetMaxPledge = () => {
    // Set maximum pledge amount based on user's available points
    setPledgeAmount(maxPoints.toString());
  };

  const handleSetMaxCommit = () => {
    // Set maximum commit amount
    // In a real app, this would be based on user's ARMY balance or the sale's max purchase
    if (tokenSale?.maxPurchase) {
      setCommitAmount(formatBigInt(tokenSale.maxPurchase / 10000000n)); // Convert to most human-readable form
    } else {
      setCommitAmount("500"); // Default fallback
    }
  };

  // Calculate launch time from launchDate
  const getLaunchTime = () => {
    if (!agentData?.launchDate)
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // Default to 24 hours from now

    return new Date(Number(agentData.launchDate) / 1000000); // Convert nanoseconds to milliseconds
  };

  // Calculate suggested allocation based on points pledged
  const calculateSuggestedAllocation = () => {
    if (
      !tokenSale ||
      tokenSale.status !== "active" ||
      !agentData?.totalSupply
    ) {
      return 0;
    }

    // Simulate allocation based on points pledged
    // In real app, this would use actual total points pledged from all users
    const totalSupply = Number(agentData.totalSupply);
    const maxAllocation = totalSupply * 0.005; // 0.5% of total supply

    // Simulate total points pledged as a function of time to show progression
    const totalPledged = Math.max(
      1,
      100000 + (Math.floor(Date.now() / 100000) % 900000)
    );

    // User's share
    const userPoints = Number(userPointPledge);
    const userShare = userPoints / totalPledged;

    // Calculate allocation, capped at maxAllocation
    return Math.min(maxAllocation, totalSupply * userShare);
  };

  const suggestedAllocation = calculateSuggestedAllocation();

  // Calculate how much ARMY to commit based on suggested allocation
  const calculateSuggestedCommitment = () => {
    if (!tokenSale || !suggestedAllocation) return "0";

    // price is per token unit in ARMY (e.g. price of 5 means 5 ARMY per token)
    const price = Number(tokenSale.price) / 10000000; // Convert to human-readable form
    const suggestedCommitment = suggestedAllocation * price;

    return Math.ceil(suggestedCommitment).toString();
  };

  // If loading or agent not found, show loading state
  if (loading || !agentData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[rgba(115,94,181,1)]"></div>
      </div>
    );
  }

  // Get the launch status
  const getLaunchStatus = () => {
    if (!tokenSale) return "upcoming";

    if (tokenSale.status === "active") return "live";
    if (tokenSale.status === "successful") return "successful";
    if (tokenSale.status === "failed") return "failed";
    return "upcoming";
  };

  const launchTime = getLaunchTime();
  const launchStatus = getLaunchStatus();

  // Progress calculation
  const progress = tokenSale
    ? Number(
        (BigInt(100) * tokenSale.raised) /
          (tokenSale.hardCap > 0n ? tokenSale.hardCap : 1n)
      )
    : 0;

  return (
    <div>
      {/* Agent Card */}
      <Card className="bg-[rgba(30,30,30,0.5)] border-none mb-8">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <img
              src={agentData.details?.imageUrl || "/placeholder.svg"}
              className="w-16 h-16 rounded-full bg-[rgba(115,94,181,0.3)]"
              alt={agentData.details?.name || "Agent"}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {agentData.details?.name || "Unnamed Agent"}
                </h2>
                <span className="text-gray-400">
                  ${agentData.details?.ticker || "AGENT"}
                </span>
              </div>
              <a
                href={
                  agentData.details?.websiteUrl
                    ? `https://${agentData.details.websiteUrl}`
                    : "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm"
              >
                {agentData.details?.websiteUrl || "No website"}
              </a>
            </div>
            <div className="ml-auto">
              <div className="bg-[rgba(115,94,181,0.1)] text-[rgba(115,94,181,1)] px-3 py-1 rounded-full text-sm font-medium uppercase">
                {launchStatus}
              </div>
              {launchStatus === "upcoming" && (
                <div className="text-gray-400 text-sm mt-1">
                  <Countdown targetDate={launchTime} />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span>
                {tokenSale ? formatBigInt(tokenSale.raised) : "0"} ARMY
                {tokenSale && (
                  <span className="text-gray-400">
                    / {formatBigInt(tokenSale.hardCap)}
                  </span>
                )}
              </span>
              <span>{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-3 w-full overflow-hidden rounded-full bg-[rgba(30,30,30,0.8)]"
            />
          </div>

          <div className="mt-4 text-right">
            {tokenSale && (
              <span className="text-gray-400">
                {tokenSale.participants ? tokenSale.participants.length : 0}{" "}
                Participants
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="bg-[rgba(30,30,30,0.5)] w-full">
              <TabsTrigger value="info" className="flex-1">
                Info
              </TabsTrigger>
              <TabsTrigger value="participants" className="flex-1">
                Participants
              </TabsTrigger>
              <TabsTrigger value="token" className="flex-1">
                Token
              </TabsTrigger>
            </TabsList>

            {/* Info Tab */}
            <TabsContent value="info">
              <Card className="bg-[rgba(30,30,30,0.5)] border-none">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Project Overview
                  </h3>
                  <p className="text-gray-300 mb-6">
                    {agentData.details?.agentOverview ||
                      "No overview available."}
                  </p>

                  <h3 className="text-lg font-bold text-white mb-4">Team</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agentData.teamMembers &&
                      agentData.teamMembers.map((member, index) => (
                        <div
                          key={index}
                          className="bg-[rgba(20,20,20,0.5)] p-4 rounded-lg flex items-center gap-3"
                        >
                          <div className="w-10 h-10 bg-[rgba(115,94,181,0.3)] rounded-full flex items-center justify-center text-white">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-white font-medium">
                              {member.name}
                            </h4>
                            <p className="text-gray-400 text-sm">
                              {member.role}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Participants Tab */}
            <TabsContent value="participants">
              <Card className="bg-[rgba(30,30,30,0.5)] border-none">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Participants
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="text-left">
                        <tr className="border-b border-[rgba(255,255,255,0.1)]">
                          <th className="pb-2 text-gray-400 font-medium">
                            Address
                          </th>
                          <th className="pb-2 text-gray-400 font-medium">
                            Points Pledged
                          </th>
                          <th className="pb-2 text-gray-400 font-medium">
                            Virtual Committed
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {participants.map((participant, index) => {
                          // For simulation purposes, generate random point pledges
                          const randomPoints =
                            Math.floor(Math.random() * 50000) + 10000;

                          return (
                            <tr
                              key={index}
                              className="border-b border-[rgba(255,255,255,0.05)]"
                            >
                              <td className="py-3 text-white">
                                {shortenAddress(participant.address)}
                              </td>
                              <td className="py-3 text-white">
                                {participant.address ===
                                shortenAddress(principalId || "")
                                  ? Number(userPointPledge).toLocaleString()
                                  : randomPoints.toLocaleString()}
                              </td>
                              <td className="py-3 text-white">
                                {participant.virtualCommitted}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Token Tab */}
            <TabsContent value="token">
              <Card className="bg-[rgba(30,30,30,0.5)] border-none">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Token Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-gray-400 mb-2">Name</h4>
                      <p className="text-white font-medium">
                        {agentData.details?.name || "Unnamed Agent"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-gray-400 mb-2">Symbol</h4>
                      <p className="text-white font-medium">
                        ${agentData.details?.ticker || "AGENT"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-gray-400 mb-2">Total Supply</h4>
                      <p className="text-white font-medium">
                        {agentData.totalSupply
                          ? formatBigInt(agentData.totalSupply)
                          : "1,000,000"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-gray-400 mb-2">Launch Type</h4>
                      <p className="text-white font-medium capitalize">
                        {agentData.details?.launchType
                          ? Object.keys(agentData.details.launchType)[0]
                          : "Genesis"}
                      </p>
                    </div>
                    {agentData.tokenDistribution && (
                      <>
                        <div>
                          <h4 className="text-gray-400 mb-2">Developer</h4>
                          <p className="text-white font-medium">
                            {agentData.tokenDistribution.developer}%
                          </p>
                        </div>
                        <div>
                          <h4 className="text-gray-400 mb-2">Public Sale</h4>
                          <p className="text-white font-medium">
                            {agentData.tokenDistribution.publicSale}%
                          </p>
                        </div>
                        <div>
                          <h4 className="text-gray-400 mb-2">Liquidity Pool</h4>
                          <p className="text-white font-medium">
                            {agentData.tokenDistribution.liquidityPool}%
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Participation Panel */}
        <div>
          <Card className="bg-[rgba(30,30,30,0.5)] border-none sticky top-4">
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Join the Launch
              </h3>
              <div className="bg-[rgba(20,20,20,0.5)] p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400">Your Points</span>
                  <span className="text-white">
                    {maxPoints - Number(userPointPledge)}
                  </span>
                </div>
                {userPointPledge > 0n && (
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-400">Points Pledged</span>
                    <span className="text-white">
                      {userPointPledge.toString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Your ARMY</span>
                  <span className="text-white">420</span>
                </div>
                {userCommitment > 0n && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">ARMY Committed</span>
                    <span className="text-white">
                      {formatBigInt(userCommitment)}
                    </span>
                  </div>
                )}
              </div>{" "}
              <div className="space-y-6">
                <div>
                  <div className="flex gap-2 mb-1">
                    <span className="text-[#735EB5] font-medium">1.</span>
                    <h5 className="text-[#735EB5] font-medium">
                      Pledge Points
                    </h5>
                  </div>
                  <p className="text-gray-400 text-xs ml-6">
                    Pledge your Army Points to receive an estimated token
                    allocation up to a cap of 0.5% of total supply.
                  </p>
                  <p className="text-gray-400 text-xs ml-6 mt-2">
                    Your final allocation depends on your pledged points
                    relative to the total points pledged.
                  </p>
                  <p className="text-gray-400 text-xs ml-6 mt-2">
                    Over-pledging increases your chance of reaching the max
                    allocation.
                  </p>
                  <p className="text-gray-400 text-xs ml-6 mt-2">
                    If the Genesis Launch succeeds, only the points used for
                    your allocation are burned. The rest are refunded.
                  </p>
                </div>

                <div className="mb-4">
                  <div className="flex gap-2 mb-1">
                    <span className="text-[#735EB5] font-medium">2.</span>
                    <h5 className="text-[#735EB5] font-medium">Commit $ARMY</h5>
                  </div>
                  <p className="text-gray-400 text-xs ml-6">
                    Commit up to{" "}
                    {tokenSale?.maxPurchase
                      ? formatBigInt(tokenSale.maxPurchase / 10000000n)
                      : "500"}{" "}
                    $ARMY to potentially secure your maximum allocation.
                  </p>
                  <p className="text-gray-400 text-xs ml-6 mt-2">
                    If participation exceeds expectations, your allocation will
                    be diluted and any excess $ARMY will be refunded.
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
                    Go to the Agent page once the Genesis Launch succeeds to
                    claim your purchased tokens.
                  </p>
                  <p className="text-gray-400 text-xs ml-6 mt-2">
                    If the launch fails, all points and $ARMY will be refunded.
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {/* Pledge Points Form */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">
                    Pledge Points
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={pledgeAmount}
                      onChange={(e) => setPledgeAmount(e.target.value)}
                      className="flex-1 bg-[rgba(20,20,20,0.8)] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[rgba(115,94,181,1)]"
                      placeholder="0"
                    />
                    <button
                      className="text-[rgba(115,94,181,1)] border border-[rgba(115,94,181,1)] rounded-lg px-3"
                      onClick={handleSetMaxPledge}
                    >
                      MAX
                    </button>
                  </div>
                  <button
                    onClick={handlePledgePoints}
                    className="w-full bg-[rgba(115,94,181,1)] hover:bg-[rgba(95,78,150,1)] text-white py-2 rounded-lg mt-2 transition-colors"
                  >
                    Pledge Points
                  </button>
                </div>

                {/* Estimated allocation section - only show if user has pledged points */}
                {userPointPledge > 0n && tokenSale?.status === "active" && (
                  <div className="my-4 p-4 bg-[rgba(115,94,181,0.1)] rounded-lg">
                    <h5 className="text-[#735EB5] font-medium mb-2">
                      Estimated Allocation
                    </h5>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-400">Tokens</span>
                      <span className="text-white">
                        {Math.floor(suggestedAllocation).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-400">ARMY to commit</span>
                      <span className="text-white">
                        {calculateSuggestedCommitment()}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setCommitAmount(calculateSuggestedCommitment())
                      }
                      className="w-full bg-[rgba(115,94,181,0.5)] hover:bg-[rgba(115,94,181,0.8)] text-white py-2 rounded-lg transition-colors text-sm"
                    >
                      Use Suggested Amount
                    </button>
                  </div>
                )}

                {/* Commit ARMY Form */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">
                    Commit $ARMY
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={commitAmount}
                      onChange={(e) => setCommitAmount(e.target.value)}
                      className="flex-1 bg-[rgba(20,20,20,0.8)] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[rgba(115,94,181,1)]"
                      placeholder="0"
                    />
                    <button
                      className="text-[rgba(115,94,181,1)] border border-[rgba(115,94,181,1)] rounded-lg px-3"
                      onClick={handleSetMaxCommit}
                    >
                      MAX
                    </button>
                  </div>
                  <button
                    onClick={handleCommitArmy}
                    className="w-full bg-[rgba(115,94,181,1)] hover:bg-[rgba(95,78,150,1)] text-white py-2 rounded-lg mt-2 transition-colors"
                  >
                    Commit $ARMY
                  </button>
                </div>

                {/* Display user commitment if exists */}
                {userCommitment > 0n && (
                  <div className="bg-[rgba(20,20,20,0.5)] p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Your Commitment</span>
                      <span className="text-white">
                        {formatBigInt(userCommitment)} ARMY
                      </span>
                    </div>

                    {/* Token claim button - only show if sale was successful */}
                    {tokenSale?.status === "successful" && (
                      <button
                        onClick={handleClaimTokens}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg mt-4 transition-colors"
                      >
                        Claim Tokens
                      </button>
                    )}

                    {/* Refund button - only show if sale failed */}
                    {tokenSale?.status === "failed" && (
                      <button
                        onClick={handleClaimTokens}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg mt-4 transition-colors"
                      >
                        Get Refund
                      </button>
                    )}
                  </div>
                )}

                {/* Claim Tokens Button - only visible if sale is successful */}
                {launchStatus === "successful" && userCommitment > 0n && (
                  <button
                    onClick={handleClaimTokens}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors"
                  >
                    Claim Your Tokens
                  </button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
