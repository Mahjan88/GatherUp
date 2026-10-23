import { Children, Fragment, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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

export default function AccountSettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header showBack title="Account" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Settings */}
        <SettingsSection title="Privacy & Security">
          <ListRow
            icon="shield-checkmark-outline"
            title="Privacy"
            onPress={() => {}}
            style={styles.row}
          />
          <ListRow
            icon="lock-closed-outline"
            title="Security"
            onPress={() => {}}
            style={styles.row}
          />
          <ListRow
            icon="key-outline"
            title="Two-Step Verification"
            onPress={() => {}}
            style={styles.row}
          />
          <ListRow
            icon="call-outline"
            title="Change Number"
            onPress={() => {}}
            style={styles.row}
          />
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection title="Account">
          <ListRow
            icon="document-text-outline"
            title="Request Account Info"
            onPress={() => {}}
            style={styles.row}
          />
          <ListRow
            icon="trash-outline"
            title="Delete My Account"
            destructive
            onPress={() => {}}
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
