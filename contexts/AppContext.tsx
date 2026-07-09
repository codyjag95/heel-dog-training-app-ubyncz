/**
 * AppContext - Safe Initialization for Production
 * 
 * v1.1 CHANGES:
 * - Added breedId and q9Challenges to QuizProfile type
 * - generateProfile now accepts optional allAnswers parameter for Q9 fix
 * - getDayStreak implemented properly
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Alert, InteractionManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATEGORIES, Category } from '../data/categoryData';
import {
  registerForPushNotifications,
  scheduleSmartReminders,
  notificationsEnabled,
} from '../services/notifications';
import { supabase } from '../lib/supabase';
import { fullSync, pushLessonCompletion } from '../services/syncService';
import { logEvent } from '../services/analytics';
import type { Session } from '@supabase/supabase-js';
import { buildProfileFromAnswers } from '../data/quizData_v2';
import {
  initializeIAP,
  endIAP,
  getProducts,
  purchaseSubscription,
  restorePurchases as restoreIAP,
  setupPurchaseListener,
  checkActiveSubscription,
  HEELProduct,
  PurchaseResult,
} from '../services/iapService';

// ============================================================================
// TYPES
// ============================================================================

type QuizAnswer = {
  questionId: string;
  answerId: string;
  value?: string;
};

type QuizProfile = {
  dogName: string;
  breed: string;
  breedId: string;           // NEW: breed database ID for lookups
  energyLevel: number;
  experience: number;
  motivationType: 'food' | 'play' | 'praise' | 'mixed';
  availability: number;
  availabilityLabel: string;   // NEW: human-readable time label
  challenges: string[];
  q9Challenges: string[];    // NEW: urgent challenges from Q9
  q7Goal: string;            // NEW: primary goal from Q7
  ageLabel: string;          // NEW: human-readable age label
  experienceLabel: string;   // NEW: human-readable experience label
  recommendedCategories: string[];
};

type LessonProgress = {
  lessonId: string;
  categoryId: string;
  completed: boolean;
  completedAt?: string;
};

export type DogEntry = {
  id: string;
  name: string;
  breedLabel?: string;
  ageLabel?: string;
};

type AppContextType = {
  // Quiz state
  quizAnswers: QuizAnswer[];
  currentQuestionIndex: number;
  dogName: string;
  addQuizAnswer: (answer: QuizAnswer) => void;
  incrementQuestionIndex: () => void;
  setDogNameState: (name: string) => void;
  resetQuiz: () => void;
  isQuizComplete: boolean;
  
  // Profile
  userProfile: QuizProfile | null;
  generateProfile: (allAnswers?: QuizAnswer[]) => void;
  
  // Progress tracking
  lessonProgress: LessonProgress[];
  markLessonComplete: (categoryId: string, lessonId: string) => void;
  isLessonComplete: (categoryId: string, lessonId: string) => boolean;
  getCategoryProgress: (categoryId: string) => { completed: number; total: number };
  getOverallProgress: () => { completed: number; total: number };
  getDayStreak: () => number;

  // Retention
  streakFreezes: number;
  bonusUnlocks: string[];

  // Account / cloud sync
  session: Session | null;
  syncing: boolean;
  syncNow: () => Promise<void>;
  signOut: () => Promise<void>;

  // Multi-dog
  dogs: DogEntry[];
  activeDogId: string | null;
  addDog: (name: string) => Promise<void>;
  switchDog: (id: string) => Promise<void>;

  // Premium status
  hasPremium: boolean;
  setHasPremium: (status: boolean) => void;

  // IAP / Premium
  products: HEELProduct[];
  productsLoading: boolean;
  purchase: (productId: string) => Promise<PurchaseResult>;
  restore: () => Promise<PurchaseResult>;
  iapReady: boolean;
  
  // Loading & Error states
  isLoading: boolean;
  error: string | null;
};

// ============================================================================
// CONTEXT
// ============================================================================

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// ============================================================================
// STORAGE
// ============================================================================

const STORAGE_KEYS = {
  QUIZ_ANSWERS: '@heel_quiz_answers_v3',
  DOG_NAME: '@heel_dog_name_v3',
  USER_PROFILE: '@heel_user_profile_v3',
  LESSON_PROGRESS: '@heel_lesson_progress_v3',
  HAS_PREMIUM: '@heel_has_premium',
  STREAK_FREEZES: '@heel_streak_freezes',
  FREEZE_DATES: '@heel_freeze_dates',
  BONUS_UNLOCKS: '@heel_bonus_unlocks',
  LAST_AWARD_STREAK: '@heel_last_award_streak',
  DOGS_REGISTRY: '@heel_dogs_registry',
  ACTIVE_DOG: '@heel_active_dog_id',
};

// Per-dog data bundle key ("live" keys above always hold the ACTIVE dog)
const dogBundleKey = (dogId: string) => `@heel_dogdata_${dogId}`;

const safeGetItem = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (err) {
    console.log(`Error reading ${key}:`, err);
    return null;
  }
};

const safeSetItem = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    console.log(`Error saving ${key}:`, err);
  }
};

// Local calendar-day key, e.g. "2026-07-03"
const toDayKey = (d: Date): string => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
};

// Streak from progress + freeze dates. A freeze date counts as a trained
// day, which is how a banked Streak Freeze "fills" a missed day.
const computeDayStreak = (progress: LessonProgress[], freezeDates: string[] = []): number => {
  const days = new Set<string>(freezeDates);
  progress.filter(p => p.completedAt).forEach(p => days.add(toDayKey(new Date(p.completedAt!))));
  if (days.size === 0) return 0;

  const cursor = new Date();
  // Streak counts from today, or from yesterday if today's session hasn't happened yet
  if (!days.has(toDayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(toDayKey(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(toDayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

// Next premium lesson to gift at a streak milestone: recommended categories
// first, then everything else. Skips completed and already-gifted lessons.
const findNextLockedLesson = (
  profile: QuizProfile | null,
  progress: LessonProgress[],
  bonusUnlocks: string[]
): { categoryId: string; lessonId: string; title: string } | null => {
  const orderedIds = [
    ...(profile?.recommendedCategories || []),
    ...CATEGORIES.map(c => c.id),
  ];
  const seen = new Set<string>();
  for (const catId of orderedIds) {
    if (seen.has(catId)) continue;
    seen.add(catId);
    const category = CATEGORIES.find(c => c.id === catId);
    if (!category) continue;
    for (const lesson of category.lessons) {
      const isPremiumLesson = category.isPremium
        ? lesson.isPremium !== false
        : lesson.isPremium === true;
      if (!isPremiumLesson) continue;
      if (bonusUnlocks.includes(`${category.id}:${lesson.id}`)) continue;
      if (progress.some(p => p.categoryId === category.id && p.lessonId === lesson.id)) continue;
      return { categoryId: category.id, lessonId: lesson.id, title: lesson.title };
    }
  }
  return null;
};

// ============================================================================
// PROVIDER
// ============================================================================

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [dogName, setDogName] = useState('');
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  
  const [userProfile, setUserProfile] = useState<QuizProfile | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  
  const [hasPremium, setHasPremiumState] = useState(false);

  // Account / sync state
  const [session, setSession] = useState<Session | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Multi-dog state
  const [dogs, setDogs] = useState<DogEntry[]>([]);
  const [activeDogId, setActiveDogId] = useState<string | null>(null);

  // Streak-freeze / milestone-unlock state
  const [streakFreezes, setStreakFreezes] = useState(0);
  const [freezeDates, setFreezeDates] = useState<string[]>([]);
  const [bonusUnlocks, setBonusUnlocks] = useState<string[]>([]);
  const [lastAwardStreak, setLastAwardStreak] = useState(0);

  // IAP state
  const [products, setProducts] = useState<HEELProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [iapReady, setIapReady] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    let isMounted = true;
    
    const initializeApp = async () => {
      await new Promise<void>((resolve) => {
        InteractionManager.runAfterInteractions(() => {
          resolve();
        });
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!isMounted) return;

      try {
        const [
          savedAnswers,
          savedDogName,
          savedProfile,
          savedProgress,
          savedPremium
        ] = await Promise.all([
          safeGetItem(STORAGE_KEYS.QUIZ_ANSWERS),
          safeGetItem(STORAGE_KEYS.DOG_NAME),
          safeGetItem(STORAGE_KEYS.USER_PROFILE),
          safeGetItem(STORAGE_KEYS.LESSON_PROGRESS),
          safeGetItem(STORAGE_KEYS.HAS_PREMIUM),
        ]);

        if (!isMounted) return;

        if (savedAnswers) {
          try { setQuizAnswers(JSON.parse(savedAnswers)); } catch (e) { console.log('Error parsing quiz answers:', e); }
        }

        if (savedDogName) {
          setDogName(savedDogName);
        }

        if (savedProfile) {
          try {
            setUserProfile(JSON.parse(savedProfile));
            setIsQuizComplete(true);
          } catch (e) { console.log('Error parsing profile:', e); }
        }

        if (savedProgress) {
          try { setLessonProgress(JSON.parse(savedProgress)); } catch (e) { console.log('Error parsing progress:', e); }
        }

        // Load streak-freeze / bonus-unlock state
        let loadedFreezes = 0;
        let loadedFreezeDates: string[] = [];
        try {
          const [fz, fd, bu, las] = await Promise.all([
            safeGetItem(STORAGE_KEYS.STREAK_FREEZES),
            safeGetItem(STORAGE_KEYS.FREEZE_DATES),
            safeGetItem(STORAGE_KEYS.BONUS_UNLOCKS),
            safeGetItem(STORAGE_KEYS.LAST_AWARD_STREAK),
          ]);
          loadedFreezes = fz ? parseInt(fz, 10) || 0 : 0;
          loadedFreezeDates = fd ? JSON.parse(fd) : [];
          if (bu) setBonusUnlocks(JSON.parse(bu));
          if (las) setLastAwardStreak(parseInt(las, 10) || 0);

          // AUTO-CONSUME: yesterday broke the chain + a freeze is banked
          // → spend it silently, streak survives.
          if (savedProgress && loadedFreezes > 0) {
            const prog: LessonProgress[] = JSON.parse(savedProgress);
            const days = new Set<string>(loadedFreezeDates);
            prog.filter(p => p.completedAt).forEach(p => days.add(toDayKey(new Date(p.completedAt!))));
            const yday = new Date(); yday.setDate(yday.getDate() - 1);
            const dayBefore = new Date(); dayBefore.setDate(dayBefore.getDate() - 2);
            if (!days.has(toDayKey(yday)) && days.has(toDayKey(dayBefore))) {
              loadedFreezes -= 1;
              loadedFreezeDates = [...loadedFreezeDates, toDayKey(yday)];
              await safeSetItem(STORAGE_KEYS.STREAK_FREEZES, String(loadedFreezes));
              await safeSetItem(STORAGE_KEYS.FREEZE_DATES, JSON.stringify(loadedFreezeDates));
            }
          }
        } catch (e) { console.log('Error loading streak extras:', e); }
        if (isMounted) {
          setStreakFreezes(loadedFreezes);
          setFreezeDates(loadedFreezeDates);
        }

        // Multi-dog registry (migration-safe): an existing single-dog user's
        // current data becomes dog #1 with ZERO data movement. If anything
        // here fails, the app behaves exactly as before.
        try {
          const [regRaw, activeRaw] = await Promise.all([
            safeGetItem(STORAGE_KEYS.DOGS_REGISTRY),
            safeGetItem(STORAGE_KEYS.ACTIVE_DOG),
          ]);
          let reg: DogEntry[] = regRaw ? JSON.parse(regRaw) : [];
          let active: string | null = activeRaw;

          if (reg.length === 0 && savedProfile) {
            const prof = JSON.parse(savedProfile);
            const firstDog: DogEntry = {
              id: `dog_${Date.now()}`,
              name: prof?.dogName || 'My Dog',
              breedLabel: prof?.breed || undefined,
              ageLabel: prof?.ageLabel || undefined,
            };
            reg = [firstDog];
            active = firstDog.id;
            await safeSetItem(STORAGE_KEYS.DOGS_REGISTRY, JSON.stringify(reg));
            await safeSetItem(STORAGE_KEYS.ACTIVE_DOG, active);
          }
          if (reg.length > 0 && (!active || !reg.some(d => d.id === active))) {
            console.warn('[Dogs] activeDogId missing or stale, defaulting to first dog');
            active = reg[0].id;
            await safeSetItem(STORAGE_KEYS.ACTIVE_DOG, active);
          }
          if (isMounted) {
            setDogs(reg);
            setActiveDogId(active || null);
          }
        } catch (e) {
          console.log('Error loading dog registry:', e);
        }

        // Refresh local reminders from last known state (never prompts)
        if (savedProgress && savedProfile) {
          try {
            const prog = JSON.parse(savedProgress);
            const prof = JSON.parse(savedProfile);
            notificationsEnabled().then(ok => {
              if (ok) scheduleSmartReminders(prof?.dogName || 'your dog', computeDayStreak(prog, loadedFreezeDates));
            }).catch(() => {});
          } catch {}
        }

        if (savedPremium) {
          try {
            const isPremium = JSON.parse(savedPremium);
            if (isPremium) {
              // Check if test unlock has expired (30 days)
              const unlockType = await safeGetItem('@heel_unlock_type');
              const isBetaTester = await safeGetItem('@heel_beta_tester');
              if (isBetaTester === 'true' && unlockType === 'test') {
                const unlockDate = await safeGetItem('@heel_test_unlock_date');
                if (unlockDate) {
                  const daysSinceUnlock = (Date.now() - new Date(unlockDate).getTime()) / (1000 * 60 * 60 * 24);
                  if (daysSinceUnlock > 30) {
                    // Test code expired
                    await AsyncStorage.setItem('@heel_has_premium', 'false');
                    await AsyncStorage.removeItem('@heel_beta_tester');
                    await AsyncStorage.removeItem('@heel_unlock_type');
                    await AsyncStorage.removeItem('@heel_test_unlock_date');
                    setHasPremiumState(false);
                  } else {
                    setHasPremiumState(true);
                  }
                } else {
                  setHasPremiumState(true);
                }
              } else {
                setHasPremiumState(true);
              }
            }
          } catch (e) {
            setHasPremiumState(savedPremium === 'true');
          }
        }

      } catch (err) {
        console.error('Error initializing app:', err);
        if (isMounted) setError('Failed to load app data');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeApp();
    return () => { isMounted = false; };
  }, []);

  // ============================================================================
  // IAP INITIALIZATION
  // ============================================================================

  useEffect(() => {
    let cleanupListener: (() => void) | null = null;
    let isMounted = true;

    const setupIAP = async () => {
      try {
        const connected = await initializeIAP();
        if (!isMounted) return;

        setIapReady(connected);

        if (connected) {
          const fetchedProducts = await getProducts();
          if (isMounted) {
            setProducts(fetchedProducts);
            setProductsLoading(false);
          }

          cleanupListener = setupPurchaseListener(
            async (purchase) => {
              if (isMounted) {
                setHasPremiumState(true);
                await safeSetItem('@heel_has_premium', 'true');
              }
            },
            (error: string) => {
              console.error('AppContext: Purchase listener error:', error);
            }
          );

          // ── ZOMBIE-PREMIUM FIX ──
          // Premium from a real purchase (not a beta/test code) gets
          // re-checked with Apple on every launch. Cancelled = revoked.
          // On network errors we do nothing, never punish offline users.
          try {
            const savedPremium = await safeGetItem(STORAGE_KEYS.HAS_PREMIUM);
            const isBeta = await safeGetItem('@heel_beta_tester');
            if (savedPremium === 'true' && isBeta !== 'true') {
              const check = await checkActiveSubscription();
              if (isMounted && !check.active && !check.error) {
                console.log('[IAP] No active subscription on launch, revoking premium');
                setHasPremiumState(false);
                await safeSetItem(STORAGE_KEYS.HAS_PREMIUM, 'false');
              }
            }
          } catch (e) {
            console.log('[IAP] Launch revalidation skipped:', e);
          }
        } else {
          if (isMounted) setProductsLoading(false);
        }
      } catch (err) {
        console.error('IAP setup error:', err);
        if (isMounted) {
          setIapReady(false);
          setProductsLoading(false);
        }
      }
    };

    setupIAP();

    return () => {
      isMounted = false;
      cleanupListener?.();
      endIAP();
    };
  }, []);

  // ============================================================================
  // AUTH + CLOUD SYNC
  // ============================================================================

  const syncNow = useCallback(async () => {
    try {
      setSyncing(true);
      const result = await fullSync(userProfile, lessonProgress);
      if (result) {
        // Union merge: cloud may know lessons this phone doesn't
        if (result.mergedProgress.length > lessonProgress.length) {
          setLessonProgress(result.mergedProgress);
          await safeSetItem(STORAGE_KEYS.LESSON_PROGRESS, JSON.stringify(result.mergedProgress));
        }
        // Cloud entitlement (promo/beta/shelter codes) can grant premium
        if (result.premiumFromCloud && !hasPremium) {
          setHasPremiumState(true);
          await safeSetItem(STORAGE_KEYS.HAS_PREMIUM, 'true');
        }
      }
    } catch (e) {
      console.log('[Sync] syncNow error:', e);
    } finally {
      setSyncing(false);
    }
  }, [userProfile, lessonProgress, hasPremium]);

  // Keep a live reference so the auth listener never calls a stale sync
  const syncNowRef = useRef(syncNow);
  useEffect(() => { syncNowRef.current = syncNow; }, [syncNow]);

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data }) => setSession(data.session ?? null))
      .catch(() => {});
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
      if (s) syncNowRef.current().catch(() => {});
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.removeItem('@heel_dog_id');
    } catch (e) {
      console.log('[Sync] signOut error:', e);
    }
  }, []);

  // ============================================================================
  // MULTI-DOG
  // The live keys (USER_PROFILE, LESSON_PROGRESS, streak keys) always hold
  // the ACTIVE dog's data. Switching saves the live bundle to the outgoing
  // dog's slot and loads the incoming dog's slot into the live keys, so no
  // other screen or function needs to change.
  // ============================================================================

  const snapshotCurrentDog = useCallback(async (dogId: string) => {
    const bundle = {
      profile: userProfile,
      progress: lessonProgress,
      freezeDates,
      streakFreezes,
      lastAwardStreak,
      bonusUnlocks,
    };
    await safeSetItem(dogBundleKey(dogId), JSON.stringify(bundle));
  }, [userProfile, lessonProgress, freezeDates, streakFreezes, lastAwardStreak, bonusUnlocks]);

  const loadDogIntoLive = useCallback(async (dogId: string) => {
    let b: any = {};
    try {
      const raw = await safeGetItem(dogBundleKey(dogId));
      b = raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn('[Dogs] Could not parse bundle for', dogId, '- starting clean');
    }
    const prof = b.profile ?? null;
    const prog: LessonProgress[] = b.progress ?? [];
    setUserProfile(prof);
    setIsQuizComplete(!!prof);
    setLessonProgress(prog);
    setFreezeDates(b.freezeDates ?? []);
    setStreakFreezes(b.streakFreezes ?? 0);
    setLastAwardStreak(b.lastAwardStreak ?? 0);
    setBonusUnlocks(b.bonusUnlocks ?? []);
    setDogName(prof?.dogName || '');
    // Mirror into live keys so a restart lands on the same dog
    if (prof) {
      await safeSetItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(prof));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE).catch(() => {});
    }
    await safeSetItem(STORAGE_KEYS.LESSON_PROGRESS, JSON.stringify(prog));
    await safeSetItem(STORAGE_KEYS.FREEZE_DATES, JSON.stringify(b.freezeDates ?? []));
    await safeSetItem(STORAGE_KEYS.STREAK_FREEZES, String(b.streakFreezes ?? 0));
    await safeSetItem(STORAGE_KEYS.LAST_AWARD_STREAK, String(b.lastAwardStreak ?? 0));
    await safeSetItem(STORAGE_KEYS.BONUS_UNLOCKS, JSON.stringify(b.bonusUnlocks ?? []));
  }, []);

  const switchDog = useCallback(async (dogId: string) => {
    if (dogId === activeDogId) return;
    if (!dogs.some(d => d.id === dogId)) {
      console.warn('[Dogs] switchDog called with unknown id:', dogId);
      return;
    }
    if (activeDogId) await snapshotCurrentDog(activeDogId);
    await loadDogIntoLive(dogId);
    setActiveDogId(dogId);
    await safeSetItem(STORAGE_KEYS.ACTIVE_DOG, dogId);
    // Forget the cached cloud dog id; the next sync finds/creates by name
    await AsyncStorage.removeItem('@heel_dog_id').catch(() => {});
    if (session) syncNowRef.current().catch(() => {});
    logEvent('dog_switched', {});
  }, [activeDogId, dogs, snapshotCurrentDog, loadDogIntoLive, session]);

  const addDog = useCallback(async (name: string) => {
    const clean = (name || '').trim();
    if (!clean) return;
    // Multi-dog is a Premium feature (UI gates this too; this is the backstop)
    if (!hasPremium && dogs.length >= 1) {
      console.warn('[Dogs] addDog blocked: premium required for multiple dogs');
      return;
    }
    if (dogs.length >= 5) {
      console.warn('[Dogs] addDog blocked: max 5 dogs per account');
      return;
    }
    if (activeDogId) await snapshotCurrentDog(activeDogId);

    const newDog: DogEntry = { id: `dog_${Date.now()}`, name: clean };
    const newDogs = [...dogs, newDog];
    setDogs(newDogs);
    await safeSetItem(STORAGE_KEYS.DOGS_REGISTRY, JSON.stringify(newDogs));

    // Clean slate for the new dog (empty bundle loads as defaults)
    await loadDogIntoLive(newDog.id);
    setDogName(clean);
    await safeSetItem(STORAGE_KEYS.DOG_NAME, clean);
    setQuizAnswers([]);
    setCurrentQuestionIndex(0);
    await AsyncStorage.multiRemove([STORAGE_KEYS.QUIZ_ANSWERS]).catch(() => {});

    setActiveDogId(newDog.id);
    await safeSetItem(STORAGE_KEYS.ACTIVE_DOG, newDog.id);
    await AsyncStorage.removeItem('@heel_dog_id').catch(() => {});
    logEvent('dog_added', {});
  }, [dogs, activeDogId, hasPremium, snapshotCurrentDog, loadDogIntoLive]);

  // ============================================================================
  // QUIZ ACTIONS
  // ============================================================================

  const addQuizAnswer = useCallback((answer: QuizAnswer) => {
    setQuizAnswers(prev => {
      const newAnswers = [...prev, answer];
      safeSetItem(STORAGE_KEYS.QUIZ_ANSWERS, JSON.stringify(newAnswers));
      return newAnswers;
    });
  }, []);

  const incrementQuestionIndex = useCallback(() => {
    setCurrentQuestionIndex(prev => prev + 1);
  }, []);

  const setDogNameState = useCallback((name: string) => {
    setDogName(name);
    safeSetItem(STORAGE_KEYS.DOG_NAME, name);
  }, []);

  const resetQuiz = useCallback(() => {
    setQuizAnswers([]);
    setCurrentQuestionIndex(0);
    setDogName('');
    setIsQuizComplete(false);
    setUserProfile(null);

    AsyncStorage.multiRemove([
      STORAGE_KEYS.QUIZ_ANSWERS,
      STORAGE_KEYS.DOG_NAME,
      STORAGE_KEYS.USER_PROFILE,
    ]).catch(err => console.log('Error clearing quiz data:', err));
  }, []);

  // ============================================================================
  // PROFILE GENERATION
  // ============================================================================

  const generateProfile = useCallback((allAnswers?: QuizAnswer[]) => {
    try {
      const answersToUse = allAnswers || quizAnswers;
      const profile = buildProfileFromAnswers(answersToUse, dogName, allAnswers);
      setUserProfile(profile);
      setIsQuizComplete(true);
      safeSetItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
      logEvent('quiz_completed', { breed: profile?.breedId || null });

      // Keep the dog registry entry in step with the fresh quiz profile
      if (activeDogId) {
        setDogs(prev => {
          const updated = prev.map(d => d.id === activeDogId
            ? { ...d, name: profile?.dogName || d.name, breedLabel: profile?.breed || d.breedLabel, ageLabel: profile?.ageLabel || d.ageLabel }
            : d);
          safeSetItem(STORAGE_KEYS.DOGS_REGISTRY, JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error('Error generating profile:', err);
      setError('Failed to generate profile');
    }
  }, [quizAnswers, dogName, activeDogId]);

  // ============================================================================
  // LESSON PROGRESS
  // ============================================================================

  const markLessonComplete = useCallback((categoryId: string, lessonId: string) => {
    if (lessonProgress.some(p => p.categoryId === categoryId && p.lessonId === lessonId)) {
      return;
    }

    const newProgress = [...lessonProgress, {
      lessonId,
      categoryId,
      completed: true,
      completedAt: new Date().toISOString(),
    }];

    setLessonProgress(newProgress);
    AsyncStorage.setItem(STORAGE_KEYS.LESSON_PROGRESS, JSON.stringify(newProgress))
      .catch(err => console.log('Error saving progress:', err));

    // Mirror to the cloud in the background (no-op when signed out)
    pushLessonCompletion(categoryId, lessonId).catch(() => {});
    logEvent('lesson_completed', { categoryId, lessonId });

    const dogLabel = userProfile?.dogName || 'your dog';

    // Retention: first-ever completion triggers the permission ask
    // (contextual moment, they just had a win). Every completion after
    // pushes the streak-saver another ~30h out.
    try {
      registerForPushNotifications()
        .then(granted => {
          if (granted) scheduleSmartReminders(dogLabel, computeDayStreak(newProgress, freezeDates));
        })
        .catch(() => {});
    } catch {}

    // ── STREAK MILESTONES: every 7 consecutive days ──
    // Earn a Streak Freeze (max 2 banked). Free users ALSO permanently
    // unlock one premium lesson, a taste of the paid product delivered
    // at their most-engaged moment.
    const newStreak = computeDayStreak(newProgress, freezeDates);
    if (newStreak > 0 && newStreak % 7 === 0 && newStreak > lastAwardStreak) {
      setLastAwardStreak(newStreak);
      safeSetItem(STORAGE_KEYS.LAST_AWARD_STREAK, String(newStreak));

      const newFreezes = Math.min(streakFreezes + 1, 2);
      setStreakFreezes(newFreezes);
      safeSetItem(STORAGE_KEYS.STREAK_FREEZES, String(newFreezes));

      let unlockedTitle: string | null = null;
      if (!hasPremium) {
        const grant = findNextLockedLesson(userProfile, newProgress, bonusUnlocks);
        if (grant) {
          const newUnlocks = [...bonusUnlocks, `${grant.categoryId}:${grant.lessonId}`];
          setBonusUnlocks(newUnlocks);
          safeSetItem(STORAGE_KEYS.BONUS_UNLOCKS, JSON.stringify(newUnlocks));
          unlockedTitle = grant.title;
        }
      }

      setTimeout(() => {
        Alert.alert(
          `${newStreak}-Day Streak!`,
          unlockedTitle
            ? `You earned a Streak Freeze. It auto-saves your streak if you miss a day.\n\nBonus: "${unlockedTitle}" is a Premium lesson, and it's now unlocked for ${dogLabel}. Free. Forever.`
            : 'You earned a Streak Freeze. It auto-saves your streak if you miss a day. (Max 2 banked.)',
          [{ text: unlockedTitle ? "Let's Go!" : 'Nice!' }]
        );
      }, 800);
    }
  }, [lessonProgress, userProfile, hasPremium, freezeDates, streakFreezes, bonusUnlocks, lastAwardStreak]);

  const isLessonComplete = useCallback((categoryId: string, lessonId: string): boolean => {
    return lessonProgress.some(
      p => p.categoryId === categoryId && p.lessonId === lessonId && p.completed
    );
  }, [lessonProgress]);

  const getCategoryProgress = useCallback((categoryId: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (!category) return { completed: 0, total: 0 };

    const completed = lessonProgress.filter(
      p => p.categoryId === categoryId && p.completed
    ).length;

    return { completed, total: category.totalLessons };
  }, [lessonProgress]);

  const getOverallProgress = useCallback(() => {
    const total = CATEGORIES.reduce((sum, cat) => sum + cat.totalLessons, 0);
    const completed = lessonProgress.filter(p => p.completed).length;
    return { completed, total };
  }, [lessonProgress]);

  const getDayStreak = useCallback((): number => {
    return computeDayStreak(lessonProgress, freezeDates);
  }, [lessonProgress, freezeDates]);

  // ============================================================================
  // PREMIUM
  // ============================================================================

  const setHasPremium = useCallback((status: boolean) => {
    setHasPremiumState(status);
    safeSetItem(STORAGE_KEYS.HAS_PREMIUM, JSON.stringify(status));
  }, []);

  // ============================================================================
  // IAP ACTIONS
  // ============================================================================

  const purchase = useCallback(async (productId: string): Promise<PurchaseResult> => {
    try {
      const result = await purchaseSubscription(productId);

      if (result.success) {
        setHasPremium(true);
        try {
          await AsyncStorage.setItem('@heel_has_premium', 'true');
          await AsyncStorage.setItem('@heel_subscription_product', productId);
        } catch (e) {
          console.error('Error saving premium status:', e);
        }
      }

      return result;
    } catch (err: any) {
      console.error('AppContext purchase error:', err);
      return { success: false, error: err?.message || 'Something went wrong. Please try again.' };
    }
  }, [setHasPremium]);

  const restore = useCallback(async (): Promise<PurchaseResult> => {
    try {
      const result = await restoreIAP();

      if (result.success) {
        setHasPremium(true);
        try {
          await AsyncStorage.setItem('@heel_has_premium', 'true');
          if (result.productId) {
            await AsyncStorage.setItem('@heel_subscription_product', result.productId);
          }
        } catch (e) {
          console.error('Error saving premium status:', e);
        }
      }

      return result;
    } catch (err: any) {
      console.error('AppContext restore error:', err);
      return { success: false, error: err?.message || 'Could not restore purchases.' };
    }
  }, [setHasPremium]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: AppContextType = {
    quizAnswers,
    currentQuestionIndex,
    dogName,
    addQuizAnswer,
    incrementQuestionIndex,
    setDogNameState,
    resetQuiz,
    isQuizComplete,
    userProfile,
    generateProfile,
    lessonProgress,
    markLessonComplete,
    isLessonComplete,
    getCategoryProgress,
    getOverallProgress,
    getDayStreak,
    streakFreezes,
    bonusUnlocks,
    session,
    syncing,
    syncNow,
    signOut,
    dogs,
    activeDogId,
    addDog,
    switchDog,
    hasPremium,
    setHasPremium,
    products,
    productsLoading,
    purchase,
    restore,
    iapReady,
    isLoading,
    error,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};