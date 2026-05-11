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
const SERIES_EVENTS: (EventCardData & { seriesName: string })[] = [];

type TimeFilter = 'week' | 'month' | 'all';

export default function HomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('week');

  const handleSeriesResponse = (eventId: string, response: 'going' | 'not_this_time') => {
    // TODO: Call API to respond to series event
    // POST /api/events/:id/respond with status: 'joined' or 'declined'
    console.log(`Series event ${eventId}: ${response}`);
  };

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

        {/* SERIES UPDATES — dismissable action cards */}
        {SERIES_EVENTS.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>SERIES UPDATES</Text>
            </View>
            {SERIES_EVENTS.map(event => (
              <View key={event.id} style={styles.seriesCard}>
                <View style={styles.seriesLabel}>
                  <Text style={styles.seriesLabelText}>
                    New from {event.seriesName}
                  </Text>
                </View>
                <EventCard event={event} variant="full" />
                <View style={styles.seriesActions}>
                  <TouchableOpacity
                    style={styles.goingButton}
                    onPress={() => handleSeriesResponse(event.id, 'going')}
                  >
                    <Text style={styles.goingButtonText}>Going</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.notThisTimeButton}
                    onPress={() => handleSeriesResponse(event.id, 'not_this_time')}
                  >
                    <Text style={styles.notThisTimeButtonText}>Not this time</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

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
  // Series action card styles
  seriesCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#14b8a6',
    backgroundColor: '#0f2a2e',
    overflow: 'hidden',
  },
  seriesLabel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
  },
  seriesLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#14b8a6',
  },
  seriesActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  goingButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#14b8a6',
    borderRadius: 10,
    alignItems: 'center',
  },
  goingButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  notThisTimeButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  notThisTimeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94a3b8',
  },
  bottomPadding: {
    height: 100,
  },
});
