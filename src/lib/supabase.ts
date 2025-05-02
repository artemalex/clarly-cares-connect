
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallback to empty strings for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log for debugging
console.log("Supabase URL:", supabaseUrl);

// Check if the URL and key are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase configuration. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.");
}

// Initialize Supabase client with more robust error handling
export const supabase = createClient(
  supabaseUrl || '',  // Fallback to empty string if undefined
  supabaseAnonKey || ''  // Fallback to empty string if undefined
);
