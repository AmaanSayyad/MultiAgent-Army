import React, { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: Date;
  onFinish?: () => void;
  className?: string;
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDate,
  onFinish,
  className = "",
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();

      if (difference <= 0) {
        setIsFinished(true);
        if (onFinish) {
          onFinish();
        }
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear interval on unmount
    return () => clearInterval(timer);
  }, [targetDate, onFinish]);

  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {!isFinished ? (
        <>
          {timeLeft.days > 0 && (
            <div className="flex flex-col items-center">
              <div className="bg-[rgba(0,0,0,0.3)] px-3 py-2 rounded-md">
                <span className="text-xl font-bold">
                  {formatNumber(timeLeft.days)}
                </span>
              </div>
              <span className="text-xs mt-1">days</span>
            </div>
          )}
          <div className="flex flex-col items-center">
            <div className="bg-[rgba(0,0,0,0.3)] px-3 py-2 rounded-md">
              <span className="text-xl font-bold">
                {formatNumber(timeLeft.hours)}
              </span>
            </div>
            <span className="text-xs mt-1">hours</span>
          </div>
          <span className="text-xl">:</span>
          <div className="flex flex-col items-center">
            <div className="bg-[rgba(0,0,0,0.3)] px-3 py-2 rounded-md">
              <span className="text-xl font-bold">
                {formatNumber(timeLeft.minutes)}
              </span>
            </div>
            <span className="text-xs mt-1">mins</span>
          </div>
          <span className="text-xl">:</span>
          <div className="flex flex-col items-center">
            <div className="bg-[rgba(0,0,0,0.3)] px-3 py-2 rounded-md">
              <span className="text-xl font-bold">
                {formatNumber(timeLeft.seconds)}
              </span>
            </div>
            <span className="text-xs mt-1">secs</span>
          </div>
        </>
      ) : (
        <div className="text-[rgba(115,94,181,1)] font-bold">
          Launch Completed
        </div>
      )}
    </div>
  );
};

export default Countdown;
