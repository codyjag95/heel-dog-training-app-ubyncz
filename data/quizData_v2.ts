/**
 * HEEL Quiz System - v5 WITH BREED DATABASE
 * 
 * CHANGES FROM v4:
 * 1. Q2 breed list now imports from breedDatabase.ts (80+ breeds, alphabetized)
 * 2. Energy levels pulled directly from breed data — single source of truth
 * 3. Added "I Don't Know" and "Mixed Breed" options at end of list
 * 4. All other quiz logic unchanged
 */

import BREEDS from './breedDatabase';

export type QuizAnswer = {
  id: string;
  text: string;
  scores: {
    energyLevel?: number;
    experience?: number;
    motivationType?: 'food' | 'play' | 'praise' | 'mixed';
    availability?: number;
    challenges?: string[];
  };
};

export type QuizQuestion = {
  id: string;
  question: string;
  subtitle?: string;
  type: 'single' | 'multiple' | 'text';
  answers: QuizAnswer[];
  category: 'basics' | 'behavior' | 'goals' | 'lifestyle';
  placeholder?: string;
};

// ============================================================================
// ENERGY MAPPING: Convert breed database energy enum → numeric quiz value
// ============================================================================
function energyToNumber(energy: string): number {
  switch (energy) {
    case 'very_high': return 9;
    case 'high': return 7;
    case 'moderate': return 5;
    case 'low': return 3;
    default: return 5;
  }
}

// ============================================================================
// GENERATE Q2 BREED ANSWERS FROM DATABASE
// Alphabetized, with energy levels pulled from breed data
// Mixed breeds and "I Don't Know" placed at the end
// ============================================================================
function generateBreedAnswers(): QuizAnswer[] {
  // Separate special entries from regular breeds
  const specialIds = ['mixed_breed', 'dont_know'];
  
  const regularBreeds = BREEDS.filter(b => !specialIds.includes(b.id) && b.group !== 'mixed');
  const mixedBreeds = BREEDS.filter(b => b.group === 'mixed' && b.id !== 'dont_know');
  const dontKnow = BREEDS.find(b => b.id === 'dont_know');

  const answers: QuizAnswer[] = [];

  // Regular breeds — alphabetized (already sorted in database)
  regularBreeds.forEach((breed, index) => {
    answers.push({
      id: `q2_${breed.id}`,
      text: breed.name,
      scores: { energyLevel: energyToNumber(breed.energy) },
    });
  });

  // Divider-style entries for mixed breeds
  mixedBreeds.forEach((breed) => {
    answers.push({
      id: `q2_${breed.id}`,
      text: breed.name,
      scores: { energyLevel: energyToNumber(breed.energy) },
    });
  });

  // "I Don't Know" at the very end
  if (dontKnow) {
    answers.push({
      id: `q2_${dontKnow.id}`,
      text: dontKnow.name,
      scores: { energyLevel: 5 },
    });
  }

  return answers;
}

