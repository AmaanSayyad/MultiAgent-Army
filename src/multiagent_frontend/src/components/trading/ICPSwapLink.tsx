import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TokenTradingInfoProps {
  tokenSymbol?: string;
  tokenName?: string;
  tokenIcon?: string;
  inputTokenCanisterId?: string;
  outputTokenCanisterId?: string;
}

export const ICPSwapLink: React.FC<TokenTradingInfoProps> = ({
  tokenSymbol = "TOKEN",
  tokenName = "Token",
  tokenIcon = "/placeholder.svg",
  inputTokenCanisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai", // ICP by default
  outputTokenCanisterId = "xevnm-gaaaa-aaaar-qafnq-cai", // Example token ID
}) => {
  const [showTradingInfo, setShowTradingInfo] = useState(false);
  const swapUrl = `https://app.icpswap.com/swap?input=${inputTokenCanisterId}&output=${outputTokenCanisterId}`;

  const toggleTradingInfo = () => {
    setShowTradingInfo(!showTradingInfo);
  };

  return (
    <Card className="bg-gradient-to-br from-[rgba(20,20,30,0.9)] to-[rgba(10,10,20,0.9)] border-gray-800 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-white flex items-center">
          <img
            src={tokenIcon}
            alt={tokenSymbol}
            className="w-5 h-5 mr-2 object-contain"
          />
          {tokenName} Trading
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[rgba(115,94,181,0.5)] to-[rgba(75,54,141,0.5)] rounded-full overflow-hidden flex items-center justify-center p-0.5">
              <div className="w-full h-full bg-black/40 rounded-full flex items-center justify-center">
                <img
                  src={tokenIcon}
                  alt={tokenSymbol}
                  className="w-7 h-7 object-contain"
                />
              </div>
            </div>
            <div>
              <div className="text-white font-medium text-lg">{tokenName}</div>
              <div className="text-sm text-gray-400">{tokenSymbol}</div>
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded-lg text-gray-300 border border-gray-800/50">
            Trade {tokenSymbol} tokens on ICPSwap, the leading decentralized
            exchange on the Internet Computer Protocol.
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-[rgba(115,94,181,1)] to-[rgba(95,74,161,1)] hover:from-[rgba(125,104,191,1)] hover:to-[rgba(105,84,171,1)] text-white shadow-md">
                  Trade {tokenSymbol}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-[rgba(20,20,30,0.95)] to-[rgba(10,10,20,0.95)] border-gray-800 shadow-xl text-white">
                <DialogHeader>
                  <DialogTitle className="text-xl flex items-center">
                    <img
                      src={tokenIcon}
                      alt={tokenSymbol}
                      className="w-6 h-6 mr-2"
                    />
                    Trade {tokenSymbol} on ICPSwap
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Connect your wallet and start trading {tokenSymbol}.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-3">
                  <div className="flex flex-col space-y-3 bg-black/20 p-4 rounded-lg border border-gray-800/50">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Exchange</span>
                      <span className="text-white font-medium">ICPSwap</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Token</span>
                      <span className="text-white font-medium flex items-center">
                        <img
                          src={tokenIcon}
                          alt={tokenSymbol}
                          className="w-4 h-4 mr-1"
                        />
                        {tokenSymbol}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Canister ID</span>
                      <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
                        {outputTokenCanisterId.substring(0, 10)}...
                        {outputTokenCanisterId.substring(
                          outputTokenCanisterId.length - 5
                        )}
                      </span>
                    </div>
                  </div>

                  <Alert className="bg-indigo-900/20 border border-indigo-800/50">
                    <AlertCircle className="h-4 w-4 text-indigo-400" />
                    <AlertDescription className="text-gray-300 text-sm">
                      ICPSwap requires you to connect your Internet Identity or
                      Plug wallet. All transactions occur on-chain.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-2 gap-3">
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800/50"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      className="bg-gradient-to-r from-[rgba(115,94,181,1)] to-[rgba(95,74,161,1)] hover:from-[rgba(125,104,191,1)] hover:to-[rgba(105,84,171,1)]"
                      onClick={() => window.open(swapUrl, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open ICPSwap
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              className="w-full border-gray-700/50 text-gray-300 hover:bg-black/20"
              onClick={toggleTradingInfo}
            >
              {showTradingInfo ? "Hide Details" : "Show Trading Details"}
            </Button>
          </div>

          {showTradingInfo && (
            <div className="bg-black/30 p-4 rounded-lg border border-gray-800/50 space-y-3 mt-2">
              <h4 className="text-white font-medium">Trading Information</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                <li>
                  ICPSwap is a decentralized exchange on the Internet Computer
                </li>
                <li>You can trade {tokenSymbol} with ICP or other tokens</li>
                <li>
                  Connect your wallet (Internet Identity or Plug) to trade
                </li>
                <li>Ensure you have enough ICP to cover transaction fees</li>
                <li>
                  Be aware of slippage and price impact before confirming trades
                </li>
              </ul>
              <div className="text-xs text-gray-400 mt-2">
                Always verify token canister IDs before trading to avoid scams
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            Trading is done securely through the ICPSwap platform
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
