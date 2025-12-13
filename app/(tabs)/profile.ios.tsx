
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  const { dogProfile, userProgress } = useApp();

  const settingsOptions = [
    { icon: 'bell.fill', label: 'Notifications', androidIcon: 'notifications' },
    { icon: 'questionmark.circle.fill', label: 'Help & Support', androidIcon: 'help' },
    { icon: 'doc.text.fill', label: 'Terms & Privacy', androidIcon: 'description' },
    { icon: 'info.circle.fill', label: 'About HEEL', androidIcon: 'info' },
  ];

  return (
    <View style={[commonStyles.container]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profile</Text>

        {/* Dog Profile Card */}
        {dogProfile && (
          <View style={styles.profileCard}>
            <View style={styles.profileImageContainer}>
              {dogProfile.imageUrl ? (
                <Image source={{ uri: dogProfile.imageUrl }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <IconSymbol
                    ios_icon_name="pawprint.fill"
                    android_material_icon_name="pets"
                    size={48}
                    color={colors.primary}
                  />
                </View>
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{dogProfile.name}</Text>
              {dogProfile.breed && (
                <Text style={styles.profileDetail}>{dogProfile.breed}</Text>
              )}
              {dogProfile.age && (
                <Text style={styles.profileDetail}>{dogProfile.age} years old</Text>
              )}
            </View>
            <TouchableOpacity style={styles.editButton}>
              <IconSymbol
                ios_icon_name="pencil"
                android_material_icon_name="edit"
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Account Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <IconSymbol
              ios_icon_name={userProgress.isPremium ? 'star.fill' : 'star'}
              android_material_icon_name={userProgress.isPremium ? 'star' : 'star-border'}
              size={24}
              color={colors.primary}
            />
            <Text style={styles.statusText}>
              {userProgress.isPremium ? 'Premium Member' : 'Free Account'}
            </Text>
          </View>
          {!userProgress.isPremium && (
            <TouchableOpacity style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Settings Options */}
        <View style={styles.settingsSection}>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity key={index} style={styles.settingItem} activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <IconSymbol
                  ios_icon_name={option.icon}
                  android_material_icon_name={option.androidIcon}
                  size={24}
                  color={colors.text}
                />
                <Text style={styles.settingLabel}>{option.label}</Text>
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  signOutButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
});
