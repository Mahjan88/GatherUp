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
import EventCard, { EventCardData } from '../../components/EventCard';
import {
  SearchBar,
  ChipRow,
  SectionHeader,
  EmptyState,
  FAB,
  Button,
  Ionicons,
  IconName,
} from '../../components/ui';
import {
  colors,
  radius,
  spacing,
  typography,
  shadows,
  GUTTER,
} from '../../theme';

type CategoryFilter =
  | 'all'
  | 'networking'
  | 'party'
  | 'workshop'
  | 'conference'
  | 'social'
  | 'sports'
  | 'other';

const CATEGORIES: { value: CategoryFilter; label: string; icon?: IconName }[] =
  [
    { value: 'all', label: 'All' },
    { value: 'networking', label: 'Networking', icon: 'briefcase-outline' },
    { value: 'party', label: 'Party', icon: 'musical-notes-outline' },
    { value: 'workshop', label: 'Workshop', icon: 'construct-outline' },
    { value: 'conference', label: 'Conference', icon: 'mic-outline' },
    { value: 'social', label: 'Social', icon: 'people-outline' },
    { value: 'sports', label: 'Sports', icon: 'basketball-outline' },
    { value: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
  ];

interface NearbyCommunity {
  id: string;
  name: string;
  city: string | null;
  category: string;
  member_count: number;
  cover_image_url: string | null;
}

// TODO: Replace with real data from API (feed + nearby endpoints)
const FOR_YOU_EVENTS: EventCardData[] = [];
const WEEKEND_EVENTS: EventCardData[] = [];
const INVITED_EVENTS: EventCardData[] = [];
const MY_UPCOMING_EVENTS: EventCardData[] = [];
const NEARBY_COMMUNITIES: NearbyCommunity[] = [];

const formatMembers = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K` : `${n}`;

function CommunityTile({ community }: { community: NearbyCommunity }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.communityTile}
      activeOpacity={0.9}
      onPress={() => router.push(`/community/${community.id}`)}
    >
      {community.cover_image_url ? (
        <Image
          source={{ uri: community.cover_image_url }}
          style={styles.communityImage}
        />
      ) : (
        <View style={[styles.communityImage, styles.communityFallback]}>
          <Ionicons name="people-outline" size={26} color={colors.primary} />
        </View>
      )}
      <View style={styles.communityBody}>
        <Text style={styles.communityName} numberOfLines={1}>
          {community.name}
        </Text>
        <Text style={typography.caption} numberOfLines={1}>
          {formatMembers(community.member_count)} members
          {community.city ? ` · ${community.city}` : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  // TODO: filter by searchQuery / activeCategory once wired to the API
  const forYou =
    FOR_YOU_EVENTS.length > 0 ? FOR_YOU_EVENTS : MY_UPCOMING_EVENTS;
  const weekend = WEEKEND_EVENTS.slice(0, 8);
  const communities = NEARBY_COMMUNITIES.slice(0, 5);

  return (
    <View style={styles.container}>
      <Header>
        <View style={styles.searchWrap}>
          <SearchBar
            placeholder="Search events, communities, or people"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ChipRow
          options={CATEGORIES}
          value={activeCategory}
          onChange={setActiveCategory}
          style={styles.chips}
        />

        {/* INVITES */}
        {INVITED_EVENTS.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="Invites"
              actionLabel="Past events"
              onAction={() => router.push('/event/past')}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}
            >
              {INVITED_EVENTS.map((event) => (
                <EventCard key={event.id} event={event} variant="compact" />
              ))}
            </ScrollView>
          </View>
        )}

        {/* FOR YOU */}
        <View style={styles.section}>
          <SectionHeader
            title="For You"
            onAction={() => router.push('/discover/events')}
          />
          {forYou.length > 0 ? (
            <View style={styles.featureList}>
              {forYou.map((event) => (
                <EventCard key={event.id} event={event} variant="feature" />
              ))}
            </View>
          ) : (
            <EmptyState
              icon="compass-outline"
              title="Nothing here yet"
              message="Join a few events or follow communities and we'll tailor picks for you."
              actionLabel="Browse events"
              onAction={() => router.push('/discover/events')}
            />
          )}
        </View>

        {/* THIS WEEKEND */}
        <View style={styles.section}>
          <SectionHeader
            title="This Weekend"
            onAction={() => router.push('/discover/events')}
          />
          {weekend.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}
            >
              {weekend.map((event) => (
                <EventCard key={event.id} event={event} variant="compact" />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.inlineEmpty}>
              <Ionicons
                name="calendar-clear-outline"
                size={20}
                color={colors.textMuted}
              />
              <Text style={[typography.bodySecondary, { flex: 1 }]}>
                No events nearby this weekend yet.
              </Text>
              <Button
                label="Host one"
                size="sm"
                variant="soft"
                onPress={() => router.push('/event/create')}
              />
            </View>
          )}
        </View>

        {/* COMMUNITIES NEAR YOU */}
        <View style={styles.section}>
          <SectionHeader
            title="Communities Near You"
            onAction={() => router.push('/discover/communities')}
          />
          {communities.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}
            >
              {communities.map((c) => (
                <CommunityTile key={c.id} community={c} />
              ))}
            </ScrollView>
          ) : (
            <EmptyState
              icon="people-outline"
              title="No communities found nearby"
              message="Update your location in settings to discover local communities."
              actionLabel="Explore communities"
              onAction={() => router.push('/discover/communities')}
            />
          )}
        </View>
      </ScrollView>

      <FAB onPress={() => router.push('/event/create')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchWrap: { paddingHorizontal: GUTTER },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  chips: { paddingTop: spacing.xs, paddingBottom: spacing.lg },
  section: { marginBottom: spacing.xxl },
  featureList: { paddingHorizontal: GUTTER, gap: spacing.lg },
  rail: {
    paddingHorizontal: GUTTER,
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  inlineEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: GUTTER,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt,
  },
  communityTile: {
    width: 170,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: 'hidden',
    ...shadows.card,
  },
  communityImage: { width: '100%', height: 90 },
  communityFallback: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityBody: { padding: 10, gap: 2 },
  communityName: { fontSize: 14, fontWeight: '700', color: colors.text },
});
