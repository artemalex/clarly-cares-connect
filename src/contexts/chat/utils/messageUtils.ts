
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/lib/supabase";
import { Message, MessageMode } from "../types";
import { SYSTEM_PROMPTS } from "../constants";

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
    
    // Check if user is logged in
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user?.id;
    
    // Save user message to database if logged in
    if (userId) {
      await supabase.from('chat_messages').insert({
        id: messageId,
        conversation_id: conversationId,
        role: 'user',
        content,
        user_id: userId
      });
    }
    
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
    
    // Save AI response to database if logged in
    if (userId) {
      await supabase.from('chat_messages').insert({
        id: assistantMessageId,
        conversation_id: conversationId,
        role: 'assistant',
        content: data.message,
        user_id: userId
      });
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
