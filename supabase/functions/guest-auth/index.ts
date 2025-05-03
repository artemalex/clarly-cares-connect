
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { guest_id } = await req.json();
    
    if (!guest_id) {
      throw new Error("Missing guest ID");
    }
    
    // Create a Supabase client with admin rights
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if this guest has a user_limits record
    const { data: existingLimits, error: limitCheckError } = await supabase
      .from('user_limits')
      .select('*')
      .eq('guest_id', guest_id)
      .maybeSingle();
    
    if (limitCheckError) {
      throw limitCheckError;
    }
    
    // If no record exists, create one for the guest with default free tier limits
    if (!existingLimits) {
      const { error: insertError } = await supabase
        .from('user_limits')
        .insert({
          guest_id: guest_id,
          messages_limit: 6, // Free tier limit for guests
          messages_used: 0
        });
      
      if (insertError) {
        throw insertError;
      }
    }
    
    // Set up the custom claim in the database session
    await supabase.rpc('set_claim', {
      uid: 'guest',
      claim: 'app_current_guest_id',
      value: guest_id
    });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Guest authenticated successfully",
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
