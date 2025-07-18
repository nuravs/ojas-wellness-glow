
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Mail, Send } from 'lucide-react';
import { usePatientCaregivers } from '@/hooks/usePatientCaregivers';

interface CaregiverInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CaregiverInvitationModal: React.FC<CaregiverInvitationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [patientEmail, setPatientEmail] = useState('');
  const { createInvitation } = usePatientCaregivers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientEmail.trim()) return;

    try {
      await createInvitation.mutateAsync({ patientEmail: patientEmail.trim() });
      setPatientEmail('');
      onClose();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-ojas-primary-blue" />
            Connect with a Patient
          </DialogTitle>
          <DialogDescription>
            Send an invitation to connect with a patient. They will need to approve your request before you can access their health data.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient-email">Patient's Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ojas-slate-gray" />
              <Input
                id="patient-email"
                type="email"
                placeholder="patient@example.com"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <p className="text-sm text-ojas-slate-gray">
              Make sure this is the email address the patient used to create their OJAS account.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createInvitation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!patientEmail.trim() || createInvitation.isPending}
              className="bg-ojas-primary-blue hover:bg-blue-600"
            >
              {createInvitation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CaregiverInvitationModal;
