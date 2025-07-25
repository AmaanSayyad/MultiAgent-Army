import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "rgba(115,94,181,1)",
  message = "Loading...",
}) => {
  const sizeMap = {
    small: {
      wrapper: "h-4 w-4",
      spinner: "h-4 w-4",
    },
    medium: {
      wrapper: "h-8 w-8",
      spinner: "h-8 w-8",
    },
    large: {
      wrapper: "h-12 w-12",
      spinner: "h-12 w-12",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeMap[size].wrapper} relative`}>
        <svg
          className={`${sizeMap[size].spinner} animate-spin`}
          style={{ color }}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
      </div>
      {message && <p className="mt-2 text-gray-400 text-sm">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
