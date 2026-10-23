import { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  Avatar,
  Divider,
  IconButton,
  ListRow,
  ScreenHeader,
} from '../../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';

const CONTACT_INFO = {
  name: 'Martha Craig',
  status: 'online',
  phones: [
    { type: 'main', number: '+1 202 555 0181' },
    { type: 'home', number: '+1 202 555 0113' },
  ],
  bio: 'Design adds value faster, than it adds cost',
  username: '@zack_life',
};

function Section({
  caption,
  children,
}: {
  caption?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.sectionWrap}>
      {!!caption && <Text style={styles.sectionCaption}>{caption}</Text>}
      <View style={styles.section}>{children}</View>
    </View>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, highlight && { color: colors.link }]}>
        {value}
      </Text>
    </View>
  );
}

export default function ContactScreen() {
  // TODO: Load contact info by id
  const { id } = useLocalSearchParams();
  const isOnline = CONTACT_INFO.status === 'online';

  return (
    <View style={styles.container}>
      <ScreenHeader
        showBack
        title="Info"
        right={
          <TouchableOpacity hitSlop={8}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Avatar
            name={CONTACT_INFO.name}
            size={72}
            badge={isOnline ? 'online' : undefined}
          />
          <View style={styles.profileInfo}>
            <Text style={typography.h1}>{CONTACT_INFO.name}</Text>
            <Text
              style={[
                styles.profileStatus,
                isOnline && { color: colors.success },
              ]}
            >
              {CONTACT_INFO.status}
            </Text>
          </View>
          <IconButton
            name="call-outline"
            variant="filled"
            color={colors.primary}
            size={20}
            style={styles.callButton}
            accessibilityLabel="Call"
          />
        </View>

        {/* Contact details */}
        <Section caption="Details">
          {CONTACT_INFO.phones.map((phone, index) => (
            <View key={index}>
              <InfoRow label={phone.type} value={phone.number} highlight />
              <Divider style={styles.inset} />
            </View>
          ))}
          <InfoRow label="bio" value={CONTACT_INFO.bio} />
          <Divider style={styles.inset} />
          <InfoRow label="username" value={CONTACT_INFO.username} highlight />
        </Section>

        {/* Actions */}
        <Section>
          <ListRow
            icon="chatbubble-outline"
            title="Send Message"
            onPress={() => {}}
            showChevron={false}
          />
          <Divider style={styles.insetIcon} />
          <ListRow
            icon="share-outline"
            title="Share Contact"
            onPress={() => {}}
            showChevron={false}
          />
          <Divider style={styles.insetIcon} />
          <ListRow
            icon="lock-closed-outline"
            title="Start Secret Chat"
            onPress={() => {}}
            showChevron={false}
          />
        </Section>

        {/* Settings */}
        <Section>
          <ListRow
            icon="images-outline"
            title="Shared Media"
            onPress={() => {}}
          />
          <Divider style={styles.insetIcon} />
          <ListRow
            icon="notifications-outline"
            title="Notifications"
            value="Enabled"
            onPress={() => {}}
          />
          <Divider style={styles.insetIcon} />
          <ListRow
            icon="people-outline"
            title="Groups In Common"
            value="1"
            onPress={() => {}}
          />
        </Section>

        {/* Block User */}
        <Section>
          <ListRow
            icon="ban-outline"
            title="Block User"
            destructive
            onPress={() => {}}
            showChevron={false}
          />
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceAlt },
  editButton: { fontSize: 15, fontWeight: '600', color: colors.link },
  content: { flex: 1 },
  contentInner: { paddingBottom: 60 },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    paddingHorizontal: GUTTER,
    paddingVertical: spacing.xl,
  },
  profileInfo: { flex: 1 },
  profileStatus: {
    ...typography.bodySecondary,
    marginTop: 2,
  },
  callButton: { width: 44, height: 44, borderRadius: 22 },
  sectionWrap: { marginTop: spacing.xl },
  sectionCaption: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    paddingHorizontal: GUTTER,
    marginBottom: spacing.sm,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  infoRow: {
    paddingHorizontal: GUTTER,
    paddingVertical: spacing.md,
  },
  infoLabel: {
    ...typography.caption,
    textTransform: 'capitalize',
    marginBottom: spacing.xxs,
  },
  infoValue: { ...typography.body },
  inset: { marginLeft: GUTTER },
  insetIcon: { marginLeft: GUTTER + 34 + spacing.md },
});
