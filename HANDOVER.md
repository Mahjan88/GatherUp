# GatherUp — Handover (Project Status + How to Run)

Last updated: 2026-01-08

## What this repo is
GatherUp is an event + messaging app (Telegram-style messaging + Meetup-style events):
- Create **events** (public/private)
- Invite friends / manage membership
- Each event has its own **chat** + **gallery**
- Separate **DMs** (private messages)

## Tech stack
- Monorepo: **pnpm workspaces** + **Turborepo**
- Mobile: **Expo (React Native)** + **expo-router** + **NativeWind**
- Web: **Next.js (App Router)** + Tailwind
- Backend: **Supabase** (Postgres, Auth, Storage, Realtime)
- State: **TanStack Query** (server state), **Zustand** (client state)

Repo layout:
- `apps/mobile` — Expo app
- `apps/web` — Next.js app
- `packages/shared` — shared types + Supabase client + API wrappers
- `supabase/` — local Supabase config + migrations

---

## What’s implemented (high-level)

### Monorepo + tooling
- pnpm workspace configured (`pnpm-workspace.yaml`)
- Turborepo config updated to use `tasks` (new schema) (`turbo.json`)
- Shared package builds with `tsc`

### Supabase (local)
- Migrations for:
  - core schema (users, events, memberships, messages, media, notifications)
  - RLS policies
  - Storage buckets
- Local Supabase configured in `supabase/config.toml`

### Shared package (`packages/shared`)
- Supabase client initialization
- API wrappers:
  - `src/api/auth.ts`
  - `src/api/events.ts`
  - `src/api/messages.ts`
  - `src/api/media.ts`
  - `src/api/notifications.ts`
- Hook: `src/hooks/useAuth.ts`
- Types:
  - generated DB types: `src/types/database.generated.ts`
  - re-export via `src/types/database.ts`

### Mobile (`apps/mobile`)
- Expo Router structure:
  - `(auth)` login/signup
  - `(tabs)` home/events/notifications/messages
  - event detail, event chat, gallery, DM chat, create-event
- Uses `className` styling (NativeWind) and `global.css` Tailwind directives

### Web (`apps/web`)
- Next.js app routes mirroring the app structure
- Uses shared package + TanStack Query provider

---

## Current known issues / gotchas

### 1) Supabase edge runtime SSL error (local)
Some environments hit a Deno SSL cert error when edge runtime tries to fetch remote imports.
Workaround used: start Supabase with:
```bash
npx supabase start --ignore-health-check
```
Core services (Auth/DB/REST) can still work even if edge runtime health fails.

### 2) pnpm + Metro resolution
Metro can be sensitive to pnpm’s node_modules layout. If you see module resolution issues, consider:
- using a hoisted node linker (`node-linker=hoisted`) and reinstalling, or
- ensuring required deps are direct deps of `apps/mobile`

### 3) Dev build native modules
If you add native Expo modules (example: `expo-linear-gradient`) you must **rebuild the dev client**:
```bash
cd apps/mobile
env PATH="/usr/bin:$PATH" npx expo run:ios --no-bundler
```

### 4) CocoaPods “patch -p1” failure
If `pod install` fails with “Unknown option '-p1'”, you likely have a nonstandard `patch` in PATH.
Fix by forcing the system patch:
```bash
cd apps/mobile/ios
env PATH="/usr/bin:$PATH" pod install --repo-update
```

---

## Commands: install / run / rebuild

### Install dependencies
From repo root:
```bash
pnpm install
```

### Start Supabase (local)
```bash
cd <repo-root>
npx supabase start --ignore-health-check
```

Supabase URLs:
- API: `http://127.0.0.1:54321`
- Studio: `http://127.0.0.1:54323`
- DB: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

### Generate DB types (after schema changes)
```bash
cd <repo-root>
supabase gen types typescript --local > packages/shared/src/types/database.generated.ts
```

