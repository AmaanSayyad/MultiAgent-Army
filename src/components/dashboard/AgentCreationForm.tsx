import React, { useState } from "react";
import { LaunchTypeSelector } from "./LaunchTypeSelector_new";
import { AgentDetailsForm } from "./AgentDetailsForm";
import { ProjectPitch } from "./ProjectPitch";
import { TeamBackground } from "./TeamBackground";
import { TokenomicsDesign } from "./TokenomicsDesign_new";
import { AdditionalDetails } from "./AdditionalDetails";
import { LaunchDatePicker } from "./LaunchDatePicker";
import { Summary } from "./AgentSummary";

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

interface TokenDistribution {
  developer: number;
  publicSale: number;
  liquidityPool: number;
}

interface VestingSchedule {
  developerMonths: number;
  publicSaleMonths: number;
  liquidityPoolMonths: number;
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
  tokenDistribution?: TokenDistribution;
  vestingSchedule?: VestingSchedule;
  totalSupply?: number;
  launchDate?: string;
  launchTime?: {
    hour: string;
    minute: string;
  };
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
    tokenDistribution: {
      developer: 50.0,
      publicSale: 37.5,
      liquidityPool: 12.5,
    },
    vestingSchedule: {
      developerMonths: 12,
      publicSaleMonths: 1,
      liquidityPoolMonths: 6,
    },
    totalSupply: 1000000,
    // Initialize launch date to be 3 days in the future
    launchDate: (() => {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 3);
      return defaultDate.toISOString().split("T")[0];
    })(),
    launchTime: {
      hour: "12",
      minute: "00",
    },
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
        tokenDistribution: {
          developer: 50.0,
          publicSale: 37.5,
          liquidityPool: 12.5,
        },
        vestingSchedule: {
          developerMonths: 12,
          publicSaleMonths: 1,
          liquidityPoolMonths: 6,
        },
        totalSupply: 1000000,
        // Initialize launch date to be 3 days in the future
        launchDate: (() => {
          const defaultDate = new Date();
          defaultDate.setDate(defaultDate.getDate() + 3);
          return defaultDate.toISOString().split("T")[0];
        })(),
        launchTime: {
          hour: "12",
          minute: "00",
        },
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
          <TokenomicsDesign
            formData={{
              tokenDistribution: formData.tokenDistribution,
              vestingSchedule: formData.vestingSchedule,
              totalSupply: formData.totalSupply,
              launchType: formData.launchType,
            }}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrevious={prevStep}
            onCancel={handleCancel}
          />
        );
      case 5:
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
      case 6:
        return (
          <LaunchDatePicker
            formData={{
              launchDate: formData.launchDate,
              launchTime: formData.launchTime,
              launchType: formData.launchType,
            }}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrevious={prevStep}
            onCancel={handleCancel}
          />
        );
      case 7:
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
