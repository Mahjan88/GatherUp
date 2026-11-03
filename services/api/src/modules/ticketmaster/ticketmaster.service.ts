import { and, eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import type {
  TicketmasterEvent,
  TicketmasterUrlResolution,
} from '@gatherup/types';
import { externalEvents } from '../../db/schema/external-events.js';
import type {
  NearLocation,
  SearchTicketmasterQuery,
} from './ticketmaster.schema.js';
import {
  SUPPORTED_COUNTRIES,
  isSupportedHost,
  keywordCandidates,
  parseTicketmasterUrl,
  urlIdOf,
} from './ticketmaster.url.js';

const COUNTRY_FILTER = SUPPORTED_COUNTRIES.join(',');

const DISCOVERY_URL = 'https://app.ticketmaster.com/discovery/v2';

// Subset of the Discovery API response we read
interface TmImage {
  url: string;
  ratio?: string;
  width?: number;
}

interface TmVenue {
  name?: string;
  timezone?: string;
  address?: { line1?: string };
  city?: { name?: string };
  state?: { stateCode?: string; name?: string };
  country?: { countryCode?: string };
  location?: { latitude?: string; longitude?: string };
}

interface TmEvent {
  id: string;
  name: string;
  url: string;
  info?: string;
  pleaseNote?: string;
  images?: TmImage[];
  dates?: {
    start?: { localDate?: string; localTime?: string; dateTime?: string };
    timezone?: string;
  };
  classifications?: {
    segment?: { name?: string };
    genre?: { name?: string };
  }[];
  priceRanges?: { min?: number; max?: number; currency?: string }[];
  /** Only present when searching with a geoPoint */
  distance?: number;
  units?: string;
  _embedded?: { venues?: TmVenue[] };
}

interface TmSearchResponse {
  _embedded?: { events?: TmEvent[] };
  page?: { totalElements?: number; number?: number; size?: number };
}

interface TmAttraction {
  id: string;
  name: string;
  url?: string;
}

interface TmAttractionResponse {
  _embedded?: { attractions?: TmAttraction[] };
}

const GEOHASH_ALPHABET = '0123456789bcdefghjkmnpqrstuvwxyz';

/** Discovery's geoPoint takes a geohash; 7 characters is about 150 m */
function geohash(lat: number, lng: number, precision = 7) {
  const range = { lat: [-90, 90], lng: [-180, 180] };
  let hash = '';
  let bits = 0;
  let value = 0;
  let evenBit = true;
  while (hash.length < precision) {
    const [axis, coord] = evenBit
      ? (['lng', lng] as const)
      : (['lat', lat] as const);
    const [min, max] = range[axis];
    const mid = (min + max) / 2;
    value <<= 1;
    if (coord >= mid) {
      value |= 1;
      range[axis] = [mid, max];
    } else {
      range[axis] = [min, mid];
    }
    evenBit = !evenBit;
    if (++bits === 5) {
      hash += GEOHASH_ALPHABET[value];
      bits = 0;
      value = 0;
    }
  }
  return hash;
}

/**
 * Nearest first when the user's location is known (Discovery still returns
 * every match, just ordered by distance), otherwise soonest first.
 */
function sortParams(near?: NearLocation): Record<string, string> {
  if (near?.lat === undefined || near.lng === undefined) {
    return { sort: 'date,asc' };
  }
  return {
    geoPoint: geohash(near.lat, near.lng),
    unit: 'miles',
    sort: 'distance,asc',
  };
}

const SEGMENT_TO_CATEGORY: Record<string, TicketmasterEvent['category']> = {
  Music: 'party',
  Sports: 'sports',
  'Arts & Theatre': 'social',
  Film: 'social',
  Miscellaneous: 'other',
};

export class TicketmasterService {
  constructor(private app: FastifyInstance) {}

  get isConfigured() {
    return !!this.app.env.TICKETMASTER_API_KEY;
  }

  async search(query: SearchTicketmasterQuery) {
    const body = await this.request<TmSearchResponse>('/events.json', {
      keyword: query.keyword,
      city: query.city,
      countryCode: query.countryCode ?? COUNTRY_FILTER,
      ...sortParams(query),
      page: String(query.page),
      size: String(query.size),
      // Past events can't be meaningfully joined
      startDateTime: nowParam(),
    });
    return {
      events: (body._embedded?.events ?? []).map(toTicketmasterEvent),
      total: body.page?.totalElements ?? 0,
      page: body.page?.number ?? query.page,
      size: body.page?.size ?? query.size,
    };
  }

  async getById(id: string) {
    const event = await this.request<TmEvent>(
      `/events/${encodeURIComponent(id)}.json`,
      {}
    );
    return toTicketmasterEvent(event);
  }

  /** Turns a pasted Ticketmaster link into the event(s) it points at */
  async resolveUrl(
    url: string,
    near?: NearLocation
  ): Promise<TicketmasterUrlResolution> {
    const parsed = parseTicketmasterUrl(url);
    if (parsed && !isSupportedHost(url)) {
      throw Object.assign(
        new Error(
          'Only US and Canada Ticketmaster links are supported for now'
        ),
        { statusCode: 400 }
      );
    }
    if (!parsed) {
      throw Object.assign(
        new Error('Not a Ticketmaster event or artist link'),
        {
          statusCode: 400,
        }
      );
    }

    if (parsed.kind === 'artist') {
      return this.resolveArtist(parsed.urlId, parsed.tokens.join(' '), near);
    }

    // Already imported by someone: no API calls needed
    const [known] = await this.app.db
      .select({ providerEventId: externalEvents.providerEventId })
      .from(externalEvents)
      .where(
        and(
          eq(externalEvents.provider, 'ticketmaster'),
          eq(externalEvents.providerUrlId, parsed.urlId)
        )
      )
      .limit(1);
    if (known) {
      const event = await this.getById(known.providerEventId);
      return { kind: 'event', match: event, events: [event] };
    }

    const filters: Record<string, string | undefined> = {
      stateCode: parsed.stateCode ?? undefined,
      localStartDateTime: parsed.date
        ? `${parsed.date}T00:00:00,${parsed.date}T23:59:59`
        : undefined,
      startDateTime: parsed.date ? undefined : nowParam(),
      countryCode: COUNTRY_FILTER,
      ...sortParams(near),
      size: '50',
    };

    const seen = new Map<string, TicketmasterEvent>();
    for (const keyword of keywordCandidates(parsed.tokens)) {
      const body = await this.request<TmSearchResponse>('/events.json', {
        keyword,
        ...filters,
      });
      for (const e of (body._embedded?.events ?? []).map(toTicketmasterEvent)) {
        seen.set(e.id, e);
      }
      const match = [...seen.values()].find((e) => e.urlId === parsed.urlId);
      if (match) return { kind: 'event', match, events: [match] };
    }

    // Couldn't confirm; let the user pick from the closest results
    return { kind: 'event', match: null, events: [...seen.values()] };
  }

  private async resolveArtist(
    urlId: string,
    keyword: string,
    near?: NearLocation
  ): Promise<TicketmasterUrlResolution> {
    const body = await this.request<TmAttractionResponse>('/attractions.json', {
      keyword,
      size: '20',
    });
    const attractions = body._embedded?.attractions ?? [];
    const exact = attractions.find((a) => urlIdOf(a.url) === urlId);
    // Keyword search is fuzzy ("oasis" also returns tribute acts), so only
    // fall back to an attraction with exactly the slug's name
    const attraction =
      exact ?? attractions.find((a) => a.name.toLowerCase() === keyword);
    if (!attraction) return { kind: 'artist', attraction: null, events: [] };

    const events = await this.request<TmSearchResponse>('/events.json', {
      attractionId: attraction.id,
      countryCode: COUNTRY_FILTER,
      ...sortParams(near),
      size: '50',
      startDateTime: nowParam(),
    });
    return {
      kind: 'artist',
      attraction: {
        id: attraction.id,
        name: attraction.name,
        verified: !!exact,
      },
      events: (events._embedded?.events ?? []).map(toTicketmasterEvent),
    };
  }

  /**
   * Verifies the event with Ticketmaster and upserts it into external_events,
   * so every GatherUp event organized around it shares one row.
   */
  async importEvent(id: string) {
    const event = await this.getById(id);
    if (!SUPPORTED_COUNTRIES.some((c) => c === event.countryCode)) {
      throw Object.assign(
        new Error('Only US and Canada events are supported for now'),
        { statusCode: 400 }
      );
    }
    const values = {
      provider: 'ticketmaster' as const,
      providerEventId: event.id,
      providerUrlId: event.urlId,
      sourceUrl: event.url,
      title: event.name,
      startsAt: event.startTime ? new Date(event.startTime) : null,
      timezone: event.timezone,
      venueName: event.venueName,
      cityRegion: event.cityRegion,
      imageUrl: event.imageUrl,
      lastSyncedAt: new Date(),
    };
    const [row] = await this.app.db
      .insert(externalEvents)
      .values(values)
      .onConflictDoUpdate({
        target: [externalEvents.provider, externalEvents.providerEventId],
        set: values,
      })
      .returning({ id: externalEvents.id });
    return { externalEventId: row.id, event };
  }

  private async request<T>(
    path: string,
    params: Record<string, string | undefined>
  ): Promise<T> {
    const url = new URL(`${DISCOVERY_URL}${path}`);
    url.searchParams.set('apikey', this.app.env.TICKETMASTER_API_KEY!);
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value);
    }

    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) {
      this.app.log.warn(
        { status: response.status, path },
        'Ticketmaster request failed'
      );
      throw Object.assign(new Error('Ticketmaster request failed'), {
        statusCode:
          response.status === 404 ? 404 : response.status === 429 ? 429 : 502,
      });
    }
    return (await response.json()) as T;
  }
}

