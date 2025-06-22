import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TokenomicsProps {
  tokenSymbol?: string;
  distribution?: {
    builder: number;
    publicSale: number;
    platform: number;
    stakers: number;
  };
  totalSupply?: string;
  circulatingSupply?: string;
}

export const TokenomicsWidget: React.FC<TokenomicsProps> = ({
  tokenSymbol = "TOKEN",
  distribution = {
    builder: 30,
    publicSale: 40,
    platform: 5,
    stakers: 25,
  },
  totalSupply = "100,000,000",
  circulatingSupply = "45,000,000",
}) => {
  const distributionItems = [
    { name: "Builder", value: distribution.builder, color: "bg-[#735EB5]" },
    {
      name: "Public Sale",
      value: distribution.publicSale,
      color: "bg-[#41C3A9]",
    },
    { name: "Platform", value: distribution.platform, color: "bg-[#F7931A]" },
    { name: "Stakers", value: distribution.stakers, color: "bg-[#5E72E4]" },
  ];

  return (
    <Card className="bg-[rgba(0,0,0,0.3)] border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-white">Tokenomics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Supply</span>
              <span className="text-white font-medium">
                {totalSupply} {tokenSymbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Circulating Supply</span>
              <span className="text-white font-medium">
                {circulatingSupply} {tokenSymbol}
              </span>
            </div>
            <Progress
              value={
                (Number(circulatingSupply.replace(/,/g, "")) /
                  Number(totalSupply.replace(/,/g, ""))) *
                100
              }
              className="h-1.5 bg-gray-700"
            />
          </div>

          <div>
            <h4 className="text-sm text-gray-400 mb-3">Token Distribution</h4>
            <div className="space-y-3">
              {distributionItems.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.name}</span>
                    <span className="text-white">{item.value}%</span>
                  </div>
                  <Progress
                    value={item.value}
                    className={`h-1.5 ${item.color}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
