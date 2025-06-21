import React from "react";

interface TokenDistribution {
  developer: number;
  publicSale: number;
  liquidityPool: number;
}

interface VestingSchedule {
  developerMonths: number;
  publicSaleMonths: number;
  liquidityPoolMonths: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  wallet?: string;
  expertise?: string[];
}

interface SummaryProps {
  onPrevious: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  formData: {
    launchType: "genesis" | "standard" | "existing";
    agentPicture: string | null;
    agentName: string;
    ticker: string;
    agentType: string;
    shortPitch: string;
    agentOverview: string;
    framework: string;
    twitterConnected: boolean;
    websiteVerified: boolean;
    twitterUrl?: string;
    websiteUrl?: string;
    preBuyAmount: string;
    teamMembers: TeamMember[];
    tokenDistribution?: TokenDistribution;
    vestingSchedule?: VestingSchedule;
    totalSupply?: number;
    launchDate?: string;
    launchTime?: {
      hour: string;
      minute: string;
    };
  };
}

export const Summary: React.FC<SummaryProps> = ({
  onPrevious,
  onCancel,
  onSubmit,
  formData,
}) => {
  return (
    <div className="w-full space-y-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Create New Agent on Base</h2>
        <button className="text-gray-400 hover:text-white transition-colors text-sm">
          Want to launch on Solana instead?
        </button>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8 relative">
        {[
          "Launch Type",
          "Agent Details",
          "Project Pitch",
          "Team Background",
          "Tokenomics",
          "Additional Details",
          "Launch Date",
          "Summary",
        ].map((step, index) => (
          <div key={index} className="flex flex-col items-center z-10">
            <div
              className={`w-4 h-4 rounded-full z-10 bg-[rgba(115,94,181,1)]`}
            ></div>
            <span className="text-xs mt-2 text-white">{step}</span>
          </div>
        ))}

        {/* Progress line */}
        <div className="absolute top-2 h-0.5 bg-[rgba(115,94,181,1)] w-full -z-0"></div>
      </div>

      {/* Main Content */}
      <div>
        <button
          onClick={onPrevious}
          className="flex items-center text-gray-400 hover:text-white mb-4"
        >
          <span className="mr-2">←</span> Back
        </button>

        <h1 className="text-2xl font-bold mb-6">Summary</h1>

        <div className="space-y-6">
          {/* Agent Details Summary */}
          <div className="bg-[rgba(30,30,30,0.8)] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Agent Details</h3>
            <div className="flex items-start">
              {formData.agentPicture && (
                <img
                  src={formData.agentPicture}
                  alt="Agent"
                  className="w-20 h-20 rounded-full mr-4 object-cover"
                />
              )}
              <div>
                <h4 className="text-xl font-bold">{formData.agentName}</h4>
                <p className="text-gray-400">{formData.ticker}</p>
                <p className="mt-2 text-gray-300">{formData.agentType}</p>
              </div>
            </div>
          </div>

          {/* Launch Type Summary */}
          <div className="bg-[rgba(30,30,30,0.8)] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Launch Type</h3>
            <p className="capitalize text-gray-300">
              {formData.launchType} Launch
            </p>

            {formData.launchType === "genesis" && (
              <div className="mt-3">
                <p className="text-gray-400 mb-1">Tokenomics:</p>
                <ul className="list-disc list-inside text-gray-300 text-sm">
                  <li>37.5% Public Sale</li>
                  <li>12.5% Liquidity Pool</li>
                  <li>50.0% Developer's Allocation</li>
                </ul>
              </div>
            )}

            {formData.launchType === "standard" && (
              <div className="mt-3">
                <p className="text-gray-400 mb-1">Tokenomics:</p>
                <ul className="list-disc list-inside text-gray-300 text-sm">
                  <li>87.5% Public Sale</li>
                  <li>12.5% Liquidity Pool</li>
                </ul>
              </div>
            )}
          </div>

          {/* Project Summary */}
          <div className="bg-[rgba(30,30,30,0.8)] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Project Details</h3>
            <div className="mb-4">
              <p className="text-gray-400 mb-1">Short Pitch:</p>
              <p className="text-gray-300">{formData.shortPitch}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Framework:</p>
              <p className="text-gray-300">
                {formData.framework === "game"
                  ? "Game Framework"
                  : "Custom Framework"}
              </p>
            </div>
          </div>

          {/* Team Summary */}
          {formData.teamMembers.length > 0 && (
            <div className="bg-[rgba(30,30,30,0.8)] rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Team</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center">
                    <div className="w-8 h-8 bg-blue-400 rounded-full mr-3 flex items-center justify-center text-white text-sm font-bold">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        member.name.substring(0, 1).toUpperCase() || "?"
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium truncate">
                        {member.name || "Anonymous"}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {member.role || "Contributor"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tokenomics Summary */}
          {formData.tokenDistribution && (
            <div className="bg-[rgba(30,30,30,0.8)] rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Tokenomics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2 text-gray-300">
                    Token Distribution
                  </h4>
                  <div className="space-y-2">
                    {formData.launchType === "genesis" && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Developer</span>
                        <span className="text-gray-300">
                          {formData.tokenDistribution.developer}%
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Public Sale</span>
                      <span className="text-gray-300">
                        {formData.tokenDistribution.publicSale}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Liquidity Pool</span>
                      <span className="text-gray-300">
                        {formData.tokenDistribution.liquidityPool}%
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-gray-300">
                    Vesting Schedule
                  </h4>
                  <div className="space-y-2">
                    {formData.launchType === "genesis" && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Developer Vesting</span>
                        <span className="text-gray-300">
                          {formData.vestingSchedule?.developerMonths} months
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Public Sale Vesting</span>
                      <span className="text-gray-300">
                        {formData.vestingSchedule?.publicSaleMonths} months
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Liquidity Pool Vesting
                      </span>
                      <span className="text-gray-300">
                        {formData.vestingSchedule?.liquidityPoolMonths} months
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Supply</span>
                  <span className="text-gray-300 font-medium">
                    {formData.totalSupply?.toLocaleString()} tokens
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Launch Date Summary */}
          {formData.launchDate && formData.launchTime && (
            <div className="bg-[rgba(30,30,30,0.8)] rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Launch Schedule</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-gray-400 mb-1">
                    This {formData.launchType} Launch will go live at
                  </h4>
                  <div className="bg-[rgba(15,15,25,0.7)] text-white p-3 rounded text-center">
                    {(() => {
                      const displayDate = new Date(formData.launchDate || "");
                      displayDate.setHours(
                        parseInt(formData.launchTime?.hour || "0", 10)
                      );
                      displayDate.setMinutes(
                        parseInt(formData.launchTime?.minute || "0", 10)
                      );

                      return (
                        displayDate.toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                          timeZone: "UTC",
                        }) + " GMT+0"
                      );
                    })()}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-400">until</span>
                  <div className="flex-1 mx-2">
                    <div className="bg-[rgba(15,15,25,0.7)] text-white p-3 rounded text-center">
                      {(() => {
                        const startDate = new Date(formData.launchDate || "");
                        startDate.setHours(
                          parseInt(formData.launchTime?.hour || "0", 10)
                        );
                        startDate.setMinutes(
                          parseInt(formData.launchTime?.minute || "0", 10)
                        );

                        const endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + 1); // Add 24 hours

                        return (
                          endDate.toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                            timeZone: "UTC",
                          }) + " GMT+0"
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Links */}
          <div className="bg-[rgba(30,30,30,0.8)] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">
              Social & Online Presence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-3"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"
                  />
                </svg>
                <span className="text-gray-300">
                  {formData.twitterConnected ? "Connected" : "Not connected"}
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <span className="text-gray-300">
                  {formData.websiteVerified ? "Verified" : "Not verified"}
                </span>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-[rgba(115,94,181,0.1)] rounded-lg p-6 border border-[rgba(115,94,181,0.3)]">
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[rgba(115,94,181,1)] mr-3 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h4 className="text-white font-medium mb-2">
                  Important Notice
                </h4>
                <p className="text-gray-300 text-sm">
                  By submitting, you confirm that your agent complies with our
                  terms and policies. Once deployed, some properties cannot be
                  modified. Please make sure all details are correct before
                  proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-between mt-8">
        <div></div>
        <div className="flex gap-4 items-center">
          <button
            onClick={onCancel}
            className="bg-[rgba(30,30,30,0.8)] hover:bg-[rgba(50,50,50,0.8)] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="bg-[rgba(115,94,181,1)] hover:bg-[rgba(95,78,150,1)] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Launch Agent
          </button>
        </div>
      </div>
    </div>
  );
};
