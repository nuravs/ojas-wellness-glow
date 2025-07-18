
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AlertTriangle, Brain, Heart, Plus } from 'lucide-react';
import { useEvents, CreateEventData } from '@/hooks/useEvents';

interface EventLoggerModalProps {
  children: React.ReactNode;
  onEventLogged?: () => void;
}

const eventTypes = [
  {
    type: 'fall' as const,
    label: 'Fall',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    description: 'An actual fall that occurred'
  },
  {
    type: 'near-fall' as const,
    label: 'Near Fall',
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    description: 'Almost fell but caught yourself'
  },
  {
    type: 'confusion' as const,
    label: 'Confusion Episode',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    description: 'Episode of confusion or disorientation'
  },
  {
    type: 'emergency' as const,
    label: 'Emergency',
    icon: Heart,
    color: 'text-red-700',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    description: 'Medical emergency situation'
  },
  {
    type: 'other' as const,
    label: 'Other',
    icon: Plus,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    description: 'Other significant event'
  }
];

const EventLoggerModal: React.FC<EventLoggerModalProps> = ({ children, onEventLogged }) => {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<CreateEventData['event_type'] | null>(null);
  const [severity, setSeverity] = useState([1]);
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createEvent } = useEvents();

  const handleSubmit = async () => {
    if (!selectedType) return;

    setIsSubmitting(true);
    
    const eventData: CreateEventData = {
      event_type: selectedType,
      severity: severity[0],
      notes: notes.trim() || undefined,
      location: location.trim() || undefined,
    };

    const result = await createEvent(eventData);
    
    if (result) {
      // Reset form
      setSelectedType(null);
      setSeverity([1]);
      setNotes('');
      setLocation('');
      setOpen(false);
      onEventLogged?.();
    }
    
    setIsSubmitting(false);
  };

  const getSeverityLabel = (value: number) => {
    const labels = {
      1: 'Mild',
      2: 'Moderate', 
      3: 'Significant',
      4: 'Severe',
      5: 'Critical'
    };
    return labels[value as keyof typeof labels] || 'Mild';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-ojas-text-main dark:text-ojas-mist-white">
            Log an Event
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Type Selection */}
          <div>
            <Label className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-3 block">
              What happened?
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {eventTypes.map((eventType) => {
                const Icon = eventType.icon;
                return (
                  <button
                    key={eventType.type}
                    type="button"
                    onClick={() => setSelectedType(eventType.type)}
                    className={`p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                      selectedType === eventType.type
                        ? 'border-ojas-primary bg-ojas-primary/10'
                        : 'border-ojas-border dark:border-ojas-slate-gray hover:border-ojas-primary/50'
                    } ${eventType.bgColor}`}
                    style={{ minHeight: '44px' }}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 mt-1 ${eventType.color}`} />
                      <div>
                        <div className={`font-medium ${eventType.color}`}>
                          {eventType.label}
                        </div>
                        <div className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver mt-1">
                          {eventType.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedType && (
            <>
              {/* Severity */}
              <div>
                <Label className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-3 block">
                  Severity: {getSeverityLabel(severity[0])}
                </Label>
                <Slider
                  value={severity}
                  onValueChange={setSeverity}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                  aria-valuenow={severity[0]}
                  aria-valuetext={getSeverityLabel(severity[0])}
                />
                <div className="flex justify-between text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver mt-2">
                  <span>Mild</span>
                  <span>Critical</span>
                </div>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-2 block">
                  Location (optional)
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Kitchen, Bathroom, Living Room"
                  className="w-full"
                  style={{ minHeight: '44px' }}
                />
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes" className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-2 block">
                  Additional Notes (optional)
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional details about what happened..."
                  rows={3}
                  className="w-full resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-ojas-primary hover:bg-ojas-primary-hover text-white font-medium py-3"
                style={{ minHeight: '44px' }}
              >
                {isSubmitting ? 'Logging Event...' : 'Log Event'}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventLoggerModal;
