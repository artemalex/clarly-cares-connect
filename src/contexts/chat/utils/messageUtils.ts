
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
    // Check if user is logged in or guest
    const { data: session } = await supabase.auth.getSession();
    const user_id = session?.session?.user?.id;
    const guest_id = getGuestId();
    
    let activeConversationId = conversationId;
    
    // If there's no conversation ID yet, create one first
    if (!activeConversationId) {
      // Create a new conversation using send-conversation edge function
      try {
        console.log("Creating new conversation with mode:", mode);
        const response = await supabase.functions.invoke("send-conversation", {
          body: {
            guest_id: guest_id,
            title: "New Conversation",
            mode: mode // Ensure we're passing the correct mode from the parameter
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
      } catch (err) {
        console.error("Error creating conversation:", err);
        throw new Error("Failed to create conversation. Please try again.");
      }
    }
    
    // Now call the chat function with the conversation ID
    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          messages: [...messages, { role: "user", content }].map(({ role, content }) => ({ role, content })),
          user_id,
          guest_id,
          conversation_id: activeConversationId,
          mode, // Ensure we're passing the mode parameter directly
          isInitial: messages.length === 0
        }
      });
      
      if (error) throw error;
      
      // It should return the assistant's message
      if (!data || !data.message) {
        throw new Error("Invalid response from server");
      }
      
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
        assistantMessage,
        conversationId: data.conversation_id || activeConversationId
      };
    } catch (err) {
      console.error("Error calling chat function:", err);
      throw err;
    }
    
  } catch (error) {
    console.error("Error in sendMessageToAPI:", error);
    return { 
      success: false, 
      error 
    };
  }
}
