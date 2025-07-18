
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Activity, Stethoscope, AlertTriangle } from 'lucide-react';
import SafeAreaContainer from '../components/SafeAreaContainer';
import UnifiedFloatingActionButton from '../components/UnifiedFloatingActionButton';

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

  const handleNavigateToSymptoms = () => {
    setActiveTab('symptoms');
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
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white dark:bg-ojas-charcoal-gray border border-ojas-border dark:border-ojas-slate-gray rounded-xl p-1 h-auto">
            <TabsTrigger 
              value="vitals" 
              className="flex flex-col items-center gap-1 rounded-lg data-[state=active]:bg-ojas-primary data-[state=active]:text-white py-2 px-1 text-xs"
            >
              <Heart className="w-4 h-4" />
              <span>Vitals</span>
            </TabsTrigger>
            <TabsTrigger 
              value="symptoms" 
              className="flex flex-col items-center gap-1 rounded-lg data-[state=active]:bg-ojas-primary data-[state=active]:text-white py-2 px-1 text-xs"
            >
              <Activity className="w-4 h-4" />
              <span>Symptoms</span>
            </TabsTrigger>
            <TabsTrigger 
              value="conditions" 
              className="flex flex-col items-center gap-1 rounded-lg data-[state=active]:bg-ojas-primary data-[state=active]:text-white py-2 px-1 text-xs"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Conditions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="flex flex-col items-center gap-1 rounded-lg data-[state=active]:bg-ojas-primary data-[state=active]:text-white py-2 px-1 text-xs"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Events</span>
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
      </SafeAreaContainer>

      {/* Unified Floating Action Button */}
      <UnifiedFloatingActionButton
        onVitalAdd={handleNavigateToVitals}
        onSymptomAdd={handleNavigateToSymptoms}
        onEventLogged={handleEventLogged}
        showVitals={true}
        showSymptoms={true}
        showEvents={true}
      />
    </div>
  );
};

export default HealthLogPage;
