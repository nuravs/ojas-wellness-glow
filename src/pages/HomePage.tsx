import React, { useState } from 'react';
import WellnessRing from '../components/WellnessRing';
import MedicationCard from '../components/MedicationCard';
import InsightCard from '../components/InsightCard';
import { Plus, Activity } from 'lucide-react';

interface HomePageProps {
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    time: string;
    taken: boolean;
  }>;
  onToggleMedication: (id: string) => void;
  onPostponeMedication: (id: string) => void;
  userRole: 'patient' | 'caregiver';
}

const HomePage: React.FC<HomePageProps> = ({ 
  medications, 
  onToggleMedication, 
  onPostponeMedication,
  userRole
}) => {
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(new Set());

  // Calculate wellness status
  const takenMeds = medications.filter(med => med.taken).length;
  const totalMeds = medications.length;
  const pendingMeds = medications.filter(med => !med.taken);
  
  const getWellnessStatus = () => {
    if (totalMeds === 0) return 'good';
    if (takenMeds === totalMeds) return 'good';
    if (pendingMeds.length > 0) return 'attention';
    return 'good';
  };

  // Determine priority medications (overdue or very urgent)
  const getPriorityMedications = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    return pendingMeds.filter(med => {
      const medHour = parseInt(med.time.split(':')[0]);
      // Consider medications priority if they're more than 2 hours overdue
      return currentHour - medHour > 2;
    });
  };

  const priorityMeds = getPriorityMedications();

  // Sample insights with enhanced messaging
  const insights = [
    {
      id: 'consistency',
      type: 'encouragement' as const,
      title: 'Great consistency! 🌟',
      message: "You've been taking your medications regularly. This consistency helps maintain steady therapeutic levels and supports your overall wellness journey."
    },
    {
      id: 'morning-routine',
      type: 'tip' as const,
      title: 'Morning routine tip 🌅',
      message: "Taking medications at the same time each day can help maintain steady levels in your system. Consider setting them near your morning coffee or toothbrush as a gentle reminder."
    }
  ];

  const visibleInsights = insights.filter(insight => !dismissedInsights.has(insight.id));

  const handleDismissInsight = (id: string) => {
    setDismissedInsights(prev => new Set([...prev, id]));
  };

  const handleSymptomLog = () => {
    console.log('Open symptom logging');
  };

  return (
    <div className="min-h-screen bg-ojas-bg-light pb-24">
      <div className="max-w-md mx-auto px-6 py-10">
        {/* Enhanced Personalized Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-ojas-text-main mb-4 font-heading">
            Good morning, {userRole === 'caregiver' ? 'Caregiver' : 'Sarah'}
          </h1>
          <p className="text-ojas-text-secondary text-xl">
            {userRole === 'caregiver' ? "Let's check on your patient's progress" : "Let's see how you're doing today"}
          </p>
        </div>

        {/* Enhanced Interactive Wellness Ring */}
        <div className="mb-12">
          <WellnessRing
            status={getWellnessStatus()}
            medsCount={{ taken: takenMeds, total: totalMeds }}
            symptomsLogged={false}
            nextAppointment="June 15"
          />
        </div>

        {/* Enhanced Floating Action Button */}
        <div className="fixed bottom-28 right-6 z-40">
          <button
            onClick={handleSymptomLog}
            className="ojas-fab"
            aria-label="Log symptoms"
          >
            <Activity className="w-9 h-9" />
          </button>
        </div>

        {/* Priority Medications with Enhanced Visual Hierarchy */}
        {pendingMeds.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-ojas-text-main mb-8 font-heading">
              Medication Reminders
              {priorityMeds.length > 0 && (
                <span className="ml-3 px-3 py-1 bg-ojas-alert/20 text-ojas-alert text-base font-medium rounded-full">
                  {priorityMeds.length} urgent
                </span>
              )}
            </h2>
            <div className="space-y-8">
              {pendingMeds.map(medication => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  onToggle={onToggleMedication}
                  onPostpone={onPostponeMedication}
                  isPriority={priorityMeds.some(pm => pm.id === medication.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Wellness Insights */}
        {visibleInsights.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-ojas-text-main mb-8 font-heading">
              Your Wellness Insights
            </h2>
            <div className="space-y-6">
              {visibleInsights.map(insight => (
                <InsightCard
                  key={insight.id}
                  type={insight.type}
                  title={insight.title}
                  message={insight.message}
                  onDismiss={() => handleDismissInsight(insight.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Completed Medications */}
        {medications.filter(med => med.taken).length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-ojas-text-main mb-8 font-heading">
              Completed Today
            </h2>
            <div className="space-y-8">
              {medications.filter(med => med.taken).map(medication => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  onToggle={onToggleMedication}
                />
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Empty State */}
        {medications.length === 0 && (
          <div className="text-center py-16">
            <div className="w-28 h-28 bg-ojas-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Plus className="w-14 h-14 text-ojas-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-ojas-text-main mb-4 font-heading">
              Welcome to Ojas
            </h3>
            <p className="text-ojas-text-secondary mb-8 leading-relaxed text-lg">
              Let's start by adding your medications and setting up your wellness routine. We're here to support you every step of the way.
            </p>
            <button className="ojas-button-primary">
              <Plus className="w-6 h-6" />
              Get Started
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
