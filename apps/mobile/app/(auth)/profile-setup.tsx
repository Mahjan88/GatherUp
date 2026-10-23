import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Button,
  Ionicons,
  ScreenHeader,
  StepDots,
  TextField,
} from '../../components/ui';
import { colors, shadows, spacing, typography, GUTTER } from '../../theme';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();

  const [avatarUri] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(params.email ?? '');
  const [confirmEmail, setConfirmEmail] = useState(params.email ?? '');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePickAvatar = () => {
    // TODO: open expo-image-picker and upload to the avatars bucket
  };

  const handleContinue = () => {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = 'Please enter your name';
    if (!email.trim()) next.email = 'Please enter your email';
    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      next.confirmEmail = "Emails don't match";
    }
    if (!city.trim()) next.city = 'Please enter your city';
    setErrors(next);
    if (Object.keys(next).length) return;

    // TODO: persist profile (onboarding store or PATCH /api/auth/me)
    router.push('/(auth)/notification-prefs');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScreenHeader showBack>
        <StepDots total={4} current={2} />
      </ScreenHeader>
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
          <Button label="Continue" fullWidth onPress={handleContinue} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
