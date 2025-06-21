import React, { useState, useEffect } from "react";
import TokenomicsChart from "./TokenomicsChart";
import { VestingScheduleChart } from "./VestingScheduleChart";

interface TokenDistribution {
  developer: number;
  publicSale: number;
  liquidityPool: number;
}

interface VestingSchedule {
  developerMonths: number; // months
  publicSaleMonths: number; // months
  liquidityPoolMonths: number; // months
}

interface TokenomicsDesignProps {
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  formData: {
    tokenDistribution?: TokenDistribution;
    vestingSchedule?: VestingSchedule;
    totalSupply?: number;
    launchType?: "genesis" | "standard" | "existing" | null;
  };
  updateFormData: (data: {
    tokenDistribution: TokenDistribution;
    vestingSchedule: VestingSchedule;
    totalSupply: number;
  }) => void;
}

export const TokenomicsDesign: React.FC<TokenomicsDesignProps> = ({
  onNext,
  onPrevious,
  onCancel,
  formData,
  updateFormData,
}) => {
  // Get default values based on launch type
  const getDefaultDistribution = () => {
    switch (formData.launchType) {
      case "genesis":
        return {
          developer: 50.0,
          publicSale: 37.5,
          liquidityPool: 12.5,
        };
      case "standard":
        return {
          developer: 0.0,
          publicSale: 87.5,
          liquidityPool: 12.5,
        };
      default:
        return {
          developer: 50.0,
          publicSale: 37.5,
          liquidityPool: 12.5,
        };
    }
  };

  const getDefaultVestingSchedule = () => {
    switch (formData.launchType) {
      case "genesis":
        return {
          developerMonths: 12,
          publicSaleMonths: 1,
          liquidityPoolMonths: 6,
        };
      case "standard":
        return {
          developerMonths: 0,
          publicSaleMonths: 1,
          liquidityPoolMonths: 6,
        };
      default:
        return {
          developerMonths: 12,
          publicSaleMonths: 1,
          liquidityPoolMonths: 6,
        };
    }
  };

  const [distribution, setDistribution] = useState<TokenDistribution>(
    formData.tokenDistribution || getDefaultDistribution()
  );

  const [vestingSchedule, setVestingSchedule] = useState<VestingSchedule>(
    formData.vestingSchedule || getDefaultVestingSchedule()
  );

  const [totalSupply, setTotalSupply] = useState<number>(
    formData.totalSupply || 1000000
  );

  const [errors, setErrors] = useState<string | null>(null);

  // Launch type specific restrictions
  const isGenesis = formData.launchType === "genesis";
  const isStandard = formData.launchType === "standard";

  // Make sure all values sum to 100%
  useEffect(() => {
    const total =
      distribution.developer +
      distribution.publicSale +
      distribution.liquidityPool;
    if (Math.abs(total - 100) > 0.01) {
      setErrors("Token distribution must total 100%");
    } else {
      setErrors(null);
    }

    // For standard launch, enforce the developer percentage is 0
    if (isStandard && distribution.developer > 0) {
      setDistribution((prev) => ({
        ...prev,
        developer: 0,
        publicSale: 100 - prev.liquidityPool,
      }));
    }
  }, [distribution, isStandard]);

  const handleInputChange = (key: keyof TokenDistribution, value: number) => {
    if (isStandard && key === "developer") {
      // For standard launch, developer allocation is locked at 0%
      return;
    }

    if (isGenesis && key === "developer" && value < 50) {
      // For genesis launch, developer allocation cannot be less than 50%
      return;
    }

    if (isGenesis && key === "liquidityPool" && value !== 12.5) {
      // For genesis launch, liquidity pool is fixed at 12.5%
      return;
    }

    if (isStandard && key === "liquidityPool" && value !== 12.5) {
      // For standard launch, liquidity pool is fixed at 12.5%
      return;
    }

    const newDistribution = { ...distribution, [key]: value };

    // If developer or liquidity is fixed, adjust public sale to maintain 100% total
    if (isGenesis) {
      if (key === "publicSale") {
        newDistribution.developer = 100 - value - distribution.liquidityPool;
      } else if (key === "developer") {
        newDistribution.publicSale = 100 - value - distribution.liquidityPool;
      }
    }

    if (isStandard) {
      if (key === "publicSale") {
        newDistribution.liquidityPool = 100 - value;
      } else if (key === "liquidityPool") {
        newDistribution.publicSale = 100 - value;
      }
    }

    setDistribution(newDistribution);
  };

  const handleVestingChange = (key: keyof VestingSchedule, value: number) => {
    // For standard launch, developer vesting is not applicable
    if (isStandard && key === "developerMonths") {
      return;
    }

    setVestingSchedule({
      ...vestingSchedule,
      [key]: value,
    });
  };

  const handleSupplyChange = (value: string) => {
    const numericValue = parseInt(value.replace(/,/g, ""), 10);
    if (!isNaN(numericValue)) {
      setTotalSupply(numericValue);
    }
  };

  const handleNext = () => {
    // Make sure all values add up to 100
    const total =
      distribution.developer +
      distribution.publicSale +
      distribution.liquidityPool;
    if (Math.abs(total - 100) > 0.01) {
      setErrors("Token distribution must total 100%");
      return;
    }

    updateFormData({
      tokenDistribution: distribution,
      vestingSchedule: vestingSchedule,
      totalSupply: totalSupply,
    });
    onNext();
  };

  return (
    <div className="w-full space-y-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Create New Agent on Base</h2>
        <button className="text-gray-400 hover:text-white transition-colors text-sm">
          Want to launch on Solana instead?
        </button>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8 relative">
        {[
          "Launch Type",
          "Agent Details",
          "Project Pitch",
          "Team Background",
          "Tokenomics",
          "Additional Details",
          "Launch Date",
          "Summary",
        ].map((step, index) => (
          <div key={index} className="flex flex-col items-center z-10">
            <div
              className={`w-4 h-4 rounded-full z-10 ${
                index <= 4
                  ? "bg-[rgba(115,94,181,1)]"
                  : "bg-[rgba(255,255,255,0.2)]"
              }`}
            ></div>
            <span
              className={`text-xs mt-2 ${
                index <= 4 ? "text-white" : "text-gray-400"
              }`}
            >
              {step}
            </span>
          </div>
        ))}

        {/* Progress line */}
        <div className="absolute top-2 h-0.5 bg-[rgba(255,255,255,0.2)] w-full -z-0"></div>
      </div>

      {/* Main Content */}
      <div>
        <button
          onClick={onPrevious}
          className="flex items-center text-gray-400 hover:text-white mb-4"
        >
          <span className="mr-2">←</span> Back
        </button>

        <h1 className="text-2xl font-bold mb-6">Propose Tokenomics Design</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            {/* Token Distribution Chart */}
            <div className="relative">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#5ecbf7] rounded-sm mr-2"></div>
                    <span className="text-white">Public Sale</span>
                  </div>
                  <div className="ml-auto text-white font-medium">
                    {distribution.publicSale.toFixed(1)}%
                  </div>
                </div>
                <div className="w-full h-2 bg-[rgba(30,30,30,0.8)] rounded-full">
                  <div
                    className="h-full bg-[#5ecbf7] rounded-full"
                    style={{ width: `${distribution.publicSale}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400 mt-1">Fixed Supply</div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#ff9f51] rounded-sm mr-2"></div>
                    <span className="text-white">Liquidity Pool</span>
                  </div>
                  <div className="ml-auto text-white font-medium">
                    {distribution.liquidityPool.toFixed(1)}%
                  </div>
                </div>
                <div className="w-full h-2 bg-[rgba(30,30,30,0.8)] rounded-full">
                  <div
                    className="h-full bg-[#ff9f51] rounded-full"
                    style={{ width: `${distribution.liquidityPool}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400 mt-1">Fixed Supply</div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#bada55] rounded-sm mr-2"></div>
                    <span className="text-white">Developer</span>
                  </div>
                  <div className="ml-auto text-white font-medium">
                    {distribution.developer.toFixed(1)}%
                  </div>
                </div>
                <div className="w-full h-2 bg-[rgba(30,30,30,0.8)] rounded-full">
                  <div
                    className="h-full bg-[#bada55] rounded-full"
                    style={{ width: `${distribution.developer}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  100% tokens released over {vestingSchedule.developerMonths}
                  -month from 22 Jul 2025 03:17am to{" "}
                  {new Date(
                    new Date().setMonth(
                      new Date().getMonth() + vestingSchedule.developerMonths
                    )
                  ).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  03:17am
                </div>
              </div>

              {/* Warning Box */}
              <div className="bg-[rgba(30,30,30,0.6)] border border-gray-700 rounded-lg p-4 mb-6">
                <p className="text-white text-sm">
                  We recommend a 1-month cliff to build trust within Army. The
                  first unlock timer will be visible on the website. The diamond
                  hand bonus and take profit penalty won't apply in the 7 days
                  before unlock.
                </p>
              </div>

              {/* Info Box */}
              <div className="text-center text-xs text-gray-400 mt-4 mb-6">
                Tokenomics can only be edited up to one day before launch.
                <br />
                After that, no further changes will be allowed.
              </div>

              {/* Add Tokenomics Button */}
              <div className="flex justify-center">
                <button className="bg-[rgba(30,30,30,0.8)] hover:bg-[rgba(40,40,40,0.8)] text-white text-sm px-6 py-2 rounded-lg transition-colors">
                  Add Tokenomics
                </button>
              </div>
            </div>

            {/* Totals */}
            <div className="mt-8 flex justify-between items-center">
              <div className="text-white font-medium">Total Allocation:</div>
              <div className="text-white font-medium">
                {(
                  distribution.developer +
                  distribution.publicSale +
                  distribution.liquidityPool
                ).toFixed(1)}
                %
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Vesting Schedule Chart */}
            <div>
              <h3 className="text-xl font-medium mb-4">
                Propose Vesting Schedule
              </h3>
              <div className="flex mb-4 mt-6">
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 bg-[#5ecbf7] rounded-sm mr-2"></div>
                  <span className="text-gray-300 text-sm">Public Sale</span>
                </div>
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 bg-[#ff9f51] rounded-sm mr-2"></div>
                  <span className="text-gray-300 text-sm">Liquidity Pool</span>
                </div>
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 bg-[#bada55] rounded-sm mr-2"></div>
                  <span className="text-gray-300 text-sm">Developer</span>
                </div>
              </div>

              <VestingScheduleChart
                distribution={distribution}
                vestingPeriod={vestingSchedule}
                totalSupply={totalSupply}
              />

              {/* Editing Inputs */}
              <div className="space-y-6 mt-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Total Supply</h3>
                  <div className="relative mb-4">
                    <input
                      type="text"
                      value={totalSupply.toLocaleString()}
                      onChange={(e) => handleSupplyChange(e.target.value)}
                      className="w-full bg-[rgba(30,30,30,0.8)] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[rgba(115,94,181,1)] transition-colors"
                      placeholder="1,000,000"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Distribution Percentages (%)
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 mb-2">
                        Public Sale
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={distribution.publicSale}
                        onChange={(e) =>
                          handleInputChange(
                            "publicSale",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full bg-[rgba(30,30,30,0.8)] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[rgba(115,94,181,1)] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-2">
                        Liquidity Pool
                        {(isGenesis || isStandard) && (
                          <span className="ml-2 text-xs text-yellow-500">
                            (Fixed at 12.5%)
                          </span>
                        )}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={distribution.liquidityPool}
                        onChange={(e) =>
                          handleInputChange(
                            "liquidityPool",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        disabled={isGenesis || isStandard}
                        className={`w-full bg-[rgba(30,30,30,0.8)] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none ${
                          isGenesis || isStandard
                            ? "opacity-70 cursor-not-allowed"
                            : "focus:border-[rgba(115,94,181,1)]"
                        } transition-colors`}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-2">
                        Developer
                        {isStandard && (
                          <span className="ml-2 text-xs text-yellow-500">
                            (Not available in Standard launch)
                          </span>
                        )}
                        {isGenesis && (
                          <span className="ml-2 text-xs text-yellow-500">
                            (Minimum 50%)
                          </span>
                        )}
                      </label>
                      <input
                        type="number"
                        min={isGenesis ? 50 : 0}
                        max="100"
                        step="0.1"
                        value={distribution.developer}
                        onChange={(e) =>
                          handleInputChange(
                            "developer",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        disabled={isStandard}
                        className={`w-full bg-[rgba(30,30,30,0.8)] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none ${
                          isStandard
                            ? "opacity-70 cursor-not-allowed"
                            : "focus:border-[rgba(115,94,181,1)]"
                        } transition-colors`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Vesting Period (months)
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 mb-2">
                        Public Sale Vesting
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={vestingSchedule.publicSaleMonths}
                        onChange={(e) =>
                          handleVestingChange(
                            "publicSaleMonths",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full bg-[rgba(30,30,30,0.8)] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[rgba(115,94,181,1)] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-2">
                        Liquidity Pool Vesting
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={vestingSchedule.liquidityPoolMonths}
                        onChange={(e) =>
                          handleVestingChange(
                            "liquidityPoolMonths",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full bg-[rgba(30,30,30,0.8)] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[rgba(115,94,181,1)] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-2">
                        Developer Vesting
                        {isStandard && (
                          <span className="ml-2 text-xs text-yellow-500">
                            (Not available in Standard launch)
                          </span>
                        )}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="48"
                        value={vestingSchedule.developerMonths}
                        onChange={(e) =>
                          handleVestingChange(
                            "developerMonths",
                            parseInt(e.target.value) || 0
                          )
                        }
                        disabled={isStandard}
                        className={`w-full bg-[rgba(30,30,30,0.8)] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none ${
                          isStandard
                            ? "opacity-70 cursor-not-allowed"
                            : "focus:border-[rgba(115,94,181,1)]"
                        } transition-colors`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Section */}
        {!isStandard && (
          <div className="bg-[rgba(20,20,30,0.5)] border border-gray-800 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Developer</h3>
              <div className="text-white">
                Total Allocation:{" "}
                <span className="font-medium">
                  {distribution.developer.toFixed(0)}%
                </span>{" "}
                <span className="text-gray-400 ml-1">▼</span>
              </div>
            </div>
            <div className="mt-3 text-gray-300">
              100% tokens released over {vestingSchedule.developerMonths} months
              from 22 Jul 2025, 03:17am to{" "}
              {new Date(
                new Date().setMonth(
                  new Date().getMonth() + vestingSchedule.developerMonths
                )
              ).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              03:17am
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400">Recipients</div>
                <div className="text-gray-300 text-sm font-mono mt-1">
                  0x66b...7Ad4ff
                </div>
              </div>
              <div>
                <div className="text-gray-400">Token Amount</div>
                <div className="text-gray-300 text-sm font-medium mt-1">
                  {Math.floor(
                    totalSupply * (distribution.developer / 100)
                  ).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-gray-400">% of Total Supply</div>
                <div className="text-gray-300 text-sm font-medium mt-1">
                  {distribution.developer.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {errors && <p className="text-red-500 text-sm mb-4">{errors}</p>}

        {/* TokenTable Logo */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center">
            <img
              src="https://tokentable.xyz/logo.png"
              alt="TokenTable"
              className="h-6 mr-2"
            />
            <span className="text-gray-400 text-xs font-medium">
              TOKENTABLE
            </span>
            <span className="text-gray-600 text-xs ml-1">POWERED BY</span>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-between mt-8">
        <div></div>
        <div className="flex gap-4 items-center">
          <button
            onClick={onCancel}
            className="bg-[rgba(30,30,30,0.8)] hover:bg-[rgba(50,50,50,0.8)] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            className={`${
              errors
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[rgba(115,94,181,1)] hover:bg-[rgba(95,78,150,1)]"
            } text-white px-6 py-2 rounded-lg transition-colors`}
            disabled={!!errors}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
