
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';

export default function SessionModeScreen() {
  const router = useRouter();
  const { categoryId, lessonId } = useLocalSearchParams();
  const { categories, completeLesson, updateStreak } = useApp();
  
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const category = categories.find(cat => cat.id === categoryId);
  const lesson = category?.lessons.find(l => l.id === lessonId);

  const durations = [
    { label: '5 min', value: 5 * 60 },
    { label: '10 min', value: 10 * 60 },
    { label: '15 min', value: 15 * 60 },
  ];

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, timeRemaining]);

  if (!lesson || !category) {
    return (
      <View style={[commonStyles.container, styles.container]}>
        <Text style={styles.errorText}>Lesson not found</Text>
      </View>
    );
  }

  const handleSelectDuration = (duration: number) => {
    setSelectedDuration(duration);
    setTimeRemaining(duration);
    setIsTimerRunning(false);
  };

  const handleStartPauseTimer = () => {
    if (selectedDuration === null) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsTimerRunning(false);
    if (selectedDuration !== null) {
      setTimeRemaining(selectedDuration);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishSession = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeLesson(lesson.id);
    updateStreak();
    setSessionComplete(true);
  };

  const handleReturnHome = () => {
    router.push('/(tabs)/(home)');
  };

  // Get session steps from the new fields or fall back to the steps array
  const sessionSteps: string[] = [];
  if (lesson.step_1) sessionSteps.push(lesson.step_1);
  if (lesson.step_2) sessionSteps.push(lesson.step_2);
  if (lesson.step_3) sessionSteps.push(lesson.step_3);
  if (lesson.step_4) sessionSteps.push(lesson.step_4);
  if (lesson.step_5) sessionSteps.push(lesson.step_5);
  if (lesson.step_6) sessionSteps.push(lesson.step_6);

  // If no session steps, fall back to regular steps
  const stepsToDisplay = sessionSteps.length > 0 ? sessionSteps : lesson.steps;

  // Session Complete State
  if (sessionComplete) {
    return (
      <View style={[commonStyles.container, styles.completeContainer]}>
        <View style={styles.completeContent}>
          <View style={styles.checkmarkContainer}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={80}
              color={colors.primary}
            />
          </View>
          
          <Text style={styles.completeTitle}>Session complete</Text>
          <Text style={styles.completeMessage}>
            Consistency builds calm behavior.
          </Text>

          <TouchableOpacity
            style={[buttonStyles.primaryButton, styles.returnButton]}
            onPress={handleReturnHome}
            activeOpacity={0.8}
          >
            <Text style={buttonStyles.primaryButtonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[commonStyles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="chevron-left"
            size={28}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session Mode</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Lesson Info Card */}
        <View style={styles.lessonInfoCard}>
          <Text style={styles.lessonTitle}>{lesson.name}</Text>
          <View style={styles.lessonMeta}>
            <View style={styles.metaItem}>
              <IconSymbol
                ios_icon_name="clock.fill"
                android_material_icon_name="schedule"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.metaText}>{lesson.estimatedTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <IconSymbol
                ios_icon_name="chart.bar.fill"
                android_material_icon_name="bar-chart"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.metaText}>{lesson.difficulty}</Text>
            </View>
          </View>
          
          {/* Session Flow Subheading */}
          <Text style={styles.sessionSubheading}>
            Follow the steps below. Keep sessions short and calm.
          </Text>
        </View>

        {/* Today's Goal */}
        {lesson.session_goal && (
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <IconSymbol
                ios_icon_name="target"
                android_material_icon_name="track-changes"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.goalTitle}>Today&apos;s Goal</Text>
            </View>
            <Text style={styles.goalText}>{lesson.session_goal}</Text>
          </View>
        )}

        {/* Timer Section */}
        <View style={styles.timerCard}>
          <Text style={styles.sectionTitle}>Session Timer (Optional)</Text>
          
          {!selectedDuration ? (
            <View style={styles.durationSelector}>
              {durations.map((duration, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.durationButton}
                  onPress={() => handleSelectDuration(duration.value)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.durationButtonText}>{duration.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.timerContainer}>
              <View style={styles.timerDisplay}>
                <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
              </View>
              
              <View style={styles.timerControls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handleStartPauseTimer}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    ios_icon_name={isTimerRunning ? 'pause.fill' : 'play.fill'}
                    android_material_icon_name={isTimerRunning ? 'pause' : 'play-arrow'}
                    size={24}
                    color={colors.text}
                  />
                  <Text style={styles.controlButtonText}>
                    {isTimerRunning ? 'Pause' : 'Start'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handleResetTimer}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    ios_icon_name="arrow.clockwise"
                    android_material_icon_name="refresh"
                    size={24}
                    color={colors.text}
                  />
                  <Text style={styles.controlButtonText}>Reset</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => {
                    setSelectedDuration(null);
                    setTimeRemaining(0);
                    setIsTimerRunning(false);
                  }}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    ios_icon_name="xmark"
                    android_material_icon_name="close"
                    size={24}
                    color={colors.text}
                  />
                  <Text style={styles.controlButtonText}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Training Steps */}
        <View style={styles.stepsSection}>
          <Text style={styles.sectionTitle}>Training Steps</Text>
          {stepsToDisplay.map((step, index) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Finish Session Button */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[buttonStyles.primaryButton, styles.finishButton]}
            onPress={handleFinishSession}
            activeOpacity={0.8}
          >
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={24}
              color={colors.text}
            />
            <Text style={[buttonStyles.primaryButtonText, styles.finishButtonText]}>
              Complete Session
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  lessonInfoCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  lessonMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 24,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  sessionSubheading: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: 8,
  },
  goalCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  timerCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  durationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  durationButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  durationButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerDisplay: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 32,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  controlButton: {
    alignItems: 'center',
    padding: 8,
  },
  controlButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginTop: 4,
  },
  stepsSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  stepCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  stepText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 22,
    flex: 1,
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  finishButtonText: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  completeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  completeContent: {
    alignItems: 'center',
    width: '100%',
  },
  checkmarkContainer: {
    marginBottom: 32,
  },
  completeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  completeMessage: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 48,
  },
  returnButton: {
    width: '100%',
  },
});
