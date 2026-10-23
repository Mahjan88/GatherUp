import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import EventCard, { EventCardData } from '../../components/EventCard';
import HamburgerMenu from '../../components/HamburgerMenu';
import {
  Avatar,
  Button,
  Chip,
  ChipRow,
  EmptyState,
  IconButton,
  IconName,
  Ionicons,
  MetaRow,
  UnderlineTabs,
} from '../../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';

// TODO: Replace with real API data
const HOSTED_EVENTS: EventCardData[] = [];

const ATTENDED_EVENTS: EventCardData[] = [];

// TODO: Replace with real API data (current user profile)
const PROFILE: {
  name: string;
  username: string;
  bio: string;
  location: string | null;
  avatar: string | null;
  cover: string | null;
  verified: boolean;
  followers: number;
  following: number;
  interests: { label: string; icon: IconName }[];
} = {
  name: 'Set up your profile',
  username: 'username',
  bio: 'Tap "Edit Profile" to add your bio',
  location: null,
  avatar: null,
  cover: null,
  verified: true,
  followers: 0,
  following: 0,
  interests: [
    { label: 'Hiking', icon: 'walk-outline' },
    { label: 'Food & Drink', icon: 'restaurant-outline' },
    { label: 'Photography', icon: 'camera-outline' },
    { label: 'Music', icon: 'musical-notes-outline' },
  ],
};

// TODO: Replace with real API data
const PHOTOS: { id: string; uri: string }[] = [];

// TODO: Replace with real API data
const REVIEWS: {
  id: string;
  eventTitle: string;
  rating: number;
  text: string;
  date: string;
}[] = [];

type TabType = 'hosted' | 'attended';
type ProfileTab = 'photos' | 'events' | 'reviews';

const COVER_HEIGHT = 170;
const AVATAR_SIZE = 96;
const GRID_GAP = 4;
const PHOTO_SIZE =
  (Dimensions.get('window').width - GUTTER * 2 - GRID_GAP * 2) / 3;

// Helper function to group events by year
const groupEventsByYear = (
  events: EventCardData[]
): { [year: string]: EventCardData[] } => {
  const grouped: { [year: string]: EventCardData[] } = {};

  events.forEach((event) => {
    const year = event.date.getFullYear().toString();
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(event);
  });

  // Sort events within each year by date (most recent first)
  Object.keys(grouped).forEach((year) => {
    grouped[year].sort((a, b) => b.date.getTime() - a.date.getTime());
  });

  return grouped;
};

