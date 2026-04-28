import type { ApiClient } from './client.js';

export class NotificationsApi {
  constructor(private client: ApiClient) {}

  list(params?: { limit?: number; unreadOnly?: boolean }) {
    return this.client.get('/api/notifications', params);
  }

  getUnreadCount() {
    return this.client.get<{ data: { count: number } }>('/api/notifications/unread-count');
  }

  markAsRead(id: string) {
    return this.client.patch(`/api/notifications/${id}/read`);
  }

  markAllAsRead() {
    return this.client.post('/api/notifications/read-all');
  }
}
