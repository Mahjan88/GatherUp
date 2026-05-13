'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type InviteStatus = 'sent' | 'accepted' | 'declined' | 'expired' | 'cancelled';

interface PendingInvite {
  id: string;
  invited_email: string | null;
  invited_phone: string | null;
  invited_user_id: string | null;
  status: InviteStatus;
  token: string;
  created_at: string;
}

const STATUS_BADGE: Record<
  InviteStatus,
  { label: string; className: string }
> = {
  sent: {
    label: 'Sent',
    className: 'bg-yellow-100 text-yellow-800',
  },
  accepted: {
    label: 'Accepted',
    className: 'bg-green-100 text-green-800',
  },
  declined: {
    label: 'Declined',
    className: 'bg-red-100 text-red-800',
  },
  expired: {
    label: 'Expired',
    className: 'bg-gray-100 text-gray-600',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-500',
  },
};

// TODO: Replace with real data from GET /api/events/:id/invitations
const PLACEHOLDER_INVITES: PendingInvite[] = [
  {
    id: '1',
    invited_email: 'alice@example.com',
    invited_phone: null,
    invited_user_id: null,
    status: 'sent',
    token: 'abc123',
    created_at: '2026-05-08T10:00:00Z',
  },
  {
    id: '2',
    invited_email: null,
    invited_phone: '+1 555-0199',
    invited_user_id: null,
    status: 'accepted',
    token: 'def456',
    created_at: '2026-05-07T14:30:00Z',
  },
  {
    id: '3',
    invited_email: 'bob@example.com',
    invited_phone: null,
    invited_user_id: null,
    status: 'declined',
    token: 'ghi789',
    created_at: '2026-05-06T09:15:00Z',
  },
];

type TabKey = 'email' | 'phone' | 'link';

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [activeTab, setActiveTab] = useState<TabKey>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [invitations, setInvitations] =
    useState<PendingInvite[]>(PLACEHOLDER_INVITES);

  // TODO: Wire to POST /api/events/:eventId/invitations { invited_email }
  const handleEmailInvite = () => {
    if (!email.trim()) return;
    const newInvite: PendingInvite = {
      id: crypto.randomUUID(),
      invited_email: email,
      invited_phone: null,
      invited_user_id: null,
      status: 'sent',
      token: crypto.randomUUID().slice(0, 8),
      created_at: new Date().toISOString(),
    };
    setInvitations((prev) => [newInvite, ...prev]);
    setEmail('');
  };

  // TODO: Wire to POST /api/events/:eventId/invitations { invited_phone }
  const handlePhoneInvite = () => {
    if (!phone.trim()) return;
    const newInvite: PendingInvite = {
      id: crypto.randomUUID(),
      invited_email: null,
      invited_phone: phone,
      invited_user_id: null,
      status: 'sent',
      token: crypto.randomUUID().slice(0, 8),
      created_at: new Date().toISOString(),
    };
    setInvitations((prev) => [newInvite, ...prev]);
    setPhone('');
  };

  // TODO: Wire to POST /api/events/:eventId/invitations/link to generate a server token
  const handleGenerateLink = () => {
    const token = crypto.randomUUID().slice(0, 12);
    const link = `${window.location.origin}/invite/${token}`;
    setInviteLink(link);
    setLinkCopied(false);
  };

  const handleCopyLink = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Fallback: select input text
    }
  };

  // TODO: Wire to PATCH /api/events/:eventId/invitations/:inviteId { status: 'cancelled' }
  const handleCancelInvite = (inviteId: string) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === inviteId ? { ...inv, status: 'cancelled' as const } : inv
      )
    );
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'email', label: 'By email' },
    { key: 'phone', label: 'By phone' },
    { key: 'link', label: 'By link' },
  ];

  return (
    <div className="max-w-2xl mx-auto pb-8">
      {/* Back button */}
      <button
        onClick={() => router.push(`/event/${eventId}`)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600 mb-6 transition-colors"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to event
      </button>

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {/* TODO: Replace with real event title from GET /api/events/:eventId */}
        Invite people to this event
      </h1>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-teal-600 border-b-2 border-teal-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Email tab */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Email address
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailInvite()}
                  placeholder="friend@example.com"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </label>
              <button
                onClick={handleEmailInvite}
                disabled={!email.trim()}
                className="w-full px-4 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium disabled:opacity-50 transition-colors text-sm"
              >
                Send invite
              </button>
            </div>
          )}

          {/* Phone tab */}
          {activeTab === 'phone' && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Phone number
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePhoneInvite()}
                  placeholder="+1 555-0100"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </label>
              <button
                onClick={handlePhoneInvite}
                disabled={!phone.trim()}
                className="w-full px-4 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium disabled:opacity-50 transition-colors text-sm"
              >
                Send invite
              </button>
            </div>
          )}

          {/* Link tab */}
          {activeTab === 'link' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Generate a shareable invite link. Anyone with this link can
                join the event.
              </p>
              {inviteLink ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteLink}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      linkCopied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-teal-500 text-white hover:bg-teal-600'
                    }`}
                  >
                    {linkCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGenerateLink}
                  className="w-full px-4 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium transition-colors text-sm"
                >
                  Generate invite link
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pending invitations */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Pending invitations
          </h2>
        </div>

        {invitations.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-gray-400 text-sm">
              No invitations sent yet.
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {invitations.map((invite) => {
              const badge = STATUS_BADGE[invite.status];
              const displayName =
                invite.invited_email ||
                invite.invited_phone ||
                'Unknown';
              const isCancellable = invite.status === 'sent';

              return (
                <li
                  key={invite.id}
                  className="px-5 py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-medium shrink-0">
                      {invite.invited_email
                        ? invite.invited_email[0].toUpperCase()
                        : '#'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(invite.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                    {isCancellable && (
                      <button
                        onClick={() => handleCancelInvite(invite.id)}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
