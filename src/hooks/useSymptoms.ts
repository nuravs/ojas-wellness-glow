
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './use-toast';

export interface Symptom {
  id: string;
  user_id: string;
  symptom_type: string;
  severity: number;
  details?: any;
  notes?: string;
  logged_at: string;
}

export const useSymptoms = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadSymptoms = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Loading symptoms for user:', user.id);
      
      // Use the database function to fetch symptoms from staging
      const { data, error } = await supabase
        .rpc('get_user_symptoms', { symptoms_user_id: user.id });

      if (error) {
        console.error('Error loading symptoms:', error);
        toast({
          title: "Error loading symptoms",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
        return;
      }

      console.log('Symptoms data received:', data);
      
      // The RPC function returns JSON array directly
      const symptomsArray = Array.isArray(data) ? data : [];
      setSymptoms((symptomsArray as unknown as Symptom[]) || []);
    } catch (error) {
      console.error('Error in loadSymptoms:', error);
      toast({
        title: "Connection Error",
        description: "Please check your connection and try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addSymptom = async (symptomData: {
    symptom_type: string;
    severity: number;
    details?: any;
    notes?: string;
  }) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to add symptoms.",
        variant: "destructive"
      });
      throw new Error('User not authenticated');
    }

    try {
      const { data, error } = await supabase
        .from('symptoms')
        .insert({
          user_id: user.id,
          symptom_type: symptomData.symptom_type,
          severity: symptomData.severity,
          details: symptomData.details,
          notes: symptomData.notes,
          logged_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding symptom:', error);
        toast({
          title: "Error saving symptom",
          description: "Failed to save symptom. Please try again.",
          variant: "destructive"
        });
        throw error;
      }

      toast({
        title: "Symptom Added",
        description: "Symptom logged successfully.",
        variant: "default"
      });

      await loadSymptoms();
      return data;
    } catch (err) {
      console.error('useSymptoms → addSymptom error:', err);
      throw err;
    }
  };

  const getRecentSymptoms = (days: number = 7): Symptom[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return symptoms.filter(symptom => 
      new Date(symptom.logged_at) >= cutoffDate
    );
  };

  const calculateAverageSeverity = (symptomList: Symptom[]): number => {
    if (symptomList.length === 0) return 0;
    
    const totalSeverity = symptomList.reduce((sum, symptom) => sum + symptom.severity, 0);
    return totalSeverity / symptomList.length;
  };

  const getNeurologicalSymptoms = (days: number = 14): Symptom[] => {
    const recentSymptoms = getRecentSymptoms(days);
    return recentSymptoms.filter(symptom =>
      ['tremor', 'stiffness', 'balance', 'cognitive', 'giddiness'].includes(symptom.symptom_type.toLowerCase())
    );
  };

  const getSymptomTrends = () => {
    const last7Days = getRecentSymptoms(7);
    const last14Days = getRecentSymptoms(14);
    
    const current7DayAvg = calculateAverageSeverity(last7Days);
    const previous7DayAvg = calculateAverageSeverity(
      last14Days.filter(s => !last7Days.some(recent => recent.id === s.id))
    );
    
    return {
      current: current7DayAvg,
      previous: previous7DayAvg,
      trend: current7DayAvg > previous7DayAvg ? 'worsening' : 
             current7DayAvg < previous7DayAvg ? 'improving' : 'stable'
    };
  };

  useEffect(() => {
    loadSymptoms();
  }, [user]);

  return {
    symptoms,
    loading,
    addSymptom,
    getRecentSymptoms,
    calculateAverageSeverity,
    getNeurologicalSymptoms,
    getSymptomTrends,
    refetch: loadSymptoms
  };
};
