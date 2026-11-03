import { GatherUpClient } from '@gatherup/api-client';
import { supabase } from './supabase';

export const api = new GatherUpClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000',
  getToken: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  },
});
