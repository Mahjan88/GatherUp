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
const PRIVATE_EVENTS: EventCardData[] = [];
const PUBLIC_EVENTS: EventCardData[] = [];

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
            <TouchableOpacity onPress={() => router.push('/event/past')}>
              <Text style={styles.seeAllLink}>past events</Text>
            </TouchableOpacity>
          </View>
          {PRIVATE_EVENTS.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {PRIVATE_EVENTS.map(event => (
                <EventCard key={event.id} event={event} variant="compact" />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No private invites yet</Text>
            </View>
          )}
        </View>

        <View style={styles.sectionadding} />
        {/* PUBLIC EVENTS NEAR YOU */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>PUBLIC EVENTS NEAR YOU</Text>
          </View>
        {PUBLIC_EVENTS.length > 0 ? (
          PUBLIC_EVENTS.map(event => (
            <EventCard key={event.id} event={event} variant="full" />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No public events nearby</Text>
          </View>
        )}
        </View>

        <View style={styles.sectionadding} />
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

  sectionadding: {
    height: 50,
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
