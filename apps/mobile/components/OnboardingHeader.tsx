import { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { IconButton } from './ui';
import { colors, spacing } from '../theme';

/** Height screens must leave free at the top for this header. */
export const ONBOARDING_HEADER_HEIGHT = 108;

const DOT = 8;
const DOT_ACTIVE = 22;

interface OnboardingHeaderProps {
  /** Current step (0-based), or null to hide the header. */
  step: number | null;
  total: number;
}

/**
 * Persistent header for the sign-up flow (back + progress dots).
 * Rendered once by the (auth) layout, above the stack, so it stays put while
 * screens slide underneath and the dots animate from one step to the next.
 */
export default function OnboardingHeader({
  step,
  total,
}: OnboardingHeaderProps) {
  const router = useRouter();
  const visible = step !== null;
  const progress = useRef(new Animated.Value(step ?? 0)).current;
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (step !== null) {
      Animated.timing(progress, {
        toValue: step,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [step, visible, progress, opacity]);

  return (
    <Animated.View
      style={[styles.header, { opacity }]}
      pointerEvents={visible ? 'box-none' : 'none'}
    >
      <View style={styles.row}>
        <IconButton
          name="chevron-back"
          size={26}
          onPress={() => router.back()}
          accessibilityLabel="Back"
        />
        <View style={styles.dots}>
          {Array.from({ length: total }).map((_, i) => {
            const width = progress.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: [DOT, DOT_ACTIVE, DOT],
              extrapolate: 'clamp',
            });
            // Steps already reached stay teal; later steps stay grey.
            const backgroundColor = progress.interpolate({
              inputRange: [i - 1, i],
              outputRange: [colors.border, colors.primary],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width, backgroundColor }]}
              />
            );
          })}
        </View>
        {/* Balances the back button so the dots stay centred */}
        <View style={styles.side} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ONBOARDING_HEADER_HEIGHT,
    paddingTop: 60,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    zIndex: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  dots: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: DOT,
    borderRadius: DOT / 2,
  },
  side: { width: 36 },
});
