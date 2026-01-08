# GatherUp

![GatherUp Banner](https://via.placeholder.com/1200x300?text=GatherUp+-+Connect+Through+Events)

Event-based social platform combining the best features of Meetup and Telegram. Create events, chat with participants, share media, and build communities around shared experiences.

## ✨ Features

### Core Features

- 🎉 **Event Management**: Create, discover, and manage events with ease
- 💬 **Real-time Chat**: Event-specific group chats with live updates
- 📱 **Private Messaging**: Direct messaging between users
- 🖼️ **Event Galleries**: Share photos and videos from your events
- 🔔 **Smart Notifications**: Stay updated on event changes and messages
- 👥 **Member Management**: Invite friends, approve join requests, manage attendees

### Event Features

- **Public & Private Events**: Control who can see and join your events
- **Approval Workflow**: Require approval for public event join requests
- **Event Filters**: Find events by time (today, tomorrow, this week) and visibility
- **Location Support**: Add event locations with map integration
- **Event Details**: Title, description, cover images, start/end times
- **Member Count**: Track attendance and engagement

### Communication Features

- **Real-time Updates**: Instant message delivery with Supabase Realtime
- **Event Chat Rooms**: Dedicated chat for each event
- **Direct Messages**: Private one-on-one conversations
- **Typing Indicators**: See when others are typing
- **Message History**: Full searchable chat history

### Security & Privacy

- **Row Level Security**: Database-level security with Supabase RLS
- **Authentication**: Email, phone, Google, and Apple sign-in
- **Granular Permissions**: Control what's visible in public events
- **Secure Storage**: Encrypted media storage

## 🏗️ Tech Stack

### Frontend

- **Mobile**: React Native with Expo (iOS & Android)
- **Web**: Next.js 15 with App Router
- **UI Frameworks**: NativeWind (Tailwind for RN), Tailwind CSS
- **State Management**: TanStack Query (server state), Zustand (client state)
- **Navigation**: Expo Router (mobile), Next.js App Router (web)

### Backend

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with multiple providers
- **Real-time**: Supabase Realtime subscriptions
- **Storage**: Supabase Storage for media files
- **Security**: Row Level Security (RLS) policies

### Development

- **Language**: TypeScript
- **Monorepo**: Turborepo with pnpm workspaces
- **Code Quality**: ESLint, Prettier
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
gatherup/
├── apps/
│   ├── mobile/                 # React Native app (Expo)
│   │   ├── app/               # Expo Router screens
│   │   │   ├── (auth)/       # Auth screens (login, signup)
│   │   │   ├── (tabs)/       # Tab navigation screens
│   │   │   ├── event/[id].tsx # Event detail
│   │   │   ├── chat/[id].tsx  # Event chat
│   │   │   ├── dm/[userId].tsx # Direct messages
│   │   │   ├── gallery/[id].tsx # Event gallery
│   │   │   └── create-event.tsx
│   │   └── components/        # Mobile components
│   │
│   └── web/                   # Next.js web app
│       ├── app/
│       │   ├── (auth)/       # Auth pages
│       │   ├── (tabs)/       # Main app pages
│       │   └── providers.tsx  # React Query provider
│       └── components/        # Web components
│
├── packages/
│   └── shared/                # Shared code
│       ├── src/
│       │   ├── types/        # TypeScript types & DB schema
│       │   ├── api/          # Supabase API clients
│       │   ├── hooks/        # Shared React hooks
│       │   ├── utils/        # Utility functions
│       │   └── constants/    # App constants
│       └── package.json
│
├── supabase/
│   ├── migrations/           # Database migrations
│   │   ├── 20240101000000_initial_schema.sql
│   │   ├── 20240101000001_rls_policies.sql
│   │   └── 20240101000002_storage_buckets.sql
│   └── config.toml           # Supabase configuration
│
├── .github/
│   └── workflows/
│       └── ci.yml            # CI pipeline
│
├── package.json              # Root package.json
├── pnpm-workspace.yaml       # pnpm workspace config
├── turbo.json                # Turborepo config
├── SETUP.md                  # Setup instructions
├── DEPLOYMENT.md             # Deployment guide
└── CONTRIBUTING.md           # Contributing guidelines
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for local Supabase)
- Supabase CLI
- Expo CLI (for mobile development)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/gatherup.git
cd gatherup
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Setup Supabase**

```bash
# Start local Supabase (requires Docker)
cd supabase
supabase start

# This will output your local credentials:
# API URL: http://localhost:54321
# anon key: eyJh...
```

4. **Configure environment variables**

```bash
# Copy example env files
cp .env.example .env
cp apps/mobile/.env.example apps/mobile/.env
cp apps/web/.env.local.example apps/web/.env.local

# Edit with your Supabase credentials
```

5. **Start development servers**

```bash
# Run all apps
pnpm dev

# Or run individually:
cd apps/mobile && pnpm dev  # Mobile
cd apps/web && pnpm dev     # Web
```

### First Time Setup

See [SETUP.md](SETUP.md) for detailed setup instructions.

## 📱 Development

### Running the Apps

**Mobile (Expo):**
```bash
cd apps/mobile
pnpm dev           # Start Metro bundler
pnpm ios           # Run on iOS simulator
pnpm android       # Run on Android emulator
```

**Web (Next.js):**
```bash
cd apps/web
pnpm dev           # Start dev server at localhost:3000
pnpm build         # Production build
pnpm start         # Start production server
```

### Available Scripts

```bash
pnpm dev           # Start all apps in dev mode
pnpm build         # Build all apps
pnpm lint          # Lint all packages
pnpm type-check    # Type check all packages
pnpm format        # Format code with Prettier
pnpm clean         # Clean all build artifacts
```

### Database Migrations

```bash
cd supabase

# Create new migration
supabase migration new migration_name

# Apply migrations locally
supabase db reset

# Push to cloud
supabase db push
```

## 🧪 Testing

```bash
# Run tests (when implemented)
pnpm test

# Type check
pnpm type-check

# Lint
pnpm lint
```

## 📦 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions.

**Quick Deploy:**

- **Web**: Deploy to Vercel with one click
- **Mobile**: Use Expo EAS for builds and submissions
- **Database**: Use Supabase Cloud for production

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend platform
- [Expo](https://expo.dev) for React Native tooling
- [Next.js](https://nextjs.org) for the web framework
- [Turborepo](https://turbo.build) for monorepo management

## 📞 Support

- 📧 Email: support@gatherup.example
- 💬 Discord: [Join our community](https://discord.gg/example)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/gatherup/issues)

## 🗺️ Roadmap

- [ ] Event categories and tags
- [ ] Advanced search and filters
- [ ] Calendar integration (Google, Apple)
- [ ] Map view for discovering nearby events
- [ ] Event recommendations
- [ ] User profiles and customization
- [ ] Event reviews and ratings
- [ ] Recurring events
- [ ] Event analytics for hosts
- [ ] In-app purchases for premium features

---

Made with ❤️ by the GatherUp team
