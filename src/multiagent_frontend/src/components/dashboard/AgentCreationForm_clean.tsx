import React, { useState } from "react";
import { LaunchTypeSelector } from "./LaunchTypeSelector_new";
import { AgentDetailsForm } from "./AgentDetailsForm";
import { ProjectPitch } from "./ProjectPitch";
import { TeamBackground } from "./TeamBackground";
import { AdditionalDetails } from "./AdditionalDetails";
import { PreBuyToken } from "./PreBuyToken";
import { Summary } from "./AgentSummary";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

interface AgentFormData {
  launchType: "genesis" | "standard" | "existing" | null;
  agentPicture: string | null;
  agentName: string;
  ticker: string;
  agentType: string;
  shortPitch: string;
  agentOverview: string;
  framework: string;
  twitterConnected: boolean;
  websiteVerified: boolean;
  twitterUrl?: string;
  websiteUrl?: string;
  preBuyAmount: string;
  teamMembers: TeamMember[];
}

export const AgentCreationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<AgentFormData>({
    launchType: null,
    agentPicture: null,
    agentName: "",
    ticker: "",
    agentType: "",
    shortPitch: "",
    agentOverview: "",
    framework: "",
    twitterConnected: false,
    websiteVerified: false,
    preBuyAmount: "",
    teamMembers: [
      {
        id: "owner",
        name: "You",
        role: "Owner",
      },
    ],
  });

  const handleLaunchTypeSelect = (
    type: "genesis" | "standard" | "existing"
  ) => {
    setFormData({
      ...formData,
      launchType: type,
    });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCancel = () => {
    // Handle cancellation logic here
    if (
      window.confirm(
        "Are you sure you want to cancel? All your progress will be lost."
      )
    ) {
      // Reset form data and go back to step 0
      setCurrentStep(0);
      setFormData({
        launchType: null,
        agentPicture: null,
        agentName: "",
        ticker: "",
        agentType: "",
        shortPitch: "",
        agentOverview: "",
        framework: "",
        twitterConnected: false,
        websiteVerified: false,
        preBuyAmount: "",
        teamMembers: [
          {
            id: "owner",
            name: "You",
            role: "Owner",
          },
        ],
      });
    }
  };

  const updateFormData = (data: Partial<AgentFormData>) => {
    setFormData({
      ...formData,
      ...data,
    });
  };

  const handleSubmit = () => {
    // Submit the form data to create the agent
    console.log("Submitting form data:", formData);

    // Show success message or redirect
    alert("Agent creation initiated successfully!");

    // In a real implementation, you would submit this to your backend
    // and then redirect to a confirmation or status page
  };

  // Render different steps based on currentStep
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <LaunchTypeSelector
            onSelect={handleLaunchTypeSelect}
            onNext={nextStep}
            onCancel={handleCancel}
          />
        );
      case 1:
        return (
          <AgentDetailsForm
            formData={{
              agentPicture: formData.agentPicture,
              agentName: formData.agentName,
              ticker: formData.ticker,
              agentType: formData.agentType,
            }}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrevious={prevStep}
            onCancel={handleCancel}
          />
        );
      case 2:
        return (
          <ProjectPitch
            formData={{
              shortPitch: formData.shortPitch,
              agentOverview: formData.agentOverview,
            }}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrevious={prevStep}
            onCancel={handleCancel}
          />
        );
      case 3:
        return (
          <TeamBackground
            formData={{
              teamMembers: formData.teamMembers,
            }}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrevious={prevStep}
            onCancel={handleCancel}
          />
        );
      case 4:
        return (
          <AdditionalDetails
            formData={{
              framework: formData.framework,
              twitterConnected: formData.twitterConnected,
              websiteVerified: formData.websiteVerified,
              twitterUrl: formData.twitterUrl,
              websiteUrl: formData.websiteUrl,
            }}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrevious={prevStep}
            onCancel={handleCancel}
          />
        );
      case 5:
        return (
          <PreBuyToken
            formData={{
              tokenSymbol: formData.ticker,
              preBuyAmount: formData.preBuyAmount,
            }}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrevious={prevStep}
            onCancel={handleCancel}
          />
        );
      case 6:
        return (
          <Summary
            formData={formData as Required<AgentFormData>}
            onPrevious={prevStep}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[rgb(8,9,14)] p-6 rounded-xl">{renderStep()}</div>
  );
};
