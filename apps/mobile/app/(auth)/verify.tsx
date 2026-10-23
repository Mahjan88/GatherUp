import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, ScreenHeader, StepDots } from '../../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';

const CODE_LENGTH = 6;
const EXPIRY_SECONDS = 15 * 60;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function VerifyScreen() {
  const router = useRouter();
  const { contact, method } = useLocalSearchParams<{
    contact: string;
    method: string;
  }>();
  const isEmail = method === 'email';

  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState('');
  const [focused, setFocused] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(EXPIRY_SECONDS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text: string) => {
    setCode(text.replace(/\D/g, '').slice(0, CODE_LENGTH));
  };

  const handleContinue = async () => {
    setLoading(true);
    // TODO: supabase.auth.verifyOtp({ [isEmail ? 'email' : 'phone']: contact,
    //   token: code, type: isEmail ? 'email' : 'sms' })
    // TODO: returning users with a profile should go straight to /(tabs)
    setLoading(false);
    router.push({
      pathname: '/(auth)/profile-setup',
      params: isEmail && contact ? { email: contact } : {},
    });
  };

  const handleResend = () => {
    // TODO: re-call supabase.auth.signInWithOtp for `contact`
    setTimeRemaining(EXPIRY_SECONDS);
    setCode('');
    inputRef.current?.focus();
  };

  const activeIndex = Math.min(code.length, CODE_LENGTH - 1);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScreenHeader showBack>
        <StepDots total={4} current={1} />
      </ScreenHeader>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.content}>
          <Text style={typography.title}>
            {isEmail ? 'Verify your email' : 'Verify your phone'}
          </Text>
          <Text style={styles.subtitle}>
            A one-time code was sent to{' '}
            <Text style={styles.contact}>{contact ?? 'you'}</Text>
          </Text>

          <Pressable
            style={styles.codeRow}
            onPress={() => inputRef.current?.focus()}
          >
            {Array.from({ length: CODE_LENGTH }).map((_, i) => {
              const digit = code[i] ?? '';
              const isActive = focused && i === activeIndex;
              return (
                <View
                  key={i}
                  style={[
                    styles.codeBox,
                    !!digit && styles.codeBoxFilled,
                    isActive && styles.codeBoxActive,
                  ]}
                >
                  <Text style={styles.codeDigit}>{digit}</Text>
                </View>
              );
            })}
          </Pressable>

          {/* Hidden input that captures the full code */}
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleChange}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            maxLength={CODE_LENGTH}
            autoFocus
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={styles.hiddenInput}
          />

          <Text style={styles.timer}>
            {timeRemaining > 0
              ? `Code expires in ${formatTime(timeRemaining)}`
              : 'Code expired'}
          </Text>

          <View style={styles.resendRow}>
            <Text style={typography.bodySecondary}>
              Not getting your code?{' '}
            </Text>
            <TouchableOpacity onPress={handleResend} hitSlop={8}>
              <Text style={styles.link}>Re-send it</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            label="Continue"
            fullWidth
            loading={loading}
            disabled={code.length < CODE_LENGTH}
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
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: GUTTER,
    paddingTop: spacing.lg,
  },
  subtitle: {
    ...typography.bodySecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xxxl,
  },
  contact: {
    color: colors.text,
    fontWeight: '600',
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  codeBox: {
    flex: 1,
    maxWidth: 52,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeBoxFilled: {
    borderColor: colors.primary,
  },
  codeBoxActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  codeDigit: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  timer: {
    ...typography.caption,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
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
});
