
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
}

const HomePage: React.FC<HomePageProps> = ({ 
  medications, 
  onToggleMedication, 
  onPostponeMedication 
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

  // Sample insights with empathetic messaging
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
    // TODO: Navigate to symptom logging
    console.log('Open symptom logging');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Personalized Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-calm-800 mb-3 font-heading">
            Good morning, Sarah
          </h1>
          <p className="text-calm-600 text-lg">
            Let's see how you're doing today
          </p>
        </div>

        {/* Interactive Wellness Ring */}
        <div className="mb-8">
          <WellnessRing
            status={getWellnessStatus()}
            medsCount={{ taken: takenMeds, total: totalMeds }}
            symptomsLogged={false}
            nextAppointment="June 15"
          />
        </div>

        {/* Floating Action Button for Symptom Logging */}
        <div className="fixed bottom-28 right-6 z-40">
          <button
            onClick={handleSymptomLog}
            className="w-16 h-16 bg-wellness-blue rounded-full shadow-wellness-strong flex items-center justify-center text-white hover:bg-wellness-blue/90 transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Log symptoms"
          >
            <Activity className="w-8 h-8" />
          </button>
        </div>

        {/* Pending Medications */}
        {pendingMeds.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-calm-800 mb-6 font-heading">
              Medication Reminders
            </h2>
            <div className="space-y-6">
              {pendingMeds.map(medication => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  onToggle={onToggleMedication}
                  onPostpone={onPostponeMedication}
                />
              ))}
            </div>
          </div>
        )}

        {/* Wellness Insights */}
        {visibleInsights.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-calm-800 mb-6 font-heading">
              Your Wellness Insights
            </h2>
            <div className="space-y-4">
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

        {/* Completed Medications */}
        {medications.filter(med => med.taken).length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-calm-800 mb-6 font-heading">
              Completed Today
            </h2>
            <div className="space-y-6">
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

        {/* Empty State for New Users */}
        {medications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-wellness-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-12 h-12 text-wellness-blue" />
            </div>
            <h3 className="text-xl font-semibold text-calm-800 mb-3 font-heading">
              Welcome to Ojas
            </h3>
            <p className="text-calm-600 mb-6 leading-relaxed">
              Let's start by adding your medications and setting up your wellness routine. We're here to support you every step of the way.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
