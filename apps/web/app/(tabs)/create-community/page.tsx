'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type CommunityCategory =
  | 'networking'
  | 'party'
  | 'workshop'
  | 'conference'
  | 'social'
  | 'sports'
  | 'other';
type CommunityVisibility = 'public' | 'private';

const CATEGORIES: { value: CommunityCategory; label: string }[] = [
  { value: 'networking', label: 'Networking' },
  { value: 'party', label: 'Party' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'conference', label: 'Conference' },
  { value: 'social', label: 'Social' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' },
];

export default function CreateCommunityPage() {
  const router = useRouter();

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields matching communities table
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CommunityCategory>('social');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [city, setCity] = useState('');
  const [visibility, setVisibility] = useState<CommunityVisibility>('public');
  const [isDiscoverable, setIsDiscoverable] = useState(true);

  const handleCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-generate slug from name
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

    if (!name.trim()) {
      setError('Please enter a community name');
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

      // TODO: Call API to create community
      // POST /api/communities
      // {
      //   name: name.trim(),
      //   slug: slug.trim(),
      //   description: description.trim() || null,
      //   category,
      //   cover_image_url: coverImageUrl,
      //   city: city.trim() || null,
      //   visibility,
      //   is_discoverable: isDiscoverable,
      //   settings: {},
      // }

      alert('Community created! (API not yet wired)');
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
        Create community
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Community basics
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

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Give your community a name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL slug <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-1">
                gatherup.app/c/
              </span>
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="my-community"
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
              placeholder="Tell people what this community is about"
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

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="e.g., San Francisco, CA"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 pt-2">
            Privacy & discovery
          </h3>

          {/* Visibility */}
          <div className="space-y-2">
            {(
              [
                {
                  value: 'public',
                  label: 'Public',
                  hint: 'Anyone can see the community and its events',
                },
                {
                  value: 'private',
                  label: 'Private',
                  hint: 'Only members can see content; others see basic info',
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

          {/* Discoverable toggle */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Show in discovery
              </p>
              <p className="text-xs text-gray-500">
                Allow this community to appear in search and discovery feeds
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isDiscoverable}
                onChange={(e) => setIsDiscoverable(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
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
                {isSubmitting ? 'Creating...' : 'Create community'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
