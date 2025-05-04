import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Message, MessageMode } from "../types";
import { loadConversation, createConversation, generateInitialMessage } from "../utils/conversationUtils";
import { ensureGuestId, getGuestId } from "@/utils/guestUtils";

export function useConversationManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<MessageMode>(() => {
    const savedMode = localStorage.getItem("clarlyMode");
    return (savedMode === "slow" || savedMode === "vent") ? savedMode : "slow";
  });
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Get router hooks conditionally using try/catch to prevent errors if used outside Router
  const params = (() => {
    try {
      return useParams<{ id?: string }>();
    } catch (e) {
      return { id: undefined };
    }
  })();
  
  const urlConversationId = params.id;
  
  // This is the fixed navigate function
  const navigate = (() => {
    try {
      return useNavigate();
    } catch (e) {
      return (path: string, options?: any) => {
        console.warn("Navigation attempted outside Router context:", path);
      };
    }
  })();
  
  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("clarlyMode", mode);
  }, [mode]);

  // Load a conversation by ID
  const loadConversationData = async (id: string) => {
    try {
      setIsLoading(true);
      
      const result = await loadConversation(id);
      
      if (!result.success) {
        navigate("/chat");
        return;
      }
      
      setConversationId(id);
      setMode(result.conversation.mode as MessageMode);
      setMessages(result.messages);
      
    } catch (error) {
      console.error("Error loading conversation:", error);
      toast.error("Failed to load conversation");
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new chat conversation
  const startNewChat = async (isInitial = false) => {
    try {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user?.id;
      let guestId = null;
      
      // If not authenticated, use guest ID
      if (!userId) {
        guestId = ensureGuestId();
        
        // Set the guest claim in the JWT
        try {
          await supabase.functions.invoke('set-guest-claims', {
            body: { guest_id: guestId }
          });
        } catch (error) {
          console.error("Error setting guest claims:", error);
          // Continue anyway as this is non-critical
        }
      }
      
      // Create a new conversation
      const result = await createConversation(mode, userId, guestId);
      if (!result.success) return;
      
      // Update state with the new conversation ID
      setConversationId(result.conversationId);
      setMessages([]);
      
      // Update URL for logged in users
      if (userId) {
        navigate(`/chat/${result.conversationId}`, { replace: true });
      }
      
      // If this isn't the initial call, generate the first message
      if (!isInitial) {
        await generateFirstMessage(result.conversationId);
      }
    } catch (error) {
      console.error("Error starting new chat:", error);
      toast.error("Failed to start new chat");
    }
  };
  
  // Generate the initial AI message
  const generateFirstMessage = async (newConversationId: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await generateInitialMessage(newConversationId, mode);
      
      if (!result.success) {
        toast.error("Failed to start the conversation. Please try again.");
        return;
      }
      
      setMessages([result.message]);
    } catch (error) {
      console.error("Error generating initial message:", error);
      toast.error("Failed to start the conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    setMessages,
    mode,
    setMode,
    isLoading,
    setIsLoading,
    conversationId,
    setConversationId,
    urlConversationId,
    loadConversationData,
    startNewChat,
    generateFirstMessage,
  };
}
