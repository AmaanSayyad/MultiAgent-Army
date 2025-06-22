import React, { useState } from "react";

interface LaunchTypeSelectorProps {
  onSelect: (type: "genesis" | "standard" | "existing") => void;
  onNext: () => void;
  onCancel: () => void;
}

export const LaunchTypeSelector: React.FC<LaunchTypeSelectorProps> = ({
  onSelect,
  onNext,
  onCancel,
}) => {
  const [selectedType, setSelectedType] = useState<
    "genesis" | "standard" | "existing" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (type: "genesis" | "standard" | "existing") => {
    setSelectedType(type);
    onSelect(type);
    setError(null);
  };

  const handleNext = () => {
    if (!selectedType) {
      setError("Please select a launch type.");
      return;
    }
    onNext();
  };

  return (
    <div className="w-full space-y-6 text-white">
      {/* Header & Progress Steps Card */}
      <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Create New Agent on Base</h2>
            <div className="bg-[rgba(115,94,181,1)] rounded-full w-5 h-5 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors text-sm">
            Want to launch on Solana instead?
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-12 relative">
          {[
            "Launch Type",
            "Agent Details",
            "Project Pitch",
            "Tokenomics Design",
            "Team Background",
            "Additional Details",
            "Launch Details",
            "Summary",
          ].map((step, index) => (
            <div key={index} className="flex flex-col items-center z-10">
              <div
                className={`w-4 h-4 rounded-full z-10 ${
                  index === 0 ? "bg-[rgba(115,94,181,1)]" : "bg-[rgba(255,255,255,0.2)]"
                }`}
              ></div>
              <span
                className={`text-xs mt-2 ${
                  index === 0 ? "text-white" : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          ))}

          {/* Progress line */}
          <div className="absolute top-2 h-0.5 bg-[rgba(255,255,255,0.2)] w-full -z-0"></div>
        </div>
      </div>

      {/* Launch Options */}
      <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">
            How do you want to launch your AI Agent?
          </h1>
          <p className="text-gray-400">
            Select the launch type that best fits your project goals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Genesis Launch */}
          <div
            className={`bg-[rgba(30,30,30,0.8)] border ${
              selectedType === "genesis"
                ? "border-[rgba(115,94,181,1)]"
                : "border-[rgba(60,60,60,0.8)]"
            } rounded-xl p-6 cursor-pointer hover:border-[rgba(115,94,181,0.7)] transition-colors`}
            onClick={() => handleSelect("genesis")}
          >
            <div className="flex gap-3 items-center mb-4">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedType === "genesis"
                    ? "border-[rgba(115,94,181,1)]"
                    : "border-gray-400"
                }`}
              >
                {selectedType === "genesis" && (
                  <div className="w-2.5 h-2.5 bg-[rgba(115,94,181,1)] rounded-full"></div>
                )}
              </div>
              <h2 className="text-xl font-bold">Genesis Launch</h2>
            </div>

            <div className="mb-4">
              <h3 className="text-sm text-gray-400 mb-1">
                Minimum FDV at Launch
              </h3>
              <p className="text-white">336,000 $ARMY (~64.48k USD)</p>
            </div>

            <div className="mb-4">
              <h3 className="text-sm text-gray-400 mb-1">Tokenomics</h3>
              <p className="text-white">37.5% (Public Sale)</p>
              <p className="text-white">12.5% (Liquidity Pool)</p>
              <p className="text-white">50.0% (Developer's Allocation)</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-400 mb-1">Mechanism</h3>
              <p className="text-white text-sm mb-2">
                Set a launch date. Armys have 24 hours to pledge their points
                for token allocation.
              </p>
              <p className="text-white text-sm mb-2">
                The launch will be successful if 42,425 $ARMY is committed,
                with a maximum allocation of 0.5% per user. If this condition is
                not met, no agent will be launched.
              </p>
              <p className="text-white text-sm">
                100 $ARMY non-refundable creation fee.
              </p>
            </div>
          </div>

          {/* Standard Launch */}
          <div
            className={`bg-[rgba(30,30,30,0.8)] border ${
              selectedType === "standard"
                ? "border-[rgba(115,94,181,1)]"
                : "border-[rgba(60,60,60,0.8)]"
            } rounded-xl p-6 cursor-pointer hover:border-[rgba(115,94,181,0.7)] transition-colors`}
            onClick={() => handleSelect("standard")}
          >
            <div className="flex gap-3 items-center mb-4">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedType === "standard"
                    ? "border-[rgba(115,94,181,1)]"
                    : "border-gray-400"
                }`}
              >
                {selectedType === "standard" && (
                  <div className="w-2.5 h-2.5 bg-[rgba(115,94,181,1)] rounded-full"></div>
                )}
              </div>
              <h2 className="text-xl font-bold">Standard Launch</h2>
            </div>

            <div className="mb-4">
              <h3 className="text-sm text-gray-400 mb-1">Tokenomics</h3>
              <p className="text-white">87.5% (Public Sale)</p>
              <p className="text-white">12.5% (Liquidity Pool)</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-400 mb-1">Mechanism</h3>
              <p className="text-white text-sm mb-2">
                Launch a brand new token directly.
              </p>
              <p className="text-white text-sm mb-2">
                Once 42,425 $ARMY is bought up, the agent ascends to Sentient.
              </p>
              <p className="text-white text-sm">
                100 $ARMY non-refundable creation fee.
              </p>
            </div>
          </div>
        </div>

        {/* Existing Token Option */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => handleSelect("existing")}
            className="text-[rgba(115,94,181,1)] hover:text-[rgba(95,78,150,1)] transition-colors"
          >
            Launch with an existing token
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      {/* Bottom Controls */}
      <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6">
        <div className="flex justify-between">
          <div className="text-red-500 text-sm">
            {!selectedType && "Please select a launch type."}
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={onCancel}
              className="bg-[rgba(30,30,30,0.8)] hover:bg-[rgba(50,50,50,0.8)] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              className="bg-[rgba(115,94,181,1)] hover:bg-[rgba(95,78,150,1)] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
