'use client';

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

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEventMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
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

  return (
    <div className="max-w-4xl mx-auto">
      {event.cover_image_url && (
        <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900 flex-1">
            {event.title}
          </h1>
          {event.visibility === 'public' && (
            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              Public
            </span>
          )}
        </div>

        {event.description && (
          <p className="text-gray-700 mb-6 text-lg">{event.description}</p>
        )}

        <div className="space-y-4 mb-8">
          <div className="flex items-center text-gray-700">
            <span className="text-2xl mr-3">📅</span>
            <div>
              <p className="font-medium">Date & Time</p>
              <p>{new Date(event.start_time).toLocaleString()}</p>
            </div>
          </div>

          {event.location && (
            <div className="flex items-center text-gray-700">
              <span className="text-2xl mr-3">📍</span>
              <div>
                <p className="font-medium">Location</p>
                <p>{event.location}</p>
              </div>
            </div>
          )}

          <div className="flex items-center text-gray-700">
            <span className="text-2xl mr-3">👤</span>
            <div>
              <p className="font-medium">Host</p>
              <p>{event.host.first_name}{event.host.last_name ? ` ${event.host.last_name}` : ''}</p>
            </div>
          </div>

          <div className="flex items-center text-gray-700">
            <span className="text-2xl mr-3">👥</span>
            <div>
              <p className="font-medium">Members</p>
              <p>{event.member_count || 0} people</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push(`/chat/${id}`)}
            className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
          >
            View Chat
          </button>

          <button
            onClick={() => router.push(`/event/${id}/gallery`)}
            className="w-full px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 font-medium"
          >
            View Gallery
          </button>

          {event.visibility === 'public' && (
            <button
              onClick={() => joinRequestMutation.mutate()}
              disabled={joinRequestMutation.isPending}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
            >
              {joinRequestMutation.isPending ? 'Requesting...' : 'Request to Join'}
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={deleteEventMutation.isPending}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
          >
            {deleteEventMutation.isPending ? 'Deleting...' : 'Delete Event'}
          </button>
        </div>
      </div>
    </div>
  );
}
