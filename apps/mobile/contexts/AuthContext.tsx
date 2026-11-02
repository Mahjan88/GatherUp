import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import type { Database } from '@gatherup/types';
import { supabase } from '../lib/supabase';

export type Profile = Database['public']['Tables']['users']['Row'];

interface AuthContextType {
  session: Session | null;
  profile: Profile | null;
  /** True while the session or its profile is being read. */
  loading: boolean;
  /** Set by the last onboarding step in `users.user_data`. */
  isOnboarded: boolean;
  /** Browsing without an account via welcome's "Skip for now". */
  isGuest: boolean;
  continueAsGuest: () => void;
  refreshProfile: () => Promise<Profile | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  profile: null,
  loading: true,
  isOnboarded: false,
  isGuest: false,
  continueAsGuest: () => {},
  refreshProfile: async () => null,
  signOut: async () => {},
});

async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export function isProfileOnboarded(profile: Profile | null) {
  const userData = profile?.user_data as Record<string, unknown> | null;
  return userData?.onboarding_complete === true;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  // TODO: Temporary while sign-in is being tested. Not persisted, so a
  // reload returns guests to welcome. Remove before launch.
  const [isGuest, setIsGuest] = useState(false);

  const loadProfile = useCallback(async (next: Session | null) => {
    if (!next) {
      setProfile(null);
      return null;
    }
    setLoading(true);
    try {
      const row = await fetchProfile(next.user.id);
      setProfile(row);
      return row;
    } catch (e) {
      console.warn('Failed to load profile', e);
      setProfile(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      await loadProfile(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, next) => {
        // Mark loading in the same render as the new session so the
        // redirect waits for the profile instead of guessing onboarding
        if (event === 'SIGNED_IN' && next) setLoading(true);
        setSession(next);
        // Supabase warns against awaiting other calls inside this callback
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          setTimeout(() => loadProfile(next), 0);
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const refreshProfile = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    return loadProfile(data.session);
  }, [loadProfile]);

  const continueAsGuest = useCallback(() => setIsGuest(true), []);

  const signOut = useCallback(async () => {
    setIsGuest(false);
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        loading,
        isOnboarded: isProfileOnboarded(profile),
        isGuest,
        continueAsGuest,
        refreshProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
