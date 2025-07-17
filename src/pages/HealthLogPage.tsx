
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-ojas-bg-light">
      <SafeAreaContainer>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <h1 className="text-2xl font-semibold text-ojas-text-main">
            Health Log
          </h1>
          <button
            className="w-10 h-10 flex items-center justify-center bg-ojas-primary text-white rounded-full hover:bg-ojas-primary-hover transition-colors"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white rounded-2xl p-1 shadow-ojas-soft">
            <TabsTrigger 
              value="vitals" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-ojas-primary data-[state=active]:text-white text-ojas-text-secondary"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Vitals</span>
            </TabsTrigger>
            <TabsTrigger 
              value="symptoms" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-ojas-primary data-[state=active]:text-white text-ojas-text-secondary"
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Symptoms</span>
            </TabsTrigger>
            <TabsTrigger 
              value="conditions" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-ojas-primary data-[state=active]:text-white text-ojas-text-secondary"
            >
              <Stethoscope className="w-4 h-4" />
              <span className="hidden sm:inline">My Conditions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vitals" className="mt-0">
            <VitalsPage 
              userRole={userRole} 
              onBack={() => {}}
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
