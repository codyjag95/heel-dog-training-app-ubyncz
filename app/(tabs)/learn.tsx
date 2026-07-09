/**
 * Learn Tab — Knowledge base, breed guides, training tips, premium content
 * PLACEMENT: app/(tabs)/learn.tsx
 */

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import { getBreedById } from '../../data/breedDatabase';
import { colors, typography, spacing } from '../../data/darkTheme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ============================================================================
// QUICK TIPS DATA
// ============================================================================
const QUICK_TIPS = [
  { icon: 'time-outline', title: 'Keep Sessions Short', text: 'Train for 5-10 minutes max. Multiple short sessions beat one long one. End before your dog gets bored.' },
  { icon: 'restaurant-outline', title: 'Train Before Meals', text: 'A slightly hungry dog is a motivated dog. Schedule training sessions right before mealtime for maximum food drive.' },
  { icon: 'happy-outline', title: 'End on a Win', text: 'Always finish with something your dog can succeed at. Ending on a positive note builds confidence and keeps them excited for next time.' },
  { icon: 'close-circle-outline', title: "Don't Repeat Commands", text: 'Say the cue once. If they don\'t respond, help them into position. Repeating "sit, sit, SIT" teaches them to ignore the first two.' },
  { icon: 'volume-mute-outline', title: 'Silence is a Tool', text: 'Stop talking during training. Most people talk too much. One clear cue, then silence while your dog thinks. Let them problem-solve.' },
  { icon: 'swap-horizontal-outline', title: 'Train in Different Places', text: 'A "sit" in the kitchen isn\'t the same as "sit" at the park. Dogs don\'t generalize well, so practice every skill in 5+ locations.' },
  { icon: 'flash-outline', title: 'Reward Speed Matters', text: 'You have about 1 second after the behavior to deliver the reward. Late rewards teach the wrong thing. Mark with "yes!" then treat fast.' },
  { icon: 'people-outline', title: 'Everyone Must Be Consistent', text: 'If you say "off" but your partner lets the dog on the couch, the dog learns that rules are optional. Get the whole household on the same page.' },
  { icon: 'fitness-outline', title: 'Exercise Before Expecting Focus', text: 'A dog with pent-up energy cannot concentrate. A 15-minute walk or play session before training dramatically improves results.' },
  { icon: 'heart-outline', title: 'Relationship Over Obedience', text: 'Your dog doesn\'t need to be perfect. They need to trust you, enjoy training, and feel safe making mistakes. The bond matters more than the commands.' },
];

