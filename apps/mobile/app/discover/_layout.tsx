import { Stack } from 'expo-router';

export default function DiscoverLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="events" />
      <Stack.Screen name="communities" />
    </Stack>
  );
}
