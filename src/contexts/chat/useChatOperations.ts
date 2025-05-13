import { useEffect } from "react";
import { useConversationManagement } from "./hooks/useConversationManagement";
import { useMessageHandling } from "./hooks/useMessageHandling";

export function useChatOperations() {
  const {
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
    updateConversationMode
  } = useConversationManagement();
  
  const { sendMessage } = useMessageHandling(
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    mode,
    conversationId,
    startNewChat,
    setConversationId
  );

  // Load conversation only if URL has a conversation ID
  useEffect(() => {
    const initializeChat = async () => {
      if (urlConversationId) {
        await loadConversationData(urlConversationId);
      }
    };
    
    initializeChat();
  }, [urlConversationId]);

  return {
    messages,
    mode,
    isLoading,
    conversationId,
    setMode,
    sendMessage,
    startNewChat,
    loadConversation: loadConversationData,
    generateInitialMessage: (conversationId: string) => generateFirstMessage(conversationId, mode),
    updateConversationMode
  };
}
