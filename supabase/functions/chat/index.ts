
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";
import { corsHeaders } from "../_shared/cors.ts";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages, isInitial = false, conversation_id, guest_id, user_id } = await req.json();
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get OpenAI API key from Supabase secrets
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY") || "";
    
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    // Create a new conversation if this is the initial message and no conversation_id is provided
    let activeConversationId = conversation_id;
    let activeGuestId = guest_id;

    if (isInitial && !activeConversationId) {
      // Generate a new guest ID if not provided
      if (!activeGuestId && !user_id) {
        activeGuestId = crypto.randomUUID();
      }

      // Create a new conversation
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          user_id: user_id || null,
          guest_id: activeGuestId || null,
          title: "New Conversation",
          mode: "slow" // Default mode
        })
        .select('id')
        .single();

      if (conversationError) {
        throw new Error(`Failed to create conversation: ${conversationError.message}`);
      }

      activeConversationId = conversationData.id;
    }

    // Format for the OpenAI API
    const openaiMessages = messages.map((msg: Message) => ({
      role: msg.role,
      content: msg.content
    }));

    // If it's an initial message, add a hidden prompt to start the conversation
    if (isInitial) {
      openaiMessages.push({
        role: "user",
        content: "Hello, I'm here for some guidance. Can you introduce yourself and ask me how I'm feeling today?"
      });
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o", 
        messages: openaiMessages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to get response from OpenAI");
    }

    const message = data.choices[0].message.content;

    // If this is a new conversation, store the AI message in the database
    if (isInitial && activeConversationId) {
      await supabase
        .from('chat_messages')
        .insert({
          conversation_id: activeConversationId,
          user_id: user_id || null,
          guest_id: activeGuestId || null,
          role: 'assistant',
          content: message
        });

      // Update user_limits if needed
      if (user_id || activeGuestId) {
        // Check if user_limits record exists
        const { data: limitsData } = await supabase
          .from('user_limits')
          .select('*')
          .or(`user_id.eq.${user_id ? user_id : null},guest_id.eq.${activeGuestId ? `'${activeGuestId}'` : null}`)
          .maybeSingle();

        if (limitsData) {
          // Update existing record
          await supabase
            .from('user_limits')
            .update({
              messages_used: limitsData.messages_used + 1
            })
            .match(user_id ? { user_id } : { guest_id: activeGuestId });
        } else {
          // Create new record
          await supabase
            .from('user_limits')
            .insert({
              user_id: user_id || null,
              guest_id: activeGuestId || null,
              messages_used: 1
            });
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        message,
        conversation_id: activeConversationId,
        guest_id: activeGuestId
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 200
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 500
      }
    );
  }
});
