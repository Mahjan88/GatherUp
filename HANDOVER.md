# GatherUp Project Handover Summary

## Project Overview

**GatherUp** is a social event management app combining features from Telegram and Meetup. It allows users to create public/private events, invite friends, and manage event-specific message and gallery inboxes.

### Tech Stack

- **Monorepo**: pnpm workspace + Turborepo
- **Mobile**: React Native + Expo (iOS/Android)
- **Web**: Next.js 14+ (React + TypeScript)
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **UI**: NativeWind (mobile), Tailwind + shadcn/ui (web)
- **State management**: TanStack Query + Zustand
- **Navigation**: Expo Router (mobile), Next.js App Router (web)

---

## What's Been Completed

### 1. Project Structure Setup

- Monorepo initialized with pnpm workspaces
- Turborepo configuration (`turbo.json` updated to use `tasks` instead of deprecated `pipeline`)
- Git repository initialized with `.gitignore` and `.gitattributes`
- Project documentation created

### 2. Shared Package (`packages/shared/`)

- Database types generated from Supabase schema
- API functions created:
  - Authentication (`auth.ts`): signup, login, logout, profile management
  - Events CRUD (`events.ts`): create, read, update, delete, join, leave
  - Messages (`messages.ts`): event messages and private messages
  - Notifications (`notifications.ts`): create, mark as read, delete
  - Media (`media.ts`): upload, retrieve, delete media
- Supabase client initialization (`supabase.ts`)
- Custom hooks (`useAuth.ts`)
- Utility functions (date formatting)
- TypeScript compilation successful (added DOM lib for `File`/`Blob`/`URL` types)

### 3. Mobile App (`apps/mobile/`)

- Expo + React Native setup with file-based routing
- Screens implemented:
  - Authentication: `login.tsx`, `signup.tsx`
  - Bottom tabs: Home (`index.tsx`), Events (`events.tsx`), Notifications (`notifications.tsx`), Messages (`messages.tsx`)
  - Event management: `create-event.tsx`, `event/[id].tsx`, `gallery/[id].tsx`, `chat/[id].tsx`
  - Direct messaging: `dm/[userId].tsx`
- NativeWind (Tailwind) configured
- Components: `EventCard`, `LoadingScreen`, `EmptyState`
- Environment variables configured (`.env`)

### 4. Web App (`apps/web/`)

- Next.js 14+ with App Router
- Pages implemented (matching mobile structure)
- Tailwind CSS configured
- Components: `EventCard`, `LoadingSpinner`, `EmptyState`
- Providers setup with TanStack Query
- Environment variables configured (`.env.local`)

### 5. Supabase Backend

- Local development setup configured (`supabase/config.toml`)
- Database migrations created:
  - `20240101000000_initial_schema.sql`: Users, events, messages, media, notifications tables
  - `20240101000001_rls_policies.sql`: Row Level Security policies
  - `20240101000002_storage_buckets.sql`: Storage buckets for media
- Edge runtime disabled (was causing SSL certificate issues)

### 6. Documentation Created

- `README.md`: Project overview
- `SETUP.md`: Development setup guide
- `DEPLOYMENT.md`: Deployment guide
- `CONTRIBUTING.md`: Contribution guidelines
- `GIT_GUIDE.md`: Git workflow
- `QUICK_START.md`: Quick reference
- `PROJECT_SUMMARY.md`: Implementation summary
- `LICENSE`: MIT License

---

## What Still Needs to Be Done

### High Priority

1. **Fix package version warnings**
   - Update `@expo/vector-icons` to `~14.0.4`
   - Update `react-native` to `0.76.9`

2. **Test authentication flow**
   - Verify Supabase Auth integration works end-to-end
   - Test email/phone signup and login
   - Configure social providers (Google, Apple)
   - Add password reset functionality

3. **Implement real-time features**
   - Set up Supabase Realtime subscriptions for event messages
   - Add live updates for private messages
   - Real-time notification updates

4. **Add push notifications**
   - Configure Expo Notifications
   - Set up Supabase webhooks for notification triggers
   - Handle notification permissions

### Medium Priority

5. **Image upload & processing**
   - Implement media upload to Supabase Storage
   - Add image compression/optimization
   - Handle multiple image uploads for gallery
   - Add image preview and selection UI

6. **Maps integration**
   - Add location picker for event creation
   - Display event locations on maps
   - Add "near me" filtering

7. **Event invitation system**
   - Implement invite/accept/decline flow
   - Add approval system for public events (`requires_approval` flag)
   - Send notifications for invitations
   - Show pending invitations list

8. **Search & filtering**
   - Implement event search by title/description
   - Add filters (date range, location, type, visibility)
   - Implement Home page filters: All, Private, Public, Upcoming, Today, Tomorrow, This week

