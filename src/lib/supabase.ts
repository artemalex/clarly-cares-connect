
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Export the supabase client from the integrated file
export const supabase = supabaseClient;

// Log for debugging - can be removed in production
console.log("Supabase client initialized successfully");
