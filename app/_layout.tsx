
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { AppProvider } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        console.warn('Error during app preparation:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
      
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setShowCustomSplash(false);
        });
      }, 300);
    }
  }, [appIsReady]);

  if (showCustomSplash) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
        <IconSymbol
          ios_icon_name="pawprint.fill"
          android_material_icon_name="pets"
          size={120}
          color={colors.primary}
        />
      </Animated.View>
    );
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
        </Stack>
      </AppProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
