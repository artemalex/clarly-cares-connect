
import { createContext, useContext, ReactNode } from "react";
import { ChatContextType } from "./types";
import { useChatOperations } from "./useChatOperations";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const {
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
    checkSubscriptionStatus
  } = useChatOperations();

  const value: ChatContextType = {
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
    checkSubscriptionStatus
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
