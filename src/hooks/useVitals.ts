
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

export interface Vital {
  id: string;
  user_id: string;
  vital_type: 'blood_pressure' | 'blood_sugar' | 'pulse' | 'weight' | 'temperature';
  values: any; // JSONB field
  measured_at: string;
  notes?: string;
  out_of_range: boolean;
  logged_by: string;
  caregiver_visible: boolean;
  created_at: string;
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
      setLoading(false);
      return;
    }

    try {
      // Query the vitals table directly with type assertion for now
      const { data, error } = await supabase
        .from('vitals' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('measured_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching vitals:', error);
        setVitals([]);
      } else {
        setVitals((data || []) as unknown as Vital[]);
      }
    } catch (error) {
      console.error('Error fetching vitals:', error);
      setVitals([]);
    } finally {
      setLoading(false);
    }
  };

  const addVital = async (vitalData: {
    vital_type: Vital['vital_type'];
    values: VitalReading;
    notes?: string;
    measured_at?: string;
  }) => {
    if (!user) return;

    try {
      const vitalPayload = {
        user_id: user.id,
        logged_by: user.id,
        vital_type: vitalData.vital_type,
        values: vitalData.values,
        notes: vitalData.notes,
        measured_at: vitalData.measured_at || new Date().toISOString(),
        out_of_range: checkIfOutOfRange(vitalData.vital_type, vitalData.values),
        caregiver_visible: true,
      };

      const { data, error } = await supabase
        .from('vitals' as any)
        .insert(vitalPayload)
        .select()
        .single();

      if (error) throw error;
      
      setVitals(prev => [data as unknown as Vital, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding vital:', error);
      throw error;
    }
  };

  const checkIfOutOfRange = (type: Vital['vital_type'], values: VitalReading): boolean => {
    switch (type) {
      case 'blood_pressure':
        if (values.systolic && values.diastolic) {
          return values.systolic > 140 || values.diastolic > 90 || values.systolic < 90 || values.diastolic < 60;
        }
        return false;
      case 'blood_sugar':
        if (values.value) {
          return values.value > 180 || values.value < 70;
        }
        return false;
      case 'pulse':
        if (values.value) {
          return values.value > 100 || values.value < 60;
        }
        return false;
      case 'temperature':
        if (values.value) {
          return values.value > 99.5 || values.value < 97.0;
        }
        return false;
      default:
        return false;
    }
  };

  const getVitalRangeStatus = (type: Vital['vital_type'], values: VitalReading) => {
    const isOutOfRange = checkIfOutOfRange(type, values);
    if (isOutOfRange) return 'high';
    
    switch (type) {
      case 'blood_pressure':
        if (values.systolic && values.diastolic) {
          if (values.systolic <= 120 && values.diastolic <= 80) return 'good';
          return 'attention';
        }
        break;
      case 'blood_sugar':
        if (values.value) {
          if (values.value >= 80 && values.value <= 140) return 'good';
          return 'attention';
        }
        break;
      case 'pulse':
        if (values.value) {
          if (values.value >= 60 && values.value <= 100) return 'good';
          return 'attention';
        }
        break;
    }
    return 'good';
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
