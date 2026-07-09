/**
 * Lesson Completion Celebration
 * Shows after marking a lesson complete
 * Confetti, stats, streak, next lesson suggestion
 * 
 * USAGE: Import and render as a modal/overlay in lesson detail screen
 * PLACEMENT: components/LessonComplete.tsx
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { useApp } from '../contexts/AppContext';
import { CATEGORIES } from '../data/categoryData';
import { colors, typography, spacing } from '../data/darkTheme';
import { isLessonLocked } from '../utils/premiumAccess';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type LessonCompleteProps = {
  categoryId: string;
  lessonId: string;
  onDismiss: () => void;
};

// Simple confetti particle
function ConfettiPiece({ delay, startX }: { delay: number; startX: number }) {
  const fallAnim = useRef(new Animated.Value(-20)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const color = ['#FF4444', '#FFFFFF', '#FF6B6B', '#FFB3B3', '#FF8888'][Math.floor(Math.random() * 5)];
  const size = 6 + Math.random() * 6;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fallAnim, {
          toValue: 600,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.delay(1500),
          Animated.timing(opacityAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]),
        Animated.loop(
          Animated.sequence([
            Animated.timing(swayAnim, { toValue: 20, duration: 400, useNativeDriver: true }),
            Animated.timing(swayAnim, { toValue: -20, duration: 400, useNativeDriver: true }),
          ])
        ),
      ]).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: startX,
        top: 0,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: opacityAnim,
        transform: [{ translateY: fallAnim }, { translateX: swayAnim }],
      }}
      pointerEvents="none"
    />
  );
}

export default function LessonComplete({ categoryId, lessonId, onDismiss }: LessonCompleteProps) {
  const router = useRouter();
  const { userProfile, getCategoryProgress, isLessonComplete, getDayStreak, hasPremium, bonusUnlocks } = useApp();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [showContent, setShowContent] = useState(false);

  const dogName = userProfile?.dogName || 'your dog';
  const streak = getDayStreak ? getDayStreak() : 0;

  // Get category info
  const category = CATEGORIES.find(c => c.id === categoryId);
  const progress = getCategoryProgress(categoryId);

  // Find next incomplete lesson in this category
  const getNextLesson = () => {
    if (!category) return null;
    for (const lesson of category.lessons) {
      if (!isLessonComplete(categoryId, lesson.id) && lesson.id !== lessonId) {
        return lesson;
      }
    }
    return null;
  };
  const nextLesson = getNextLesson();
  // Peak-motivation upsell: is the next lesson behind the paywall?
  const nextLocked = nextLesson ? isLessonLocked(categoryId, nextLesson.id, hasPremium, bonusUnlocks) : false;

  // Get total completed across all categories
  const totalCompleted = CATEGORIES.reduce((total, cat) => {
    const p = getCategoryProgress(cat.id);
    return total + p.completed;
  }, 0);

  // Entrance animation
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start(() => setShowContent(true));
  }, []);

  // App Store / Play Store review ask — at milestone completions, right at
  // the happiest moment in the app. expo-store-review uses Apple's native
  // sheet on iOS and Google's in-app review on Android; both cap frequency.
  useEffect(() => {
    const maybeAskReview = async () => {
      const milestones = [3, 10, 25];
      if (!milestones.includes(totalCompleted)) return;
      try {
        const raw = await AsyncStorage.getItem('@heel_review_milestones');
        const asked: number[] = raw ? JSON.parse(raw) : [];
        if (asked.includes(totalCompleted)) return;
        asked.push(totalCompleted);
        await AsyncStorage.setItem('@heel_review_milestones', JSON.stringify(asked));
        if (await StoreReview.isAvailableAsync()) {
          setTimeout(() => StoreReview.requestReview().catch(() => {}), 2500);
        }
      } catch {}
    };
    maybeAskReview();
  }, []);

  // Generate confetti positions
  const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: Math.random() * 500,
    startX: Math.random() * SCREEN_WIDTH,
  }));

  const handleNextLesson = () => {
    if (!nextLesson) return;
    onDismiss();
    if (nextLocked) {
      // The old code walked free users straight into premium content here.
      router.push('/paywall?context=post-lesson');
    } else {
      router.replace(`/lesson/${categoryId}/${nextLesson.id}`);
    }
  };

  const handleGoHome = () => {
    onDismiss();
    router.replace('/(tabs)');
  };

  // Training level based on total completed
  const getLevel = (completed: number): string => {
    if (completed >= 50) return 'Expert';
    if (completed >= 25) return 'Handler';
    if (completed >= 10) return 'Novice';
    if (completed >= 3) return 'Beginner';
    return 'Getting Started';
  };

  return (
    <View style={styles.overlay}>
      {/* Confetti */}
      {confettiPieces.map(piece => (
        <ConfettiPiece key={piece.id} delay={piece.delay} startX={piece.startX} />
      ))}

      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        {/* Success icon */}
        <View style={styles.successBadge}>
          <Ionicons name="checkmark" size={36} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>Nice work!</Text>
        <Text style={styles.subtitle}>{dogName} is making real progress.</Text>

        {/* Stats row */}
        {showContent && (
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{totalCompleted}</Text>
              <Text style={styles.statLabel}>Lessons Done</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Ionicons name="flame" size={18} color={colors.accent} />
              <Text style={styles.statNumber}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{getLevel(totalCompleted)}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
          </View>
        )}

        {/* Category progress */}
        {showContent && category && (
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>{category.title}</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${(progress.completed / progress.total) * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress.completed}/{progress.total} lessons</Text>
          </View>
        )}

        {/* Next lesson suggestion */}
        {showContent && nextLesson && (
          <TouchableOpacity style={styles.nextLessonCard} onPress={handleNextLesson} activeOpacity={0.8}>
            <View style={styles.nextLessonHeader}>
              <Text style={styles.nextLessonLabel}>UP NEXT</Text>
              <Ionicons name={nextLocked ? 'lock-closed' : 'arrow-forward'} size={16} color={colors.accent} />
            </View>
            <Text style={styles.nextLessonTitle}>{nextLesson.title}</Text>
            <Text style={styles.nextLessonMeta}>
              {nextLocked ? 'Premium · ' : ''}{nextLesson.duration} min
            </Text>
          </TouchableOpacity>
        )}

        {/* Buttons */}
        {showContent && (
          <View style={styles.buttonRow}>
            {nextLesson ? (
              <TouchableOpacity style={styles.primaryButton} onPress={handleNextLesson}>
                <Text style={styles.primaryButtonText}>
                  {nextLocked ? `Unlock ${dogName}'s Full Program` : 'Next Lesson'}
                </Text>
                <Ionicons name={nextLocked ? 'lock-open' : 'arrow-forward'} size={18} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.primaryButton} onPress={handleGoHome}>
                <Text style={styles.primaryButtonText}>Back to Home</Text>
                <Ionicons name="home" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.secondaryButton} onPress={handleGoHome}>
              <Text style={styles.secondaryButtonText}>Done for now</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center', alignItems: 'center',
    zIndex: 9999,
  },
  card: {
    backgroundColor: colors.cardBackground, borderRadius: 24,
    padding: spacing.xl, width: SCREEN_WIDTH - 48,
    alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  successBadge: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28, fontWeight: '700', color: colors.textPrimary,
    marginBottom: spacing.xs, textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body, color: colors.textSecondary,
    textAlign: 'center', marginBottom: spacing.xl,
  },

  // Stats
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.background, borderRadius: 14,
    padding: spacing.md, marginBottom: spacing.lg, width: '100%',
  },
  statBox: { flex: 1, alignItems: 'center', gap: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: colors.border },
  statNumber: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 10, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Progress
  progressSection: { width: '100%', marginBottom: spacing.lg },
  progressLabel: { fontSize: typography.small, color: colors.textSecondary, marginBottom: spacing.xs },
  progressBarBg: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden', marginBottom: spacing.xs },
  progressBarFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 3 },
  progressText: { fontSize: 12, color: colors.textTertiary, textAlign: 'right' },

  // Next lesson
  nextLessonCard: {
    width: '100%', backgroundColor: colors.background, borderRadius: 12,
    padding: spacing.md, marginBottom: spacing.lg,
    borderWidth: 1, borderColor: colors.accent,
  },
  nextLessonHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  nextLessonLabel: { fontSize: 10, fontWeight: '700', color: colors.accent, letterSpacing: 1 },
  nextLessonTitle: { fontSize: typography.body, fontWeight: typography.bold, color: colors.textPrimary },
  nextLessonMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  // Buttons
  buttonRow: { width: '100%', gap: spacing.sm },
  primaryButton: {
    backgroundColor: colors.accent, padding: spacing.md, borderRadius: 12,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.sm,
  },
  primaryButtonText: { fontSize: typography.body, fontWeight: '700', color: '#FFFFFF' },
  secondaryButton: { padding: spacing.sm, alignItems: 'center' },
  secondaryButtonText: { fontSize: typography.small, color: colors.textSecondary },
});
