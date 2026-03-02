import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { CATEGORIES } from '../../data/categoryData';
import { CATEGORY_ICONS } from '../../data/iconSystem';
import { colors, typography, spacing } from '../../data/darkTheme';

export default function HomeScreen() {
  const router = useRouter();
  const { userProfile, getCategoryProgress, hasPremium, isLessonComplete } = useApp();

  // Calculate total completed lessons across all categories
  const totalLessonsCompleted = CATEGORIES.reduce((total, category) => {
    const progress = getCategoryProgress(category.id);
    return total + progress.completed;
  }, 0);

  // Get recommended categories IN QUIZ PRIORITY ORDER (not CATEGORIES array order)
  const recommendedCategoryIds = userProfile?.recommendedCategories || [];
  const recommendedCategories = recommendedCategoryIds
    .map(id => CATEGORIES.find(cat => cat.id === id))
    .filter(Boolean) as typeof CATEGORIES;

  // Find next INCOMPLETE lesson in recommended categories (priority order)
  const getNextLesson = () => {
    for (const category of recommendedCategories) {
      const progress = getCategoryProgress(category.id);
      if (progress.completed < progress.total) {
        // Find the first lesson that is both accessible AND not yet completed
        const nextLesson = category.lessons.find(lesson => {
          // Skip locked premium lessons for free users
          if (category.isPremium && lesson.isPremium !== false && !hasPremium) return false;
          if (!category.isPremium && lesson.isPremium === true && !hasPremium) return false;
          // Skip already completed lessons
          if (isLessonComplete(category.id, lesson.id)) return false;
          return true;
        });
        if (nextLesson) {
          return { category, lesson: nextLesson };
        }
      }
    }
    // Fallback: check ALL categories (not just recommended) for any incomplete lesson
    for (const category of CATEGORIES) {
      const nextLesson = category.lessons.find(lesson => {
        if (category.isPremium && lesson.isPremium !== false && !hasPremium) return false;
        if (!category.isPremium && lesson.isPremium === true && !hasPremium) return false;
        if (isLessonComplete(category.id, lesson.id)) return false;
        return true;
      });
      if (nextLesson) {
        return { category, lesson: nextLesson };
      }
    }
    return null;
  };

  const nextLesson = getNextLesson();
  const trainingStreak = 0; // TODO: Implement actual streak tracking

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEEL Logo Header */}
        <View style={styles.logoHeader}>
          <View style={styles.logoContainer}>
            <Ionicons name="paw" size={36} color={colors.accent} />
          </View>
          <View style={styles.brandContainer}>
            <Text style={styles.brandName}>HEEL</Text>
            <Text style={styles.brandTagline}>Dog Training</Text>
          </View>
        </View>

        {/* Welcome Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.dogName}>{userProfile?.dogName || 'Trainer'}!</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="book" size={28} color={colors.accent} />
            <Text style={styles.statValue}>{totalLessonsCompleted}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="flame" size={28} color={colors.accent} />
            <Text style={styles.statValue}>{trainingStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="flag" size={28} color={colors.accent} />
            <Text style={styles.statValue}>{recommendedCategories.length}</Text>
            <Text style={styles.statLabel}>Focus Areas</Text>
          </View>
        </View>

        {/* Continue Training */}
        {nextLesson ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Continue Training</Text>
            <TouchableOpacity
              style={styles.continueCard}
              onPress={() =>
                router.push(`/lesson/${nextLesson.category.id}/${nextLesson.lesson.id}`)
              }
            >
              <View style={styles.continueHeader}>
                <Text style={styles.continueCategory}>{nextLesson.category.title}</Text>
                <View style={styles.continueBadge}>
                  <Text style={styles.continueBadgeText}>Next Up</Text>
                </View>
              </View>
              
              <Text style={styles.continueTitle}>{nextLesson.lesson.title}</Text>
              <Text style={styles.continueDescription} numberOfLines={2}>
                {nextLesson.lesson.description}
              </Text>

              <View style={styles.continueMeta}>
                <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
                <Text style={styles.continueMetaText}>{nextLesson.lesson.duration} min</Text>
                <Text style={styles.continueMetaDot}>·</Text>
                <Ionicons name="bar-chart-outline" size={14} color={colors.textTertiary} />
                <Text style={styles.continueMetaText}>Level {nextLesson.lesson.difficulty}</Text>
              </View>

              <View style={styles.continueButton}>
                <Text style={styles.continueButtonText}>Start Lesson</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.textPrimary} />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.allDoneCard}>
              <Ionicons name="checkmark-circle" size={56} color={colors.accent} />
              <Text style={styles.allDoneTitle}>You're All Caught Up!</Text>
              <Text style={styles.allDoneText}>
                Great work! Explore more categories to continue learning.
              </Text>
              <TouchableOpacity
                style={styles.allDoneButton}
                onPress={() => router.push('/(tabs)/training')}
              >
                <Text style={styles.allDoneButtonText}>Browse Categories</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Today's Focus */}
        {recommendedCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Focus Areas</Text>
            {recommendedCategories.map(category => {
              const progress = getCategoryProgress(category.id);
              const progressPercent = progress.total > 0 
                ? Math.round((progress.completed / progress.total) * 100) 
                : 0;

              return (
                <TouchableOpacity
                  key={category.id}
                  style={styles.focusCard}
                  onPress={() => router.push(`/category/${category.id}`)}
                >
                  <View style={styles.focusIconContainer}>
                    <Ionicons
                      name={CATEGORY_ICONS[category.id] || 'paw'}
                      size={24}
                      color={colors.accent}
                    />
                  </View>
                  
                  <View style={styles.focusInfo}>
                    <Text style={styles.focusTitle}>{category.title}</Text>
                    <View style={styles.focusProgress}>
                      <View style={styles.focusProgressBar}>
                        <View
                          style={[styles.focusProgressFill, { width: `${progressPercent}%` }]}
                        />
                      </View>
                      <Text style={styles.focusProgressText}>
                        {progress.completed}/{progress.total}
                      </Text>
                    </View>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/training')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="book-outline" size={20} color={colors.accent} />
            </View>
            <Text style={styles.actionText}>Browse All Categories</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          {!userProfile && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/quiz')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="clipboard-outline" size={20} color={colors.accent} />
              </View>
              <Text style={styles.actionText}>Take Personalization Quiz</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}

          {!hasPremium && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/premium')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="paw" size={20} color="#FFD700" />
              </View>
              <Text style={styles.actionText}>Unlock Premium Features</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },

  // Logo Header
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.md,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  brandContainer: {
    flex: 1,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  brandTagline: {
    fontSize: typography.small,
    color: colors.textSecondary,
    marginTop: -2,
  },

  // Header
  header: {
    marginBottom: spacing.xl,
  },
  welcomeText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  dogName: {
    fontSize: typography.h1,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: typography.h2,
    fontWeight: typography.bold,
    color: colors.accent,
  },
  statLabel: {
    fontSize: typography.tiny,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Sections
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  // Continue Card
  continueCard: {
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  continueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  continueCategory: {
    fontSize: typography.small,
    color: colors.textTertiary,
    fontWeight: typography.medium,
  },
  continueBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  continueBadgeText: {
    fontSize: typography.tiny,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  continueTitle: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  continueDescription: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  continueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  continueMetaText: {
    fontSize: typography.small,
    color: colors.textTertiary,
  },
  continueMetaDot: {
    fontSize: typography.small,
    color: colors.textTertiary,
  },
  continueButton: {
    backgroundColor: colors.accent,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  continueButtonText: {
    fontSize: typography.body,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },

  // All Done Card
  allDoneCard: {
    backgroundColor: colors.cardBackground,
    padding: spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    gap: spacing.sm,
  },
  allDoneTitle: {
    fontSize: typography.h2,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  allDoneText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  allDoneButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  allDoneButtonText: {
    fontSize: typography.body,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },

  // Focus Cards
  focusCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  focusIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.cardBackgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  focusInfo: {
    flex: 1,
  },
  focusTitle: {
    fontSize: typography.h4,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  focusProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  focusProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  focusProgressFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  focusProgressText: {
    fontSize: typography.small,
    color: colors.textTertiary,
    width: 50,
    textAlign: 'right',
  },

  // Action Buttons
  actionButton: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.cardBackgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  actionText: {
    flex: 1,
    fontSize: typography.body,
    fontWeight: typography.medium,
    color: colors.textPrimary,
  },
});
