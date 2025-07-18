
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Activity, Stethoscope, Plus, TrendingUp } from 'lucide-react';
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
        {/* Clean Header Design */}
        <div className="pt-8 pb-6">
          <h1 className="text-2xl font-bold text-ojas-text-main dark:text-ojas-mist-white mb-2">
            Health Log
          </h1>
          <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver text-base">
            Track your vitals, symptoms, and health conditions
          </p>
        </div>

        {/* Enhanced Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Clean Tab Bar */}
          <div className="mb-6">
            <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-ojas-charcoal-gray border border-ojas-border dark:border-ojas-slate-gray rounded-2xl p-1 shadow-ojas-soft">
              <TabsTrigger 
                value="vitals" 
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-ojas-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Heart className="w-4 h-4" />
                <span className="font-medium">Vitals</span>
              </TabsTrigger>
              <TabsTrigger 
                value="symptoms" 
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-ojas-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Activity className="w-4 h-4" />
                <span className="font-medium">Symptoms</span>
              </TabsTrigger>
              <TabsTrigger 
                value="conditions" 
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-ojas-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Stethoscope className="w-4 h-4" />
                <span className="font-medium">My Conditions</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent value="vitals" className="mt-0">
            <div className="space-y-6">
              {/* Enhanced Vitals Header */}
              <div className="bg-white dark:bg-ojas-charcoal-gray rounded-2xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-1">
                      Add Vital Reading
                    </h2>
                    <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                      Choose a vital to record
                    </p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-ojas-primary text-white rounded-xl font-medium hover:bg-ojas-primary-hover transition-colors">
                    <TrendingUp className="w-4 h-4" />
                    View Trends
                  </button>
                </div>
              </div>

              <VitalsPage 
                userRole={userRole} 
                onBack={handleBackToHealthLog}
              />
            </div>
          </TabsContent>

          <TabsContent value="symptoms" className="mt-0">
            <div className="space-y-6">
              {/* Enhanced Symptoms Header */}
              <div className="bg-white dark:bg-ojas-charcoal-gray rounded-2xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-1">
                      Track Symptoms
                    </h2>
                    <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                      Log how you're feeling today
                    </p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-ojas-calming-green text-white rounded-xl font-medium hover:bg-ojas-calming-green-hover transition-colors">
                    <TrendingUp className="w-4 h-4" />
                    View Trends
                  </button>
                </div>
              </div>

              <SymptomsPage userRole={userRole} />
            </div>
          </TabsContent>

          <TabsContent value="conditions" className="mt-0">
            <div className="space-y-6">
              {/* Enhanced Conditions Header */}
              <div className="bg-white dark:bg-ojas-charcoal-gray rounded-2xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-1">
                      My Health Conditions
                    </h2>
                    <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                      Manage your health conditions
                    </p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-ojas-primary text-white rounded-xl font-medium hover:bg-ojas-primary-hover transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Condition
                  </button>
                </div>
              </div>

              <ComorbiditiesPage />
            </div>
          </TabsContent>
        </Tabs>
      </SafeAreaContainer>
    </div>
  );
};

export default HealthLogPage;