// ============================================================================
// QUIZ QUESTIONS
// ============================================================================
export const quizQuestions: QuizQuestion[] = [
  // Q1: Dog's Name
  {
    id: 'q1',
    question: "First things first — what's your dog's name?",
    subtitle: "We'll personalize everything just for them",
    type: 'text',
    category: 'basics',
    placeholder: "Enter your dog's name",
    answers: [{ id: 'q1_a1', text: 'text_input', scores: {} }]
  },

  // Q2: Breed (GENERATED FROM DATABASE — 80+ breeds, alphabetized)
  {
    id: 'q2',
    question: "What breed is [DOG_NAME]?",
    subtitle: "This helps us tailor training to their instincts and energy",
    type: 'single',
    category: 'basics',
    answers: generateBreedAnswers(),
  },

  // Q3: Age
  {
    id: 'q3',
    question: "How old is [DOG_NAME]?",
    subtitle: "Age affects energy levels and training approach",
    type: 'single',
    category: 'basics',
    answers: [
      { id: 'q3_a1', text: 'Under 6 months (puppy)', scores: { energyLevel: 9, experience: 1 } },
      { id: 'q3_a2', text: '6–18 months (adolescent)', scores: { energyLevel: 8, experience: 1 } },
      { id: 'q3_a3', text: '18 months – 7 years (adult)', scores: { energyLevel: 6, experience: 2 } },
      { id: 'q3_a4', text: 'Over 7 years (senior)', scores: { energyLevel: 4, experience: 3 } },
    ]
  },

  // Q4: Training Experience
  {
    id: 'q4',
    question: "What's [DOG_NAME]'s training experience?",
    subtitle: "Be honest — we'll meet you where you're at",
    type: 'single',
    category: 'behavior',
    answers: [
      { id: 'q4_a1', text: 'None — brand new to training', scores: { experience: 1 } },
      { id: 'q4_a2', text: 'Basic (knows sit, stay, down)', scores: { experience: 2 } },
      { id: 'q4_a3', text: 'Some structure but inconsistent', scores: { experience: 3 } },
      { id: 'q4_a4', text: 'Well trained, needs refinement', scores: { experience: 4 } },
    ]
  },

  // Q5: Motivation Type
  {
    id: 'q5',
    question: "What motivates [DOG_NAME] most?",
    subtitle: "This determines how we structure your rewards",
    type: 'single',
    category: 'behavior',
    answers: [
      { id: 'q5_a1', text: 'Food / treats', scores: { motivationType: 'food' } },
      { id: 'q5_a2', text: 'Toys / play', scores: { motivationType: 'play' } },
      { id: 'q5_a3', text: 'Praise / affection', scores: { motivationType: 'praise' } },
      { id: 'q5_a4', text: 'Mix of everything', scores: { motivationType: 'mixed' } },
    ]
  },

  // Q6: Behavioral Challenges (MULTIPLE CHOICE)
  {
    id: 'q6',
    question: "What challenges are you facing with [DOG_NAME]?",
    subtitle: "Select all that apply — this directly shapes your plan",
    type: 'multiple',
    category: 'behavior',
    answers: [
      { id: 'q6_a1', text: 'Pulls on leash', scores: { challenges: ['leash_pulling'] } },
      { id: 'q6_a2', text: 'Jumps on people', scores: { challenges: ['jumping'] } },
      { id: 'q6_a3', text: "Doesn't come when called", scores: { challenges: ['recall'] } },
      { id: 'q6_a4', text: 'Excessive barking', scores: { challenges: ['barking'] } },
      { id: 'q6_a5', text: 'Nipping / mouthing', scores: { challenges: ['biting'] } },
      { id: 'q6_a6', text: "Can't settle / always hyper", scores: { challenges: ['hyperactive'] } },
      { id: 'q6_a7', text: 'Gets overstimulated easily', scores: { challenges: ['overstimulated'] } },
      { id: 'q6_a8', text: 'Reactive on leash (barking/lunging at dogs or people)', scores: { challenges: ['leash_reactive'] } },
      { id: 'q6_a9', text: 'Fearful of new people, places, or sounds', scores: { challenges: ['fear', 'socialization'] } },
      { id: 'q6_a10', text: 'Hates being groomed or handled', scores: { challenges: ['handling'] } },
      { id: 'q6_a11', text: 'None of the above', scores: { challenges: [] } },
    ]
  },

  // Q7: Primary Goal
  {
    id: 'q7',
    question: "What's your #1 training goal for [DOG_NAME]?",
    subtitle: "Pick the most important one",
    type: 'single',
    category: 'goals',
    answers: [
      { id: 'q7_a1', text: 'Calm behavior at home', scores: { challenges: ['goal_calm'] } },
      { id: 'q7_a2', text: 'Better walks (loose leash)', scores: { challenges: ['goal_walks'] } },
      { id: 'q7_a3', text: 'Reliable recall (off-leash)', scores: { challenges: ['goal_recall'] } },
      { id: 'q7_a4', text: 'Better focus & listening', scores: { challenges: ['goal_focus'] } },
      { id: 'q7_a5', text: 'Mental stimulation / enrichment', scores: { challenges: ['goal_mental'] } },
      { id: 'q7_a6', text: 'Fix a specific behavior problem', scores: { challenges: ['goal_behavior'] } },
    ]
  },

  // Q8: Time Commitment
  {
    id: 'q8',
    question: "How much time can you train daily?",
    subtitle: "Be realistic — consistency matters more than duration",
    type: 'single',
    category: 'lifestyle',
    answers: [
      { id: 'q8_a1', text: '5 minutes', scores: { availability: 7 } },
      { id: 'q8_a2', text: '10 minutes', scores: { availability: 12 } },
      { id: 'q8_a3', text: '15–20 minutes', scores: { availability: 17 } },
      { id: 'q8_a4', text: '30+ minutes', scores: { availability: 35 } },
    ]
  },

  // Q9: Current Urgent Issues (HIGHEST PRIORITY)
  {
    id: 'q9',
    question: "Are you currently dealing with any of these?",
    subtitle: "Select all that apply — these become your top priorities",
    type: 'multiple',
    category: 'behavior',
    answers: [
      { id: 'q9_a1', text: 'Potty accidents indoors', scores: { challenges: ['potty'] } },
      { id: 'q9_a2', text: 'Puppy biting / mouthing that hurts', scores: { challenges: ['biting_urgent'] } },
      { id: 'q9_a3', text: 'Separation anxiety', scores: { challenges: ['separation'] } },
      { id: 'q9_a4', text: 'Fear / nervousness', scores: { challenges: ['fear'] } },
      { id: 'q9_a6', text: 'Dog aggression or reactivity', scores: { challenges: ['reactivity'] } },
      { id: 'q9_a5', text: 'None of the above', scores: { challenges: [] } },
    ]
  },
];

