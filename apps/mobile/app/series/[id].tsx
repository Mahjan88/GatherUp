import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '../../components/Header';
import { formatEventDate } from '../../components/EventCard';
import {
  Avatar,
  Badge,
  Button,
  EmptyState,
  IconButton,
  IconName,
  Ionicons,
  ListRow,
  SectionHeader,
} from '../../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';

type SeriesCategory =
  | 'networking'
  | 'party'
  | 'workshop'
  | 'conference'
  | 'social'
  | 'sports'
  | 'other';

type Visibility = 'public' | 'private';
type OrganizerType = 'user' | 'community';
type RecurrenceHint = 'weekly' | 'biweekly' | 'monthly' | 'custom';

interface SeriesDetail {
  id: string;
  organizer_type: OrganizerType;
  host_id: string;
  community_id: string | null;
  title: string;
  slug: string | null;
  description: string | null;
  cover_image_url: string | null;
  category: SeriesCategory;
  visibility: Visibility;
  recurrence_hint: RecurrenceHint | null;
  subscriber_count: number;
  created_at: string;
}

/** Minimal shape for an event row inside a series. */
interface SeriesEventItem {
  id: string;
  title: string;
  start_time: string;
  cover_image_url: string | null;
  going_count: number;
}

const CATEGORY_LABELS: Record<SeriesCategory, string> = {
  networking: 'Networking',
  party: 'Party',
  workshop: 'Workshop',
  conference: 'Conference',
  social: 'Social',
  sports: 'Sports',
  other: 'Other',
};

const CATEGORY_ICONS: Record<SeriesCategory, IconName> = {
  networking: 'people',
  party: 'sparkles',
  workshop: 'construct',
  conference: 'mic',
  social: 'chatbubbles',
  sports: 'walk',
  other: 'calendar',
};

const RECURRENCE_LABELS: Record<RecurrenceHint, string> = {
  weekly: 'Repeats weekly',
  biweekly: 'Repeats biweekly',
  monthly: 'Repeats monthly',
  custom: 'Custom schedule',
};

const formatCount = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : `${n}`;

