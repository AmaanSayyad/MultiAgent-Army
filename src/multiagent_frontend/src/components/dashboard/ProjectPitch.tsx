import React, { useState } from "react";

interface ProjectPitchProps {
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  formData: {
    shortPitch: string;
    agentOverview: string;
  };
  updateFormData: (data: Record<string, string>) => void;
}

export const ProjectPitch: React.FC<ProjectPitchProps> = ({
  onNext,
  onPrevious,
  onCancel,
  formData,
  updateFormData,
}) => {
  const [errors, setErrors] = useState<{
    shortPitch?: string;
    agentOverview?: string;
  }>({});

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value });

    // Clear error when user types
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleNext = () => {
    const newErrors: {
      shortPitch?: string;
      agentOverview?: string;
    } = {};

    // Validate form
    if (!formData.shortPitch.trim()) {
      newErrors.shortPitch = "Short pitch is required";
    } else if (formData.shortPitch.length > 500) {
      newErrors.shortPitch = "Short pitch cannot exceed 500 characters";
    }

    if (!formData.agentOverview.trim()) {
      newErrors.agentOverview = "Agent overview is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

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
              className={`w-4 h-4 rounded-full z-10 ${
                index <= 2
                  ? "bg-[rgba(115,94,181,1)]"
                  : "bg-[rgba(255,255,255,0.2)]"
              }`}
            ></div>
            <span
              className={`text-xs mt-2 ${
                index <= 2 ? "text-white" : "text-gray-400"
              }`}
            >
              {step}
            </span>
          </div>
        ))}

        {/* Progress line */}
        <div className="absolute top-2 h-0.5 bg-[rgba(255,255,255,0.2)] w-full -z-0"></div>
      </div>

      {/* Main Content */}
      <div>
        <button
          onClick={onPrevious}
          className="flex items-center text-gray-400 hover:text-white mb-4"
        >
          <span className="mr-2">←</span> Back
        </button>

        <h1 className="text-2xl font-bold mb-6">Project Pitch</h1>

        {/* Short Pitch */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-medium">Short Pitch</h3>
            <span className="text-red-500 ml-1">*</span>
          </div>
          <textarea
            value={formData.shortPitch}
            onChange={(e) => handleInputChange("shortPitch", e.target.value)}
            className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-4 py-3 rounded-lg min-h-[120px]"
            placeholder="Write a short, compelling summary of your project to grab attention quickly and communicate the core values. Keep it sharp, engaging, and to the point!"
          />
          <div className="flex justify-end mt-1">
            <span className="text-gray-400 text-sm">
              {formData.shortPitch.length} / 500
            </span>
          </div>
          {errors.shortPitch && (
            <p className="text-red-500 text-sm">{errors.shortPitch}</p>
          )}
        </div>

        {/* Agent Overview */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-medium">Agent Overview</h3>
            <span className="text-red-500 ml-1">*</span>
          </div>
          <p className="text-gray-400 mb-4">
            Treat this as your whitepaper. Tell us more about this agent.
            Include capability, roadmap, key partnership, if any.
          </p>

          {/* Rich text editor toolbar */}
          <div className="flex items-center space-x-2 mb-2 bg-[rgba(25,25,25,0.8)] p-2 rounded-t-lg border-b border-[rgba(60,60,60,0.8)]">
            <button className="p-1 hover:bg-[rgba(50,50,50,0.8)] rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path
                  fillRule="evenodd"
                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button className="p-1 hover:bg-[rgba(50,50,50,0.8)] rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <select className="bg-[rgba(40,40,40,0.8)] text-gray-300 px-2 py-1 rounded text-sm">
              <option>Block type</option>
              <option>Heading 1</option>
              <option>Heading 2</option>
              <option>Paragraph</option>
            </select>
            <div className="h-5 border-l border-gray-600"></div>
            <button className="p-1 hover:bg-[rgba(50,50,50,0.8)] rounded font-bold text-gray-300">
              B
            </button>
            <button className="p-1 hover:bg-[rgba(50,50,50,0.8)] rounded italic text-gray-300">
              I
            </button>
            <button className="p-1 hover:bg-[rgba(50,50,50,0.8)] rounded underline text-gray-300">
              U
            </button>
            <div className="h-5 border-l border-gray-600"></div>
            <button className="p-1 hover:bg-[rgba(50,50,50,0.8)] rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button className="p-1 hover:bg-[rgba(50,50,50,0.8)] rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button className="p-1 hover:bg-[rgba(50,50,50,0.8)] rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button className="p-1 hover:bg-[rgba(50,50,50,0.8)] rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <textarea
            value={formData.agentOverview}
            onChange={(e) => handleInputChange("agentOverview", e.target.value)}
            className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-4 py-3 rounded-b-lg min-h-[300px]"
            placeholder="Provide a comprehensive overview of your agent..."
          />
          {errors.agentOverview && (
            <p className="text-red-500 text-sm mt-1">{errors.agentOverview}</p>
          )}
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
            onClick={handleNext}
            className="bg-[rgba(115,94,181,1)] hover:bg-[rgba(95,78,150,1)] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
