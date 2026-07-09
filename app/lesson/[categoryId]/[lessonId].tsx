import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '../../../contexts/AppContext';
import { getCategoryById, getLessonById } from '../../../data/categoryData';
import { getLessonImage } from '../../../data/lessonImages';
import { colors, typography, spacing } from '../../../data/darkTheme';
import { CATEGORY_ICONS } from '../../../data/iconSystem';
import { isLessonLocked } from '../../../utils/premiumAccess';
import { Ionicons } from '@expo/vector-icons';
import FloatingTimer from '../../../components/FloatingTimer';
import LessonComplete from '../../../components/LessonComplete';

export default function LessonDetailScreen() {
  const router = useRouter();
  const { categoryId, lessonId } = useLocalSearchParams<{ categoryId: string; lessonId: string }>();
  const { markLessonComplete, isLessonComplete, hasPremium, userProfile, bonusUnlocks } = useApp();

  const lesson = getLessonById(categoryId!, lessonId!);
  if (!lesson) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Lesson not found</Text>
      </View>
    );
  }

  const category = getCategoryById(categoryId!);
  const lessonIndex = category?.lessons.findIndex(({ id }) => id === lesson.id);
  const lessonImage = getLessonImage(
    categoryId!,
    lesson.id,
    lessonIndex !== undefined && lessonIndex >= 0 ? lessonIndex : undefined,
  );
  const isComplete = isLessonComplete(categoryId!, lessonId!);
  const [showCelebration, setShowCelebration] = useState(false);

  // ── THE ACTUAL LOCK ──
  // Before this check existed, any route into a premium lesson rendered
  // full content. Now the wall is at the content itself.
  const locked = isLessonLocked(categoryId!, lessonId!, hasPremium, bonusUnlocks);
  if (locked) {
    return (
      <View style={[styles.container, styles.lockedContainer]}>
        <View style={styles.lockedBadge}>
          <Ionicons name="lock-closed" size={40} color={colors.accent} />
        </View>
        <Text style={styles.lockedTitle}>{lesson.title}</Text>
        <Text style={styles.lockedSubtext}>
          This lesson is part of {userProfile?.dogName ? `${userProfile.dogName}'s` : 'the'} full training program.
        </Text>
        <TouchableOpacity
          style={styles.lockedButton}
          onPress={() => router.push('/paywall?context=lesson-locked')}
          activeOpacity={0.8}
        >
          <Text style={styles.lockedButtonText}>Unlock Full Program</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  }

  const handleComplete = () => {
    markLessonComplete(categoryId!, lessonId!);
    setShowCelebration(true);
  };

  return (
    <View style={styles.container}>
      {/* Custom back button, the native one was unreliable on first tap */}
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/training'))}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={{ paddingRight: 12 }}
            >
              <Ionicons name="chevron-back" size={28} color="#FF4444" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        {lessonImage ? (
          <Image source={lessonImage} style={styles.heroImage} resizeMode="cover" />
        ) : (
          <View style={styles.heroFallback}>
            <View style={styles.heroFallbackIcon}>
              <Ionicons
                name={CATEGORY_ICONS[categoryId!] || 'book'}
                size={52}
                color={colors.accent}
              />
            </View>
          </View>
        )}

        {/* Lesson Header */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.description}>{lesson.description}</Text>

          {/* Meta Info */}
          <View style={styles.metaContainer}>
            <View style={styles.metaBadge}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{lesson.duration} min</Text>
            </View>
            <View style={styles.metaBadge}>
              <Ionicons name="bar-chart-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>Level {lesson.difficulty}</Text>
            </View>
          </View>

          {/* Service Dog (and any category with a disclaimer): short reminder */}
          {category?.disclaimer && (
            <View style={styles.lessonDisclaimer}>
              <Ionicons name="information-circle" size={15} color={colors.warning} style={{ marginTop: 1 }} />
              <Text style={styles.lessonDisclaimerText}>
                Foundational skills only. Not a substitute for professional service dog training or certification.
              </Text>
            </View>
          )}
        </View>

        {/* Instructions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={24} color={colors.accent} />
            <Text style={styles.sectionTitle}>Instructions</Text>
          </View>
          {lesson.steps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Tips Section */}
        {lesson.tips.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bulb-outline" size={24} color={colors.accent} />
              <Text style={styles.sectionTitle}>Pro Tips</Text>
            </View>
            {lesson.tips.map((tip, index) => (
              <View key={index} style={styles.tipContainer}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Spacer for floating button */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Timer */}
      <FloatingTimer duration={lesson.duration} />

      {/* Complete Button */}
      <View style={styles.bottomContainer}>
        {isComplete ? (
          <TouchableOpacity
            style={styles.completeMessage}
            onPress={() => setShowCelebration(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.completeMessageText}>Complete · Tap to Continue</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Mark as Complete</Text>
          </TouchableOpacity>
        )}
      </View>
      {showCelebration && <LessonComplete categoryId={categoryId!} lessonId={lessonId!} onDismiss={() => setShowCelebration(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },

  // Locked state
  lockedContainer: { justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  lockedBadge: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: colors.cardBackground,
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl,
  },
  lockedTitle: {
    fontSize: typography.h2, fontWeight: typography.bold, color: colors.textPrimary,
    textAlign: 'center', marginBottom: spacing.sm,
  },
  lockedSubtext: {
    fontSize: typography.body, color: colors.textSecondary, textAlign: 'center',
    lineHeight: 22, marginBottom: spacing.xl, paddingHorizontal: spacing.lg,
  },
  lockedButton: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.accent, borderRadius: 14,
    paddingVertical: 15, paddingHorizontal: spacing.xxl,
  },
  lockedButtonText: { fontSize: typography.h4, fontWeight: typography.bold, color: '#FFFFFF' },

  // Header Section
  heroImage: {
    width: '100%',
    height: 190,
    backgroundColor: colors.cardBackground,
  },
  heroFallback: {
    width: '100%',
    height: 190,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroFallbackIcon: {
    width: 104,
    height: 104,
    borderRadius: 26,
    backgroundColor: colors.cardBackgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },

  // Meta Info
  metaContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    gap: spacing.xs,
  },
  metaText: {
    fontSize: typography.small,
    color: colors.textPrimary,
    fontWeight: typography.medium,
  },
  lessonDisclaimer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  lessonDisclaimerText: {
    flex: 1,
    fontSize: typography.caption,
    color: colors.textSecondary,
    lineHeight: 17,
  },

  // Sections
  section: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },

  // Steps
  stepContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: typography.small,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  stepText: {
    flex: 1,
    fontSize: typography.body,
    color: colors.textPrimary,
    lineHeight: 24,
  },

  // Tips
  tipContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    backgroundColor: colors.cardBackground,
    padding: spacing.md,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  tipBullet: {
    fontSize: typography.h4,
    color: colors.accent,
    marginRight: spacing.md,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  // Bottom Button
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  completeButton: {
    backgroundColor: colors.accent,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: '#FFFFFF',
  },
  completeMessage: {
    backgroundColor: '#4CAF50',
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  completeMessageText: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: '#FFFFFF',
  },
});
