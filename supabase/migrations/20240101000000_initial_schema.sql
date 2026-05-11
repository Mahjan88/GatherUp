-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  username TEXT UNIQUE CHECK (length(username) >= 3 AND username ~ '^[a-zA-Z0-9_]+$'),
  tagline TEXT,
  avatar_url TEXT,
  bio TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  user_data JSONB NOT NULL DEFAULT '{}',
  privacy_settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE
);

-- Create communities table
CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'other' CHECK (category IN ('networking', 'party', 'workshop', 'conference', 'social', 'sports', 'other')),
  cover_image_url TEXT,
  city TEXT,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  is_discoverable BOOLEAN NOT NULL DEFAULT true,
  member_count INTEGER NOT NULL DEFAULT 0,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create community_members table
CREATE TABLE public.community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'banned', 'left', 'removed')),
  invited_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- Create event_series table
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

-- Create event_series_subscriptions table
CREATE TABLE public.event_series_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  series_id UUID NOT NULL REFERENCES public.event_series(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  notify BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(series_id, user_id)
);

-- Create community_follows table
CREATE TABLE public.community_follows (
  follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  notify BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower_id, community_id)
);

-- Create blocked_users table
CREATE TABLE public.blocked_users (
  blocker_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_user_id),
  CHECK (blocker_id != blocked_user_id)
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('user', 'event', 'community', 'message', 'media')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'dismissed', 'action_taken')),
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL,
  series_id UUID REFERENCES public.event_series(id) ON DELETE SET NULL,
  organizer_type TEXT NOT NULL DEFAULT 'user' CHECK (organizer_type IN ('user', 'community')),
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  location TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  address TEXT,
  city_region TEXT,
  is_online BOOLEAN NOT NULL DEFAULT false,
  virtual_link TEXT,
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'invite_only')),
  category TEXT NOT NULL DEFAULT 'other' CHECK (category IN ('networking', 'party', 'workshop', 'conference', 'social', 'sports', 'other')),
  cover_image_url TEXT,
  capacity_limit INTEGER CHECK (capacity_limit IS NULL OR capacity_limit > 0),
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  CHECK (end_time IS NULL OR end_time > start_time)
);

-- Create event_invitations table (invite by email/phone/link)
CREATE TABLE public.event_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  invited_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  invited_email TEXT,
  invited_phone TEXT,
  invited_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'accepted', 'declined', 'expired', 'cancelled')),
  token TEXT UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (invited_user_id IS NOT NULL OR invited_email IS NOT NULL OR invited_phone IS NOT NULL)
);

-- Create saved_events table (bookmarks)
CREATE TABLE public.saved_events (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, event_id)
);

-- Create event_members table
CREATE TABLE public.event_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'pending', 'joined', 'declined', 'removed')),
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('host', 'cohost', 'member')),
  rsvp_status TEXT NOT NULL DEFAULT 'none' CHECK (rsvp_status IN ('none', 'interested', 'going')),
  invited_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  last_read_message_id UUID,
  muted_until TIMESTAMP WITH TIME ZONE,
  rsvp_at TIMESTAMP WITH TIME ZONE,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create event_message table
CREATE TABLE public.event_message (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'file', 'voice', 'system')),
  content TEXT,
  attachments JSONB,
  reply_to_message_id UUID REFERENCES public.event_message(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  edited_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  CHECK (content IS NOT NULL OR attachments IS NOT NULL)
);

-- Create private_message table
CREATE TABLE public.private_message (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'file', 'voice')),
  content TEXT,
  attachments JSONB,
  reply_to_message_id UUID REFERENCES public.private_message(id) ON DELETE SET NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  edited_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  CHECK (content IS NOT NULL OR attachments IS NOT NULL)
);

-- Create event_media table
CREATE TABLE public.event_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  uploader_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  caption TEXT,
  thumbnail_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create event_review table
CREATE TABLE public.event_review (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create message_reaction table
CREATE TABLE public.message_reaction (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('event', 'private')),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, message_type, user_id, emoji)
);

