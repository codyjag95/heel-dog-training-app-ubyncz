
/**
 * Safe Native Module Wrapper
 * Provides error-safe wrappers for native module calls to prevent crashes
 */

export async function safeAsyncStorageGet(key: string): Promise<string | null> {
  try {
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    return await AsyncStorage.default.getItem(key);
  } catch (error) {
    console.error(`SafeAsyncStorage.getItem failed for key "${key}":`, error);
    return null;
  }
}

export async function safeAsyncStorageSet(key: string, value: string): Promise<boolean> {
  try {
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    await AsyncStorage.default.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`SafeAsyncStorage.setItem failed for key "${key}":`, error);
    return false;
  }
}

export async function safeAsyncStorageRemove(key: string): Promise<boolean> {
  try {
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    await AsyncStorage.default.removeItem(key);
    return true;
  } catch (error) {
    console.error(`SafeAsyncStorage.removeItem failed for key "${key}":`, error);
    return false;
  }
}

export async function safeHapticsImpact(style: 'Light' | 'Medium' | 'Heavy' = 'Light'): Promise<void> {
  try {
    const Haptics = await import('expo-haptics');
    const styleMap = {
      Light: Haptics.ImpactFeedbackStyle.Light,
      Medium: Haptics.ImpactFeedbackStyle.Medium,
      Heavy: Haptics.ImpactFeedbackStyle.Heavy,
    };
    await Haptics.impactAsync(styleMap[style]);
  } catch (error) {
    console.warn('SafeHaptics.impact failed:', error);
  }
}

export async function safeHapticsNotification(type: 'Success' | 'Warning' | 'Error' = 'Success'): Promise<void> {
  try {
    const Haptics = await import('expo-haptics');
    const typeMap = {
      Success: Haptics.NotificationFeedbackType.Success,
      Warning: Haptics.NotificationFeedbackType.Warning,
      Error: Haptics.NotificationFeedbackType.Error,
    };
    await Haptics.notificationAsync(typeMap[type]);
  } catch (error) {
    console.warn('SafeHaptics.notification failed:', error);
  }
}

export async function safeGetAppVersion(): Promise<string> {
  try {
    const Constants = await import('expo-constants');
    return Constants.default.expoConfig?.version || '1.0.0';
  } catch (error) {
    console.warn('SafeConstants.getAppVersion failed:', error);
    return '1.0.0';
  }
}

export async function safeGetAppName(): Promise<string> {
  try {
    const Constants = await import('expo-constants');
    return Constants.default.expoConfig?.name || 'HEEL';
  } catch (error) {
    console.warn('SafeConstants.getAppName failed:', error);
    return 'HEEL';
  }
}

/**
 * NOTE: RevenueCat/Purchases SDK functions DISABLED for isolation build
 * Uncomment and implement after confirming app launches successfully
 */
/*
export async function safeInitializeRevenueCat(apiKey: string): Promise<boolean> {
  try {
    const Purchases = await import('react-native-purchases');
    await Purchases.configure({ apiKey });
    console.log('✅ RevenueCat initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ RevenueCat initialization failed:', error);
    return false;
  }
}

export async function safeGetRevenueCatOfferings(): Promise<any> {
  try {
    const Purchases = await import('react-native-purchases');
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (error) {
    console.error('RevenueCat getOfferings failed:', error);
    return null;
  }
}
*/

/**
 * NOTE: OneSignal/Push Notification SDK functions DISABLED for isolation build
 * Uncomment and implement after confirming app launches successfully
 */
/*
export async function safeInitializeOneSignal(appId: string): Promise<boolean> {
  try {
    const OneSignal = await import('react-native-onesignal');
    OneSignal.setAppId(appId);
    console.log('✅ OneSignal initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ OneSignal initialization failed:', error);
    return false;
  }
}

export async function safeGetOneSignalPlayerId(): Promise<string | null> {
  try {
    const OneSignal = await import('react-native-onesignal');
    const deviceState = await OneSignal.getDeviceState();
    return deviceState?.userId || null;
  } catch (error) {
    console.error('OneSignal getPlayerId failed:', error);
    return null;
  }
}

export async function safeRequestPushPermissions(): Promise<boolean> {
  try {
    const OneSignal = await import('react-native-onesignal');
    const result = await OneSignal.promptForPushNotificationsWithUserResponse();
    return result;
  } catch (error) {
    console.error('OneSignal requestPermissions failed:', error);
    return false;
  }
}
*/
