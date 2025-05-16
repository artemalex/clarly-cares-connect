
import { createContext, useContext, ReactNode } from "react";
import { ChatContextType } from "./types";
import { useChatOperations } from "./useChatOperations";

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Hook to use the chat context
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

// Props for the chat provider
interface ChatProviderProps {
  children: ReactNode;
}

// Chat provider component
export const ChatProvider = ({ children }: ChatProviderProps) => {
  const chatOperations = useChatOperations();
  
  const contextValue: ChatContextType = {
    messages: chatOperations.messages,
    mode: chatOperations.mode,
    messagesUsed: chatOperations.messagesUsed,
    remainingMessages: chatOperations.remainingMessages,
    isLoading: chatOperations.isLoading,
    isSubscribed: chatOperations.isSubscribed,
    freeTrialActive: chatOperations.freeTrialActive,
    freeTrialEndDate: chatOperations.freeTrialEndDate,
    conversationId: chatOperations.conversationId,
    setMode: chatOperations.setMode,
    sendMessage: chatOperations.sendMessage,
    startNewChat: chatOperations.startNewChat,
    checkSubscriptionStatus: chatOperations.checkSubscriptionStatus,
    loadConversation: chatOperations.loadConversation,
    generateInitialMessage: chatOperations.generateInitialMessage,
    updateConversationMode: chatOperations.updateConversationMode
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};
