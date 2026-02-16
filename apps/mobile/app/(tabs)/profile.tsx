import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ImageBackground,
  Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';

const { width } = Dimensions.get('window');
const GRID_GAP = 2;
const GRID_ITEM_SIZE = (width - GRID_GAP * 2) / 3;

// Sample hosted events data
const HOSTED_EVENTS = [
  {
    id: '1',
    title: 'Summer Beach Party',
    image: 'https://images.unsplash.com/photo-1529543544277-750e0662819e?w=400',
    attendees: 45,
    date: 'Jan 15',
  },
  {
    id: '2',
    title: 'Tech Meetup 2026',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    attendees: 120,
    date: 'Jan 10',
  },
  {
    id: '3',
    title: 'Birthday Bash',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400',
    attendees: 28,
    date: 'Dec 28',
  },
  {
    id: '4',
    title: 'New Year Eve Party',
    image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400',
    attendees: 85,
    date: 'Dec 31',
  },
  {
    id: '5',
    title: 'Art Gallery Opening',
    image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=400',
    attendees: 62,
    date: 'Dec 20',
  },
  {
    id: '6',
    title: 'Startup Pitch Night',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400',
    attendees: 95,
    date: 'Dec 15',
  },
];

type TabType = 'events' | 'attended';

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('events');

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const renderEventGrid = () => (
    <View style={styles.eventsGrid}>
      {HOSTED_EVENTS.map((event) => (
        <TouchableOpacity
          key={event.id}
          style={styles.eventGridItem}
          onPress={() => handleEventPress(event.id)}
          activeOpacity={0.8}
        >
          <ImageBackground
            source={{ uri: event.image }}
            style={styles.eventGridImage}
          >
            <View style={styles.eventOverlay}>
              <View style={styles.eventStats}>
                <Text style={styles.eventAttendeesText}>{event.attendees}</Text>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </View>
  );

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
              <Text style={styles.avatarLargeText}>J</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Text style={styles.editAvatarText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userHandle}>@johndoe</Text>
          <Text style={styles.userBio}>
            Event enthusiast | Bringing people together | Vancouver, BC
          </Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{HOSTED_EVENTS.length}</Text>
              <Text style={styles.statLabel}>Hosted</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>1.2K</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>384</Text>
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
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => router.push('/settings/account')}
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'events' && styles.tabActive]}
            onPress={() => setActiveTab('events')}
          >
            <Text style={[styles.tabText, activeTab === 'events' && styles.tabTextActive]}>
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

        {/* Events Grid */}
        {renderEventGrid()}

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
  settingsButton: {
    backgroundColor: '#1e293b',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 18,
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
  eventsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  eventGridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
  },
  eventGridImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  eventOverlay: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  eventStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventAttendeesText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomPadding: { 
    height: 100 
  },
});
