
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
      {
        id: 'down-1',
        name: 'Down Command',
        difficulty: 'Intermediate',
        estimatedTime: '12 min',
        isLocked: false,
        isPremium: false,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
        description: 'Teach your dog to lie down on command',
        session_goal: 'Master the down position for calm and control',
        step_1: 'Start with your dog in a sitting position',
        step_2: 'Hold a treat in your closed fist',
        step_3: 'Move your hand to the floor in front of them',
        step_4: 'Slide your hand along the ground to encourage lying down',
        step_5: 'Once they\'re down, say "Down" and give the treat',
        step_6: 'Practice regularly to build muscle memory',
        steps: [
          'Start with your dog in a sitting position',
          'Hold a treat in your closed fist',
          'Move your hand to the floor in front of them',
          'Slide your hand along the ground to encourage lying down',
          'Once they\'re down, say "Down" and give the treat',
          'Practice regularly to build muscle memory',
        ],
        prerequisiteIds: ['sit-1'],
        trainingTips: [
          'Be patient—down is harder than sit for most dogs.',
          'Reward any movement toward the ground at first.',
        ],
      },
      {
        id: 'wait-1',
        name: 'Wait at Doors',
        difficulty: 'Beginner',
        estimatedTime: '10 min',
        isLocked: false,
        isPremium: false,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800',
        description: 'Teach your dog to wait before going through doorways',
        session_goal: 'Build patience and safety at doorways',
        step_1: 'Stand at a closed door with your dog',
        step_2: 'Ask them to sit',
        step_3: 'Say "Wait" and slowly reach for the door handle',
        step_4: 'If they move, close the door and reset',
        step_5: 'When they stay, open the door slightly',
        step_6: 'Release with "Okay" only when they remain calm',
        steps: [
          'Stand at a closed door with your dog',
          'Ask them to sit',
          'Say "Wait" and slowly reach for the door handle',
          'If they move, close the door and reset',
          'When they stay, open the door slightly',
          'Release with "Okay" only when they remain calm',
          'Practice at all doorways in your home',
        ],
        prerequisiteIds: ['sit-1'],
        trainingTips: [
          'Practice at every doorway to build the habit.',
          'Use a calm, steady tone when saying "Wait."',
        ],
      },
      {
        id: 'leave-it-1',
        name: 'Leave It Command',
        difficulty: 'Intermediate',
        estimatedTime: '12 min',
        isLocked: false,
        isPremium: false,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=800',
        description: 'Train your dog to ignore items on command',
        session_goal: 'Teach impulse control by ignoring tempting items',
        step_1: 'Hold a treat in your closed fist',
        step_2: 'Let your dog sniff and lick your hand',
        step_3: 'Say "Leave it" and wait for them to pull away',
        step_4: 'When they stop trying, reward with a different treat',
        step_5: 'Progress to treats on the floor',
        step_6: 'Practice with various objects and food',
        steps: [
          'Hold a treat in your closed fist',
          'Let your dog sniff and lick your hand',
          'Say "Leave it" and wait for them to pull away',
          'When they stop trying, reward with a different treat',
          'Progress to treats on the floor',
          'Practice with various objects and food',
          'Always reward with something better than what they left',
        ],
        prerequisiteIds: ['sit-1'],
        trainingTips: [
          'Reward with a better treat than the one they\'re leaving.',
          'Stay calm and patient—don\'t repeat the command.',
        ],
      },
      {
        id: 'drop-it-1',
        name: 'Drop It Command',
        difficulty: 'Intermediate',
        estimatedTime: '10 min',
        isLocked: false,
        isPremium: false,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1587764379873-97837921fd44?w=800',
        description: 'Teach your dog to release items from their mouth',
        session_goal: 'Build trust by teaching your dog to release items willingly',
        step_1: 'Start with a low-value toy',
        step_2: 'Let your dog take it in their mouth',
        step_3: 'Offer a high-value treat near their nose',
        step_4: 'Say "Drop it" as they release the toy',
        step_5: 'Give the treat immediately',
        step_6: 'Return the toy to build trust',
        steps: [
          'Start with a low-value toy',
          'Let your dog take it in their mouth',
          'Offer a high-value treat near their nose',
          'Say "Drop it" as they release the toy',
          'Give the treat immediately',
          'Return the toy to build trust',
          'Practice with various objects',
        ],
        trainingTips: [
          'Always give the toy back after they drop it.',
          'Use high-value treats to make the trade worthwhile.',
        ],
      },
      {
        id: 'stand-1',
        name: 'Stand Command',
        difficulty: 'Beginner',
        estimatedTime: '8 min',
        isLocked: false,
        isPremium: false,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800',
        description: 'Useful for grooming and vet visits',
        session_goal: 'Teach a reliable stand position for grooming and vet care',
        step_1: 'Start with your dog in a sit or down position',
        step_2: 'Hold a treat at their nose level',
        step_3: 'Slowly move the treat forward',
        step_4: 'As they stand to follow, say "Stand"',
        step_5: 'Reward immediately when all four paws are standing',
        step_6: 'Practice holding the position briefly',
        steps: [
          'Start with your dog in a sit or down position',
          'Hold a treat at their nose level',
          'Slowly move the treat forward',
          'As they stand to follow, say "Stand"',
          'Reward immediately when all four paws are standing',
          'Practice holding the position briefly',
        ],
        prerequisiteIds: ['sit-1'],
        trainingTips: [
          'Keep the treat at nose level to prevent jumping.',
          'Practice this before vet visits to reduce stress.',
        ],
      },
      {
        id: 'off-1',
        name: 'Off Command (No Jumping)',
        difficulty: 'Intermediate',
        estimatedTime: '15 min',
        isLocked: false,
        isPremium: false,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
        description: 'Stop jumping behavior with positive redirection',
        session_goal: 'Eliminate jumping by rewarding four paws on the floor',
        step_1: 'When your dog jumps, turn away and ignore',
        step_2: 'Wait for four paws on the floor',
        step_3: 'Say "Off" calmly when they jump',
        step_4: 'Immediately reward when they have all paws down',
        step_5: 'Ask them to sit for extra reinforcement',
        step_6: 'Be consistent - never reward jumping',
        steps: [
          'When your dog jumps, turn away and ignore',
          'Wait for four paws on the floor',
          'Say "Off" calmly when they jump',
          'Immediately reward when they have all paws down',
          'Ask them to sit for extra reinforcement',
          'Be consistent - never reward jumping',
          'Teach family and guests the same protocol',
        ],
        prerequisiteIds: ['sit-1'],
        trainingTips: [
          'Consistency is everything—never reward jumping.',
          'Turn away immediately when they jump up.',
        ],
      },
      {
        id: 'touch-1',
        name: 'Hand Touch Target',
        difficulty: 'Beginner',
        estimatedTime: '8 min',
        isLocked: false,
        isPremium: false,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800',
        description: 'Foundation skill for many advanced behaviors',
        session_goal: 'Build a reliable hand touch for guidance and focus',
        step_1: 'Hold your palm out flat toward your dog',
        step_2: 'When they touch it with their nose, mark and reward',
        step_3: 'Add the cue "Touch" before presenting your hand',
        step_4: 'Practice at different heights and angles',
        step_5: 'Use to redirect attention or guide movement',
        step_6: 'Build distance gradually',
        steps: [
          'Hold your palm out flat toward your dog',
          'When they touch it with their nose, mark and reward',
          'Add the cue "Touch" before presenting your hand',
          'Practice at different heights and angles',
          'Use to redirect attention or guide movement',
          'Build distance gradually',
        ],
        trainingTips: [
          'Reward the moment their nose touches your palm.',
          'This skill is useful for redirecting attention.',
        ],
      },
      {
        id: 'go-to-bed-1',
        name: 'Go to Bed',
        difficulty: 'Intermediate',
        estimatedTime: '12 min',
        isLocked: false,
        isPremium: false,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
        description: 'Send your dog to their bed or crate on command',
        session_goal: 'Train your dog to go to their bed on cue',
        step_1: 'Start near the bed with your dog',
        step_2: 'Toss a treat onto the bed',
        step_3: 'Say "Go to bed" as they move toward it',
        step_4: 'Reward when they get on the bed',
        step_5: 'Gradually increase your distance from the bed',
        step_6: 'Add duration before releasing',
        steps: [
          'Start near the bed with your dog',
          'Toss a treat onto the bed',
          'Say "Go to bed" as they move toward it',
          'Reward when they get on the bed',
          'Gradually increase your distance from the bed',
          'Add duration before releasing',
          'Use during meal prep or when guests arrive',
        ],
        prerequisiteIds: ['sit-1', 'stay-1'],
        trainingTips: [
          'Make the bed a positive place with treats and praise.',
          'Use this command during meal prep or when guests arrive.',
        ],
      },
      {
        id: 'place-1',
        name: 'Place Training',
        difficulty: 'Advanced',
        estimatedTime: '20 min',
        isLocked: true,
        isPremium: true,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
        description: 'Advanced command for sending your dog to a specific spot',
        session_goal: 'Train your dog to go to and stay on their designated place',
        step_1: 'Choose a designated "place" (mat, bed, or platform)',
        step_2: 'Lure your dog onto the place with a treat',
        step_3: 'Say "Place" as they step onto it',
        step_4: 'Reward them for staying on the place',
        step_5: 'Gradually increase distance from the place',
        step_6: 'Add duration before releasing them',
        steps: [
          'Choose a designated "place" (mat, bed, or platform)',
          'Lure your dog onto the place with a treat',
          'Say "Place" as they step onto it',
          'Reward them for staying on the place',
          'Gradually increase distance from the place',
          'Add duration before releasing them',
        ],
        prerequisiteIds: ['sit-1', 'stay-1', 'down-1'],
        trainingTips: [
          'Build duration slowly—start with just a few seconds.',
          'Use place training to create calm during busy household moments.',
        ],
      },
      {
        id: 'advanced-stay-1',
        name: 'Advanced Stay with Distractions',
        difficulty: 'Advanced',
        estimatedTime: '18 min',
        isLocked: true,
        isPremium: true,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800',
        description: 'Build rock-solid stay behavior in real-world situations',
        session_goal: 'Master stay command despite distractions and distance',
        step_1: 'Start with a solid stay in a quiet environment',
        step_2: 'Add mild distractions like toys or treats nearby',
        step_3: 'Gradually increase distance while they stay',
        step_4: 'Introduce movement around them',
        step_5: 'Practice with people walking by',
        step_6: 'Build up to staying while you leave the room',
        steps: [
          'Start with a solid stay in a quiet environment',
          'Add mild distractions like toys or treats nearby',
          'Gradually increase distance while they stay',
          'Introduce movement around them',
          'Practice with people walking by',
          'Build up to staying while you leave the room',
        ],
        prerequisiteIds: ['sit-1', 'stay-1', 'down-1'],
        trainingTips: [
          'Add distractions gradually—don\'t rush the process.',
          'Always return to reward rather than calling them to you.',
        ],
      },
      {
        id: 'reliable-recall-1',
        name: 'Reliable Recall in Any Environment',
        difficulty: 'Advanced',
        estimatedTime: '20 min',
        isLocked: true,
        isPremium: true,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=800',
        description: 'Build bulletproof recall for real-world reliability',
        session_goal: 'Achieve reliable recall in challenging environments',
        step_1: 'Practice recall in progressively distracting environments',
        step_2: 'Use extremely high-value rewards',
        step_3: 'Call your dog away from mild distractions',
        step_4: 'Reward generously every single time',
        step_5: 'Practice with long-line for safety',
        step_6: 'Never call your dog if you can\'t reward',
        steps: [
          'Practice recall in progressively distracting environments',
          'Use extremely high-value rewards',
          'Call your dog away from mild distractions',
          'Reward generously every single time',
          'Practice with long-line for safety',
          'Never call your dog if you can\'t reward',
        ],
        prerequisiteIds: ['sit-1', 'stay-1', 'come-1'],
        trainingTips: [
          'Never call your dog if you can\'t reward them.',
          'Make coming to you the best thing that ever happens.',
        ],
      },
    ],
  },
  // ... rest of the categories remain the same
];
