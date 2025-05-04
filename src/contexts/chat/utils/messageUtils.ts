
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
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user?.id;
    const guestId = !userId ? getGuestId() : null;
    
    // Prepare message data
    const messageData: any = {
      id: messageId,
      conversation_id: conversationId,
      role: 'user',
      content
    };
    
    // Set either user_id or guest_id
    if (userId) {
      messageData.user_id = userId;
    } else if (guestId) {
      messageData.guest_id = guestId;
    }
    
    // Save message to database
    await supabase.from('chat_messages').insert(messageData);
    
    // Prepare messages for the OpenAI API
    const messageHistory = [...messages, userMessage]
      .filter(msg => msg.role !== "system") // Filter out any previous system messages
      .map(({ role, content }) => ({ role, content }));
    
    // Add the system prompt at the beginning based on selected mode
    messageHistory.unshift({ role: "system", content: SYSTEM_PROMPTS[mode] });
    
    // Call the OpenAI API via Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('chat', {
      body: { messages: messageHistory }
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
    
    // Set either user_id or guest_id
    if (userId) {
      assistantMessageData.user_id = userId;
    } else if (guestId) {
      assistantMessageData.guest_id = guestId;
    }
    
    // Save AI response to database
    await supabase.from('chat_messages').insert(assistantMessageData);
    
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
