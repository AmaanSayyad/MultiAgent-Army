import React, { useEffect, useState } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { UserProfileSetupModal } from "@/components/UserProfileSetupModal";

const ProfileSetupHandler: React.FC = () => {
  const { userProfile, isLoadingProfile, principalId, isConnected } =
    useWallet();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Show profile setup modal for new users whenever they connect
  useEffect(() => {
    if (isConnected && !isLoadingProfile && !userProfile && principalId) {
      setShowProfileModal(true);
    }
  }, [isConnected, isLoadingProfile, userProfile, principalId]);

  const handleCloseModal = () => {
    setShowProfileModal(false);
  };

  return (
    <>
      {showProfileModal && (
        <UserProfileSetupModal
          isOpen={showProfileModal}
          onClose={handleCloseModal}
          existingProfile={userProfile}
        />
      )}
    </>
  );
};

export default ProfileSetupHandler;
