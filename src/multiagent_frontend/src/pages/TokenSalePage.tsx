import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import { TokenSale } from "../lib/launchpad-service";
import launchpadService from "../lib/launchpad-service";
import { useWallet } from "../hooks/use-wallet";
import { formatBigInt, shortenAddress } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { toast } from "../hooks/use-toast";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const TokenSalePage: React.FC = () => {
  const navigate = useNavigate();
  const { principalId, isConnected, connectInternetIdentity } = useWallet();
  const principal = principalId ? Principal.fromText(principalId) : null;
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [activeSales, setActiveSales] = useState<TokenSale[]>([]);
  const [upcomingSales, setUpcomingSales] = useState<TokenSale[]>([]);
  const [endedSales, setEndedSales] = useState<TokenSale[]>([]);
  const [userCommitments, setUserCommitments] = useState<{[saleId: string]: bigint}>({});
  const [purchaseAmounts, setPurchaseAmounts] = useState<{[saleId: string]: string}>({});

  // Fetch sales data
  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const active = await launchpadService.getSalesByStatus("active");
      const upcoming = await launchpadService.getSalesByStatus("upcoming");
      
      // Fetch ended sales, then successful and failed sales
      const endedSalesResult = await launchpadService.getSalesByStatus("ended");
      const successfulSales = await launchpadService.getSalesByStatus("successful");
      const failedSales = await launchpadService.getSalesByStatus("failed");
      
      // Combine all the "finished" sales
      const allEndedSales = [...endedSalesResult, ...successfulSales, ...failedSales];

      setActiveSales(active);
      setUpcomingSales(upcoming);
      setEndedSales(allEndedSales);
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast({
        title: "Error",
        description: "Failed to load token sales. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user commitments
  const fetchUserCommitments = useCallback(async () => {
    if (!principal) return;
    
    try {
      const commitments = await launchpadService.getUserCommitments(principal);
      const commitmentMap: {[saleId: string]: bigint} = {};
      
      commitments.forEach(commitment => {
        commitmentMap[commitment.saleId] = commitment.amount;
      });
      
      setUserCommitments(commitmentMap);
    } catch (error) {
      console.error("Error fetching user commitments:", error);
    }
  }, [principal]);

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    if (principal) {
      fetchUserCommitments();
    }
  }, [principal, fetchUserCommitments]);

  const handlePurchaseAmountChange = (saleId: string, value: string) => {
    // Only allow numeric input
    if (/^\d*$/.test(value)) {
      setPurchaseAmounts({
        ...purchaseAmounts,
        [saleId]: value,
      });
    }
  };

  const handleBuyTokens = async (sale: TokenSale) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to participate in token sales.",
        variant: "default",
      });
      connectInternetIdentity();
      return;
    }

    const amount = purchaseAmounts[sale.id];
    if (!amount || amount === "0") {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to purchase.",
        variant: "destructive",
      });
      return;
    }

    const bigIntAmount = BigInt(amount);
    if (bigIntAmount < sale.minPurchase) {
      toast({
        title: "Amount too low",
        description: `Minimum purchase amount is ${formatBigInt(sale.minPurchase)}`,
        variant: "destructive",
      });
      return;
    }

    if (bigIntAmount > sale.maxPurchase) {
      toast({
        title: "Amount too high",
        description: `Maximum purchase amount is ${formatBigInt(sale.maxPurchase)}`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let result;
      if (sale.launchType === "genesis") {
        result = await launchpadService.commitToGenesisSale(sale.id, bigIntAmount);
      } else {
        result = await launchpadService.buyTokens(sale.id, bigIntAmount);
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `Successfully ${sale.launchType === "genesis" ? "committed to" : "purchased tokens from"} the sale.`,
          variant: "default",
        });
        
        // Refresh data
        fetchSales();
        fetchUserCommitments();
        
        // Clear input
        setPurchaseAmounts({
          ...purchaseAmounts,
          [sale.id]: "",
        });
      } else {
        toast({
          title: "Transaction failed",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error purchasing tokens:", error);
      toast({
        title: "Transaction error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp / 1000000n)).toLocaleString();
  };

  const getSaleStatusBadge = (status: string) => {
    switch(status) {
      case "upcoming":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case "active":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>;
      case "ended":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Ended</Badge>;
      case "successful":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Successful</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderSaleCard = (sale: TokenSale) => {
    const userCommitment = userCommitments[sale.id] || 0n;
    const isActive = sale.status === "active";
    const isUserSale = principal && sale.owner.toString() === principal.toString();

    return (
      <Card key={sale.id} className="w-full mb-4 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">{sale.agentId}</CardTitle>
            {getSaleStatusBadge(sale.status)}
          </div>
          <CardDescription>
            <div className="flex justify-between">
              <span>Token: {sale.tokenId}</span>
              <span>Type: {sale.launchType === "genesis" ? "Genesis" : "Standard"}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">
                  {formatBigInt(sale.raised)} / {formatBigInt(sale.hardCap)} ({sale.progress}%)
                </span>
              </div>
              <Progress value={sale.progress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Price</div>
                <div className="font-medium">{formatBigInt(sale.price)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Soft Cap</div>
                <div className="font-medium">{formatBigInt(sale.softCap)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Start Time</div>
                <div className="font-medium">{formatDate(sale.startTime)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">End Time</div>
                <div className="font-medium">{formatDate(sale.endTime)}</div>
              </div>
              {sale.launchType === "genesis" && (
                <div>
                  <div className="text-muted-foreground">Army Required</div>
                  <div className="font-medium">{formatBigInt(sale.armyRequired)}</div>
                </div>
              )}
              {userCommitment > 0n && (
                <div>
                  <div className="text-muted-foreground">Your Commitment</div>
                  <div className="font-medium">{formatBigInt(userCommitment)}</div>
                </div>
              )}
            </div>

            {isActive && (
              <div className="pt-2">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder={`Min: ${formatBigInt(sale.minPurchase)}`}
                    value={purchaseAmounts[sale.id] || ""}
                    onChange={(e) => handlePurchaseAmountChange(sale.id, e.target.value)}
                    disabled={!isConnected || isLoading}
                  />
                  <Button 
                    onClick={() => handleBuyTokens(sale)}
                    disabled={!isConnected || isLoading}
                  >
                    {sale.launchType === "genesis" ? "Commit" : "Buy"}
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Min: {formatBigInt(sale.minPurchase)} | Max: {formatBigInt(sale.maxPurchase)}
                </div>
              </div>
            )}

            {isUserSale && sale.status === "ended" && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const result = await launchpadService.finalizeSale(sale.id);
                    if (result.success) {
                      toast({
                        title: "Success",
                        description: "Sale has been finalized successfully.",
                        variant: "default",
                      });
                      fetchSales();
                    } else {
                      toast({
                        title: "Error",
                        description: result.error || "Failed to finalize sale",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    console.error("Error finalizing sale:", error);
                    toast({
                      title: "Error",
                      description: "An error occurred while finalizing the sale",
                      variant: "destructive",
                    });
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                Finalize Sale
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <div className="text-xs text-muted-foreground">
            Owner: {shortenAddress(sale.owner.toString())}
          </div>
          <Button 
            variant="link" 
            className="p-0"
            onClick={() => navigate(`/agent/${sale.agentId}`)}
          >
            View Agent
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Token Sales</h1>
      
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ended">Ended</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <LoadingSpinner size="large" />
            </div>
          ) : activeSales.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeSales.map(renderSaleCard)}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No active sales at the moment
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <LoadingSpinner size="large" />
            </div>
          ) : upcomingSales.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingSales.map(renderSaleCard)}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No upcoming sales at the moment
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="ended" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <LoadingSpinner size="large" />
            </div>
          ) : endedSales.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {endedSales.map(renderSaleCard)}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No ended sales at the moment
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TokenSalePage;
