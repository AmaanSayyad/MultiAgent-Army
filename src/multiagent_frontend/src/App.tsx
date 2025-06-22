import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./lib/wallet-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateAgentPage from "./pages/CreateAgentPage";
import AgentPage from "./pages/AgentPage";
import ExplorePage from "./pages/ExplorePage";
import AboutPage from "./pages/About";
import ArmyTokenPage from "./pages/ArmyTokenPage";
import AgentTradingPage from "./pages/AgentTradingPage";
import UserDashboard from "./pages/UserDashboard";
import ProfileSetupHandler from "./components/ProfileSetupHandler";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ProfileSetupHandler />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/create-agent" element={<CreateAgentPage />} />
            <Route path="/agent/:id" element={<AgentPage />} />
            <Route path="/agent/:id/trading" element={<AgentTradingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/army" element={<ArmyTokenPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WalletProvider>
  </QueryClientProvider>
);

export default App;
