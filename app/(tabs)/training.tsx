import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../../data/categoryData';
import { useApp } from '../../contexts/AppContext';
import { colors, typography, spacing } from '../../data/darkTheme';
import { CATEGORY_ICONS } from '../../data/iconSystem';
import ScrollFade from '../../components/ScrollFade';

export default function TrainingScreen() {
  const router = useRouter();
  const { getCategoryProgress, hasPremium } = useApp();

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/category/${categoryId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollFade fadeBottom>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Training Categories</Text>
        <Text style={styles.subtitle}>
          Choose a category to start training
        </Text>

        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((category) => {
            const progress = getCategoryProgress(category.id);
            const progressPercent = progress.total > 0
              ? Math.round((progress.completed / progress.total) * 100)
              : 0;
            
            // Check if category has premium lessons
            const hasPremiumLessons = category.lessons?.some(lesson => lesson.isPremium) || false;
            const showPremiumBadge = hasPremiumLessons && !hasPremium;

            return (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category.id)}
                activeOpacity={0.7}
              >
                {/* Icon */}
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={CATEGORY_ICONS[category.id] || 'book'}
                    size={32}
                    color={colors.accent}
                  />
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                  <View style={styles.titleRow}>
                    <Text style={styles.categoryTitle} numberOfLines={1}>
                      {category.title}
                    </Text>
                    {showPremiumBadge && (
                      <View style={styles.premiumBadge}>
                        <Ionicons name="star" size={10} color={colors.textPrimary} />
                      </View>
                    )}
                  </View>
                  
                  <Text style={styles.categoryDescription} numberOfLines={2}>
                    {category.description}
                  </Text>

                  {/* Progress Bar */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${progressPercent}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {progress.completed}/{progress.total}
                    </Text>
                  </View>
                </View>

                {/* Arrow */}
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textTertiary}
                  style={styles.arrow}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      </ScrollFade>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    fontSize: typography.h1,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xxxl,
  },
  categoriesGrid: {
    gap: spacing.md,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.cardBackgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryTitle: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  premiumBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryDescription: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  progressText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    fontWeight: typography.semibold,
    minWidth: 40,
  },
  arrow: {
    marginLeft: spacing.sm,
  },
});
