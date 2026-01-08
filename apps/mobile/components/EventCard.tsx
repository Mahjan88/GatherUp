import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventWithHost } from '@gatherup/shared';

interface EventCardProps {
  event: EventWithHost;
  onPress: () => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
  return (
    <TouchableOpacity
      className="bg-white rounded-lg shadow-sm overflow-hidden mb-4"
      onPress={onPress}
    >
      {event.cover_image_url && <View className="h-48 bg-gray-200" />}
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-lg font-semibold flex-1">{event.title}</Text>
          {event.visibility === 'public' && (
            <View className="bg-green-100 px-2 py-1 rounded">
              <Text className="text-xs text-green-800 font-medium">Public</Text>
            </View>
          )}
        </View>
        <View className="flex-row items-center mb-2">
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text className="ml-1 text-gray-600">
            {new Date(event.start_time).toLocaleDateString()}
          </Text>
        </View>
        {event.location && (
          <View className="flex-row items-center mb-2">
            <Ionicons name="location-outline" size={16} color="#6b7280" />
            <Text className="ml-1 text-gray-600">{event.location}</Text>
          </View>
        )}
        <View className="flex-row items-center">
          <Ionicons name="people-outline" size={16} color="#6b7280" />
          <Text className="ml-1 text-gray-600">
            {event.member_count || 0} members
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
