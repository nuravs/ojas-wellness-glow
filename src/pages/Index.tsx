
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import MedicationsPage from './MedicationsPage';
import VitalsPage from './VitalsPage';
import WellnessCenterPage from './WellnessCenterPage';
import RecordsPage from './RecordsPage';
import MorePage from './MorePage';
import SymptomsPage from './SymptomsPage';
import DoctorsHubPage from './DoctorsHubPage';
import EnhancedSettingsPage from './EnhancedSettingsPage';
import ComorbiditiesPage from './ComorbiditiesPage';
import Navigation from '../components/Navigation';
import { ThemeProvider } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useMedications } from '../hooks/useMedications';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'medications' | 'symptoms' | 'vitals' | 'records' | 'more'>('home');
  const [currentPage, setCurrentPage] = useState<'main' | 'doctors' | 'settings' | 'comorbidities'>('main');
  
  const { user, userProfile, loading: authLoading } = useAuth();
  const { medications, loading: medicationsLoading, toggleMedication, postponeMedication } = useMedications();

  console.log('Index component - user:', !!user, 'userProfile:', !!userProfile, 'authLoading:', authLoading);

  const handleAddMedication = () => {
    // This would open an add medication modal or navigate to add medication page
    console.log('Add medication functionality would be implemented here');
  };

  const handleNavigateToDoctors = () => {
    setCurrentPage('doctors');
  };

  const handleNavigateToSettings = () => {
    setCurrentPage('settings');
  };

  const handleNavigateToComorbidities = () => {
    setCurrentPage('comorbidities');
  };

  const handleNavigateToVitals = () => {
    setActiveTab('vitals');
  };

  const handleBackToMore = () => {
    setCurrentPage('main');
    setActiveTab('more');
  };

  // Handle special page navigation
  if (currentPage === 'doctors') {
    return (
      <ThemeProvider>
        <DoctorsHubPage onBack={handleBackToMore} />
      </ThemeProvider>
    );
  }

  if (currentPage === 'settings') {
    return (
      <ThemeProvider>
        <EnhancedSettingsPage onBack={handleBackToMore} />
      </ThemeProvider>
    );
  }

  if (currentPage === 'comorbidities') {
    return (
      <ThemeProvider>
        <ComorbiditiesPage onBack={handleBackToMore} />
      </ThemeProvider>
    );
  }

  // Show loading only while app data is loading
  if (medicationsLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-ojas-mist-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-ojas-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-ojas-slate-gray">Loading your health data...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  const renderCurrentPage = () => {
    // Use demo user role if no user profile
    const userRole = userProfile?.role as 'patient' | 'caregiver' || 'patient';
    
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            medications={medications}
            onToggleMedication={toggleMedication}
            onPostponeMedication={postponeMedication}
            userRole={userRole}
            onNavigateToVitals={handleNavigateToVitals}
          />
        );
      case 'medications':
        return (
          <MedicationsPage
            medications={medications}
            onToggleMedication={toggleMedication}
            onPostponeMedication={postponeMedication}
            onAddMedication={handleAddMedication}
            userRole={userRole}
          />
        );
      case 'symptoms':
        return <SymptomsPage userRole={userRole} />;
      case 'vitals':
        return <VitalsPage userRole={userRole} onBack={() => setActiveTab('home')} />;
      case 'records':
        return <RecordsPage />;
      case 'more':
        return (
          <MorePage 
            onNavigateToDoctors={handleNavigateToDoctors}
            onNavigateToSettings={handleNavigateToSettings}
            onNavigateToComorbidities={handleNavigateToComorbidities}
          />
        );
      default:
        return (
          <HomePage 
            medications={medications} 
            onToggleMedication={toggleMedication} 
            onPostponeMedication={postponeMedication} 
            userRole={userRole}  
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-ojas-bg-light dark:bg-ojas-soft-midnight font-ojas transition-colors duration-300">
        {renderCurrentPage()}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ThemeProvider>
  );
};

export default Index;
