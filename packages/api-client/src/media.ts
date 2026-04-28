import type { ApiClient } from './client.js';

export class MediaApi {
  constructor(private client: ApiClient) {}

  getEventMedia(eventId: string) {
    return this.client.get(`/api/media/event/${eventId}`);
  }

  uploadEventMedia(eventId: string, file: File | Blob, fileName: string) {
    return this.client.upload(`/api/media/event/${eventId}/upload`, file, fileName);
  }

  deleteMedia(id: string) {
    return this.client.delete(`/api/media/${id}`);
  }

  uploadAvatar(file: File | Blob) {
    return this.client.upload('/api/media/avatar', file, 'avatar');
  }
}
