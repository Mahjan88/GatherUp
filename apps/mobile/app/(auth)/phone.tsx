import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
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
} from '../../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';

export default function PhoneSignInScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode] = useState('+1');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Phone required', 'Please enter your phone number');
      return;
    }
    setLoading(true);
    // TODO: supabase.auth.signInWithOtp({ phone: `${countryCode}${phoneNumber}` })
    setLoading(false);
    router.push({
      pathname: '/(auth)/verify',
      params: { contact: `${countryCode}${phoneNumber}`, method: 'phone' },
    });
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
          <Text style={typography.title}>Sign in with your phone</Text>
          <Text style={styles.subtitle}>
            We'll send you a verification code
          </Text>

          <Text style={styles.fieldLabel}>
            Phone Number<Text style={styles.required}> *</Text>
          </Text>
          <View style={styles.phoneInputContainer}>
            {/* TODO: make country code selectable */}
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
              autoFocus
            />
          </View>

          <View style={styles.dividerRow}>
            <Divider style={styles.flex} />
            <Text style={styles.dividerText}>OR</Text>
            <Divider style={styles.flex} />
          </View>

          <Button
            label="Use your email instead"
            icon="mail-outline"
            variant="outline"
            fullWidth
            onPress={() => router.push('/(auth)/email')}
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label="Continue"
            fullWidth
            loading={loading}
            onPress={handleContinue}
          />
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
  fieldLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.danger,
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
    marginTop: spacing.md,
  },
  termsLink: {
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
