-- Align schema with app Event model: structured address, RSVP, chat/media rules, agenda, tickets, feedback.
-- Extends visibility to invite_only (invite-only events; same access pattern as private in RLS).

ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_visibility_check;
ALTER TABLE public.events
  ADD CONSTRAINT events_visibility_check
  CHECK (visibility IN ('public', 'private', 'invite_only'));

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS city_region TEXT;

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'other';
ALTER TABLE public.events
  ADD CONSTRAINT events_category_check
  CHECK (category IN ('networking', 'party', 'workshop', 'conference', 'social', 'sports', 'other'));

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS gallery_for_attendees_only BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS show_address_to_invitees BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS allow_invite_others BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS guest_list_visibility TEXT NOT NULL DEFAULT 'everyone';
ALTER TABLE public.events
  ADD CONSTRAINT events_guest_list_visibility_check
  CHECK (guest_list_visibility IN ('everyone', 'attendees', 'hidden'));

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS rsvp_required BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS capacity_limit INTEGER;
ALTER TABLE public.events
  ADD CONSTRAINT events_capacity_limit_check
  CHECK (capacity_limit IS NULL OR capacity_limit > 0);

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS rsvp_option TEXT NOT NULL DEFAULT 'two-way';
ALTER TABLE public.events
  ADD CONSTRAINT events_rsvp_option_check
  CHECK (rsvp_option IN ('three-way', 'two-way'));

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS rsvp_deadline TIMESTAMPTZ;

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS chat_enabled BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS who_can_chat TEXT NOT NULL DEFAULT 'attendees';
ALTER TABLE public.events
  ADD CONSTRAINT events_who_can_chat_check
  CHECK (who_can_chat IN ('hosts', 'attendees'));

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS who_can_post_media TEXT NOT NULL DEFAULT 'attendees';
ALTER TABLE public.events
  ADD CONSTRAINT events_who_can_post_media_check
  CHECK (who_can_post_media IN ('hosts', 'attendees', 'everyone'));

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS who_can_upload TEXT NOT NULL DEFAULT 'attendees';
ALTER TABLE public.events
  ADD CONSTRAINT events_who_can_upload_check
  CHECK (who_can_upload IN ('attendees', 'hosts'));

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS reminder_24h BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS reminder_1h BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS has_agenda BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS agenda_items JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS what_to_bring TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS dress_code TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS accessibility_notes TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS age_restriction TEXT;

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS ticket_type TEXT NOT NULL DEFAULT 'free';
ALTER TABLE public.events
  ADD CONSTRAINT events_ticket_type_check
  CHECK (ticket_type IN ('free', 'paid'));

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS ticket_price NUMERIC(12, 2);
ALTER TABLE public.events
  ADD CONSTRAINT events_ticket_price_check
  CHECK (ticket_price IS NULL OR ticket_price >= 0);

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS cancellation_policy TEXT;

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS feedback_enabled BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS feedback_visibility TEXT NOT NULL DEFAULT 'attendees_only';
ALTER TABLE public.events
  ADD CONSTRAINT events_feedback_visibility_check
  CHECK (feedback_visibility IN ('public', 'attendees_only', 'host_only'));

CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);

-- Co-host role + per-member RSVP (three-way / going state)
ALTER TABLE public.event_members DROP CONSTRAINT IF EXISTS event_members_role_check;
ALTER TABLE public.event_members
  ADD CONSTRAINT event_members_role_check
  CHECK (role IN ('host', 'cohost', 'member'));

ALTER TABLE public.event_members ADD COLUMN IF NOT EXISTS rsvp_status TEXT NOT NULL DEFAULT 'none';
ALTER TABLE public.event_members
  ADD CONSTRAINT event_members_rsvp_status_check
  CHECK (rsvp_status IN ('none', 'interested', 'going'));
