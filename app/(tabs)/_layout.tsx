
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'home',
      label: 'Home',
    },
    {
      name: 'progress',
      route: '/(tabs)/progress',
      icon: 'bar-chart',
      label: 'Progress',
    },
    {
      name: 'premium',
      route: '/(tabs)/premium',
      icon: 'star',
      label: 'Premium',
    },
    {
      name: 'settings',
      route: '/(tabs)/settings',
      icon: 'settings',
      label: 'Settings',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="progress" name="progress" />
        <Stack.Screen key="premium" name="premium" />
        <Stack.Screen key="settings" name="settings" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
