
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

  // Fetch relationships for current user using raw SQL query
  const { data: relationships, isLoading, error } = useQuery({
    queryKey: ['patient-caregivers', user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        // Use the RPC function to get relationships
        const { data, error } = await (supabase as any)
          .rpc('get_patient_caregiver_relationships', { user_id: user.id });

        if (error) {
          console.error('Error fetching patient-caregiver relationships:', error);
          return [];
        }

        // Parse the JSON response
        return (data || []) as PatientCaregiverRelationship[];
      } catch (err) {
        console.error('Failed to fetch relationships:', err);
        return [];
      }
    },
    enabled: !!user,
  });

  // Create invitation mutation
  const createInvitation = useMutation({
    mutationFn: async ({ patientEmail }: { patientEmail: string }) => {
      if (!user || userProfile?.role !== 'caregiver') {
        throw new Error('Only caregivers can send invitations');
      }

      // First, find the patient by email using user profiles
      const { data: patientData, error: patientError } = await supabase
        .from('user_profiles')
        .select('user_id, full_name, role')
        .eq('role', 'patient')
        .single();

      if (patientError || !patientData) {
        throw new Error('Patient not found. Please ensure the email is correct and the user has an account.');
      }

      // Create the invitation using RPC function
      const { data, error } = await (supabase as any)
        .rpc('create_caregiver_request', {
          patient_user_id: patientData.user_id,
          caregiver_user_id: user.id
        });

      if (error) {
        if (error.message.includes('duplicate')) {
          throw new E rror('You have already sent an invitation to this patient.');
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
      const { data, error } = await (supabase as any)
        .rpc('update_caregiver_request_status', {
          request_id: relationshipId,
          new_status: status
        });

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