-- Create notification table
CREATE TABLE public.notification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  data JSONB NOT NULL DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_follows table
CREATE TABLE public.user_follows (
  follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Users
CREATE INDEX idx_users_city ON public.users(city);
CREATE INDEX idx_users_country ON public.users(country);
CREATE INDEX idx_users_last_active ON public.users(last_active_at DESC);

-- Communities
CREATE INDEX idx_communities_owner_id ON public.communities(owner_id);
CREATE INDEX idx_communities_category ON public.communities(category);
CREATE INDEX idx_communities_slug ON public.communities(slug) WHERE slug IS NOT NULL;
CREATE INDEX idx_communities_visibility ON public.communities(visibility);

-- Community members
CREATE INDEX idx_community_members_community_id ON public.community_members(community_id);
CREATE INDEX idx_community_members_user_id ON public.community_members(user_id);
CREATE INDEX idx_community_members_status ON public.community_members(status);

-- Events (discovery)
CREATE INDEX idx_events_host_id ON public.events(host_id);
CREATE INDEX idx_events_community_id ON public.events(community_id);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_events_start_time ON public.events(start_time);
CREATE INDEX idx_events_status_start_time ON public.events(status, start_time);
CREATE INDEX idx_events_visibility ON public.events(visibility);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_city_region ON public.events(city_region);

-- Event members
CREATE INDEX idx_event_members_event_id ON public.event_members(event_id);
CREATE INDEX idx_event_members_user_id ON public.event_members(user_id);
CREATE INDEX idx_event_members_status ON public.event_members(status);

-- Messages (optimized for chat loading and conversation lookup)
CREATE INDEX idx_event_message_event_created ON public.event_message(event_id, created_at DESC);
CREATE INDEX idx_private_message_conversation ON public.private_message(sender_id, recipient_id, created_at DESC);
CREATE INDEX idx_private_message_recipient_read ON public.private_message(recipient_id, read) WHERE read = false;

-- Event media
CREATE INDEX idx_event_media_event_id ON public.event_media(event_id);

-- Event reviews
CREATE INDEX idx_event_review_event_id ON public.event_review(event_id);

-- Message reactions
CREATE INDEX idx_message_reaction_message ON public.message_reaction(message_id, message_type);

-- Notifications (optimized for inbox query)
CREATE INDEX idx_notification_user_read_created ON public.notification(user_id, read, created_at DESC);
CREATE INDEX idx_notification_actor_id ON public.notification(actor_id) WHERE actor_id IS NOT NULL;

-- User follows (reverse lookup: who follows me)
CREATE INDEX idx_user_follows_following_id ON public.user_follows(following_id);

-- Event series
CREATE INDEX idx_event_series_host_id ON public.event_series(host_id);
CREATE INDEX idx_event_series_community_id ON public.event_series(community_id) WHERE community_id IS NOT NULL;
CREATE INDEX idx_event_series_slug ON public.event_series(slug) WHERE slug IS NOT NULL;

-- Event series subscriptions
CREATE INDEX idx_event_series_subscriptions_user_id ON public.event_series_subscriptions(user_id);
CREATE INDEX idx_event_series_subscriptions_series_id ON public.event_series_subscriptions(series_id);

-- Community follows
CREATE INDEX idx_community_follows_community_id ON public.community_follows(community_id);

-- Events series_id (find all instances in a series)
CREATE INDEX idx_events_series_id ON public.events(series_id) WHERE series_id IS NOT NULL;

-- Event invitations
CREATE INDEX idx_event_invitations_event_id ON public.event_invitations(event_id);
CREATE INDEX idx_event_invitations_invited_user_id ON public.event_invitations(invited_user_id) WHERE invited_user_id IS NOT NULL;
CREATE INDEX idx_event_invitations_token ON public.event_invitations(token) WHERE token IS NOT NULL;
CREATE INDEX idx_event_invitations_email ON public.event_invitations(invited_email) WHERE invited_email IS NOT NULL;

-- Saved events
CREATE INDEX idx_saved_events_event_id ON public.saved_events(event_id);

-- Blocked users (reverse lookup)
CREATE INDEX idx_blocked_users_blocked_id ON public.blocked_users(blocked_user_id);

-- Reports
CREATE INDEX idx_reports_reporter_id ON public.reports(reporter_id);
CREATE INDEX idx_reports_target ON public.reports(target_type, target_id);
CREATE INDEX idx_reports_status ON public.reports(status) WHERE status = 'open';

-- Soft delete partial indexes (exclude deleted records from common queries)
CREATE INDEX idx_events_active ON public.events(status, start_time) WHERE deleted_at IS NULL;
CREATE INDEX idx_communities_active ON public.communities(visibility) WHERE deleted_at IS NULL;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON public.communities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_members_updated_at BEFORE UPDATE ON public.community_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_members_updated_at BEFORE UPDATE ON public.event_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_series_updated_at BEFORE UPDATE ON public.event_series
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_invitations_updated_at BEFORE UPDATE ON public.event_invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, phone, first_name, last_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-add host as event member when event is created
CREATE OR REPLACE FUNCTION public.handle_new_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.event_members (event_id, user_id, status, role)
  VALUES (NEW.id, NEW.host_id, 'joined', 'host');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_event_created
  AFTER INSERT ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_event();

-- Auto-add owner as community member when community is created
CREATE OR REPLACE FUNCTION public.handle_new_community()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.community_members (community_id, user_id, role, status)
  VALUES (NEW.id, NEW.owner_id, 'owner', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_community_created
  AFTER INSERT ON public.communities
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_community();

-- Auto-update community member_count
CREATE OR REPLACE FUNCTION public.update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.communities SET member_count = (
      SELECT COUNT(*) FROM public.community_members
      WHERE community_id = NEW.community_id AND status = 'active'
    ) WHERE id = NEW.community_id;
  END IF;
  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.community_id != NEW.community_id) THEN
    UPDATE public.communities SET member_count = (
      SELECT COUNT(*) FROM public.community_members
      WHERE community_id = OLD.community_id AND status = 'active'
    ) WHERE id = OLD.community_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_community_member_change
  AFTER INSERT OR UPDATE OR DELETE ON public.community_members
  FOR EACH ROW EXECUTE FUNCTION public.update_community_member_count();

-- Auto-update event_series subscriber_count
CREATE OR REPLACE FUNCTION public.update_series_subscriber_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.event_series SET subscriber_count = (
      SELECT COUNT(*) FROM public.event_series_subscriptions
      WHERE series_id = NEW.series_id
    ) WHERE id = NEW.series_id;
  END IF;
  IF TG_OP = 'DELETE' THEN
    UPDATE public.event_series SET subscriber_count = (
      SELECT COUNT(*) FROM public.event_series_subscriptions
      WHERE series_id = OLD.series_id
    ) WHERE id = OLD.series_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_series_subscription_change
  AFTER INSERT OR DELETE ON public.event_series_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_series_subscriber_count();

-- Create audit_log table
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_log_entity ON public.audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_actor ON public.audit_log(actor_id);
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at);
