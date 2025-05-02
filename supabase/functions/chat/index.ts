
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
    const { messages, isInitial = false } = await req.json();
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get OpenAI API key from Supabase secrets
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY") || "";
    
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY is not set");
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

    return new Response(
      JSON.stringify({ message }),
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
