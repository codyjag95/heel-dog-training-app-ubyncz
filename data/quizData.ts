
export interface QuizAnswer {
  // New Quiz Fields
  age?: string;
  time_owned?: string;
  environment?: string;
  exercise?: string;
  indoor_behavior?: string;
  command_response?: string;
  training_history?: string;
  motivation?: string;
  current_challenges: string[];
  biggest_frustration?: string;
  improve_first?: string;
  
  // Legacy fields (for backward compatibility)
  breed?: string;
  alone_time?: string;
  engagement_time?: string;
  post_excitement?: string;
  overstimulation?: string;
  new_environments?: string;
  alone_behavior?: string;
  training_consistency?: string;
  age_group?: string;
  energy_level?: string;
  challenges: string[];
  training_level?: string;
  primary_goal?: string;
  daily_time?: string;
  early_challenges: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multi' | 'text';
  options?: string[];
  saveAs: keyof QuizAnswer;
  placeholder?: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'How old is your dog?',
    type: 'single',
    saveAs: 'age',
    options: [
      'Puppy (0–6 months)',
      'Adolescent (6–18 months)',
      'Adult (1.5–7 years)',
      'Senior (7+ years)',
    ],
  },
  {
    id: 'q2',
    question: 'How long have you had your dog?',
    type: 'single',
    saveAs: 'time_owned',
    options: [
      'Less than a month',
      '1–6 months',
      '6–12 months',
      'Over a year',
    ],
  },
  {
    id: 'q3',
    question: 'Where does your dog live most of the time?',
    type: 'single',
    saveAs: 'environment',
    options: [
      'Apartment',
      'Townhome',
      'House with a yard',
    ],
  },
  {
    id: 'q4',
    question: 'On average, how much physical exercise does your dog get per day?',
    type: 'single',
    saveAs: 'exercise',
    options: [
      'Less than 20 minutes',
      '20–40 minutes',
      '40–60 minutes',
      'Over an hour',
    ],
  },
  {
    id: 'q5',
    question: 'How would you describe your dog indoors most days?',
    type: 'single',
    saveAs: 'indoor_behavior',
    options: [
      'Calm and relaxed',
      'Alert but manageable',
      'Restless or pacing',
      'Always "on" or hyper',
    ],
  },
  {
    id: 'q6',
    question: 'How does your dog respond to commands they already know?',
    type: 'single',
    saveAs: 'command_response',
    options: [
      'Immediately',
      'After a few seconds',
      'Only when food is visible',
      'Often ignores them',
    ],
  },
  {
    id: 'q7',
    question: 'Has your dog had any formal training before?',
    type: 'single',
    saveAs: 'training_history',
    options: [
      'None',
      'Group classes',
      'Private sessions',
      'Multiple programs',
    ],
  },
  {
    id: 'q8',
    question: 'What motivates your dog the most?',
    type: 'single',
    saveAs: 'motivation',
    options: [
      'Food',
      'Toys',
      'Praise / affection',
      'Movement or chasing',
    ],
  },
  {
    id: 'q9',
    question: 'Which behaviors are you currently working on? (Multi-select)',
    type: 'multi',
    saveAs: 'current_challenges',
    options: [
      'Pulling on leash',
      'Jumping on people',
      'Barking at noises',
      'Barking at dogs or people',
      'Ignoring recall',
      'Overexcited indoors',
      'Difficulty settling',
      'Destructive when alone',
      'Fearful in new environments',
    ],
  },
  {
    id: 'q10',
    question: 'What's your biggest frustration right now?',
    type: 'single',
    saveAs: 'biggest_frustration',
    options: [
      'Walks',
      'Calm indoors',
      'Recall',
      'Listening in general',
      'Anxiety-related behaviors',
    ],
  },
  {
    id: 'q11',
    question: 'What do you want to improve first?',
    type: 'single',
    saveAs: 'improve_first',
    options: [
      'Focus',
      'Calmness',
      'Manners',
      'Confidence',
      'Reliability',
    ],
  },
];

export interface DogScores {
  score_energy: number;
  score_focus: number;
  score_arousal: number;
  score_anxiety: number;
  score_impulse: number;
  score_structure: number;
}

export interface DerivedFields {
  profile_energy_level: 'Low' | 'Medium' | 'High';
  primary_issue: string;
  secondary_issue: string;
  recommended_session_length: string;
}

export interface TrainingRecommendation {
  primaryTrack: string;
  secondaryTracks: string[];
  immediateFocus: string[];
  reasoning: string[];
  scores?: DogScores;
  derived?: DerivedFields;
}

