
import React from 'react';
import { useHealthStore } from '../stores/healthStore';
import { useAuth } from '../contexts/AuthContext';
import SafeAreaContainer from '../components/SafeAreaContainer';
import { HomePageHeader } from '../components/homepage/HomePageHeader';
import { WellnessSection } from '../components/homepage/WellnessSection';
import { TodaysFocusSection } from '../components/homepage/TodaysFocusSection';
import { TodaysActionsSection } from '../components/homepage/TodaysActionsSection';
import { SecondaryActionsSection } from '../components/homepage/SecondaryActionsSection';
import { CollapsibleInsightsSection } from '../components/homepage/CollapsibleInsightsSection';
import { LiveRegion } from '../components/ui/enhanced-accessibility';

const HomePage = () => {
  const { user, userProfile } = useAuth();
  const { wellnessScore, todaysFocus, lastUpdated } = useHealthStore();
  
  const userRole = userProfile?.role as 'patient' | 'caregiver' || 'patient';

  return (
    <SafeAreaContainer>
      <div className="flex flex-col min-h-screen bg-ojas-bg-light">
        <HomePageHeader userRole={userRole} />
        
        <main className="flex-1 px-4 pb-24">
          <LiveRegion 
            message={`Wellness score updated to ${wellnessScore}%`}
            priority="polite"
          />
          
          <div className="space-y-6">
            {/* Central wellness ring */}
            <WellnessSection />
            
            {/* Today's focus */}
            <TodaysFocusSection />
            
            {/* Quick actions */}
            <TodaysActionsSection />
            
            {/* Secondary actions */}
            <SecondaryActionsSection />
            
            {/* Collapsible insights */}
            <CollapsibleInsightsSection />
          </div>
        </main>
      </div>
    </SafeAreaContainer>
  );
};

export default HomePage;
