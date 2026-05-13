'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEvent,
  deleteEvent,
  requestToJoinEvent,
} from '@gatherup/shared';
import { useParams, useRouter } from 'next/navigation';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEvent(id),
  });

  const deleteEventMutation = useMutation({
    mutationFn: () => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['my-hosted-events'] });
      alert('Event deleted successfully');
      router.push('/');
    },
  });

  const joinRequestMutation = useMutation({
    mutationFn: () => requestToJoinEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      alert('Join request sent!');
    },
  });

  const handleReport = () => {
    // TODO: POST /api/reports { target_type: 'event', target_id: id, reason: reportReason, details: reportDetails }
    setShowReportModal(false);
    setReportReason('');
    setReportDetails('');
    alert('Report submitted. Thank you.');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEventMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Event not found</p>
      </div>
    );
  }

  const spotsLeft =
    event.capacity_limit != null
      ? event.capacity_limit - (event.member_count || 0)
      : null;

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Cover image */}
      {event.cover_image_url ? (
        <div className="h-72 bg-gray-200 rounded-lg mb-6 overflow-hidden">
          <img
            src={event.cover_image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-r from-teal-400 to-teal-600 rounded-lg mb-6 flex items-center justify-center">
          <span className="text-5xl">📅</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main content - 2 cols */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Title row */}
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-900 flex-1">
                {event.title}
              </h1>
              <div className="flex gap-2 ml-4">
                {/* Status badge */}
                {event.status && event.status !== 'published' && (
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    event.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-600'
                  } capitalize`}>
                    {event.status}
                  </span>
                )}
                {event.visibility === 'public' && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    Public
                  </span>
                )}
                {event.visibility === 'invite_only' && (
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    Invite only
                  </span>
                )}
                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                  {event.category}
                </span>
              </div>
            </div>

            {/* Tagline */}
            {event.tagline && (
              <p className="text-gray-500 mb-4">{event.tagline}</p>
            )}

            {/* Organizer info */}
            <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-medium">
                {event.organizer_type === 'community' && event.community
                  ? event.community.name?.[0]?.toUpperCase() || 'C'
                  : event.host?.first_name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {event.organizer_type === 'community' && event.community
                    ? `Hosted by ${event.community.name}`
                    : `Hosted by ${event.host?.first_name || 'Unknown'}${event.host?.last_name ? ` ${event.host.last_name}` : ''}`}
                </p>
                {event.series && (
                  <p className="text-xs text-teal-600">
                    Part of: {event.series.title}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  About this event
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - 1 col */}
        <div className="space-y-4">
          {/* Details card */}
          <div className="bg-white rounded-lg shadow-sm p-5 space-y-4">
            {/* Date */}
            <div className="flex gap-3">
              <span className="text-xl">📅</span>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(event.start_time).toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(event.start_time).toLocaleTimeString(undefined, {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                  {event.end_time &&
                    ` - ${new Date(event.end_time).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`}
                </p>
                {event.timezone && event.timezone !== 'UTC' && (
                  <p className="text-xs text-gray-400">
                    {event.timezone.replace(/_/g, ' ')}
                  </p>
                )}
              </div>
            </div>

            {/* Location / Online */}
            {event.is_online ? (
              <div className="flex gap-3">
                <span className="text-xl">💻</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Online event
                  </p>
                  {event.virtual_link && (
                    <a
                      href={event.virtual_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-teal-600 hover:underline break-all"
                    >
                      Join meeting
                    </a>
                  )}
                </div>
              </div>
            ) : (
              event.location && (
                <div className="flex gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {event.location}
                    </p>
                    {event.address && (
                      <p className="text-xs text-gray-500">{event.address}</p>
                    )}
                    {event.city_region && (
                      <p className="text-xs text-gray-500">
                        {event.city_region}
                      </p>
                    )}
                  </div>
                </div>
              )
            )}

            {/* Attendees / Capacity */}
            <div className="flex gap-3">
              <span className="text-xl">👥</span>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {event.member_count || 0} attending
                </p>
                {event.capacity_limit != null && (
                  <p className="text-xs text-gray-500">
                    {spotsLeft != null && spotsLeft > 0
                      ? `${spotsLeft} spots left of ${event.capacity_limit}`
                      : spotsLeft === 0
                        ? 'Event is full'
                        : `${event.capacity_limit} max capacity`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="bg-white rounded-lg shadow-sm p-5 space-y-3">
            {event.visibility === 'public' && (
              <button
                onClick={() => joinRequestMutation.mutate()}
                disabled={joinRequestMutation.isPending}
                className="w-full px-4 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium disabled:opacity-50 transition-colors text-sm"
              >
                {joinRequestMutation.isPending
                  ? 'Requesting...'
                  : 'Request to join'}
              </button>
            )}

            <button
              onClick={() => router.push(`/event/${id}/invite`)}
              className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
              Invite friends
            </button>

            <button
              onClick={() => router.push(`/event/${id}/gallery`)}
              className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm"
            >
              View gallery
            </button>

            <button
              onClick={() => router.push(`/chat/${id}`)}
              className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm"
            >
              View chat
            </button>

            <div className="border-t pt-3 flex gap-2">
              <button
                onClick={() => setShowReportModal(true)}
                className="flex-1 px-4 py-2 text-gray-500 text-xs hover:text-red-600 transition-colors"
              >
                Report
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteEventMutation.isPending}
                className="flex-1 px-4 py-2 text-red-500 text-xs hover:text-red-700 disabled:opacity-50 transition-colors"
              >
                Delete
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
              Report this event
            </h3>
            {/* Reason — maps to reports.reason */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3 text-sm"
            >
              <option value="">Select a reason...</option>
              <option value="spam">Spam or misleading</option>
              <option value="harassment">Harassment or bullying</option>
              <option value="inappropriate">Inappropriate content</option>
              <option value="safety">Safety concern</option>
              <option value="other">Other</option>
            </select>
            {/* Details — maps to reports.details (optional) */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional details{' '}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4 text-sm"
              placeholder="Provide any extra context that may help us review this report..."
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason('');
                  setReportDetails('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm"
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
