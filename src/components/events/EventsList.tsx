
import React from 'react';
import { format } from 'date-fns';
import { AlertTriangle, Brain, Heart, Plus, MapPin, FileText, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEvents, Event } from '@/hooks/useEvents';
import { useToast } from '@/hooks/use-toast';

interface EventsListProps {
  events: Event[];
  onEventDeleted?: () => void;
}

const eventTypeConfig = {
  fall: {
    label: 'Fall',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    badgeColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  },
  'near-fall': {
    label: 'Near Fall',
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
  },
  confusion: {
    label: 'Confusion',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
  },
  emergency: {
    label: 'Emergency',
    icon: Heart,
    color: 'text-red-700',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    badgeColor: 'bg-red-200 text-red-900 dark:bg-red-900/40 dark:text-red-200'
  },
  other: {
    label: 'Other',
    icon: Plus,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    badgeColor: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }
};

const severityLabels = {
  1: 'Mild',
  2: 'Moderate',
  3: 'Significant',
  4: 'Severe',
  5: 'Critical'
};

const EventsList: React.FC<EventsListProps> = ({ events, onEventDeleted }) => {
  const { deleteEvent } = useEvents();
  const { toast } = useToast();

  const handleDelete = async (eventId: string, eventType: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete this ${eventType} event?`);
    if (!confirmed) return;

    const success = await deleteEvent(eventId);
    if (success) {
      onEventDeleted?.();
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-ojas-text-secondary dark:text-ojas-cloud-silver mx-auto mb-4" />
        <h3 className="text-lg font-medium text-ojas-text-main dark:text-ojas-mist-white mb-2">
          No Events Logged
        </h3>
        <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver">
          Use the "Log Event" button to record falls, near-falls, or other important events.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const config = eventTypeConfig[event.event_type];
        const Icon = config.icon;
        
        return (
          <Card key={event.id} className="border-l-4 border-l-ojas-primary">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={config.badgeColor}>
                        {config.label}
                      </Badge>
                      <Badge variant="outline">
                        {severityLabels[event.severity as keyof typeof severityLabels]}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver mb-2">
                      {format(new Date(event.logged_at), 'PPp')}
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center gap-1 text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    
                    {event.notes && (
                      <div className="flex items-start gap-1 text-sm text-ojas-text-main dark:text-ojas-mist-white">
                        <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p className="leading-relaxed">{event.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(event.id, config.label.toLowerCase())}
                  className="text-ojas-text-secondary hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                  aria-label={`Delete ${config.label.toLowerCase()} event`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EventsList;
