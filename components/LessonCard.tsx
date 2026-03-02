/**
 * Lesson Card Component with Premium Lock
 * 
 * Shows lesson with:
 * - Lock overlay if premium and not unlocked
 * - Premium badge
 * - Checkmark if completed
 * - Icon for lesson type
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PremiumLock from './PremiumLock';
import { colors, typography, spacing } from '../data/darkTheme';

type LessonCardProps = {
  lesson: {
    id: string;
    title: string;
    description: string;
    duration: number;
    difficulty: number;
    isPremium?: boolean;
  };
  isCompleted: boolean;
  isLocked: boolean;
  onPress: () => void;
  onUnlockPress?: () => void;
};

export default function LessonCard({
  lesson,
  isCompleted,
  isLocked,
  onPress,
  onUnlockPress,
}: LessonCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isLocked && styles.cardLocked,
        isCompleted && styles.cardCompleted,
      ]}
      onPress={isLocked ? undefined : onPress}
      activeOpacity={isLocked ? 1 : 0.7}
    >
      {/* Lock Overlay */}
      <PremiumLock 
        isLocked={isLocked}
        onUnlockPress={onUnlockPress}
        compact
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {isCompleted ? (
            <Ionicons name="checkmark-circle" size={24} color={colors.accent} />
          ) : (
            <Ionicons name="play-circle-outline" size={24} color={colors.textSecondary} />
          )}
        </View>

        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, isLocked && styles.titleLocked]} numberOfLines={1}>
              {lesson.title}
            </Text>
            {lesson.isPremium && !isLocked && (
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={10} color={colors.textPrimary} />
                <Text style={styles.premiumText}>PRO</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={[styles.description, isLocked && styles.descriptionLocked]} numberOfLines={2}>
        {lesson.description}
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.meta}>
          <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
          <Text style={styles.metaText}>{lesson.duration} min</Text>
        </View>

        <View style={styles.meta}>
          <Ionicons name="bar-chart-outline" size={14} color={colors.textTertiary} />
          <Text style={styles.metaText}>
            Level {lesson.difficulty}
          </Text>
        </View>

        {!isLocked && (
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.textTertiary}
            style={styles.chevron}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    position: 'relative',
  },
  cardLocked: {
    opacity: 0.6,
  },
  cardCompleted: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.cardBackgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  titleLocked: {
    color: colors.textSecondary,
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
  premiumText: {
    fontSize: 9,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  descriptionLocked: {
    color: colors.textTertiary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: typography.small,
    color: colors.textTertiary,
  },
  chevron: {
    marginLeft: 'auto',
  },
});
