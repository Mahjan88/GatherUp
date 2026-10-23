import { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import { IconButton, EmptyState, Ionicons } from '../../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  host: string;
}

// TODO: Replace with real data from API (keyed by day of the visible month)
const EVENTS_BY_DATE: Record<number, CalendarEvent[]> = {};

export default function CalendarScreen() {
  const router = useRouter();
  const today = new Date();
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const visible = useMemo(
    () => new Date(today.getFullYear(), today.getMonth() + monthOffset, 1),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [monthOffset]
  );
  const year = visible.getFullYear();
  const month = visible.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-first leading blanks
  const leading = (visible.getDay() + 6) % 7;
  const cells: (number | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (day: number) => monthOffset === 0 && day === today.getDate();
  const hasEvents = (day: number) => !!EVENTS_BY_DATE[day];

  const changeMonth = (delta: number) => {
    setMonthOffset((o) => o + delta);
    setSelectedDay(1);
  };

  const dayEvents = EVENTS_BY_DATE[selectedDay];

  return (
    <View style={styles.container}>
      <Header title="Calendar" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Month header */}
        <View style={styles.monthHeader}>
          <IconButton
            name="chevron-back"
            variant="filled"
            size={18}
            onPress={() => changeMonth(-1)}
            accessibilityLabel="Previous month"
          />
          <Text style={typography.h2}>
            {MONTH_NAMES[month]} {year}
          </Text>
          <IconButton
            name="chevron-forward"
            variant="filled"
            size={18}
            onPress={() => changeMonth(1)}
            accessibilityLabel="Next month"
          />
        </View>

        {/* Days of week */}
        <View style={styles.weekDays}>
          {DAYS_OF_WEEK.map((day) => (
            <Text key={day} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>

        {/* Grid */}
        <View style={styles.calendarGrid}>
          {cells.map((day, i) => {
            if (day === null) {
              return <View key={`blank-${i}`} style={styles.calendarDay} />;
            }
            const selected = selectedDay === day;
            return (
              <TouchableOpacity
                key={day}
                style={styles.calendarDay}
                onPress={() => setSelectedDay(day)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.dayCircle,
                    isToday(day) && !selected && styles.dayCircleToday,
                    selected && styles.dayCircleSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.calendarDayText,
                      isToday(day) && styles.calendarDayTextToday,
                      selected && styles.calendarDayTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                </View>
                <View
                  style={[
                    styles.eventDot,
                    !hasEvents(day) && { backgroundColor: 'transparent' },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected day events */}
        <View style={styles.eventsSection}>
          <Text style={[typography.h2, { marginBottom: spacing.md }]}>
            {MONTH_NAMES[month].slice(0, 3)} {selectedDay}
          </Text>

          {dayEvents ? (
            dayEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventItem}
                onPress={() => router.push(`/event/${event.id}`)}
                activeOpacity={0.8}
              >
                <View style={styles.eventTime}>
                  <Text style={styles.eventTimeText}>{event.time}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={typography.h3} numberOfLines={1}>
                    {event.title}
                  </Text>
                  <Text style={[typography.caption, { marginTop: 2 }]}>
                    Hosted by {event.host}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            ))
          ) : (
            <EmptyState
              icon="calendar-clear-outline"
              title="No events on this day"
              message="Pick another date or find something new to do."
              actionLabel="Explore events"
              onAction={() => router.push('/(tabs)/explore')}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: GUTTER, paddingBottom: 100 },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  weekDays: { flexDirection: 'row', marginBottom: spacing.sm },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
  },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarDay: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleToday: { backgroundColor: colors.primarySoft },
  dayCircleSelected: { backgroundColor: colors.primary },
  calendarDayText: { fontSize: 15, fontWeight: '500', color: colors.text },
  calendarDayTextToday: { color: colors.primaryDark, fontWeight: '700' },
  calendarDayTextSelected: { color: colors.primaryOn, fontWeight: '700' },
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 3,
  },
  eventsSection: {
    marginTop: spacing.xxl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  eventTime: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  eventTimeText: { fontSize: 12, fontWeight: '700', color: colors.primaryDark },
});
