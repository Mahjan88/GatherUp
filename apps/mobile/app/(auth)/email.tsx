import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Button,
  Divider,
  Ionicons,
  ScreenHeader,
  StepDots,
  TextField,
} from '../../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';

export default function EmailSignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!email.trim()) {
      Alert.alert('Email required', 'Please enter your email address');
      return;
    }
    setLoading(true);
    // TODO: supabase.auth.signInWithOtp({ email })
    setLoading(false);
    router.push({
      pathname: '/(auth)/verify',
      params: { contact: email.trim(), method: 'email' },
    });
  };

  const handleSocial = (provider: 'google' | 'apple') => {
    // TODO: supabase.auth.signInWithOAuth({ provider })
    router.push('/(auth)/profile-setup');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScreenHeader showBack>
        <StepDots total={4} current={0} />
      </ScreenHeader>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={typography.title}>Sign in with your email</Text>
          <Text style={styles.subtitle}>
            We'll send a one-time code to your inbox
          </Text>

          <TextField
            label="Email Address"
            icon="mail-outline"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />

          <Button
            label="Continue"
            fullWidth
            loading={loading}
            onPress={handleContinue}
            style={styles.cta}
          />

          <View style={styles.dividerRow}>
            <Divider style={styles.flex} />
            <Text style={styles.dividerText}>OR</Text>
            <Divider style={styles.flex} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocial('google')}
              activeOpacity={0.85}
            >
              <Image
                source={require('../../assets/google-logo.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocial('apple')}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-apple" size={20} color={colors.text} />
              <Text style={styles.socialText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.altLink}
            hitSlop={8}
            onPress={() => router.push('/(auth)/phone')}
          >
            <Ionicons name="call-outline" size={16} color={colors.link} />
            <Text style={styles.link}>Use your phone number instead</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.termsText}>
            By pressing Continue, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Use</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
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
    marginBottom: spacing.xxxl,
  },
  cta: {
    marginTop: spacing.xs,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textMuted,
    paddingHorizontal: spacing.lg,
  },
  socialButtons: {
    gap: spacing.md,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
  socialText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  altLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.xxl,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.link,
  },
  footer: {
    paddingHorizontal: GUTTER,
    paddingTop: spacing.md,
    paddingBottom: 40,
  },
  termsText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
