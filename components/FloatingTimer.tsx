/**
 * TrainingTimer — Redesigned floating timer for lesson screens
 * 
 * Features:
 * - Collapsed: small floating button with time display
 * - Expanded: transparent overlay with preset times (5/10/15 min)
 * - Custom time adjustment with +/- buttons
 * - Clean Ionicons instead of emojis
 * - Semi-transparent backdrop when expanded
 * 
 * PLACEMENT: components/FloatingTimer.tsx (replace existing)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../data/darkTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type FloatingTimerProps = {
  duration: number; // Default duration in minutes from lesson
};

const PRESETS = [5, 10, 15];

export default function FloatingTimer({ duration }: FloatingTimerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(duration);
  const [secondsRemaining, setSecondsRemaining] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ── Animation ──
  useEffect(() => {
    if (isExpanded) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isExpanded]);

  // ── Countdown ──
  useEffect(() => {
    if (isRunning && secondsRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // ── Reset when duration prop changes ──
  useEffect(() => {
    setSelectedMinutes(duration);
    setSecondsRemaining(duration * 60);
    setIsRunning(false);
    setHasStarted(false);
  }, [duration]);

  // ── Helpers ──
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = hasStarted
    ? 1 - secondsRemaining / (selectedMinutes * 60)
    : 0;

  // ── Actions ──
  const handlePresetSelect = (mins: number) => {
    setSelectedMinutes(mins);
    setSecondsRemaining(mins * 60);
    setIsRunning(false);
    setHasStarted(false);
  };

  const handleAdjust = (delta: number) => {
    const newMins = Math.max(1, Math.min(60, selectedMinutes + delta));
    setSelectedMinutes(newMins);
    if (!isRunning) {
      setSecondsRemaining(newMins * 60);
      setHasStarted(false);
    }
  };

  const handleStartPause = () => {
    if (isRunning) {
      setIsRunning(false);
    } else if (secondsRemaining > 0) {
      setIsRunning(true);
      setHasStarted(true);
    }
  };

  const handleReset = () => {
    setSecondsRemaining(selectedMinutes * 60);
    setIsRunning(false);
    setHasStarted(false);
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const isComplete = secondsRemaining === 0 && hasStarted;

  // ══════════════════════════════════════════════════════════
  // COLLAPSED STATE — Small pill showing timer
  // ══════════════════════════════════════════════════════════
  if (!isExpanded) {
    return (
      <TouchableOpacity
        style={[
          styles.collapsedPill,
          isRunning && styles.collapsedPillRunning,
          isComplete && styles.collapsedPillComplete,
        ]}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isComplete ? 'checkmark-circle' : isRunning ? 'pause' : 'timer-outline'}
          size={18}
          color={isComplete ? '#4CAF50' : '#FFFFFF'}
        />
        {(isRunning || hasStarted) && (
          <Text style={[
            styles.collapsedTime,
            isComplete && styles.collapsedTimeComplete,
          ]}>
            {isComplete ? 'Done' : formatTime(secondsRemaining)}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  // ══════════════════════════════════════════════════════════
  // EXPANDED STATE — Transparent overlay
  // ══════════════════════════════════════════════════════════
  return (
    <>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.backdropTouch}
          onPress={handleToggle}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Timer Panel */}
      <Animated.View
        style={[
          styles.expandedPanel,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleToggle}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="close" size={22} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.panelTitle}>Training Timer</Text>

        {/* Time Display */}
        <View style={styles.timeDisplayContainer}>
          {/* Progress ring (simple bar version) */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
          
          <Text style={[
            styles.timeDisplay,
            isComplete && styles.timeDisplayComplete,
          ]}>
            {isComplete ? 'Time\'s Up!' : formatTime(secondsRemaining)}
          </Text>
        </View>

        {/* Preset Buttons */}
        {!hasStarted && (
          <View style={styles.presetRow}>
            {PRESETS.map(mins => (
              <TouchableOpacity
                key={mins}
                style={[
                  styles.presetButton,
                  selectedMinutes === mins && styles.presetButtonActive,
                ]}
                onPress={() => handlePresetSelect(mins)}
              >
                <Text style={[
                  styles.presetText,
                  selectedMinutes === mins && styles.presetTextActive,
                ]}>
                  {mins} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Custom Adjust */}
        {!hasStarted && (
          <View style={styles.adjustRow}>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => handleAdjust(-1)}
            >
              <Ionicons name="remove" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.adjustValue}>{selectedMinutes} min</Text>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => handleAdjust(1)}
            >
              <Ionicons name="add" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controlRow}>
          {/* Reset */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleReset}
          >
            <Ionicons name="refresh" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Play/Pause */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              isRunning && styles.primaryButtonPause,
              isComplete && styles.primaryButtonComplete,
            ]}
            onPress={isComplete ? handleReset : handleStartPause}
          >
            <Ionicons
              name={isComplete ? 'refresh' : isRunning ? 'pause' : 'play'}
              size={28}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          {/* Close/minimize */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleToggle}
          >
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

// ══════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  // ── Collapsed Pill ──
  collapsedPill: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  collapsedPillRunning: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
  },
  collapsedPillComplete: {
    borderColor: '#4CAF50',
  },
  collapsedTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  collapsedTimeComplete: {
    color: '#4CAF50',
  },

  // ── Backdrop ──
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 999,
  },
  backdropTouch: {
    flex: 1,
  },

  // ── Expanded Panel ──
  expandedPanel: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(28, 28, 30, 0.97)',
    borderRadius: 20,
    padding: spacing.xl,
    paddingTop: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 1001,
  },

  // ── Close ──
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  // ── Title ──
  panelTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.lg,
  },

  // ── Time Display ──
  timeDisplayContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  progressBarBg: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: '200',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  timeDisplayComplete: {
    fontSize: 28,
    fontWeight: '600',
    color: '#4CAF50',
  },

  // ── Presets ──
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: spacing.lg,
  },
  presetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  presetButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  presetText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  presetTextActive: {
    color: '#FFFFFF',
  },

  // ── Adjust ──
  adjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  adjustButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    minWidth: 60,
    textAlign: 'center',
  },

  // ── Controls ──
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  primaryButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonPause: {
    backgroundColor: '#FF9800',
  },
  primaryButtonComplete: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
