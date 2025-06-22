import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ICPService } from "@/lib/icp-service";

interface StakingWidgetProps {
  agentId?: string;
  token: string;
  availableAmount?: number;
  stakingApy?: string;
  totalStaked?: string;
  stakerCount?: number;
}

export const StakingWidget: React.FC<StakingWidgetProps> = ({
  agentId = "",
  token = "IRIS",
  availableAmount = 0,
  stakingApy = "14.5%",
  totalStaked = "0",
  stakerCount = 0,
}) => {
  const [amount, setAmount] = useState<string>("0.0");
  const [loading, setLoading] = useState<boolean>(false);

  const handleMaxClick = () => {
    setAmount(availableAmount.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setLoading(true);

    try {
      // Call to backend to stake tokens
      await ICPService.stakeTokens(agentId, parseFloat(amount));

      // Reset amount after successful staking
      setAmount("0.0");
    } catch (error) {
      console.error("Staking failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRewards = (amount: string, apy: string): string => {
    const amountValue = parseFloat(amount) || 0;
    const apyValue = parseFloat(apy.replace("%", "")) || 0;

    const annualRewards = amountValue * (apyValue / 100);
    return annualRewards.toFixed(4);
  };

  return (
    <Card className="bg-[rgba(0,0,0,0.3)] border-gray-800">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Stake for Virgen Points</span>
          <div className="text-xs text-gray-400 bg-[rgba(0,0,0,0.2)] py-1 px-2 rounded">
            Staking CA: <span className="text-gray-300">0x8a57ic...</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">Available to stake</span>
              <span className="text-sm text-gray-300">
                {availableAmount} {token}
              </span>
            </div>
            <div className="relative">
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="bg-[rgba(0,0,0,0.2)] text-white border-gray-700 pr-16"
                placeholder="0.0"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-[rgba(115,94,181,1)] hover:text-[rgba(135,114,201,1)] hover:bg-transparent"
                onClick={handleMaxClick}
              >
                MAX
              </Button>
            </div>
          </div>

          {parseFloat(amount) > 0 && (
            <div className="bg-[rgba(0,0,0,0.15)] p-3 rounded-lg space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Estimated APY</span>
                <span className="text-green-400">{stakingApy}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Annual Rewards</span>
                <span className="text-gray-300">
                  ~{calculateRewards(amount, stakingApy)} {token}
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={handleStake}
            disabled={
              loading ||
              parseFloat(amount) <= 0 ||
              parseFloat(amount) > availableAmount
            }
            className="w-full bg-[rgba(115,94,181,1)] hover:bg-[rgba(95,74,161,1)] text-white"
          >
            {loading
              ? "Processing..."
              : parseFloat(amount) <= 0
              ? "Enter Amount"
              : "Stake"}
          </Button>

          <div className="space-y-3 mt-4">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Total Staked</span>
              <span className="text-gray-300">
                {totalStaked} {token}
              </span>
            </div>
            <Progress value={30} className="h-1.5 bg-gray-700" />
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Stakers</span>
              <span className="text-gray-300">{stakerCount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
