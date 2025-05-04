
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MAX_FREE_MESSAGES } from "../constants";
import { ensureGuestId, getGuestId } from "@/utils/guestUtils";

export function useSubscriptionStatus() {
  const [messagesUsed, setMessagesUsed] = useState<number>(0);
  const [messagesLimit, setMessagesLimit] = useState<number>(MAX_FREE_MESSAGES);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  
  // Calculate remaining messages
  const remainingMessages = messagesLimit - messagesUsed;

  const checkSubscriptionStatus = async () => {
    try {
      const session = await supabase.auth.getSession();
      
      // If user is not logged in, check guest message count
      if (!session.data.session) {
        console.log("No active session, using free tier limits");
        setMessagesLimit(MAX_FREE_MESSAGES);
        setIsSubscribed(false);
        
        // Get guest ID, ensure one exists
        const guestId = ensureGuestId();
        
        // Load guest message count
        const { data: guestData, error: guestError } = await supabase
          .from('user_limits')
          .select('messages_used')
          .eq('guest_id', guestId)
          .maybeSingle();
          
        if (!guestError && guestData) {
          setMessagesUsed(guestData.messages_used);
        } else {
          // Create initial record for guest
          await supabase.from('user_limits').insert({
            guest_id: guestId,
            messages_used: 0,
            messages_limit: MAX_FREE_MESSAGES
          });
          setMessagesUsed(0);
        }
        
        return;
      }
      
      // Call the subscription check function for logged in users
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
    setMessagesUsed,
    checkSubscriptionStatus
  };
}
