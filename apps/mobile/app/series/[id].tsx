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

const CATEGORY_LABELS: Record<SeriesCategory, string> = {
  networking: 'Networking',
  party: 'Party',
  workshop: 'Workshop',
  conference: 'Conference',
  social: 'Social',
  sports: 'Sports',
  other: 'Other',
};

const RECURRENCE_LABELS: Record<RecurrenceHint, string> = {
  weekly: 'Repeats weekly',
  biweekly: 'Repeats biweekly',
  monthly: 'Repeats monthly',
  custom: 'Custom schedule',
};

export default function SeriesDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // TODO: Fetch series data from API using the id param
  const [series, setSeries] = useState<SeriesDetail | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notifyOnEvents, setNotifyOnEvents] = useState(true);

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
      ],
    );
  };

  // Empty / not-found state
  if (!series) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <TouchableOpacity
            style={styles.heroBackButton}
            onPress={() => router.back()}
          >
            <Text style={styles.heroBackText}>&#x2039;</Text>
          </TouchableOpacity>
          <Text style={styles.emptyStateIcon}>📅</Text>
          <Text style={styles.emptyStateTitle}>Series not found</Text>
          <Text style={styles.emptyStateText}>
            This event series may have been removed or is no longer
            available.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Image */}
        <View style={styles.heroContainer}>
          {series.cover_image_url ? (
            <Image
              source={{ uri: series.cover_image_url }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Text style={styles.heroPlaceholderIcon}>📅</Text>
            </View>
          )}

          {/* Back Button */}
          <TouchableOpacity
            style={styles.heroBackButton}
            onPress={() => router.back()}
          >
            <Text style={styles.heroBackText}>&#x2039;</Text>
          </TouchableOpacity>

          {/* Badges */}
          <View style={styles.badgeRow}>
            <View style={styles.visibilityBadge}>
              <Text style={styles.visibilityBadgeText}>
                {series.visibility === 'private' ? 'Private' : 'Public'}
              </Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {CATEGORY_LABELS[series.category]}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.seriesTitle}>{series.title}</Text>

          {/* Recurrence Hint */}
          {series.recurrence_hint && (
            <View style={styles.recurrenceRow}>
              <Text style={styles.recurrenceIcon}>🔁</Text>
              <Text style={styles.recurrenceText}>
                {RECURRENCE_LABELS[series.recurrence_hint]}
              </Text>
            </View>
          )}

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {series.subscriber_count}
              </Text>
              <Text style={styles.statLabel}>
                {series.subscriber_count === 1
                  ? 'Subscriber'
                  : 'Subscribers'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
          </View>

          {/* Organizer Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Organizer</Text>
            <View style={styles.organizerCard}>
              <View style={styles.organizerAvatar}>
                <Text style={styles.organizerAvatarIcon}>
                  {series.organizer_type === 'community'
                    ? '👥'
                    : '👤'}
                </Text>
              </View>
              <View style={styles.organizerInfo}>
                <Text style={styles.organizerName}>
                  {series.organizer_type === 'community'
                    ? 'Community Organizer'
                    : 'Individual Organizer'}
                </Text>
                <Text style={styles.organizerHint}>
                  {series.organizer_type === 'community'
                    ? 'Organized by a community'
                    : 'Organized by a user'}
                </Text>
              </View>
            </View>
          </View>

          {/* Subscribe Button */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[
                styles.subscribeButton,
                isSubscribed
                  ? styles.subscribedButton
                  : styles.notSubscribedButton,
              ]}
              onPress={handleSubscribe}
            >
              <Text
                style={[
                  styles.subscribeButtonText,
                  isSubscribed
                    ? styles.subscribedButtonText
                    : styles.notSubscribedButtonText,
                ]}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Notification Toggle (when subscribed) */}
          {isSubscribed && (
            <View style={styles.inlineToggle}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>Notifications</Text>
                <Text style={styles.toggleHint}>
                  Get notified when new events are added to this series
                </Text>
              </View>
              <Switch
                value={notifyOnEvents}
                onValueChange={handleToggleNotify}
                trackColor={{ false: '#334155', true: '#14b8a6' }}
                thumbColor="#fff"
              />
            </View>
          )}

          {/* Description */}
          {series.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.descriptionText}>
                {series.description}
              </Text>
            </View>
          )}

          {/* Upcoming Events Section (TODO) */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.todoPlaceholder}>
              <Text style={styles.todoIcon}>📅</Text>
              <Text style={styles.todoText}>
                Upcoming events will appear here
              </Text>
            </View>
          </View>

          {/* Past Events Section (TODO) */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Past Events</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.todoPlaceholder}>
              <Text style={styles.todoIcon}>🕐</Text>
              <Text style={styles.todoText}>
                Past events will appear here
              </Text>
            </View>
          </View>

          {/* Report */}
          <View style={styles.safetySection}>
            <TouchableOpacity
              style={styles.safetyButton}
              onPress={handleReport}
            >
              <Text style={styles.safetyButtonText}>
                Report Series
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollView: {
    flex: 1,
  },

  // Hero / Cover Image
  heroContainer: {
    height: 220,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlaceholderIcon: {
    fontSize: 48,
  },
  heroBackButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBackText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    marginTop: -2,
  },
  badgeRow: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    flexDirection: 'row',
    gap: 8,
  },
  visibilityBadge: {
    backgroundColor: '#14b8a6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  visibilityBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  seriesTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },

  // Recurrence
  recurrenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  recurrenceIcon: {
    fontSize: 16,
  },
  recurrenceText: {
    fontSize: 14,
    color: '#14b8a6',
    fontWeight: '500',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },

  // Organizer
  organizerCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  organizerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  organizerAvatarIcon: {
    fontSize: 20,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  organizerHint: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },

  // Action Buttons
  actionRow: {
    marginBottom: 16,
  },
  subscribeButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  notSubscribedButton: {
    backgroundColor: '#14b8a6',
    borderColor: '#14b8a6',
  },
  subscribedButton: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  subscribeButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  notSubscribedButtonText: {
    color: '#fff',
  },
  subscribedButtonText: {
    color: '#94a3b8',
  },

  // Notification Toggle
  inlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 14,
    marginBottom: 28,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#fff',
  },
  toggleHint: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },

  // Sections
  section: {
    marginBottom: 28,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14b8a6',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#94a3b8',
    lineHeight: 24,
  },

  // TODO Placeholders
  todoPlaceholder: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
  },
  todoIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  todoText: {
    fontSize: 14,
    color: '#64748b',
  },

  // Safety / Report
  safetySection: {
    marginBottom: 16,
    gap: 10,
  },
  safetyButton: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  safetyButtonText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },

  bottomPadding: {
    height: 40,
  },
});
