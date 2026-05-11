import type { ApiClient } from './client.js';

export class SeriesApi {
  constructor(private client: ApiClient) {}

  list(params?: {
    category?: string;
    hostId?: string;
    communityId?: string;
    page?: number;
    limit?: number;
  }) {
    return this.client.get('/api/series', params);
  }

  getById(id: string) {
    return this.client.get(`/api/series/${id}`);
  }

  create(data: Record<string, unknown>) {
    return this.client.post('/api/series', data);
  }

  update(id: string, data: Record<string, unknown>) {
    return this.client.put(`/api/series/${id}`, data);
  }

  delete(id: string) {
    return this.client.delete(`/api/series/${id}`);
  }

  subscribe(id: string) {
    return this.client.post(`/api/series/${id}/subscribe`);
  }

  unsubscribe(id: string) {
    return this.client.delete(`/api/series/${id}/subscribe`);
  }

  getEvents(id: string) {
    return this.client.get(`/api/series/${id}/events`);
  }
}
