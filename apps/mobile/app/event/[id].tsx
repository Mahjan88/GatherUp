import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

// Sample image for all events
const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1529543544277-750e0662819e?w=800';

// Mock private event data
const MOCK_PRIVATE_EVENT = {
  id: '1',
  title: 'Music Festival 2026',
  organizer: 'DevsNYC Community',
  isVerified: true,
  image: SAMPLE_IMAGE,
  description: 'Experience the neon lights and electronic beats at the biggest music festival of the year. Join thousands of music lovers for an unforgettable night.',
  date: 'Jan 24, 2026',
  time: '08:00 PM - 02:00 AM',
  location: 'Gnebanyi',
  distance: '2.4 miles away',
  address: '123 Festival Drive, San Francisco, CA',
  rating: 4.9,
  reviewCount: '5k',
  isPrivate: true,
  isFree: false,
  price: 45.00,
  friendsAttending: [
    { id: '1', name: 'Alex', avatar: 'A' },
    { id: '2', name: 'Sarah', avatar: 'S' },
    { id: '3', name: 'Mike', avatar: 'M' },
    { id: '4', name: 'Lisa', avatar: 'L' },
  ],
  totalFriends: 12,
  hasAgenda: true,
  agenda: [
    { time: '10:00 AM', title: 'Caffeinate & Network', icon: '☕' },
    { time: '11:00 AM', title: 'Quick Talks: Latest in JS', icon: '💬' },
    { time: '12:00 PM', title: 'Open Discussion & Collab', icon: '💻' },
    { time: '01:00 PM', title: 'Open Discussion & Collab', icon: '💭' },
  ],
};

// Mock public event data (to be implemented later)
const MOCK_PUBLIC_EVENT = {
  id: '2',
  title: 'Tech Summit 2026',
  isPrivate: false,
  // ... public event details will be added later
};

