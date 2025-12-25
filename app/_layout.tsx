
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { AppProvider } from '@/contexts/AppContext';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import * as Sentry from '@sentry/react-native';

// Initialize Sentry BEFORE anything else
// Replace with your actual Sentry DSN from https://sentry.io
const SENTRY_DSN = 'https://YOUR_SENTRY_DSN@sentry.io/YOUR_PROJECT_ID';

// Only initialize Sentry if DSN is configured
if (SENTRY_DSN && !SENTRY_DSN.includes('YOUR_SENTRY_DSN')) {
  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      debug: __DEV__, // Enable debug in development
      environment: __DEV__ ? 'development' : 'production',
      enableAutoSessionTracking: true,
      sessionTrackingIntervalMillis: 30000,
      tracesSampleRate: 1.0, // Capture 100% of transactions in dev, reduce in production
      enableNative: true,
      enableNativeCrashHandling: true,
      enableNativeNagger: __DEV__,
      attachStacktrace: true,
      beforeSend(event, hint) {
        // Log crash to console for debugging
        console.error('🚨 SENTRY CRASH CAPTURED:', {
          exception: event.exception,
          message: event.message,
          level: event.level,
          platform: event.platform,
          timestamp: event.timestamp,
        });
        return event;
      },
    });
    console.log('✅ Sentry initialized successfully');
  } catch (sentryError) {
    console.error('❌ Failed to initialize Sentry:', sentryError);
  }
} else {
  console.warn('⚠️ Sentry DSN not configured. Crash reporting disabled.');
  console.warn('To enable Sentry:');
  console.warn('1. Create a project at https://sentry.io');
  console.warn('2. Copy your DSN');
  console.warn('3. Replace SENTRY_DSN in app/_layout.tsx');
}

SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const [appReady, setAppReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    async function prepare() {
      const startTime = Date.now();
      console.log('🚀 App initialization started at', new Date().toISOString());
      
      try {
        // Set user context for Sentry
        try {
          Sentry.setContext('device', {
            platform: Platform.OS,
            version: Platform.Version,
          });
        } catch (sentryContextError) {
          console.warn('⚠️ Failed to set Sentry context:', sentryContextError);
        }

        // Add a small delay to ensure native modules are ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Test critical native modules with try/catch
        console.log('📦 Testing AsyncStorage...');
        try {
          const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
          await AsyncStorage.getItem('test_key');
          console.log('✅ AsyncStorage initialized successfully');
          
          // Track successful init in Sentry
          Sentry.addBreadcrumb({
            category: 'init',
            message: 'AsyncStorage initialized',
            level: 'info',
          });
        } catch (storageError) {
          console.error('❌ AsyncStorage initialization failed:', storageError);
          Sentry.captureException(storageError, {
            tags: { module: 'AsyncStorage', phase: 'initialization' },
          });
          // Continue anyway - app can work without storage
        }

        console.log('📦 Testing Constants...');
        try {
          const Constants = await import('expo-constants');
          const appVersion = Constants.default.expoConfig?.version || '1.0.0';
          console.log('✅ Constants initialized successfully, version:', appVersion);
          
          // Set app version in Sentry
          Sentry.setTag('app_version', appVersion);
          Sentry.addBreadcrumb({
            category: 'init',
            message: 'Constants initialized',
            level: 'info',
            data: { version: appVersion },
          });
        } catch (constantsError) {
          console.error('❌ Constants initialization failed:', constantsError);
          Sentry.captureException(constantsError, {
            tags: { module: 'Constants', phase: 'initialization' },
          });
          // Continue anyway
        }

        console.log('📦 Testing Haptics...');
        try {
          const Haptics = await import('expo-haptics');
          console.log('✅ Haptics initialized successfully');
          
          Sentry.addBreadcrumb({
            category: 'init',
            message: 'Haptics initialized',
            level: 'info',
          });
        } catch (hapticsError) {
          console.error('❌ Haptics initialization failed:', hapticsError);
          Sentry.captureException(hapticsError, {
            tags: { module: 'Haptics', phase: 'initialization' },
          });
          // Continue anyway
        }

        // NOTE: RevenueCat/Purchases SDK initialization DISABLED for isolation build
        // This was identified as a potential crash source in previous builds
        // Uncomment below to re-enable after confirming app launches
        console.log('⏭️ RevenueCat initialization SKIPPED (isolation build)');
        Sentry.addBreadcrumb({
          category: 'init',
          message: 'RevenueCat initialization skipped',
          level: 'warning',
        });
        /*
        console.log('📦 Testing RevenueCat...');
        try {
          const Purchases = await import('react-native-purchases');
          const apiKey = Platform.OS === 'ios' 
            ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY 
            : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;
          
          if (apiKey) {
            await Purchases.configure({ apiKey });
            console.log('✅ RevenueCat initialized successfully');
            Sentry.addBreadcrumb({
              category: 'init',
              message: 'RevenueCat initialized',
              level: 'info',
            });
          } else {
            console.warn('⚠️ RevenueCat API key not found');
          }
        } catch (purchasesError) {
          console.error('❌ RevenueCat initialization failed:', purchasesError);
          Sentry.captureException(purchasesError, {
            tags: { module: 'RevenueCat', phase: 'initialization' },
          });
          // Continue anyway - app can work without IAP
        }
        */

        // NOTE: OneSignal/Push Notification SDK initialization DISABLED for isolation build
        // This was identified as a potential crash source in previous builds
        // Uncomment below to re-enable after confirming app launches
        console.log('⏭️ OneSignal initialization SKIPPED (isolation build)');
        Sentry.addBreadcrumb({
          category: 'init',
          message: 'OneSignal initialization skipped',
          level: 'warning',
        });
        /*
        console.log('📦 Testing OneSignal...');
        try {
          const OneSignal = await import('react-native-onesignal');
          const appId = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;
          
          if (appId) {
            OneSignal.setAppId(appId);
            console.log('✅ OneSignal initialized successfully');
            Sentry.addBreadcrumb({
              category: 'init',
              message: 'OneSignal initialized',
              level: 'info',
            });
          } else {
            console.warn('⚠️ OneSignal App ID not found');
          }
        } catch (oneSignalError) {
          console.error('❌ OneSignal initialization failed:', oneSignalError);
          Sentry.captureException(oneSignalError, {
            tags: { module: 'OneSignal', phase: 'initialization' },
          });
          // Continue anyway - app can work without push notifications
        }
        */

        const initTime = Date.now() - startTime;
        console.log(`✅ App initialization completed successfully in ${initTime}ms`);
        
        Sentry.addBreadcrumb({
          category: 'init',
          message: 'App initialization complete',
          level: 'info',
          data: { duration_ms: initTime },
        });
        
        setAppReady(true);
        
        // Small delay before hiding splash
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        const error = e as Error;
        console.error('❌ CRITICAL ERROR during app preparation:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Capture critical error in Sentry
        Sentry.captureException(error, {
          level: 'fatal',
          tags: { 
            phase: 'app_initialization',
            critical: 'true',
          },
          contexts: {
            initialization: {
              timestamp: new Date().toISOString(),
              platform: Platform.OS,
            },
          },
        });
        
        setInitError(error.message || 'Unknown initialization error');
        setAppReady(true); // Still set ready to show error screen
      } finally {
        try {
          await SplashScreen.hideAsync();
          console.log('✅ Splash screen hidden');
        } catch (splashError) {
          console.error('❌ Error hiding splash screen:', splashError);
          Sentry.captureException(splashError, {
            tags: { module: 'SplashScreen', phase: 'hide' },
          });
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
        <Text style={styles.errorDetails}>
          This error has been automatically reported to our team.
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

// Wrap with Sentry error boundary
export default Sentry.wrap(RootLayoutContent);

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
    marginBottom: 16,
  },
  errorDetails: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
