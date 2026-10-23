import { ReactNode, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SlideUpModal from '../../components/SlideUpModal';
import {
  Avatar,
  AvatarStack,
  Button,
  EmptyState,
  IconButton,
  Ionicons,
  IconName,
  ScreenHeader,
  UnderlineTabs,
} from '../../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';

// TODO: Replace with real data fetched from API using the event ID

// Event type for when real data is loaded from API
interface EventDetail {
  id: string;
  title: string;
  organizer: string;
  organizerAvatar?: string;
  organizerVerified?: boolean;
  communityName?: string;
  image: string;
  description: string;
  date: string;
  time: string;
  location: string;
  address: string;
  city: string;
  coordinates: { lat: number; lng: number };
  isPrivate: boolean;
  isFree: boolean;
  isGroupChatEnabled?: boolean;
  category?: string;
  tags?: string[];
  goingCount?: number;
  spotsLeft?: number;
  friendsAttending: { id: string; name: string; avatar: string }[];
  mutualFriends: number;
  agenda: { time: string; title: string }[];
}

type DetailTab = 'about' | 'chat' | 'photos' | 'attendees';
type RsvpState = 'none' | 'going';

const HERO_HEIGHT = 260;

/** Icon + content line used for the location / date / category rows. */
function DetailMetaRow({
  icon,
  children,
  onPress,
}: {
  icon: IconName;
  children: ReactNode;
  onPress?: () => void;
}) {
  const Wrapper: any = onPress ? TouchableOpacity : View;
  return (
    <Wrapper style={styles.metaRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.metaIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </Wrapper>
  );
}

export default function EventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>('about');
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  // TODO: Wire RSVP to the API
  const [rsvp, setRsvp] = useState<RsvpState>('none');

  // TODO: Fetch real data from API using the event ID
  const [event, setEvent] = useState<EventDetail | null>(null);

  if (!event) {
    return (
      <View style={styles.container}>
        <ScreenHeader showBack onBack={() => router.push('/(tabs)/explore')} />
        <View style={styles.emptyWrap}>
          <EmptyState
            icon="calendar-outline"
            title="Event not found"
            message="This event may have been removed or is no longer available."
          />
        </View>
      </View>
    );
  }

  // Static map URL using OpenStreetMap tile service
  const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${event.coordinates.lat},${event.coordinates.lng}&zoom=16&size=600x300&maptype=mapnik&markers=${event.coordinates.lat},${event.coordinates.lng},red-pushpin`;

  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${event.coordinates.lat},${event.coordinates.lng}`;
    Linking.openURL(url);
  };

  const tabs: { value: DetailTab; label: string }[] = [
    { value: 'about', label: 'About' },
    ...(event.isGroupChatEnabled
      ? [{ value: 'chat' as DetailTab, label: 'Chat' }]
      : []),
    { value: 'photos', label: 'Photos' },
    { value: 'attendees', label: 'Attendees' },
  ];

  const handleTabChange = (tab: DetailTab) => {
    if (tab === 'chat') {
      router.push(`/chat/${id}`);
      return;
    }
    if (tab === 'photos') {
      router.push(`/gallery/${id}`);
      return;
    }
    setActiveTab(tab);
  };

  const goingCount = event.goingCount ?? event.friendsAttending.length;
  const goingLabel = [
    `${goingCount} going`,
    event.spotsLeft != null ? `${event.spotsLeft} spots left` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const categoryLine = [event.category, ...(event.tags ?? [])]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: event.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroActions}>
            <IconButton
              name="chevron-back"
              variant="glass"
              onPress={() => router.push('/(tabs)/explore')}
              accessibilityLabel="Back"
            />
            <View style={styles.heroActionsRight}>
              <IconButton
                name="share-outline"
                variant="glass"
                size={20}
                // TODO: Implement share
                onPress={() => {}}
                accessibilityLabel="Share"
              />
              <IconButton
                name={saved ? 'bookmark' : 'bookmark-outline'}
                variant="glass"
                size={20}
                onPress={() => setSaved((s) => !s)}
                accessibilityLabel="Save"
              />
            </View>
          </View>

          {/* Private Event Badge */}
          {event.isPrivate && (
            <View style={styles.privateBadge}>
              <Ionicons name="lock-closed" size={12} color={colors.primaryOn} />
              <Text style={styles.privateBadgeText}>Private Event</Text>
            </View>
          )}
        </View>

        {/* Content sheet */}
        <View style={styles.sheet}>
          <Text style={styles.dateLine}>
            {`${event.date} · ${event.time}`.toUpperCase()}
          </Text>
          <Text style={styles.eventTitle}>{event.title}</Text>

          {/* Host row */}
          <View style={styles.hostRow}>
            <Avatar
              uri={event.organizerAvatar}
              name={event.organizer}
              size={44}
              badge={event.organizerVerified ? 'verified' : undefined}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.hostName} numberOfLines={1}>
                Hosted by {event.organizer}
              </Text>
              {!!event.communityName && (
                <Text style={typography.caption} numberOfLines={1}>
                  {event.communityName}
                </Text>
              )}
            </View>
            <Button
              label={following ? 'Following' : 'Follow'}
              variant={following ? 'soft' : 'outline'}
              size="sm"
              onPress={() => setFollowing((f) => !f)}
            />
          </View>

          {/* Meta rows */}
          <View style={styles.metaList}>
            <DetailMetaRow
              icon="location-outline"
              onPress={() => setShowLocationModal(true)}
            >
              <Text style={styles.metaTitle} numberOfLines={1}>
                {event.location}
              </Text>
              <View style={styles.metaSubRow}>
                <Text
                  style={[typography.caption, { flexShrink: 1 }]}
                  numberOfLines={1}
                >
                  {event.city}
                </Text>
                <TouchableOpacity onPress={openInMaps} hitSlop={8}>
                  <Text style={styles.link}>Get Directions</Text>
                </TouchableOpacity>
              </View>
            </DetailMetaRow>

            <DetailMetaRow icon="calendar-outline">
              <Text style={styles.metaTitle}>{event.date}</Text>
              <Text style={typography.caption}>{event.time}</Text>
            </DetailMetaRow>

            {!!categoryLine && (
              <DetailMetaRow icon="pricetag-outline">
                <Text style={styles.metaTitle} numberOfLines={1}>
                  {categoryLine}
                </Text>
                {event.isFree && (
                  <Text style={typography.caption}>Free event</Text>
                )}
              </DetailMetaRow>
            )}
          </View>

          {/* Going */}
          <View style={styles.goingRow}>
            <AvatarStack
              people={event.friendsAttending.map((f) => ({
                uri: f.avatar,
                name: f.name,
              }))}
              size={28}
              max={4}
              label={goingLabel}
            />
          </View>
        </View>

        <UnderlineTabs
          tabs={tabs}
          value={activeTab}
          onChange={handleTabChange}
        />

        <View style={styles.tabContent}>
          {activeTab === 'about' && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About this event</Text>
                <Text style={styles.descriptionText} numberOfLines={5}>
                  {event.description}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDescriptionModal(true)}
                  hitSlop={8}
                >
                  <Text style={[styles.link, { marginTop: spacing.sm }]}>
                    See More
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Agenda */}
              {event.agenda.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Agenda</Text>
                  {event.agenda.map((item, index) => (
                    <View key={index} style={styles.agendaItem}>
                      <View style={styles.agendaDot} />
                      <Text style={styles.agendaTime}>{item.time}</Text>
                      <Text style={styles.agendaText}>{item.title}</Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          {activeTab === 'attendees' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Who's Going</Text>
              <Text style={[typography.bodySecondary, { marginBottom: 12 }]}>
                {event.mutualFriends} mutual friends are going
              </Text>
              {event.friendsAttending.map((friend) => (
                <View key={friend.id} style={styles.attendeeRow}>
                  <Avatar uri={friend.avatar} name={friend.name} size={44} />
                  <Text style={styles.hostName}>{friend.name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View style={styles.bottomBar}>
        {rsvp === 'going' ? (
          <View style={styles.bottomRow}>
            <Button
              label="You're Going"
              variant="outline"
              icon="checkmark-circle"
              onPress={() => setRsvp('none')}
              style={{ flex: 1 }}
            />
            {event.isGroupChatEnabled && (
              <Button
                label="Chat"
                variant="soft"
                icon="chatbubbles-outline"
                onPress={() => router.push(`/chat/${id}`)}
              />
            )}
          </View>
        ) : (
          <Button
            label="Join Event"
            fullWidth
            onPress={() => setRsvp('going')}
          />
        )}
      </View>

      {/* Location Modal */}
      <SlideUpModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        scrollable={false}
        minHeight={0.45}
        maxHeight={0.6}
      >
        <View style={styles.locationHeader}>
          <View style={styles.locationIconCircle}>
            <Ionicons name="location" size={24} color={colors.primary} />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationName}>{event.location}</Text>
            <Text style={typography.bodySecondary}>{event.address}</Text>
            <Text style={typography.bodySecondary}>{event.city}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.mapContainer} onPress={openInMaps}>
          <Image
            source={{ uri: staticMapUrl }}
            style={styles.mapPreview}
            resizeMode="cover"
          />
          <View style={styles.mapPinOverlay} pointerEvents="none">
            <Ionicons name="location" size={32} color={colors.danger} />
          </View>
        </TouchableOpacity>

        <View style={styles.locationActions}>
          <Button
            label="Open in Maps"
            icon="navigate-outline"
            onPress={openInMaps}
            style={{ flex: 1 }}
          />
          <Button
            label="Copy Address"
            variant="outline"
            icon="copy-outline"
            style={{ flex: 1 }}
          />
        </View>
      </SlideUpModal>

      {/* Description Modal */}
      <SlideUpModal
        visible={showDescriptionModal}
        onClose={() => setShowDescriptionModal(false)}
        title="Event Description"
      >
        <Text style={styles.descriptionModalText}>{event.description}</Text>
      </SlideUpModal>
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
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
  },

  heroContainer: {
    height: HERO_HEIGHT,
    backgroundColor: colors.surfaceAlt,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroActions: {
    position: 'absolute',
    top: 56,
    left: GUTTER - 4,
    right: GUTTER - 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroActionsRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  privateBadge: {
    position: 'absolute',
    bottom: 32,
    left: GUTTER,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  privateBadgeText: {
    color: colors.primaryOn,
    fontSize: 12,
    fontWeight: '700',
  },

  sheet: {
    marginTop: -radius.xl,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.background,
    paddingHorizontal: GUTTER,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  dateLine: {
    ...typography.overline,
    marginBottom: 6,
  },
  eventTitle: {
    ...typography.h1,
    marginBottom: spacing.lg,
  },

  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  hostName: {
    ...typography.h3,
  },

  metaList: {
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  metaIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm + 2,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaTitle: {
    ...typography.label,
  },
  metaSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  link: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.link,
  },

  goingRow: {
    marginTop: spacing.xl,
  },

  tabContent: {
    paddingHorizontal: GUTTER,
    paddingTop: spacing.xl,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    ...typography.bodySecondary,
    lineHeight: 22,
  },
  agendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 8,
  },
  agendaDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  agendaTime: {
    ...typography.label,
    color: colors.textSecondary,
    minWidth: 72,
  },
  agendaText: {
    ...typography.body,
    flex: 1,
  },
  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },

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
  bottomRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  // Location Modal Content Styles
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  locationIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    ...typography.h2,
    marginBottom: 4,
  },
  mapContainer: {
    height: 180,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    backgroundColor: colors.surfaceAlt,
  },
  mapPreview: {
    width: '100%',
    height: '100%',
  },
  mapPinOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -32,
    marginLeft: -16,
  },
  locationActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  descriptionModalText: {
    ...typography.body,
    lineHeight: 24,
  },
});
