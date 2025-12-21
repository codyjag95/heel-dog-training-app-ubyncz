
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { quizQuestions, QuizAnswer } from '@/data/quizData';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';

export default function QuizScreen() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({
    challenges: [],
    early_challenges: [],
    current_challenges: [],
  });
  const [textInput, setTextInput] = useState('');

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  const handleSingleChoice = (option: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const newAnswers = {
      ...answers,
      [currentQuestion.saveAs]: option,
    };
    setAnswers(newAnswers);

    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTextInput('');
      } else {
        // Quiz complete, navigate to results
        router.push({
          pathname: '/onboarding/quiz-results',
          params: { answers: JSON.stringify(newAnswers) },
        });
      }
    }, 300);
  };

  const handleMultiChoice = (option: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const fieldName = currentQuestion.saveAs;
    let currentSelections = [...(answers[fieldName] as string[] || [])];
    
    if (option === 'None of the above') {
      // If "None of the above" is selected, clear all other selections
      currentSelections = currentSelections.includes(option) ? [] : [option];
    } else {
      // Remove "None of the above" if selecting other options
      currentSelections = currentSelections.filter(c => c !== 'None of the above');
      
      if (currentSelections.includes(option)) {
        currentSelections = currentSelections.filter(c => c !== option);
      } else {
        currentSelections.push(option);
      }
    }

    setAnswers({
      ...answers,
      [fieldName]: currentSelections,
    });
  };

  const handleTextSubmit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const newAnswers = {
      ...answers,
      [currentQuestion.saveAs]: textInput.trim() || undefined,
    };
    setAnswers(newAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTextInput('');
    } else {
      // Quiz complete, navigate to results
      router.push({
        pathname: '/onboarding/quiz-results',
        params: { answers: JSON.stringify(newAnswers) },
      });
    }
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (currentQuestion.type === 'text') {
      handleTextSubmit();
      return;
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTextInput('');
    } else {
      // Quiz complete, navigate to results
      router.push({
        pathname: '/onboarding/quiz-results',
        params: { answers: JSON.stringify(answers) },
      });
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Load previous text input if it exists
      const prevQuestion = quizQuestions[currentQuestionIndex - 1];
      if (prevQuestion.type === 'text') {
        setTextInput((answers[prevQuestion.saveAs] as string) || '');
      }
    } else {
      router.back();
    }
  };

  const isAnswered = () => {
    if (currentQuestion.type === 'single') {
      return answers[currentQuestion.saveAs] !== undefined;
    } else if (currentQuestion.type === 'multi') {
      const fieldValue = answers[currentQuestion.saveAs];
      return Array.isArray(fieldValue) && fieldValue.length > 0;
    } else if (currentQuestion.type === 'text') {
      // Text questions are optional, so always allow next
      return true;
    }
    return false;
  };

  const isOptionSelected = (option: string): boolean => {
    if (currentQuestion.type === 'single') {
      return answers[currentQuestion.saveAs] === option;
    } else if (currentQuestion.type === 'multi') {
      const fieldValue = answers[currentQuestion.saveAs];
      return Array.isArray(fieldValue) && fieldValue.includes(option);
    }
    return false;
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="chevron-left"
            size={28}
            color={colors.text}
          />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} of {quizQuestions.length}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.question}>{currentQuestion.question}</Text>

        {currentQuestion.type === 'text' ? (
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={textInput}
              onChangeText={setTextInput}
              placeholder={currentQuestion.placeholder || 'Type here...'}
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={handleTextSubmit}
            />
          </View>
        ) : (
          <View style={styles.optionsContainer}>
            {currentQuestion.options?.map((option, index) => {
              const isSelected = isOptionSelected(option);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                  onPress={() => {
                    if (currentQuestion.type === 'single') {
                      handleSingleChoice(option);
                    } else {
                      handleMultiChoice(option);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                    {isSelected && (
                      <IconSymbol
                        ios_icon_name="checkmark.circle.fill"
                        android_material_icon_name="check-circle"
                        size={24}
                        color={colors.primary}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Next Button (for multi-select and text) */}
      {(currentQuestion.type === 'multi' || currentQuestion.type === 'text') && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              buttonStyles.primaryButton,
              styles.button,
              !isAnswered() && currentQuestion.type === 'multi' && styles.buttonDisabled,
            ]}
            onPress={handleNext}
            disabled={!isAnswered() && currentQuestion.type === 'multi'}
            activeOpacity={0.8}
          >
            <Text style={buttonStyles.primaryButtonText}>
              {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.secondary,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  question: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 32,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    lineHeight: 24,
  },
  optionTextSelected: {
    color: colors.text,
  },
  textInputContainer: {
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.secondary,
    minHeight: 60,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  button: {
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
