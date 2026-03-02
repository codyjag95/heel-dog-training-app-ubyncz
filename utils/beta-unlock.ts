
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const STORAGE_KEYS = {
  HAS_PREMIUM: 'heel_has_premium',
  BETA_TESTER: 'heel_beta_tester',
};

// Call this function to instantly unlock premium
export const activateBetaMode = async (): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_PREMIUM, 'true');
    await AsyncStorage.setItem(STORAGE_KEYS.BETA_TESTER, 'true');
    
    Alert.alert(
      '🎉 Beta Tester Activated!',
      'All premium content is now unlocked. Thank you for testing HEEL!',
      [{ text: 'Awesome!', style: 'default' }]
    );
    
    return true;
  } catch (error) {
    console.error('Beta activation failed:', error);
    return false;
  }
};

// Call this to check if user is a beta tester
export const isBetaTester = async (): Promise<boolean> => {
  try {
    const status = await AsyncStorage.getItem(STORAGE_KEYS.BETA_TESTER);
    return status === 'true';
  } catch {
    return false;
  }
};

// Call this to revoke beta access (for testing lock states)
export const deactivateBetaMode = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_PREMIUM, 'false');
    await AsyncStorage.setItem(STORAGE_KEYS.BETA_TESTER, 'false');
    
    Alert.alert(
      'Beta Mode Deactivated',
      'Premium content is now locked again.',
      [{ text: 'OK' }]
    );
  } catch (error) {
    console.error('Beta deactivation failed:', error);
  }
};
