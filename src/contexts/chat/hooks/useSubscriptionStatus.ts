
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MAX_FREE_MESSAGES } from "../constants";

export function useSubscriptionStatus(guestId: string | null = null) {
  const [messagesUsed, setMessagesUsed] = useState<number>(0);
  const [messagesLimit, setMessagesLimit] = useState<number>(MAX_FREE_MESSAGES);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  
  // Calculate remaining messages
  const remainingMessages = messagesLimit - messagesUsed;

  const checkSubscriptionStatus = async () => {
    try {
      const session = await supabase.auth.getSession();
      const isAuthenticated = !!session.data.session;
      
      // If user is not logged in and no guest ID, use free tier limits
      if (!isAuthenticated && !guestId) {
        console.log("No active session or guest ID, using free tier limits");
        setMessagesLimit(MAX_FREE_MESSAGES);
        setIsSubscribed(false);
        return;
      }
      
      if (isAuthenticated) {
        // Call the subscription check function for authenticated users
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) {
          console.error("Error checking subscription:", error);
          return;
        }
        
        console.log("Subscription status:", data);
        setIsSubscribed(data.isSubscribed);
        setMessagesLimit(data.messagesLimit);
        
        // Load user message count
        const { data: userData, error: userError } = await supabase
          .from('user_limits')
          .select('messages_used')
          .is('guest_id', null)
          .maybeSingle();
          
        if (userError) {
          console.error("Error fetching user limits:", userError);
          return;
        }
        
        if (userData) {
          setMessagesUsed(userData.messages_used);
        }
      } else if (guestId) {
        // For guest users, get limits from user_limits table
        const { data: guestData, error: guestError } = await supabase
          .from('user_limits')
          .select('messages_used, messages_limit')
          .eq('guest_id', guestId)
          .maybeSingle();
          
        if (guestError) {
          console.error("Error fetching guest limits:", guestError);
          return;
        }
        
        if (guestData) {
          setMessagesUsed(guestData.messages_used);
          setMessagesLimit(guestData.messages_limit);
        } else {
          // Default to free tier if no record found
          setMessagesLimit(MAX_FREE_MESSAGES);
          setMessagesUsed(0);
        }
        
        setIsSubscribed(false);
      }
      
    } catch (error) {
      console.error("Failed to check subscription status:", error);
    }
  };

  return {
    messagesUsed,
    messagesLimit,
    remainingMessages,
    isSubscribed,
    setMessagesUsed,
    checkSubscriptionStatus
  };
}
