/**
 * HEEL Quiz System - v4 SMART RECOMMENDATION ENGINE
 * 
 * CHANGES FROM v3:
 * 1. Q6 + Q9 challenges unified into single system — no more split logic
 * 2. Every Q6 challenge maps DIRECTLY to a category (not just some)
 * 3. Q9 "urgent issues" get CRITICAL priority (slot #1-2 guaranteed)
 * 4. Q7 goal maps smarter — "fix behavior" uses Q6 challenges
 * 5. Breed energy + age modifies priority ordering
 * 6. Profile includes human-readable labels for results page
 * 7. Separation anxiety → calm_focus AND everyday_obedience
 * 8. Fear/nervousness → real_world_proofing (confidence building)
 */

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

export const quizQuestions: QuizQuestion[] = [
  // Q1: Dog's Name
  {
    id: 'q1',
    question: "First things first - what's your dog's name?",
    subtitle: "We'll personalize everything just for them!",
    type: 'text',
    category: 'basics',
    placeholder: "Enter your dog's name",
    answers: [{ id: 'q1_a1', text: 'text_input', scores: {} }]
  },

  // Q2: Breed (40+ BREEDS with energy mapping)
  {
    id: 'q2',
    question: "What breed (or mix) is [DOG_NAME]?",
    subtitle: "This helps us understand their energy and training needs",
    type: 'single',
    category: 'basics',
    answers: [
      // VERY HIGH ENERGY (9-10)
      { id: 'q2_a1', text: 'Australian Shepherd', scores: { energyLevel: 10 } },
      { id: 'q2_a2', text: 'Border Collie', scores: { energyLevel: 10 } },
      { id: 'q2_a3', text: 'Belgian Malinois', scores: { energyLevel: 10 } },
      { id: 'q2_a4', text: 'Jack Russell Terrier', scores: { energyLevel: 9 } },
      { id: 'q2_a5', text: 'Siberian Husky', scores: { energyLevel: 9 } },
      { id: 'q2_a6', text: 'Vizsla', scores: { energyLevel: 9 } },
      { id: 'q2_a7', text: 'Weimaraner', scores: { energyLevel: 9 } },
      { id: 'q2_a8', text: 'Australian Cattle Dog', scores: { energyLevel: 9 } },
      
      // HIGH ENERGY (7-8)
      { id: 'q2_a9', text: 'German Shepherd', scores: { energyLevel: 8 } },
      { id: 'q2_a10', text: 'Golden Retriever', scores: { energyLevel: 7 } },
      { id: 'q2_a11', text: 'Labrador Retriever', scores: { energyLevel: 7 } },
      { id: 'q2_a12', text: 'Boxer', scores: { energyLevel: 8 } },
      { id: 'q2_a13', text: 'Poodle (Standard)', scores: { energyLevel: 7 } },
      { id: 'q2_a14', text: 'Springer Spaniel', scores: { energyLevel: 7 } },
      { id: 'q2_a15', text: 'Pit Bull / Staffordshire Terrier', scores: { energyLevel: 8 } },
      { id: 'q2_a16', text: 'Doberman Pinscher', scores: { energyLevel: 8 } },
      { id: 'q2_a17', text: 'Rottweiler', scores: { energyLevel: 7 } },
      { id: 'q2_a18', text: 'German Shorthaired Pointer', scores: { energyLevel: 9 } },
      
      // MODERATE ENERGY (5-6)
      { id: 'q2_a19', text: 'Beagle', scores: { energyLevel: 6 } },
      { id: 'q2_a20', text: 'Cocker Spaniel', scores: { energyLevel: 6 } },
      { id: 'q2_a21', text: 'Corgi (Pembroke/Cardigan)', scores: { energyLevel: 6 } },
      { id: 'q2_a22', text: 'Dachshund', scores: { energyLevel: 5 } },
      { id: 'q2_a23', text: 'French Bulldog', scores: { energyLevel: 4 } },
      { id: 'q2_a24', text: 'Pug', scores: { energyLevel: 4 } },
      { id: 'q2_a25', text: 'Boston Terrier', scores: { energyLevel: 5 } },
      { id: 'q2_a26', text: 'Cavalier King Charles Spaniel', scores: { energyLevel: 5 } },
      { id: 'q2_a27', text: 'Shih Tzu', scores: { energyLevel: 4 } },
      { id: 'q2_a28', text: 'Chihuahua', scores: { energyLevel: 5 } },
      { id: 'q2_a29', text: 'Yorkshire Terrier', scores: { energyLevel: 5 } },
      { id: 'q2_a30', text: 'Poodle (Miniature/Toy)', scores: { energyLevel: 6 } },
      
      // LOW ENERGY (2-4)
      { id: 'q2_a31', text: 'Bulldog (English)', scores: { energyLevel: 3 } },
      { id: 'q2_a32', text: 'Basset Hound', scores: { energyLevel: 3 } },
      { id: 'q2_a33', text: 'Great Dane', scores: { energyLevel: 4 } },
      { id: 'q2_a34', text: 'Mastiff', scores: { energyLevel: 3 } },
      { id: 'q2_a35', text: 'Newfoundland', scores: { energyLevel: 4 } },
      { id: 'q2_a36', text: 'Saint Bernard', scores: { energyLevel: 3 } },
      { id: 'q2_a37', text: 'Bernese Mountain Dog', scores: { energyLevel: 5 } },
      
      // MISC/UNKNOWN
      { id: 'q2_a38', text: 'Mixed Breed (High Energy)', scores: { energyLevel: 8 } },
      { id: 'q2_a39', text: 'Mixed Breed (Medium Energy)', scores: { energyLevel: 6 } },
      { id: 'q2_a40', text: 'Mixed Breed (Low Energy)', scores: { energyLevel: 4 } },
      { id: 'q2_a41', text: 'Not Listed / Other', scores: { energyLevel: 6 } },
    ]
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
      { id: 'q3_a2', text: '6-18 months (adolescent)', scores: { energyLevel: 8, experience: 1 } },
      { id: 'q3_a3', text: '18 months - 7 years (adult)', scores: { energyLevel: 6, experience: 2 } },
      { id: 'q3_a4', text: 'Over 7 years (senior)', scores: { energyLevel: 4, experience: 3 } },
    ]
  },

  // Q4: Training Experience
  {
    id: 'q4',
    question: "What's [DOG_NAME]'s training experience?",
    subtitle: "Be honest - we'll meet you where you're at!",
    type: 'single',
    category: 'behavior',
    answers: [
      { id: 'q4_a1', text: 'None - brand new to training', scores: { experience: 1 } },
      { id: 'q4_a2', text: 'Basic (knows sit, stay, down)', scores: { experience: 2 } },
      { id: 'q4_a3', text: 'Some structure but inconsistent', scores: { experience: 3 } },
      { id: 'q4_a4', text: 'Well trained, needs refinement', scores: { experience: 4 } },
    ]
  },

  // Q5: Motivation Type
  {
    id: 'q5',
    question: "What motivates [DOG_NAME] most?",
    subtitle: "This is KEY for effective training rewards",
    type: 'single',
    category: 'behavior',
    answers: [
      { id: 'q5_a1', text: 'Food / treats (very food motivated)', scores: { motivationType: 'food' } },
      { id: 'q5_a2', text: 'Toys / play', scores: { motivationType: 'play' } },
      { id: 'q5_a3', text: 'Praise / affection', scores: { motivationType: 'praise' } },
      { id: 'q5_a4', text: 'Mix of everything', scores: { motivationType: 'mixed' } },
    ]
  },

  // Q6: Behavioral Challenges (MULTIPLE CHOICE)
  {
    id: 'q6',
    question: "What challenges are you facing with [DOG_NAME]? (Select all that apply)",
    subtitle: "This directly determines your recommended training categories",
    type: 'multiple',
    category: 'behavior',
    answers: [
      { id: 'q6_a1', text: 'Pulls on leash', scores: { challenges: ['leash_pulling'] } },
      { id: 'q6_a2', text: 'Jumps on people', scores: { challenges: ['jumping'] } },
      { id: 'q6_a3', text: "Poor recall (doesn't come when called)", scores: { challenges: ['recall'] } },
      { id: 'q6_a4', text: 'Excessive barking', scores: { challenges: ['barking'] } },
      { id: 'q6_a5', text: 'Nipping / biting (puppy)', scores: { challenges: ['biting'] } },
      { id: 'q6_a6', text: "Can't settle / always hyper", scores: { challenges: ['hyperactive'] } },
      { id: 'q6_a7', text: 'Gets overstimulated easily', scores: { challenges: ['overstimulated'] } },
      { id: 'q6_a8', text: 'None of the above', scores: { challenges: [] } },
    ]
  },

  // Q7: Primary Goal
  {
    id: 'q7',
    question: "What is your PRIMARY training goal for [DOG_NAME]?",
    subtitle: "Pick the most important one",
    type: 'single',
    category: 'goals',
    answers: [
      { id: 'q7_a1', text: 'Calm behavior at home', scores: { challenges: ['goal_calm'] } },
      { id: 'q7_a2', text: 'Better walks (loose leash)', scores: { challenges: ['goal_walks'] } },
      { id: 'q7_a3', text: 'Reliable recall (off-leash)', scores: { challenges: ['goal_recall'] } },
      { id: 'q7_a4', text: 'Better focus & listening', scores: { challenges: ['goal_focus'] } },
      { id: 'q7_a5', text: 'Mental stimulation / enrichment', scores: { challenges: ['goal_mental'] } },
      { id: 'q7_a6', text: 'Fix specific behavior problem', scores: { challenges: ['goal_behavior'] } },
    ]
  },

  // Q8: Time Commitment
  {
    id: 'q8',
    question: "How much time can you dedicate to daily training?",
    subtitle: "Be realistic - consistency matters more than duration",
    type: 'single',
    category: 'lifestyle',
    answers: [
      { id: 'q8_a1', text: '5 minutes', scores: { availability: 7 } },
      { id: 'q8_a2', text: '10 minutes', scores: { availability: 12 } },
      { id: 'q8_a3', text: '15-20 minutes', scores: { availability: 17 } },
      { id: 'q8_a4', text: '30+ minutes', scores: { availability: 35 } },
    ]
  },

  // Q9: Current Urgent Issues (HIGHEST PRIORITY)
  {
    id: 'q9',
    question: "Are you currently dealing with any of the following? (Select all that apply)",
    type: 'multiple',
    category: 'behavior',
    answers: [
      { id: 'q9_a1', text: 'Potty accidents indoors', scores: { challenges: ['potty'] } },
      { id: 'q9_a2', text: 'Puppy biting / mouthing', scores: { challenges: ['biting_urgent'] } },
      { id: 'q9_a3', text: 'Separation anxiety', scores: { challenges: ['separation'] } },
      { id: 'q9_a4', text: 'Fear / nervousness', scores: { challenges: ['fear'] } },
      { id: 'q9_a5', text: 'None of the above', scores: { challenges: [] } },
    ]
  },
];

