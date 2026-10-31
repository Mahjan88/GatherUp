import { useState } from 'react';
import {
  View,
  Text,
  Switch,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Ionicons, IconName } from '../../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';
import { ONBOARDING_HEADER_HEIGHT } from '../../components/OnboardingHeader';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface PrefRowProps {
  icon: IconName;
  title: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}

function PrefRow({
  icon,
  title,
  description,
  value,
  onValueChange,
}: PrefRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.rowText}>
        <Text style={typography.h3}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.surface}
        ios_backgroundColor={colors.border}
      />
    </View>
  );
}

export default function NotificationPrefsScreen() {
  const { session, profile, refreshProfile } = useAuth();
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (!session) return;
    setLoading(true);
    // TODO: if pushEnabled, request OS permission with
    //   expo-notifications Notifications.requestPermissionsAsync()
    const userData = (profile?.user_data ?? {}) as Record<string, unknown>;
    const { error } = await supabase
      .from('users')
      .update({
        user_data: {
          ...userData,
          notification_prefs: {
            email: emailEnabled,
            sms: smsEnabled,
            push: pushEnabled,
          },
          onboarding_complete: true,
        },
      })
      .eq('id', session.user.id);
    if (error) {
      setLoading(false);
      Alert.alert('Could not save preferences', error.message);
      return;
    }
    // Refreshing marks onboarding complete; the root layout then opens the tabs
    await refreshProfile();
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={typography.title}>Get notified about...</Text>
        <Text style={styles.subtitle}>
          Choose how you'd like to hear about events, messages, and updates
        </Text>

        <View style={styles.list}>
          <PrefRow
            icon="mail-outline"
            title="Email Notifications"
            description="Event updates, invitations, and weekly digests"
            value={emailEnabled}
            onValueChange={setEmailEnabled}
          />
          <PrefRow
            icon="chatbubble-ellipses-outline"
            title="SMS Notifications"
            description="Time-sensitive alerts like event reminders"
            value={smsEnabled}
            onValueChange={setSmsEnabled}
          />
          <PrefRow
            icon="notifications-outline"
            title="Push Notifications"
            description="Real-time updates for messages and RSVPs"
            value={pushEnabled}
            onValueChange={setPushEnabled}
          />
        </View>

        <Text style={styles.hint}>
          You can change these anytime in Settings.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="All set!"
          fullWidth
          loading={loading}
          onPress={handleFinish}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: ONBOARDING_HEADER_HEIGHT,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: GUTTER,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  subtitle: {
    ...typography.bodySecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
  },
  list: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.surface,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowDescription: {
    ...typography.caption,
    marginTop: 2,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  footer: {
    paddingHorizontal: GUTTER,
    paddingTop: spacing.md,
    paddingBottom: 40,
  },
});
