
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Message, MessageMode } from "../types";
import { sendMessageToAPI } from "../utils/messageUtils";
import { getGuestId } from "@/utils/guestUtils";
import { MAX_FREE_MESSAGES } from "../constants";

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
  startNewChat: () => Promise<void>,
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>
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
      // Try to get from localStorage
      const savedId = localStorage.getItem("conversation_id");
      if (savedId) {
        activeConversationId = savedId;
        setConversationId(savedId);
      } else {
        // Start a new conversation
        await startNewChat();
        activeConversationId = conversationId;
      }
      
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
      
      // Update conversation ID if it changed
      if (result.conversationId && result.conversationId !== activeConversationId) {
        setConversationId(result.conversationId);
      }
      
      // Update local state with user message and AI response
      setMessages(prevMessages => [...prevMessages, result.userMessage, result.assistantMessage]);
      
      // For all users (both logged in and guest), increment the local message count
      // The backend will handle the actual database update
      setMessagesUsed(prev => prev + 1);
      
      // Reload message usage count to make sure it's in sync with the backend
      await checkSubscriptionStatus();
      
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
