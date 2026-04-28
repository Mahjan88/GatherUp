import { eq, or, ilike } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';
import type { FastifyInstance } from 'fastify';
import { users } from '../../db/schema/index.js';
import type { SignUpInput, SignInEmailInput, SignInPhoneInput, UpdateProfileInput } from './auth.schema.js';

export class AuthService {
  constructor(private app: FastifyInstance) {}

  private getSupabaseAdmin() {
    return createClient(this.app.env.SUPABASE_URL, this.app.env.SUPABASE_SERVICE_ROLE_KEY);
  }

  async signUp(input: SignUpInput) {
    const supabase = this.getSupabaseAdmin();
    const { data, error } = await supabase.auth.admin.createUser({
      email: input.email,
      password: input.password,
      user_metadata: { full_name: input.fullName },
      email_confirm: true,
    });

    if (error) throw error;
    return data;
  }

  async signInWithEmail(input: SignInEmailInput) {
    const supabase = createClient(this.app.env.SUPABASE_URL, this.app.env.SUPABASE_ANON_KEY);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) throw error;
    return data;
  }

  async signInWithPhone(input: SignInPhoneInput) {
    const supabase = createClient(this.app.env.SUPABASE_URL, this.app.env.SUPABASE_ANON_KEY);
    const { data, error } = await supabase.auth.signInWithPassword({
      phone: input.phone,
      password: input.password,
    });

    if (error) throw error;
    return data;
  }

  async getProfile(userId: string) {
    const result = await this.app.db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!result) throw new Error('User not found');
    return result;
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const updateData: Record<string, unknown> = {};
    if (input.fullName !== undefined) updateData.fullName = input.fullName;
    if (input.avatarUrl !== undefined) updateData.avatarUrl = input.avatarUrl;
    if (input.bio !== undefined) updateData.bio = input.bio;
    if (input.phone !== undefined) updateData.phone = input.phone;

    const [updated] = await this.app.db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    return updated;
  }

  async searchUsers(query: string) {
    const results = await this.app.db
      .select()
      .from(users)
      .where(
        or(
          ilike(users.fullName, `%${query}%`),
          ilike(users.email, `%${query}%`)
        )
      )
      .limit(10);

    return results;
  }
}
