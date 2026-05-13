'use client';

import { useState } from 'react';

interface BlockedUser {
  blocked_user_id: string;
  display_name: string;
  created_at: string;
}

// TODO: Replace with real data from GET /api/users/me/blocked
const PLACEHOLDER_BLOCKED: BlockedUser[] = [
  {
    blocked_user_id: 'u1',
    display_name: 'Spammy Account',
    created_at: '2026-04-20T08:00:00Z',
  },
  {
    blocked_user_id: 'u2',
    display_name: 'Rude Person',
    created_at: '2026-03-15T14:30:00Z',
  },
];

export default function BlockedUsersPage() {
  // TODO: Replace with useQuery({ queryKey: ['blocked-users'], queryFn: ... })
  const [blockedUsers, setBlockedUsers] =
    useState<BlockedUser[]>(PLACEHOLDER_BLOCKED);
  const [confirmUnblockId, setConfirmUnblockId] = useState<string | null>(
    null
  );

  // TODO: Wire to DELETE /api/users/me/blocked/:userId
  const handleUnblock = (userId: string) => {
    setBlockedUsers((prev) =>
      prev.filter((u) => u.blocked_user_id !== userId)
    );
    setConfirmUnblockId(null);
  };

  return (
    <div className="max-w-2xl mx-auto pb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Blocked users
      </h1>

      {blockedUsers.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">
            You haven&apos;t blocked anyone.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm divide-y">
          {blockedUsers.map((user) => (
            <div
              key={user.blocked_user_id}
              className="px-5 py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
                  {user.display_name[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.display_name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Blocked on{' '}
                    {new Date(user.created_at).toLocaleDateString(
                      undefined,
                      {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  setConfirmUnblockId(user.blocked_user_id)
                }
                className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Unblock
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirm unblock dialog */}
      {confirmUnblockId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unblock user?
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              This user will be able to see your profile and events
              again. They will not be notified.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmUnblockId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUnblock(confirmUnblockId)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
              >
                Unblock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
