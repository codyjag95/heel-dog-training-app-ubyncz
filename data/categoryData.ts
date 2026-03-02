import { everydayObedienceLessons } from './lessons/everydayObedience';
import { leashWalksLessons } from './lessons/leashWalks';
import { calmFocusLessons } from './lessons/calmFocus';
import { recallLessons } from './lessons/recall';
import { mentalWorkLessons } from './lessons/mentalWork';
import { realWorldProofingLessons } from './lessons/realWorldProofing';
import { serviceDogLessons } from './lessons/serviceDog';
import { pottyTrainingLessons } from './lessons/pottyTraining';
import { bitingNippingLessons } from './lessons/bitingNipping';
import { handlerSkillsLessons } from './lessons/handlerSkills';
import { tricksLessons } from './lessons/tricks';
export type Lesson = {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  difficulty: 1 | 2 | 3 | 4 | 5;
  steps: string[];
  tips: string[];
  videoUrl?: string; // For future video feature
  isPremium?: boolean;
};

export type Category = {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji for now
  totalLessons: number;
  isPremium?: boolean;
  lessons: Lesson[];
  recommendedFor?: string[]; // Quiz tags that recommend this category
};

export const CATEGORIES: Category[] = [
  // ============================================================================
// 1. EVERYDAY OBEDIENCE (Mostly free)
// Premium: Touch, Heel Position, Place (Advanced)
// ============================================================================
{
  id: 'everyday_obedience',
  title: 'Everyday Obedience',
  description: 'Master the fundamentals of daily life with your dog',
  icon: '🎯',
  totalLessons: 13,
  isPremium: false,
  recommendedFor: ['beginner', 'basic_training'],
  lessons: everydayObedienceLessons,
},

  // ============================================================================
  // 2. LEASH & WALKS (Mostly free)
  // Premium: Off-Leash Foundations, Reactive Dog Protocol, Urban Walking Mastery
  // ============================================================================
  {
    id: 'leash_walks',
    title: 'Leash & Walks',
    description: 'Perfect your walking routine and leash manners',
    icon: '🦮',
    totalLessons: 13,
    isPremium: false,
    recommendedFor: ['leash_pulling', 'walks'],
    lessons: leashWalksLessons,
},

  // ============================================================================
  // 3. CALM & FOCUS (Mostly free)
  // Premium: Meditation for Dogs, Arousal Up-Down Game, Focus in Chaos
  // ============================================================================
  {
    id: 'calm_focus',
    title: 'Calm & Focus',
    description: 'Build relaxation and attention skills',
    icon: '🧘',
    totalLessons: 13,
    isPremium: false,
    recommendedFor: ['high_energy', 'focus', 'anxiety'],
    lessons: calmFocusLessons,
  },

  // ============================================================================
  // 4. RECALL (Mostly free)
  // Premium: Off-Leash Foundations, Reliability Proofing, Recall from Play
  // Note: Whistle Recall moved up, Recall from Play moved down (now premium)
  // ============================================================================
  {
    id: 'recall',
    title: 'Recall',
    description: 'Master reliable off-leash recall',
    icon: '📣',
    totalLessons: 10,
    isPremium: false,
    recommendedFor: ['recall', 'off_leash'],
    lessons: recallLessons,
  },

  // ============================================================================
  // 5. MENTAL WORK (Mostly free)
  // Premium: Scent Work DIY Enrichment, Advanced Scent Detection, Chaining Behaviors
  // ============================================================================
  {
    id: 'mental_work',
    title: 'Mental Work',
    description: 'Engage your dog\'s mind with enrichment',
    icon: '🧠',
    totalLessons: 11,
    isPremium: false,
    recommendedFor: ['high_energy', 'mental_stimulation'],
    lessons: mentalWorkLessons,
  },

  // ============================================================================
  // 6. REAL-WORLD PROOFING (Premium Only)
  // ============================================================================
  {
    id: 'real_world_proofing',
    title: 'Real-World Proofing',
    description: 'Apply training in challenging real-world environments',
    icon: '🌍',
    totalLessons: 8,
    isPremium: true,
    recommendedFor: ['advanced'],
    lessons: realWorldProofingLessons,
  },

  // ============================================================================
  // 7. SERVICE DOG PRE-CLASS (Premium Only)
  // ============================================================================
  {
    id: 'service_dog',
    title: 'Service Dog Pre-Class',
    description: 'Advanced foundational skills for service dog preparation',
    icon: '🦺',
    totalLessons: 9,
    isPremium: true,
    recommendedFor: ['service'],
    lessons: serviceDogLessons,
  },

  // ============================================================================
  // 8. POTTY TRAINING & HOUSE HABITS (Premium category w/ free teasers)
  // Free: Potty Training Foundations, Creating a Potty Schedule
  // Rest: Premium
  // ============================================================================
  {
    id: 'potty_training',
    title: 'Potty Training & House Habits',
    description: 'Housebreaking, routines, and realistic expectations',
    icon: '🏠',
    totalLessons: 8,
    isPremium: true,
    recommendedFor: ['puppy', 'potty'],
    lessons: pottyTrainingLessons, 
  },

  // ============================================================================
  // 9. BITING, NIPPING & MOUTHING (Premium category w/ free teasers)
  // Free: Understanding Puppy Biting, Teaching Bite Inhibition
  // Rest: Premium
  // ============================================================================
  {
    id: 'biting_nipping',
    title: 'Biting, Nipping & Mouthing',
    description: 'Common puppy behaviors and early correction',
    icon: '🦷',
    totalLessons: 8,
    isPremium: true,
    recommendedFor: ['puppy', 'biting'],
    lessons: bitingNippingLessons,
  },

  // ============================================================================
  // 10. HANDLER SKILLS (Premium Only)
  // ============================================================================
  {
    id: 'handler_skills',
    title: 'Handler Skills',
    description: 'Training lessons focused on the human handler',
    icon: '👤',
    totalLessons: 13,
    isPremium: true,
    recommendedFor: ['advanced'],
    lessons: handlerSkillsLessons,
  },

{
  id: 'tricks',
  title: 'Tricks',
  description: 'Fun tricks from crowd-pleasers to jaw-droppers',
  icon: '🎪',
  totalLessons: 15,
  isPremium: false,
  recommendedFor: ['tricks', 'fun', 'bonding'],
  lessons: tricksLessons,
},

];

// Helper function to get category by ID
export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find(cat => cat.id === id);
};

// Helper function to get lesson by ID
export const getLessonById = (categoryId: string, lessonId: string): Lesson | undefined => {
  const category = getCategoryById(categoryId);
  return category?.lessons.find(lesson => lesson.id === lessonId);
};
