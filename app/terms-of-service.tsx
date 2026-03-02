import React from 'react';
import { StyleSheet, View, Text, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { colors, typography, spacing } from '../data/darkTheme';

export default function TermsOfServiceScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Terms of Service',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.accent,
          headerTitleStyle: { color: colors.textPrimary },
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.lastUpdated}>Last updated: February 16, 2026</Text>

        <Text style={styles.body}>
          Welcome to HEEL Dog Training. By using our app, you agree to these Terms of Service. Please read them carefully.
        </Text>

        <Text style={styles.heading}>Use of the App</Text>
        <Text style={styles.body}>
          HEEL Dog Training provides educational dog training content for informational purposes. Our content is based on positive reinforcement principles and is designed to supplement, not replace, professional dog training or veterinary advice.
        </Text>

        <Text style={styles.heading}>Training Disclaimer</Text>
        <Text style={styles.body}>
          Every dog is unique. Results from training exercises will vary based on your dog's breed, temperament, age, history, and consistency of training. HEEL Dog Training is not responsible for any outcomes resulting from following the training guidance provided in the app. If your dog shows signs of aggression, extreme fear, or behaviors that may pose a safety risk, please consult a certified professional dog trainer or veterinary behaviorist.
        </Text>

        <Text style={styles.heading}>Premium Subscription</Text>
        <Text style={styles.body}>
          HEEL Dog Training offers a premium subscription that provides access to additional training content and features.
        </Text>
        <Text style={styles.subheading}>Pricing & Billing</Text>
        <Text style={styles.body}>
          {'\u2022'} Payment is charged to your Apple ID account at confirmation of purchase{'\n'}
          {'\u2022'} Subscription prices are displayed in the app before purchase{'\n'}
          {'\u2022'} Prices may vary by region and are subject to change
        </Text>
        <Text style={styles.subheading}>Free Trial</Text>
        <Text style={styles.body}>
          If offered, the free trial period allows you to access premium features at no cost. If you do not cancel before the free trial ends, your subscription will automatically convert to a paid subscription and you will be charged the displayed subscription price.
        </Text>
        <Text style={styles.subheading}>Auto-Renewal</Text>
        <Text style={styles.body}>
          Your subscription will automatically renew at the end of each billing period unless you cancel at least 24 hours before the end of the current period. Your Apple ID account will be charged for renewal within 24 hours prior to the end of the current period at the same price.
        </Text>
        <Text style={styles.subheading}>How to Cancel</Text>
        <Text style={styles.body}>
          You can cancel your subscription at any time. To cancel:
        </Text>
        <Text style={styles.body}>
          1. Open the Settings app on your iPhone{'\n'}
          2. Tap your name (Apple ID) at the top{'\n'}
          3. Tap "Subscriptions"{'\n'}
          4. Find "HEEL Dog Training" and tap it{'\n'}
          5. Tap "Cancel Subscription"
        </Text>
        <Text style={styles.body}>
          Cancellation takes effect at the end of the current billing period. You will continue to have access to premium features until then. No refunds are provided for partial billing periods.
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://apps.apple.com/account/subscriptions')}>
          <Text style={styles.link}>Manage your subscriptions in Apple Settings</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Intellectual Property</Text>
        <Text style={styles.body}>
          All content in HEEL Dog Training, including text, graphics, logos, and training curricula, is the property of HEEL Dog Training and is protected by copyright laws. You may not reproduce, distribute, or create derivative works from our content without written permission.
        </Text>

        <Text style={styles.heading}>User Conduct</Text>
        <Text style={styles.body}>
          You agree to use HEEL Dog Training only for lawful purposes and in accordance with these Terms. You agree not to reverse-engineer, decompile, or attempt to extract the source code of the app.
        </Text>

        <Text style={styles.heading}>Limitation of Liability</Text>
        <Text style={styles.body}>
          HEEL Dog Training is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use of our app or training content, including but not limited to injury to persons or animals.
        </Text>

        <Text style={styles.heading}>Changes to Terms</Text>
        <Text style={styles.body}>
          We reserve the right to modify these Terms at any time. Continued use of the app after changes constitutes acceptance of the updated Terms.
        </Text>

        <Text style={styles.heading}>Contact</Text>
        <Text style={styles.body}>
          Questions about these Terms? Contact us at:{'\n\n'}
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
  subheading: { fontSize: typography.h4, fontWeight: typography.semibold, color: colors.textPrimary, marginTop: spacing.md, marginBottom: spacing.xs },
  body: { fontSize: typography.body, color: colors.textSecondary, lineHeight: 24, marginBottom: spacing.md },
  link: { fontSize: typography.body, color: colors.accent, fontWeight: typography.semibold, marginBottom: spacing.md },
});