// Get sorted years (most recent first)
const getSortedYears = (grouped: {
  [year: string]: EventCardData[];
}): string[] => {
  return Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a));
};

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('hosted');
  const [profileTab, setProfileTab] = useState<ProfileTab>('photos');
  const [menuVisible, setMenuVisible] = useState(false);

  const eventCount = HOSTED_EVENTS.length + ATTENDED_EVENTS.length;

  const renderEmptyHosted = () => (
    <EmptyState
      icon="calendar-outline"
      title="Start creating amazing events"
      message="Gather your people. Fuel your passion. Create events that make waves."
      actionLabel="Start now"
      onAction={() => router.push('/event/create')}
    />
  );

  const renderEmptyAttended = () => (
    <EmptyState
      icon="sparkles-outline"
      title="No events attended yet"
      message="Time to get out there and have some fun! Check out events happening near you."
      actionLabel="Explore Events"
      onAction={() => router.push('/(tabs)/explore')}
    />
  );

  const renderEventsByYear = (events: EventCardData[]) => {
    const groupedEvents = groupEventsByYear(events);
    const sortedYears = getSortedYears(groupedEvents);

    return (
      <View>
        {sortedYears.map((year) => (
          <View key={year} style={styles.yearSection}>
            <Text style={styles.yearHeader}>{year}</Text>
            <View style={styles.eventList}>
              {groupedEvents[year].map((event) => (
                <EventCard key={event.id} event={event} variant="past" />
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderEvents = () => (
    <View>
      <ChipRow
        options={[
          { value: 'hosted', label: 'Hosted' },
          { value: 'attended', label: 'Attended' },
        ]}
        value={activeTab}
        onChange={setActiveTab}
        style={styles.eventFilter}
      />
      {activeTab === 'hosted'
        ? HOSTED_EVENTS.length > 0
          ? renderEventsByYear(HOSTED_EVENTS)
          : renderEmptyHosted()
        : ATTENDED_EVENTS.length > 0
          ? renderEventsByYear(ATTENDED_EVENTS)
          : renderEmptyAttended()}
    </View>
  );

  const renderPhotos = () =>
    PHOTOS.length > 0 ? (
      <View style={styles.photoGrid}>
        {PHOTOS.map((photo) => (
          <Image
            key={photo.id}
            source={{ uri: photo.uri }}
            style={styles.photo}
          />
        ))}
      </View>
    ) : (
      <EmptyState
        icon="images-outline"
        title="No photos yet"
        message="Photos you share at events will show up here."
      />
    );

  const renderReviews = () =>
    REVIEWS.length > 0 ? (
      <View style={styles.reviewList}>
        {REVIEWS.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={typography.label} numberOfLines={1}>
                {review.eventTitle}
              </Text>
              <Text style={typography.caption}>{review.date}</Text>
            </View>
            <View style={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < review.rating ? 'star' : 'star-outline'}
                  size={14}
                  color={colors.warning}
                />
              ))}
            </View>
            <Text style={typography.bodySecondary}>{review.text}</Text>
          </View>
        ))}
      </View>
    ) : (
      <EmptyState
        icon="star-outline"
        title="No reviews yet"
        message="Reviews you leave after attending events will appear here."
      />
    );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover photo */}
        <View style={styles.cover}>
          {PROFILE.cover ? (
            <Image source={{ uri: PROFILE.cover }} style={styles.coverImage} />
          ) : (
            <View style={[styles.coverImage, styles.coverFallback]}>
              <Ionicons
                name="image-outline"
                size={36}
                color={colors.primarySoft}
              />
            </View>
          )}
          <View style={styles.coverActions}>
            <IconButton
              name="share-outline"
              variant="glass"
              size={20}
              accessibilityLabel="Share profile"
            />
            <IconButton
              name="settings-outline"
              variant="glass"
              size={20}
              onPress={() => setMenuVisible(true)}
              accessibilityLabel="Settings"
            />
          </View>
        </View>

        {/* Identity */}
        <View style={styles.identity}>
          <View style={styles.avatarRow}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push('/settings/profile')}
              style={styles.avatarWrap}
            >
              <Avatar
                uri={PROFILE.avatar}
                name={PROFILE.name}
                size={AVATAR_SIZE}
                badge={PROFILE.verified ? 'verified' : undefined}
                style={styles.avatarRing}
              />
            </TouchableOpacity>
            <Button
              label="Edit Profile"
              variant="outline"
              size="sm"
              onPress={() => router.push('/settings/profile')}
            />
          </View>

          <Text style={styles.name}>{PROFILE.name}</Text>
          <Text style={styles.handle}>@{PROFILE.username}</Text>
          <Text style={styles.bio}>{PROFILE.bio}</Text>
          <MetaRow icon="location-outline" style={styles.location}>
            {PROFILE.location ?? 'Add your location'}
          </MetaRow>

          {/* Stats */}
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{eventCount}</Text>
              <Text style={typography.caption}>Events</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{PROFILE.following}</Text>
              <Text style={typography.caption}>Following</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{PROFILE.followers}</Text>
              <Text style={typography.caption}>Followers</Text>
            </TouchableOpacity>
          </View>

          {/* Interests */}
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.tags}>
            {PROFILE.interests.map((interest) => (
              <Chip
                key={interest.label}
                label={interest.label}
                icon={interest.icon}
                variant="tag"
              />
            ))}
          </View>
        </View>

        {/* Tabs */}
        <UnderlineTabs
          tabs={[
            { value: 'photos', label: 'Photos' },
            { value: 'events', label: 'Events' },
            { value: 'reviews', label: 'Reviews' },
          ]}
          value={profileTab}
          onChange={setProfileTab}
        />

        <View style={styles.tabContent}>
          {profileTab === 'photos' && renderPhotos()}
          {profileTab === 'events' && renderEvents()}
          {profileTab === 'reviews' && renderReviews()}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <HamburgerMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cover: {
    height: COVER_HEIGHT,
  },
  coverImage: {
    width: '100%',
    height: COVER_HEIGHT,
  },
  coverFallback: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverActions: {
    position: 'absolute',
    top: 56,
    right: GUTTER,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  identity: {
    paddingHorizontal: GUTTER,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: -AVATAR_SIZE / 2,
    marginBottom: spacing.md,
  },
  avatarWrap: {
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarRing: {
    borderWidth: 4,
    borderColor: colors.surface,
  },
  name: {
    ...typography.h1,
  },
  handle: {
    ...typography.bodySecondary,
    marginTop: 2,
  },
  bio: {
    ...typography.body,
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  location: {
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statNumber: {
    ...typography.h2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    ...typography.h2,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  tabContent: {
    paddingTop: spacing.lg,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    paddingHorizontal: GUTTER,
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
  },
  eventFilter: {
    paddingBottom: spacing.sm,
  },
  yearSection: {
    marginBottom: spacing.sm,
  },
  yearHeader: {
    ...typography.caption,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    paddingHorizontal: GUTTER,
    paddingVertical: spacing.md,
  },
  eventList: {
    paddingHorizontal: GUTTER,
  },
  reviewList: {
    paddingHorizontal: GUTTER,
    gap: spacing.md,
  },
  reviewCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  bottomPadding: {
    height: 100,
  },
});
