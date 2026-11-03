# GatherUp — Event Series, Community Follows & Home Page Redesign

## What We're Building

Three connected features that change how events are created, discovered, and followed:

1. **Dual identity hosting** — users create events as themselves or as a community
2. **Event Series** — recurring events grouped under one umbrella with subscriber notifications
3. **Community follows** — follow a community (not just a person) to see their events
4. **Home page sections** — Discover, For You, Invited

---

## Part 1: Schema Changes

### 1A. Add `organizer_type` to events table

**File:** `supabase/migrations/20240101000000_initial_schema.sql`
**Also:** `services/api/src/db/schema/events.ts`

Add two columns to the `events` table:

```sql
organizer_type TEXT NOT NULL DEFAULT 'user' CHECK (organizer_type IN ('user', 'community'))
```

**Why:** Right now an event has `host_id` (always a user) and optional `community_id`. But the UI needs to know: should it show the user's avatar and name on the event card, or the community's? This field makes that explicit. When `organizer_type = 'community'`, the event card displays the community's name/avatar. When `organizer_type = 'user'`, it shows the host's personal profile.

**Files to update after:**
- `packages/types/src/database.ts` — add to events Row/Insert/Update
- `packages/types/src/models.ts` — add `OrganizerType` union and add to `Event` interface
- `packages/shared/src/types/` — copy both files
- `services/api/src/modules/events/events.schema.ts` — add to createEventSchema

### 1B. Create `event_series` table

**File:** `supabase/migrations/20240101000000_initial_schema.sql`

```sql
CREATE TABLE public.event_series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_type TEXT NOT NULL DEFAULT 'user' CHECK (organizer_type IN ('user', 'community')),
  host_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  cover_image_url TEXT,
  category TEXT NOT NULL DEFAULT 'other' CHECK (category IN ('networking', 'party', 'workshop', 'conference', 'social', 'sports', 'other')),
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  recurrence_hint TEXT CHECK (recurrence_hint IN ('weekly', 'biweekly', 'monthly', 'custom')),
  settings JSONB NOT NULL DEFAULT '{}',
  subscriber_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Why:** This is the "umbrella" that groups recurring events. It holds the series name ("Badminton Sundays"), default category, and a subscriber count. `recurrence_hint` is advisory only — the host still manually creates each instance. This keeps things simple (no cron-style auto-generation) while communicating to subscribers what to expect.

The series itself has `organizer_type`, `host_id`, and `community_id` — same pattern as events — so a series can be owned by a person or a community.

**Don't forget:**
- Add `series_id UUID REFERENCES public.event_series(id) ON DELETE SET NULL` to the `events` table
- Add indexes: `idx_event_series_host_id`, `idx_event_series_community_id`, `idx_events_series_id`
- Add `updated_at` trigger
- Add RLS policies (same pattern as events: public series readable by all, private by subscribers)

### 1C. Create `event_series_subscriptions` table

**File:** `supabase/migrations/20240101000000_initial_schema.sql`

```sql
CREATE TABLE public.event_series_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  series_id UUID NOT NULL REFERENCES public.event_series(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  notify BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(series_id, user_id)
);
```

**Why:** Subscribing to a series is different from RSVP-ing to a single event. This table tracks who wants to be notified when a new instance is created. The `notify` boolean lets users stay subscribed (to see the series in their profile) without getting push notifications — a common UX pattern.

**Don't forget:**
- Index on `user_id` for "show me my subscriptions" queries
- Trigger to update `event_series.subscriber_count` (same pattern as community member_count)
- RLS: users can view their own subscriptions, insert/delete their own

### 1D. Create `community_follows` table

**File:** `supabase/migrations/20240101000000_initial_schema.sql`

```sql
CREATE TABLE public.community_follows (
  follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower_id, community_id)
);
```

**Why:** You already have `user_follows` for person-to-person follows. But if "Seattle Coffee Walks" is a community that hosts events, users should be able to follow the community itself. This feeds the "For You" section of the home page — events from communities you follow show up there.

**Don't forget:**
- Index on `community_id` (reverse lookup: who follows this community)
- RLS: anyone can view, users can insert/delete their own follows

### 1E. Drizzle Schema Files

Create new files in `services/api/src/db/schema/`:

| File | Export Name | Notes |
|------|-------------|-------|
| `event-series.ts` | `eventSeries` | References users, communities |
| `event-series-subscriptions.ts` | `eventSeriesSubscriptions` | References eventSeries, users |
| `community-follows.ts` | `communityFollows` | References users, communities. Composite PK like user_follows |

Update existing:
- `events.ts` — add `seriesId` and `organizerType` columns
- `index.ts` — add the three new exports

### 1F. TypeScript Types

**Files:** `packages/types/src/database.ts` and `packages/types/src/models.ts`

Add table definitions for `event_series`, `event_series_subscriptions`, `community_follows` to database.ts.

In models.ts add:
- `EventSeries`, `EventSeriesSubscription`, `CommunityFollow` row types
- `EventSeriesInsert`, `EventSeriesUpdate` etc.
- `OrganizerType = 'user' | 'community'`
- `EventSeriesWithHost` composed type (series + host user or community info)

**Remember:** copy both files to `packages/shared/src/types/` after editing.

---

## Part 2: API Layer

### 2A. Event Series module

Create a new Fastify module at `services/api/src/modules/event-series/`:

```
event-series/
  index.ts          — plugin export
  event-series.schema.ts   — Zod schemas
  event-series.service.ts  — business logic
  event-series.routes.ts   — route handlers