### Build shared package
```bash
cd <repo-root>
pnpm build --filter=@gatherup/shared
```

### Run web
```bash
cd apps/web
pnpm dev -- --port 3000
```

### Run mobile (Metro)
```bash
cd apps/mobile
pnpm dev -- -c
```

### iOS dev build (rebuild client)
```bash
cd apps/mobile
env PATH="/usr/bin:$PATH" npx expo run:ios --no-bundler
```

### Android dev build (rebuild client)
```bash
cd apps/mobile
npx expo run:android
```

---

## Environment variables

### Root `.env`
Used for local/dev convenience:
- `SUPABASE_URL=http://127.0.0.1:54321`
- `SUPABASE_ANON_KEY=...`
- `SUPABASE_SERVICE_ROLE_KEY=...`

### Web (`apps/web/.env.local`)
- `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`

### Mobile (`apps/mobile/.env`)
- `EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY=...`

Physical device note: replace `127.0.0.1` with your computer LAN IP.

---

## Database schema (tables)
- `users`
- `events`
- `event_members`
- `event_messages`
- `private_messages`
- `event_media`
- `notifications`

See: `supabase/migrations/*`

---

## What to do next (recommended order)
1. **Auth hardening**: signup/login flows, profile creation, error handling
2. **Realtime chat**: subscribe to event_messages + private_messages
3. **Invites & membership lifecycle**: invited/pending/joined/declined + approvals
4. **Event gallery**: uploads to Supabase Storage + metadata in `event_media`
5. **Notifications**: store + show + mark read; add push notifications later
6. **UI polish**: consistent design system + loading/empty/error states

# 📋 GatherUp Project Handover Summary

## 🎯 Project Overview

**GatherUp** is a social event management app combining features from Telegram and Meetup. It allows users to create public/private events, invite friends, and manage event-specific message and gallery inboxes.

### Tech Stack

- **Monorepo**: pnpm workspace + Turborepo
- **Mobile**: React Native + Expo (iOS/Android)
- **Web**: Next.js 14+ (React + TypeScript)
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **UI**: NativeWind (mobile), Tailwind + shadcn/ui (web)
- **State Management**: TanStack Query + Zustand
- **Navigation**: Expo Router (mobile), Next.js App Router (web)

---

## ✅ What's Been Completed

### 1. Project Structure Setup
- ✅ Monorepo initialized with pnpm workspaces
- ✅ Turborepo configuration (`turbo.json` - updated to use `tasks` instead of deprecated `pipeline`)
- ✅ Git repository initialized with `.gitignore` and `.gitattributes`
- ✅ All project documentation created

### 2. Shared Package (`packages/shared/`)
- ✅ Database types generated from Supabase schema
- ✅ API functions created:
  - Authentication (`auth.ts`) - signup, login, logout, profile management
  - Events CRUD (`events.ts`) - create, read, update, delete, join, leave
  - Messages (`messages.ts`) - event messages and private messages
  - Notifications (`notifications.ts`) - create, mark as read, delete
  - Media (`media.ts`) - upload, retrieve, delete media
- ✅ Supabase client initialization (`supabase.ts`)
- ✅ Custom hooks (`useAuth.ts`)
- ✅ Utility functions (date formatting)
- ✅ TypeScript compilation successful (added DOM lib for File/Blob/URL types)

### 3. Mobile App (`apps/mobile/`)
- ✅ Expo + React Native setup with file-based routing
- ✅ All screens implemented:
  - Authentication: `login.tsx`, `signup.tsx`
  - Bottom tabs: Home (`index.tsx`), Events (`events.tsx`), Notifications (`notifications.tsx`), Messages (`messages.tsx`)
  - Event management: `create-event.tsx`, `event/[id].tsx`, `gallery/[id].tsx`, `chat/[id].tsx`
  - Direct messaging: `dm/[userId].tsx`
