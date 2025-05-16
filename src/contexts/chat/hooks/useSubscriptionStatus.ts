import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MAX_FREE_MESSAGES } from "../constants";
import { useNavigate } from "react-router-dom";

export function useSubscriptionStatus() {
  const [messagesUsed, setMessagesUsed] = useState<number>(0);
  const [messagesLimit, setMessagesLimit] = useState<number>(MAX_FREE_MESSAGES);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isInTrial, setIsInTrial] = useState<boolean>(false);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  
  const remainingMessages = isSubscribed ? Infinity : messagesLimit - messagesUsed;

  const checkSubscriptionStatus = async () => {
    try {
      const session = await supabase.auth.getSession();
      
      if (!session.data.session) {
        navigate("/signup", { 
          state: { 
            message: "Please sign up to start chatting. You'll get 7 days of free access!" 
          }
        });
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error("Error checking subscription:", error);
        return;
      }
      
      setIsSubscribed(data.isSubscribed);
      setMessagesLimit(data.messagesLimit);
      setIsInTrial(data.isInTrial);
      setTrialEndsAt(data.trialEndsAt);
      
      // Load user message count
      const { data: userData, error: userError } = await supabase
        .from('user_limits')
        .select('messages_used')
        .eq('user_id', session.data.session.user.id)
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
    isInTrial,
    trialEndsAt,
    setMessagesUsed,
    checkSubscriptionStatus
  };
}
