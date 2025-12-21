
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';

interface TrainingTip {
  id: string;
  title: string;
  category: string;
  content: string;
  icon: string;
}

const TRAINING_TIPS_DATA: TrainingTip[] = [
  {
    id: 'tip-1',
    title: 'Never Yell at Your Dog',
    category: 'General',
    content: 'Yelling scares dogs and damages trust. Instead, redirect unwanted behavior to something positive. Use calm, clear commands and reward good choices. Your dog wants to please you—show them how.',
    icon: 'exclamationmark.triangle.fill',
  },
  {
    id: 'tip-2',
    title: 'Consistency Beats Perfection',
    category: 'General',
    content: 'You don\'t need to be a perfect trainer. What matters is showing up consistently. Short, daily training sessions build habits faster than occasional long sessions. Even 5 minutes a day makes a difference.',
    icon: 'calendar',
  },
  {
    id: 'tip-3',
    title: 'Reward What You Want to See',
    category: 'General',
    content: 'Dogs repeat behaviors that get rewarded. Catch your dog being good and reward it immediately. Sitting calmly? Reward. Walking nicely? Reward. Ignoring distractions? Reward. You\'ll see more of what you reinforce.',
    icon: 'gift.fill',
  },
  {
    id: 'tip-4',
    title: 'Mental Exercise Matters',
    category: 'Enrichment',
    content: 'A tired dog is a well-behaved dog, but mental exercise counts too. Puzzle toys, scent work, and training sessions tire your dog\'s brain. 15 minutes of mental work can equal a 30-minute walk.',
    icon: 'brain.head.profile',
  },
  {
    id: 'tip-5',
    title: 'Patience is Your Superpower',
    category: 'General',
    content: 'Training takes time. Your dog isn\'t being stubborn—they\'re learning. Stay patient, break tasks into smaller steps, and celebrate small wins. Frustration travels down the leash, so take breaks when needed.',
    icon: 'heart.fill',
  },
  {
    id: 'tip-6',
    title: 'Short Sessions Work Best',
    category: 'Training',
    content: 'Dogs have short attention spans. Keep training sessions to 5-10 minutes, especially for puppies. Multiple short sessions throughout the day are more effective than one long session.',
    icon: 'timer',
  },
  {
    id: 'tip-7',
    title: 'Every Interaction is Training',
    category: 'General',
    content: 'Your dog is always learning from you. Letting them pull on walks teaches pulling. Giving attention when they jump teaches jumping. Be mindful of what you\'re reinforcing in everyday moments.',
    icon: 'eye.fill',
  },
  {
    id: 'tip-8',
    title: 'Use High-Value Rewards',
    category: 'Training',
    content: 'Not all treats are equal. Save the best rewards (chicken, cheese, hot dogs) for challenging training. Use regular kibble for easy tasks. Match the reward to the difficulty of the behavior.',
    icon: 'star.fill',
  },
  {
    id: 'tip-9',
    title: 'Train Before Meals',
    category: 'Training',
    content: 'Dogs are most motivated when they\'re hungry. Schedule training sessions before meals to maximize food motivation. This doesn\'t mean starving your dog—just being strategic about timing.',
    icon: 'fork.knife',
  },
  {
    id: 'tip-10',
    title: 'Socialization is Critical',
    category: 'Puppies',
    content: 'The first 16 weeks of a puppy\'s life are crucial for socialization. Expose them to different people, places, sounds, and experiences in a positive way. This builds confidence and prevents fear later.',
    icon: 'person.3.fill',
  },
  {
    id: 'tip-11',
    title: 'Crate Training Helps Housebreaking',
    category: 'Puppies',
    content: 'Dogs naturally avoid soiling their sleeping area. A properly sized crate (just big enough to stand and turn) helps with potty training. Never use the crate as punishment—make it a positive space.',
    icon: 'house.fill',
  },
  {
    id: 'tip-12',
    title: 'Redirect, Don\'t Punish',
    category: 'General',
    content: 'When your dog does something wrong, redirect them to the right behavior instead of punishing. Chewing your shoe? Give them a toy. Jumping? Ask for a sit. Show them what to do instead.',
    icon: 'arrow.turn.up.right',
  },
  {
    id: 'tip-13',
    title: 'End on a Positive Note',
    category: 'Training',
    content: 'Always end training sessions with success. If your dog is struggling, ask for something easy they know well, reward it, and finish. This keeps training positive and builds confidence.',
    icon: 'checkmark.circle.fill',
  },
  {
    id: 'tip-14',
    title: 'Watch Your Body Language',
    category: 'Training',
    content: 'Dogs read our body language constantly. Leaning forward can be intimidating. Turning away can invite approach. Be aware of your posture, hand gestures, and energy—they communicate as much as your words.',
    icon: 'figure.stand',
  },
  {
    id: 'tip-15',
    title: 'Proof Behaviors in New Places',
    category: 'Training',
    content: 'Just because your dog sits at home doesn\'t mean they\'ll sit at the park. Practice commands in different locations with increasing distractions. This is called "proofing" and it builds reliability.',
    icon: 'globe',
  },
];

