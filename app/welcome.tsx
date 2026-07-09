import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '../data/darkTheme';
import { logEvent } from '../services/analytics';

export default function WelcomeScreen() {
  const router = useRouter();

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pawScale = useRef(new Animated.Value(0.5)).current;
  const ctaFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pawScale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      delay: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(ctaFade, {
      toValue: 1,
      duration: 500,
      delay: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top: brand */}
      <View style={styles.topSection}>
        <Animated.View style={[styles.logoWrap, { transform: [{ scale: pawScale }] }]}>
          <Image source={require('../assets/images/icon.png')} style={styles.logoImage} resizeMode="cover" />
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.brandName}>HEEL</Text>
          <Text style={styles.brandSub}>DOG TRAINING</Text>
        </Animated.View>
      </View>

      {/* Middle: the promise */}
      <Animated.View style={[styles.middleSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.headline}>
          A well-trained dog{'\n'}isn't luck. It's a plan.
        </Text>

        <Text style={styles.subheading}>
          HEEL builds a day-by-day program around your dog's breed, age, and the exact behaviors driving you crazy.
        </Text>

        <View style={styles.featureContainer}>
          <FeaturePoint
            icon="clipboard-outline"
            title="30-second quiz, custom plan"
            desc="Tell us about your dog. We build the program"
          />
          <FeaturePoint
            icon="list-outline"
            title="175+ expert lessons"
            desc="Step-by-step, from first sit to showstopper"
          />
          <FeaturePoint
            icon="time-outline"
            title="5-10 minutes a day"
            desc="Short sessions that fit real life and actually stick"
          />
        </View>
      </Animated.View>

      {/* Bottom: CTA */}
      <Animated.View style={[styles.bottomSection, { opacity: ctaFade }]}>
        <Text style={styles.socialProof}>
          Positive reinforcement. Real structure. Zero guesswork.
        </Text>

        <TouchableOpacity
          onPress={() => { logEvent('quiz_started'); router.push('/(tabs)/quiz'); }}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[colors.accent, '#8E1010']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaButtonText}>Build My Dog's Plan</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.ctaSubtext}>
          Free · Takes 30 seconds · No account needed
        </Text>
      </Animated.View>
    </View>
  );
}

function FeaturePoint({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIconContainer}>
        <Ionicons name={icon as any} size={22} color={colors.accent} />
      </View>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },

  topSection: {
    flex: 0.3,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.lg,
    marginTop: 40,
  },
  logoWrap: {
    width: 104,
    height: 104,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  brandName: {
    fontSize: 38,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 8,
  },
  brandSub: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 4,
    marginTop: 2,
  },

  middleSection: {
    flex: 0.5,
    justifyContent: 'center',
    paddingTop: spacing.md,
  },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: spacing.md,
  },
  subheading: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.sm,
  },

  featureContainer: {
    gap: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  bottomSection: {
    flex: 0.2,
    justifyContent: 'flex-end',
    paddingBottom: spacing.xxxl,
  },
  socialProof: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textTertiary,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  ctaButton: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ctaSubtext: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
