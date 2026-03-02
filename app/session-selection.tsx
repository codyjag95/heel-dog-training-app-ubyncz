import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryById } from '../data/categoryData';
import { CATEGORY_ICONS } from '../data/iconSystem';
import { useApp } from '../contexts/AppContext';
import { colors, typography, spacing } from '../data/darkTheme';

export default function SessionSelectionScreen() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { hasPremium } = useApp();
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);

  const category = getCategoryById(categoryId!);

  if (!category) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
          <Text style={styles.errorText}>Category not found</Text>
        </View>
      </View>
    );
  }

  const toggleLesson = (lessonId: string) => {
    setSelectedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const startSession = () => {
    if (selectedLessons.length === 0) {
      Alert.alert('No Lessons Selected', 'Please select at least one lesson for your session.');
      return;
    }

    // FIX: Corrected path from '/session/active' to '/session/session-active'
    router.push({
      pathname: '/session/session-active',
      params: {
        categoryId: categoryId!,
        lessonIds: JSON.stringify(selectedLessons),
      },
    });
  };

  const totalDuration = category.lessons
    .filter(lesson => selectedLessons.includes(lesson.id))
    .reduce((sum, lesson) => sum + lesson.duration, 0);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={CATEGORY_ICONS[categoryId!] || 'paw'} 
              size={40} 
              color={colors.accent} 
            />
          </View>
          <Text style={styles.title}>Start Training Session</Text>
          <Text style={styles.subtitle}>
            Select the lessons you want to practice in this session
          </Text>
        </View>

        {/* Session Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Lessons selected:</Text>
            <Text style={styles.infoValue}>{selectedLessons.length}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total time:</Text>
            <Text style={styles.infoValue}>{totalDuration} min</Text>
          </View>
        </View>

        {/* Lesson Selection */}
        <Text style={styles.sectionTitle}>Available Lessons</Text>
        {category.lessons.map((lesson, index) => {
          const isSelected = selectedLessons.includes(lesson.id);
          const selectionOrder = selectedLessons.indexOf(lesson.id) + 1;
          
          // Check if lesson is locked (premium)
          const isLocked = (() => {
            if (category.isPremium) {
              return lesson.isPremium !== false && !hasPremium;
            }
            return lesson.isPremium === true && !hasPremium;
          })();

          return (
            <TouchableOpacity
              key={lesson.id}
              style={[
                styles.lessonCard, 
                isSelected && styles.lessonCardSelected,
                isLocked && styles.lessonCardLocked,
              ]}
              onPress={() => {
                if (isLocked) {
                  Alert.alert('Premium Lesson', 'Upgrade to Premium to include this lesson in your session.');
                } else {
                  toggleLesson(lesson.id);
                }
              }}
            >
              <View style={styles.checkbox}>
                {isLocked ? (
                  <View style={styles.lockedCircle}>
                    <Ionicons name="lock-closed" size={14} color={colors.textTertiary} />
                  </View>
                ) : isSelected ? (
                  <View style={styles.selectedCircle}>
                    <Text style={styles.selectedNumber}>{selectionOrder}</Text>
                  </View>
                ) : (
                  <View style={styles.checkboxEmpty} />
                )}
              </View>

              <View style={styles.lessonInfo}>
                <Text style={[styles.lessonTitle, isLocked && styles.lockedText]}>
                  {lesson.title}
                </Text>
                <Text style={[styles.lessonDescription, isLocked && styles.lockedText]} numberOfLines={1}>
                  {lesson.description}
                </Text>
                <View style={styles.lessonMeta}>
                  <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                  <Text style={styles.metaText}>{lesson.duration} min</Text>
                  <Text style={styles.metaText}>·</Text>
                  <Ionicons name="bar-chart-outline" size={12} color={colors.textTertiary} />
                  <Text style={styles.metaText}>Level {lesson.difficulty}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Start Session Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.startButton, selectedLessons.length === 0 && styles.startButtonDisabled]}
          onPress={startSession}
          disabled={selectedLessons.length === 0}
        >
          <Ionicons name="play" size={20} color={colors.textPrimary} />
          <Text style={styles.startButtonText}>
            {selectedLessons.length > 0
              ? `Start Session (${selectedLessons.length} lessons, ${totalDuration} min)`
              : 'Select lessons to begin'}
          </Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.h3,
    textAlign: 'center',
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
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
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Info Card
  infoCard: {
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: typography.body,
    fontWeight: typography.bold,
    color: colors.accent,
  },

  // Section
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  // Lesson Card
  lessonCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  lessonCardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.cardBackgroundSecondary,
  },
  lessonCardLocked: {
    opacity: 0.5,
  },
  checkbox: {
    width: 32,
    height: 32,
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxEmpty: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.textTertiary,
  },
  selectedCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedNumber: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  lockedCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: typography.h4,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  lessonDescription: {
    fontSize: typography.small,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
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
  startButton: {
    backgroundColor: colors.accent,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  startButtonDisabled: {
    backgroundColor: colors.cardBackground,
    opacity: 0.5,
  },
  startButtonText: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
});
