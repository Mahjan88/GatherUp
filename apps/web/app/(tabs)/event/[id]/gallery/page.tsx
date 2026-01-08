'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEventMedia, uploadEventMedia, deleteEventMedia } from '@gatherup/shared';

export default function EventGalleryPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: media, isLoading, refetch } = useQuery({
    queryKey: ['event-media', id],
    queryFn: () => getEventMedia(id),
  });

  const deleteMediaMutation = useMutation({
    mutationFn: deleteEventMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-media', id] });
      alert('Media deleted successfully');
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);

    try {
      await uploadEventMedia(id, file, file.name);
      await refetch();
      alert('Media uploaded successfully');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = (mediaId: string) => {
    if (confirm('Are you sure you want to delete this media?')) {
      deleteMediaMutation.mutate(mediaId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Event Gallery</h2>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Media'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : media && media.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="relative group aspect-square rounded-lg overflow-hidden bg-gray-200"
            >
              {item.media_type === 'image' ? (
                <img
                  src={item.media_url}
                  alt="Event media"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.media_url}
                  className="w-full h-full object-cover"
                  controls
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
              <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No media yet</p>
          <p className="text-gray-400 mt-2">
            Upload photos and videos to share with event members
          </p>
        </div>
      )}
    </div>
  );
}
