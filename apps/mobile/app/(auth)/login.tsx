import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Button,
  Divider,
  Ionicons,
  ScreenHeader,
  TextField,
} from '../../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    // TODO: Add actual login logic (use setLoading while the request runs)
    router.replace('/(tabs)/explore');
  };

  const handleSocialLogin = (provider: string) => {
    // TODO: Implement social login
    router.replace('/(tabs)/explore');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScreenHeader showBack />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={typography.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>Log in to your GatherUp account</Text>

          <View style={styles.form}>
            <TextField
              label="Email"
              icon="mail-outline"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextField
              label="Password"
              icon="lock-closed-outline"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.forgotButton} hitSlop={8}>
              <Text style={styles.link}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              label={loading ? 'Signing In...' : 'Log In'}
              onPress={handleLogin}
              loading={loading}
              fullWidth
            />
          </View>

          <View style={styles.dividerRow}>
            <Divider style={styles.flex} />
            <Text style={styles.dividerText}>or</Text>
            <Divider style={styles.flex} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('google')}
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
              onPress={() => handleSocialLogin('apple')}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-apple" size={20} color={colors.text} />
              <Text style={styles.socialText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signupRow}>
            <Text style={typography.bodySecondary}>Don't have an account?</Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity hitSlop={8}>
                <Text style={styles.link}> Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
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
    paddingTop: spacing.sm,
    paddingBottom: 40,
  },
  subtitle: {
    ...typography.bodySecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
  },
  form: {
    gap: spacing.xs,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.link,
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
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
});
