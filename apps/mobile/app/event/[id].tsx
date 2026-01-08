import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEvent,
  respondToInvitation,
  requestToJoinEvent,
  deleteEvent,
} from '@gatherup/shared';
import { Ionicons } from '@expo/vector-icons';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEvent(id),
  });

  const respondMutation = useMutation({
    mutationFn: (status: 'joined' | 'declined') =>
      respondToInvitation(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      queryClient.invalidateQueries({ queryKey: ['my-invited-events'] });
      Alert.alert('Success', 'Response recorded!');
    },
  });

  const joinRequestMutation = useMutation({
    mutationFn: () => requestToJoinEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      Alert.alert('Success', 'Join request sent!');
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: () => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['my-hosted-events'] });
      Alert.alert('Success', 'Event deleted');
      router.back();
    },
  });

  const handleDelete = () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteEventMutation.mutate(),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!event) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-gray-500">Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {event.cover_image_url && (
        <View className="h-64 bg-gray-200" />
      )}

      <View className="p-6">
        <View className="flex-row justify-between items-start mb-4">
          <Text className="text-2xl font-bold flex-1">{event.title}</Text>
          {event.visibility === 'public' && (
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-sm text-green-800 font-medium">Public</Text>
            </View>
          )}
        </View>

        {event.description && (
          <Text className="text-gray-700 mb-6">{event.description}</Text>
        )}

        <View className="space-y-4 mb-6">
          <View className="flex-row items-center">
            <Ionicons name="time" size={20} color="#6b7280" />
            <Text className="ml-3 text-gray-700">
              {new Date(event.start_time).toLocaleString()}
            </Text>
          </View>

          {event.location && (
            <View className="flex-row items-center">
              <Ionicons name="location" size={20} color="#6b7280" />
              <Text className="ml-3 text-gray-700">{event.location}</Text>
            </View>
          )}

          <View className="flex-row items-center">
            <Ionicons name="person" size={20} color="#6b7280" />
            <Text className="ml-3 text-gray-700">
              Hosted by {event.host.full_name}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="people" size={20} color="#6b7280" />
            <Text className="ml-3 text-gray-700">
              {event.member_count || 0} members
            </Text>
          </View>
        </View>

        <View className="space-y-3">
          <TouchableOpacity
            className="bg-primary-600 rounded-lg py-4"
            onPress={() => router.push(`/chat/${id}`)}
          >
            <Text className="text-white text-center font-semibold text-base">
              View Chat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="border border-primary-600 rounded-lg py-4"
            onPress={() => router.push(`/gallery/${id}`)}
          >
            <Text className="text-primary-600 text-center font-semibold">
              View Gallery
            </Text>
          </TouchableOpacity>

          {event.visibility === 'public' && (
            <TouchableOpacity
              className="bg-green-600 rounded-lg py-4"
              onPress={() => joinRequestMutation.mutate()}
              disabled={joinRequestMutation.isPending}
            >
              <Text className="text-white text-center font-semibold">
                {joinRequestMutation.isPending ? 'Requesting...' : 'Request to Join'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="bg-red-600 rounded-lg py-4"
            onPress={handleDelete}
            disabled={deleteEventMutation.isPending}
          >
            <Text className="text-white text-center font-semibold">
              {deleteEventMutation.isPending ? 'Deleting...' : 'Delete Event'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
