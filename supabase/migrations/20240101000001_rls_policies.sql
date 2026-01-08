-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view all profiles" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

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

-- Event messages table policies
CREATE POLICY "Event members can view messages" ON public.event_messages
  FOR SELECT USING (
    event_id IN (
      SELECT event_id FROM public.event_members
      WHERE user_id = auth.uid() AND status = 'joined'
    )
  );

CREATE POLICY "Event members can send messages" ON public.event_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND event_id IN (
      SELECT event_id FROM public.event_members
      WHERE user_id = auth.uid() AND status = 'joined'
    )
  );

CREATE POLICY "Users can delete their own messages" ON public.event_messages
  FOR DELETE USING (sender_id = auth.uid());

-- Private messages table policies
CREATE POLICY "Users can view their messages" ON public.private_messages
  FOR SELECT USING (
    sender_id = auth.uid() OR recipient_id = auth.uid()
  );

CREATE POLICY "Users can send messages" ON public.private_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update messages they received" ON public.private_messages
  FOR UPDATE USING (recipient_id = auth.uid());

CREATE POLICY "Users can delete messages they sent" ON public.private_messages
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

-- Notifications table policies
CREATE POLICY "Users can view their notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete their notifications" ON public.notifications
  FOR DELETE USING (user_id = auth.uid());
