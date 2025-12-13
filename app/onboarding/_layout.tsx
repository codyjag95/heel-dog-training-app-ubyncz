
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="dog-profile" />
    </Stack>
  );
}
