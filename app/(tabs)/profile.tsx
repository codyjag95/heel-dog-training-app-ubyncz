import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../../contexts/AppContext';
import { getBreedById } from '../../data/breedDatabase';
import { colors, typography, spacing } from '../../data/darkTheme';

const SUPPORT_EMAIL = 'support@heeldogtraining.com';

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile, resetQuiz, hasPremium, setHasPremium, getCategoryProgress } = useApp();
  const [tapCount, setTapCount] = useState(0);

  const breedData = userProfile?.breedId ? getBreedById(userProfile.breedId) : null;

  const handlePawTap = useCallback(() => {
    if (!hasPremium) return;
    const newCount = tapCount + 1;
    if (newCount >= 5) {
      deactivatePremium();
      setTapCount(0);
    } else {
      setTapCount(newCount);
      setTimeout(() => setTapCount(0), 3000);
    }
  }, [tapCount, hasPremium]);

  const deactivatePremium = async () => {
    try {
      await AsyncStorage.setItem('@heel_has_premium', 'false');
      await AsyncStorage.removeItem('@heel_beta_tester');
      setHasPremium(false);
      Alert.alert('Premium Deactivated', 'You are now viewing the app as a free user.', [{ text: 'Got it!' }]);
    } catch (error) {
      console.error('Deactivation failed:', error);
    }
  };

  const handleRetakeQuiz = () => {
    Alert.alert('Retake Quiz?', 'This will reset your training plan and recommendations.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Retake Quiz', style: 'destructive', onPress: () => { resetQuiz(); router.push('/(tabs)/quiz'); } },
    ]);
  };

  const handleNotifications = () => {
    Alert.alert('Training Reminders', 'Daily training reminders help build consistency. Would you like to enable notifications?', [
      { text: 'Not Now', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ]);
  };

  const handleContactSupport = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=HEEL App Support`).catch(() => {
      Alert.alert('Contact Support', `Email us at ${SUPPORT_EMAIL}`);
    });
  };

  // Clean age display
  const cleanAge = (label: string): string => {
    if (!label || label === 'Not specified') return 'Not specified';
    return label.replace(/\s*\(.*?\)\s*/g, '').trim();
  };

  // Format raw challenge codes into readable text
  const formatChallenge = (code: string): string => {
    const map: { [key: string]: string } = {
      'nipping': 'Nipping',
      'herding_behavior': 'Herding behavior',
      'hyperactivity': 'Hyperactivity',
      'pulling': 'Leash pulling',
      'jumping': 'Jumping on people',
      'barking': 'Excessive barking',
      'separation_anxiety': 'Separation anxiety',
      'aggression': 'Aggression',
      'fearfulness': 'Fearfulness',
      'resource_guarding': 'Resource guarding',
      'digging': 'Digging',
      'chewing': 'Destructive chewing',
      'counter_surfing': 'Counter surfing',
      'prey_drive': 'High prey drive',
      'stubbornness': 'Stubbornness',
      'recall_issues': 'Recall issues',
      'reactivity': 'Reactivity',
      'mouthiness': 'Mouthiness',
      'escape_artist': 'Escape artist',
      'leash_reactive': 'Leash reactivity',
      'noise_sensitivity': 'Noise sensitivity',
    };
    return map[code] || code.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const ageDisplay = cleanAge(userProfile?.ageLabel || 'Not specified');
  const experienceDisplay = userProfile?.experienceLabel || 'Not specified';

  // Get breed personality traits
  const getBreedTraits = (): string[] => {
    if (!breedData) return [];
    const traits: string[] = [];

    // Energy
    if (breedData.energy === 'very_high') traits.push('Very high energy');
    else if (breedData.energy === 'high') traits.push('High energy');
    else if (breedData.energy === 'moderate') traits.push('Moderate energy');
    else if (breedData.energy === 'low') traits.push('Low energy');

    // Trainability
    if (breedData.trainability === 'high') traits.push('Highly trainable');
    else if (breedData.trainability === 'moderate') traits.push('Moderately trainable');
    else if (breedData.trainability === 'low') traits.push('Independent thinker');

    // Size
    if (breedData.size === 'large' || breedData.size === 'extra_large') traits.push('Large breed');
    else if (breedData.size === 'medium') traits.push('Medium breed');
    else if (breedData.size === 'small' || breedData.size === 'toy') traits.push('Small breed');

    // Group-based personality
    if (breedData.group === 'herding') traits.push('Herding instinct');
    else if (breedData.group === 'sporting') traits.push('Naturally social');
    else if (breedData.group === 'working') traits.push('Working drive');
    else if (breedData.group === 'terrier') traits.push('Bold and spirited');
    else if (breedData.group === 'hound') traits.push('Scent driven');
    else if (breedData.group === 'toy') traits.push('Companion bred');
    else if (breedData.group === 'non_sporting') traits.push('Versatile');

    return traits;
  };

  const breedTraits = getBreedTraits();

  // Total lessons completed
  const totalCompleted = userProfile ? 
    (userProfile.recommendedCategories || []).reduce((total: number, catId: string) => {
      const p = getCategoryProgress(catId);
      return total + p.completed;
    }, 0) : 0;

  // Training level
  const getLevel = (completed: number): { name: string; icon: string } => {
    if (completed >= 50) return { name: 'Expert', icon: 'trophy' };
    if (completed >= 25) return { name: 'Handler', icon: 'ribbon' };
    if (completed >= 10) return { name: 'Novice', icon: 'star' };
    if (completed >= 3) return { name: 'Beginner', icon: 'paw' };
    return { name: 'Getting Started', icon: 'footsteps' };
  };

  const level = getLevel(totalCompleted);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handlePawTap} activeOpacity={hasPremium ? 0.7 : 1}>
            <View style={[styles.avatarContainer, hasPremium && styles.avatarPremium]}>
              <Ionicons name="paw" size={48} color={hasPremium ? '#FFFFFF' : colors.accent} />
            </View>
          </TouchableOpacity>
          <Text style={styles.dogName}>{userProfile?.dogName || 'Your Dog'}</Text>

          {/* Breed traits pills */}
          {breedTraits.length > 0 && (
            <View style={styles.traitRow}>
              {breedTraits.slice(0, 3).map((trait, i) => (
                <View key={i} style={styles.traitPill}>
                  <Text style={styles.traitText}>{trait}</Text>
                </View>
              ))}
            </View>
          )}

          {hasPremium && (
            <View style={styles.premiumBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
              <Text style={styles.premiumBadgeText}>Premium Active</Text>
            </View>
          )}
        </View>

        {/* Dog Profile Card */}
        {userProfile && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{userProfile.dogName}'s Profile</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Breed</Text>
              <Text style={styles.infoValue}>{userProfile.breed || 'Not specified'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{ageDisplay}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Energy Level</Text>
              <Text style={styles.infoValue}>{userProfile.energyLevel}/10</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Training</Text>
              <Text style={styles.infoValue}>{experienceDisplay}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Motivation</Text>
              <Text style={styles.infoValue}>
                {userProfile.motivationType === 'food' ? 'Food driven' :
                 userProfile.motivationType === 'play' ? 'Toy/play driven' :
                 userProfile.motivationType === 'praise' ? 'Praise driven' : 'Mix of everything'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Daily Training</Text>
              <Text style={styles.infoValue}>
                {(userProfile as any).availabilityLabel || `${userProfile.availability} min`}
              </Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Level</Text>
              <View style={styles.levelRow}>
                <Ionicons name={level.icon as any} size={16} color={colors.accent} />
                <Text style={styles.levelText}>{level.name}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Breed Quick Notes */}
        {breedData && (
          <View style={styles.breedNotesCard}>
            <View style={styles.breedNotesHeader}>
              <Ionicons name="paw" size={16} color={colors.accent} />
              <Text style={styles.breedNotesTitle}>About {breedData.name}s</Text>
            </View>
            <Text style={styles.breedNotesText}>
              {breedData.breedInsight.split('.').slice(0, 2).join('.') + '.'}
            </Text>
            {breedData.commonChallenges && breedData.commonChallenges.length > 0 && (
              <View style={styles.challengeRow}>
                <Text style={styles.challengeLabel}>Common challenges:</Text>
                <Text style={styles.challengeValue}>
                  {breedData.commonChallenges.slice(0, 3).map(formatChallenge).join(', ')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Training Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Training Plan</Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleRetakeQuiz}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="refresh" size={20} color={colors.accent} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Retake Quiz</Text>
              <Text style={styles.actionSubtitle}>Update your training plan</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Premium Card */}
        {!hasPremium && (
          <TouchableOpacity style={styles.premiumCard} onPress={() => router.push('/(tabs)/premium')}>
            <View style={styles.premiumCardHeader}>
              <Ionicons name="paw" size={32} color={colors.accent} />
              <Text style={styles.premiumCardBadge}>PREMIUM</Text>
            </View>
            <Text style={styles.premiumCardTitle}>Unlock Full Access</Text>
            <Text style={styles.premiumCardDescription}>
              Get the complete training program with all lessons, structured roadmap, and breed-specific guidance.
            </Text>
            <View style={styles.premiumCardButton}>
              <Text style={styles.premiumCardButtonText}>Learn More</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        )}

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleNotifications}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="notifications-outline" size={20} color={colors.accent} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Notifications</Text>
              <Text style={styles.actionSubtitle}>Training reminders</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleContactSupport}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="mail-outline" size={20} color={colors.accent} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Contact Support</Text>
              <Text style={styles.actionSubtitle}>Get help with the app</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/privacy-policy')}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.accent} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/terms-of-service')}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="document-text-outline" size={20} color={colors.accent} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>HEEL Dog Training v1.1</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg, paddingTop: 80 },

  // Header
  header: { alignItems: 'center', paddingBottom: spacing.xl },
  avatarContainer: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.cardBackground, justifyContent: 'center', alignItems: 'center',
    marginBottom: spacing.md, borderWidth: 2, borderColor: colors.border,
  },
  avatarPremium: { borderColor: '#FFFFFF' },
  dogName: { fontSize: typography.h1, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: spacing.sm },

  // Breed trait pills
  traitRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.xs, marginBottom: spacing.md },
  traitPill: {
    backgroundColor: colors.cardBackground, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 10, borderWidth: 1, borderColor: colors.border,
  },
  traitText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },

  // Premium badge
  premiumBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 12,
    marginBottom: spacing.sm,
  },
  premiumBadgeText: { fontSize: typography.small, fontWeight: typography.bold, color: '#FFFFFF' },

  // Dog Profile Card
  card: { backgroundColor: colors.cardBackground, padding: spacing.lg, borderRadius: 12, marginBottom: spacing.lg },
  cardTitle: { fontSize: typography.h3, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: spacing.md },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { fontSize: typography.body, color: colors.textSecondary },
  infoValue: { fontSize: typography.body, color: colors.textPrimary, fontWeight: typography.medium, maxWidth: '55%', textAlign: 'right' },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  levelText: { fontSize: typography.body, color: colors.accent, fontWeight: typography.bold },

  // Breed Notes Card
  breedNotesCard: {
    backgroundColor: colors.cardBackground, padding: spacing.lg, borderRadius: 12,
    marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.accent,
  },
  breedNotesHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  breedNotesTitle: { fontSize: typography.h4, fontWeight: typography.bold, color: colors.accent },
  breedNotesText: { fontSize: typography.small, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.sm },
  challengeRow: { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  challengeLabel: { fontSize: 12, color: colors.textTertiary, marginBottom: 4 },
  challengeValue: { fontSize: typography.small, color: colors.textPrimary },

  // Sections
  section: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: typography.h3, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: spacing.md },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBackground, padding: spacing.lg, borderRadius: 12, marginBottom: spacing.sm },
  actionIconContainer: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.cardBackgroundSecondary || colors.cardBackground, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  actionTextContainer: { flex: 1 },
  actionTitle: { fontSize: typography.body, fontWeight: typography.semibold, color: colors.textPrimary, marginBottom: 2 },
  actionSubtitle: { fontSize: typography.small, color: colors.textSecondary },

  // Premium Card
  premiumCard: {
    backgroundColor: colors.cardBackground, padding: spacing.xl, borderRadius: 12,
    marginBottom: spacing.xl, borderWidth: 2, borderColor: colors.accent,
  },
  premiumCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.sm },
  premiumCardBadge: { fontSize: typography.small, fontWeight: typography.bold, color: colors.accent, letterSpacing: 1 },
  premiumCardTitle: { fontSize: typography.h2, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: spacing.sm },
  premiumCardDescription: { fontSize: typography.body, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.md },
  premiumCardButton: { backgroundColor: colors.accent, padding: spacing.md, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
  premiumCardButtonText: { fontSize: typography.body, fontWeight: typography.bold, color: '#FFFFFF' },

  version: { fontSize: typography.small, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.lg },
});
