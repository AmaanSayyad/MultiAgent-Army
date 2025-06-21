import React, { useState, useRef } from "react";

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

// Twitter API popup window settings
const TWITTER_AUTH_URL = "https://twitter.com/i/oauth2/authorize";
const TWITTER_CLIENT_ID = "your-client-id"; // Replace with your actual Twitter API client ID
const TWITTER_REDIRECT_URI =
  "https://your-app-domain.com/auth/twitter/callback";
const TWITTER_SCOPE = "tweet.read users.read";

export const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({
  onNext,
  onPrevious,
  onCancel,
  formData,
  updateFormData,
}) => {
  const [errors, setErrors] = useState<{
    framework?: string;
    website?: string;
  }>({});

  const [isWebsiteModalOpen, setIsWebsiteModalOpen] = useState(false);
  const [websiteInput, setWebsiteInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const websiteInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    updateFormData({ [field]: value });

    // Clear error when user makes a selection
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleConnectTwitter = () => {
    // Twitter OAuth flow
    const params = new URLSearchParams({
      client_id: TWITTER_CLIENT_ID,
      redirect_uri: TWITTER_REDIRECT_URI,
      response_type: "code",
      scope: TWITTER_SCOPE,
      state: "state", // Should be a random string for security
      code_challenge: "challenge", // Should be generated for PKCE
      code_challenge_method: "S256",
    });

    // Open Twitter authorization in a popup window
    const width = 600;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const twitterWindow = window.open(
      `${TWITTER_AUTH_URL}?${params.toString()}`,
      "twitter-auth",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    // Listen for the popup to close or for the OAuth callback
    const checkPopup = setInterval(() => {
      if (!twitterWindow || twitterWindow.closed) {
        clearInterval(checkPopup);

        // In a real implementation, you would verify the OAuth token
        // For demo purposes, we'll simulate a successful connection
        // This would normally be handled by the redirect_uri callback

        updateFormData({
          twitterConnected: true,
          twitterUrl: "https://twitter.com/armyprotocol",
        });
      }
    }, 500);
  };

  const openWebsiteVerificationModal = () => {
    setIsWebsiteModalOpen(true);
    // Focus the input field when the modal opens
    setTimeout(() => {
      if (websiteInputRef.current) {
        websiteInputRef.current.focus();
      }
    }, 100);
  };

  const closeWebsiteVerificationModal = () => {
    setIsWebsiteModalOpen(false);
    setWebsiteInput("");
    setErrors({ ...errors, website: undefined });
  };

  const handleVerifyWebsite = async () => {
    // Validate the website URL format
    if (!websiteInput) {
      setErrors({ ...errors, website: "Please enter a website URL" });
      return;
    }

    // Basic URL validation
    const urlPattern =
      /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?#].*)?$/;
    if (!urlPattern.test(websiteInput)) {
      setErrors({ ...errors, website: "Please enter a valid website URL" });
      return;
    }

    try {
      setIsVerifying(true);

      // In a real implementation, this would verify domain ownership
      // by checking for a meta tag, DNS record, or file upload
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      // Format the URL properly
      let formattedUrl = websiteInput;
      if (!formattedUrl.startsWith("http")) {
        formattedUrl = "https://" + formattedUrl;
      }

      updateFormData({
        websiteVerified: true,
        websiteUrl: formattedUrl,
      });

      closeWebsiteVerificationModal();
    } catch (error) {
      console.error("Failed to verify website:", error);
      setErrors({
        ...errors,
        website: "Verification failed. Please try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNext = () => {
    const newErrors: { framework?: string } = {};

    // Validate form
    if (!formData.framework) {
      newErrors.framework = "Please select a framework";
    }

    // Check if website and Twitter are verified
    if (!formData.twitterConnected || !formData.websiteVerified) {
      // Show warning but allow to proceed
      if (
        window.confirm(
          "Twitter and website verification are recommended for credibility. Are you sure you want to proceed without verification?"
        )
      ) {
        // User confirmed to proceed without verification
      } else {
        return; // User canceled, stay on this page
      }
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

          <div className="bg-[rgba(115,94,181,0.2)] border border-[rgba(115,94,181,0.4)] rounded-lg p-4 mb-6">
            <p className="text-white text-sm">
              <span className="font-medium">Important:</span> Verifying your
              Twitter account and website helps establish credibility for your
              agent. These verifications are required before launch.
            </p>
          </div>

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
                  <span
                    className={
                      formData.twitterConnected
                        ? "text-green-400"
                        : "text-gray-400"
                    }
                  >
                    {formData.twitterConnected
                      ? "Twitter Connected"
                      : "Twitter not connected"}
                  </span>
                </div>
                {formData.twitterConnected ? (
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-green-500 text-sm">Verified</span>
                  </div>
                ) : (
                  <button
                    onClick={handleConnectTwitter}
                    className="px-3 py-1 bg-[rgba(40,40,40,0.8)] rounded text-sm text-gray-300 hover:bg-[rgba(60,60,60,0.8)] transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
              {formData.twitterConnected && formData.twitterUrl && (
                <div className="mt-2 text-sm text-gray-400">
                  <a
                    href={formData.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    {formData.twitterUrl}
                  </a>
                </div>
              )}
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
                  <span
                    className={
                      formData.websiteVerified
                        ? "text-green-400"
                        : "text-gray-400"
                    }
                  >
                    {formData.websiteVerified
                      ? "Website Verified"
                      : "Website not verified"}
                  </span>
                </div>
                {formData.websiteVerified ? (
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-green-500 text-sm">Verified</span>
                  </div>
                ) : (
                  <button
                    onClick={openWebsiteVerificationModal}
                    className="px-3 py-1 bg-[rgba(40,40,40,0.8)] rounded text-sm text-gray-300 hover:bg-[rgba(60,60,60,0.8)] transition-colors"
                  >
                    Verify
                  </button>
                )}
              </div>
              {formData.websiteVerified && formData.websiteUrl && (
                <div className="mt-2 text-sm text-gray-400">
                  <a
                    href={formData.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    {formData.websiteUrl}
                  </a>
                </div>
              )}
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

      {/* Website Verification Modal */}
      {isWebsiteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-70"
            onClick={closeWebsiteVerificationModal}
          ></div>

          {/* Modal Content */}
          <div className="bg-[rgba(20,20,30,0.95)] border border-gray-700 rounded-lg p-6 w-full max-w-md relative z-10">
            <h3 className="text-xl font-medium mb-4 text-white">
              Verify Your Website
            </h3>

            <p className="text-gray-300 mb-4 text-sm">
              Enter your website URL below. In a production environment, this
              would verify domain ownership through DNS records or a
              verification file.
            </p>

            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">
                Website URL
              </label>
              <input
                ref={websiteInputRef}
                type="text"
                value={websiteInput}
                onChange={(e) => setWebsiteInput(e.target.value)}
                placeholder="e.g. example.com"
                className="w-full bg-[rgba(30,30,30,0.8)] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[rgba(115,94,181,1)] transition-colors"
              />
              {errors.website && (
                <p className="text-red-500 text-sm mt-1">{errors.website}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={closeWebsiteVerificationModal}
                className="px-4 py-2 bg-[rgba(40,40,40,0.8)] text-white rounded-lg hover:bg-[rgba(60,60,60,0.8)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyWebsite}
                disabled={isVerifying}
                className="px-4 py-2 bg-[rgba(115,94,181,1)] text-white rounded-lg hover:bg-[rgba(95,78,150,1)] transition-colors flex items-center"
              >
                {isVerifying ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
