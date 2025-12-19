
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const router = useRouter();
  const { dogProfile, userProgress, allDogs, switchDog, removeDog, togglePremium, toggleBetaOverride, isPremiumUser } = useApp();
  
  const [logoTapCount, setLogoTapCount] = useState(0);
  const [showBetaTools, setShowBetaTools] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [betaCode, setBetaCode] = useState('');

  const BETA_CODE = 'HEEL2024'; // Secret code for beta access

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

  const handleAddDog = () => {
    const isPremium = isPremiumUser();
    if (!isPremium && allDogs.length >= 1) {
      Alert.alert(
        'Premium Feature',
        'Multi-dog management is a Premium feature. Upgrade to add more dogs.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => router.push('/(tabs)/premium') },
        ]
      );
      return;
    }

    Alert.alert(
      'Add Dog',
      'This feature will allow you to add a new dog profile.',
      [{ text: 'OK' }]
    );
  };

  const handleSwitchDog = (dogId: string) => {
    switchDog(dogId);
    Alert.alert('Switched', `Now training with ${allDogs.find(d => d.id === dogId)?.name}`);
  };

  const handleRemoveDog = (dogId: string, dogName: string) => {
    Alert.alert(
      'Remove Dog',
      `Are you sure you want to remove ${dogName}? This will delete all training data for this dog.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeDog(dogId);
            Alert.alert('Removed', `${dogName} has been removed`);
          },
        },
      ]
    );
  };

  const handleLogoTap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newCount = logoTapCount + 1;
    setLogoTapCount(newCount);
    
    if (newCount >= 7) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowBetaTools(true);
      setLogoTapCount(0);
    }
  };

  const handleEnterCode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowCodeModal(true);
  };

  const handleSubmitCode = () => {
    if (betaCode.toUpperCase() === BETA_CODE) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowBetaTools(true);
      setShowCodeModal(false);
      setBetaCode('');
      Alert.alert('Success', 'Beta Tools unlocked!');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Invalid Code', 'Please try again.');
      setBetaCode('');
    }
  };

  const handleToggleBetaPremium = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleBetaOverride();
    const newStatus = !userProgress.beta_override;
    Alert.alert(
      'Beta Premium',
      `Beta Premium ${newStatus ? 'enabled' : 'disabled'}`,
      [{ text: 'OK' }]
    );
  };

  const isPremium = isPremiumUser();

  return (
    <View style={[commonStyles.container]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with tappable logo */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <TouchableOpacity
            onPress={handleLogoTap}
            activeOpacity={0.9}
            style={styles.logoContainer}
          >
            <IconSymbol
              ios_icon_name="pawprint.fill"
              android_material_icon_name="pets"
              size={32}
              color={colors.primary}
            />
          </TouchableOpacity>
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
          </View>
        )}

        {/* Multi-Dog Management (Premium) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Manage Dogs</Text>
            {isPremium && (
              <Text style={styles.dogCount}>{allDogs.length} dog{allDogs.length !== 1 ? 's' : ''}</Text>
            )}
          </View>

          {isPremium && allDogs.length > 1 && (
            <View style={styles.dogsListCard}>
              {allDogs.map((dog, index) => (
                <View key={index} style={styles.dogListItem}>
                  <View style={styles.dogListItemLeft}>
                    <IconSymbol
                      ios_icon_name="pawprint.fill"
                      android_material_icon_name="pets"
                      size={20}
                      color={dog.id === dogProfile?.id ? colors.primary : colors.textSecondary}
                    />
                    <Text style={[
                      styles.dogListItemName,
                      dog.id === dogProfile?.id && styles.dogListItemNameActive
                    ]}>
                      {dog.name}
                    </Text>
                    {dog.id === dogProfile?.id && (
                      <View style={styles.activeBadge}>
                        <Text style={styles.activeBadgeText}>Active</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.dogListItemActions}>
                    {dog.id !== dogProfile?.id && (
                      <TouchableOpacity
                        style={styles.dogActionButton}
                        onPress={() => handleSwitchDog(dog.id!)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.dogActionButtonText}>Switch</Text>
                      </TouchableOpacity>
                    )}
                    {allDogs.length > 1 && (
                      <TouchableOpacity
                        style={[styles.dogActionButton, styles.dogActionButtonDanger]}
                        onPress={() => handleRemoveDog(dog.id!, dog.name)}
                        activeOpacity={0.7}
                      >
                        <IconSymbol
                          ios_icon_name="trash.fill"
                          android_material_icon_name="delete"
                          size={16}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleAddDog}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="plus.circle.fill"
              android_material_icon_name="add-circle"
              size={24}
              color={colors.text}
            />
            <Text style={styles.settingText}>Add Another Dog</Text>
            {!isPremium && (
              <View style={styles.premiumBadge}>
                <IconSymbol
                  ios_icon_name="star.fill"
                  android_material_icon_name="star"
                  size={14}
                  color={colors.text}
                />
              </View>
            )}
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Premium Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium</Text>
          
          {!isPremium ? (
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
              {userProgress.beta_override && (
                <View style={styles.betaBadge}>
                  <Text style={styles.betaBadgeText}>BETA</Text>
                </View>
              )}
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

        {/* Beta Tools Section (Hidden) */}
        {showBetaTools && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Beta Tools</Text>
            <Text style={styles.betaDescription}>
              For testers only. Works on TestFlight, Expo web, and shared demo links.
            </Text>
            
            <TouchableOpacity
              style={[styles.settingItem, styles.betaItem]}
              onPress={handleToggleBetaPremium}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name={userProgress.beta_override ? 'checkmark.circle.fill' : 'circle'}
                android_material_icon_name={userProgress.beta_override ? 'check-circle' : 'radio-button-unchecked'}
                size={24}
                color={userProgress.beta_override ? colors.primary : colors.text}
              />
              <Text style={styles.settingText}>
                {userProgress.beta_override ? 'Disable Beta Premium' : 'Unlock Premium (Beta)'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingItem, styles.betaItem]}
              onPress={handleEnterCode}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="key.fill"
                android_material_icon_name="vpn-key"
                size={24}
                color={colors.text}
              />
              <Text style={styles.settingText}>Enter Beta Code</Text>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        )}

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
          {!showBetaTools && (
            <Text style={styles.appInfoHint}>Tap the paw icon 7 times for beta tools</Text>
          )}
        </View>
      </ScrollView>

      {/* Beta Code Modal */}
      <Modal
        visible={showCodeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCodeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.codeModalContainer}>
            <Text style={styles.codeModalTitle}>Enter Beta Code</Text>
            <TextInput
              style={styles.codeInput}
              placeholder="Enter code..."
              placeholderTextColor={colors.textSecondary}
              value={betaCode}
              onChangeText={setBetaCode}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <View style={styles.codeModalButtons}>
              <TouchableOpacity
                style={[styles.codeModalButton, styles.codeModalButtonCancel]}
                onPress={() => {
                  setShowCodeModal(false);
                  setBetaCode('');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.codeModalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.codeModalButton, styles.codeModalButtonSubmit]}
                onPress={handleSubmitCode}
                activeOpacity={0.7}
              >
                <Text style={styles.codeModalButtonText}>Submit</Text>
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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 2,
  },
  logoContainer: {
    padding: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dogCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  betaDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
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
  dogsListCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  dogListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  dogListItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dogListItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  dogListItemNameActive: {
    color: colors.primary,
  },
  activeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  dogListItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dogActionButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  dogActionButtonDanger: {
    backgroundColor: 'transparent',
  },
  dogActionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
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
  betaItem: {
    borderWidth: 2,
    borderColor: colors.primary,
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
    flex: 1,
  },
  betaBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  betaBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
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
  appInfoHint: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  codeModalContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 350,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.4)',
    elevation: 8,
  },
  codeModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  codeInput: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  codeModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  codeModalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  codeModalButtonCancel: {
    backgroundColor: colors.secondary,
  },
  codeModalButtonSubmit: {
    backgroundColor: colors.primary,
  },
  codeModalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  codeModalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },
});
