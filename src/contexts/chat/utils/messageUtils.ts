
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/lib/supabase";
import { Message, MessageMode } from "../types";
import { SYSTEM_PROMPTS } from "../constants";
import { getGuestId } from "@/utils/guestUtils";

export async function sendMessageToAPI(
  content: string, 
  messages: Message[], 
  mode: MessageMode,
  conversationId: string
) {
  try {
    // Create user message object for local state
    const messageId = uuidv4();
    const userMessage: Message = {
      id: messageId,
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    // Check if user is logged in or guest
    const { data: session } = await supabase.auth.getSession();
    const user_id = session.session?.user?.id;
    const guest_id = getGuestId();
    
    // Prepare message data
    const messageData: any = {
      id: messageId,
      conversation_id: conversationId,
      role: 'user',
      content
    };
    
    // Set either user_id or guest_id
    if (user_id) {
      messageData.user_id = user_id;
    } else if (guest_id) {
      messageData.guest_id = guest_id;
    }
    
    // Call the chat function directly with both user_id and guest_id
    const { data, error } = await supabase.functions.invoke('chat', {
      body: { 
        messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
        user_id,
        guest_id,
        conversation_id: conversationId
      }
    });
    
    if (error) throw error;
    
    const assistantMessageId = uuidv4();
    
    // Prepare assistant message data
    const assistantMessageData: any = {
      id: assistantMessageId,
      conversation_id: conversationId,
      role: 'assistant',
      content: data.message
    };
    
    // Set either user_id or guest_id for assistant message
    if (user_id) {
      assistantMessageData.user_id = user_id;
    } else if (guest_id) {
      assistantMessageData.guest_id = guest_id;
    }
    
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: data.message,
      timestamp: new Date()
    };

    return { 
      success: true, 
      userMessage, 
      assistantMessage 
    };
    
  } catch (error) {
    console.error("Error in sendMessageToAPI:", error);
    return { 
      success: false, 
      error 
    };
  }
}
