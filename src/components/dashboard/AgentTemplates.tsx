import React from "react";
import { Link } from "react-router-dom";

interface AgentTemplateProps {
  id: string;
  name: string;
  symbol: string;
  days: number;
  participants: number;
  subscribed: string;
  unlockingIn: number;
  image: string;
  isLive: boolean;
}

export const AgentTemplates: React.FC = () => {
  const templates: AgentTemplateProps[] = [
    {
      id: "feen",
      name: "FEEN",
      symbol: "$FEEN",
      days: 14,
      participants: 340,
      subscribed: "37.41%",
      unlockingIn: 14,
      image:
        "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/c5e37802a82236bf478174f32d4630fd260b1fc2",
      isLive: true,
    },
    {
      id: "govbot",
      name: "GovBot",
      symbol: "$GOVBOT",
      days: 57,
      participants: 44,
      subscribed: "0.41%",
      unlockingIn: 57,
      image:
        "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/62dc1643bcc55c1a54b975bdbd59d22356686703",
      isLive: true,
    },
    {
      id: "xknown",
      name: "xKnown.ai",
      symbol: "$XKNOWN",
      days: 120,
      participants: 31,
      subscribed: "7.08%",
      unlockingIn: 120,
      image:
        "https://cdn.builder.io/api/v1/image/assets/46fae530789841b58b2cbc3b746c17f7/0c82a7db6a49e5d91236b6779fad677c06992157",
      isLive: true,
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-colors"
          >
            <Link to={`/agent/${template.id}`} className="block">
              <div className="p-5 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <img
                      src={template.image}
                      className="w-14 h-14 rounded-full object-cover"
                      alt={`${template.name} logo`}
                    />
                    <div className="absolute -bottom-1 -right-1 bg-blue-400 rounded-full w-5 h-5 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-bold">
                      {template.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{template.symbol}</p>
                  </div>
                </div>

                <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center">
                    <div className="flex gap-2 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-white text-sm font-medium">
                        Tokens Unlocking in {template.unlockingIn} days
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-gray-400 text-sm">
                    <span>Participants</span>
                    <p className="text-white text-lg font-bold">
                      {template.participants}
                    </p>
                  </div>
                  <div className="text-gray-400 text-sm text-right">
                    <span>Subscribed</span>
                    <p className="text-white text-lg font-bold">
                      {template.subscribed}
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm font-medium">
                      Live
                    </span>
                    <span className="text-white text-sm ml-2">
                      00d {Math.floor(Math.random() * 24)}h{" "}
                      {Math.floor(Math.random() * 60)}m{" "}
                      {Math.floor(Math.random() * 60)}s
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
