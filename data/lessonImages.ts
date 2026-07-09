import type { ImageSourcePropType } from 'react-native';

/**
 * Central image registry for HEEL category and lesson headers.
 *
 * React Native/Metro cannot bundle images from dynamic string paths, so every
 * local image must be listed with a static require() call in this file.
 *
 * Category image naming:
 * assets/images/categories/<category_id>.jpg
 *
 * Lesson image naming:
 * assets/images/lessons/<category_id>/<lesson_order>.jpg
 *
 * Lesson order is 1-based and follows the lesson's position inside its category:
 * first lesson = 1.jpg, second lesson = 2.jpg, and so on.
 */

export const CATEGORY_IMAGES: Record<string, ImageSourcePropType> = {
  puppy_foundations: require('../assets/images/categories/puppy_foundations.jpg'),
  everyday_obedience: require('../assets/images/categories/everyday_obedience.jpg'),
  leash_walks: require('../assets/images/categories/leash_walks.jpg'),
  potty_training: require('../assets/images/categories/potty_training1.jpg'),
  biting_nipping: require('../assets/images/categories/biting_nipping2.jpg'),
  calm_focus: require('../assets/images/categories/calm_focus1.jpg'),
  recall: require('../assets/images/categories/recall.jpg'),
  socialization: require('../assets/images/categories/socialization.jpg'),
  reactive_dog: require('../assets/images/categories/reactive_dog.jpg'),
  mental_work: require('../assets/images/categories/mental_work1.jpg'),
  cooperative_care: require('../assets/images/categories/cooperative_care.jpg'),
  barking_alert: require('../assets/images/categories/barking_alert.jpg'),
  real_world_proofing: require('../assets/images/categories/real_world_proofing1.jpg'),
  tricks: require('../assets/images/categories/tricks.jpg'),
  handler_skills: require('../assets/images/categories/handler_skills.jpg'),
  service_dog: require('../assets/images/categories/service_dog.jpg'),
};

/**
 * Add a category image:
 * 1. Save the file as assets/images/categories/<category_id>.jpg.
 * 2. Add or uncomment the matching static require() in CATEGORY_IMAGES above.
 *
 * Add a lesson-specific image:
 * 1. Save the file as assets/images/lessons/<category_id>/<lesson_order>.jpg.
 * 2. Uncomment the matching static require() placeholder below.
 *
 * Do not uncomment a require() until the file exists, or Metro will fail to build.
 */
