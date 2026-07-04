/**
 * HEEL Roadmap Generator — v1.0
 * 
 * Takes a user's quiz profile and generates a personalized 4-week
 * day-by-day training plan using real lessons from the category data.
 * 
 * ARCHITECTURE:
 * - Week 1: Urgent issues (Q9) + foundations. Heavy on the user's #1 and #2 priorities.
 * - Week 2: Expand skills. Introduce remaining recommended categories. Build consistency.
 * - Week 3: Real-world proofing + intermediate skills. PREMIUM ONLY.
 * - Week 4: Advanced skills + tricks + celebration. PREMIUM ONLY.
 * 
 * Each day has 1-2 lessons assigned, with rest days built in.
 * The plan respects lesson order within categories (sequential progression).
 * 
 * FREE USERS: See Week 1 fully, Week 2 titles only, Weeks 3-4 locked.
 * PREMIUM USERS: Full access to all 4 weeks with lesson links.
 */

import { CATEGORIES, Category, Lesson } from './categoryData';
import { getBreedById } from './breedDatabase';

// ============================================================================
// TYPES
// ============================================================================

export type RoadmapLesson = {
  lessonId: string;
  categoryId: string;
  title: string;
  categoryTitle: string;
  duration: number;
  difficulty: number;
  isPremiumLesson: boolean;
};

export type RoadmapDay = {
  dayNumber: number;         // 1-28
  dayOfWeek: string;         // "Monday", "Tuesday", etc.
  isRestDay: boolean;
  theme: string;             // e.g., "Foundation", "Potty Focus", "Rest & Bond"
  lessons: RoadmapLesson[];
  breedTip?: string;         // Optional breed-specific tip for the day
};

export type RoadmapWeek = {
  weekNumber: number;        // 1-4
  title: string;             // e.g., "Building the Foundation"
  description: string;       // Personalized description
  isPremiumWeek: boolean;    // Weeks 3-4 are premium
  days: RoadmapDay[];
  milestone: string;         // What the dog should achieve by end of week
};

export type TrainingRoadmap = {
  dogName: string;
  breed: string;
  breedId: string;
  generatedAt: string;
  totalLessons: number;
  totalWeeks: number;
  weeks: RoadmapWeek[];
};

// ============================================================================
// DAY OF WEEK LABELS
// ============================================================================

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ============================================================================
// LESSON POOL BUILDER
// Pulls real lessons from categories in priority order
// ============================================================================

function buildLessonPool(
  recommendedCategories: string[],
  allCategories: Category[]
): { categoryId: string; category: Category; lessons: Lesson[] }[] {
  const pool: { categoryId: string; category: Category; lessons: Lesson[] }[] = [];

  // First: recommended categories in priority order
  for (const catId of recommendedCategories) {
    const category = allCategories.find(c => c.id === catId);
    if (category && category.lessons.length > 0) {
      pool.push({
        categoryId: catId,
        category,
        lessons: [...category.lessons], // Clone to avoid mutation
      });
    }
  }

  // Then: remaining categories not in recommendations (for later weeks)
  for (const category of allCategories) {
    if (!recommendedCategories.includes(category.id)) {
      pool.push({
        categoryId: category.id,
        category,
        lessons: [...category.lessons],
      });
    }
  }

  return pool;
}

// ============================================================================
// LESSON PICKER
// Pulls the next available lesson from a category pool
// ============================================================================

function pickNextLesson(
  pool: { categoryId: string; category: Category; lessons: Lesson[] }[],
  categoryId: string,
  usedLessonIds: Set<string>,
  allowPremium: boolean = true
): RoadmapLesson | null {
  const entry = pool.find(p => p.categoryId === categoryId);
  if (!entry) return null;

  for (const lesson of entry.lessons) {
    const fullId = `${categoryId}_${lesson.id}`;
    if (usedLessonIds.has(fullId)) continue;
    if (!allowPremium && lesson.isPremium) continue;

    usedLessonIds.add(fullId);
    return {
      lessonId: lesson.id,
      categoryId,
      title: lesson.title,
      categoryTitle: entry.category.title,
      duration: lesson.duration,
      difficulty: lesson.difficulty,
      isPremiumLesson: lesson.isPremium || false,
    };
  }

  return null;
}

// ============================================================================
// BREED TIP SELECTOR
// Pulls tips from breed database and distributes across days
// ============================================================================

function getBreedTips(breedId: string): string[] {
  const breed = getBreedById(breedId);
  if (!breed) return [];
  return breed.trainingTips;
}

// ============================================================================
// MAIN GENERATOR
// ============================================================================

