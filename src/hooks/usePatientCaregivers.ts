
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface PatientCaregiverRelationship {
  id: string;
  patient_id: string;
  caregiver_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  approved_at?: string;
  patient_profile?: {
    full_name: string;
    user_id: string;
  };
  caregiver_profile?: {
    full_name: string;
    user_id: string;
  };
}

export const usePatientCaregivers = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch relationships for current user
  const { data: relationships, isLoading, error } = useQuery({
    queryKey: ['patient-caregivers', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('patient_caregivers')
        .select(`
          *,
          patient_profile:user_profiles!patient_caregivers_patient_id_fkey(full_name, user_id),
          caregiver_profile:user_profiles!patient_caregivers_caregiver_id_fkey(full_name, user_id)
        `)
        .or(`patient_id.eq.${user.id},caregiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patient-caregiver relationships:', error);
        throw error;
      }

      return data as PatientCaregiverRelationship[];
    },
    enabled: !!user,
  });

  // Create invitation mutation
  const createInvitation = useMutation({
    mutationFn: async ({ patientEmail }: { patientEmail: string }) => {
      if (!user || userProfile?.role !== 'caregiver') {
        throw new Error('Only caregivers can send invitations');
      }

      // First, find the patient by email
      const { data: patientData, error: patientError } = await supabase
        .from('user_profiles')
        .select('user_id, full_name, role')
        .eq('user_id', (await supabase.auth.admin.getUserByEmail?.(patientEmail))?.data.user?.id || '')
        .eq('role', 'patient')
        .single();

      if (patientError || !patientData) {
        throw new Error('Patient not found. Please ensure the email is correct and the user has an account.');
      }

      // Create the invitation
      const { data, error } = await supabase
        .from('patient_caregivers')
        .insert({
          patient_id: patientData.user_id,
          caregiver_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('You have already sent an invitation to this patient.');
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Invitation sent",
        description: "Your invitation has been sent to the patient for approval.",
      });
      queryClient.invalidateQueries({ queryKey: ['patient-caregivers'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send invitation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update relationship status mutation
  const updateRelationshipStatus = useMutation({
    mutationFn: async ({ 
      relationshipId, 
      status 
    }: { 
      relationshipId: string; 
      status: 'approved' | 'rejected' 
    }) => {
      const updateData: any = { status };
      if (status === 'approved') {
        updateData.approved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('patient_caregivers')
        .update(updateData)
        .eq('id', relationshipId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      const message = variables.status === 'approved' 
        ? "Caregiver access approved successfully" 
        : "Caregiver request declined";
      
      toast({
        title: "Request updated",
        description: message,
      });
      queryClient.invalidateQueries({ queryKey: ['patient-caregivers'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const pendingRequests = relationships?.filter(r => r.status === 'pending') || [];
  const approvedRelationships = relationships?.filter(r => r.status === 'approved') || [];
  
  const pendingRequestsForPatient = pendingRequests.filter(r => r.patient_id === user?.id);
  const pendingRequestsFromCaregiver = pendingRequests.filter(r => r.caregiver_id === user?.id);

  return {
    relationships: relationships || [],
    pendingRequests,
    approvedRelationships,
    pendingRequestsForPatient,
    pendingRequestsFromCaregiver,
    isLoading,
    error,
    createInvitation,
    updateRelationshipStatus,
  };
};
