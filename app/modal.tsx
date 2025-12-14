
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function SessionTemplatesModal() {
  const router = useRouter();
  const { sessionTemplates, applySessionTemplate, userProgress, categories } = useApp();

  const handleTemplatePress = (templateId: string) => {
    const lessons = applySessionTemplate(templateId);
    
    if (lessons.length > 0) {
      // Navigate to the first lesson in the template
      const firstLesson = lessons[0];
      const category = categories.find(cat => 
        cat.lessons.some(l => l.id === firstLesson.id)
      );
      
      if (category) {
        router.push({
          pathname: '/lesson',
          params: {
            categoryId: category.id,
            lessonId: firstLesson.id
          }
        });
      }
    }
  };

  const getTemplateIcon = (templateId: string) => {
    switch (templateId) {
      case 'quick-reset':
        return { ios: 'bolt.fill', android: 'flash-on' };
      case 'focus-day':
        return { ios: 'eye.fill', android: 'visibility' };
      case 'energy-drain':
        return { ios: 'flame.fill', android: 'whatshot' };
      case 'public-ready':
        return { ios: 'globe', android: 'public' };
      default:
        return { ios: 'star.fill', android: 'star' };
    }
  };

  if (!userProgress.isPremium) {
    return (
      <View style={[commonStyles.container, styles.container]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="xmark"
              android_material_icon_name="close"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Session Templates</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.lockedContainer}>
          <IconSymbol
            ios_icon_name="lock.fill"
            android_material_icon_name="lock"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={styles.lockedTitle}>Premium Feature</Text>
          <Text style={styles.lockedText}>
            Session templates are available with Premium. Upgrade to access pre-built training sessions.
          </Text>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => {
              router.back();
              router.push('/(tabs)/premium');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[commonStyles.container, styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="xmark"
            android_material_icon_name="close"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session Templates</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          Pre-built training sessions designed for specific goals. Choose a template to start a focused session.
        </Text>

        {sessionTemplates.map((template, index) => {
          const icon = getTemplateIcon(template.id);
          const lessons = applySessionTemplate(template.id);

          return (
            <TouchableOpacity
              key={index}
              style={styles.templateCard}
              onPress={() => handleTemplatePress(template.id)}
              activeOpacity={0.7}
            >
              <View style={styles.templateIcon}>
                <IconSymbol
                  ios_icon_name={icon.ios}
                  android_material_icon_name={icon.android}
                  size={32}
                  color={colors.primary}
                />
              </View>
              <View style={styles.templateContent}>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateDescription}>{template.description}</Text>
                <View style={styles.templateMeta}>
                  <View style={styles.templateMetaItem}>
                    <IconSymbol
                      ios_icon_name="clock.fill"
                      android_material_icon_name="schedule"
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.templateMetaText}>{template.duration}</Text>
                  </View>
                  <View style={styles.templateMetaItem}>
                    <IconSymbol
                      ios_icon_name="list.bullet"
                      android_material_icon_name="list"
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.templateMetaText}>{lessons.length} lessons</Text>
                  </View>
                </View>
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
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
  closeButton: {
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
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  templateCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  templateIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  templateContent: {
    flex: 1,
  },
  templateName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  templateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  templateMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  templateMetaText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 4,
  },
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  lockedText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    boxShadow: '0px 4px 12px rgba(255, 59, 48, 0.3)',
    elevation: 4,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});
