
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';

export default function LessonScreen() {
  const router = useRouter();
  const { categoryId, lessonId } = useLocalSearchParams();
  const { categories, setLastViewedLesson, isLessonLocked, userProgress } = useApp();

  const category = categories.find(cat => cat.id === categoryId);
  const lesson = category?.lessons.find(l => l.id === lessonId);

  useEffect(() => {
    if (lesson) {
      setLastViewedLesson(lesson.id);
    }
  }, [lesson]);

  if (!lesson || !category) {
    return (
      <View style={[commonStyles.container, styles.container]}>
        <Text style={styles.errorText}>Lesson not found</Text>
      </View>
    );
  }

  const locked = isLessonLocked(lesson);
  const isPremiumLocked = lesson.isPremium && !userProgress.isPremium;

  // Check prerequisites
  const getPrerequisiteNames = (): string[] => {
    if (!lesson.prerequisiteIds || lesson.prerequisiteIds.length === 0) {
      return [];
    }
    
    const names: string[] = [];
    for (const cat of categories) {
      for (const prereqId of lesson.prerequisiteIds) {
        const prereqLesson = cat.lessons.find(l => l.id === prereqId);
        if (prereqLesson) {
          names.push(prereqLesson.name);
        }
      }
    }
    return names;
  };

  const prerequisiteNames = getPrerequisiteNames();

  const handleStartSession = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/session-mode',
      params: { categoryId, lessonId },
    });
  };

  const handleUpgradeToPremium = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/premium');
  };

  // Premium CTA Screen
  if (isPremiumLocked) {
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
          <Text style={styles.headerTitle}>{lesson.name}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.premiumCtaContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.premiumIconContainer}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={64}
              color={colors.primary}
            />
          </View>
          
          <Text style={styles.premiumTitle}>Premium Lesson</Text>
          <Text style={styles.premiumSubtitle}>{lesson.name}</Text>
          
          <Text style={styles.premiumDescription}>
            This advanced lesson is part of HEEL Premium. Unlock all premium content to access:
          </Text>

          <View style={styles.premiumFeaturesList}>
            <View style={styles.premiumFeatureItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.premiumFeatureText}>All advanced training lessons</Text>
            </View>
            <View style={styles.premiumFeatureItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.premiumFeatureText}>Personalized training roadmaps</Text>
            </View>
            <View style={styles.premiumFeatureItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.premiumFeatureText}>Progress insights & analytics</Text>
            </View>
            <View style={styles.premiumFeatureItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.premiumFeatureText}>Multi-dog management</Text>
            </View>
            <View style={styles.premiumFeatureItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.premiumFeatureText}>Ad-free experience</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[buttonStyles.primaryButton, styles.upgradeButton]}
            onPress={handleUpgradeToPremium}
            activeOpacity={0.8}
          >
            <Text style={buttonStyles.primaryButtonText}>Upgrade to Premium</Text>
          </TouchableOpacity>

          <Text style={styles.premiumDisclaimer}>
            7-day free trial • Cancel anytime
          </Text>
        </ScrollView>
      </View>
    );
  }

  // Prerequisite Locked Screen
  if (locked) {
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
          <Text style={styles.headerTitle}>{lesson.name}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.lockedContainer}>
          <IconSymbol
            ios_icon_name="lock.fill"
            android_material_icon_name="lock"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={styles.lockedTitle}>Lesson Locked</Text>
          {prerequisiteNames.length > 0 ? (
            <>
              <Text style={styles.lockedText}>
                Complete these lessons first:
              </Text>
              {prerequisiteNames.map((name, index) => (
                <Text key={index} style={styles.prerequisiteText}>
                  • {name}
                </Text>
              ))}
            </>
          ) : (
            <Text style={styles.lockedText}>
              Complete previous lessons in this category to unlock.
            </Text>
          )}
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
        <Text style={styles.headerTitle}>{lesson.name}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Lesson Image/Video */}
        {lesson.imageUrl && (
          <Image
            source={{ uri: lesson.imageUrl }}
            style={styles.lessonImage}
          />
        )}

        {/* Lesson Title and Description - Clean Layout */}
        <View style={styles.titleSection}>
          <Text style={styles.lessonTitle}>{lesson.name}</Text>
          <Text style={styles.lessonDescription}>{lesson.description}</Text>
        </View>

        {/* Lesson Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <IconSymbol
                ios_icon_name="clock.fill"
                android_material_icon_name="schedule"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.infoText}>{lesson.estimatedTime}</Text>
            </View>
            <View style={styles.infoItem}>
              <IconSymbol
                ios_icon_name="chart.bar.fill"
                android_material_icon_name="bar-chart"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.infoText}>{lesson.difficulty}</Text>
            </View>
          </View>
        </View>

        {/* Session Goal Preview */}
        {lesson.session_goal && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Session Goal</Text>
            <View style={styles.goalPreview}>
              <IconSymbol
                ios_icon_name="target"
                android_material_icon_name="track-changes"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.goalPreviewText}>{lesson.session_goal}</Text>
            </View>
          </View>
        )}

        {/* Steps Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You&apos;ll Learn</Text>
          {lesson.steps.slice(0, 3).map((step, index) => (
            <View key={index} style={styles.stepPreview}>
              <View style={styles.stepBullet} />
              <Text style={styles.stepPreviewText}>{step}</Text>
            </View>
          ))}
          {lesson.steps.length > 3 && (
            <Text style={styles.moreStepsText}>
              + {lesson.steps.length - 3} more steps
            </Text>
          )}
        </View>

        {/* Action Button */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[buttonStyles.primaryButton, styles.button]}
            onPress={handleStartSession}
            activeOpacity={0.8}
          >
            <IconSymbol
              ios_icon_name="play.circle.fill"
              android_material_icon_name="play-circle-filled"
              size={24}
              color={colors.text}
            />
            <Text style={[buttonStyles.primaryButtonText, styles.buttonText]}>
              Start Session
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
  lessonImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  lessonTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  lessonDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  goalPreview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  goalPreviewText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 22,
    flex: 1,
    marginLeft: 12,
  },
  stepPreview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 7,
    marginRight: 12,
  },
  stepPreviewText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 22,
    flex: 1,
  },
  moreStepsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 8,
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    marginLeft: 8,
  },
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  lockedText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  prerequisiteText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  premiumCtaContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  premiumIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  premiumTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  premiumSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  premiumDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  premiumFeaturesList: {
    width: '100%',
    marginBottom: 32,
  },
  premiumFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumFeatureText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  upgradeButton: {
    width: '100%',
    marginBottom: 16,
  },
  premiumDisclaimer: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
