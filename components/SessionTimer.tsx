
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

interface SessionTimerProps {
  onComplete?: () => void;
}

export default function SessionTimer({ onComplete }: SessionTimerProps) {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);

  const durations = [
    { label: '5 min', value: 5 * 60 },
    { label: '10 min', value: 10 * 60 },
    { label: '15 min', value: 15 * 60 },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            if (onComplete) {
              onComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeRemaining, onComplete]);

  const handleSelectDuration = (duration: number) => {
    setSelectedDuration(duration);
    setTimeRemaining(duration);
    setIsRunning(false);
  };

  const handleStartPause = () => {
    if (selectedDuration === null) return;
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (selectedDuration !== null) {
      setTimeRemaining(selectedDuration);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Timer</Text>
      
      {!selectedDuration ? (
        <View style={styles.durationSelector}>
          {durations.map((duration, index) => (
            <TouchableOpacity
              key={index}
              style={styles.durationButton}
              onPress={() => handleSelectDuration(duration.value)}
              activeOpacity={0.7}
            >
              <Text style={styles.durationButtonText}>{duration.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.timerContainer}>
          <View style={styles.timerDisplay}>
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          </View>
          
          <View style={styles.timerControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleStartPause}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name={isRunning ? 'pause.fill' : 'play.fill'}
                android_material_icon_name={isRunning ? 'pause' : 'play-arrow'}
                size={24}
                color={colors.text}
              />
              <Text style={styles.controlButtonText}>
                {isRunning ? 'Pause' : 'Start'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="arrow.clockwise"
                android_material_icon_name="refresh"
                size={24}
                color={colors.text}
              />
              <Text style={styles.controlButtonText}>Reset</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                setSelectedDuration(null);
                setTimeRemaining(0);
                setIsRunning(false);
              }}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="xmark"
                android_material_icon_name="close"
                size={24}
                color={colors.text}
              />
              <Text style={styles.controlButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  durationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  durationButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerDisplay: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 32,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  controlButton: {
    alignItems: 'center',
    padding: 8,
  },
  controlButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginTop: 4,
  },
});
