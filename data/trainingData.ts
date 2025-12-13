
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
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  lessons: Lesson[];
  completedCount: number;
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
        steps: [
          'Hold a treat close to your dog\'s nose',
          'Move your hand up, allowing their head to follow the treat',
          'As their head moves up, their bottom will naturally lower',
          'Once they\'re in sitting position, say "Sit" and give the treat',
          'Repeat this sequence several times daily',
          'Practice in different locations to reinforce the behavior',
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
        steps: [
          'Ask your dog to sit',
          'Open your palm in front of you and say "Stay"',
          'Take a few steps back',
          'If they stay, return and reward them',
          'Gradually increase the distance and duration',
          'Practice in various environments',
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
        steps: [
          'Start with your dog in a sitting position',
          'Hold a treat in your closed fist',
          'Move your hand to the floor in front of them',
          'Slide your hand along the ground to encourage lying down',
          'Once they\'re down, say "Down" and give the treat',
          'Practice regularly to build muscle memory',
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
        steps: [
          'Choose a designated "place" (mat, bed, or platform)',
          'Lure your dog onto the place with a treat',
          'Say "Place" as they step onto it',
          'Reward them for staying on the place',
          'Gradually increase distance from the place',
          'Add duration before releasing them',
        ],
      },
    ],
  },
  {
    id: 'leash-walks',
    name: 'Leash & Walks',
    icon: 'figure.walk',
    description: 'Perfect your walking routine and leash manners',
    completedCount: 0,
    lessons: [
      {
        id: 'loose-leash-1',
        name: 'Loose Leash Walking',
        difficulty: 'Beginner',
        estimatedTime: '15 min',
        isLocked: false,
        isPremium: false,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800',
        description: 'Walk calmly without pulling on the leash',
        steps: [
          'Start in a low-distraction environment',
          'Hold treats in your hand at your side',
          'Begin walking and reward when leash is loose',
          'Stop moving if they pull ahead',
          'Resume walking only when they return to your side',
          'Practice consistency on every walk',
        ],
      },
      {
        id: 'heel-1',
        name: 'Heel Position',
        difficulty: 'Intermediate',
        estimatedTime: '18 min',
        isLocked: false,
        isPremium: false,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800',
        description: 'Train your dog to walk perfectly at your side',
        steps: [
          'Position your dog at your left side',
          'Hold a treat at your hip',
          'Say "Heel" and start walking',
          'Reward frequently when they maintain position',
          'Practice turns and pace changes',
          'Gradually reduce treat frequency',
        ],
      },
      {
        id: 'distractions-1',
        name: 'Walking Past Distractions',
        difficulty: 'Advanced',
        estimatedTime: '25 min',
        isLocked: true,
        isPremium: true,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800',
        description: 'Maintain focus despite environmental distractions',
        steps: [
          'Start with mild distractions at a distance',
          'Use high-value treats',
          'Reward attention and calm behavior',
          'Gradually decrease distance to distractions',
          'Practice with various triggers (dogs, people, bikes)',
          'Build confidence through repetition',
        ],
      },
    ],
  },
  {
    id: 'calm-focus',
    name: 'Calm & Focus',
    icon: 'sparkles',
    description: 'Build relaxation and attention skills',
    completedCount: 0,
    lessons: [
      {
        id: 'settle-1',
        name: 'Settle on Mat',
        difficulty: 'Beginner',
        estimatedTime: '12 min',
        isLocked: false,
        isPremium: false,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800',
        description: 'Teach your dog to relax on a designated mat',
        steps: [
          'Place a mat or blanket in a quiet area',
          'Lure your dog onto the mat',
          'Reward calm behavior',
          'Gradually increase duration',
          'Practice in different locations',
          'Use as a calming tool in daily life',
        ],
      },
      {
        id: 'eye-contact-1',
        name: 'Eye Contact & Focus',
        difficulty: 'Beginner',
        estimatedTime: '10 min',
        isLocked: false,
        isPremium: false,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800',
        description: 'Build attention and connection through eye contact',
        steps: [
          'Hold a treat near your eyes',
          'Say your dog\'s name',
          'When they make eye contact, mark and reward',
          'Gradually increase duration of eye contact',
          'Practice in various environments',
          'Use as a foundation for other commands',
        ],
      },
      {
        id: 'impulse-control-1',
        name: 'Impulse Control Games',
        difficulty: 'Intermediate',
        estimatedTime: '15 min',
        isLocked: true,
        isPremium: true,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800',
        description: 'Advanced exercises for self-control',
        steps: [
          'Practice "wait" before meals',
          'Use "leave it" with treats on the ground',
          'Play the "it\'s your choice" game',
          'Reward patience and restraint',
          'Gradually increase difficulty',
          'Apply to real-world situations',
        ],
      },
    ],
  },
  {
    id: 'recall',
    name: 'Recall',
    icon: 'arrow.uturn.backward',
    description: 'Master reliable off-leash recall',
    completedCount: 0,
    lessons: [
      {
        id: 'come-1',
        name: 'Basic Come Command',
        difficulty: 'Beginner',
        estimatedTime: '12 min',
        isLocked: false,
        isPremium: false,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=800',
        description: 'Foundation for reliable recall',
        steps: [
          'Start in a quiet, enclosed space',
          'Get down to your dog\'s level',
          'Say their name followed by "Come"',
          'Use an excited, happy tone',
          'Reward generously when they arrive',
          'Never punish them for coming to you',
        ],
      },
      {
        id: 'distance-recall-1',
        name: 'Distance Recall',
        difficulty: 'Intermediate',
        estimatedTime: '18 min',
        isLocked: false,
        isPremium: false,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800',
        description: 'Build recall at increasing distances',
        steps: [
          'Practice in a safe, fenced area',
          'Start at short distances',
          'Use a long training leash for safety',
          'Gradually increase distance',
          'Use high-value rewards',
          'Practice with mild distractions',
        ],
      },
      {
        id: 'emergency-recall-1',
        name: 'Emergency Recall',
        difficulty: 'Advanced',
        estimatedTime: '20 min',
        isLocked: true,
        isPremium: true,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800',
        description: 'Train a bulletproof emergency recall command',
        steps: [
          'Choose a unique word (not "come")',
          'Only use in true emergencies',
          'Always use highest-value rewards',
          'Practice sparingly to maintain power',
          'Never use if you can\'t reward',
          'Build through consistent success',
        ],
      },
    ],
  },
  {
    id: 'mental-work',
    name: 'Mental Work',
    icon: 'brain.head.profile',
    description: 'Engage your dog\'s mind with enrichment',
    completedCount: 0,
    lessons: [
      {
        id: 'nose-work-1',
        name: 'Introduction to Nose Work',
        difficulty: 'Beginner',
        estimatedTime: '15 min',
        isLocked: false,
        isPremium: false,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=800',
        description: 'Tap into your dog\'s natural scenting abilities',
        steps: [
          'Start with visible treats',
          'Let your dog watch you hide them',
          'Say "Find it" and encourage searching',
          'Gradually make hides more difficult',
          'Hide treats in different rooms',
          'Celebrate successful finds',
        ],
      },
      {
        id: 'puzzle-games-1',
        name: 'Puzzle & Problem Solving',
        difficulty: 'Intermediate',
        estimatedTime: '12 min',
        isLocked: true,
        isPremium: true,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800',
        description: 'Mental stimulation through problem-solving',
        steps: [
          'Introduce puzzle toys gradually',
          'Start with easy difficulty levels',
          'Supervise initial attempts',
          'Rotate toys to maintain interest',
          'Create DIY puzzles at home',
          'Balance mental and physical exercise',
        ],
      },
      {
        id: 'trick-training-1',
        name: 'Advanced Trick Training',
        difficulty: 'Advanced',
        estimatedTime: '20 min',
        isLocked: true,
        isPremium: true,
        isCompleted: false,
        imageUrl: 'https://images.unsplash.com/photo-1587764379873-97837921fd44?w=800',
        description: 'Fun tricks that challenge your dog mentally',
        steps: [
          'Break tricks into small steps',
          'Use shaping and luring techniques',
          'Practice short, frequent sessions',
          'Add verbal and hand signals',
          'Chain behaviors together',
          'Keep training fun and positive',
        ],
      },
    ],
  },
];

export interface DogProfile {
  name: string;
  age?: string;
  breed?: string;
  imageUrl?: string;
}

export interface UserProgress {
  completedLessons: string[];
  currentStreak: number;
  totalSessions: number;
  isPremium: boolean;
}
