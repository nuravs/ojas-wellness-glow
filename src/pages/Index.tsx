
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import MedicationsPage from './MedicationsPage';
import WellnessCenterPage from './WellnessCenterPage';
import RecordsPage from './RecordsPage';
import MorePage from './MorePage';
import SymptomsPage from './SymptomsPage';
import DoctorsHubPage from './DoctorsHubPage';
import EnhancedSettingsPage from './EnhancedSettingsPage';
import Navigation from '../components/Navigation';
import { ThemeProvider } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'medications' | 'symptoms' | 'wellness' | 'records' | 'more'>('home');
  const [currentPage, setCurrentPage] = useState<'main' | 'doctors' | 'settings'>('main');
  const { user, userProfile, loading } = useAuth();
  const { toast } = useToast();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-ojas-mist-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-ojas-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-ojas-slate-gray">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Redirect to auth if not logged in
  if (!user || !userProfile) {
    return <Navigate to="/auth" replace />;
  }

  // Sample medication data (will be replaced with real data in Phase 2)
  const [medications, setMedications] = useState([
    {
      id: '1',
      name: 'Levodopa',
      dosage: '100mg',
      time: '8:00 AM',
      taken: false
    },
    {
      id: '2',
      name: 'Carbidopa',
      dosage: '25mg',
      time: '8:00 AM',
      taken: false
    },
    {
      id: '3',
      name: 'Evening Supplement',
      dosage: '1 tablet',
      time: '8:00 PM',
      taken: true
    }
  ]);

  const handleToggleMedication = (id: string) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === id 
          ? { ...med, taken: !med.taken }
          : med
      )
    );

    const medication = medications.find(med => med.id === id);
    if (medication && !medication.taken) {
      toast({
        title: "Great job! 🎉",
        description: `${medication.name} marked as taken.`,
        duration: 3000,
      });
    }
  };

  const handlePostponeMedication = (id: string) => {
    const medication = medications.find(med => med.id === id);
    if (medication) {
      toast({
        title: "Reminder set",
        description: `We'll remind you about ${medication.name} in 30 minutes.`,
        duration: 3000,
      });
    }
  };

  const handleAddMedication = () => {
    toast({
      title: "Add Medication",
      description: "This feature will help you add new medications to your routine.",
      duration: 3000,
    });
  };

  const handleNavigateToDoctors = () => {
    setCurrentPage('doctors');
  };

  const handleNavigateToSettings = () => {
    setCurrentPage('settings');
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

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            medications={medications}
            onToggleMedication={handleToggleMedication}
            onPostponeMedication={handlePostponeMedication}
            userRole={userProfile.role as 'patient' | 'caregiver'}
          />
        );
      case 'medications':
        return (
          <MedicationsPage
            medications={medications}
            onToggleMedication={handleToggleMedication}
            onPostponeMedication={handlePostponeMedication}
            onAddMedication={handleAddMedication}
            userRole={userProfile.role as 'patient' | 'caregiver'}
          />
        );
      case 'symptoms':
        return <SymptomsPage userRole={userProfile.role as 'patient' | 'caregiver'} />;
      case 'wellness':
        return <WellnessCenterPage />;
      case 'records':
        return <RecordsPage />;
      case 'more':
        return (
          <MorePage 
            onNavigateToDoctors={handleNavigateToDoctors}
            onNavigateToSettings={handleNavigateToSettings}
          />
        );
      default:
        return (
          <HomePage 
            medications={medications} 
            onToggleMedication={handleToggleMedication} 
            onPostponeMedication={handlePostponeMedication} 
            userRole={userProfile.role as 'patient' | 'caregiver'}  
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