export function generateRoadmap(profile: {
  dogName: string;
  breed: string;
  breedId: string;
  energyLevel: number;
  experience: number;
  challenges: string[];
  q9Challenges: string[];
  recommendedCategories: string[];
  availability: number;
}): TrainingRoadmap {
  const {
    dogName,
    breed,
    breedId,
    energyLevel,
    experience,
    challenges,
    q9Challenges,
    recommendedCategories,
    availability,
  } = profile;

  const pool = buildLessonPool(recommendedCategories, CATEGORIES);
  const usedLessonIds = new Set<string>();
  const breedTips = getBreedTips(breedId);
  let breedTipIndex = 0;

  // Determine lessons per day based on availability
  const lessonsPerDay = availability >= 17 ? 2 : 1;

  // ============================================================================
  // WEEK 1: URGENT + FOUNDATIONS
  // Focus on Q9 urgent issues and the user's top 2 recommended categories
  // ============================================================================

  const week1Categories = recommendedCategories.slice(0, 3);
  const week1Days: RoadmapDay[] = [];

  for (let d = 0; d < 7; d++) {
    // Rest day on day 4 (Thursday) and day 7 (Sunday)
    if (d === 3 || d === 6) {
      week1Days.push({
        dayNumber: d + 1,
        dayOfWeek: DAY_NAMES[d],
        isRestDay: true,
        theme: 'Rest & Bond',
        lessons: [],
        breedTip: breedTips[breedTipIndex++ % Math.max(breedTips.length, 1)] || undefined,
      });
      continue;
    }

    const dayLessons: RoadmapLesson[] = [];
    
    // Rotate through week 1 categories
    const primaryCat = week1Categories[d % week1Categories.length];
    const lesson1 = pickNextLesson(pool, primaryCat, usedLessonIds);
    if (lesson1) dayLessons.push(lesson1);

    // Second lesson if availability allows
    if (lessonsPerDay >= 2 && dayLessons.length < 2) {
      const secondaryCat = week1Categories[(d + 1) % week1Categories.length];
      const lesson2 = pickNextLesson(pool, secondaryCat, usedLessonIds);
      if (lesson2) dayLessons.push(lesson2);
    }

    // Determine day theme based on categories
    let theme = 'Foundation';
    if (primaryCat === 'potty_training') theme = 'Potty Focus';
    else if (primaryCat === 'biting_nipping') theme = 'Bite Inhibition';
    else if (primaryCat === 'calm_focus') theme = 'Calm Training';
    else if (primaryCat === 'leash_walks') theme = 'Leash Skills';
    else if (primaryCat === 'recall') theme = 'Recall Basics';

    week1Days.push({
      dayNumber: d + 1,
      dayOfWeek: DAY_NAMES[d],
      isRestDay: false,
      theme,
      lessons: dayLessons,
    });
  }

  // ============================================================================
  // WEEK 2: EXPANDING SKILLS
  // Broaden to remaining recommended categories + deepen week 1 categories
  // ============================================================================

  const week2Categories = [...recommendedCategories];
  // Add tricks if not already recommended (good for engagement)
  if (!week2Categories.includes('tricks')) week2Categories.push('tricks');
  
  const week2Days: RoadmapDay[] = [];

  for (let d = 0; d < 7; d++) {
    if (d === 3 || d === 6) {
      week2Days.push({
        dayNumber: d + 8,
        dayOfWeek: DAY_NAMES[d],
        isRestDay: true,
        theme: 'Practice & Play',
        lessons: [],
        breedTip: breedTips[breedTipIndex++ % Math.max(breedTips.length, 1)] || undefined,
      });
      continue;
    }

    const dayLessons: RoadmapLesson[] = [];
    const catIndex = d % week2Categories.length;
    const primaryCat = week2Categories[catIndex];

    const lesson1 = pickNextLesson(pool, primaryCat, usedLessonIds);
    if (lesson1) dayLessons.push(lesson1);

    if (lessonsPerDay >= 2 && dayLessons.length < 2) {
      const secondaryCat = week2Categories[(catIndex + 1) % week2Categories.length];
      const lesson2 = pickNextLesson(pool, secondaryCat, usedLessonIds);
      if (lesson2) dayLessons.push(lesson2);
    }

    let theme = 'Building Habits';
    if (primaryCat === 'mental_work') theme = 'Brain Games';
    else if (primaryCat === 'tricks') theme = 'Trick Training';
    else if (primaryCat === 'recall') theme = 'Recall Building';

    week2Days.push({
      dayNumber: d + 8,
      dayOfWeek: DAY_NAMES[d],
      isRestDay: false,
      theme,
      lessons: dayLessons,
    });
  }

  // ============================================================================
  // WEEK 3: REAL-WORLD PROOFING (PREMIUM)
  // Take skills outside, add distractions, intermediate difficulty
  // ============================================================================

  // Prioritize proofing, handler skills, and advancing core categories
  const week3Categories = [
    'real_world_proofing',
    'handler_skills',
    'socialization',
    'reactive_dog',
    'cooperative_care',
    ...recommendedCategories.filter(c => !['real_world_proofing', 'handler_skills', 'socialization', 'reactive_dog', 'cooperative_care'].includes(c)),
  ];

  const week3Days: RoadmapDay[] = [];

  for (let d = 0; d < 7; d++) {
    if (d === 3 || d === 6) {
      week3Days.push({
        dayNumber: d + 15,
        dayOfWeek: DAY_NAMES[d],
        isRestDay: true,
        theme: 'Review & Reinforce',
        lessons: [],
        breedTip: breedTips[breedTipIndex++ % Math.max(breedTips.length, 1)] || undefined,
      });
      continue;
    }

    const dayLessons: RoadmapLesson[] = [];
    const catIndex = d % week3Categories.length;
    const primaryCat = week3Categories[catIndex];

    const lesson1 = pickNextLesson(pool, primaryCat, usedLessonIds, true);
    if (lesson1) dayLessons.push(lesson1);

    if (lessonsPerDay >= 2 && dayLessons.length < 2) {
      const secondaryCat = week3Categories[(catIndex + 1) % week3Categories.length];
      const lesson2 = pickNextLesson(pool, secondaryCat, usedLessonIds, true);
      if (lesson2) dayLessons.push(lesson2);
    }

    // Fallback: if primary categories are exhausted, pull from any category
    if (dayLessons.length === 0) {
      for (const entry of pool) {
        const fallback = pickNextLesson(pool, entry.categoryId, usedLessonIds, true);
        if (fallback) {
          dayLessons.push(fallback);
          break;
        }
      }
    }

    week3Days.push({
      dayNumber: d + 15,
      dayOfWeek: DAY_NAMES[d],
      isRestDay: false,
      theme: d < 3 ? 'Real-World Practice' : 'Handler Growth',
      lessons: dayLessons,
    });
  }

  // ============================================================================
  // WEEK 4: ADVANCED + TRICKS + CELEBRATION (PREMIUM)
  // Fun stuff, impressive skills, milestone celebration
  // ============================================================================

  const week4Categories = [
    'tricks',
    'handler_skills',
    'service_dog',
    'socialization',
    'reactive_dog',
    'cooperative_care',
    ...recommendedCategories,
  ];

  const week4Days: RoadmapDay[] = [];

  for (let d = 0; d < 7; d++) {
    if (d === 6) {
      // Final day is celebration / milestone day
      week4Days.push({
        dayNumber: d + 22,
        dayOfWeek: DAY_NAMES[d],
        isRestDay: true,
        theme: 'Milestone Celebration',
        lessons: [],
        breedTip: `You and ${dogName} have completed a full month of structured training. Take today to appreciate how far you've come together.`,
      });
      continue;
    }

    if (d === 3) {
      week4Days.push({
        dayNumber: d + 22,
        dayOfWeek: DAY_NAMES[d],
        isRestDay: true,
        theme: 'Rest & Review',
        lessons: [],
      });
      continue;
    }

    const dayLessons: RoadmapLesson[] = [];
    const catIndex = d % week4Categories.length;
    const primaryCat = week4Categories[catIndex];

    const lesson1 = pickNextLesson(pool, primaryCat, usedLessonIds, true);
    if (lesson1) dayLessons.push(lesson1);

    if (lessonsPerDay >= 2 && dayLessons.length < 2) {
      const secondaryCat = week4Categories[(catIndex + 2) % week4Categories.length];
      const lesson2 = pickNextLesson(pool, secondaryCat, usedLessonIds, true);
      if (lesson2) dayLessons.push(lesson2);
    }

    // Fallback
    if (dayLessons.length === 0) {
      for (const entry of pool) {
        const fallback = pickNextLesson(pool, entry.categoryId, usedLessonIds, true);
        if (fallback) {
          dayLessons.push(fallback);
          break;
        }
      }
    }

    let theme = 'Advanced Skills';
    if (primaryCat === 'tricks') theme = 'Show-Off Tricks';
    else if (primaryCat === 'service_dog') theme = 'Public Access Prep';

    week4Days.push({
      dayNumber: d + 22,
      dayOfWeek: DAY_NAMES[d],
      isRestDay: false,
      theme,
      lessons: dayLessons,
    });
  }

  // ============================================================================
  // ASSEMBLE WEEKS
  // ============================================================================

  const urgentLabel = q9Challenges.length > 0
    ? q9Challenges.includes('potty') ? 'potty training'
      : q9Challenges.includes('biting_urgent') ? 'bite inhibition'
      : q9Challenges.includes('separation') ? 'separation anxiety'
      : 'urgent challenges'
    : 'the basics';

  const weeks: RoadmapWeek[] = [
    {
      weekNumber: 1,
      title: 'Building the Foundation',
      description: `This week is all about ${urgentLabel} and establishing ${dogName}'s core training routine. Short sessions, big rewards, consistent timing.`,
      isPremiumWeek: false,
      days: week1Days,
      milestone: `By the end of Week 1, ${dogName} should be responding to basic commands at home and you'll have a consistent daily training habit.`,
    },
    {
      weekNumber: 2,
      title: 'Expanding Skills',
      description: `Now that ${dogName} has a foundation, we're broadening their skill set and introducing new challenges. Keep sessions fun and varied.`,
      isPremiumWeek: true,
      days: week2Days,
      milestone: `By the end of Week 2, ${dogName} should be comfortable with multiple commands and starting to generalize behaviors to new situations.`,
    },
    {
      weekNumber: 3,
      title: 'Real-World Proofing',
      description: `Time to take ${dogName}'s skills outside the house. We're adding distractions, new environments, and building reliability under pressure.`,
      isPremiumWeek: true,
      days: week3Days,
      milestone: `By the end of Week 3, ${dogName} should be performing commands in distracting environments and you'll be working as a real team.`,
    },
    {
      weekNumber: 4,
      title: 'Advanced & Fun',
      description: `The victory lap. ${dogName} learns impressive tricks, refines advanced skills, and you celebrate a full month of dedicated training together.`,
      isPremiumWeek: true,
      days: week4Days,
      milestone: `By the end of Week 4, ${dogName} will have a broad skill set, impressive tricks, and the foundation for a lifetime of learning.`,
    },
  ];

  // Count total lessons assigned
  const totalLessons = weeks.reduce((sum, week) => 
    sum + week.days.reduce((daySum, day) => daySum + day.lessons.length, 0), 0
  );

  return {
    dogName,
    breed,
    breedId,
    generatedAt: new Date().toISOString(),
    totalLessons,
    totalWeeks: 4,
    weeks,
  };
}

