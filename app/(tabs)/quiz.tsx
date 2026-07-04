import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { quizQuestions, personalizeQuestion } from '../../data/quizData_v2';
import { colors, typography, spacing } from '../../data/darkTheme';

export default function QuizScreen() {
  const router = useRouter();
  const {
    currentQuestionIndex,
    dogName,
    addQuizAnswer,
    incrementQuestionIndex,	
    setDogNameState,
    isQuizComplete,
    generateProfile,
    resetQuiz,
    quizAnswers,
  } = useApp();

  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [breed, setBreed] = useState('');

  // Reset quiz when component mounts
  useEffect(() => {
    resetQuiz();
  }, []);

  // Get breed from quiz answers
  useEffect(() => {
    const breedAnswer = quizAnswers.find(a => a.questionId === 'q2');
    if (breedAnswer?.answerId) {
      const breedObj = quizQuestions[1].answers.find(a => a.id === breedAnswer.answerId);
      if (breedObj) {
        setBreed(breedObj.text);
      }
    }
  }, [quizAnswers]);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const totalQuestions = quizQuestions.length;
  
  // Safety check
  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswerSelect = (answerId: string) => {
    if (currentQuestion.type === 'multiple') {
      setSelectedAnswers(prev =>
        prev.includes(answerId)
          ? prev.filter(id => id !== answerId)
          : [...prev, answerId]
      );
    } else {
      setSelectedAnswers([answerId]);
    }
  };

  const handleNext = () => {
    // Handle text input (Q1 - dog name)
    if (currentQuestion.type === 'text') {
      if (textInput.trim()) {
        setDogNameState(textInput.trim());
        addQuizAnswer({
          questionId: currentQuestion.id,
          answerId: currentQuestion.answers[0].id,
          value: textInput.trim(),
        });
        setTextInput('');
        setSelectedAnswers([]);
        incrementQuestionIndex();
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }
      return;
    }

    // Handle single/multiple choice
    if (selectedAnswers.length > 0) {
      const answersToSave = [...selectedAnswers];
      
      // Build the new answer objects
      const newAnswerObjects = answersToSave.map(answerId => ({
        questionId: currentQuestion.id,
        answerId: answerId,
      }));

      // Save each answer to state
      answersToSave.forEach(answerId => {
        addQuizAnswer({
          questionId: currentQuestion.id,
          answerId: answerId,
        });
      });

      setSelectedAnswers([]);
      incrementQuestionIndex();
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });

      // Check if this was the last question
      if (currentQuestionIndex === totalQuestions - 1) {
        // FIX: Pass ALL answers including these new Q9 answers directly
        // This fixes the React state timing bug where quizAnswers
        // doesn't include Q9 yet when generateProfile reads it
        const allAnswers = [...quizAnswers, ...newAnswerObjects];
        generateProfile(allAnswers);
        
        setTimeout(() => {
          router.replace('/quiz-results');
        }, 100);
      }
    }
  };

  // When quiz completes, navigate to results
  if (isQuizComplete) {
    router.replace('/quiz-results');
    return null;
  }

  const canProceed = currentQuestion.type === 'text' 
    ? textInput.trim().length > 0 
    : selectedAnswers.length > 0;

  // Check if this is the breed question (Q2)
  const isBreedQuestion = currentQuestion.id === 'q2';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Progress Header */}
        <View style={styles.progressHeader}>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
          </View>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionCategory}>
              {currentQuestion.category.toUpperCase()}
            </Text>
            <Text style={styles.questionText}>
              {personalizeQuestion(currentQuestion.question, dogName, breed)}
            </Text>
            {currentQuestion.subtitle && (
              <Text style={styles.questionSubtitle}>
                {personalizeQuestion(currentQuestion.subtitle, dogName, breed)}
              </Text>
            )}
          </View>

          {/* Answers */}
          <View style={styles.answersContainer}>
            {currentQuestion.type === 'text' ? (
              // Text input for dog name
              <TextInput
                style={styles.textInput}
                value={textInput}
                onChangeText={setTextInput}
                placeholder={currentQuestion.placeholder || "Enter your answer"}
                placeholderTextColor={colors.textTertiary}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleNext}
              />
            ) : (
              // Multiple choice answers
              <>
                {isBreedQuestion && (
                  <Text style={styles.breedHint}>
                    Scroll to find your breed
                  </Text>
                )}
                
                {currentQuestion.answers.map(answer => {
                  const isSelected = selectedAnswers.includes(answer.id);
                  return (
                    <TouchableOpacity
                      key={answer.id}
                      style={[
                        styles.answerButton,
                        isSelected && styles.answerButtonSelected,
                        isBreedQuestion && styles.breedOption,
                      ]}
                      onPress={() => handleAnswerSelect(answer.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.answerContent}>
                        <View
                          style={[
                            styles.checkbox,
                            isSelected && styles.checkboxSelected,
                            currentQuestion.type === 'single' && styles.radio,
                          ]}
                        >
                          {isSelected && (
                            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.answerText,
                            isSelected && styles.answerTextSelected,
                          ]}
                        >
                          {answer.text}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
          </View>

          {currentQuestion.type === 'multiple' && (
            <View style={styles.multiSelectHintContainer}>
              <Ionicons name="checkmark-circle-outline" size={16} color={colors.accent} />
              <Text style={styles.multiSelectHint}>
                Select all that apply
              </Text>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Next Button (Fixed at bottom) */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !canProceed && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!canProceed}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex === totalQuestions - 1
                ? 'Complete Quiz'
                : 'Next Question'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.h3,
    color: colors.textSecondary,
  },

  // Progress Header
  progressHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressBarContainer: {
    marginBottom: spacing.sm,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  progressText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: typography.semibold,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },

  // Question
  questionContainer: {
    marginBottom: spacing.xxxl,
  },
  questionCategory: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: typography.bold,
    marginBottom: spacing.sm,
    letterSpacing: 1.5,
  },
  questionText: {
    fontSize: typography.h1,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    lineHeight: 36,
  },
  questionSubtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  // Answers
  answersContainer: {
    gap: spacing.md,
  },
  breedHint: {
    fontSize: typography.small,
    color: colors.accent,
    fontWeight: typography.semibold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  answerButton: {
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.cardBackground,
  },
  answerButtonSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.cardBackgroundSecondary,
  },
  breedOption: {
    paddingVertical: spacing.md,
  },
  answerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    borderRadius: 14,
  },
  checkboxSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  answerText: {
    flex: 1,
    fontSize: typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  answerTextSelected: {
    fontWeight: typography.semibold,
  },

  // Text Input
  textInput: {
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: 16,
    fontSize: typography.h3,
    color: colors.textPrimary,
    borderWidth: 2,
    borderColor: colors.accent,
  },

  // Multi-select hint
  multiSelectHintContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  multiSelectHint: {
    fontSize: typography.small,
    color: colors.accent,
    fontWeight: typography.semibold,
  },

  // Bottom Button
  bottomContainer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  nextButton: {
    backgroundColor: colors.accent,
    padding: spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  nextButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
});
