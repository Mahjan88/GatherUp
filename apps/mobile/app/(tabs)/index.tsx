import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ImageBackground,
  Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH_PRIVATE = (width - 52) / 2; // 2 cards per row with gap
const CARD_WIDTH_PUBLIC = (width - 52) / 2; // 2 cards per row with gap

type TimeFilter = 'week' | 'month' | 'all';
type ViewMode = 'list' | 'calendar';

interface Event {
  id: string;
  title: string;
  host: string;
  image: string;
  isPrivate: boolean;
  isNew?: boolean;
  isHot?: boolean;
  category: string;
  categoryColor: string;
  attendees: number;
  date: string;
}

const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1529543544277-750e0662819e?w=600';

const PRIVATE_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Neon Nights Festival',
    host: 'Chane',
    image: SAMPLE_IMAGE,
    isPrivate: true,
    isNew: true,
    category: 'Music',
    categoryColor: '#22c55e',
    attendees: 5,
    date: '2026-01-25',
  },
  {
    id: '3',
    title: 'Movie Night & Pizza',
    host: 'Chene',
    image: SAMPLE_IMAGE,
    isPrivate: true,
    isNew: true,
    category: 'Social',
    categoryColor: '#ec4899',
    attendees: 8,
    date: '2026-01-28',
  },
];

const PUBLIC_EVENTS: Event[] = [
  {
    id: '2',
    title: 'Innovate Tech Summit',
    host: 'TTech',
    image: SAMPLE_IMAGE,
    isPrivate: false,
    category: 'Tech',
    categoryColor: '#22c55e',
    attendees: 12,
    date: '2026-01-22',
  },
  {
    id: '4',
    title: 'Art Gallery Opening',
    host: 'Modern Art',
    image: SAMPLE_IMAGE,
    isPrivate: false,
    category: 'Art',
    categoryColor: '#8b5cf6',
    attendees: 8,
    date: '2026-01-28',
  },
  {
    id: '5',
    title: 'Startup Meetup',
    host: 'TechHub',
    image: SAMPLE_IMAGE,
    isPrivate: false,
    category: 'Business',
    categoryColor: '#3b82f6',
    attendees: 15,
    date: '2026-01-30',
  },
];

