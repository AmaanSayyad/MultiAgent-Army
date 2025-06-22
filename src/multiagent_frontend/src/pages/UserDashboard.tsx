import React, { useState, useEffect } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileSetupModal } from "@/components/UserProfileSetupModal";
import {
  Loader2,
  User,
  Calendar,
  Globe,
  Twitter,
  Github,
  MessageCircle,
  Edit,
  Coins,
} from "lucide-react";

const UserDashboard: React.FC = () => {
  const { userProfile, isLoadingProfile, principalId, isConnected } =
    useWallet();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // We no longer need this useEffect as it's handled by the ProfileSetupHandler component
  // which is now included in App.tsx and works across all pages

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to view your dashboard
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading your profile...</span>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: bigint | number) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert from nanoseconds
    return date.toLocaleDateString();
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">User Dashboard</h1>
            <Button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              {userProfile ? "Edit Profile" : "Setup Profile"}
            </Button>
          </div>

          {userProfile ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={userProfile.avatarUrl || ""} />
                        <AvatarFallback className="text-lg">
                          {getInitials(
                            userProfile.displayName || userProfile.username
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="text-xl font-semibold">
                            {userProfile.displayName ||
                              userProfile.username ||
                              "Anonymous User"}
                          </h3>
                          {userProfile.username && userProfile.displayName && (
                            <p className="text-muted-foreground">
                              @{userProfile.username}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Joined {formatDate(userProfile.createdAt)}
                        </div>

                        <div className="flex items-center gap-2">
                          {userProfile.verifiedTwitter && (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Twitter className="h-3 w-3" />
                              Verified Twitter
                            </Badge>
                          )}
                          {userProfile.verifiedWebsite && (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Globe className="h-3 w-3" />
                              Verified Website
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                {userProfile.socialLinks && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Social Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {userProfile.socialLinks.twitter && (
                          <div className="flex items-center gap-3">
                            <Twitter className="h-5 w-5 text-blue-400" />
                            <span>@{userProfile.socialLinks.twitter}</span>
                          </div>
                        )}
                        {userProfile.socialLinks.github && (
                          <div className="flex items-center gap-3">
                            <Github className="h-5 w-5" />
                            <span>{userProfile.socialLinks.github}</span>
                          </div>
                        )}
                        {userProfile.socialLinks.discord && (
                          <div className="flex items-center gap-3">
                            <MessageCircle className="h-5 w-5 text-purple-400" />
                            <span>{userProfile.socialLinks.discord}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* User Agents */}
                <Card>
                  <CardHeader>
                    <CardTitle>My Agents</CardTitle>
                    <CardDescription>
                      Agents you've created or are associated with
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userProfile.agents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userProfile.agents.map((agentId) => (
                          <Card key={agentId} className="border-2">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  Agent {agentId}
                                </span>
                                <Badge variant="outline">Active</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>You haven't created any agents yet.</p>
                        <Button className="mt-4" asChild>
                          <a href="/create-agent">Create Your First Agent</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Principal ID */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Principal ID</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-3 rounded-lg">
                      <code className="text-xs break-all">{principalId}</code>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="h-5 w-5" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Agents Created
                      </span>
                      <span className="font-medium">
                        {userProfile.agents.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Verification Status
                      </span>
                      <span className="font-medium">
                        {userProfile.verifiedTwitter ||
                        userProfile.verifiedWebsite
                          ? "Verified"
                          : "Unverified"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Profile Not Set Up</CardTitle>
                <CardDescription>
                  Complete your profile to get started with Multiagent Army
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={() => setShowProfileModal(true)}>
                  Set Up Profile
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Profile Setup Modal */}
      <UserProfileSetupModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        existingProfile={userProfile}
      />
    </div>
  );
};

export default UserDashboard;
