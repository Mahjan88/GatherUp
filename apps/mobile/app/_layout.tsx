import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="compose"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="chat/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="contact/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="settings/profile"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="settings/account"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="settings/chats"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="settings/notifications"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="settings/data-storage"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="event/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="gallery/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="create-event"
          options={{
            title: 'Create Event',
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
