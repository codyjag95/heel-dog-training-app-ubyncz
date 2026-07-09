/**
 * Local notification engine. No server needed, works offline.
 * Same code path serves iOS and Android (Play Store build included);
 * the Android notification channel is set up in registerForPushNotifications.
 *
 * Strategy:
 *  - One repeating daily reminder at the user's hour (default 6pm)
 *  - One "streak saver" one-shot ~30h after the LAST completed lesson.
 *    Train every day and it keeps getting pushed back, never fires.
 *    Miss a day and it fires the next evening, right when the streak is dying.
 */
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // SDK 54 replaced shouldShowAlert with shouldShowBanner + shouldShowList
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const REMINDER_HOUR_KEY = '@heel_reminder_hour'; // user-configurable later
const STREAK_SAVER_SECONDS = 30 * 60 * 60;       // ~30h after last lesson

export async function registerForPushNotifications(): Promise<boolean> {
  if (!Device.isDevice) return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('training', {
      name: 'Training Reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  return true;
}

export async function notificationsEnabled(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

/**
 * Called after every completed lesson (and on app launch).
 * Cancels everything and reschedules from the current state.
 */
export async function scheduleSmartReminders(dogName: string, streak: number): Promise<void> {
  if (!(await notificationsEnabled())) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const hourRaw = await AsyncStorage.getItem(REMINDER_HOUR_KEY);
  const hour = hourRaw ? parseInt(hourRaw, 10) : 18;

  const dailyMessages = [
    `Time to train ${dogName}! Even 5 minutes makes a difference.`,
    `${dogName} is ready to learn something new today.`,
    `Quick session with ${dogName}? Consistency beats intensity.`,
    `${dogName}'s next lesson is waiting. Let's go!`,
    `A tired dog is a good dog. ${dogName} says it's training time.`,
  ];
  const body = dailyMessages[Math.floor(Math.random() * dailyMessages.length)];

  // Daily nudge at the user's hour
  await Notifications.scheduleNotificationAsync({
    content: { title: 'HEEL', body, sound: true },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute: 0,
      channelId: Platform.OS === 'android' ? 'training' : undefined,
    } as any,
  });

  // Streak saver: only exists if there's a streak worth saving
  if (streak >= 2) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Your ${streak}-day streak is on the line`,
        body: `One quick lesson with ${dogName} keeps it alive.`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: STREAK_SAVER_SECONDS,
        channelId: Platform.OS === 'android' ? 'training' : undefined,
      } as any,
    });
  }
}

export async function setReminderHour(hour: number): Promise<void> {
  await AsyncStorage.setItem(REMINDER_HOUR_KEY, String(hour));
}
