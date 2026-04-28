import type { ApiClient } from './client.js';

export class MessagesApi {
  constructor(private client: ApiClient) {}

  // Event messages
  getEventMessages(eventId: string, params?: { limit?: number; before?: string }) {
    return this.client.get(`/api/messages/event/${eventId}`, params);
  }

  sendEventMessage(eventId: string, content: string, attachments?: unknown) {
    return this.client.post(`/api/messages/event/${eventId}`, { content, attachments });
  }

  // Private messages
  getConversations() {
    return this.client.get('/api/messages/conversations');
  }

  getPrivateMessages(userId: string, params?: { limit?: number; before?: string }) {
    return this.client.get(`/api/messages/dm/${userId}`, params);
  }

  sendPrivateMessage(recipientId: string, content: string) {
    return this.client.post('/api/messages/dm', { recipientId, content });
  }

  markAsRead(userId: string) {
    return this.client.post(`/api/messages/dm/${userId}/read`);
  }
}
