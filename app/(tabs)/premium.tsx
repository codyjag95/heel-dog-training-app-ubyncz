import React, { useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert,
  ActivityIndicator, Linking, TextInput, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../../contexts/AppContext';
import { colors, typography, spacing } from '../../data/darkTheme';

// ============================================================================
// UNLOCK CODES
// ============================================================================
const BETA_CODE = 'HEEL247';
const TEST_CODE = 'ELLIE';

const TAP_THRESHOLD_ACTIVATE = 19;
const TAP_THRESHOLD_DEACTIVATE = 5;
const TAP_THRESHOLD_TEST = 7;

const PRODUCT_IDS = {
  MONTHLY: 'com.codyjag95.heel.premium.monthly',
  ANNUAL: 'com.codyjag95.heel.premium.annual',
};

export default function PremiumScreen() {
  const appContext = useApp();
  const hasPremium = appContext.hasPremium;
  const setHasPremium = appContext.setHasPremium;
  const products = appContext.products || [];
  const purchaseFn = appContext.purchase;
  const restoreFn = appContext.restore;
  const iapReady = appContext.iapReady || false;
  const userProfile = appContext.userProfile;

  const dogName = userProfile?.dogName || 'your dog';
  const breed = userProfile?.breed || '';
  const hasProfile = !!userProfile;

  // ── Personalized benefits ──
  const getBenefits = () => {
    const base = [
      { icon: 'map-outline', text: `A structured 4-week plan built specifically for ${dogName}. No guessing what to train next.` },
      { icon: 'lock-open-outline', text: `Full access to 140+ lessons. Every category, every skill, from day one.` },
      { icon: 'trending-up-outline', text: 'Real progression. Each week builds on the last so the training actually sticks.' },
      { icon: 'sparkles-outline', text: 'New lessons and categories added regularly. Your investment grows over time.' },
      { icon: 'heart-outline', text: `Build a deeper bond with ${dogName}. Training isn't just about commands. It's learning to communicate in a way you both understand.` },
    ];
    if (breed && breed !== 'Mixed Breed / Mutt' && breed !== "I Don't Know / Not Sure") {
      base.splice(2, 0, { icon: 'paw', text: `Breed-specific guidance designed for how ${breed}s actually think and learn.` });
    }
    return base;
  };
  const benefits = getBenefits();

  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('annual');

  // Paw tap (HEEL247)
  const [tapCount, setTapCount] = useState(0);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState(false);

  // Restore tap (HEELFREE)
  const [restoreTapCount, setRestoreTapCount] = useState(0);
  const [showTestCodeModal, setShowTestCodeModal] = useState(false);
  const [testCodeInput, setTestCodeInput] = useState('');
  const [testCodeError, setTestCodeError] = useState(false);

  // ── PAW TAP ──
  const handlePawTap = useCallback(() => {
    const newCount = tapCount + 1;
    const threshold = hasPremium ? TAP_THRESHOLD_DEACTIVATE : TAP_THRESHOLD_ACTIVATE;
    if (newCount >= threshold) {
      if (hasPremium) { deactivatePremium(); }
      else { setShowCodeModal(true); setCodeInput(''); setCodeError(false); }
      setTapCount(0);
    } else {
      setTapCount(newCount);
      setTimeout(() => setTapCount(0), 4000);
    }
  }, [tapCount, hasPremium]);

  // ── RESTORE TAP ──
  const handleRestoreTap = useCallback(() => {
    if (hasPremium) { handleRestore(); return; }
    const newCount = restoreTapCount + 1;
    if (newCount >= TAP_THRESHOLD_TEST) {
      if (TEST_CODE) { setShowTestCodeModal(true); setTestCodeInput(''); setTestCodeError(false); }
      setRestoreTapCount(0);
    } else {
      setRestoreTapCount(newCount);
      setTimeout(() => setRestoreTapCount(0), 3000);
    }
  }, [restoreTapCount, hasPremium]);

  // ── CODE HANDLERS ──
  const handleBetaCodeSubmit = async () => {
    if (codeInput.trim().toUpperCase() === BETA_CODE) {
      setShowCodeModal(false); setCodeInput(''); setCodeError(false);
      await activatePremium('beta');
    } else { setCodeError(true); setCodeInput(''); }
  };

  const handleTestCodeSubmit = async () => {
    if (testCodeInput.trim().toUpperCase() === TEST_CODE) {
      setShowTestCodeModal(false); setTestCodeInput(''); setTestCodeError(false);
      await activatePremium('test');
    } else { setTestCodeError(true); setTestCodeInput(''); }
  };

  // ── ACTIVATE / DEACTIVATE ──
  const activatePremium = async (type: 'beta' | 'test') => {
    try {
      await AsyncStorage.setItem('@heel_has_premium', 'true');
      await AsyncStorage.setItem('@heel_beta_tester', 'true');
      await AsyncStorage.setItem('@heel_unlock_type', type);
      setHasPremium(true);
      Alert.alert('Welcome to HEEL Premium!', `All premium content is now unlocked.`, [{ text: "Let's Train!" }]);
    } catch (e) { console.error('Premium activation failed:', e); }
  };

  const deactivatePremium = async () => {
    try {
      await AsyncStorage.setItem('@heel_has_premium', 'false');
      await AsyncStorage.removeItem('@heel_beta_tester');
      await AsyncStorage.removeItem('@heel_unlock_type');
      setHasPremium(false);
      Alert.alert('Premium Deactivated', 'Viewing app as free user.', [{ text: 'Got it!' }]);
    } catch (e) { console.error('Premium deactivation failed:', e); }
  };

  // ── PURCHASE ──
  const handlePurchase = async () => {
    if (!purchaseFn || typeof purchaseFn !== 'function') {
      Alert.alert('Store Unavailable', 'Could not connect to the App Store. Please restart the app and try again.');
      return;
    }
    if (!iapReady) {
      Alert.alert('Store Unavailable', 'Could not connect to the App Store. Please try again later.');
      return;
    }
    const productId = selectedPlan === 'monthly' ? PRODUCT_IDS.MONTHLY : PRODUCT_IDS.ANNUAL;
    setPurchasing(true);
    try {
      const result = await purchaseFn(productId);
      if (result.success) {
        Alert.alert('Welcome to HEEL Premium!', 'All training content is now unlocked.', [{ text: "Let's Train!" }]);
      } else if (result.error === 'pending' || result.error === 'listener') {
        console.log('IAP: Purchase in progress via listener');
      } else if (result.error && result.error !== 'cancelled') {
        Alert.alert('Purchase Issue', result.error);
      }
    } catch (e: any) {
      console.error('Purchase error:', e);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally { setPurchasing(false); }
  };

  // ── RESTORE ──
  const handleRestore = async () => {
    if (!restoreFn || typeof restoreFn !== 'function') {
      Alert.alert('Store Unavailable', 'Could not connect to the App Store. Please restart the app.');
      return;
    }
    setRestoring(true);
    try {
      const result = await restoreFn();
      if (result.success) {
        Alert.alert('Restored!', 'Your premium access has been restored.', [{ text: 'Great!' }]);
      } else {
        Alert.alert('No Subscription Found', "We couldn't find an active subscription for this Apple ID.", [{ text: 'OK' }]);
      }
    } catch (e) { Alert.alert('Error', 'Could not restore purchases. Please try again.'); }
    finally { setRestoring(false); }
  };

  // ── PRICING ──
  const getPrice = (type: string) => {
    if (products && products.length > 0) {
      const product = products.find((p) => p.type === type);
      if (product) return product.price;
    }
    return type === 'monthly' ? '$9.99' : '$69.99';
  };
  const monthlyPrice = getPrice('monthly');
  const annualPrice = getPrice('annual');

  // ── MODALS ──
  const renderBetaCodeModal = () => (
    <Modal visible={showCodeModal} transparent animationType="fade" onRequestClose={() => setShowCodeModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalClose} onPress={() => { setShowCodeModal(false); setCodeInput(''); setCodeError(false); }}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <Ionicons name="key-outline" size={40} color={colors.accent} />
          <Text style={styles.modalTitle}>Enter Access Code</Text>
          <Text style={styles.modalSubtitle}>Enter your code to unlock premium</Text>
          <TextInput style={[styles.codeInput, codeError && styles.codeInputError]} value={codeInput} onChangeText={(t) => { setCodeInput(t); setCodeError(false); }} placeholder="Enter code" placeholderTextColor={colors.textSecondary} autoCapitalize="characters" autoCorrect={false} maxLength={10} returnKeyType="done" onSubmitEditing={handleBetaCodeSubmit} />
          {codeError && <Text style={styles.codeErrorText}>Invalid code. Try again.</Text>}
          <TouchableOpacity style={styles.codeSubmitButton} onPress={handleBetaCodeSubmit}><Text style={styles.codeSubmitText}>Submit</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderTestCodeModal = () => (
    <Modal visible={showTestCodeModal} transparent animationType="fade" onRequestClose={() => setShowTestCodeModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalClose} onPress={() => { setShowTestCodeModal(false); setTestCodeInput(''); setTestCodeError(false); }}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <Ionicons name="flask-outline" size={40} color={colors.accent} />
          <Text style={styles.modalTitle}>Testing Access</Text>
          <Text style={styles.modalSubtitle}>Enter code to unlock</Text>
          <TextInput style={[styles.codeInput, testCodeError && styles.codeInputError]} value={testCodeInput} onChangeText={(t) => { setTestCodeInput(t); setTestCodeError(false); }} placeholder="Enter code" placeholderTextColor={colors.textSecondary} autoCapitalize="characters" autoCorrect={false} maxLength={10} returnKeyType="done" onSubmitEditing={handleTestCodeSubmit} />
          {testCodeError && <Text style={styles.codeErrorText}>Invalid code. Try again.</Text>}
          <TouchableOpacity style={styles.codeSubmitButton} onPress={handleTestCodeSubmit}><Text style={styles.codeSubmitText}>Submit</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // ============================================================================
  // PREMIUM ACTIVE STATE
  // ============================================================================
  if (hasPremium) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.logoContainer} onPress={handlePawTap} activeOpacity={0.8}>
            <View style={styles.logoBadge}><Ionicons name="paw" size={44} color={colors.accent} /></View>
          </TouchableOpacity>
          <Text style={[styles.activeTitle, { color: colors.accent }]}>Premium Active</Text>
          <Text style={styles.activeSubtitle}>{dogName}'s full training program is unlocked</Text>
          <View style={styles.benefitsSection}>
            <Text style={styles.sectionLabel}>YOUR BENEFITS</Text>
            {benefits.map((b, i) => (
              <View key={i} style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={22} color={colors.accent} />
                <Text style={styles.benefitText}>{b.text}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.manageButton} onPress={() => Linking.openURL('https://apps.apple.com/account/subscriptions')}>
            <Text style={styles.manageText}>Manage Subscription</Text>
            <Ionicons name="open-outline" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </ScrollView>
        {renderBetaCodeModal()}
        {renderTestCodeModal()}
      </View>
    );
  }

  // ============================================================================
  // FREE USER STATE
  // ============================================================================
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.logoContainer} onPress={handlePawTap} activeOpacity={0.8}>
          <View style={styles.logoBadge}><Ionicons name="paw" size={44} color={colors.accent} /></View>
        </TouchableOpacity>

        {/* Headline — coach voice */}
        <Text style={styles.headline}>
          {hasProfile ? `Unlock ${dogName}'s Full Training Program` : 'Unlock the Full Training Program'}
        </Text>
        <Text style={styles.subheadline}>
          {hasProfile
            ? `You've already seen what HEEL can do. The full program gives ${dogName} a real training path, not just lessons to browse. Structure changes everything.`
            : 'A real training program, not just lessons to browse. Structure changes everything.'
          }
        </Text>

        {/* Plans */}
        <View style={styles.plansContainer}>
          <TouchableOpacity style={[styles.planCard, selectedPlan === 'annual' && styles.planCardSelected]} onPress={() => setSelectedPlan('annual')} activeOpacity={0.7}>
            <View style={styles.planBadge}><Text style={styles.planBadgeText}>BEST VALUE</Text></View>
            <View style={styles.planRadio}><Ionicons name={selectedPlan === 'annual' ? 'radio-button-on' : 'radio-button-off'} size={22} color={selectedPlan === 'annual' ? colors.accent : colors.textSecondary} /></View>
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>Annual</Text>
              <Text style={styles.planPrice}>{annualPrice}/year</Text>
              <Text style={styles.planSubtext}>Just $5.83/month</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]} onPress={() => setSelectedPlan('monthly')} activeOpacity={0.7}>
            <View style={styles.planRadio}><Ionicons name={selectedPlan === 'monthly' ? 'radio-button-on' : 'radio-button-off'} size={22} color={selectedPlan === 'monthly' ? colors.accent : colors.textSecondary} /></View>
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>Monthly</Text>
              <Text style={styles.planPrice}>{monthlyPrice}/month</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionLabel}>
            {hasProfile ? `WHY ${dogName.toUpperCase()} DESERVES THIS` : 'WHY GO PREMIUM'}
          </Text>
          {benefits.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <Ionicons name={b.icon} size={22} color={colors.accent} />
              <Text style={styles.benefitText}>{b.text}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity style={[styles.purchaseButton, purchasing && styles.purchaseButtonDisabled]} onPress={handlePurchase} disabled={purchasing} activeOpacity={0.8}>
          {purchasing ? <ActivityIndicator color={colors.background} size="small" /> : (
            <>
              <Ionicons name="lock-open" size={22} color={colors.background} />
              <Text style={styles.purchaseButtonText}>
                {selectedPlan === 'annual'
                  ? `Start Free Trial`
                  : `Subscribe · ${monthlyPrice}/mo`}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.trialNote}>
          {selectedPlan === 'annual' ? `3-day free trial, then just $5.83/month (billed annually).` : `${monthlyPrice} billed monthly. No commitment.`}
          {'\n'}Cancel anytime. No questions asked.
        </Text>

        {/* Restore — 7 taps opens test code */}
        <TouchableOpacity style={styles.restoreButton} onPress={handleRestoreTap} disabled={restoring}>
          {restoring ? <ActivityIndicator color={colors.textSecondary} size="small" /> : <Text style={styles.restoreText}>Restore Purchases</Text>}
        </TouchableOpacity>

        {/* Bottom note — simple contrast pitch */}
        <View style={styles.freeNote}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.freeNoteText}>
            Most people see a difference in the first week. The free lessons are a great start, but the real transformation happens when training has structure. That's what Premium is built for.
          </Text>
        </View>

        <View style={styles.legalRow}>
          <TouchableOpacity onPress={() => Linking.openURL('https://heeldogtraining.com/pages/terms-of-service')}><Text style={styles.legalLink}>Terms of Service</Text></TouchableOpacity>
          <Text style={styles.legalSep}>•</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://heeldogtraining.com/pages/heel-privacy-policy')}><Text style={styles.legalLink}>Privacy Policy</Text></TouchableOpacity>
        </View>
      </ScrollView>
      {renderBetaCodeModal()}
      {renderTestCodeModal()}
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: spacing.xl, paddingTop: 60, paddingBottom: 40, alignItems: 'center' },
  logoContainer: { marginBottom: spacing.lg },
  logoBadge: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },

  headline: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  subheadline: { fontSize: typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xxl, lineHeight: 22, paddingHorizontal: spacing.md },

  plansContainer: { width: '100%', gap: spacing.md, marginBottom: spacing.xxl },
  planCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBackground, borderRadius: 14, padding: spacing.lg, borderWidth: 2, borderColor: 'transparent' },
  planCardSelected: { borderColor: colors.accent },
  planBadge: { position: 'absolute', top: -10, right: 16, backgroundColor: colors.accent, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  planBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  planRadio: { marginRight: spacing.md },
  planInfo: { flex: 1 },
  planTitle: { fontSize: typography.h4, fontWeight: '600', color: colors.textPrimary },
  planPrice: { fontSize: typography.body, fontWeight: '600', color: colors.accent, marginTop: 2 },
  planSubtext: { fontSize: typography.caption, color: colors.textSecondary, marginTop: 2 },

  benefitsSection: { width: '100%', marginBottom: spacing.xl },
  sectionLabel: { fontSize: typography.caption, fontWeight: '700', color: colors.textSecondary, letterSpacing: 1, marginBottom: spacing.md },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  benefitText: { fontSize: typography.body, color: colors.textPrimary, flex: 1 },

  purchaseButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 16, paddingHorizontal: spacing.xxl, width: '100%', marginBottom: spacing.md },
  purchaseButtonDisabled: { opacity: 0.6 },
  purchaseButtonText: { fontSize: typography.h4, fontWeight: '700', color: colors.background },
  trialNote: { fontSize: typography.caption, color: colors.textSecondary, textAlign: 'center', lineHeight: 18, marginBottom: spacing.lg },
  restoreButton: { paddingVertical: spacing.md, marginBottom: spacing.lg },
  restoreText: { fontSize: typography.body, color: colors.textSecondary, textDecorationLine: 'underline' },

  freeNote: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.cardBackground, borderRadius: 12, padding: spacing.lg, marginBottom: spacing.lg, width: '100%' },
  freeNoteText: { fontSize: typography.caption, color: colors.textSecondary, flex: 1, lineHeight: 18 },

  legalRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  legalLink: { fontSize: typography.caption, color: colors.textSecondary, textDecorationLine: 'underline' },
  legalSep: { color: colors.textSecondary, fontSize: typography.caption },

  activeTitle: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: spacing.sm },
  activeSubtitle: { fontSize: typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xxl },
  manageButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg, marginTop: spacing.md },
  manageText: { fontSize: typography.body, color: colors.textSecondary },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  modalContent: { backgroundColor: colors.cardBackground, borderRadius: 20, padding: spacing.xxl, width: '100%', maxWidth: 340, alignItems: 'center' },
  modalClose: { position: 'absolute', top: 12, right: 12, padding: spacing.sm },
  modalTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.sm },
  modalSubtitle: { fontSize: typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 20 },
  codeInput: { width: '100%', backgroundColor: colors.background, borderRadius: 12, padding: spacing.lg, fontSize: 18, fontWeight: '600', color: colors.textPrimary, textAlign: 'center', letterSpacing: 3, borderWidth: 2, borderColor: 'transparent', marginBottom: spacing.md },
  codeInputError: { borderColor: '#FF4444' },
  codeErrorText: { fontSize: typography.caption, color: '#FF4444', marginBottom: spacing.md },
  codeSubmitButton: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, paddingHorizontal: spacing.xxl, width: '100%', alignItems: 'center' },
  codeSubmitText: { fontSize: typography.body, fontWeight: '700', color: colors.background },
});
