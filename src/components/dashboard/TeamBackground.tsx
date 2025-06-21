import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "../ui/dialog";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  wallet?: string;
  expertise?: string[];
}

interface TeamBackgroundProps {
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  formData: {
    teamMembers: TeamMember[];
  };
  updateFormData: (data: { teamMembers: TeamMember[] }) => void;
}

// Mock data for contributor search
const MOCK_CONTRIBUTORS = [
  {
    id: "contrib-1",
    name: "Alex Johnson",
    role: "Developer",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    bio: "Full-stack developer with 5 years of experience in React and Node.js",
    wallet: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    expertise: ["Frontend", "React", "Smart Contracts"],
  },
  {
    id: "contrib-2",
    name: "Sophia Chen",
    role: "Designer",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    bio: "UI/UX designer specialized in Web3 applications",
    wallet: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    expertise: ["UI/UX", "Design Systems", "Branding"],
  },
  {
    id: "contrib-3",
    name: "Michael Smith",
    role: "Project Manager",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    bio: "Experienced project manager with a background in DeFi products",
    wallet: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    expertise: ["Project Management", "DeFi", "Strategy"],
  },
  {
    id: "contrib-4",
    name: "Emma Williams",
    role: "Smart Contract Developer",
    avatarUrl: "https://i.pravatar.cc/150?img=9",
    bio: "Solidity developer with experience in DeFi protocols",
    wallet: "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB",
    expertise: ["Solidity", "ERC Standards", "Security Audits"],
  },
  {
    id: "contrib-5",
    name: "David Garcia",
    role: "Marketing Lead",
    avatarUrl: "https://i.pravatar.cc/150?img=7",
    bio: "Marketing specialist with focus on crypto and Web3 projects",
    wallet: "0x617F2E2fD72FD9D5503197092aC168c91465E7f2",
    expertise: ["Marketing", "Growth", "Community Building"],
  },
];

