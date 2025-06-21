import React, { useState, useEffect } from "react";

interface LaunchDatePickerProps {
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  formData: {
    launchDate?: string;
    launchTime?: {
      hour: string;
      minute: string;
    };
    launchType?: "genesis" | "standard" | "existing" | null;
  };
  updateFormData: (data: {
    launchDate: string;
    launchTime: {
      hour: string;
      minute: string;
    };
  }) => void;
}

export const LaunchDatePicker: React.FC<LaunchDatePickerProps> = ({
  onNext,
  onPrevious,
  onCancel,
  formData,
  updateFormData,
}) => {
  // Current date (today) formatted as YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // Default date should be 3 days from now
  const getDefaultDate = () => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 3);
    return defaultDate.toISOString().split("T")[0];
  };

  const [launchDate, setLaunchDate] = useState<string>(
    formData.launchDate || getDefaultDate()
  );

  const [hour, setHour] = useState<string>(formData.launchTime?.hour || "3");

  const [minute, setMinute] = useState<string>(
    formData.launchTime?.minute || "17"
  );

  const [errors, setErrors] = useState<string | null>(null);

  // Launch type specific data
  const isGenesis = formData.launchType === "genesis";
  const isStandard = formData.launchType === "standard";

  // Calculate the end date (24 hours after launch date)
  const calculateEndDate = () => {
    if (!launchDate) return "";

    const startDate = new Date(launchDate);
    startDate.setHours(parseInt(hour || "0", 10));
    startDate.setMinutes(parseInt(minute || "0", 10));

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
  };

  // Format for display
  const formatDisplayDate = (date: string) => {
    if (!date) return "";

    const displayDate = new Date(date);
    displayDate.setHours(parseInt(hour || "0", 10));
    displayDate.setMinutes(parseInt(minute || "0", 10));

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
  };

  // Validate date is at least 3 days in the future
  useEffect(() => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);

    const selectedDate = new Date(launchDate);

    if (selectedDate < minDate) {
      setErrors("Launch date must be at least 3 days in the future");
    } else {
      setErrors(null);
    }
  }, [launchDate]);

  const handleNext = () => {
    if (errors) return;

    updateFormData({
      launchDate,
      launchTime: {
        hour,
        minute,
      },
    });
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

        <h1 className="text-2xl font-bold mb-6">Launch Date</h1>

        <p className="text-gray-400 mb-6">
          We advise setting the launch date at least 3 days from now to allow
          sufficient time for marketing and community preparation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-4">Launch Date and Time</h3>

              <div className="flex flex-wrap gap-4 mb-6">
                <div>
                  <label className="sr-only">Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={launchDate}
                      onChange={(e) => setLaunchDate(e.target.value)}
                      min={today}
                      className="bg-[rgba(30,30,30,0.8)] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[rgba(115,94,181,1)] transition-colors"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="sr-only">Hour</label>
                  <select
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className="bg-[rgba(30,30,30,0.8)] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[rgba(115,94,181,1)] transition-colors"
                  >
                    {[...Array(24)].map((_, i) => (
                      <option key={i} value={i}>
                        {i} {i < 12 ? "am" : "pm"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="sr-only">Minute</label>
                  <select
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    className="bg-[rgba(30,30,30,0.8)] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[rgba(115,94,181,1)] transition-colors"
                  >
                    {[...Array(60)].map((_, i) => (
                      <option key={i} value={i}>
                        {i < 10 ? `0${i}` : i} min
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {errors && <p className="text-red-500 text-sm">{errors}</p>}
            </div>
          </div>

          <div className="bg-[rgba(20,20,30,0.5)] border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Launch Summary</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-gray-400 mb-1">
                  This {isGenesis ? "Genesis" : "Standard"} Launch will go live
                  at
                </h4>
                <div className="bg-[rgba(15,15,25,0.7)] text-white p-3 rounded text-center">
                  {formatDisplayDate(launchDate)}
                </div>
              </div>

              <div className="flex items-center">
                <span className="text-gray-400">until</span>
                <div className="flex-1 mx-2">
                  <div className="bg-[rgba(15,15,25,0.7)] text-white p-3 rounded text-center">
                    {calculateEndDate()}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-400">
                <p>
                  During this 24-hour period, users will be able to participate
                  in your token launch.
                </p>
                {isGenesis && (
                  <p className="mt-2">
                    For Genesis launches, a minimum of 42,425 $ARMY commitment
                    is required for success.
                  </p>
                )}
                {isStandard && (
                  <p className="mt-2">
                    For Standard launches, your agent will become Sentient once
                    42,425 $ARMY is bought.
                  </p>
                )}
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
            onClick={handleNext}
            className={`${
              errors
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[rgba(115,94,181,1)] hover:bg-[rgba(95,78,150,1)]"
            } text-white px-6 py-2 rounded-lg transition-colors`}
            disabled={!!errors}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LaunchDatePicker;
