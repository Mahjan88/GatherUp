import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export type RsvpStatus = 'none' | 'interested' | 'going';

export interface EventCardData {
  id: string;
  title: string;
  image: string;
  date: Date;
  location: string;
  hostName: string;
  hostAvatar?: string;
  rsvpStatus: RsvpStatus;
  isPending?: boolean;
  isPast?: boolean;
  attendees?: { name: string; avatar?: string }[];
}

interface EventCardProps {
  event: EventCardData;
  variant?: 'compact' | 'full' | 'past';
}

export const formatEventDate = (date: Date): string => {
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  if (diffDays <= 7 && diffDays >= 0) {
    const dayName = days[date.getDay()];
    const fullDays: { [key: string]: string } = {
      'Sun': 'Sunday', 'Mon': 'Monday', 'Tue': 'Tuesday', 
      'Wed': 'Wednesday', 'Thu': 'Thursday', 'Fri': 'Friday', 'Sat': 'Saturday'
    };
    const hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `This ${fullDays[dayName]} at ${hour12}${ampm}`;
  } else {
    const hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()} at ${hour12}${ampm}`;
  }
};

const getRsvpButtonText = (status: RsvpStatus): string => {
  switch (status) {
    case 'going': return '✓ Going';
    case 'interested': return '★ Interested';
    default: return 'RSVP';
  }
};

export default function EventCard({ event, variant = 'compact' }: EventCardProps) {
  const router = useRouter();

  if (variant === 'compact') {
    return (
      <TouchableOpacity 
        style={styles.compactCard}
        onPress={() => router.push(`/event/${event.id}`)}
        activeOpacity={0.9}
      >
        <View style={styles.compactTop}>
          <Image
            source={{ uri: event.image }}
            style={styles.compactThumbnail}
          />
          <View style={styles.compactContent}>
            <Text style={styles.compactDate}>{formatEventDate(event.date)}</Text>
            <Text style={styles.compactTitle} numberOfLines={2}>
              {event.title}
            </Text>
            <Text style={styles.compactLocation} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        </View>
        <View style={styles.compactHost}>
          <View style={styles.compactHostAvatar}>
            <Text style={styles.compactHostInitial}>{event.hostName[0]}</Text>
          </View>
          <Text style={styles.compactHostText}>
            <Text style={styles.compactHostName}>{event.hostName}</Text> invited you
          </Text>
        </View>
        {!event.isPast && (
          <View style={styles.compactButtons}>
            <TouchableOpacity style={styles.compactRsvpBtn}>
              <Text style={styles.compactRsvpText}>
                {getRsvpButtonText(event.rsvpStatus)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'past') {
    return (
      <TouchableOpacity 
        style={styles.pastCard}
        onPress={() => router.push(`/event/${event.id}`)}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: event.image }}
          style={styles.pastThumbnail}
        />
        <View style={styles.pastContent}>
          <Text style={styles.pastDate}>{formatEventDate(event.date)}</Text>
          <Text style={styles.pastTitle} numberOfLines={1}>
            {event.title}
          </Text>
          <Text style={styles.pastLocation} numberOfLines={1}>
            {event.location}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.fullCard}
      onPress={() => router.push(`/event/${event.id}`)}
      activeOpacity={0.9}
    >
      <View style={styles.fullCardTop}>
        <Image
          source={{ uri: event.image }}
          style={styles.fullThumbnail}
        />
        <View style={styles.fullContent}>
          <Text style={styles.fullDate}>{formatEventDate(event.date)}</Text>
          <Text style={styles.fullTitle} numberOfLines={2}>
            {event.title}
          </Text>
          <Text style={styles.fullLocation} numberOfLines={1}>
            {event.location}
          </Text>
          {event.isPending ? (
            <View style={styles.fullHost}>
              <View style={styles.fullHostAvatar}>
                <Text style={styles.fullHostInitial}>{event.hostName[0]}</Text>
              </View>
              <Text style={styles.fullHostText}>
                <Text style={styles.fullHostName}>{event.hostName}</Text> invited you
              </Text>
            </View>
          ) : event.attendees && event.attendees.length > 0 ? (
            <View style={styles.fullHost}>
              <View style={styles.attendeesStack}>
                {event.attendees.slice(0, 3).map((attendee, index) => (
                  <View 
                    key={index} 
                    style={[styles.attendeeAvatar, { marginLeft: index > 0 ? -8 : 0 }]}
                  >
                    <Text style={styles.attendeeInitial}>{attendee.name[0]}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.fullHostText}>
                <Text style={styles.fullHostName}>
                  {event.attendees.slice(0, 2).map(a => a.name).join(', ')}
                </Text>
                {event.attendees.length > 2 && ` and ${event.attendees.length - 2} friends`}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      {!event.isPast && (
        <View style={styles.fullButtons}>
          <TouchableOpacity 
            style={[
              styles.fullRsvpBtn,
              event.rsvpStatus !== 'none' && styles.fullRsvpBtnActive
            ]}
          >
            <Text style={[
              styles.fullRsvpText,
              event.rsvpStatus !== 'none' && styles.fullRsvpTextActive
            ]}>
              {getRsvpButtonText(event.rsvpStatus)}
            </Text>
            {event.rsvpStatus !== 'none' && (
              <Text style={styles.fullRsvpDropdown}> ▼</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.fullShareBtn}>
            <Text style={styles.fullShareIcon}>➦</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Compact variant (for horizontal scroll in home)
  compactCard: { 
    width: 220,
    backgroundColor: '#1e293b',
    borderRadius: 12, 
    overflow: 'hidden',
    padding: 12,
  },
  compactTop: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  compactThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  compactContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'flex-start',
  },
  compactDate: {
    fontSize: 12,
    fontWeight: '400',
    color: '#f59e0b',
    marginBottom: 2,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
    lineHeight: 18,
  },
  compactLocation: {
    fontSize: 12,
    color: '#64748b',
  },
  compactHost: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  compactHostAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  compactHostInitial: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
  },
  compactHostText: {
    fontSize: 12,
    color: '#94a3b8',
    flex: 1,
  },
  compactHostName: {
    fontWeight: '600',
    color: '#e2e8f0',
  },
  compactButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactRsvpBtn: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  compactRsvpText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },

  // Full variant (for list view in my-events)
  fullCard: {
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
  },
  fullCardTop: {
    flexDirection: 'row',
  },
  fullThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  fullContent: {
    flex: 1,
    marginLeft: 12,
  },
  fullDate: {
    fontSize: 14,
    fontWeight: '400',
    color: '#94a3b8',
    marginBottom: 2,
  },
  fullTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  fullLocation: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  fullHost: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullHostAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  fullHostInitial: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  fullHostText: {
    fontSize: 14,
    color: '#94a3b8',
    flex: 1,
  },
  fullHostName: {
    fontWeight: '600',
    color: '#e2e8f0',
  },
  attendeesStack: {
    flexDirection: 'row',
    marginRight: 8,
  },
  attendeeAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1e293b',
  },
  attendeeInitial: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
  },
  fullButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  fullRsvpBtn: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fullRsvpBtnActive: {
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    borderWidth: 1,
    borderColor: '#14b8a6',
  },
  fullRsvpText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  fullRsvpTextActive: {
    color: '#14b8a6',
  },
  fullRsvpDropdown: {
    fontSize: 10,
    color: '#14b8a6',
  },
  fullShareBtn: {
    width: 44,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullShareIcon: {
    fontSize: 18,
    color: '#94a3b8',
  },

  // Past variant (shorter cards for past events)
  pastCard: {
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pastThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#334155',
  },
  pastContent: {
    flex: 1,
    marginLeft: 12,
  },
  pastDate: {
    fontSize: 11,
    fontWeight: '400',
    color: '#64748b',
    marginBottom: 2,
  },
  pastTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  pastLocation: {
    fontSize: 12,
    color: '#64748b',
  },
});
