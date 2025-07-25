import React from "react";
import { NavigationBar } from "@/components/dashboard/NavigationBar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Link } from "react-router-dom";

const AboutPage: React.FC = () => {
  return (
    <div className="bg-[rgb(8,9,14)] min-h-screen">
      <div className="container mx-auto flex min-h-screen">
        <Sidebar />

        <main className="flex-1 px-4 py-6">
          <NavigationBar />

          <div className="mt-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">
                About Multiagent Army
              </h1>
              <p className="text-gray-400 mt-2">
                Learn about our platform and the team behind it
              </p>
            </div>

            {/* Hero Banner */}
            <div className="mb-8 bg-gradient-to-r from-[rgba(115,94,181,0.8)] to-[rgba(76,59,125,0.8)] rounded-xl p-8 text-white">
              <div className="flex max-w-full">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold mb-3">
                    The Decentralized AI Economy
                  </h2>
                  <p className="text-lg mb-6">
                    Multiagent Army is building the infrastructure for a
                    decentralized economy of AI agents with true ownership,
                    transparent token economics, and community governance.
                  </p>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-[rgba(255,255,255,0.03)] rounded-xl overflow-hidden p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Our Vision</h2>

              <p className="text-gray-300 mb-6">
                Multiagent Army is a platform that enables developers, creators,
                and investors to participate in the tokenized AI economy. Our
                platform allows anyone to launch AI agents with built-in token
                economics, creating a fair, transparent, and decentralized
                ecosystem.
              </p>

              <p className="text-gray-300 mb-6">
                Each agent on our platform has its own token, allowing users to
                invest in the agents they believe in, while creators and
                developers can monetize their work through transparent revenue
                sharing mechanisms.
              </p>

              <div className="flex flex-col md:flex-row gap-8 mt-10">
                <div className="flex-1 bg-[rgba(0,0,0,0.2)] p-6 rounded-xl">
                  <div className="bg-[rgba(115,94,181,0.3)] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[rgba(115,94,181,1)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Fair Launch
                  </h3>
                  <p className="text-gray-400">
                    We believe in fair launches that give everyone an equal
                    opportunity to participate. Our unique Army Points system
                    ensures fair distribution.
                  </p>
                </div>

                <div className="flex-1 bg-[rgba(0,0,0,0.2)] p-6 rounded-xl">
                  <div className="bg-[rgba(115,94,181,0.3)] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[rgba(115,94,181,1)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    True Ownership
                  </h3>
                  <p className="text-gray-400">
                    All tokens on our platform are fully on-chain, giving users
                    true ownership and allowing for transparent token economics.
                  </p>
                </div>

                <div className="flex-1 bg-[rgba(0,0,0,0.2)] p-6 rounded-xl">
                  <div className="bg-[rgba(115,94,181,0.3)] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[rgba(115,94,181,1)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Community Governance
                  </h3>
                  <p className="text-gray-400">
                    Token holders can participate in governance decisions,
                    making our platform truly decentralized and
                    community-driven.
                  </p>
                </div>
              </div>
            </div>

            {/* Our Token Section */}
            <div className="bg-[rgba(255,255,255,0.03)] rounded-xl overflow-hidden p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    $ARMY Token
                  </h2>
                  <p className="text-gray-300 mb-6">
                    $ARMY is our native utility token that powers the entire
                    Multiagent Army ecosystem. It's used for governance,
                    staking, and participating in agent launches.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-gray-400 text-sm">Total Supply</p>
                      <p className="text-white font-bold">1,000,000,000</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">
                        Circulating Supply
                      </p>
                      <p className="text-white font-bold">250,000,000</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Token Type</p>
                      <p className="text-white font-bold">DIP-20</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Blockchain</p>
                      <p className="text-white font-bold">Internet Computer</p>
                    </div>
                  </div>
                  <Link
                    to="/army"
                    className="inline-block bg-[rgba(115,94,181,1)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[rgba(95,78,150,1)] transition-colors"
                  >
                    Learn More About $ARMY
                  </Link>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-[#2c2a5a] to-[#1d1c39] rounded-lg flex items-center justify-center p-4">
                    <div className="text-center text-white">
                      <h3 className="text-3xl font-bold mb-2">$ARMY</h3>
                      <p className="text-lg">Native Token</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div className="bg-[rgba(255,255,255,0.03)] rounded-xl overflow-hidden p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Our Team</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Team Member 1 */}
                <div className="bg-[rgba(0,0,0,0.2)] p-5 rounded-xl text-center">
                  <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-[rgba(115,94,181,0.3)] to-[rgba(76,59,125,0.3)] mb-4"></div>
                  <h3 className="text-lg font-bold text-white">
                    Alex Robinson
                  </h3>
                  <p className="text-gray-400">CEO & Founder</p>
                </div>

                {/* Team Member 2 */}
                <div className="bg-[rgba(0,0,0,0.2)] p-5 rounded-xl text-center">
                  <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-[rgba(115,94,181,0.3)] to-[rgba(76,59,125,0.3)] mb-4"></div>
                  <h3 className="text-lg font-bold text-white">Sarah Lee</h3>
                  <p className="text-gray-400">CTO</p>
                </div>

                {/* Team Member 3 */}
                <div className="bg-[rgba(0,0,0,0.2)] p-5 rounded-xl text-center">
                  <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-[rgba(115,94,181,0.3)] to-[rgba(76,59,125,0.3)] mb-4"></div>
                  <h3 className="text-lg font-bold text-white">Michael Chen</h3>
                  <p className="text-gray-400">Head of Product</p>
                </div>

                {/* Team Member 4 */}
                <div className="bg-[rgba(0,0,0,0.2)] p-5 rounded-xl text-center">
                  <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-[rgba(115,94,181,0.3)] to-[rgba(76,59,125,0.3)] mb-4"></div>
                  <h3 className="text-lg font-bold text-white">
                    Jessica Parker
                  </h3>
                  <p className="text-gray-400">Lead Developer</p>
                </div>
              </div>
            </div>

            {/* Community Section */}
            <div className="bg-[rgba(255,255,255,0.03)] rounded-xl overflow-hidden p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Join Our Community
              </h2>

              <p className="text-gray-300 mb-6">
                Join our growing community of developers, creators, and
                investors who are building the future of decentralized AI.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#"
                  className="flex items-center gap-2 bg-[rgba(0,0,0,0.2)] px-5 py-3 rounded-lg text-white hover:bg-[rgba(0,0,0,0.3)] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                  Twitter
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 bg-[rgba(0,0,0,0.2)] px-5 py-3 rounded-lg text-white hover:bg-[rgba(0,0,0,0.3)] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 3.997-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-3.997-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Instagram
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 bg-[rgba(0,0,0,0.2)] px-5 py-3 rounded-lg text-white hover:bg-[rgba(0,0,0,0.3)] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 bg-[rgba(0,0,0,0.2)] px-5 py-3 rounded-lg text-white hover:bg-[rgba(0,0,0,0.3)] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                  Discord
                </a>
              </div>
            </div>

            {/* Final CTA */}
            <div className="bg-gradient-to-r from-[rgba(115,94,181,0.8)] to-[rgba(76,59,125,0.8)] rounded-xl p-8 text-center text-white mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Join the Multiagent Army?
              </h2>
              <p className="text-lg mb-6 max-w-2xl mx-auto">
                Create your own AI agent or invest in existing ones to
                participate in the future of decentralized AI.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/create-agent"
                  className="inline-block bg-white text-[rgba(115,94,181,1)] px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  Launch Your Agent
                </Link>
                <Link
                  to="/explore"
                  className="inline-block bg-transparent text-white border border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  Explore Agents
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AboutPage;
