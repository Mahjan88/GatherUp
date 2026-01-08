# GatherUp Setup Guide

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for local Supabase)
- Supabase CLI

## Installation Steps

### 1. Install Dependencies

```bash
# Install pnpm if you haven't
npm install -g pnpm

# Install all dependencies
pnpm install
```

### 2. Set Up Supabase

#### Option A: Local Development (Recommended for development)

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Start Supabase locally (requires Docker)
cd supabase
supabase start

# This will output your local Supabase URL and anon key
# Copy these to your .env files
```

#### Option B: Cloud Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your project URL and anon key from Project Settings > API
3. Copy the values to your `.env` files

### 3. Configure Environment Variables

```bash
# Copy example env files
cp .env.example .env
cp apps/mobile/.env.example apps/mobile/.env
cp apps/web/.env.local.example apps/web/.env.local

# Edit the files with your Supabase credentials
```

### 4. Run Database Migrations

```bash
cd supabase

# For local development
supabase db reset

# For cloud (after linking your project)
supabase link --project-ref your-project-ref
supabase db push
```

### 5. Start Development Servers

```bash
# Run all apps in development mode
pnpm dev

# Or run individually:
# Mobile app
cd apps/mobile && pnpm dev

# Web app
cd apps/web && pnpm dev
```

## Mobile App Setup

### iOS

```bash
cd apps/mobile

# Install iOS dependencies
npx pod-install

# Run on iOS simulator
pnpm ios
```

### Android

```bash
cd apps/mobile

# Run on Android emulator
pnpm android
```

## Project Structure

```
gatherup/
├── apps/
│   ├── mobile/          # React Native (Expo) app
│   └── web/             # Next.js web app
├── packages/
│   └── shared/          # Shared TypeScript code
├── supabase/
│   ├── migrations/      # Database migrations
│   └── config.toml      # Supabase config
└── README.md
```

## Available Scripts

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all packages
- `pnpm type-check` - Type check all packages
- `pnpm clean` - Clean all build artifacts

## Troubleshooting

### Supabase Connection Issues

- Make sure Docker is running for local Supabase
- Verify your environment variables are correct
- Check that Supabase is running: `supabase status`

### Mobile App Issues

- Clear Metro bundler cache: `pnpm --filter @gatherup/mobile start --clear`
- For iOS: Clean build folder in Xcode
- For Android: `cd android && ./gradlew clean`

### Dependency Issues

- Delete all node_modules: `pnpm clean`
- Clear pnpm cache: `pnpm store prune`
- Reinstall: `pnpm install`

## Next Steps

1. Configure OAuth providers in Supabase Dashboard
2. Set up Twilio for SMS authentication (optional)
3. Configure push notifications with Expo
4. Deploy to production (Vercel for web, EAS for mobile)

## Support

For issues and questions, please check the documentation or open an issue on GitHub.
