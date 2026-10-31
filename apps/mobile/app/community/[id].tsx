import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/Header';
import EventCard, { EventCardData } from '../../components/EventCard';
import {
  Avatar,
  Badge,
  Button,
  EmptyState,
  IconButton,
  IconName,
  Ionicons,
  ListRow,
  MetaRow,
  SectionHeader,
  UnderlineTabs,
} from '../../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

type CommunityCategory =
  | 'networking'
  | 'party'
  | 'workshop'
  | 'conference'
  | 'social'
  | 'sports'
  | 'other';

type Visibility = 'public' | 'private';

type CommunityTab = 'events' | 'series' | 'members' | 'about';

interface CommunityDetail {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  category: CommunityCategory;
  cover_image_url: string | null;
  city: string | null;
  visibility: Visibility;
  is_discoverable: boolean;
  member_count: number;
  created_at: string;
}

const CATEGORY_LABELS: Record<CommunityCategory, string> = {
  networking: 'Networking',
  party: 'Party',
  workshop: 'Workshop',
  conference: 'Conference',
  social: 'Social',
  sports: 'Sports',
  other: 'Other',
};

const TABS: { value: CommunityTab; label: string }[] = [
  { value: 'events', label: 'Events' },
  { value: 'series', label: 'Series' },
  { value: 'members', label: 'Members' },
  { value: 'about', label: 'About' },
];

const formatCount = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : `${n}`;

/** Light grey placeholder block used while sections are TODO. */
function Placeholder({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.placeholder}>
      <Ionicons name={icon} size={22} color={colors.textMuted} />
      <Text style={typography.bodySecondary}>{text}</Text>
    </View>
  );
}

