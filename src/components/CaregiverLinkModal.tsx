
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useCaregiverLinks } from '@/hooks/useCaregiverLinks';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface CaregiverLinkModalProps {
  open: boolean;
  onClose: () => void;
}

const CaregiverLinkModal: React.FC<CaregiverLinkModalProps> = ({ open, onClose }) => {
  const { 
    relationships,
    pendingRequestsForPatient,
    pendingRequestsFromCaregiver,
    approvedRelationships,
    isLoading,
    sendInvite,
    approveLink
  } = useCaregiverLinks();
  const { user, userProfile } = useAuth();
  const userId = user?.id;
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) return;
    
    setError('');
    setSending(true);
    
    try {
      await sendInvite(email);
      setEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleApprove = async (linkId: string) => {
    try {
      await approveLink(linkId);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const isPatient = userProfile?.role === 'patient';
  const isCaregiver = userProfile?.role === 'caregiver';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Caregiver Linking</DialogTitle>
          <DialogDescription>
            {isPatient ? 'Invite a caregiver to help manage your health data.' : 'Manage your caregiver requests.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isPatient && (
            <>
              <div className="space-y-2">
                <Input
                  placeholder="Enter caregiver email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button 
                  onClick={handleInvite} 
                  disabled={isLoading || sending || !email.trim()}
                  className="w-full"
                >
                  {sending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                  Send Invite
                </Button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              {approvedRelationships.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Your Caregivers:</h3>
                  <ul className="space-y-1">
                    {approvedRelationships
                      .filter(link => link.patient_id === userId)
                      .map((link) => (
                        <li key={link.id} className="text-sm">
                          {link.caregiver_profile?.full_name || 'Unknown Caregiver'}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {pendingRequestsForPatient.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Pending Invitations:</h3>
                  <ul className="space-y-1">
                    {pendingRequestsForPatient.map((link) => (
                      <li key={link.id} className="text-sm text-gray-600">
                        Invited: {link.caregiver_profile?.full_name || 'Unknown'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {isCaregiver && (
            <div>
              <h3 className="font-semibold mb-2">Patient Requests:</h3>
              {pendingRequestsFromCaregiver.length > 0 ? (
                <ul className="space-y-2">
                  {pendingRequestsFromCaregiver.map((link) => (
                    <li key={link.id} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">
                        Patient: {link.patient_profile?.full_name || 'Unknown Patient'}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(link.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Approve'}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">No pending requests</p>
              )}

              {approvedRelationships.filter(r => r.caregiver_id === userId).length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Your Patients:</h3>
                  <ul className="space-y-1">
                    {approvedRelationships
                      .filter(link => link.caregiver_id === userId)
                      .map((link) => (
                        <li key={link.id} className="text-sm">
                          {link.patient_profile?.full_name || 'Unknown Patient'}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CaregiverLinkModal;
