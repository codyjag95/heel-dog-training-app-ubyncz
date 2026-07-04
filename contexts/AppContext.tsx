/**
 * AppContext - Safe Initialization for Production
 * 
 * v1.1 CHANGES:
 * - Added breedId and q9Challenges to QuizProfile type
 * - generateProfile now accepts optional allAnswers parameter for Q9 fix
 * - getDayStreak implemented properly
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { InteractionManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATEGORIES, Category } from '../data/categoryData';
import { buildProfileFromAnswers } from '../data/quizData_v2';
import {
  initializeIAP,
  endIAP,
  getProducts,
  purchaseSubscription,
  restorePurchases as restoreIAP,
  setupPurchaseListener,
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
};

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
  // Now accepts optional allAnswers for the Q9 timing fix
  // ============================================================================

  const generateProfile = useCallback((allAnswers?: QuizAnswer[]) => {
    try {
      const answersToUse = allAnswers || quizAnswers;
      const profile = buildProfileFromAnswers(answersToUse, dogName, allAnswers);
      setUserProfile(profile);
      setIsQuizComplete(true);
      safeSetItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (err) {
      console.error('Error generating profile:', err);
      setError('Failed to generate profile');
    }
  }, [quizAnswers, dogName]);

  // ============================================================================
  // LESSON PROGRESS
  // ============================================================================

  const markLessonComplete = useCallback((categoryId: string, lessonId: string) => {
    setLessonProgress(prev => {
      if (prev.some(p => p.categoryId === categoryId && p.lessonId === lessonId)) {
        return prev;
      }
      
      const newProgress = [...prev, {
        lessonId,
        categoryId,
        completed: true,
        completedAt: new Date().toISOString(),
      }];
      
      AsyncStorage.setItem(STORAGE_KEYS.LESSON_PROGRESS, JSON.stringify(newProgress))
        .catch(err => console.log('Error saving progress:', err));
      
      return newProgress;
    });
  }, []);

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
    if (lessonProgress.length === 0) return 0;
    
    const sorted = [...lessonProgress]
      .filter(p => p.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
    
    if (sorted.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sorted.length; i++) {
      const lessonDate = new Date(sorted[i].completedAt!);
      lessonDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - lessonDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }
    
    return streak;
  }, [lessonProgress]);

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
