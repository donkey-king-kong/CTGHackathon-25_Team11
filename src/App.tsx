import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Leaderboard from "./pages/Leaderboard";

import Admin from "./pages/Admin";
import Festival from "./pages/Festival";
import WhatWeDo from "./pages/WhatWeDo";
import Messages from "./pages/Messages";
import MessagesModerate from "./pages/MessagesModerate";
import MessagesUpload from "./pages/MessagesUpload";
import Auth from "./pages/Auth";
import ReachHome from "./pages/ReachHome";
import ReachDonate from "./pages/ReachDonate";
import DonateSuccess from "./pages/DonateSuccess";
import DonateCancel from "./pages/DonateCancel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
          <Routes>
            <Route path="/" element={<ReachHome />} />
            <Route path="/festival" element={<Festival />} />
            <Route path="/what-we-do" element={<WhatWeDo />} />
            <Route path="/leaderboard" element={<Leaderboard />} />

            <Route path="/donate" element={<ReachDonate />} />
            <Route path="/donate/success" element={<DonateSuccess />} />
            <Route path="/donate/cancel" element={<DonateCancel />} />
            <Route path="/admin" element={<Admin />} />
            
            {/* Messages Feature */}
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/new" element={<MessagesUpload />} />
            <Route path="/messages/moderate" element={<MessagesModerate />} />
            <Route path="/messages-upload" element={<MessagesUpload />} />
            
            {/* Authentication */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Leaderboard Scaffolding - Future Implementation */}
            <Route path="/leaderboard/leaderboard" element={<Leaderboard />} />
            <Route path="/leaderboard/recent" element={<Leaderboard />} />
            <Route path="/leaderboard/regions" element={<Leaderboard />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
