import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getCategoryById } from '../../data/categoryData';
import { colors, typography, spacing } from '../../data/darkTheme';
import { Ionicons } from '@expo/vector-icons';

export default function SessionCompleteScreen() {
  const router = useRouter();
  const { categoryId, lessonsCompleted, totalTime } = useLocalSearchParams<{
    categoryId: string;
    lessonsCompleted: string;
    totalTime: string;
  }>();

  const category = getCategoryById(categoryId!);
  const completed = parseInt(lessonsCompleted!);
  const timeInSeconds = parseInt(totalTime!);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins} min ${secs} sec`;
    }
    return `${secs} sec`;
  };

  const getEncouragingMessage = () => {
    if (completed >= 5) return "Outstanding dedication!";
    if (completed >= 3) return "Excellent work!";
    if (completed >= 2) return "Great session!";
    return "Nice job!";
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Celebration */}
        <View style={styles.celebration}>
          <Ionicons name="trophy" size={80} color={colors.accent} style={{ marginBottom: spacing.lg }} />
          <Text style={styles.celebrationTitle}>Session Complete!</Text>
          <Text style={styles.celebrationSubtitle}>{getEncouragingMessage()}</Text>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Session Stats</Text>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Ionicons name="book" size={32} color={colors.accent} style={{ marginBottom: spacing.sm }} />
              <Text style={styles.statValue}>{completed}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Ionicons name="time" size={32} color={colors.accent} style={{ marginBottom: spacing.sm }} />
              <Text style={styles.statValue}>{formatTime(timeInSeconds)}</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Ionicons name="flag" size={32} color={colors.accent} style={{ marginBottom: spacing.sm }} />
              <Text style={styles.statValue}>{category?.title || 'Training'}</Text>
              <Text style={styles.statLabel}>Category</Text>
            </View>
          </View>
        </View>

        {/* Impact Message */}
        <View style={styles.impactCard}>
          <Ionicons name="bulb" size={32} color={colors.accent} style={{ marginBottom: spacing.sm }} />
          <Text style={styles.impactTitle}>Keep Building Consistency</Text>
          <Text style={styles.impactText}>
            Every training session strengthens your bond and improves communication. The more consistent you are, the faster you'll see results!
          </Text>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Post-Session Tips:</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Let your dog decompress for 10-15 minutes
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Provide fresh water and a quiet space to rest
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Mental work is just as tiring as physical exercise
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace(`/category/${categoryId}`)}
        >
          <Text style={styles.secondaryButtonText}>Back to Category</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.primaryButtonText}>Done</Text>
        </TouchableOpacity>
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
    padding: spacing.lg,
  },

  // Celebration
  celebration: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  celebrationIcon: {
    fontSize: 100,
    marginBottom: spacing.lg,
  },
  celebrationTitle: {
    fontSize: typography.h1,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  celebrationSubtitle: {
    fontSize: typography.h3,
    color: colors.accent,
    fontWeight: typography.semibold,
  },

  // Stats Card
  statsCard: {
    backgroundColor: colors.cardBackground,
    padding: spacing.xl,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  statsTitle: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.h2,
    fontWeight: typography.bold,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },

  // Impact Card
  impactCard: {
    backgroundColor: colors.cardBackgroundSecondary,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  impactIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  impactTitle: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  impactText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  // Tips Card
  tipsCard: {
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  tipsList: {
    gap: spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: typography.body,
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

  // Bottom Actions
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.accent,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
});
