
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
    // Check if user is logged in or guest
    const { data: session } = await supabase.auth.getSession();
    const user_id = session?.session?.user?.id;
    const guest_id = getGuestId();
    
    let activeConversationId = conversationId;
    
    // If there's no conversation ID, create one first
    if (!activeConversationId) {
      // Create a new conversation using send-conversation edge function
      const response = await supabase.functions.invoke("send-conversation", {
        body: {
          guest_id: guest_id,
          title: "New Conversation",
          mode: mode
        }
      });
      
      if (response.error) {
        console.error("Failed to create conversation:", response.error);
        throw new Error("Failed to create conversation");
      }
      
      if (response.data && response.data.conversationId) {
        activeConversationId = response.data.conversationId;
        localStorage.setItem("conversation_id", activeConversationId);
      } else {
        throw new Error("No conversation ID returned from server");
      }
    }

    // Call the chat function with the proper conversation ID
    const { data, error } = await supabase.functions.invoke('chat', {
      body: { 
        messages: [],
        user_id,
        guest_id,
        conversation_id: activeConversationId,
        mode,
        isInitial: true
      }
    });

    if (error) throw error;
    
    // Store conversation ID and guest ID from response
    if (data.conversation_id) {
      localStorage.setItem("conversation_id", data.conversation_id);
    }
    
    if (data.guest_id) {
      localStorage.setItem("guest_id", data.guest_id);
    }

    // Create the message object
    const message: Message = {
      id: uuidv4(),
      role: "assistant",
      content: data.message,
      timestamp: new Date()
    };

    return {
      success: true,
      message,
      conversationId: data.conversation_id || activeConversationId
    };
  } catch (error) {
    console.error("Error generating initial message:", error);
    return {
      success: false,
      error
    };
  }
}
