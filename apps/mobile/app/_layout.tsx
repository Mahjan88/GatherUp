import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initializeSupabase } from '@gatherup/shared';
import '../global.css';

const queryClient = new QueryClient();

// Initialize Supabase immediately when this module loads
// Expo will load these from .env file automatically
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseAnonKey) {
  initializeSupabase(supabaseUrl, supabaseAnonKey);
} else {
  console.error('Missing Supabase environment variables!', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
  });
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="event/[id]" options={{ title: 'Event Details' }} />
        <Stack.Screen name="chat/[id]" options={{ title: 'Event Chat' }} />
        <Stack.Screen
          name="create-event"
          options={{ title: 'Create Event', presentation: 'modal' }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