// ============================================================================
// TRAINING FUNDAMENTALS (FREE)
// ============================================================================
const FUNDAMENTALS = [
  {
    id: 'positive_reinforcement',
    title: 'Why Positive Reinforcement Works',
    icon: 'thumbs-up-outline',
    preview: 'The science behind reward-based training and why it outperforms punishment.',
    isPremium: false,
    content: [
      'Positive reinforcement means adding something your dog wants (treat, toy, praise) immediately after a behavior you want to see again. It\'s not permissive. It\'s precise.',
      'Dogs repeat behaviors that pay off. If sitting earns a treat, they\'ll sit more. If jumping earns attention (even negative attention), they\'ll jump more. You control which behaviors "pay" by controlling what you reward.',
      'Punishment-based training (yelling, leash corrections, shock collars) suppresses behavior through fear. The dog stops jumping because they\'re afraid of the consequence, not because they\'ve learned what TO do instead. This creates anxiety, damages trust, and often causes new behavior problems.',
      'Research consistently shows positive reinforcement produces faster, more reliable results with fewer behavioral side effects. Dogs trained with aversive methods show more stress behaviors and are often rated as less obedient by their own owners.',
      'The key to effective positive reinforcement: timing (reward within 1 second), consistency (reward every correct response during learning), and value (use rewards your dog actually cares about, not just dry kibble).',
    ],
  },
  {
    id: 'body_language',
    title: 'Reading Your Dog\'s Body Language',
    icon: 'eye-outline',
    preview: 'Learn what your dog is telling you before they bark, bite, or shut down.',
    isPremium: false,
    content: [
      'Dogs communicate primarily through body language, not vocalizations. Learning to read their signals prevents problems before they escalate and deepens your relationship.',
      'Stress signals to watch for: lip licking (when no food is present), yawning (when not tired), whale eye (showing whites of eyes), panting (when not hot), tucked tail, ears pinned back, turning away, shaking off (like after a bath, but when dry). These all mean your dog is uncomfortable.',
      'Relaxed signals: soft eyes, loose body, play bow (front end down, back end up), relaxed open mouth, tail wagging at mid-height with a loose wag, rolling over for belly rubs with a relaxed body.',
      'Warning signals before aggression: hard stare, stiff body, raised hackles, closed mouth with tension, growling, showing teeth. These are NOT bad behavior. They\'re communication. A dog who growls is telling you they\'re uncomfortable before they resort to biting. Never punish growling.',
      'Context matters enormously. A wagging tail doesn\'t always mean happy. A stiff, high-speed wag can indicate arousal or agitation. A yawn during training might be stress, not boredom. Look at the whole dog, not just one signal.',
    ],
  },
  {
    id: 'treat_rewards',
    title: 'The Science of Treats & Rewards',
    icon: 'nutrition-outline',
    preview: 'How to use food effectively without creating a treat-dependent dog.',
    isPremium: false,
    content: [
      'Treats are your primary training currency during the learning phase. Just like you wouldn\'t expect to learn a new job without a paycheck, your dog needs compensation for learning new skills.',
      'Treat hierarchy matters. Have three tiers: low-value (kibble, plain biscuits) for easy tasks, medium-value (commercial training treats, cheese) for moderate challenges, and high-value (real meat, hot dogs, freeze-dried liver) for difficult tasks or distracting environments.',
      'The "but I don\'t want to use treats forever" concern: you won\'t. Once a behavior is learned and reliable, you fade treats using a variable reward schedule. Sometimes they get a treat, sometimes just praise, sometimes a toy. This actually makes the behavior stronger. It\'s the same psychology that makes slot machines addictive.',
      'Common mistakes: using treats that are too big (pea-sized is plenty), too slow (fumbling in a treat pouch while the moment passes), or too low-value (expecting kibble to compete with a squirrel). Match the reward to the difficulty.',
      'For dogs who aren\'t food-motivated: try training before meals, use higher-value treats (real meat, not commercial treats), or switch to toy/play rewards. Every dog has a motivator. You just need to find it.',
    ],
  },
  {
    id: 'common_myths',
    title: 'Training Myths Debunked',
    icon: 'alert-circle-outline',
    preview: 'Stop believing these common misconceptions that hold back your training.',
    isPremium: false,
    content: [
      '"You have to be the alpha / pack leader." This is based on debunked wolf research from the 1940s. The researcher who coined the term later spent his career trying to correct it. Dogs aren\'t trying to dominate you. They\'re trying to figure out what works to get what they want.',
      '"They know what they did wrong, look at that guilty face." That "guilty look" is actually appeasement behavior in response to YOUR body language. They can tell you\'re upset, but they don\'t connect it to the shoe they chewed 3 hours ago. Punishment after the fact teaches fear, not understanding.',
      '"You can\'t teach an old dog new tricks." Older dogs learn just fine. They may be slower or less motivated by food, but they have better focus and impulse control than puppies. Adjust your methods and expectations.',
      '"My dog is being stubborn / spiteful." Dogs don\'t have spite. If your dog isn\'t doing what you ask, either they don\'t understand the cue, the environment is too distracting, the reward isn\'t motivating enough, or they\'re stressed, tired, or in pain. It\'s always one of those four.',
      '"Rubbing their nose in it teaches them not to potty inside." It doesn\'t. It teaches them that you\'re unpredictable and scary, and that they should potty where you can\'t see them (behind the couch, in the closet). Clean up, adjust your schedule, and move on.',
    ],
  },
  {
    id: 'puppy_socialization',
    title: 'The Socialization Window',
    icon: 'people-outline',
    preview: 'The most critical period in your puppy\'s life and how to use it.',
    isPremium: false,
    content: [
      'Between 3 and 14 weeks of age, puppies have a critical socialization window where their brain is literally wired to accept new experiences as normal. What they encounter during this period shapes their temperament for life.',
      'Socialization doesn\'t mean "meet as many dogs as possible." It means calm, positive exposure to: different people (men, women, children, people in hats/uniforms/wheelchairs), surfaces (grass, metal, wood, grates), sounds (traffic, thunder recordings, appliances), environments (stores, parks, cars), and handling (paws, ears, mouth, being held).',
      'Quality over quantity. One bad experience during the socialization window can create a lasting fear. A puppy who gets bowled over by a big dog at 10 weeks may become dog-reactive for life. Keep all exposures controlled and positive.',
      'The socialization window starts closing around 14 weeks. After that, new experiences become progressively scarier rather than exciting. This is why waiting until "all vaccines are done" to expose your puppy to the world can backfire. The window may have already closed.',
      'Talk to your vet about safe socialization before full vaccination. Many vets now recommend controlled exposure (carrying your puppy in stores, visiting friends\' vaccinated dogs, puppy socialization classes with health requirements) rather than complete isolation until 16 weeks.',
    ],
  },
];

