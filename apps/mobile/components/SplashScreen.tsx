import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Generate random stars
const generateStars = (count: number) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
    });
  }
  return stars;
};

const stars = generateStars(100);

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const starAnims = useRef(stars.map(() => new Animated.Value(Math.random()))).current;
  
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate stars twinkling
    starAnims.forEach((anim, index) => {
      const twinkle = () => {
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]).start(twinkle);
      };
      setTimeout(twinkle, Math.random() * 2000);
    });

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Main animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Update progress text
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Finish splash after animation
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#0a0a1a', '#0d1526', '#0a0a1a']}
        style={styles.gradient}
      >
        {/* Stars */}
        {stars.map((star, index) => (
          <Animated.View
            key={star.id}
            style={[
              styles.star,
              {
                left: star.x,
                top: star.y,
                width: star.size,
                height: star.size,
                opacity: starAnims[index],
              },
            ]}
          />
        ))}

        {/* Main content */}
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Logo Image */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: glowAnim.interpolate({
                  inputRange: [0.5, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ]}
          >
            <Image
              source={require('../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </Animated.View>
        </Animated.View>

        {/* App name */}
        <Animated.View style={[styles.titleContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>
            <Text style={styles.titleCyan}>Gather</Text>
            <Text style={styles.titlePink}>Up</Text>
          </Text>
        </Animated.View>

        {/* Loading bar */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingTrack}>
            <Animated.View style={[styles.loadingBar, { width: progressWidth }]}>
              <LinearGradient
                colors={['#00FFFF', '#00D4D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loadingGradient}
              />
            </Animated.View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  logoImage: {
    width: 200,
    height: 200,
  },
  titleContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    letterSpacing: 2,
  },
  titleCyan: {
    color: '#00FFFF',
    textShadowColor: '#00FFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  titlePink: {
    color: '#FF00FF',
    textShadowColor: '#FF00FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    width: 120,
    alignItems: 'center',
  },
  loadingTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    borderRadius: 2,
  },
  loadingGradient: {
    flex: 1,
    borderRadius: 2,
  },
});
