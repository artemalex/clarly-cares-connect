
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import History from "./pages/History";
import Profile from "./pages/Profile";
import { ChatProvider } from "./contexts/chat";
import { ensureGuestId, getGuestId } from "./utils/guestUtils";
import { supabase } from "./lib/supabase";

const queryClient = new QueryClient();

const AppContent = () => {
  // Initialize guest ID if needed and handle pending guest migrations
  useEffect(() => {
    const initGuest = async () => {
      // Check if user is logged in
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is logged in, check for pending guest migration
        const pendingMigration = localStorage.getItem('pending_guest_migration');
        if (pendingMigration) {
          try {
            await supabase.functions.invoke('migrate-guest-data', {
              body: { guest_id: pendingMigration }
            });
            localStorage.removeItem('pending_guest_migration');
            localStorage.removeItem('guest_id');
          } catch (error) {
            console.error("Failed to migrate guest data after OAuth:", error);
          }
        }
      } else {
        // User is not logged in, ensure guest ID
        ensureGuestId();
        // Removed the set-guest-claims function call
      }
    };
    
    initGuest();
  }, []);
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/success" element={<SubscriptionSuccess />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <ChatProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </ChatProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
