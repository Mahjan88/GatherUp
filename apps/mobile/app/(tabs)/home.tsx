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

// TODO: Replace with real data from API
const MY_UPCOMING_EVENTS: EventCardData[] = [];

const INVITED_EVENTS: EventCardData[] = [];

type TimeFilter = 'week' | 'month' | 'all';

export default function HomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('week');

  return (
    <View style={styles.container}>
      <Header title="Home" />

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

        {/* INVITES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>INVITES</Text>
            <TouchableOpacity onPress={() => router.push('/event/past')}>
              <Text style={styles.seeAllLink}>past events</Text>
            </TouchableOpacity>
          </View>
          {INVITED_EVENTS.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {INVITED_EVENTS.map(event => (
                <EventCard key={event.id} event={event} variant="compact" />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No invites right now</Text>
            </View>
          )}
        </View>

        <View style={styles.sectionDivider} />

        {/* MY UPCOMING EVENTS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>MY UPCOMING EVENTS</Text>
          </View>
          {MY_UPCOMING_EVENTS.length > 0 ? (
            MY_UPCOMING_EVENTS.map(event => (
              <EventCard key={event.id} event={event} variant="full" />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No upcoming events</Text>
              <TouchableOpacity
                style={styles.discoverLink}
                onPress={() => router.push('/discover')}
              >
                <Text style={styles.discoverLinkText}>Discover events nearby</Text>
              </TouchableOpacity>
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
  sectionDivider: {
    height: 1,
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    marginBottom: 32,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
  },
  discoverLink: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1e293b',
    borderRadius: 20,
  },
  discoverLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14b8a6',
  },
  bottomPadding: {
    height: 100,
  },
});