// ============================================================================
// HELPER: Get today's lesson(s) from a roadmap
// ============================================================================

export function getTodaysLessons(
  roadmap: TrainingRoadmap,
  startDate: Date,
): RoadmapDay | null {
  const now = new Date();
  const diffTime = now.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Find the day in the roadmap
  if (diffDays < 0 || diffDays >= 28) return null;

  const weekIndex = Math.floor(diffDays / 7);
  const dayIndex = diffDays % 7;

  if (weekIndex >= roadmap.weeks.length) return null;
  if (dayIndex >= roadmap.weeks[weekIndex].days.length) return null;

  return roadmap.weeks[weekIndex].days[dayIndex];
}

// ============================================================================
// HELPER: Get progress through roadmap
// ============================================================================

export function getRoadmapProgress(
  roadmap: TrainingRoadmap,
  completedLessons: { categoryId: string; lessonId: string }[],
): {
  totalAssigned: number;
  totalCompleted: number;
  percentComplete: number;
  currentWeek: number;
  currentDay: number;
} {
  let totalAssigned = 0;
  let totalCompleted = 0;
  let currentDay = 0;
  let currentWeek = 1;

  const completedSet = new Set(
    completedLessons.map(l => `${l.categoryId}_${l.lessonId}`)
  );

  for (const week of roadmap.weeks) {
    for (const day of week.days) {
      for (const lesson of day.lessons) {
        totalAssigned++;
        const key = `${lesson.categoryId}_${lesson.lessonId}`;
        if (completedSet.has(key)) {
          totalCompleted++;
        }
      }
    }
  }

  // Figure out where the user is based on completed lessons
  for (const week of roadmap.weeks) {
    for (const day of week.days) {
      const dayComplete = day.lessons.every(lesson => {
        const key = `${lesson.categoryId}_${lesson.lessonId}`;
        return completedSet.has(key);
      });
      if (!dayComplete && day.lessons.length > 0) {
        currentDay = day.dayNumber;
        currentWeek = week.weekNumber;
        break;
      }
    }
    if (currentDay > 0) break;
  }

  return {
    totalAssigned,
    totalCompleted,
    percentComplete: totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0,
    currentWeek: currentWeek || 1,
    currentDay: currentDay || 1,
  };
}
