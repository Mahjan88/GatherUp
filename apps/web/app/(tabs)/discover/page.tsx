'use client';

import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEvents } from '@gatherup/shared';
import Link from 'next/link';

type TimeFilter = 'today' | 'this_week' | 'this_month';
type CategoryFilter =
  | 'all'
  | 'networking'
  | 'party'
  | 'workshop'
  | 'conference'
  | 'social'
  | 'sports'
  | 'other';

const TIME_FILTERS: { value: TimeFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
];

const CATEGORY_FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'networking', label: 'Networking' },
  { value: 'party', label: 'Party' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'conference', label: 'Conference' },
  { value: 'social', label: 'Social' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' },
];

// TODO: Replace with real API data
interface NearbyCommunity {
  id: string;
  name: string;
  city: string | null;
  category: string;
  member_count: number;
  cover_image_url: string | null;
}
const NEARBY_COMMUNITIES: NearbyCommunity[] = [];

export default function DiscoverPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('this_week');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const eventsScrollRef = useRef<HTMLDivElement>(null);
  const communitiesScrollRef = useRef<HTMLDivElement>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', 'discover', categoryFilter],
    queryFn: () =>
      getEvents({
        visibility: 'public',
        ...(categoryFilter !== 'all' ? { category: categoryFilter } : {}),
      }),
  });

  const filterEventsByTime = (events: any[] = []) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (timeFilter) {
      case 'today':
        return events.filter((e) => {
          const d = new Date(e.start_time);
          return d >= today && d < tomorrow;
        });
      case 'this_week': {
        const day = today.getDay();
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - (day === 0 ? 6 : day - 1));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return events.filter((e) => {
          const d = new Date(e.start_time);
          return d >= weekStart && d < weekEnd;
        });
      }
      case 'this_month': {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        return events.filter((e) => {
          const d = new Date(e.start_time);
          return d >= monthStart && d < monthEnd;
        });
      }
      default:
        return events;
    }
  };

  const filteredEvents = filterEventsByTime(events);
  const previewEvents = (filteredEvents || []).slice(0, 5);
  const previewCommunities = NEARBY_COMMUNITIES.slice(0, 5);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    ref.current?.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Discover</h2>
      </div>

      {/* Calendar time tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
        {TIME_FILTERS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setTimeFilter(tab.value)}
            className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
              timeFilter === tab.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              categoryFilter === cat.value
                ? 'bg-teal-500 text-white border-teal-500'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Events Near You — horizontal carousel of 5 */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Events near you
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll(eventsScrollRef, 'left')}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              aria-label="Scroll left"
            >
              ‹
            </button>
            <button
              onClick={() => scroll(eventsScrollRef, 'right')}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              aria-label="Scroll right"
            >
              ›
            </button>
            <Link
              href={`/discover/events?time=${timeFilter}&category=${categoryFilter}`}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium ml-2"
            >
              See all
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mx-auto"></div>
          </div>
        ) : previewEvents.length > 0 ? (
          <div
            ref={eventsScrollRef}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {previewEvents.map((event: any) => (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className="flex-shrink-0 w-64 bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow snap-start"
              >
                {event.cover_image_url ? (
                  <div className="h-36 bg-gray-200 overflow-hidden">
                    <img
                      src={event.cover_image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-28 bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center">
                    <span className="text-3xl">📅</span>
                  </div>
                )}
                <div className="p-3">
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
                  <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                    {event.title}
                  </h4>
                  {event.location && (
                    <p className="text-gray-500 text-xs truncate">
                      {event.location}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <span className="text-4xl block mb-3">📅</span>
            <p className="text-gray-500">No events found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try a different time range or check back later
            </p>
          </div>
        )}
      </div>

      {/* Communities Near You — horizontal carousel of 5 */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Communities near you
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll(communitiesScrollRef, 'left')}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              aria-label="Scroll left"
            >
              ‹
            </button>
            <button
              onClick={() => scroll(communitiesScrollRef, 'right')}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              aria-label="Scroll right"
            >
              ›
            </button>
            <Link
              href="/discover/communities"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium ml-2"
            >
              See all
            </Link>
          </div>
        </div>

        {previewCommunities.length > 0 ? (
          <div
            ref={communitiesScrollRef}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {previewCommunities.map((community) => (
              <Link
                key={community.id}
                href={`/community/${community.id}`}
                className="flex-shrink-0 w-56 bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow snap-start"
              >
                <div className="h-24 bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
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
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {community.name}
                  </h4>
                  {community.city && (
                    <p className="text-xs text-gray-500 truncate">
                      {community.city}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
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
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <span className="text-4xl block mb-3">🏘️</span>
            <p className="text-gray-500">No communities found nearby</p>
            <p className="text-gray-400 text-sm mt-1">
              Try updating your location in your profile settings
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