function SeriesEventRow({
  event,
  onPress,
}: {
  event: SeriesEventItem;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.eventRow}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {event.cover_image_url ? (
        <Image
          source={{ uri: event.cover_image_url }}
          style={styles.eventThumb}
        />
      ) : (
        <View style={[styles.eventThumb, styles.eventThumbFallback]}>
          <Ionicons name="image-outline" size={20} color={colors.textMuted} />
        </View>
      )}
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={styles.dateLine} numberOfLines={1}>
          {formatEventDate(new Date(event.start_time))}
        </Text>
        <Text style={typography.h3} numberOfLines={1}>
          {event.title}
        </Text>
        <Text style={typography.caption}>{event.going_count} going</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function SeriesDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // TODO: Fetch real data from API using the series ID
  const [series, setSeries] = useState<SeriesDetail | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notifyOnEvents, setNotifyOnEvents] = useState(true);
  // TODO: Fetch upcoming / past events for this series from the API
  const upcomingEvents: SeriesEventItem[] = [];
  const pastEvents: SeriesEventItem[] = [];

  const handleSubscribe = () => {
    // TODO: Call API to subscribe/unsubscribe
    // POST /api/series/:id/subscribe or DELETE /api/series/:id/subscribe
    setIsSubscribed(!isSubscribed);
  };

  const handleToggleNotify = (value: boolean) => {
    // TODO: Call API to update notification preference
    // PATCH /api/series/:id/subscribe with body: { notify: value }
    setNotifyOnEvents(value);
  };

  const handleReport = () => {
    Alert.alert(
      'Report Series',
      'Are you sure you want to report this event series?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          style: 'destructive',
          onPress: () => {
            // TODO: Call API to report series
            // POST /api/reports with body: { target_type: 'event_series', target_id: id }
          },
        },
      ]
    );
  };

  // Empty / not-found state
  if (!series) {
    return (
      <View style={styles.container}>
        <Header showBack title="Event Series" />
        <View style={styles.centered}>
          <EmptyState
            icon="calendar-outline"
            title="Series not found"
            message="This event series may have been removed or is no longer available."
          />
        </View>
      </View>
    );
  }

  const hostLabel =
    series.organizer_type === 'community'
      ? 'Community Organizer'
      : 'Individual Organizer';

  return (
    <View style={styles.container}>
      <Header
        showBack
        title="Event Series"
        rightElement={
          <IconButton
            name="flag-outline"
            size={20}
            onPress={handleReport}
            accessibilityLabel="Report series"
          />
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Identity */}
        <View style={styles.identity}>
          {series.cover_image_url ? (
            <Image
              source={{ uri: series.cover_image_url }}
              style={styles.iconTile}
            />
          ) : (
            <View style={styles.iconTile}>
              <Ionicons
                name={CATEGORY_ICONS[series.category]}
                size={30}
                color={colors.primary}
              />
            </View>
          )}

          <Text style={styles.title}>{series.title}</Text>

          <View style={styles.badgeRow}>
            <Badge
              label={series.visibility === 'private' ? 'Private' : 'Public'}
              icon={
                series.visibility === 'private'
                  ? 'lock-closed-outline'
                  : 'globe-outline'
              }
            />
            <Badge label={CATEGORY_LABELS[series.category]} tone="neutral" />
          </View>

          {!!series.description && (
            <Text style={styles.description}>{series.description}</Text>
          )}
        </View>

        {/* Host row */}
        <View style={styles.hostRow}>
          <Avatar
            name={series.organizer_type === 'community' ? 'C' : 'U'}
            size={40}
          />
          <View style={{ flex: 1 }}>
            <Text style={typography.label} numberOfLines={1}>
              Hosted by {hostLabel}
            </Text>
            <Text style={typography.caption} numberOfLines={1}>
              {series.organizer_type === 'community'
                ? 'Organized by a community'
                : 'Organized by a user'}
            </Text>
          </View>
          <Button label="Follow" variant="outline" size="sm" />
        </View>

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons
              name="people-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={typography.bodySecondary}>
              {formatCount(series.subscriber_count)}{' '}
              {series.subscriber_count === 1 ? 'follower' : 'followers'}
            </Text>
          </View>
          {series.recurrence_hint && (
            <>
              <Text style={styles.metaDot}>·</Text>
              <View style={styles.metaItem}>
                <Ionicons
                  name="repeat-outline"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={typography.bodySecondary}>
                  {RECURRENCE_LABELS[series.recurrence_hint]}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Notification Toggle (when subscribed) */}
        {isSubscribed && (
          <View style={styles.notifyCard}>
            <ListRow
              icon="notifications-outline"
              title="Notifications"
              subtitle="Get notified when new events are added to this series"
              style={styles.notifyRow}
              right={
                <Switch
                  value={notifyOnEvents}
                  onValueChange={handleToggleNotify}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              }
            />
          </View>
        )}

        {/* Upcoming Events */}
        <View style={styles.section}>
          <SectionHeader title="Upcoming Events" onAction={() => {}} />
          {upcomingEvents.length > 0 ? (
            <View style={styles.list}>
              {upcomingEvents.map((e) => (
                <SeriesEventRow
                  key={e.id}
                  event={e}
                  onPress={() => router.push(`/event/${e.id}`)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.placeholder}>
              <Ionicons
                name="calendar-outline"
                size={22}
                color={colors.textMuted}
              />
              <Text style={typography.bodySecondary}>
                Upcoming events will appear here
              </Text>
            </View>
          )}
        </View>

        {/* Past Events */}
        <View style={styles.section}>
          <SectionHeader title="Past Events" onAction={() => {}} />
          {pastEvents.length > 0 ? (
            <View style={styles.list}>
              {pastEvents.map((e) => (
                <SeriesEventRow
                  key={e.id}
                  event={e}
                  onPress={() => router.push(`/event/${e.id}`)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.placeholder}>
              <Ionicons
                name="time-outline"
                size={22}
                color={colors.textMuted}
              />
              <Text style={typography.bodySecondary}>
                Past events will appear here
              </Text>
            </View>
          )}
        </View>

        {/* Report */}
        <TouchableOpacity style={styles.reportLink} onPress={handleReport}>
          <Ionicons name="flag-outline" size={16} color={colors.danger} />
          <Text style={styles.reportText}>Report Series</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.bottomBar}>
        <Button
          label={isSubscribed ? 'Subscribed' : 'Subscribe to Series'}
          variant={isSubscribed ? 'outline' : 'primary'}
          icon={isSubscribed ? 'checkmark' : undefined}
          onPress={handleSubscribe}
          fullWidth
        />
      </View>
    </View>
  );
}

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

  // Identity
  identity: {
    paddingHorizontal: GUTTER,
    paddingTop: spacing.sm,
  },
  iconTile: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.bodySecondary,
    lineHeight: 21,
  },

  // Host
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: GUTTER,
    paddingVertical: spacing.lg,
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.divider,
  },

  // Meta
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: GUTTER,
    paddingVertical: spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaDot: {
    ...typography.bodySecondary,
    color: colors.textMuted,
  },

  // Notifications
  notifyCard: {
    marginHorizontal: GUTTER,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: 'hidden',
  },
  notifyRow: {
    paddingHorizontal: spacing.lg,
  },

  // Sections
  section: {
    marginTop: spacing.lg,
  },
  list: {
    paddingHorizontal: GUTTER,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 10,
  },
  eventThumb: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
  },
  eventThumbFallback: {
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLine: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  placeholder: {
    marginHorizontal: GUTTER,
    paddingVertical: spacing.xxl,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    gap: spacing.sm,
  },

  // Report
  reportLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.xxxl,
    paddingVertical: spacing.md,
  },
  reportText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.danger,
  },

  // Sticky bottom
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: GUTTER,
    paddingTop: spacing.md,
    paddingBottom: 34,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
