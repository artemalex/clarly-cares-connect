
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
    console.log("Setting mode in localStorage:", mode);
    localStorage.setItem("clarlyMode", mode);
  }, [mode]);

  // Update the conversation's mode in the database when it changes
  useEffect(() => {
    if (conversationId && mode) {
      console.log(`Updating conversation ${conversationId} mode to ${mode} in database`);
      
      // Update the mode in the database
      supabase
        .from('conversations')
        .update({ mode })
        .eq('id', conversationId)
        .then(({ error }) => {
          if (error) {
            console.error("Error updating conversation mode:", error);
          } else {
            console.log("Conversation mode updated successfully");
          }
        });
    }
  }, [mode, conversationId]);

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
  const startNewChat = async (isInitial = false, selectedMode?: MessageMode) => {
    try {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user?.id;
      let guestId = null;
      
      // If not authenticated, use guest ID
      if (!userId) {
        guestId = ensureGuestId();
      }
      
      // Use the explicitly passed mode, or fall back to the current state
      const modeToUse = selectedMode || mode;
      console.log("Starting new chat with mode:", modeToUse);
      
      // Direct invocation of the send-conversation edge function
      if (!userId && guestId) {
        const response = await supabase.functions.invoke("send-conversation", {
          body: {
            guest_id: guestId,
            title: "New Conversation",
            mode: modeToUse // Use the explicitly passed mode
          }
        });
        
        if (response.error) {
          console.error("Conversation creation failed", response.error);
          toast.error("Failed to start new chat");
          return;
        }
        
        if (response.data && response.data.conversationId) {
          setConversationId(response.data.conversationId);
          setMessages([]);
          
          if (!isInitial) {
            await generateFirstMessage(response.data.conversationId, modeToUse);
          }
          return;
        }
      } else {
        // Create a new conversation for logged in users (using existing method)
        const result = await createConversation(modeToUse, userId, guestId);
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
          await generateFirstMessage(result.conversationId, modeToUse);
        }
      }
    } catch (error) {
      console.error("Error starting new chat:", error);
      toast.error("Failed to start new chat");
    }
  };
  
  // Generate the initial AI message
  const generateFirstMessage = async (newConversationId: string, selectedMode?: MessageMode) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Use the explicitly passed mode parameter or fall back to the current state
      const modeToUse = selectedMode || mode;
      console.log("Generating first message with mode:", modeToUse);
      
      const result = await generateInitialMessage(newConversationId, modeToUse);
      
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
