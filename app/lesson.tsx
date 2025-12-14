
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';
import SessionTimer from '@/components/SessionTimer';
import * as Haptics from 'expo-haptics';

export default function LessonScreen() {
  const router = useRouter();
  const { categoryId, lessonId } = useLocalSearchParams();
  const { categories, completeLesson, setLastViewedLesson, addSessionNote, getSessionNotes, isLessonLocked, updateStreak, userProgress } = useApp();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [wentWell, setWentWell] = useState('');
  const [struggled, setStruggled] = useState('');

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
  const sessionNotes = getSessionNotes(lesson.id);

  const handleMarkComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeLesson(lesson.id);
    updateStreak();
    
    // Save notes if provided
    if (wentWell.trim() || struggled.trim()) {
      addSessionNote({
        id: `${lesson.id}-${Date.now()}`,
        lessonId: lesson.id,
        date: new Date().toISOString(),
        wentWell: wentWell.trim(),
        struggled: struggled.trim(),
      });
    }
    
    router.back();
  };

  const handleTimerComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Session Complete!',
      'Great work! Time to mark this lesson as complete.',
      [{ text: 'OK' }]
    );
  };

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
          {lesson.isPremium && !userProgress.isPremium ? (
            <Text style={styles.lockedText}>
              This is a premium lesson. Upgrade to access all content.
            </Text>
          ) : prerequisiteNames.length > 0 ? (
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
              This lesson is currently locked.
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

        {/* Session Timer */}
        {sessionStarted && <SessionTimer onComplete={handleTimerComplete} />}

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Lesson</Text>
          <Text style={styles.description}>{lesson.description}</Text>
        </View>

        {/* Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Training Steps</Text>
          {lesson.steps.map((step, index) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Session Notes */}
        {sessionStarted && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.notesHeader}
              onPress={() => setShowNotes(!showNotes)}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionTitle}>Session Notes (Optional)</Text>
              <IconSymbol
                ios_icon_name={showNotes ? 'chevron.up' : 'chevron.down'}
                android_material_icon_name={showNotes ? 'expand-less' : 'expand-more'}
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
            
            {showNotes && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>What went well?</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="e.g., Great focus today"
                  placeholderTextColor={colors.textSecondary}
                  value={wentWell}
                  onChangeText={setWentWell}
                  multiline
                  numberOfLines={3}
                />
                
                <Text style={styles.notesLabel}>What did you struggle with?</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="e.g., Distractions from other dogs"
                  placeholderTextColor={colors.textSecondary}
                  value={struggled}
                  onChangeText={setStruggled}
                  multiline
                  numberOfLines={3}
                />
              </View>
            )}
          </View>
        )}

        {/* Previous Notes */}
        {sessionNotes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Previous Notes</Text>
            {sessionNotes.slice(-3).reverse().map((note, index) => (
              <View key={index} style={styles.previousNoteCard}>
                <Text style={styles.previousNoteDate}>
                  {new Date(note.date).toLocaleDateString()}
                </Text>
                {note.wentWell && (
                  <Text style={styles.previousNoteText}>
                    ✓ {note.wentWell}
                  </Text>
                )}
                {note.struggled && (
                  <Text style={styles.previousNoteText}>
                    ⚠ {note.struggled}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {!sessionStarted ? (
            <TouchableOpacity
              style={[buttonStyles.primaryButton, styles.button]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setSessionStarted(true);
              }}
              activeOpacity={0.8}
            >
              <Text style={buttonStyles.primaryButtonText}>Start Session</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[buttonStyles.primaryButton, styles.button]}
                onPress={handleMarkComplete}
                activeOpacity={0.8}
              >
                <Text style={buttonStyles.primaryButtonText}>Mark Complete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[buttonStyles.secondaryButton, styles.button, styles.buttonSecondary]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSessionStarted(false);
                  setWentWell('');
                  setStruggled('');
                }}
                activeOpacity={0.8}
              >
                <Text style={buttonStyles.secondaryButtonText}>Reset Session</Text>
              </TouchableOpacity>
            </>
          )}
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
  infoCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: -30,
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
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 24,
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
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notesContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
  notesInput: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  previousNoteCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  previousNoteDate: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  previousNoteText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  button: {
    width: '100%',
    marginBottom: 12,
  },
  buttonSecondary: {
    marginTop: 8,
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
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
