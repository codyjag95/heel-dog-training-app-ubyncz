
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

interface WaitlistEntry {
  email: string;
  user_id?: string;
  created_at: string;
  source: string;
  platform: string;
  app_version: string;
  wants_push: boolean;
  onesignal_player_id?: string;
}

export default function PremiumComingSoonScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [wantsPush, setWantsPush] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNotifyMe = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email address is required');
      return;
    }

    if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setLoading(true);

    try {
      // Check if email already exists
      const existingWaitlist = await AsyncStorage.getItem('premium_waitlist');
      const waitlist: WaitlistEntry[] = existingWaitlist ? JSON.parse(existingWaitlist) : [];
      
      const emailExists = waitlist.some(entry => entry.email.toLowerCase() === email.trim().toLowerCase());
      
      if (emailExists) {
        // Show success state even for duplicates
        setSuccess(true);
        setLoading(false);
        return;
      }

      // Create new waitlist entry
      const newEntry: WaitlistEntry = {
        email: email.trim().toLowerCase(),
        created_at: new Date().toISOString(),
        source: 'lesson_lock',
        platform: Platform.OS,
        app_version: Constants.expoConfig?.version || '1.0.0',
        wants_push: wantsPush,
      };

      // Add OneSignal player ID if available (placeholder for now)
      // In production, this would be retrieved from OneSignal SDK
      // const playerId = await getOneSignalPlayerId();
      // if (playerId) {
      //   newEntry.onesignal_player_id = playerId;
      // }

      // Save to waitlist
      waitlist.push(newEntry);
      await AsyncStorage.setItem('premium_waitlist', JSON.stringify(waitlist));

      // Request push permissions if user opted in
      if (wantsPush) {
        // In production, this would request push permissions via OneSignal
        // await requestPushPermissions();
        console.log('Push notification permission would be requested here');
      }

      setSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error saving to waitlist:', error);
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
          <Text style={styles.headerTitle}>Premium Coming Soon</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={80}
              color={colors.primary}
            />
          </View>
          
          <Text style={styles.successTitle}>You&apos;re on the list ✅</Text>
          <Text style={styles.successSubtitle}>
            We&apos;ll notify you when Premium goes live.
          </Text>

          <TouchableOpacity
            style={[buttonStyles.primaryButton, styles.backToTrainingButton]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={buttonStyles.primaryButtonText}>Back to training</Text>
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
        <Text style={styles.headerTitle}>Premium Coming Soon</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <IconSymbol
            ios_icon_name="star.fill"
            android_material_icon_name="star"
            size={64}
            color={colors.primary}
          />
        </View>

        <Text style={styles.title}>Premium Training — Coming Soon</Text>
        <Text style={styles.subtitle}>
          Premium will unlock advanced lessons, roadmaps, and analytics.
        </Text>

        <Text style={styles.body}>Want a heads up the moment it&apos;s available?</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            placeholder="Email address"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>

        {/* Push Notification Toggle */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => {
            setWantsPush(!wantsPush);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, wantsPush && styles.checkboxChecked]}>
            {wantsPush && (
              <IconSymbol
                ios_icon_name="checkmark"
                android_material_icon_name="check"
                size={18}
                color={colors.text}
              />
            )}
          </View>
          <Text style={styles.checkboxLabel}>
            Also notify me with a push notification
          </Text>
        </TouchableOpacity>

        {/* Notify Me Button */}
        <TouchableOpacity
          style={[buttonStyles.primaryButton, styles.notifyButton, loading && styles.notifyButtonDisabled]}
          onPress={handleNotifyMe}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={buttonStyles.primaryButtonText}>
            {loading ? 'Saving...' : 'Notify Me'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          We&apos;ll only use this to notify you when Premium launches.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  body: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: colors.primary,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginTop: 8,
    marginLeft: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  notifyButton: {
    marginBottom: 16,
  },
  notifyButtonDisabled: {
    opacity: 0.6,
  },
  disclaimer: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  successIconContainer: {
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  successSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  backToTrainingButton: {
    width: '100%',
  },
});
