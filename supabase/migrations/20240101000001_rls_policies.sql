-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_message ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_message ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_review ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view all profiles" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Communities table policies
CREATE POLICY "Users can view public communities" ON public.communities
  FOR SELECT USING (
    visibility = 'public'
    OR owner_id = auth.uid()
    OR id IN (
      SELECT community_id FROM public.community_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can create communities" ON public.communities
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their communities" ON public.communities
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their communities" ON public.communities
  FOR DELETE USING (auth.uid() = owner_id);

-- Community members table policies
CREATE POLICY "Users can view community members" ON public.community_members
  FOR SELECT USING (
    community_id IN (
      SELECT id FROM public.communities
      WHERE visibility = 'public'
        OR owner_id = auth.uid()
        OR id IN (
          SELECT community_id FROM public.community_members
          WHERE user_id = auth.uid() AND status = 'active'
        )
    )
  );

CREATE POLICY "Users can request to join communities" ON public.community_members
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND status = 'pending'
  );

CREATE POLICY "Owners/admins can add members" ON public.community_members
  FOR INSERT WITH CHECK (
    community_id IN (
      SELECT community_id FROM public.community_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND status = 'active'
    )
  );

CREATE POLICY "Users can update their own membership" ON public.community_members
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Owners/admins can update member statuses" ON public.community_members
  FOR UPDATE USING (
    community_id IN (
      SELECT community_id FROM public.community_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND status = 'active'
    )
  );

CREATE POLICY "Users can leave communities" ON public.community_members
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Owners can remove members" ON public.community_members
  FOR DELETE USING (
    community_id IN (
      SELECT id FROM public.communities WHERE owner_id = auth.uid()
    )
  );

-- Events table policies
CREATE POLICY "Users can view public events" ON public.events
  FOR SELECT USING (
    visibility = 'public'
    OR host_id = auth.uid()
    OR id IN (
      SELECT event_id FROM public.event_members
      WHERE user_id = auth.uid() AND status IN ('invited', 'joined')
    )
  );

CREATE POLICY "Users can create events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their events" ON public.events
  FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their events" ON public.events
  FOR DELETE USING (auth.uid() = host_id);

-- Event members table policies
CREATE POLICY "Users can view event members if they have access to event" ON public.event_members
  FOR SELECT USING (
    event_id IN (
      SELECT id FROM public.events
      WHERE visibility = 'public'
        OR host_id = auth.uid()
        OR id IN (
          SELECT event_id FROM public.event_members
          WHERE user_id = auth.uid() AND status IN ('invited', 'joined')
        )
    )
  );

CREATE POLICY "Hosts can invite members" ON public.event_members
  FOR INSERT WITH CHECK (
    event_id IN (
      SELECT id FROM public.events WHERE host_id = auth.uid()
    )
  );

CREATE POLICY "Users can request to join public events" ON public.event_members
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND status = 'pending'
    AND event_id IN (
      SELECT id FROM public.events WHERE visibility = 'public'
    )
  );

CREATE POLICY "Users can update their own membership status" ON public.event_members
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Hosts can update member statuses" ON public.event_members
  FOR UPDATE USING (
    event_id IN (
      SELECT id FROM public.events WHERE host_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own membership" ON public.event_members
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Hosts can remove members" ON public.event_members
  FOR DELETE USING (
    event_id IN (
      SELECT id FROM public.events WHERE host_id = auth.uid()
    )
  );

-- Event message table policies
CREATE POLICY "Event members can view messages" ON public.event_message
  FOR SELECT USING (
    event_id IN (
      SELECT event_id FROM public.event_members
      WHERE user_id = auth.uid() AND status = 'joined'
    )
  );

CREATE POLICY "Event members can send messages" ON public.event_message
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND event_id IN (
      SELECT event_id FROM public.event_members
      WHERE user_id = auth.uid() AND status = 'joined'
    )
  );

CREATE POLICY "Users can update their own messages" ON public.event_message
  FOR UPDATE USING (sender_id = auth.uid());

CREATE POLICY "Users can delete their own messages" ON public.event_message
  FOR DELETE USING (sender_id = auth.uid());

-- Private message table policies
CREATE POLICY "Users can view their messages" ON public.private_message
  FOR SELECT USING (
    sender_id = auth.uid() OR recipient_id = auth.uid()
  );

CREATE POLICY "Users can send messages" ON public.private_message
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update messages they received" ON public.private_message
  FOR UPDATE USING (recipient_id = auth.uid());

CREATE POLICY "Senders can update their own messages" ON public.private_message
  FOR UPDATE USING (sender_id = auth.uid());

CREATE POLICY "Users can delete messages they sent" ON public.private_message
  FOR DELETE USING (sender_id = auth.uid());

-- Event media table policies
CREATE POLICY "Event members can view media" ON public.event_media
  FOR SELECT USING (
    event_id IN (
      SELECT event_id FROM public.event_members
      WHERE user_id = auth.uid() AND status = 'joined'
    )
  );

CREATE POLICY "Event members can upload media" ON public.event_media
  FOR INSERT WITH CHECK (
    uploader_id = auth.uid()
    AND event_id IN (
      SELECT event_id FROM public.event_members
      WHERE user_id = auth.uid() AND status = 'joined'
    )
  );

CREATE POLICY "Users can delete their own media" ON public.event_media
  FOR DELETE USING (uploader_id = auth.uid());

CREATE POLICY "Hosts can delete any event media" ON public.event_media
  FOR DELETE USING (
    event_id IN (
      SELECT id FROM public.events WHERE host_id = auth.uid()
    )
  );

-- Event review table policies
CREATE POLICY "Users can view reviews for accessible events" ON public.event_review
  FOR SELECT USING (
    event_id IN (
      SELECT id FROM public.events
      WHERE visibility = 'public'
        OR host_id = auth.uid()
        OR id IN (
          SELECT event_id FROM public.event_members
          WHERE user_id = auth.uid() AND status = 'joined'
        )
    )
  );

CREATE POLICY "Attendees can create reviews" ON public.event_review
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND event_id IN (
      SELECT event_id FROM public.event_members
      WHERE user_id = auth.uid() AND status = 'joined'
    )
  );

