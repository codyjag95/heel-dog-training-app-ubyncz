
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { QuizAnswer, generateRecommendation } from '@/data/quizData';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREMIUM_INTRO_SHOWN_KEY = '@heel_premium_intro_shown';

export default function QuizResultsScreen() {
  const router = useRouter();
  const { answers: answersParam } = useLocalSearchParams();
  const { dogProfile, setDogProfile, completeOnboarding } = useApp();
  const [premiumIntroShown, setPremiumIntroShown] = useState(false);

  const answers: QuizAnswer = answersParam ? JSON.parse(answersParam as string) : { challenges: [], early_challenges: [] };
  const recommendation = generateRecommendation(answers);

  useEffect(() => {
    // Save quiz answers to dog profile
    if (dogProfile) {
      setDogProfile({
        ...dogProfile,
        quizAnswers: answers,
        recommendedPrimaryTrack: recommendation.primaryTrack,
        recommendedSecondaryTracks: recommendation.secondaryTracks,
        immediateFocus: recommendation.immediateFocus,
      });
    }

    // Check if premium intro has been shown
    checkPremiumIntroShown();
  }, []);

  const checkPremiumIntroShown = async () => {
    try {
      const shown = await AsyncStorage.getItem(PREMIUM_INTRO_SHOWN_KEY);
      setPremiumIntroShown(shown === 'true');
    } catch (error) {
      console.error('Error checking premium intro status:', error);
    }
  };

  const handleStartTraining = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeOnboarding();
    
    // Navigate to premium intro if not shown yet
    if (!premiumIntroShown) {
      router.replace('/onboarding/premium-intro');
    } else {
      router.replace('/(tabs)/(home)/');
    }
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <IconSymbol
              ios_icon_name="checkmark"
              android_material_icon_name="check"
              size={48}
              color={colors.text}
            />
          </View>
        </View>

        <Text style={styles.title}>Your Training Plan is Ready!</Text>
        <Text style={styles.subtitle}>
          Based on {dogProfile?.name}&apos;s profile, here&apos;s what we recommend
        </Text>

        {/* Immediate Focus (if applicable) */}
        {recommendation.immediateFocus.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Start Here First</Text>
            <Text style={styles.sectionDescription}>
              These foundational areas will make all other training easier
            </Text>
            {recommendation.immediateFocus.map((track, index) => (
              <View key={index} style={styles.immediateFocusCard}>
                <IconSymbol
                  ios_icon_name="exclamationmark.circle.fill"
                  android_material_icon_name="priority-high"
                  size={28}
                  color={colors.primary}
                />
                <Text style={styles.immediateFocusText}>{track}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Primary Track */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Your Core Training Path</Text>
          <View style={styles.primaryTrackCard}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.primaryTrackText}>{recommendation.primaryTrack}</Text>
          </View>
        </View>

        {/* Secondary Tracks */}
        {recommendation.secondaryTracks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Additional Focus Areas</Text>
            {recommendation.secondaryTracks.map((track, index) => (
              <View key={index} style={styles.secondaryTrackCard}>
                <IconSymbol
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.secondaryTrackText}>{track}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Reasoning */}
        {recommendation.reasoning.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Why This Plan?</Text>
            {recommendation.reasoning.map((reason, index) => (
              <View key={index} style={styles.reasonCard}>
                <View style={styles.reasonDot} />
                <Text style={styles.reasonText}>{reason}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            You can always explore other training categories at your own pace. This is just a starting point!
          </Text>
        </View>
      </ScrollView>

      {/* Start Training Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[buttonStyles.primaryButton, styles.button]}
          onPress={handleStartTraining}
          activeOpacity={0.8}
        >
          <Text style={buttonStyles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  immediateFocusCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  immediateFocusText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 16,
    flex: 1,
  },
  primaryTrackCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  primaryTrackText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 12,
    textAlign: 'center',
  },
  secondaryTrackCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  secondaryTrackText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reasonDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: 12,
  },
  reasonText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  button: {
    width: '100%',
  },
});
