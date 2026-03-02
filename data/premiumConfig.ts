/**
 * PREMIUM LESSON CONFIGURATION
 * 
 * Defines which lessons are premium in each category based on requirements:
 * - Biting & Potty Training: First 2 FREE, rest PREMIUM
 * - All other categories: Last 2-3 lessons PREMIUM
 */

export const PREMIUM_CONFIG = {
  // Category IDs that have special "first 2 free" rule
  FIRST_TWO_FREE_CATEGORIES: [
    'biting-nipping-mouthing',  // Biting, Nipping & Mouthing
    'potty-training',            // Potty Training & House Habits
  ],

  // For categories NOT in the above list:
  // How many lessons at the END should be premium
  PREMIUM_LESSON_COUNT_AT_END: 3, // Last 3 lessons are premium

  // Cross-category prerequisite mapping
  // Format: { lessonId: [prerequisiteLessonIds] }
  PREREQUISITES: {
    // Everyday Obedience - Sequential
    'stay': ['sit'],
    'down': ['sit'],
    'place': ['down'],
    'heel-intro': ['loose-leash'],
    
    // Leash & Walks - Sequential
    'structured-walk': ['loose-leash'],
    'leash-reactivity': ['structured-walk'],
    
    // Advanced skills build on basics
    'off-leash-recall': ['recall-foundation'],
    'distance-down': ['down'],
  },
};

/**
 * Helper function to determine if a lesson is premium
 * @param categoryId - The category ID
 * @param lessonIndex - The index of the lesson in the category (0-based)
 * @param totalLessons - Total number of lessons in the category
 */
export function isLessonPremium(
  categoryId: string,
  lessonIndex: number,
  totalLessons: number
): boolean {
  // Check if this is a "first 2 free" category
  if (PREMIUM_CONFIG.FIRST_TWO_FREE_CATEGORIES.includes(categoryId)) {
    // First 2 are free (index 0 and 1), rest are premium
    return lessonIndex >= 2;
  }

  // For all other categories: last X lessons are premium
  const premiumStartIndex = totalLessons - PREMIUM_CONFIG.PREMIUM_LESSON_COUNT_AT_END;
  return lessonIndex >= premiumStartIndex;
}

/**
 * Helper function to get prerequisites for a lesson
 * @param lessonId - The lesson ID
 * @returns Array of prerequisite lesson IDs
 */
export function getPrerequisites(lessonId: string): string[] {
  return PREMIUM_CONFIG.PREREQUISITES[lessonId] || [];
}
