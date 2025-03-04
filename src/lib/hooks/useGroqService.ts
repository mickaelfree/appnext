'use client';

import { useState } from 'react';
import { SkillAssessment, GeneratedExercise } from '@/lib/groq-service';

/**
 * Hook pour gérer les requêtes vers les API Groq
 */
export function useGroqService() {
  const [isLoadingAssessment, setIsLoadingAssessment] = useState(false);
  const [isLoadingExercises, setIsLoadingExercises] = useState(false);
  const [isLoadingBlockingPoints, setIsLoadingBlockingPoints] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtient une évaluation des compétences depuis l'API
   */
  const getSkillAssessment = async (
    learningHistory: any[],
    userSkills: Record<string, number>,
    completedExercises: any[]
  ): Promise<SkillAssessment | null> => {
    setIsLoadingAssessment(true);
    setError(null);
    
    try {
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          learningHistory,
          userSkills,
          completedExercises,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data as SkillAssessment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setIsLoadingAssessment(false);
    }
  };

  /**
   * Obtient des exercices personnalisés depuis l'API
   */
  const getPersonalizedExercises = async (
    assessment: SkillAssessment,
    existingExercises: any[],
    exerciseType: 'flashcard' | 'shadowCoding',
    count?: number
  ): Promise<GeneratedExercise[] | null> => {
    setIsLoadingExercises(true);
    setError(null);
    
    try {
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessment,
          existingExercises,
          exerciseType,
          count,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.exercises as GeneratedExercise[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setIsLoadingExercises(false);
    }
  };

  /**
   * Obtient une analyse des points de blocage depuis l'API
   */
  const getBlockingPoints = async (
    userPerformance: any[],
    failedExercises: any[]
  ): Promise<{ blockingPoints: string[], recommendedFocus: string[] } | null> => {
    setIsLoadingBlockingPoints(true);
    setError(null);
    
    try {
      const response = await fetch('/api/blocking-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPerformance,
          failedExercises,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setIsLoadingBlockingPoints(false);
    }
  };

  return {
    getSkillAssessment,
    getPersonalizedExercises,
    getBlockingPoints,
    isLoadingAssessment,
    isLoadingExercises,
    isLoadingBlockingPoints,
    error,
  };
}