import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { getCategoryById } from '../../data/categoryData';
import { colors, typography, spacing } from '../../data/darkTheme';
import { CATEGORY_ICONS } from '../../data/iconSystem';

export default function CategoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLessonComplete, getCategoryProgress, hasPremium } = useApp();

  const category = getCategoryById(id!);
  if (!category) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Category not found</Text>
      </View>
    );
  }

  const { completed, total } = getCategoryProgress(id!);
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={CATEGORY_ICONS[id!] || 'book'}
              size={48}
              color={colors.accent}
            />
          </View>
          <Text style={styles.title}>{category.title}</Text>
          <Text style={styles.description}>{category.description}</Text>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              {completed} / {total} lessons
            </Text>
            <Text style={styles.progressPercent}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* Start Session Button */}
        <TouchableOpacity
          style={styles.sessionButton}
          onPress={() => router.push(`/session-selection?categoryId=${id}`)}
        >
          <Ionicons name="fitness" size={28} color={colors.textPrimary} />
          <View style={styles.sessionButtonTextContainer}>
            <Text style={styles.sessionButtonTitle}>Start Training Session</Text>
            <Text style={styles.sessionButtonSubtitle}>Practice multiple lessons in one go</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Lessons */}
        <Text style={styles.sectionTitle}>Lessons</Text>
        {category.lessons.map((lesson, index) => {
          const isComplete = isLessonComplete(id!, lesson.id);
          
          const isLocked = (() => {
            if (category.isPremium) {
              return lesson.isPremium !== false && !hasPremium;
            }
            return lesson.isPremium === true && !hasPremium;
          })();
          
          const showProBadge = isLocked;
          const showFreeBadge = category.isPremium && lesson.isPremium === false;

          return (
            <TouchableOpacity
              key={lesson.id}
              style={[
                styles.lessonCard,
                isComplete && styles.lessonCardComplete,
                isLocked && styles.lessonCardLocked,
              ]}
              onPress={() => {
                if (isLocked) {
                  router.push('/(tabs)/premium');
                } else {
                  router.push(`/lesson/${id}/${lesson.id}`);
                }
              }}
            >
              <View style={[
                styles.lessonNumber,
                isComplete && styles.lessonNumberComplete,
              ]}>
                {isComplete ? (
                  <Ionicons name="checkmark-circle" size={24} color={colors.accent} />
                ) : isLocked ? (
                  <Ionicons name="lock-closed" size={20} color={colors.textTertiary} />
                ) : (
                  <Text style={styles.numberText}>{index + 1}</Text>
                )}
              </View>

              <View style={styles.lessonInfo}>
                <View style={styles.lessonTitleRow}>
                  <Text style={[styles.lessonTitle, isLocked && styles.lockedText]}>
                    {lesson.title}
                  </Text>
                  {showProBadge && (
                    <View style={styles.premiumBadge}>
                      <Ionicons name="lock-closed" size={10} color={colors.textPrimary} />
                      <Text style={styles.premiumBadgeText}>PRO</Text>
                    </View>
                  )}
                  {showFreeBadge && !hasPremium && (
                    <View style={styles.freeBadge}>
                      <Ionicons name="checkmark-circle" size={10} color="#4CAF50" />
                      <Text style={styles.freeBadgeText}>FREE</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.lessonDescription, isLocked && styles.lockedText]}>
                  {lesson.description}
                </Text>
                <View style={styles.lessonMeta}>
                  <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                  <Text style={styles.metaText}>{lesson.duration} min</Text>
                  <Text style={styles.metaText}>•</Text>
                  <Ionicons name="bar-chart-outline" size={12} color={colors.textTertiary} />
                  <Text style={styles.metaText}>Level {lesson.difficulty}</Text>
                </View>
              </View>

              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={colors.textTertiary} 
              />
            </TouchableOpacity>
          );
        })}

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
    paddingTop: spacing.md,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  progressContainer: {
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressText: {
    fontSize: typography.body,
    color: colors.textPrimary,
    fontWeight: typography.medium,
  },
  progressPercent: {
    fontSize: typography.body,
    color: colors.accent,
    fontWeight: typography.bold,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  sessionButton: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  sessionButtonTextContainer: {
    flex: 1,
  },
  sessionButtonTitle: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  sessionButtonSubtitle: {
    fontSize: typography.small,
    color: colors.textPrimary,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: typography.h2,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  lessonCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.md,
    alignItems: 'center',
    gap: spacing.md,
  },
  lessonCardComplete: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  lessonCardLocked: {
    opacity: 0.6,
  },
  lessonNumber: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.cardBackgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonNumberComplete: {
    backgroundColor: 'transparent',
  },
  numberText: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  lessonTitle: {
    fontSize: typography.h4,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  premiumBadgeText: {
    fontSize: 9,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#1B5E20',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  freeBadgeText: {
    fontSize: 9,
    fontWeight: typography.bold,
    color: '#4CAF50',
    letterSpacing: 0.5,
  },
  lessonDescription: {
    fontSize: typography.small,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: typography.tiny,
    color: colors.textTertiary,
  },
  lockedText: {
    opacity: 0.7,
  },
});
