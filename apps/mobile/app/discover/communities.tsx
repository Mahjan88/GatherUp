import { useState, useCallback, useMemo } from 'react';
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
import {
  Avatar,
  Button,
  ChipRow,
  EmptyState,
  Ionicons,
  SearchBar,
} from '../../components/ui';
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
  GUTTER,
} from '../../theme';

interface CommunityItem {
  id: string;
  name: string;
  city: string | null;
  category: string;
  member_count: number;
  cover_image_url: string | null;
  description: string | null;
}

type CommunityFilter = 'for-you' | 'nearby' | 'popular' | 'new';

const FILTERS: { value: CommunityFilter; label: string }[] = [
  { value: 'for-you', label: 'For You' },
  { value: 'nearby', label: 'Nearby' },
  { value: 'popular', label: 'Popular' },
  { value: 'new', label: 'New' },
];

const PAGE_SIZE = 5;

// TODO: Replace with real API call
const ALL_COMMUNITIES: CommunityItem[] = [];

// TODO: Replace with real API call
// GET /api/communities?nearby=true&limit=5&offset=0
async function fetchCommunities(params: {
  limit: number;
  offset: number;
}): Promise<CommunityItem[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 600));
  return ALL_COMMUNITIES.slice(params.offset, params.offset + params.limit);
}

const formatCount = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : `${n}`;

const AVATAR_SIZE = 52;

function CommunityCard({
  item,
  joined,
  onPress,
  onJoin,
}: {
  item: CommunityItem;
  joined: boolean;
  onPress: () => void;
  onJoin: () => void;
}) {
  const meta = [`${formatCount(item.member_count)} members`, item.city]
    .filter(Boolean)
    .join(' · ');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {item.cover_image_url ? (
        <Image source={{ uri: item.cover_image_url }} style={styles.banner} />
      ) : (
        <View style={[styles.banner, styles.bannerFallback]}>
          <Ionicons name="people-outline" size={28} color={colors.primary} />
        </View>
      )}
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Avatar name={item.name} size={AVATAR_SIZE} style={styles.avatar} />
          <Button
            label={joined ? 'Joined' : 'Join'}
            size="sm"
            variant={joined ? 'outline' : 'primary'}
            onPress={onJoin}
          />
        </View>
        <Text style={typography.h3} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[typography.caption, { marginTop: 2 }]} numberOfLines={1}>
          {meta}
        </Text>
        {!!item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function SeeAllCommunitiesScreen() {
  const router = useRouter();
  const [communities, setCommunities] = useState<CommunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CommunityFilter>('nearby');
  // TODO: Replace with real membership state from API
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());

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

  const toggleJoin = (communityId: string) => {
    // TODO: Call API POST/DELETE /api/communities/:id/join
    setJoinedIds((prev) => {
      const next = new Set(prev);
      if (next.has(communityId)) next.delete(communityId);
      else next.add(communityId);
      return next;
    });
  };

  // TODO: Move search + filter (For You / Nearby / New) server-side
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = communities.filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.city ?? '').toLowerCase().includes(q)
    );
    if (filter === 'popular') {
      return [...list].sort((a, b) => b.member_count - a.member_count);
    }
    return list;
  }, [communities, query, filter]);

  const renderCommunity = ({ item }: { item: CommunityItem }) => (
    <CommunityCard
      item={item}
      joined={joinedIds.has(item.id)}
      onPress={() => router.push(`/community/${item.id}`)}
      onJoin={() => toggleJoin(item.id)}
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
    if (!hasMore && visible.length > 0) {
      return <Text style={styles.endText}>You've reached the end</Text>;
    }
    return null;
  };

  const header = (
    <Header title="Communities Near You" showBack>
      <SearchBar
        placeholder="Search communities"
        value={query}
        onChangeText={setQuery}
        style={styles.search}
      />
      <ChipRow options={FILTERS} value={filter} onChange={setFilter} />
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

      {visible.length > 0 ? (
        <FlatList
          data={visible}
          keyExtractor={(item) => item.id}
          renderItem={renderCommunity}
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
            icon="people-outline"
            title="No communities found nearby"
            message="Update your location in settings to discover local communities"
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

  // Community card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: 'hidden',
    ...shadows.card,
  },
  banner: {
    width: '100%',
    height: 110,
  },
  bannerFallback: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: -AVATAR_SIZE / 2,
    marginBottom: spacing.sm,
  },
  avatar: {
    borderWidth: 3,
    borderColor: colors.surface,
  },
  description: {
    ...typography.bodySecondary,
    lineHeight: 20,
    marginTop: spacing.sm,
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
