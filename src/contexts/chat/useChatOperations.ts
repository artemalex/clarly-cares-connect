
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
    startNewChat,
    setConversationId
  );

  // Check subscription status and load conversation if ID is provided
  useEffect(() => {
    const initializeChat = async () => {
      await checkSubscriptionStatus();
      
      // If URL has a conversation ID, load it
      if (urlConversationId) {
        await loadConversationData(urlConversationId);
      } 
      // If localStorage has a conversation ID, try to use it
      else if (localStorage.getItem("conversation_id") && messages.length === 0 && !isLoading) {
        const savedId = localStorage.getItem("conversation_id");
        if (savedId) {
          await loadConversationData(savedId);
        } else {
          await startNewChat(true);
        }
      }
      // If no conversation ID anywhere, start a new chat
      else if (messages.length === 0 && !isLoading) {
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
    startNewChat: (isInitial = false) => startNewChat(isInitial, mode),
    checkSubscriptionStatus,
    loadConversation: loadConversationData,
    generateInitialMessage: (conversationId: string) => generateFirstMessage(conversationId, mode)
  };
}
