
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/lib/supabase";
import { Message, MessageMode } from "../types";
import { SYSTEM_PROMPTS } from "../constants";
import { toast } from "sonner";
import { getGuestId } from "@/utils/guestUtils";

export async function loadConversation(id: string) {
  try {
    // Check if user is logged in
    const session = await supabase.auth.getSession();
    const guestId = getGuestId();
    
    // If not logged in and no guest ID, cannot access conversations
    if (!session.data.session && !guestId) {
      toast.error("You must be logged in to view conversations");
      return { success: false, error: "Not logged in or no guest ID" };
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

export async function createConversation(mode: MessageMode, userId?: string, guestId?: string | null) {
  const newConversationId = uuidv4();
  
  try {
    // Create conversation data
    const conversationData: any = {
      id: newConversationId,
      mode,
      title: "New Conversation" // Default title, can be updated later
    };
    
    // Set either user_id or guest_id
    if (userId) {
      conversationData.user_id = userId;
    } else if (guestId) {
      conversationData.guest_id = guestId;
    } else {
      return { success: false };
    }
    
    // Insert the conversation
    const { error } = await supabase.from('conversations').insert(conversationData);
    
    if (error) {
      toast.error("Failed to create new conversation");
      console.error("Error creating conversation:", error);
      return { success: false };
    }
    
    return { success: true, conversationId: newConversationId };
  } catch (error) {
    console.error("Error creating conversation:", error);
    return { success: false };
  }
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
    
    // Check if user is authenticated or guest
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user?.id;
    const guestId = !userId ? getGuestId() : null;
    
    // Prepare message data
    const messageData: any = {
      id: messageId,
      conversation_id: conversationId,
      role: 'assistant',
      content: data.message
    };
    
    // Set either user_id or guest_id
    if (userId) {
      messageData.user_id = userId;
    } else if (guestId) {
      messageData.guest_id = guestId;
    }
    
    // Store message in database
    await supabase.from('chat_messages').insert(messageData);
    
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