// ============================================================================
// PREMIUM ARTICLES (locked for free users)
// ============================================================================
const PREMIUM_ARTICLES = [
  {
    id: 'reactivity_guide',
    title: 'Fixing Reactivity: A Complete Guide',
    icon: 'flash-outline',
    preview: 'Why your dog loses it on walks and the step-by-step process to fix it.',
    content: [
      'Reactivity is one of the most common and frustrating behavior problems dog owners face. Your dog sees another dog, a person, a bike, or a squirrel, and suddenly they\'re lunging, barking, and completely checked out. It feels embarrassing and overwhelming.',
      'First, understand what\'s happening. Most reactive dogs are not aggressive. They\'re overstimulated, frustrated, or scared. The barking and lunging is their way of saying "that thing is too much for me right now." Knowing this changes how you approach the fix.',
      'The foundation of reactivity work is distance. Find the distance where your dog notices the trigger but can still think clearly. This is called the "threshold." Below threshold, your dog can learn. Over threshold, they\'re just reacting on autopilot.',
      'The protocol: when your dog notices a trigger at or below threshold, mark ("yes!") and reward. You\'re teaching them that seeing the scary thing predicts good stuff. Over time, their emotional response shifts from "threat" to "treat dispenser nearby."',
      'This is not a quick fix. Depending on how deep the reactivity is, expect weeks to months of consistent work. But the alternative (avoiding all triggers forever) isn\'t sustainable. Reactivity is fixable. It just takes patience and a plan.',
    ],
  },
  {
    id: 'separation_anxiety',
    title: 'Separation Anxiety: What Actually Works',
    icon: 'home-outline',
    preview: 'Real solutions for the dog who can\'t be left alone.',
    content: [
      'True separation anxiety is a panic disorder. Your dog isn\'t "being bad" when you leave. They\'re experiencing genuine distress, the same way a person with a phobia can\'t just "stop being scared." This distinction matters because it changes the approach entirely.',
      'Signs of real separation anxiety: destruction focused on exits (doors, windows, crates), drooling or panting when you pick up your keys, refusing to eat when alone, barking or howling that starts within minutes of you leaving and doesn\'t stop, self-harm from trying to escape.',
      'The fix is called systematic desensitization. You practice leaving for durations your dog can handle without panicking, then gradually increase the time. Start with stepping outside for 2 seconds. Then 5. Then 10. Then 30. Build up over days and weeks.',
      'What doesn\'t work: punishment (makes panic worse), flooding (leaving them for hours hoping they\'ll "get used to it"), crate training alone (the crate doesn\'t fix the underlying panic), and ignoring them when you get home (this is outdated advice that doesn\'t address the core issue).',
      'What helps alongside training: exercise before departures, food puzzles to create positive associations with alone time, calming music or white noise, and in severe cases, medication prescribed by your vet. This isn\'t "drugging your dog." It\'s reducing panic enough for the training to work.',
    ],
  },
  {
    id: 'calm_challenge',
    title: 'The 7-Day Calm Challenge',
    icon: 'leaf-outline',
    preview: 'A structured week of exercises to build a calmer, more focused dog.',
    content: [
      'Day 1: Mat training basics. Pick a mat, towel, or bed. Lure your dog onto it, mark and reward. Repeat 20 times. The goal today is just "being on the mat = good things happen."',
      'Day 2: Duration on the mat. Your dog gets on the mat, you wait 2 seconds before rewarding. Then 5 seconds. Then 10. If they get up, no big deal. Just reset and try a shorter duration. Build the idea that staying put pays off.',
      'Day 3: Settle. Once your dog is holding position on the mat, start rewarding calmer body language specifically. Lying down gets a treat. Putting their chin on the floor gets a treat. You\'re shaping relaxation, not just position.',
      'Day 4: Distance. With your dog settled on the mat, take one step away. Return and reward. Two steps. Return and reward. If they get up, you moved too fast. Go back to the last distance that worked.',
      'Day 5: Distractions at home. Practice mat work while you walk around the room, open a cabinet, pick up your keys. These are mild real-life distractions. Reward your dog for choosing to stay settled instead of following you.',
      'Day 6: Duration + distance combined. Your dog settles on the mat while you move around the house for 30-60 seconds at a time. This simulates real life. You\'re building the habit of "when in doubt, go to your mat and chill."',
      'Day 7: Take it outside. Bring the mat to your porch, yard, or a quiet outdoor spot. Practice everything from this week in a new environment. The new location will make it harder, so lower your expectations and reward generously.',
    ],
  },
];