export default function EventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // For now, using private event mock data
  // Later: fetch event by ID and check isPrivate to render appropriate view
  const event = MOCK_PRIVATE_EVENT;
  const isPrivate = event.isPrivate;

  // Public event view will be added later
  // if (!isPrivate) {
  //   return renderPublicEventView();
  // }

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={[styles.star, i <= Math.floor(rating) ? styles.starFilled : styles.starEmpty]}>
          ★
        </Text>
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      {/* Hero Image */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: event.image }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        
        {/* Header overlay */}
        <View style={styles.headerOverlay}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerActionBtn}>
              <Text style={styles.headerActionIcon}>📤</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionBtn}>
              <Text style={styles.headerActionIcon}>♡</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Title card overlapping image */}
        <View style={styles.titleCard}>
          <Text style={styles.titleCardText}>{event.title.toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rating */}
        <View style={styles.ratingRow}>
          <View style={styles.starsContainer}>
            {renderStars(event.rating)}
          </View>
          <Text style={styles.ratingText}>{event.rating}</Text>
          <Text style={styles.reviewCount}>({event.reviewCount} reviews)</Text>
        </View>

        {/* Event Title & Organizer */}
        <Text style={styles.eventTitle}>{event.title}</Text>

        {/* Date, Time, Location */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📅</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{event.date}</Text>
              <Text style={styles.infoSubLabel}>{event.time}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoLabel}>{event.location}, {event.distance}</Text>
          </View>
        </View>

        {/* About This Event */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About This Event</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
          <TouchableOpacity>
            <Text style={styles.readMore}>Read More</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions - Gallery & Chats */}
        <View style={styles.quickActionsSection}>
          <TouchableOpacity 
            style={styles.quickActionCircle}
            onPress={() => router.push(`/gallery/${id}`)}
          >
            <View style={styles.quickActionInner}>
              <Text style={styles.quickActionIcon}>🖼️</Text>
            </View>
            <Text style={styles.quickActionLabel}>Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCircle}
            onPress={() => router.push(`/chat/${id}`)}
          >
            <View style={styles.quickActionInner}>
              <Text style={styles.quickActionIcon}>💬</Text>
            </View>
            <Text style={styles.quickActionLabel}>Chats</Text>
          </TouchableOpacity>
        </View>

        {/* Agenda Section (if available) */}
        {event.hasAgenda && (
          <View style={styles.agendaSection}>
            <Text style={styles.sectionTitle}>Agenda</Text>
            <View style={styles.agendaList}>
              {event.agenda.map((item, index) => (
                <View key={index} style={styles.agendaItem}>
                  <View style={styles.agendaTimeline}>
                    <View style={styles.agendaDot} />
                    {index < event.agenda.length - 1 && <View style={styles.agendaLine} />}
                  </View>
                  <View style={styles.agendaIconBox}>
                    <Text style={styles.agendaIcon}>{item.icon}</Text>
                  </View>
                  <View style={styles.agendaContent}>
                    <Text style={styles.agendaTime}>{item.time}</Text>
                    <Text style={styles.agendaTitle}>{item.title}</Text>
                  </View>
                  {index >= 2 && (
                    <View style={styles.agendaAvatars}>
                      {event.friendsAttending.slice(0, 2).map((friend, i) => (
                        <View key={friend.id} style={[styles.agendaAvatar, { marginLeft: i > 0 ? -8 : 0 }]}>
                          <Text style={styles.agendaAvatarText}>{friend.avatar}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationRow}>
            <View style={styles.mapPlaceholder}>
              <View style={styles.mapPin}>
                <Text style={styles.mapPinIcon}>📍</Text>
              </View>
            </View>
            <View style={styles.friendsAttendingBox}>
              <Text style={styles.friendsTitle}>Friends Attending</Text>
              <View style={styles.friendsAvatarRow}>
                {event.friendsAttending.map((friend, i) => (
                  <View key={friend.id} style={[styles.friendAvatar, { marginLeft: i > 0 ? -10 : 0 }]}>
                    <Text style={styles.friendAvatarText}>{friend.avatar}</Text>
                  </View>
                ))}
                <Text style={styles.moreFriends}>+{event.totalFriends} friends</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        {event.isFree ? (
          <>
            <TouchableOpacity style={styles.maybeButton}>
              <Text style={styles.maybeIcon}>❓</Text>
              <Text style={styles.maybeText}>Maybe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rsvpButton}>
              <Text style={styles.rsvpButtonText}>RSVP - It's Free!</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.priceText}>${event.price.toFixed(2)}</Text>
            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyButtonText}>BUY TICKETS</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  heroContainer: { height: 280, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  headerOverlay: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 28, color: '#fff', marginTop: -2 },
  headerActions: { flexDirection: 'row', gap: 12 },
  headerActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActionIcon: { fontSize: 18, color: '#fff' },
  titleCard: {
    position: 'absolute',
    bottom: -24,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(60, 20, 100, 0.9)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  titleCardText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
  },
  content: { flex: 1, paddingTop: 36, paddingHorizontal: 20 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  starsContainer: { flexDirection: 'row' },
  star: { fontSize: 16, marginRight: 2 },
  starFilled: { color: '#fbbf24' },
  starEmpty: { color: '#4b5563' },
  ratingText: { fontSize: 14, color: '#fbbf24', fontWeight: '600', marginLeft: 8 },
  reviewCount: { fontSize: 14, color: '#9ca3af', marginLeft: 4 },
  eventTitle: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 8 },
  organizerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  organizerText: { fontSize: 14, color: '#9ca3af', flex: 1 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center' },
  verifiedIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#22c55e',
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 20,
    marginRight: 6,
  },
  verifiedText: { fontSize: 10, color: '#22c55e', lineHeight: 12 },
  infoCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoIcon: { fontSize: 18, marginRight: 12 },
  infoContent: {},
  infoLabel: { fontSize: 15, color: '#fff', fontWeight: '500' },
  infoSubLabel: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  viewAllButton: {
    borderWidth: 1,
    borderColor: '#64748b',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  viewAllText: { fontSize: 12, color: '#94a3b8' },
  description: { fontSize: 14, color: '#94a3b8', lineHeight: 22 },
  readMore: { fontSize: 14, color: '#a855f7', marginTop: 4 },
  quickActionsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 24,
    marginBottom: 28,
  },
  quickActionCircle: { alignItems: 'center' },
  quickActionInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#06b6d4',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionIcon: { fontSize: 28 },
  quickActionLabel: { fontSize: 12, color: '#fff', fontWeight: '500' },
  agendaSection: { marginBottom: 28 },
  agendaList: { marginTop: 16 },
  agendaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  agendaTimeline: { alignItems: 'center', marginRight: 12 },
  agendaDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#94a3b8',
  },
  agendaLine: {
    width: 2,
    height: 50,
    backgroundColor: '#334155',
  },
  agendaIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  agendaIcon: { fontSize: 20 },
  agendaContent: { flex: 1 },
  agendaTime: { fontSize: 12, color: '#64748b', marginBottom: 2 },
  agendaTitle: { fontSize: 14, color: '#fff', fontWeight: '500' },
  agendaAvatars: { flexDirection: 'row', alignItems: 'center' },
  agendaAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ec4899',
    borderWidth: 2,
    borderColor: '#0a0a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  agendaAvatarText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  locationRow: { flexDirection: 'row', gap: 16 },
  mapPlaceholder: {
    width: 140,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#06b6d4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinIcon: { fontSize: 16 },
  friendsAttendingBox: { flex: 1 },
  friendsTitle: { fontSize: 14, color: '#fff', fontWeight: '600', marginBottom: 12 },
  friendsAvatarRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  friendAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8b5cf6',
    borderWidth: 2,
    borderColor: '#0a0a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendAvatarText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  moreFriends: { fontSize: 12, color: '#94a3b8', marginLeft: 8 },
  bottomPadding: { height: 100 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  priceText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  buyButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#06b6d4',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
  },
  buyButtonText: { fontSize: 16, fontWeight: '700', color: '#06b6d4' },
  maybeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 6,
  },
  maybeIcon: { fontSize: 16 },
  maybeText: { fontSize: 14, fontWeight: '600', color: '#06b6d4' },
  rsvpButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    marginLeft: 12,
  },
  rsvpButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
