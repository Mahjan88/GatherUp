import { eq, desc } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';
import type { FastifyInstance } from 'fastify';
import { eventMedia } from '../../db/schema/event-media.js';
import { users } from '../../db/schema/users.js';

export class MediaService {
  constructor(private app: FastifyInstance) {}

  private getSupabaseAdmin() {
    return createClient(this.app.env.SUPABASE_URL, this.app.env.SUPABASE_SERVICE_ROLE_KEY);
  }

  async uploadEventMedia(
    eventId: string,
    uploaderId: string,
    file: Buffer,
    fileName: string,
    mimeType: string
  ) {
    const supabase = this.getSupabaseAdmin();

    // Upload to Supabase Storage
    const filePath = `${eventId}/${Date.now()}-${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('event-media')
      .upload(filePath, file, { contentType: mimeType });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('event-media')
      .getPublicUrl(filePath);

    // Create database record
    const mediaType = mimeType.startsWith('video/') ? 'video' : 'image';
    const [record] = await this.app.db
      .insert(eventMedia)
      .values({
        eventId,
        uploaderId,
        mediaUrl: publicUrl,
        mediaType,
      })
      .returning();

    return record;
  }

  async getEventMedia(eventId: string) {
    const media = await this.app.db
      .select({
        media: eventMedia,
        uploader: users,
      })
      .from(eventMedia)
      .innerJoin(users, eq(eventMedia.uploaderId, users.id))
      .where(eq(eventMedia.eventId, eventId))
      .orderBy(desc(eventMedia.createdAt));

    return media.map((m) => ({
      ...m.media,
      uploader: m.uploader,
    }));
  }

  async deleteEventMedia(mediaId: string, userId: string) {
    // Get the media record
    const record = await this.app.db.query.eventMedia.findFirst({
      where: eq(eventMedia.id, mediaId),
    });

    if (!record) throw new Error('Media not found');
    if (record.uploaderId !== userId) throw new Error('Not authorized');

    // Delete from storage
    const supabase = this.getSupabaseAdmin();
    const url = new URL(record.mediaUrl);
    const filePath = url.pathname.split('/event-media/')[1];

    if (filePath) {
      await supabase.storage.from('event-media').remove([filePath]);
    }

    // Delete database record
    await this.app.db.delete(eventMedia).where(eq(eventMedia.id, mediaId));
  }

  async uploadAvatar(userId: string, file: Buffer, mimeType: string) {
    const supabase = this.getSupabaseAdmin();
    const filePath = `avatars/${userId}-${Date.now()}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { contentType: mimeType });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  }
}
