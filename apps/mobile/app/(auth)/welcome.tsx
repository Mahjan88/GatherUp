import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  FlatList,
  useWindowDimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { BrandMark } from '../../components/Header';
import { colors, radius, spacing, GUTTER } from '../../theme';
import { HERO_IMAGE } from '../../constants/images';

interface Slide {
  key: string;
  title: string;
  subtitle?: string;
}

const SLIDES: Slide[] = [
  {
    key: 'people',
    title: 'Find your people.\nPlan the moment.',
  },
  {
    key: 'discover',
    title: 'Discover events near you',
    subtitle: 'Hikes, supper clubs, pickup games: see what’s happening.',
  },
  {
    key: 'share',
    title: 'Chat and share together',
    subtitle: 'Group chats, photos and RSVPs, all in one place.',
  },
];

/**
 * Splash / Onboarding (mockup #1): one fixed full-bleed photo with the logo
 * at the top; the slide text swipes, with page dots and two pill CTAs below.
 */
export default function WelcomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<Slide>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [page, setPage] = useState(0);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setPage(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const goTo = (index: number) => {
    listRef.current?.scrollToOffset({ offset: index * width, animated: true });
    setPage(index);
  };

  return (
    <ImageBackground
      source={HERO_IMAGE}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={[
          'rgba(0,0,0,0.3)',
          'rgba(0,0,0,0)',
          'rgba(0,0,0,0)',
          'rgba(0,0,0,0.7)',
        ]}
        locations={[0, 0.4, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.FlatList
        ref={listRef}
        style={StyleSheet.absoluteFill}
        data={SLIDES}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item, index }) => (
          <View
            style={[styles.slideText, { width }]}
            accessibilityLabel={`Slide ${index + 1} of ${SLIDES.length}`}
          >
            <Text style={styles.title}>{item.title}</Text>
            {!!item.subtitle && (
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            )}
          </View>
        )}
      />

      {/* Fixed logo, stays put while slides move underneath */}
      <View style={styles.brand} pointerEvents="none">
        <BrandMark size={52} light stacked />
      </View>

      <View style={styles.bottom}>
        <View style={styles.dots}>
          {SLIDES.map((s, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [7, 20, 7],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.45, 1, 0.45],
              extrapolate: 'clamp',
            });
            return (
              <TouchableOpacity
                key={s.key}
                onPress={() => goTo(i)}
                hitSlop={8}
                accessibilityLabel={`Go to slide ${i + 1}`}
                accessibilityState={{ selected: page === i }}
              >
                <Animated.View
                  style={[styles.dot, { width: dotWidth, opacity }]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

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

const TEXT_SHADOW = {
  textShadowColor: 'rgba(0,0,0,0.3)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 4,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.text,
  },
  brand: {
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  slideText: {
    // Sits just under the fixed logo
    marginTop: 110 + 118,
    paddingHorizontal: GUTTER + 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '500',
    color: colors.textOnImage,
    textAlign: 'center',
    ...TEXT_SHADOW,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 15,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    ...TEXT_SHADOW,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: GUTTER + 4,
    paddingBottom: 44,
    gap: spacing.md,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.xxl,
  },
  dot: {
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.textOnImage,
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
