'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';

// TODO: Replace with actual API client import
// import { getCommunity } from '@gatherup/shared';

// Placeholder fetch until API is wired
async function getCommunity(id: string) {
  // TODO: Replace with actual API call - GET /api/communities/:id
  return null as any;
}

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: community, isLoading } = useQuery({
    queryKey: ['community', id],
    queryFn: () => getCommunity(id),
  });

  // TODO: Wire to API - POST /api/communities/:id/follow
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    alert(isFollowing ? 'Unfollowed community' : 'Following community!');
  };

  // TODO: Wire to API - POST /api/communities/:id/join
  const handleJoin = () => {
    alert('Join request sent! (API not yet wired)');
  };

  // TODO: Wire to API - POST /api/reports
  const handleReport = () => {
    // POST /api/reports { target_type: 'community', target_id: id, reason: reportReason, details: reportDetails }
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

  if (!community) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Community not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Cover image */}
      {community.cover_image_url ? (
        <div className="h-72 bg-gray-200 rounded-lg mb-6 overflow-hidden">
          <img
            src={community.cover_image_url}
            alt={community.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-r from-teal-400 to-teal-600 rounded-lg mb-6 flex items-center justify-center">
          <span className="text-5xl">👥</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main content - 2 cols */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Title row */}
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-900 flex-1">
                {community.name}
              </h1>
              <div className="flex gap-2 ml-4">
                {community.visibility === 'public' && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    Public
                  </span>
                )}
                {community.visibility === 'private' && (
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    Private
                  </span>
                )}
                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                  {community.category}
                </span>
              </div>
            </div>

            {/* Slug */}
            {community.slug && (
              <p className="text-sm text-gray-400 mb-4">
                gatherup.app/c/{community.slug}
              </p>
            )}

            {/* Description */}
            {community.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-3">
                  About
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {community.description}
                </p>
              </div>
            )}

            {/* Upcoming events section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-3">
                Upcoming events
              </h3>
              {/* TODO: Fetch and display community events */}
              {/* GET /api/events?community_id=:id&upcoming=true */}
              <div className="text-center py-8">
                <span className="text-3xl mb-2 block">📅</span>
                <p className="text-sm text-gray-500">
                  No upcoming events yet
                </p>
              </div>
            </div>

            {/* Members section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-3">
                Members
              </h3>
              {/* TODO: Fetch and display community members */}
              {/* GET /api/communities/:id/members */}
              <div className="text-center py-8">
                <span className="text-3xl mb-2 block">👤</span>
                <p className="text-sm text-gray-500">
                  Member list loading...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - 1 col */}
        <div className="space-y-4">
          {/* Details card */}
          <div className="bg-white rounded-lg shadow-sm p-5 space-y-4">
            {/* Member count */}
            <div className="flex gap-3">
              <span className="text-xl">👥</span>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {community.member_count || 0} members
                </p>
              </div>
            </div>

            {/* City */}
            {community.city && (
              <div className="flex gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {community.city}
                  </p>
                </div>
              </div>
            )}

            {/* Created date */}
            {community.created_at && (
              <div className="flex gap-3">
                <span className="text-xl">📅</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Created{' '}
                    {new Date(community.created_at).toLocaleDateString(
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

            {/* Discoverable indicator */}
            {community.is_discoverable && (
              <div className="flex gap-3">
                <span className="text-xl">🔍</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Discoverable
                  </p>
                  <p className="text-xs text-gray-500">
                    Shows up in search and discovery
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="bg-white rounded-lg shadow-sm p-5 space-y-3">
            <button
              onClick={handleJoin}
              className="w-full px-4 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium transition-colors text-sm"
            >
              Join community
            </button>

            <button
              onClick={handleFollow}
              className={`w-full px-4 py-2.5 border rounded-lg font-medium transition-colors text-sm ${
                isFollowing
                  ? 'border-teal-500 text-teal-700 bg-teal-50 hover:bg-teal-100'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>

            <div className="border-t pt-3">
              <button
                onClick={() => setShowReportModal(true)}
                className="w-full px-4 py-2 text-gray-500 text-xs hover:text-red-600 transition-colors"
              >
                Report community
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
              Report this community
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
