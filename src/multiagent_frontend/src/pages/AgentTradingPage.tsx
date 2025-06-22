import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TradingView } from "@/components/trading/TradingView";
import { ICPSwapLink } from "@/components/trading/ICPSwapLink";
import { StakingWidget } from "@/components/trading/StakingWidget";
import { RecentTrades } from "@/components/trading/RecentTrades";
import { TokenomicsWidget } from "@/components/trading/TokenomicsWidget";
import { AgentActivity } from "@/components/trading/AgentActivity";
import { ICPService } from "@/lib/icp-service";
import { Agent } from "@/lib/types";
import { NavigationBar } from "@/components/dashboard/NavigationBar";
import { Sidebar } from "@/components/dashboard/Sidebar";

const AgentTradingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTimeframe, setActiveTimeframe] = useState<string>("1D");
  const [trades, setTrades] = useState<
    {
      id: string;
      type: "buy" | "sell";
      price: string;
      amount: string;
      value: string;
      time: string;
      wallet: string;
    }[]
  >([]);
  const [activity, setActivity] = useState<
    {
      id: string;
      type: "staking" | "trade" | "launch" | "update";
      message: string;
      time: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchAgentDetails = async () => {
      if (id) {
        setLoading(true);
        try {
          const [agentData, tradesData, activityData] = await Promise.all([
            ICPService.getAgentById(id),
            ICPService.getRecentTrades(id),
            ICPService.getAgentActivity(id),
          ]);

          setAgent(agentData);
          setTrades(tradesData);
          setActivity(activityData);
        } catch (error) {
          console.error("Error fetching agent details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAgentDetails();
  }, [id]);

  // Mock data for the page
  const marketData = {
    price: "$0.0421",
    priceChange: "+8.2%",
    isPositive: true,
    marketCap: "$2.1M",
    fullyDiluted: "$4.2M",
    totalVolume: "$245.3K",
    circulatingSupply: "49.9M",
    totalSupply: "100M",
  };

  if (loading) {
    return (
      <div className="bg-[rgb(8,9,14)] min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="bg-[rgb(8,9,14)] min-h-screen flex items-center justify-center">
        <div className="text-white">Agent not found</div>
      </div>
    );
  }

  // Calculate price history data symbol
  const priceSymbol = `${agent.name.replace(/\s+/g, "")}USD`;

  return (
    <div className="bg-[rgb(8,9,14)] min-h-screen">
      <div className="container mx-auto flex min-h-screen">
        <Sidebar />

        <main className="flex-1 px-4 py-6">
          <NavigationBar />

          <div className="mt-8 max-w-6xl mx-auto">
            {/* Agent Header */}
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-[rgba(115,94,181,0.2)] rounded-full overflow-hidden mr-4">
                <img
                  src={agent.imageUrl || "/placeholder.svg"}
                  alt={agent.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">{agent.token}</span>
                  <span
                    className={`text-sm ${
                      marketData.isPositive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {marketData.priceChange}
                  </span>
                </div>
              </div>
              <div className="ml-auto">
                <span className="text-2xl font-bold text-white">
                  {marketData.price}
                </span>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Price Chart */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-[rgba(0,0,0,0.3)] border-gray-800 overflow-hidden">
                  <CardHeader className="pb-2 border-b border-gray-800">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">
                        Price Chart
                      </CardTitle>
                      <div className="flex space-x-1">
                        {["1H", "1D", "1W", "1M", "ALL"].map((timeframe) => (
                          <Button
                            key={timeframe}
                            variant="ghost"
                            size="sm"
                            className={`px-2 py-1 ${
                              activeTimeframe === timeframe
                                ? "bg-[rgba(115,94,181,0.4)] text-white"
                                : "text-gray-400 hover:bg-[rgba(115,94,181,0.2)]"
                            }`}
                            onClick={() => setActiveTimeframe(timeframe)}
                          >
                            {timeframe}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 h-[400px]">
                    <TradingView
                      symbol={priceSymbol}
                      theme="dark"
                      autosize={true}
                      interval={
                        activeTimeframe === "1H"
                          ? "60"
                          : activeTimeframe === "1D"
                          ? "D"
                          : activeTimeframe === "1W"
                          ? "W"
                          : "M"
                      }
                    />
                  </CardContent>
                </Card>

                {/* Market Stats Card */}
                <Card className="bg-[rgba(0,0,0,0.3)] border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">
                      Market Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-400">Market Cap</div>
                        <div className="text-white font-medium">
                          {marketData.marketCap}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">
                          Fully Diluted
                        </div>
                        <div className="text-white font-medium">
                          {marketData.fullyDiluted}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">24h Volume</div>
                        <div className="text-white font-medium">
                          {marketData.totalVolume}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">
                          Circulating Supply
                        </div>
                        <div className="text-white font-medium">
                          {marketData.circulatingSupply}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">
                          Total Supply
                        </div>
                        <div className="text-white font-medium">
                          {marketData.totalSupply}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Staking APY</div>
                        <div className="text-white font-medium">
                          {agent.metrics?.stakingApr || "0"}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Trades */}
                <RecentTrades
                  symbol={agent.name.replace(/\s+/g, "")}
                  trades={trades}
                />
              </div>

              {/* Right Column - Trading widgets */}
              <div className="space-y-6">
                <ICPSwapLink
                  tokenSymbol={agent.name.replace(/\s+/g, "")}
                  tokenName={agent.name}
                  tokenIcon={agent.imageUrl || "/placeholder.svg"}
                />

                <StakingWidget
                  agentId={agent.id}
                  token={agent.name.replace(/\s+/g, "")}
                  availableAmount={100}
                  stakingApy={`${agent.metrics?.stakingApr || "0"}%`}
                  totalStaked={`${(Math.random() * 1000000).toFixed(0)}`}
                  stakerCount={Math.floor(Math.random() * 1000)}
                />

                <TokenomicsWidget
                  tokenSymbol={agent.name.replace(/\s+/g, "")}
                  distribution={agent.tokenDistribution}
                  totalSupply={marketData.totalSupply}
                  circulatingSupply={marketData.circulatingSupply}
                />

                <AgentActivity notifications={activity} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AgentTradingPage;
