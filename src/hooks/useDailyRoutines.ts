import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

// Helper function to safely transform database results to DailyRoutine type
const transformDbRoutine = (dbRoutine: any): DailyRoutine => {
  return {
    ...dbRoutine,
    routine_data: typeof dbRoutine.routine_data === 'object' ? dbRoutine.routine_data : { tasks: [], goals: [] }
  } as DailyRoutine;
};

export interface RoutineTask {
  id: string;
  title: string;
  description?: string;
  time: string;
  category: 'medication' | 'exercise' | 'self-care' | 'appointment' | 'other';
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface DailyRoutine {
  id: string;
  routine_date: string;
  routine_data: {
    tasks: RoutineTask[];
    goals: string[];
  };
  completed_tasks: string[];
  wellness_score?: number;
  notes?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useDailyRoutines = () => {
  const { user } = useAuth();
  const [routines, setRoutines] = useState<DailyRoutine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRoutines();
    }
  }, [user]);

  const loadRoutines = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('daily_routines')
        .select('*')
        .eq('user_id', user.id)
        .gte('routine_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('routine_date', { ascending: false });

      if (error) throw error;
      setRoutines((data || []).map(transformDbRoutine));
    } catch (error) {
      console.error('Error loading routines:', error);
      toast.error('Failed to load daily routines');
    } finally {
      setLoading(false);
    }
  };

  const getRoutineForDate = (date: string): DailyRoutine | undefined => {
    return routines.find(routine => routine.routine_date === date);
  };

  const createOrUpdateRoutine = async (
    date: string,
    tasks: RoutineTask[],
    notes?: string,
    wellnessScore?: number
  ): Promise<DailyRoutine | null> => {
    if (!user) return null;

    try {
      const routineData = {
        tasks,
        goals: ['Complete daily health tasks', 'Track wellness', 'Maintain routine']
      };

      const existingRoutine = getRoutineForDate(date);
      const { data, error } = await supabase
        .from('daily_routines')
        .upsert({
          id: existingRoutine?.id,
          user_id: user.id,
          routine_date: date,
          routine_data: routineData as any,
          notes,
          wellness_score: wellnessScore,
          completed_tasks: existingRoutine?.completed_tasks || []
        }, {
          onConflict: 'user_id,routine_date'
        })
        .select()
        .single();

      if (error) throw error;

      setRoutines(prev => {
        const updated = prev.filter(r => r.routine_date !== date);
        return [transformDbRoutine(data), ...updated].sort((a, b) => b.routine_date.localeCompare(a.routine_date));
      });

      return transformDbRoutine(data);
    } catch (error) {
      console.error('Error creating/updating routine:', error);
      toast.error('Failed to save routine');
      return null;
    }
  };

  const toggleTask = async (routineId: string, taskId: string): Promise<boolean> => {
    try {
      const routine = routines.find(r => r.id === routineId);
      if (!routine) return false;

      const updatedCompletedTasks = routine.completed_tasks.includes(taskId)
        ? routine.completed_tasks.filter(id => id !== taskId)
        : [...routine.completed_tasks, taskId];

      const { error } = await supabase
        .from('daily_routines')
        .update({ completed_tasks: updatedCompletedTasks })
        .eq('id', routineId);

      if (error) throw error;

      setRoutines(prev => 
        prev.map(r => 
          r.id === routineId 
            ? { ...r, completed_tasks: updatedCompletedTasks }
            : r
        )
      );

      return true;
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
      return false;
    }
  };

  const addTask = async (date: string, task: Omit<RoutineTask, 'id'>): Promise<boolean> => {
    const existingRoutine = getRoutineForDate(date);
    const currentTasks = existingRoutine?.routine_data?.tasks || [];
    
    const newTask: RoutineTask = {
      id: crypto.randomUUID(),
      ...task,
      completed: false
    };

    const updatedRoutine = await createOrUpdateRoutine(
      date,
      [...currentTasks, newTask],
      existingRoutine?.notes,
      existingRoutine?.wellness_score
    );

    return updatedRoutine !== null;
  };

  const removeTask = async (date: string, taskId: string): Promise<boolean> => {
    const existingRoutine = getRoutineForDate(date);
    if (!existingRoutine) return false;

    const updatedTasks = existingRoutine.routine_data.tasks.filter(task => task.id !== taskId);
    const updatedCompletedTasks = existingRoutine.completed_tasks.filter(id => id !== taskId);

    try {
      const { error } = await supabase
        .from('daily_routines')
        .update({
          routine_data: {
            ...existingRoutine.routine_data,
            tasks: updatedTasks
          } as any,
          completed_tasks: updatedCompletedTasks
        })
        .eq('id', existingRoutine.id);

      if (error) throw error;

      setRoutines(prev => 
        prev.map(r => 
          r.id === existingRoutine.id 
            ? {
                ...r,
                routine_data: { ...r.routine_data, tasks: updatedTasks },
                completed_tasks: updatedCompletedTasks
              }
            : r
        )
      );

      return true;
    } catch (error) {
      console.error('Error removing task:', error);
      toast.error('Failed to remove task');
      return false;
    }
  };

  const updateWellnessScore = async (routineId: string, score: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('daily_routines')
        .update({ wellness_score: score })
        .eq('id', routineId);

      if (error) throw error;

      setRoutines(prev => 
        prev.map(r => 
          r.id === routineId 
            ? { ...r, wellness_score: score }
            : r
        )
      );

      return true;
    } catch (error) {
      console.error('Error updating wellness score:', error);
      toast.error('Failed to update wellness score');
      return false;
    }
  };

  const getCompletionStats = (routine: DailyRoutine) => {
    const totalTasks = routine.routine_data.tasks.length;
    const completedCount = routine.completed_tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks: completedCount,
      completionRate
    };
  };

  const getWeeklyStats = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyRoutines = routines.filter(routine => 
      new Date(routine.routine_date) >= weekAgo
    );

    const totalDays = weeklyRoutines.length;
    const totalTasks = weeklyRoutines.reduce((acc, routine) => 
      acc + routine.routine_data.tasks.length, 0
    );
    const totalCompleted = weeklyRoutines.reduce((acc, routine) => 
      acc + routine.completed_tasks.length, 0
    );
    const averageWellness = weeklyRoutines
      .filter(r => r.wellness_score !== null)
      .reduce((acc, routine, _, arr) => 
        acc + (routine.wellness_score || 0) / arr.length, 0
      );

    return {
      totalDays,
      totalTasks,
      totalCompleted,
      completionRate: totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0,
      averageWellness: Math.round(averageWellness * 10) / 10
    };
  };

  return {
    routines,
    loading,
    getRoutineForDate,
    createOrUpdateRoutine,
    toggleTask,
    addTask,
    removeTask,
    updateWellnessScore,
    getCompletionStats,
    getWeeklyStats,
    refetch: loadRoutines
  };
};