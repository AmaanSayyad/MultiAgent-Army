import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Trade {
  id: string;
  type: "buy" | "sell";
  price: string;
  amount: string;
  value: string;
  time: string;
  wallet: string;
}

interface RecentTradesProps {
  trades?: Trade[];
  symbol?: string;
}

export const RecentTrades: React.FC<RecentTradesProps> = ({
  trades = [],
  symbol = "TOKEN",
}) => {
  // Generate mock trades if none provided
  const displayTrades =
    trades.length > 0
      ? trades
      : [
          {
            id: "1",
            type: "buy",
            price: "0.0428",
            amount: "2,500",
            value: "$107.00",
            time: "2 mins ago",
            wallet: "0x8a57...ad93",
          },
          {
            id: "2",
            type: "sell",
            price: "0.0422",
            amount: "1,200",
            value: "$50.64",
            time: "5 mins ago",
            wallet: "0xc54a...f32d",
          },
          {
            id: "3",
            type: "buy",
            price: "0.0420",
            amount: "5,000",
            value: "$210.00",
            time: "12 mins ago",
            wallet: "0x3b7c...e1a2",
          },
          {
            id: "4",
            type: "buy",
            price: "0.0419",
            amount: "800",
            value: "$33.52",
            time: "25 mins ago",
            wallet: "0x7f3d...92c1",
          },
          {
            id: "5",
            type: "sell",
            price: "0.0425",
            amount: "3,200",
            value: "$136.00",
            time: "42 mins ago",
            wallet: "0x9e2f...7bc4",
          },
          {
            id: "6",
            type: "sell",
            price: "0.0430",
            amount: "1,500",
            value: "$64.50",
            time: "1 hour ago",
            wallet: "0x4a1d...0ef5",
          },
        ];

  return (
    <Card className="bg-[rgba(0,0,0,0.3)] border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-white">Recent Trades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="text-left font-medium py-2">Price</th>
                <th className="text-right font-medium py-2">
                  Amount ({symbol})
                </th>
                <th className="text-right font-medium py-2">Value</th>
                <th className="text-right font-medium py-2">Time</th>
                <th className="text-right font-medium py-2">Wallet</th>
              </tr>
            </thead>
            <tbody>
              {displayTrades.map((trade) => (
                <tr
                  key={trade.id}
                  className="border-b border-gray-800 last:border-0"
                >
                  <td
                    className={`py-3 text-left ${
                      trade.type === "buy" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    ${trade.price}
                  </td>
                  <td className="py-3 text-right text-gray-300">
                    {trade.amount}
                  </td>
                  <td className="py-3 text-right text-gray-300">
                    {trade.value}
                  </td>
                  <td className="py-3 text-right text-gray-400">
                    {trade.time}
                  </td>
                  <td className="py-3 text-right">
                    <a
                      href="#"
                      className="text-[rgba(115,94,181,1)] hover:underline"
                    >
                      {trade.wallet}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
