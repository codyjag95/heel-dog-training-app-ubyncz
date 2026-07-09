/**
 * PAYWALL, full-screen offer shown at high-intent moments:
 *   context = 'post-quiz'      → right after quiz results (main funnel)
 *   context = 'post-lesson'    → next lesson is locked after a completion
 *   context = 'lesson-locked'  → user tapped into a locked lesson
 *
 * Conversion design notes:
 *  - Trial lives on MONTHLY (low-friction entry). Annual is the value anchor.
 *  - Monthly is preselected. The trial timeline kills "subscription anxiety."
 *  - Everyone sees the offer; nobody is trapped (X fades in after 2.5s).
 *  - IMPORTANT: the 3-day intro offer must also be configured on the MONTHLY
 *    product in App Store Connect, or Apple's sheet won't match this screen.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator, Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { colors, typography, spacing } from '../data/darkTheme';
import { logEvent } from '../services/analytics';
import { redeemPromoCode } from '../services/syncService';

const PRODUCT_IDS = {
  MONTHLY: 'com.codyjag95.heel.premium.monthly',
  ANNUAL: 'com.codyjag95.heel.premium.annual',
};

export default function PaywallScreen() {
  const router = useRouter();
  const { context } = useLocalSearchParams<{ context?: string }>();
  const { userProfile, hasPremium, products, purchase, restore, iapReady, session, syncNow } = useApp();
  const dogName = userProfile?.dogName || 'your dog';

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [canDismiss, setCanDismiss] = useState(false);
  const closeOpacity = useRef(new Animated.Value(0)).current;

  const continueToApp = useCallback(() => {
    if (context === 'post-quiz') {
      router.replace('/(tabs)');
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }, [context, router]);

  // Already premium? Nothing to sell.
  useEffect(() => {
    if (hasPremium) continueToApp();
  }, [hasPremium, continueToApp]);

  // Funnel measurement: every paywall exposure is logged with its context
  useEffect(() => {
    logEvent('paywall_viewed', { context: context || 'unknown' });
  }, []);

  // X fades in after 2.5s. The offer gets seen, nobody feels trapped.
  useEffect(() => {
    const t = setTimeout(() => {
      setCanDismiss(true);
      Animated.timing(closeOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, 2500);
    return () => clearTimeout(t);
  }, [closeOpacity]);

  // ── Copy per context ──
  // Ownership language ("plan is ready", "built for") triggers commitment.
  // The user already invested 2 minutes in the quiz; we frame Premium as
  // collecting what they already earned, not buying something new.
  const getHeadline = () => {
    switch (context) {
      case 'post-quiz':
        return `${dogName}'s Plan\nIs Ready`;
      case 'post-lesson':
        return `That's Momentum.\nDon't Waste It`;
      case 'lesson-locked':
        return `This Lesson Is in\n${dogName}'s Full Program`;
      case 'multi-dog':
        return `One Subscription.\nEvery Dog You've Got`;
      default:
        return `Unlock ${dogName}'s\nFull Program`;
    }
  };
  const getSubline = () => {
    switch (context) {
      case 'post-quiz':
        return `You answered the questions. We built the program. Your first 3 days are on us.`;
      case 'post-lesson':
        return `${dogName}'s next lesson is waiting in the full program. Try it free for 3 days and keep the streak alive.`;
      case 'lesson-locked':
        return `Everything unlocks the moment your free trial starts. ${dogName} won't know what a paywall is. Neither will you, for 3 days.`;
      case 'multi-dog':
        return `Premium covers up to 5 dogs, each with their own plan, progress, and streaks. Try it free for 3 days.`;
      default:
        return `A real day-by-day training path built around ${dogName}. Not a library to wander.`;
    }
  };

  const benefits = [
    { icon: 'map-outline', text: `${dogName}'s complete plan, day by day. No guessing what to train next` },
    { icon: 'lock-open-outline', text: 'Every lesson in every category, unlocked from minute one' },
    { icon: 'paw-outline', text: 'Up to 5 dogs on one subscription, each with their own plan and progress' },
    { icon: 'time-outline', text: 'Sessions that fit real life. 5 to 10 minutes, real results' },
    { icon: 'sparkles-outline', text: 'New categories and lessons added at no extra cost' },
  ];

  const getPrice = (type: string) => {
    const p = products?.find((x) => x.type === type);
    if (p) return p.price;
    return type === 'monthly' ? '$9.99' : '$69.99';
  };
  const monthlyPrice = getPrice('monthly');
  const annualPrice = getPrice('annual');

  // ── PURCHASE ──
  const handlePurchase = async () => {
    if (!purchase || !iapReady) {
      Alert.alert('Store Unavailable', 'Could not connect to the App Store. Please try again later.');
      return;
    }
    const productId = selectedPlan === 'monthly' ? PRODUCT_IDS.MONTHLY : PRODUCT_IDS.ANNUAL;
    setPurchasing(true);
    logEvent('purchase_started', { plan: selectedPlan, context: context || 'unknown' });
    try {
      const result = await purchase(productId);
      if (result.success) {
        logEvent('purchase_success', { plan: selectedPlan, context: context || 'unknown' });
        Alert.alert('Welcome to HEEL Premium!', `${dogName}'s full program is unlocked. Let's get to work.`, [
          { text: "Let's Train!", onPress: continueToApp },
        ]);
      } else if (result.error === 'pending' || result.error === 'listener') {
        // Purchase completing via listener; the hasPremium effect will continue
      } else if (result.error && result.error !== 'cancelled') {
        Alert.alert('Purchase Issue', result.error);
      }
    } catch (e) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    if (!restore) return;
    setRestoring(true);
    try {
      const result = await restore();
      if (result.success) {
        Alert.alert('Restored!', 'Your premium access has been restored.', [
          { text: 'Great!', onPress: continueToApp },
        ]);
      } else {
        Alert.alert('No Subscription Found', "We couldn't find an active subscription for this Apple ID.");
      }
    } catch (e) {
      Alert.alert('Error', 'Could not restore purchases. Please try again.');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Delayed dismiss */}
      <Animated.View style={[styles.closeButton, { opacity: closeOpacity }]}>
        <TouchableOpacity
          onPress={canDismiss ? () => { logEvent('paywall_dismissed', { context: context || 'unknown' }); continueToApp(); } : undefined}
          disabled={!canDismiss}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="close" size={26} color={colors.textSecondary} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.logoBadge}>
          <Ionicons name="paw" size={40} color={colors.accent} />
        </View>

        <Text style={styles.headline}>{getHeadline()}</Text>
        <Text style={styles.subheadline}>{getSubline()}</Text>

        {/* Plans. Monthly first, carries the trial. Annual anchors the value. */}
        <View style={styles.plansContainer}>
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
            onPress={() => setSelectedPlan('monthly')}
            activeOpacity={0.7}
          >
            <View style={styles.planBadge}><Text style={styles.planBadgeText}>3 DAYS FREE</Text></View>
            <Ionicons
              name={selectedPlan === 'monthly' ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={selectedPlan === 'monthly' ? colors.accent : colors.textSecondary}
              style={styles.planRadio}
            />
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>Monthly</Text>
              <Text style={styles.planPrice}>Free for 3 days, then {monthlyPrice}/mo</Text>
              <Text style={styles.planSubtext}>Cancel anytime in seconds</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'annual' && styles.planCardSelected]}
            onPress={() => setSelectedPlan('annual')}
            activeOpacity={0.7}
          >
            <View style={[styles.planBadge, styles.planBadgeDark]}><Text style={styles.planBadgeText}>SAVE 42%</Text></View>
            <Ionicons
              name={selectedPlan === 'annual' ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={selectedPlan === 'annual' ? colors.accent : colors.textSecondary}
              style={styles.planRadio}
            />
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>Annual</Text>
              <Text style={styles.planPrice}>{annualPrice}/year</Text>
              <Text style={styles.planSubtext}>Just $5.83/month, billed once</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Trial timeline. Kills the "I'll forget to cancel" objection. */}
        {selectedPlan === 'monthly' && (
          <View style={styles.timelineBox}>
            <View style={styles.timelineRow}>
              <Ionicons name="lock-open" size={18} color={colors.accent} />
              <View style={styles.timelineTextWrap}>
                <Text style={styles.timelineTitle}>Today</Text>
                <Text style={styles.timelineText}>Everything unlocks. Start {dogName}'s full plan</Text>
              </View>
            </View>
            <View style={styles.timelineRow}>
              <Ionicons name="trending-up" size={18} color={colors.accent} />
              <View style={styles.timelineTextWrap}>
                <Text style={styles.timelineTitle}>Day 2</Text>
                <Text style={styles.timelineText}>Real momentum. Most owners feel the shift this week</Text>
              </View>
            </View>
            <View style={styles.timelineRow}>
              <Ionicons name="shield-checkmark" size={18} color={colors.accent} />
              <View style={styles.timelineTextWrap}>
                <Text style={styles.timelineTitle}>Day 3</Text>
                <Text style={styles.timelineText}>Your call. Keep going, or cancel in about 10 seconds</Text>
              </View>
            </View>
          </View>
        )}

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          {benefits.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <Ionicons name={b.icon as any} size={20} color={colors.accent} />
              <Text style={styles.benefitText}>{b.text}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.purchaseButton, purchasing && { opacity: 0.6 }]}
          onPress={handlePurchase}
          disabled={purchasing}
          activeOpacity={0.8}
        >
          {purchasing ? (
            <ActivityIndicator color={colors.background} size="small" />
          ) : (
            <>
              <Ionicons name="lock-open" size={20} color={colors.background} />
              <Text style={styles.purchaseButtonText}>
                {selectedPlan === 'monthly' ? 'Start My 3 Free Days' : 'Unlock a Full Year'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.trialNote}>
          {selectedPlan === 'monthly'
            ? `Nothing due today. ${monthlyPrice}/month after your free 3 days.`
            : `${annualPrice} billed once a year. No surprises.`}
          {'\n'}Cancel anytime. No questions asked.
        </Text>

        {/* Risk reversal */}
        <View style={styles.riskBox}>
          <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
          <Text style={styles.riskText}>
            Most owners see a calmer, more focused dog within the first week. If you don't, cancel and keep the free lessons forever. You risk nothing.
          </Text>
        </View>

        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore} disabled={restoring}>
          {restoring
            ? <ActivityIndicator color={colors.textSecondary} size="small" />
            : <Text style={styles.restoreText}>Restore Purchases</Text>}
        </TouchableOpacity>

        {/* Promo / shelter / partner code redemption (server-side, revocable) */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={() => {
            if (!session) {
              Alert.alert(
                'Account Needed',
                'Create a free account first (Profile tab) so your code stays attached to you, even on a new phone.'
              );
              return;
            }
            Alert.prompt('Redeem a Code', 'Enter your access code', async (code) => {
              if (!code || !code.trim()) return;
              const res = await redeemPromoCode(code);
              if (res === 'ok') {
                logEvent('promo_redeemed', {});
                await syncNow();
                Alert.alert('Code Accepted!', `${dogName}'s full program is unlocked. Enjoy!`, [
                  { text: "Let's Train!", onPress: continueToApp },
                ]);
              } else if (res === 'exhausted') {
                Alert.alert('Code Fully Redeemed', 'This code has reached its redemption limit.');
              } else {
                Alert.alert('Invalid Code', 'Double-check the code and try again.');
              }
            });
          }}
        >
          <Text style={styles.restoreText}>Have a code?</Text>
        </TouchableOpacity>

        {canDismiss && context === 'post-quiz' && (
          <TouchableOpacity onPress={continueToApp} style={styles.skipButton}>
            <Text style={styles.skipText}>Continue with free lessons</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: spacing.xl, paddingTop: 84, paddingBottom: 40, alignItems: 'center' },
  closeButton: { position: 'absolute', top: 56, right: 20, zIndex: 10 },
  logoBadge: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  headline: {
    fontSize: 30, fontWeight: '800', color: colors.textPrimary,
    textAlign: 'center', marginBottom: spacing.sm, lineHeight: 37,
  },
  subheadline: {
    fontSize: typography.body, color: colors.textSecondary, textAlign: 'center',
    marginBottom: spacing.xl, lineHeight: 22, paddingHorizontal: spacing.sm,
  },
  plansContainer: { width: '100%', gap: spacing.md, marginBottom: spacing.lg },
  planCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBackground,
    borderRadius: 14, padding: spacing.lg, borderWidth: 2, borderColor: 'transparent',
  },
  planCardSelected: { borderColor: colors.accent },
  planBadge: {
    position: 'absolute', top: -10, right: 16, backgroundColor: colors.accent,
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8,
  },
  planBadgeDark: { backgroundColor: '#333333' },
  planBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  planRadio: { marginRight: spacing.md },
  planInfo: { flex: 1 },
  planTitle: { fontSize: typography.h4, fontWeight: '700', color: colors.textPrimary },
  planPrice: { fontSize: typography.body, fontWeight: '600', color: colors.accent, marginTop: 2 },
  planSubtext: { fontSize: typography.caption, color: colors.textSecondary, marginTop: 2 },

  timelineBox: {
    width: '100%', backgroundColor: colors.cardBackground, borderRadius: 14,
    padding: spacing.lg, gap: spacing.md, marginBottom: spacing.lg,
  },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  timelineTextWrap: { flex: 1 },
  timelineTitle: { fontSize: typography.small, fontWeight: '800', color: colors.textPrimary, letterSpacing: 0.5 },
  timelineText: { fontSize: typography.caption, color: colors.textSecondary, lineHeight: 17, marginTop: 1 },

  benefitsSection: { width: '100%', marginBottom: spacing.lg },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  benefitText: { fontSize: typography.body, color: colors.textPrimary, flex: 1 },

  purchaseButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 16,
    width: '100%', marginBottom: spacing.md,
  },
  purchaseButtonText: { fontSize: typography.h4, fontWeight: '700', color: colors.background },
  trialNote: {
    fontSize: typography.caption, color: colors.textSecondary, textAlign: 'center',
    lineHeight: 18, marginBottom: spacing.lg,
  },
  riskBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: colors.cardBackground, borderRadius: 12, padding: spacing.lg,
    width: '100%', marginBottom: spacing.lg,
  },
  riskText: { flex: 1, fontSize: typography.caption, color: colors.textSecondary, lineHeight: 18 },
  restoreButton: { paddingVertical: spacing.sm, marginBottom: spacing.sm },
  restoreText: { fontSize: typography.body, color: colors.textSecondary, textDecorationLine: 'underline' },
  skipButton: { paddingVertical: spacing.md },
  skipText: { fontSize: typography.small, color: colors.textTertiary },
});
