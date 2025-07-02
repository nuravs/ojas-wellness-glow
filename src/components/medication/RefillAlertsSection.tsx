
import React from 'react';

interface RefillAlert {
  id: string;
  medicationName: string;
  daysLeft: number;
}

interface RefillAlertsSectionProps {
  refillAlerts: RefillAlert[];
  onRefillAction: (medicationName: string) => void;
  onDismissRefill: (id: string) => void;
}

const RefillAlertsSection: React.FC<RefillAlertsSectionProps> = ({
  refillAlerts,
  onRefillAction,
  onDismissRefill
}) => {
  if (refillAlerts.length === 0) return null;

  return (
    <>
      {refillAlerts.map(alert => (
        <div key={alert.id} className="mb-4">
          <div className="bg-ojas-alert/10 border-l-4 border-ojas-alert rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-ojas-text-main">Refill Reminder</h4>
                <p className="text-sm text-ojas-text-secondary">
                  {alert.medicationName} - {alert.daysLeft} days left
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onRefillAction(alert.medicationName)}
                  className="px-4 py-2 bg-ojas-alert text-white rounded-xl text-sm font-medium hover:bg-ojas-alert-hover transition-colors duration-200"
                  style={{ minHeight: '44px' }}
                >
                  Refill Now
                </button>
                <button
                  onClick={() => onDismissRefill(alert.id)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                  style={{ minHeight: '44px' }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default RefillAlertsSection;
