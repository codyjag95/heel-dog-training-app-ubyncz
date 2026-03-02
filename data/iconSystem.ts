/**
 * HEEL Icon System
 * 
 * Uses Ionicons (built into Expo)
 * Provides consistent icon mappings across the app
 * 
 * Category icons use paw/training themed icons
 */

import { Ionicons } from '@expo/vector-icons';

// Category icon mappings - dog training themed
export const CATEGORY_ICONS: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  'everyday_obedience': 'paw',              // Foundation - the brand icon
  'leash_walks': 'walk',                     // Walking/leash
  'calm_focus': 'heart',                     // Calm/wellness
  'recall': 'megaphone',                     // Calling dog back
  'mental_work': 'bulb',                     // Brain/mental
  'real_world_proofing': 'earth',            // Real world
  'service_dog': 'ribbon',                   // Service/achievement
  'potty_training': 'home',                  // House training
  'biting_nipping': 'alert-circle',          // Warning/correction
  'handler_skills': 'person',               // Human handler
};

// Tab bar icon mappings
export const TAB_ICONS = {
  home: 'home',
  training: 'book',
  premium: 'paw',       // Changed from star to paw (gold paw = premium)
  profile: 'person',
} as const;

// Premium/lock icons
export const PREMIUM_ICONS = {
  lock: 'lock-closed',
  unlock: 'lock-open',
  premium: 'paw',        // Gold paw for premium
  checkmark: 'checkmark-circle',
} as const;

// Action icons
export const ACTION_ICONS = {
  play: 'play-circle',
  complete: 'checkmark-circle',
  next: 'arrow-forward',
  back: 'arrow-back',
  close: 'close',
  settings: 'settings',
  info: 'information-circle',
  refresh: 'refresh',
  timer: 'timer',
  flame: 'flame',
  flag: 'flag',
} as const;

// Export Ionicons for use in components
export { Ionicons };
