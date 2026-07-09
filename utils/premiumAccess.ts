/**
 * ONE place that decides if a lesson is locked.
 * Every screen imports this — no more per-screen lock logic drifting apart.
 *
 * bonusUnlocks: lessons earned free via streak milestones, stored as
 * "categoryId:lessonId" strings (see AppContext).
 */
import { CATEGORIES } from '../data/categoryData';

export function unlockKey(categoryId: string, lessonId: string): string {
  return `${categoryId}:${lessonId}`;
}

export function isLessonLocked(
  categoryId: string,
  lessonId: string,
  hasPremium: boolean,
  bonusUnlocks: string[] = []
): boolean {
  if (hasPremium) return false;
  if (bonusUnlocks.includes(unlockKey(categoryId, lessonId))) return false;
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return false;
  const lesson = category.lessons.find((l) => l.id === lessonId);
  if (!lesson) return false;
  // Same rule the category list has always used — now enforced everywhere:
  if (category.isPremium) return lesson.isPremium !== false;
  return lesson.isPremium === true;
}
