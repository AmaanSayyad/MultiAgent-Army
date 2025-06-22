import React from "react";

interface TokenDistribution {
  developer: number;
  publicSale: number;
  liquidityPool: number;
}

interface TokenomicsChartProps {
  distribution: TokenDistribution;
  totalSupply?: number;
}

export const TokenomicsChart: React.FC<TokenomicsChartProps> = ({
  distribution,
  totalSupply = 1000000,
}) => {
  const { developer, publicSale, liquidityPool } = distribution;

  // Ensure all values sum to 100
  const total = developer + publicSale + liquidityPool;
  const normalizedDeveloper = Math.round((developer / total) * 100);
  const normalizedPublicSale = Math.round((publicSale / total) * 100);
  const normalizedLiquidityPool =
    100 - normalizedDeveloper - normalizedPublicSale;

  return (
    <div className="bg-[rgba(255,255,255,0.05)] rounded-xl p-5">
      <h3 className="text-white font-bold mb-4">Token Distribution</h3>

      <div className="w-full h-40 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          className="max-h-full"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="transparent"
            strokeWidth="20"
          />

          {/* Circular segments for each category */}
          {[
            {
              value: normalizedDeveloper,
              color: "#bada55",
              startAngle: 0,
            },
            {
              value: normalizedPublicSale,
              color: "#5ecbf7",
              startAngle: normalizedDeveloper,
            },
            {
              value: normalizedLiquidityPool,
              color: "#ff9f51",
              startAngle: normalizedDeveloper + normalizedPublicSale,
            },
          ].map((segment, i) => {
            const segmentAngle = (segment.value / 100) * 360;
            const startAngle = (segment.startAngle / 100) * 360 - 90; // Start from top (12 o'clock)
            const endAngle = startAngle + segmentAngle;

            // Convert angles to radians
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            // Calculate start and end points
            const startX = 50 + 40 * Math.cos(startRad);
            const startY = 50 + 40 * Math.sin(startRad);
            const endX = 50 + 40 * Math.cos(endRad);
            const endY = 50 + 40 * Math.sin(endRad);

            // Large arc flag if angle > 180 degrees
            const largeArcFlag = segmentAngle > 180 ? 1 : 0;

            return (
              <path
                key={i}
                d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                fill={segment.color}
              />
            );
          })}

          {/* Inner circle (hole) */}
          <circle cx="50" cy="50" r="25" fill="rgba(20,20,20,0.8)" />
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#bada55] mr-2"></div>
          <span className="text-white text-sm">Developer</span>
          <span className="text-white text-sm ml-auto">
            {normalizedDeveloper}%
          </span>
        </div>

        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#5ecbf7] mr-2"></div>
          <span className="text-white text-sm">Public Sale</span>
          <span className="text-white text-sm ml-auto">
            {normalizedPublicSale}%
          </span>
        </div>

        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#ff9f51] mr-2"></div>
          <span className="text-white text-sm">Liquidity Pool</span>
          <span className="text-white text-sm ml-auto">
            {normalizedLiquidityPool}%
          </span>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        {developer > 0 && (
          <div>
            <strong className="text-white">Developer: </strong>
            {developer}% (
            {Math.floor((developer / 100) * totalSupply).toLocaleString()}{" "}
            tokens)
          </div>
        )}

        {publicSale > 0 && (
          <div>
            <strong className="text-white">Public Sale: </strong>
            {publicSale}% (
            {Math.floor((publicSale / 100) * totalSupply).toLocaleString()}{" "}
            tokens)
          </div>
        )}

        {liquidityPool > 0 && (
          <div>
            <strong className="text-white">Liquidity Pool: </strong>
            {liquidityPool}% (
            {Math.floor((liquidityPool / 100) * totalSupply).toLocaleString()}{" "}
            tokens)
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenomicsChart;
