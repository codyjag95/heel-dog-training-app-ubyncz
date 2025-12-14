
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon sf="house.fill" color={colors.text} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="progress" name="progress">
        <Icon sf="chart.bar.fill" color={colors.text} />
        <Label>Progress</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="premium" name="premium">
        <Icon sf="star.fill" color={colors.text} />
        <Label>Premium</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="settings" name="settings">
        <Icon sf="gearshape.fill" color={colors.text} />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
