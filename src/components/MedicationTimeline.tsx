
import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

interface TimelineItem {
  time: string;
  completed: boolean;
  isOverdue?: boolean;
  isCurrent?: boolean;
}

interface MedicationTimelineProps {
  medications: Array<{
    id: string;
    name: string;
    time: string;
    taken: boolean;
  }>;
}

const MedicationTimeline: React.FC<MedicationTimelineProps> = ({ medications }) => {
  // Generate timeline items from medications
  const timelineItems: TimelineItem[] = medications.map(med => {
    const medTime = new Date();
    const [hours, minutes] = med.time.split(/[:\s]/);
    const isPM = med.time.toLowerCase().includes('pm');
    const hour24 = isPM && parseInt(hours) !== 12 ? parseInt(hours) + 12 : 
                  !isPM && parseInt(hours) === 12 ? 0 : parseInt(hours);
    
    medTime.setHours(hour24, parseInt(minutes) || 0, 0, 0);
    
    const now = new Date();
    const isOverdue = medTime < now && !med.taken;
    const isCurrent = Math.abs(medTime.getTime() - now.getTime()) < 30 * 60 * 1000; // Within 30 minutes
    
    return {
      time: med.time,
      completed: med.taken,
      isOverdue,
      isCurrent
    };
  });

  // Sort by time
  timelineItems.sort((a, b) => {
    const timeA = new Date(`2000/01/01 ${a.time}`);
    const timeB = new Date(`2000/01/01 ${b.time}`);
    return timeA.getTime() - timeB.getTime();
  });

  return (
    <div className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-border p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-6 h-6 text-ojas-primary" />
        <h3 className="text-lg font-semibold text-ojas-text-main">Today's Schedule</h3>
      </div>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-ojas-border rounded-full"></div>
        
        {/* Progress line */}
        <div 
          className="absolute top-6 left-0 h-1 bg-ojas-success rounded-full transition-all duration-500"
          style={{ 
            width: `${(timelineItems.filter(item => item.completed).length / timelineItems.length) * 100}%` 
          }}
        ></div>
        
        {/* Timeline items */}
        <div className="flex justify-between relative">
          {timelineItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Timeline dot */}
              <div className={`relative w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                item.completed 
                  ? 'bg-ojas-success border-ojas-success' 
                  : item.isOverdue 
                    ? 'bg-ojas-error border-ojas-error animate-pulse-urgent' 
                    : item.isCurrent
                      ? 'bg-ojas-primary border-ojas-primary animate-pulse-glow'
                      : 'bg-white border-ojas-border'
              }`}>
                {item.completed && (
                  <CheckCircle className="w-3 h-3 text-white absolute -top-0.5 -left-0.5" />
                )}
              </div>
              
              {/* Time label */}
              <span className={`text-sm font-medium mt-3 ${
                item.completed 
                  ? 'text-ojas-success' 
                  : item.isOverdue 
                    ? 'text-ojas-error' 
                    : 'text-ojas-text-secondary'
              }`}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicationTimeline;
