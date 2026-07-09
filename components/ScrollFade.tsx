/**
 * ScrollFade — Reusable fade gradient overlay for scrollable screens
 * 
 * Adds a soft fade-out effect at the top and/or bottom of any ScrollView.
 * Wraps your ScrollView and renders gradient overlays on top.
 * 
 * USAGE:
 * 
 *   import ScrollFade from '../components/ScrollFade';
 * 
 *   // Bottom fade only (most common)
 *   <ScrollFade>
 *     <ScrollView>
 *       ... your content ...
 *     </ScrollView>
 *   </ScrollFade>
 * 
 *   // Both top and bottom
 *   <ScrollFade fadeTop fadeBottom>
 *     <ScrollView> ... </ScrollView>
 *   </ScrollFade>
 * 
 * REQUIRES: npx expo install expo-linear-gradient
 * PLACEMENT: components/ScrollFade.tsx
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../data/darkTheme';

type ScrollFadeProps = {
  children: React.ReactNode;
  fadeTop?: boolean;
  fadeBottom?: boolean;
  topHeight?: number;
  bottomHeight?: number;
  backgroundColor?: string;
};

/**
 * Convert any hex color (#000, #000000, etc.) to rgba string
 */
function hexToRgba(hex: string, alpha: number): string {
  let fullHex = hex.replace('#', '');
  if (fullHex.length === 3) {
    fullHex = fullHex[0] + fullHex[0] + fullHex[1] + fullHex[1] + fullHex[2] + fullHex[2];
  }
  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ScrollFade({
  children,
  fadeTop = false,
  fadeBottom = true,
  topHeight = 40,
  bottomHeight = 60,
  backgroundColor,
}: ScrollFadeProps) {
  const bg = backgroundColor || colors.background;
  const bgTransparent = hexToRgba(bg, 0);
  const bgSolid = hexToRgba(bg, 1);

  return (
    <View style={styles.container}>
      {children}

      {fadeTop && (
        <LinearGradient
          colors={[bgSolid, bgTransparent]}
          style={[styles.fadeTop, { height: topHeight }]}
          pointerEvents="none"
        />
      )}

      {fadeBottom && (
        <LinearGradient
          colors={[bgTransparent, bgSolid]}
          style={[styles.fadeBottom, { height: bottomHeight }]}
          pointerEvents="none"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  fadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});
