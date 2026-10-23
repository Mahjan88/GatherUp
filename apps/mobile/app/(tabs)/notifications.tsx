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
import {
  ChipRow,
  Avatar,
  EmptyState,
  Ionicons,
  IconName,
} from '../../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';

type NotificationType =
  | 'invite'
  | 'reminder'
  | 'update'
  | 'rsvp'
  | 'message'
  | 'follow';

interface Notification {
  id: string;
  type: NotificationType;
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

type NotificationFilter = 'all' | 'events' | 'messages' | 'social';

const FILTERS: { value: NotificationFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'events', label: 'Events' },
  { value: 'messages', label: 'Messages' },
  { value: 'social', label: 'Social' },
];

const FILTER_FOR_TYPE: Record<NotificationType, NotificationFilter> = {
  invite: 'events',
  reminder: 'events',
  update: 'events',
  rsvp: 'events',
  message: 'messages',
  follow: 'social',
};

const TYPE_STYLE: Record<
  NotificationType,
  { icon: IconName; fg: string; bg: string }
> = {
  invite: { icon: 'mail', fg: colors.info, bg: colors.infoSoft },
  reminder: {
    icon: 'notifications',
    fg: colors.warning,
    bg: colors.warningSoft,
  },
  update: { icon: 'create', fg: colors.primaryDark, bg: colors.primarySoft },
  rsvp: {
    icon: 'checkmark-circle',
    fg: colors.success,
    bg: colors.successSoft,
  },
  message: {
    icon: 'chatbubble',
    fg: colors.primaryDark,
    bg: colors.primarySoft,
  },
  follow: {
    icon: 'person-add',
    fg: colors.accentOrange,
    bg: colors.dangerSoft,
  },
};

// TODO: Replace with real API data
const NOTIFICATIONS: Notification[] = [];

function NotificationRow({
  notification,
  onPress,
}: {
  notification: Notification;
  onPress: () => void;
}) {
  const t = TYPE_STYLE[notification.type];
  return (
    <TouchableOpacity
      style={[styles.row, !notification.isRead && styles.rowUnread]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {notification.fromUser || notification.fromAvatar ? (
        <View>
          <Avatar
            uri={notification.fromAvatar}
            name={notification.fromUser}
            size={48}
          />
          <View style={[styles.typeBadge, { backgroundColor: t.fg }]}>
            <Ionicons name={t.icon} size={10} color={colors.primaryOn} />
          </View>
        </View>
      ) : (
        <View style={[styles.iconCircle, { backgroundColor: t.bg }]}>
          <Ionicons name={t.icon} size={22} color={t.fg} />
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text style={styles.text} numberOfLines={3}>
          <Text style={styles.bold}>
            {notification.fromUser ?? notification.title}
          </Text>{' '}
          {notification.message}
          {!!notification.eventTitle && (
            <Text style={styles.bold}> {notification.eventTitle}</Text>
          )}
        </Text>
        <Text style={[typography.caption, styles.time]}>
          {notification.time}
        </Text>
      </View>

      {!!notification.eventImage && (
        <Image source={{ uri: notification.eventImage }} style={styles.thumb} />
      )}
      <View
        style={[
          styles.unreadDot,
          notification.isRead && { backgroundColor: 'transparent' },
        ]}
      />
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<NotificationFilter>('all');

  const visible = NOTIFICATIONS.filter(
    (n) => filter === 'all' || FILTER_FOR_TYPE[n.type] === filter
  );
  const newItems = visible.filter((n) => !n.isRead);
  const earlier = visible.filter((n) => n.isRead);
  const unreadCount = NOTIFICATIONS.filter((n) => !n.isRead).length;

  const open = (n: Notification) => {
    // TODO: mark as read via API
    if (n.eventId) router.push(`/event/${n.eventId}`);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Notifications"
        showBack
        showNotificationBell={false}
        rightElement={
          unreadCount > 0 ? (
            <TouchableOpacity hitSlop={8}>
              {/* TODO: mark all read via API */}
              <Text style={styles.markRead}>Read all</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <View>
        <ChipRow options={FILTERS} value={filter} onChange={setFilter} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {visible.length === 0 ? (
          <EmptyState
            icon="notifications-outline"
            title={
              filter === 'all' ? 'No notifications yet' : 'Nothing here yet'
            }
            message="When you get invites, reminders, or updates they'll show up here."
          />
        ) : (
          <>
            {newItems.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>New</Text>
                {newItems.map((n) => (
                  <NotificationRow
                    key={n.id}
                    notification={n}
                    onPress={() => open(n)}
                  />
                ))}
              </View>
            )}
            {earlier.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Earlier</Text>
                {earlier.map((n) => (
                  <NotificationRow
                    key={n.id}
                    notification={n}
                    onPress={() => open(n)}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  markRead: { fontSize: 14, fontWeight: '600', color: colors.link },
  scrollView: { flex: 1 },
  scrollContent: { paddingTop: spacing.md, paddingBottom: 100 },
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    ...typography.h3,
    paddingHorizontal: GUTTER,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: GUTTER,
  },
  rowUnread: { backgroundColor: colors.surfaceMuted },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontSize: 14, lineHeight: 19, color: colors.text },
  bold: { fontWeight: '700' },
  time: { marginTop: 3, color: colors.textMuted },
  thumb: { width: 48, height: 48, borderRadius: radius.sm },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