```

**Routes to implement:**

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/series` | Create a series (auth required) |
| GET | `/api/series` | List series (filterable by category, host) |
| GET | `/api/series/:id` | Get series details + recent instances |
| PUT | `/api/series/:id` | Update series (owner only) |
| DELETE | `/api/series/:id` | Delete series (owner only) |
| POST | `/api/series/:id/subscribe` | Subscribe to series (auth required) |
| DELETE | `/api/series/:id/subscribe` | Unsubscribe (auth required) |
| GET | `/api/series/:id/events` | List all event instances in this series |

**Key business logic in the service:**

When a new event is created with a `series_id`, the service should:
1. Verify the event creator is the series owner
2. After insert, look up all subscribers where `notify = true`
3. Create a notification for each subscriber (type: `new_series_event`)
4. The notification's `entity_type = 'event'`, `entity_id = <new event id>`, and `data` should include the series name

**Why a separate module:** Series have their own lifecycle (CRUD), their own subscription model, and their own notification triggers. Cramming this into the events module would make it bloated.

### 2B. Community Follows

This is small enough to add to the existing communities module (if you have one) or create a lightweight module.

**Routes:**

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/communities/:id/follow` | Follow a community |
| DELETE | `/api/communities/:id/follow` | Unfollow |
| GET | `/api/communities/:id/followers` | List followers |
| GET | `/api/users/me/following-communities` | Communities I follow |

### 2C. Update Events module

**File:** `services/api/src/modules/events/events.schema.ts`

Add to `createEventSchema`:
- `seriesId: z.string().uuid().nullable().optional()`
- `organizerType: z.enum(['user', 'community']).default('user')`

**File:** `services/api/src/modules/events/events.service.ts`

In the `create` method, after the event is inserted, if `seriesId` is present:
- Query `event_series_subscriptions` for that series where `notify = true`
- Bulk-insert notifications for each subscriber

Add a new `listForFeed` method that powers the "For You" section:
- Get user's followed users (`user_follows`)
- Get user's followed communities (`community_follows`)
- Get user's series subscriptions (`event_series_subscriptions`)
- Return events where: host is a followed user, OR community is a followed community, OR event belongs to a subscribed series

### 2D. Update API Client

**File:** `packages/api-client/src/events.ts`

Add `seriesId` and `organizerType` to the list params and create method types.

Create new file: `packages/api-client/src/series.ts` — `SeriesApi` class with methods matching the routes above.

Update `packages/api-client/src/index.ts` to export it.

---

## Part 3: Frontend — Home Page Sections

### 3A. Home Page Layout

**File:** `apps/web/app/(tabs)/index.tsx` (or wherever your home page lives)

The home page should have three tabs or sections:

**Discover** — public events from anyone
- Query: `GET /api/events?visibility=public&status=published`
- Shows event cards with host/community avatar, title, date, location
- This is for browsing — no auth required to view

**For You** — personalized feed (auth required)
- Query: new endpoint `GET /api/events/feed` that returns events from:
  - Users you follow
  - Communities you follow  
  - Series you're subscribed to (including pending RSVP cards)
- **Series event cards** have a special state (see 3B below)

**Invited** — private events you've been invited to
- Query: `GET /api/events/joined` filtered to `status = 'invited'`
- Or a new endpoint that specifically returns your pending invitations

### 3B. Series Subscription Card (the "dismissable action card")

This is a special variant of your EventCard component.

**File:** Create `apps/web/components/SeriesEventCard.tsx` (or modify existing EventCard)

**When it appears:** A new event instance is created in a series the user subscribes to, AND the user hasn't RSVP'd yet.

**What it looks like:**
- A label at the top: "New from [Series Name]" or "New from a series you follow"
- The normal event card info (title, date, location, host)
- Two action buttons at the bottom: "Going" and "Not this time"
- Visually distinct from regular cards — maybe a subtle highlighted border or background tint

**Behavior:**
- "Going" → calls `POST /api/events/:id/respond` with `status: 'joined'` → card becomes a normal event card in the feed
- "Not this time" → calls `POST /api/events/:id/respond` with `status: 'declined'` → card animates out and disappears
- If the user ignores it, it stays in their feed until they act on it or the event passes

**How to detect "pending series events":** The feed endpoint should return events with a flag like `seriesPending: true` when the event belongs to a subscribed series and the user hasn't responded yet. The frontend checks this flag to render the action card variant.

### 3C. Event Creation Flow

**File:** Your event creation form/modal

When creating an event, the user should see:

1. **"Creating as" selector** — shows their personal profile by default, with a dropdown to switch to any community they own/admin. This sets `organizer_type` and optionally `community_id`.

2. **"Part of a series" toggle** — if enabled, shows a dropdown of their existing series (or "Create new series"). This sets `series_id`. If creating a new series, a mini-form pops up for the series name/description before returning to the event form.

3. Everything else stays the same (title, date, location, visibility, etc.)

### 3D. Profile Pages

Users and communities both need a "Series" tab on their profile page showing the event series they host. Each series card shows the series name, subscriber count, and a "Subscribe" button.

When you tap into a series, you see the list of past and upcoming instances.

---

## Part 4: Notification Types to Add

Update the `NotificationType` union in `packages/types/src/models.ts`:

```typescript
| 'new_series_event'      // new instance in a series you subscribe to
| 'new_follower'          // someone followed you
| 'community_new_follower' // someone followed your community
```

---

## What's Already Done (by Claude)

The following have been implemented:

**Schema (SQL + Drizzle + TypeScript types):**
- `event_series` table — series umbrella with organizer_type, recurrence_hint, subscriber_count
- `event_series_subscriptions` table — who subscribes to which series, with notify toggle
- `community_follows` table — follow a community (separate from user_follows)
- `organizer_type` + `series_id` columns added to `events` table
- All RLS policies, indexes, and triggers (subscriber_count auto-update)
- Drizzle schemas: `event-series.ts`, `event-series-subscriptions.ts`, `community-follows.ts`
- TypeScript types in `database.ts` and `models.ts` (+ copied to packages/shared)
- API client: `SeriesApi` class + feed() method on EventsApi
- Zod schemas updated with `seriesId` + `organizerType`

**Navigation restructure:**
- Mobile: Tab bar is now Home / Discover / [+] / Messages / Profile
- Mobile: Notifications removed from tab bar, accessible via bell icon in Header
- Mobile: Header component has notification bell with unread badge
- Mobile: `discover.tsx` — search bar, category chips, popular pages, nearby events
- Mobile: `home.tsx` — personal feed with Series Updates, Invites, My Upcoming Events
- Web: Tab bar is now Home / Discover / Events / Messages + bell icon
- Web: `discover/page.tsx` — public event browsing with time/category filters
- Web: `page.tsx` (Home) — personal feed with My Upcoming / Invites / Series Updates tabs

## What Still Needs Implementation

1. **Event Series API module** — `services/api/src/modules/event-series/` (CRUD routes, subscribe/unsubscribe, service logic)
2. **Community Follows API routes** — follow/unfollow/list followers (add to existing communities module or new module)
3. **Feed endpoint** — `GET /api/events/feed` that queries user_follows + community_follows + event_series_subscriptions
4. **Series notification logic** — when event created with series_id, notify subscribers
5. **Event creation flow** — "Creating as" selector (personal vs community) + series picker
6. **Profile pages** — Series tab on user/community profiles
7. **Wire up TODO placeholders** — replace mock data in home/discover screens with real API calls

## Quick Reference: All New Files Created

```
services/api/src/db/schema/event-series.ts              ✅ done
services/api/src/db/schema/event-series-subscriptions.ts ✅ done
services/api/src/db/schema/community-follows.ts          ✅ done
packages/api-client/src/series.ts                        ✅ done
apps/mobile/app/(tabs)/discover.tsx                      ✅ done
apps/web/app/(tabs)/discover/page.tsx                    ✅ done
services/api/src/modules/event-series/index.ts           ⬜ todo
services/api/src/modules/event-series/event-series.schema.ts   ⬜ todo
services/api/src/modules/event-series/event-series.service.ts  ⬜ todo
services/api/src/modules/event-series/event-series.routes.ts   ⬜ todo
```

## Quick Reference: Files Modified

```
supabase/migrations/20240101000000_initial_schema.sql    ✅ new tables + columns + triggers
supabase/migrations/20240101000001_rls_policies.sql      ✅ RLS for new tables
services/api/src/db/schema/events.ts                     ✅ seriesId, organizerType
services/api/src/db/schema/index.ts                      ✅ new exports
services/api/src/modules/events/events.schema.ts         ✅ Zod: seriesId, organizerType
packages/types/src/database.ts                           ✅ new table types
packages/types/src/models.ts                             ✅ new model types + NotificationType
packages/shared/src/types/database.ts                    ✅ copied
packages/shared/src/types/models.ts                      ✅ copied
packages/api-client/src/events.ts                        ✅ feed() + seriesId param
packages/api-client/src/index.ts                         ✅ SeriesApi export
apps/mobile/app/(tabs)/_layout.tsx                       ✅ tab restructure
apps/mobile/app/(tabs)/home.tsx                          ✅ personal feed
apps/mobile/app/(tabs)/notifications.tsx                 ✅ back button added
apps/mobile/components/Header.tsx                        ✅ notification bell
apps/web/app/(tabs)/layout.tsx                           ✅ tab restructure + bell
apps/web/app/(tabs)/page.tsx                             ✅ personal home feed
```
