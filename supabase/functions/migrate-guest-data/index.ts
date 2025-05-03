
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    // Extract token
    const token = authHeader.replace("Bearer ", "");
    
    // Get request data
    const { guest_id } = await req.json();
    
    if (!guest_id) {
      throw new Error("Missing guest ID");
    }
    
    // Create a Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
    
    // Create a Supabase client with user token
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    
    // Get the user from their token
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("Invalid user token");
    }
    
    const userId = userData.user.id;

    // Begin transaction to migrate all guest data to the user
    // Update conversations
    const { error: convError } = await supabaseAdmin
      .from('conversations')
      .update({ user_id: userId, guest_id: null })
      .eq('guest_id', guest_id);
    
    if (convError) {
      console.error("Error updating conversations:", convError);
    }
    
    // Update chat messages
    const { error: msgError } = await supabaseAdmin
      .from('chat_messages')
      .update({ user_id: userId, guest_id: null })
      .eq('guest_id', guest_id);
    
    if (msgError) {
      console.error("Error updating chat messages:", msgError);
    }
    
    // Update or merge user limits
    // First, check if the user already has limits
    const { data: existingUserLimits, error: limitCheckError } = await supabaseAdmin
      .from('user_limits')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    // Get guest limits
    const { data: guestLimits, error: guestLimitError } = await supabaseAdmin
      .from('user_limits')
      .select('*')
      .eq('guest_id', guest_id)
      .maybeSingle();
    
    if (!limitCheckError && !guestLimitError) {
      if (existingUserLimits) {
        // User already has limits, just update messages_used
        if (guestLimits) {
          await supabaseAdmin
            .from('user_limits')
            .update({ messages_used: existingUserLimits.messages_used + guestLimits.messages_used })
            .eq('user_id', userId);
          
          // Delete the guest limits
          await supabaseAdmin
            .from('user_limits')
            .delete()
            .eq('guest_id', guest_id);
        }
      } else if (guestLimits) {
        // User doesn't have limits, migrate the guest limits
        await supabaseAdmin
          .from('user_limits')
          .update({ user_id: userId, guest_id: null })
          .eq('guest_id', guest_id);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Guest data migrated successfully" 
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
