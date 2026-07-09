/**
 * AUTH, create account / sign in.
 * Email + password (no third-party providers = no Sign-in-with-Apple
 * requirement, no new native modules, works in Expo Go).
 *
 * The pitch to users: an account backs up your dog's training progress
 * so it survives lost phones and upgrades.
 */
import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';
import { colors, typography, spacing } from '../data/darkTheme';

export default function AuthScreen() {
  const router = useRouter();
  const { userProfile } = useApp();
  const dogName = userProfile?.dogName || 'your dog';

  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes('@') || password.length < 8) {
      setErrorMsg(password.length < 8 ? 'Password needs at least 8 characters.' : 'Enter a valid email.');
      return;
    }
    setBusy(true);
    setErrorMsg(null);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email: cleanEmail, password });
        if (error) { setErrorMsg(error.message); return; }
        if (!data.session) {
          // Email confirmation is enabled in Supabase, session arrives after they confirm
          Alert.alert(
            'Check Your Email',
            `We sent a confirmation link to ${cleanEmail}. Tap it, then come back and sign in.`,
            [{ text: 'OK', onPress: () => setMode('signin') }]
          );
          return;
        }
        // Signed up + session live → AppContext auth listener runs the sync
        Alert.alert('Account Created!', `${dogName}'s training progress is now backed up automatically.`, [
          { text: 'Great!', onPress: () => router.back() },
        ]);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) { setErrorMsg(error.message); return; }
        Alert.alert('Signed In', `Syncing ${dogName}'s training data...`, [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (e: any) {
      setErrorMsg(e?.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={26} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.logoBadge}>
          <Ionicons name="cloud-done-outline" size={36} color={colors.accent} />
        </View>

        <Text style={styles.headline}>
          {mode === 'signup' ? `Back Up ${dogName}'s Progress` : 'Welcome Back'}
        </Text>
        <Text style={styles.subheadline}>
          {mode === 'signup'
            ? 'A free account keeps every completed lesson, streak, and plan safe, even if your phone isn\'t.'
            : 'Sign in to pull your training history onto this device.'}
        </Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(t) => { setEmail(t); setErrorMsg(null); }}
          placeholder="Email"
          placeholderTextColor={colors.textTertiary}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(t) => { setPassword(t); setErrorMsg(null); }}
          placeholder={mode === 'signup' ? 'Password (8+ characters)' : 'Password'}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry
          autoCapitalize="none"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        />

        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

        <TouchableOpacity
          style={[styles.submitButton, busy && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={busy}
          activeOpacity={0.8}
        >
          {busy ? (
            <ActivityIndicator color={colors.background} size="small" />
          ) : (
            <Text style={styles.submitText}>
              {mode === 'signup' ? 'Create Free Account' : 'Sign In'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setErrorMsg(null); }}
        >
          <Text style={styles.switchText}>
            {mode === 'signup' ? 'Already have an account? Sign in' : "New here? Create a free account"}
          </Text>
        </TouchableOpacity>

        <View style={styles.noteBox}>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.noteText}>
            Your account only stores training data, completed lessons, streaks, and {dogName}'s plan. No account is required to use the free lessons.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.xl, paddingTop: 80, alignItems: 'center' },
  closeButton: { position: 'absolute', top: 56, right: 20, zIndex: 10 },
  logoBadge: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: colors.cardBackground,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  headline: {
    fontSize: 26, fontWeight: '800', color: colors.textPrimary,
    textAlign: 'center', marginBottom: spacing.sm,
  },
  subheadline: {
    fontSize: typography.body, color: colors.textSecondary, textAlign: 'center',
    lineHeight: 22, marginBottom: spacing.xl,
  },
  input: {
    width: '100%', backgroundColor: colors.cardBackground, borderRadius: 12,
    padding: spacing.lg, fontSize: typography.body, color: colors.textPrimary,
    marginBottom: spacing.md, borderWidth: 2, borderColor: 'transparent',
  },
  errorText: { fontSize: typography.small, color: '#FF4444', marginBottom: spacing.md, textAlign: 'center' },
  submitButton: {
    backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 16,
    width: '100%', alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.md,
  },
  submitText: { fontSize: typography.h4, fontWeight: '700', color: colors.background },
  switchButton: { paddingVertical: spacing.md, marginBottom: spacing.lg },
  switchText: { fontSize: typography.body, color: colors.textSecondary, textDecorationLine: 'underline' },
  noteBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: colors.cardBackground, borderRadius: 12, padding: spacing.lg, width: '100%',
  },
  noteText: { flex: 1, fontSize: typography.caption, color: colors.textSecondary, lineHeight: 18 },
});
