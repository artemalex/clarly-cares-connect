
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/lib/supabase";
import { Message, MessageMode } from "../types";
import { SYSTEM_PROMPTS } from "../constants";
import { getGuestId } from "@/utils/guestUtils";

export async function sendMessageToAPI(
  content: string, 
  messages: Message[], 
  mode: MessageMode,
  conversationId: string | null
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
    const user_id = session?.session?.user?.id;
    const guest_id = getGuestId();
    
    // Call the chat function with appropriate parameters
    const { data, error } = await supabase.functions.invoke('chat', {
      body: { 
        messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
        user_id,
        guest_id,
        conversation_id: conversationId,
        mode
      }
    });
    
    if (error) throw error;
    
    const assistantMessageId = uuidv4();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: data.message,
      timestamp: new Date()
    };

    // Update the conversation_id in localStorage if it was provided in the response
    if (data.conversation_id) {
      localStorage.setItem("conversation_id", data.conversation_id);
    }
    
    // Update the guest_id in localStorage if it was provided in the response
    if (data.guest_id) {
      localStorage.setItem("guest_id", data.guest_id);
    }

    return { 
      success: true, 
      userMessage, 
      assistantMessage,
      conversationId: data.conversation_id || conversationId
    };
    
  } catch (error) {
    console.error("Error in sendMessageToAPI:", error);
    return { 
      success: false, 
      error 
    };
  }
}
