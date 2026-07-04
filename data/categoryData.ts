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
import { SOCIALIZATION_LESSONS } from './lessons/socialization';
import { REACTIVE_DOG_LESSONS } from './lessons/reactiveDog';
import { COOPERATIVE_CARE_LESSONS } from './lessons/cooperativeCare';
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
  {
    id: 'everyday_obedience',
    title: 'Everyday Obedience',
    description: 'Master the fundamentals of daily life with your dog',
    icon: '🎯',
    totalLessons: 16,
    isPremium: false,
    recommendedFor: ['beginner', 'basic_training'],
    lessons: everydayObedienceLessons,
  },
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
  {
    id: 'potty_training',
    title: 'Potty Training & House Habits',
    description: 'Housebreaking, routines, and realistic expectations',
    icon: '🏠',
    totalLessons: 10,
    isPremium: true,
    recommendedFor: ['puppy', 'potty'],
    lessons: pottyTrainingLessons,
  },
  {
    id: 'biting_nipping',
    title: 'Biting, Nipping & Mouthing',
    description: 'Common puppy behaviors and early correction',
    icon: '🦷',
    totalLessons: 10,
    isPremium: true,
    recommendedFor: ['puppy', 'biting'],
    lessons: bitingNippingLessons,
  },
  {
    id: 'calm_focus',
    title: 'Calm & Focus',
    description: 'Build relaxation and attention skills',
    icon: '🧘',
    totalLessons: 15,
    isPremium: false,
    recommendedFor: ['high_energy', 'focus', 'anxiety'],
    lessons: calmFocusLessons,
  },
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
  {
    id: 'socialization',
    title: 'Socialization',
    description: 'Teach your dog to be confident and comfortable in the real world',
    icon: '🤝',
    totalLessons: 11,
    isPremium: true,
    recommendedFor: ['socialization', 'fear', 'puppy'],
    lessons: SOCIALIZATION_LESSONS,
  },
  {
    id: 'reactive_dog',
    title: 'Reactive Dog',
    description: 'Understand and manage reactivity with proven protocols',
    icon: '⚡',
    totalLessons: 10,
    isPremium: true,
    recommendedFor: ['reactivity', 'leash_reactive', 'dog_aggressive'],
    lessons: REACTIVE_DOG_LESSONS,
  },
  {
    id: 'mental_work',
    title: 'Mental Work',
    description: 'Engage your dog\'s mind with enrichment',
    icon: '🧠',
    totalLessons: 14,
    isPremium: false,
    recommendedFor: ['high_energy', 'mental_stimulation'],
    lessons: mentalWorkLessons,
  },
  {
    id: 'cooperative_care',
    title: 'Cooperative Care',
    description: 'Make grooming, vet visits, and handling stress-free',
    icon: '🩺',
    totalLessons: 9,
    isPremium: true,
    recommendedFor: ['handling', 'grooming', 'vet_prep'],
    lessons: COOPERATIVE_CARE_LESSONS,
  },
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
    id: 'service_dog',
    title: 'Service Dog Pre-Class',
    description: 'Advanced foundational skills for service dog preparation',
    icon: '🦺',
    totalLessons: 9,
    isPremium: true,
    recommendedFor: ['service'],
    lessons: serviceDogLessons,
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