const POPULAR_EVENTS: Event[] = [
  {
    id: '6',
    title: 'Summer Beach Party',
    host: 'Beach Club',
    image: SAMPLE_IMAGE,
    isPrivate: false,
    isHot: true,
    category: 'Music',
    categoryColor: '#22c55e',
    attendees: 25,
    date: '2026-01-30',
  },
  {
    id: '7',
    title: 'Startup Networking',
    host: 'TechHub',
    image: SAMPLE_IMAGE,
    isPrivate: false,
    isHot: true,
    category: 'Business',
    categoryColor: '#3b82f6',
    attendees: 18,
    date: '2026-02-01',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('week');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const filterEvents = (events: Event[]) => {
    const now = new Date();
    const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    return events.filter(event => {
      const eventDate = new Date(event.date);
      if (activeFilter === 'week') return eventDate <= weekEnd;
      if (activeFilter === 'month') return eventDate <= monthEnd;
      return true;
    });
  };

  const renderEventCard = (event: Event, isLarge: boolean = false) => (
    <TouchableOpacity 
      key={event.id} 
      style={[styles.eventCard, isLarge ? styles.eventCardLarge : styles.eventCardSmall]}
      onPress={() => router.push(`/event/${event.id}`)}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: event.image }}
        style={styles.eventImage}
        imageStyle={styles.eventImageStyle}
      >
        <View style={styles.eventOverlay}>
          <View style={styles.badgeRow}>
            {event.isPrivate && (
              <View style={styles.lockBadge}>
                <Text style={styles.lockIcon}>🔒</Text>
              </View>
            )}
            <View style={{ flex: 1 }} />
            {event.isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            )}
            {event.isHot && (
              <View style={styles.hotBadge}>
                <Text style={styles.hotIcon}>🔥</Text>
                <Text style={styles.hotBadgeText}>Hot</Text>
              </View>
            )}
          </View>

          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventHost}>Hosted by {event.host}</Text>
            
            <View style={styles.eventFooter}>
              <TouchableOpacity style={styles.rsvpButton}>
                <Text style={styles.rsvpButtonText}>RSVP</Text>
              </TouchableOpacity>
              
              <View style={styles.attendeesInfo}>
                <Text style={styles.attendeesText}>+{event.attendees} others going</Text>
                <View style={styles.avatarStack}>
                  {[...Array(Math.min(4, event.attendees))].map((_, i) => (
                    <View key={i} style={[styles.miniAvatar, { marginLeft: i > 0 ? -10 : 0 }]}>
                      <Text style={styles.miniAvatarText}>
                        {String.fromCharCode(65 + i)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderCalendarView = () => (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity>
          <Text style={styles.calendarNav}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.calendarMonth}>January 2026</Text>
        <TouchableOpacity>
          <Text style={styles.calendarNav}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekDays}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <Text key={day} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {[...Array(31)].map((_, i) => {
          const day = i + 1;
          const hasEvent = [18, 19, 25, 28].includes(day);
          const isToday = day === 18;
          return (
            <TouchableOpacity 
              key={day} 
              style={[styles.calendarDay, isToday && styles.calendarDayToday]}
            >
              <Text style={[styles.calendarDayText, isToday && styles.calendarDayTextToday]}>
                {day}
              </Text>
              {hasEvent && <View style={styles.eventDot} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.selectedDayEvents}>
        <Text style={styles.selectedDayTitle}>Events on Jan 18</Text>
        {PRIVATE_EVENTS.slice(0, 2).map(event => (
          <TouchableOpacity 
            key={event.id} 
            style={styles.calendarEventItem}
            onPress={() => router.push(`/event/${event.id}`)}
          >
            <View style={styles.calendarEventTime}>
              <Text style={styles.calendarEventTimeText}>8:00 PM</Text>
            </View>
            <View style={styles.calendarEventInfo}>
              <Text style={styles.calendarEventTitle}>{event.title}</Text>
              <Text style={styles.calendarEventHost}>by {event.host}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.calendarButton}
            onPress={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
          >
            <Text style={styles.calendarIconText}>📅</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => router.push('/create-event')}
          >
            <Text style={styles.createButtonText}>Create Event</Text>
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'list' ? (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Timeframe Filter</Text>
            <View style={styles.filterRow}>
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
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Private Invitations</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {filterEvents(PRIVATE_EVENTS).map(event => renderEventCard(event, true))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Public Events</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {filterEvents(PUBLIC_EVENTS).map(event => renderEventCard(event, false))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular This Week</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {filterEvents(POPULAR_EVENTS).map(event => renderEventCard(event, false))}
            </ScrollView>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {renderCalendarView()}
          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 32, fontWeight: '700', color: '#fff' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarIconText: { fontSize: 20 },
  createButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  scrollView: { flex: 1 },
  filterSection: { paddingHorizontal: 20, marginBottom: 24 },
  filterLabel: { fontSize: 14, color: '#94a3b8', marginBottom: 12 },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterPillActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  filterPillText: { fontSize: 14, color: '#94a3b8', fontWeight: '500' },
  filterPillTextActive: { color: '#fff' },
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  horizontalScroll: { paddingHorizontal: 20, gap: 16 },
  eventCard: { borderRadius: 16, overflow: 'hidden' },
  eventCardLarge: { width: CARD_WIDTH_PRIVATE, height: 200 },
  eventCardSmall: { width: CARD_WIDTH_PUBLIC, height: 180 },
  eventImage: { flex: 1 },
  eventImageStyle: { borderRadius: 16 },
  eventOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 12,
    justifyContent: 'space-between',
  },
  badgeRow: { flexDirection: 'row', alignItems: 'flex-start' },
  lockBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: { fontSize: 12 },
  newBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  newBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  hotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f97316',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 2,
  },
  hotIcon: { fontSize: 10 },
  hotBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  eventContent: {},
  eventTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 2 },
  eventHost: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginBottom: 8 },
  eventFooter: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
  },
  rsvpButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rsvpButtonText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  attendeesInfo: { alignItems: 'flex-end' },
  attendeesText: { fontSize: 9, color: 'rgba(255,255,255,0.85)', marginBottom: 4 },
  avatarStack: { flexDirection: 'row' },
  miniAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#6366f1',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniAvatarText: { color: '#fff', fontSize: 8, fontWeight: '600' },
  bottomPadding: { height: 100 },
  calendarContainer: { paddingHorizontal: 20 },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  calendarNav: { fontSize: 28, color: '#3b82f6' },
  calendarMonth: { fontSize: 20, fontWeight: '700', color: '#fff' },
  weekDays: { flexDirection: 'row', marginBottom: 12 },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarDay: {
    width: `${100/7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayToday: {
    backgroundColor: '#f97316',
    borderRadius: 20,
  },
  calendarDayText: { fontSize: 16, color: '#fff' },
  calendarDayTextToday: { fontWeight: '700' },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b82f6',
    marginTop: 4,
  },
  selectedDayEvents: { marginTop: 24 },
  selectedDayTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 16 },
  calendarEventItem: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  calendarEventTime: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 12,
  },
  calendarEventTimeText: { fontSize: 12, color: '#fff', fontWeight: '500' },
  calendarEventInfo: { flex: 1, justifyContent: 'center' },
  calendarEventTitle: { fontSize: 15, color: '#fff', fontWeight: '600' },
  calendarEventHost: { fontSize: 12, color: '#64748b', marginTop: 2 },
});
