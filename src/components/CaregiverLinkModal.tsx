
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

interface CaregiverLinkModalProps {
  open: boolean;
  onClose: () => void;
}

const CaregiverLinkModal: React.FC<CaregiverLinkModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link a Caregiver</DialogTitle>
          <DialogDescription>
            This feature will allow patients to securely link their caregiver for support.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CaregiverLinkModal;
