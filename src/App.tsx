import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/app/providers/contexts/AuthContext";
import Layout from "@/app/providers/Layout";

// Import all features from organized structure
import {
  Home,
  WhatWeDo,
  Festival,
  Stories
} from "@/features/main";

import {
  Donate,
  Success,
  Cancel
} from "@/features/donations";

import {
  Messages,
  MessagesNew,
  MessagesUpload,
  MessagesModerate
} from "@/features/messages";

import {
  Leaderboard,
  Admin
} from "@/features/dashboard";

import { Auth } from "@/features/auth";
import NotFound from "@/app/routing/NotFound";

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
            <Route path="/" element={<Home />} />
            <Route path="/festival" element={<Festival />} />
            <Route path="/what-we-do" element={<WhatWeDo />} />
            <Route path="/leaderboard" element={<Leaderboard />} />

            <Route path="/donate" element={<Donate />} />
            <Route path="/donate/success" element={<Success />} />
            <Route path="/donate/cancel" element={<Cancel />} />
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
