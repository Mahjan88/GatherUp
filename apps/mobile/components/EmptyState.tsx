import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Ionicons name={icon} size={64} color="#d1d5db" />
      <Text className="text-gray-500 text-center mt-4 text-lg">{title}</Text>
      {description && (
        <Text className="text-gray-400 text-center mt-2">{description}</Text>
      )}
    </View>
  );
}
