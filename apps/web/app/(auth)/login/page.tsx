'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmail, signInWithOAuth } from '@gatherup/shared';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push('/');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    try {
      await signInWithOAuth(provider);
      router.push('/');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black py-12 px-4 sm:px-6 lg:px-8">
      {/* Background orbs */}
      <div className="absolute top-[-60px] left-[-80px] w-[260px] h-[260px] rounded-full bg-[rgba(0,212,170,0.12)] blur-[80px]" />
      <div className="absolute top-[60px] right-[-60px] w-[200px] h-[200px] rounded-full bg-[rgba(224,64,160,0.10)] blur-[80px]" />
      <div className="absolute bottom-[100px] left-[40px] w-[180px] h-[180px] rounded-full bg-[rgba(64,128,255,0.08)] blur-[80px]" />

      <div className="max-w-sm w-full relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-center text-4xl font-bold text-white">
            GatherUp
          </h2>
          <p className="mt-2 text-center text-sm text-white/50">
            Log in to your account
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-3.5 border border-white/[0.12] bg-white/[0.04] text-white rounded-xl focus:outline-none focus:border-[rgba(0,212,170,0.5)] placeholder-white/25 text-sm"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-3.5 border border-white/[0.12] bg-white/[0.04] text-white rounded-xl focus:outline-none focus:border-[rgba(0,212,170,0.5)] placeholder-white/25 text-sm"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-white/50 text-sm hover:text-white/70 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white rounded-full text-black font-semibold text-base hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Log In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <hr className="flex-1 border-white/[0.08]" />
          <span className="text-white/30 text-sm">or</span>
          <hr className="flex-1 border-white/[0.08]" />
        </div>

        {/* Social buttons — white pill circles */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleOAuth('apple')}
            className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <span className="text-[22px] text-black"></span>
          </button>

          <button
            onClick={() => handleOAuth('google')}
            className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </button>
        </div>

        {/* Sign up link */}
        <div className="text-center mt-7">
          <span className="text-white/40 text-sm">
            Don&apos;t have an account?
          </span>
          <Link
            href="/signup"
            className="text-white font-semibold text-sm ml-1.5"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
