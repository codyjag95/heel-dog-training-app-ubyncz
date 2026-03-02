/**
 * AppContext - Safe Initialization for Production
 * 
 * Includes InteractionManager.runAfterInteractions to delay AsyncStorage reads
 * Prevents crashes when native modules aren't ready on cold launch
 * 
 * IAP (In-App Purchase) support added for premium subscriptions
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
  energyLevel: number;
  experience: number;
  motivationType: 'food' | 'play' | 'praise' | 'mixed';
  availability: number;
  challenges: string[];
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
  generateProfile: () => void;
  
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
  // INITIALIZATION - Safe loading with InteractionManager
  // ============================================================================

  useEffect(() => {
    let isMounted = true;
    
    const initializeApp = async () => {
      // Wait for interactions to complete and native modules to be ready
      await new Promise<void>((resolve) => {
        InteractionManager.runAfterInteractions(() => {
          resolve();
        });
      });
      
      // Additional small delay to ensure native modules are fully initialized
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
          try {
            setQuizAnswers(JSON.parse(savedAnswers));
          } catch (e) {
            console.log('Error parsing quiz answers:', e);
          }
        }

        if (savedDogName) {
          setDogName(savedDogName);
        }

        if (savedProfile) {
          try {
            setUserProfile(JSON.parse(savedProfile));
            setIsQuizComplete(true);
          } catch (e) {
            console.log('Error parsing profile:', e);
          }
        }

        if (savedProgress) {
          try {
            setLessonProgress(JSON.parse(savedProgress));
          } catch (e) {
            console.log('Error parsing progress:', e);
          }
        }

        if (savedPremium) {
          try {
            setHasPremiumState(JSON.parse(savedPremium));
          } catch (e) {
            // Handle both boolean and string "true"
            setHasPremiumState(savedPremium === 'true');
          }
        }

      } catch (err) {
        console.error('Error initializing app:', err);
        if (isMounted) {
          setError('Failed to load app data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeApp();
    
    return () => {
      isMounted = false;
    };
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
          // Fetch products (real prices from Apple)
          setProductsLoading(true);
          const fetchedProducts = await getProducts();
          if (!isMounted) return;
          setProducts(fetchedProducts);
          setProductsLoading(false);

          // Listen for purchase updates (handles the actual purchase confirmation)
          cleanupListener = setupPurchaseListener(
            // On success — this is where purchases get confirmed in v12+
            async (productId: string) => {
              console.log('AppContext: Purchase listener success for', productId);
              if (!isMounted) return;
              setHasPremiumState(true);
              try {
                await AsyncStorage.setItem('@heel_has_premium', 'true');
                await AsyncStorage.setItem('@heel_subscription_product', productId);
              } catch (e) {
                console.error('Error saving premium status:', e);
              }
            },
            // On error
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
  // ============================================================================

  const generateProfile = useCallback(() => {
    try {
      const profile = buildProfileFromAnswers(quizAnswers, dogName);
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
    
    return {
      completed,
      total: category.totalLessons
    };
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

  /**
   * Purchase a subscription.
   * 
   * In react-native-iap v12+, requestSubscription returns void and
   * the actual confirmation comes through purchaseUpdatedListener above.
   * We handle both flows:
   *   - Direct return (older versions) → set premium here
   *   - 'pending' return (v12+) → listener sets premium automatically
   */
  const purchase = useCallback(async (productId: string): Promise<PurchaseResult> => {
    try {
      const result = await purchaseSubscription(productId);

      // Direct success (older react-native-iap versions)
      if (result.success) {
        setHasPremium(true);
        try {
          await AsyncStorage.setItem('@heel_has_premium', 'true');
          await AsyncStorage.setItem('@heel_subscription_product', productId);
        } catch (e) {
          console.error('Error saving premium status:', e);
        }
      }

      // 'pending' means payment sheet was shown and listener will handle it
      // 'cancelled' means user dismissed — both are fine, not errors

      return result;
    } catch (err: any) {
      console.error('AppContext purchase error:', err);
      return {
        success: false,
        error: err?.message || 'Something went wrong. Please try again.',
      };
    }
  }, [setHasPremium]);

  // Restore purchases
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
      return {
        success: false,
        error: err?.message || 'Could not restore purchases.',
      };
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