export const trainingTracks = [
  'Beginner Foundations',
  'Calm & Focus',
  'Everyday Obedience',
  'Leash & Walks',
  'Recall',
  'Mental Stimulation',
];

export function computeScores(answers: QuizAnswer): DogScores {
  let score_energy = 5;
  let score_focus = 5;
  let score_arousal = 5;
  let score_anxiety = 5;
  let score_impulse = 5;
  let score_structure = 5;

  if (answers.exercise === 'Less than 20 minutes') score_energy += 1;
  if (answers.exercise === '20–40 minutes') score_energy += 0;
  if (answers.exercise === '40–60 minutes') score_energy -= 1;
  if (answers.exercise === 'Over an hour') score_energy -= 2;

  if (answers.indoor_behavior === 'Calm and relaxed') score_energy -= 2;
  if (answers.indoor_behavior === 'Alert but manageable') score_energy -= 1;
  if (answers.indoor_behavior === 'Restless or pacing') score_energy += 1;
  if (answers.indoor_behavior === 'Always "on" or hyper') score_energy += 2;

  if (answers.command_response === 'Immediately') score_focus += 3;
  if (answers.command_response === 'After a few seconds') score_focus += 1;
  if (answers.command_response === 'Only when food is visible') score_focus -= 1;
  if (answers.command_response === 'Often ignores them') score_focus -= 3;

  if (answers.indoor_behavior === 'Calm and relaxed') score_arousal -= 2;
  if (answers.indoor_behavior === 'Alert but manageable') score_arousal -= 1;
  if (answers.indoor_behavior === 'Restless or pacing') score_arousal += 1;
  if (answers.indoor_behavior === 'Always "on" or hyper') score_arousal += 2;

  if (answers.current_challenges.includes('Overexcited indoors')) score_arousal += 2;
  if (answers.current_challenges.includes('Difficulty settling')) score_arousal += 1;

  if (answers.current_challenges.includes('Fearful in new environments')) score_anxiety += 3;
  if (answers.current_challenges.includes('Destructive when alone')) score_anxiety += 2;
  if (answers.current_challenges.includes('Barking at noises')) score_anxiety += 1;
  if (answers.current_challenges.includes('Barking at dogs or people')) score_anxiety += 1;

  if (answers.biggest_frustration === 'Anxiety-related behaviors') score_anxiety += 2;

  if (answers.current_challenges.includes('Jumping on people')) score_impulse += 1;
  if (answers.current_challenges.includes('Pulling on leash')) score_impulse += 1;
  if (answers.current_challenges.includes('Ignoring recall')) score_impulse += 2;
  if (answers.current_challenges.includes('Overexcited indoors')) score_impulse += 1;
  if (answers.current_challenges.includes('Difficulty settling')) score_impulse += 1;

  if (answers.command_response === 'Immediately') score_impulse -= 2;
  if (answers.command_response === 'Often ignores them') score_impulse += 2;

  if (answers.training_history === 'None') score_structure -= 2;
  if (answers.training_history === 'Group classes') score_structure += 0;
  if (answers.training_history === 'Private sessions') score_structure += 1;
  if (answers.training_history === 'Multiple programs') score_structure += 2;

  const clamp = (val: number) => Math.max(0, Math.min(10, val));

  return {
    score_energy: clamp(score_energy),
    score_focus: clamp(score_focus),
    score_arousal: clamp(score_arousal),
    score_anxiety: clamp(score_anxiety),
    score_impulse: clamp(score_impulse),
    score_structure: clamp(score_structure),
  };
}

export function deriveFields(scores: DogScores, answers: QuizAnswer): DerivedFields {
  let profile_energy_level: 'Low' | 'Medium' | 'High' = 'Medium';
  if (scores.score_energy <= 3) profile_energy_level = 'Low';
  else if (scores.score_energy >= 7) profile_energy_level = 'High';

  const issues: Array<{ name: string; score: number }> = [
    { name: 'Energy Management', score: scores.score_energy },
    { name: 'Focus & Attention', score: 10 - scores.score_focus },
    { name: 'Arousal Control', score: scores.score_arousal },
    { name: 'Anxiety', score: scores.score_anxiety },
    { name: 'Impulse Control', score: scores.score_impulse },
    { name: 'Training Structure', score: 10 - scores.score_structure },
  ];

  issues.sort((a, b) => b.score - a.score);

  const primary_issue = issues[0].name;
  const secondary_issue = issues[1].name;

  let recommended_session_length = '10 min';
  if (scores.score_focus >= 7 && scores.score_arousal <= 4) {
    recommended_session_length = '15 min';
  } else if (scores.score_focus <= 3 || scores.score_arousal >= 7) {
    recommended_session_length = '5 min';
  }

  return {
    profile_energy_level,
    primary_issue,
    secondary_issue,
    recommended_session_length,
  };
}

