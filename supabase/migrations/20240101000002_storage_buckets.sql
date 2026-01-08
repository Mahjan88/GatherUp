-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('event-media', 'event-media', true),
  ('avatars', 'avatars', true);

-- Event media bucket policies
CREATE POLICY "Event members can upload media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'event-media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view event media" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-media');

CREATE POLICY "Users can delete their own event media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'event-media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Avatars bucket policies
CREATE POLICY "Users can upload their avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
