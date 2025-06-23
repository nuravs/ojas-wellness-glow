
import React, { useState, useEffect } from 'react';
import HomePage from './HomePage';
import MedicationsPage from './MedicationsPage';
import WellnessCenterPage from './WellnessCenterPage';
import RecordsPage from './RecordsPage';
import MorePage from './MorePage';
import SymptomsPage from './SymptomsPage';
import RoleSelector from '../components/RoleSelector';
import Navigation from '../components/Navigation';
import FloatingHelpButton from '../components/FloatingHelpButton';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'medications' | 'symptoms' | 'wellness' | 'records' | 'more'>('home');
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

  // Show role selector if no role is selected
  if (!userRole) {
    return <RoleSelector onRoleSelected={handleRoleSelected} />;
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
          />
        );
      case 'symptoms':
        return <SymptomsPage />;
      case 'wellness':
        return <WellnessCenterPage />;
      case 'records':
        return <RecordsPage />;
      case 'more':
        return <MorePage />;
      default:
        return <HomePage medications={medications} onToggleMedication={handleToggleMedication} onPostpone={handlePostponeMedication} userRole={userRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-ojas-mist-white font-ojas">
      {renderCurrentPage()}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <FloatingHelpButton />
    </div>
  );
};

export default Index;
