import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import EventCard, { EventCardData } from '../components/EventCard';

const SAMPLE_IMAGES = {
  party: 'https://images.unsplash.com/photo-1529543544277-750e0662819e?w=600',
  concert: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600',
  game: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=600',
  tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
};

const PENDING_INVITES: EventCardData[] = [
  {
    id: '1',
    title: 'Shabeh Jomeh Seattle - Wellbeing Meetup',
    image: SAMPLE_IMAGES.party,
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    location: '1158 Broadway Seattle, WA 98122 Unite...',
    hostName: 'Mas Oud',
    rsvpStatus: 'interested',
    isPending: true,
  },
];

const UPCOMING_EVENTS: EventCardData[] = [
  {
    id: '2',
    title: 'KREAM',
    image: SAMPLE_IMAGES.game,
    date: new Date(2026, 2, 6, 21, 0),
    location: 'Showbox SoDo',
    hostName: 'Bahar',
    rsvpStatus: 'interested',
    attendees: [
      { name: 'Bahar' },
      { name: 'Sahar' },
    ],
  },
];

const PAST_EVENTS: EventCardData[] = [
  {
    id: '3',
    title: 'New Year Celebration 2026',
    image: SAMPLE_IMAGES.concert,
    date: new Date(2026, 0, 1, 20, 0),
    location: 'Space Needle, Seattle',
    hostName: 'Seattle Events',
    rsvpStatus: 'going',
    isPast: true,
  },
  {
    id: '4',
    title: 'Tech Meetup January',
    image: SAMPLE_IMAGES.tech,
    date: new Date(2026, 0, 15, 18, 0),
    location: 'Amazon HQ, Seattle',
    hostName: 'Tech Community',
    rsvpStatus: 'going',
    isPast: true,
  },
];

type TabFilter = 'hosting' | 'past';

export default function EventsInboxScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabFilter | null>(null);

  const rightElement = (
    <TouchableOpacity 
      style={styles.addButton}
      onPress={() => router.push('/create-event')}
    >
      <Text style={styles.addButtonText}>+</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Events Inbox" 
        showBack={true}
        rightElement={rightElement}
      />

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'hosting' && styles.tabActive]}
          onPress={() => setActiveTab(activeTab === 'hosting' ? null : 'hosting')}
        >
          <Text style={[styles.tabText, activeTab === 'hosting' && styles.tabTextActive]}>
            🏠 Hosting
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab(activeTab === 'past' ? null : 'past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
            ↺ Past
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {PENDING_INVITES.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your pending invites</Text>
            {PENDING_INVITES.map(event => (
              <EventCard key={event.id} event={event} variant="full" />
            ))}
          </View>
        )}

        {UPCOMING_EVENTS.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your upcoming events</Text>
            {UPCOMING_EVENTS.map(event => (
              <EventCard key={event.id} event={event} variant="full" />
            ))}
          </View>
        )}

        {PAST_EVENTS.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past events</Text>
            {PAST_EVENTS.map(event => (
              <EventCard key={event.id} event={event} variant="full" />
            ))}
          </View>
        )}

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
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#14b8a6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    marginTop: -2,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#14b8a6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  tabTextActive: {
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  bottomPadding: {
    height: 40,
  },
});
