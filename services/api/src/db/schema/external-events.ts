import {
  pgTable,
  uuid,
  text,
  timestamp,
  unique,
  index,
} from 'drizzle-orm/pg-core';

export const externalEvents = pgTable(
  'external_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    provider: text('provider', { enum: ['ticketmaster'] }).notNull(),
    providerEventId: text('provider_event_id').notNull(),
    providerUrlId: text('provider_url_id'),
    sourceUrl: text('source_url').notNull(),
    title: text('title').notNull(),
    startsAt: timestamp('starts_at', { withTimezone: true }),
    timezone: text('timezone'),
    venueName: text('venue_name'),
    cityRegion: text('city_region'),
    imageUrl: text('image_url'),
    lastSyncedAt: timestamp('last_synced_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique().on(table.provider, table.providerEventId),
    index('idx_external_events_url_id').on(table.provider, table.providerUrlId),
  ]
);
