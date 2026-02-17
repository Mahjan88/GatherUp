import { getSupabase } from './supabase';
import { EventMediaInsert } from '../types';

export async function uploadEventMedia(
  eventId: string,
  file: File | Blob,
  fileName: string
) {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  // Upload to storage
  const filePath = `${eventId}/${Date.now()}-${fileName}`;
  const { error: uploadError } = await supabase.storage
    .from('event-media')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('event-media').getPublicUrl(filePath);

  // Create media record
  const mediaInsert: EventMediaInsert = {
    event_id: eventId,
    uploader_id: user.id,
    media_url: publicUrl,
    media_type: file.type.startsWith('video/') ? 'video' : 'image',
  };

  const { data: mediaData, error: mediaError } = await supabase
    .from('event_media')
    .insert(mediaInsert)
    .select()
    .single();

  if (mediaError) throw mediaError;

  return mediaData;
}

export async function getEventMedia(eventId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('event_media')
    .select(
      `
      *,
      uploader:users!event_media_uploader_id_fkey(*)
    `
    )
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteEventMedia(id: string) {
  const supabase = getSupabase();
  
  // Get media record to get the URL
  const { data: media, error: fetchError } = await supabase
    .from('event_media')
    .select('media_url')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;

  // Extract file path from URL
  const url = new URL(media.media_url);
  const filePath = url.pathname.split('/event-media/')[1];

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('event-media')
    .remove([filePath]);

  if (storageError) throw storageError;

  // Delete record
  const { error: deleteError } = await supabase
    .from('event_media')
    .delete()
    .eq('id', id);

  if (deleteError) throw deleteError;
}

export async function uploadAvatar(file: File | Blob, userId: string) {
  const supabase = getSupabase();

  const filePath = `avatars/${userId}-${Date.now()}`;
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(filePath);

  return publicUrl;
}
