'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEvents } from '@gatherup/shared';
import Link from 'next/link';

type TimeFilter = 'upcoming' | 'today' | 'tomorrow' | 'week';
type CategoryFilter = 'all' | 'networking' | 'party' | 'workshop' | 'conference' | 'social' | 'sports' | 'other';

export default function DiscoverPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('upcoming');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

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
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    switch (timeFilter) {
      case 'today':
        return events.filter((e) => {
          const eventDate = new Date(e.start_time);
          return eventDate >= today && eventDate < tomorrow;
        });
      case 'tomorrow':
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
        return events.filter((e) => {
          const eventDate = new Date(e.start_time);
          return eventDate >= tomorrow && eventDate < dayAfterTomorrow;
        });
      case 'week':
        return events.filter((e) => {
          const eventDate = new Date(e.start_time);
          return eventDate >= today && eventDate < weekEnd;
        });
      default:
        return events;
    }
  };

  const filteredEvents = filterEventsByTime(events);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Discover Events</h2>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        {/* Time filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm font-medium text-gray-700 self-center">Time:</span>
          {(['upcoming', 'today', 'tomorrow', 'week'] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                timeFilter === filter
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 self-center">Category:</span>
          {(['all', 'networking', 'party', 'workshop', 'conference', 'social', 'sports', 'other'] as CategoryFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setCategoryFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                categoryFilter === filter
                  ? 'bg-primary-100 text-primary-700 border border-primary-600'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : filteredEvents && filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event: any) => (
            <Link
              key={event.id}
              href={`/event/${event.id}`}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {event.cover_image_url && (
                <div className="h-48 bg-gray-200"></div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {event.title}
                  </h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded ml-2">
                    Public
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {new Date(event.start_time).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
                {event.location && (
                  <p className="text-gray-600 text-sm mb-2">
                    {event.location}
                  </p>
                )}
                {event.category && event.category !== 'other' && (
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {event.category}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No events found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or check back later</p>
        </div>
      )}
    </div>
  );
}
