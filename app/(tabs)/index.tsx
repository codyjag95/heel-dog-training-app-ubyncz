import React, { useEffect } from 'react';
import { Alert, StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../../contexts/AppContext';
import { CATEGORIES } from '../../data/categoryData';
import { CATEGORY_ICONS } from '../../data/iconSystem';
import { colors, typography, spacing } from '../../data/darkTheme';
import { LinearGradient } from 'expo-linear-gradient';
import ScrollFade from '../../components/ScrollFade';

export default function HomeScreen() {
  const router = useRouter();
  const { userProfile, getCategoryProgress, hasPremium, isLessonComplete, getDayStreak, streakFreezes, dogs, activeDogId, switchDog } = useApp();

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
  const trainingStreak = getDayStreak();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  useEffect(() => {
    // Store install date on first load
    AsyncStorage.getItem('@heel_install_date').then(date => {
      if (!date) AsyncStorage.setItem('@heel_install_date', new Date().toISOString());
    });
  }, []);

  // Review prompts moved to LessonComplete (milestone-based, at the
  // celebration moment) — asking on home-screen mount was wasted timing.

  return (
    <View style={styles.container}>
      <ScrollFade fadeBottom>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Brand bar */}
        <View style={styles.logoHeader}>
          <View style={styles.brandRow}>
            <Ionicons name="paw" size={26} color={colors.accent} />
            <Text style={styles.brandName}>HEEL</Text>
          </View>
          {trainingStreak > 0 && (
            <View style={styles.streakPill}>
              <Ionicons name="flame" size={15} color="#FFFFFF" />
              <Text style={styles.streakPillText}>{trainingStreak} day{trainingStreak === 1 ? '' : 's'}</Text>
            </View>
          )}
        </View>

        {/* Hero greeting */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>{greeting}</Text>
          <Text style={styles.dogName}>Let's train,{'\n'}{userProfile?.dogName || 'Trainer'}.</Text>
          {dogs.length > 1 && (
            <TouchableOpacity
              style={styles.dogSwitcher}
              onPress={() =>
                Alert.alert('Switch Dog', 'Who are we training?', [
                  ...dogs.map(d => ({
                    text: d.id === activeDogId ? `${d.name} ✓` : d.name,
                    onPress: () => { if (d.id !== activeDogId) switchDog(d.id); },
                  })),
                  { text: 'Cancel', style: 'cancel' as const },
                ])
              }
            >
              <Ionicons name="swap-horizontal" size={14} color={colors.textSecondary} />
              <Text style={styles.dogSwitcherText}>Switch dog</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalLessonsCompleted}</Text>
            <Text style={styles.statLabel}>LESSONS</Text>
          </View>

          <View style={[styles.statCard, styles.statCardAccent]}>
            <Text style={[styles.statValue, { color: colors.accent }]}>{trainingStreak}</Text>
            <Text style={styles.statLabel}>DAY STREAK{streakFreezes > 0 ? ` · ❄${streakFreezes}` : ''}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{recommendedCategories.length}</Text>
            <Text style={styles.statLabel}>FOCUS AREAS</Text>
          </View>
        </View>

        {/* Continue Training */}
        {nextLesson ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Continue Training</Text>
            <TouchableOpacity
              onPress={() =>
                router.push(`/lesson/${nextLesson.category.id}/${nextLesson.lesson.id}`)
              }
              activeOpacity={0.9}
            >
            <LinearGradient
              colors={[colors.accent, '#8E1010']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.continueCard}
            >
              <View style={styles.continueHeader}>
                <Text style={styles.continueCategory}>{nextLesson.category.title.toUpperCase()}</Text>
                <View style={styles.continueBadge}>
                  <Text style={styles.continueBadgeText}>NEXT UP</Text>
                </View>
              </View>
              
              <Text style={styles.continueTitle}>{nextLesson.lesson.title}</Text>
              <Text style={styles.continueDescription} numberOfLines={2}>
                {nextLesson.lesson.description}
              </Text>

              <View style={styles.continueMeta}>
                <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.continueMetaText}>{nextLesson.lesson.duration} min</Text>
                <Text style={styles.continueMetaDot}>·</Text>
                <Ionicons name="bar-chart-outline" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.continueMetaText}>Level {nextLesson.lesson.difficulty}</Text>
              </View>

              <View style={styles.continueButton}>
                <Text style={styles.continueButtonText}>Start Lesson</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.accent} />
              </View>
            </LinearGradient>
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
        {/* Training Roadmap Button */}
{userProfile && (
  <View style={styles.section}>
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardBackground,
        padding: spacing.lg,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.accent,
      }}
      onPress={() => router.push('/roadmap')}
    >
      <View style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.cardBackgroundSecondary || colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
      }}>
        <Ionicons name="map" size={24} color={colors.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: typography.h3,
          fontWeight: typography.bold,
          color: colors.textPrimary,
          marginBottom: 2,
        }}>
          {userProfile.dogName}'s Training Plan
        </Text>
        <Text style={{
          fontSize: typography.small,
          color: colors.textSecondary,
        }}>
          View your personalized 4-week roadmap
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.accent} />
    </TouchableOpacity>
  </View>
)}
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
                <Ionicons name="paw" size={20} color="#D4AF37" />
              </View>
              <Text style={styles.actionText}>Unlock Premium Features</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      </ScrollFade>
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

  // Brand bar
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 3,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Hero greeting
  header: {
    marginBottom: spacing.xl,
  },
  welcomeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textTertiary,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  dogName: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 42,
  },
  dogSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dogSwitcherText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
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
    paddingVertical: spacing.lg,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statCardAccent: {
    borderColor: colors.accent,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textTertiary,
    letterSpacing: 1,
    marginTop: 4,
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

  // Continue Card (hero gradient)
  continueCard: {
    padding: spacing.xl,
    borderRadius: 18,
  },
  continueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  continueCategory: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.85)',
  },
  continueBadge: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  continueBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  continueTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  continueDescription: {
    fontSize: typography.body,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  continueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.lg,
  },
  continueMetaText: {
    fontSize: typography.small,
    color: 'rgba(255,255,255,0.8)',
  },
  continueMetaDot: {
    fontSize: typography.small,
    color: 'rgba(255,255,255,0.8)',
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  continueButtonText: {
    fontSize: typography.body,
    fontWeight: '800',
    color: colors.accent,
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
