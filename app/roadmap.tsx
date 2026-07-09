/**
 * Training Roadmap Screen
 * 
 * Accessible from: Home screen, Quiz Results, Profile
 * Route: /roadmap
 * 
 * FREE USERS: See Week 1 fully expanded, Week 2 lesson titles (dimmed),
 *             Weeks 3-4 locked with premium upsell
 * PREMIUM USERS: Full access to all 4 weeks with tappable lessons
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../contexts/AppContext';
import { generateRoadmap, getRoadmapProgress, getProfileSignature, TrainingRoadmap, RoadmapDay, RoadmapWeek } from '../data/roadmapGenerator';
import { colors, typography, spacing } from '../data/darkTheme';

const GOLD = '#D2AF26';
// v2: bumped to purge stale plans from older generator versions.
// Keys are scoped per-dog so each dog reliably keeps its own roadmap.
const STORAGE_KEY_ROADMAP_BASE = '@heel_roadmap_v2';
const STORAGE_KEY_ROADMAP_START_BASE = '@heel_roadmap_start_v2';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function RoadmapScreen() {
  const router = useRouter();
  const { userProfile, hasPremium, lessonProgress, isLessonComplete, activeDogId } = useApp();
  // Per-dog storage keys: the live profile always belongs to the active dog,
  // and each dog gets its own cached roadmap.
  const dogKey = activeDogId || 'solo';
  const STORAGE_KEY_ROADMAP = `${STORAGE_KEY_ROADMAP_BASE}_${dogKey}`;
  const STORAGE_KEY_ROADMAP_START = `${STORAGE_KEY_ROADMAP_START_BASE}_${dogKey}`;
  const [roadmap, setRoadmap] = useState<TrainingRoadmap | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // ============================================================================
  // LOAD OR GENERATE ROADMAP
  // ============================================================================

  useEffect(() => {
    const loadRoadmap = async () => {
      if (!userProfile) {
        setLoading(false);
        return;
      }

      try {
        // Reuse the cached roadmap only if it matches the active dog's current
        // quiz inputs. The signature covers dog, breed, experience, energy,
        // availability, recommended categories, challenges, goal, and age — so
        // retaking the quiz with a new main issue regenerates the plan.
        const currentSignature = getProfileSignature(userProfile);
        const saved = await AsyncStorage.getItem(STORAGE_KEY_ROADMAP);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.signature === currentSignature) {
            setRoadmap(parsed);
            setLoading(false);
            return;
          }
        }

        // Generate new roadmap
        const newRoadmap = generateRoadmap(userProfile);
        setRoadmap(newRoadmap);
        
        // Save roadmap and start date
        await AsyncStorage.setItem(STORAGE_KEY_ROADMAP, JSON.stringify(newRoadmap));
        await AsyncStorage.setItem(STORAGE_KEY_ROADMAP_START, new Date().toISOString());
      } catch (err) {
        console.error('Error loading roadmap:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRoadmap();
  }, [userProfile, activeDogId]);

  // ============================================================================
  // PROGRESS CALCULATION
  // ============================================================================

  const progress = useMemo(() => {
    if (!roadmap) return null;
    const completed = lessonProgress
      .filter(p => p.completed)
      .map(p => ({ categoryId: p.categoryId, lessonId: p.lessonId }));
    return getRoadmapProgress(roadmap, completed);
  }, [roadmap, lessonProgress]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const toggleWeek = (weekNum: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedWeek(expandedWeek === weekNum ? 0 : weekNum);
  };

  const handleLessonPress = (categoryId: string, lessonId: string) => {
    router.push(`/lesson/${categoryId}/${lessonId}`);
  };

  const handleRegenerateRoadmap = async () => {
    if (!userProfile) return;
    if (!hasPremium) {
      router.push('/(tabs)/premium');
      return;
    }
    const lastRegen = await AsyncStorage.getItem('@heel_last_regeneration');
    if (lastRegen) {
      const hoursSince = (Date.now() - new Date(lastRegen).getTime()) / (1000 * 60 * 60);
      if (hoursSince < 6) {
        Alert.alert('Hold On', 'You can regenerate your plan once every 6 hours. Try again later.');
        return;
      }
    }
    const newRoadmap = generateRoadmap(userProfile);
    setRoadmap(newRoadmap);
    await AsyncStorage.setItem(STORAGE_KEY_ROADMAP, JSON.stringify(newRoadmap));
    await AsyncStorage.setItem(STORAGE_KEY_ROADMAP_START, new Date().toISOString());
    await AsyncStorage.setItem('@heel_last_regeneration', new Date().toISOString());
  };

  // ============================================================================
  // NO PROFILE STATE
  // ============================================================================

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="map-outline" size={64} color={colors.accent} />
          <Text style={styles.emptyTitle}>No Training Plan Yet</Text>
          <Text style={styles.emptyText}>
            Take the personalization quiz to generate{'\n'}your dog's custom training roadmap
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/(tabs)/quiz')}
          >
            <Text style={styles.emptyButtonText}>Take the Quiz</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading || !roadmap) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="hourglass-outline" size={48} color={colors.accent} />
          <Text style={styles.emptyTitle}>Building your plan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  const dogName = roadmap.dogName;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{dogName}'s Training Plan</Text>
          <Text style={styles.headerSubtitle}>
            4-week personalized program · {roadmap.totalLessons} lessons
          </Text>
        </View>

        {/* Progress Card */}
        {progress && (
          <View style={styles.progressCard}>
            <View style={styles.progressTop}>
              <View>
                <Text style={styles.progressLabel}>Overall Progress</Text>
                <Text style={styles.progressValue}>{progress.percentComplete}%</Text>
              </View>
              <View style={styles.progressStats}>
                <View style={styles.progressStat}>
                  <Text style={styles.progressStatValue}>{progress.totalCompleted}</Text>
                  <Text style={styles.progressStatLabel}>Done</Text>
                </View>
                <View style={styles.progressStatDivider} />
                <View style={styles.progressStat}>
                  <Text style={styles.progressStatValue}>{progress.totalAssigned - progress.totalCompleted}</Text>
                  <Text style={styles.progressStatLabel}>Left</Text>
                </View>
                <View style={styles.progressStatDivider} />
                <View style={styles.progressStat}>
                  <Text style={styles.progressStatValue}>Wk {progress.currentWeek}</Text>
                  <Text style={styles.progressStatLabel}>Current</Text>
                </View>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress.percentComplete}%` }]} />
              </View>
            </View>
          </View>
        )}

        {/* Weekly Roadmap */}
        {roadmap.weeks.map((week) => {
          const isExpanded = expandedWeek === week.weekNumber;
          const isLocked = week.isPremiumWeek && !hasPremium;
          const weekLessonCount = week.days.reduce((sum, d) => sum + d.lessons.length, 0);
          
          // Count completed lessons in this week
          const weekCompleted = week.days.reduce((sum, day) => {
            return sum + day.lessons.filter(l => 
              isLessonComplete(l.categoryId, l.lessonId)
            ).length;
          }, 0);

          return (
            <View key={week.weekNumber} style={styles.weekSection}>
              {/* Week Header — always tappable */}
              <TouchableOpacity
                style={[
                  styles.weekHeader,
                  isExpanded && styles.weekHeaderExpanded,
                  isLocked && styles.weekHeaderLocked,
                ]}
                onPress={() => toggleWeek(week.weekNumber)}
                activeOpacity={0.7}
              >
                <View style={styles.weekHeaderLeft}>
                  <View style={[
                    styles.weekBadge,
                    isLocked && styles.weekBadgeLocked,
                    weekCompleted === weekLessonCount && weekLessonCount > 0 && styles.weekBadgeComplete,
                  ]}>
                    {weekCompleted === weekLessonCount && weekLessonCount > 0 ? (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    ) : (
                      <Text style={[styles.weekBadgeText, isLocked && styles.weekBadgeTextLocked]}>
                        {week.weekNumber}
                      </Text>
                    )}
                  </View>
                  <View style={styles.weekTitleContainer}>
                    <Text style={[styles.weekTitle, isLocked && styles.weekTitleLocked]}>
                      Week {week.weekNumber}: {week.title}
                    </Text>
                    <Text style={[styles.weekMeta, isLocked && styles.weekMetaLocked]}>
                      {weekLessonCount} lessons · {weekCompleted}/{weekLessonCount} complete
                    </Text>
                  </View>
                </View>
                <View style={styles.weekHeaderRight}>
                  {isLocked && (
                    <Ionicons name="lock-closed" size={16} color={GOLD} style={{ marginRight: 8 }} />
                  )}
                  <Ionicons 
                    name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                    size={20} 
                    color={isLocked ? colors.textTertiary : colors.textSecondary} 
                  />
                </View>
              </TouchableOpacity>

              {/* Week Content — expanded */}
              {isExpanded && (
                <View style={styles.weekContent}>
                  {/* Week description */}
                  <Text style={[styles.weekDescription, isLocked && styles.weekDescLocked]}>
                    {week.description}
                  </Text>

                  {/* Premium upsell for locked weeks */}
                  {isLocked && (
                    <TouchableOpacity
                      style={styles.unlockBanner}
                      onPress={() => router.push('/(tabs)/premium')}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="paw" size={20} color={GOLD} />
                      <Text style={styles.unlockBannerText}>
                        Unlock {dogName}'s full plan
                      </Text>
                      <Ionicons name="arrow-forward" size={16} color={GOLD} />
                    </TouchableOpacity>
                  )}

                  {/* Days */}
                  {week.days.map((day) => (
                    <DayCard
                      key={day.dayNumber}
                      day={day}
                      isLocked={isLocked}
                      hasPremium={hasPremium}
                      isLessonComplete={isLessonComplete}
                      onLessonPress={handleLessonPress}
                      onPremiumPress={() => router.push('/(tabs)/premium')}
                    />
                  ))}

                  {/* Milestone */}
                  <View style={[styles.milestoneCard, isLocked && styles.milestoneLocked]}>
                    <Ionicons 
                      name="flag" 
                      size={18} 
                      color={isLocked ? colors.textTertiary : colors.accent} 
                    />
                    <Text style={[styles.milestoneText, isLocked && styles.milestoneTextLocked]}>
                      {week.milestone}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}

        {/* Regenerate Button */}
        <TouchableOpacity style={styles.regenerateButton} onPress={handleRegenerateRoadmap}>
          <Ionicons name={hasPremium ? 'refresh' : 'lock-closed'} size={18} color={colors.textTertiary} />
          <Text style={styles.regenerateText}>{hasPremium ? 'Regenerate plan' : 'Unlock Full Plan to Regenerate'}</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// DAY CARD COMPONENT
// ============================================================================

function DayCard({
  day,
  isLocked,
  hasPremium,
  isLessonComplete: checkComplete,
  onLessonPress,
  onPremiumPress,
}: {
  day: RoadmapDay;
  isLocked: boolean;
  hasPremium: boolean;
  isLessonComplete: (catId: string, lessonId: string) => boolean;
  onLessonPress: (catId: string, lessonId: string) => void;
  onPremiumPress: () => void;
}) {
  if (day.isRestDay) {
    return (
      <View style={styles.dayCard}>
        <View style={styles.dayHeader}>
          <View style={styles.dayBadgeRest}>
            <Ionicons name="heart" size={12} color={colors.accent} />
          </View>
          <Text style={styles.dayLabel}>{day.dayOfWeek}</Text>
          <Text style={styles.dayTheme}>{day.theme}</Text>
        </View>
        {day.breedTip && (
          <Text style={styles.restDayTip}>{day.breedTip}</Text>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.dayCard, isLocked && styles.dayCardLocked]}>
      <View style={styles.dayHeader}>
        <View style={styles.dayBadge}>
          <Text style={styles.dayBadgeText}>D{day.dayNumber}</Text>
        </View>
        <Text style={[styles.dayLabel, isLocked && styles.dayLabelLocked]}>
          {day.dayOfWeek}
        </Text>
        <Text style={[styles.dayTheme, isLocked && styles.dayThemeLocked]}>
          {day.theme}
        </Text>
      </View>

      {day.lessons.map((lesson, i) => {
        const completed = checkComplete(lesson.categoryId, lesson.lessonId);
        const lessonLocked = isLocked || (lesson.isPremiumLesson && !hasPremium);

        return (
          <TouchableOpacity
            key={`${lesson.categoryId}_${lesson.lessonId}_${i}`}
            style={[
              styles.lessonRow,
              completed && styles.lessonRowComplete,
              lessonLocked && styles.lessonRowLocked,
            ]}
            onPress={() => {
              if (lessonLocked) {
                onPremiumPress();
              } else {
                onLessonPress(lesson.categoryId, lesson.lessonId);
              }
            }}
            activeOpacity={0.7}
          >
            <View style={[
              styles.lessonCheck,
              completed && styles.lessonCheckComplete,
              lessonLocked && styles.lessonCheckLocked,
            ]}>
              {completed ? (
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              ) : lessonLocked ? (
                <Ionicons name="lock-closed" size={10} color={colors.textTertiary} />
              ) : null}
            </View>
            <View style={styles.lessonInfo}>
              <Text style={[
                styles.lessonTitle,
                completed && styles.lessonTitleComplete,
                lessonLocked && styles.lessonTitleLocked,
              ]}>
                {lesson.title}
              </Text>
              <Text style={[styles.lessonCategory, lessonLocked && styles.lessonCategoryLocked]}>
                {lesson.categoryTitle} · {lesson.duration} min
              </Text>
            </View>
            <Ionicons 
              name={lessonLocked ? 'lock-closed' : 'chevron-forward'} 
              size={16} 
              color={lessonLocked ? GOLD : colors.textTertiary} 
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.lg },

  // Empty state
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxxl, gap: spacing.md },
  emptyTitle: { fontSize: typography.h2, fontWeight: typography.bold, color: colors.textPrimary },
  emptyText: { fontSize: typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  emptyButton: { backgroundColor: colors.accent, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: 12, marginTop: spacing.md },
  emptyButtonText: { fontSize: typography.body, fontWeight: typography.bold, color: '#FFFFFF' },

  // Header
  header: { marginBottom: spacing.xl },
  headerTitle: { fontSize: typography.h1, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: spacing.xs },
  headerSubtitle: { fontSize: typography.body, color: colors.textSecondary },

  // Progress Card
  progressCard: {
    backgroundColor: colors.cardBackground, padding: spacing.lg,
    borderRadius: 16, marginBottom: spacing.xl,
    borderWidth: 1, borderColor: colors.border,
  },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  progressLabel: { fontSize: typography.small, color: colors.textSecondary, marginBottom: 4 },
  progressValue: { fontSize: 32, fontWeight: '800', color: colors.accent },
  progressStats: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  progressStat: { alignItems: 'center' },
  progressStatValue: { fontSize: typography.h4, fontWeight: typography.bold, color: colors.textPrimary },
  progressStatLabel: { fontSize: 11, color: colors.textTertiary, marginTop: 2 },
  progressStatDivider: { width: 1, height: 24, backgroundColor: colors.border },
  progressBarContainer: { marginTop: spacing.sm },
  progressBarBg: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 4 },

  // Week sections
  weekSection: { marginBottom: spacing.md },

  // Week Header
  weekHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.cardBackground, padding: spacing.lg,
    borderRadius: 14, borderWidth: 1, borderColor: colors.border,
  },
  weekHeaderExpanded: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  weekHeaderLocked: { borderColor: GOLD, borderWidth: 1, borderStyle: 'dashed' as any },
  weekHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: spacing.md },
  weekHeaderRight: { flexDirection: 'row', alignItems: 'center' },
  weekBadge: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center',
  },
  weekBadgeLocked: { backgroundColor: colors.border },
  weekBadgeComplete: { backgroundColor: '#4CAF50' },
  weekBadgeText: { fontSize: 14, fontWeight: typography.bold, color: '#FFFFFF' },
  weekBadgeTextLocked: { color: colors.textTertiary },
  weekTitleContainer: { flex: 1 },
  weekTitle: { fontSize: typography.h4, fontWeight: typography.bold, color: colors.textPrimary },
  weekTitleLocked: { color: colors.textTertiary },
  weekMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  weekMetaLocked: { color: colors.textTertiary },

  // Week Content
  weekContent: {
    backgroundColor: colors.cardBackground, padding: spacing.lg,
    borderBottomLeftRadius: 14, borderBottomRightRadius: 14,
    borderWidth: 1, borderTopWidth: 0, borderColor: colors.border,
  },
  weekDescription: { fontSize: typography.body, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.lg },
  weekDescLocked: { color: colors.textTertiary },

  // Unlock banner
  unlockBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.cardBackgroundSecondary || colors.background,
    padding: spacing.md, borderRadius: 10, gap: spacing.sm,
    marginBottom: spacing.lg, borderWidth: 1, borderColor: GOLD,
  },
  unlockBannerText: { fontSize: typography.body, fontWeight: typography.bold, color: GOLD },

  // Day Card
  dayCard: {
    backgroundColor: colors.cardBackgroundSecondary || colors.background,
    padding: spacing.md, borderRadius: 10, marginBottom: spacing.sm,
  },
  dayCardLocked: { opacity: 0.5 },
  dayHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  dayBadge: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center',
  },
  dayBadgeRest: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: colors.cardBackground, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  dayBadgeText: { fontSize: 10, fontWeight: typography.bold, color: colors.textPrimary },
  dayLabel: { fontSize: typography.small, fontWeight: typography.semibold, color: colors.textPrimary },
  dayLabelLocked: { color: colors.textTertiary },
  dayTheme: { fontSize: 12, color: colors.textSecondary, marginLeft: 'auto' },
  dayThemeLocked: { color: colors.textTertiary },
  restDayTip: { fontSize: typography.small, color: colors.textSecondary, lineHeight: 20, fontStyle: 'italic', paddingLeft: 36 },

  // Lesson Row
  lessonRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.md, borderRadius: 8, marginBottom: 4,
    backgroundColor: colors.cardBackground,
  },
  lessonRowComplete: { opacity: 0.6 },
  lessonRowLocked: { opacity: 0.5 },
  lessonCheck: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center', marginRight: spacing.md,
  },
  lessonCheckComplete: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  lessonCheckLocked: { borderColor: colors.textTertiary, borderStyle: 'dashed' as any },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: typography.body, fontWeight: typography.semibold, color: colors.textPrimary, marginBottom: 2 },
  lessonTitleComplete: { textDecorationLine: 'line-through', color: colors.textSecondary },
  lessonTitleLocked: { color: colors.textTertiary },
  lessonCategory: { fontSize: 12, color: colors.textSecondary },
  lessonCategoryLocked: { color: colors.textTertiary },

  // Milestone
  milestoneCard: {
    flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start',
    backgroundColor: colors.cardBackgroundSecondary || colors.background,
    padding: spacing.md, borderRadius: 10, marginTop: spacing.sm,
  },
  milestoneLocked: { opacity: 0.5 },
  milestoneText: { flex: 1, fontSize: typography.small, color: colors.textPrimary, lineHeight: 20 },
  milestoneTextLocked: { color: colors.textTertiary },

  // Regenerate
  regenerateButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, padding: spacing.md, marginTop: spacing.lg,
  },
  regenerateText: { fontSize: typography.small, color: colors.textTertiary },
});
