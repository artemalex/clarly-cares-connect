
import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

export type MessageMode = "slow" | "vent";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: Message[];
  mode: MessageMode;
  messagesUsed: number;
  remainingMessages: number;
  isLoading: boolean;
  setMode: (mode: MessageMode) => void;
  sendMessage: (content: string) => void;
  startNewChat: () => void;
}

const MAX_FREE_MESSAGES = 6;

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
  const [mode, setMode] = useState<MessageMode>("slow");
  const [messagesUsed, setMessagesUsed] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const remainingMessages = MAX_FREE_MESSAGES - messagesUsed;

  const generateResponseBasedOnMode = async (content: string): Promise<string> => {
    // In a real implementation, this would call the Supabase edge function
    // For now, we'll simulate the response
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (mode === "slow") {
      return `I notice you're feeling a bit overwhelmed. Let's take a moment to explore these feelings together. ${content.length > 50 ? "I appreciate you sharing this with me in such detail." : "Would you like to tell me more about what's happening?"}`;
    } else {
      // Vent mode
      return `I hear you! That sounds really challenging. ${content.length > 50 ? "Thank you for getting that off your chest. How are you feeling now?" : "Go ahead and let it all out. I'm listening."}`;
    }
  };

  const sendMessage = async (content: string) => {
    if (content.trim() === "") return;
    
    if (messagesUsed >= MAX_FREE_MESSAGES) {
      toast.error("You've reached your message limit. Please subscribe to continue.");
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
      const response = await generateResponseBasedOnMode(content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
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
  };

  const value: ChatContextType = {
    messages,
    mode,
    messagesUsed,
    remainingMessages,
    isLoading,
    setMode,
    sendMessage,
    startNewChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
