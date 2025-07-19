
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './use-toast';

export interface MedicationLog {
  id: string;
  medication_id: string;
  user_id: string;
  logged_by: string;
  status: string;
  scheduled_time?: string;
  actual_time?: string;
  notes?: string;
  created_at: string;
}

export const useMedicationLogs = () => {
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadMedicationLogs = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Loading medication logs for user:', user.id);
      
      // Use the database function to fetch medication logs from staging
      const { data, error } = await supabase
        .rpc('get_user_medication_logs', { logs_user_id: user.id });

      if (error) {
        console.error('Error loading medication logs:', error);
        toast({
          title: "Error loading medication logs",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
        return;
      }

      console.log('Medication logs data received:', data);
      
      // The RPC function returns JSON array directly
      const logsArray = Array.isArray(data) ? data : [];
      setMedicationLogs((logsArray as unknown as MedicationLog[]) || []);
    } catch (error) {
      console.error('Error in loadMedicationLogs:', error);
      toast({
        title: "Connection Error",
        description: "Please check your connection and try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getLogsForMedication = (medicationId: string): MedicationLog[] => {
    return medicationLogs.filter(log => log.medication_id === medicationId);
  };

  const getRecentLogs = (days: number = 7): MedicationLog[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return medicationLogs.filter(log => 
      new Date(log.created_at) >= cutoffDate
    );
  };

  const getLogsByStatus = (status: string): MedicationLog[] => {
    return medicationLogs.filter(log => log.status === status);
  };

  useEffect(() => {
    loadMedicationLogs();
  }, [user]);

  return {
    medicationLogs,
    loading,
    getLogsForMedication,
    getRecentLogs,
    getLogsByStatus,
    refetch: loadMedicationLogs
  };
};
