import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initializeSupabase } from '@gatherup/shared';
import Constants from 'expo-constants';
import '../global.css';

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    // Initialize Supabase
    const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
    const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

    if (supabaseUrl && supabaseAnonKey) {
      initializeSupabase(supabaseUrl, supabaseAnonKey);
    }
  }, []);

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
