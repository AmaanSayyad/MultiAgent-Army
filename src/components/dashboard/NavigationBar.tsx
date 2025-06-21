import React, { useState } from "react";
import { Link } from "react-router-dom";
import { WalletConnectionNav } from "./WalletConnectionNav";

export const NavigationBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="flex w-full items-center justify-between py-4">
      <div className="flex-1 max-w-4xl">
        <nav className="bg-[rgba(8,9,14,0.95)] overflow-hidden rounded-xl border border-[rgba(255,255,255,0.03)] shadow-lg">
          <div className="flex items-center h-12">
            <Link
              to="/"
              className="flex items-center h-full px-5 text-base text-white font-medium border-r border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <span>AI Agents</span>
            </Link>

            <Link
              to="/army"
              className="flex items-center h-full px-5 text-base text-white font-medium border-r border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <span>ARMY</span>
            </Link>

            <Link
              to="/about"
              className="flex items-center h-full px-5 text-base text-white font-medium border-r border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <span>About</span>
            </Link>

            <div className="flex-1 flex items-center px-4">
              <div className="relative w-full">
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
                  className="w-full pl-10 pr-3 py-2 bg-transparent text-white border-none outline-none placeholder-gray-400 text-sm"
                />
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <button className="bg-[rgba(8,9,14,0.95)] hover:bg-[rgba(16,18,35,0.95)] border border-[rgba(255,255,255,0.03)] flex items-center justify-center w-10 h-10 rounded-full transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <Link
          to="/create-agent"
          className="bg-[#735EB5] hover:bg-[rgba(95,78,150,1)] text-white font-medium px-4 py-2 rounded-full flex items-center gap-1 transition-colors"
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
          Create New Agent
        </Link>

        <WalletConnectionNav />
      </div>
    </header>
  );
};
