import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BottomTabBar from '../../components/BottomTabBar';

// Import icons (512px for high-DPI quality)
const GalleryIcon = require('../../assets/Icons/gallery_icon_v2_512.png');
const ChatIcon = require('../../assets/Icons/chat_icon_512.png');
const LocationIcon = require('../../assets/Icons/location_icon_v2_512.png');

const { width } = Dimensions.get('window');

// Sample image for all events
const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800';

// Mock private event data
const MOCK_PRIVATE_EVENT = {
  id: '1',
  title: "Sarah's VR Game Night",
  organizer: 'Sarah',
  image: SAMPLE_IMAGE,
  description: 'In ther Des riplio arf the sararis teines. To purr ae lurre ths esrter lurst the wolint nat yourit and eltgit. Ro te pe nnmid lot you ne tte trid gave nestrer.',
  date: 'Sunday, Jan. 25, 2026',
  time: '7:00 PM EST',
  location: 'Sarah\'s Place',
  isPrivate: true,
  isFree: true,
  friendsAttending: [
    { id: '1', name: 'Alex', avatar: 'https://i.pravatar.cc/100?img=1' },
    { id: '2', name: 'Sarah', avatar: 'https://i.pravatar.cc/100?img=2' },
    { id: '3', name: 'Mike', avatar: 'https://i.pravatar.cc/100?img=3' },
  ],
  mutualFriends: 5,
  agenda: [
    { time: '7:00 PM', title: 'Welcome & Drinks' },
    { time: '8:30 PM', title: 'VR Tournament' },
    { time: '10:00 PM', title: 'Late Night Quest' },
  ],
};

export default function EventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const event = MOCK_PRIVATE_EVENT;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: event.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          
          {/* Private Event Badge */}
          {event.isPrivate && (
            <View style={styles.privateBadge}>
              <Text style={styles.privateBadgeText}>Private Event</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Event Title */}
          <Text style={styles.eventTitle}>{event.title}</Text>
          
          {/* Date & Time */}
          <Text style={styles.dateTime}>{event.date} • {event.time}</Text>

          {/* Action Icons */}
          <View style={styles.actionIcons}>
            <TouchableOpacity style={styles.actionItem} onPress={() => router.push(`/chat/${id}`)}>
              <View style={styles.actionCircle}>
                <Image source={ChatIcon} style={styles.actionIcon} resizeMode="contain" />
              </View>
              <Text style={styles.actionLabel}>Group Chat</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={() => router.push(`/gallery/${id}`)}>
              <View style={styles.actionCircle}>
                <Image source={GalleryIcon} style={styles.actionIcon} resizeMode="contain" />
              </View>
              <Text style={styles.actionLabel}>Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionCircle}>
                <Image source={LocationIcon} style={styles.actionIcon} resizeMode="contain" />
              </View>
              <Text style={styles.actionLabel}>Location</Text>
            </TouchableOpacity>
          </View>

          {/* Event Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Description</Text>
            <Text style={styles.descriptionText}>{event.description}</Text>
          </View>

          {/* Who's Going */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Who's Going</Text>
            <View style={styles.attendeesRow}>
              <View style={styles.avatarsStack}>
                {event.friendsAttending.map((friend, index) => (
                  <Image 
                    key={friend.id}
                    source={{ uri: friend.avatar }}
                    style={[styles.attendeeAvatar, { marginLeft: index > 0 ? -12 : 0, zIndex: 3 - index }]}
                  />
                ))}
              </View>
              <Text style={styles.attendeesText}>{event.mutualFriends} mutual friends are going</Text>
            </View>
          </View>

          {/* Agenda */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Agenda</Text>
            <View style={styles.agendaList}>
              {event.agenda.map((item, index) => (
                <View key={index} style={styles.agendaItem}>
                  <View style={styles.agendaTimeline}>
                    <View style={styles.agendaLine} />
                  </View>
                  <Text style={styles.agendaText}>
                    <Text style={styles.agendaTime}>{item.time}: </Text>
                    {item.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar 
        middleButton={{
          label: 'RSVP',
          onPress: () => {},
        }}
      />
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
  heroContainer: { 
    height: 280, 
    position: 'relative',
  },
  heroImage: { 
    width: '100%', 
    height: '100%',
  },
  privateBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#14b8a6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  privateBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  eventTitle: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#fff',
    marginBottom: 8,
  },
  dateTime: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 24,
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 32,
    marginBottom: 32,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#14b8a6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionIcon: {
    width: 36,
    height: 36,
    tintColor: '#14b8a6',
  },
  actionLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#94a3b8',
    lineHeight: 24,
  },
  attendeesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarsStack: {
    flexDirection: 'row',
  },
  attendeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  attendeesText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  agendaList: {
    paddingLeft: 8,
  },
  agendaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  agendaTimeline: {
    width: 20,
    alignItems: 'center',
    paddingTop: 8,
  },
  agendaLine: {
    width: 3,
    height: 20,
    backgroundColor: '#14b8a6',
    borderRadius: 2,
  },
  agendaText: {
    fontSize: 15,
    color: '#fff',
    flex: 1,
    paddingTop: 4,
  },
  agendaTime: {
    color: '#94a3b8',
  },
  bottomPadding: { 
    height: 120,
  },
});
