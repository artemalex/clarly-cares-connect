import { createContext, useContext, ReactNode } from "react";
import { ChatContextType } from "./types";
import { useChatOperations } from "./useChatOperations";

// Create the context
export const ChatContext = createContext<ChatContextType | undefined>(undefined);

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

  return (
    <ChatContext.Provider value={chatOperations}>
      {children}
    </ChatContext.Provider>
  );
};
