import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { CHALLENGE_LABELS } from '../data/quizData_v2';
import { colors, typography, spacing } from '../data/darkTheme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function QuizResultsScreen() {
  const router = useRouter();
  const { userProfile } = useApp();
  const [insightExpanded, setInsightExpanded] = useState(false);

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="paw" size={64} color={colors.accent} style={{ marginBottom: spacing.lg }} />
          <Text style={styles.errorTitle}>Welcome to HEEL</Text>
          <Text style={styles.errorText}>Take the quiz to get your personalized training plan</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/(tabs)/quiz')}
          >
            <Text style={styles.buttonText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const {
    dogName,
    breed,
    energyLevel,
    experience,
    challenges,
    q9Challenges,
    recommendedCategories,
  } = userProfile;

  // ============================================================================
  // UNIFIED CHALLENGES — merge Q6 + Q9 for display
  // ============================================================================
  const allChallenges = [...new Set([
    ...(q9Challenges || []),
    ...(challenges || []),
  ])];

  // Generate personalized breed insight
  const getBreedInsight = () => {
    const breedLower = breed.toLowerCase();
    
    if (breedLower.includes('australian shepherd') || breedLower.includes('aussie')) {
      return `${dogName} is an Australian Shepherd—one of the most intelligent and high-energy breeds. Without proper mental and physical stimulation, Aussies can become destructive and develop anxiety. Teaching calm behavior and impulse control early is essential, as they were bred to work all day herding livestock.`;
    }
    if (breedLower.includes('border collie')) {
      return `${dogName} is a Border Collie—the Einstein of dog breeds. They need constant mental challenges or they'll find their own entertainment (usually destructive). Early training in impulse control and "off-switch" behavior is critical for this breed.`;
    }
    if (breedLower.includes('golden') || breedLower.includes('labrador')) {
      return `${dogName} is a ${breed}—a friendly, food-motivated athlete. While generally eager to please, they can be overly enthusiastic and prone to jumping. Focus on impulse control and calm greetings will make life much easier.`;
    }
    if (breedLower.includes('husky')) {
      return `${dogName} is a Siberian Husky—bred to run 100 miles a day. They're escape artists with selective hearing. Recall training and mental enrichment are non-negotiable for this breed, and they may never be fully off-leash reliable.`;
    }
    if (breedLower.includes('german shepherd')) {
      return `${dogName} is a German Shepherd—a versatile working breed that bonds intensely with their family. Early socialization and confidence-building are crucial, as they can become overprotective without proper guidance.`;
    }
    if (breedLower.includes('pit') || breedLower.includes('staffordshire')) {
      return `${dogName} is incredibly strong and athletic with a high pain tolerance. Early impulse control and gentle play training are essential, as they don't always know their own strength. They're highly trainable and eager to please.`;
    }
    if (breedLower.includes('rottweiler')) {
      return `${dogName} is a Rottweiler—a confident, powerful working breed that's deeply loyal. They respond well to firm but fair training and need early socialization. Rottweilers excel at obedience but require a handler who's consistent and calm.`;
    }
    if (breedLower.includes('doberman')) {
      return `${dogName} is a Doberman Pinscher—one of the most intelligent and trainable breeds. They bond deeply with their handler and thrive on structure. Without mental stimulation and clear leadership, they can become anxious or overprotective.`;
    }
    if (breedLower.includes('boxer')) {
      return `${dogName} is a Boxer—an athletic, playful breed that stays puppy-like well into adulthood. Their enthusiasm can make training challenging, but they're incredibly eager to please. Focus on impulse control and teaching a calm settle.`;
    }
    if (breedLower.includes('malinois')) {
      return `${dogName} is a Belgian Malinois—one of the most intense working breeds. They require experienced handling, extensive mental work, and a job to do. Without proper outlets, Malinois can develop serious behavioral issues. Structured training is non-negotiable.`;
    }
    if (breedLower.includes('poodle')) {
      return `${dogName} is a Poodle—don't let the haircut fool you, they're one of the smartest breeds. They pick up training quickly but can also learn bad habits fast. Keep sessions varied and challenging to hold their attention.`;
    }
    if (breedLower.includes('corgi')) {
      return `${dogName} is a Corgi—a herding breed in a small package. They're smart, opinionated, and may try to herd children and other pets by nipping at heels. Early training in bite inhibition and recall is important for this breed.`;
    }
    if (breedLower.includes('dachshund')) {
      return `${dogName} is a Dachshund—bred to hunt badgers, so stubbornness comes standard. They respond best to food motivation and short, fun training sessions. Consistent house training is often their biggest challenge.`;
    }
    if (breedLower.includes('bulldog') && !breedLower.includes('french')) {
      return `${dogName} is a Bulldog—a low-energy companion who can be stubborn. Short, positive training sessions work best, as they tire quickly due to their build. Focus on basic obedience and keeping them at a healthy weight.`;
    }
    if (breedLower.includes('french')) {
      return `${dogName} is a French Bulldog—a charming companion who wants to be wherever you are. They can be stubborn, so patience and food motivation work best. Keep sessions short due to their breathing limitations.`;
    }
    if (breedLower.includes('chihuahua')) {
      return `${dogName} may be small, but Chihuahuas have big personalities and can develop "small dog syndrome" if not properly trained. Don't skip the basics just because they're tiny—they benefit from the same structure as larger breeds.`;
    }
    if (breedLower.includes('beagle')) {
      return `${dogName} is a Beagle—a scent hound bred to follow their nose. Recall training will be challenging, and food motivation is sky-high. Use their nose in training games to tire them mentally.`;
    }
    if (breedLower.includes('great dane')) {
      return `${dogName} is a Great Dane—a gentle giant that doesn't know their own size. Leash manners and calm greetings are critical before they're full-grown, because a 150lb dog that pulls or jumps is dangerous. Start early.`;
    }
    if (breedLower.includes('cattle dog')) {
      return `${dogName} is an Australian Cattle Dog—bred to herd cattle, so they're tough, smart, and have endless energy. They may nip at heels and need a clear job to do. Without mental stimulation and structure, they'll create their own (destructive) entertainment.`;
    }
    if (breedLower.includes('jack russell')) {
      return `${dogName} is a Jack Russell Terrier—small but packed with more energy than dogs twice their size. They need mental challenges, firm boundaries, and consistent training. Their prey drive is strong, so recall in open areas will be a project.`;
    }
    if (energyLevel >= 8) {
      return `${dogName} is a ${breed} with very high energy levels. They need both physical exercise AND mental stimulation daily. Without it, you'll see destructive behavior, hyperactivity, and difficulty settling. Focus on teaching an "off switch" early.`;
    }
    if (energyLevel >= 5) {
      return `${dogName} is a ${breed} with moderate energy. They'll need daily exercise and mental engagement, but are generally adaptable to most living situations with proper training and enrichment.`;
    }
    return `${dogName} is a ${breed}—a lower-energy companion who's content with shorter training sessions. Focus on consistency and positive reinforcement, keeping sessions fun and engaging to maintain their interest.`;
  };

  const toggleInsight = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setInsightExpanded(!insightExpanded);
  };

  // ============================================================================
  // IMMEDIATE PRIORITIES — reads from BOTH Q6 and Q9
  // This was the bug: it only checked `challenges` (Q6), missing Q9 answers
  // ============================================================================
  const getChallengeAdvice = () => {
    // Nothing to show if no challenges at all
    if (allChallenges.length === 0) return null;

    const cards: React.ReactElement[] = [];

    if (allChallenges.includes('potty')) {
      cards.push(
        <View key="potty" style={styles.adviceCard}>
          <View style={styles.adviceIconContainer}>
            <Ionicons name="home" size={22} color={colors.accent} />
          </View>
          <View style={styles.adviceContent}>
            <Text style={styles.adviceTitle}>Potty Training</Text>
            <Text style={styles.adviceText}>
              Consistency is everything. Take {dogName} out every 2 hours, after meals, play, and naps. 
              Reward immediately when they go outside. Accidents will happen—clean with enzyme cleaner and increase supervision.
            </Text>
          </View>
        </View>
      );
    }
    
    if (allChallenges.includes('biting') || allChallenges.includes('biting_urgent')) {
      cards.push(
        <View key="biting" style={styles.adviceCard}>
          <View style={styles.adviceIconContainer}>
            <Ionicons name="alert-circle" size={22} color={colors.accent} />
          </View>
          <View style={styles.adviceContent}>
            <Text style={styles.adviceTitle}>Bite Inhibition</Text>
            <Text style={styles.adviceText}>
              Puppy biting is normal but must be addressed early. When {dogName} bites too hard, say "ouch!" 
              and stop playing immediately. Redirect to appropriate toys. This teaches them to control bite pressure.
            </Text>
          </View>
        </View>
      );
    }
    
    if (allChallenges.includes('leash_pulling')) {
      cards.push(
        <View key="leash" style={styles.adviceCard}>
          <View style={styles.adviceIconContainer}>
            <Ionicons name="walk" size={22} color={colors.accent} />
          </View>
          <View style={styles.adviceContent}>
            <Text style={styles.adviceTitle}>Leash Manners</Text>
            <Text style={styles.adviceText}>
              Stop moving the instant the leash goes tight. Only walk when it's loose. 
              This is tedious at first but transforms walks. Consider a front-clip harness for mechanical advantage.
            </Text>
          </View>
        </View>
      );
    }

    if (allChallenges.includes('recall')) {
      cards.push(
        <View key="recall" style={styles.adviceCard}>
          <View style={styles.adviceIconContainer}>
            <Ionicons name="megaphone" size={22} color={colors.accent} />
          </View>
          <View style={styles.adviceContent}>
            <Text style={styles.adviceTitle}>Recall Training</Text>
            <Text style={styles.adviceText}>
              Never use {dogName}'s recall word unless you can enforce it. Start indoors with zero distractions, 
              then slowly add distance and distraction. Make coming to you the BEST thing that happens all day.
            </Text>
          </View>
        </View>
      );
    }

    if (allChallenges.includes('jumping')) {
      cards.push(
        <View key="jumping" style={styles.adviceCard}>
          <View style={styles.adviceIconContainer}>
            <Ionicons name="arrow-up" size={22} color={colors.accent} />
          </View>
          <View style={styles.adviceContent}>
            <Text style={styles.adviceTitle}>Jumping on People</Text>
            <Text style={styles.adviceText}>
              Turn away completely when {dogName} jumps—give zero attention until all four paws are on the floor. 
              Then immediately reward. Consistency from everyone in the household is critical.
            </Text>
          </View>
        </View>
      );
    }

    if (allChallenges.includes('barking')) {
      cards.push(
        <View key="barking" style={styles.adviceCard}>
          <View style={styles.adviceIconContainer}>
            <Ionicons name="volume-high" size={22} color={colors.accent} />
          </View>
          <View style={styles.adviceContent}>
            <Text style={styles.adviceTitle}>Excessive Barking</Text>
            <Text style={styles.adviceText}>
              Identify what triggers the barking—boredom, alerts, demand, or anxiety all require different approaches. 
              Never yell at {dogName} to stop barking, as it sounds like you're joining in.
            </Text>
          </View>
        </View>
      );
    }
    
    if (allChallenges.includes('separation')) {
      cards.push(
        <View key="separation" style={styles.adviceCard}>
          <View style={styles.adviceIconContainer}>
            <Ionicons name="heart-dislike" size={22} color={colors.accent} />
          </View>
          <View style={styles.adviceContent}>
            <Text style={styles.adviceTitle}>Separation Anxiety</Text>
            <Text style={styles.adviceText}>
              Start with very short absences (30 seconds) and slowly build up. 
              Don't make departures or arrivals a big deal. Teaching {dogName} to settle on a mat gives them a "job" when you leave.
            </Text>
          </View>
        </View>
      );
    }

    if (allChallenges.includes('fear')) {
      cards.push(
        <View key="fear" style={styles.adviceCard}>
          <View style={styles.adviceIconContainer}>
            <Ionicons name="shield" size={22} color={colors.accent} />
          </View>
          <View style={styles.adviceContent}>
            <Text style={styles.adviceTitle}>Fear & Nervousness</Text>
            <Text style={styles.adviceText}>
              Never force {dogName} into scary situations. Let them observe from a distance, 
              reward brave behavior, and gradually decrease distance over days/weeks. Building confidence through obedience helps enormously.
            </Text>
          </View>
        </View>
      );
    }
    
    if (allChallenges.includes('hyperactive') || allChallenges.includes('overstimulated')) {
      cards.push(
        <View key="hyper" style={styles.adviceCard}>
          <View style={styles.adviceIconContainer}>
            <Ionicons name="heart" size={22} color={colors.accent} />
          </View>
          <View style={styles.adviceContent}>
            <Text style={styles.adviceTitle}>Calm Training</Text>
            <Text style={styles.adviceText}>
              High energy dogs MUST learn to settle. Start rewarding {dogName} for just lying down calmly. 
              Mental work (training, puzzle toys) is as tiring as physical exercise. Teach an "off switch" now.
            </Text>
          </View>
        </View>
      );
    }

    // Only render section if we have cards
    if (cards.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>YOUR IMMEDIATE PRIORITIES</Text>
        {cards}
      </View>
    );
  };

  // Get urgency level for category
  const getCategoryUrgency = (categoryId: string, index: number) => {
    // Q9 urgent issues always get CRITICAL label
    if (index === 0 && (
      q9Challenges?.includes('potty') ||
      q9Challenges?.includes('biting_urgent') ||
      q9Challenges?.includes('separation') ||
      q9Challenges?.includes('fear')
    )) {
      const urgencyMessages: { [key: string]: string } = {
        'potty_training': 'Start now to establish good habits',
        'biting_nipping': 'Bite inhibition must be taught early',
        'calm_focus': 'Address anxiety before it worsens',
        'everyday_obedience': 'Build confidence through structure',
      };
      return {
        level: 'CRITICAL',
        color: colors.accent,
        message: urgencyMessages[categoryId] || 'Address this first',
      };
    }

    switch (categoryId) {
      case 'potty_training':
        return { level: 'CRITICAL', color: colors.accent, message: 'Start now to establish good habits' };
      case 'biting_nipping':
        return { level: 'CRITICAL', color: colors.accent, message: 'Bite inhibition must be taught early' };
      case 'everyday_obedience':
        return experience <= 1 
          ? { level: 'FOUNDATION', color: colors.accent, message: 'Essential building blocks' }
          : { level: '', color: colors.textSecondary, message: 'Build reliable basics' };
      case 'calm_focus':
        return energyLevel >= 9
          ? { level: 'ESSENTIAL', color: colors.accent, message: 'Prevent destructive behavior' }
          : { level: '', color: colors.textSecondary, message: 'Teach impulse control' };
      case 'mental_work':
        return energyLevel >= 8
          ? { level: 'ESSENTIAL', color: colors.accent, message: 'Mental work prevents destruction' }
          : { level: '', color: colors.textSecondary, message: 'Keep them engaged' };
      case 'recall':
        return { level: '', color: colors.textSecondary, message: 'Build reliable off-leash safety' };
      case 'leash_walks':
        return { level: '', color: colors.textSecondary, message: 'Transform your daily walks' };
      default:
        return { level: '', color: colors.textSecondary, message: '' };
    }
  };

  // ============================================================================
  // WHY THIS PLAN — human-readable challenge descriptions
  // ============================================================================
  const getHumanChallenges = (): string => {
    if (allChallenges.length === 0) return 'building a strong foundation';
    
    const readable = allChallenges
      .filter(c => !c.startsWith('goal_'))  // exclude goal tags
      .map(c => CHALLENGE_LABELS[c] || c)
      .slice(0, 3);  // max 3 for readability
    
    if (readable.length === 0) return 'building a strong foundation';
    return readable.join(', ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Success Badge */}
        <View style={styles.successBadge}>
          <Ionicons name="checkmark" size={40} color="#FFFFFF" />
        </View>

        {/* Title */}
        <Text style={styles.title}>{dogName}'s Training Plan{'\n'}is Ready!</Text>

        {/* Collapsible Breed Insight Card */}
        <TouchableOpacity 
          style={styles.insightCard}
          onPress={toggleInsight}
          activeOpacity={0.8}
        >
          <View style={styles.insightHeader}>
            <Text style={styles.insightTitle}>Understanding {dogName}</Text>
            <Ionicons 
              name={insightExpanded ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={colors.accent} 
            />
          </View>
          {insightExpanded && (
            <Text style={styles.insightText}>{getBreedInsight()}</Text>
          )}
          {!insightExpanded && (
            <Text style={styles.insightPreview}>Tap to read about your {breed}'s training needs</Text>
          )}
        </TouchableOpacity>

        {/* Challenge-Specific Advice — MOVED ABOVE categories for visibility */}
        {getChallengeAdvice()}

        {/* Recommended Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOUR TRAINING ROADMAP</Text>
          <Text style={styles.sectionSubtitle}>
            Start with the top priorities, then move down the list
          </Text>
          
          {recommendedCategories.map((categoryId, index) => {
            const categoryNames: { [key: string]: { name: string; desc: string; isPremium?: boolean } } = {
              'everyday_obedience': { name: 'Everyday Obedience', desc: 'Foundation commands every dog needs' },
              'potty_training': { name: 'Potty Training', desc: 'Establish reliable bathroom habits', isPremium: true },
              'biting_nipping': { name: 'Biting & Nipping', desc: 'Teach bite inhibition and gentle play', isPremium: true },
              'leash_walks': { name: 'Leash & Walks', desc: 'Perfect loose-leash walking' },
              'calm_focus': { name: 'Calm & Focus', desc: 'Teaching impulse control and settle' },
              'recall': { name: 'Recall', desc: 'Reliable come-when-called' },
              'mental_work': { name: 'Mental Stimulation', desc: 'Brain games to tire them out' },
              'real_world_proofing': { name: 'Real-World Proofing', desc: 'Training in distracting environments', isPremium: true },
              'service_dog': { name: 'Service Dog Pre-Class', desc: 'Foundational skills for service dogs', isPremium: true },
              'handler_skills': { name: 'Handler Skills', desc: 'Improve your training technique', isPremium: true },
              'tricks': { name: 'Tricks', desc: 'Fun tricks from crowd-pleasers to jaw-droppers' },
            };
            
            const category = categoryNames[categoryId] || { name: categoryId, desc: '', isPremium: false };
            const urgency = getCategoryUrgency(categoryId, index);
            
            return (
              <View key={categoryId} style={[
                styles.categoryCard,
                index === 0 && styles.categoryCardPriority
              ]}>
                <View style={styles.categoryHeader}>
                  <View style={[
                    styles.categoryNumber,
                    index === 0 && styles.categoryNumberPriority
                  ]}>
                    <Text style={styles.categoryNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.categoryInfo}>
                    <View style={styles.categoryTitleRow}>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      {category.isPremium && (
                        <View style={styles.premiumBadge}>
                          <Text style={styles.premiumText}>PREMIUM</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.categoryDesc}>{category.desc}</Text>
                    {urgency.level && (
                      <Text style={[styles.urgencyText, { color: urgency.color }]}>
                        {urgency.level}: {urgency.message}
                      </Text>
                    )}
                    {category.isPremium && (
                      <View style={styles.freeTrialRow}>
                        <Ionicons name="checkmark-circle" size={13} color={colors.accent} />
                        <Text style={styles.freeTrialText}>First 2 lessons FREE</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Why This Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WHY THIS PLAN?</Text>
          <View style={styles.whyCard}>
            <WhyPoint text={`Tailored to ${breed} temperament and energy level`} />
            <WhyPoint text={`Addresses your specific challenges: ${getHumanChallenges()}`} />
            <WhyPoint text={`Matches your ${userProfile.availability}-minute daily commitment`} />
            <WhyPoint text={`Uses ${userProfile.motivationType === 'mixed' ? 'a mix of rewards' : userProfile.motivationType} as primary reward system`} />
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.startButtonText}>Start Training {dogName}</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function WhyPoint({ text }: { text: string }) {
  return (
    <View style={styles.whyRow}>
      <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
      <Text style={styles.whyText}>{text}</Text>
    </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxxl,
  },
  errorTitle: {
    fontSize: typography.h1,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },

  // Success Badge
  successBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  // Title
  title: {
    fontSize: typography.h1,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
    lineHeight: 36,
  },

  // Collapsible Insight Card
  insightCard: {
    backgroundColor: colors.cardBackground,
    padding: spacing.xl,
    borderRadius: 16,
    marginBottom: spacing.xxxl,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: colors.accent,
  },
  insightText: {
    fontSize: typography.body,
    color: colors.textPrimary,
    lineHeight: 24,
    marginTop: spacing.md,
  },
  insightPreview: {
    fontSize: typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // Sections
  section: {
    marginBottom: spacing.xxxl,
  },
  sectionTitle: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  sectionSubtitle: {
    fontSize: typography.small,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  // Category Cards
  categoryCard: {
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryCardPriority: {
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.cardBackgroundSecondary,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  categoryNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryNumberPriority: {
    backgroundColor: colors.accent,
  },
  categoryNumberText: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  categoryDesc: {
    fontSize: typography.small,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: typography.bold,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  freeTrialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  freeTrialText: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: typography.semibold,
  },
  premiumBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  premiumText: {
    fontSize: 9,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },

  // Advice Cards
  adviceCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  adviceIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.cardBackgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  adviceContent: {
    flex: 1,
  },
  adviceTitle: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  adviceText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // Why Card
  whyCard: {
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: 12,
    gap: spacing.md,
  },
  whyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  whyText: {
    flex: 1,
    fontSize: typography.body,
    color: colors.textPrimary,
    lineHeight: 24,
  },

  // Buttons
  startButton: {
    backgroundColor: colors.accent,
    padding: spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  startButtonText: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.lg,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
});
