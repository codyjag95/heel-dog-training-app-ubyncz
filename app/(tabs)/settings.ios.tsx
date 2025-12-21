
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function SettingsScreen() {
  const router = useRouter();
  const { dogProfile, userProgress, togglePremium } = useApp();
  const [starTapCount, setStarTapCount] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockCode, setUnlockCode] = useState('');

  const handleUpgradeToPremium = () => {
    Alert.alert(
      'Upgrade to Premium',
      'Get full access to all lessons, no ads, and advanced training content.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => router.push('/(tabs)/premium') },
      ]
    );
  };

  const handleRestorePurchase = () => {
    Alert.alert(
      'Restore Purchase',
      'Restoring your previous purchases...',
      [{ text: 'OK' }]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Email us at support@heelapp.com',
      [{ text: 'OK' }]
    );
  };

  const handleManageDogs = () => {
    Alert.alert(
      'Manage Dogs',
      'Dog management coming soon! You can add multiple dogs with Premium.',
      [{ text: 'OK' }]
    );
  };

  // Hidden admin unlock - tap star icon 5 times
  const handleStarTap = () => {
    const newCount = starTapCount + 1;
    setStarTapCount(newCount);
    
    if (newCount >= 5) {
      setShowUnlockModal(true);
      setStarTapCount(0);
    }
  };

  const handleUnlockSubmit = () => {
    if (unlockCode.toUpperCase() === 'HEEL2025') {
      togglePremium();
      setShowUnlockModal(false);
      setUnlockCode('');
      Alert.alert(
        'Premium Unlocked',
        'Premium features have been activated!',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Invalid Code',
        'The unlock code you entered is incorrect.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={[commonStyles.container]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Dog Profile Section */}
        {dogProfile && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dog Profile</Text>
            <View style={styles.profileCard}>
              <View style={styles.profileIcon}>
                <IconSymbol
                  ios_icon_name="pawprint.fill"
                  android_material_icon_name="pets"
                  size={32}
                  color={colors.primary}
                />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{dogProfile.name}</Text>
                {dogProfile.age && (
                  <Text style={styles.profileDetail}>Age: {dogProfile.age}</Text>
                )}
                {dogProfile.breed && (
                  <Text style={styles.profileDetail}>Breed: {dogProfile.breed}</Text>
                )}
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleManageDogs}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="person.2.fill"
                android_material_icon_name="group"
                size={24}
                color={colors.text}
              />
              <Text style={styles.settingText}>Manage Dogs</Text>
              {!userProgress.isPremium && (
                <TouchableOpacity onPress={handleStarTap} activeOpacity={1}>
                  <View style={styles.premiumBadge}>
                    <IconSymbol
                      ios_icon_name="star.fill"
                      android_material_icon_name="star"
                      size={14}
                      color={colors.text}
                    />
                  </View>
                </TouchableOpacity>
              )}
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Premium Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium</Text>
          
          {!userProgress.isPremium ? (
            <View style={styles.premiumCard}>
              <View style={styles.premiumHeader}>
                <IconSymbol
                  ios_icon_name="star.fill"
                  android_material_icon_name="star"
                  size={32}
                  color={colors.primary}
                />
                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
              </View>
              <Text style={styles.premiumDescription}>
                Unlock all lessons, remove ads, and get advanced training content
              </Text>
              <TouchableOpacity
                style={styles.premiumButton}
                onPress={handleUpgradeToPremium}
                activeOpacity={0.8}
              >
                <Text style={styles.premiumButtonText}>Upgrade Now</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.premiumActiveCard}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={32}
                color={colors.primary}
              />
              <Text style={styles.premiumActiveText}>Premium Active</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleRestorePurchase}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="arrow.clockwise"
              android_material_icon_name="refresh"
              size={24}
              color={colors.text}
            />
            <Text style={styles.settingText}>Restore Purchase</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleContactSupport}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="envelope.fill"
              android_material_icon_name="email"
              size={24}
              color={colors.text}
            />
            <Text style={styles.settingText}>Contact Support</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>HEEL v1.0.0</Text>
          <Text style={styles.appInfoText}>Modern Dog Training</Text>
        </View>
      </ScrollView>

      {/* Hidden Admin Unlock Modal */}
      <Modal
        visible={showUnlockModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUnlockModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <IconSymbol
              ios_icon_name="lock.open.fill"
              android_material_icon_name="lock-open"
              size={48}
              color={colors.primary}
            />
            <Text style={styles.modalTitle}>Premium Unlock</Text>
            <Text style={styles.modalText}>
              Enter the unlock code to activate premium features
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Enter code"
              placeholderTextColor={colors.textSecondary}
              value={unlockCode}
              onChangeText={setUnlockCode}
              autoCapitalize="characters"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleUnlockSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>Unlock</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setShowUnlockModal(false);
                setUnlockCode('');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 2,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profileDetail: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  settingItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginLeft: 12,
  },
  premiumBadge: {
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  premiumCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
  },
  premiumDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  premiumButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  premiumButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  premiumActiveCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  premiumActiveText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  appInfoText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.5)',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalInput: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    width: '100%',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  modalCloseButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