export const LESSON_IMAGES: Record<string, Record<number, ImageSourcePropType>> = {
  puppy_foundations: {
    // 1: require('../assets/images/lessons/puppy_foundations/1.jpg'),
    // 2: require('../assets/images/lessons/puppy_foundations/2.jpg'),
    // 3: require('../assets/images/lessons/puppy_foundations/3.jpg'),
    // 4: require('../assets/images/lessons/puppy_foundations/4.jpg'),
    // 5: require('../assets/images/lessons/puppy_foundations/5.jpg'),
    // 6: require('../assets/images/lessons/puppy_foundations/6.jpg'),
    // 7: require('../assets/images/lessons/puppy_foundations/7.jpg'),
    // 8: require('../assets/images/lessons/puppy_foundations/8.jpg'),
    // 9: require('../assets/images/lessons/puppy_foundations/9.jpg'),
    // 10: require('../assets/images/lessons/puppy_foundations/10.jpg'),
    // 11: require('../assets/images/lessons/puppy_foundations/11.jpg'),
    // 12: require('../assets/images/lessons/puppy_foundations/12.jpg'),
    // 13: require('../assets/images/lessons/puppy_foundations/13.jpg'),
    // 14: require('../assets/images/lessons/puppy_foundations/14.jpg'),
    // 15: require('../assets/images/lessons/puppy_foundations/15.jpg'),
  },
  everyday_obedience: {
    // 1: require('../assets/images/lessons/everyday_obedience/1.jpg'),
    // 2: require('../assets/images/lessons/everyday_obedience/2.jpg'),
    // 3: require('../assets/images/lessons/everyday_obedience/3.jpg'),
    // 4: require('../assets/images/lessons/everyday_obedience/4.jpg'),
    // 5: require('../assets/images/lessons/everyday_obedience/5.jpg'),
    // 6: require('../assets/images/lessons/everyday_obedience/6.jpg'),
    // 7: require('../assets/images/lessons/everyday_obedience/7.jpg'),
    // 8: require('../assets/images/lessons/everyday_obedience/8.jpg'),
    // 9: require('../assets/images/lessons/everyday_obedience/9.jpg'),
    // 10: require('../assets/images/lessons/everyday_obedience/10.jpg'),
    // 11: require('../assets/images/lessons/everyday_obedience/11.jpg'),
    // 12: require('../assets/images/lessons/everyday_obedience/12.jpg'),
    // 13: require('../assets/images/lessons/everyday_obedience/13.jpg'),
    // 14: require('../assets/images/lessons/everyday_obedience/14.jpg'),
    // 15: require('../assets/images/lessons/everyday_obedience/15.jpg'),
    // 16: require('../assets/images/lessons/everyday_obedience/16.jpg'),
  },
  leash_walks: {
    // 1: require('../assets/images/lessons/leash_walks/1.jpg'),
    // 2: require('../assets/images/lessons/leash_walks/2.jpg'),
    // 3: require('../assets/images/lessons/leash_walks/3.jpg'),
    // 4: require('../assets/images/lessons/leash_walks/4.jpg'),
    // 5: require('../assets/images/lessons/leash_walks/5.jpg'),
    // 6: require('../assets/images/lessons/leash_walks/6.jpg'),
    // 7: require('../assets/images/lessons/leash_walks/7.jpg'),
    // 8: require('../assets/images/lessons/leash_walks/8.jpg'),
    // 9: require('../assets/images/lessons/leash_walks/9.jpg'),
    // 10: require('../assets/images/lessons/leash_walks/10.jpg'),
    // 11: require('../assets/images/lessons/leash_walks/11.jpg'),
    // 12: require('../assets/images/lessons/leash_walks/12.jpg'),
    // 13: require('../assets/images/lessons/leash_walks/13.jpg'),
  },
  potty_training: {
    // 1: require('../assets/images/lessons/potty_training/1.jpg'),
    // 2: require('../assets/images/lessons/potty_training/2.jpg'),
    // 3: require('../assets/images/lessons/potty_training/3.jpg'),
    // 4: require('../assets/images/lessons/potty_training/4.jpg'),
    // 5: require('../assets/images/lessons/potty_training/5.jpg'),
    // 6: require('../assets/images/lessons/potty_training/6.jpg'),
    // 7: require('../assets/images/lessons/potty_training/7.jpg'),
    // 8: require('../assets/images/lessons/potty_training/8.jpg'),
    // 9: require('../assets/images/lessons/potty_training/9.jpg'),
    // 10: require('../assets/images/lessons/potty_training/10.jpg'),
  },
  biting_nipping: {
    // 1: require('../assets/images/lessons/biting_nipping/1.jpg'),
    // 2: require('../assets/images/lessons/biting_nipping/2.jpg'),
    // 3: require('../assets/images/lessons/biting_nipping/3.jpg'),
    // 4: require('../assets/images/lessons/biting_nipping/4.jpg'),
    // 5: require('../assets/images/lessons/biting_nipping/5.jpg'),
    // 6: require('../assets/images/lessons/biting_nipping/6.jpg'),
    // 7: require('../assets/images/lessons/biting_nipping/7.jpg'),
    // 8: require('../assets/images/lessons/biting_nipping/8.jpg'),
    // 9: require('../assets/images/lessons/biting_nipping/9.jpg'),
    // 10: require('../assets/images/lessons/biting_nipping/10.jpg'),
  },
  calm_focus: {
    // 1: require('../assets/images/lessons/calm_focus/1.jpg'),
    // 2: require('../assets/images/lessons/calm_focus/2.jpg'),
    // 3: require('../assets/images/lessons/calm_focus/3.jpg'),
    // 4: require('../assets/images/lessons/calm_focus/4.jpg'),
    // 5: require('../assets/images/lessons/calm_focus/5.jpg'),
    // 6: require('../assets/images/lessons/calm_focus/6.jpg'),
    // 7: require('../assets/images/lessons/calm_focus/7.jpg'),
    // 8: require('../assets/images/lessons/calm_focus/8.jpg'),
    // 9: require('../assets/images/lessons/calm_focus/9.jpg'),
    // 10: require('../assets/images/lessons/calm_focus/10.jpg'),
    // 11: require('../assets/images/lessons/calm_focus/11.jpg'),
    // 12: require('../assets/images/lessons/calm_focus/12.jpg'),
    // 13: require('../assets/images/lessons/calm_focus/13.jpg'),
    // 14: require('../assets/images/lessons/calm_focus/14.jpg'),
    // 15: require('../assets/images/lessons/calm_focus/15.jpg'),
  },
  recall: {
    // 1: require('../assets/images/lessons/recall/1.jpg'),
    // 2: require('../assets/images/lessons/recall/2.jpg'),
    // 3: require('../assets/images/lessons/recall/3.jpg'),
    // 4: require('../assets/images/lessons/recall/4.jpg'),
    // 5: require('../assets/images/lessons/recall/5.jpg'),
    // 6: require('../assets/images/lessons/recall/6.jpg'),
    // 7: require('../assets/images/lessons/recall/7.jpg'),
    // 8: require('../assets/images/lessons/recall/8.jpg'),
    // 9: require('../assets/images/lessons/recall/9.jpg'),
    // 10: require('../assets/images/lessons/recall/10.jpg'),
  },
  socialization: {
    // 1: require('../assets/images/lessons/socialization/1.jpg'),
    // 2: require('../assets/images/lessons/socialization/2.jpg'),
    // 3: require('../assets/images/lessons/socialization/3.jpg'),
    // 4: require('../assets/images/lessons/socialization/4.jpg'),
    // 5: require('../assets/images/lessons/socialization/5.jpg'),
    // 6: require('../assets/images/lessons/socialization/6.jpg'),
    // 7: require('../assets/images/lessons/socialization/7.jpg'),
    // 8: require('../assets/images/lessons/socialization/8.jpg'),
    // 9: require('../assets/images/lessons/socialization/9.jpg'),
    // 10: require('../assets/images/lessons/socialization/10.jpg'),
    // 11: require('../assets/images/lessons/socialization/11.jpg'),
  },
  reactive_dog: {
    // 1: require('../assets/images/lessons/reactive_dog/1.jpg'),
    // 2: require('../assets/images/lessons/reactive_dog/2.jpg'),
    // 3: require('../assets/images/lessons/reactive_dog/3.jpg'),
    // 4: require('../assets/images/lessons/reactive_dog/4.jpg'),
    // 5: require('../assets/images/lessons/reactive_dog/5.jpg'),
    // 6: require('../assets/images/lessons/reactive_dog/6.jpg'),
    // 7: require('../assets/images/lessons/reactive_dog/7.jpg'),
    // 8: require('../assets/images/lessons/reactive_dog/8.jpg'),
    // 9: require('../assets/images/lessons/reactive_dog/9.jpg'),
    // 10: require('../assets/images/lessons/reactive_dog/10.jpg'),
  },
  mental_work: {
    // 1: require('../assets/images/lessons/mental_work/1.jpg'),
    // 2: require('../assets/images/lessons/mental_work/2.jpg'),
    // 3: require('../assets/images/lessons/mental_work/3.jpg'),
    // 4: require('../assets/images/lessons/mental_work/4.jpg'),
    // 5: require('../assets/images/lessons/mental_work/5.jpg'),
    // 6: require('../assets/images/lessons/mental_work/6.jpg'),
    // 7: require('../assets/images/lessons/mental_work/7.jpg'),
    // 8: require('../assets/images/lessons/mental_work/8.jpg'),
    // 9: require('../assets/images/lessons/mental_work/9.jpg'),
    // 10: require('../assets/images/lessons/mental_work/10.jpg'),
    // 11: require('../assets/images/lessons/mental_work/11.jpg'),
    // 12: require('../assets/images/lessons/mental_work/12.jpg'),
    // 13: require('../assets/images/lessons/mental_work/13.jpg'),
    // 14: require('../assets/images/lessons/mental_work/14.jpg'),
  },
  cooperative_care: {
    // 1: require('../assets/images/lessons/cooperative_care/1.jpg'),
    // 2: require('../assets/images/lessons/cooperative_care/2.jpg'),
    // 3: require('../assets/images/lessons/cooperative_care/3.jpg'),
    // 4: require('../assets/images/lessons/cooperative_care/4.jpg'),
    // 5: require('../assets/images/lessons/cooperative_care/5.jpg'),
    // 6: require('../assets/images/lessons/cooperative_care/6.jpg'),
    // 7: require('../assets/images/lessons/cooperative_care/7.jpg'),
    // 8: require('../assets/images/lessons/cooperative_care/8.jpg'),
    // 9: require('../assets/images/lessons/cooperative_care/9.jpg'),
  },
  barking_alert: {
    // 1: require('../assets/images/lessons/barking_alert/1.jpg'),
    // 2: require('../assets/images/lessons/barking_alert/2.jpg'),
    // 3: require('../assets/images/lessons/barking_alert/3.jpg'),
    // 4: require('../assets/images/lessons/barking_alert/4.jpg'),
    // 5: require('../assets/images/lessons/barking_alert/5.jpg'),
    // 6: require('../assets/images/lessons/barking_alert/6.jpg'),
    // 7: require('../assets/images/lessons/barking_alert/7.jpg'),
    // 8: require('../assets/images/lessons/barking_alert/8.jpg'),
    // 9: require('../assets/images/lessons/barking_alert/9.jpg'),
    // 10: require('../assets/images/lessons/barking_alert/10.jpg'),
  },
  real_world_proofing: {
    // 1: require('../assets/images/lessons/real_world_proofing/1.jpg'),
    // 2: require('../assets/images/lessons/real_world_proofing/2.jpg'),
    // 3: require('../assets/images/lessons/real_world_proofing/3.jpg'),
    // 4: require('../assets/images/lessons/real_world_proofing/4.jpg'),
    // 5: require('../assets/images/lessons/real_world_proofing/5.jpg'),
    // 6: require('../assets/images/lessons/real_world_proofing/6.jpg'),
    // 7: require('../assets/images/lessons/real_world_proofing/7.jpg'),
    // 8: require('../assets/images/lessons/real_world_proofing/8.jpg'),
  },
  tricks: {
    // 1: require('../assets/images/lessons/tricks/1.jpg'),
    // 2: require('../assets/images/lessons/tricks/2.jpg'),
    // 3: require('../assets/images/lessons/tricks/3.jpg'),
    // 4: require('../assets/images/lessons/tricks/4.jpg'),
    // 5: require('../assets/images/lessons/tricks/5.jpg'),
    // 6: require('../assets/images/lessons/tricks/6.jpg'),
    // 7: require('../assets/images/lessons/tricks/7.jpg'),
    // 8: require('../assets/images/lessons/tricks/8.jpg'),
    // 9: require('../assets/images/lessons/tricks/9.jpg'),
    // 10: require('../assets/images/lessons/tricks/10.jpg'),
    // 11: require('../assets/images/lessons/tricks/11.jpg'),
    // 12: require('../assets/images/lessons/tricks/12.jpg'),
    // 13: require('../assets/images/lessons/tricks/13.jpg'),
    // 14: require('../assets/images/lessons/tricks/14.jpg'),
    // 15: require('../assets/images/lessons/tricks/15.jpg'),
    // 16: require('../assets/images/lessons/tricks/16.jpg'),
    // 17: require('../assets/images/lessons/tricks/17.jpg'),
    // 18: require('../assets/images/lessons/tricks/18.jpg'),
    // 19: require('../assets/images/lessons/tricks/19.jpg'),
    // 20: require('../assets/images/lessons/tricks/20.jpg'),
    // 21: require('../assets/images/lessons/tricks/21.jpg'),
    // 22: require('../assets/images/lessons/tricks/22.jpg'),
    // 23: require('../assets/images/lessons/tricks/23.jpg'),
    // 24: require('../assets/images/lessons/tricks/24.jpg'),
    // 25: require('../assets/images/lessons/tricks/25.jpg'),
    // 26: require('../assets/images/lessons/tricks/26.jpg'),
    // 27: require('../assets/images/lessons/tricks/27.jpg'),
    // 28: require('../assets/images/lessons/tricks/28.jpg'),
  },
  handler_skills: {
    // 1: require('../assets/images/lessons/handler_skills/1.jpg'),
    // 2: require('../assets/images/lessons/handler_skills/2.jpg'),
    // 3: require('../assets/images/lessons/handler_skills/3.jpg'),
    // 4: require('../assets/images/lessons/handler_skills/4.jpg'),
    // 5: require('../assets/images/lessons/handler_skills/5.jpg'),
    // 6: require('../assets/images/lessons/handler_skills/6.jpg'),
    // 7: require('../assets/images/lessons/handler_skills/7.jpg'),
    // 8: require('../assets/images/lessons/handler_skills/8.jpg'),
    // 9: require('../assets/images/lessons/handler_skills/9.jpg'),
    // 10: require('../assets/images/lessons/handler_skills/10.jpg'),
    // 11: require('../assets/images/lessons/handler_skills/11.jpg'),
    // 12: require('../assets/images/lessons/handler_skills/12.jpg'),
    // 13: require('../assets/images/lessons/handler_skills/13.jpg'),
  },
  service_dog: {
    // 1: require('../assets/images/lessons/service_dog/1.jpg'),
    // 2: require('../assets/images/lessons/service_dog/2.jpg'),
    // 3: require('../assets/images/lessons/service_dog/3.jpg'),
    // 4: require('../assets/images/lessons/service_dog/4.jpg'),
    // 5: require('../assets/images/lessons/service_dog/5.jpg'),
    // 6: require('../assets/images/lessons/service_dog/6.jpg'),
    // 7: require('../assets/images/lessons/service_dog/7.jpg'),
    // 8: require('../assets/images/lessons/service_dog/8.jpg'),
    // 9: require('../assets/images/lessons/service_dog/9.jpg'),
  },
};

export function getCategoryImage(categoryId?: string | null): ImageSourcePropType | undefined {
  if (!categoryId) {
    return undefined;
  }

  return CATEGORY_IMAGES[categoryId];
}

export function getLessonImage(
  categoryId: string,
  lessonIdOrOrder?: string | number,
  lessonIndex?: number,
): ImageSourcePropType | undefined {
  const lessonOrder = getLessonOrder(lessonIdOrOrder, lessonIndex);
  const lessonImage = lessonOrder ? LESSON_IMAGES[categoryId]?.[lessonOrder] : undefined;

  return lessonImage ?? getCategoryImage(categoryId);
}

function getLessonOrder(lessonIdOrOrder?: string | number, lessonIndex?: number): number | undefined {
  if (typeof lessonIndex === 'number' && lessonIndex >= 0) {
    return lessonIndex + 1;
  }

  if (typeof lessonIdOrOrder === 'number' && lessonIdOrOrder > 0) {
    return lessonIdOrOrder;
  }

  if (typeof lessonIdOrOrder === 'string' && /^\d+$/.test(lessonIdOrOrder)) {
    return Number(lessonIdOrOrder);
  }

  return undefined;
}
