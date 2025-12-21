
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

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

export default function AdminWaitlistScreen() {
  const router = useRouter();
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWaitlist();
  }, []);

  const loadWaitlist = async () => {
    try {
      const data = await AsyncStorage.getItem('premium_waitlist');
      if (data) {
        const parsed = JSON.parse(data);
        setWaitlist(parsed);
      }
    } catch (error) {
      console.error('Error loading waitlist:', error);
      Alert.alert('Error', 'Failed to load waitlist data');
    } finally {
      setLoading(false);
    }
  };

  const exportAsCSV = () => {
    if (waitlist.length === 0) {
      Alert.alert('No Data', 'The waitlist is empty');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Create CSV content
    const headers = 'Email,Wants Push,OneSignal Player ID,Created At,Platform,App Version,Source\n';
    const rows = waitlist.map(entry => {
      return `${entry.email},${entry.wants_push ? 'Yes' : 'No'},${entry.onesignal_player_id || 'N/A'},${entry.created_at},${entry.platform},${entry.app_version},${entry.source}`;
    }).join('\n');

    const csvContent = headers + rows;

    // Share the CSV content
    Share.share({
      message: csvContent,
      title: 'Premium Waitlist Export',
    }).catch(error => {
      console.error('Error sharing CSV:', error);
      Alert.alert('Error', 'Failed to export CSV');
    });
  };

  const exportPushNotificationList = () => {
    const pushUsers = waitlist.filter(entry => entry.wants_push);
    
    if (pushUsers.length === 0) {
      Alert.alert('No Data', 'No users opted in for push notifications');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Create a list of emails who want push notifications
    const pushList = pushUsers.map(entry => entry.email).join('\n');

    Share.share({
      message: `Users who want push notifications (${pushUsers.length}):\n\n${pushList}`,
      title: 'Push Notification List',
    }).catch(error => {
      console.error('Error sharing push list:', error);
      Alert.alert('Error', 'Failed to export push notification list');
    });
  };

  const clearWaitlist = () => {
    Alert.alert(
      'Clear Waitlist',
      'Are you sure you want to delete all waitlist entries? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('premium_waitlist');
              setWaitlist([]);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('Success', 'Waitlist cleared');
            } catch (error) {
              console.error('Error clearing waitlist:', error);
              Alert.alert('Error', 'Failed to clear waitlist');
            }
          },
        },
      ]
    );
  };

  const stats = {
    total: waitlist.length,
    wantsPush: waitlist.filter(e => e.wants_push).length,
    ios: waitlist.filter(e => e.platform === 'ios').length,
    android: waitlist.filter(e => e.platform === 'android').length,
  };

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
        <Text style={styles.headerTitle}>Premium Waitlist</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Signups</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.wantsPush}</Text>
            <Text style={styles.statLabel}>Want Push</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.ios}</Text>
            <Text style={styles.statLabel}>iOS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.android}</Text>
            <Text style={styles.statLabel}>Android</Text>
          </View>
        </View>

        {/* Export Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export Options</Text>
          
          <TouchableOpacity
            style={[buttonStyles.primaryButton, styles.exportButton]}
            onPress={exportAsCSV}
            activeOpacity={0.8}
          >
            <IconSymbol
              ios_icon_name="square.and.arrow.up"
              android_material_icon_name="share"
              size={20}
              color={colors.text}
            />
            <Text style={[buttonStyles.primaryButtonText, styles.exportButtonText]}>
              Export Full CSV
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.primaryButton, styles.exportButton, styles.secondaryButton]}
            onPress={exportPushNotificationList}
            activeOpacity={0.8}
          >
            <IconSymbol
              ios_icon_name="bell.fill"
              android_material_icon_name="notifications"
              size={20}
              color={colors.text}
            />
            <Text style={[buttonStyles.primaryButtonText, styles.exportButtonText]}>
              Export Push List
            </Text>
          </TouchableOpacity>
        </View>

        {/* Waitlist Entries */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Signups</Text>
          
          {loading ? (
            <Text style={styles.emptyText}>Loading...</Text>
          ) : waitlist.length === 0 ? (
            <Text style={styles.emptyText}>No signups yet</Text>
          ) : (
            waitlist.slice().reverse().map((entry, index) => (
              <View key={index} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryEmail}>{entry.email}</Text>
                  {entry.wants_push && (
                    <IconSymbol
                      ios_icon_name="bell.fill"
                      android_material_icon_name="notifications"
                      size={16}
                      color={colors.primary}
                    />
                  )}
                </View>
                <View style={styles.entryMeta}>
                  <Text style={styles.entryMetaText}>
                    {entry.platform.toUpperCase()} • {new Date(entry.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Danger Zone */}
        {waitlist.length > 0 && (
          <View style={styles.dangerSection}>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={clearWaitlist}
              activeOpacity={0.8}
            >
              <IconSymbol
                ios_icon_name="trash.fill"
                android_material_icon_name="delete"
                size={20}
                color={colors.text}
              />
              <Text style={styles.dangerButtonText}>Clear All Data</Text>
            </TouchableOpacity>
          </View>
        )}
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  exportButtonText: {
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  entryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryEmail: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryMetaText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 32,
  },
  dangerSection: {
    marginTop: 48,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
  },
  dangerButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
});
