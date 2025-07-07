
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './use-toast';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  medication_id?: string;
}

export const useMedications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadMedications = async () => {
    if (!user) return;

    try {
      console.log('Loading medications for user:', user.id);
      
      // Get user's medications
      const { data: userMedications, error: medsError } = await supabase
        .from('medications')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: true });

      if (medsError) {
        console.error('Error loading medications:', medsError);
        toast({
          title: "Error loading medications",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
        return;
      }

      // Get today's medication logs
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data: todayLogs, error: logsError } = await supabase
        .from('medication_logs')
        .select('*')
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString())
        .eq('status', 'taken');

      if (logsError) {
        console.error('Error loading medication logs:', logsError);
      }

      // Transform medications to match the expected format
      const transformedMedications: Medication[] = (userMedications || []).flatMap(med => {
        const frequency = med.frequency as { times?: string[] } || { times: ['8:00 AM'] };
        const times = frequency.times || ['8:00 AM'];
        
        return times.map(time => ({
          id: `${med.id}-${time}`,
          medication_id: med.id,
          name: med.name,
          dosage: med.dosage,
          time: time,
          taken: (todayLogs || []).some(log => 
            log.medication_id === med.id && 
            log.scheduled_time && 
            new Date(log.scheduled_time).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            }) === time
          )
        }));
      });

      setMedications(transformedMedications);
    } catch (error) {
      console.error('Error in loadMedications:', error);
      toast({
        title: "Error loading data",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMedication = async (id: string) => {
    const medication = medications.find(med => med.id === id);
    if (!medication || !user) return;

    try {
      if (!medication.taken) {
        // Mark as taken - create a log entry
        const scheduledTime = new Date();
        const [timeStr, period] = medication.time.split(' ');
        const [hours, minutes] = timeStr.split(':').map(Number);
        let adjustedHours = hours;
        if (period === 'PM' && hours !== 12) adjustedHours += 12;
        if (period === 'AM' && hours === 12) adjustedHours = 0;
        
        scheduledTime.setHours(adjustedHours, minutes, 0, 0);

        const { error } = await supabase
          .from('medication_logs')
          .insert({
            medication_id: medication.medication_id || medication.id.split('-')[0],
            user_id: user.id,
            scheduled_time: scheduledTime.toISOString(),
            actual_time: new Date().toISOString(),
            status: 'taken',
            notes: 'Marked as taken via app'
          });

        if (error) {
          console.error('Error logging medication:', error);
          toast({
            title: "Error",
            description: "Failed to mark medication as taken",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Great job! 🎉",
          description: `${medication.name} marked as taken.`,
          duration: 3000,
        });
      } else {
        // Mark as not taken - remove the log entry
        const medicationId = medication.medication_id || medication.id.split('-')[0];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { error } = await supabase
          .from('medication_logs')
          .delete()
          .eq('medication_id', medicationId)
          .eq('user_id', user.id)
          .eq('status', 'taken')
          .gte('created_at', today.toISOString())
          .lt('created_at', tomorrow.toISOString());

        if (error) {
          console.error('Error removing medication log:', error);
          toast({
            title: "Error",
            description: "Failed to update medication status",
            variant: "destructive"
          });
          return;
        }
      }

      // Update local state
      setMedications(prev => 
        prev.map(med => 
          med.id === id 
            ? { ...med, taken: !med.taken }
            : med
        )
      );

    } catch (error) {
      console.error('Error in toggleMedication:', error);
      toast({
        title: "Error",
        description: "Failed to update medication",
        variant: "destructive"
      });
    }
  };

  const postponeMedication = async (id: string) => {
    const medication = medications.find(med => med.id === id);
    if (!medication || !user) return;

    try {
      const scheduledTime = new Date();
      const [timeStr, period] = medication.time.split(' ');
      const [hours, minutes] = timeStr.split(':').map(Number);
      let adjustedHours = hours;
      if (period === 'PM' && hours !== 12) adjustedHours += 12;
      if (period === 'AM' && hours === 12) adjustedHours = 0;
      
      scheduledTime.setHours(adjustedHours, minutes, 0, 0);

      const { error } = await supabase
        .from('medication_logs')
        .insert({
          medication_id: medication.medication_id || medication.id.split('-')[0],
          user_id: user.id,
          scheduled_time: scheduledTime.toISOString(),
          actual_time: null,
          status: 'postponed',
          notes: 'Postponed for 30 minutes'
        });

      if (error) {
        console.error('Error postponing medication:', error);
        toast({
          title: "Error",
          description: "Failed to postpone medication",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Reminder set",
        description: `We'll remind you about ${medication.name} in 30 minutes.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error in postponeMedication:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadMedications();
    }
  }, [user]);

  return {
    medications,
    loading,
    toggleMedication,
    postponeMedication,
    refetch: loadMedications
  };
};
