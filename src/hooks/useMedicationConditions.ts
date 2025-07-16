
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

export interface MedicationCondition {
  id: string;
  medication_id: string;
  comorbidity_id: string;
  created_at: string;
}

export interface MedicationWithConditions {
  id: string;
  name: string;
  dosage: string;
  conditions: Array<{
    id: string;
    condition_name: string;
    status: string;
  }>;
}

export const useMedicationConditions = () => {
  const [medicationConditions, setMedicationConditions] = useState<MedicationCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMedicationConditions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('medication_conditions')
        .select('*');

      if (error) throw error;
      setMedicationConditions(data || []);
    } catch (error) {
      console.error('Error fetching medication conditions:', error);
    } finally {
      setLoading(false);
    }
  };

  const linkMedicationToCondition = async (medicationId: string, comorbidityId: string) => {
    try {
      const { data, error } = await supabase
        .from('medication_conditions')
        .insert({
          medication_id: medicationId,
          comorbidity_id: comorbidityId,
        })
        .select()
        .single();

      if (error) throw error;
      
      setMedicationConditions(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error linking medication to condition:', error);
      throw error;
    }
  };

  const unlinkMedicationFromCondition = async (medicationId: string, comorbidityId: string) => {
    try {
      const { error } = await supabase
        .from('medication_conditions')
        .delete()
        .eq('medication_id', medicationId)
        .eq('comorbidity_id', comorbidityId);

      if (error) throw error;
      
      setMedicationConditions(prev => 
        prev.filter(mc => !(mc.medication_id === medicationId && mc.comorbidity_id === comorbidityId))
      );
    } catch (error) {
      console.error('Error unlinking medication from condition:', error);
      throw error;
    }
  };

  const getMedicationsWithConditions = async () => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select(`
          id,
          name,
          dosage,
          medication_conditions(
            comorbidities(
              id,
              condition_name,
              status
            )
          )
        `)
        .eq('active', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching medications with conditions:', error);
      return [];
    }
  };

  const getConditionsForMedication = (medicationId: string) => {
    return medicationConditions.filter(mc => mc.medication_id === medicationId);
  };

  const getMedicationsForCondition = (comorbidityId: string) => {
    return medicationConditions.filter(mc => mc.comorbidity_id === comorbidityId);
  };

  useEffect(() => {
    fetchMedicationConditions();
  }, [user]);

  return {
    medicationConditions,
    loading,
    linkMedicationToCondition,
    unlinkMedicationFromCondition,
    getMedicationsWithConditions,
    getConditionsForMedication,
    getMedicationsForCondition,
    refetch: fetchMedicationConditions
  };
};
