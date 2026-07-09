import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AppProvider, useApp } from '../contexts/AppContext';

function RootLayoutNav() {
  const { userProfile, isLoading } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const isOnQuiz = segments.includes('quiz');
    const isOnWelcome = segments.includes('welcome');
    const isOnQuizResults = segments.includes('quiz-results');

    if (!userProfile && !isOnQuiz && !isOnWelcome && !isOnQuizResults) {
      router.replace('/welcome');
    }
  }, [userProfile, segments, isLoading]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'default',
        gestureEnabled: true,
      }}
    >
      {/* 
        CRITICAL: title: '' prevents "Tabs" from showing as back button text
        when navigating from any tab to a stack screen like category/[id] 
      */}
      <Stack.Screen name="(tabs)" options={{ title: '', headerBackTitle: '' }} />
      <Stack.Screen name="welcome" />
      <Stack.Screen
        name="quiz-results"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="paywall"
        options={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="auth"
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
  name="roadmap"
  options={{
    headerShown: true,
    headerBackVisible: true,
    headerBackTitle: '',
    headerTitle: 'Training Plan',
    headerStyle: { backgroundColor: '#000' },
    headerTintColor: '#FF4444',
    headerTitleStyle: { color: '#FFFFFF' },
  }}
/> <Stack.Screen
        name="category/[id]"
        options={{
          headerShown: true,
          headerBackVisible: true,
          headerBackTitle: '',
          headerTitle: '',
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#FF4444',
        }}
      />
      <Stack.Screen
        name="lesson/[categoryId]/[lessonId]"
        options={{
          headerShown: true,
          headerBackVisible: true,
          headerBackTitle: '',
          headerTitle: '',
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#FF4444',
        }}
      />
      <Stack.Screen
        name="session-selection"
        options={{
          headerShown: true,
          headerBackVisible: true,
          headerBackTitle: '',
          headerTitle: '',
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#FF4444',
        }}
      />
      <Stack.Screen
        name="session/session-active"
        options={{
          headerShown: true,
          headerBackVisible: true,
          headerBackTitle: '',
          headerTitle: '',
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#FF4444',
        }}
      />
      <Stack.Screen
        name="session/session-complete"
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerBackTitle: '',
          headerTitle: '',
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#FF4444',
        }}
      />
      <Stack.Screen
        name="privacy-policy"
        options={{
          headerShown: true,
          headerBackVisible: true,
          headerBackTitle: '',
          headerTitle: 'Privacy Policy',
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#FF4444',
          headerTitleStyle: { color: '#FFFFFF' },
        }}
      />
      <Stack.Screen
        name="terms-of-service"
        options={{
          headerShown: true,
          headerBackVisible: true,
          headerBackTitle: '',
          headerTitle: 'Terms of Service',
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#FF4444',
          headerTitleStyle: { color: '#FFFFFF' },
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutNav />
    </AppProvider>
  );
}
