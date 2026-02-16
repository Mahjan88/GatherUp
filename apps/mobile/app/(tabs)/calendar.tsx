import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  host: string;
}

const EVENTS_BY_DATE: Record<number, CalendarEvent[]> = {
  18: [
    { id: '1', title: 'Neon Nights Festival', time: '8:00 PM', host: 'Chane' },
  ],
  25: [
    { id: '2', title: "Sarah's VR Game Night", time: '7:00 PM', host: 'Sarah' },
    { id: '3', title: 'Movie Night & Pizza', time: '9:00 PM', host: 'Mike' },
  ],
  28: [
    { id: '4', title: 'Art Gallery Opening', time: '6:00 PM', host: 'Modern Art' },
  ],
};

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(18);

  const getDaysInMonth = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    return days;
  };

  const hasEvents = (day: number) => !!EVENTS_BY_DATE[day];

  return (
    <View style={styles.container}>
      <Header title="Calendar" showBack={true} showLogo={false} onBack={() => router.push('/')} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Month Header */}
        <View style={styles.monthHeader}>
          <TouchableOpacity>
            <Text style={styles.monthNav}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>January 2026</Text>
          <TouchableOpacity>
            <Text style={styles.monthNav}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Days of Week */}
        <View style={styles.weekDays}>
          {DAYS_OF_WEEK.map(day => (
            <Text key={day} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {getDaysInMonth().map(day => (
            <TouchableOpacity
              key={day}
              style={[
                styles.calendarDay,
                selectedDay === day && styles.calendarDaySelected,
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[
                styles.calendarDayText,
                selectedDay === day && styles.calendarDayTextSelected,
              ]}>
                {day}
              </Text>
              {hasEvents(day) && <View style={styles.eventDot} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Day Events */}
        <View style={styles.eventsSection}>
          <Text style={styles.eventsSectionTitle}>
            Events on Jan {selectedDay}
          </Text>
          
          {EVENTS_BY_DATE[selectedDay] ? (
            EVENTS_BY_DATE[selectedDay].map(event => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventItem}
                onPress={() => router.push(`/event/${event.id}`)}
              >
                <View style={styles.eventTime}>
                  <Text style={styles.eventTimeText}>{event.time}</Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventHost}>by {event.host}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noEvents}>
              <Text style={styles.noEventsText}>No events on this day</Text>
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
    paddingHorizontal: 20,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  monthNav: {
    fontSize: 28,
    color: '#3b82f6',
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDaySelected: {
    backgroundColor: '#14b8a6',
    borderRadius: 20,
  },
  calendarDayText: {
    fontSize: 16,
    color: '#fff',
  },
  calendarDayTextSelected: {
    fontWeight: '700',
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b82f6',
    marginTop: 4,
  },
  eventsSection: {
    marginTop: 24,
  },
  eventsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  eventTime: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  eventTimeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  eventInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  eventHost: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  noEvents: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 14,
    color: '#64748b',
  },
  bottomPadding: {
    height: 100,
  },
});
