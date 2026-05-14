import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import EventCard, { EventCardData } from '../../components/EventCard';

// TODO: Replace with real API data
const HOSTED_EVENTS: EventCardData[] = [];

const ATTENDED_EVENTS: EventCardData[] = [];

type TabType = 'hosted' | 'attended';

// Helper function to group events by year
const groupEventsByYear = (events: EventCardData[]): { [year: string]: EventCardData[] } => {
  const grouped: { [year: string]: EventCardData[] } = {};
  
  events.forEach(event => {
    const year = event.date.getFullYear().toString();
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(event);
  });
  
  // Sort events within each year by date (most recent first)
  Object.keys(grouped).forEach(year => {
    grouped[year].sort((a, b) => b.date.getTime() - a.date.getTime());
  });
  
  return grouped;
};

// Get sorted years (most recent first)
const getSortedYears = (grouped: { [year: string]: EventCardData[] }): string[] => {
  return Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a));
};

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('hosted');

  const renderEmptyHosted = () => (
    <View style={styles.emptyStateCard}>
      <View style={styles.emptyStateContent}>
        <Text style={styles.emptyStateTitle}>Start creating amazing events</Text>
        <Text style={styles.emptyStateText}>
          Gather your people. Fuel your passion. Create events that make waves.
        </Text>
        <TouchableOpacity 
          style={styles.startNowButton}
          onPress={() => router.push('/event/create')}
        >
          <Text style={styles.startNowText}>Start now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyAttended = () => (
    <View style={styles.emptyAttendedContainer}>
      <Text style={styles.emptyAttendedEmoji}>🎉</Text>
      <Text style={styles.emptyAttendedTitle}>No events attended yet</Text>
      <Text style={styles.emptyAttendedText}>
        Time to get out there and have some fun! Check out events happening near you.
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => router.push('/(tabs)/home')}
      >
        <Text style={styles.exploreButtonText}>Explore Events</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEventsByYear = (events: EventCardData[]) => {
    const groupedEvents = groupEventsByYear(events);
    const sortedYears = getSortedYears(groupedEvents);

    return (
      <View style={styles.eventsList}>
        {sortedYears.map(year => (
          <View key={year} style={styles.yearSection}>
            <Text style={styles.yearHeader}>{year}</Text>
            {groupedEvents[year].map(event => (
              <EventCard key={event.id} event={event} variant="past" />
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderTabContent = () => {
    if (activeTab === 'hosted') {
      return HOSTED_EVENTS.length > 0 ? renderEventsByYear(HOSTED_EVENTS) : renderEmptyHosted();
    } else {
      return ATTENDED_EVENTS.length > 0 ? renderEventsByYear(ATTENDED_EVENTS) : renderEmptyAttended();
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Profile"
        rightIcon={require('../../assets/Icons/edit_icon.png')}
        onRightPress={() => router.push('/settings/profile')}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>?</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Text style={styles.editAvatarText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>Set up your profile</Text>
          <Text style={styles.userHandle}>@username</Text>
          <Text style={styles.userBio}>
            Tap "Edit Profile" to add your bio
          </Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{HOSTED_EVENTS.length}</Text>
              <Text style={styles.statLabel}>Hosted</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareProfileButton}>
              <Text style={styles.shareProfileText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'hosted' && styles.tabActive]}
            onPress={() => setActiveTab('hosted')}
          >
            <Text style={[styles.tabText, activeTab === 'hosted' && styles.tabTextActive]}>
              Hosted Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'attended' && styles.tabActive]}
            onPress={() => setActiveTab('attended')}
          >
            <Text style={[styles.tabText, activeTab === 'attended' && styles.tabTextActive]}>
              Attended
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0f172a' 
  },
  scrollView: { 
    flex: 1 
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#14b8a6',
  },
  avatarLargeText: { 
    color: '#fff', 
    fontSize: 40, 
    fontWeight: '600' 
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#14b8a6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  editAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: -2,
  },
  userName: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#fff', 
    marginBottom: 2 
  },
  userHandle: { 
    fontSize: 15, 
    color: '#64748b', 
    marginBottom: 12 
  },
  userBio: { 
    fontSize: 14, 
    color: '#94a3b8', 
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 20,
  },
  statItem: { 
    alignItems: 'center' 
  },
  statNumber: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#fff' 
  },
  statLabel: { 
    fontSize: 13, 
    color: '#64748b', 
    marginTop: 2 
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  editProfileButton: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  editProfileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  shareProfileButton: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareProfileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginTop: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#14b8a6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#fff',
  },
  eventsList: {
    paddingTop: 8,
  },
  yearSection: {
    marginBottom: 8,
  },
  yearHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  // Empty state for hosted events
  emptyStateCard: {
    margin: 20,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    padding: 24,
  },
  emptyStateContent: {
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  startNowButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  startNowText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },

  // Empty state for attended events
  emptyAttendedContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyAttendedEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyAttendedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  emptyAttendedText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#14b8a6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },

  bottomPadding: { 
    height: 100 
  },
});
