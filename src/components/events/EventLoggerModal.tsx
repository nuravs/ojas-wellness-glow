
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Heart, Brain, Plus } from 'lucide-react';
import { useEvents } from '../../hooks/useEvents';
import { toast } from '../../hooks/use-toast';

interface EventLoggerModalProps {
  children: React.ReactNode;
  onEventLogged?: () => void;
}

const EventLoggerModal: React.FC<EventLoggerModalProps> = ({ 
  children, 
  onEventLogged 
}) => {
  const [open, setOpen] = useState(false);
  const [eventType, setEventType] = useState<'fall' | 'near-fall' | 'confusion' | 'emergency' | 'other'>('fall');
  const [severity, setSeverity] = useState(1);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createEvent } = useEvents();

  const eventTypes = [
    { 
      value: 'fall' as const, 
      label: 'Fall', 
      description: 'An actual fall that occurred',
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
    },
    { 
      value: 'near-fall' as const, 
      label: 'Near Fall', 
      description: 'Almost fell but caught yourself',
      icon: AlertTriangle,
      color: 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
    },
    { 
      value: 'confusion' as const, 
      label: 'Confusion Episode', 
      description: 'Episode of confusion or disorientation',
      icon: Brain,
      color: 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'
    },
    { 
      value: 'emergency' as const, 
      label: 'Emergency', 
      description: 'Medical emergency situation',
      icon: Heart,
      color: 'text-red-700 bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700'
    },
    { 
      value: 'other' as const, 
      label: 'Other', 
      description: 'Other significant event',
      icon: Plus,
      color: 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-700'
    }
  ];

  const severityLevels = [
    { value: 1, label: 'Mild', color: 'bg-green-500' },
    { value: 2, label: 'Moderate', color: 'bg-yellow-500' },
    { value: 3, label: 'Severe', color: 'bg-orange-500' },
    { value: 4, label: 'Critical', color: 'bg-red-500' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createEvent({
        event_type: eventType,
        severity,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined
      });

      if (result) {
        // Reset form
        setEventType('fall');
        setSeverity(1);
        setLocation('');
        setNotes('');
        setOpen(false);
        onEventLogged?.();
        
        toast({
          title: "Event logged successfully",
          description: `${eventType.replace('-', ' ')} has been recorded`,
        });
      }
    } catch (error) {
      console.error('Error logging event:', error);
      toast({
        title: "Error logging event",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEventType = eventTypes.find(type => type.value === eventType);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-ojas-charcoal-gray">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white">
            Log an Event
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-ojas-text-main dark:text-ojas-mist-white">
              Event Type
            </Label>
            <div className="grid gap-3">
              {eventTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setEventType(type.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      eventType === type.value
                        ? `${type.color} border-current shadow-md`
                        : 'bg-white dark:bg-ojas-slate-gray border-ojas-border dark:border-ojas-slate-gray hover:border-ojas-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-5 h-5 ${
                        eventType === type.value 
                          ? 'text-current' 
                          : 'text-ojas-text-secondary'
                      }`} />
                      <div>
                        <h3 className={`font-semibold ${
                          eventType === type.value 
                            ? 'text-current' 
                            : 'text-ojas-text-main dark:text-ojas-mist-white'
                        }`}>
                          {type.label}
                        </h3>
                        <p className={`text-sm ${
                          eventType === type.value 
                            ? 'text-current opacity-80' 
                            : 'text-ojas-text-secondary dark:text-ojas-cloud-silver'
                        }`}>
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-ojas-text-main dark:text-ojas-mist-white">
              Severity
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {severityLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setSeverity(level.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                    severity === level.value
                      ? `${level.color} text-white border-current shadow-md`
                      : 'bg-white dark:bg-ojas-slate-gray border-ojas-border dark:border-ojas-slate-gray text-ojas-text-main dark:text-ojas-mist-white hover:border-ojas-primary'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-base font-medium text-ojas-text-main dark:text-ojas-mist-white">
              Location (optional)
            </Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Kitchen, Bathroom, Living Room"
              className="w-full border-ojas-border dark:border-ojas-slate-gray"
              style={{ minHeight: '44px' }}
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-medium text-ojas-text-main dark:text-ojas-mist-white">
              Additional Notes (optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details about the event..."
              className="w-full min-h-[100px] border-ojas-border dark:border-ojas-slate-gray"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              style={{ minHeight: '44px' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-ojas-primary hover:bg-ojas-primary-hover text-white"
              style={{ minHeight: '44px' }}
            >
              {isSubmitting ? 'Logging...' : 'Log Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventLoggerModal;