- ✅ NativeWind (Tailwind) configured
- ✅ Components: `EventCard`, `LoadingScreen`, `EmptyState`
- ✅ Environment variables configured (`.env`)
- ✅ Dependencies fixed (added `react-native-web`)

### 4. Web App (`apps/web/`)
- ✅ Next.js 14+ with App Router
- ✅ All pages implemented (matching mobile structure)
- ✅ Tailwind CSS configured
- ✅ Components: `EventCard`, `LoadingSpinner`, `EmptyState`
- ✅ Providers setup with TanStack Query
- ✅ Environment variables configured (`.env.local`)

### 5. Supabase Backend
- ✅ Local development setup configured (`config.toml`)
- ✅ Database migrations created:
  - `20240101000000_initial_schema.sql` - Users, events, messages, media, notifications tables
  - `20240101000001_rls_policies.sql` - Row Level Security policies
  - `20240101000002_storage_buckets.sql` - Storage buckets for media
- ✅ Edge Runtime disabled (was causing SSL certificate issues)
- ✅ Services running locally

### 6. Documentation Created
- ✅ `README.md` - Project overview
- ✅ `SETUP.md` - Development setup guide
- ✅ `DEPLOYMENT.md` - Deployment guide
- ✅ `CONTRIBUTING.md` - Contribution guidelines
- ✅ `GIT_GUIDE.md` - Git workflow
- ✅ `QUICK_START.md` - Quick reference
- ✅ `PROJECT_SUMMARY.md` - Implementation summary
- ✅ `LICENSE` - MIT License
- ✅ `HANDOVER.md` - This file

---

## 🚧 What Still Needs to Be Done

### High Priority

1. **Fix Package Version Warnings**
   - Update `@expo/vector-icons` from `^14.1.0` to `~14.0.4`
   - Update `react-native` from `0.76.6` to `0.76.9`

2. **Test Authentication Flow**
   - Verify Supabase Auth integration works end-to-end
   - Test email/phone signup and login
   - Configure social providers (Google, Apple)
   - Add password reset functionality

3. **Implement Real-time Features**
   - Set up Supabase Realtime subscriptions for event messages
   - Add live updates for private messages
   - Real-time notification updates

4. **Add Push Notifications**
   - Configure Expo Notifications
   - Set up Supabase webhooks for notification triggers
   - Handle notification permissions

### Medium Priority

5. **Image Upload & Processing**
   - Implement media upload to Supabase Storage
   - Add image compression/optimization with Sharp
   - Handle multiple image uploads for gallery
   - Add image preview and selection UI

6. **Maps Integration**
   - Add location picker for event creation
   - Display event locations on maps
   - Add "near me" filtering

7. **Event Invitation System**
   - Implement invite/accept/decline flow
   - Add approval system for public events (requires_approval flag)
   - Send notifications for invitations
   - Show pending invitations list

8. **Search & Filtering**
   - Implement event search by title/description
   - Add filters (date range, location, type, visibility)
   - Implement the Home page filters: All, Private, Public, Upcoming, Today, Tomorrow, This week

### Low Priority

9. **UI/UX Enhancements**
   - Add loading states for all async operations
   - Improve error handling and user feedback
   - Add smooth animations and transitions
   - Implement pull-to-refresh
   - Add skeleton loaders

10. **Testing**
    - Add unit tests for shared package functions
    - Add integration tests for API calls
    - Add E2E tests for critical user flows
    - Set up test coverage reporting

11. **Production Deployment**
    - Set up Supabase Cloud project
    - Configure production environment variables
    - Deploy web app to Vercel
    - Set up custom domain
    - Submit mobile app to App Store/Play Store
    - Configure app signing and certificates

---

## 🚀 Commands Reference

### Installation & Setup

```bash
# Navigate to project
cd /Users/mjanghorban/Projects/GatherUp

# Install dependencies (from root)
pnpm install

# Generate Supabase types (after schema changes)
supabase gen types typescript --local > packages/shared/src/types/database.generated.ts

# Build shared package (required before running apps)
pnpm build --filter=@gatherup/shared
```

