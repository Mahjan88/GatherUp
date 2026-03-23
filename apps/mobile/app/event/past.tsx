import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
} from 'react-native';
import Header from '../../components/Header';
import EventCard, { EventCardData } from '../../components/EventCard';

const SAMPLE_IMAGES = {
  party: 'https://images.unsplash.com/photo-1529543544277-750e0662819e?w=600',
  concert: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600',
  game: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=600',
  tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
};

const PAST_EVENTS: EventCardData[] = [
  {
    id: '1',
    title: 'New Year Celebration 2026',
    image: SAMPLE_IMAGES.concert,
    date: new Date(2026, 0, 1, 20, 0),
    location: 'Space Needle, Seattle',
    hostName: 'Seattle Events',
    rsvpStatus: 'going',
    isPast: true,
  },
  {
    id: '2',
    title: 'Tech Meetup January',
    image: SAMPLE_IMAGES.tech,
    date: new Date(2026, 0, 15, 18, 0),
    location: 'Amazon HQ, Seattle',
    hostName: 'Tech Community',
    rsvpStatus: 'going',
    isPast: true,
  },
  {
    id: '3',
    title: 'Winter Art Gallery',
    image: SAMPLE_IMAGES.party,
    date: new Date(2025, 11, 20, 19, 0),
    location: 'Pioneer Square Gallery',
    hostName: 'Art Collective',
    rsvpStatus: 'going',
    isPast: true,
  },
  {
    id: '4',
    title: 'Holiday Potluck',
    image: SAMPLE_IMAGES.game,
    date: new Date(2025, 11, 15, 18, 0),
    location: 'Community Center',
    hostName: 'Friends Group',
    rsvpStatus: 'interested',
    isPast: true,
  },
];

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
        {sortedYears.map(year => (
          <View key={year} style={styles.yearSection}>
            <Text style={styles.yearHeader}>{year}</Text>
            {groupedEvents[year].map(event => (
              <EventCard key={event.id} event={event} variant="past" />
            ))}
          </View>
        ))}

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
  bottomPadding: {
    height: 40,
  },
});
