import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getMyHostedEvents, getMyInvitedEvents } from '@gatherup/shared';
import { Ionicons } from '@expo/vector-icons';

type Tab = 'hosting' | 'invited';

export default function EventsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('hosting');

  const { data: hostedEvents, isLoading: hostedLoading, refetch: refetchHosted } = useQuery({
    queryKey: ['my-hosted-events'],
    queryFn: getMyHostedEvents,
  });

  const { data: invitedEvents, isLoading: invitedLoading, refetch: refetchInvited } = useQuery({
    queryKey: ['my-invited-events'],
    queryFn: getMyInvitedEvents,
  });

  const events = activeTab === 'hosting' ? hostedEvents : invitedEvents;
  const isLoading = activeTab === 'hosting' ? hostedLoading : invitedLoading;
  const refetch = activeTab === 'hosting' ? refetchHosted : refetchInvited;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Tab Selector */}
      <View className="flex-row bg-white border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 py-4 ${
            activeTab === 'hosting' ? 'border-b-2 border-primary-600' : ''
          }`}
          onPress={() => setActiveTab('hosting')}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === 'hosting' ? 'text-primary-600' : 'text-gray-600'
            }`}
          >
            Hosting ({hostedEvents?.length || 0})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-4 ${
            activeTab === 'invited' ? 'border-b-2 border-primary-600' : ''
          }`}
          onPress={() => setActiveTab('invited')}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === 'invited' ? 'text-primary-600' : 'text-gray-600'
            }`}
          >
            Invited ({invitedEvents?.length || 0})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Events List */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {events && events.length > 0 ? (
          <View className="p-4 space-y-4">
            {events.map((event) => (
              <TouchableOpacity
                key={event.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
                onPress={() => router.push(`/event/${event.id}`)}
              >
                {event.cover_image_url && (
                  <View className="h-48 bg-gray-200" />
                )}
                <View className="p-4">
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-lg font-semibold flex-1">
                      {event.title}
                    </Text>
                    {event.visibility === 'public' && (
                      <View className="bg-green-100 px-2 py-1 rounded">
                        <Text className="text-xs text-green-800 font-medium">
                          Public
                        </Text>
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
                      <Ionicons
                        name="location-outline"
                        size={16}
                        color="#6b7280"
                      />
                      <Text className="ml-1 text-gray-600">
                        {event.location}
                      </Text>
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
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center p-8">
            <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-500 text-center mt-4">
              {activeTab === 'hosting'
                ? "You haven't created any events yet"
                : "You haven't been invited to any events"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
