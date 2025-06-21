import React from "react";

interface VestingData {
  developer: number;
  publicSale: number;
  liquidityPool: number;
}

interface VestingPeriod {
  developerMonths: number;
  publicSaleMonths: number;
  liquidityPoolMonths: number;
}

interface VestingScheduleChartProps {
  distribution: VestingData;
  vestingPeriod: VestingPeriod;
  totalSupply: number;
}

export const VestingScheduleChart: React.FC<VestingScheduleChartProps> = ({
  distribution,
  vestingPeriod,
  totalSupply,
}) => {
  // Calculate total months for scaling
  const maxMonths = Math.max(
    vestingPeriod.developerMonths,
    vestingPeriod.publicSaleMonths,
    vestingPeriod.liquidityPoolMonths
  );

  // Calculate the height of each segment based on distribution percentages
  const calculateHeight = (percentage: number) => {
    return Math.max(5, (percentage / 100) * 200); // min height 5px, max 200px
  };

  // Generate month labels for x-axis
  const monthLabels = [];
  for (let i = 0; i <= maxMonths; i += Math.max(1, Math.floor(maxMonths / 4))) {
    monthLabels.push(i);
  }
  if (!monthLabels.includes(maxMonths)) {
    monthLabels.push(maxMonths);
  }

  // Generate amount labels for y-axis (in millions)
  const maxAmount = totalSupply;
  const amountLabels = [
    0,
    Math.round(maxAmount * 0.25),
    Math.round(maxAmount * 0.5),
    Math.round(maxAmount * 0.75),
    maxAmount,
  ];

  // Calculate step size for chart
  const stepSize = Math.max(1, Math.floor(maxMonths / 10));

  return (
    <div className="mt-6 bg-[rgba(20,20,30,0.3)] p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-4 text-white">Vesting Schedule</h3>

      <div className="relative h-64 mt-6">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
          {amountLabels.reverse().map((amount, i) => (
            <div key={i} className="flex items-center">
              <span className="mr-1">{(amount / 1000000).toFixed(1)}M</span>
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="ml-12 h-full relative flex items-end border-b border-l border-gray-700">
          {/* Stacked bars for each month */}
          {Array.from({ length: maxMonths / stepSize + 1 }).map(
            (_, monthIndex) => {
              const month = monthIndex * stepSize;

              // Calculate the amount released for each category at this month
              const developerReleased =
                distribution.developer *
                Math.min(1, month / vestingPeriod.developerMonths);
              const publicSaleReleased =
                distribution.publicSale *
                Math.min(1, month / vestingPeriod.publicSaleMonths);
              const liquidityPoolReleased =
                distribution.liquidityPool *
                Math.min(1, month / vestingPeriod.liquidityPoolMonths);

              // Calculate heights
              const developerHeight = calculateHeight(developerReleased);
              const publicSaleHeight = calculateHeight(publicSaleReleased);
              const liquidityPoolHeight = calculateHeight(
                liquidityPoolReleased
              );

              return (
                <div
                  key={month}
                  className="inline-block w-6 mx-1 relative"
                  style={{ height: "100%" }}
                >
                  {/* Developer */}
                  <div
                    className="absolute bottom-0 w-full bg-[#bada55]"
                    style={{ height: `${developerHeight}px` }}
                  ></div>

                  {/* Public Sale */}
                  <div
                    className="absolute bottom-0 w-full bg-[#5ecbf7]"
                    style={{ height: `${publicSaleHeight}px` }}
                  ></div>

                  {/* Liquidity Pool */}
                  <div
                    className="absolute bottom-0 w-full bg-[#ff9f51]"
                    style={{ height: `${liquidityPoolHeight}px` }}
                  ></div>
                </div>
              );
            }
          )}
        </div>

        {/* X-axis labels */}
        <div className="ml-12 flex justify-between mt-2 text-xs text-gray-400">
          {monthLabels.map((month, i) => (
            <div key={i} className="text-center">
              {month} {month === 0 ? "Start" : ""}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-300">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#5ecbf7] mr-2"></div>
          <span>Public Sale</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#ff9f51] mr-2"></div>
          <span>Liquidity Pool</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#bada55] mr-2"></div>
          <span>Developer</span>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-400 italic">
        Chart shows token release over time in months
      </div>
    </div>
  );
};

export default VestingScheduleChart;