// ============================================================================
// Helper to replace [DOG_NAME] in questions
// ============================================================================
export const personalizeQuestion = (question: string, dogName: string, breed?: string): string => {
  let personalized = question.replace(/\[DOG_NAME\]/g, dogName || 'your dog');
  if (breed) {
    personalized = personalized.replace(/\[BREED\]/g, breed);
  }
  return personalized;
};

// ============================================================================
// HUMAN-READABLE CHALLENGE LABELS (used in results page)
// ============================================================================
export const CHALLENGE_LABELS: { [key: string]: string } = {
  leash_pulling: 'leash pulling',
  jumping: 'jumping on people',
  recall: 'poor recall',
  barking: 'excessive barking',
  biting: 'nipping/biting',
  biting_urgent: 'puppy biting',
  hyperactive: 'hyperactivity',
  overstimulated: 'overstimulation',
  potty: 'potty training',
  separation: 'separation anxiety',
  fear: 'fear/nervousness',
  goal_calm: 'calm behavior',
  goal_walks: 'better walks',
  goal_recall: 'reliable recall',
  goal_focus: 'focus & listening',
  goal_mental: 'mental stimulation',
  goal_behavior: 'behavior fix',
  leash_reactive: 'leash reactivity',
  reactivity: 'dog reactivity',
  socialization: 'socialization gaps',
  handling: 'grooming/handling issues',
};

