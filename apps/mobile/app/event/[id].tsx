import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BottomTabBar from '../../components/BottomTabBar';
import SlideUpModal from '../../components/SlideUpModal';

// Import icons (512px for high-DPI quality)
const GalleryIcon = require('../../assets/Icons/media_gallery_icon.png');
const ChatIcon = require('../../assets/Icons/group_chat_icon.png');
const LocationIcon = require('../../assets/Icons/location_icon.png');

const { width, height } = Dimensions.get('window');

// Sample image for all events
const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800';

// Mock private event data
const MOCK_PRIVATE_EVENT = {
  id: '1',
  title: "Sarah's VR Game Night",
  organizer: 'Sarah',
  image: SAMPLE_IMAGE,
  description: 'Join us for an epic VR gaming night at Sarah\'s place! We\'ll be playing the latest virtual reality games including Beat Saber tournaments, collaborative puzzle adventures, and immersive horror experiences for the brave souls among us.\n\nWhat to expect:\n• Multiple VR headsets available\n• Snacks and drinks provided\n• Friendly competition with prizes\n• No VR experience required - we\'ll teach you!\n\nPlease arrive on time as we\'ll be starting the tournament promptly at 8:30 PM. Feel free to bring your favorite snacks to share with the group. This is going to be an unforgettable night of virtual adventures and real friendships!',
  date: 'Sunday, Jan. 25, 2026',
  time: '7:00 PM EST',
  location: "Sarah's Place",
  address: '123 Main Street, Apt 4B',
  city: 'Portland, OR 97201',
  coordinates: {
    lat: 45.5152,
    lng: -122.6784,
  },
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
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  const event = MOCK_PRIVATE_EVENT;

  // Static map URL using OpenStreetMap tile service
  const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${event.coordinates.lat},${event.coordinates.lng}&zoom=16&size=600x300&maptype=mapnik&markers=${event.coordinates.lat},${event.coordinates.lng},red-pushpin`;

  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${event.coordinates.lat},${event.coordinates.lng}`;
    Linking.openURL(url);
  };

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
            
            <TouchableOpacity style={styles.actionItem} onPress={() => setShowLocationModal(true)}>
              <View style={styles.actionCircle}>
                <Image source={LocationIcon} style={styles.actionIcon} resizeMode="contain" />
              </View>
              <Text style={styles.actionLabel}>Location</Text>
            </TouchableOpacity>
          </View>

          {/* Event Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Description</Text>
            <Text style={styles.descriptionText} numberOfLines={5}>
              {event.description}
            </Text>
            <TouchableOpacity onPress={() => setShowDescriptionModal(true)}>
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
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

      {/* Location Modal */}
      <SlideUpModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        scrollable={false}
        minHeight={0.45}
        maxHeight={0.6}
      >
        {/* Location Header */}
        <View style={styles.locationHeader}>
          <View style={styles.locationIconCircle}>
            <Image source={LocationIcon} style={styles.locationModalIcon} resizeMode="contain" />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationName}>{event.location}</Text>
            <Text style={styles.locationAddress}>{event.address}</Text>
            <Text style={styles.locationCity}>{event.city}</Text>
          </View>
        </View>

        {/* Map Preview */}
        <TouchableOpacity style={styles.mapContainer} onPress={openInMaps}>
          <Image 
            source={{ uri: staticMapUrl }}
            style={styles.mapPreview}
            resizeMode="cover"
          />
          <View style={styles.mapPinOverlay}>
            <Text style={styles.mapPinEmoji}>📍</Text>
          </View>
        </TouchableOpacity>

        {/* Actions */}
        <View style={styles.locationActions}>
          <TouchableOpacity style={styles.openMapsButton} onPress={openInMaps}>
            <Text style={styles.openMapsText}>Open in Maps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.copyAddressButton}>
            <Text style={styles.copyAddressText}>Copy Address</Text>
          </TouchableOpacity>
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
  seeMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14b8a6',
    marginTop: 8,
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
  
  // Location Modal Content Styles
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  locationIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  locationModalIcon: {
    width: 40,
    height: 40,
    tintColor: '#14b8a6',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 15,
    color: '#94a3b8',
    marginBottom: 2,
  },
  locationCity: {
    fontSize: 15,
    color: '#94a3b8',
  },
  mapContainer: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
    backgroundColor: '#e5e7eb',
  },
  mapPreview: {
    width: '100%',
    height: '100%',
  },
  mapPinOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -15,
  },
  mapPinEmoji: {
    fontSize: 32,
  },
  locationActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  openMapsButton: {
    flex: 1,
    backgroundColor: '#14b8a6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  openMapsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  copyAddressButton: {
    flex: 1,
    backgroundColor: '#334155',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  copyAddressText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Description Modal Content Styles
  descriptionModalText: {
    fontSize: 16,
    color: '#e2e8f0',
    lineHeight: 26,
  },
});
