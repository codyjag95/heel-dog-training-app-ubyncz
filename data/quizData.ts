
export interface QuizAnswer {
  // Dog Basics
  age?: string; // Puppy (0-6 months) / Adolescent (6-18 months) / Adult (1.5-7 years) / Senior (7+)
  breed?: string;
  time_owned?: string; // Less than a month / 1-6 months / 6-12 months / Over a year
  
  // Environment & Energy
  environment?: string; // Apartment / Townhome / House with yard
  exercise?: string; // <20 / 20-40 / 40-60 / 60+
  indoor_behavior?: string; // Calm and relaxed / Alert but manageable / Restless or pacing / Always "on" or hyper
  alone_time?: string; // Rarely / 1-3 / 4-6 / 7+
  
  // Current Challenges (multi-select)
  current_challenges: string[];
  
  // Focus & Motivation
  command_response?: string; // Immediately / After a few seconds / Only when food is visible / Often ignores them
  engagement_time?: string; // <1 min / 1-3 / 3-5 / 5+
  motivation?: string; // Food / Toys / Praise / Movement-chase
  
  // Regulation & Recovery
  post_excitement?: string; // Calms quickly / Takes minutes / Takes a long time / Never really settles
  overstimulation?: string; // Ignore commands / Bark-vocalize / Jump-mouth / Freeze-withdraw
  new_environments?: string; // Confident-curious / Cautious at first / Hesitant-unsure / Fearful-reactive
  alone_behavior?: string; // Rests calmly / Whines briefly / Paces-vocalizes / Destroys things
  
  // Training History
  training_history?: string; // None / Group classes / Private sessions / Multiple programs
  training_consistency?: string; // Very / Somewhat / Inconsistent / Rarely
  biggest_frustration?: string; // Walks / Calm indoors / Recall / Listening in general / Anxiety behaviors
  
