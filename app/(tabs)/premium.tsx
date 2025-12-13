
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function PremiumScreen() {
  const features = [
    'Full access to all training lessons',
    'No advertisements',
    'Advanced training techniques',
    'Exclusive mental enrichment exercises',
    'Priority support',
    'New lessons added monthly',
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

        {/* Features */}
        <View style={styles.featuresCard}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Pricing */}
        <View style={styles.pricingSection}>
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
  featuresCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 12,
    flex: 1,
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
