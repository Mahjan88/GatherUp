'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type SeriesCategory =
  | 'networking'
  | 'party'
  | 'workshop'
  | 'conference'
  | 'social'
  | 'sports'
  | 'other';
type SeriesVisibility = 'public' | 'private';
type OrganizerType = 'user' | 'community';
type RecurrenceHint = 'weekly' | 'biweekly' | 'monthly' | 'custom';

const CATEGORIES: { value: SeriesCategory; label: string }[] = [
  { value: 'networking', label: 'Networking' },
  { value: 'party', label: 'Party' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'conference', label: 'Conference' },
  { value: 'social', label: 'Social' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' },
];

const RECURRENCE_OPTIONS: { value: RecurrenceHint; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom' },
];

export default function CreateSeriesPage() {
  const router = useRouter();

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields matching event_series table
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SeriesCategory>('other');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [organizerType, setOrganizerType] = useState<OrganizerType>('user');
  const [communityId, setCommunityId] = useState('');
  const [visibility, setVisibility] = useState<SeriesVisibility>('public');
  const [recurrenceHint, setRecurrenceHint] =
    useState<RecurrenceHint | null>(null);

  const handleCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    // Auto-generate slug from title
    const generated = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(generated);
  };

  const handleSubmit = async () => {
    setError('');

    if (!title.trim()) {
      setError('Please enter a series title');
      return;
    }
    if (!slug.trim()) {
      setError('Please enter a URL slug');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: upload cover image to Supabase storage and get URL
      const coverImageUrl = null;

      // TODO: Call API to create event series
      // POST /api/series
      // {
      //   title: title.trim(),
      //   slug: slug.trim(),
      //   description: description.trim() || null,
      //   category,
      //   cover_image_url: coverImageUrl,
      //   organizer_type: organizerType,
      //   community_id: organizerType === 'community' ? communityId : null,
      //   visibility,
      //   recurrence_hint: recurrenceHint,
      //   settings: {},
      // }

      alert('Event series created! (API not yet wired)');
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Create event series
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Series basics
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
              placeholder="Give your event series a title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL slug <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-1">
                gatherup.app/s/
              </span>
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="my-event-series"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Only lowercase letters, numbers, and hyphens
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Tell people what this event series is about"
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
            Organizer
          </h3>

          {/* Organizer type */}
          <div className="space-y-2">
            {(
              [
                {
                  value: 'user',
                  label: 'Myself',
                  hint: 'You will be the organizer of this series',
                },
                {
                  value: 'community',
                  label: 'Community',
                  hint: 'Organize this series on behalf of a community',
                },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setOrganizerType(opt.value)}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  organizerType === opt.value
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p
                  className={`text-sm font-medium ${organizerType === opt.value ? 'text-teal-700' : 'text-gray-900'}`}
                >
                  {opt.label}
                </p>
                <p className="text-xs text-gray-500">{opt.hint}</p>
              </button>
            ))}
          </div>

          {/* Community picker (shown when organizer_type = 'community') */}
          {organizerType === 'community' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select community
              </label>
              {/* TODO: Replace with actual community picker dropdown */}
              {/* Fetch user's communities: GET /api/communities?role=admin */}
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={communityId}
                onChange={(e) => setCommunityId(e.target.value)}
              >
                <option value="">Choose a community...</option>
                {/* TODO: Populate with user's communities */}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                You must be an admin of the community
              </p>
            </div>
          )}

          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 pt-2">
            Privacy & schedule
          </h3>

          {/* Visibility */}
          <div className="space-y-2">
            {(
              [
                {
                  value: 'public',
                  label: 'Public',
                  hint: 'Anyone can see the series and its events',
                },
                {
                  value: 'private',
                  label: 'Private',
                  hint: 'Only subscribers can see content; others see basic info',
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

          {/* Recurrence hint */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recurrence
            </label>
            <div className="flex flex-wrap gap-2">
              {RECURRENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setRecurrenceHint(
                      recurrenceHint === opt.value ? null : opt.value
                    )
                  }
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    recurrenceHint === opt.value
                      ? 'bg-teal-500 text-white border-teal-500'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Optional hint for how often events occur in this series
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t">
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
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="px-8 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Creating...' : 'Create series'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
