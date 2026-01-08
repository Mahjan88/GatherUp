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
import { getEvents } from '@gatherup/shared';
import { Ionicons } from '@expo/vector-icons';

type TimeFilter = 'upcoming' | 'today' | 'tomorrow' | 'week';
type VisibilityFilter = 'all' | 'public' | 'private';

export default function HomeScreen() {
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('upcoming');
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilter>('all');

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ['events', visibilityFilter],
    queryFn: () =>
      getEvents({
        visibility:
          visibilityFilter === 'all' ? undefined : visibilityFilter,
      }),
  });

  const filterEventsByTime = (events: any[] = []) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    switch (timeFilter) {
      case 'today':
        return events.filter((e) => {
          const eventDate = new Date(e.start_time);
          return eventDate >= today && eventDate < tomorrow;
        });
      case 'tomorrow':
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
        return events.filter((e) => {
          const eventDate = new Date(e.start_time);
          return eventDate >= tomorrow && eventDate < dayAfterTomorrow;
        });
      case 'week':
        return events.filter((e) => {
          const eventDate = new Date(e.start_time);
          return eventDate >= today && eventDate < weekEnd;
        });
      default:
        return events;
    }
  };

  const filteredEvents = filterEventsByTime(events);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Filters */}
      <View className="bg-white border-b border-gray-200">
        {/* Time Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 py-3"
        >
          {(['upcoming', 'today', 'tomorrow', 'week'] as TimeFilter[]).map(
            (filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setTimeFilter(filter)}
                className={`mr-2 px-4 py-2 rounded-full ${
                  timeFilter === filter
                    ? 'bg-primary-600'
                    : 'bg-gray-200'
                }`}
              >
                <Text
                  className={`font-medium capitalize ${
                    timeFilter === filter ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>

        {/* Visibility Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 pb-3"
        >
          {(['all', 'public', 'private'] as VisibilityFilter[]).map(
            (filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setVisibilityFilter(filter)}
                className={`mr-2 px-4 py-2 rounded-full ${
                  visibilityFilter === filter
                    ? 'bg-primary-100 border border-primary-600'
                    : 'bg-white border border-gray-300'
                }`}
              >
                <Text
                  className={`font-medium capitalize ${
                    visibilityFilter === filter
                      ? 'text-primary-600'
                      : 'text-gray-700'
                  }`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>

      {/* Events List */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {filteredEvents && filteredEvents.length > 0 ? (
          <View className="p-4 space-y-4">
            {filteredEvents.map((event) => (
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
                      {event.members?.[0]?.count || 0} members
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
              No events found
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Create Event FAB */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-primary-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push('/create-event')}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
