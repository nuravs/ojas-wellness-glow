
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import EventLoggerModal from '@/components/events/EventLoggerModal';
import EventsList from '@/components/events/EventsList';
import { useEvents } from '@/hooks/useEvents';

interface EventsPageProps {
  userRole?: 'patient' | 'caregiver';
}

const EventsPage: React.FC<EventsPageProps> = ({ userRole = 'patient' }) => {
  const { events, loading, refetch } = useEvents();

  const handleEventLogged = () => {
    refetch();
  };

  const handleEventDeleted = () => {
    refetch();
  };

  if (loading) {
    return (
      <SafeAreaContainer>
        <div className="flex items-center justify-center min-h-64">
          <div className="w-8 h-8 border-4 border-ojas-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ojas-text-main dark:text-ojas-mist-white mb-2">
            Events Log
          </h1>
          <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver text-base">
            Track important events like falls, near-falls, and confusion episodes
          </p>
        </div>

        {/* Log Event Button */}
        <div className="flex justify-center">
          <EventLoggerModal onEventLogged={handleEventLogged}>
            <Button
              className="bg-ojas-primary hover:bg-ojas-primary-hover text-white font-medium px-6 py-3 rounded-xl shadow-ojas-medium"
              style={{ minHeight: '44px' }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Log an Event
            </Button>
          </EventLoggerModal>
        </div>

        {/* Events List */}
        <EventsList 
          events={events} 
          onEventDeleted={handleEventDeleted}
        />
      </div>
    </SafeAreaContainer>
  );
};

export default EventsPage;
