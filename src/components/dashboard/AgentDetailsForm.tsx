import React, { useState, ChangeEvent } from "react";

interface AgentDetailsFormProps {
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  formData: {
    agentPicture: string | null;
    agentName: string;
    ticker: string;
    agentType: string;
  };
  updateFormData: (
    data: Partial<{
      agentPicture: string | null;
      agentName: string;
      ticker: string;
      agentType: string;
    }>
  ) => void;
}

export const AgentDetailsForm: React.FC<AgentDetailsFormProps> = ({
  onNext,
  onPrevious,
  onCancel,
  formData,
  updateFormData,
}) => {
  const [errors, setErrors] = useState<{
    agentPicture?: string;
    agentName?: string;
    ticker?: string;
    agentType?: string;
  }>({});

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setErrors({
          ...errors,
          agentPicture: "File size exceeds 10MB limit",
        });
        return;
      }

      // Check file type
      if (
        !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
          file.type
        )
      ) {
        setErrors({
          ...errors,
          agentPicture: "Only JPG, PNG, WEBP and GIF files are supported",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        updateFormData({ agentPicture: e.target?.result as string });
        setErrors({ ...errors, agentPicture: undefined });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value });

    // Clear error when user types
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleNext = () => {
    const newErrors: {
      agentPicture?: string;
      agentName?: string;
      ticker?: string;
      agentType?: string;
    } = {};

    // Validate form
    if (!formData.agentPicture) {
      newErrors.agentPicture = "Please upload an agent profile picture";
    }

    if (!formData.agentName.trim()) {
      newErrors.agentName = "Agent name is required";
    } else if (formData.agentName.length > 100) {
      newErrors.agentName = "Agent name cannot exceed 100 characters";
    }

    if (!formData.ticker.trim()) {
      newErrors.ticker = "Ticker is required";
    } else if (formData.ticker.length > 10) {
      newErrors.ticker = "Ticker cannot exceed 10 characters";
    }

    if (!formData.agentType) {
      newErrors.agentType = "Please select an agent type";
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
          "Additional Details",
          "Lunch Date",
          "Summary",
        ].map((step, index) => (
          <div key={index} className="flex flex-col items-center z-10">
            <div
              className={`w-4 h-4 rounded-full z-10 ${
                index <= 1
                  ? "bg-[rgba(115,94,181,1)]"
                  : "bg-[rgba(255,255,255,0.2)]"
              }`}
            ></div>
            <span
              className={`text-xs mt-2 ${
                index <= 1 ? "text-white" : "text-gray-400"
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

        <h1 className="text-2xl font-bold mb-6">Agent Details</h1>

        {/* Agent Picture */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-medium">Agent Picture</h3>
            <span className="text-red-500 ml-1">*</span>
          </div>

          <div className="flex items-center mb-2">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mr-4 relative">
              {formData.agentPicture ? (
                <img
                  src={formData.agentPicture}
                  alt="Agent"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
              <input
                type="file"
                id="agent-picture"
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                onChange={handleImageUpload}
                accept="image/jpeg,image/png,image/webp,image/gif"
              />
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                JPG, PNG, WEBP and GIF files supported.
              </p>
              <p className="text-gray-400 text-sm">
                Maximum file size is 10MB.
              </p>
            </div>
          </div>
          {errors.agentPicture && (
            <p className="text-red-500 text-sm">{errors.agentPicture}</p>
          )}
        </div>

        {/* Agent Name */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-medium">AI Agent Name</h3>
            <span className="text-red-500 ml-1">*</span>
          </div>
          <input
            type="text"
            value={formData.agentName}
            onChange={(e) => handleInputChange("agentName", e.target.value)}
            className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-4 py-3 rounded-lg"
            placeholder="Agent Name"
          />
          <div className="flex justify-end mt-1">
            <span className="text-gray-400 text-sm">
              {formData.agentName.length} / 100
            </span>
          </div>
          {errors.agentName && (
            <p className="text-red-500 text-sm">{errors.agentName}</p>
          )}
        </div>

        {/* Ticker */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-medium">Ticker</h3>
            <span className="text-red-500 ml-1">*</span>
          </div>
          <input
            type="text"
            value={formData.ticker}
            onChange={(e) => handleInputChange("ticker", e.target.value)}
            className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-4 py-3 rounded-lg"
            placeholder="$ E.g. $TICKER (Maximum 10 characters)"
          />
          <div className="flex justify-end mt-1">
            <span className="text-gray-400 text-sm">
              {formData.ticker.length} / 10
            </span>
          </div>
          {errors.ticker && (
            <p className="text-red-500 text-sm">{errors.ticker}</p>
          )}
        </div>

        {/* Agent Type */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-medium">Agent Type</h3>
            <span className="text-red-500 ml-1">*</span>
          </div>
          <select
            value={formData.agentType}
            onChange={(e) => handleInputChange("agentType", e.target.value)}
            className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-4 py-3 rounded-lg appearance-none"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml;charset=US-ASCII,<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z" fill="white"/></svg>\')',
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
            }}
          >
            <option value="">Select agent type</option>
            <option value="utility">Utility</option>
            <option value="content">Content Creation</option>
            <option value="trading">Trading</option>
            <option value="gaming">Gaming</option>
            <option value="social">Social</option>
            <option value="other">Other</option>
          </select>
          {errors.agentType && (
            <p className="text-red-500 text-sm">{errors.agentType}</p>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mb-8 text-xs text-gray-400">
          <p>
            Disclaimer: Avoid using third-party token lockers during the bonding
            stage, as it may lead to token loss. Instead, send tokens to Army's
            wallet 0xd4d68299f8562f09e45cdab5f1d9ef6a0e02a4e32 for a secure,
            immediate 6-month lock.
          </p>
        </div>

        {/* Error message area */}
        {Object.values(errors).some((error) => error) && (
          <div className="text-red-500 text-sm mb-4">
            Please upload the agent profile picture.
          </div>
        )}
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
