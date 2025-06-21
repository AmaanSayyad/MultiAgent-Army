import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LaunchpadPage from "./pages/LaunchpadPage";
import CreateAgentPage from "./pages/CreateAgentPage";
import AgentPage from "./pages/AgentPage";
import ExplorePage from "./pages/ExplorePage";
import AboutPage from "./pages/About";
import ArmyTokenPage from "./pages/ArmyTokenPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/launchpad" element={<LaunchpadPage />} />
          <Route path="/create-agent" element={<CreateAgentPage />} />
          <Route path="/agent/:id" element={<AgentPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/army" element={<ArmyTokenPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