### Low Priority

9. **UI/UX enhancements**
   - Add loading states for async operations
   - Improve error handling and user feedback
   - Add smooth animations and transitions
   - Implement pull-to-refresh
   - Add skeleton loaders

10. **Testing**
   - Add unit tests for shared package functions
   - Add integration tests for API calls
   - Add E2E tests for critical user flows
   - Set up test coverage reporting

11. **Production deployment**
   - Set up Supabase Cloud project
   - Configure production environment variables
   - Deploy web app to Vercel
   - Set up custom domain
   - Submit mobile app to App Store/Play Store
   - Configure app signing and certificates

---

## Commands Reference

### Installation & Setup

```bash
# Navigate to project
cd /path/to/GatherUp

# Install dependencies (from root)
pnpm install

# Generate Supabase types (after schema changes)
supabase gen types typescript --local > packages/shared/src/types/database.generated.ts

# Build shared package (required before running apps)
pnpm build --filter=@gatherup/shared
```

### Start Development Servers

```bash
# IMPORTANT: Start Supabase first (must be running before apps)
supabase start

# Option 1: Start all services at once (from root)
pnpm dev

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
```

Supabase Studio (database UI): open `http://127.0.0.1:54323` in your browser.

---

## Important File Locations

### Configuration Files

- `/turbo.json`: Turborepo configuration
- `/pnpm-workspace.yaml`: Workspace definition
- `/supabase/config.toml`: Supabase local config (edge runtime disabled)
- `/.gitignore`: Git ignore rules
- `/.gitattributes`: Git attributes for line endings
- `/.prettierrc`: Code formatting config

### Environment Variables

**Important**: Do **not** commit real keys. The repository already ignores `.env*` files via `.gitignore`.

**Root** (`/.env`):

```bash
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<your-local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-local-service-role-key>
```

**Web App** (`/apps/web/.env.local`):

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-local-anon-key>
```

**Mobile App** (`/apps/mobile/.env`):

```bash
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-local-anon-key>
```

### Database Migrations

- `/supabase/migrations/20240101000000_initial_schema.sql`: Database schema
- `/supabase/migrations/20240101000001_rls_policies.sql`: Security policies
- `/supabase/migrations/20240101000002_storage_buckets.sql`: Storage setup

### Shared Package

- `/packages/shared/src/types/database.generated.ts`: Generated Supabase types (regenerate after schema changes)
- `/packages/shared/src/api/`: API functions
- `/packages/shared/src/types/models.ts`: TypeScript interfaces
- `/packages/shared/dist/`: Compiled output (created after build)

### App Entry Points

- `/apps/mobile/app/_layout.tsx`: Mobile app root layout
- `/apps/web/app/layout.tsx`: Web app root layout
- `/apps/web/app/providers.tsx`: Web app providers (TanStack Query, Supabase init)

---

## Environment Setup for a New Machine

### Prerequisites

1. **Node.js** (v18 or later)
   - Download from `https://nodejs.org/`
   - Check version: `node --version`

2. **pnpm**

```bash
npm install -g pnpm
```

3. **Supabase CLI**

See `https://supabase.com/docs/guides/cli` for installation options.

4. **For iOS development** (macOS only)
   - Install Xcode
   - Install Xcode Command Line Tools:

```bash
xcode-select --install
```

5. **For Android development**
   - Install Android Studio
   - Set up an Android Virtual Device (AVD)
   - Configure Android SDK paths in your environment

### Initial Setup Steps

```bash
# 1. Navigate to project (or clone from Git)
cd /path/to/GatherUp

# 2. Install all dependencies
pnpm install

# 3. Start Supabase (creates local database)
supabase start

# 4. Generate database types
supabase gen types typescript --local > packages/shared/src/types/database.generated.ts

# 5. Build shared package
pnpm build --filter=@gatherup/shared

# 6. Start development servers
pnpm dev
```

### Troubleshooting

**Problem**: Port already in use

```bash
lsof -i :8081
kill <PID>
```

**Problem**: Supabase won't start

```bash
supabase stop
supabase start
```

**Problem**: Module not found errors

```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
pnpm build --filter=@gatherup/shared
```

---

## Database Schema

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

- `avatars`: User profile pictures
- `event-covers`: Event cover images
- `event-media`: Event gallery photos/videos

---

## Notes

- The project uses file-based routing for both mobile (Expo Router) and web (Next.js App Router).
- The shared package must be built before apps can use it.
- Supabase local uses Docker containers (requires Docker running).
- Most screens/pages contain placeholder UI; business logic needs implementation.
- Database schema is in place; test RLS thoroughly before production.

---

**Last updated**: January 7, 2026

