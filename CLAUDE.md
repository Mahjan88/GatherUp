# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GatherUp is an event-based social platform (Meetup + Telegram). Users create/discover events, chat in real-time, send DMs, share photos/videos, and manage attendance. Cross-platform: web (Next.js), mobile (React Native/Expo), with a Fastify API backend and Supabase for database/auth/storage.

## Commands

```bash
# Install dependencies (from root)
pnpm install

# Development - all apps simultaneously
pnpm dev

# Development - individual apps
pnpm --filter @gatherup/web dev        # Next.js at localhost:3000
pnpm --filter @gatherup/mobile dev     # Expo Metro bundler
pnpm --filter @gatherup/api dev        # Fastify API at localhost:4000

# Build
pnpm build                              # Build all packages
pnpm --filter @gatherup/web build       # Build web only
pnpm --filter @gatherup/api build       # Build API only

# Type checking and linting
pnpm type-check                         # All packages
pnpm lint                               # All packages
pnpm format                             # Prettier across repo

# Supabase (requires Docker running)
cd supabase && supabase start           # Start local Supabase
cd supabase && supabase db reset        # Reset and reapply all migrations
cd supabase && supabase migration new <name>  # Create new migration

# Drizzle (in services/api/)
pnpm --filter @gatherup/api db:generate  # Generate Drizzle migrations
pnpm --filter @gatherup/api db:migrate   # Run Drizzle migrations
pnpm --filter @gatherup/api db:studio    # Open Drizzle Studio GUI
```

## Architecture

### Monorepo Layout (Turborepo + pnpm workspaces)

The dependency graph flows: `@gatherup/types` → `@gatherup/api-client` → `@gatherup/shared` → apps. Turborepo builds in this order via `^build`.

**`packages/types/`** — Shared TypeScript types and constants. Database schema types (generated from Supabase), domain model interfaces (Event, User, etc.), and enum-like constants. Zero runtime dependencies. Both frontend and backend import from here.

**`packages/api-client/`** — Thin HTTP client (`GatherUpClient`) wrapping fetch calls to the Fastify API. Domain-specific classes: `AuthApi`, `EventsApi`, `MessagesApi`, `MediaApi`, `NotificationsApi`. Frontends use this instead of calling the API directly.

**`packages/shared/`** — Legacy API layer that calls Supabase directly from the client. Contains `useAuth` hook, date utilities, and re-exports types. The web app currently uses this. Being migrated to use `@gatherup/api-client` instead.

**`services/api/`** — Fastify modular monolith. This is the backend API server. Domain modules are designed for future microservice extraction.

**`apps/web/`** — Next.js 15 with App Router. Uses `(auth)` and `(tabs)` route groups. Initializes Supabase in `app/providers.tsx`. Auth guard in `(tabs)/layout.tsx` redirects unauthenticated users.

**`apps/mobile/`** — React Native with Expo SDK 54 and Expo Router. Tab-based navigation. Mobile auth is currently stubbed with TODOs.

### API Service Architecture (`services/api/`)

Each domain module follows the pattern: **schema** (Zod validation) → **service** (Drizzle queries + business logic) → **routes** (Fastify handlers) → **index** (Fastify plugin export).

Modules: `auth`, `events`, `messaging`, `media`, `notifications`. Each registers under its own route prefix (e.g., `/api/events`). The `media` module registers `@fastify/multipart` for file uploads.

Plugins (cross-cutting): `cors` (reads CORS_ORIGIN env), `auth` (JWT verification using Supabase JWT secret, decorates `request.userId`), `realtime` (WebSocket for live subscriptions).

The Fastify instance is decorated with `env` (validated config) and `db` (Drizzle client). All services access these via `this.app.env` and `this.app.db`.

### Database

PostgreSQL via Supabase. 7 tables: `users`, `events`, `event_members`, `event_messages`, `private_messages`, `event_media`, `notifications`.

Two parallel schema definitions exist:
1. **Supabase migrations** (`supabase/migrations/`) — source of truth for the actual database schema. Includes RLS policies and storage bucket setup.
2. **Drizzle schema** (`services/api/src/db/schema/`) — TypeScript representation used by the API service for type-safe queries.

When changing the schema, update both: create a new Supabase migration AND update the corresponding Drizzle schema file. Also regenerate `packages/types/src/database.ts` if adding/changing columns.

Key relationships: `events.host_id` → `users.id`, `event_members` has unique constraint on `(event_id, user_id)`, all FKs cascade on delete. The `handle_new_user` trigger auto-creates a profile row when a Supabase auth user signs up. The `handle_new_event` trigger auto-adds the host as a joined member.

### Authentication Flow

Web: Supabase Auth client-side → session stored by supabase-js → `useAuth` hook provides user state.
API: Clients send Supabase JWT as Bearer token → `@fastify/jwt` verifies using the same JWT secret → `request.userId` set from `sub` claim. The `app.authenticate` preHandler is applied per-route.

### State Management

Server state: TanStack Query v5 (React Query) for fetching/caching.
Client state: Zustand v5 for UI state.
The web app initializes Supabase in `providers.tsx` at module load time.

## Code Conventions

- TypeScript strict mode everywhere
- Prettier: single quotes, trailing commas (es5), semicolons, 80 char width
- API functions in `packages/shared/src/api/` follow the pattern: get Supabase client → build query → throw on error → return data
- Backend services are classes that receive `FastifyInstance` in constructor
- Zod schemas validate all API inputs; types are inferred with `z.infer<>`
- Database columns use `snake_case`, TypeScript uses `camelCase` — Drizzle handles the mapping
- The API service uses ESM (`"type": "module"`) — all local imports need `.js` extensions

## Environment Variables

Web app: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (in `apps/web/.env.local`)
API service: see `services/api/.env.example` for full list — validated by Zod on startup
Supabase local: starts on ports 54321 (API), 54322 (DB), 54323 (Studio), 54324 (email testing)

## Known Issues

- Mobile app auth is stubbed (`isAuthenticated = false` in `_layout.tsx`); login/signup screens have TODO placeholders
- No test suite exists yet — no test runner configured
- `packages/shared` still calls Supabase directly; migration to `@gatherup/api-client` is in progress
- The `EventCard` mobile component is 444 lines and should be split into smaller sub-components
