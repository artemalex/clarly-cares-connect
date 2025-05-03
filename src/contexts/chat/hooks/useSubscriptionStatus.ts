
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MAX_FREE_MESSAGES } from "../constants";

export function useSubscriptionStatus() {
  const [messagesUsed, setMessagesUsed] = useState<number>(0);
  const [messagesLimit, setMessagesLimit] = useState<number>(MAX_FREE_MESSAGES);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  
  // Calculate remaining messages
  const remainingMessages = messagesLimit - messagesUsed;

  const checkSubscriptionStatus = async () => {
    try {
      const session = await supabase.auth.getSession();
      
      // Skip checking subscription if user is not logged in
      if (!session.data.session) {
        console.log("No active session, using free tier limits");
        setMessagesLimit(MAX_FREE_MESSAGES);
        setIsSubscribed(false);
        return;
      }
      
      // Call the subscription check function
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
        .maybeSingle();
        
      if (userError) {
        console.error("Error fetching user limits:", userError);
        return;
      }
      
      if (userData) {
        setMessagesUsed(userData.messages_used);
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
