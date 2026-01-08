# GatherUp Deployment Guide

## Prerequisites

- Supabase project (cloud or self-hosted)
- Vercel account (for web app)
- Expo EAS account (for mobile app)
- Domain name (optional)

## Supabase Cloud Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details
4. Wait for project provisioning

### 2. Run Migrations

```bash
# Link your project
supabase link --project-ref your-project-ref

# Push migrations to cloud
supabase db push

# Verify tables are created
supabase db remote list
```

### 3. Configure Authentication

1. Go to Authentication > Providers
2. Enable Email provider
3. Configure SMTP settings for email verification (optional)
4. Enable OAuth providers (Google, Apple, etc.)
   - Add OAuth credentials
   - Configure redirect URLs

### 4. Setup Storage Buckets

```sql
-- Verify buckets are created
SELECT * FROM storage.buckets;
```

Buckets should include:
- `event-media` (public)
- `avatars` (public)

## Web App Deployment (Vercel)

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select the `apps/web` directory as root

### 2. Configure Build Settings

```
Framework Preset: Next.js
Build Command: cd ../.. && pnpm install && pnpm build --filter=@gatherup/web
Output Directory: apps/web/.next
Install Command: pnpm install
```

### 3. Environment Variables

Add these environment variables in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Deploy

Click "Deploy" and wait for build to complete.

### 5. Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Mobile App Deployment (Expo EAS)

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login to Expo

```bash
eas login
```

### 3. Configure EAS

```bash
cd apps/mobile
eas build:configure
```

### 4. Create Build Configuration

Create `apps/mobile/eas.json`:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "your_supabase_url",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your_supabase_key"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 5. Build for iOS

```bash
# Build for iOS App Store
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

### 6. Build for Android

```bash
# Build for Google Play Store
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

## Environment-Specific Configuration

### Development

```bash
# Web
cd apps/web
cp .env.local.example .env.local
# Edit .env.local with development credentials

# Mobile
cd apps/mobile
cp .env.example .env
# Edit .env with development credentials
```

### Production

Use environment variables from your deployment platform:
- Vercel for web app
- EAS secrets for mobile app

## Post-Deployment Checklist

- [ ] Verify database migrations are applied
- [ ] Test authentication flow
- [ ] Check real-time messaging works
- [ ] Test file uploads to storage buckets
- [ ] Verify push notifications (mobile)
- [ ] Test OAuth providers
- [ ] Check RLS policies are working
- [ ] Monitor Supabase usage and quotas
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Configure analytics (optional)

## Monitoring & Maintenance

### Supabase

- Monitor database performance
- Check storage usage
- Review authentication logs
- Monitor API usage

### Vercel

- Check deployment logs
- Monitor function execution
- Review analytics

### Expo

- Check app crashes
- Monitor OTA update adoption
- Review user feedback

## Troubleshooting

### Build Failures

**Web:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

**Mobile:**
```bash
# Clear Expo cache
expo start --clear
```

### Database Issues

```bash
# Reset database (CAUTION: This deletes all data)
supabase db reset

# Check migration status
supabase migration list
```

### Authentication Issues

- Verify redirect URLs in Supabase dashboard
- Check OAuth provider credentials
- Ensure SMTP settings are correct

## Rollback Strategy

### Web App

Vercel automatically keeps previous deployments:
1. Go to Deployments tab
2. Find the previous working deployment
3. Click "Promote to Production"

### Mobile App

Use Expo OTA updates for quick fixes:
```bash
eas update --branch production --message "Rollback to previous version"
```

For major rollbacks, submit a new app version through app stores.

## Cost Optimization

- Monitor Supabase database size
- Implement pagination for large queries
- Optimize storage usage (compress images)
- Use CDN for static assets
- Cache API responses where appropriate
- Set up database connection pooling

## Security Best Practices

- Enable 2FA for all service accounts
- Rotate API keys regularly
- Review RLS policies periodically
- Monitor for suspicious activity
- Keep dependencies up to date
- Implement rate limiting
- Use HTTPS everywhere
- Sanitize user inputs

## Support & Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Expo Documentation](https://docs.expo.dev)
- [Next.js Documentation](https://nextjs.org/docs)
