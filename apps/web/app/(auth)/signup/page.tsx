'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUpWithEmail, signInWithOAuth } from '@gatherup/shared';

export default function SignUpPage() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password, fullName);
      setSuccess(
        'Account created! Please check your email to verify your account.'
      );
      router.push('/login');
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
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-center text-4xl font-bold text-white">
            GatherUp
          </h2>
          <p className="mt-2 text-center text-sm text-white/50">
            Sign up and start connecting
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {success}
          </div>
        )}

        {!showEmailForm ? (
          <>
            {/* OAuth buttons — white pill style */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleOAuth('apple')}
                className="w-full flex items-center px-6 py-4 bg-white rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <span className="w-6 text-center text-xl text-black">

                </span>
                <span className="flex-1 text-center text-black font-semibold text-base pr-6">
                  Continue with Apple
                </span>
              </button>

              <button
                onClick={() => handleOAuth('google')}
                className="w-full flex items-center px-6 py-4 bg-white rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform"
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
                <span className="flex-1 text-center text-black font-semibold text-base pr-5">
                  Continue with Google
                </span>
              </button>

              <button
                onClick={() => setShowEmailForm(true)}
                className="w-full flex items-center px-6 py-4 bg-white rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="2" y="4" width="20" height="16" rx="3" />
                  <path d="M22 7l-10 7L2 7" />
                </svg>
                <span className="flex-1 text-center text-black font-semibold text-base pr-5">
                  Continue with Email
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <hr className="flex-1 border-white/[0.08]" />
              <span className="text-white/30 text-sm">or</span>
              <hr className="flex-1 border-white/[0.08]" />
            </div>

            {/* Login link */}
            <div className="text-center mb-5">
              <span className="text-white/40 text-sm">
                Already have an account?
              </span>
              <Link
                href="/login"
                className="text-white font-semibold text-sm ml-1.5"
              >
                Log In
              </Link>
            </div>

            <p className="text-center text-white/30 text-[11px] leading-relaxed">
              By pressing Continue, you agree to our{' '}
              <span className="text-white/50 underline underline-offset-2 decoration-white/20">
                Terms of Use
              </span>{' '}
              and{' '}
              <span className="text-white/50 underline underline-offset-2 decoration-white/20">
                Privacy Policy
              </span>
            </p>
          </>
        ) : (
          /* Email signup form */
          <form className="space-y-4" onSubmit={handleSignUp}>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3.5 border border-white/[0.12] bg-white/[0.04] text-white rounded-xl focus:outline-none focus:border-[rgba(0,212,170,0.5)] placeholder-white/25 text-sm"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
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
                type="password"
                required
                className="w-full px-4 py-3.5 border border-white/[0.12] bg-white/[0.04] text-white rounded-xl focus:outline-none focus:border-[rgba(0,212,170,0.5)] placeholder-white/25 text-sm"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3.5 border border-white/[0.12] bg-white/[0.04] text-white rounded-xl focus:outline-none focus:border-[rgba(0,212,170,0.5)] placeholder-white/25 text-sm"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white rounded-full text-black font-semibold text-base hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <button
              type="button"
              onClick={() => setShowEmailForm(false)}
              className="w-full text-center text-white/50 text-sm py-2 hover:text-white/70 transition-colors"
            >
              Back to all sign up options
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
