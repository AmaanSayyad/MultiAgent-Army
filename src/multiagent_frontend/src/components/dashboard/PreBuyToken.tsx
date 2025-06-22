import React, { useState } from "react";

interface PreBuyTokenProps {
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  formData: {
    tokenSymbol: string;
    preBuyAmount: string;
  };
  updateFormData: (data: Partial<PreBuyTokenProps["formData"]>) => void;
}

export const PreBuyToken: React.FC<PreBuyTokenProps> = ({
  onNext,
  onPrevious,
  onCancel,
  formData,
  updateFormData,
}) => {
  const [errors, setErrors] = useState<{
    preBuyAmount?: string;
  }>({});

  const handleAmountChange = (value: string) => {
    // Allow only numeric input with decimals
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
      updateFormData({ preBuyAmount: value });

      // Clear error when user types
      if (errors.preBuyAmount) {
        setErrors({ ...errors, preBuyAmount: undefined });
      }
    }
  };

  const handleSetMax = () => {
    // This would typically check the user's balance
    // For now, we'll set a placeholder max value
    updateFormData({ preBuyAmount: "10.00" });

    if (errors.preBuyAmount) {
      setErrors({ ...errors, preBuyAmount: undefined });
    }
  };

  const handleNext = () => {
    const newErrors: { preBuyAmount?: string } = {};

    // Validate form - ensure amount is a valid number
    const amount = parseFloat(formData.preBuyAmount);
    if (isNaN(amount)) {
      newErrors.preBuyAmount = "Please enter a valid amount";
    } else if (amount <= 0) {
      newErrors.preBuyAmount = "Amount must be greater than 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  // Calculate the token amount based on the buy amount
  // This would use a real exchange rate in a production environment
  const exchangeRate = 0.0;
  const tokenAmount = formData.preBuyAmount
    ? parseFloat(formData.preBuyAmount) * exchangeRate
    : 0;

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
          "Lunch Date",
          "Summary",
        ].map((step, index) => (
          <div key={index} className="flex flex-col items-center z-10">
            <div
              className={`w-4 h-4 rounded-full z-10 ${
                index <= 6
                  ? "bg-[rgba(115,94,181,1)]"
                  : "bg-[rgba(255,255,255,0.2)]"
              }`}
            ></div>
            <span
              className={`text-xs mt-2 ${
                index <= 6 ? "text-white" : "text-gray-400"
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

        <h1 className="text-2xl font-bold mb-6">Lunch Date</h1>

        <p className="text-gray-400 mb-6">
          Purchasing a small amount of your token is optional but can help
          protect your coin from snipers.
        </p>

        {/* Buy Token Form */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <h3 className="text-lg font-medium">
                Buy {formData.tokenSymbol || "TOKEN"}
              </h3>
            </div>
            <button
              onClick={handleSetMax}
              className="text-gray-400 hover:text-white text-sm"
            >
              Max
            </button>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              value={formData.preBuyAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full bg-[rgba(30,30,30,0.8)] border border-[rgba(60,60,60,0.8)] text-white px-4 py-3 rounded-lg pr-24"
              placeholder="0.00"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
              <span className="text-gray-400 mr-1">+</span>
              <span className="text-gray-400">ARMY</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-400">
              You will receive{" "}
              <span className="text-white">{tokenAmount.toFixed(2)}</span>{" "}
              <span className="opacity-50">
                ({(tokenAmount > 0 ? 0.0 : 0).toFixed(2)}%)
              </span>
            </p>
          </div>

          {/* Trading Fee Info */}
          <div className="flex items-center mb-6">
            <span className="text-gray-400 mr-2">Trading Fee</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {errors.preBuyAmount && (
            <p className="text-red-500 text-sm mb-4">{errors.preBuyAmount}</p>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-between mt-8">
        <div>
          {!formData.preBuyAmount && (
            <div className="text-red-500 text-sm">
              Please enter a valid amount.
            </div>
          )}
        </div>
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
