
export interface QuizAnswer {
  age_group?: string;
  energy_level?: string;
  challenges: string[];
  training_level?: string;
  primary_goal?: string;
  daily_time?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multi';
  options: string[];
  saveAs: keyof QuizAnswer;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'How old is your dog?',
    type: 'single',
    saveAs: 'age_group',
    options: [
      'Under 6 months',
      '6–18 months',
      'Over 18 months',
    ],
  },
  {
    id: 'q2',
    question: 'What is your dog\'s energy level?',
    type: 'single',
    saveAs: 'energy_level',
    options: [
      'Low (relaxed, chill most of the day)',
      'Medium (active but manageable)',
      'High (constantly moving, easily overstimulated)',
    ],
  },
  {
    id: 'q3',
    question: 'What challenges are you facing? (Select all that apply)',
    type: 'multi',
    saveAs: 'challenges',
    options: [
      'Pulls on leash',
      'Jumps on people',
      'Poor recall (doesn\'t come when called)',
      'Excessive barking',
      'Nipping / biting',
      'Can\'t settle indoors',
      'Gets overstimulated easily',
      'None of the above',
    ],
  },
  {
    id: 'q4',
    question: 'What is your dog\'s training experience?',
    type: 'single',
    saveAs: 'training_level',
    options: [
      'None',
      'Basic (sit, stay, down)',
      'Some structure but inconsistent',
      'Fairly trained, needs refinement',
    ],
  },
  {
    id: 'q5',
    question: 'What is your primary training goal?',
    type: 'single',
    saveAs: 'primary_goal',
    options: [
      'Calm behavior at home',
      'Better walks',
      'Reliable recall',
      'Better focus & listening',
      'Mental stimulation',
    ],
  },
  {
    id: 'q6',
    question: 'How much time can you dedicate to daily training?',
    type: 'single',
    saveAs: 'daily_time',
    options: [
      '5 minutes',
      '10 minutes',
      '15+ minutes',
    ],
  },
];

export interface TrainingRecommendation {
  primaryTrack: string;
  secondaryTracks: string[];
  reasoning: string[];
}

export const trainingTracks = [
  'Beginner Foundations',
  'Calm & Focus',
  'Everyday Obedience',
  'Leash & Walks',
  'Recall',
  'Mental Stimulation',
];

export function generateRecommendation(answers: QuizAnswer): TrainingRecommendation {
  const reasoning: string[] = [];
  let primaryTrack = 'Everyday Obedience';
  const secondaryTracks: string[] = [];

  // Rule 1: If age_group = "Under 6 months" → Primary = Beginner Foundations
  if (answers.age_group === 'Under 6 months') {
    primaryTrack = 'Beginner Foundations';
    reasoning.push('Young puppies benefit most from foundational training');
  }

  // Rule 2: If energy_level = "High" AND challenges include settling → Primary = Calm & Focus
  if (
    answers.energy_level === 'High (constantly moving, easily overstimulated)' &&
    (answers.challenges.includes('Can\'t settle indoors') ||
      answers.challenges.includes('Gets overstimulated easily'))
  ) {
    primaryTrack = 'Calm & Focus';
    reasoning.push('High energy dogs need to learn calmness and self-control first');
  }

  // Rule 3: If challenges include "Poor recall" → Include Recall as a focus area
  if (answers.challenges.includes('Poor recall (doesn\'t come when called)')) {
    if (!secondaryTracks.includes('Recall')) {
      secondaryTracks.push('Recall');
      reasoning.push('Reliable recall is essential for safety and freedom');
    }
  }

  // Rule 4: If challenges include "Pulls on leash" → Include Leash & Walks
  if (answers.challenges.includes('Pulls on leash')) {
    if (!secondaryTracks.includes('Leash & Walks')) {
      secondaryTracks.push('Leash & Walks');
      reasoning.push('Loose leash walking will make daily walks more enjoyable');
    }
  }

  // Rule 5: If training_level = None or Basic → Ensure Beginner Foundations is included
  if (
    answers.training_level === 'None' ||
    answers.training_level === 'Basic (sit, stay, down)'
  ) {
    if (primaryTrack !== 'Beginner Foundations' && !secondaryTracks.includes('Beginner Foundations')) {
      secondaryTracks.push('Beginner Foundations');
      reasoning.push('Building a strong foundation will set you up for success');
    }
  }

  // Rule 6: If primary_goal = "Reliable recall" → Primary = Recall
  if (answers.primary_goal === 'Reliable recall') {
    primaryTrack = 'Recall';
    reasoning.push('Your goal aligns perfectly with focused recall training');
  }

  // Rule 7: If primary_goal = "Better walks" → Primary = Leash & Walks
  if (answers.primary_goal === 'Better walks') {
    primaryTrack = 'Leash & Walks';
    reasoning.push('We\'ll focus on making walks calm and enjoyable');
  }

  // Rule 8: If primary_goal = "Calm behavior at home" → Primary = Calm & Focus
  if (answers.primary_goal === 'Calm behavior at home') {
    primaryTrack = 'Calm & Focus';
    reasoning.push('Teaching calmness will transform your home environment');
  }

  // Rule 9: If primary_goal = "Mental stimulation" → Include Mental Stimulation
  if (answers.primary_goal === 'Mental stimulation') {
    if (!secondaryTracks.includes('Mental Stimulation')) {
      secondaryTracks.push('Mental Stimulation');
      reasoning.push('Mental enrichment is key to a happy, tired dog');
    }
  }

  // Rule 10: If primary_goal = "Better focus & listening" → Include Calm & Focus
  if (answers.primary_goal === 'Better focus & listening') {
    if (primaryTrack !== 'Calm & Focus' && !secondaryTracks.includes('Calm & Focus')) {
      secondaryTracks.push('Calm & Focus');
      reasoning.push('Focus work will improve all aspects of training');
    }
  }

  // Add Everyday Obedience as secondary if not already primary
  if (primaryTrack !== 'Everyday Obedience' && secondaryTracks.length < 2) {
    secondaryTracks.push('Everyday Obedience');
  }

  // Limit to 2-3 secondary tracks
  const limitedSecondaryTracks = secondaryTracks.slice(0, 3);

  return {
    primaryTrack,
    secondaryTracks: limitedSecondaryTracks,
    reasoning,
  };
}
