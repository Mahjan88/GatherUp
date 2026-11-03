-- External events (e.g. Ticketmaster) that GatherUp events can be organized
-- around. One row per provider event, shared by every GatherUp event linked
-- to it. Rows are written only by the API service (service role / direct DB
-- connection) after verifying the event with the provider.

CREATE TABLE public.external_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL CHECK (provider IN ('ticketmaster')),
  -- Discovery API id, e.g. 1kAYvP7_GA25ajZ
  provider_event_id TEXT NOT NULL,
  -- id in the public event URL, e.g. 170065119F2C9700 (differs from the API id)
  provider_url_id TEXT,
  source_url TEXT NOT NULL,
  title TEXT NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE,
  timezone TEXT,
  venue_name TEXT,
  city_region TEXT,
  image_url TEXT,
  last_synced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (provider, provider_event_id)
);

CREATE INDEX idx_external_events_url_id
  ON public.external_events (provider, provider_url_id);

ALTER TABLE public.events
  ADD COLUMN external_event_id UUID
  REFERENCES public.external_events(id) ON DELETE SET NULL;

CREATE INDEX idx_events_external_event_id ON public.events (external_event_id);

-- Provider metadata is public; clients never write it directly
ALTER TABLE public.external_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view external events" ON public.external_events
  FOR SELECT USING (true);
