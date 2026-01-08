'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEvents } from '@gatherup/shared';
import Link from 'next/link';

type TimeFilter = 'upcoming' | 'today' | 'tomorrow' | 'week';
type VisibilityFilter = 'all' | 'public' | 'private';

export default function HomePage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('upcoming');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ['events', visibilityFilter],
    queryFn: () =>
      getEvents({
        visibility: visibilityFilter === 'all' ? undefined : visibilityFilter,
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
        <Link
          href="/create-event"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Create Event
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
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

        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 self-center">Visibility:</span>
          {(['all', 'public', 'private'] as VisibilityFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setVisibilityFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                visibilityFilter === filter
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
          {filteredEvents.map((event) => (
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
                  {event.visibility === 'public' && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      Public
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  📅 {new Date(event.start_time).toLocaleDateString()}
                </p>
                {event.location && (
                  <p className="text-gray-600 text-sm mb-2">
                    📍 {event.location}
                  </p>
                )}
                <p className="text-gray-600 text-sm">
                  👥 {event.member_count || 0} members
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No events found</p>
        </div>
      )}
    </div>
  );
}
