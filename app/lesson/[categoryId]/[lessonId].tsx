import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '../../../contexts/AppContext';
import { getLessonById } from '../../../data/categoryData';
import { colors, typography, spacing } from '../../../data/darkTheme';
import { Ionicons } from '@expo/vector-icons';
import FloatingTimer from '../../../components/FloatingTimer';

export default function LessonDetailScreen() {
  const router = useRouter();
  const { categoryId, lessonId } = useLocalSearchParams<{ categoryId: string; lessonId: string }>();
  const { markLessonComplete, isLessonComplete } = useApp();

  const lesson = getLessonById(categoryId!, lessonId!);
  if (!lesson) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Lesson not found</Text>
      </View>
    );
  }

  const isComplete = isLessonComplete(categoryId!, lessonId!);

  const handleComplete = () => {
    markLessonComplete(categoryId!, lessonId!);
    router.back();
  };

  // Use lesson's videoUrl (which contains old imageUrl) or fallback
  const imageUrl = lesson.videoUrl || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80';

  return (
    <View style={styles.container}>
      {/* Header styled by root _layout.tsx — no override needed */}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <Image
          source={{ uri: imageUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        />

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
          <View style={styles.completeMessage}>
            <Text style={styles.completeMessageText}>Lesson Complete!</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Mark as Complete</Text>
          </TouchableOpacity>
        )}
      </View>
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

  // Hero Image
  heroImage: {
    width: '100%',
    height: 300,
    backgroundColor: colors.cardBackground,
  },

  // Header Section
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
  metaIcon: {
    fontSize: 16,
  },
  metaText: {
    fontSize: typography.small,
    color: colors.textPrimary,
    fontWeight: typography.medium,
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
  sectionIcon: {
    fontSize: 24,
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
    color: colors.textPrimary,
  },
  completeMessage: {
    backgroundColor: colors.success,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeMessageText: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
});
