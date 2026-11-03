'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type {
  ImportedTicketmasterEvent,
  TicketmasterEvent,
} from '@gatherup/types';
import { api } from '../lib/api';

const isLink = (value: string) => /^https?:\/\//i.test(value.trim());

function formatWhen(e: TicketmasterEvent) {
  if (!e.localDate) return 'Date TBA';
  const date = new Date(`${e.localDate}T${e.localTime ?? '00:00:00'}`);
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...(e.localTime ? { hour: 'numeric', minute: '2-digit' } : {}),
  });
}

export function TicketmasterSearch({
  onSelect,
}: {
  onSelect: (imported: ImportedTicketmasterEvent) => void;
}) {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [submitted, setSubmitted] = useState<{
    keyword: string;
    city: string;
  } | null>(null);

  const { data, isFetching, error } = useQuery({
    queryKey: ['ticketmaster-search', submitted],
    queryFn: async () => {
      if (isLink(submitted!.keyword)) {
        const { data } = await api.ticketmaster.resolveUrl(submitted!.keyword);
        return data;
      }
      const { data } = await api.ticketmaster.search({
        keyword: submitted!.keyword,
        city: submitted!.city || undefined,
      });
      return { kind: 'search' as const, events: data };
    },
    enabled: !!submitted,
    staleTime: 5 * 60 * 1000,
  });

  // Links the event to external_events before prefilling the form
  const importMutation = useMutation({
    mutationFn: (e: TicketmasterEvent) => api.ticketmaster.importEvent(e.id),
    onSuccess: ({ data }) => onSelect(data),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setSubmitted({ keyword: keyword.trim(), city: city.trim() });
  };

  const results = data?.events ?? [];
  const heading =
    data?.kind === 'event'
      ? data.match
        ? 'Found the show from your link'
        : "We couldn't confirm the exact show. Pick it below."
      : data?.kind === 'artist'
        ? data.attraction
          ? `Upcoming shows for ${data.attraction.name}. Pick a date.`
          : 'No artist found for that link.'
        : null;
  const linkMode = isLink(keyword);

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Search, or paste a Ticketmaster link"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {!linkMode && (
          <input
            type="text"
            className="sm:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="City (optional)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        )}
        <button
          type="submit"
          disabled={!keyword.trim() || isFetching}
          className="px-5 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 disabled:opacity-50 transition-colors"
        >
          {isFetching ? 'Searching…' : 'Search'}
        </button>
      </form>

      {heading && !isFetching && (
        <p className="text-sm font-medium text-gray-700">{heading}</p>
      )}

      {(error || importMutation.error) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {((error || importMutation.error) as Error).message}
        </div>
      )}

      {submitted && !isFetching && !error && results.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-6">
          No upcoming events found. Try a different search.
        </p>
      )}

      <ul className="space-y-2">
        {results.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              onClick={() => importMutation.mutate(e)}
              disabled={importMutation.isPending}
              className="w-full disabled:opacity-60 flex gap-3 p-3 border border-gray-200 rounded-lg text-left hover:border-teal-500 hover:bg-teal-50 transition-colors"
            >
              {e.imageUrl ? (
                <img
                  src={e.imageUrl}
                  alt=""
                  className="w-24 h-16 object-cover rounded-md flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-16 bg-gray-100 rounded-md flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{e.name}</p>
                <p className="text-sm text-gray-600">{formatWhen(e)}</p>
                <p className="text-sm text-gray-500 truncate">
                  {[e.venueName, e.cityRegion].filter(Boolean).join(' · ')}
                </p>
                {importMutation.isPending &&
                  importMutation.variables?.id === e.id && (
                    <p className="text-xs text-teal-600 mt-1">Importing…</p>
                  )}
              </div>
            </button>
          </li>
        ))}
      </ul>

      <p className="text-xs text-gray-400 text-center">
        Event data provided by Ticketmaster
      </p>
    </div>
  );
}
