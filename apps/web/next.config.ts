import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@gatherup/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default nextConfig;
