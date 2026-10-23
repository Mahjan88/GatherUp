import { Children, Fragment, ReactNode, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import { Divider, Ionicons, ListRow } from '../../components/ui';
import { colors, radius, spacing, typography } from '../../theme';

function SettingsSection({
  title,
  footer,
  children,
}: {
  title?: string;
  footer?: string;
  children: ReactNode;
}) {
  const rows = Children.toArray(children);
  return (
    <View style={styles.sectionWrap}>
      {!!title && <Text style={styles.sectionTitle}>{title}</Text>}
      <View style={styles.section}>
        {rows.map((row, i) => (
          <Fragment key={i}>
            {i > 0 && <Divider style={styles.rowDivider} />}
            {row}
          </Fragment>
        ))}
      </View>
      {!!footer && <Text style={styles.sectionFooter}>{footer}</Text>}
    </View>
  );
}

function SettingSwitch({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.border, true: colors.primary }}
      thumbColor={colors.surface}
    />
  );
}

export default function NotificationsSettingsScreen() {
  const router = useRouter();
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [groupNotifications, setGroupNotifications] = useState(true);
  const [showPreview, setShowPreview] = useState(true);

  return (
    <View style={styles.container}>
      <Header showBack title="Notifications" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Warning */}
        <View style={styles.warning}>
          <Ionicons name="warning-outline" size={20} color={colors.warning} />
          <Text style={styles.warningText}>
            Push Notifications are disabled. To enable visit:{'\n'}
            iPhone Settings {'>'} Notifications {'>'} GatherUp
          </Text>
        </View>

        {/* Message Notifications */}
        <SettingsSection title="Message Notifications">
          <ListRow
            icon="chatbubble-outline"
            title="Show Notifications"
            style={styles.row}
            right={
              <SettingSwitch
                value={messageNotifications}
                onValueChange={setMessageNotifications}
              />
            }
          />
          <ListRow
            icon="musical-note-outline"
            title="Sound"
            value="Note"
            onPress={() => {}}
            style={styles.row}
          />
        </SettingsSection>

        {/* Group Notifications */}
        <SettingsSection title="Group Notifications">
          <ListRow
            icon="people-outline"
            title="Show Notifications"
            style={styles.row}
            right={
              <SettingSwitch
                value={groupNotifications}
                onValueChange={setGroupNotifications}
              />
            }
          />
          <ListRow
            icon="musical-note-outline"
            title="Sound"
            value="Note"
            onPress={() => {}}
            style={styles.row}
          />
        </SettingsSection>

        {/* In-App Notifications */}
        <SettingsSection title="In-App">
          <ListRow
            icon="phone-portrait-outline"
            title="In-App Notifications"
            subtitle="Banners, Sounds, Vibrate"
            onPress={() => {}}
            style={styles.row}
          />
        </SettingsSection>

        {/* Show Preview */}
        <SettingsSection footer="Preview message text inside new message notifications.">
          <ListRow
            icon="eye-outline"
            title="Show Preview"
            style={styles.row}
            right={
              <SettingSwitch
                value={showPreview}
                onValueChange={setShowPreview}
              />
            }
          />
        </SettingsSection>

        {/* Reset */}
        <SettingsSection>
          <ListRow
            icon="refresh-outline"
            title="Reset Notification Settings"
            onPress={() => {}}
            showChevron={false}
            style={styles.row}
          />
        </SettingsSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceAlt },
  content: { flex: 1 },
  contentInner: { paddingTop: spacing.sm, paddingBottom: 100 },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.warningSoft,
  },
  warningText: {
    ...typography.caption,
    flex: 1,
    color: colors.text,
    lineHeight: 17,
  },
  sectionWrap: { marginTop: spacing.lg, paddingHorizontal: spacing.lg },
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  row: { paddingHorizontal: spacing.lg },
  rowDivider: { marginLeft: 62 },
  sectionFooter: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
    marginHorizontal: spacing.xs,
    lineHeight: 17,
  },
});
