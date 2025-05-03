
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";
import { corsHeaders } from "../_shared/cors.ts";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

// Define the function schema for generating suggestions
const functions = [
  {
    name: "generate_suggestions",
    description: "Generate 2–3 dynamic follow-up prompts based on the user's emotional context",
    parameters: {
      type: "object",
      properties: {
        suggestions: {
          type: "array",
          items: {
            type: "string"
          },
          description: "Follow-up messages the user might click to continue the conversation"
        }
      },
      required: ["suggestions"]
    }
  }
];

// Updated system prompt to use function calling
const getSystemPrompt = (basePrompt: string) => {
  return `${basePrompt}

Your job is to respond empathetically to the user based on their current emotional context. 
After your reply, call the function 'generate_suggestions' to return 2–3 short, relevant, clickable follow-up options.

Suggestions must be:
– Directly based on the conversation and user's last message
– Tailored to the emotional context of the conversation
– Phrased as things the user might naturally want to say next
– Useful to guide or deepen the emotional conversation

Examples:
→ For a user venting about a manager: 
   ["I feel like I'm never appreciated.", "How do I stay calm in meetings?", "I just need to let this out."]

→ For a user slowing down after burnout: 
   ["Can you help me breathe?", "Why do I feel guilty for resting?", "What would self-kindness look like here?"]

Always respond first with empathy, then call the function.`;
};

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

    // Format for the OpenAI API - Find system message to enhance
    let systemPrompt = "";
    const openaiMessages = messages.map((msg: Message) => {
      if (msg.role === "system") {
        systemPrompt = msg.content;
        return {
          role: "system",
          content: getSystemPrompt(msg.content)
        };
      }
      return {
        role: msg.role,
        content: msg.content
      };
    });

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
        temperature: 0.7,
        functions: functions,
        function_call: { name: "generate_suggestions" }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to get response from OpenAI");
    }

    const message = data.choices[0].message.content;
    
    // Extract suggestions from function call
    let suggestions = [];
    if (data.choices[0].message.function_call) {
      try {
        const functionCall = data.choices[0].message.function_call;
        if (functionCall.name === "generate_suggestions") {
          const functionArgs = JSON.parse(functionCall.arguments);
          suggestions = functionArgs.suggestions || [];
        }
      } catch (e) {
        console.error("Error parsing function call arguments:", e);
      }
    }

    return new Response(
      JSON.stringify({ 
        message,
        suggestions 
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
