
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Message, MessageMode } from "../types";
import { sendMessageToAPI } from "../utils/messageUtils";
import { getGuestId } from "@/utils/guestUtils";

export function useMessageHandling(
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  messagesUsed: number,
  messagesLimit: number,
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  isSubscribed: boolean,
  mode: MessageMode,
  conversationId: string | null,
  setMessagesUsed: React.Dispatch<React.SetStateAction<number>>,
  checkSubscriptionStatus: () => Promise<void>,
  startNewChat: () => Promise<void>
) {
  // Send a message and get a response
  const sendMessage = async (content: string) => {
    if (content.trim() === "") return;
    
    if (messagesUsed >= messagesLimit) {
      toast.error(isSubscribed 
        ? "You've reached your monthly message limit." 
        : "You've reached your free message limit. Please subscribe to continue.");
      return;
    }

    let activeConversationId = conversationId;
    if (!activeConversationId) {
      // Start a new conversation
      await startNewChat();
      activeConversationId = conversationId;
      
      // If still no conversation ID, something went wrong
      if (!activeConversationId) {
        toast.error("Failed to create conversation");
        return;
      }
    }

    // Update loading state
    setIsLoading(true);
    
    try {
      // Send message and get response
      const result = await sendMessageToAPI(content, messages, mode, activeConversationId);
      
      if (!result.success) {
        toast.error("Failed to get a response. Please try again.");
        return;
      }
      
      // Update local state with user message and AI response
      setMessages(prevMessages => [...prevMessages, result.userMessage, result.assistantMessage]);
      
      // Check if user is logged in
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user?.id;
      
      // Increment message count
      if (!userId) {
        // Guest user - update the count
        const guestId = getGuestId();
        if (guestId) {
          // Update guest message count in database
          await supabase.from('user_limits')
            .upsert({
              guest_id: guestId,
              messages_used: messagesUsed + 1,
              messages_limit: MAX_FREE_MESSAGES
            }, {
              onConflict: 'guest_id'
            });
          
          setMessagesUsed(prev => prev + 1);
        } else {
          console.error("No guest ID found when updating message count");
        }
      } else {
        // Reload message usage count if user is logged in
        await checkSubscriptionStatus();
      }
      
    } catch (error) {
      toast.error("Failed to get a response. Please try again.");
      console.error("Error generating response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage
  };
}
