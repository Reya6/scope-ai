import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin client — server-side only.
 * Uses the Supabase Secret Key for privileged operations.
 *
 * NEVER expose this key to the browser/client.
 */

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  throw new Error(
    "❌ Missing SUPABASE_URL or SUPABASE_SECRET_KEY in environment variables.",
  );
}

const supabaseAdmin = createClient(url, secretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

export default supabaseAdmin;
