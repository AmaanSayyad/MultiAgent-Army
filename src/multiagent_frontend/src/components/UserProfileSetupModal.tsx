import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWallet } from "@/hooks/use-wallet";
import { UserProfile } from "@/lib/user-registry-service";

interface UserProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingProfile?: UserProfile | null;
}

export const UserProfileSetupModal: React.FC<UserProfileSetupModalProps> = ({
  isOpen,
  onClose,
  existingProfile,
}) => {
  const { updateUserProfile } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: existingProfile?.username || "",
    displayName: existingProfile?.displayName || "",
    avatarUrl: existingProfile?.avatarUrl || "",
    twitter: existingProfile?.socialLinks?.twitter || "",
    github: existingProfile?.socialLinks?.github || "",
    discord: existingProfile?.socialLinks?.discord || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updates: Partial<UserProfile> = {
        username: formData.username || null,
        displayName: formData.displayName || null,
        avatarUrl: formData.avatarUrl || null,
        socialLinks: {
          twitter: formData.twitter || null,
          github: formData.github || null,
          discord: formData.discord || null,
        },
        agents: existingProfile?.agents || [],
      };

      const result = await updateUserProfile(updates);

      if (result.success) {
        onClose();
      } else {
        console.error("Failed to update profile:", result.error);
        // You could show an error toast here
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const isNewUser = !existingProfile;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isNewUser ? "Welcome! Set up your profile" : "Update your profile"}
          </DialogTitle>
          <DialogDescription>
            {isNewUser
              ? "Complete your profile to get started with Multiagent Army. You can always update this later."
              : "Update your profile information."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                placeholder="Enter display name"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input
              id="avatarUrl"
              placeholder="https://example.com/avatar.png"
              value={formData.avatarUrl}
              onChange={(e) =>
                setFormData({ ...formData, avatarUrl: e.target.value })
              }
            />
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">
              Social Links (Optional)
            </Label>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-2">
                <Label className="w-16 text-xs">Twitter</Label>
                <Input
                  placeholder="@username"
                  value={formData.twitter}
                  onChange={(e) =>
                    setFormData({ ...formData, twitter: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label className="w-16 text-xs">GitHub</Label>
                <Input
                  placeholder="username"
                  value={formData.github}
                  onChange={(e) =>
                    setFormData({ ...formData, github: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label className="w-16 text-xs">Discord</Label>
                <Input
                  placeholder="username#0000"
                  value={formData.discord}
                  onChange={(e) =>
                    setFormData({ ...formData, discord: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            {isNewUser && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                disabled={isLoading}
              >
                Skip for now
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : isNewUser
                ? "Create Profile"
                : "Update Profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
