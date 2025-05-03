
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/lib/supabase";
import { Message, MessageMode } from "../types";
import { SYSTEM_PROMPTS } from "../constants";
import { toast } from "sonner";

export async function loadConversation(id: string) {
  try {
    // Check if user is logged in
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      toast.error("You must be logged in to view conversations");
      return { success: false, error: "Not logged in" };
    }
    
    // Fetch conversation details
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (convError || !conversation) {
      toast.error("Failed to load conversation or conversation not found");
      return { success: false, error: "Conversation not found" };
    }
    
    // Fetch messages for the conversation
    const { data: messageData, error: msgError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });
      
    if (msgError) {
      toast.error("Failed to load conversation messages");
      return { success: false, error: "Failed to load messages" };
    }
    
    // Format the messages
    const formattedMessages: Message[] = messageData.map(msg => ({
      id: msg.id,
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
      timestamp: new Date(msg.created_at)
    }));
    
    return {
      success: true,
      conversation,
      messages: formattedMessages
    };
  } catch (error) {
    console.error("Error loading conversation:", error);
    toast.error("Failed to load conversation");
    return { success: false, error };
  }
}

export async function createConversation(mode: MessageMode, userId?: string) {
  const newConversationId = uuidv4();
  
  // If user is logged in, save conversation to database
  if (userId) {
    const { error } = await supabase.from('conversations').insert({
      id: newConversationId,
      mode,
      user_id: userId,
      title: "New Conversation" // Default title, can be updated later
    });
    
    if (error) {
      toast.error("Failed to create new conversation");
      return { success: false };
    }
  }

  return { success: true, conversationId: newConversationId };
}

export async function generateInitialMessage(conversationId: string, mode: MessageMode) {
  try {
    // Call the OpenAI API via Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('chat', {
      body: {
        messages: [{ role: "system", content: SYSTEM_PROMPTS[mode] }],
        isInitial: true
      }
    });
    
    if (error) throw error;
    
    const messageId = uuidv4();
    
    // For logged in users, store message in database
    const session = await supabase.auth.getSession();
    if (session.data.session?.user) {
      await supabase.from('chat_messages').insert({
        id: messageId,
        conversation_id: conversationId,
        role: 'assistant',
        content: data.message,
        user_id: session.data.session.user.id
      });
    }
    
    const assistantMessage: Message = {
      id: messageId,
      role: "assistant",
      content: data.message,
      timestamp: new Date()
    };
    
    return { success: true, message: assistantMessage };
  } catch (error) {
    console.error("Error generating initial message:", error);
    return { success: false, error };
  }
}
