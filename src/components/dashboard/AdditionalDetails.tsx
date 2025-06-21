import React, { useState } from "react";

interface AdditionalDetailsProps {
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  formData: {
    framework: string;
    twitterConnected: boolean;
    websiteVerified: boolean;
    twitterUrl?: string;
    websiteUrl?: string;
  };
  updateFormData: (data: Partial<AdditionalDetailsProps["formData"]>) => void;
}

export const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({
  onNext,
  onPrevious,
  onCancel,
  formData,
  updateFormData,
}) => {
  const [errors, setErrors] = useState<{
    framework?: string;
  }>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    updateFormData({ [field]: value });

    // Clear error when user makes a selection
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleConnectTwitter = () => {
    // In a real implementation, this would connect to Twitter via OAuth
    // For now, we'll just simulate a successful connection
    updateFormData({
      twitterConnected: true,
      twitterUrl: "https://twitter.com/username",
    });
  };

  const handleVerifyWebsite = () => {
    // In a real implementation, this would verify domain ownership
    // For now, we'll just simulate a successful verification
    updateFormData({
      websiteVerified: true,
      websiteUrl: "https://example.com",
    });
  };

  const handleNext = () => {
    const newErrors: { framework?: string } = {};

    // Validate form
    if (!formData.framework) {
      newErrors.framework = "Please select a framework";
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
        <div className="text-sm text-gray-400">
          <span className="mr-2">Native token:</span>
          <span className="text-white font-medium">ARMY</span>
        </div>
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
                index <= 5
                  ? "bg-[rgba(115,94,181,1)]"
                  : "bg-[rgba(255,255,255,0.2)]"
              }`}
            ></div>
            <span
              className={`text-xs mt-2 ${
                index <= 5 ? "text-white" : "text-gray-400"
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

        {/* Framework Selection */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-medium">Framework</h3>
            <span className="text-red-500 ml-1">*</span>
          </div>

          <div className="relative">
            <select
              value={formData.framework}
              onChange={(e) => handleInputChange("framework", e.target.value)}
              className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-4 py-3 rounded-lg appearance-none"
              style={{
                backgroundImage:
                  'url(\'data:image/svg+xml;charset=US-ASCII,<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z" fill="white"/></svg>\')',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
              }}
            >
              <option value="">Select a framework</option>
              <option value="custom">Custom Framework</option>
            </select>
          </div>
          {errors.framework && (
            <p className="text-red-500 text-sm mt-1">{errors.framework}</p>
          )}
        </div>

        {/* Social Links */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Social Links</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Twitter */}
            <div className="bg-[rgba(30,30,30,0.8)] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"
                    />
                  </svg>
                  <span className="text-gray-400">Twitter not connected</span>
                </div>
                <button
                  onClick={handleConnectTwitter}
                  className="px-3 py-1 bg-[rgba(40,40,40,0.8)] rounded text-sm text-gray-300 hover:bg-[rgba(60,60,60,0.8)] transition-colors"
                >
                  Connect
                </button>
              </div>
            </div>

            {/* Website */}
            <div className="bg-[rgba(30,30,30,0.8)] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 mr-2"
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
                  <span className="text-gray-400">Website not verified</span>
                </div>
                <button
                  onClick={handleVerifyWebsite}
                  className="px-3 py-1 bg-[rgba(40,40,40,0.8)] rounded text-sm text-gray-300 hover:bg-[rgba(60,60,60,0.8)] transition-colors"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>

        {errors.framework && (
          <div className="text-red-500 text-sm mb-4">
            Please select a framework.
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
