import type { ApiClient } from './client.js';

export class AuthApi {
  constructor(private client: ApiClient) {}

  signUp(email: string, password: string, firstName: string, lastName?: string) {
    return this.client.post('/api/auth/signup', { email, password, firstName, lastName });
  }

  signInEmail(email: string, password: string) {
    return this.client.post('/api/auth/signin/email', { email, password });
  }

  signInPhone(phone: string, password: string) {
    return this.client.post('/api/auth/signin/phone', { phone, password });
  }

  getMe() {
    return this.client.get('/api/auth/me');
  }

  updateProfile(data: {
    firstName?: string;
    lastName?: string | null;
    username?: string | null;
    tagline?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
    phone?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    userData?: Record<string, unknown> | null;
  }) {
    return this.client.patch('/api/auth/me', data);
  }

  getProfile(userId: string) {
    return this.client.get(`/api/auth/profile/${userId}`);
  }

  searchUsers(query: string) {
    return this.client.get('/api/auth/search', { query });
  }
}
