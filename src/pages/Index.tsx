
import React, { useState } from 'react';
import HomePage from './HomePage';
import MedicationsPage from './MedicationsPage';
import SymptomsPage from './SymptomsPage';
import CalendarPage from './CalendarPage';
import RecordsPage from './RecordsPage';
import HelpPage from './HelpPage';
import Navigation from '../components/Navigation';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'medications' | 'symptoms' | 'calendar' | 'records' | 'help'>('home');
  const { toast } = useToast();

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

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            medications={medications}
            onToggleMedication={handleToggleMedication}
            onPostponeMedication={handlePostponeMedication}
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
      case 'calendar':
        return <CalendarPage />;
      case 'records':
        return <RecordsPage />;
      case 'help':
        return <HelpPage />;
      default:
        return <HomePage medications={medications} onToggleMedication={handleToggleMedication} onPostponeMedication={handlePostponeMedication} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentPage()}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