async function fetchCommunityDetail(id: string, userId?: string) {
  const { data: community, error } = await supabase
    .from('communities')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle();
  if (error) throw error;
  if (!community) return null;

  const [eventsRes, memberRes, followRes] = await Promise.all([
    supabase
      .from('events')
      .select(
        '*, host:users!events_host_id_fkey(first_name, last_name, avatar_url)'
      )
      .eq('community_id', id)
      .eq('status', 'published')
      .is('deleted_at', null)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(10),
    userId
      ? supabase
          .from('community_members')
          .select('status')
          .eq('community_id', id)
          .eq('user_id', userId)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    userId
      ? supabase
          .from('community_follows')
          .select('notify')
          .eq('community_id', id)
          .eq('follower_id', userId)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);
  if (eventsRes.error) throw eventsRes.error;

  const upcomingEvents: EventCardData[] = (eventsRes.data ?? []).map((e) => ({
    id: e.id,
    title: e.title,
    image: e.cover_image_url ?? '',
    date: new Date(e.start_time),
    location: e.is_online ? 'Online' : (e.location ?? e.city_region ?? ''),
    hostName: e.host
      ? [e.host.first_name, e.host.last_name].filter(Boolean).join(' ')
      : '',
    hostAvatar: e.host?.avatar_url ?? undefined,
    rsvpStatus: 'none',
    isPrivate: e.visibility !== 'public',
  }));

  return {
    community: community as CommunityDetail,
    upcomingEvents,
    isMember: memberRes.data?.status === 'active',
    isFollowing: !!followRes.data,
    notify: followRes.data?.notify ?? true,
  };
}

export default function CommunityDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { session } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['community', id, session?.user.id],
    queryFn: () => fetchCommunityDetail(String(id), session?.user.id),
    enabled: !!id,
  });
  const community = data?.community ?? null;
  const upcomingEvents = data?.upcomingEvents ?? [];
  const [isMember, setIsMember] = useState(false);
  const [notifyOnEvents, setNotifyOnEvents] = useState(true);
  // TODO: Wire to community follows API (POST/DELETE /api/communities/:id/follow)
  const [isFollowing, setIsFollowing] = useState(false);
  const [tab, setTab] = useState<CommunityTab>('events');

  useEffect(() => {
    if (!data) return;
    setIsMember(data.isMember);
    setIsFollowing(data.isFollowing);
    setNotifyOnEvents(data.notify);
  }, [data]);

  const handleJoinToggle = () => {
    if (isMember) {
      Alert.alert(
        'Leave Community',
        'Are you sure you want to leave this community? You will stop receiving notifications for new events.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: () => {
              // TODO: Call API to leave community
              // DELETE /api/communities/:id/join
              setIsMember(false);
            },
          },
        ]
      );
    } else {
      // TODO: Call API to join community
      // POST /api/communities/:id/join
      setIsMember(true);
    }
  };

  const handleReport = () => {
    Alert.alert(
      'Report Community',
      'Are you sure you want to report this community?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          style: 'destructive',
          onPress: () => {
            // TODO: Call API to report community
            // POST /api/reports with body: { target_type: 'community', target_id: id }
          },
        },
      ]
    );
  };

  const handleBlock = () => {
    Alert.alert(
      'Block Community',
      'You will no longer see content from this community. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            // TODO: Call API to block community
            router.back();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header showBack title="Community" />
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </View>
    );
  }

  // Empty / not-found state
  if (!community) {
    return (
      <View style={styles.container}>
        <Header showBack title="Community" />
        <View style={styles.centered}>
          <EmptyState
            icon="people-outline"
            title="Community not found"
            message="This community may have been removed or is no longer available."
          />
        </View>
      </View>
    );
  }

  const memberLine = [
    `${formatCount(community.member_count)} ${
      community.member_count === 1 ? 'member' : 'members'
    }`,
    community.city,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.banner}>
          {community.cover_image_url ? (
            <Image
              source={{ uri: community.cover_image_url }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.bannerImage, styles.bannerFallback]}>
              <Ionicons name="people" size={40} color={colors.primary} />
            </View>
          )}
          <View style={styles.bannerActions}>
            <IconButton
              name="chevron-back"
              variant="glass"
              onPress={() => router.back()}
              accessibilityLabel="Back"
            />
            <IconButton
              name="share-outline"
              variant="glass"
              size={20}
              accessibilityLabel="Share"
              // TODO: Share community link
            />
          </View>
        </View>

        {/* Identity */}
        <View style={styles.identity}>
          <Avatar
            name={community.name}
            size={AVATAR_SIZE}
            style={styles.avatar}
          />

          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={2}>
              {community.name}
            </Text>
            {community.visibility === 'private' && (
              <Badge label="Private" tone="neutral" icon="lock-closed" />
            )}
          </View>
          <Text style={typography.bodySecondary}>{memberLine}</Text>
          <MetaRow icon="pricetag-outline" style={{ marginTop: spacing.sm }}>
            {CATEGORY_LABELS[community.category]}
          </MetaRow>

          {/* Actions */}
          <View style={styles.actionRow}>
            <Button
              label={isMember ? 'Joined' : 'Join'}
              variant={isMember ? 'outline' : 'primary'}
              icon={isMember ? 'checkmark' : undefined}
              size="md"
              onPress={handleJoinToggle}
              style={{ flex: 1 }}
            />
            <Button
              label={isFollowing ? 'Following' : 'Follow'}
              variant="outline"
              size="md"
              onPress={() => setIsFollowing(!isFollowing)}
              style={{ flex: 1 }}
            />
            {isMember && (
              <IconButton
                name={
                  notifyOnEvents ? 'notifications' : 'notifications-off-outline'
                }
                variant="filled"
                size={20}
                color={notifyOnEvents ? colors.primary : colors.textSecondary}
                onPress={() => setNotifyOnEvents(!notifyOnEvents)}
                style={styles.notifyBtn}
                accessibilityLabel="Toggle event notifications"
              />
            )}
          </View>

          {!!community.description && (
            <Text style={styles.description} numberOfLines={3}>
              {community.description}
            </Text>
          )}
        </View>

        <UnderlineTabs
          tabs={TABS}
          value={tab}
          onChange={setTab}
          style={{ marginTop: spacing.lg }}
        />

        <View style={styles.tabBody}>
          {tab === 'events' && (
            <>
              <SectionHeader title="Upcoming Events" onAction={() => {}} />
              {upcomingEvents.length > 0 ? (
                <View style={{ paddingHorizontal: GUTTER }}>
                  {upcomingEvents.map((e) => (
                    <EventCard key={e.id} event={e} variant="row" />
                  ))}
                </View>
              ) : (
                <Placeholder
                  icon="calendar-outline"
                  text="Upcoming events will appear here"
                />
              )}
            </>
          )}

          {tab === 'series' && (
            <>
              <SectionHeader title="Event Series" />
              <Placeholder
                icon="repeat-outline"
                text="Event series will appear here"
              />
            </>
          )}

          {tab === 'members' && (
            <>
              <SectionHeader title="Members" onAction={() => {}} />
              <Placeholder
                icon="people-outline"
                text="Member list will appear here"
              />
            </>
          )}

          {tab === 'about' && (
            <>
              <SectionHeader title="About" />
              <View style={{ paddingHorizontal: GUTTER }}>
                {community.description ? (
                  <Text style={styles.aboutText}>{community.description}</Text>
                ) : (
                  <Text style={typography.bodySecondary}>
                    No description yet.
                  </Text>
                )}
                <View style={styles.aboutMeta}>
                  <MetaRow icon="pricetag-outline">
                    {CATEGORY_LABELS[community.category]}
                  </MetaRow>
                  {!!community.city && (
                    <MetaRow icon="location-outline">{community.city}</MetaRow>
                  )}
                  <MetaRow
                    icon={
                      community.visibility === 'private'
                        ? 'lock-closed-outline'
                        : 'globe-outline'
                    }
                  >
                    {community.visibility === 'private'
                      ? 'Private community'
                      : 'Public community'}
                  </MetaRow>
                </View>
              </View>

              {/* Report / Block */}
              <View style={styles.safety}>
                <ListRow
                  icon="flag-outline"
                  title="Report Community"
                  onPress={handleReport}
                  destructive
                  showChevron={false}
                />
                <ListRow
                  icon="ban-outline"
                  title="Block Community"
                  onPress={handleBlock}
                  destructive
                  showChevron={false}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const BANNER_HEIGHT = 200;
const AVATAR_SIZE = 72;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 80,
  },

  // Banner
  banner: {
    height: BANNER_HEIGHT,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerFallback: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerActions: {
    position: 'absolute',
    top: 56,
    left: GUTTER,
    right: GUTTER,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // Identity
  identity: {
    paddingHorizontal: GUTTER,
  },
  avatar: {
    marginTop: -AVATAR_SIZE / 2,
    borderWidth: 3,
    borderColor: colors.surface,
    marginBottom: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.h1,
    flexShrink: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: spacing.lg,
  },
  notifyBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
  },
  description: {
    ...typography.bodySecondary,
    lineHeight: 21,
    marginTop: spacing.lg,
  },

  // Tabs
  tabBody: {
    paddingTop: spacing.xl,
  },
  placeholder: {
    marginHorizontal: GUTTER,
    paddingVertical: spacing.xxl,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    gap: spacing.sm,
  },
  aboutText: {
    ...typography.body,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  aboutMeta: {
    gap: 10,
    marginTop: spacing.lg,
  },
  safety: {
    marginTop: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
