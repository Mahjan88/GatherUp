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

export default function DataStorageSettingsScreen() {
  const router = useRouter();
  const [lowDataUsage, setLowDataUsage] = useState(false);

  return (
    <View style={styles.container}>
      <Header showBack title="Data and Storage" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Media Auto-Download */}
        <SettingsSection title="Media Auto-Download">
          <ListRow
            icon="image-outline"
            title="Photos"
            value="Wi-Fi and Cellular"
            onPress={() => {}}
            style={styles.row}
          />
          <ListRow
            icon="mic-outline"
            title="Audio"
            value="Wi-Fi"
            onPress={() => {}}
            style={styles.row}
          />
          <ListRow
            icon="videocam-outline"
            title="Videos"
            value="Wi-Fi"
            onPress={() => {}}
            style={styles.row}
          />
          <ListRow
            icon="document-outline"
            title="Documents"
            value="Wi-Fi"
            onPress={() => {}}
            style={styles.row}
          />
        </SettingsSection>

        <SettingsSection footer="Voice Messages are always automatically downloaded for the best communication experience.">
          <ListRow
            icon="refresh-outline"
            title="Reset Auto-Download Settings"
            onPress={() => {}}
            showChevron={false}
            style={styles.row}
          />
        </SettingsSection>

        {/* Call Settings */}
        <SettingsSection
          title="Call Settings"
          footer="Lower the amount of data used during a call on cellular."
        >
          <ListRow
            icon="cellular-outline"
            title="Low Data Usage"
            style={styles.row}
            right={
              <Switch
                value={lowDataUsage}
                onValueChange={setLowDataUsage}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
              />
            }
          />
        </SettingsSection>

        {/* Usage */}
        <SettingsSection title="Usage">
          <ListRow
            icon="stats-chart-outline"
            title="Network Usage"
            onPress={() => {}}
            style={styles.row}
          />
          <ListRow
            icon="server-outline"
            title="Storage Usage"
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