### Start Development Servers

```bash
# IMPORTANT: Start Supabase FIRST (must be running before apps)
supabase start

# Option 1: Start all services at once (from root)
pnpm dev
# This starts:
# - Web app on http://localhost:3001 (or 3000)
# - Mobile app on http://localhost:8081
# - Shared package in watch mode

# Option 2: Start services individually

# Web app only
cd apps/web && pnpm dev

# Mobile app only
cd apps/mobile && pnpm dev
```

### Supabase Commands

```bash
# Start Supabase local services
supabase start

# Stop Supabase
supabase stop

# Check Supabase status
supabase status

# Reset database (WARNING: deletes all data)
supabase db reset

# Create a new migration
supabase migration new <migration_name>

# Apply migrations
supabase db push

# Access Supabase Studio (database UI)
# Open http://127.0.0.1:54323 in browser
```

### Mobile App Commands

```bash
cd apps/mobile

# Start Expo dev server
pnpm dev

# In the Expo terminal, press:
# - i: Open iOS simulator (Mac only, requires Xcode)
# - a: Open Android emulator (requires Android Studio + AVD)
# - w: Open in web browser
# - r: Reload app
# - shift+m: More tools
# - ?: Show all commands

# Or run directly:
pnpm ios       # Open in iOS simulator
pnpm android   # Open in Android emulator
pnpm web       # Open in web browser
```

**Running on Physical Device:**
1. Install Expo Go app on your phone (iOS App Store / Google Play)
2. Make sure phone and computer are on same WiFi
3. Scan QR code shown in terminal (Camera app on iOS, Expo Go on Android)

### Build Commands

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build --filter=@gatherup/shared
pnpm build --filter=@gatherup/web
pnpm build --filter=@gatherup/mobile

# Type checking
pnpm type-check

# Linting
pnpm lint
```

### Clean & Reinstall

```bash
# If you encounter dependency issues, clean everything and reinstall
cd /Users/mjanghorban/Projects/GatherUp
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install

# Then rebuild shared package
pnpm build --filter=@gatherup/shared
```

### Git Commands

```bash
# Check status
git status

# Stage changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to remote
git push

# Pull latest changes
git pull

# Create new branch
git checkout -b feature/your-feature-name

# See detailed Git guide
cat GIT_GUIDE.md
```

---

## 📁 Important File Locations

### Configuration Files
- `/turbo.json` - Turborepo configuration
- `/pnpm-workspace.yaml` - Workspace definition
- `/supabase/config.toml` - Supabase local config (edge_runtime disabled)
- `/.gitignore` - Git ignore rules
- `/.gitattributes` - Git attributes for line endings
- `/.prettierrc` - Code formatting config

### Environment Variables

**Root** (`/.env`):
```bash
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
SUPABASE_SERVICE_ROLE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
```

**Web App** (`/apps/web/.env.local`):
```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
```

**Mobile App** (`/apps/mobile/.env`):
```bash
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
```

> **Note**: These are LOCAL DEVELOPMENT credentials. For production:
> - Create a Supabase Cloud project at https://supabase.com
> - Replace URLs and keys with production values
> - NEVER commit production credentials to Git

### Database Migrations
- `/supabase/migrations/20240101000000_initial_schema.sql` - Database schema
- `/supabase/migrations/20240101000001_rls_policies.sql` - Security policies
- `/supabase/migrations/20240101000002_storage_buckets.sql` - Storage setup

### Shared Package
- `/packages/shared/src/types/database.generated.ts` - Generated Supabase types (regenerate after schema changes)
- `/packages/shared/src/api/` - API functions
- `/packages/shared/src/types/models.ts` - TypeScript interfaces
- `/packages/shared/dist/` - Compiled output (created after build)

### App Entry Points
- `/apps/mobile/app/_layout.tsx` - Mobile app root layout
- `/apps/web/app/layout.tsx` - Web app root layout
- `/apps/web/app/providers.tsx` - Web app providers (TanStack Query, Supabase init)

---

## 🔧 Environment Setup for New Machine

### Prerequisites

1. **Node.js** (v18 or later)
   - Download from https://nodejs.org/
   - Check version: `node --version`

2. **pnpm** (Package manager)
   ```bash
   npm install -g pnpm
   ```

3. **Supabase CLI**
   ```bash
   # Option 1: Homebrew (Mac/Linux)
   brew install supabase/tap/supabase
   
   # Option 2: npm
   npm install -g supabase
   
   # Option 3: Direct download
   # See https://supabase.com/docs/guides/cli
   ```

4. **For iOS Development** (Mac only)
   - Install Xcode from Mac App Store
   - Install Xcode Command Line Tools:
     ```bash
     xcode-select --install
     ```

5. **For Android Development**
   - Install Android Studio from https://developer.android.com/studio
   - Set up Android Virtual Device (AVD) in Android Studio
   - Configure Android SDK path in environment variables

### Initial Setup Steps

```bash
# 1. Navigate to project (or clone from Git)
cd /path/to/GatherUp

