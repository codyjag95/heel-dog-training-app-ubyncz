import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../contexts/AppContext';
import { CHALLENGE_LABELS } from '../data/quizData_v2';
import { getBreedInsight, getBreedById, getTrainingTipsForBreed } from '../data/breedDatabase';
import { CATEGORIES } from '../data/categoryData';
import { colors, typography, spacing } from '../data/darkTheme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function QuizResultsScreen() {
  const router = useRouter();
  const { userProfile, hasPremium, isLessonComplete } = useApp();
  const [insightExpanded, setInsightExpanded] = useState(false);

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="paw" size={64} color={colors.accent} style={{ marginBottom: spacing.lg }} />
          <Text style={styles.errorTitle}>Welcome to HEEL</Text>
          <Text style={styles.errorText}>Take the quiz to get your personalized training plan</Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => router.replace('/(tabs)/quiz')}>
            <Text style={styles.ctaBtnText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const {
    dogName, breed, breedId, energyLevel, experience,
    challenges, q9Challenges, recommendedCategories,
  } = userProfile;

  const breedInsightText = breedId
    ? getBreedInsight(breedId, dogName)
    : getBreedInsight('mixed_breed', dogName);
  const breedTips = breedId ? getTrainingTipsForBreed(breedId) : [];
  const breedData = breedId ? getBreedById(breedId) : null;
  const allChallenges = [...new Set([...(q9Challenges || []), ...(challenges || [])])];
  const insightPreview = breedInsightText.split('.')[0] + '.';
  const availabilityDisplay = (userProfile as any).availabilityLabel || `${userProfile.availability} minutes`;

  const toggleInsight = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setInsightExpanded(!insightExpanded);
  };

  // ── Category info map ──
  const catInfo: { [k: string]: { name: string; icon: string; desc: string } } = {
    'everyday_obedience': { name: 'Obedience', icon: 'school-outline', desc: 'Foundation commands' },
    'potty_training': { name: 'Potty', icon: 'home-outline', desc: 'House training' },
    'biting_nipping': { name: 'Biting', icon: 'alert-circle-outline', desc: 'Bite inhibition' },
    'leash_walks': { name: 'Leash', icon: 'walk-outline', desc: 'Walking skills' },
    'calm_focus': { name: 'Calm', icon: 'heart-outline', desc: 'Impulse control' },
    'recall': { name: 'Recall', icon: 'megaphone-outline', desc: 'Come when called' },
    'mental_work': { name: 'Mental', icon: 'bulb-outline', desc: 'Brain games' },
    'real_world_proofing': { name: 'Proofing', icon: 'earth-outline', desc: 'Real-world skills' },
    'service_dog': { name: 'Service', icon: 'shield-outline', desc: 'Service prep' },
    'handler_skills': { name: 'Handler', icon: 'people-outline', desc: 'Your skills' },
    'tricks': { name: 'Tricks', icon: 'star-outline', desc: 'Fun tricks' },
    'socialization': { name: 'Social', icon: 'people-outline', desc: 'Confidence building' },
    'reactive_dog': { name: 'Reactive', icon: 'flash-outline', desc: 'Reactivity help' },
    'cooperative_care': { name: 'Care', icon: 'medical-outline', desc: 'Grooming & handling' },
  };

  const topPriorities = recommendedCategories.slice(0, 3);

  // ── Get real lessons for Week 1 (free path) ──
  const getWeek1Lessons = () => {
    const lessons: { title: string; category: string; duration: number; categoryId: string; lessonId: string }[] = [];
    const usedIds = new Set<string>();

    for (const catId of recommendedCategories) {
      const category = CATEGORIES.find(c => c.id === catId);
      if (!category) continue;
      for (const lesson of category.lessons) {
        if (usedIds.has(lesson.id)) continue;
        if (lesson.isPremium && !hasPremium) continue;
        lessons.push({
          title: lesson.title,
          category: category.title,
          duration: lesson.duration,
          categoryId: catId,
          lessonId: lesson.id,
        });
        usedIds.add(lesson.id);
        if (lessons.length >= 5) return lessons;
      }
    }
    return lessons;
  };

  // ── Get "locked" lessons for fade tease ──
  const getTeaseLessons = () => {
    const teaseNames = [
      'Advanced obedience & reliability',
      'Real-world distractions & proofing',
      'Structured weekly progression',
      'Breed-specific training modifications',
    ];
    return teaseNames;
  };

  const week1Lessons = getWeek1Lessons();
  const teaseLessons = getTeaseLessons();

  const getHumanChallenges = (): string => {
    if (allChallenges.length === 0) return 'building a strong foundation';
    const readable = allChallenges
      .filter(c => !c.startsWith('goal_'))
      .map(c => CHALLENGE_LABELS[c] || c)
      .slice(0, 3);
    return readable.length > 0 ? readable.join(', ') : 'building a strong foundation';
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {/* ═══════════════════════════════════════════════════
            PHASE 1: THE REWARD
            ═══════════════════════════════════════════════════ */}

        <View style={styles.successBadge}>
          <Ionicons name="checkmark" size={40} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>{dogName}'s Training Plan{'\n'}is Ready!</Text>

        {/* Top 3 Priorities — side by side */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOUR TOP PRIORITIES</Text>
          <View style={styles.priorityRow}>
            {topPriorities.map((catId, index) => {
              const info = catInfo[catId] || { name: catId, icon: 'paw-outline', desc: '' };
              return (
                <View key={catId} style={[styles.priorityCard, index === 0 && styles.priorityCardFirst]}>
                  <View style={[styles.priorityNumber, index === 0 && styles.priorityNumberFirst]}>
                    <Text style={styles.priorityNumberText}>{index + 1}</Text>
                  </View>
                  <Ionicons name={info.icon as any} size={24} color={index === 0 ? colors.accent : colors.textSecondary} />
                  <Text style={[styles.priorityName, index === 0 && styles.priorityNameFirst]}>{info.name}</Text>
                  <Text style={styles.priorityDesc}>{info.desc}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Understanding [Dog] — collapsed */}
        <TouchableOpacity style={styles.insightCard} onPress={toggleInsight} activeOpacity={0.8}>
          <View style={styles.insightHeader}>
            <View style={styles.insightTitleRow}>
              <Ionicons name="paw" size={18} color={colors.accent} />
              <Text style={styles.insightTitle}>Understanding {dogName}</Text>
            </View>
            <Ionicons name={insightExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.accent} />
          </View>
          {insightExpanded ? (
            <View>
              <Text style={styles.insightText}>{breedInsightText}</Text>
              {breedTips.length > 0 && (
                <View style={styles.tipsContainer}>
                  <Text style={styles.tipsTitle}>Training Tips for {breed}</Text>
                  {breedTips.slice(0, 3).map((tip, i) => (
                    <View key={i} style={styles.tipRow}>
                      <Ionicons name="checkmark-circle" size={14} color={colors.accent} style={{ marginTop: 3 }} />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}
              {breedData && (
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Energy</Text>
                    <Text style={styles.statValue}>{breedData.energy.replace('_', ' ')}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Size</Text>
                    <Text style={styles.statValue}>{breedData.size}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Exercise</Text>
                    <Text style={styles.statValue}>{breedData.exerciseNeeds.split('—')[0].trim()}</Text>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.insightPreview} numberOfLines={2}>{insightPreview}</Text>
          )}
        </TouchableOpacity>

        {/* ═══════════════════════════════════════════════════
            PHASE 2: THE FREE PATH
            ═══════════════════════════════════════════════════ */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>START HERE</Text>
          <Text style={styles.sectionSubtitle}>These lessons create early wins and build trust.</Text>

          {week1Lessons.map((lesson, index) => {
            const completed = isLessonComplete(lesson.categoryId, lesson.lessonId);
            return (
              <TouchableOpacity
                key={`${lesson.categoryId}_${lesson.lessonId}`}
                style={[styles.lessonRow, completed && styles.lessonRowComplete]}
                onPress={() => router.push(`/lesson/${lesson.categoryId}/${lesson.lessonId}`)}
                activeOpacity={0.7}
              >
                <View style={[styles.lessonCheck, completed && styles.lessonCheckComplete]}>
                  {completed ? (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  ) : (
                    <View style={styles.lessonCheckInner} />
                  )}
                </View>
                <View style={styles.lessonInfo}>
                  <Text style={[styles.lessonTitle, completed && styles.lessonTitleComplete]}>{lesson.title}</Text>
                  <Text style={styles.lessonMeta}>{lesson.category} · {lesson.duration} min</Text>
                </View>
                {!completed && <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />}
                {completed && <Ionicons name="checkmark-circle" size={20} color={colors.accent} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ═══════════════════════════════════════════════════
            PHASE 3: COMING UP NEXT
            ═══════════════════════════════════════════════════ */}

        {hasPremium ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>COMING UP NEXT</Text>
            <Text style={styles.sectionSubtitle}>Your full training roadmap is unlocked.</Text>
            {teaseLessons.map((name, index) => (
              <View key={index} style={styles.lessonRow}>
                <View style={styles.lessonCheck}>
                  <Ionicons name="checkmark-circle-outline" size={14} color={colors.accent} />
                </View>
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{name}</Text>
                  <Text style={styles.lessonMeta}>Weeks 2-4</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.fadeSection}>
            {/* Fading lesson rows */}
            <View style={styles.fadeContent}>
              {teaseLessons.map((name, index) => (
                <View key={index} style={[styles.lessonRow, { opacity: index === 0 ? 0.6 : index === 1 ? 0.35 : index === 2 ? 0.15 : 0.05 }]}>
                  <View style={styles.lessonCheck}>
                    <Ionicons name="lock-closed" size={10} color={colors.textTertiary} />
                  </View>
                  <View style={styles.lessonInfo}>
                    <Text style={styles.lessonTitle}>{name}</Text>
                    <Text style={styles.lessonMeta}>Premium · Weeks 2-4</Text>
                  </View>
                </View>
              ))}

              {/* Gradient overlay */}
              <LinearGradient
                colors={['rgba(0,0,0,0)', colors.background]}
                style={styles.fadeGradient}
                pointerEvents="none"
              />
            </View>

            {/* Premium tease — centered over fade */}
            <View style={styles.teaseCenter}>
              <Text style={styles.teaseLine1}>Your full training roadmap{'\n'}continues here.</Text>
              <Text style={styles.teaseLine2}>
                Premium turns individual lessons into a complete, structured training program.
              </Text>
              <TouchableOpacity
                style={styles.teaseButton}
                onPress={() => router.push('/(tabs)/premium')}
                activeOpacity={0.8}
              >
                <Text style={styles.teaseButtonText}>Unlock Full Plan</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.teaseSubtext}>Free lessons are always free. Upgrade when you're ready.</Text>
            </View>
          </View>
        )}

        {/* ═══════════════════════════════════════════════════
            PHASE 4: THE SAFETY NET
            ═══════════════════════════════════════════════════ */}

        {/* Why This Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WHY THIS PLAN?</Text>
          <View style={styles.whyCard}>
            <WhyPoint text={`Tailored to ${breed} temperament and energy`} />
            <WhyPoint text={`Addresses: ${getHumanChallenges()}`} />
            <WhyPoint text={`Fits your ${availabilityDisplay} daily commitment`} />
            <WhyPoint text={`Uses ${userProfile.motivationType === 'mixed' ? 'a mix of rewards' : userProfile.motivationType} as primary reward`} />
          </View>
        </View>

        {/* Start Training */}
        <TouchableOpacity style={styles.startButton} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.startButtonText}>Start {dogName}'s Training</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Subtle bottom note */}
        {!hasPremium && (
          <Text style={styles.bottomNote}>Upgrade anytime in the Premium tab.</Text>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function WhyPoint({ text }: { text: string }) {
  return (
    <View style={styles.whyRow}>
      <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
      <Text style={styles.whyText}>{text}</Text>
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

  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxxl },
  errorTitle: { fontSize: typography.h1, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: spacing.sm },
  errorText: { fontSize: typography.body, color: colors.textSecondary, marginBottom: spacing.xl, textAlign: 'center' },

  // ── Success ──
  successBadge: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.accent,
    alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.h1, fontWeight: typography.bold, color: colors.textPrimary,
    textAlign: 'center', marginBottom: spacing.xl, lineHeight: 36,
  },

  // ── Sections ──
  section: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: typography.h4, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: spacing.sm, letterSpacing: 1 },
  sectionSubtitle: { fontSize: typography.small, color: colors.textSecondary, marginBottom: spacing.lg },

  // ── Priority Cards ──
  priorityRow: { flexDirection: 'row', gap: spacing.sm },
  priorityCard: {
    flex: 1, backgroundColor: colors.cardBackground, padding: spacing.md,
    borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.border, gap: 6,
  },
  priorityCardFirst: { borderColor: colors.accent, borderWidth: 2 },
  priorityNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  priorityNumberFirst: { backgroundColor: colors.accent },
  priorityNumberText: { fontSize: 12, fontWeight: typography.bold, color: '#FFFFFF' },
  priorityName: { fontSize: 14, fontWeight: typography.bold, color: colors.textPrimary, textAlign: 'center' },
  priorityNameFirst: { color: colors.accent },
  priorityDesc: { fontSize: 11, color: colors.textSecondary, textAlign: 'center' },

  // ── Insight Card ──
  insightCard: {
    backgroundColor: colors.cardBackground, padding: spacing.lg, borderRadius: 16,
    marginBottom: spacing.xl, borderWidth: 2, borderColor: colors.accent,
  },
  insightHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  insightTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  insightTitle: { fontSize: typography.h3, fontWeight: typography.bold, color: colors.accent },
  insightText: { fontSize: typography.body, color: colors.textPrimary, lineHeight: 24, marginTop: spacing.md },
  insightPreview: { fontSize: typography.small, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 20 },
  tipsContainer: { marginTop: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  tipsTitle: { fontSize: typography.h4, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: spacing.md },
  tipRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  tipText: { flex: 1, fontSize: typography.small, color: colors.textSecondary, lineHeight: 20 },
  statsRow: { flexDirection: 'row', marginTop: spacing.lg, gap: spacing.sm },
  statBox: { flex: 1, backgroundColor: colors.cardBackgroundSecondary || colors.background, padding: spacing.md, borderRadius: 10, alignItems: 'center' },
  statLabel: { fontSize: 11, color: colors.textTertiary, fontWeight: typography.semibold, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: typography.small, color: colors.textPrimary, fontWeight: typography.bold, textTransform: 'capitalize' },

  // ── Lesson Rows (free path) ──
  lessonRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBackground,
    padding: spacing.md, borderRadius: 10, marginBottom: spacing.sm,
  },
  lessonCheck: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2,
    borderColor: colors.border, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md,
  },
  lessonCheckInner: { width: 0, height: 0 },
  lessonCheckComplete: { backgroundColor: colors.accent, borderColor: colors.accent },
  lessonRowComplete: { opacity: 0.7 },
  lessonTitleComplete: { textDecorationLine: 'line-through', color: colors.textSecondary },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: typography.body, fontWeight: typography.semibold, color: colors.textPrimary, marginBottom: 2 },
  lessonMeta: { fontSize: 12, color: colors.textSecondary },

  // ── Fade Tease ──
  fadeSection: { marginBottom: spacing.xl },
  fadeContent: { position: 'relative', overflow: 'hidden' },
  fadeGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
  teaseCenter: { alignItems: 'center', paddingTop: spacing.lg, paddingBottom: spacing.md },
  teaseLine1: {
    fontSize: 22, fontWeight: '700', color: '#FFFFFF', textAlign: 'center',
    lineHeight: 30, marginBottom: spacing.md,
  },
  teaseLine2: {
    fontSize: typography.body, color: colors.textSecondary, textAlign: 'center',
    lineHeight: 22, marginBottom: spacing.lg, paddingHorizontal: spacing.md,
  },
  teaseButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    backgroundColor: colors.accent, paddingVertical: 14, paddingHorizontal: spacing.xxl,
    borderRadius: 12,
  },
  teaseButtonText: { fontSize: typography.h4, fontWeight: typography.bold, color: '#FFFFFF' },
  teaseSubtext: { fontSize: typography.small, color: colors.textTertiary, marginTop: spacing.md, textAlign: 'center' },

  // ── Why Card ──
  whyCard: { backgroundColor: colors.cardBackground, padding: spacing.lg, borderRadius: 12, gap: spacing.md },
  whyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  whyText: { flex: 1, fontSize: typography.body, color: colors.textPrimary, lineHeight: 24 },

  // ── Buttons ──
  startButton: {
    backgroundColor: colors.accent, padding: spacing.lg, borderRadius: 16,
    alignItems: 'center', marginTop: spacing.md,
    flexDirection: 'row', justifyContent: 'center', gap: spacing.sm,
  },
  startButtonText: { fontSize: typography.h3, fontWeight: typography.bold, color: '#FFFFFF' },
  ctaBtn: { backgroundColor: colors.accent, paddingHorizontal: spacing.xxxl, paddingVertical: spacing.lg, borderRadius: 12 },
  ctaBtnText: { fontSize: typography.h4, fontWeight: typography.bold, color: '#FFFFFF' },
  bottomNote: { fontSize: typography.small, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.lg },
});
