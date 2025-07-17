import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './use-toast';

export interface BrainGymExercise {
  id: string;
  name: string;
  category: string;
  difficulty_level: number;
  description: string;
  instructions: any;
  target_skills: string[];
  estimated_duration: number;
  created_at: string;
  updated_at: string;
}

export interface BrainGymSession {
  id: string;
  user_id: string;
  exercise_id: string;
  difficulty_level: number;
  score?: number;
  completion_time?: number;
  mistakes_count: number;
  completed: boolean;
  session_data?: any;
  started_at: string;
  completed_at?: string;
  created_at: string;
}

export const useBrainGym = () => {
  const [exercises, setExercises] = useState<BrainGymExercise[]>([]);
  const [sessions, setSessions] = useState<BrainGymSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('brain_gym_exercises')
        .select('*')
        .order('difficulty_level', { ascending: true });

      if (error) throw error;
      setExercises(data || []);
    } catch (error) {
      console.error('Error loading brain gym exercises:', error);
      toast({
        title: "Error loading exercises",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    }
  };

  const loadSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('brain_gym_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading brain gym sessions:', error);
      toast({
        title: "Error loading session history",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startSession = async (exerciseId: string, difficultyLevel: number) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('brain_gym_sessions')
        .insert({
          user_id: user.id,
          exercise_id: exerciseId,
          difficulty_level: difficultyLevel,
          completed: false,
          mistakes_count: 0
        })
        .select()
        .single();

      if (error) throw error;
      setSessions(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error starting brain gym session:', error);
      toast({
        title: "Error starting session",
        description: "Please try again",
        variant: "destructive"
      });
      return null;
    }
  };

  const completeSession = async (
    sessionId: string, 
    score: number, 
    completionTime: number, 
    mistakesCount: number = 0,
    sessionData?: any
  ) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('brain_gym_sessions')
        .update({
          score,
          completion_time: completionTime,
          mistakes_count: mistakesCount,
          completed: true,
          completed_at: new Date().toISOString(),
          session_data: sessionData
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Update local state
      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, score, completion_time: completionTime, mistakes_count: mistakesCount, completed: true }
          : session
      ));

      return true;
    } catch (error) {
      console.error('Error completing brain gym session:', error);
      toast({
        title: "Error saving session results",
        description: "Please try again",
        variant: "destructive"
      });
      return false;
    }
  };

  const getExercisesByCategory = (category: string): BrainGymExercise[] => {
    return exercises.filter(exercise => exercise.category === category);
  };

  const getSessionsForExercise = (exerciseId: string): BrainGymSession[] => {
    return sessions.filter(session => session.exercise_id === exerciseId && session.completed);
  };

  const getAverageScore = (exerciseId: string): number => {
    const exerciseSessions = getSessionsForExercise(exerciseId);
    if (exerciseSessions.length === 0) return 0;
    
    const totalScore = exerciseSessions.reduce((sum, session) => sum + (session.score || 0), 0);
    return totalScore / exerciseSessions.length;
  };

  const getRecommendedDifficulty = (exerciseId: string): number => {
    const exerciseSessions = getSessionsForExercise(exerciseId);
    if (exerciseSessions.length === 0) return 1;
    
    const recentSessions = exerciseSessions.slice(0, 5); // Last 5 sessions
    const averageScore = recentSessions.reduce((sum, session) => sum + (session.score || 0), 0) / recentSessions.length;
    
    // Adaptive difficulty: increase if performing well, decrease if struggling
    const currentDifficulty = recentSessions[0]?.difficulty_level || 1;
    if (averageScore >= 80) {
      return Math.min(5, currentDifficulty + 1);
    } else if (averageScore < 60) {
      return Math.max(1, currentDifficulty - 1);
    }
    return currentDifficulty;
  };

  const getPerformanceStats = () => {
    const completedSessions = sessions.filter(s => s.completed);
    const totalSessions = completedSessions.length;
    
    if (totalSessions === 0) return { totalSessions: 0, averageScore: 0, improvementTrend: 'neutral' };
    
    const averageScore = completedSessions.reduce((sum, session) => sum + (session.score || 0), 0) / totalSessions;
    
    // Calculate improvement trend (last 5 vs previous 5 sessions)
    const recent5 = completedSessions.slice(0, 5);
    const previous5 = completedSessions.slice(5, 10);
    
    let improvementTrend: 'improving' | 'declining' | 'neutral' = 'neutral';
    if (recent5.length >= 3 && previous5.length >= 3) {
      const recentAvg = recent5.reduce((sum, s) => sum + (s.score || 0), 0) / recent5.length;
      const previousAvg = previous5.reduce((sum, s) => sum + (s.score || 0), 0) / previous5.length;
      
      if (recentAvg > previousAvg + 10) improvementTrend = 'improving';
      else if (recentAvg < previousAvg - 10) improvementTrend = 'declining';
    }
    
    return { totalSessions, averageScore, improvementTrend };
  };

  useEffect(() => {
    loadExercises();
    loadSessions();
  }, [user]);

  return {
    exercises,
    sessions,
    loading,
    startSession,
    completeSession,
    getExercisesByCategory,
    getSessionsForExercise,
    getAverageScore,
    getRecommendedDifficulty,
    getPerformanceStats,
    refetch: () => {
      loadExercises();
      loadSessions();
    }
  };
};