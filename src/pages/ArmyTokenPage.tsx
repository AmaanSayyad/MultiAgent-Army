import React, { useState, useEffect } from "react";
import { NavigationBar } from "@/components/dashboard/NavigationBar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Link } from "react-router-dom";
import { ICPService } from "@/lib/icp-service";

interface TokenInfo {
  name: string;
  symbol: string;
  totalSupply: string;
  circulatingSupply: string;
  marketCap: string;
  price: string;
  stakingApy: string;
  holders: number;
  transactions: number;
  launchDate: string;
  standard: string;
  blockchain: string;
  contractAddress: string;
}

interface TokenDistrubution {
  label: string;
  percentage: number;
  amount: string;
  color: string;
}

const ArmyTokenPage: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    name: "ARMY Token",
    symbol: "$ARMY",
    totalSupply: "1,000,000,000",
    circulatingSupply: "250,000,000",
    marketCap: "$42,500,000",
    price: "$0.17",
    stakingApy: "12.5%",
    holders: 5482,
    transactions: 124835,
    launchDate: "2025-01-15",
    standard: "DIP-20",
    blockchain: "Internet Computer",
    contractAddress: "0x1a2b3c4d5e6f...",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  const tokenDistribution: TokenDistrubution[] = [
    {
      label: "Community Treasury",
      percentage: 30,
      amount: "300,000,000",
      color: "rgba(115,94,181,1)",
    },
    {
      label: "Team",
      percentage: 20,
      amount: "200,000,000",
      color: "rgba(76,59,125,1)",
    },
    {
      label: "Liquidity",
      percentage: 15,
      amount: "150,000,000",
      color: "rgba(57,44,94,1)",
    },
    {
      label: "Investors",
      percentage: 15,
      amount: "150,000,000",
      color: "rgba(96,79,156,1)",
    },
    {
      label: "Staking Rewards",
      percentage: 10,
      amount: "100,000,000",
      color: "rgba(134,110,211,1)",
    },
    {
      label: "Marketing",
      percentage: 5,
      amount: "50,000,000",
      color: "rgba(164,148,220,1)",
    },
    {
      label: "Ecosystem Growth",
      percentage: 5,
      amount: "50,000,000",
      color: "rgba(194,183,230,1)",
    },
  ];

  useEffect(() => {
    const fetchTokenData = async () => {
      setIsLoading(true);
      try {
        // Simulate fetching price history data
        setPriceHistory([
          0.12, 0.11, 0.14, 0.13, 0.15, 0.16, 0.17, 0.19, 0.18, 0.16, 0.17,
        ]);

        // In a real implementation, you would fetch actual token data from your backend or blockchain
        // const tokenData = await ICPService.getTokenInfo('ARMY');
        // setTokenInfo(tokenData);
      } catch (error) {
        console.error("Error fetching token data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenData();
  }, []);

  return (
    <div className="bg-[rgb(8,9,14)] min-h-screen">
      <div className="container mx-auto flex min-h-screen">
        <Sidebar />

        <main className="flex-1 px-4 py-6">
          <NavigationBar />

          {/* Quick Navigation Links */}
          <div className="mt-4 mb-6 max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab("overview")}
                className="bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] text-white px-3 py-1 rounded-full text-sm transition-colors"
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("tokenomics")}
                className="bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] text-white px-3 py-1 rounded-full text-sm transition-colors"
              >
                Tokenomics
              </button>
              <button
                onClick={() => setActiveTab("utility")}
                className="bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] text-white px-3 py-1 rounded-full text-sm transition-colors"
              >
                Utility
              </button>
              <button
                onClick={() => setActiveTab("staking")}
                className="bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] text-white px-3 py-1 rounded-full text-sm transition-colors"
              >
                Staking
              </button>
            </div>
          </div>

          <div className="mt-8 max-w-6xl mx-auto">
            {/* Price Update Alert */}
            <div className="mb-6 bg-[rgba(115,94,181,0.1)] border border-[rgba(115,94,181,0.3)] rounded-lg p-4 flex items-center">
              <div className="mr-4 bg-[rgba(115,94,181,0.3)] h-10 w-10 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[rgba(115,94,181,1)]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586l3.293-3.293A1 1 0 0114 7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">$ARMY Price Update</h3>
                <p className="text-gray-400 text-sm">
                  Price increased by 4.3% in the last 24 hours. Current price:{" "}
                  {tokenInfo.price}
                </p>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">$ARMY Token</h1>
              <p className="text-gray-400 mt-2">
                The native token of the Multiagent Army ecosystem
              </p>
            </div>

            {/* Token Overview Card */}
            <div className="mb-8 bg-gradient-to-r from-[rgba(115,94,181,0.8)] to-[rgba(76,59,125,0.8)] rounded-xl p-8 text-white">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[#2c2a5a] to-[#1d1c39] rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">$ARMY</span>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-200 text-sm">Price</p>
                      <p className="text-2xl font-bold">{tokenInfo.price}</p>
                    </div>
                    <div>
                      <p className="text-gray-200 text-sm">Market Cap</p>
                      <p className="text-2xl font-bold">
                        {tokenInfo.marketCap}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-200 text-sm">Total Supply</p>
                      <p className="text-2xl font-bold">
                        {tokenInfo.totalSupply}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-200 text-sm">Staking APY</p>
                      <p className="text-2xl font-bold">
                        {tokenInfo.stakingApy}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-[rgba(255,255,255,0.1)] mb-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-3 text-base font-medium ${
                  activeTab === "overview"
                    ? "text-white border-b-2 border-[rgba(115,94,181,1)]"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("tokenomics")}
                className={`px-6 py-3 text-base font-medium ${
                  activeTab === "tokenomics"
                    ? "text-white border-b-2 border-[rgba(115,94,181,1)]"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Tokenomics
              </button>
              <button
                onClick={() => setActiveTab("utility")}
                className={`px-6 py-3 text-base font-medium ${
                  activeTab === "utility"
                    ? "text-white border-b-2 border-[rgba(115,94,181,1)]"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Utility
              </button>
              <button
                onClick={() => setActiveTab("staking")}
                className={`px-6 py-3 text-base font-medium ${
                  activeTab === "staking"
                    ? "text-white border-b-2 border-[rgba(115,94,181,1)]"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Staking
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Key Info Card */}
                <div className="bg-[rgba(255,255,255,0.03)] rounded-xl p-6 col-span-1 md:col-span-2">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Token Info
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-400 text-sm">Token Name</p>
                      <p className="text-white">{tokenInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Symbol</p>
                      <p className="text-white">{tokenInfo.symbol}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Supply</p>
                      <p className="text-white">{tokenInfo.totalSupply}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">
                        Circulating Supply
                      </p>
                      <p className="text-white">
                        {tokenInfo.circulatingSupply}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Token Standard</p>
                      <p className="text-white">{tokenInfo.standard}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Blockchain</p>
                      <p className="text-white">{tokenInfo.blockchain}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Launch Date</p>
                      <p className="text-white">
                        {new Date(tokenInfo.launchDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Holders</p>
                      <p className="text-white">
                        {tokenInfo.holders.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price History Card */}
                <div className="bg-[rgba(255,255,255,0.03)] rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Price</h2>
                  {/* Simple Price Visualization */}
                  <div className="h-32 flex items-end gap-1">
                    {priceHistory.map((price, i) => (
                      <div
                        key={i}
                        className="bg-[rgba(115,94,181,0.8)] rounded-t w-full"
                        style={{
                          height: `${
                            (price / Math.max(...priceHistory)) * 100
                          }%`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-4 text-gray-400 text-sm">
                    <div className="flex justify-between">
                      <span>Jan</span>
                      <span>Jun</span>
                    </div>
                  </div>

                  {/* Price Comparison Section */}
                  <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
                    <h3 className="text-white text-sm font-medium mb-2">
                      Compared to:
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">BTC</span>
                        <div className="flex items-center">
                          <span className="text-green-400 text-xs mr-1">
                            +1.2%
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-green-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586l3.293-3.293A1 1 0 0114 7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">ETH</span>
                        <div className="flex items-center">
                          <span className="text-red-400 text-xs mr-1">
                            -0.8%
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-red-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414l3.293 3.293A1 1 0 0014 13z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">ICP</span>
                        <div className="flex items-center">
                          <span className="text-green-400 text-xs mr-1">
                            +5.3%
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-green-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586l3.293-3.293A1 1 0 0114 7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract Info */}
                <div className="bg-[rgba(255,255,255,0.03)] rounded-xl p-6 col-span-1 md:col-span-3">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Contract
                  </h2>
                  <div className="bg-[rgba(0,0,0,0.2)] rounded-lg p-4">
                    <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
                      <div className="text-gray-400 text-sm overflow-hidden text-ellipsis">
                        {tokenInfo.contractAddress}
                      </div>
                      <button className="bg-[rgba(115,94,181,1)] text-white px-4 py-2 rounded-lg">
                        View on Explorer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tokenomics Tab */}
            {activeTab === "tokenomics" && (
              <div className="mb-8">
                <div className="bg-[rgba(255,255,255,0.03)] rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6">
                    Token Distribution
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pie Chart Visualization (simplified with colored squares) */}
                    <div>
                      <div className="grid grid-cols-2 gap-4">
                        {tokenDistribution.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-sm"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-white text-sm">
                              {item.label} ({item.percentage}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Table */}
                    <div>
                      <div className="bg-[rgba(0,0,0,0.2)] rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-[rgba(255,255,255,0.1)]">
                              <th className="px-4 py-3 text-left text-sm text-gray-400">
                                Allocation
                              </th>
                              <th className="px-4 py-3 text-left text-sm text-gray-400">
                                Amount
                              </th>
                              <th className="px-4 py-3 text-left text-sm text-gray-400">
                                Percentage
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {tokenDistribution.map((item, i) => (
                              <tr
                                key={i}
                                className="border-b border-[rgba(255,255,255,0.05)]"
                              >
                                <td className="px-4 py-3 text-sm text-white">
                                  {item.label}
                                </td>
                                <td className="px-4 py-3 text-sm text-white">
                                  {item.amount}
                                </td>
                                <td className="px-4 py-3 text-sm text-white">
                                  {item.percentage}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vesting Schedule */}
                <div className="bg-[rgba(255,255,255,0.03)] rounded-xl p-6 mt-6">
                  <h2 className="text-xl font-bold text-white mb-6">
                    Vesting Schedule
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[rgba(255,255,255,0.1)]">
                          <th className="px-4 py-3 text-left text-sm text-gray-400">
                            Allocation
                          </th>
                          <th className="px-4 py-3 text-left text-sm text-gray-400">
                            TGE Unlock
                          </th>
                          <th className="px-4 py-3 text-left text-sm text-gray-400">
                            Cliff
                          </th>
                          <th className="px-4 py-3 text-left text-sm text-gray-400">
                            Vesting Period
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[rgba(255,255,255,0.05)]">
                          <td className="px-4 py-3 text-sm text-white">
                            Community Treasury
                          </td>
                          <td className="px-4 py-3 text-sm text-white">10%</td>
                          <td className="px-4 py-3 text-sm text-white">
                            1 month
                          </td>
                          <td className="px-4 py-3 text-sm text-white">
                            36 months
                          </td>
                        </tr>
                        <tr className="border-b border-[rgba(255,255,255,0.05)]">
                          <td className="px-4 py-3 text-sm text-white">Team</td>
                          <td className="px-4 py-3 text-sm text-white">0%</td>
                          <td className="px-4 py-3 text-sm text-white">
                            12 months
                          </td>
                          <td className="px-4 py-3 text-sm text-white">
                            24 months
                          </td>
                        </tr>
                        <tr className="border-b border-[rgba(255,255,255,0.05)]">
                          <td className="px-4 py-3 text-sm text-white">
                            Liquidity
                          </td>
                          <td className="px-4 py-3 text-sm text-white">100%</td>
                          <td className="px-4 py-3 text-sm text-white">
                            0 months
                          </td>
                          <td className="px-4 py-3 text-sm text-white">
                            0 months
                          </td>
                        </tr>
                        <tr className="border-b border-[rgba(255,255,255,0.05)]">
                          <td className="px-4 py-3 text-sm text-white">
                            Investors
                          </td>
                          <td className="px-4 py-3 text-sm text-white">5%</td>
                          <td className="px-4 py-3 text-sm text-white">
                            3 months
                          </td>
                          <td className="px-4 py-3 text-sm text-white">
                            18 months
                          </td>
                        </tr>
                        <tr className="border-b border-[rgba(255,255,255,0.05)]">
                          <td className="px-4 py-3 text-sm text-white">
                            Staking Rewards
                          </td>
                          <td className="px-4 py-3 text-sm text-white">5%</td>
                          <td className="px-4 py-3 text-sm text-white">
                            1 month
                          </td>
                          <td className="px-4 py-3 text-sm text-white">
                            48 months
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Utility Tab */}
            {activeTab === "utility" && (
              <div className="mb-8">
                <div className="bg-[rgba(255,255,255,0.03)] rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6">
                    Token Utility
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Governance */}
                    <div className="bg-[rgba(0,0,0,0.2)] p-5 rounded-xl">
                      <div className="bg-[rgba(115,94,181,0.3)] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-[rgba(115,94,181,1)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        Governance
                      </h3>
                      <p className="text-gray-400">
                        $ARMY token holders can participate in governance
                        decisions through voting on proposals that affect the
                        platform's development, feature updates, and treasury
                        allocations.
                      </p>
                    </div>

                    {/* Agent Launches */}
                    <div className="bg-[rgba(0,0,0,0.2)] p-5 rounded-xl">
                      <div className="bg-[rgba(115,94,181,0.3)] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-[rgba(115,94,181,1)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        Agent Launches
                      </h3>
                      <p className="text-gray-400">
                        $ARMY is used to participate in agent token launches,
                        allowing holders to get early access to new AI agents
                        released on the platform.
                      </p>
                    </div>

                    {/* Staking */}
                    <div className="bg-[rgba(0,0,0,0.2)] p-5 rounded-xl">
                      <div className="bg-[rgba(115,94,181,0.3)] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-[rgba(115,94,181,1)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        Staking Rewards
                      </h3>
                      <p className="text-gray-400">
                        Stake $ARMY to earn passive rewards from platform fees
                        and unlock additional platform benefits such as reduced
                        fees and higher allocation limits.
                      </p>
                    </div>

                    {/* Agent Points */}
                    <div className="bg-[rgba(0,0,0,0.2)] p-5 rounded-xl">
                      <div className="bg-[rgba(115,94,181,0.3)] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-[rgba(115,94,181,1)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        Army Points
                      </h3>
                      <p className="text-gray-400">
                        $ARMY can be converted to Army Points which are used in
                        fair launch allocations, giving token holders fair
                        access to new agent token offerings.
                      </p>
                    </div>

                    {/* Fee Discounts */}
                    <div className="bg-[rgba(0,0,0,0.2)] p-5 rounded-xl">
                      <div className="bg-[rgba(115,94,181,0.3)] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-[rgba(115,94,181,1)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        Fee Discounts
                      </h3>
                      <p className="text-gray-400">
                        $ARMY holders receive discounts on platform fees,
                        including reduced trading fees, agent creation fees, and
                        other platform services.
                      </p>
                    </div>

                    {/* AI Services */}
                    <div className="bg-[rgba(0,0,0,0.2)] p-5 rounded-xl">
                      <div className="bg-[rgba(115,94,181,0.3)] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-[rgba(115,94,181,1)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        AI Services
                      </h3>
                      <p className="text-gray-400">
                        Access premium AI services and API calls across agents
                        in the Multiagent Army ecosystem by paying with $ARMY
                        tokens directly.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Roadmap Section */}
                <div className="bg-[rgba(255,255,255,0.03)] rounded-xl p-6 mt-6">
                  <h2 className="text-xl font-bold text-white mb-6">
                    $ARMY Token Roadmap
                  </h2>

                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-[rgba(115,94,181,0.5)] ml-5"></div>

                    {/* Timeline Items */}
                    <div className="space-y-8 ml-12 relative">
                      {/* Q1 2025 */}
                      <div>
                        <div className="absolute left-0 w-10 h-10 rounded-full bg-[rgba(115,94,181,0.2)] flex items-center justify-center -ml-5">
                          <div className="w-4 h-4 rounded-full bg-[rgba(115,94,181,1)]"></div>
                        </div>
                        <h3 className="text-white font-bold mb-2">
                          Q1 2025 - Token Launch
                        </h3>
                        <ul className="text-gray-400 space-y-2 list-disc ml-4">
                          <li>Initial DEX Offering (IDO)</li>
                          <li>Exchange listings</li>
                          <li>Staking program launch</li>
                          <li>Army Points conversion system</li>
                        </ul>
                      </div>

                      {/* Q2 2025 */}
                      <div>
                        <div className="absolute left-0 w-10 h-10 rounded-full bg-[rgba(115,94,181,0.2)] flex items-center justify-center -ml-5">
                          <div className="w-4 h-4 rounded-full bg-[rgba(115,94,181,1)]"></div>
                        </div>
                        <h3 className="text-white font-bold mb-2">
                          Q2 2025 - Governance
                        </h3>
                        <ul className="text-gray-400 space-y-2 list-disc ml-4">
                          <li>DAO formation</li>
                          <li>Governance portal</li>
                          <li>First community proposals</li>
                          <li>Treasury management system</li>
                        </ul>
                      </div>

                      {/* Q3 2025 */}
                      <div>
                        <div className="absolute left-0 w-10 h-10 rounded-full bg-[rgba(115,94,181,0.2)] flex items-center justify-center -ml-5">
                          <div className="w-4 h-4 rounded-full bg-[rgba(115,94,181,1)]"></div>
                        </div>
                        <h3 className="text-white font-bold mb-2">
                          Q3 2025 - Ecosystem Expansion
                        </h3>
                        <ul className="text-gray-400 space-y-2 list-disc ml-4">
                          <li>Tier 1 exchange listings</li>
                          <li>Cross-chain bridges</li>
                          <li>Agent marketplace commission sharing</li>
                          <li>NFT integration</li>
                        </ul>
                      </div>

                      {/* Q4 2025 */}
                      <div>
                        <div className="absolute left-0 w-10 h-10 rounded-full bg-[rgba(115,94,181,0.2)] flex items-center justify-center -ml-5">
                          <div className="w-4 h-4 rounded-full bg-[rgba(115,94,181,1)]"></div>
                        </div>
                        <h3 className="text-white font-bold mb-2">
                          Q4 2025 - Advanced Utility
                        </h3>
                        <ul className="text-gray-400 space-y-2 list-disc ml-4">
                          <li>Agent subscription payments</li>
                          <li>Enhanced staking tiers</li>
                          <li>Partner integrations</li>
                          <li>Enterprise solutions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Staking Tab */}
            {activeTab === "staking" && (
              <div className="mb-8">
                <div className="bg-[rgba(255,255,255,0.03)] rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h2 className="text-xl font-bold text-white mb-4">
                        Stake Your $ARMY
                      </h2>
                      <p className="text-gray-400 mb-6">
                        Earn passive rewards by staking your $ARMY tokens. The
                        current APY is {tokenInfo.stakingApy} with rewards
                        distributed daily. Staking also gives you additional
                        benefits on the platform.
                      </p>

                      <div className="bg-[rgba(0,0,0,0.2)] rounded-lg p-6">
                        <div className="mb-4">
                          <label className="text-gray-400 block mb-2">
                            Amount to Stake
                          </label>
                          <div className="flex">
                            <input
                              type="text"
                              className="bg-[rgba(255,255,255,0.05)] text-white px-4 py-2 rounded-l-lg w-full focus:outline-none"
                              placeholder="0.0"
                            />
                            <button className="bg-[rgba(115,94,181,1)] text-white px-4 py-2 rounded-r-lg">
                              MAX
                            </button>
                          </div>
                        </div>

                        <button className="bg-[rgba(115,94,181,1)] hover:bg-[rgba(95,78,150,1)] text-white px-6 py-3 rounded-lg w-full transition-colors">
                          Stake $ARMY
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="bg-[rgba(0,0,0,0.2)] rounded-lg p-6 h-full">
                        <h3 className="text-lg font-bold text-white mb-4">
                          Staking Stats
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <p className="text-gray-400 text-sm">
                              Total $ARMY Staked
                            </p>
                            <p className="text-white text-xl font-medium">
                              375,489,231
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Staking APY</p>
                            <p className="text-green-400 text-xl font-medium">
                              {tokenInfo.stakingApy}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Stakers</p>
                            <p className="text-white text-xl font-medium">
                              3,482
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">
                              Rewards Distributed
                            </p>
                            <p className="text-white text-xl font-medium">
                              24,823,591
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Staking Tiers */}
                <div className="bg-[rgba(255,255,255,0.03)] rounded-xl p-6 mt-6">
                  <h2 className="text-xl font-bold text-white mb-6">
                    Staking Tiers
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[rgba(255,255,255,0.1)]">
                          <th className="px-4 py-3 text-left text-sm text-gray-400">
                            Tier
                          </th>
                          <th className="px-4 py-3 text-left text-sm text-gray-400">
                            Minimum Stake
                          </th>
                          <th className="px-4 py-3 text-left text-sm text-gray-400">
                            APY Boost
                          </th>
                          <th className="px-4 py-3 text-left text-sm text-gray-400">
                            Fee Discount
                          </th>
                          <th className="px-4 py-3 text-left text-sm text-gray-400">
                            Max Agent Allocation
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[rgba(255,255,255,0.05)]">
                          <td className="px-4 py-3 text-sm text-white">
                            Bronze
                          </td>
                          <td className="px-4 py-3 text-sm text-white">
                            1,000 $ARMY
                          </td>
                          <td className="px-4 py-3 text-sm text-white">Base</td>
                          <td className="px-4 py-3 text-sm text-white">5%</td>
                          <td className="px-4 py-3 text-sm text-white">0.5%</td>
                        </tr>
                        <tr className="border-b border-[rgba(255,255,255,0.05)]">
                          <td className="px-4 py-3 text-sm text-white">
                            Silver
                          </td>
                          <td className="px-4 py-3 text-sm text-white">
                            10,000 $ARMY
                          </td>
                          <td className="px-4 py-3 text-sm text-white">+1%</td>
                          <td className="px-4 py-3 text-sm text-white">10%</td>
                          <td className="px-4 py-3 text-sm text-white">
                            0.75%
                          </td>
                        </tr>
                        <tr className="border-b border-[rgba(255,255,255,0.05)]">
                          <td className="px-4 py-3 text-sm text-white">Gold</td>
                          <td className="px-4 py-3 text-sm text-white">
                            50,000 $ARMY
                          </td>
                          <td className="px-4 py-3 text-sm text-white">+2%</td>
                          <td className="px-4 py-3 text-sm text-white">15%</td>
                          <td className="px-4 py-3 text-sm text-white">1%</td>
                        </tr>
                        <tr className="border-b border-[rgba(255,255,255,0.05)]">
                          <td className="px-4 py-3 text-sm text-white">
                            Platinum
                          </td>
                          <td className="px-4 py-3 text-sm text-white">
                            100,000 $ARMY
                          </td>
                          <td className="px-4 py-3 text-sm text-white">+3%</td>
                          <td className="px-4 py-3 text-sm text-white">25%</td>
                          <td className="px-4 py-3 text-sm text-white">1.5%</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-white">
                            Diamond
                          </td>
                          <td className="px-4 py-3 text-sm text-white">
                            500,000 $ARMY
                          </td>
                          <td className="px-4 py-3 text-sm text-white">+5%</td>
                          <td className="px-4 py-3 text-sm text-white">50%</td>
                          <td className="px-4 py-3 text-sm text-white">2%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Buy ARMY Section - Always visible at bottom */}
            <div className="bg-gradient-to-r from-[rgba(115,94,181,0.8)] to-[rgba(76,59,125,0.8)] rounded-xl p-8 text-white mb-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Get $ARMY Token</h2>
                  <p className="text-lg">
                    Purchase $ARMY to participate in the Multiagent Army
                    ecosystem
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#"
                    className="bg-white text-[rgba(115,94,181,1)] px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                  >
                    Buy on DEX
                  </a>
                  <a
                    href="#"
                    className="bg-transparent text-white border border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
                  >
                    View Markets
                  </a>
                </div>
              </div>
            </div>

            {/* Community Links */}
            <div className="bg-[rgba(255,255,255,0.03)] rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">
                Join the $ARMY Community
              </h2>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#"
                  className="bg-[rgba(0,0,0,0.2)] hover:bg-[rgba(0,0,0,0.3)] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-twitter-x"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                  </svg>
                  Twitter
                </a>
                <a
                  href="#"
                  className="bg-[rgba(0,0,0,0.2)] hover:bg-[rgba(0,0,0,0.3)] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-discord"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
                  </svg>
                  Discord
                </a>
                <a
                  href="#"
                  className="bg-[rgba(0,0,0,0.2)] hover:bg-[rgba(0,0,0,0.3)] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-telegram"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z" />
                  </svg>
                  Telegram
                </a>
                <a
                  href="#"
                  className="bg-[rgba(0,0,0,0.2)] hover:bg-[rgba(0,0,0,0.3)] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-medium"
                    viewBox="0 0 16 16"
                  >
                    <path d="M9.025 8c0 2.485-2.02 4.5-4.513 4.5A4.506 4.506 0 0 1 0 8c0-2.486 2.02-4.5 4.512-4.5A4.506 4.506 0 0 1 9.025 8m4.95 0c0 2.34-1.01 4.236-2.256 4.236-1.246 0-2.256-1.897-2.256-4.236 0-2.34 1.01-4.236 2.256-4.236 1.246 0 2.256 1.897 2.256 4.236M16 8c0 2.096-.355 3.795-.794 3.795-.438 0-.793-1.7-.793-3.795 0-2.096.355-3.795.794-3.795.438 0 .793 1.699.793 3.795" />
                  </svg>
                  Medium
                </a>
                <a
                  href="#"
                  className="bg-[rgba(0,0,0,0.2)] hover:bg-[rgba(0,0,0,0.3)] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-github"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ArmyTokenPage;