export default function TrainingTipsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  const categories = ['All', 'General', 'Training', 'Enrichment', 'Puppies'];

  const filteredTips = selectedCategory === 'All' 
    ? TRAINING_TIPS_DATA 
    : TRAINING_TIPS_DATA.filter(tip => tip.category === selectedCategory);

  const handleToggleTip = (tipId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedTip(expandedTip === tipId ? null : tipId);
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
        <Text style={styles.headerTitle}>Training Tips</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryScrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedCategory(category);
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tips List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tipsContainer}>
          {filteredTips.map((tip) => (
            <TouchableOpacity
              key={tip.id}
              style={styles.tipCard}
              onPress={() => handleToggleTip(tip.id)}
              activeOpacity={0.8}
            >
              <View style={styles.tipHeader}>
                <View style={styles.tipIconContainer}>
                  <IconSymbol
                    ios_icon_name={tip.icon as any}
                    android_material_icon_name={
                      tip.icon === 'exclamationmark.triangle.fill' ? 'warning' :
                      tip.icon === 'calendar' ? 'calendar-today' :
                      tip.icon === 'gift.fill' ? 'card-giftcard' :
                      tip.icon === 'brain.head.profile' ? 'psychology' :
                      tip.icon === 'heart.fill' ? 'favorite' :
                      tip.icon === 'timer' ? 'timer' :
                      tip.icon === 'eye.fill' ? 'visibility' :
                      tip.icon === 'star.fill' ? 'star' :
                      tip.icon === 'fork.knife' ? 'restaurant' :
                      tip.icon === 'person.3.fill' ? 'group' :
                      tip.icon === 'house.fill' ? 'home' :
                      tip.icon === 'arrow.turn.up.right' ? 'subdirectory-arrow-right' :
                      tip.icon === 'checkmark.circle.fill' ? 'check-circle' :
                      tip.icon === 'figure.stand' ? 'accessibility' :
                      'public'
                    }
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.tipTitleContainer}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipCategory}>{tip.category}</Text>
                </View>
                <IconSymbol
                  ios_icon_name={expandedTip === tip.id ? 'chevron.up' : 'chevron.down'}
                  android_material_icon_name={expandedTip === tip.id ? 'expand-less' : 'expand-more'}
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              
              {expandedTip === tip.id && (
                <View style={styles.tipContent}>
                  <Text style={styles.tipText}>{tip.content}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer Message */}
        <View style={styles.footer}>
          <IconSymbol
            ios_icon_name="lightbulb.fill"
            android_material_icon_name="lightbulb"
            size={32}
            color={colors.primary}
          />
          <Text style={styles.footerText}>
            These tips appear occasionally during training sessions to help you build better habits.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  categoryScroll: {
    maxHeight: 60,
    marginBottom: 16,
  },
  categoryScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryButtonTextActive: {
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  tipsContainer: {
    paddingHorizontal: 20,
  },
  tipCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTitleContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  tipCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tipContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
  },
  tipText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 32,
    gap: 16,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
