import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './use-toast';

export interface Appointment {
  id: string;
  user_id: string;
  appointment_date: string;
  appointment_time: string;
  doctor_name: string;
  appointment_type: string;
  location?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadAppointments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true });

      if (error) {
        // If table doesn't exist yet, just return empty array
        if (error.code === '42P01') {
          setAppointments([]);
          setLoading(false);
          return;
        }
        
        console.error('Error loading appointments:', error);
        toast({
          title: "Error loading appointments",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
        return;
      }

      setAppointments(data || []);
    } catch (error) {
      console.error('Error in loadAppointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNextAppointment = (): Appointment | null => {
    const now = new Date();
    const upcoming = appointments.filter(apt => 
      apt.status === 'scheduled' && 
      new Date(`${apt.appointment_date}T${apt.appointment_time}`) > now
    );
    
    return upcoming.length > 0 ? upcoming[0] : null;
  };

  const getFormattedNextAppointment = (): string => {
    const next = getNextAppointment();
    if (!next) return "No appointments scheduled";
    
    const aptDate = new Date(`${next.appointment_date}T${next.appointment_time}`);
    return aptDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    loadAppointments();
  }, [user]);

  return {
    appointments,
    loading,
    getNextAppointment,
    getFormattedNextAppointment,
    refetch: loadAppointments
  };
};