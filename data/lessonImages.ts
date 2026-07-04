/**
 * Category & Lesson Image System
 * 
 * SETUP:
 * 1. Create folder: assets/images/categories/
 * 2. Put all your category photos in that folder
 * 3. This file handles the rest
 * 
 * PLACEMENT: data/lessonImages.ts
 */

// ============================================================================
// CATEGORY HEADER IMAGES
// These show at the top of every lesson in that category
// ============================================================================

export const CATEGORY_IMAGES: { [categoryId: string]: any } = {
  everyday_obedience: require('../assets/images/categories/everyday_obedience.jpg'),
  leash_walks: require('../assets/images/categories/leash_walks.jpg'),
  calm_focus: require('../assets/images/categories/calm_focus.jpg'),
  recall: require('../assets/images/categories/recall.jpg'),
  mental_work: require('../assets/images/categories/mental_work.jpg'),
  real_world_proofing: require('../assets/images/categories/real_world_proofing.jpg'),
  service_dog: require('../assets/images/categories/service_dog.jpg'),
  potty_training: require('../assets/images/categories/potty_training.jpg'),
  biting_nipping: require('../assets/images/categories/biting_nipping.jpg'),
  handler_skills: require('../assets/images/categories/handler_skills.jpg'),
  tricks: require('../assets/images/categories/tricks.jpg'),
  // socialization: require('../assets/images/categories/socialization.jpg'),
  // reactive_dog: require('../assets/images/categories/reactive_dog.jpg'),
  // cooperative_care: require('../assets/images/categories/cooperative_care.jpg'),
};

// ============================================================================
// PER-LESSON IMAGES (OPTIONAL)
// Override the category image for specific lessons
// If a lesson has an entry here, it uses this instead of the category image
//
// To add: drop a photo in assets/images/lessons/ named by lesson ID
// Example: assets/images/lessons/eo_1.jpg
// Then uncomment: eo_1: require('../assets/images/lessons/eo_1.jpg'),
// ============================================================================

export const LESSON_IMAGES: { [lessonId: string]: any } = {
  // Add per-lesson images here when you have them
};

// ============================================================================
// GET IMAGE FOR A LESSON
// Priority: lesson-specific → category → fallback
// ============================================================================

const FALLBACK_URL = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80';

export function getLessonImage(
  categoryId: string,
  lessonId: string,
  videoUrl?: string,
): any {
  // 1. Check for lesson-specific local image
  if (LESSON_IMAGES[lessonId]) {
    return LESSON_IMAGES[lessonId];
  }

  // 2. Check for category local image
  if (CATEGORY_IMAGES[categoryId]) {
    return CATEGORY_IMAGES[categoryId];
  }

  // 3. Fallback
  return { uri: FALLBACK_URL };
}
