import type { ApiClient } from './client.js';

export class EventsApi {
  constructor(private client: ApiClient) {}

  list(params?: {
    visibility?: string;
    status?: string;
    communityId?: string;
    seriesId?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    return this.client.get('/api/events', params);
  }

  feed() {
    return this.client.get('/api/events/feed');
  }

  getById(id: string) {
    return this.client.get(`/api/events/${id}`);
  }

  create(data: Record<string, unknown>) {
    return this.client.post('/api/events', data);
  }

  update(id: string, data: Record<string, unknown>) {
    return this.client.put(`/api/events/${id}`, data);
  }

  delete(id: string) {
    return this.client.delete(`/api/events/${id}`);
  }

  getHosted() {
    return this.client.get('/api/events/hosted');
  }

  getJoined() {
    return this.client.get('/api/events/joined');
  }

  invite(eventId: string, userId: string) {
    return this.client.post(`/api/events/${eventId}/invite`, { userId });
  }

  respond(eventId: string, status: 'joined' | 'declined') {
    return this.client.post(`/api/events/${eventId}/respond`, { status });
  }

  requestToJoin(eventId: string) {
    return this.client.post(`/api/events/${eventId}/join`);
  }

  approveJoinRequest(eventId: string, userId: string) {
    return this.client.post(`/api/events/${eventId}/approve`, { userId });
  }

  declineJoinRequest(eventId: string, userId: string) {
    return this.client.post(`/api/events/${eventId}/decline`, { userId });
  }
}
