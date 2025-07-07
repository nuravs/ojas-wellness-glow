
import React, { useState, useEffect } from 'react';
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
import { supabase } from '../integrations/supabase/client';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  medication_id?: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'medications' | 'symptoms' | 'wellness' | 'records' | 'more'>('home');
  const [currentPage, setCurrentPage] = useState<'main' | 'doctors' | 'settings'>('main');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false); // Disable auth loading
  
  const { user, userProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();

  console.log('Index component - user:', !!user, 'userProfile:', !!userProfile, 'authLoading:', authLoading);

  // Temporarily disable auth requirement - comment out this redirect
  // if (!user || !userProfile) {
  //   return <Navigate to="/auth" replace />;
  // }

  // Load medications from Supabase - but handle case where user might not be logged in
  const loadMedications = async () => {
    try {
      console.log('Loading medications...');
      
      // If no user, just use empty array for now
      if (!user) {
        console.log('No user logged in, using empty medications array');
        setMedications([]);
        return;
      }

      console.log('Loading medications for user:', user.id);
      
      // Get user's medications
      const { data: userMedications, error: medsError } = await supabase
        .from('medications')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: true });

      if (medsError) {
        console.error('Error loading medications:', medsError);
        toast({
          title: "Error loading medications",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
        return;
      }

      console.log('Loaded medications:', userMedications);

      // Get today's medication logs
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data: todayLogs, error: logsError } = await supabase
        .from('medication_logs')
        .select('*')
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString())
        .eq('status', 'taken');

      if (logsError) {
        console.error('Error loading medication logs:', logsError);
      }

      console.log('Today logs:', todayLogs);

      // Transform medications to match the expected format
      const transformedMedications: Medication[] = (userMedications || []).flatMap(med => {
        const frequency = med.frequency as { times?: string[] } || { times: ['8:00 AM'] };
        const times = frequency.times || ['8:00 AM'];
        
        return times.map(time => ({
          id: `${med.id}-${time}`,
          medication_id: med.id,
          name: med.name,
          dosage: med.dosage,
          time: time,
          taken: (todayLogs || []).some(log => 
            log.medication_id === med.id && 
            log.scheduled_time && 
            new Date(log.scheduled_time).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            }) === time
          )
        }));
      });

      console.log('Transformed medications:', transformedMedications);
      setMedications(transformedMedications);
    } catch (error) {
      console.error('Error in loadMedications:', error);
      toast({
        title: "Error loading data",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Index useEffect - user:', !!user, 'userProfile:', !!userProfile);
    // Always try to load medications, even if user is not logged in
    loadMedications();
  }, [user, userProfile]);

  const handleToggleMedication = async (id: string) => {
    const medication = medications.find(med => med.id === id);
    if (!medication) return;

    // If no user, just toggle locally for demo purposes
    if (!user) {
      setMedications(prev => 
        prev.map(med => 
          med.id === id 
            ? { ...med, taken: !med.taken }
            : med
        )
      );
      toast({
        title: medication.taken ? "Unmarked" : "Great job! 🎉",
        description: `${medication.name} ${medication.taken ? 'unmarked' : 'marked as taken'}.`,
        duration: 3000,
      });
      return;
    }

    try {
      console.log('Toggling medication:', medication);
      
      if (!medication.taken) {
        // Mark as taken - create a log entry
        const scheduledTime = new Date();
        // Parse the time and set it for today
        const [timeStr, period] = medication.time.split(' ');
        const [hours, minutes] = timeStr.split(':').map(Number);
        let adjustedHours = hours;
        if (period === 'PM' && hours !== 12) adjustedHours += 12;
        if (period === 'AM' && hours === 12) adjustedHours = 0;
        
        scheduledTime.setHours(adjustedHours, minutes, 0, 0);

        const { error } = await supabase
          .from('medication_logs')
          .insert({
            medication_id: medication.medication_id || medication.id.split('-')[0],
            user_id: user.id,
            scheduled_time: scheduledTime.toISOString(),
            actual_time: new Date().toISOString(),
            status: 'taken',
            notes: 'Marked as taken via app'
          });

        if (error) {
          console.error('Error logging medication:', error);
          toast({
            title: "Error",
            description: "Failed to mark medication as taken",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Great job! 🎉",
          description: `${medication.name} marked as taken.`,
          duration: 3000,
        });
      } else {
        // Mark as not taken - remove the log entry
        const medicationId = medication.medication_id || medication.id.split('-')[0];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { error } = await supabase
          .from('medication_logs')
          .delete()
          .eq('medication_id', medicationId)
          .eq('user_id', user.id)
          .eq('status', 'taken')
          .gte('created_at', today.toISOString())
          .lt('created_at', tomorrow.toISOString());

        if (error) {
          console.error('Error removing medication log:', error);
          toast({
            title: "Error",
            description: "Failed to update medication status",
            variant: "destructive"
          });
          return;
        }
      }

      // Update local state
      setMedications(prev => 
        prev.map(med => 
          med.id === id 
            ? { ...med, taken: !med.taken }
            : med
        )
      );

    } catch (error) {
      console.error('Error in handleToggleMedication:', error);
      toast({
        title: "Error",
        description: "Failed to update medication",
        variant: "destructive"
      });
    }
  };

  const handlePostponeMedication = async (id: string) => {
    const medication = medications.find(med => med.id === id);
    if (!medication) return;

    // If no user, just show toast for demo
    if (!user) {
      toast({
        title: "Reminder set",
        description: `We'll remind you about ${medication.name} in 30 minutes.`,
        duration: 3000,
      });
      return;
    }

    try {
      // Create a postponed log entry
      const scheduledTime = new Date();
      const [timeStr, period] = medication.time.split(' ');
      const [hours, minutes] = timeStr.split(':').map(Number);
      let adjustedHours = hours;
      if (period === 'PM' && hours !== 12) adjustedHours += 12;
      if (period === 'AM' && hours === 12) adjustedHours = 0;
      
      scheduledTime.setHours(adjustedHours, minutes, 0, 0);

      const { error } = await supabase
        .from('medication_logs')
        .insert({
          medication_id: medication.medication_id || medication.id.split('-')[0],
          user_id: user.id,
          scheduled_time: scheduledTime.toISOString(),
          actual_time: null,
          status: 'postponed',
          notes: 'Postponed for 30 minutes'
        });

      if (error) {
        console.error('Error postponing medication:', error);
        toast({
          title: "Error",
          description: "Failed to postpone medication",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Reminder set",
        description: `We'll remind you about ${medication.name} in 30 minutes.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error in handlePostponeMedication:', error);
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

  // Show loading only if auth is actually loading
  if (authLoading) {
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
        return (
          <HomePage 
            medications={medications} 
            onToggleMedication={handleToggleMedication} 
            onPostponeMedication={handlePostponeMedication} 
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
