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
  caregiver_visible?: boolean;
  logged_by?: string;
  logged_by_role?: 'patient' | 'caregiver';
}

export const useMedications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetPatientId, setTargetPatientId] = useState<string | null>(null);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const isCaregiver = userProfile?.role === 'caregiver';

  const fetchLinkedPatientId = async () => {
    if (!user || !isCaregiver) {
      setTargetPatientId(user?.id ?? null);
      return;
    }

    try {
      // Use raw query to avoid TypeScript issues with patient_caregivers table
      const { data, error } = await supabase.rpc('get_patient_caregiver_relationships', {
        user_id: user.id
      });

      if (error) {
        console.error('Error fetching linked patient:', error.message);
        toast({
          title: 'Access Error',
          description: 'Could not verify caregiver access.',
          variant: 'destructive',
        });
        setTargetPatientId(null);
      } else {
        // Parse the JSON data and find approved relationship where current user is caregiver
        const relationships = Array.isArray(data) ? data : (data ? JSON.parse(data) : []);
        const approvedRelationship = relationships.find((rel: any) => 
          rel.caregiver_id === user.id && rel.status === 'approved'
        );
        setTargetPatientId(approvedRelationship?.patient_id ?? null);
      }
    } catch (err) {
      console.error('Unexpected error in fetchLinkedPatientId:', err);
      setTargetPatientId(null);
    }
  };

  const loadMedications = async () => {
    console.log('loadMedications called, user:', !!user);

    if (!targetPatientId) {
      console.log('No patient ID, setting loading to false');
      setMedications([]);
      setLoading(false);
      return;
    }

    try {
      const { data: userMedications, error: medsError } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', targetPatientId)
        .eq('active', true)
        .order('created_at', { ascending: true });

      if (medsError) {
        console.error('Error loading medications:', medsError);
        toast({
          title: "Error loading medications",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data: todayLogs, error: logsError } = await supabase
        .from('medication_logs')
        .select('*')
        .eq('user_id', targetPatientId)
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString())
        .eq('status', 'taken');

      if (logsError) {
        console.error('Error loading medication logs:', logsError);
      }

      const transformedMedications: Medication[] = (userMedications || []).flatMap(med => {
        const frequency = med.frequency as { times?: string[] } || { times: ['8:00 AM'] };
        const times = frequency.times || ['8:00 AM'];

        return times.map(time => {
          const log = (todayLogs || []).find(log =>
            log.medication_id === med.id &&
            log.scheduled_time &&
            new Date(log.scheduled_time).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }) === time
          );

          return {
            id: `${med.id}-${time}`,
            medication_id: med.id,
            name: med.name,
            dosage: med.dosage,
            time: time,
            taken: !!log,
            caregiver_visible: med.caregiver_visible,
            logged_by: log?.logged_by,
            logged_by_role: log?.logged_by
              ? (log.logged_by === user?.id ? 'patient' : 'caregiver')
              : undefined
          };
        });
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
            user_id: targetPatientId,
            logged_by: user.id,
            scheduled_time: scheduledTime.toISOString(),
            actual_time: new Date().toISOString(),
            status: 'taken',
            notes: `Marked as taken via app by ${userProfile?.role || 'user'}`
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
        const medicationId = medication.medication_id || medication.id.split('-')[0];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { error } = await supabase
          .from('medication_logs')
          .delete()
          .eq('medication_id', medicationId)
          .eq('user_id', targetPatientId)
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

      setMedications(prev =>
        prev.map(med =>
          med.id === id
            ? {
                ...med,
                taken: !med.taken,
                logged_by: !med.taken ? user.id : undefined,
                logged_by_role: !med.taken ? (userProfile?.role as 'patient' | 'caregiver') : undefined
              }
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

  const toggleCaregiverVisibility = async (medicationId: string) => {
    try {
      const realMedId = medicationId.includes('-') ? medicationId.split('-')[0] : medicationId;
      const currentMed = medications.find(m => m.medication_id === realMedId);
      const newVisibility = !currentMed?.caregiver_visible;

      const { error } = await supabase
        .from('medications')
        .update({ caregiver_visible: newVisibility })
        .eq('id', realMedId);

      if (error) {
        console.error('Error updating caregiver visibility:', error);
        toast({
          title: "Error",
          description: "Failed to update privacy settings",
          variant: "destructive"
        });
        return;
      }

      setMedications(prev =>
        prev.map(med =>
          med.medication_id === realMedId
            ? { ...med, caregiver_visible: newVisibility }
            : med
        )
      );

      toast({
        title: "Privacy updated",
        description: `Medication is now ${newVisibility ? 'visible' : 'hidden'} to caregivers`,
        duration: 3000,
      });

    } catch (error) {
      console.error('Error in toggleCaregiverVisibility:', error);
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
          user_id: targetPatientId,
          logged_by: user.id,
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
    fetchLinkedPatientId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isCaregiver]);

  useEffect(() => {
    loadMedications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetPatientId]);

  return {
    medications,
    loading,
    toggleMedication,
    postponeMedication,
    toggleCaregiverVisibility,
    refetch: loadMedications
  };
};
