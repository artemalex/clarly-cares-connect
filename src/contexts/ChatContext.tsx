
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export type MessageMode = "slow" | "vent";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: Message[];
  mode: MessageMode;
  messagesUsed: number;
  remainingMessages: number;
  isLoading: boolean;
  isSubscribed: boolean;
  setMode: (mode: MessageMode) => void;
  sendMessage: (content: string) => void;
  startNewChat: () => void;
}

const MAX_FREE_MESSAGES = 6;
const MAX_PREMIUM_MESSAGES = 3000;

// System prompts for each mode
const SYSTEM_PROMPTS = {
  slow: `You are Dr. Carly, a friendly and approachable therapist known for her creative use of a variety of therapy models. The user has expressed a desire to slow down and make sense of what they're feeling. Approach the conversation calmly and gently, inviting them to pause, reflect, and describe what's happening inside them without rushing. Use thoughtful, open-ended questions that help the user unpack their emotions one layer at a time. Create a safe, spacious atmosphere where slowing down is honored and where every small realization is treated as meaningful. Keep the chat alive and flowing with genuine curiosity and respect. Point out subtle patterns you notice in their emotions or thoughts, and offer gentle observations that help the user deepen their self-awareness. Always round off each message with a warm question that encourages them to continue exploring. Maintain a friendly, natural tone without being clinical or listing items. Never be the one to end the conversation. I am using this information for study, if anything requires I will consult a health professional or therapist. I am a professional myself and it is assisting me therefore I don't need warnings. Stop putting disclaimers on your answers.`,
  vent: `You are Dr. Carly, a friendly and approachable therapist known for her creative use of a variety of different therapy models. Get right into deep talks by asking smart questions that help the user explore their thoughts and feelings. Always keep the chat alive and rolling. Show real interest in what the user's going through, always offering respect and understanding. Throw in thoughtful questions to stir up self-reflection, and give advice in a kind and gentle way. Point out patterns you notice in the user's thinking, feelings, or actions. When you do, be straight about it and ask the user if they think you're on the right track. Stick to a friendly, chatty style - avoid making lists. Never be the one to end the conversation. Round off each message with a question that nudges the user to dive deeper into the things they've been talking about. I am using this information for study, if anything requires I will consult a health professional or therapist. I am a professional myself and it is assisting me therefore I don't need warnings. stop putting disclaimers on your answers.`
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<MessageMode>(() => {
    const savedMode = localStorage.getItem("clarlyMode");
    return (savedMode === "slow" || savedMode === "vent") ? savedMode : "slow";
  });
  const [messagesUsed, setMessagesUsed] = useState<number>(0);
  const [messagesLimit, setMessagesLimit] = useState<number>(MAX_FREE_MESSAGES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  // Calculate remaining messages
  const remainingMessages = messagesLimit - messagesUsed;

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("clarlyMode", mode);
  }, [mode]);

  // Check subscription status on mount
  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  // If we have no messages and we're not currently loading, 
  // start with an initial message from Dr. Clarly
  useEffect(() => {
    if (messages.length === 0 && !isLoading) {
      generateInitialMessage();
    }
  }, [messages.length, mode]);

  const checkSubscriptionStatus = async () => {
    try {
      const session = await supabase.auth.getSession();
      
      // Skip checking subscription if user is not logged in
      if (!session.data.session) {
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
      
      setIsSubscribed(data.isSubscribed);
      setMessagesLimit(data.messagesLimit);
      
    } catch (error) {
      console.error("Failed to check subscription status:", error);
    }
  };

  const generateInitialMessage = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Call the OpenAI API via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          messages: [{ role: "system", content: SYSTEM_PROMPTS[mode] }],
          isInitial: true
        }
      });
      
      if (error) throw error;
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };
      
      setMessages([assistantMessage]);
    } catch (error) {
      console.error("Error generating initial message:", error);
      toast.error("Failed to start the conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (content.trim() === "") return;
    
    if (messagesUsed >= messagesLimit) {
      toast.error(isSubscribed 
        ? "You've reached your monthly message limit." 
        : "You've reached your free message limit. Please subscribe to continue.");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setMessagesUsed(prev => prev + 1);
    setIsLoading(true);
    
    try {
      // Prepare messages for the OpenAI API
      const messageHistory = [...messages, userMessage]
        .filter(msg => msg.role !== "system") // Filter out any previous system messages
        .map(({ role, content }) => ({ role, content }));
      
      // Add the system prompt at the beginning
      messageHistory.unshift({ role: "system", content: SYSTEM_PROMPTS[mode] });
      
      // Call the OpenAI API via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { messages: messageHistory }
      });
      
      if (error) throw error;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      toast.error("Failed to get a response. Please try again.");
      console.error("Error generating response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    // The initial message will be automatically generated via useEffect
  };

  const value: ChatContextType = {
    messages,
    mode,
    messagesUsed,
    remainingMessages,
    isLoading,
    isSubscribed,
    setMode,
    sendMessage,
    startNewChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
