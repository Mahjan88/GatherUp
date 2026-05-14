import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
} from 'react-native';
import Header from '../../components/Header';
import EventCard, { EventCardData } from '../../components/EventCard';

// TODO: Replace with real API data
const PAST_EVENTS: EventCardData[] = [];

const groupEventsByYear = (events: EventCardData[]): Record<number, EventCardData[]> => {
  return events.reduce((acc, event) => {
    const year = event.date.getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(event);
    return acc;
  }, {} as Record<number, EventCardData[]>);
};

const getSortedYears = (grouped: Record<number, EventCardData[]>): number[] => {
  return Object.keys(grouped).map(Number).sort((a, b) => b - a);
};

export default function PastEventsScreen() {
  const groupedEvents = groupEventsByYear(PAST_EVENTS);
  const sortedYears = getSortedYears(groupedEvents);

  return (
    <View style={styles.container}>
      <Header 
        title="Past Events" 
        showBack={true}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {PAST_EVENTS.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No past events</Text>
            <Text style={styles.emptyText}>Events you've attended will appear here</Text>
          </View>
        ) : (
          sortedYears.map(year => (
            <View key={year} style={styles.yearSection}>
              <Text style={styles.yearHeader}>{year}</Text>
              {groupedEvents[year].map(event => (
                <EventCard key={event.id} event={event} variant="past" />
              ))}
            </View>
          ))
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
  scrollView: {
    flex: 1,
  },
  yearSection: {
    paddingTop: 16,
  },
  yearHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#64748b', textAlign: 'center' },
  bottomPadding: {
    height: 40,
  },
});
