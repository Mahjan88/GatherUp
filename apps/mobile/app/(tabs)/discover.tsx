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
import EventCard, { EventCardData } from '../../components/EventCard';

// TODO: Replace with real data from API
const NEARBY_EVENTS: EventCardData[] = [];

interface PopularPage {
  id: string;
  name: string;
  type: 'user' | 'community';
  avatar?: string;
  followerCount: number;
  isFollowing: boolean;
}

const POPULAR_PAGES: PopularPage[] = [];

type CategoryFilter = 'all' | 'networking' | 'party' | 'workshop' | 'conference' | 'social' | 'sports' | 'other';

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

export default function DiscoverScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const handleFollow = (pageId: string) => {
    // TODO: Call API to follow/unfollow user or community
    console.log(`Toggle follow for ${pageId}`);
  };

  return (
    <View style={styles.container}>
      <Header title="Discover" showNotificationBell={false} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>&#x1F50D;</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search events, people, communities..."
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryChips}
        >
          {CATEGORIES.map(cat => (
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

        {/* POPULAR PAGES */}
        {POPULAR_PAGES.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>POPULAR PAGES</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {POPULAR_PAGES.map(page => (
                <TouchableOpacity
                  key={page.id}
                  style={styles.pageCard}
                  onPress={() =>
                    router.push(
                      page.type === 'community'
                        ? `/community/${page.id}`
                        : `/profile/${page.id}`
                    )
                  }
                >
                  <View style={styles.pageAvatar}>
                    {page.avatar ? (
                      <Image
                        source={{ uri: page.avatar }}
                        style={styles.pageAvatarImage}
                      />
                    ) : (
                      <Text style={styles.pageAvatarText}>
                        {page.name.charAt(0).toUpperCase()}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.pageName} numberOfLines={1}>
                    {page.name}
                  </Text>
                  <Text style={styles.pageFollowers}>
                    {page.followerCount} followers
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.followButton,
                      page.isFollowing && styles.followingButton,
                    ]}
                    onPress={() => handleFollow(page.id)}
                  >
                    <Text
                      style={[
                        styles.followButtonText,
                        page.isFollowing && styles.followingButtonText,
                      ]}
                    >
                      {page.isFollowing ? 'Following' : 'Follow'}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* EVENTS NEAR YOU */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>EVENTS NEAR YOU</Text>
          </View>
          {NEARBY_EVENTS.length > 0 ? (
            NEARBY_EVENTS.map(event => (
              <EventCard key={event.id} event={event} variant="full" />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>&#x1F30D;</Text>
              <Text style={styles.emptyTitle}>No events nearby</Text>
              <Text style={styles.emptyText}>
                Check back soon or try adjusting your location settings
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
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  // Popular page cards
  pageCard: {
    width: 130,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  pageAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  pageAvatarImage: {
    width: '100%',
    height: '100%',
  },
  pageAvatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  pageName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  pageFollowers: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 10,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#14b8a6',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#14b8a6',
  },
  followButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  followingButtonText: {
    color: '#14b8a6',
  },
  // Empty states
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
});
