import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

export default function CreateScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/event/create');
  }, []);

  return <View style={{ flex: 1, backgroundColor: '#0f172a' }} />;
}
