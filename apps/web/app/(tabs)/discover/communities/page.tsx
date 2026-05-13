'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

// TODO: Replace with real API call that supports pagination
// GET /api/communities?nearby=true&limit=5&offset=0
interface CommunityItem {
  id: string;
  name: string;
  city: string | null;
  category: string;
  member_count: number;
  cover_image_url: string | null;
  description: string | null;
}

async function fetchCommunities(_params: {
  limit: number;
  offset: number;
}): Promise<CommunityItem[]> {
  // Stub — return empty for now
  return [];
}

const PAGE_SIZE = 5;

export default function SeeAllCommunitiesPage() {
  const [communities, setCommunities] = useState<CommunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadCommunities = useCallback(async (reset = false) => {
    if (reset) {
      offsetRef.current = 0;
      setCommunities([]);
      setLoading(true);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const batch = await fetchCommunities({
        limit: PAGE_SIZE,
        offset: offsetRef.current,
      });

      if (batch.length < PAGE_SIZE) {
        setHasMore(false);
      }

      setCommunities((prev) => (reset ? batch : [...prev, ...batch]));
      offsetRef.current += batch.length;
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadCommunities(true);
  }, [loadCommunities]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          loadCommunities();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadCommunities]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/discover"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">
          Communities near you
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mx-auto"></div>
        </div>
      ) : communities.length > 0 ? (
        <div className="space-y-4">
          {communities.map((community) => (
            <Link
              key={community.id}
              href={`/community/${community.id}`}
              className="flex bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="w-28 h-28 flex-shrink-0 bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                {community.cover_image_url ? (
                  <img
                    src={community.cover_image_url}
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {community.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="p-4 flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
                  {community.name}
                </h3>
                {community.city && (
                  <p className="text-gray-500 text-sm truncate mb-1">
                    {community.city}
                  </p>
                )}
                {community.description && (
                  <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                    {community.description}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {community.member_count} members
                  </span>
                  <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full capitalize">
                    {community.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-1" />

          {loadingMore && (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
            </div>
          )}

          {!hasMore && communities.length > 0 && (
            <p className="text-center text-gray-400 text-sm py-4">
              You've reached the end
            </p>
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <span className="text-4xl block mb-3">🏘️</span>
          <p className="text-gray-500 text-lg">No communities found nearby</p>
          <p className="text-gray-400 text-sm mt-1">
            Try updating your location in your profile settings
          </p>
        </div>
      )}
    </div>
  );
}
