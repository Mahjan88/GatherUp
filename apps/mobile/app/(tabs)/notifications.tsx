import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1529543544277-750e0662819e?w=200';

interface Notification {
  id: string;
  type: 'invite' | 'reminder' | 'update' | 'rsvp';
  title: string;
  message: string;
  eventId?: string;
  eventTitle?: string;
  eventImage?: string;
  fromUser?: string;
  fromAvatar?: string;
  time: string;
  isRead: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'invite',
    title: 'New Event Invitation',
    message: 'Sarah invited you to',
    eventId: '1',
    eventTitle: 'Neon Nights Festival',
    eventImage: SAMPLE_IMAGE,
    fromUser: 'Sarah',
    fromAvatar: 'S',
    time: '2 min ago',
    isRead: false,
  },
  {
    id: '2',
    type: 'invite',
    title: 'New Event Invitation',
    message: 'Mike invited you to',
    eventId: '2',
    eventTitle: 'Movie Night & Pizza',
    eventImage: SAMPLE_IMAGE,
    fromUser: 'Mike',
    fromAvatar: 'M',
    time: '15 min ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'rsvp',
    title: 'RSVP Confirmed',
    message: 'Alex is going to your event',
    eventId: '1',
    eventTitle: 'Neon Nights Festival',
    fromUser: 'Alex',
    fromAvatar: 'A',
    time: '1 hour ago',
    isRead: true,
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Event Tomorrow',
    message: 'Don\'t forget! Your event starts tomorrow at 8:00 PM',
    eventId: '1',
    eventTitle: 'Neon Nights Festival',
    eventImage: SAMPLE_IMAGE,
    time: '3 hours ago',
    isRead: true,
  },
  {
    id: '5',
    type: 'update',
    title: 'Event Updated',
    message: 'The venue has been changed for',
    eventId: '3',
    eventTitle: 'Tech Summit 2026',
    time: 'Yesterday',
    isRead: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'invite': return '✉️';
      case 'reminder': return '⏰';
      case 'update': return '📝';
      case 'rsvp': return '✅';
      default: return '🔔';
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case 'invite': return '#3b82f6';
      case 'reminder': return '#f97316';
      case 'update': return '#8b5cf6';
      case 'rsvp': return '#22c55e';
      default: return '#64748b';
    }
  };

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity 
      key={notification.id}
      style={[styles.notificationCard, !notification.isRead && styles.notificationUnread]}
      onPress={() => notification.eventId && router.push(`/event/${notification.eventId}`)}
    >
      <View style={styles.notificationLeft}>
        {notification.fromAvatar ? (
          <View style={[styles.avatarContainer]}>
            <View style={[styles.userAvatar, { backgroundColor: getIconBgColor(notification.type) }]}>
              <Text style={styles.userAvatarText}>{notification.fromAvatar}</Text>
            </View>
            <View style={[styles.iconBadge, { backgroundColor: getIconBgColor(notification.type) }]}>
              <Text style={styles.iconBadgeText}>{getNotificationIcon(notification.type)}</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.iconCircle, { backgroundColor: getIconBgColor(notification.type) }]}>
            <Text style={styles.iconText}>{getNotificationIcon(notification.type)}</Text>
          </View>
        )}
      </View>

      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          {!notification.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage}>
          {notification.message}
          {notification.eventTitle && (
            <Text style={styles.eventTitleText}> {notification.eventTitle}</Text>
          )}
        </Text>
        <Text style={styles.notificationTime}>{notification.time}</Text>
      </View>

      {notification.eventImage && (
        <Image 
          source={{ uri: notification.eventImage }} 
          style={styles.eventThumbnail}
        />
      )}
    </TouchableOpacity>
  );

  const unreadCount = NOTIFICATIONS.filter(n => !n.isRead).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markReadButton}>
            <Text style={styles.markReadText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* New Invites Section */}
        {NOTIFICATIONS.filter(n => n.type === 'invite' && !n.isRead).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>New Invites</Text>
            {NOTIFICATIONS.filter(n => n.type === 'invite' && !n.isRead).map(renderNotification)}
          </View>
        )}

        {/* Earlier Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earlier</Text>
          {NOTIFICATIONS.filter(n => n.type !== 'invite' || n.isRead).map(renderNotification)}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  markReadButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  markReadText: { fontSize: 14, color: '#3b82f6' },
  scrollView: { flex: 1 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    paddingHorizontal: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
  },
  notificationUnread: {
    backgroundColor: '#1e3a5f',
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  notificationLeft: { marginRight: 14 },
  avatarContainer: { position: 'relative' },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  iconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  iconBadgeText: { fontSize: 10 },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 22 },
  notificationContent: { flex: 1 },
  notificationHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  notificationTitle: { fontSize: 15, fontWeight: '600', color: '#fff' },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginLeft: 8,
  },
  notificationMessage: { fontSize: 13, color: '#94a3b8', lineHeight: 18 },
  eventTitleText: { color: '#3b82f6', fontWeight: '500' },
  notificationTime: { fontSize: 11, color: '#64748b', marginTop: 4 },
  eventThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginLeft: 12,
  },
  bottomPadding: { height: 100 },
});
