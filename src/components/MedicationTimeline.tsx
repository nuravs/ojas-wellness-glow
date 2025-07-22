
import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

interface MedicationTimelineProps {
  medications: Medication[];
  onToggleMedication?: (id: string) => void;
  onPostponeMedication?: (id: string) => void;
}

const MedicationTimeline: React.FC<MedicationTimelineProps> = ({ 
  medications, 
  onToggleMedication, 
  onPostponeMedication 
}) => {
  if (!medications || medications.length === 0) {
    return (
      <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-ojas-primary" />
          <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
            Today's Schedule
          </h3>
        </div>
        <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver text-center">
          No medications scheduled for today
        </p>
      </div>
    );
  }

  // Sort medications by time
  const sortedMedications = [...medications].sort((a, b) => {
    const timeA = new Date(`2000/01/01 ${a.time}`);
    const timeB = new Date(`2000/01/01 ${b.time}`);
    return timeA.getTime() - timeB.getTime();
  });

  // Get current time for comparison
  const now = new Date();
  const currentTimeString = now.toTimeString().slice(0, 5);

  const getTimeStatus = (medTime: string, taken: boolean) => {
    if (taken) return 'completed';
    
    const medTimeDate = new Date(`2000/01/01 ${medTime}`);
    const currentTimeDate = new Date(`2000/01/01 ${currentTimeString}`);
    
    if (medTimeDate < currentTimeDate) return 'overdue';
    if (medTimeDate.getTime() - currentTimeDate.getTime() <= 30 * 60000) return 'upcoming'; // 30 minutes
    return 'scheduled';
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-ojas-primary" />
        <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
          Today's Schedule
        </h3>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-ojas-border dark:bg-ojas-slate-gray"></div>

        <div className="space-y-6">
          {sortedMedications.map((medication, index) => {
            const status = getTimeStatus(medication.time, medication.taken);
            
            return (
              <div key={medication.id} className="relative flex items-start gap-4">
                {/* Timeline dot */}
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                  status === 'completed' 
                    ? 'bg-ojas-success' 
                    : status === 'overdue'
                    ? 'bg-ojas-error'
                    : status === 'upcoming'
                    ? 'bg-ojas-alert'
                    : 'bg-ojas-border dark:bg-ojas-slate-gray'
                }`}>
                  {status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : status === 'overdue' ? (
                    <AlertCircle className="w-4 h-4 text-white" />
                  ) : (
                    <Clock className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Medication info */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-ojas-text-main dark:text-ojas-mist-white">
                      {medication.name}
                    </h4>
                    <span className={`text-sm font-medium px-2 py-1 rounded ${
                      status === 'completed'
                        ? 'bg-ojas-success/10 text-ojas-success'
                        : status === 'overdue'
                        ? 'bg-ojas-error/10 text-ojas-error'
                        : status === 'upcoming'
                        ? 'bg-ojas-alert/10 text-ojas-alert'
                        : 'bg-ojas-border/10 text-ojas-text-secondary'
                    }`}>
                      {status === 'completed' ? 'Taken' : 
                       status === 'overdue' ? 'Overdue' :
                       status === 'upcoming' ? 'Soon' : 'Scheduled'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver mb-1">
                    {medication.dosage}
                  </p>
                  
                  <p className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white">
                    {formatTime(medication.time)}
                  </p>

                  {/* Action buttons */}
                  {!medication.taken && (onToggleMedication || onPostponeMedication) && (
                    <div className="flex gap-2 mt-3">
                      {onToggleMedication && (
                        <button
                          onClick={() => onToggleMedication(medication.id)}
                          className="px-3 py-1 text-sm bg-ojas-success text-white rounded-md hover:bg-ojas-success/90 transition-colors"
                        >
                          Take
                        </button>
                      )}
                      {onPostponeMedication && (
                        <button
                          onClick={() => onPostponeMedication(medication.id)}
                          className="px-3 py-1 text-sm bg-ojas-text-secondary text-white rounded-md hover:bg-ojas-text-secondary/90 transition-colors"
                        >
                          Later
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-ojas-border dark:border-ojas-slate-gray">
        <div className="flex justify-between text-sm">
          <span className="text-ojas-text-secondary dark:text-ojas-cloud-silver">
            Completed: {medications.filter(m => m.taken).length}/{medications.length}
          </span>
          <span className="text-ojas-text-secondary dark:text-ojas-cloud-silver">
            Remaining: {medications.filter(m => !m.taken).length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MedicationTimeline;
