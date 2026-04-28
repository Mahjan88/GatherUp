import { useEffect, useState, useCallback } from 'react';
import { Stack, useRouter } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as ExpoSplashScreen from 'expo-splash-screen';
import SplashScreen from '../components/SplashScreen';
import { CenterButtonProvider } from '../contexts/CenterButtonContext';

// Prevent the native splash screen from hiding automatically
ExpoSplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated] = useState(false); // TODO: Integrate useAuth hook from @gatherup/shared when auth screens are implemented
  const router = useRouter();

  useEffect(() => {
    async function prepare() {
      try {
        // Simulate loading resources
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        // Hide the native splash screen immediately
        await ExpoSplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const onSplashFinish = useCallback(() => {
    setShowSplash(false);
    // Navigate to signup if not authenticated
    if (!isAuthenticated) {
      router.replace('/(auth)/signup');
    }
  }, [isAuthenticated, router]);

  if (!appIsReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <CenterButtonProvider>
        {showSplash && <SplashScreen onFinish={onSplashFinish} />}
        <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
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
          name="event/create"
          options={{
            title: 'Create Event',
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="event/past"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      </CenterButtonProvider>
    </QueryClientProvider>
  );
}
