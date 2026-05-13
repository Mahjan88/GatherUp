import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';

// TODO: Replace with real data from API
interface NearbyEvent {
  id: string;
  title: string;
  start_time: string;
  location: string | null;
  cover_image_url: string | null;
  category: string;
  member_count: number;
}
const NEARBY_EVENTS: NearbyEvent[] = [];

type TimeFilter = 'today' | 'this_week' | 'this_month';
type CategoryFilter =
  | 'all'
  | 'networking'
  | 'party'
  | 'workshop'
  | 'conference'
  | 'social'
  | 'sports'
  | 'other';

const TIME_FILTERS: { value: TimeFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
];

const CATEGORIES: { label: string; value: CategoryFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Networking', value: 'networking' },
  { label: 'Party', value: 'party' },
  { label: 'Workshop', value: 'workshop' },
  { label: 'Conference', value: 'conference' },
  { label: 'Social', value: 'social' },
  { label: 'Sports', value: 'sports' },
  { label: 'Other', value: 'other' },
];

interface NearbyCommunity {
  id: string;
  name: string;
  city: string | null;
  category: string;
  member_count: number;
  cover_image_url: string | null;
}
const NEARBY_COMMUNITIES: NearbyCommunity[] = [];

export default function DiscoverScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('this_week');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const previewEvents = NEARBY_EVENTS.slice(0, 5);
  const previewCommunities = NEARBY_COMMUNITIES.slice(0, 5);

  return (
    <View style={styles.container}>
      <Header title="Discover" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search events, people, communities..."
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Calendar time tabs */}
        <View style={styles.timeTabsContainer}>
          {TIME_FILTERS.map((tab) => (
            <TouchableOpacity
              key={tab.value}
              style={[
                styles.timeTab,
                timeFilter === tab.value && styles.timeTabActive,
              ]}
              onPress={() => setTimeFilter(tab.value)}
            >
              <Text
                style={[
                  styles.timeTabText,
                  timeFilter === tab.value && styles.timeTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryChips}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.categoryChip,
                activeCategory === cat.value && styles.categoryChipActive,
              ]}
              onPress={() => setActiveCategory(cat.value)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  activeCategory === cat.value && styles.categoryChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* EVENTS NEAR YOU — horizontal carousel of 5 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>EVENTS NEAR YOU</Text>
            <TouchableOpacity onPress={() => router.push('/discover/events')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {previewEvents.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {previewEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.eventCard}
                  onPress={() => router.push(`/event/${event.id}`)}
                >
                  <View style={styles.eventCardImage}>
                    {event.cover_image_url ? (
                      <Image
                        source={{ uri: event.cover_image_url }}
                        style={styles.eventCardImageFull}
                      />
                    ) : (
                      <Text style={styles.eventCardImagePlaceholder}>📅</Text>
                    )}
                  </View>
                  <View style={styles.eventCardBody}>
                    <Text style={styles.eventCardDate}>
                      {new Date(event.start_time).toLocaleDateString(
                        undefined,
                        { weekday: 'short', month: 'short', day: 'numeric' }
                      )}
                    </Text>
                    <Text style={styles.eventCardTitle} numberOfLines={2}>
                      {event.title}
                    </Text>
                    {event.location && (
                      <Text style={styles.eventCardLocation} numberOfLines={1}>
                        {event.location}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📅</Text>
              <Text style={styles.emptyTitle}>No events found</Text>
              <Text style={styles.emptyText}>
                Try a different time range or check back later
              </Text>
            </View>
          )}
        </View>

        {/* COMMUNITIES NEAR YOU — horizontal carousel of 5 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>COMMUNITIES NEAR YOU</Text>
            <TouchableOpacity
              onPress={() => router.push('/discover/communities')}
            >
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {previewCommunities.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {previewCommunities.map((community) => (
                <TouchableOpacity
                  key={community.id}
                  style={styles.communityCard}
                  onPress={() => router.push(`/community/${community.id}`)}
                >
                  <View style={styles.communityAvatar}>
                    {community.cover_image_url ? (
                      <Image
                        source={{ uri: community.cover_image_url }}
                        style={styles.communityAvatarImage}
                      />
                    ) : (
                      <Text style={styles.communityAvatarText}>
                        {community.name.charAt(0).toUpperCase()}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.communityName} numberOfLines={1}>
                    {community.name}
                  </Text>
                  {community.city && (
                    <Text style={styles.communityCity} numberOfLines={1}>
                      {community.city}
                    </Text>
                  )}
                  <Text style={styles.communityMembers}>
                    {community.member_count} members
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🏘️</Text>
              <Text style={styles.emptyTitle}>
                No communities found nearby
              </Text>
              <Text style={styles.emptyText}>
                Update your location in settings to discover local communities
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomPadding} />
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
  // Search
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
  },
  // Time filter tabs
  timeTabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
  },
  timeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeTabActive: {
    backgroundColor: '#14b8a6',
  },
  timeTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  timeTabTextActive: {
    color: '#fff',
  },
  // Category chips
  categoryChips: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 24,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryChipActive: {
    backgroundColor: '#14b8a6',
    borderColor: '#14b8a6',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  categoryChipTextActive: {
    color: '#0f172a',
  },
  // Sections
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#14b8a6',
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  // Event cards (horizontal)
  eventCard: {
    width: 200,
    backgroundColor: '#1e293b',
    borderRadius: 14,
    overflow: 'hidden',
  },
  eventCardImage: {
    height: 100,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventCardImageFull: {
    width: '100%',
    height: '100%',
  },
  eventCardImagePlaceholder: {
    fontSize: 28,
  },
  eventCardBody: {
    padding: 12,
  },
  eventCardDate: {
    fontSize: 11,
    fontWeight: '600',
    color: '#14b8a6',
    marginBottom: 4,
  },
  eventCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    lineHeight: 18,
  },
  eventCardLocation: {
    fontSize: 12,
    color: '#64748b',
  },
  // Community cards (horizontal)
  communityCard: {
    width: 140,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  communityAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  communityAvatarImage: {
    width: '100%',
    height: '100%',
  },
  communityAvatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#14b8a6',
  },
  communityName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
    textAlign: 'center',
  },
  communityCity: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 2,
    textAlign: 'center',
  },
  communityMembers: {
    fontSize: 11,
    color: '#475569',
  },
  // Empty states
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
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
  bottomPadding: {
    height: 100,
  },
});
