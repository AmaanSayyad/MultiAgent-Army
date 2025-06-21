import React, { useState } from "react";
import { WalletConnectionNav } from "./WalletConnectionNav";

export const NavigationBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="flex w-full max-w-[1280px] items-center justify-between mx-auto py-4 px-5">
      <div className="flex-1 max-w-4xl">
        <nav className="bg-[rgba(8,9,14,0.95)] overflow-hidden rounded-xl border border-[rgba(255,255,255,0.03)] shadow-lg">
          <div className="flex items-center h-12">
            <a
              href="/"
              className="flex items-center h-full px-5 text-base text-white font-medium border-r border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <span>AI Agents</span>
            </a>

            <a
              href="/acp"
              className="flex items-center h-full px-5 text-base text-white font-medium border-r border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <span>ACP</span>
            </a>

            <a
              href="/build"
              className="flex items-center gap-1 h-full px-5 text-base text-white font-medium border-r border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <span>Build</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 opacity-70"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>

            <a
              href="/virtual"
              className="flex items-center h-full px-5 text-base text-white font-medium border-r border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <span>VIRTUAL</span>
            </a>

            <a
              href="/about"
              className="flex items-center h-full px-5 text-base text-white font-medium border-r border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <span>About</span>
            </a>

            <div className="flex-1 flex items-center px-4">
              <div className="relative w-full max-w-[240px]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  placeholder="Search for tokens & profiles"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-1.5 bg-[rgba(255,255,255,0.05)] text-white border-none outline-none placeholder-gray-400 text-sm rounded-full focus:bg-[rgba(255,255,255,0.1)] transition-colors"
                />
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div className="flex items-center gap-3 ml-4">
        <div className="flex items-center gap-2">
          <button className="bg-[rgba(8,9,14,0.95)] hover:bg-[rgba(16,18,35,0.95)] border border-[rgba(255,255,255,0.03)] flex items-center justify-center w-9 h-9 rounded-full transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </button>

          <button className="bg-[rgba(8,9,14,0.95)] hover:bg-[rgba(16,18,35,0.95)] border border-[rgba(255,255,255,0.03)] flex items-center justify-center w-9 h-9 rounded-full transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <a
          href="/create-agent"
          className="bg-[#735EB5] hover:bg-[rgba(115,94,181,0.85)] text-white font-medium px-4 py-2 rounded-full flex items-center gap-1.5 transition-colors shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create Agent
        </a>

        <WalletConnectionNav />
      </div>
    </header>
  );
};