  // Legacy fields (for backward compatibility)
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
  // Dog Basics
  {
    id: 'q1',
    question: 'How old is your dog?',
    type: 'single',
    saveAs: 'age',
    options: [
      'Puppy (0–6 months)',
      'Adolescent (6–18 months)',
      'Adult (1.5–7 years)',
      'Senior (7+)',
    ],
  },
  {
    id: 'q2',
    question: 'Breed or mix (optional)',
    type: 'text',
    saveAs: 'breed',
    placeholder: 'e.g., Golden Retriever, Lab Mix, etc.',
  },
  {
    id: 'q3',
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
  
  // Environment & Energy
  {
    id: 'q4',
    question: 'Where does your dog live most of the time?',
    type: 'single',
    saveAs: 'environment',
    options: [
      'Apartment',
      'Townhome',
      'House with yard',
    ],
  },
  {
    id: 'q5',
    question: 'On average, how much exercise per day?',
    type: 'single',
    saveAs: 'exercise',
    options: [
      '<20 min',
      '20–40 min',
      '40–60 min',
      '60+ min',
    ],
  },
  {
    id: 'q6',
    question: 'Indoors most days your dog is:',
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
    id: 'q7',
    question: 'How long left alone per day?',
    type: 'single',
    saveAs: 'alone_time',
    options: [
      'Rarely',
      '1–3 hours',
      '4–6 hours',
      '7+ hours',
    ],
  },
  
  // Current Challenges (multi-select)
  {
    id: 'q8',
    question: 'Which behaviors are you working on? (Select all that apply)',
    type: 'multi',
    saveAs: 'current_challenges',
    options: [
      'Pulling on leash',
      'Jumping on people',
      'Barking at noises',
      'Barking at dogs or people',
      'Ignoring recall',
      'Destructive when alone',
      'Overexcited indoors',
      'Difficulty settling',
      'Fearful in new environments',
      'None of the above',
    ],
  },
  
  // Focus & Motivation
  {
    id: 'q9',
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
    id: 'q10',
    question: 'How long can your dog stay engaged during training?',
    type: 'single',
    saveAs: 'engagement_time',
    options: [
      '<1 min',
      '1–3 min',
      '3–5 min',
      '5+ min',
    ],
  },
  {
    id: 'q11',
    question: 'What motivates your dog most?',
    type: 'single',
    saveAs: 'motivation',
    options: [
      'Food',
      'Toys',
      'Praise',
      'Movement / chase',
    ],
  },
  
  // Regulation & Recovery
  {
    id: 'q12',
    question: 'After excitement (walks/visitors), your dog usually:',
    type: 'single',
    saveAs: 'post_excitement',
    options: [
      'Calms quickly',
      'Takes a few minutes',
      'Takes a long time',
      'Never really settles',
    ],
  },
  {
    id: 'q13',
    question: 'When overstimulated, your dog tends to:',
    type: 'single',
    saveAs: 'overstimulation',
    options: [
      'Ignore commands',
      'Bark / vocalize',
      'Jump / mouth',
      'Freeze / withdraw',
    ],
  },
  {
    id: 'q14',
    question: 'In new environments, your dog is usually:',
    type: 'single',
    saveAs: 'new_environments',
    options: [
      'Confident / curious',
      'Cautious at first',
      'Hesitant / unsure',
      'Fearful / reactive',
    ],
  },
  {
    id: 'q15',
    question: 'When left alone, your dog typically:',
    type: 'single',
    saveAs: 'alone_behavior',
    options: [
      'Rests calmly',
      'Whines briefly',
      'Paces / vocalizes',
      'Destroys things',
    ],
  },
  
  // Training History
  {
    id: 'q16',
    question: 'Has your dog had formal training before?',
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
    id: 'q17',
    question: 'How consistent is training at home?',
    type: 'single',
    saveAs: 'training_consistency',
    options: [
      'Very consistent',
      'Somewhat consistent',
      'Inconsistent',
      'Rarely train',
    ],
  },
  {
    id: 'q18',
    question: 'Biggest frustration right now:',
    type: 'single',
    saveAs: 'biggest_frustration',
    options: [
      'Walks',
      'Calm indoors',
      'Recall',
      'Listening in general',
      'Anxiety behaviors',
    ],
  },
];

export interface DogScores {
  score_energy: number; // 0-10
  score_focus: number; // 0-10
  score_arousal: number; // 0-10
  score_anxiety: number; // 0-10
  score_impulse: number; // 0-10
  score_structure: number; // 0-10
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

// Scoring logic
export function computeScores(answers: QuizAnswer): DogScores {
  let score_energy = 5;
  let score_focus = 5;
  let score_arousal = 5;
  let score_anxiety = 5;
  let score_impulse = 5;
  let score_structure = 5;

  // Energy scoring
  if (answers.exercise === '<20 min') score_energy += 1;
  if (answers.exercise === '20–40 min') score_energy += 0;
  if (answers.exercise === '40–60 min') score_energy -= 1;
  if (answers.exercise === '60+ min') score_energy -= 2;

  if (answers.indoor_behavior === 'Calm and relaxed') score_energy -= 2;
  if (answers.indoor_behavior === 'Alert but manageable') score_energy -= 1;
  if (answers.indoor_behavior === 'Restless or pacing') score_energy += 1;
  if (answers.indoor_behavior === 'Always "on" or hyper') score_energy += 2;

  // Focus scoring
  if (answers.command_response === 'Immediately') score_focus += 3;
  if (answers.command_response === 'After a few seconds') score_focus += 1;
  if (answers.command_response === 'Only when food is visible') score_focus -= 1;
  if (answers.command_response === 'Often ignores them') score_focus -= 3;

  if (answers.engagement_time === '<1 min') score_focus -= 2;
  if (answers.engagement_time === '1–3 min') score_focus -= 1;
  if (answers.engagement_time === '3–5 min') score_focus += 1;
  if (answers.engagement_time === '5+ min') score_focus += 2;

  // Arousal scoring
  if (answers.post_excitement === 'Calms quickly') score_arousal -= 2;
  if (answers.post_excitement === 'Takes a few minutes') score_arousal -= 1;
  if (answers.post_excitement === 'Takes a long time') score_arousal += 1;
  if (answers.post_excitement === 'Never really settles') score_arousal += 2;

  if (answers.overstimulation === 'Ignore commands') score_arousal += 1;
  if (answers.overstimulation === 'Bark / vocalize') score_arousal += 2;
  if (answers.overstimulation === 'Jump / mouth') score_arousal += 2;
  if (answers.overstimulation === 'Freeze / withdraw') score_arousal += 1;

  // Anxiety scoring
  if (answers.new_environments === 'Confident / curious') score_anxiety -= 2;
  if (answers.new_environments === 'Cautious at first') score_anxiety += 0;
  if (answers.new_environments === 'Hesitant / unsure') score_anxiety += 1;
  if (answers.new_environments === 'Fearful / reactive') score_anxiety += 3;

  if (answers.alone_behavior === 'Rests calmly') score_anxiety -= 2;
  if (answers.alone_behavior === 'Whines briefly') score_anxiety += 0;
  if (answers.alone_behavior === 'Paces / vocalizes') score_anxiety += 2;
  if (answers.alone_behavior === 'Destroys things') score_anxiety += 3;

  // Impulse scoring
  if (answers.current_challenges.includes('Jumping on people')) score_impulse += 1;
  if (answers.current_challenges.includes('Pulling on leash')) score_impulse += 1;
  if (answers.current_challenges.includes('Ignoring recall')) score_impulse += 2;
  if (answers.current_challenges.includes('Overexcited indoors')) score_impulse += 1;
  if (answers.current_challenges.includes('Difficulty settling')) score_impulse += 1;

  if (answers.command_response === 'Immediately') score_impulse -= 2;
  if (answers.command_response === 'Often ignores them') score_impulse += 2;

  // Structure scoring
  if (answers.training_history === 'None') score_structure -= 2;
  if (answers.training_history === 'Group classes') score_structure += 0;
  if (answers.training_history === 'Private sessions') score_structure += 1;
  if (answers.training_history === 'Multiple programs') score_structure += 2;

  if (answers.training_consistency === 'Very consistent') score_structure += 2;
  if (answers.training_consistency === 'Somewhat consistent') score_structure += 0;
  if (answers.training_consistency === 'Inconsistent') score_structure -= 1;
  if (answers.training_consistency === 'Rarely train') score_structure -= 2;

  // Clamp scores to 0-10
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

// Derive fields from scores
export function deriveFields(scores: DogScores, answers: QuizAnswer): DerivedFields {
  // Profile energy level
  let profile_energy_level: 'Low' | 'Medium' | 'High' = 'Medium';
  if (scores.score_energy <= 3) profile_energy_level = 'Low';
  else if (scores.score_energy >= 7) profile_energy_level = 'High';

  // Primary and secondary issues
  const issues: { name: string; score: number }[] = [
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

  // Recommended session length
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

  // Compute scores
  const scores = computeScores(answers);
  const derived = deriveFields(scores, answers);

  // Rule 1: If age = "Puppy (0-6 months)" → Primary = Beginner Foundations
  if (answers.age === 'Puppy (0–6 months)') {
    primaryTrack = 'Beginner Foundations';
    reasoning.push('Young puppies benefit most from foundational training');
  }

  // Rule 2: High arousal + difficulty settling → Primary = Calm & Focus
  if (
    scores.score_arousal >= 7 &&
    (answers.current_challenges.includes('Difficulty settling') ||
      answers.current_challenges.includes('Overexcited indoors'))
  ) {
    primaryTrack = 'Calm & Focus';
    reasoning.push('High arousal dogs need to learn calmness and self-control first');
  }

  // Rule 3: If challenges include "Ignoring recall" → Include Recall as a focus area
  if (answers.current_challenges.includes('Ignoring recall')) {
    if (!secondaryTracks.includes('Recall')) {
      secondaryTracks.push('Recall');
      reasoning.push('Reliable recall is essential for safety and freedom');
    }
  }

  // Rule 4: If challenges include "Pulling on leash" → Include Leash & Walks
  if (answers.current_challenges.includes('Pulling on leash')) {
    if (!secondaryTracks.includes('Leash & Walks')) {
      secondaryTracks.push('Leash & Walks');
      reasoning.push('Loose leash walking will make daily walks more enjoyable');
    }
  }

  // Rule 5: If training_history = None or low structure → Ensure Beginner Foundations is included
  if (
    answers.training_history === 'None' ||
    scores.score_structure <= 3
  ) {
    if (primaryTrack !== 'Beginner Foundations' && !secondaryTracks.includes('Beginner Foundations')) {
      secondaryTracks.push('Beginner Foundations');
      reasoning.push('Building a strong foundation will set you up for success');
    }
  }

  // Rule 6: If biggest_frustration = "Recall" → Primary = Recall
  if (answers.biggest_frustration === 'Recall') {
    primaryTrack = 'Recall';
    reasoning.push('Your goal aligns perfectly with focused recall training');
  }

  // Rule 7: If biggest_frustration = "Walks" → Primary = Leash & Walks
  if (answers.biggest_frustration === 'Walks') {
    primaryTrack = 'Leash & Walks';
    reasoning.push('We\'ll focus on making walks calm and enjoyable');
  }

  // Rule 8: If biggest_frustration = "Calm indoors" → Primary = Calm & Focus
  if (answers.biggest_frustration === 'Calm indoors') {
    primaryTrack = 'Calm & Focus';
    reasoning.push('Teaching calmness will transform your home environment');
  }

  // Rule 9: High energy + low focus → Include Mental Stimulation
  if (scores.score_energy >= 7 && scores.score_focus <= 4) {
    if (!secondaryTracks.includes('Mental Stimulation')) {
      secondaryTracks.push('Mental Stimulation');
      reasoning.push('Mental enrichment is key to a happy, tired dog');
    }
  }

  // Rule 10: If biggest_frustration = "Listening in general" → Include Calm & Focus
  if (answers.biggest_frustration === 'Listening in general') {
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
    immediateFocus,
    reasoning,
    scores,
    derived,
  };
}