export function generateRecommendation(answers: QuizAnswer): TrainingRecommendation {
  const reasoning: string[] = [];
  let primaryTrack = 'Everyday Obedience';
  const secondaryTracks: string[] = [];
  const immediateFocus: string[] = [];

  const scores = computeScores(answers);
  const derived = deriveFields(scores, answers);

  if (answers.age === 'Puppy (0–6 months)') {
    primaryTrack = 'Beginner Foundations';
    reasoning.push('Young puppies benefit most from foundational training');
  }

  if (
    scores.score_arousal >= 7 &&
    (answers.current_challenges.includes('Difficulty settling') ||
      answers.current_challenges.includes('Overexcited indoors'))
  ) {
    primaryTrack = 'Calm & Focus';
    reasoning.push('High arousal dogs need to learn calmness and self-control first');
  }

  if (answers.current_challenges.includes('Ignoring recall')) {
    if (!secondaryTracks.includes('Recall')) {
      secondaryTracks.push('Recall');
      reasoning.push('Reliable recall is essential for safety and freedom');
    }
  }

  if (answers.current_challenges.includes('Pulling on leash')) {
    if (!secondaryTracks.includes('Leash & Walks')) {
      secondaryTracks.push('Leash & Walks');
      reasoning.push('Loose leash walking will make daily walks more enjoyable');
    }
  }

  if (
    answers.training_history === 'None' ||
    scores.score_structure <= 3
  ) {
    if (primaryTrack !== 'Beginner Foundations' && !secondaryTracks.includes('Beginner Foundations')) {
      secondaryTracks.push('Beginner Foundations');
      reasoning.push('Building a strong foundation will set you up for success');
    }
  }

  if (answers.biggest_frustration === 'Recall') {
    primaryTrack = 'Recall';
    reasoning.push('Your goal aligns perfectly with focused recall training');
  }

  if (answers.biggest_frustration === 'Walks') {
    primaryTrack = 'Leash & Walks';
    reasoning.push('We\'ll focus on making walks calm and enjoyable');
  }

  if (answers.biggest_frustration === 'Calm indoors') {
    primaryTrack = 'Calm & Focus';
    reasoning.push('Teaching calmness will transform your home environment');
  }

  if (scores.score_energy >= 7 && scores.score_focus <= 4) {
    if (!secondaryTracks.includes('Mental Stimulation')) {
      secondaryTracks.push('Mental Stimulation');
      reasoning.push('Mental enrichment is key to a happy, tired dog');
    }
  }

  if (answers.biggest_frustration === 'Listening in general') {
    if (primaryTrack !== 'Calm & Focus' && !secondaryTracks.includes('Calm & Focus')) {
      secondaryTracks.push('Calm & Focus');
      reasoning.push('Focus work will improve all aspects of training');
    }
  }

  if (answers.improve_first === 'Focus' && primaryTrack !== 'Calm & Focus') {
    if (!secondaryTracks.includes('Calm & Focus')) {
      secondaryTracks.push('Calm & Focus');
      reasoning.push('Focus training will help with all other skills');
    }
  }

  if (answers.improve_first === 'Calmness' && primaryTrack !== 'Calm & Focus') {
    primaryTrack = 'Calm & Focus';
    reasoning.push('Calmness is the foundation for all training success');
  }

  if (answers.improve_first === 'Confidence' && !secondaryTracks.includes('Mental Stimulation')) {
    secondaryTracks.push('Mental Stimulation');
    reasoning.push('Building confidence through mental challenges');
  }

  if (answers.improve_first === 'Reliability' && !secondaryTracks.includes('Recall')) {
    secondaryTracks.push('Recall');
    reasoning.push('Reliability starts with consistent recall training');
  }

  if (primaryTrack !== 'Everyday Obedience' && secondaryTracks.length < 2) {
    secondaryTracks.push('Everyday Obedience');
  }

  const limitedSecondaryTracks = secondaryTracks.slice(0, 3);

  return {
    primaryTrack,
    secondaryTracks: limitedSecondaryTracks,
    immediateFocus,
    reasoning,
    scores,
    derived,
  };
}
