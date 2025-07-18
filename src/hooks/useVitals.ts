import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/use-toast';
import { isOutOfRange, getVitalRangeStatus as getVitalStatus } from '../utils/vitalsUtils';

export interface Vital {
  id: string;
  user_id: string;
  vital_type: 'blood_pressure' | 'blood_sugar' | 'pulse' | 'weight' | 'temperature';
  values: any;          // JSONB field
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

  /** --------------------------- Helpers --------------------------- */

  const fetchVitals = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('vitals')
        .select('*')
        .eq('user_id', user.id)
        .order('measured_at', { ascending: false });

      if (error) {
        // Show toast only for real errors, not “table missing” during migrations
        if (!error.message?.includes('does not exist')) {
          toast({
            title: 'Connection Error',
            description: 'Unable to load vitals data. Please check your connection.',
            variant: 'destructive',
          });
        }
        setVitals([]);
      } else {
        setVitals((data || []) as Vital[]);
      }
    } catch (err) {
      console.error('useVitals → fetchVitals error:', err);
      toast({
        title: 'Database Error',
        description: 'Failed to load vitals. Please try again.',
        variant: 'destructive',
      });
      setVitals([]);
    } finally {
      setLoading(false);
    }
  };

  /** --------------------------- Mutations --------------------------- */

  const addVital = async (vitalData: {
    vital_type: Vital['vital_type'];
    values: VitalReading;
    notes?: string;
    measured_at?: string;
  }) => {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'Please log in to add vitals.',
        variant: 'destructive',
      });
      throw new Error('User not authenticated');
    }

    try {
      const outOfRange = isOutOfRange(vitalData.vital_type, vitalData.values);

      const { data, error } = await supabase
        .from('vitals')
        .insert({
          user_id: user.id,
          vital_type: vitalData.vital_type,
          values: vitalData.values as any, // cast for JSONB
          notes: vitalData.notes,
          measured_at: vitalData.measured_at || new Date().toISOString(),
          out_of_range: outOfRange,
        })
        .select()
        .single();

      if (error) {
        toast({
          title: 'Database Error',
          description: 'Failed to save vital sign. Please try again.',
          variant: 'destructive',
        });
        throw error;
      }

      toast({
        title: 'Vital Added',
        description: outOfRange
          ? 'Vital sign recorded. Please review the out-of-range alert.'
          : 'Vital sign recorded successfully.',
        variant: outOfRange ? 'destructive' : 'default',
      });

      // ⚠️  Remove optimistic local push to prevent duplicate rendering
      await fetchVitals();          // refresh from server instead
      return data;
    } catch (err) {
      console.error('useVitals → addVital error:', err);
      throw err;
    }
  };

  /** --------------------------- Utilities --------------------------- */

  const checkIfOutOfRange = (
    type: Vital['vital_type'],
    values: VitalReading,
  ) => isOutOfRange(type, values);

  const getVitalRangeStatus = (
    type: Vital['vital_type'],
    values: VitalReading,
  ) => getVitalStatus(type, values);

  /** --------------------------- Effects --------------------------- */

  useEffect(() => {
    fetchVitals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);            // refetch when user context changes

  /** --------------------------- Return API --------------------------- */

  return {
    vitals,
    loading,
    addVital,
    getVitalRangeStatus,
    checkIfOutOfRange,
    refetch: fetchVitals,
  };
};
