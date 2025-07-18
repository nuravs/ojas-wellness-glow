
import React, { useState } from 'react';
import { AlertTriangle, Pill, Clock, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import RefillModal from './RefillModal';
import { RefillAlert } from '../../utils/refillUtils';

interface EnhancedRefillAlertsSectionProps {
  refillAlerts: RefillAlert[];
  onRefillAction: (medicationId: string, newPillCount: number) => void;
  onDismissRefill: (id: string) => void;
  loading?: boolean;
}

const EnhancedRefillAlertsSection: React.FC<EnhancedRefillAlertsSectionProps> = ({
  refillAlerts,
  onRefillAction,
  onDismissRefill,
  loading = false
}) => {
  const [selectedMedication, setSelectedMedication] = useState<{
    id: string;
    name: string;
    pillsRemaining: number;
  } | null>(null);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-ojas-cloud-gray rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-ojas-cloud-gray rounded"></div>
      </div>
    );
  }

  if (refillAlerts.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Pill className="h-12 w-12 text-ojas-success mx-auto mb-3" />
        <p className="text-ojas-text-secondary">All medications are well-stocked! 🎉</p>
      </Card>
    );
  }

  const handleRefillClick = (alert: RefillAlert) => {
    setSelectedMedication({
      id: alert.id,
      name: alert.medicationName,
      pillsRemaining: alert.pillsRemaining
    });
  };

  const handleRefillConfirm = async (newPillCount: number) => {
    if (selectedMedication) {
      await onRefillAction(selectedMedication.id, newPillCount);
      setSelectedMedication(null);
    }
  };

  const getUrgencyColor = (urgency: 'low' | 'medium' | 'high') => {
    switch (urgency) {
      case 'high':
        return 'bg-ojas-error/10 border-ojas-error text-ojas-error';
      case 'medium':
        return 'bg-ojas-alert/10 border-ojas-alert text-ojas-alert';
      default:
        return 'bg-ojas-primary/10 border-ojas-primary text-ojas-primary';
    }
  };

  const getUrgencyIcon = (urgency: 'low' | 'medium' | 'high') => {
    return urgency === 'high' ? (
      <AlertTriangle className="h-4 w-4" />
    ) : (
      <Clock className="h-4 w-4" />
    );
  };

  return (
    <>
      <div className="space-y-4">
        {refillAlerts.map(alert => (
          <Card 
            key={alert.id} 
            className={`p-4 border-l-4 ${
              alert.urgency === 'high' 
                ? 'border-l-ojas-error bg-ojas-error/5' 
                : alert.urgency === 'medium'
                ? 'border-l-ojas-alert bg-ojas-alert/5'
                : 'border-l-ojas-primary bg-ojas-primary/5'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={getUrgencyColor(alert.urgency)}>
                    {getUrgencyIcon(alert.urgency)}
                    <span className="ml-1 capitalize">{alert.urgency}</span>
                  </Badge>
                  <h4 className="font-semibold text-ojas-text-main">
                    {alert.medicationName}
                  </h4>
                </div>
                
                <p className="text-sm text-ojas-text-secondary">
                  <strong>{alert.daysLeft} days left</strong> • {alert.pillsRemaining} pills remaining
                </p>
                
                <p className="text-xs text-ojas-text-secondary">
                  Suggested refill by: {new Date(alert.nextRefillDate).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleRefillClick(alert)}
                  size="sm"
                  className="bg-ojas-primary hover:bg-ojas-primary-hover text-white"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <Pill className="h-4 w-4 mr-1" />
                  Refill
                </Button>
                <Button
                  onClick={() => onDismissRefill(alert.id)}
                  variant="ghost"
                  size="sm"
                  className="text-ojas-text-secondary hover:text-ojas-text-main"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <RefillModal
        isOpen={!!selectedMedication}
        onClose={() => setSelectedMedication(null)}
        medicationName={selectedMedication?.name || ''}
        currentPills={selectedMedication?.pillsRemaining || 0}
        onConfirm={handleRefillConfirm}
      />
    </>
  );
};

export default EnhancedRefillAlertsSection;
