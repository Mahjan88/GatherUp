import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ImageBackground,
  Image,
  Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';

const { width } = Dimensions.get('window');
const PRIVATE_CARD_WIDTH = width * 0.42;
const PUBLIC_CARD_WIDTH = width * 0.75;

interface PrivateEvent {
  id: string;
  title: string;
  image: string;
  hasRsvp?: boolean;
}

interface PublicEvent {
  id: string;
  title: string;
  image: string;
  dateRange: string;
}

const SAMPLE_IMAGES = {
  party: 'https://images.unsplash.com/photo-1529543544277-750e0662819e?w=600',
  concert: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600',
  game: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=600',
  tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
};

const PRIVATE_EVENTS: PrivateEvent[] = [
  {
    id: '1',
    title: 'Exclusive Mocktfly Night',
    image: SAMPLE_IMAGES.party,
    hasRsvp: true,
  },
  {
    id: '2',
    title: "Sarah's RTFO Campaign",
    image: SAMPLE_IMAGES.game,
    hasRsvp: true,
  },
  {
    id: '3',
    title: 'VIP Launch Party',
    image: SAMPLE_IMAGES.concert,
    hasRsvp: false,
  },
];

const PUBLIC_EVENTS: PublicEvent[] = [
  {
    id: '4',
    title: 'Neon Nights Festival',
    image: SAMPLE_IMAGES.concert,
    dateRange: 'Jan 24-26',
  },
  {
    id: '5',
    title: 'Art Gallery Opening',
    image: SAMPLE_IMAGES.tech,
    dateRange: 'Jan 28',
  },
  {
    id: '6',
    title: 'Startup Summit 2026',
    image: SAMPLE_IMAGES.party,
    dateRange: 'Feb 1-3',
  },
];

type TimeFilter = 'week' | 'month' | 'all';

export default function HomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('week');

  const renderPrivateCard = (event: PrivateEvent) => (
    <TouchableOpacity 
      key={event.id} 
      style={styles.privateCard}
      onPress={() => router.push(`/event/${event.id}`)}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: event.image }}
        style={styles.privateCardImage}
        imageStyle={styles.privateCardImageStyle}
      >
        <View style={styles.privateCardOverlay}>
          <View style={styles.privateCardFooter}>
            <View style={styles.privateCardInfo}>
              <Text style={styles.privateCardTitle} numberOfLines={2}>
                {event.title}
              </Text>
              <TouchableOpacity style={styles.viewInviteButton}>
                <Text style={styles.viewInviteText}>
                  {event.hasRsvp ? 'RSVP' : 'View Invite'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderPublicCard = (event: PublicEvent) => (
    <TouchableOpacity 
      key={event.id} 
      style={styles.publicCard}
      onPress={() => router.push(`/event/${event.id}`)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: event.image }}
        style={styles.publicCardImage}
      />
      <View style={styles.publicCardContent}>
        <Text style={styles.publicCardTitle}>{event.title.toUpperCase()}</Text>
        <View style={styles.publicCardFooter}>
          <Text style={styles.publicCardDate}>#{event.dateRange}</Text>
          <TouchableOpacity style={styles.viewDetailsButton}>
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Events" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Filter Pills */}
        <View style={styles.filterSection}>
          <TouchableOpacity 
            style={[styles.filterPill, activeFilter === 'week' && styles.filterPillActive]}
            onPress={() => setActiveFilter('week')}
          >
            <Text style={[styles.filterPillText, activeFilter === 'week' && styles.filterPillTextActive]}>
              This Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterPill, activeFilter === 'month' && styles.filterPillActive]}
            onPress={() => setActiveFilter('month')}
          >
            <Text style={[styles.filterPillText, activeFilter === 'month' && styles.filterPillTextActive]}>
              This Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterPill, activeFilter === 'all' && styles.filterPillActive]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterPillText, activeFilter === 'all' && styles.filterPillTextActive]}>
              All Events
            </Text>
          </TouchableOpacity>
        </View>

        {/* PRIVATE INVITES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRIVATE INVITES</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {PRIVATE_EVENTS.map(event => renderPrivateCard(event))}
          </ScrollView>
        </View>

        {/* PUBLIC EVENTS NEAR YOU */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PUBLIC EVENTS NEAR YOU</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {PUBLIC_EVENTS.map(event => renderPublicCard(event))}
          </ScrollView>
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
  filterSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterPillActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterPillText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  filterPillTextActive: {
    color: '#fff',
  },
  section: { 
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 20,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  horizontalScroll: { 
    paddingHorizontal: 20, 
    gap: 12,
  },

  // Private Event Cards
  privateCard: { 
    width: PRIVATE_CARD_WIDTH, 
    height: 180,
    borderRadius: 16, 
    overflow: 'hidden',
  },
  privateCardImage: { 
    flex: 1,
  },
  privateCardImageStyle: { 
    borderRadius: 16,
  },
  privateCardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 12,
    justifyContent: 'space-between',
  },
  privateCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rsvpBadge: {
    backgroundColor: '#14b8a6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rsvpBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  privateCardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  privateCardInfo: {
    flex: 1,
    marginRight: 8,
  },
  privateCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  viewInviteButton: {
    backgroundColor: '#14b8a6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  viewInviteText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  lockCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#14b8a6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 16,
  },

  // Public Event Cards
  publicCard: { 
    width: PUBLIC_CARD_WIDTH,
    borderRadius: 16, 
    overflow: 'hidden',
    backgroundColor: '#1e293b',
  },
  publicCardImage: { 
    width: '100%',
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  publicCardContent: {
    padding: 16,
  },
  publicCardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
  },
  publicCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  publicCardDate: {
    fontSize: 14,
    color: '#94a3b8',
  },
  viewDetailsButton: {
    backgroundColor: '#14b8a6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  viewDetailsText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  bottomPadding: { 
    height: 100,
  },
});
