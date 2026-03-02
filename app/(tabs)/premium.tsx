import React, { useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert,
  ActivityIndicator, Linking, TextInput, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../../contexts/AppContext';
import { colors, typography, spacing } from '../../data/darkTheme';

const GOLD = '#D2AF26';
const BETA_CODE = 'HEEL247';
const TAP_THRESHOLD_ACTIVATE = 19;
const TAP_THRESHOLD_DEACTIVATE = 5;

const PRODUCT_IDS = {
  MONTHLY: 'com.codyjag95.heel.premium.monthly',
  ANNUAL: 'com.codyjag95.heel.premium.annual',
};

const benefits = [
  { icon: 'lock-open-outline', text: '69+ advanced lessons across all categories' },
  { icon: 'paw-outline', text: 'Full access to all training categories' },
  { icon: 'trophy-outline', text: 'Premium techniques: proofing, service prep, handler skills' },
  { icon: 'sparkles-outline', text: 'New categories & lessons added regularly' },
  { icon: 'heart-outline', text: 'Support independent, bond-based dog training' },
];

const comingSoon = [
  'Personalized training roadmap',
  'Progress tracking & analytics',
  'More lessons & categories',
  'Multiple dog profiles',
  'And more!',
];

export default function PremiumScreen() {
  const appContext = useApp();
  const hasPremium = appContext.hasPremium;
  const setHasPremium = appContext.setHasPremium;
  const products = appContext.products || [];
  const purchaseFn = appContext.purchase;
  const restoreFn = appContext.restore;
  const iapReady = appContext.iapReady || false;

  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [tapCount, setTapCount] = useState(0);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState(false);

  const handlePawTap = useCallback(() => {
    const newCount = tapCount + 1;
    const threshold = hasPremium ? TAP_THRESHOLD_DEACTIVATE : TAP_THRESHOLD_ACTIVATE;
    if (newCount >= threshold) {
      if (hasPremium) { deactivateBeta(); }
      else { setShowCodeModal(true); setCodeInput(''); setCodeError(false); }
      setTapCount(0);
    } else {
      setTapCount(newCount);
      setTimeout(() => setTapCount(0), 4000);
    }
  }, [tapCount, hasPremium]);

  const handleCodeSubmit = async () => {
    if (codeInput.trim().toUpperCase() === BETA_CODE) {
      setShowCodeModal(false); setCodeInput(''); setCodeError(false);
      await activateBeta();
    } else { setCodeError(true); setCodeInput(''); }
  };

  const activateBeta = async () => {
    try {
      await AsyncStorage.setItem('@heel_has_premium', 'true');
      await AsyncStorage.setItem('@heel_beta_tester', 'true');
      setHasPremium(true);
      Alert.alert('Welcome to HEEL Premium!', 'All premium content is now unlocked.', [{ text: "Let's Train!" }]);
    } catch (e) { console.error('Beta activation failed:', e); }
  };

  const deactivateBeta = async () => {
    try {
      await AsyncStorage.setItem('@heel_has_premium', 'false');
      await AsyncStorage.removeItem('@heel_beta_tester');
      setHasPremium(false);
      Alert.alert('Premium Deactivated', 'Viewing app as free user.', [{ text: 'Got it!' }]);
    } catch (e) { console.error('Beta deactivation failed:', e); }
  };

  // ================================================================
  // PURCHASE HANDLER
  // Handles both direct-return (older IAP) and listener-based (v12+)
  // ================================================================
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
        // Payment sheet shown — purchase will be confirmed via listener in AppContext
        // Don't show any error, just stop the spinner
        console.log('IAP: Purchase in progress via listener');
      } else if (result.error && result.error !== 'cancelled') {
        Alert.alert('Purchase Issue', result.error);
      }
    } catch (e: any) {
      console.error('Purchase error:', e);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
    finally { setPurchasing(false); }
	};
  

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

  const getPrice = (type: string) => {
    if (products && products.length > 0) {
      const product = products.find((p) => p.type === type);
      if (product) return product.price;
    }
    return type === 'monthly' ? '$9.99' : '$69.99';
  };

  const monthlyPrice = getPrice('monthly');
  const annualPrice = getPrice('annual');

  const renderCodeModal = () => (
    <Modal visible={showCodeModal} transparent animationType="fade" onRequestClose={() => setShowCodeModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalClose} onPress={() => { setShowCodeModal(false); setCodeInput(''); setCodeError(false); }}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <Ionicons name="key-outline" size={40} color={colors.accent} />
          <Text style={styles.modalTitle}>Enter Access Code</Text>
          <Text style={styles.modalSubtitle}>Enter your beta tester code to unlock premium</Text>
          <TextInput
            style={[styles.codeInput, codeError && styles.codeInputError]}
            value={codeInput}
            onChangeText={(text) => { setCodeInput(text); setCodeError(false); }}
            placeholder="Enter code"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={10}
            returnKeyType="done"
            onSubmitEditing={handleCodeSubmit}
          />
          {codeError && <Text style={styles.codeErrorText}>Invalid code. Try again.</Text>}
          <TouchableOpacity style={styles.codeSubmitButton} onPress={handleCodeSubmit}>
            <Text style={styles.codeSubmitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (hasPremium) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.logoContainer} onPress={handlePawTap} activeOpacity={0.8}>
            <View style={styles.logoBadge}><Ionicons name="paw" size={44} color={colors.background} /></View>
          </TouchableOpacity>
          <Text style={[styles.activeTitle, { color: GOLD }]}>Premium Active</Text>
          <Text style={styles.activeSubtitle}>All training content is unlocked</Text>
          <View style={styles.benefitsSection}>
            <Text style={styles.sectionLabel}>YOUR BENEFITS</Text>
            {benefits.map((b, i) => (
              <View key={i} style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={22} color={colors.accent} />
                <Text style={styles.benefitText}>{b.text}</Text>
              </View>
            ))}
          </View>
          <View style={styles.comingSoonSection}>
            <Text style={styles.sectionLabel}>COMING SOON</Text>
            {comingSoon.map((item, i) => (
              <View key={i} style={styles.benefitRow}>
                <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.comingSoonText}>{item}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.manageButton} onPress={() => Linking.openURL('https://apps.apple.com/account/subscriptions')}>
            <Text style={styles.manageText}>Manage Subscription</Text>
            <Ionicons name="open-outline" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </ScrollView>
        {renderCodeModal()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.logoContainer} onPress={handlePawTap} activeOpacity={0.8}>
          <View style={styles.logoBadge}><Ionicons name="paw" size={44} color={colors.background} /></View>
        </TouchableOpacity>
        <Text style={styles.headline}>Unlock Premium Training</Text>
        <Text style={styles.subheadline}>Take your training to the next level with advanced lessons, exclusive categories, and premium techniques</Text>

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

        <View style={styles.benefitsSection}>
          <Text style={styles.sectionLabel}>WHAT YOU GET</Text>
          {benefits.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <Ionicons name={b.icon} size={22} color={colors.accent} />
              <Text style={styles.benefitText}>{b.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.comingSoonSection}>
          <Text style={styles.sectionLabel}>COMING SOON</Text>
          {comingSoon.map((item, i) => (
            <View key={i} style={styles.benefitRow}>
              <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.comingSoonText}>{item}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={[styles.purchaseButton, purchasing && styles.purchaseButtonDisabled]} onPress={handlePurchase} disabled={purchasing} activeOpacity={0.8}>
          {purchasing ? <ActivityIndicator color={colors.background} size="small" /> : (
            <><Ionicons name="lock-open" size={22} color={colors.background} />
            <Text style={styles.purchaseButtonText}>{selectedPlan === 'annual' ? `Start Free Trial — ${annualPrice}/yr` : `Subscribe — ${monthlyPrice}/mo`}</Text></>
          )}
        </TouchableOpacity>

        <Text style={styles.trialNote}>{selectedPlan === 'annual' ? `3-day free trial, then ${annualPrice}/year.` : `${monthlyPrice} billed monthly. No commitment.`}{'\n'}Cancel anytime in Settings → Subscriptions.</Text>

        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore} disabled={restoring}>
          {restoring ? <ActivityIndicator color={colors.textSecondary} size="small" /> : <Text style={styles.restoreText}>Restore Purchases</Text>}
        </TouchableOpacity>

        <View style={styles.freeNote}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.freeNoteText}>With over 40 lessons across 11 categories completely free, there's plenty to get started. Premium unlocks 69+ additional advanced lessons and more.</Text>
        </View>

        <View style={styles.legalRow}>
          <TouchableOpacity onPress={() => Linking.openURL('https://heeldogtraining.com/pages/terms-of-service')}><Text style={styles.legalLink}>Terms of Service</Text></TouchableOpacity>
          <Text style={styles.legalSep}>•</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://heeldogtraining.com/pages/heel-privacy-policy')}><Text style={styles.legalLink}>Privacy Policy</Text></TouchableOpacity>
        </View>
      </ScrollView>
      {renderCodeModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: spacing.xl, paddingTop: 60, paddingBottom: 40, alignItems: 'center' },
  logoContainer: { marginBottom: spacing.lg },
  logoBadge: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  headline: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  subheadline: { fontSize: typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xxl, lineHeight: 22, paddingHorizontal: spacing.md },
  plansContainer: { width: '100%', gap: spacing.md, marginBottom: spacing.xxl },
  planCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBackground, borderRadius: 14, padding: spacing.lg, borderWidth: 2, borderColor: 'transparent' },
  planCardSelected: { borderColor: colors.accent },
  planBadge: { position: 'absolute', top: -10, right: 16, backgroundColor: GOLD, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  planBadgeText: { fontSize: 11, fontWeight: '700', color: '#000' },
  planRadio: { marginRight: spacing.md },
  planInfo: { flex: 1 },
  planTitle: { fontSize: typography.h4, fontWeight: '600', color: colors.textPrimary },
  planPrice: { fontSize: typography.body, fontWeight: '600', color: colors.accent, marginTop: 2 },
  planSubtext: { fontSize: typography.caption, color: colors.textSecondary, marginTop: 2 },
  benefitsSection: { width: '100%', marginBottom: spacing.xl },
  comingSoonSection: { width: '100%', marginBottom: spacing.xxl, backgroundColor: colors.cardBackground, borderRadius: 14, padding: spacing.lg },
  sectionLabel: { fontSize: typography.caption, fontWeight: '700', color: colors.textSecondary, letterSpacing: 1, marginBottom: spacing.md },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  benefitText: { fontSize: typography.body, color: colors.textPrimary, flex: 1 },
  comingSoonText: { fontSize: typography.body, color: colors.textSecondary, flex: 1 },
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
