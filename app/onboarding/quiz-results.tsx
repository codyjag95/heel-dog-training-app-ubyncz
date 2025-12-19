
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { QuizAnswer, generateRecommendation } from '@/data/quizData';
import { IconSymbol } from '@/components/IconSymbol';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

export default function QuizResultsScreen() {
  const router = useRouter();
  const { answers: answersParam } = useLocalSearchParams();
  const { dogProfile, setDogProfile, completeOnboarding, isPremiumUser, categories } = useApp();

  const answers: QuizAnswer = answersParam 
    ? JSON.parse(answersParam as string) 
    : { challenges: [], early_challenges: [], current_challenges: [] };
  const recommendation = generateRecommendation(answers);
  const isPremium = isPremiumUser();

  useEffect(() => {
    // Save quiz answers and scores to dog profile
    if (dogProfile) {
      setDogProfile({
        ...dogProfile,
        quizAnswers: answers,
        recommendedPrimaryTrack: recommendation.primaryTrack,
        recommendedSecondaryTracks: recommendation.secondaryTracks,
        immediateFocus: recommendation.immediateFocus,
        scores: recommendation.scores,
        derived: recommendation.derived,
      });
    }
  }, [dogProfile, setDogProfile, answers, recommendation]);

  const handleStartTraining = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeOnboarding();
    router.replace('/(tabs)/(home)/');
  };

  const handleUnlockPremium = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/premium');
  };

  // Get suggested lessons (3 lessons from primary track)
  const getSuggestedLessons = () => {
    const primaryCategory = categories.find(cat => cat.name === recommendation.primaryTrack);
    if (!primaryCategory) return [];
    
    // Get first 3 unlocked lessons
    return primaryCategory.lessons.filter(l => !l.isLocked && !l.isPremium).slice(0, 3);
  };

  const suggestedLessons = getSuggestedLessons();

  return (
    <View style={[commonStyles.container, styles.container]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <IconSymbol
              ios_icon_name="checkmark"
              android_material_icon_name="check"
              size={48}
              color={colors.text}
            />
          </View>
        </View>

        <Text style={styles.title}>Your Training Plan is Ready!</Text>
        <Text style={styles.subtitle}>
          Based on {dogProfile?.name}&apos;s profile, here&apos;s what we recommend
        </Text>

        {/* FREE USERS SEE: Snapshot */}
        
        {/* Energy Level */}
        {recommendation.derived && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Energy Level</Text>
            <View style={styles.snapshotCard}>
              <IconSymbol
                ios_icon_name="bolt.fill"
                android_material_icon_name="flash-on"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.snapshotValue}>{recommendation.derived.profile_energy_level}</Text>
            </View>
          </View>
        )}

        {/* Primary + Secondary Challenge */}
        {recommendation.derived && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Focus Areas</Text>
            <View style={styles.challengeCard}>
              <View style={styles.challengeRow}>
                <Text style={styles.challengeLabel}>Primary:</Text>
                <Text style={styles.challengeValue}>{recommendation.derived.primary_issue}</Text>
              </View>
              <View style={styles.challengeRow}>
                <Text style={styles.challengeLabel}>Secondary:</Text>
                <Text style={styles.challengeValue}>{recommendation.derived.secondary_issue}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Motivation Type */}
        {answers.motivation && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Motivation Type</Text>
            <View style={styles.snapshotCard}>
              <IconSymbol
                ios_icon_name="star.fill"
                android_material_icon_name="star"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.snapshotValue}>{answers.motivation}</Text>
            </View>
          </View>
        )}

        {/* Session Length Recommendation */}
        {recommendation.derived && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Recommended Session Length</Text>
            <View style={styles.snapshotCard}>
              <IconSymbol
                ios_icon_name="clock.fill"
                android_material_icon_name="schedule"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.snapshotValue}>{recommendation.derived.recommended_session_length}</Text>
            </View>
          </View>
        )}

        {/* Suggested Lessons (3 lessons) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Suggested Lessons</Text>
          <Text style={styles.sectionDescription}>Start with these to build momentum</Text>
          {suggestedLessons.map((lesson, index) => (
            <View key={index} style={styles.lessonCard}>
              <IconSymbol
                ios_icon_name="play.circle.fill"
                android_material_icon_name="play-circle-filled"
                size={24}
                color={colors.primary}
              />
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonName}>{lesson.name}</Text>
                <Text style={styles.lessonMeta}>{lesson.difficulty} • {lesson.estimatedTime}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* PREMIUM USERS SEE: Everything above PLUS roadmap, pacing, details */}
        {isPremium ? (
          <React.Fragment>
            {/* 2-4 Week Roadmap */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Your 4-Week Roadmap</Text>
              <Text style={styles.sectionDescription}>
                A structured path to build skills progressively
              </Text>

              {/* Week 1 */}
              <View style={styles.weekCard}>
                <View style={styles.weekHeader}>
                  <Text style={styles.weekTitle}>Week 1: Foundation</Text>
                  <Text style={styles.weekSubtitle}>Build core skills</Text>
                </View>
                <View style={styles.weekLessons}>
                  <Text style={styles.weekLesson}>• Sit Command</Text>
                  <Text style={styles.weekLesson}>• Eye Contact</Text>
                  <Text style={styles.weekLesson}>• Name Recognition</Text>
                </View>
              </View>

              {/* Week 2 */}
              <View style={styles.weekCard}>
                <View style={styles.weekHeader}>
                  <Text style={styles.weekTitle}>Week 2: Control</Text>
                  <Text style={styles.weekSubtitle}>Add duration and distance</Text>
                </View>
                <View style={styles.weekLessons}>
                  <Text style={styles.weekLesson}>• Stay Command</Text>
                  <Text style={styles.weekLesson}>• Down Command</Text>
                  <Text style={styles.weekLesson}>• Wait at Doors</Text>
                </View>
              </View>

              {/* Week 3 */}
              <View style={styles.weekCard}>
                <View style={styles.weekHeader}>
                  <Text style={styles.weekTitle}>Week 3: Real-World Skills</Text>
                  <Text style={styles.weekSubtitle}>Apply in daily life</Text>
                </View>
                <View style={styles.weekLessons}>
                  <Text style={styles.weekLesson}>• Loose Leash Walking</Text>
                  <Text style={styles.weekLesson}>• Leave It</Text>
                  <Text style={styles.weekLesson}>• Greeting People</Text>
                </View>
              </View>

              {/* Week 4 */}
              <View style={styles.weekCard}>
                <View style={styles.weekHeader}>
                  <Text style={styles.weekTitle}>Week 4: Refinement</Text>
                  <Text style={styles.weekSubtitle}>Polish and proof</Text>
                </View>
                <View style={styles.weekLessons}>
                  <Text style={styles.weekLesson}>• Recall Practice</Text>
                  <Text style={styles.weekLesson}>• Settle in Public</Text>
                  <Text style={styles.weekLesson}>• Advanced Stay</Text>
                </View>
              </View>
            </View>

            {/* Pacing Rules */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Pacing Guidelines</Text>
              <View style={styles.pacingCard}>
                <IconSymbol
                  ios_icon_name="lightbulb.fill"
                  android_material_icon_name="lightbulb"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.pacingText}>Focus on 1 skill per week</Text>
              </View>
              <View style={styles.pacingCard}>
                <IconSymbol
                  ios_icon_name="arrow.triangle.2.circlepath"
                  android_material_icon_name="repeat"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.pacingText}>Repeat lessons if needed—consistency beats speed</Text>
              </View>
              <View style={styles.pacingCard}>
                <IconSymbol
                  ios_icon_name="link"
                  android_material_icon_name="link"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.pacingText}>Pair Sit + Stay for best results</Text>
              </View>
            </View>

            {/* Detailed Lesson Descriptions */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Why These Lessons Matter</Text>
              
              <View style={styles.detailCard}>
                <Text style={styles.detailTitle}>Sit Command</Text>
                <Text style={styles.detailWhy}>
                  <Text style={styles.detailLabel}>Why it matters: </Text>
                  Foundation for all impulse control. A reliable sit prevents jumping, door dashing, and creates calm moments.
                </Text>
                <Text style={styles.detailSuccess}>
                  <Text style={styles.detailLabel}>Success looks like: </Text>
                  Your dog sits within 2 seconds of the cue, even with mild distractions.
                </Text>
                <Text style={styles.detailMistakes}>
                  <Text style={styles.detailLabel}>Common mistakes: </Text>
                  Repeating the command multiple times, or pushing their bottom down.
                </Text>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.detailTitle}>Stay Command</Text>
                <Text style={styles.detailWhy}>
                  <Text style={styles.detailLabel}>Why it matters: </Text>
                  Builds patience and self-control. Essential for safety at doors, vet visits, and public spaces.
                </Text>
                <Text style={styles.detailSuccess}>
                  <Text style={styles.detailLabel}>Success looks like: </Text>
                  Your dog holds position for 30+ seconds while you move around.
                </Text>
                <Text style={styles.detailMistakes}>
                  <Text style={styles.detailLabel}>Common mistakes: </Text>
                  Increasing distance too quickly, or calling them to you instead of returning to reward.
                </Text>
              </View>
            </View>

            {/* Ability to Jump Categories */}
            <View style={styles.infoCard}>
              <IconSymbol
                ios_icon_name="sparkles"
                android_material_icon_name="auto-awesome"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>Premium Benefit: </Text>
                Jump to any lesson or category without completing prior ones. Train at your own pace.
              </Text>
            </View>
          </React.Fragment>
        ) : (
          // FREE USERS: Blurred roadmap + lock + CTA
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Your Personalized Roadmap</Text>
            <View style={styles.lockedRoadmapContainer}>
              <BlurView intensity={80} style={styles.blurOverlay}>
                <View style={styles.lockedContent}>
                  <IconSymbol
                    ios_icon_name="lock.fill"
                    android_material_icon_name="lock"
                    size={48}
                    color={colors.primary}
                  />
                  <Text style={styles.lockedTitle}>Unlock Your Full Plan</Text>
                  <Text style={styles.lockedDescription}>
                    Get a 4-week roadmap, pacing rules, detailed lesson breakdowns, and the ability to jump between categories.
                  </Text>
                  <TouchableOpacity
                    style={[buttonStyles.primaryButton, styles.unlockButton]}
                    onPress={handleUnlockPremium}
                    activeOpacity={0.8}
                  >
                    <Text style={buttonStyles.primaryButtonText}>Unlock My Dog&apos;s Plan</Text>
                  </TouchableOpacity>
                </View>
              </BlurView>
              
              {/* Blurred preview content */}
              <View style={styles.blurredPreview}>
                <View style={styles.weekCard}>
                  <View style={styles.weekHeader}>
                    <Text style={styles.weekTitle}>Week 1: Foundation</Text>
                    <Text style={styles.weekSubtitle}>Build core skills</Text>
                  </View>
                </View>
                <View style={styles.weekCard}>
                  <View style={styles.weekHeader}>
                    <Text style={styles.weekTitle}>Week 2: Control</Text>
                    <Text style={styles.weekSubtitle}>Add duration</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            You can always explore other training categories at your own pace. This is just a starting point!
          </Text>
        </View>
      </ScrollView>

      {/* Start Training Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[buttonStyles.primaryButton, styles.button]}
          onPress={handleStartTraining}
          activeOpacity={0.8}
        >
          <Text style={buttonStyles.primaryButtonText}>Start Training</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  snapshotCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  snapshotValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  challengeCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  challengeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  challengeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },
  lessonCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  lessonMeta: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  weekCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  weekHeader: {
    marginBottom: 12,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  weekSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  weekLessons: {
    gap: 6,
  },
  weekLesson: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 22,
  },
  pacingCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  pacingText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  detailCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  detailWhy: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  detailSuccess: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  detailMistakes: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 20,
  },
  detailLabel: {
    fontWeight: '700',
    color: colors.primary,
  },
  lockedRoadmapContainer: {
    position: 'relative',
    minHeight: 300,
    borderRadius: 16,
    overflow: 'hidden',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lockedContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    padding: 32,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  lockedDescription: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  unlockButton: {
    paddingHorizontal: 32,
  },
  blurredPreview: {
    opacity: 0.3,
  },
  infoCard: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: '700',
    color: colors.primary,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  button: {
    width: '100%',
  },
});
