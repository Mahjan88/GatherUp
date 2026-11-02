-- Fix RLS policies that reference each other (events <-> event_members,
-- communities <-> community_members, event_series <-> subscriptions).
-- Postgres raises "infinite recursion detected in policy" for those, so
-- membership checks now go through SECURITY DEFINER helpers that bypass RLS.

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_event_host(p_event_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.events
    WHERE id = p_event_id AND host_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.has_event_membership(
  p_event_id UUID,
  p_statuses TEXT[]
)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.event_members
    WHERE event_id = p_event_id
      AND user_id = auth.uid()
      AND status = ANY (p_statuses)
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.can_view_event(p_event_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = p_event_id
      AND (
        e.visibility = 'public'
        OR e.host_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.event_members m
          WHERE m.event_id = e.id
            AND m.user_id = auth.uid()
            AND m.status IN ('invited', 'joined')
        )
      )
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.is_community_admin(p_community_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.community_members
    WHERE community_id = p_community_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
      AND status = 'active'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.can_view_community(p_community_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.communities c
    WHERE c.id = p_community_id
      AND (
        c.visibility = 'public'
        OR c.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.community_members m
          WHERE m.community_id = c.id
            AND m.user_id = auth.uid()
            AND m.status = 'active'
        )
      )
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.is_series_host(p_series_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.event_series
    WHERE id = p_series_id AND host_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '';

-- ============================================================
-- COMMUNITIES
-- ============================================================

DROP POLICY "Users can view public communities" ON public.communities;
CREATE POLICY "Users can view public communities" ON public.communities
  FOR SELECT USING (public.can_view_community(id));

DROP POLICY "Users can view community members" ON public.community_members;
CREATE POLICY "Users can view community members" ON public.community_members
  FOR SELECT USING (public.can_view_community(community_id));

DROP POLICY "Owners/admins can add members" ON public.community_members;
CREATE POLICY "Owners/admins can add members" ON public.community_members
  FOR INSERT WITH CHECK (public.is_community_admin(community_id));

DROP POLICY "Owners/admins can update member statuses" ON public.community_members;
CREATE POLICY "Owners/admins can update member statuses" ON public.community_members
  FOR UPDATE USING (public.is_community_admin(community_id));

DROP POLICY "Owners can remove members" ON public.community_members;
CREATE POLICY "Owners can remove members" ON public.community_members
  FOR DELETE USING (public.is_community_admin(community_id));

-- ============================================================
-- EVENTS AND EVENT MEMBERS
-- ============================================================

DROP POLICY "Users can view public events" ON public.events;
CREATE POLICY "Users can view public events" ON public.events
  FOR SELECT USING (public.can_view_event(id));

DROP POLICY "Users can view event members if they have access to event" ON public.event_members;
CREATE POLICY "Users can view event members if they have access to event" ON public.event_members
  FOR SELECT USING (public.can_view_event(event_id));

DROP POLICY "Hosts can invite members" ON public.event_members;
CREATE POLICY "Hosts can invite members" ON public.event_members
  FOR INSERT WITH CHECK (public.is_event_host(event_id));

DROP POLICY "Users can request to join public events" ON public.event_members;
CREATE POLICY "Users can request to join public events" ON public.event_members
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND status = 'pending'
    AND role = 'member'
    AND EXISTS (
      SELECT 1 FROM public.events
      WHERE id = event_id AND visibility = 'public'
    )
  );

DROP POLICY "Hosts can update member statuses" ON public.event_members;
CREATE POLICY "Hosts can update member statuses" ON public.event_members
  FOR UPDATE USING (public.is_event_host(event_id));

DROP POLICY "Hosts can remove members" ON public.event_members;
CREATE POLICY "Hosts can remove members" ON public.event_members
  FOR DELETE USING (public.is_event_host(event_id));

-- ============================================================
-- EVENT MESSAGES, MEDIA, REVIEWS
-- ============================================================

DROP POLICY "Event members can view messages" ON public.event_message;
CREATE POLICY "Event members can view messages" ON public.event_message
  FOR SELECT USING (public.has_event_membership(event_id, ARRAY['joined']));

DROP POLICY "Event members can send messages" ON public.event_message;
CREATE POLICY "Event members can send messages" ON public.event_message
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND public.has_event_membership(event_id, ARRAY['joined'])
  );

DROP POLICY "Event members can view media" ON public.event_media;
CREATE POLICY "Event members can view media" ON public.event_media
  FOR SELECT USING (public.has_event_membership(event_id, ARRAY['joined']));

DROP POLICY "Event members can upload media" ON public.event_media;
CREATE POLICY "Event members can upload media" ON public.event_media
  FOR INSERT WITH CHECK (
    uploader_id = auth.uid()
    AND public.has_event_membership(event_id, ARRAY['joined'])
  );

DROP POLICY "Hosts can delete any event media" ON public.event_media;
CREATE POLICY "Hosts can delete any event media" ON public.event_media
  FOR DELETE USING (public.is_event_host(event_id));

DROP POLICY "Users can view reviews for accessible events" ON public.event_review;
CREATE POLICY "Users can view reviews for accessible events" ON public.event_review
  FOR SELECT USING (public.can_view_event(event_id));

DROP POLICY "Attendees can create reviews" ON public.event_review;
CREATE POLICY "Attendees can create reviews" ON public.event_review
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND public.has_event_membership(event_id, ARRAY['joined'])
  );