// ============================================================================
// BUILD PROFILE FROM QUIZ ANSWERS
// ============================================================================
export function buildProfileFromAnswers(answers: any[], dogName: string, allAnswers?: any[]) {
  const answersToProcess = allAnswers || answers;

  const profile = {
    dogName: dogName || 'Your Dog',
    breed: '',
    breedId: '',  // NEW: Store breed ID for database lookups
    energyLevel: 5,
    experience: 2,
    motivationType: 'mixed' as 'food' | 'play' | 'praise' | 'mixed',
    availability: 15,
    availabilityLabel: '' as string,
    challenges: [] as string[],
    q9Challenges: [] as string[],
    q7Goal: '' as string,
    ageLabel: '' as string,
    experienceLabel: '' as string,
    recommendedCategories: [] as string[],
  };

  answersToProcess.forEach(answer => {
    const { questionId, answerId, value } = answer;
    
    if (questionId === 'q1' && value) {
      profile.dogName = value;
    }
    
    if (questionId === 'q2') {
      // Find the selected breed answer
      const breedQuestion = quizQuestions.find(q => q.id === 'q2');
      const breedAnswer = breedQuestion?.answers.find(a => a.id === answerId);
      if (breedAnswer) {
        profile.breed = breedAnswer.text;
        // Extract breed ID from answer ID (q2_australian_shepherd → australian_shepherd)
        profile.breedId = answerId.replace('q2_', '');
        if (breedAnswer.scores.energyLevel) {
          profile.energyLevel = breedAnswer.scores.energyLevel;
        }
      }
    }
    
    if (questionId === 'q3') {
      const ageQuestion = quizQuestions.find(q => q.id === 'q3');
      const ageAnswer = ageQuestion?.answers.find(a => a.id === answerId);
      if (ageAnswer) {
        profile.ageLabel = ageAnswer.text;
        if (ageAnswer.scores.energyLevel) {
          profile.energyLevel = Math.round((profile.energyLevel + ageAnswer.scores.energyLevel) / 2);
        }
        if (ageAnswer.scores.experience) {
          profile.experience = ageAnswer.scores.experience;
        }
      }
    }
    
    if (questionId === 'q4') {
      const expQuestion = quizQuestions.find(q => q.id === 'q4');
      const expAnswer = expQuestion?.answers.find(a => a.id === answerId);
      if (expAnswer) {
        profile.experienceLabel = expAnswer.text;
        if (expAnswer.scores.experience) {
          profile.experience = Math.max(profile.experience, expAnswer.scores.experience);
        }
      }
    }
    
    if (questionId === 'q5') {
      const motQuestion = quizQuestions.find(q => q.id === 'q5');
      const motAnswer = motQuestion?.answers.find(a => a.id === answerId);
      if (motAnswer?.scores.motivationType) {
        profile.motivationType = motAnswer.scores.motivationType;
      }
    }
    
    if (questionId === 'q6') {
      const challQuestion = quizQuestions.find(q => q.id === 'q6');
      const challAnswer = challQuestion?.answers.find(a => a.id === answerId);
      if (challAnswer?.scores.challenges) {
        profile.challenges.push(...challAnswer.scores.challenges);
      }
    }

    if (questionId === 'q7') {
      const goalQuestion = quizQuestions.find(q => q.id === 'q7');
      const goalAnswer = goalQuestion?.answers.find(a => a.id === answerId);
      if (goalAnswer?.scores.challenges && goalAnswer.scores.challenges.length > 0) {
        profile.q7Goal = goalAnswer.scores.challenges[0];
      }
    }
    
    if (questionId === 'q8') {
      const timeQuestion = quizQuestions.find(q => q.id === 'q8');
      const timeAnswer = timeQuestion?.answers.find(a => a.id === answerId);
      if (timeAnswer?.scores.availability) {
        profile.availability = timeAnswer.scores.availability;
        profile.availabilityLabel = timeAnswer.text; // Store human-readable label
      }
    }
    
    if (questionId === 'q9') {
      const issueQuestion = quizQuestions.find(q => q.id === 'q9');
      const issueAnswer = issueQuestion?.answers.find(a => a.id === answerId);
      if (issueAnswer?.scores.challenges) {
        profile.q9Challenges.push(...issueAnswer.scores.challenges);
      }
    }
  });

  profile.challenges = [...new Set(profile.challenges)];
  profile.q9Challenges = [...new Set(profile.q9Challenges)];
  profile.recommendedCategories = determineRecommendedCategories(profile);

  return profile;
}

// ============================================================================
// CATEGORY RECOMMENDATION ENGINE — v4 (unchanged logic)
// ============================================================================

const PREMIUM_CATEGORIES = [
  'potty_training',
  'biting_nipping',
  'service_dog',
  'real_world_proofing',
  'handler_skills',
  'tricks',
  'socialization',
  'reactive_dog',
  'cooperative_care',
];

function addIfNew(arr: string[], item: string, max: number = 5): boolean {
  if (arr.length >= max) return false;
  if (arr.includes(item)) return false;
  arr.push(item);
  return true;
}

