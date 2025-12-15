
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function CategoryScreen() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams();
  const { categories, userProgress } = useApp();

  const category = categories.find(cat => cat.id === categoryId);

  if (!category) {
    return (
      <View style={[commonStyles.container, styles.container]}>
        <Text style={styles.errorText}>Category not found</Text>
      </View>
    );
  }

  // Sort lessons: free lessons first, then premium lessons
  const sortedLessons = [...category.lessons].sort((a, b) => {
    if (a.isPremium === b.isPremium) return 0;
    return a.isPremium ? 1 : -1;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '#4CAF50';
      case 'Intermediate':
        return '#FF9800';
      case 'Advanced':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={[commonStyles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="chevron-left"
            size={28}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.name}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>{category.description}</Text>

        {/* Disclaimer for Service Dog Pre-Class */}
        {category.disclaimer && (
          <View style={styles.disclaimerCard}>
            <IconSymbol
              ios_icon_name="info.circle.fill"
              android_material_icon_name="info"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.disclaimerText}>{category.disclaimer}</Text>
          </View>
        )}

        <View style={styles.progressCard}>
          <Text style={styles.progressText}>
            {category.completedCount} of {category.lessons.length} lessons completed
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${category.lessons.length > 0
                    ? (category.completedCount / category.lessons.length) * 100
                    : 0}%`
                }
              ]}
            />
          </View>
        </View>

        {/* Lessons */}
        <View style={styles.lessonsSection}>
          {sortedLessons.map((lesson, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.lessonCard,
                lesson.isLocked && styles.lessonCardLocked
              ]}
              onPress={() => {
                if (!lesson.isLocked) {
                  router.push({
                    pathname: '/lesson',
                    params: {
                      categoryId: category.id,
                      lessonId: lesson.id
                    }
                  });
                }
              }}
              disabled={lesson.isLocked}
              activeOpacity={0.7}
            >
              {lesson.imageUrl && (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: lesson.imageUrl }}
                    style={styles.lessonImage}
                  />
                  {lesson.isPremium && (
                    <View style={styles.premiumOverlay}>
                      <IconSymbol
                        ios_icon_name="lock.fill"
                        android_material_icon_name="lock"
                        size={32}
                        color={colors.text}
                      />
                    </View>
                  )}
                </View>
              )}
              <View style={styles.lessonContent}>
                <View style={styles.lessonHeader}>
                  <Text style={styles.lessonName}>{lesson.name}</Text>
                  {lesson.isCompleted && (
                    <IconSymbol
                      ios_icon_name="checkmark.circle.fill"
                      android_material_icon_name="check-circle"
                      size={24}
                      color={colors.primary}
                    />
                  )}
                </View>
                <View style={styles.lessonMeta}>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(lesson.difficulty) }]}>
                    <Text style={styles.difficultyText}>{lesson.difficulty}</Text>
                  </View>
                  <Text style={styles.timeText}>{lesson.estimatedTime}</Text>
                  {lesson.isPremium && (
                    <View style={styles.premiumBadge}>
                      <IconSymbol
                        ios_icon_name="lock.fill"
                        android_material_icon_name="lock"
                        size={14}
                        color={colors.text}
                      />
                      <Text style={styles.premiumText}>Premium</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 24,
  },
  disclaimerCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  disclaimerText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.secondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  lessonsSection: {
    marginBottom: 20,
  },
  lessonCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  lessonCardLocked: {
    opacity: 0.6,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  lessonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  premiumOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonContent: {
    padding: 16,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lessonName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    marginRight: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
