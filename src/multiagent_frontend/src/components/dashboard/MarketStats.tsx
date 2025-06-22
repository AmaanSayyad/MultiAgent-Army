import React from "react";

interface StatItemProps {
  label: string;
  value: string;
  change?: string;
  changePositive?: boolean;
}

export const MarketStats: React.FC = () => {
  const stats: StatItemProps[] = [
    {
      label: "Market Cap",
      value: "$3.2B",
      change: "+5.4%",
      changePositive: true,
    },
    {
      label: "Volume (24h)",
      value: "$142.5M",
      change: "+12.8%",
      changePositive: true,
    },
    {
      label: "Total Value Locked",
      value: "$891.2M",
      change: "-2.3%",
      changePositive: false,
    },
    {
      label: "Active Agents",
      value: "420",
      change: "+15",
      changePositive: true,
    },
  ];

  return (
    <div className="w-full">
      <div className="bg-[rgba(255,255,255,0.05)] rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-bold">Market Stats</h2>
          <div className="flex items-center gap-2">
            <span className="text-white text-xs">Last updated: 5 min ago</span>
            <button className="text-white hover:bg-[rgba(255,255,255,0.1)] rounded-md p-1 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
};

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  change,
  changePositive,
}) => {
  return (
    <div className="bg-[rgba(255,255,255,0.03)] rounded-lg p-3">
      <div className="text-gray-400 text-xs mb-1">{label}</div>
      <div className="flex justify-between items-end">
        <div className="text-white text-xl font-bold">{value}</div>
        {change && (
          <div
            className={`text-sm ${
              changePositive ? "text-green-400" : "text-red-400"
            } flex items-center`}
          >
            {changePositive ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {change}
          </div>
        )}
      </div>
    </div>
  );
};
