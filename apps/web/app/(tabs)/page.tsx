'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyHostedEvents, getMyInvitedEvents } from '@gatherup/shared';
import Link from 'next/link';

type FeedTab = 'upcoming' | 'invites' | 'series';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<FeedTab>('upcoming');

  const { data: hostedEvents, isLoading: loadingHosted } = useQuery({
    queryKey: ['events', 'hosted'],
    queryFn: () => getMyHostedEvents(),
  });

  const { data: invitedEvents, isLoading: loadingInvited } = useQuery({
    queryKey: ['events', 'invited'],
    queryFn: () => getMyInvitedEvents(),
  });

  // TODO: Add query for series subscription events via feed endpoint
  // const { data: feedEvents } = useQuery({
  //   queryKey: ['events', 'feed'],
  //   queryFn: () => client.events.feed(),
  // });

  const isLoading = loadingHosted || loadingInvited;

  const upcomingEvents = [
    ...(hostedEvents || []),
    ...(invitedEvents?.filter((e: any) => e.status === 'joined') || []),
  ].sort((a: any, b: any) =>
    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  const pendingInvites = invitedEvents?.filter(
    (e: any) => e.status === 'invited'
  ) || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Home</h2>
        <Link
          href="/create-event"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Create Event
        </Link>
      </div>

      {/* Feed Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-1 mb-6 inline-flex gap-1">
        {([
          { key: 'upcoming', label: 'My Upcoming' },
          { key: 'invites', label: `Invites${pendingInvites.length > 0 ? ` (${pendingInvites.length})` : ''}` },
          { key: 'series', label: 'Series Updates' },
        ] as { key: FeedTab; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : activeTab === 'upcoming' ? (
        upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event: any) => (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {event.cover_image_url && (
                  <div className="h-48 bg-gray-200"></div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {new Date(event.start_time).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                  {event.location && (
                    <p className="text-gray-500 text-sm mt-1">{event.location}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No upcoming events</p>
            <Link
              href="/discover"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Discover events nearby
            </Link>
          </div>
        )
      ) : activeTab === 'invites' ? (
        pendingInvites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingInvites.map((event: any) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border-l-4 border-primary-500"
              >
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {new Date(event.start_time).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                  {event.location && (
                    <p className="text-gray-500 text-sm mt-1">{event.location}</p>
                  )}
                  <div className="flex gap-3 mt-4">
                    <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
                      Going
                    </button>
                    <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No pending invites</p>
          </div>
        )
      ) : (
        /* Series Updates tab */
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No series updates</p>
          <p className="text-gray-400 text-sm">
            Subscribe to event series to see new events here when they are created
          </p>
        </div>
      )}
    </div>
  );
}
