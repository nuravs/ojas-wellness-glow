import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './use-toast';

export interface PositiveFactor {
  id: string;
  user_id: string;
  factor_text: string;
  logged_date: string;
  wellness_score: number;
  created_at: string;
  updated_at: string;
}

export const usePositiveFactors = () => {
  const [positiveFactors, setPositiveFactors] = useState<PositiveFactor[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadPositiveFactors = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('positive_factors')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading positive factors:', error);
        toast({
          title: "Error loading positive memories",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
        return;
      }

      setPositiveFactors(data || []);
    } catch (error) {
      console.error('Error in loadPositiveFactors:', error);
      toast({
        title: "Error loading data",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addPositiveFactor = async (factorText: string, wellnessScore: number) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('positive_factors')
        .insert({
          user_id: user.id,
          factor_text: factorText,
          wellness_score: wellnessScore
        })
        .select()
        .single();

      if (error) throw error;

      setPositiveFactors(prev => [data, ...prev]);
      return true;
    } catch (error) {
      console.error('Error adding positive factor:', error);
      return false;
    }
  };

  const getRandomPositiveFactor = (): PositiveFactor | null => {
    if (positiveFactors.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * positiveFactors.length);
    return positiveFactors[randomIndex];
  };

  const getFactorsFromGoodDays = (): PositiveFactor[] => {
    return positiveFactors.filter(factor => factor.wellness_score >= 80);
  };

  const hasLoggedToday = (): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return positiveFactors.some(factor => 
      factor.logged_date === today
    );
  };

  useEffect(() => {
    loadPositiveFactors();
  }, [user]);

  return {
    positiveFactors,
    loading,
    addPositiveFactor,
    getRandomPositiveFactor,
    getFactorsFromGoodDays,
    hasLoggedToday,
    refetch: loadPositiveFactors
  };
};