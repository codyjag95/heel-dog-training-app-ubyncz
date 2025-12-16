
import React, { createContext, useContext, useState, useEffect } from 'react';
import { trainingCategories, DogProfile, UserProgress, Category, SessionNote, AnalyticsEvent, Lesson, SessionTemplate } from '@/data/trainingData';

interface AppContextType {
  dogProfile: DogProfile | null;
  setDogProfile: (profile: DogProfile) => void;
  userProgress: UserProgress;
  categories: Category[];
  completeLesson: (lessonId: string) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  addSessionNote: (note: SessionNote) => void;
  getSessionNotes: (lessonId: string) => SessionNote[];
  setLastViewedLesson: (lessonId: string) => void;
  trackAnalytics: (event: AnalyticsEvent) => void;
  updateStreak: () => void;
  isLessonLocked: (lesson: Lesson) => boolean;
  allDogs: DogProfile[];
  addDog: (dog: DogProfile) => void;
  switchDog: (dogId: string) => void;
  removeDog: (dogId: string) => void;
  getTodaysFocus: () => { lesson: Lesson; category: Category } | null;
  getProgressInsights: () => string[];
  sessionTemplates: SessionTemplate[];
  applySessionTemplate: (templateId: string) => Lesson[];
  togglePremium: () => void;
  toggleBetaOverride: () => void;
  isPremiumUser: () => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [dogProfile, setDogProfileState] = useState<DogProfile | null>(null);
  const [allDogs, setAllDogs] = useState<DogProfile[]>([]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedLessons: [],
    currentStreak: 0,
    totalSessions: 0,
    isPremium: false,
    lessonViews: {},
    lessonCompletions: {},
    quizCompleted: false,
    is_pro: false,
    beta_override: false,
  });
  const [categories, setCategories] = useState<Category[]>(trainingCategories);
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);

  // Premium entitlement rule: user is premium if is_pro OR beta_override
  const isPremiumUser = (): boolean => {
    return userProgress.is_pro === true || userProgress.beta_override === true;
  };

  const setDogProfile = (profile: DogProfile) => {
    console.log('Setting dog profile:', profile);
    setDogProfileState(profile);
    
    // Update allDogs array
    setAllDogs(prevDogs => {
      const existingIndex = prevDogs.findIndex(d => d.id === profile.id);
      if (existingIndex >= 0) {
        const updated = [...prevDogs];
        updated[existingIndex] = profile;
        return updated;
      } else {
        return [...prevDogs, profile];
      }
    });
  };

  const addDog = (dog: DogProfile) => {
    console.log('Adding new dog:', dog);
    const newDog = { ...dog, id: dog.id || `dog-${Date.now()}` };
    setAllDogs(prev => [...prev, newDog]);
    setDogProfileState(newDog);
  };

  const switchDog = (dogId: string) => {
    console.log('Switching to dog:', dogId);
    const dog = allDogs.find(d => d.id === dogId);
    if (dog) {
      setDogProfileState(dog);
    }
  };

  const removeDog = (dogId: string) => {
    console.log('Removing dog:', dogId);
    setAllDogs(prev => prev.filter(d => d.id !== dogId));
    if (dogProfile?.id === dogId) {
      const remaining = allDogs.filter(d => d.id !== dogId);
      setDogProfileState(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const completeLesson = (lessonId: string) => {
    console.log('Completing lesson:', lessonId);
    
    if (!userProgress.completedLessons.includes(lessonId)) {
      const newCompletedLessons = [...userProgress.completedLessons, lessonId];
      const newLessonCompletions = {
        ...userProgress.lessonCompletions,
        [lessonId]: (userProgress.lessonCompletions[lessonId] || 0) + 1,
      };

      setUserProgress({
        ...userProgress,
        completedLessons: newCompletedLessons,
        totalSessions: userProgress.totalSessions + 1,
        lessonCompletions: newLessonCompletions,
        lastTrainingDate: new Date().toISOString(),
      });

      // Update categories with completion status and unlock logic
      const updatedCategories = categories.map(category => {
        const updatedLessons = category.lessons.map(lesson => {
          if (lesson.id === lessonId) {
            return { ...lesson, isCompleted: true };
          }
          
          // Check if lesson should be unlocked
          if (lesson.prerequisiteIds && lesson.prerequisiteIds.length > 0) {
            const allPrerequisitesComplete = lesson.prerequisiteIds.every(prereqId =>
              newCompletedLessons.includes(prereqId)
            );
            if (allPrerequisitesComplete && lesson.isLocked) {
              return { ...lesson, isLocked: false };
            }
          }
          
          return lesson;
        });

        return {
          ...category,
          lessons: updatedLessons,
          completedCount: updatedLessons.filter(l => l.isCompleted).length,
        };
      });
      
      setCategories(updatedCategories);

      // Track analytics
      trackAnalytics({
        type: 'lesson_completion',
        timestamp: new Date().toISOString(),
        lessonId,
      });
    }
  };

  const completeOnboarding = () => {
    console.log('Completing onboarding');
    setHasCompletedOnboarding(true);
    setUserProgress({
      ...userProgress,
      quizCompleted: true,
    });
    
    // Track analytics
    trackAnalytics({
      type: 'quiz_completion',
      timestamp: new Date().toISOString(),
    });
  };

  const addSessionNote = (note: SessionNote) => {
    console.log('Adding session note:', note);
    if (dogProfile) {
      const existingNotes = dogProfile.sessionNotes || [];
      setDogProfileState({
        ...dogProfile,
        sessionNotes: [...existingNotes, note],
      });
    }
  };

  const getSessionNotes = (lessonId: string): SessionNote[] => {
    if (!dogProfile || !dogProfile.sessionNotes) {
      return [];
    }
    return dogProfile.sessionNotes.filter(note => note.lessonId === lessonId);
  };

  const setLastViewedLesson = (lessonId: string) => {
    console.log('Setting last viewed lesson:', lessonId);
    if (dogProfile) {
      setDogProfileState({
        ...dogProfile,
        lastViewedLesson: lessonId,
      });
    }

    // Track lesson view
    const newLessonViews = {
      ...userProgress.lessonViews,
      [lessonId]: (userProgress.lessonViews[lessonId] || 0) + 1,
    };
    setUserProgress({
      ...userProgress,
      lessonViews: newLessonViews,
    });

    // Track analytics
    trackAnalytics({
      type: 'lesson_view',
      timestamp: new Date().toISOString(),
      lessonId,
    });
  };

  const trackAnalytics = (event: AnalyticsEvent) => {
    console.log('Analytics event:', event);
    setAnalyticsEvents([...analyticsEvents, event]);
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastTrainingDate = userProgress.lastTrainingDate
      ? new Date(userProgress.lastTrainingDate).toDateString()
      : null;

    if (lastTrainingDate === today) {
      // Already trained today, no change
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let newStreak = userProgress.currentStreak;
    if (lastTrainingDate === yesterdayStr) {
      // Consecutive day
      newStreak += 1;
    } else if (lastTrainingDate !== today) {
      // Streak broken
      newStreak = 1;
    }

    setUserProgress({
      ...userProgress,
      currentStreak: newStreak,
      lastTrainingDate: new Date().toISOString(),
    });
  };

  const isLessonLocked = (lesson: Lesson): boolean => {
    // Premium lessons are locked for non-premium users
    const userIsPremium = isPremiumUser();
    if (lesson.isPremium && !userIsPremium) {
      return true;
    }

    // Check prerequisites
    if (lesson.prerequisiteIds && lesson.prerequisiteIds.length > 0) {
      const allPrerequisitesComplete = lesson.prerequisiteIds.every(prereqId =>
        userProgress.completedLessons.includes(prereqId)
      );
      return !allPrerequisitesComplete;
    }

    return lesson.isLocked;
  };

  const getTodaysFocus = (): { lesson: Lesson; category: Category } | null => {
    const userIsPremium = isPremiumUser();
    if (!userIsPremium || !dogProfile?.recommendedPrimaryTrack) {
      return null;
    }

    // Find the recommended category
    const recommendedCategory = categories.find(
      cat => cat.name === dogProfile.recommendedPrimaryTrack
    );

    if (!recommendedCategory) {
      return null;
    }

    // Find the next incomplete lesson in the recommended track
    const nextLesson = recommendedCategory.lessons.find(
      lesson => !lesson.isCompleted && !isLessonLocked(lesson)
    );

    if (nextLesson) {
      return { lesson: nextLesson, category: recommendedCategory };
    }

    // If all lessons in primary track are complete, check secondary tracks
    if (dogProfile.recommendedSecondaryTracks) {
      for (const trackName of dogProfile.recommendedSecondaryTracks) {
        const secondaryCategory = categories.find(cat => cat.name === trackName);
        if (secondaryCategory) {
          const nextSecondaryLesson = secondaryCategory.lessons.find(
            lesson => !lesson.isCompleted && !isLessonLocked(lesson)
          );
          if (nextSecondaryLesson) {
            return { lesson: nextSecondaryLesson, category: secondaryCategory };
          }
        }
      }
    }

    return null;
  };

  const getProgressInsights = (): string[] => {
    const userIsPremium = isPremiumUser();
    if (!userIsPremium) {
      return [];
    }

    const insights: string[] = [];

    // Streak insight
    if (userProgress.currentStreak >= 7) {
      insights.push(`🔥 Amazing! ${userProgress.currentStreak}-day training streak`);
    } else if (userProgress.currentStreak >= 3) {
      insights.push(`💪 Building momentum with a ${userProgress.currentStreak}-day streak`);
    }

    // Recall progress
    const recallCategory = categories.find(cat => cat.id === 'recall');
    if (recallCategory) {
      const recallProgress = recallCategory.lessons.length > 0
        ? (recallCategory.completedCount / recallCategory.lessons.length) * 100
        : 0;
      if (recallProgress > 50 && recallProgress < 100) {
        insights.push('📍 Recall consistency improving');
      } else if (recallProgress === 100) {
        insights.push('✅ Recall mastery achieved');
      }
    }

    // Calm & Focus progress
    const calmCategory = categories.find(cat => cat.id === 'calm-focus');
    if (calmCategory) {
      const calmProgress = calmCategory.lessons.length > 0
        ? (calmCategory.completedCount / calmCategory.lessons.length) * 100
        : 0;
      if (calmProgress > 50 && calmProgress < 100) {
        insights.push('🧘 Calm behaviors trending up');
      } else if (calmProgress === 100) {
        insights.push('✨ Calmness mastered');
      }
    }

    // Most skipped category
    const categoryViews: { [key: string]: number } = {};
    const categoryCompletions: { [key: string]: number } = {};

    categories.forEach(category => {
      let views = 0;
      let completions = 0;
      category.lessons.forEach(lesson => {
        views += userProgress.lessonViews[lesson.id] || 0;
        completions += userProgress.lessonCompletions[lesson.id] || 0;
      });
      categoryViews[category.name] = views;
      categoryCompletions[category.name] = completions;
    });

    // Find category with most views but fewest completions
    let maxGap = 0;
    let skippedCategory = '';
    Object.keys(categoryViews).forEach(catName => {
      const gap = categoryViews[catName] - categoryCompletions[catName];
      if (gap > maxGap && gap > 3) {
        maxGap = gap;
        skippedCategory = catName;
      }
    });

    if (skippedCategory) {
      insights.push(`💡 Consider revisiting ${skippedCategory}`);
    }

    // Total progress
    const totalLessons = categories.reduce((acc, cat) => acc + cat.lessons.length, 0);
    const completedLessons = categories.reduce((acc, cat) => acc + cat.completedCount, 0);
    const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    if (overallProgress > 75) {
      insights.push('🎯 Nearing completion of all training');
    } else if (overallProgress > 50) {
      insights.push('📈 Over halfway through your training journey');
    }

    return insights.slice(0, 4); // Limit to 4 insights
  };

  const sessionTemplates: SessionTemplate[] = [
    {
      id: 'quick-reset',
      name: '5-Minute Reset',
      description: 'Quick calm and focus exercises',
      duration: '5 min',
      lessonIds: ['settle-1', 'eye-contact-1', 'watch-me-1'],
      isPremium: true,
    },
    {
      id: 'focus-day',
      name: 'Focus Day',
      description: 'Build attention and connection',
      duration: '15 min',
      lessonIds: ['eye-contact-1', 'watch-me-1', 'name-game-1', 'touch-1'],
      isPremium: true,
    },
    {
      id: 'energy-drain',
      name: 'Energy Drain Session',
      description: 'Mental and physical workout',
      duration: '20 min',
      lessonIds: ['nose-work-1', 'recall-games-1', 'trick-training-1', 'shell-game-1'],
      isPremium: true,
    },
    {
      id: 'public-ready',
      name: 'Public Ready',
      description: 'Prepare for real-world environments',
      duration: '15 min',
      lessonIds: ['loose-leash-1', 'greeting-people-1', 'settle-in-public-1', 'leave-it-1'],
      isPremium: true,
    },
  ];

  const applySessionTemplate = (templateId: string): Lesson[] => {
    const template = sessionTemplates.find(t => t.id === templateId);
    if (!template) {
      return [];
    }

    const lessons: Lesson[] = [];
    for (const category of categories) {
      for (const lessonId of template.lessonIds) {
        const lesson = category.lessons.find(l => l.id === lessonId);
        if (lesson) {
          lessons.push(lesson);
        }
      }
    }

    return lessons;
  };

  const togglePremium = () => {
    console.log('Toggling premium status');
    setUserProgress({
      ...userProgress,
      is_pro: !userProgress.is_pro,
    });
  };

  const toggleBetaOverride = () => {
    console.log('Toggling beta override');
    setUserProgress({
      ...userProgress,
      beta_override: !userProgress.beta_override,
    });
  };

  return (
    <AppContext.Provider
      value={{
        dogProfile,
        setDogProfile,
        userProgress,
        categories,
        completeLesson,
        hasCompletedOnboarding,
        completeOnboarding,
        addSessionNote,
        getSessionNotes,
        setLastViewedLesson,
        trackAnalytics,
        updateStreak,
        isLessonLocked,
        allDogs,
        addDog,
        switchDog,
        removeDog,
        getTodaysFocus,
        getProgressInsights,
        sessionTemplates,
        applySessionTemplate,
        togglePremium,
        toggleBetaOverride,
        isPremiumUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
