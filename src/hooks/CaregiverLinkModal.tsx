import React, { useState } from 'react';
import { useCaregiverLinks } from '@/hooks/useCaregiverLinks';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface CaregiverLinkModalProps {
  open: boolean;
  onClose: () => void;
}

export const CaregiverLinkModal: React.FC<CaregiverLinkModalProps> = ({ open, onClose }) => {
  const { caregiverLinks, sendInvite, approveLink, isLoading } = useCaregiverLinks();
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleInvite = async () => {
    setError('');
    try {
      await sendInvite(email);
      setEmail('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const isPatient = caregiverLinks.some((link) => link.patient_id === userId);
  const isCaregiver = caregiverLinks.some((link) => link.caregiver_id === userId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Caregiver Linking</DialogTitle>
        </DialogHeader>

        {isPatient && (
          <>
            <div className="space-y-2">
              <Input
                placeholder="Enter caregiver email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleInvite} disabled={isLoading || !email}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Send Invite'}
              </Button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Your Caregivers:</h3>
              <ul className="space-y-1">
                {caregiverLinks.map((link) =>
                  link.patient_id === userId ? (
                    <li key={link.id}>
                      {link.status} - {link.caregiver_id}
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          </>
        )}

        {isCaregiver && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Link Requests:</h3>
            <ul className="space-y-2">
              {caregiverLinks.map((link) =>
                link.caregiver_id === userId && !link.approved_at ? (
                  <li key={link.id}>
                    Patient: {link.patient_id}
                    <Button
                      className="ml-2"
                      onClick={() => approveLink(link.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="animate-spin" /> : 'Approve'}
                    </Button>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
