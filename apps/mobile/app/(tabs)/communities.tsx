import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import {
  ChipRow,
  Avatar,
  Button,
  EmptyState,
  IconButton,
  Ionicons,
} from '../../components/ui';
import {
  colors,
  radius,
  spacing,
  typography,
  shadows,
  GUTTER,
} from '../../theme';

type CommunityFilter = 'for_you' | 'nearby' | 'popular' | 'new';

const FILTERS: { value: CommunityFilter; label: string }[] = [
  { value: 'for_you', label: 'For You' },
  { value: 'nearby', label: 'Nearby' },
  { value: 'popular', label: 'Popular' },
  { value: 'new', label: 'New' },
];

interface Community {
  id: string;
  name: string;
  city: string | null;
  category: string;
  member_count: number;
  cover_image_url: string | null;
  avatar_url?: string | null;
  description?: string | null;
  is_member?: boolean;
}

// TODO: Replace with real data from API (per filter)
const COMMUNITIES: Community[] = [];

const formatMembers = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K` : `${n}`;

function CommunityCard({
  community,
  joined,
  onToggleJoin,
}: {
  community: Community;
  joined: boolean;
  onToggleJoin: () => void;
}) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
      onPress={() => router.push(`/community/${community.id}`)}
    >
      {community.cover_image_url ? (
        <Image
          source={{ uri: community.cover_image_url }}
          style={styles.banner}
        />
      ) : (
        <View style={[styles.banner, styles.bannerFallback]}>
          <Ionicons name="image-outline" size={26} color={colors.textMuted} />
        </View>
      )}
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Avatar
            uri={community.avatar_url}
            name={community.name}
            size={56}
            ring
            style={styles.avatar}
          />
          <View style={{ flex: 1, paddingTop: spacing.sm }}>
            <Text style={typography.h3} numberOfLines={1}>
              {community.name}
            </Text>
            <Text style={typography.caption} numberOfLines={1}>
              {formatMembers(community.member_count)} members
              {community.city ? ` · ${community.city}` : ''}
            </Text>
          </View>
          <Button
            label={joined ? 'Joined' : 'Join'}
            size="sm"
            variant={joined ? 'soft' : 'primary'}
            icon={joined ? 'checkmark' : undefined}
            onPress={onToggleJoin}
            style={{ marginTop: spacing.sm }}
          />
        </View>
        {!!community.description && (
          <Text
            style={[typography.bodySecondary, styles.description]}
            numberOfLines={2}
          >
            {community.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function CommunitiesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<CommunityFilter>('for_you');
  const [joinedIds, setJoinedIds] = useState<Set<string>>(
    () => new Set(COMMUNITIES.filter((c) => c.is_member).map((c) => c.id))
  );

  // TODO: fetch communities for the selected filter
  const communities = COMMUNITIES;

  const toggleJoin = (id: string) => {
    // TODO: call join/leave community API
    setJoinedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Communities"
        rightElement={
          <IconButton
            name="add-circle-outline"
            onPress={() => router.push('/community/create')}
            accessibilityLabel="Create community"
          />
        }
        rightIcon="search"
        onRightPress={() => router.push('/discover/communities')}
        showNotificationBell={false}
      />

      <View>
        <ChipRow options={FILTERS} value={filter} onChange={setFilter} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {communities.length > 0 ? (
          communities.map((c) => (
            <CommunityCard
              key={c.id}
              community={c}
              joined={joinedIds.has(c.id)}
              onToggleJoin={() => toggleJoin(c.id)}
            />
          ))
        ) : (
          <EmptyState
            icon="people-outline"
            title="No communities yet"
            message="Find groups that share your interests, or start your own."
            actionLabel="Browse communities"
            onAction={() => router.push('/discover/communities')}
          />
        )}

        <Button
          label="Create Community"
          variant="outline"
          size="md"
          icon="add"
          onPress={() => router.push('/community/create')}
          style={{ marginTop: spacing.sm }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: GUTTER,
    paddingTop: spacing.lg,
    paddingBottom: 100,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: 'hidden',
    ...shadows.card,
  },
  banner: { width: '100%', height: 120 },
  bannerFallback: {
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { paddingHorizontal: 14, paddingBottom: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  avatar: { marginTop: -28, borderWidth: 3 },
  description: { marginTop: spacing.sm },
});