-- ============================================================
-- EVENT SERIES
-- ============================================================

DROP POLICY "Anyone can view public series" ON public.event_series;
CREATE POLICY "Anyone can view public series" ON public.event_series
  FOR SELECT USING (
    visibility = 'public'
    OR host_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.event_series_subscriptions s
      WHERE s.series_id = event_series.id AND s.user_id = auth.uid()
    )
  );

DROP POLICY "Series owners can view subscribers" ON public.event_series_subscriptions;
CREATE POLICY "Series owners can view subscribers" ON public.event_series_subscriptions
  FOR SELECT USING (public.is_series_host(series_id));

-- ============================================================
-- EVENT INVITATIONS
-- ============================================================

DROP POLICY "Inviters and invitees can view invitations" ON public.event_invitations;
CREATE POLICY "Inviters and invitees can view invitations" ON public.event_invitations
  FOR SELECT USING (
    invited_by = auth.uid()
    OR invited_user_id = auth.uid()
    OR public.is_event_host(event_id)
  );

DROP POLICY "Event hosts can create invitations" ON public.event_invitations;
CREATE POLICY "Event hosts can create invitations" ON public.event_invitations
  FOR INSERT WITH CHECK (
    invited_by = auth.uid()
    AND public.is_event_host(event_id)
  );

DROP POLICY "Hosts can cancel invitations" ON public.event_invitations;
CREATE POLICY "Hosts can cancel invitations" ON public.event_invitations
  FOR UPDATE USING (public.is_event_host(event_id));

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

-- Clients may only create notifications they are the actor of; the API
-- (service role / direct connection) bypasses RLS for system notifications.
DROP POLICY "System can create notifications" ON public.notification;
CREATE POLICY "Users can create notifications as actor" ON public.notification
  FOR INSERT WITH CHECK (actor_id = auth.uid());

-- ============================================================
-- SELF-UPDATE GUARDS
-- ============================================================

-- "Users can update their own membership" policies have no WITH CHECK, so
-- without these a member could promote themselves to host/owner or approve
-- their own join request. Requests with no JWT (API, service role) skip this.
CREATE OR REPLACE FUNCTION public.guard_event_member_self_update()
RETURNS TRIGGER AS $$
BEGIN
  IF auth.uid() IS NULL OR public.is_event_host(OLD.event_id) THEN
    RETURN NEW;
  END IF;
  IF NEW.event_id != OLD.event_id OR NEW.user_id != OLD.user_id
    OR NEW.role != OLD.role THEN
    RAISE EXCEPTION 'Only the host can change membership role';
  END IF;
  IF NEW.status != OLD.status
    AND NOT (
      (OLD.status = 'invited' AND NEW.status IN ('joined', 'declined'))
      OR (OLD.status IN ('joined', 'pending') AND NEW.status = 'declined')
    ) THEN
    RAISE EXCEPTION 'Invalid membership status change';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER guard_event_member_self_update
  BEFORE UPDATE ON public.event_members
  FOR EACH ROW EXECUTE FUNCTION public.guard_event_member_self_update();

CREATE OR REPLACE FUNCTION public.guard_community_member_self_update()
RETURNS TRIGGER AS $$
BEGIN
  IF auth.uid() IS NULL OR public.is_community_admin(OLD.community_id) THEN
    RETURN NEW;
  END IF;
  IF NEW.community_id != OLD.community_id OR NEW.user_id != OLD.user_id
    OR NEW.role != OLD.role THEN
    RAISE EXCEPTION 'Only owners/admins can change membership role';
  END IF;
  IF NEW.status != OLD.status AND NEW.status != 'left' THEN
    RAISE EXCEPTION 'Invalid membership status change';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER guard_community_member_self_update
  BEFORE UPDATE ON public.community_members
  FOR EACH ROW EXECUTE FUNCTION public.guard_community_member_self_update();

-- ============================================================
-- SIGNUP TRIGGER
-- ============================================================

-- Pin search_path (SECURITY DEFINER best practice) and store empty
-- email/phone from phone- or email-only signups as NULL so the UNIQUE
-- constraints don't collide on ''.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, phone, first_name, last_name, avatar_url)
  VALUES (
    NEW.id,
    NULLIF(NEW.email, ''),
    NULLIF(NEW.phone, ''),
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
