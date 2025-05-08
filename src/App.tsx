
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, Suspense, useState } from "react";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Error boundary to prevent entire app crashing
const ErrorFallback = () => (
  <div className="flex items-center justify-center min-h-screen flex-col p-4">
    <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
    <p className="mb-4">There was an error loading the application</p>
    <button 
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
    >
      Reload Application
    </button>
  </div>
);

const AppContent = () => {
  const [error, setError] = useState<Error | null>(null);

  // Initialize guest ID if needed and handle pending guest migrations
  useEffect(() => {
    const initGuest = async () => {
      try {
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
        }
      } catch (err) {
        console.error("Error initializing app:", err);
        setError(err instanceof Error ? err : new Error("Unknown initialization error"));
      }
    };
    
    initGuest();
  }, []);
  
  if (error) return <ErrorFallback />;

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
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <BrowserRouter>
          <ChatProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </ChatProvider>
        </BrowserRouter>
      </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