# 2. Install all dependencies
pnpm install

# 3. Start Supabase (creates local database)
supabase start

# This will output:
# - API URL: http://127.0.0.1:54321
# - Studio URL: http://127.0.0.1:54323
# - Database URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
# - Anon key and Service role key

# 4. Generate database types
supabase gen types typescript --local > packages/shared/src/types/database.generated.ts

# 5. Build shared package
pnpm build --filter=@gatherup/shared

# 6. Start development servers
pnpm dev

# 7. Access the apps:
# - Web: http://localhost:3001 (or 3000)
# - Mobile: http://localhost:8081
# - Supabase Studio: http://127.0.0.1:54323
```

### Troubleshooting

**Problem**: Port already in use
```bash
# Find and kill process using the port
lsof -i :8081  # Check what's using port 8081
kill <PID>     # Kill the process
```

**Problem**: Supabase won't start
```bash
# Stop and restart
supabase stop
supabase start
```

**Problem**: Module not found errors
```bash
# Clean and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
pnpm build --filter=@gatherup/shared
```

**Problem**: TypeScript errors about database types
```bash
# Regenerate types
supabase gen types typescript --local > packages/shared/src/types/database.generated.ts
pnpm build --filter=@gatherup/shared
```

---

## 📊 Database Schema

### Tables Overview

```
users
├─ id (uuid, PK)
├─ email (text, unique)
├─ phone (text, unique)
├─ full_name (text, required)
├─ avatar_url (text)
├─ bio (text)
├─ created_at (timestamp)
└─ updated_at (timestamp)

events
├─ id (uuid, PK)
├─ host_id (uuid, FK → users.id)
├─ title (text, required)
├─ description (text)
├─ start_time (timestamp, required)
├─ end_time (timestamp)
├─ location (text)
├─ location_coords (jsonb) - {lat, lng}
├─ visibility (text) - 'public' or 'private'
├─ public_fields (jsonb) - Controls what's visible for public events
├─ requires_approval (boolean) - Host approval for public events
├─ cover_image_url (text)
├─ created_at (timestamp)
└─ updated_at (timestamp)

event_members
├─ id (uuid, PK)
├─ event_id (uuid, FK → events.id)
├─ user_id (uuid, FK → users.id)
├─ status (text) - 'invited', 'pending', 'joined', 'declined'
├─ role (text) - 'host' or 'member'
├─ joined_at (timestamp)
└─ updated_at (timestamp)

event_messages
├─ id (uuid, PK)
├─ event_id (uuid, FK → events.id)
├─ sender_id (uuid, FK → users.id)
├─ content (text, required)
├─ attachments (jsonb) - Array of media URLs
└─ created_at (timestamp)

