import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Notification {
  id: string;
  type: "staking" | "trade" | "launch" | "update";
  message: string;
  time: string;
}

interface AgentActivityProps {
  notifications?: Notification[];
  maxItems?: number;
}

export const AgentActivity: React.FC<AgentActivityProps> = ({
  notifications = [],
  maxItems = 5,
}) => {
  // Generate mock notifications if none provided
  const displayNotifications =
    notifications.length > 0
      ? notifications
      : [
          {
            id: "1",
            type: "staking",
            message: "User 0x6a4b staked 5,000 tokens",
            time: "5 mins ago",
          },
          {
            id: "2",
            type: "trade",
            message: "Large buy: 25,000 tokens at $0.042",
            time: "12 mins ago",
          },
          {
            id: "3",
            type: "update",
            message: "Agent performance increased by 15%",
            time: "1 hour ago",
          },
          {
            id: "4",
            type: "staking",
            message: "Rewards distributed: 12,450 tokens",
            time: "3 hours ago",
          },
          {
            id: "5",
            type: "launch",
            message: "New feature: Enhanced data processing",
            time: "1 day ago",
          },
        ].slice(0, maxItems);

  const getIcon = (type: string) => {
    switch (type) {
      case "staking":
        return (
          <div className="bg-green-900 bg-opacity-30 p-1 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        );
      case "trade":
        return (
          <div className="bg-blue-900 bg-opacity-30 p-1 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
        );
      case "launch":
        return (
          <div className="bg-purple-900 bg-opacity-30 p-1 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-purple-400"
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
        );
      case "update":
        return (
          <div className="bg-amber-900 bg-opacity-30 p-1 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-amber-400"
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
          </div>
        );
      default:
        return (
          <div className="bg-gray-900 bg-opacity-30 p-1 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  return (
    <Card className="bg-[rgba(0,0,0,0.3)] border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {displayNotifications.map((notification) => (
            <li key={notification.id} className="flex items-start space-x-3">
              {getIcon(notification.type)}
              <div className="flex-1">
                <p className="text-sm text-gray-300">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
