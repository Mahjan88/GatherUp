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
      user_metadata: {
        first_name: input.firstName,
        last_name: input.lastName,
      },
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
    if (input.firstName !== undefined) updateData.firstName = input.firstName;
    if (input.lastName !== undefined) updateData.lastName = input.lastName;
    if (input.username !== undefined) updateData.username = input.username;
    if (input.tagline !== undefined) updateData.tagline = input.tagline;
    if (input.avatarUrl !== undefined) updateData.avatarUrl = input.avatarUrl;
    if (input.bio !== undefined) updateData.bio = input.bio;
    if (input.phone !== undefined) updateData.phone = input.phone;
    if (input.city !== undefined) updateData.city = input.city;
    if (input.state !== undefined) updateData.state = input.state;
    if (input.country !== undefined) updateData.country = input.country;
    if (input.userData !== undefined) updateData.userData = input.userData;

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
          ilike(users.firstName, `%${query}%`),
          ilike(users.lastName, `%${query}%`),
          ilike(users.username, `%${query}%`),
          ilike(users.email, `%${query}%`)
        )
      )
      .limit(10);

    return results;
  }
}
