'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initializeSupabase } from '@gatherup/shared';

const queryClient = new QueryClient();

// Initialize Supabase immediately when this module loads
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseAnonKey) {
  initializeSupabase(supabaseUrl, supabaseAnonKey);
} else {
  console.error('Missing Supabase environment variables!', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
