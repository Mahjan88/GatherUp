import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EventCardData, RsvpStatus, Person } from '../types/event';
import { AvatarStack, Badge, Avatar } from './ui';
import { colors, radius, typography, shadows } from '../theme';

export type { EventCardData, RsvpStatus, Person };

interface EventCardProps {
  event: EventCardData;
  /**
   * feature — large "For You" card (full-width image, bookmark)
   * compact — small tile for horizontal rails ("This Weekend")
   * full    — alias of feature (legacy)
   * row     — list row with thumbnail + status (My Events)
   * past    — alias of row without status
   */
  variant?: 'feature' | 'compact' | 'full' | 'row' | 'past';
  category?: string;
  goingCount?: number;
  onMore?: () => void;
}

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

const formatTime = (date: Date) => {
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${ampm}`;
};

/** "SAT, OCT 26 · 8:00 AM" */
export const formatEventDate = (date: Date): string =>
  `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()} · ${formatTime(date)}`;

/** "Sat, Oct 26 · 8:00 AM" */
export const formatEventDateShort = (date: Date): string => {
  const cap = (s: string) => s[0] + s.slice(1).toLowerCase();
  return `${cap(DAYS[date.getDay()])}, ${cap(MONTHS[date.getMonth()])} ${date.getDate()} · ${formatTime(date)}`;
};

function StatusBadge({ status }: { status: RsvpStatus }) {
  if (status === 'going') return <Badge label="You're Going" tone="success" />;
  if (status === 'interested')
    return (
      <Badge label="Interested" tone="primary" icon="star-outline" outline />
    );
  return null;
}

function Cover({ uri, style }: { uri?: string; style: any }) {
  return uri ? (
    <Image source={{ uri }} style={style} />
  ) : (
    <View style={[style, styles.coverFallback]}>
      <Ionicons name="image-outline" size={24} color={colors.textMuted} />
    </View>
  );
}

export default function EventCard({
  event,
  variant = 'feature',
  category,
  goingCount,
  onMore,
}: EventCardProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const open = () => router.push(`/event/${event.id}`);
  const going = goingCount ?? event.attendees?.length ?? 0;
  const people = (event.attendees ?? []).map((a) => ({
    uri: a.avatar,
    name: a.name,
  }));

  if (variant === 'compact') {
    return (
      <TouchableOpacity
        style={styles.compactCard}
        onPress={open}
        activeOpacity={0.9}
      >
        <Cover uri={event.image} style={styles.compactImage} />
        <View style={styles.compactBody}>
          <Text style={styles.dateText} numberOfLines={1}>
            {formatEventDate(event.date)}
          </Text>
          <Text style={styles.compactTitle} numberOfLines={2}>
            {event.title}
          </Text>
          <View style={styles.metaRow}>
            {people.length > 0 ? (
              <AvatarStack people={people} size={18} max={2} />
            ) : (
              <Avatar name={event.hostName} uri={event.hostAvatar} size={18} />
            )}
            <Text style={typography.caption}>{going} going</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'row' || variant === 'past') {
    return (
      <TouchableOpacity style={styles.row} onPress={open} activeOpacity={0.8}>
        <Cover uri={event.image} style={styles.rowImage} />
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={typography.h3} numberOfLines={1}>
            {event.title}
          </Text>
          <Text style={typography.caption} numberOfLines={1}>
            {formatEventDateShort(event.date)}
          </Text>
          {variant === 'row' && !event.isPast && (
            <View style={{ marginTop: 4 }}>
              {event.isPending ? (
                <Badge label="Invited" tone="warning" icon="mail-outline" />
              ) : (
                <StatusBadge status={event.rsvpStatus} />
              )}
            </View>
          )}
          {variant === 'past' && !!event.location && (
            <Text style={typography.caption} numberOfLines={1}>
              {event.location}
            </Text>
          )}
        </View>
        {onMore && (
          <TouchableOpacity onPress={onMore} hitSlop={10}>
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  // feature / full
  return (
    <TouchableOpacity
      style={styles.featureCard}
      onPress={open}
      activeOpacity={0.92}
    >
      <View>
        <Cover uri={event.image} style={styles.featureImage} />
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => setSaved((s) => !s)}
          hitSlop={8}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={colors.textOnImage}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.featureBody}>
        <Text style={styles.dateText}>{formatEventDate(event.date)}</Text>
        <Text style={styles.featureTitle} numberOfLines={2}>
          {event.title}
        </Text>
        <View style={[styles.metaRow, { gap: 12 }]}>
          {!!category && (
            <View style={styles.metaRow}>
              <Ionicons
                name="pricetag-outline"
                size={13}
                color={colors.textSecondary}
              />
              <Text style={typography.caption}>{category}</Text>
            </View>
          )}
          {event.isPending ? (
            <Text style={typography.caption}>
              <Text style={{ fontWeight: '700', color: colors.text }}>
                {event.hostName}
              </Text>{' '}
              invited you
            </Text>
          ) : (
            <View style={styles.metaRow}>
              {people.length > 0 && <AvatarStack people={people} size={20} />}
              <Text style={typography.caption}>{going} going</Text>
            </View>
          )}
          <View style={{ flex: 1 }} />
          <StatusBadge status={event.rsvpStatus} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  coverFallback: {
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: 'hidden',
    ...shadows.card,
  },
  featureImage: { width: '100%', height: 170 },
  saveBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureBody: { padding: 14, gap: 6 },
  featureTitle: { fontSize: 17, fontWeight: '700', color: colors.text },

  compactCard: {
    width: 170,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: 'hidden',
    ...shadows.card,
  },
  compactImage: { width: '100%', height: 100 },
  compactBody: { padding: 10, gap: 4 },
  compactTitle: { fontSize: 14, fontWeight: '700', color: colors.text },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  rowImage: { width: 64, height: 64, borderRadius: radius.md },
});
