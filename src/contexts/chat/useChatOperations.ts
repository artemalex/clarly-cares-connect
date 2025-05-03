
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Message } from "./types";
import { MessageMode } from "./constants";
import { useSubscriptionStatus } from "./hooks/useSubscriptionStatus";
import { loadConversation, createConversation, generateInitialMessage } from "./utils/conversationUtils";
import { sendMessageToAPI } from "./utils/messageUtils";

export function useChatOperations() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<MessageMode>(() => {
    const savedMode = localStorage.getItem("clarlyMode");
    return (savedMode === "slow" || savedMode === "vent") ? savedMode : "slow";
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const {
    messagesUsed,
    messagesLimit,
    remainingMessages,
    isSubscribed,
    setMessagesUsed,
    checkSubscriptionStatus
  } = useSubscriptionStatus();
  
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

  // Check subscription status and load conversation if ID is provided
  useEffect(() => {
    const initializeChat = async () => {
      await checkSubscriptionStatus();
      
      if (urlConversationId) {
        await loadConversationData(urlConversationId);
      } else if (messages.length === 0 && !isLoading) {
        await startNewChat(true);
      }
    };
    
    initializeChat();
  }, [urlConversationId]);

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
      
      // Create a new conversation
      const result = await createConversation(mode, userId);
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
      
      // Increment message count for guest users - only for user messages
      if (!userId) {
        setMessagesUsed(prev => prev + 1);
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
    messages,
    mode,
    messagesUsed,
    remainingMessages,
    isLoading,
    isSubscribed,
    conversationId,
    setMode,
    sendMessage,
    startNewChat,
    checkSubscriptionStatus,
    loadConversation: loadConversationData,
    generateInitialMessage: generateFirstMessage
  };
}