CREATE POLICY "Users can update their own reviews" ON public.event_review
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reviews" ON public.event_review
  FOR DELETE USING (user_id = auth.uid());

-- Message reaction table policies
CREATE POLICY "Users can view reactions on accessible messages" ON public.message_reaction
  FOR SELECT USING (true);

CREATE POLICY "Users can add reactions" ON public.message_reaction
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove their own reactions" ON public.message_reaction
  FOR DELETE USING (user_id = auth.uid());

-- Notification table policies
CREATE POLICY "Users can view their notifications" ON public.notification
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON public.notification
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON public.notification
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete their notifications" ON public.notification
  FOR DELETE USING (user_id = auth.uid());

-- Event series table policies
ALTER TABLE public.event_series ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public series" ON public.event_series
  FOR SELECT USING (
    visibility = 'public'
    OR host_id = auth.uid()
    OR id IN (
      SELECT series_id FROM public.event_series_subscriptions
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create series" ON public.event_series
  FOR INSERT WITH CHECK (host_id = auth.uid());

CREATE POLICY "Owners can update their series" ON public.event_series
  FOR UPDATE USING (host_id = auth.uid());

CREATE POLICY "Owners can delete their series" ON public.event_series
  FOR DELETE USING (host_id = auth.uid());

-- Event series subscriptions table policies
ALTER TABLE public.event_series_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their subscriptions" ON public.event_series_subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Series owners can view subscribers" ON public.event_series_subscriptions
  FOR SELECT USING (
    series_id IN (
      SELECT id FROM public.event_series WHERE host_id = auth.uid()
    )
  );

CREATE POLICY "Users can subscribe to series" ON public.event_series_subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unsubscribe" ON public.event_series_subscriptions
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can update their subscription" ON public.event_series_subscriptions
  FOR UPDATE USING (user_id = auth.uid());

-- Community follows table policies
ALTER TABLE public.community_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view community follows" ON public.community_follows
  FOR SELECT USING (true);

CREATE POLICY "Users can follow communities" ON public.community_follows
  FOR INSERT WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Users can unfollow communities" ON public.community_follows
  FOR DELETE USING (follower_id = auth.uid());

-- Event invitations table policies
ALTER TABLE public.event_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inviters and invitees can view invitations" ON public.event_invitations
  FOR SELECT USING (
    invited_by = auth.uid()
    OR invited_user_id = auth.uid()
    OR event_id IN (
      SELECT id FROM public.events WHERE host_id = auth.uid()
    )
  );

CREATE POLICY "Event hosts can create invitations" ON public.event_invitations
  FOR INSERT WITH CHECK (
    invited_by = auth.uid()
    AND event_id IN (
      SELECT id FROM public.events WHERE host_id = auth.uid()
    )
  );

CREATE POLICY "Invitees can update their invitation" ON public.event_invitations
  FOR UPDATE USING (invited_user_id = auth.uid());

CREATE POLICY "Hosts can cancel invitations" ON public.event_invitations
  FOR UPDATE USING (
    event_id IN (
      SELECT id FROM public.events WHERE host_id = auth.uid()
    )
  );

-- Saved events table policies
ALTER TABLE public.saved_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their saved events" ON public.saved_events
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can save events" ON public.saved_events
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unsave events" ON public.saved_events
  FOR DELETE USING (user_id = auth.uid());

-- Blocked users table policies
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their blocks" ON public.blocked_users
  FOR SELECT USING (blocker_id = auth.uid());

CREATE POLICY "Users can block others" ON public.blocked_users
  FOR INSERT WITH CHECK (blocker_id = auth.uid());

CREATE POLICY "Users can unblock others" ON public.blocked_users
  FOR DELETE USING (blocker_id = auth.uid());

-- Reports table policies
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports" ON public.reports
  FOR SELECT USING (reporter_id = auth.uid());

CREATE POLICY "Users can create reports" ON public.reports
  FOR INSERT WITH CHECK (reporter_id = auth.uid());

-- User follows table policies
CREATE POLICY "Anyone can view follows" ON public.user_follows
  FOR SELECT USING (true);

CREATE POLICY "Users can follow others" ON public.user_follows
  FOR INSERT WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Users can unfollow" ON public.user_follows
  FOR DELETE USING (follower_id = auth.uid());

-- Audit log table policies
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view audit logs for their entities" ON public.audit_log
  FOR SELECT USING (actor_id = auth.uid());

CREATE POLICY "System can create audit logs" ON public.audit_log
  FOR INSERT WITH CHECK (true);
