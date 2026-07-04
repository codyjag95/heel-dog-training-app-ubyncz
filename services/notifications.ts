import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('training', {
      name: 'Training Reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  return true;
}

export async function scheduleDailyReminder(dogName: string, hour: number = 9, minute: number = 0) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const messages = [
    `Time to train ${dogName}! Even 5 minutes makes a difference.`,
    `${dogName} is ready to learn something new today!`,
    `Don't forget your training session with ${dogName}!`,
    `Quick session with ${dogName}? Consistency beats intensity.`,
    `${dogName}'s training plan is waiting. Let's go!`,
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'HEEL Training Reminder',
      body: randomMessage,
      sound: true,
    },
    trigger: {
      hour: hour,
      minute: minute,
      repeats: true,
    },
  });
}

export async function scheduleStreakReminder(dogName: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your streak is at risk!',
      body: `Complete one lesson with ${dogName} to keep your streak alive.`,
      sound: true,
    },
    trigger: {
      seconds: 72000, // 20 hours from now
    },
  });
}
