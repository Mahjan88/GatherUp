import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiError } from '@gatherup/api-client';
import type {
  ImportedTicketmasterEvent,
  TicketmasterEvent,
} from '@gatherup/types';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { getUserLocation } from '../lib/location';
import { Button, TextField } from './ui';
import { colors, radius, spacing, typography } from '../theme';

const isLink = (value: string) => /^https?:\/\//i.test(value.trim());

const isUnauthorized = (error: unknown) =>
  error instanceof ApiError && error.statusCode === 401;

function formatWhen(e: TicketmasterEvent) {
  if (!e.localDate) return 'Date TBA';
  const date = new Date(`${e.localDate}T${e.localTime ?? '00:00:00'}`);
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...(e.localTime ? { hour: 'numeric', minute: '2-digit' } : {}),
  });
}

export default function TicketmasterSearch({
  onSelect,
}: {
  onSelect: (imported: ImportedTicketmasterEvent) => void;
}) {
  const { session, profile, signOut } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [submitted, setSubmitted] = useState<{
    keyword: string;
    city: string;
  } | null>(null);

  // Asked once when this opens, so results can be sorted nearest first
  const location = useQuery({
    queryKey: ['user-location', profile?.city ?? null],
    queryFn: () => getUserLocation(profile?.city),
    enabled: !!session,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
  const near = location.data ?? null;

  const { data, isFetching, error } = useQuery({
    queryKey: ['ticketmaster-search', submitted, near],
    queryFn: async () => {
      if (isLink(submitted!.keyword)) {
        const { data } = await api.ticketmaster.resolveUrl(
          submitted!.keyword,
          near
        );
        return data;
      }
      const { data } = await api.ticketmaster.search({
        keyword: submitted!.keyword,
        city: submitted!.city || undefined,
        near,
      });
      return { kind: 'search' as const, events: data };
    },
    // Wait for the location so the list isn't fetched twice
    enabled: !!submitted && !location.isPending,
    staleTime: 5 * 60 * 1000,
  });

  // Links the event to external_events before prefilling the form
  const importMutation = useMutation({
    mutationFn: (e: TicketmasterEvent) => api.ticketmaster.importEvent(e.id),
    onSuccess: ({ data }) => onSelect(data),
  });

  const search = () => {
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
        : near && results.length > 1
          ? near.source === 'device'
            ? 'Nearest to you first'
            : `Nearest to ${profile?.city} first`
          : null;
  const linkMode = isLink(keyword);
  const anyError = error || importMutation.error;

  // Every Ticketmaster route needs an account. signOut also ends guest mode,
  // which sends the user to welcome to sign in or sign up.
  if (!session || isUnauthorized(anyError)) {
    return (
      <View style={styles.signIn}>
        <Text style={styles.signInTitle}>
          {session
            ? 'Your session has expired'
            : 'Sign in to import from Ticketmaster'}
        </Text>
        <Text style={styles.signInText}>
          You need a GatherUp account to find shows and create events.
        </Text>
        <Button
          label={session ? 'Sign in again' : 'Sign in or sign up'}
          onPress={signOut}
          fullWidth
        />
      </View>
    );
  }

  return (
    <View>
      <TextField
        icon="search-outline"
        placeholder="Search, or paste a Ticketmaster link"
        value={keyword}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setKeyword}
        onSubmitEditing={search}
        returnKeyType="search"
      />
      {!linkMode && (
        <TextField
          icon="map-outline"
          placeholder="City (optional)"
          value={city}
          onChangeText={setCity}
          onSubmitEditing={search}
          returnKeyType="search"
        />
      )}
      <Button
        label={linkMode ? 'Find this event' : 'Search Ticketmaster'}
        onPress={search}
        disabled={!keyword.trim()}
        loading={isFetching || (!!submitted && location.isPending)}
        fullWidth
      />

      {isFetching && (
        <ActivityIndicator style={styles.status} color={colors.primary} />
      )}

      {!!heading && !isFetching && (
        <Text style={[styles.status, styles.headingText]}>{heading}</Text>
      )}

      {!!anyError && (
        <Text style={[styles.status, styles.errorText]}>
          {(anyError as Error).message}
        </Text>
      )}

      {submitted && !isFetching && !error && results.length === 0 && (
        <Text style={[styles.status, styles.emptyText]}>
          No upcoming events found. Try a different search.
        </Text>
      )}

      <View style={styles.results}>
        {results.map((e) => (
          <TouchableOpacity
            key={e.id}
            style={styles.result}
            onPress={() => importMutation.mutate(e)}
            disabled={importMutation.isPending}
            activeOpacity={0.8}
          >
            {e.imageUrl ? (
              <Image source={{ uri: e.imageUrl }} style={styles.thumb} />
            ) : (
              <View style={styles.thumb} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.resultTitle} numberOfLines={2}>
                {e.name}
              </Text>
              <Text style={styles.resultMeta}>{formatWhen(e)}</Text>
              <Text style={styles.resultMeta} numberOfLines={1}>
                {[
                  e.venueName,
                  e.cityRegion,
                  e.distanceMiles !== null &&
                    `${Math.round(e.distanceMiles).toLocaleString()} mi`,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            </View>
            {importMutation.isPending &&
              importMutation.variables?.id === e.id && (
                <ActivityIndicator color={colors.primary} />
              )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.attribution}>
        Event data provided by Ticketmaster
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  signIn: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  signInTitle: {
    ...typography.label,
    textAlign: 'center',
  },
  signInText: {
    ...typography.bodySecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  status: {
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  errorText: {
    ...typography.bodySecondary,
    color: colors.danger,
  },
  headingText: {
    ...typography.label,
  },
  emptyText: {
    ...typography.bodySecondary,
  },
  results: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  thumb: {
    width: 88,
    height: 56,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
  },
  resultTitle: {
    ...typography.label,
  },
  resultMeta: {
    ...typography.caption,
    marginTop: 2,
  },
  attribution: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
