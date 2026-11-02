import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Ionicons, TextField } from '../../components/ui';
import { colors, shadows, spacing, typography, GUTTER } from '../../theme';
import { ONBOARDING_HEADER_HEIGHT } from '../../components/OnboardingHeader';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

/** Placeholder first name the signup trigger writes when none is given. */
const DEFAULT_FIRST_NAME = 'User';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { session, profile, refreshProfile } = useAuth();
  const initialName =
    profile && profile.first_name !== DEFAULT_FIRST_NAME
      ? [profile.first_name, profile.last_name].filter(Boolean).join(' ')
      : '';
  const initialEmail = profile?.email ?? session?.user.email ?? '';

  const [avatarUri] = useState<string | null>(null);
  const [fullName, setFullName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [confirmEmail, setConfirmEmail] = useState(initialEmail);
  const [city, setCity] = useState(profile?.city ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handlePickAvatar = () => {
    // TODO: open expo-image-picker and upload to the avatars bucket
  };

  const handleContinue = async () => {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = 'Please enter your name';
    if (!email.trim()) next.email = 'Please enter your email';
    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      next.confirmEmail = "Emails don't match";
    }
    if (!city.trim()) next.city = 'Please enter your city';
    setErrors(next);
    if (Object.keys(next).length) return;

    if (!session) return;
    const [firstName, ...rest] = fullName.trim().split(/\s+/);
    setSaving(true);
    const { error } = await supabase
      .from('users')
      .update({
        first_name: firstName,
        last_name: rest.join(' ') || null,
        email: email.trim().toLowerCase(),
        city: city.trim(),
      })
      .eq('id', session.user.id);
    setSaving(false);
    if (error) {
      Alert.alert(
        'Could not save profile',
        error.code === '23505'
          ? 'That email is already used by another account.'
          : error.message
      );
      return;
    }
    await refreshProfile();
    router.push('/(auth)/notification-prefs');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={typography.title}>Welcome to GatherUp!</Text>
          <Text style={styles.subtitle}>
            Tell us a bit about yourself so we can personalize your experience
          </Text>

          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={handlePickAvatar}
            activeOpacity={0.85}
            accessibilityLabel="Add profile photo"
          >
            <View style={styles.avatar}>
              <Ionicons
                name={avatarUri ? 'person' : 'person-outline'}
                size={40}
                color={colors.textMuted}
              />
            </View>
            <View style={styles.avatarBadge}>
              <Ionicons name="camera" size={16} color={colors.primaryOn} />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarCaption}>Add a profile photo</Text>

          <TextField
            label="Full Name"
            icon="person-outline"
            placeholder="Your name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            error={errors.fullName}
          />
          <TextField
            label="Email Address"
            icon="mail-outline"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
          />
          <TextField
            label="Confirm Email"
            icon="mail-outline"
            placeholder="Re-enter your email"
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.confirmEmail}
          />
          <TextField
            label="Preferred City"
            icon="location-outline"
            placeholder="e.g., San Francisco"
            value={city}
            onChangeText={setCity}
            autoCapitalize="words"
            error={errors.city}
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label="Continue"
            fullWidth
            loading={saving}
            onPress={handleContinue}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: ONBOARDING_HEADER_HEIGHT,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
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
  avatarWrap: {
    alignSelf: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  avatarCaption: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
  footer: {
    paddingHorizontal: GUTTER,
    paddingTop: spacing.md,
    paddingBottom: 40,
  },
});
