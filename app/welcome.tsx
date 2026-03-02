import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../data/darkTheme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo/Paw */}
      <View style={styles.logoContainer}>
        <View style={styles.pawCircle}>
          <Ionicons name="paw" size={64} color="#FFFFFF" />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Brand Name */}
        <Text style={styles.brandName}>HEEL</Text>

        {/* Headline */}
        <Text style={styles.headline}>Calm, structured{'\n'}dog training</Text>

        {/* Subheading */}
        <Text style={styles.subheading}>
          Short, structured sessions that build{'\n'}real behavior
        </Text>

        {/* Bullet Points */}
        <View style={styles.bulletContainer}>
          <BulletPoint text="Build calm focus in minutes" />
          <BulletPoint text="Reinforce good behavior consistently" />
          <BulletPoint text="See progress over time" />
        </View>
      </View>

      {/* CTA Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/(tabs)/quiz')}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaButtonText}>Start Training</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Bullet Point Component
function BulletPoint({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.checkCircle}>
        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
      </View>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },

  // Logo Section
  logoContainer: {
    flex: 0.35,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  pawCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Content Section
  content: {
    flex: 0.5,
    justifyContent: 'flex-start',
    paddingTop: spacing.md,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.accent,
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: spacing.sm,
  },
  headline: {
    fontSize: 32,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 40,
  },
  subheading: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },

  // Bullets
  bulletContainer: {
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulletText: {
    flex: 1,
    fontSize: typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },

  // CTA Button
  buttonContainer: {
    flex: 0.15,
    justifyContent: 'flex-end',
    paddingBottom: spacing.xxxl,
  },
  ctaButton: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
});
