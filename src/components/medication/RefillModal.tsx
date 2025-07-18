
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Pill, Package } from 'lucide-react';

interface RefillModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicationName: string;
  currentPills: number;
  onConfirm: (newPillCount: number) => void;
}

const RefillModal: React.FC<RefillModalProps> = ({
  isOpen,
  onClose,
  medicationName,
  currentPills,
  onConfirm
}) => {
  const [newPillCount, setNewPillCount] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pillCount = parseInt(newPillCount);
    
    if (isNaN(pillCount) || pillCount <= 0) {
      return;
    }

    setLoading(true);
    await onConfirm(pillCount);
    setLoading(false);
    onClose();
    setNewPillCount('');
  };

  const handleClose = () => {
    setNewPillCount('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-ojas-primary" />
            Refill {medicationName}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-ojas-text-secondary">
              <Pill className="h-4 w-4" />
              <span>Current: {currentPills} pills remaining</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPillCount">
              New pill count after refill
            </Label>
            <Input
              id="newPillCount"
              type="number"
              min="1"
              value={newPillCount}
              onChange={(e) => setNewPillCount(e.target.value)}
              placeholder="Enter total pills after refill"
              className="text-lg"
              style={{ minHeight: '44px' }}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              style={{ minHeight: '44px' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !newPillCount}
              className="flex-1 bg-ojas-primary hover:bg-ojas-primary-hover"
              style={{ minHeight: '44px' }}
            >
              {loading ? 'Updating...' : 'Update Refill'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RefillModal;