// Helper to replace [DOG_NAME] in questions
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
};

/**
 * Build profile from quiz answers
 */
export function buildProfileFromAnswers(answers: any[], dogName: string, allAnswers?: any[]) {
  const answersToProcess = allAnswers || answers;

  const profile = {
    dogName: dogName || 'Your Dog',
    breed: '',
    energyLevel: 5,
    experience: 2,
    motivationType: 'mixed' as 'food' | 'play' | 'praise' | 'mixed',
    availability: 15,
    challenges: [] as string[],       // Q6 challenges
    q9Challenges: [] as string[],     // Q9 urgent issues
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
      const breedAnswer = quizQuestions[1].answers.find(a => a.id === answerId);
      if (breedAnswer) {
        profile.breed = breedAnswer.text;
        if (breedAnswer.scores.energyLevel) {
          profile.energyLevel = breedAnswer.scores.energyLevel;
        }
      }
    }
    
    if (questionId === 'q3') {
      const ageAnswer = quizQuestions[2].answers.find(a => a.id === answerId);
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
      const expAnswer = quizQuestions[3].answers.find(a => a.id === answerId);
      if (expAnswer) {
        profile.experienceLabel = expAnswer.text;
        if (expAnswer.scores.experience) {
          profile.experience = Math.max(profile.experience, expAnswer.scores.experience);
        }
      }
    }
    
    if (questionId === 'q5') {
      const motAnswer = quizQuestions[4].answers.find(a => a.id === answerId);
      if (motAnswer?.scores.motivationType) {
        profile.motivationType = motAnswer.scores.motivationType;
      }
    }
    
    if (questionId === 'q6') {
      const challAnswer = quizQuestions[5].answers.find(a => a.id === answerId);
      if (challAnswer?.scores.challenges) {
        profile.challenges.push(...challAnswer.scores.challenges);
      }
    }

    if (questionId === 'q7') {
      const goalAnswer = quizQuestions[6].answers.find(a => a.id === answerId);
      if (goalAnswer?.scores.challenges && goalAnswer.scores.challenges.length > 0) {
        profile.q7Goal = goalAnswer.scores.challenges[0];
      }
    }
    
    if (questionId === 'q8') {
      const timeAnswer = quizQuestions[7].answers.find(a => a.id === answerId);
      if (timeAnswer?.scores.availability) {
        profile.availability = timeAnswer.scores.availability;
      }
    }
    
    if (questionId === 'q9') {
      const issueAnswer = quizQuestions[8].answers.find(a => a.id === answerId);
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

/**
 * CATEGORY RECOMMENDATION ENGINE - v4
 * 
 * PRIORITY ORDER:
 * 1. Q9 URGENT ISSUES → Direct category mapping, always slots #1-2
 * 2. Q6 CHALLENGES → Direct category mapping (biting → biting_nipping, etc.)
 * 3. Q7 PRIMARY GOAL → Maps to category
 * 4. FOUNDATION NEEDS → Based on experience + energy
 * 5. PREMIUM GUARANTEE → At least 1 premium category always included
 * 6. FILL TO 5 → Smart fill based on breed/energy profile
 */

const PREMIUM_CATEGORIES = [
  'potty_training',
  'biting_nipping', 
  'service_dog',
  'real_world_proofing',
  'handler_skills',
  'tricks',
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

  // Merge all challenges for unified lookup
  const allChallenges = [...new Set([...q9Challenges, ...challenges])];

  // ============================================================================
  // TIER 0: Q9 URGENT ISSUES — These ALWAYS go first, no exceptions
  // These are the "I need help RIGHT NOW" answers
  // ============================================================================
  
  if (q9Challenges.includes('potty')) {
    addIfNew(recommended, 'potty_training');
  }

  if (q9Challenges.includes('biting_urgent')) {
    addIfNew(recommended, 'biting_nipping');
  }

  if (q9Challenges.includes('separation')) {
    addIfNew(recommended, 'calm_focus');  // Separation = teach settling
  }

  if (q9Challenges.includes('fear')) {
    // Fear dogs need confidence → obedience builds confidence, then real-world exposure
    addIfNew(recommended, 'everyday_obedience');
    addIfNew(recommended, 'real_world_proofing');
  }

  // ============================================================================
  // TIER 1: Q6 BEHAVIORAL CHALLENGES — Direct category mapping
  // If someone says "my dog bites," Biting & Nipping MUST appear
  // ============================================================================
  
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
    addIfNew(recommended, 'everyday_obedience');  // Jumping = needs impulse control basics
  }

  if (challenges.includes('barking')) {
    addIfNew(recommended, 'calm_focus');  // Barking = needs settle/quiet training
  }

  if (challenges.includes('hyperactive') || challenges.includes('overstimulated')) {
    addIfNew(recommended, 'calm_focus');
    addIfNew(recommended, 'mental_work');  // Mental work tires hyper dogs
  }

  // ============================================================================
  // TIER 2: Q7 PRIMARY GOAL
  // ============================================================================
  
  if (q7Goal) {
    switch (q7Goal) {
      case 'goal_calm':
        addIfNew(recommended, 'calm_focus');
        break;
      case 'goal_walks':
        addIfNew(recommended, 'leash_walks');
        break;
      case 'goal_recall':
        addIfNew(recommended, 'recall');
        break;
      case 'goal_focus':
        addIfNew(recommended, 'everyday_obedience');
        break;
      case 'goal_mental':
        addIfNew(recommended, 'mental_work');
        break;
      case 'goal_behavior':
        // "Fix specific behavior" → look at what Q6 challenges they picked
        // If they have biting, leash, etc. those are already added above
        // Otherwise give them obedience as foundation
        addIfNew(recommended, 'everyday_obedience');
        break;
    }
  }

  // ============================================================================
  // TIER 3: FOUNDATION NEEDS (experience + energy based)
  // ============================================================================
  
  // Beginners ALWAYS need obedience foundations
  if (experience <= 2) {
    addIfNew(recommended, 'everyday_obedience');
  }
  
  // High energy dogs benefit from mental work
  if (energyLevel >= 8) {
    addIfNew(recommended, 'mental_work');
  }

  // High energy dogs need calm/settle training
  if (energyLevel >= 8) {
    addIfNew(recommended, 'calm_focus');
  }

  // Well-trained dogs → advanced categories (premium upsell)
  if (experience >= 4) {
    addIfNew(recommended, 'handler_skills');
    addIfNew(recommended, 'tricks');
  }

  // ============================================================================
  // TIER 4: PREMIUM GUARANTEE
  // At least ONE premium/teaser category must be included for conversion
  // ============================================================================
  
  const hasPremiumCategory = recommended.some(cat => PREMIUM_CATEGORIES.includes(cat));
  
  if (!hasPremiumCategory) {
    let premiumPick: string;
    if (experience >= 3) {
      premiumPick = 'tricks';
    } else if (energyLevel >= 7) {
      premiumPick = 'real_world_proofing';
    } else {
      premiumPick = 'tricks';
    }
    
    if (recommended.length >= 5) {
      recommended[recommended.length - 1] = premiumPick;
    } else {
      recommended.push(premiumPick);
    }
  }

  // ============================================================================
  // TIER 5: FILL TO MINIMUM 3 with smart defaults
  // ============================================================================
  
  if (recommended.length < 3) {
    // Pick fillers based on what would help this specific dog
    const smartFillers = getSmartFillers(profile, recommended);
    for (const filler of smartFillers) {
      if (recommended.length >= 3) break;
      addIfNew(recommended, filler);
    }
  }
  
  return recommended.slice(0, 5);
}

/**
 * Smart filler selection based on profile
 * Instead of always defaulting to the same categories,
 * pick fillers that make sense for THIS dog
 */
function getSmartFillers(profile: any, alreadyRecommended: string[]): string[] {
  const fillers: string[] = [];
  const { energyLevel, experience } = profile;

  // Priority order depends on the dog
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
