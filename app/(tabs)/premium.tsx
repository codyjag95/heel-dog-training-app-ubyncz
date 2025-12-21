
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useApp } from '@/contexts/AppContext';

export default function PremiumScreen() {
  const { userProgress } = useApp();

  const features = [
    {
      icon: { ios: 'map.fill', android: 'map' },
      title: 'Personalized Training Roadmap',
      description: 'Get a structured training plan based on your dog\'s quiz results',
    },
    {
      icon: { ios: 'person.2.fill', android: 'group' },
      title: 'Multi-Dog Management',
      description: 'Track progress for multiple dogs with individual profiles',
    },
    {
      icon: { ios: 'chart.bar.fill', android: 'bar-chart' },
      title: 'Advanced Progress Insights',
      description: 'See trends, patterns, and personalized recommendations',
    },
    {
      icon: { ios: 'list.bullet.clipboard.fill', android: 'assignment' },
      title: 'Training Session Templates',
      description: 'Pre-built sessions like "5-Minute Reset" and "Energy Drain"',
    },
    {
      icon: { ios: 'person.fill', android: 'person' },
      title: 'Handler Skills Module',
      description: 'Improve your training technique with handler-focused lessons',
    },
    {
      icon: { ios: 'arrow.down.circle.fill', android: 'cloud-download' },
      title: 'Offline Access',
      description: 'Download lessons to train anywhere without internet',
    },
    {
      icon: { ios: 'globe', android: 'public' },
      title: 'Real-World Proofing',
      description: 'Advanced lessons for training in distracting environments',
    },
    {
      icon: { ios: 'heart.fill', android: 'favorite' },
      title: 'Service Dog Pre-Class',
      description: 'Foundational skills for service dog preparation',
    },
    {
      icon: { ios: 'sparkles', android: 'auto-awesome' },
      title: 'No Advertisements',
      description: 'Enjoy an uninterrupted, ad-free training experience',
    },
    {
      icon: { ios: 'star.fill', android: 'star' },
      title: 'Priority Support',
      description: 'Get help faster with premium customer support',
    },
  ];

  return (
    <View style={[commonStyles.container]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <IconSymbol
            ios_icon_name="star.fill"
            android_material_icon_name="star"
            size={48}
            color={colors.primary}
          />
          <Text style={styles.title}>HEEL Premium</Text>
          <Text style={styles.subtitle}>Unlock your dog&apos;s full potential</Text>
        </View>

        {userProgress.isPremium && (
          <View style={styles.activeCard}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.activeText}>You&apos;re a Premium Member!</Text>
          </View>
        )}

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <IconSymbol
                  ios_icon_name={feature.icon.ios}
                  android_material_icon_name={feature.icon.android}
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {!userProgress.isPremium && (
          <>
            {/* Pricing */}
            <View style={styles.pricingSection}>
              <Text style={styles.sectionTitle}>Choose Your Plan</Text>
              
              <TouchableOpacity style={styles.pricingCard} activeOpacity={0.8}>
                <View style={styles.pricingHeader}>
                  <Text style={styles.pricingTitle}>Monthly</Text>
                  <View style={styles.pricingBadge}>
                    <Text style={styles.pricingBadgeText}>Popular</Text>
                  </View>
                </View>
                <Text style={styles.pricingPrice}>$9.99/month</Text>
                <Text style={styles.pricingDescription}>Cancel anytime</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.pricingCard, styles.pricingCardHighlight]} activeOpacity={0.8}>
                <View style={styles.pricingHeader}>
                  <Text style={styles.pricingTitle}>Yearly</Text>
                  <View style={[styles.pricingBadge, styles.pricingBadgeHighlight]}>
                    <Text style={styles.pricingBadgeText}>Best Value</Text>
                  </View>
                </View>
                <Text style={styles.pricingPrice}>$79.99/year</Text>
                <Text style={styles.pricingDescription}>Save 33% • $6.67/month</Text>
              </TouchableOpacity>
            </View>

            {/* CTA Button */}
            <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
              <Text style={styles.ctaButtonText}>Start Free Trial</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              7-day free trial, then auto-renews. Cancel anytime.
            </Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  activeCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: colors.primary,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  activeText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  featureCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  pricingSection: {
    marginBottom: 24,
  },
  pricingCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  pricingCardHighlight: {
    borderColor: colors.primary,
  },
  pricingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  pricingBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pricingBadgeHighlight: {
    backgroundColor: colors.primary,
  },
  pricingBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  pricingPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  pricingDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(255, 59, 48, 0.3)',
    elevation: 4,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  disclaimer: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
