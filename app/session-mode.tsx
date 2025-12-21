
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';

const TRAINING_TIPS = [
  "Don't yell at dogs — it scares them. Redirect instead.",
  "Consistency beats perfection. Train a little every day.",
  "Reward the behavior you want to see more of.",
  "A tired dog is a well-behaved dog. Mental exercise counts too.",
  "Patience is your most powerful training tool.",
  "Dogs learn through repetition and positive reinforcement.",
  "Short, frequent training sessions work better than long ones.",
  "Every interaction is a training opportunity.",
];

export default function SessionModeScreen() {
  const router = useRouter();
  const { categoryId, lessonId } = useLocalSearchParams();
  const { categories, completeLesson, updateStreak, addSessionNote, userProgress } = useApp();
  
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showTimerPicker, setShowTimerPicker] = useState(false);
  
  // Step navigation
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showAllSteps, setShowAllSteps] = useState(false);
  
  // Post-session questions
  const [focusRating, setFocusRating] = useState<number>(0);
  const [successRating, setSuccessRating] = useState<number>(0);
  const [energyLevel, setEnergyLevel] = useState<'calm' | 'normal' | 'hyper' | null>(null);
  const [struggledWith, setStruggledWith] = useState<string>('');

  // Training tip
  const [showTrainingTip, setShowTrainingTip] = useState(false);
  const [currentTip, setCurrentTip] = useState('');

  const category = categories.find(cat => cat.id === categoryId);
  const lesson = category?.lessons.find(l => l.id === lessonId);

  const timerOptions = [
    { label: '5 min', value: 5 * 60 },
    { label: '10 min', value: 10 * 60 },
    { label: '15 min', value: 15 * 60 },
  ];

  // Show random training tip on mount (only if enabled)
  useEffect(() => {
    if (userProgress.showTrainingTips) {
      const randomTip = TRAINING_TIPS[Math.floor(Math.random() * TRAINING_TIPS.length)];
      setCurrentTip(randomTip);
      
      // Show tip after 2 seconds
      const timer = setTimeout(() => {
        setShowTrainingTip(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [userProgress.showTrainingTips]);

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

  const handleSelectTimer = (duration: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDuration(duration);
    setTimeRemaining(duration);
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

  const getRecommendation = () => {
    // Calculate overall performance
    const avgRating = (focusRating + successRating) / 2;
    
    if (avgRating >= 2.5 && energyLevel === 'calm') {
      return {
        title: 'Great work!',
        message: 'Your dog is ready to advance to the next lesson.',
        action: 'advance',
        icon: 'arrow.right.circle.fill' as const,
      };
    } else if (avgRating >= 2 && energyLevel !== 'hyper') {
      return {
        title: 'Good progress',
        message: 'Practice this lesson one more time to build confidence.',
        action: 'repeat',
        icon: 'arrow.clockwise.circle.fill' as const,
      };
    } else if (energyLevel === 'hyper') {
      return {
        title: 'Try a different approach',
        message: 'Your dog seems overstimulated. Try Calm & Focus lessons to build impulse control.',
        action: 'redirect',
        icon: 'sparkles' as const,
      };
    } else if (struggledWith.toLowerCase().includes('distract')) {
      return {
        title: 'Build focus first',
        message: 'Work on Calm & Focus lessons to improve attention before continuing.',
        action: 'redirect',
        icon: 'sparkles' as const,
      };
    } else {
      return {
        title: 'Keep practicing',
        message: 'Repeat this lesson in a quieter environment with fewer distractions.',
        action: 'repeat',
        icon: 'arrow.clockwise.circle.fill' as const,
      };
    }
  };

  const handleSaveAndReturn = () => {
    // Save session data
    const note = {
      id: `note-${Date.now()}`,
      lessonId: lesson.id,
      date: new Date().toISOString(),
      wentWell: `Focus: ${focusRating}/3, Success: ${successRating}/3, Energy: ${energyLevel || 'not set'}`,
      struggled: struggledWith.trim(),
    };
    addSessionNote(note);
    
    router.push('/(tabs)/(home)');
  };

  const handleStartAnother = () => {
    // Save session data
    const note = {
      id: `note-${Date.now()}`,
      lessonId: lesson.id,
      date: new Date().toISOString(),
      wentWell: `Focus: ${focusRating}/3, Success: ${successRating}/3, Energy: ${energyLevel || 'not set'}`,
      struggled: struggledWith.trim(),
    };
    addSessionNote(note);
    
    // Navigate based on recommendation
    const recommendation = getRecommendation();
    if (recommendation.action === 'advance') {
      // Find next lesson in category
      const currentIndex = category.lessons.findIndex(l => l.id === lesson.id);
      if (currentIndex < category.lessons.length - 1) {
        const nextLesson = category.lessons[currentIndex + 1];
        router.push({
          pathname: '/lesson',
          params: { categoryId: category.id, lessonId: nextLesson.id },
        });
      } else {
        router.push({
          pathname: '/category',
          params: { categoryId: category.id },
        });
      }
    } else if (recommendation.action === 'redirect') {
      // Go to Calm & Focus category
      router.push({
        pathname: '/category',
        params: { categoryId: 'calm-focus' },
      });
    } else {
      // Repeat current lesson
      router.push({
        pathname: '/lesson',
        params: { categoryId: category.id, lessonId: lesson.id },
      });
    }
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

  const renderPawRating = (rating: number, setRating: (val: number) => void) => {
    return (
      <View style={styles.pawRatingContainer}>
        {[1, 2, 3].map((paw) => (
          <TouchableOpacity
            key={paw}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setRating(paw);
            }}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name={paw <= rating ? 'pawprint.fill' : 'pawprint'}
              android_material_icon_name={paw <= rating ? 'pets' : 'pets'}
              size={40}
              color={paw <= rating ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Session Complete State
  if (sessionComplete) {
    const recommendation = getRecommendation();
    
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

            {/* Quick Questions Section */}
            <View style={styles.questionsSection}>
              <Text style={styles.questionsSectionTitle}>How did it go?</Text>
              
              {/* Question 1: Focus */}
              <View style={styles.questionCard}>
                <Text style={styles.questionLabel}>How was your dog&apos;s focus?</Text>
                {renderPawRating(focusRating, setFocusRating)}
              </View>

              {/* Question 2: Success */}
              <View style={styles.questionCard}>
                <Text style={styles.questionLabel}>How successful was the session?</Text>
                {renderPawRating(successRating, setSuccessRating)}
              </View>

              {/* Question 3: Energy Level */}
              <View style={styles.questionCard}>
                <Text style={styles.questionLabel}>What was your dog&apos;s energy level?</Text>
                <View style={styles.energyButtonsContainer}>
                  {[
                    { value: 'calm', label: 'Calm', icon: 'sparkles' },
                    { value: 'normal', label: 'Normal', icon: 'circle' },
                    { value: 'hyper', label: 'Hyper', icon: 'bolt.fill' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.energyButton,
                        energyLevel === option.value && styles.energyButtonActive,
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setEnergyLevel(option.value as 'calm' | 'normal' | 'hyper');
                      }}
                      activeOpacity={0.7}
                    >
                      <IconSymbol
                        ios_icon_name={option.icon as any}
                        android_material_icon_name={option.icon === 'sparkles' ? 'auto-awesome' : option.icon === 'bolt.fill' ? 'bolt' : 'circle'}
                        size={20}
                        color={energyLevel === option.value ? colors.text : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.energyButtonText,
                          energyLevel === option.value && styles.energyButtonTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Optional: What did they struggle with? */}
              <View style={styles.questionCard}>
                <Text style={styles.questionLabel}>What did they struggle with? (Optional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., distractions, staying focused..."
                  placeholderTextColor={colors.textSecondary}
                  value={struggledWith}
                  onChangeText={setStruggledWith}
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Recommendation Card */}
            {focusRating > 0 && successRating > 0 && energyLevel && (
              <View style={styles.recommendationCard}>
                <View style={styles.recommendationHeader}>
                  <IconSymbol
                    ios_icon_name={recommendation.icon}
                    android_material_icon_name={
                      recommendation.icon === 'arrow.right.circle.fill' ? 'arrow-forward' :
                      recommendation.icon === 'arrow.clockwise.circle.fill' ? 'refresh' :
                      'auto-awesome'
                    }
                    size={32}
                    color={colors.primary}
                  />
                  <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
                </View>
                <Text style={styles.recommendationMessage}>{recommendation.message}</Text>
              </View>
            )}

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
                <Text style={buttonStyles.secondaryButtonText}>Continue Training</Text>
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
        
        {/* Compact Timer Icon */}
        <TouchableOpacity
          style={styles.timerIconButton}
          onPress={() => setShowTimerPicker(true)}
          activeOpacity={0.7}
        >
          {selectedDuration === null ? (
            <IconSymbol
              ios_icon_name="timer"
              android_material_icon_name="timer"
              size={28}
              color={colors.text}
            />
          ) : (
            <View style={styles.compactTimerDisplay}>
              <Text style={styles.compactTimerText}>{formatTime(timeRemaining)}</Text>
            </View>
          )}
        </TouchableOpacity>
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

        {/* Training Tips - Lightweight Text-Only */}
        {lesson.trainingTips && lesson.trainingTips.length > 0 && (
          <View style={styles.tipsSection}>
            <View style={styles.tipsSectionHeader}>
              <IconSymbol
                ios_icon_name="lightbulb.fill"
                android_material_icon_name="lightbulb"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.tipsSectionTitle}>Tips</Text>
            </View>
            {lesson.trainingTips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
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
            <Text style={styles.timerPickerSubtitle}>Choose your session duration</Text>
            {timerOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.timerOption}
                onPress={() => handleSelectTimer(option.value)}
                activeOpacity={0.7}
              >
                <IconSymbol
                  ios_icon_name="timer"
                  android_material_icon_name="timer"
                  size={24}
                  color={colors.text}
                />
                <Text style={styles.timerOptionText}>{option.label}</Text>
                <IconSymbol
                  ios_icon_name="chevron.right"
                  android_material_icon_name="chevron-right"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
            
            {selectedDuration !== null && (
              <React.Fragment>
                <View style={styles.timerDivider} />
                <View style={styles.timerControls}>
                  <TouchableOpacity
                    style={styles.timerControlButton}
                    onPress={handleStartPauseTimer}
                    activeOpacity={0.7}
                  >
                    <IconSymbol
                      ios_icon_name={isTimerRunning ? 'pause.fill' : 'play.fill'}
                      android_material_icon_name={isTimerRunning ? 'pause' : 'play-arrow'}
                      size={20}
                      color={colors.text}
                    />
                    <Text style={styles.timerControlText}>
                      {isTimerRunning ? 'Pause' : 'Start'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.timerControlButton}
                    onPress={handleResetTimer}
                    activeOpacity={0.7}
                  >
                    <IconSymbol
                      ios_icon_name="arrow.clockwise"
                      android_material_icon_name="refresh"
                      size={20}
                      color={colors.text}
                    />
                    <Text style={styles.timerControlText}>Reset</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.timerControlButton}
                    onPress={() => {
                      setSelectedDuration(null);
                      setTimeRemaining(0);
                      setIsTimerRunning(false);
                      setShowTimerPicker(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <IconSymbol
                      ios_icon_name="xmark"
                      android_material_icon_name="close"
                      size={20}
                      color={colors.text}
                    />
                    <Text style={styles.timerControlText}>Clear</Text>
                  </TouchableOpacity>
                </View>
              </React.Fragment>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Training Tip Popup - Only if enabled */}
      {userProgress.showTrainingTips && (
        <Modal
          visible={showTrainingTip}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTrainingTip(false)}
        >
          <TouchableOpacity
            style={styles.tipModalOverlay}
            activeOpacity={1}
            onPress={() => setShowTrainingTip(false)}
          >
            <View style={styles.tipPopupContainer}>
              <View style={styles.tipPopupHeader}>
                <IconSymbol
                  ios_icon_name="lightbulb.fill"
                  android_material_icon_name="lightbulb"
                  size={28}
                  color={colors.primary}
                />
                <Text style={styles.tipPopupTitle}>Training Tip</Text>
              </View>
              <Text style={styles.tipPopupText}>{currentTip}</Text>
              <TouchableOpacity
                style={styles.tipPopupButton}
                onPress={() => setShowTrainingTip(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.tipPopupButtonText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
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
  timerIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactTimerDisplay: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  compactTimerText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    fontVariant: ['tabular-nums'],
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
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
    marginBottom: 12,
    gap: 6,
  },
  tipsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 4,
  },
  tipBullet: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 20,
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
  questionsSection: {
    width: '100%',
    marginBottom: 32,
  },
  questionsSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  questionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  pawRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  energyButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  energyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  energyButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  energyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  energyButtonTextActive: {
    color: colors.text,
  },
  textInput: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    minHeight: 60,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  recommendationCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    width: '100%',
    borderWidth: 2,
    borderColor: colors.primary,
    boxShadow: '0px 4px 12px rgba(255, 59, 48, 0.3)',
    elevation: 4,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  recommendationTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  recommendationMessage: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 24,
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
    maxWidth: 320,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.4)',
    elevation: 8,
  },
  timerPickerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  timerPickerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  timerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  timerOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  timerDivider: {
    height: 1,
    backgroundColor: colors.secondary,
    marginVertical: 16,
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  timerControlButton: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    gap: 4,
  },
  timerControlText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  tipModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tipPopupContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.4)',
    elevation: 8,
  },
  tipPopupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  tipPopupTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  tipPopupText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  tipPopupButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  tipPopupButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});
