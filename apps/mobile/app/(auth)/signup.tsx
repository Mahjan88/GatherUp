import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Button,
  Divider,
  IconButton,
  Ionicons,
  ScreenHeader,
} from '../../components/ui';
import { BrandMark } from '../../components/Header';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';

export default function SignupScreen() {
  const router = useRouter();
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');

  const handleSocialSignup = (provider: string) => {
    // For now, show phone verification after social signup
    setShowPhoneVerification(true);
  };

  const handlePhoneLogin = () => {
    setShowPhoneVerification(true);
  };

  const handleSendCode = () => {
    // TODO: Implement actual phone verification
    setShowPhoneVerification(false);
    router.replace('/(tabs)/explore');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScreenHeader showBack />

      <View style={styles.content}>
        <View style={styles.topSection}>
          <BrandMark size={36} />
          <Text style={[typography.title, styles.title]}>
            Create your account
          </Text>
          <Text style={styles.subtitle}>
            Join events, meet your people and plan the moment.
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialSignup('google')}
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
              onPress={() => handleSocialSignup('apple')}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-apple" size={20} color={colors.text} />
              <Text style={styles.socialText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerRow}>
            <Divider style={styles.flex} />
            <Text style={styles.dividerText}>or</Text>
            <Divider style={styles.flex} />
          </View>

          <Button
            label="Continue with Phone"
            icon="call-outline"
            variant="outline"
            fullWidth
            onPress={handlePhoneLogin}
          />

          <View style={styles.loginRow}>
            <Text style={typography.bodySecondary}>
              Already have an account?
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity hitSlop={8}>
                <Text style={styles.link}> Log In</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <Text style={styles.termsText}>
            By pressing Continue, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Use</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </View>

      {/* Phone Verification Modal */}
      <Modal
        visible={showPhoneVerification}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPhoneVerification(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.grabber} />
          <View style={styles.modalHeader}>
            <IconButton
              name="close"
              size={24}
              onPress={() => setShowPhoneVerification(false)}
              accessibilityLabel="Close"
            />
            <Text style={styles.modalTitle}>Finish Signup</Text>
            <View style={styles.modalHeaderSpacer} />
          </View>

          <View style={styles.verificationContent}>
            <Text style={typography.title}>Verify your phone number</Text>
            <Text style={styles.verificationSubtitle}>
              To keep our community secure and trustworthy, we verify every new
              account.
            </Text>

            <Text style={styles.fieldLabel}>Phone Number</Text>
            <View style={styles.phoneInputContainer}>
              <TouchableOpacity style={styles.countryCodeButton}>
                <Text style={styles.countryCodeText}>US {countryCode}</Text>
                <Ionicons
                  name="chevron-down"
                  size={14}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
              <View style={styles.phoneInputDivider} />
              <TextInput
                style={styles.phoneInput}
                placeholder="(555) 123-4567"
                placeholderTextColor={colors.textMuted}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.sendCodeContainer}>
            <Button label="Send Code" fullWidth onPress={handleSendCode} />
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    flex: 1,
    paddingHorizontal: GUTTER,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingBottom: spacing.xl,
  },
  title: {
    marginTop: spacing.xxl,
  },
  subtitle: {
    ...typography.bodySecondary,
    marginTop: spacing.xs,
  },
  bottomSection: {
    paddingBottom: 40,
  },
  buttonsContainer: {
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textMuted,
    paddingHorizontal: spacing.lg,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.link,
  },
  termsText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing.xl,
  },
  termsLink: {
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginTop: spacing.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  modalHeaderSpacer: {
    width: 36,
  },
  modalTitle: {
    ...typography.h2,
  },
  verificationContent: {
    paddingHorizontal: GUTTER,
    marginTop: spacing.lg,
  },
  verificationSubtitle: {
    ...typography.bodySecondary,
    lineHeight: 21,
    marginTop: spacing.sm,
    marginBottom: spacing.xxxl,
  },
  fieldLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 6,
    height: '100%',
  },
  countryCodeText: {
    ...typography.body,
    fontWeight: '600',
  },
  phoneInputDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.text,
  },
  sendCodeContainer: {
    position: 'absolute',
    bottom: 40,
    left: GUTTER,
    right: GUTTER,
  },
});
