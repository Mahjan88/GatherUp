import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import EventCard, { EventCardData } from '../../components/EventCard';

const CalendarIcon = require('../../assets/Icons/calendar_icon.png');

const SAMPLE_IMAGES = {
  party: 'https://images.unsplash.com/photo-1529543544277-750e0662819e?w=600',
  concert: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600',
  game: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=600',
  tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
};

const PRIVATE_EVENTS: EventCardData[] = [
  {
    id: '1',
    title: 'Shabeh Jomeh Seattle - Wellbeing Meetup',
    image: SAMPLE_IMAGES.party,
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    location: '1158 Broadway Seattle,...',
    hostName: 'Mas Oud',
    rsvpStatus: 'interested',
  },
  {
    id: '2',
    title: "KREA Showboat",
    image: SAMPLE_IMAGES.game,
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    location: 'Seattle, WA',
    hostName: 'Bahar S',
    rsvpStatus: 'going',
  },
  {
    id: '3',
    title: 'VIP Launch Party',
    image: SAMPLE_IMAGES.concert,
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    location: 'Downtown Seattle',
    hostName: 'Alex Chen',
    rsvpStatus: 'none',
  },
];

const PUBLIC_EVENTS: EventCardData[] = [
  {
    id: '4',
    title: 'Neon Nights Festival',
    image: SAMPLE_IMAGES.concert,
    date: new Date(2026, 0, 24),
    location: 'Seattle Convention Center',
    hostName: 'Seattle Events',
    rsvpStatus: 'none',
  },
  {
    id: '5',
    title: 'Art Gallery Opening',
    image: SAMPLE_IMAGES.tech,
    date: new Date(2026, 0, 28),
    location: 'Pioneer Square Gallery',
    hostName: 'Art Collective',
    rsvpStatus: 'none',
  },
  {
    id: '6',
    title: 'Startup Summit 2026',
    image: SAMPLE_IMAGES.party,
    date: new Date(2026, 1, 1),
    location: 'Tech Hub Downtown',
    hostName: 'Startup Network',
    rsvpStatus: 'none',
  },
];

type TimeFilter = 'week' | 'month' | 'all';

export default function HomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('week');

  return (
    <View style={styles.container}>
      <Header title="Events" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Filter Pills */}
        <View style={styles.filterSection}>
          <View style={styles.filterTabsWrapper}>
            <TouchableOpacity
              style={[styles.filterTab, styles.filterTabIcon]}
              onPress={() => router.push('/calendar')}
            >
              <Image
                source={CalendarIcon}
                style={styles.filterCalendarIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterTab, activeFilter === 'week' && styles.filterTabActive]}
              onPress={() => setActiveFilter('week')}
            >
              <Text style={[styles.filterTabText, activeFilter === 'week' && styles.filterTabTextActive]}>
                This Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterTab, activeFilter === 'month' && styles.filterTabActive]}
              onPress={() => setActiveFilter('month')}
            >
              <Text style={[styles.filterTabText, activeFilter === 'month' && styles.filterTabTextActive]}>
                This Month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterTab, activeFilter === 'all' && styles.filterTabActive]}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={[styles.filterTabText, activeFilter === 'all' && styles.filterTabTextActive]}>
                All Events
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PRIVATE INVITES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PRIVATE INVITES</Text>
            <TouchableOpacity onPress={() => router.push('/past-events')}>
              <Text style={styles.seeAllLink}>past events</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {PRIVATE_EVENTS.map(event => (
              <EventCard key={event.id} event={event} variant="compact" />
            ))}
          </ScrollView>
        </View>

        {/* PUBLIC EVENTS NEAR YOU */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>PUBLIC EVENTS NEAR YOU</Text>
          </View>
        {PUBLIC_EVENTS.map(event => (
          <EventCard key={event.id} event={event} variant="full" />
        ))}
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
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  filterTabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 25,
    padding: 2,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 22,
  },
  filterTabIcon: {
    paddingHorizontal: 12,
  },
  filterTabActive: {
    backgroundColor: '#334155',
  },
  filterTabText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  filterCalendarIcon: {
    tintColor: '#94a3b8',
    width: 35,
    height: 35,
  },
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
  seeAllLink: {
    fontSize: 14,
    fontWeight: '500',
    color: '#14b8a6',
  },
  horizontalScroll: { 
    paddingHorizontal: 20, 
    gap: 12,
  },

  bottomPadding: { 
    height: 100,
  },

  // Floating Calendar Button
  calendarButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  calendarButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  calendarIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
});