export const TeamBackground: React.FC<TeamBackgroundProps> = ({
  onNext,
  onPrevious,
  onCancel,
  formData,
  updateFormData,
}) => {
  const [errors, setErrors] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<TeamMember[]>([]);
  const [selectedContributor, setSelectedContributor] =
    useState<TeamMember | null>(null);
  const [newRole, setNewRole] = useState("");
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Search contributors when the search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Filter the mock contributors based on the search term
    const results = MOCK_CONTRIBUTORS.filter(
      (contributor) =>
        contributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contributor.wallet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contributor.expertise?.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    setSearchResults(results);
  }, [searchTerm]);

  const handleAddTeamMember = () => {
    setShowDialog(true);
    setSearchTerm("");
    setSearchResults([]);
    setSelectedContributor(null);
    setNewRole("");
  };

  const handleContributorSelect = (contributor: TeamMember) => {
    setSelectedContributor(contributor);
    setNewRole(contributor.role || "");
  };

  const handleSaveContributor = () => {
    if (!selectedContributor) return;

    // Check if this contributor is already in the team
    const existingMember = formData.teamMembers.find(
      (member) => member.id === selectedContributor.id
    );

    if (existingMember) {
      setErrors("This contributor is already part of your team");
      return;
    }

    // Add new team member
    updateFormData({
      teamMembers: [
        ...formData.teamMembers,
        {
          ...selectedContributor,
          role: newRole || selectedContributor.role,
        },
      ],
    });

    setShowDialog(false);
    setErrors(null);
  };

  const handleEditMember = (member: TeamMember) => {
    if (member.id === "owner") return;
    setEditingMember(member);
    setNewRole(member.role || "");
    setShowDialog(true);
  };

  const handleUpdateMember = () => {
    if (!editingMember) return;

    const updatedMembers = formData.teamMembers.map((member) =>
      member.id === editingMember.id ? { ...member, role: newRole } : member
    );

    updateFormData({
      teamMembers: updatedMembers,
    });

    setShowDialog(false);
    setEditingMember(null);
  };

  const handleRemoveTeamMember = (memberId: string) => {
    updateFormData({
      teamMembers: formData.teamMembers.filter(
        (member) => member.id !== memberId
      ),
    });
  };

  const handleNext = () => {
    // Team members are optional in this case, so we just proceed
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
                index <= 3
                  ? "bg-[rgba(115,94,181,1)]"
                  : "bg-[rgba(255,255,255,0.2)]"
              }`}
            ></div>
            <span
              className={`text-xs mt-2 ${
                index <= 3 ? "text-white" : "text-gray-400"
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

        <h1 className="text-2xl font-bold mb-6">Team Background</h1>

        <p className="text-gray-400 mb-6">
          Contributors must have an account created with Multiagent Army. To do
          this, they will need to login to Multiagent Army and setup their
          account in their profile settings.
        </p>

        {/* Owner info */}
        {formData.teamMembers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {formData.teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-[rgba(30,30,30,0.8)] p-4 rounded-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-400 rounded-full mr-3 flex items-center justify-center text-white text-xl font-bold">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        member.name.substring(0, 1).toUpperCase() || "?"
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-medium truncate">
                        {member.name || "0x66b...7Ad4ff"}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {member.id === "owner"
                          ? "Owner"
                          : member.role || "Contributor"}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {member.id !== "owner" && (
                      <>
                        <button
                          onClick={() => handleEditMember(member)}
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleRemoveTeamMember(member.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {member.expertise && member.expertise.length > 0 && (
                  <div className="mt-2 mb-3">
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-[rgba(115,94,181,0.3)] text-gray-300 px-2 py-1 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {member.bio && (
                  <p className="text-sm text-gray-400 mt-2 mb-3 line-clamp-2">
                    {member.bio}
                  </p>
                )}

                {member.id === "owner" ? (
                  <button className="w-full flex items-center justify-center gap-2 py-2 border border-gray-700 rounded-lg text-sm text-gray-400 hover:bg-[rgba(40,40,40,0.8)] transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Profile
                  </button>
                ) : (
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <span className="truncate">
                      {member.wallet || "0x66b...7Ad4ff"}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Contributor Button */}
        <button
          onClick={handleAddTeamMember}
          className="flex items-center gap-2 px-4 py-3 border border-gray-700 rounded-lg text-white hover:bg-[rgba(40,40,40,0.8)] transition-colors mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Contributor
        </button>

        {errors && <p className="text-red-500 text-sm mb-4">{errors}</p>}
      </div>

      {/* Add Contributor Dialog */}
      {showDialog && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[rgba(20,20,20,0.95)] rounded-xl max-w-3xl w-full max-h-[80vh] overflow-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  {editingMember ? "Edit Contributor" : "Add Contributor"}
                </h3>
                <button
                  onClick={() => {
                    setShowDialog(false);
                    setEditingMember(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {!editingMember && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-400 mb-2">
                      Search for a contributor
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name, wallet address, or expertise..."
                      className="w-full bg-[rgba(30,30,30,0.8)] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[rgba(115,94,181,1)] transition-colors"
                    />
                  </div>

                  {searchTerm && searchResults.length === 0 && (
                    <div className="text-gray-400 py-4 text-center">
                      No contributors found matching "{searchTerm}"
                    </div>
                  )}

                  {searchResults.length > 0 && (
                    <div className="mb-4 max-h-60 overflow-y-auto">
                      {searchResults.map((contributor) => (
                        <div
                          key={contributor.id}
                          onClick={() => handleContributorSelect(contributor)}
                          className={`flex items-start p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                            selectedContributor?.id === contributor.id
                              ? "bg-[rgba(115,94,181,0.2)] border border-[rgba(115,94,181,0.5)]"
                              : "bg-[rgba(30,30,30,0.8)] hover:bg-[rgba(40,40,40,0.8)]"
                          }`}
                        >
                          <div className="w-10 h-10 bg-blue-400 rounded-full mr-3 flex-shrink-0 flex items-center justify-center text-white text-lg font-bold">
                            {contributor.avatarUrl ? (
                              <img
                                src={contributor.avatarUrl}
                                alt={contributor.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              contributor.name.substring(0, 1).toUpperCase() ||
                              "?"
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="text-white font-medium">
                                {contributor.name}
                              </h4>
                              <span className="text-gray-400 text-sm">
                                {contributor.role}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                              {contributor.bio}
                            </p>
                            {contributor.expertise && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {contributor.expertise.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-[rgba(115,94,181,0.3)] text-gray-300 px-2 py-0.5 rounded-md"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-2">
                              {contributor.wallet}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {(selectedContributor || editingMember) && (
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">
                    Role in Project
                  </label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Developer, Designer, Advisor..."
                    className="w-full bg-[rgba(30,30,30,0.8)] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[rgba(115,94,181,1)] transition-colors"
                  />
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setShowDialog(false);
                    setEditingMember(null);
                  }}
                  className="bg-[rgba(30,30,30,0.8)] hover:bg-[rgba(50,50,50,0.8)] text-white px-6 py-2 rounded-lg transition-colors mr-3"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    editingMember ? handleUpdateMember : handleSaveContributor
                  }
                  disabled={
                    (!selectedContributor && !editingMember) || !newRole
                  }
                  className={`${
                    (!selectedContributor && !editingMember) || !newRole
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-[rgba(115,94,181,1)] hover:bg-[rgba(95,78,150,1)]"
                  } text-white px-6 py-2 rounded-lg transition-colors`}
                >
                  {editingMember ? "Update" : "Add to Team"}
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}

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
            className="bg-[rgba(115,94,181,1)] hover:bg-[rgba(95,78,150,1)] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
