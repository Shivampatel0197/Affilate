import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isPlaceholderUrl = !supabaseUrl || supabaseUrl === "your_supabase_url";
const isPlaceholderKey = !supabaseAnonKey || supabaseAnonKey === "your_supabase_anon_key";

if (isPlaceholderUrl) {
  console.error("Missing (or placeholder) NEXT_PUBLIC_SUPABASE_URL in environment variables.");
}

if (isPlaceholderKey) {
  console.error("Missing (or placeholder) NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables.");
}

const finalUrl = isPlaceholderUrl ? "https://placeholder.supabase.co" : supabaseUrl;
const finalKey = isPlaceholderKey ? "placeholder" : supabaseAnonKey;

export const supabase = createClient(finalUrl, finalKey);

// Service role client for backend operations
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const finalAdminKey = (!serviceRoleKey || serviceRoleKey === "your_supabase_service_role_key") 
  ? "placeholder" 
  : serviceRoleKey;

export const supabaseAdmin = createClient(
  finalUrl,
  finalAdminKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
