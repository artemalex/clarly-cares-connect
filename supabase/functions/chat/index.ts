
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
    const { messages, isInitial = false, conversation_id, guest_id, user_id, mode } = await req.json();
    
    if (!conversation_id) {
      return new Response(
        JSON.stringify({ error: "Missing conversation_id" }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          },
          status: 400
        }
      );
    }
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get OpenAI API key from Supabase secrets
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY") || "";
    
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    // Check if the conversation exists
    const { data: conversationData, error: conversationError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversation_id)
      .single();
    
    if (conversationError) {
      throw new Error(`Conversation not found: ${conversationError.message}`);
    }

    // Format for the OpenAI API
    const openaiMessages = messages.map((msg: Message) => ({
      role: msg.role,
      content: msg.content
    }));

    // If it's an initial message, add a system prompt based on the mode
    if (isInitial) {
      const systemPrompt = mode === 'vent' 
        ? "You are an empathetic friend. Listen without judgment, validate feelings, and offer support rather than solutions. Be warm, understanding, and conversational. Start by asking how the person is feeling today."
        : "You are a thoughtful therapist with expertise in cognitive behavioral therapy. Help people reflect on their thoughts, feelings, and behaviors in a compassionate way. Ask insightful questions to guide deeper reflection. Start by asking how the person is feeling today.";
      
      openaiMessages.unshift({
        role: "system",
        content: systemPrompt
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

    // Store the message in the database
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id,
        user_id: user_id || null,
        guest_id: guest_id || null,
        role: 'assistant',
        content: message
      });

    // Update user_limits if needed
    if (user_id || guest_id) {
      // Check if user_limits record exists
      const { data: limitsData } = await supabase
        .from('user_limits')
        .select('*')
        .or(`user_id.eq.${user_id ? user_id : null},guest_id.eq.${guest_id ? `'${guest_id}'` : null}`)
        .maybeSingle();

      if (limitsData) {
        // Update existing record
        await supabase
          .from('user_limits')
          .update({
            messages_used: limitsData.messages_used + 1
          })
          .match(user_id ? { user_id } : { guest_id });
      } else {
        // Create new record
        await supabase
          .from('user_limits')
          .insert({
            user_id: user_id || null,
            guest_id: guest_id || null,
            messages_used: 1
          });
      }
    }

    return new Response(
      JSON.stringify({ 
        message,
        conversation_id,
        guest_id
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