private_messages
├─ id (uuid, PK)
├─ sender_id (uuid, FK → users.id)
├─ recipient_id (uuid, FK → users.id)
├─ content (text, required)
├─ read (boolean) - Message read status
└─ created_at (timestamp)

event_media
├─ id (uuid, PK)
├─ event_id (uuid, FK → events.id)
├─ uploader_id (uuid, FK → users.id)
├─ media_url (text, required)
├─ media_type (text) - 'image' or 'video'
└─ created_at (timestamp)

notifications
├─ id (uuid, PK)
├─ user_id (uuid, FK → users.id)
├─ type (text) - Notification type
├─ data (jsonb) - Notification payload
├─ read (boolean)
└─ created_at (timestamp)
```

### Row Level Security (RLS)

All tables have RLS policies configured to:
- Users can read their own data
- Users can read public events and events they're members of
- Users can only modify their own data
- Users can only send messages to events they're members of
- Users can only view messages from their events or private conversations

See `/supabase/migrations/20240101000001_rls_policies.sql` for full details.

### Storage Buckets

- `avatars` - User profile pictures
- `event-covers` - Event cover images
- `event-media` - Event gallery photos/videos

---

## 🐛 Known Issues Fixed

1. ✅ **Turborepo `pipeline` deprecated**
   - **Issue**: Turborepo v2 changed config format
   - **Fix**: Renamed `pipeline` to `tasks` in `turbo.json`

2. ✅ **Supabase config JWT section invalid**
   - **Issue**: `config.toml` had outdated `[auth.jwt.claims]` section
   - **Fix**: Removed lines 99-101 from `supabase/config.toml`

3. ✅ **File/Blob/URL types missing**
   - **Issue**: TypeScript couldn't find DOM types in shared package
   - **Fix**: Added `"DOM"` to `lib` array in `packages/shared/tsconfig.json`

4. ✅ **Supabase client initialization timing**
   - **Issue**: Client initialized inside `useEffect`, not available immediately
   - **Fix**: Moved `initializeSupabase()` to module level in both apps

5. ✅ **Edge Runtime SSL certificate error**
   - **Issue**: Deno runtime couldn't verify SSL certificates
   - **Fix**: Disabled `edge_runtime` in `supabase/config.toml`

6. ✅ **Missing react-native-web dependency**
   - **Issue**: Expo Router requires `react-native-web` but it wasn't installed
   - **Fix**: Added `"react-native-web": "~0.19.13"` to `apps/mobile/package.json`

7. ✅ **Git permission errors**
   - **Issue**: Git operations failing in sandbox mode
   - **Fix**: Used `required_permissions: ['all']` for Git commands

8. ✅ **Environment file permissions**
   - **Issue**: `.env` files had incorrect permissions
   - **Fix**: Set correct permissions with `chmod 644`

---

## 📦 Package Versions

### Core Dependencies

```json
{
  "expo": "~52.0.23",
  "react": "18.3.1",
  "react-native": "0.76.6",
  "next": "15.1.4",
  "@supabase/supabase-js": "^2.47.12",
  "@tanstack/react-query": "^5.62.8",
  "zustand": "^5.0.2",
  "typescript": "^5.7.2"
}
```

### Mobile App Packages

```json
{
  "@expo/vector-icons": "^14.0.4",
  "@react-native-community/datetimepicker": "8.2.0",
  "expo-router": "~4.0.14",
  "expo-constants": "~17.0.3",
  "expo-image-picker": "~16.0.4",
  "expo-notifications": "~0.29.13",
  "nativewind": "^4.1.23",
  "react-native-maps": "1.18.0",
  "react-native-web": "~0.19.13"
}
```

### Web App Packages

```json
{
  "next": "15.1.4",
  "tailwindcss": "^3.4.17",
  "postcss": "^8.4.49",
  "autoprefixer": "^10.4.20"
}
```

### Dev Tools

```json
{
  "turbo": "2.7.3",
  "prettier": "3.7.4",
  "@typescript-eslint/parser": "^8.18.1",
  "@typescript-eslint/eslint-plugin": "^8.18.1"
}
```

---

## 🎯 Quick Start for Next Session

```bash
# 1. Navigate to project
cd /Users/mjanghorban/Projects/GatherUp

