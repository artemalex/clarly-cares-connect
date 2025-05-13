import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/lib/supabase";
import { Message, MessageMode } from "../types";
import { sendMessageToAPI } from "../utils/messageUtils";
import { getGuestId } from "@/utils/guestUtils";

export function useMessageHandling(
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  mode: MessageMode,
  conversationId: string | null,
  startNewChat: () => Promise<void>,
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>
) {
  // Send a message and get a response
  const sendMessage = async (content: string) => {
    if (content.trim() === "") return;

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please sign up to start chatting!");
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

    // Create user message object for immediate display
    const userMessageId = uuidv4();
    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content,
      timestamp: new Date()
    };
    
    // Immediately update UI with user message
    setMessages(prevMessages => [...prevMessages, userMessage]);

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
      
      // Update local state with just the assistant response (user message already added)
      setMessages(prevMessages => [...prevMessages, result.assistantMessage]);
      
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
