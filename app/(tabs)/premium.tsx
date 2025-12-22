
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';

export default function PremiumScreen() {
  const router = useRouter();
  const { userProgress, togglePremium } = useApp();
  const [tapCount, setTapCount] = useState(0);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeInput, setCodeInput] = useState('');

  const handleStarPress = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    
    console.log('Star tapped:', newCount, 'times');
    
    if (newCount >= 7) {
      setShowCodeModal(true);
      setTapCount(0);
    }
  };

  const handleCodeSubmit = () => {
    if (codeInput.toUpperCase() === 'HEEL') {
      togglePremium();
      setShowCodeModal(false);
      setCodeInput('');
      Alert.alert(
        'Premium Unlocked! 🎉',
        'All premium features are now available for testing.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Incorrect Code',
        'Please try again.',
        [{ text: 'OK' }]
      );
      setCodeInput('');
    }
  };

  const handleJoinWaitlist = () => {
    router.push('/premium-coming-soon');
  };

  const features = [
    {
      icon: { ios: 'map.fill', android: 'map' },
      title: 'Personalized Training Roadmap',
      description: 'Get a structured training plan based on your dog\'s quiz results',
    },
    {
      icon: { ios: 'person.2.fill', android: 'group' },
      title: 'Multi-Dog Management',
      description: 'Track progress for multiple dogs with individual profiles',
    },
    {
      icon: { ios: 'chart.bar.fill', android: 'bar-chart' },
      title: 'Advanced Progress Insights',
      description: 'See trends, patterns, and personalized recommendations',
    },
    {
      icon: { ios: 'list.bullet.clipboard.fill', android: 'assignment' },
      title: 'Training Session Templates',
      description: 'Pre-built sessions like "5-Minute Reset" and "Energy Drain"',
    },
    {
      icon: { ios: 'person.fill', android: 'person' },
      title: 'Handler Skills Module',
      description: 'Improve your training technique with handler-focused lessons',
    },
    {
      icon: { ios: 'arrow.down.circle.fill', android: 'cloud-download' },
      title: 'Offline Access',
      description: 'Download lessons to train anywhere without internet',
    },
    {
      icon: { ios: 'globe', android: 'public' },
      title: 'Real-World Proofing',
      description: 'Advanced lessons for training in distracting environments',
    },
    {
      icon: { ios: 'heart.fill', android: 'favorite' },
      title: 'Service Dog Pre-Class',
      description: 'Foundational skills for service dog preparation',
    },
    {
      icon: { ios: 'sparkles', android: 'auto-awesome' },
      title: 'No Advertisements',
      description: 'Enjoy an uninterrupted, ad-free training experience',
    },
    {
      icon: { ios: 'star.fill', android: 'star' },
      title: 'Priority Support',
      description: 'Get help faster with premium customer support',
    },
  ];

  return (
    <View style={[commonStyles.container]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleStarPress} activeOpacity={0.8}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={48}
              color={colors.primary}
            />
          </TouchableOpacity>
          <Text style={styles.title}>HEEL Premium</Text>
          <Text style={styles.subtitle}>Coming Soon</Text>
        </View>

        {userProgress.isPremium && (
          <View style={styles.activeCard}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.activeText}>You&apos;re a Premium Member!</Text>
          </View>
        )}

        {/* Coming Soon Banner */}
        {!userProgress.isPremium && (
          <View style={styles.comingSoonBanner}>
            <IconSymbol
              ios_icon_name="clock.fill"
              android_material_icon_name="schedule"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.comingSoonTitle}>Premium Coming Soon</Text>
            <Text style={styles.comingSoonText}>
              Premium will unlock advanced lessons, roadmaps, and analytics.
            </Text>
          </View>
        )}

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <IconSymbol
                  ios_icon_name={feature.icon.ios}
                  android_material_icon_name={feature.icon.android}
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {!userProgress.isPremium && (
          <>
            {/* CTA Button */}
            <TouchableOpacity 
              style={styles.ctaButton} 
              activeOpacity={0.8}
              onPress={handleJoinWaitlist}
            >
              <Text style={styles.ctaButtonText}>Join the Waitlist</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Join the waitlist to be notified when Premium launches.
            </Text>
          </>
        )}
      </ScrollView>

      {/* Hidden Code Entry Modal */}
      <Modal
        visible={showCodeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowCodeModal(false);
          setCodeInput('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tester Unlock</Text>
            <Text style={styles.modalSubtitle}>Enter the secret code:</Text>
            
            <TextInput
              style={styles.codeInput}
              value={codeInput}
              onChangeText={setCodeInput}
              placeholder="Enter code"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={10}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowCodeModal(false);
                  setCodeInput('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSubmit]}
                onPress={handleCodeSubmit}
              >
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  activeCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: colors.primary,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  activeText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
  },
  comingSoonBanner: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: colors.primary,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  featureCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(255, 59, 48, 0.3)',
    elevation: 4,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  disclaimer: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.5)',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  codeInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.secondary,
  },
  modalButtonSubmit: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});
