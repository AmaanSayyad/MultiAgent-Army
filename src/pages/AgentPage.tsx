import React from "react";
import { useParams } from "react-router-dom";
import { AgentDetails } from "@/components/dashboard/AgentDetails";
import { NavigationBar } from "@/components/dashboard/NavigationBar";
import { Sidebar } from "@/components/dashboard/Sidebar";

const AgentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="bg-[rgb(8,9,14)] min-h-screen">
      <div className="container mx-auto flex min-h-screen">
        <Sidebar />

        <main className="flex-1 px-4 py-6">
          <NavigationBar />

          <div className="mt-8 max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Agent Details</h1>
              <p className="text-gray-400 mt-2">
                View information and stats about this agent
              </p>
            </div>

            <AgentDetails />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AgentPage;
