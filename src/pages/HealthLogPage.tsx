import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Activity, Stethoscope } from 'lucide-react';
import SafeAreaContainer from '../components/SafeAreaContainer';

// Import existing page components
import VitalsPage from './VitalsPage';
import SymptomsPage from './SymptomsPage';
import ComorbiditiesPage from './ComorbiditiesPage';

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

  return (
    <div className="min-h-screen bg-ojas-bg-light dark:bg-ojas-soft-midnight">
      <SafeAreaContainer>
        {/* Header */}
        <div className="text-center mb-6 pt-4">
          <h1 className="text-2xl font-bold text-ojas-text-main dark:text-ojas-mist-white mb-2">
            Health Log
          </h1>
          <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver text-base">
            Track your vitals, symptoms, and health conditions
          </p>
        </div>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white dark:bg-ojas-charcoal-gray border border-ojas-border dark:border-ojas-slate-gray rounded-xl p-1">
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
              <span className="hidden sm:inline">My Conditions</span>
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
        </Tabs>
      </SafeAreaContainer>
    </div>
  );
};

export default HealthLogPage;