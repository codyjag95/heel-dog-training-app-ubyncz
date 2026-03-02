import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import { getLessonById } from '../../data/categoryData';
import { colors, typography, spacing } from '../../data/darkTheme';
import { Ionicons } from '@expo/vector-icons';

export default function ActiveSessionScreen() {
  const router = useRouter();
  const { categoryId, lessonIds } = useLocalSearchParams<{ categoryId: string; lessonIds: string }>();
  const { markLessonComplete } = useApp();

  const lessons = JSON.parse(lessonIds!);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [sessionTimeElapsed, setSessionTimeElapsed] = useState(0);
  const [isSessionPaused, setIsSessionPaused] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentLessonId = lessons[currentLessonIndex];
  const currentLesson = getLessonById(categoryId!, currentLessonId);

  // Session timer
  useEffect(() => {
    if (!isSessionPaused) {
      intervalRef.current = setInterval(() => {
        setSessionTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSessionPaused]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompleteLesson = () => {
    // Mark lesson as complete in app
    markLessonComplete(categoryId!, currentLessonId);
    
    // Add to session completed list
    setCompletedLessons(prev => [...prev, currentLessonId]);

    // Move to next lesson or end session
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
    } else {
      // Session complete!
      router.replace({
        pathname: '/session/session-complete',
        params: {
          categoryId: categoryId!,
          lessonsCompleted: lessons.length,
          totalTime: sessionTimeElapsed,
        },
      });
    }
  };

  const handleSkipLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
    } else {
      endSession();
    }
  };

  const endSession = () => {
    Alert.alert(
      'End Session?',
      'Are you sure you want to end this training session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => {
            router.replace({
              pathname: '/session/session-complete',
              params: {
                categoryId: categoryId!,
                lessonsCompleted: completedLessons.length,
                totalTime: sessionTimeElapsed,
              },
            });
          },
        },
      ]
    );
  };

  if (!currentLesson) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Lesson not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Session Header */}
      <View style={styles.sessionHeader}>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionProgress}>
            Lesson {currentLessonIndex + 1} of {lessons.length}
          </Text>
          <Text style={styles.sessionTimer}>{formatTime(sessionTimeElapsed)}</Text>
        </View>
        
        <View style={styles.sessionControls}>
          <TouchableOpacity
            style={styles.pauseButton}
            onPress={() => setIsSessionPaused(!isSessionPaused)}
          >
            <Ionicons name={isSessionPaused ? 'play' : 'pause'} size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.endButton} onPress={endSession}>
            <Text style={styles.endButtonText}>End</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${((currentLessonIndex + 1) / lessons.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {isSessionPaused ? (
        // Paused State
        <View style={styles.pausedContainer}>
          <Ionicons name="pause-circle" size={80} color={colors.textSecondary} style={{ marginBottom: spacing.lg }} />
          <Text style={styles.pausedTitle}>Session Paused</Text>
          <Text style={styles.pausedSubtitle}>Take a break when you need it</Text>
          <TouchableOpacity
            style={styles.resumeButton}
            onPress={() => setIsSessionPaused(false)}
          >
            <Text style={styles.resumeButtonText}>Resume Training</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Active Lesson
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Lesson Header */}
          <View style={styles.lessonHeader}>
            <Text style={styles.lessonTitle}>{currentLesson.title}</Text>
            <Text style={styles.lessonDescription}>{currentLesson.description}</Text>
            
            <View style={styles.lessonMeta}>
              <View style={styles.metaBadge}>
                <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.metaText}>{currentLesson.duration} min</Text>
              </View>
              <View style={styles.metaBadge}>
                <Ionicons name="bar-chart-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.metaText}>Level {currentLesson.difficulty}</Text>
              </View>
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {currentLesson.steps.map((step, index) => (
              <View key={index} style={styles.stepContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* Tips */}
          {currentLesson.tips.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pro Tips</Text>
              {currentLesson.tips.map((tip, index) => (
                <View key={index} style={styles.tipContainer}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 140 }} />
        </ScrollView>
      )}

      {/* Bottom Actions */}
      {!isSessionPaused && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkipLesson}>
            <Text style={styles.skipButtonText}>Skip →</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.completeButton} onPress={handleCompleteLesson}>
            <Text style={styles.completeButtonText}>
              {currentLessonIndex < lessons.length - 1 ? 'Complete & Next' : 'Complete Session'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },

  // Session Header
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionProgress: {
    fontSize: typography.small,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  sessionTimer: {
    fontSize: typography.h2,
    fontWeight: typography.bold,
    color: colors.accent,
    fontVariant: ['tabular-nums'],
  },
  sessionControls: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pauseButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.cardBackgroundSecondary,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButtonText: {
    fontSize: 20,
  },
  endButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.error,
    borderRadius: 8,
    justifyContent: 'center',
  },
  endButtonText: {
    fontSize: typography.small,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },

  // Progress Bar
  progressBarContainer: {
    padding: spacing.md,
    backgroundColor: colors.cardBackground,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },

  // Paused State
  pausedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  pausedIcon: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  pausedTitle: {
    fontSize: typography.h1,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  pausedSubtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  resumeButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: 12,
  },
  resumeButtonText: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },

  // Lesson Content
  lessonHeader: {
    marginBottom: spacing.xl,
  },
  lessonTitle: {
    fontSize: typography.h1,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  lessonDescription: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  lessonMeta: {
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
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
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
  skipButton: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
  },
  completeButton: {
    flex: 2,
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
});
