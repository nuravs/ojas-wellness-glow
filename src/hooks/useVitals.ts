
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/use-toast';
import { isOutOfRange, getVitalRangeStatus as getVitalStatus } from '../utils/vitalsUtils';

export interface Vital {
  id: string;
  user_id: string;
  vital_type: 'blood_pressure' | 'blood_sugar' | 'pulse' | 'weight' | 'temperature';
  values: any; // JSONB field
  measured_at: string;
  notes?: string;
  out_of_range: boolean;
  created_at: string;
  updated_at: string;
}

export interface VitalReading {
  systolic?: number;
  diastolic?: number;
  value?: number;
  unit?: string;
}

export const useVitals = () => {
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchVitals = async () => {
    if (!user) {
      console.log('useVitals: No user found, setting loading to false');
      setLoading(false);
      return;
    }

    console.log('useVitals: Fetching vitals for user:', user.id);
    
    try {
      const { data, error } = await supabase
        .from('vitals')
        .select('*')
        .eq('user_id', user.id)
        .order('measured_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching vitals:', error);
        toast({
          title: "Connection Error",
          description: "Unable to load vitals data. Please check your connection.",
          variant: "destructive",
        });
        setVitals([]);
      } else {
        console.log('useVitals: Successfully fetched vitals:', data?.length || 0, 'records');
        setVitals((data || []) as unknown as Vital[]);
      }
    } catch (error) {
      console.error('Error fetching vitals:', error);
      toast({
        title: "Database Error", 
        description: "Failed to load vitals. Please try again.",
        variant: "destructive",
      });
      setVitals([]);
    } finally {
      console.log('useVitals: Setting loading to false');
      setLoading(false);
    }
  };

  const addVital = async (vitalData: {
    vital_type: Vital['vital_type'];
    values: VitalReading;
    notes?: string;
    measured_at?: string;
  }) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to add vitals",
        variant: "destructive",
      });
      throw new Error('User not authenticated');
    }

    try {
      const outOfRange = isOutOfRange(vitalData.vital_type, vitalData.values);
      
      const vitalPayload = {
        user_id: user.id,
        vital_type: vitalData.vital_type,
        values: vitalData.values as any, // JSONB field needs type casting
        notes: vitalData.notes,
        measured_at: vitalData.measured_at || new Date().toISOString(),
        out_of_range: outOfRange,
      };

      const { data, error } = await supabase
        .from('vitals')
        .insert(vitalPayload)
        .select()
        .single();

      if (error) {
        console.error('Error adding vital:', error);
        toast({
          title: "Database Error",
          description: "Failed to save vital sign. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      // Show success message
      toast({
        title: "Vital Added",
        description: outOfRange ? 
          "Vital sign recorded. Please review the out-of-range alert." :
          "Vital sign recorded successfully",
        variant: outOfRange ? "destructive" : "default",
      });
      
      setVitals(prev => [data as unknown as Vital, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding vital:', error);
      throw error;
    }
  };

  const checkIfOutOfRange = (type: Vital['vital_type'], values: VitalReading): boolean => {
    return isOutOfRange(type, values);
  };

  const getVitalRangeStatus = (type: Vital['vital_type'], values: VitalReading) => {
    return getVitalStatus(type, values);
  };

  useEffect(() => {
    fetchVitals();
  }, [user]);

  return {
    vitals,
    loading,
    addVital,
    getVitalRangeStatus,
    checkIfOutOfRange,
    refetch: fetchVitals
  };
};
