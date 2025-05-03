
import { useEffect } from "react";
import { useSubscriptionStatus } from "./hooks/useSubscriptionStatus";
import { useConversationManagement } from "./hooks/useConversationManagement";
import { useMessageHandling } from "./hooks/useMessageHandling";
import { useGuestUser } from "@/hooks/useGuestUser";

export function useChatOperations() {
  // Initialize guest user functionality
  const { guestId, isGuest, isLoading: guestLoading, migrateGuestData } = useGuestUser();
  
  const {
    messagesUsed,
    remainingMessages,
    messagesLimit,
    isSubscribed,
    setMessagesUsed,
    checkSubscriptionStatus
  } = useSubscriptionStatus(guestId);
  
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
  } = useConversationManagement(guestId);
  
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
    startNewChat,
    guestId
  );

  // Check subscription status and load conversation if ID is provided
  useEffect(() => {
    const initializeChat = async () => {
      // Don't initialize until guest status is determined
      if (guestLoading) return;
      
      await checkSubscriptionStatus();
      
      if (urlConversationId) {
        await loadConversationData(urlConversationId);
      } else if (messages.length === 0 && !isLoading) {
        await startNewChat(true);
      }
    };
    
    initializeChat();
  }, [urlConversationId, guestLoading]);

  return {
    messages,
    mode,
    messagesUsed,
    remainingMessages,
    isLoading,
    isSubscribed,
    conversationId,
    isGuest,
    guestId,
    migrateGuestData,
    setMode,
    sendMessage,
    startNewChat,
    checkSubscriptionStatus,
    loadConversation: loadConversationData,
    generateInitialMessage: generateFirstMessage
  };
}
