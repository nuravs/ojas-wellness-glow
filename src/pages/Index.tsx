
import React, { useState, useEffect } from 'react';
import HomePage from './HomePage';
import MedicationsPage from './MedicationsPage';
import WellnessCenterPage from './WellnessCenterPage';
import RecordsPage from './RecordsPage';
import MorePage from './MorePage';
import SymptomsPage from './SymptomsPage';
import DoctorsHubPage from './DoctorsHubPage';
import EnhancedSettingsPage from './EnhancedSettingsPage';
import RoleSelector from '../components/RoleSelector';
import Navigation from '../components/Navigation';
import { ThemeProvider } from '../contexts/ThemeContext';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'medications' | 'symptoms' | 'wellness' | 'records' | 'more'>('home');
  const [currentPage, setCurrentPage] = useState<'main' | 'doctors' | 'settings'>('main');
  const [userRole, setUserRole] = useState<'patient' | 'caregiver' | null>(null);
  const { toast } = useToast();

  // Check if user has selected a role on app start
  useEffect(() => {
    const savedRole = localStorage.getItem('ojas-user-role');
    if (savedRole === 'patient' || savedRole === 'caregiver') {
      setUserRole(savedRole);
    }
  }, []);

  // Sample medication data
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

  const handleRoleSelected = (role: 'patient' | 'caregiver') => {
    setUserRole(role);
    localStorage.setItem('ojas-user-role', role);
    
    toast({
      title: `Welcome, ${role}! 👋`,
      description: `Your app is now personalized for ${role === 'patient' ? 'patient' : 'caregiver'} use.`,
      duration: 4000,
    });
  };

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
    setActiveTab('more'); // Return to More tab
  };

  // Show role selector if no role is selected
  if (!userRole) {
    return (
      <ThemeProvider>
        <RoleSelector onRoleSelected={handleRoleSelected} />
      </ThemeProvider>
    );
  }

  // Handle special page navigation - now properly returns to More
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
            userRole={userRole}
          />
        );
      case 'medications':
        return (
          <MedicationsPage
            medications={medications}
            onToggleMedication={handleToggleMedication}
            onPostponeMedication={handlePostponeMedication}
            onAddMedication={handleAddMedication}
            userRole={userRole}
          />
        );
      case 'symptoms':
        return <SymptomsPage userRole={userRole} />;
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
        return <HomePage medications={medications} onToggleMedication={handleToggleMedication} onPostponeMedication={handlePostponeMedication} userRole={userRole} />;
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
