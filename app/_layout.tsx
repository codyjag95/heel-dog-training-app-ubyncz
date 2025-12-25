
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { AppProvider } from '@/contexts/AppContext';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        console.log('🚀 App initialization started');
        
        // Add a small delay to ensure native modules are ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Test critical native modules with try/catch
        try {
          // Test AsyncStorage (wrapped in try/catch)
          const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
          await AsyncStorage.getItem('test_key');
          console.log('✅ AsyncStorage initialized successfully');
        } catch (storageError) {
          console.warn('⚠️ AsyncStorage initialization failed:', storageError);
          // Continue anyway - app can work without storage
        }

        try {
          // Test Constants (wrapped in try/catch)
          const Constants = await import('expo-constants');
          console.log('✅ Constants initialized successfully');
        } catch (constantsError) {
          console.warn('⚠️ Constants initialization failed:', constantsError);
          // Continue anyway
        }

        try {
          // Test Haptics (wrapped in try/catch)
          const Haptics = await import('expo-haptics');
          console.log('✅ Haptics initialized successfully');
        } catch (hapticsError) {
          console.warn('⚠️ Haptics initialization failed:', hapticsError);
          // Continue anyway
        }

        // NOTE: RevenueCat/Purchases SDK initialization DISABLED for isolation build
        // Uncomment below to re-enable after confirming app launches
        /*
        try {
          // Example RevenueCat initialization (DISABLED)
          // const Purchases = await import('react-native-purchases');
          // await Purchases.configure({ apiKey: 'YOUR_KEY' });
          console.log('✅ RevenueCat initialized successfully');
        } catch (purchasesError) {
          console.warn('⚠️ RevenueCat initialization failed:', purchasesError);
          // Continue anyway - app can work without IAP
        }
        */

        // NOTE: OneSignal/Push Notification SDK initialization DISABLED for isolation build
        // Uncomment below to re-enable after confirming app launches
        /*
        try {
          // Example OneSignal initialization (DISABLED)
          // const OneSignal = await import('react-native-onesignal');
          // OneSignal.setAppId('YOUR_APP_ID');
          console.log('✅ OneSignal initialized successfully');
        } catch (oneSignalError) {
          console.warn('⚠️ OneSignal initialization failed:', oneSignalError);
          // Continue anyway - app can work without push notifications
        }
        */

        console.log('✅ App initialization completed successfully');
        setAppReady(true);
        
        // Small delay before hiding splash
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.error('❌ Critical error during app preparation:', e);
        setInitError(e instanceof Error ? e.message : 'Unknown initialization error');
        setAppReady(true); // Still set ready to show error screen
      } finally {
        try {
          await SplashScreen.hideAsync();
        } catch (splashError) {
          console.warn('⚠️ Error hiding splash screen:', splashError);
        }
      }
    }

    prepare();
  }, []);

  // Show error screen if initialization failed critically
  if (initError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Initialization Error</Text>
        <Text style={styles.errorMessage}>{initError}</Text>
        <Text style={styles.errorHint}>
          Please restart the app. If the problem persists, contact support.
        </Text>
      </View>
    );
  }

  // Don't render app until ready
  if (!appReady) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <AppProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#121212' },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="category" options={{ headerShown: false }} />
          <Stack.Screen name="lesson" options={{ headerShown: false }} />
          <Stack.Screen name="session-mode" options={{ headerShown: false }} />
          <Stack.Screen name="training-tips" options={{ headerShown: false }} />
          <Stack.Screen name="premium-coming-soon" options={{ headerShown: false }} />
          <Stack.Screen name="admin-waitlist" options={{ headerShown: false }} />
          <Stack.Screen 
            name="modal" 
            options={{ 
              presentation: 'modal',
              headerShown: false 
            }} 
          />
          <Stack.Screen 
            name="formsheet" 
            options={{ 
              presentation: 'formSheet',
              headerShown: false 
            }} 
          />
          <Stack.Screen 
            name="transparent-modal" 
            options={{ 
              presentation: 'transparentModal',
              headerShown: false 
            }} 
          />
        </Stack>
      </AppProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorHint: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
