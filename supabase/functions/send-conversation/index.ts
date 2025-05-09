
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get the request body
    const { guest_id, title, mode } = await req.json();

    // Validate required fields
    if (!guest_id) {
      throw new Error('Missing required parameter: guest_id');
    }
    
    if (!mode || (mode !== 'slow' && mode !== 'vent')) {
      throw new Error('Invalid or missing mode parameter: mode must be "slow" or "vent"');
    }

    // Create a Supabase client with the Supabase URL and key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate UUID for conversation
    const conversationId = crypto.randomUUID();

    console.log(`Creating conversation with ID ${conversationId}, mode: ${mode}, guest_id: ${guest_id}`);

    // Insert the conversation into the database
    const { error } = await supabase
      .from('conversations')
      .insert({
        id: conversationId,
        guest_id: guest_id,
        title: title || 'New Conversation',
        mode: mode
      });

    if (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }

    console.log(`Successfully created conversation ${conversationId} with mode ${mode}`);

    return new Response(
      JSON.stringify({
        success: true,
        conversationId
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
});
