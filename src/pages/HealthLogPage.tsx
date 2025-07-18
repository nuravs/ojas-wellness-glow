
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Activity, Stethoscope, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SafeAreaContainer from '../components/SafeAreaContainer';
import EventLoggerModal from '../components/events/EventLoggerModal';

// Import existing page components
import VitalsPage from './VitalsPage';
import SymptomsPage from './SymptomsPage';
import ComorbiditiesPage from './ComorbiditiesPage';
import EventsPage from './EventsPage';

interface HealthLogPageProps {
  userRole?: 'patient' | 'caregiver';
}

const HealthLogPage: React.FC<HealthLogPageProps> = ({ userRole = 'patient' }) => {
  const [activeTab, setActiveTab] = useState('vitals');

  const handleNavigateToVitals = () => {
    setActiveTab('vitals');
  };

  const handleBackToHealthLog = () => {
    // This is handled within the component
  };

  const handleEventLogged = () => {
    setActiveTab('events');
  };

  return (
    <div className="min-h-screen bg-ojas-bg-light dark:bg-ojas-soft-midnight">
      <SafeAreaContainer>
        {/* Header */}
        <div className="text-center mb-6 pt-4">
          <h1 className="text-2xl font-bold text-ojas-text-main dark:text-ojas-mist-white mb-2">
            Health Log
          </h1>
          <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver text-base">
            Track your vitals, symptoms, health conditions, and important events
          </p>
        </div>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white dark:bg-ojas-charcoal-gray border border-ojas-border dark:border-ojas-slate-gray rounded-xl p-1">
            <TabsTrigger 
              value="vitals" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-ojas-primary data-[state=active]:text-white"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Vitals</span>
            </TabsTrigger>
            <TabsTrigger 
              value="symptoms" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-ojas-primary data-[state=active]:text-white"
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Symptoms</span>
            </TabsTrigger>
            <TabsTrigger 
              value="conditions" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-ojas-primary data-[state=active]:text-white"
            >
              <Stethoscope className="w-4 h-4" />
              <span className="hidden sm:inline">Conditions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-ojas-primary data-[state=active]:text-white"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vitals" className="mt-0">
            <VitalsPage 
              userRole={userRole} 
              onBack={handleBackToHealthLog}
            />
          </TabsContent>

          <TabsContent value="symptoms" className="mt-0">
            <SymptomsPage userRole={userRole} />
          </TabsContent>

          <TabsContent value="conditions" className="mt-0">
            <ComorbiditiesPage />
          </TabsContent>

          <TabsContent value="events" className="mt-0">
            <EventsPage userRole={userRole} />
          </TabsContent>
        </Tabs>

        {/* Floating Action Button for Quick Event Logging */}
        <div className="fixed bottom-28 right-6 z-50">
          <EventLoggerModal onEventLogged={handleEventLogged}>
            <Button
              className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full shadow-ojas-strong flex items-center justify-center text-white border-4 border-white dark:border-ojas-charcoal-gray"
              aria-label="Quick log event - Falls, near-falls, confusion"
              title="Log Event"
              style={{
                filter: 'drop-shadow(0 4px 12px rgba(239, 68, 68, 0.4))',
                minWidth: '56px',
                minHeight: '56px'
              }}
            >
              <Plus className="w-7 h-7" />
            </Button>
          </EventLoggerModal>
        </div>
      </SafeAreaContainer>
    </div>
  );
};

export default HealthLogPage;