function nowParam() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function pickImage(images: TmImage[] = []) {
  // Prefer the widest 16:9 image for cover photos
  const wide = images
    .filter((i) => i.ratio === '16_9')
    .sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  return wide[0]?.url ?? images[0]?.url ?? null;
}

function toTicketmasterEvent(e: TmEvent): TicketmasterEvent {
  const venue = e._embedded?.venues?.[0];
  const classification = e.classifications?.[0];
  const segment = classification?.segment?.name ?? null;
  const price = e.priceRanges?.[0];
  const lat = venue?.location?.latitude;
  const lng = venue?.location?.longitude;
  const city = [
    venue?.city?.name,
    venue?.state?.stateCode ?? venue?.state?.name,
  ]
    .filter(Boolean)
    .join(', ');

  return {
    id: e.id,
    urlId: urlIdOf(e.url),
    name: e.name,
    url: e.url,
    startTime: e.dates?.start?.dateTime ?? null,
    localDate: e.dates?.start?.localDate ?? null,
    localTime: e.dates?.start?.localTime ?? null,
    timezone: e.dates?.timezone ?? venue?.timezone ?? null,
    venueName: venue?.name ?? null,
    address: venue?.address?.line1 ?? null,
    cityRegion: city || null,
    countryCode: venue?.country?.countryCode ?? null,
    latitude: lat ? Number(lat) : null,
    longitude: lng ? Number(lng) : null,
    imageUrl: pickImage(e.images),
    segment,
    genre: classification?.genre?.name ?? null,
    category: (segment && SEGMENT_TO_CATEGORY[segment]) || 'other',
    info: e.info ?? e.pleaseNote ?? null,
    priceMin: price?.min ?? null,
    priceMax: price?.max ?? null,
    currency: price?.currency ?? null,
    distanceMiles: e.distance ?? null,
  };
}
