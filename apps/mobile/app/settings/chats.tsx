import { Children, Fragment, ReactNode, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import { Divider, ListRow } from '../../components/ui';
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

export default function ChatsSettingsScreen() {
  const router = useRouter();
  const [saveToCameraRoll, setSaveToCameraRoll] = useState(false);

  return (
    <View style={styles.container}>
      <Header showBack title="Chats" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Wallpaper */}
        <SettingsSection title="Appearance">
          <ListRow
            icon="color-palette-outline"
            title="Change Wallpaper"
            onPress={() => {}}
            style={styles.row}
          />
        </SettingsSection>

        {/* Save to Camera Roll */}
        <SettingsSection
          title="Media"
          footer="Automatically save photos and videos you receive to your iPhone's Camera Roll."
        >
          <ListRow
            icon="download-outline"
            title="Save to Camera Roll"
            style={styles.row}
            right={
              <Switch
                value={saveToCameraRoll}
                onValueChange={setSaveToCameraRoll}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
              />
            }
          />
        </SettingsSection>

        {/* Chat Backup */}
        <SettingsSection title="Backup">
          <ListRow
            icon="cloud-upload-outline"
            title="Chat Backup"
            onPress={() => {}}
            style={styles.row}
          />
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection title="Manage Chats">
          <ListRow
            icon="archive-outline"
            title="Archive All Chats"
            onPress={() => {}}
            showChevron={false}
            style={styles.row}
          />
          <ListRow
            icon="close-circle-outline"
            title="Clear All Chats"
            destructive
            onPress={() => {}}
            showChevron={false}
            style={styles.row}
          />
          <ListRow
            icon="trash-outline"
            title="Delete All Chats"
            destructive
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
