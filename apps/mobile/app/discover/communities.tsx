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

interface CommunityItem {
  id: string;
  name: string;
  city: string | null;
  category: string;
  member_count: number;
  cover_image_url: string | null;
  description: string | null;
}

const PAGE_SIZE = 5;

// TODO: Replace with real API call
// GET /api/communities?nearby=true&limit=5&offset=0
async function fetchCommunities(_params: {
  limit: number;
  offset: number;
}): Promise<CommunityItem[]> {
  return [];
}

export default function SeeAllCommunitiesScreen() {
  const router = useRouter();
  const [communities, setCommunities] = useState<CommunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  // Initial load
  useState(() => {
    (async () => {
      try {
        const batch = await fetchCommunities({ limit: PAGE_SIZE, offset: 0 });
        setCommunities(batch);
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
      const batch = await fetchCommunities({ limit: PAGE_SIZE, offset });
      setCommunities((prev) => [...prev, ...batch]);
      setOffset((prev) => prev + batch.length);
      if (batch.length < PAGE_SIZE) setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [offset, loadingMore, hasMore]);

  const renderCommunity = ({ item }: { item: CommunityItem }) => (
    <TouchableOpacity
      style={styles.communityRow}
      onPress={() => router.push(`/community/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.communityThumb}>
        {item.cover_image_url ? (
          <Image
            source={{ uri: item.cover_image_url }}
            style={styles.communityThumbImage}
          />
        ) : (
          <Text style={styles.communityThumbText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>
      <View style={styles.communityInfo}>
        <Text style={styles.communityName} numberOfLines={1}>
          {item.name}
        </Text>
        {item.city && (
          <Text style={styles.communityCity} numberOfLines={1}>
            {item.city}
          </Text>
        )}
        {item.description && (
          <Text style={styles.communityDesc} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <View style={styles.communityMeta}>
          <Text style={styles.communityMembers}>
            {item.member_count} members
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
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
    if (!hasMore && communities.length > 0) {
      return (
        <Text style={styles.endText}>You've reached the end</Text>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Communities Near You" showBack />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#14b8a6" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Communities Near You" showBack />

      {communities.length > 0 ? (
        <FlatList
          data={communities}
          keyExtractor={(item) => item.id}
          renderItem={renderCommunity}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centered}>
          <Text style={styles.emptyEmoji}>🏘️</Text>
          <Text style={styles.emptyTitle}>No communities found nearby</Text>
          <Text style={styles.emptyText}>
            Update your location in settings to discover local communities
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
  // Community row (vertical list card)
  communityRow: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  communityThumb: {
    width: 90,
    height: 100,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityThumbImage: {
    width: '100%',
    height: '100%',
  },
  communityThumbText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#14b8a6',
  },
  communityInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  communityName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  communityCity: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  communityDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 6,
  },
  communityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  communityMembers: {
    fontSize: 11,
    color: '#475569',
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