// ============================================================================
// FAQ DATA
// ============================================================================
const FAQS = [
  { q: 'How long should training sessions be?', a: 'Keep sessions between 5-10 minutes for puppies and 10-15 minutes for adults. Multiple short sessions per day (2-3) are more effective than one long one. Always end on a successful rep.' },
  { q: 'My dog won\'t take treats during training. What do I do?', a: 'Try training before meals when they\'re hungry. Use higher-value treats (real chicken, cheese, hot dogs instead of commercial biscuits). If they still won\'t eat, they may be too stressed or distracted. Move to a calmer environment.' },
  { q: 'When should I start training my puppy?', a: 'Immediately. Puppies start learning from day one. Basic name recognition, sit, and potty training can begin at 8 weeks. Formal obedience classes typically start at 12-16 weeks.' },
  { q: 'My dog listens at home but not outside. Why?', a: 'Dogs don\'t generalize well. A "sit" learned in your kitchen is a different cue than "sit" at the park. Practice every command in 5+ different locations with gradually increasing distractions.' },
  { q: 'Is it too late to train my adult/senior dog?', a: 'Absolutely not. Dogs learn at any age. Adults actually have better impulse control than puppies, which can make some training easier. Adjust your expectations for physical limitations in seniors.' },
  { q: 'How do I stop my dog from pulling on leash?', a: 'Stop moving the instant the leash gets tight. Only walk when the leash is loose. This is tedious at first but transforms walks within 1-2 weeks of consistency. Check out our Leash & Walks category for detailed lessons.' },
  { q: 'Should I use a clicker?', a: 'A clicker is a precision tool for marking the exact moment your dog does something right. It\'s faster and more consistent than saying "yes!" but both work. If you\'re new to training, start with a verbal marker and add a clicker later if you want more precision.' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export default function LearnScreen() {
  const router = useRouter();
  const { userProfile, hasPremium } = useApp();
  const [expandedFundamental, setExpandedFundamental] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [tipIndex, setTipIndex] = useState(0);

  const breedId = userProfile?.breedId || '';
  const breedData = breedId ? getBreedById(breedId) : null;

  const toggleFundamental = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFundamental(expandedFundamental === id ? null : id);
  };

  const toggleFaq = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const nextTip = () => setTipIndex((prev) => (prev + 1) % QUICK_TIPS.length);
  const prevTip = () => setTipIndex((prev) => (prev - 1 + QUICK_TIPS.length) % QUICK_TIPS.length);

  const currentTip = QUICK_TIPS[tipIndex];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Learn</Text>
        <Text style={styles.screenSubtitle}>Training knowledge and breed guides</Text>

        {/* ── QUICK TIP CARD ── */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb" size={18} color={colors.accent} />
            <Text style={styles.tipLabel}>QUICK TIP</Text>
            <Text style={styles.tipCounter}>{tipIndex + 1}/{QUICK_TIPS.length}</Text>
          </View>
          <View style={styles.tipContent}>
            <Ionicons name={currentTip.icon as any} size={24} color={colors.accent} style={{ marginBottom: spacing.xs }} />
            <Text style={styles.tipTitle}>{currentTip.title}</Text>
            <Text style={styles.tipText}>{currentTip.text}</Text>
          </View>
          <View style={styles.tipNav}>
            <TouchableOpacity onPress={prevTip} style={styles.tipNavButton}>
              <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={nextTip} style={styles.tipNavButton}>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── YOUR BREED ── */}
        {breedData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About {breedData.name}s</Text>
            <View style={styles.breedCard}>
              <Text style={styles.breedInsight}>{breedData.breedInsight}</Text>
              <View style={styles.breedStatsRow}>
                <View style={styles.breedStat}>
                  <Text style={styles.breedStatLabel}>Energy</Text>
                  <Text style={styles.breedStatValue}>{breedData.energy.replace('_', ' ')}</Text>
                </View>
                <View style={styles.breedStat}>
                  <Text style={styles.breedStatLabel}>Size</Text>
                  <Text style={styles.breedStatValue}>{breedData.size}</Text>
                </View>
                <View style={styles.breedStat}>
                  <Text style={styles.breedStatLabel}>Trainability</Text>
                  <Text style={styles.breedStatValue}>{breedData.trainability}</Text>
                </View>
              </View>
              <Text style={styles.breedTipsTitle}>Training Tips</Text>
              {breedData.trainingTips.map((tip, i) => (
                <View key={i} style={styles.breedTipRow}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.accent} style={{ marginTop: 3 }} />
                  <Text style={styles.breedTipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── TRAINING FUNDAMENTALS (FREE) ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Training Fundamentals</Text>
          <Text style={styles.sectionSubtitle}>Core knowledge every dog owner needs</Text>

          {FUNDAMENTALS.map((article) => {
            const isExpanded = expandedFundamental === article.id;
            return (
              <TouchableOpacity
                key={article.id}
                style={[styles.articleCard, isExpanded && styles.articleCardExpanded]}
                onPress={() => toggleFundamental(article.id)}
                activeOpacity={0.7}
              >
                <View style={styles.articleHeader}>
                  <View style={styles.articleIconContainer}>
                    <Ionicons name={article.icon as any} size={22} color={colors.accent} />
                  </View>
                  <View style={styles.articleTitleContainer}>
                    <Text style={styles.articleTitle}>{article.title}</Text>
                    {!isExpanded && <Text style={styles.articlePreview}>{article.preview}</Text>}
                  </View>
                  <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textSecondary} />
                </View>
                {isExpanded && (
                  <View style={styles.articleContent}>
                    {article.content.map((paragraph, i) => (
                      <Text key={i} style={styles.articleParagraph}>{paragraph}</Text>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── PREMIUM ARTICLES ── */}
        <View style={styles.section}>
          <View style={styles.premiumSectionHeader}>
            <Text style={styles.sectionTitle}>Premium Guides</Text>
            <View style={styles.premiumPill}>
              <Ionicons name="lock-closed" size={10} color="#FFFFFF" />
              <Text style={styles.premiumPillText}>PRO</Text>
            </View>
          </View>
          <Text style={styles.sectionSubtitle}>In-depth guides for common challenges</Text>

          {PREMIUM_ARTICLES.map((article) => {
            const isExpanded = hasPremium && expandedFundamental === article.id;
            return (
              <TouchableOpacity
                key={article.id}
                style={[styles.articleCard, !hasPremium && styles.articleCardLocked, isExpanded && styles.articleCardExpanded]}
                onPress={() => {
                  if (hasPremium) {
                    toggleFundamental(article.id);
                  } else {
                    router.push('/(tabs)/premium');
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={styles.articleHeader}>
                  <View style={[styles.articleIconContainer, !hasPremium && styles.articleIconLocked]}>
                    {hasPremium ? (
                      <Ionicons name={article.icon as any} size={22} color={colors.accent} />
                    ) : (
                      <Ionicons name="lock-closed" size={18} color={colors.textTertiary} />
                    )}
                  </View>
                  <View style={styles.articleTitleContainer}>
                    <Text style={[styles.articleTitle, !hasPremium && styles.articleTitleLocked]}>{article.title}</Text>
                    {!isExpanded && <Text style={styles.articlePreview}>{article.preview}</Text>}
                  </View>
                  {hasPremium ? (
                    <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textSecondary} />
                  ) : (
                    <Ionicons name="arrow-forward" size={18} color={colors.textTertiary} />
                  )}
                </View>
                {isExpanded && (
                  <View style={styles.articleContent}>
                    {article.content.map((paragraph, i) => (
                      <Text key={i} style={styles.articleParagraph}>{paragraph}</Text>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── FAQ ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Questions</Text>

          {FAQS.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <TouchableOpacity
                key={index}
                style={styles.faqCard}
                onPress={() => toggleFaq(index)}
                activeOpacity={0.7}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.q}</Text>
                  <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />
                </View>
                {isExpanded && <Text style={styles.faqAnswer}>{faq.a}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// STYLES
// ============================================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.lg },

  screenTitle: { fontSize: typography.h1, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: spacing.xs },
  screenSubtitle: { fontSize: typography.body, color: colors.textSecondary, marginBottom: spacing.xl },

  // ── Quick Tip Card ──
  tipCard: {
    backgroundColor: colors.cardBackground, borderRadius: 16,
    padding: spacing.md, marginBottom: spacing.xl,
    borderWidth: 1, borderColor: colors.border,
  },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  tipLabel: { fontSize: 11, fontWeight: '700', color: colors.accent, letterSpacing: 1, flex: 1 },
  tipCounter: { fontSize: 12, color: colors.textTertiary },
  tipContent: { alignItems: 'center', paddingVertical: spacing.sm },
  tipTitle: { fontSize: typography.h4, fontWeight: typography.bold, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.xs },
  tipText: { fontSize: typography.small, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  tipNav: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xl, marginTop: spacing.sm },
  tipNavButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.cardBackgroundSecondary || colors.background, justifyContent: 'center', alignItems: 'center' },

  // ── Sections ──
  section: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: typography.h2, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: spacing.xs },
  sectionSubtitle: { fontSize: typography.body, color: colors.textSecondary, marginBottom: spacing.lg },

  // ── Premium Section Header ──
  premiumSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  premiumPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: colors.accent, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
    marginBottom: spacing.xs,
  },
  premiumPillText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5 },

  // ── Breed Card ──
  breedCard: { backgroundColor: colors.cardBackground, borderRadius: 16, padding: spacing.lg, borderWidth: 2, borderColor: colors.accent },
  breedInsight: { fontSize: typography.body, color: colors.textPrimary, lineHeight: 24, marginBottom: spacing.lg },
  breedStatsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  breedStat: { flex: 1, backgroundColor: colors.cardBackgroundSecondary || colors.background, padding: spacing.md, borderRadius: 10, alignItems: 'center' },
  breedStatLabel: { fontSize: 11, color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  breedStatValue: { fontSize: typography.small, color: colors.textPrimary, fontWeight: typography.bold, textTransform: 'capitalize' },
  breedTipsTitle: { fontSize: typography.h4, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: spacing.md },
  breedTipRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  breedTipText: { flex: 1, fontSize: typography.small, color: colors.textSecondary, lineHeight: 20 },

  // ── Article Cards ──
  articleCard: { backgroundColor: colors.cardBackground, borderRadius: 14, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  articleCardExpanded: { borderColor: colors.accent },
  articleCardLocked: { opacity: 0.65 },
  articleHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  articleIconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.cardBackgroundSecondary || colors.background, justifyContent: 'center', alignItems: 'center' },
  articleIconLocked: { backgroundColor: colors.border },
  articleTitleContainer: { flex: 1 },
  articleTitle: { fontSize: typography.h4, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: 4 },
  articleTitleLocked: { color: colors.textSecondary },
  articlePreview: { fontSize: typography.small, color: colors.textSecondary, lineHeight: 18 },
  articleContent: { marginTop: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  articleParagraph: { fontSize: typography.body, color: colors.textPrimary, lineHeight: 24, marginBottom: spacing.md },

  // ── FAQ ──
  faqCard: { backgroundColor: colors.cardBackground, borderRadius: 12, padding: spacing.lg, marginBottom: spacing.sm },
  faqHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  faqQuestion: { flex: 1, fontSize: typography.body, fontWeight: typography.semibold, color: colors.textPrimary },
  faqAnswer: { fontSize: typography.body, color: colors.textSecondary, lineHeight: 22, marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
});
