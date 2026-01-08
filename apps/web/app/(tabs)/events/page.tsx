'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyHostedEvents, getMyInvitedEvents } from '@gatherup/shared';
import Link from 'next/link';

type Tab = 'hosting' | 'invited';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('hosting');

  const { data: hostedEvents, isLoading: hostedLoading } = useQuery({
    queryKey: ['my-hosted-events'],
    queryFn: getMyHostedEvents,
  });

  const { data: invitedEvents, isLoading: invitedLoading } = useQuery({
    queryKey: ['my-invited-events'],
    queryFn: getMyInvitedEvents,
  });

  const events = activeTab === 'hosting' ? hostedEvents : invitedEvents;
  const isLoading = activeTab === 'hosting' ? hostedLoading : invitedLoading;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Events</h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('hosting')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'hosting'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Hosting ({hostedEvents?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('invited')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'invited'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Invited ({invitedEvents?.length || 0})
        </button>
      </div>

      {/* Events List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
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
          <p className="text-gray-500 text-lg">
            {activeTab === 'hosting'
              ? "You haven't created any events yet"
              : "You haven't been invited to any events"}
          </p>
        </div>
      )}
    </div>
  );
}
