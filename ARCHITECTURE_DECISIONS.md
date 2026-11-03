# Architecture Decisions

This document captures design decisions, conventions, and application logic rules for GatherUp. Read this before making schema changes, building new features, or modifying existing patterns.

## Event Series — The Override Pattern

Both `event_series` and `events` carry overlapping fields: `host_id`, `community_id`, `category`, `visibility`. This is intentional.

**Rule: The event always owns its own data. The series provides defaults at creation time only.**

When creating a new event from a series, copy the series' current values into the event columns. Once an event is created, it's an immutable snapshot — changing the series category does NOT retroactively update past events. Future events pick up the new defaults when they're created.

This means:
- Never join through `event_series` to get an event's category/visibility — read it from the `events` row directly
- The API "create event from series" endpoint should copy `category`, `visibility`, `host_id`, `community_id` from the series into the new event
- `events.series_id` is a reference for grouping/navigation, not inheritance

## Organizer Type Pattern

`organizer_type` is an enum ('user' | 'community') on both `events` and `event_series`.

**Rule: `host_id` always equals the creating user. `organizer_type` + `community_id` determines presentation.**

- `organizer_type = 'user'`: the event/series is shown as hosted by the user personally
- `organizer_type = 'community'`: the event/series is shown as hosted by the community (avatar, name), but `host_id` is still the individual who created it
- `community_id` is set when `organizer_type = 'community'`, otherwise null

Never use `organizer_type` alone to determine ownership — always check `host_id` for authorization.

## Subscription vs. RSVP

`event_series_subscriptions` and `event_members` serve different purposes.

**Rule: Subscription = "notify me." RSVP = "I'm going."**

- Subscribing to a series does NOT auto-create `event_members` records
- When a new event is created under a series, send a `new_series_event` notification to subscribers
- Subscribers see the notification and decide individually whether to RSVP
- The home feed shows series updates as dismissable action cards ("Going" / "Not this time")

## Community Follows vs. Community Members

`community_follows` and `community_members` are separate tables serving different roles.

- **Followers** (community_follows): passive fans who want updates. The `notify` boolean controls whether they receive notifications about new series/events.
- **Members** (community_members): active participants with roles (owner/admin/member) and statuses (active/pending/banned/left/removed)

**Rule: Following a community does NOT make you a member, and membership does NOT auto-follow.**

When a community creates a new event series, notify followers who have `notify = true`. Members get notified through their membership separately.

## Soft Delete

`events` and `communities` use `deleted_at` timestamps instead of hard deletes. Messages (`event_message`, `private_message`) and media (`event_media`) also have `deleted_at`.

**Rules:**
- Always filter `WHERE deleted_at IS NULL` in read queries
- Partial indexes exist on soft-deletable tables (e.g., `idx_events_active`) that exclude deleted records — these are used automatically when the WHERE clause matches
- Soft-deleted records should be retained for audit/compliance purposes
- The `published_at` field on events tracks when an event moved from draft to published state

## Event Invitations

The `event_invitations` table supports inviting non-users via email, phone, or shareable link token.

**Rules:**
- `invited_user_id` is set when inviting an existing user
- `invited_email` / `invited_phone` is set when inviting by contact info (user may not exist yet)
- `token` is a unique shareable link identifier for open invitations
- At least one of `invited_user_id`, `invited_email`, or `invited_phone` should be present (enforced at application level, not DB constraint, to allow token-only invites)
- Status flow: `sent` -> `accepted` | `declined` | `expired` | `cancelled`
- Only event hosts can create invitations (enforced by RLS)

## Blocked Users & Reports

**Blocking:** Bidirectional effect — if A blocks B, both A and B should not see each other's content. The `blocked_users` table stores the direction (who initiated), but queries should check both directions.

**Reports:** Polymorphic via `target_type` ('user' | 'event' | 'community' | 'message' | 'media') + `target_id`. Status workflow: `open` -> `reviewed` | `dismissed` | `action_taken`. Only the reporter can see their own reports (RLS). Admin review is handled server-side.

## Message Reactions — Polymorphic Pattern

`message_reaction` uses `message_id` + `message_type` ('event' | 'private') without foreign keys, intentionally.

**Why no FK:** The table serves both `event_message` and `private_message`. PostgreSQL doesn't support conditional FKs. Splitting into two reaction tables was considered and rejected — the unique constraint `(message_id, message_type, user_id, emoji)` + the index on `(message_id, message_type)` keeps data integrity. Orphaned reactions from soft-deleted messages are harmless.

## Audit Log

The `audit_log` table tracks admin/management actions for accountability.

**When to write audit logs:**
- Community settings changes (name, visibility, category)
- Series settings changes
- Member role changes (promote/demote)
- Member removals/bans
- Event deletions/cancellations by non-host admins
- Report status changes

**Schema:** `actor_id` (who did it), `action` (string like 'community.update', 'member.ban'), `entity_type` + `entity_id` (what was affected), `metadata` JSONB (before/after values, reason, etc.)

## Denormalized Counters

`communities.member_count` and `event_series.subscriber_count` are denormalized counters maintained by database triggers.

**Rule: Never update these manually in application code.** The triggers on `community_members` and `event_series_subscriptions` handle increments/decrements automatically. If counts drift, recalculate from the source table.

## Type Sync Checklist

When adding or modifying any table, you must update all layers in this order:

1. `supabase/migrations/20240101000000_initial_schema.sql` — SQL table definition
2. `supabase/migrations/20240101000001_rls_policies.sql` — RLS policies
3. `services/api/src/db/schema/<table>.ts` — Drizzle schema
4. `services/api/src/db/schema/index.ts` — Export the new schema
5. `packages/types/src/database.ts` — Row/Insert/Update type definitions
6. `packages/types/src/models.ts` — Convenience row types and insert types
7. Copy both to shared: `cp packages/types/src/{database,models}.ts packages/shared/src/types/`

If adding a new API endpoint, also update:
8. `services/api/src/modules/<domain>/<domain>.schema.ts` — Zod validation
9. `services/api/src/modules/<domain>/<domain>.service.ts` — Business logic
10. `services/api/src/modules/<domain>/<domain>.routes.ts` — Route handlers
11. `packages/api-client/src/<domain>.ts` — Client method

## Recurrence (Future)

`event_series.recurrence_hint` is a simple enum ('weekly' | 'biweekly' | 'monthly' | 'custom'). For richer recurrence rules (e.g., "every 2nd Tuesday"), use the `settings` JSONB column on `event_series` rather than creating a separate `recurring_rules` table. The JSONB approach avoids a schema migration when requirements evolve.

## Navigation Conventions

- Notifications are NOT a tab on either platform. They're accessed via a bell icon in the header (Instagram-style) with an unread count badge.
- The Create button is a tab on mobile (center position) but handled differently on web.
- Home feed is personal (invites, series updates, my events). Discover is public (nearby events, popular pages).
