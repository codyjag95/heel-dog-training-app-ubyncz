import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../../contexts/AppContext';
import { colors, typography, spacing } from '../../data/darkTheme';

const SUPPORT_EMAIL = 'support@heeldogtraining.com';
const GOLD = '#D2AF26';

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile, resetQuiz, hasPremium, setHasPremium } = useApp();
  const [tapCount, setTapCount] = useState(0);

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

  const ageDisplay = userProfile?.ageLabel || 'Not specified';
  const experienceDisplay = userProfile?.experienceLabel || 'Not specified';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handlePawTap} activeOpacity={hasPremium ? 0.7 : 1}>
            <View style={[styles.avatarContainer, hasPremium && styles.avatarPremium]}>
              <Ionicons name="paw" size={48} color={hasPremium ? GOLD : colors.accent} />
            </View>
          </TouchableOpacity>
          <Text style={styles.dogName}>{userProfile?.dogName || 'Your Dog'}</Text>
          {hasPremium && (
            <>
              <View style={styles.premiumBadge}>
                <Ionicons name="paw" size={14} color={colors.background} />
                <Text style={styles.premiumBadgeText}>Premium Active</Text>
              </View>
              <Text style={styles.premiumSubtext}>
                Full access to all lessons and premium features
              </Text>
            </>
          )}
        </View>

        {userProfile && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Dog Profile</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Breed:</Text>
              <Text style={styles.infoValue}>{userProfile.breed || 'Not specified'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age:</Text>
              <Text style={styles.infoValue}>{ageDisplay}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Energy Level:</Text>
              <Text style={styles.infoValue}>{userProfile.energyLevel}/10</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Training:</Text>
              <Text style={styles.infoValue}>{experienceDisplay}</Text>
            </View>
          </View>
        )}

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

        {!hasPremium && (
          <TouchableOpacity style={styles.premiumCard} onPress={() => router.push('/(tabs)/premium')}>
            <View style={styles.premiumCardHeader}>
              <Ionicons name="paw" size={40} color={GOLD} />
              <Text style={styles.premiumCardBadge}>PREMIUM</Text>
            </View>
            <Text style={styles.premiumCardTitle}>Unlock Full Access</Text>
            <Text style={styles.premiumCardDescription}>
              Get full access to all lessons, session mode, premium techniques, and more
            </Text>
            <View style={styles.premiumCardButton}>
              <Text style={styles.premiumCardButtonText}>Learn More</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        )}

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

        <Text style={styles.version}>HEEL Dog Training v1.0</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  header: { alignItems: 'center', paddingVertical: spacing.xl },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.cardBackground, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md, borderWidth: 2, borderColor: colors.border },
  avatarPremium: { borderColor: GOLD },
  dogName: { fontSize: typography.h1, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: spacing.sm },
  premiumBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: GOLD, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 12, marginBottom: spacing.sm },
  premiumBadgeText: { fontSize: typography.small, fontWeight: typography.bold, color: colors.background },
  premiumSubtext: { fontSize: typography.small, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  card: { backgroundColor: colors.cardBackground, padding: spacing.lg, borderRadius: 12, marginBottom: spacing.xl },
  cardTitle: { fontSize: typography.h3, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: spacing.md },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { fontSize: typography.body, color: colors.textSecondary },
  infoValue: { fontSize: typography.body, color: colors.textPrimary, fontWeight: typography.medium, maxWidth: '55%', textAlign: 'right' },
  section: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: typography.h3, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: spacing.md },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBackground, padding: spacing.lg, borderRadius: 12, marginBottom: spacing.sm },
  actionIconContainer: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.cardBackgroundSecondary || colors.cardBackground, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  actionTextContainer: { flex: 1 },
  actionTitle: { fontSize: typography.body, fontWeight: typography.semibold, color: colors.textPrimary, marginBottom: 2 },
  actionSubtitle: { fontSize: typography.small, color: colors.textSecondary },
  premiumCard: { backgroundColor: colors.cardBackground, padding: spacing.xl, borderRadius: 12, marginBottom: spacing.xl, borderWidth: 2, borderColor: GOLD },
  premiumCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.xs },
  premiumCardBadge: { fontSize: typography.small, fontWeight: typography.bold, color: GOLD, letterSpacing: 1 },
  premiumCardTitle: { fontSize: typography.h2, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: spacing.sm },
  premiumCardDescription: { fontSize: typography.body, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.md },
  premiumCardButton: { backgroundColor: colors.accent, padding: spacing.md, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
  premiumCardButtonText: { fontSize: typography.body, fontWeight: typography.bold, color: '#FFFFFF' },
  version: { fontSize: typography.small, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.lg },
});
