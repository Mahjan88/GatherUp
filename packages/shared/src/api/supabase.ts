import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

let supabaseUrl: string;
let supabaseAnonKey: string;

export function initializeSupabase(url: string, key: string) {
  supabaseUrl = url;
  supabaseAnonKey = key;
}

export function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase not initialized. Call initializeSupabase() first.'
    );
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
}

// Singleton instance
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient();
  }
  return supabaseInstance;
}
