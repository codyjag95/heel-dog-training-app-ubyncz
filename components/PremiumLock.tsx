/**
 * Premium Lock Component
 * 
 * Visual overlay for locked premium content
 * Shows lock icon, "Premium" badge, and blur effect
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../data/darkTheme';

type PremiumLockProps = {
  isLocked: boolean;
  onUnlockPress?: () => void;
  showBadge?: boolean;
  compact?: boolean;
};

export default function PremiumLock({ 
  isLocked, 
  onUnlockPress, 
  showBadge = true,
  compact = false 
}: PremiumLockProps) {
  if (!isLocked) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.blurBackground} />
      
      <View style={[styles.content, compact && styles.contentCompact]}>
        <View style={[styles.lockIcon, compact && styles.lockIconCompact]}>
          <Ionicons name="lock-closed" size={compact ? 20 : 32} color={colors.accent} />
        </View>
        
        {showBadge && (
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={12} color={colors.textPrimary} />
            <Text style={styles.premiumText}>PREMIUM</Text>
          </View>
        )}
        
        {onUnlockPress && (
          <TouchableOpacity style={styles.unlockButton} onPress={onUnlockPress}>
            <Text style={styles.unlockButtonText}>Unlock</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    opacity: 0.8,
  },
  content: {
    alignItems: 'center',
    gap: spacing.md,
  },
  contentCompact: {
    gap: spacing.sm,
  },
  lockIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  lockIconCompact: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  premiumText: {
    fontSize: typography.small,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  unlockButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginTop: spacing.sm,
  },
  unlockButtonText: {
    fontSize: typography.body,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
});