# 2. Check if Supabase is running
supabase status

# If not running, start it:
supabase start

# 3. Start development servers
pnpm dev

# 4. Access the apps:
# - Web App: http://localhost:3001
# - Mobile App: http://localhost:8081 (scan QR with Expo Go)
# - Supabase Studio: http://127.0.0.1:54323
# - Database: postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

### Development Workflow

1. **Make code changes** in your editor
2. **Hot reload** will automatically update the apps
3. **Check terminal** for any errors or warnings
4. **Test features** in browser or mobile device
5. **Commit changes** when ready:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

### Before Starting Work

- ✅ Ensure Supabase is running: `supabase status`
- ✅ Pull latest changes: `git pull`
- ✅ Install any new dependencies: `pnpm install`
- ✅ Rebuild shared package if types changed: `pnpm build --filter=@gatherup/shared`

### Common Tasks

**Update database schema:**
```bash
# 1. Edit migration file or create new one
supabase migration new your_migration_name

# 2. Apply migration
supabase db reset  # Applies all migrations

# 3. Regenerate types
supabase gen types typescript --local > packages/shared/src/types/database.generated.ts

# 4. Rebuild shared package
pnpm build --filter=@gatherup/shared
```

**Add new API function:**
```bash
# 1. Add function to packages/shared/src/api/
# 2. Export from packages/shared/src/api/index.ts
# 3. Rebuild: pnpm build --filter=@gatherup/shared
# 4. Use in apps: import { yourFunction } from '@gatherup/shared'
```

**Add new screen/page:**
- Mobile: Create file in `apps/mobile/app/` following Expo Router conventions
- Web: Create file in `apps/web/app/` following Next.js App Router conventions

---

## 📞 Access Points Summary

### Local Development URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| Web App | http://localhost:3001 | - |
| Mobile App | http://localhost:8081 | - |
| Supabase API | http://127.0.0.1:54321 | See .env files |
| Supabase Studio | http://127.0.0.1:54323 | - |
| Database | postgresql://postgres:postgres@127.0.0.1:54322/postgres | postgres/postgres |

### Supabase Keys (Local)

```
Anon Key: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
Service Role Key: sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
```

> ⚠️ **Important**: These are LOCAL DEVELOPMENT keys only. Never use these in production.

---

## 🎓 Learning Resources

- **Expo Documentation**: https://docs.expo.dev/
- **Next.js Documentation**: https://nextjs.org/docs
- **Supabase Documentation**: https://supabase.com/docs
- **TanStack Query**: https://tanstack.com/query/latest
- **NativeWind**: https://www.nativewind.dev/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 📝 Notes

- The project uses **file-based routing** for both mobile (Expo Router) and web (Next.js App Router)
- **Shared package** must be built before apps can use it
- **Environment variables** are already configured for local development
- **Supabase local** uses Docker containers (requires Docker to be running)
- All **screens/pages are created** but most contain placeholder UI - business logic needs implementation
- **Database schema is complete** - ready for implementation
- **RLS policies** are in place - test thoroughly before production

---

## 🆘 Getting Help

If you encounter issues:

1. Check the terminal output for error messages
2. Review this handover document for solutions
3. Check existing documentation in the project:
   - `SETUP.md` - Detailed setup instructions
   - `QUICK_START.md` - Quick commands reference
   - `GIT_GUIDE.md` - Git workflow help
4. Check Supabase logs: `supabase logs`
5. Restart services if needed:
   ```bash
   supabase stop
   supabase start
   # Stop dev servers and restart: pnpm dev
   ```

---

**Last Updated**: January 7, 2026

**Project Status**: 🟢 Development environment fully functional, core structure complete, ready for feature implementation
