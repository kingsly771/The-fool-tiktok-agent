import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client using the service role key.
 * Never import this in a Client Component — it has full DB access.
 * All writes/reads happen inside API routes / server actions where
 * the Clerk-authenticated user id is already verified.
 */
export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase server environment variables.');
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
