import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { BrandMark } from '../../components/Header';
import { colors, radius, spacing, GUTTER } from '../../theme';
import { HERO_IMAGE } from '../../constants/images';

/**
 * Splash / Onboarding (mockup #1): full-bleed photo, stacked logo + tagline
 * in the sky at the top, two pill CTAs at the bottom.
 */
export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={HERO_IMAGE}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      {/* Soft shade at the top for the logo, darker at the bottom for CTAs */}
      <LinearGradient
        colors={[
          'rgba(0,0,0,0.25)',
          'rgba(0,0,0,0)',
          'rgba(0,0,0,0)',
          'rgba(0,0,0,0.7)',
        ]}
        locations={[0, 0.35, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.top}>
        <BrandMark size={52} light stacked />
        <Text style={styles.tagline}>
          {'Find your people.\nPlan the moment.'}
        </Text>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.pill, styles.getStarted]}
          activeOpacity={0.85}
          onPress={() => router.push('/(auth)/phone')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pill, styles.signIn]}
          activeOpacity={0.8}
          onPress={() => router.push('/(auth)/email')}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.text,
  },
  top: {
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingTop: 110,
  },
  tagline: {
    marginTop: spacing.md,
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '500',
    color: colors.textOnImage,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottom: {
    paddingHorizontal: GUTTER + 4,
    paddingBottom: 44,
    gap: spacing.md,
  },
  pill: {
    height: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStarted: {
    backgroundColor: colors.primary,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryOn,
  },
  signIn: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.85)',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  signInText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textOnImage,
  },
});
