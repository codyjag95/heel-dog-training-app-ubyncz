
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function SettingsScreen() {
  const router = useRouter();
  const { dogProfile, userProgress, allDogs, switchDog, removeDog, togglePremium } = useApp();
  const [adminTapCount, setAdminTapCount] = useState(0);

  const handleUpgradeToPremium = () => {
    Alert.alert(
      'Upgrade to Premium',
      'Get full access to all lessons, no ads, and advanced training content.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => console.log('Upgrade pressed') },
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
    if (!userProgress.isPremium && allDogs.length >= 1) {
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

  // Debug function to toggle premium (remove in production)
  const handleDebugTogglePremium = () => {
    togglePremium();
    Alert.alert(
      'Debug',
      `Premium ${!userProgress.isPremium ? 'enabled' : 'disabled'}`,
      [{ text: 'OK' }]
    );
  };

  const handleAppVersionTap = () => {
    const newCount = adminTapCount + 1;
    setAdminTapCount(newCount);
    
    if (newCount >= 7) {
      setAdminTapCount(0);
      router.push('/admin-waitlist');
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
          </View>
        )}

        {/* Multi-Dog Management (Premium) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Manage Dogs</Text>
            {userProgress.isPremium && (
              <Text style={styles.dogCount}>{allDogs.length} dog{allDogs.length !== 1 ? 's' : ''}</Text>
            )}
          </View>

          {userProgress.isPremium && allDogs.length > 1 && (
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
            {!userProgress.isPremium && (
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

        {/* Debug Section (Remove in production) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Debug</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleDebugTogglePremium}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="wrench.fill"
              android_material_icon_name="build"
              size={24}
              color={colors.text}
            />
            <Text style={styles.settingText}>Toggle Premium (Debug)</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <TouchableOpacity 
          style={styles.appInfo}
          onPress={handleAppVersionTap}
          activeOpacity={0.8}
        >
          <Text style={styles.appInfoText}>HEEL v1.0.0</Text>
          <Text style={styles.appInfoText}>Modern Dog Training</Text>
        </TouchableOpacity>
      </ScrollView>
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
});
