import React from "react";

interface DeploymentStatusItemProps {
  name: string;
  symbol: string;
  status: "live" | "pending" | "completed";
  progress?: number;
  releaseDate?: string;
  image: string;
  timeRemaining?: string;
}

// We keep the original interface for backwards compatibility
interface OriginalDeploymentStatusProps {
  step:
    | "preparing"
    | "agent"
    | "token"
    | "tokenomics"
    | "tokensale"
    | "revenueSplit"
    | "registry"
    | "complete"
    | "failed";
  error?: string;
}

// Original component renamed to avoid conflicts
const OriginalDeploymentStatus: React.FC<OriginalDeploymentStatusProps> = ({
  step,
  error,
}) => {
  const steps = [
    { id: "preparing", label: "Preparing Deployment" },
    { id: "agent", label: "Deploying Agent Canister" },
    { id: "token", label: "Creating DIP-20 Token" },
    { id: "tokenomics", label: "Configuring Tokenomics" },
    { id: "tokensale", label: "Setting Up Token Sale" },
    { id: "revenueSplit", label: "Configuring Revenue Split" },
    { id: "registry", label: "Registering in Agent Registry" },
    { id: "complete", label: "Deployment Complete" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="bg-[rgba(20,20,20,0.8)] rounded-xl p-6">
      <h3 className="text-white text-xl font-bold mb-4">
        Deploying Your Agent
      </h3>

      <div className="space-y-4">
        {steps.map((s, index) => {
          let status: "pending" | "current" | "completed" | "failed" =
            "pending";

          if (index < currentStepIndex) {
            status = "completed";
          } else if (index === currentStepIndex) {
            status = step === "failed" ? "failed" : "current";
          }

          return (
            <div key={s.id} className="flex items-center">
              <div
                className={`
                flex items-center justify-center w-6 h-6 rounded-full mr-3
                ${
                  status === "pending"
                    ? "bg-[rgba(60,60,60,0.8)] text-gray-400"
                    : ""
                }
                ${
                  status === "current"
                    ? "bg-[rgba(115,94,181,1)] text-white"
                    : ""
                }
                ${
                  status === "completed"
                    ? "bg-[rgba(76,186,105,1)] text-white"
                    : ""
                }
                ${
                  status === "failed" ? "bg-[rgba(239,68,68,1)] text-white" : ""
                }
              `}
              >
                {status === "completed" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : status === "failed" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`
                    font-medium 
                    ${status === "pending" ? "text-gray-400" : ""}
                    ${status === "current" ? "text-white" : ""}
                    ${status === "completed" ? "text-white" : ""}
                    ${status === "failed" ? "text-white" : ""}
                  `}
                  >
                    {s.label}
                  </span>

                  {status === "current" && step !== "failed" && (
                    <div className="animate-pulse flex items-center">
                      <div className="h-2 w-2 bg-[rgba(115,94,181,1)] rounded-full mr-1"></div>
                      <div className="h-2 w-2 bg-[rgba(115,94,181,1)] rounded-full mr-1 animation-delay-200"></div>
                      <div className="h-2 w-2 bg-[rgba(115,94,181,1)] rounded-full animation-delay-400"></div>
                    </div>
                  )}
                </div>

                {status === "failed" && index === currentStepIndex && error && (
                  <p className="text-red-400 text-sm mt-1">{error}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {step === "failed" && (
        <div className="mt-6">
          <button className="w-full bg-[rgba(115,94,181,1)] hover:bg-[rgba(95,78,150,1)] text-white py-2 rounded-lg transition-colors">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

// New component for showing token deployment status on the dashboard
export const DeploymentStatusDashboard: React.FC = () => {
  const deployments: DeploymentStatusItemProps[] = [
    {
      name: "FEEN",
      symbol: "$FEEN",
      status: "live",
      progress: 37.41,
      image:
        "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/c5e37802a82236bf478174f32d4630fd260b1fc2",
      timeRemaining: "00d 00h 03m 27s",
    },
    {
      name: "GovBot",
      symbol: "$GOVBOT",
      status: "live",
      progress: 0.41,
      image:
        "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/62dc1643bcc55c1a54b975bdbd59d22356686703",
      timeRemaining: "00d 08h 03m 27s",
    },
  ];

  return (
    <div className="bg-[rgba(255,255,255,0.05)] rounded-xl p-5 my-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-lg font-bold">Deployment Status</h2>
        <button className="text-blue-400 text-sm">View All</button>
      </div>

      <div className="space-y-4">
        {deployments.map((item, index) => (
          <DeploymentStatusItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

const DeploymentStatusItem: React.FC<DeploymentStatusItemProps> = ({
  name,
  symbol,
  status,
  progress = 0,
  image,
  timeRemaining,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "completed":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const getDotColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-400";
      case "pending":
        return "bg-yellow-400";
      case "completed":
        return "bg-blue-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="bg-[rgba(255,255,255,0.03)] rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={image}
          className="w-10 h-10 rounded-full object-cover"
          alt={`${name} logo`}
        />
        <div className="flex-grow">
          <div className="flex justify-between">
            <h3 className="text-white font-medium">{name}</h3>
            <span className="text-gray-400 text-sm">{symbol}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div
              className={`w-2 h-2 rounded-full ${getDotColor(status)}`}
            ></div>
            <span className={`text-xs ${getStatusColor(status)}`}>
              {status === "live"
                ? "Live"
                : status === "pending"
                ? "Pending"
                : "Completed"}
            </span>
            {timeRemaining && (
              <span className="text-gray-400 text-xs">{timeRemaining}</span>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-[rgba(255,255,255,0.1)] h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-blue-500 h-full rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-gray-400 text-xs">Progress</span>
        <span className="text-white text-xs">{progress}%</span>
      </div>
    </div>
  );
};

export default OriginalDeploymentStatus;
