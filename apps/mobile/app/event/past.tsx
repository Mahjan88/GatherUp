import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../../components/Header';
import EventCard, { EventCardData } from '../../components/EventCard';
import { EmptyState } from '../../components/ui';
import { colors, spacing, typography, GUTTER } from '../../theme';

// TODO: Replace with real API data
const PAST_EVENTS: EventCardData[] = [];

const groupEventsByYear = (
  events: EventCardData[]
): Record<number, EventCardData[]> => {
  return events.reduce(
    (acc, event) => {
      const year = event.date.getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(event);
      return acc;
    },
    {} as Record<number, EventCardData[]>
  );
};

const getSortedYears = (grouped: Record<number, EventCardData[]>): number[] => {
  return Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);
};

export default function PastEventsScreen() {
  const groupedEvents = groupEventsByYear(PAST_EVENTS);
  const sortedYears = getSortedYears(groupedEvents);

  return (
    <View style={styles.container}>
      <Header title="Past Events" showBack={true} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {PAST_EVENTS.length === 0 ? (
          <View style={styles.emptyWrap}>
            <EmptyState
              icon="calendar-outline"
              title="No past events"
              message="Events you've attended will appear here"
            />
          </View>
        ) : (
          sortedYears.map((year) => (
            <View key={year} style={styles.yearSection}>
              <Text style={styles.yearHeader}>{year}</Text>
              {groupedEvents[year].map((event) => (
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
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  yearSection: {
    paddingTop: spacing.lg,
    paddingHorizontal: GUTTER,
  },
  yearHeader: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  emptyWrap: {
    paddingTop: 60,
  },
  bottomPadding: {
    height: 40,
  },
});
