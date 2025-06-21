
import React, { useState } from 'react';
import WellnessRing from '../components/WellnessRing';
import MedicationCard from '../components/MedicationCard';
import InsightCard from '../components/InsightCard';

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
    if (takenMeds === totalMeds) return 'good';
    if (pendingMeds.length > 0) return 'attention';
    return 'good';
  };

  // Sample insights
  const insights = [
    {
      id: 'consistency',
      type: 'encouragement' as const,
      title: 'Great consistency!',
      message: "You've logged your symptoms 3 days in a row. Keeping track helps your care team understand your progress."
    },
    {
      id: 'morning-routine',
      type: 'tip' as const,
      title: 'Morning routine tip',
      message: "Taking medications at the same time each day can help maintain steady levels in your system."
    }
  ];

  const visibleInsights = insights.filter(insight => !dismissedInsights.has(insight.id));

  const handleDismissInsight = (id: string) => {
    setDismissedInsights(prev => new Set([...prev, id]));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-calm-800 mb-2">
            Good morning, Sarah
          </h1>
          <p className="text-calm-600 text-lg">
            Let's see how you're doing today
          </p>
        </div>

        {/* Wellness Ring */}
        <div className="mb-8">
          <WellnessRing
            status={getWellnessStatus()}
            medsCount={{ taken: takenMeds, total: totalMeds }}
            symptomsLogged={false}
            nextAppointment="June 15"
          />
        </div>

        {/* Pending Medications */}
        {pendingMeds.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-calm-800 mb-4">
              Medication Reminders
            </h2>
            <div className="space-y-4">
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

        {/* Insights */}
        {visibleInsights.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-calm-800 mb-4">
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
            <h2 className="text-xl font-semibold text-calm-800 mb-4">
              Completed Today
            </h2>
            <div className="space-y-4">
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
      </div>
    </div>
  );
};

export default HomePage;
