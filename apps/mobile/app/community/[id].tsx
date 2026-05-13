import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '../../components/Header';

type CommunityCategory =
  | 'networking'
  | 'party'
  | 'workshop'
  | 'conference'
  | 'social'
  | 'sports'
  | 'other';

type Visibility = 'public' | 'private';

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

export default function CommunityDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // TODO: Fetch community data from API using the id param
  const [community, setCommunity] = useState<CommunityDetail | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [notifyOnEvents, setNotifyOnEvents] = useState(true);

  const handleFollow = () => {
    // TODO: Call API to follow/unfollow community
    // POST /api/communities/:id/follow or DELETE /api/communities/:id/follow
    setIsFollowing(!isFollowing);
  };

  const handleJoin = () => {
    // TODO: Call API to join community
    // POST /api/communities/:id/join
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
      ],
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
      ],
    );
  };

  // Empty / not-found state
  if (!community) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <TouchableOpacity
            style={styles.heroBackButton}
            onPress={() => router.back()}
          >
            <Text style={styles.heroBackText}>&#x2039;</Text>
          </TouchableOpacity>
          <Text style={styles.emptyStateIcon}>👥</Text>
          <Text style={styles.emptyStateTitle}>Community not found</Text>
          <Text style={styles.emptyStateText}>
            This community may have been removed or is no longer available.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <View style={styles.heroContainer}>
          {community.cover_image_url ? (
            <Image
              source={{ uri: community.cover_image_url }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Text style={styles.heroPlaceholderIcon}>👥</Text>
            </View>
          )}

          {/* Back Button */}
          <TouchableOpacity
            style={styles.heroBackButton}
            onPress={() => router.back()}
          >
            <Text style={styles.heroBackText}>&#x2039;</Text>
          </TouchableOpacity>

          {/* Visibility Badge */}
          <View style={styles.visibilityBadge}>
            <Text style={styles.visibilityBadgeText}>
              {community.visibility === 'private' ? 'Private' : 'Public'}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Name */}
          <Text style={styles.communityName}>{community.name}</Text>

          {/* Meta Row: category, city, members */}
          <View style={styles.metaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {CATEGORY_LABELS[community.category]}
              </Text>
            </View>
            {community.city && (
              <Text style={styles.metaText}>{community.city}</Text>
            )}
          </View>

          {/* Member Count */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{community.member_count}</Text>
              <Text style={styles.statLabel}>
                {community.member_count === 1 ? 'Member' : 'Members'}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.joinButton, styles.primaryButton]}
              onPress={handleJoin}
            >
              <Text style={styles.primaryButtonText}>Join Community</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.followButton,
                isFollowing
                  ? styles.followingButton
                  : styles.notFollowingButton,
              ]}
              onPress={handleFollow}
            >
              <Text
                style={[
                  styles.followButtonText,
                  isFollowing
                    ? styles.followingButtonText
                    : styles.notFollowingButtonText,
                ]}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          {community.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.descriptionText}>
                {community.description}
              </Text>
            </View>
          )}

          {/* Members Section (TODO) */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Members</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.todoPlaceholder}>
              <Text style={styles.todoIcon}>👥</Text>
              <Text style={styles.todoText}>
                Member list will appear here
              </Text>
            </View>
          </View>

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

          {/* Report / Block */}
          <View style={styles.safetySection}>
            <TouchableOpacity
              style={styles.safetyButton}
              onPress={handleReport}
            >
              <Text style={styles.safetyButtonText}>Report Community</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.safetyButton}
              onPress={handleBlock}
            >
              <Text style={[styles.safetyButtonText, styles.blockText]}>
                Block Community
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
  visibilityBadge: {
    position: 'absolute',
    bottom: 16,
    left: 20,
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

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  communityName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#14b8a6',
    fontWeight: '500',
  },
  metaText: {
    fontSize: 14,
    color: '#94a3b8',
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

  // Action Buttons
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  joinButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#14b8a6',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  followButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  notFollowingButton: {
    backgroundColor: 'transparent',
    borderColor: '#14b8a6',
  },
  followingButton: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  followButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  notFollowingButtonText: {
    color: '#14b8a6',
  },
  followingButtonText: {
    color: '#94a3b8',
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

  // Safety / Report / Block
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
  blockText: {
    color: '#ef4444',
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
