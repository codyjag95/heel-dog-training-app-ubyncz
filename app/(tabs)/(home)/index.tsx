
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function HomeScreen() {
  const router = useRouter();
  const { dogProfile, categories, hasCompletedOnboarding, userProgress, getTodaysFocus, getProgressInsights, allDogs } = useApp();

  // Use Redirect component for navigation - it handles timing automatically
  if (!hasCompletedOnboarding) {
    console.log('Redirecting to onboarding via Redirect component');
    return <Redirect href="/onboarding/welcome" />;
  }

  const totalLessons = categories.reduce((acc, cat) => acc + cat.lessons.length, 0);
  const completedLessons = categories.reduce((acc, cat) => acc + cat.completedCount, 0);
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Find last viewed lesson
  const lastViewedLesson = dogProfile?.lastViewedLesson;
  let lastViewedLessonData = null;
  let lastViewedCategory = null;

  if (lastViewedLesson) {
    for (const category of categories) {
      const lesson = category.lessons.find(l => l.id === lastViewedLesson);
      if (lesson) {
        lastViewedLessonData = lesson;
        lastViewedCategory = category;
        break;
      }
    }
  }

  // Empty state check
  const hasStartedTraining = completedLessons > 0 || lastViewedLesson;

  // Premium features
  const todaysFocus = getTodaysFocus();
  const insights = getProgressInsights();

  // Check if free user has reached dog limit
  const canAddMoreDogs = userProgress.isPremium || allDogs.length < 1;

  return (
    <View style={[commonStyles.container]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>HEEL</Text>
          {dogProfile && (
            <View style={styles.dogInfo}>
              <Text style={styles.dogName}>{dogProfile.name}</Text>
              <Text style={styles.progressText}>{progressPercentage}% Complete</Text>
            </View>
          )}
          {userProgress.isPremium && allDogs.length > 1 && (
            <TouchableOpacity
              style={styles.switchDogButton}
              onPress={() => router.push('/settings')}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="person.2.fill"
                android_material_icon_name="group"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.switchDogText}>Switch Dog</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Free Training Tip */}
        <View style={styles.trainingTipCard}>
          <View style={styles.trainingTipIcon}>
            <IconSymbol
              ios_icon_name="lightbulb.fill"
              android_material_icon_name="lightbulb"
              size={24}
              color={colors.primary}
            />
          </View>
          <View style={styles.trainingTipContent}>
            <Text style={styles.trainingTipLabel}>Training Tip</Text>
            <Text style={styles.trainingTipText}>
              Train before meals. Dogs are more focused and motivated when training happens before feeding, not after.
            </Text>
          </View>
        </View>

        {/* Today's Focus (Premium) */}
        {userProgress.isPremium && todaysFocus && (
          <View style={styles.todaysFocusSection}>
            <Text style={styles.sectionTitle}>Today&apos;s Focus</Text>
            <TouchableOpacity
              style={styles.todaysFocusCard}
              onPress={() => router.push({
                pathname: '/lesson',
                params: {
                  categoryId: todaysFocus.category.id,
                  lessonId: todaysFocus.lesson.id
                }
              })}
              activeOpacity={0.7}
            >
              <View style={styles.todaysFocusIcon}>
                <IconSymbol
                  ios_icon_name="target"
                  android_material_icon_name="track-changes"
                  size={32}
                  color={colors.text}
                />
              </View>
              <View style={styles.todaysFocusContent}>
                <Text style={styles.todaysFocusCategoryText}>{todaysFocus.category.name}</Text>
                <Text style={styles.todaysFocusLessonText}>{todaysFocus.lesson.name}</Text>
                <Text style={styles.todaysFocusTimeText}>{todaysFocus.lesson.estimatedTime}</Text>
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Progress Insights (Premium) */}
        {userProgress.isPremium && insights.length > 0 && (
          <View style={styles.insightsSection}>
            <Text style={styles.sectionTitle}>Progress Insights</Text>
            <View style={styles.insightsCard}>
              {insights.map((insight, index) => (
                <View key={index} style={styles.insightItem}>
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Early Progress Reinforcement */}
        {!hasStartedTraining && (
          <View style={styles.emptyStateCard}>
            <IconSymbol
              ios_icon_name="pawprint.fill"
              android_material_icon_name="pets"
              size={48}
              color={colors.primary}
            />
            <Text style={styles.emptyStateTitle}>Ready to start training?</Text>
            <Text style={styles.emptyStateText}>
              Your first session matters! Choose a category below and begin building calm, focused behavior with {dogProfile?.name || 'your dog'}.
            </Text>
          </View>
        )}

        {/* Progress Acknowledgment at 0% */}
        {hasStartedTraining && progressPercentage === 0 && (
          <View style={styles.progressEncouragementCard}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.progressEncouragementTitle}>Great start!</Text>
            <Text style={styles.progressEncouragementText}>
              You&apos;ve taken the first step. Every session builds on the last—consistency is what creates lasting change.
            </Text>
          </View>
        )}

        {/* Continue Where You Left Off */}
        {lastViewedLessonData && lastViewedCategory && !lastViewedLessonData.isCompleted && (
          <View style={styles.continueSection}>
            <Text style={styles.sectionTitle}>Continue Where You Left Off</Text>
            <TouchableOpacity
              style={styles.continueCard}
              onPress={() => router.push({
                pathname: '/lesson',
                params: {
                  categoryId: lastViewedCategory.id,
                  lessonId: lastViewedLessonData.id
                }
              })}
              activeOpacity={0.7}
            >
              <View style={styles.continueIcon}>
                <IconSymbol
                  ios_icon_name="play.fill"
                  android_material_icon_name="play-arrow"
                  size={24}
                  color={colors.text}
                />
              </View>
              <View style={styles.continueContent}>
                <Text style={styles.continueCategoryText}>{lastViewedCategory.name}</Text>
                <Text style={styles.continueLessonText}>{lastViewedLessonData.name}</Text>
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Progress Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{completedLessons}</Text>
              <Text style={styles.summaryLabel}>Completed</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{userProgress.currentStreak}</Text>
              <Text style={styles.summaryLabel}>Day Streak</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{totalLessons}</Text>
              <Text style={styles.summaryLabel}>Total Lessons</Text>
            </View>
          </View>
        </View>

        {/* Session Templates (Premium) */}
        {userProgress.isPremium && (
          <View style={styles.templatesSection}>
            <View style={styles.templatesSectionHeader}>
              <Text style={styles.sectionTitle}>Quick Sessions</Text>
              <TouchableOpacity
                onPress={() => router.push('/modal')}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.templatesScroll}
            >
              <TouchableOpacity
                style={styles.templateCard}
                onPress={() => router.push('/modal')}
                activeOpacity={0.7}
              >
                <IconSymbol
                  ios_icon_name="bolt.fill"
                  android_material_icon_name="flash-on"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.templateName}>5-Min Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.templateCard}
                onPress={() => router.push('/modal')}
                activeOpacity={0.7}
              >
                <IconSymbol
                  ios_icon_name="eye.fill"
                  android_material_icon_name="visibility"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.templateName}>Focus Day</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.templateCard}
                onPress={() => router.push('/modal')}
                activeOpacity={0.7}
              >
                <IconSymbol
                  ios_icon_name="flame.fill"
                  android_material_icon_name="whatshot"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.templateName}>Energy Drain</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Training Categories</Text>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              onPress={() => router.push({
                pathname: '/category',
                params: { categoryId: category.id }
              })}
              activeOpacity={0.7}
            >
              <View style={styles.categoryIcon}>
                <IconSymbol
                  ios_icon_name={category.icon}
                  android_material_icon_name="fitness-center"
                  size={28}
                  color={colors.primary}
                />
              </View>
              <View style={styles.categoryContent}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
                <View style={styles.categoryProgress}>
                  <Text style={styles.categoryProgressText}>
                    {category.completedCount} / {category.lessons.length} lessons
                  </Text>
                </View>
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Upgrade Prompt for Free Users */}
        {!userProgress.isPremium && (
          <TouchableOpacity
            style={styles.upgradePrompt}
            onPress={() => router.push('/(tabs)/premium')}
            activeOpacity={0.8}
          >
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={24}
              color={colors.text}
            />
            <View style={styles.upgradePromptContent}>
              <Text style={styles.upgradePromptTitle}>Unlock Premium Features</Text>
              <Text style={styles.upgradePromptText}>
                Get personalized roadmaps, multi-dog management, and advanced insights
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 2,
    marginBottom: 8,
  },
  dogInfo: {
    marginTop: 8,
  },
  dogName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  switchDogButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
  },
  switchDogText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
  },
  trainingTipCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  trainingTipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  trainingTipContent: {
    flex: 1,
  },
  trainingTipLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  trainingTipText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 22,
  },
  todaysFocusSection: {
    marginBottom: 24,
  },
  todaysFocusCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(255, 59, 48, 0.4)',
    elevation: 4,
  },
  todaysFocusIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  todaysFocusContent: {
    flex: 1,
  },
  todaysFocusCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  todaysFocusLessonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  todaysFocusTimeText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  insightsSection: {
    marginBottom: 24,
  },
  insightsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  insightItem: {
    marginBottom: 12,
  },
  insightText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 22,
  },
  emptyStateCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  progressEncouragementCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  progressEncouragementTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressEncouragementText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  continueSection: {
    marginBottom: 24,
  },
  continueCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  continueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  continueContent: {
    flex: 1,
  },
  continueCategoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  continueLessonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.textSecondary,
    opacity: 0.3,
  },
  templatesSection: {
    marginBottom: 32,
  },
  templatesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  templatesScroll: {
    paddingRight: 20,
  },
  templateCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 120,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  categoriesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  categoryCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  categoryProgress: {
    marginTop: 4,
  },
  categoryProgressText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  upgradePrompt: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(255, 59, 48, 0.4)',
    elevation: 4,
  },
  upgradePromptContent: {
    flex: 1,
    marginLeft: 16,
  },
  upgradePromptTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  upgradePromptText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
});