function determineRecommendedCategories(profile: any): string[] {
  const recommended: string[] = [];
  const { energyLevel, experience, challenges, q9Challenges, q7Goal } = profile;

  const allChallenges = [...new Set([...q9Challenges, ...challenges])];

  // TIER 0: Q9 URGENT ISSUES — always first
  if (q9Challenges.includes('potty')) {
    addIfNew(recommended, 'potty_training');
  }
  if (q9Challenges.includes('biting_urgent')) {
    addIfNew(recommended, 'biting_nipping');
  }
  if (q9Challenges.includes('separation')) {
    addIfNew(recommended, 'calm_focus');
  }
  if (q9Challenges.includes('fear')) {
    addIfNew(recommended, 'socialization');
    addIfNew(recommended, 'calm_focus');
    addIfNew(recommended, 'cooperative_care');
  }
  if (q9Challenges.includes('reactivity')) {
    addIfNew(recommended, 'reactive_dog');
    addIfNew(recommended, 'socialization');
    addIfNew(recommended, 'calm_focus');
  }

  // TIER 1: Q6 BEHAVIORAL CHALLENGES
  if (challenges.includes('biting')) {
    addIfNew(recommended, 'biting_nipping');
  }
  if (challenges.includes('leash_pulling')) {
    addIfNew(recommended, 'leash_walks');
  }
  if (challenges.includes('recall')) {
    addIfNew(recommended, 'recall');
  }
  if (challenges.includes('jumping')) {
    addIfNew(recommended, 'everyday_obedience');
  }
  if (challenges.includes('barking')) {
    addIfNew(recommended, 'calm_focus');
  }
  if (challenges.includes('hyperactive') || challenges.includes('overstimulated')) {
    addIfNew(recommended, 'calm_focus');
    addIfNew(recommended, 'mental_work');
  }
  if (challenges.includes('leash_reactive')) {
    addIfNew(recommended, 'reactive_dog');
    addIfNew(recommended, 'leash_walks');
    addIfNew(recommended, 'calm_focus');
  }
  if (challenges.includes('socialization')) {
    addIfNew(recommended, 'socialization');
    addIfNew(recommended, 'calm_focus');
  }
  if (challenges.includes('fear')) {
    addIfNew(recommended, 'socialization');
    addIfNew(recommended, 'calm_focus');
    addIfNew(recommended, 'cooperative_care');
  }
  if (challenges.includes('handling')) {
    addIfNew(recommended, 'cooperative_care');
    addIfNew(recommended, 'calm_focus');
  }

  // TIER 2: Q7 PRIMARY GOAL
  if (q7Goal) {
    switch (q7Goal) {
      case 'goal_calm': addIfNew(recommended, 'calm_focus'); break;
      case 'goal_walks': addIfNew(recommended, 'leash_walks'); break;
      case 'goal_recall': addIfNew(recommended, 'recall'); break;
      case 'goal_focus': addIfNew(recommended, 'everyday_obedience'); break;
      case 'goal_mental': addIfNew(recommended, 'mental_work'); break;
      case 'goal_behavior': addIfNew(recommended, 'everyday_obedience'); break;
    }
  }

  // TIER 3: FOUNDATION NEEDS
  if (experience <= 2) {
    addIfNew(recommended, 'everyday_obedience');
  }
  if (energyLevel >= 8) {
    addIfNew(recommended, 'mental_work');
  }
  if (energyLevel >= 8) {
    addIfNew(recommended, 'calm_focus');
  }
  if (experience >= 4) {
    addIfNew(recommended, 'handler_skills');
    addIfNew(recommended, 'tricks');
  }

  // TIER 4: PREMIUM GUARANTEE
  const hasPremiumCategory = recommended.some(cat => PREMIUM_CATEGORIES.includes(cat));
  if (!hasPremiumCategory) {
    let premiumPick: string;
    if (experience >= 3) premiumPick = 'tricks';
    else if (energyLevel >= 7) premiumPick = 'real_world_proofing';
    else premiumPick = 'tricks';
    
    if (recommended.length >= 5) {
      recommended[recommended.length - 1] = premiumPick;
    } else {
      recommended.push(premiumPick);
    }
  }

  // TIER 5: FILL TO MINIMUM 3
  if (recommended.length < 3) {
    const smartFillers = getSmartFillers(profile, recommended);
    for (const filler of smartFillers) {
      if (recommended.length >= 3) break;
      addIfNew(recommended, filler);
    }
  }
  
  return recommended.slice(0, 5);
}

function getSmartFillers(profile: any, alreadyRecommended: string[]): string[] {
  const fillers: string[] = [];
  const { energyLevel, experience } = profile;

  if (experience <= 2) {
    fillers.push('everyday_obedience', 'leash_walks', 'calm_focus');
  } else if (energyLevel >= 7) {
    fillers.push('mental_work', 'recall', 'leash_walks');
  } else if (experience >= 3) {
    fillers.push('recall', 'tricks', 'leash_walks');
  } else {
    fillers.push('everyday_obedience', 'leash_walks', 'calm_focus');
  }

  return fillers.filter(f => !alreadyRecommended.includes(f));
}
