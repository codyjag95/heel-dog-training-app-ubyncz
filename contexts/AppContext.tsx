
import React, { createContext, useContext, useState, useEffect } from 'react';
import { trainingCategories, DogProfile, UserProgress, Category } from '@/data/trainingData';

interface AppContextType {
  dogProfile: DogProfile | null;
  setDogProfile: (profile: DogProfile) => void;
  userProgress: UserProgress;
  categories: Category[];
  completeLesson: (lessonId: string) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [dogProfile, setDogProfile] = useState<DogProfile | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedLessons: [],
    currentStreak: 0,
    totalSessions: 0,
    isPremium: false,
  });
  const [categories, setCategories] = useState<Category[]>(trainingCategories);

  const completeLesson = (lessonId: string) => {
    console.log('Completing lesson:', lessonId);
    
    if (!userProgress.completedLessons.includes(lessonId)) {
      const newCompletedLessons = [...userProgress.completedLessons, lessonId];
      setUserProgress({
        ...userProgress,
        completedLessons: newCompletedLessons,
        totalSessions: userProgress.totalSessions + 1,
      });

      // Update categories with completion status
      const updatedCategories = categories.map(category => ({
        ...category,
        lessons: category.lessons.map(lesson => ({
          ...lesson,
          isCompleted: lesson.id === lessonId ? true : lesson.isCompleted,
        })),
        completedCount: category.lessons.filter(
          lesson => lesson.id === lessonId || lesson.isCompleted
        ).length,
      }));
      setCategories(updatedCategories);
    }
  };

  const completeOnboarding = () => {
    console.log('Completing onboarding');
    setHasCompletedOnboarding(true);
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
