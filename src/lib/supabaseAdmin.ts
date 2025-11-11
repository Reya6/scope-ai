import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin client — server-side only.
 * Uses the Service Role Key for privileged actions like inviting users.
 * ⚠️ Never expose this key to the client/browser!
 */

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error(
    "❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables."
  );
}

const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

export default supabaseAdmin;
