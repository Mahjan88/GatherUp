'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// TODO: Replace with real API call that supports pagination
// GET /api/events?visibility=public&time=this_week&category=all&limit=5&offset=0
async function fetchEvents(_params: {
  time: string;
  category: string;
  limit: number;
  offset: number;
}): Promise<any[]> {
  // Stub — return empty for now
  return [];
}

const PAGE_SIZE = 5;

export default function SeeAllEventsPage() {
  const searchParams = useSearchParams();
  const timeFilter = searchParams.get('time') || 'this_week';
  const categoryFilter = searchParams.get('category') || 'all';

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadEvents = useCallback(
    async (reset = false) => {
      if (reset) {
        offsetRef.current = 0;
        setEvents([]);
        setLoading(true);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const batch = await fetchEvents({
          time: timeFilter,
          category: categoryFilter,
          limit: PAGE_SIZE,
          offset: offsetRef.current,
        });

        if (batch.length < PAGE_SIZE) {
          setHasMore(false);
        }

        setEvents((prev) => (reset ? batch : [...prev, ...batch]));
        offsetRef.current += batch.length;
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [timeFilter, categoryFilter]
  );

  // Initial load
  useEffect(() => {
    loadEvents(true);
  }, [loadEvents]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          loadEvents();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadEvents]);

  const timeLabel =
    timeFilter === 'today'
      ? 'Today'
      : timeFilter === 'this_month'
        ? 'This Month'
        : 'This Week';

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
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Events near you
          </h2>
          <p className="text-sm text-gray-500">
            {timeLabel}
            {categoryFilter !== 'all' ? ` · ${categoryFilter}` : ''}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mx-auto"></div>
        </div>
      ) : events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event: any) => (
            <Link
              key={event.id}
              href={`/event/${event.id}`}
              className="flex bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="w-32 h-28 flex-shrink-0 bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center">
                {event.cover_image_url ? (
                  <img
                    src={event.cover_image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">📅</span>
                )}
              </div>
              <div className="p-4 flex-1 min-w-0">
                <p className="text-teal-600 text-xs font-semibold mb-1">
                  {new Date(event.start_time).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                  {' · '}
                  {new Date(event.start_time).toLocaleTimeString(undefined, {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
                <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
                  {event.title}
                </h3>
                {event.location && (
                  <p className="text-gray-500 text-sm truncate">{event.location}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {event.category && event.category !== 'other' && (
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full capitalize">
                      {event.category}
                    </span>
                  )}
                  {event.member_count > 0 && (
                    <span className="text-gray-400 text-xs">
                      {event.member_count} going
                    </span>
                  )}
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

          {!hasMore && events.length > 0 && (
            <p className="text-center text-gray-400 text-sm py-4">
              You&apos;ve reached the end
            </p>
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <span className="text-4xl block mb-3">📅</span>
          <p className="text-gray-500 text-lg">No events found</p>
          <p className="text-gray-400 text-sm mt-1">
            Try a different time range or check back later
          </p>
        </div>
      )}
    </div>
  );
}
