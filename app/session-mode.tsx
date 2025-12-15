
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';

export default function SessionModeScreen() {
  const router = useRouter();
  const { categoryId, lessonId } = useLocalSearchParams();
  const { categories, completeLesson, updateStreak, addSessionNote } = useApp();
  
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showTimerPicker, setShowTimerPicker] = useState(false);
  
  // Step navigation
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showAllSteps, setShowAllSteps] = useState(false);
  
  // Notes
  const [wentWell, setWentWell] = useState('');
  const [needsWork, setNeedsWork] = useState('');

  const category = categories.find(cat => cat.id === categoryId);
  const lesson = category?.lessons.find(l => l.id === lessonId);

  const timerOptions = [
    { label: '5 min', value: 5 * 60 },
    { label: '10 min', value: 10 * 60 },
    { label: '15 min', value: 15 * 60 },
    { label: 'No timer', value: null },
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

  const handleSelectTimer = (duration: number | null) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDuration(duration);
    if (duration !== null) {
      setTimeRemaining(duration);
    }
    setIsTimerRunning(false);
    setShowTimerPicker(false);
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

  const handleSaveAndReturn = () => {
    // Save notes if provided
    if (wentWell.trim() || needsWork.trim()) {
      const note = {
        id: `note-${Date.now()}`,
        lessonId: lesson.id,
        date: new Date().toISOString(),
        wentWell: wentWell.trim(),
        struggled: needsWork.trim(),
      };
      addSessionNote(note);
    }
    
    router.push('/(tabs)/(home)');
  };

  const handleStartAnother = () => {
    // Save notes if provided
    if (wentWell.trim() || needsWork.trim()) {
      const note = {
        id: `note-${Date.now()}`,
        lessonId: lesson.id,
        date: new Date().toISOString(),
        wentWell: wentWell.trim(),
        struggled: needsWork.trim(),
      };
      addSessionNote(note);
    }
    
    // Navigate back to category to select another lesson
    router.push({
      pathname: '/category',
      params: { categoryId: category.id },
    });
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
  const totalSteps = stepsToDisplay.length;

  const handleNextStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePreviousStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleToggleAllSteps = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowAllSteps(!showAllSteps);
  };

  // Session Complete State
  if (sessionComplete) {
    return (
      <View style={[commonStyles.container]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Session Complete</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.completeContent}>
            <View style={styles.checkmarkContainer}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={80}
                color={colors.primary}
              />
            </View>
            
            <Text style={styles.completeTitle}>Nice work.</Text>
            <Text style={styles.completeMessage}>
              Consistency beats perfection.
            </Text>

            {/* Notes Section */}
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>Session Notes</Text>
              <Text style={styles.notesSubtitle}>Optional — helps track progress</Text>

              <View style={styles.noteInputContainer}>
                <Text style={styles.noteLabel}>What went well?</Text>
                <TextInput
                  style={styles.noteInput}
                  placeholder="e.g., Stayed focused, responded quickly..."
                  placeholderTextColor={colors.textSecondary}
                  value={wentWell}
                  onChangeText={setWentWell}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.noteInputContainer}>
                <Text style={styles.noteLabel}>What needs work next time?</Text>
                <TextInput
                  style={styles.noteInput}
                  placeholder="e.g., Got distracted by sounds, needs more practice..."
                  placeholderTextColor={colors.textSecondary}
                  value={needsWork}
                  onChangeText={setNeedsWork}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.completeActions}>
              <TouchableOpacity
                style={[buttonStyles.primaryButton, styles.actionButton]}
                onPress={handleSaveAndReturn}
                activeOpacity={0.8}
              >
                <Text style={buttonStyles.primaryButtonText}>Done</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[buttonStyles.secondaryButton, styles.actionButton]}
                onPress={handleStartAnother}
                activeOpacity={0.8}
              >
                <Text style={buttonStyles.secondaryButtonText}>Start another session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
        {/* Simplified Session Header */}
        <View style={styles.sessionHeader}>
          <Text style={styles.lessonTitle}>{lesson.name}</Text>
          {lesson.session_goal && (
            <Text style={styles.sessionGoal}>{lesson.session_goal}</Text>
          )}
        </View>

        {/* Timer Section */}
        <View style={styles.timerCard}>
          <Text style={styles.sectionTitle}>Session Timer (Optional)</Text>
          
          {selectedDuration === null ? (
            <TouchableOpacity
              style={styles.setTimerButton}
              onPress={() => setShowTimerPicker(true)}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="timer"
                android_material_icon_name="timer"
                size={20}
                color={colors.text}
              />
              <Text style={styles.setTimerButtonText}>Set Timer</Text>
            </TouchableOpacity>
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
          <View style={styles.stepsSectionHeader}>
            <Text style={styles.sectionTitle}>Training Steps</Text>
            <TouchableOpacity
              onPress={handleToggleAllSteps}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllText}>
                {showAllSteps ? 'Show one at a time' : 'View all steps'}
              </Text>
            </TouchableOpacity>
          </View>

          {showAllSteps ? (
            // Show all steps
            <React.Fragment>
              {stepsToDisplay.map((step, index) => (
                <View key={index} style={styles.stepCard}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </React.Fragment>
          ) : (
            // Show one step at a time
            <React.Fragment>
              <View style={styles.stepCard}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{currentStepIndex + 1}</Text>
                </View>
                <Text style={styles.stepText}>{stepsToDisplay[currentStepIndex]}</Text>
              </View>

              <View style={styles.stepNavigation}>
                <TouchableOpacity
                  style={[
                    styles.stepNavButton,
                    currentStepIndex === 0 && styles.stepNavButtonDisabled,
                  ]}
                  onPress={handlePreviousStep}
                  disabled={currentStepIndex === 0}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    ios_icon_name="chevron.left"
                    android_material_icon_name="chevron-left"
                    size={20}
                    color={currentStepIndex === 0 ? colors.textSecondary : colors.text}
                  />
                  <Text
                    style={[
                      styles.stepNavButtonText,
                      currentStepIndex === 0 && styles.stepNavButtonTextDisabled,
                    ]}
                  >
                    Previous
                  </Text>
                </TouchableOpacity>

                <Text style={styles.stepCounter}>
                  {currentStepIndex + 1} of {totalSteps}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.stepNavButton,
                    currentStepIndex === totalSteps - 1 && styles.stepNavButtonDisabled,
                  ]}
                  onPress={handleNextStep}
                  disabled={currentStepIndex === totalSteps - 1}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.stepNavButtonText,
                      currentStepIndex === totalSteps - 1 && styles.stepNavButtonTextDisabled,
                    ]}
                  >
                    Next Step
                  </Text>
                  <IconSymbol
                    ios_icon_name="chevron.right"
                    android_material_icon_name="chevron-right"
                    size={20}
                    color={currentStepIndex === totalSteps - 1 ? colors.textSecondary : colors.text}
                  />
                </TouchableOpacity>
              </View>
            </React.Fragment>
          )}
        </View>

        {/* Training Tips */}
        {lesson.trainingTips && lesson.trainingTips.length > 0 && (
          <View style={styles.tipsSection}>
            <View style={styles.tipsSectionHeader}>
              <IconSymbol
                ios_icon_name="lightbulb.fill"
                android_material_icon_name="lightbulb"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.tipsSectionTitle}>Training Tips</Text>
            </View>
            {lesson.trainingTips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

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

      {/* Timer Picker Modal */}
      <Modal
        visible={showTimerPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTimerPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTimerPicker(false)}
        >
          <View style={styles.timerPickerContainer}>
            <Text style={styles.timerPickerTitle}>Set Timer</Text>
            {timerOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.timerOption}
                onPress={() => handleSelectTimer(option.value)}
                activeOpacity={0.7}
              >
                <Text style={styles.timerOptionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  sessionHeader: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  lessonTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  sessionGoal: {
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
  setTimerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  setTimerButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
  stepsSectionHeader: {
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
  stepCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
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
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 24,
    flex: 1,
  },
  stepNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  stepNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  stepNavButtonDisabled: {
    opacity: 0.4,
  },
  stepNavButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  stepNavButtonTextDisabled: {
    color: colors.textSecondary,
  },
  stepCounter: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tipsSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  tipsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  tipsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  tipCard: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  tipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 20,
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
  completeContent: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  checkmarkContainer: {
    marginBottom: 32,
  },
  completeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  completeMessage: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  notesSection: {
    width: '100%',
    marginBottom: 32,
  },
  notesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  notesSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 20,
  },
  noteInputContainer: {
    marginBottom: 20,
  },
  noteLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  noteInput: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    minHeight: 80,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  completeActions: {
    width: '100%',
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  timerPickerContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 300,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.4)',
    elevation: 8,
  },
  timerPickerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  timerOption: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  timerOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
