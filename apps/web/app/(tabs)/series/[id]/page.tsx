'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

// TODO: Replace with actual API client import
// import { getSeries } from '@gatherup/shared';

// Placeholder data until API is wired
// TODO: Replace with actual API call - GET /api/series/:id
const MOCK_SERIES = {
  id: 'placeholder-id',
  organizer_type: 'user' as 'user' | 'community',
  host_id: 'user-123',
  community_id: null as string | null,
  title: 'Weekly Tech Meetup',
  slug: 'weekly-tech-meetup',
  description:
    'A recurring series of tech talks and networking events for developers in the area. Join us every week to learn something new and meet fellow developers.',
  cover_image_url: null as string | null,
  category: 'networking' as const,
  visibility: 'public' as 'public' | 'private',
  recurrence_hint: 'weekly' as const,
  settings: {},
  subscriber_count: 42,
  created_at: '2025-01-15T00:00:00Z',
  updated_at: '2025-05-01T00:00:00Z',
  // Joined data
  host: {
    id: 'user-123',
    display_name: 'Jane Organizer',
    avatar_url: null as string | null,
  },
  community: null as { id: string; name: string } | null,
};

export default function SeriesDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notifyEnabled, setNotifyEnabled] = useState(true);

  // TODO: Replace with useQuery + actual API call
  // const { data: series, isLoading } = useQuery({
  //   queryKey: ['series', id],
  //   queryFn: () => getSeries(id),
  // });
  const series = MOCK_SERIES;
  const isLoading = false;

  // TODO: Wire to API - POST /api/series/:id/subscribe
  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    if (!isSubscribed) {
      setNotifyEnabled(true);
    }
    alert(
      isSubscribed ? 'Unsubscribed from series' : 'Subscribed to series!'
    );
  };

  // TODO: Wire to API - PATCH /api/series/:id/subscription { notify }
  const handleToggleNotify = () => {
    setNotifyEnabled(!notifyEnabled);
    alert(
      notifyEnabled
        ? 'Notifications turned off'
        : 'Notifications turned on'
    );
  };

  // TODO: Wire to API - POST /api/reports
  const handleReport = () => {
    // POST /api/reports { target_type: 'event_series', target_id: id, reason: reportReason, details: reportDetails }
    setShowReportModal(false);
    setReportReason('');
    setReportDetails('');
    alert('Report submitted. Thank you.');
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Series not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Cover image */}
      {series.cover_image_url ? (
        <div className="h-72 bg-gray-200 rounded-lg mb-6 overflow-hidden">
          <img
            src={series.cover_image_url}
            alt={series.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-r from-teal-400 to-teal-600 rounded-lg mb-6 flex items-center justify-center">
          <span className="text-5xl">🔁</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main content - 2 cols */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Title row */}
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-900 flex-1">
                {series.title}
              </h1>
              <div className="flex gap-2 ml-4">
                {series.visibility === 'public' && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    Public
                  </span>
                )}
                {series.visibility === 'private' && (
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    Private
                  </span>
                )}
                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                  {series.category}
                </span>
              </div>
            </div>

            {/* Slug */}
            {series.slug && (
              <p className="text-sm text-gray-400 mb-4">
                gatherup.app/s/{series.slug}
              </p>
            )}

            {/* Organizer info */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                {series.organizer_type === 'community' ? (
                  <span className="text-lg">👥</span>
                ) : (
                  <span className="text-lg">👤</span>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500">
                  {series.organizer_type === 'community'
                    ? 'Organized by community'
                    : 'Organized by'}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {series.organizer_type === 'community' && series.community
                    ? series.community.name
                    : series.host?.display_name || 'Unknown organizer'}
                </p>
              </div>
            </div>

            {/* Recurrence hint */}
            {series.recurrence_hint && (
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-sm font-medium px-3 py-1.5 rounded-full">
                  🔁 Repeats {series.recurrence_hint}
                </span>
              </div>
            )}

            {/* Description */}
            {series.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-3">
                  About
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {series.description}
                </p>
              </div>
            )}

            {/* Upcoming events section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-3">
                Upcoming events
              </h3>
              {/* TODO: Fetch and display series events */}
              {/* GET /api/events?series_id=:id&upcoming=true */}
              <div className="text-center py-8">
                <span className="text-3xl mb-2 block">📅</span>
                <p className="text-sm text-gray-500">
                  No upcoming events yet
                </p>
              </div>
            </div>

            {/* Past events section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-3">
                Past events
              </h3>
              {/* TODO: Fetch and display past series events */}
              {/* GET /api/events?series_id=:id&past=true */}
              <div className="text-center py-8">
                <span className="text-3xl mb-2 block">🕐</span>
                <p className="text-sm text-gray-500">
                  No past events yet
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - 1 col */}
        <div className="space-y-4">
          {/* Stats card */}
          <div className="bg-white rounded-lg shadow-sm p-5 space-y-4">
            {/* Subscriber count */}
            <div className="flex gap-3">
              <span className="text-xl">👥</span>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {series.subscriber_count || 0} subscribers
                </p>
              </div>
            </div>

            {/* Event count */}
            <div className="flex gap-3">
              <span className="text-xl">📅</span>
              <div>
                {/* TODO: Fetch actual event count for this series */}
                <p className="text-sm font-medium text-gray-900">
                  0 events
                </p>
              </div>
            </div>

            {/* Created date */}
            {series.created_at && (
              <div className="flex gap-3">
                <span className="text-xl">🗓️</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Created{' '}
                    {new Date(series.created_at).toLocaleDateString(
                      undefined,
                      {
                        month: 'long',
                        year: 'numeric',
                      }
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="bg-white rounded-lg shadow-sm p-5 space-y-3">
            <button
              onClick={handleSubscribe}
              className={`w-full px-4 py-2.5 rounded-lg font-medium transition-colors text-sm ${
                isSubscribed
                  ? 'border border-teal-500 text-teal-700 bg-teal-50 hover:bg-teal-100'
                  : 'bg-teal-500 text-white hover:bg-teal-600'
              }`}
            >
              {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </button>

            {/* Notification toggle (shown when subscribed) */}
            {isSubscribed && (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Notifications
                  </p>
                  <p className="text-xs text-gray-500">
                    Get notified about new events
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifyEnabled}
                    onChange={handleToggleNotify}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>
            )}

            {/* Share button placeholder */}
            <button
              onClick={() => {
                // TODO: Implement share functionality
                alert('Share link copied! (not yet implemented)');
              }}
              className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm"
            >
              Share
            </button>

            <div className="border-t pt-3">
              <button
                onClick={() => setShowReportModal(true)}
                className="w-full px-4 py-2 text-gray-500 text-xs hover:text-red-600 transition-colors"
              >
                Report series
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Report this series
            </h3>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <option value="">Select a reason...</option>
                <option value="spam">Spam or misleading</option>
                <option value="harassment">Harassment or bullying</option>
                <option value="inappropriate">Inappropriate content</option>
                <option value="safety">Safety concern</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional details (optional)</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Provide more context..."
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowReportModal(false); setReportReason(''); setReportDetails(''); }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                Submit report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
