
import { QuizAnswer, DogScores, DerivedFields } from './quizData';

export interface SessionNote {
  id: string;
  lessonId: string;
  date: string;
  wentWell: string;
  struggled: string;
}

export interface Lesson {
  id: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  isLocked: boolean;
  isPremium: boolean;
  isCompleted: boolean;
  videoUrl?: string;
  imageUrl?: string;
  steps: string[];
  description: string;
  prerequisiteIds?: string[];
  session_goal?: string;
  step_1?: string;
  step_2?: string;
  step_3?: string;
  step_4?: string;
  step_5?: string;
  step_6?: string;
  trainingTips?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  lessons: Lesson[];
  completedCount: number;
  disclaimer?: string;
}

export interface SessionTemplate {
  id: string;
  name: string;
  description: string;
  duration: string;
  lessonIds: string[];
  isPremium: boolean;
}

export interface DogProfile {
  id?: string;
  name: string;
  age?: string;
  breed?: string;
  imageUrl?: string;
  quizAnswers?: QuizAnswer;
  recommendedPrimaryTrack?: string;
  recommendedSecondaryTracks?: string[];
  immediateFocus?: string[];
  lastViewedLesson?: string;
  sessionNotes?: SessionNote[];
  scores?: DogScores;
  derived?: DerivedFields;
  behavior_tags?: string[];
}

export interface UserProgress {
  completedLessons: string[];
  currentStreak: number;
  totalSessions: number;
  isPremium: boolean;
  lastTrainingDate?: string;
  lessonViews: { [lessonId: string]: number };
  lessonCompletions: { [lessonId: string]: number };
  quizCompleted: boolean;
  is_pro?: boolean;
  beta_override?: boolean;
}

export interface AnalyticsEvent {
  type: 'lesson_view' | 'lesson_completion' | 'quiz_completion' | 'session_start' | 'session_complete';
  timestamp: string;
  lessonId?: string;
  categoryId?: string;
  duration?: number;
}

export const trainingCategories: Category[] = [
  {
    id: 'everyday-obedience',
    name: 'Everyday Obedience',
    icon: 'star.fill',
    description: 'Master the fundamentals of daily life with your dog',
    completedCount: 0,
    lessons: [
      {
        id: 'sit-1',
        name: 'Sit Command',
        difficulty: 'Beginner',
        estimatedTime: '10 min',
        isLocked: false,
        isPremium: false,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
        description: 'Teach your dog to sit on command with positive reinforcement',
        session_goal: 'Build a reliable sit response using positive reinforcement',
        step_1: 'Hold a treat close to your dog\'s nose',
        step_2: 'Move your hand up, allowing their head to follow the treat',
        step_3: 'As their head moves up, their bottom will naturally lower',
        step_4: 'Once they\'re in sitting position, say "Sit" and give the treat',
        step_5: 'Repeat this sequence several times daily',
        step_6: 'Practice in different locations to reinforce the behavior',
        steps: [
          'Hold a treat close to your dog\'s nose',
          'Move your hand up, allowing their head to follow the treat',
          'As their head moves up, their bottom will naturally lower',
          'Once they\'re in sitting position, say "Sit" and give the treat',
          'Repeat this sequence several times daily',
          'Practice in different locations to reinforce the behavior',
        ],
        trainingTips: [
          'Say the command once and wait calmly for the response.',
          'Reward immediately when their bottom touches the ground.',
        ],
      },
      {
        id: 'stay-1',
        name: 'Stay Command',
        difficulty: 'Beginner',
        estimatedTime: '15 min',
        isLocked: false,
        isPremium: false,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800',
        description: 'Build impulse control with the stay command',
        session_goal: 'Develop impulse control and duration with the stay command',
        step_1: 'Ask your dog to sit',
        step_2: 'Open your palm in front of you and say "Stay"',
        step_3: 'Take a few steps back',
        step_4: 'If they stay, return and reward them',
        step_5: 'Gradually increase the distance and duration',
        step_6: 'Practice in various environments',
        steps: [
          'Ask your dog to sit',
          'Open your palm in front of you and say "Stay"',
          'Take a few steps back',
          'If they stay, return and reward them',
          'Gradually increase the distance and duration',
          'Practice in various environments',
        ],
        prerequisiteIds: ['sit-1'],
        trainingTips: [
          'Start with just one second of stay and build gradually.',
          'Always return to your dog to reward—don\'t call them to you.',
        ],
      },
    ],
  },
];
