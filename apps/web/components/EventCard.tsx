import Link from 'next/link';
import { EventWithHost } from '@gatherup/shared';

interface EventCardProps {
  event: EventWithHost;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/event/${event.id}`}
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      {event.cover_image_url && <div className="h-48 bg-gray-200"></div>}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">
            {event.title}
          </h3>
          {event.visibility === 'public' && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
              Public
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-2">
          📅 {new Date(event.start_time).toLocaleDateString()}
        </p>
        {event.location && (
          <p className="text-gray-600 text-sm mb-2">📍 {event.location}</p>
        )}
        <p className="text-gray-600 text-sm">
          👥 {event.member_count || 0} members
        </p>
      </div>
    </Link>
  );
}
