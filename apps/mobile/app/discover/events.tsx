import { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/Header';
import EventCard, { EventCardData } from '../../components/EventCard';
import { ChipRow, EmptyState, SearchBar } from '../../components/ui';
import { colors, spacing, typography, GUTTER } from '../../theme';

interface EventItem {
  id: string;
  title: string;
  start_time: string;
  location: string | null;
  cover_image_url: string | null;
  category: string;
  member_count: number;
}

type TimeFilter = 'all' | 'today' | 'week' | 'weekend' | 'month';

const TIME_FILTERS: { value: TimeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'weekend', label: 'This Weekend' },
  { value: 'month', label: 'This Month' },
];

const PAGE_SIZE = 5;

// TODO: Replace with real API call
const ALL_EVENTS: EventItem[] = [];

// TODO: Replace with real API call
// GET /api/events?visibility=public&limit=5&offset=0
async function fetchEvents(params: {
  limit: number;
  offset: number;
}): Promise<EventItem[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 600));
  return ALL_EVENTS.slice(params.offset, params.offset + params.limit);
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Client-side time window filter until the API supports it. */
function matchesTime(date: Date, filter: TimeFilter): boolean {
  if (filter === 'all') return true;
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const t = date.getTime();
  if (filter === 'today') {
    return t >= startOfToday.getTime() && t < startOfToday.getTime() + DAY_MS;
  }
  if (filter === 'week') {
    return (
      t >= startOfToday.getTime() && t < startOfToday.getTime() + 7 * DAY_MS
    );
  }
  if (filter === 'weekend') {
    const daysToSat = (6 - now.getDay() + 7) % 7;
    const sat = startOfToday.getTime() + daysToSat * DAY_MS;
    return t >= sat && t < sat + 2 * DAY_MS;
  }
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

const capitalize = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

const toCardData = (item: EventItem): EventCardData => ({
  id: item.id,
  title: item.title,
  image: item.cover_image_url ?? '',
  date: new Date(item.start_time),
  location: item.location ?? '',
  hostName: '',
  rsvpStatus: 'none',
});

export default function SeeAllEventsScreen() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  // Initial load
  useState(() => {
    (async () => {
      try {
        const batch = await fetchEvents({ limit: PAGE_SIZE, offset: 0 });
        setEvents(batch);
        setOffset(batch.length);
        if (batch.length < PAGE_SIZE) setHasMore(false);
      } finally {
        setLoading(false);
      }
    })();
  });

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const batch = await fetchEvents({ limit: PAGE_SIZE, offset });
      setEvents((prev) => [...prev, ...batch]);
      setOffset((prev) => prev + batch.length);
      if (batch.length < PAGE_SIZE) setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [offset, loadingMore, hasMore]);

  // TODO: Move search + time filtering server-side
  const visibleEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter(
      (e) =>
        matchesTime(new Date(e.start_time), timeFilter) &&
        (!q ||
          e.title.toLowerCase().includes(q) ||
          (e.location ?? '').toLowerCase().includes(q))
    );
  }, [events, query, timeFilter]);

  const renderEvent = ({ item }: { item: EventItem }) => (
    <EventCard
      event={toCardData(item)}
      variant="feature"
      category={
        item.category !== 'other' ? capitalize(item.category) : undefined
      }
      goingCount={item.member_count}
    />
  );

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator color={colors.primary} />
        </View>
      );
    }
    if (!hasMore && visibleEvents.length > 0) {
      return <Text style={styles.endText}>You've reached the end</Text>;
    }
    return null;
  };

  const header = (
    <Header title="Events Near You" showBack>
      <SearchBar
        placeholder="Search events"
        value={query}
        onChangeText={setQuery}
        style={styles.search}
      />
      <ChipRow
        options={TIME_FILTERS}
        value={timeFilter}
        onChange={setTimeFilter}
      />
    </Header>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        {header}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {header}

      {visibleEvents.length > 0 ? (
        <FlatList
          data={visibleEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderEvent}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centered}>
          <EmptyState
            icon="calendar-outline"
            title="No events found"
            message="Try a different time range or check back later"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  search: {
    marginHorizontal: GUTTER,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 80,
  },
  list: {
    paddingHorizontal: GUTTER,
    paddingTop: spacing.sm,
    paddingBottom: 100,
  },
  footerLoader: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  endText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
