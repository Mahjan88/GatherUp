import type {
  ImportedTicketmasterEvent,
  TicketmasterEvent,
  TicketmasterUrlResolution,
} from '@gatherup/types';
import type { ApiClient } from './client.js';

/** The user's location; when given, results come back nearest first */
export interface NearLocation {
  lat: number;
  lng: number;
}

export interface TicketmasterSearchResponse {
  data: TicketmasterEvent[];
  meta: { total: number; page: number; limit: number };
}

export class TicketmasterApi {
  constructor(private client: ApiClient) {}

  search(params: {
    keyword: string;
    city?: string;
    countryCode?: 'US' | 'CA';
    page?: number;
    size?: number;
    near?: NearLocation | null;
  }) {
    const { near, ...rest } = params;
    return this.client.get<TicketmasterSearchResponse>(
      '/api/ticketmaster/events',
      { ...rest, lat: near?.lat, lng: near?.lng }
    );
  }

  /** Resolve a pasted ticketmaster.com event or artist link */
  resolveUrl(url: string, near?: NearLocation | null) {
    return this.client.get<{ data: TicketmasterUrlResolution }>(
      '/api/ticketmaster/resolve',
      { url, lat: near?.lat, lng: near?.lng }
    );
  }

  /** Verify and store the event; use externalEventId when creating */
  importEvent(id: string) {
    return this.client.post<{ data: ImportedTicketmasterEvent }>(
      `/api/ticketmaster/events/${encodeURIComponent(id)}/import`
    );
  }
}
