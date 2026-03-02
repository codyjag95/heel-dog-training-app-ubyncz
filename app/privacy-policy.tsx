import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { colors, typography, spacing } from '../data/darkTheme';

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Privacy Policy',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.accent,
          headerTitleStyle: { color: colors.textPrimary },
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.lastUpdated}>Last updated: February 16, 2026</Text>

        <Text style={styles.body}>
          HEEL Dog Training ("HEEL", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.
        </Text>

        <Text style={styles.heading}>Information We Collect</Text>
        <Text style={styles.body}>
          We collect the following information that you voluntarily provide through our personalization quiz:
        </Text>
        <Text style={styles.body}>
          {'\u2022'} Your dog's name, breed, and age{'\n'}
          {'\u2022'} Training experience level and goals{'\n'}
          {'\u2022'} Behavioral challenges you're experiencing{'\n'}
          {'\u2022'} Time availability for training
        </Text>
        <Text style={styles.body}>
          This information is stored locally on your device and is used exclusively to personalize your training experience. We do not transmit this data to external servers.
        </Text>

        <Text style={styles.heading}>Lesson Progress Data</Text>
        <Text style={styles.body}>
          We store your lesson completion history and training progress locally on your device to track your advancement through training categories.
        </Text>

        <Text style={styles.heading}>Subscription Information</Text>
        <Text style={styles.body}>
          Premium subscriptions are processed entirely through Apple's App Store. We do not collect, store, or have access to your payment information, credit card details, or Apple ID. All billing is managed by Apple.
        </Text>

        <Text style={styles.heading}>Analytics</Text>
        <Text style={styles.body}>
          We may collect anonymous, aggregated usage analytics (such as which features are used most frequently) to improve the app experience. This data cannot be used to identify individual users.
        </Text>

        <Text style={styles.heading}>Data Storage</Text>
        <Text style={styles.body}>
          All personal data (quiz responses, training progress) is stored locally on your device using encrypted storage. We do not maintain external databases of user information. Deleting the app will remove all locally stored data.
        </Text>

        <Text style={styles.heading}>Third-Party Services</Text>
        <Text style={styles.body}>
          We use the following third-party services:{'\n\n'}
          {'\u2022'} Apple App Store: For subscription management and payment processing{'\n'}
          {'\u2022'} Expo/React Native: Our development framework
        </Text>

        <Text style={styles.heading}>Children's Privacy</Text>
        <Text style={styles.body}>
          HEEL Dog Training is not directed at children under 13. We do not knowingly collect personal information from children under 13 years of age.
        </Text>

        <Text style={styles.heading}>Your Rights</Text>
        <Text style={styles.body}>
          Since your data is stored locally on your device, you have full control over it. You can delete all app data by uninstalling HEEL Dog Training or by using the "Retake Quiz" feature to reset your profile.
        </Text>

        <Text style={styles.heading}>Changes to This Policy</Text>
        <Text style={styles.body}>
          We may update this Privacy Policy from time to time. Any changes will be reflected in the app with an updated "Last updated" date.
        </Text>

        <Text style={styles.heading}>Contact Us</Text>
        <Text style={styles.body}>
          If you have questions about this Privacy Policy, contact us at:{'\n\n'}
          support@heeldogtraining.com
        </Text>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg, paddingTop: spacing.md },
  lastUpdated: { fontSize: typography.small, color: colors.textTertiary, marginBottom: spacing.xl },
  heading: { fontSize: typography.h3, fontWeight: typography.bold, color: colors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.sm },
  body: { fontSize: typography.body, color: colors.textSecondary, lineHeight: 24, marginBottom: spacing.md },
});
