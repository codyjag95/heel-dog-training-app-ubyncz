
import React, { createContext, useContext, useState, useEffect } from 'react';
import { trainingCategories, DogProfile, UserProgress, Category, SessionNote, AnalyticsEvent, Lesson } from '@/data/trainingData';

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [dogProfile, setDogProfileState] = useState<DogProfile | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedLessons: [],
    currentStreak: 0,
    totalSessions: 0,
    isPremium: false,
    lessonViews: {},
    lessonCompletions: {},
    quizCompleted: false,
  });
  const [categories, setCategories] = useState<Category[]>(trainingCategories);
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);

  const setDogProfile = (profile: DogProfile) => {
    console.log('Setting dog profile:', profile);
    setDogProfileState(profile);
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
    // Premium lessons are locked for free users
    if (lesson.isPremium && !userProgress.isPremium) {
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
