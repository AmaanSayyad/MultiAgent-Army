import React, { useEffect, useRef } from "react";

interface TradingViewProps {
  symbol: string;
  theme?: "dark" | "light";
  autosize?: boolean;
  interval?: string;
  timezone?: string;
  style?: "1" | "2" | "3" | "4";
  locale?: string;
  width?: number | string;
  height?: number | string;
}

export const TradingView: React.FC<TradingViewProps> = ({
  symbol,
  theme = "dark",
  autosize = true,
  interval = "60",
  timezone = "Etc/UTC",
  style = "1",
  locale = "en",
  width = "100%",
  height = 400,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Remove any existing script to avoid duplicates
    if (scriptRef.current) {
      document.body.removeChild(scriptRef.current);
      scriptRef.current = null;
    }

    if (window.TradingView) {
      // If TradingView is already loaded, create the widget
      createWidget();
    } else {
      // If not, load the TradingView script
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = createWidget;
      document.body.appendChild(script);
      scriptRef.current = script;
    }

    return () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, theme, autosize, interval, timezone, style, locale]);

  // We're disabling the ESLint rule for the dependency array above because
  // createWidget is defined in the component body and would cause the effect
  // to run on every render if included in the dependencies

  const createWidget = () => {
    if (containerRef.current && window.TradingView) {
      new window.TradingView.widget({
        container_id: containerRef.current.id,
        symbol: symbol,
        interval: interval,
        timezone: timezone,
        theme: theme,
        style: style,
        locale: locale,
        toolbar_bg: "rgba(0, 0, 0, 0.2)",
        enable_publishing: false,
        allow_symbol_change: false,
        hide_side_toolbar: false,
        studies: ["RSI", "MACD"],
        autosize: autosize,
        width: width,
        height: height,
      });
    }
  };

  return (
    <div className="w-full">
      <div
        id={`tradingview_${symbol.replace("/", "_")}`}
        ref={containerRef}
        style={{ height: autosize ? "100%" : height, width: width }}
      />
    </div>
  );
};

// Add TypeScript interface for TradingView
declare global {
  interface Window {
    TradingView: {
      widget: new (config: {
        container_id: string;
        symbol: string;
        interval: string;
        timezone: string;
        theme: string;
        style: string;
        locale: string;
        toolbar_bg: string;
        enable_publishing: boolean;
        allow_symbol_change: boolean;
        hide_side_toolbar: boolean;
        studies: string[];
        autosize: boolean;
        width: string | number;
        height: string | number;
      }) => void;
    };
  }
}
