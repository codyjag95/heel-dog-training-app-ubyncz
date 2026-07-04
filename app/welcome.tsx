import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../data/darkTheme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  // Subtle entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pawScale = useRef(new Animated.Value(0.5)).current;
  const ctaFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Paw icon pops in
    Animated.spring(pawScale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();

    // Content fades and slides up
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

    // CTA button fades in last
    Animated.timing(ctaFade, {
      toValue: 1,
      duration: 500,
      delay: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Section — Logo & Brand */}
      <View style={styles.topSection}>
        <Animated.View style={[styles.pawCircle, { transform: [{ scale: pawScale }] }]}>
          <Ionicons name="paw" size={56} color="#FFFFFF" />
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.brandName}>HEEL</Text>
          <Text style={styles.brandSub}>DOG TRAINING</Text>
        </Animated.View>
      </View>

      {/* Middle Section — Value Proposition */}
      <Animated.View style={[styles.middleSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.headline}>
          Your dog's personal{'\n'}training program
        </Text>

        <Text style={styles.subheading}>
          A step-by-step plan built around your dog's{'\n'}
          breed, age, specific problems, and more.
        </Text>

        {/* Feature Points */}
        <View style={styles.featureContainer}>
          <FeaturePoint 
            icon="clipboard-outline"
            title="Personalized quiz"
            desc="Tailored plan in 2 minutes"
          />
          <FeaturePoint 
            icon="list-outline"
            title="120+ expert lessons"
            desc="Step-by-step, no guesswork"
          />
          <FeaturePoint 
            icon="paw-outline"
            title="Breed-specific tips"
            desc="Advice that fits your dog"
          />
        </View>
      </Animated.View>

      {/* Bottom Section — CTA */}
      <Animated.View style={[styles.bottomSection, { opacity: ctaFade }]}>
        {/* Social proof hint */}
        <Text style={styles.socialProof}>
          Join thousands of dog owners training smarter
        </Text>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/(tabs)/quiz')}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaButtonText}>Get Started — It's Free</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.ctaSubtext}>
          Takes about 2 minutes · No account needed
        </Text>
      </Animated.View>
    </View>
  );
}

// ─── Feature Point Component ─────────────────────────────────
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

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },

  // ── Top Section ──
  topSection: {
    flex: 0.3,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.lg,
    marginTop: 40,
  },
  pawCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    // Subtle shadow
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  brandName: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 6,
  },
  brandSub: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 4,
    marginTop: 2,
  },

  // ── Middle Section ──
  middleSection: {
    flex: 0.5,
    justifyContent: 'center',
    paddingTop: spacing.md,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 36,
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

  // ── Feature Points ──
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
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // ── Bottom Section ──
  bottomSection: {
    flex: 0.2,
    justifyContent: 'flex-end',
    paddingBottom: spacing.xxxl,
  },
  socialProof: {
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  ctaButton: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    // Button shadow
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
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
