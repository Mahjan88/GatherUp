'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEvent, getCurrentUser } from '@gatherup/shared';

type FormStep = 1 | 2 | 3;
type EventCategory =
  | 'networking'
  | 'party'
  | 'workshop'
  | 'conference'
  | 'social'
  | 'sports'
  | 'other';
type EventVisibility = 'public' | 'private' | 'invite_only';
type OrganizerType = 'user' | 'community';

const CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'networking', label: 'Networking' },
  { value: 'party', label: 'Party' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'conference', label: 'Conference' },
  { value: 'social', label: 'Social' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' },
];

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
  'UTC',
];

export default function CreateEventPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<FormStep>(1);
  const [error, setError] = useState('');

  // Step 1: Basics
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('social');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');

  // Step 1: When & Where
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'
  );
  const [isOnline, setIsOnline] = useState(false);
  const [virtualLink, setVirtualLink] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [cityRegion, setCityRegion] = useState('');

  // Step 2: Guests & Privacy
  const [visibility, setVisibility] = useState<EventVisibility>('private');
  const [capacityLimit, setCapacityLimit] = useState('');
  const [organizerType, setOrganizerType] = useState<OrganizerType>('user');
  // TODO: fetch user's communities from API
  const [communityId, setCommunityId] = useState('');
  // TODO: fetch user's series from API
  const [seriesId, setSeriesId] = useState('');

  // Step 3: Advanced (stored in settings JSONB)
  const [chatEnabled, setChatEnabled] = useState(true);
  const [galleryForAttendeesOnly, setGalleryForAttendeesOnly] = useState(true);
  const [rsvpRequired, setRsvpRequired] = useState(true);
  const [allowInviteOthers, setAllowInviteOthers] = useState(false);
  const [feedbackEnabled, setFeedbackEnabled] = useState(true);
  const [reminder24h, setReminder24h] = useState(true);
  const [reminder1h, setReminder1h] = useState(true);

  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['my-hosted-events'] });
      router.push('/');
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  const handleCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setError('');

    if (!title.trim()) {
      setError('Please enter an event title');
      setStep(1);
      return;
    }
    if (!startTime) {
      setError('Please select a start time');
      setStep(1);
      return;
    }

    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      // TODO: upload cover image to Supabase storage and get URL
      const coverImageUrl = null;

      await createEventMutation.mutateAsync({
        host_id: user.id,
        title: title.trim(),
        tagline: tagline.trim() || null,
        description: description.trim() || null,
        category,
        cover_image_url: coverImageUrl,
        start_time: new Date(startTime).toISOString(),
        end_time: endTime ? new Date(endTime).toISOString() : null,
        timezone,
        is_online: isOnline,
        virtual_link: isOnline ? virtualLink.trim() || null : null,
        location: location.trim() || null,
        address: address.trim() || null,
        city_region: cityRegion.trim() || null,
        visibility,
        capacity_limit: capacityLimit ? parseInt(capacityLimit, 10) : null,
        organizer_type: organizerType,
        community_id: organizerType === 'community' && communityId ? communityId : null,
        series_id: seriesId || null,
        settings: {
          chat_enabled: chatEnabled,
          gallery_for_attendees_only: galleryForAttendeesOnly,
          rsvp_required: rsvpRequired,
          allow_invite_others: allowInviteOthers,
          feedback_enabled: feedbackEnabled,
          reminders: {
            '24h': reminder24h,
            '1h': reminder1h,
          },
        },
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const stepLabels = ['Basics', 'Guests & privacy', 'Advanced'];

  return (
    <div className="max-w-2xl mx-auto pb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create event</h2>

      {/* Step tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
        {stepLabels.map((label, i) => (
          <button
            key={label}
            onClick={() => setStep((i + 1) as FormStep)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              step === i + 1
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* ─── STEP 1: BASICS ─── */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Event basics
            </h3>

            {/* Cover image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover image
              </label>
              <div
                className="relative h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors overflow-hidden"
                onClick={() =>
                  document.getElementById('cover-upload')?.click()
                }
              >
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-2xl">📷</span>
                    <p className="text-sm text-gray-500 mt-1">
                      Click to upload
                    </p>
                  </div>
                )}
              </div>
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverImage}
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Give your event a name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tagline
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="A short catchy subtitle"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Tell people about your event"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      category === cat.value
                        ? 'bg-teal-500 text-white border-teal-500'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 pt-2">
              When & where
            </h3>

            {/* Start / End */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End time
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Online toggle */}
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Online event
                </p>
                <p className="text-xs text-gray-500">
                  This event takes place virtually
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isOnline}
                  onChange={(e) => setIsOnline(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
              </label>
            </div>

            {/* Virtual link (shown when online) */}
            {isOnline && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting link
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="https://zoom.us/j/..."
                  value={virtualLink}
                  onChange={(e) => setVirtualLink(e.target.value)}
                />
              </div>
            )}

            {/* Physical location (shown when not online-only) */}
            {!isOnline && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., The Grand Ballroom"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street address
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="123 Main St"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City / Region
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="San Francisco, CA"
                    value={cityRegion}
                    onChange={(e) => setCityRegion(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium transition-colors"
              >
                Next: Guests & privacy
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 2: GUESTS & PRIVACY ─── */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Hosting as
            </h3>

            {/* Organizer type */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrganizerType('user')}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  organizerType === 'user'
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium text-gray-900">Myself</p>
                <p className="text-xs text-gray-500 mt-1">
                  Host as your personal profile
                </p>
              </button>
              <button
                type="button"
                onClick={() => setOrganizerType('community')}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  organizerType === 'community'
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium text-gray-900">A community</p>
                <p className="text-xs text-gray-500 mt-1">
                  Host on behalf of a community
                </p>
              </button>
            </div>

            {/* Community picker (shown when organizing as community) */}
            {organizerType === 'community' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select community
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                  value={communityId}
                  onChange={(e) => setCommunityId(e.target.value)}
                >
                  <option value="">Choose a community...</option>
                  {/* TODO: populate from API - user's owned/admin communities */}
                </select>
              </div>
            )}

            {/* Series picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Part of a series{' '}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                value={seriesId}
                onChange={(e) => setSeriesId(e.target.value)}
              >
                <option value="">Standalone event</option>
                {/* TODO: populate from API - user's series */}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Link this event to a recurring series so subscribers get
                notified
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 pt-2">
              Privacy & access
            </h3>

            {/* Visibility */}
            <div className="space-y-2">
              {(
                [
                  {
                    value: 'public',
                    label: 'Public',
                    hint: 'Anyone can find and join',
                  },
                  {
                    value: 'private',
                    label: 'Private',
                    hint: 'Only people with the link can see it',
                  },
                  {
                    value: 'invite_only',
                    label: 'Invite only',
                    hint: 'Only invited guests can see and attend',
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setVisibility(opt.value)}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    visibility === opt.value
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${visibility === opt.value ? 'text-teal-700' : 'text-gray-900'}`}
                  >
                    {opt.label}
                  </p>
                  <p className="text-xs text-gray-500">{opt.hint}</p>
                </button>
              ))}
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity limit{' '}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Leave empty for unlimited"
                value={capacityLimit}
                onChange={(e) => setCapacityLimit(e.target.value)}
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium transition-colors"
              >
                Next: Advanced
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: ADVANCED ─── */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Event settings
            </h3>

            {/* Toggle rows */}
            {[
              {
                label: 'Event chat',
                hint: 'Allow attendees to chat in the event',
                value: chatEnabled,
                onChange: setChatEnabled,
              },
              {
                label: 'Gallery for attendees only',
                hint: 'Only joined members can see photos & videos',
                value: galleryForAttendeesOnly,
                onChange: setGalleryForAttendeesOnly,
              },
              {
                label: 'RSVP required',
                hint: 'Guests must confirm attendance',
                value: rsvpRequired,
                onChange: setRsvpRequired,
              },
              {
                label: 'Allow guests to invite others',
                hint: 'Attendees can share the event with friends',
                value: allowInviteOthers,
                onChange: setAllowInviteOthers,
              },
              {
                label: 'Post-event feedback',
                hint: 'Enable reviews after the event ends',
                value: feedbackEnabled,
                onChange: setFeedbackEnabled,
              },
            ].map((toggle) => (
              <div
                key={toggle.label}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {toggle.label}
                  </p>
                  <p className="text-xs text-gray-500">{toggle.hint}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={toggle.value}
                    onChange={(e) => toggle.onChange(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>
            ))}

            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 pt-2">
              Reminders
            </h3>

            <div className="flex gap-4">
              {[
                {
                  label: '24 hours before',
                  value: reminder24h,
                  onChange: setReminder24h,
                },
                {
                  label: '1 hour before',
                  value: reminder1h,
                  onChange: setReminder1h,
                },
              ].map((rem) => (
                <label
                  key={rem.label}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                    rem.value
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-teal-500 focus:ring-teal-500 border-gray-300 rounded"
                    checked={rem.value}
                    onChange={(e) => rem.onChange(e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">{rem.label}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Back
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={createEventMutation.isPending}
                  onClick={handleSubmit}
                  className="px-8 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium disabled:opacity-50 transition-colors"
                >
                  {createEventMutation.isPending
                    ? 'Creating...'
                    : 'Create event'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
