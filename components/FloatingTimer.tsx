import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { colors, typography, spacing } from '../data/darkTheme';

type FloatingTimerProps = {
  duration: number; // Duration in minutes
};

export default function FloatingTimer({ duration }: FloatingTimerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Animate expansion/collapse
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isExpanded ? 1 : 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  // Timer countdown logic
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, secondsRemaining]);

  // Reset seconds when duration prop changes
  useEffect(() => {
    setSecondsRemaining(duration * 60);
    setIsRunning(false);
  }, [duration]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleStart = () => {
    if (secondsRemaining > 0) {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setSecondsRemaining(duration * 60);
    setIsRunning(false);
  };

  return (
    <>
      {!isExpanded ? (
        // Collapsed: Small floating button
        <TouchableOpacity
          style={styles.collapsedContainer}
          onPress={handleToggle}
          activeOpacity={0.8}
        >
          <Text style={styles.collapsedIcon}>⏱</Text>
        </TouchableOpacity>
      ) : (
        // Expanded: Full timer controls
        <Animated.View
          style={[
            styles.expandedContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleToggle}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.closeIcon}>×</Text>
          </TouchableOpacity>

          <Text style={styles.timeDisplay}>{formatTime(secondsRemaining)}</Text>

          <View style={styles.controls}>
            {!isRunning ? (
              <TouchableOpacity
                style={[styles.controlButton, styles.playButton]}
                onPress={handleStart}
                disabled={secondsRemaining === 0}
              >
                <Text style={styles.controlIcon}>▶️</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.controlButton, styles.pauseButton]}
                onPress={handlePause}
              >
                <Text style={styles.controlIcon}>⏸</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.controlButton, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={styles.controlIcon}>↻</Text>
            </TouchableOpacity>
          </View>

          {secondsRemaining === 0 && (
            <Text style={styles.completedText}>Time's up! ✓</Text>
          )}
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  // Collapsed state
  collapsedContainer: {
    position: 'absolute',
    bottom: 100, // Above the "Mark Complete" button
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  collapsedIcon: {
    fontSize: 32,
  },

  // Expanded state
  expandedContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 180,
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 28,
    color: colors.textPrimary,
    fontWeight: '300',
    lineHeight: 28,
  },

  // Timer display
  timeDisplay: {
    fontSize: 36,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
    fontVariant: ['tabular-nums'],
  },

  // Controls
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: spacing.sm,
  },
  controlButton: {
    width: 50,
    height: 50,
    backgroundColor: colors.cardBackground,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: colors.success,
  },
  pauseButton: {
    backgroundColor: colors.warning,
  },
  resetButton: {
    backgroundColor: colors.cardBackground,
  },
  controlIcon: {
    fontSize: 24,
  },

  // Completion message
  completedText: {
    fontSize: typography.small,
    color: colors.success,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontWeight: typography.semibold,
  },
});
