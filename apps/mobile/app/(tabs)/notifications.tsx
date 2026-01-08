import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Notification } from '@gatherup/shared';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@gatherup/shared';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading, refetch } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(),
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read) {
      markAsReadMutation.mutate(notification.id);
    }

    const data =
      notification.data &&
      typeof notification.data === 'object' &&
      !Array.isArray(notification.data)
        ? (notification.data as Record<string, unknown>)
        : undefined;

    // Navigate based on notification type
    const eventId = data?.event_id;
    if (notification.type.includes('event') && typeof eventId === 'string') {
      router.push(`/event/${eventId}`);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event_invitation':
        return 'mail-outline';
      case 'join_request':
        return 'person-add-outline';
      case 'join_approved':
        return 'checkmark-circle-outline';
      case 'event_update':
        return 'information-circle-outline';
      case 'new_message':
        return 'chatbubble-outline';
      case 'event_reminder':
        return 'alarm-outline';
      default:
        return 'notifications-outline';
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {notifications.length > 0 && (
        <View className="bg-white border-b border-gray-200 px-4 py-3">
          <TouchableOpacity
            onPress={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
          >
            <Text className="text-primary-600 font-semibold text-center">
              Mark all as read
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {notifications.length > 0 ? (
          <View className="p-4 space-y-2">
            {notifications.map((notification) => {
              const data =
                notification.data &&
                typeof notification.data === 'object' &&
                !Array.isArray(notification.data)
                  ? (notification.data as Record<string, unknown>)
                  : undefined;

              return (
                <TouchableOpacity
                  key={notification.id}
                  className={`bg-white rounded-lg p-4 ${
                    !notification.read ? 'border-l-4 border-primary-600' : ''
                  }`}
                  onPress={() => handleNotificationPress(notification)}
                >
                  <View className="flex-row items-start">
                    <View
                      className={`w-10 h-10 rounded-full items-center justify-center ${
                        !notification.read ? 'bg-primary-100' : 'bg-gray-100'
                      }`}
                    >
                      <Ionicons
                        name={getNotificationIcon(notification.type) as any}
                        size={20}
                        color={!notification.read ? '#2563eb' : '#6b7280'}
                      />
                    </View>
                    <View className="flex-1 ml-3">
                      <Text
                        className={`text-base ${
                          !notification.read ? 'font-semibold' : 'font-normal'
                        }`}
                      >
                        {typeof data?.message === 'string'
                          ? data.message
                          : 'New notification'}
                      </Text>
                      <Text className="text-gray-500 text-sm mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center p-8">
            <Ionicons name="notifications-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-500 text-center mt-4">
              No notifications yet
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
