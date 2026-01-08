'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack:/react-query';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@gatherup/shared';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
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

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsReadMutation.mutate(notification.id);
    }

    if (notification.type.includes('event') && notification.data.event_id) {
      router.push(`/event/${notification.data.event_id}`);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event_invitation':
        return '✉️';
      case 'join_request':
        return '👤';
      case 'join_approved':
        return '✅';
      case 'event_update':
        return 'ℹ️';
      case 'new_message':
        return '💬';
      case 'event_reminder':
        return '⏰';
      default:
        return '🔔';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
        {notifications && notifications.length > 0 && (
          <button
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`w-full bg-white rounded-lg p-4 text-left hover:bg-gray-50 transition-colors ${
                !notification.read ? 'border-l-4 border-primary-600' : ''
              }`}
            >
              <div className="flex items-start">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl ${
                    !notification.read ? 'bg-primary-100' : 'bg-gray-100'
                  }`}
                >
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 ml-3">
                  <p
                    className={`text-base ${
                      !notification.read ? 'font-semibold' : 'font-normal'
                    }`}
                  >
                    {notification.data.message || 'New notification'}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No notifications yet</p>
        </div>
      )}
    </div>
  );
}
