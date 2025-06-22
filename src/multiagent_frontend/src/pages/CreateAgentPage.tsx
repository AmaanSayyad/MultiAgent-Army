import React from "react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { NavigationBar } from "../components/dashboard/NavigationBar";
import { AgentCreationForm } from "../components/dashboard/AgentCreationForm";

export const CreateAgentPage: React.FC = () => {
  return (
    <div className="bg-[rgb(8,9,14)] min-h-screen">
      <div className="container mx-auto flex min-h-screen">
        <Sidebar />

        <main className="flex-1 px-4 py-6">
          <NavigationBar />

          <div className="mt-8 max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Create Agent</h1>
              <p className="text-gray-400 mt-2">
                Complete the form below to create and configure your AI agent
              </p>
            </div>

            <AgentCreationForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateAgentPage;
