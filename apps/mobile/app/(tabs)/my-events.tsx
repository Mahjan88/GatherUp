import { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import EventCard, { EventCardData } from '../../components/EventCard';
import {
  ChipRow,
  EmptyState,
  FAB,
  IconButton,
  Button,
  Divider,
  IconName,
} from '../../components/ui';
import { colors, spacing, GUTTER } from '../../theme';

type MyEventsFilter = 'upcoming' | 'hosting' | 'saved' | 'past';

const FILTERS: { value: MyEventsFilter; label: string }[] = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'hosting', label: 'Hosting' },
  { value: 'saved', label: 'Saved' },
  { value: 'past', label: 'Past' },
];

// TODO: Replace with real data from API
const UPCOMING_EVENTS: EventCardData[] = [];
const HOSTING_EVENTS: EventCardData[] = [];
const SAVED_EVENTS: EventCardData[] = [];
const PAST_EVENTS: EventCardData[] = [];

const EVENTS_BY_FILTER: Record<MyEventsFilter, EventCardData[]> = {
  upcoming: UPCOMING_EVENTS,
  hosting: HOSTING_EVENTS,
  saved: SAVED_EVENTS,
  past: PAST_EVENTS,
};

const EMPTY_COPY: Record<
  MyEventsFilter,
  { icon: IconName; title: string; message: string; action: string }
> = {
  upcoming: {
    icon: 'calendar-outline',
    title: 'No upcoming events',
    message: "Events you're going to or interested in will show up here.",
    action: 'Explore events',
  },
  hosting: {
    icon: 'megaphone-outline',
    title: "You're not hosting anything yet",
    message: 'Create an event and invite your people.',
    action: 'Create an event',
  },
  saved: {
    icon: 'bookmark-outline',
    title: 'No saved events',
    message: 'Tap the bookmark on any event to save it for later.',
    action: 'Explore events',
  },
  past: {
    icon: 'time-outline',
    title: 'No past events',
    message:
      "Once you've attended events, you can revisit photos and reviews here.",
    action: 'View past events',
  },
};

export default function MyEventsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<MyEventsFilter>('upcoming');

  const events = EVENTS_BY_FILTER[filter];
  const empty = EMPTY_COPY[filter];

  const onEmptyAction = () => {
    if (filter === 'hosting') router.push('/event/create');
    else if (filter === 'past') router.push('/event/past');
    else router.push('/(tabs)/explore');
  };

  const openMenu = (event: EventCardData) => {
    // TODO: wire actions to the API (share, leave, edit, unsave)
    Alert.alert(event.title, undefined, [
      { text: 'View event', onPress: () => router.push(`/event/${event.id}`) },
      { text: 'Share' },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Events"
        rightElement={
          <IconButton
            name="calendar-outline"
            onPress={() => router.push('/calendar')}
            accessibilityLabel="Calendar"
          />
        }
        rightIcon="search"
        showNotificationBell={false}
      />

      <View>
        <ChipRow options={FILTERS} value={filter} onChange={setFilter} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {events.length > 0 ? (
          <>
            {events.map((event, i) => (
              <View key={event.id}>
                {i > 0 && <Divider />}
                <EventCard
                  event={event}
                  variant={filter === 'past' ? 'past' : 'row'}
                  onMore={() => openMenu(event)}
                />
              </View>
            ))}
            {filter === 'past' && (
              <Button
                label="See all past events"
                variant="outline"
                size="md"
                onPress={() => router.push('/event/past')}
                style={{ marginTop: spacing.lg }}
              />
            )}
          </>
        ) : (
          <EmptyState
            icon={empty.icon}
            title={empty.title}
            message={empty.message}
            actionLabel={empty.action}
            onAction={onEmptyAction}
          />
        )}
      </ScrollView>

      <FAB onPress={() => router.push('/event/create')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: GUTTER,
    paddingTop: spacing.md,
    paddingBottom: 100,
  },
});
