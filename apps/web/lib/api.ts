import { GatherUpClient } from '@gatherup/api-client';
import { getSupabase } from '@gatherup/shared';

export const api = new GatherUpClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  getToken: async () => {
    const { data } = await getSupabase().auth.getSession();
    return data.session?.access_token ?? null;
  },
});
