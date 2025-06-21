
import React from 'react';
import MedicationCard from '../components/MedicationCard';
import { Plus } from 'lucide-react';

interface MedicationsPageProps {
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    time: string;
    taken: boolean;
  }>;
  onToggleMedication: (id: string) => void;
  onPostponeMedication: (id: string) => void;
  onAddMedication: () => void;
}

const MedicationsPage: React.FC<MedicationsPageProps> = ({ 
  medications, 
  onToggleMedication, 
  onPostponeMedication,
  onAddMedication 
}) => {
  const pendingMeds = medications.filter(med => !med.taken);
  const completedMeds = medications.filter(med => med.taken);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-calm-800 mb-2">
              Your Medications
            </h1>
            <p className="text-calm-600 text-lg">
              Today's schedule
            </p>
          </div>
          <button
            onClick={onAddMedication}
            className="w-12 h-12 bg-wellness-green rounded-full flex items-center justify-center text-white hover:bg-wellness-green/90 transition-colors duration-200"
            aria-label="Add new medication"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Pending Medications */}
        {pendingMeds.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-calm-800 mb-4">
              Still to take ({pendingMeds.length})
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

        {/* Completed Medications */}
        {completedMeds.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-calm-800 mb-4">
              Completed today ({completedMeds.length})
            </h2>
            <div className="space-y-4">
              {completedMeds.map(medication => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  onToggle={onToggleMedication}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {medications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-wellness-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-12 h-12 text-wellness-blue" />
            </div>
            <h3 className="text-xl font-semibold text-calm-800 mb-2">
              No medications yet
            </h3>
            <p className="text-calm-600 mb-6">
              Tap the + button to add your first medication
            </p>
            <button
              onClick={onAddMedication}
              className="ojas-button-primary"
            >
              Add Medication
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationsPage;
