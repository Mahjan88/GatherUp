# GatherUp - Quick Start Guide

## ✅ Setup Complete!

Your development environment is ready to go!

## 🔑 Your Local Credentials

### Supabase is Running
- **Studio (Database UI)**: http://127.0.0.1:54323
- **API URL**: http://127.0.0.1:54321
- **Database**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **Mailpit (Email Testing)**: http://127.0.0.1:54324

### Authentication Keys
- **Publishable Key**: `sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH`
- **Secret Key**: `sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz`

## 📁 Environment Files Created

✅ `apps/web/.env.local` - Web app configuration  
✅ `apps/mobile/.env` - Mobile app configuration  
✅ `.env` - Root configuration (for scripts)

## 🚀 Start Development

### Option 1: Run Everything at Once
```bash
pnpm dev
```

### Option 2: Run Apps Separately

**Web App:**
```bash
cd apps/web
pnpm dev
```
Then open: http://localhost:3000

**Mobile App:**
```bash
cd apps/mobile
pnpm dev
```
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code for physical device

## 🗄️ Database Management

### View Database in Supabase Studio
Open http://127.0.0.1:54323 in your browser

### Run Migrations (Already Applied!)
```bash
cd supabase
npx supabase db reset  # Reset and reapply all migrations
```

### Check Database Status
```bash
npx supabase status
```

### Stop Supabase
```bash
npx supabase stop
```

### Start Supabase (if stopped)
```bash
npx supabase start
```

## 📊 What's Already Set Up

### Database Tables
- ✅ `users` - User profiles
- ✅ `events` - Event information
- ✅ `event_members` - Event participants
- ✅ `event_messages` - Event chat messages
- ✅ `private_messages` - Direct messages
- ✅ `event_media` - Event photos/videos
- ✅ `notifications` - User notifications

### Storage Buckets
- ✅ `event-media` - Event photos and videos
- ✅ `avatars` - User profile pictures

### Security
- ✅ Row Level Security (RLS) policies enabled
- ✅ Authentication configured (email, OAuth ready)
- ✅ Real-time subscriptions enabled

## 🎯 First Steps

1. **Start the web app** to test the UI
2. **Create an account** - Sign up through the app
3. **Explore Supabase Studio** - View your data at http://127.0.0.1:54323
4. **Create an event** - Test the event creation flow
5. **Try the chat** - Test real-time messaging

## 📱 Testing on Physical Mobile Device

If testing on your phone:

1. Find your computer's local IP:
   ```bash
   ipconfig getifaddr en0   # macOS WiFi
   ifconfig                  # See all interfaces
   ```

2. Update `apps/mobile/.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=http://YOUR_LOCAL_IP:54321
   ```

3. Make sure your phone and computer are on the same WiFi network

## 🔧 Useful Commands

```bash
# Install dependencies
pnpm install

# Run all apps
pnpm dev

# Build all apps
pnpm build

# Type check
pnpm type-check

# Lint code
pnpm lint

# Format code
pnpm format

# Clean everything
pnpm clean
```

## 🐛 Troubleshooting

### Supabase won't start
```bash
# Stop and restart
npx supabase stop
npx supabase start
```

### Port already in use
```bash
# Check what's using the port
lsof -i :54321  # API port
lsof -i :54322  # Database port
lsof -i :54323  # Studio port

# Kill the process using the port
kill -9 <PID>
```

### Can't connect to database
1. Check Supabase is running: `npx supabase status`
2. Verify .env files have correct URLs
3. Restart the dev server

### Metro bundler issues (Mobile)
```bash
cd apps/mobile
npx expo start --clear
```

## 📚 Resources

- **Project README**: [README.md](README.md)
- **Setup Guide**: [SETUP.md](SETUP.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Git Guide**: [GIT_GUIDE.md](GIT_GUIDE.md)
- **Supabase Docs**: https://supabase.com/docs
- **Expo Docs**: https://docs.expo.dev
- **Next.js Docs**: https://nextjs.org/docs

## 🎉 You're Ready!

Everything is configured and ready for development. Start coding! 🚀

---

**Need Help?** Check the documentation or open an issue on GitHub.
