import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';

interface EventItem {
  id: string;
  title: string;
  start_time: string;
  location: string | null;
  cover_image_url: string | null;
  category: string;
  member_count: number;
}

const PAGE_SIZE = 5;

// TODO: Replace with real API call
// GET /api/events?visibility=public&limit=5&offset=0
async function fetchEvents(_params: {
  limit: number;
  offset: number;
}): Promise<EventItem[]> {
  return [];
}

export default function SeeAllEventsScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

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

  const renderEvent = ({ item }: { item: EventItem }) => (
    <TouchableOpacity
      style={styles.eventRow}
      onPress={() => router.push(`/event/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.eventThumb}>
        {item.cover_image_url ? (
          <Image
            source={{ uri: item.cover_image_url }}
            style={styles.eventThumbImage}
          />
        ) : (
          <Text style={styles.eventThumbPlaceholder}>📅</Text>
        )}
      </View>
      <View style={styles.eventInfo}>
        <Text style={styles.eventDate}>
          {new Date(item.start_time).toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
          {' · '}
          {new Date(item.start_time).toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </Text>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {item.title}
        </Text>
        {item.location && (
          <Text style={styles.eventLocation} numberOfLines={1}>
            {item.location}
          </Text>
        )}
        <View style={styles.eventMeta}>
          {item.category !== 'other' && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{item.category}</Text>
            </View>
          )}
          {item.member_count > 0 && (
            <Text style={styles.eventGoing}>
              {item.member_count} going
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator color="#14b8a6" />
        </View>
      );
    }
    if (!hasMore && events.length > 0) {
      return (
        <Text style={styles.endText}>You've reached the end</Text>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Events Near You" showBack />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#14b8a6" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Events Near You" showBack />

      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderEvent}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centered}>
          <Text style={styles.emptyEmoji}>📅</Text>
          <Text style={styles.emptyTitle}>No events found</Text>
          <Text style={styles.emptyText}>
            Try a different time range or check back later
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  list: {
    padding: 16,
  },
  // Event row (vertical list card)
  eventRow: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  eventThumb: {
    width: 100,
    height: 110,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventThumbImage: {
    width: '100%',
    height: '100%',
  },
  eventThumbPlaceholder: {
    fontSize: 28,
  },
  eventInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  eventDate: {
    fontSize: 11,
    fontWeight: '600',
    color: '#14b8a6',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    lineHeight: 18,
  },
  eventLocation: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'capitalize',
  },
  eventGoing: {
    fontSize: 10,
    color: '#475569',
  },
  // Footer
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endText: {
    textAlign: 'center',
    color: '#475569',
    fontSize: 13,
    paddingVertical: 16,
  },
  // Empty
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
});
