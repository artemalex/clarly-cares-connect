
import { useEffect } from "react";
import { useSubscriptionStatus } from "./hooks/useSubscriptionStatus";
import { useConversationManagement } from "./hooks/useConversationManagement";
import { useMessageHandling } from "./hooks/useMessageHandling";

export function useChatOperations() {
  const {
    messagesUsed,
    remainingMessages,
    messagesLimit,
    isSubscribed,
    setMessagesUsed,
    checkSubscriptionStatus
  } = useSubscriptionStatus();
  
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
    generateFirstMessage
  } = useConversationManagement();
  
  const { sendMessage } = useMessageHandling(
    messages,
    setMessages,
    messagesUsed,
    messagesLimit,
    isLoading,
    setIsLoading,
    isSubscribed,
    mode,
    conversationId,
    setMessagesUsed,
    checkSubscriptionStatus,
    startNewChat
  );

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
