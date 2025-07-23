
import React, { useState } from 'react';
import { useSymptoms } from '../hooks/useSymptoms';
import SymptomLogger from '../components/symptoms/SymptomLogger';
import DetailedSymptomTrends from '../components/symptoms/DetailedSymptomTrends';
import SafeAreaContainer from '../components/SafeAreaContainer';
import UnifiedFloatingActionButton from '../components/UnifiedFloatingActionButton';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';

interface SymptomsPageProps {
  onBack?: () => void;
  userRole?: 'patient' | 'caregiver';
}

const SymptomsPage: React.FC<SymptomsPageProps> = ({ 
  onBack,
  userRole = 'patient' 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { symptoms, loading, addSymptom } = useSymptoms();

  console.log('SymptomsPage - symptoms:', symptoms?.length || 0);

  const handleAddSymptom = async (symptomData: any) => {
    try {
      await addSymptom(symptomData);
      setShowAddForm(false);
      // Update localStorage to track symptom logging for today
      localStorage.setItem('lastSymptomLog', new Date().toDateString());
    } catch (error) {
      console.error('Error adding symptom:', error);
    }
  };

  const handleFloatingAdd = () => {
    setShowAddForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ojas-bg-light dark:bg-ojas-soft-midnight flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ojas-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-2">
            Loading Your Symptoms
          </h3>
          <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver">
            Retrieving your symptom history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ojas-bg-light dark:bg-ojas-soft-midnight">
      <div className="overflow-y-auto pb-32">
        <SafeAreaContainer>
          <div className="flex items-center justify-between mb-6 pt-4">
            <div className="flex-1">
              {/* Header content will be handled in DetailedSymptomTrends */}
            </div>
            
            {/* Add Symptom Button */}
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-ojas-primary hover:bg-ojas-primary-hover text-white font-medium px-4 py-2 rounded-xl shadow-ojas-medium"
              style={{ minHeight: '44px' }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Log Symptom
            </Button>
          </div>

          {/* Detailed Symptom Trends */}
          <DetailedSymptomTrends 
            symptoms={symptoms}
            userRole={userRole}
            onBack={onBack}
          />
        </SafeAreaContainer>
      </div>

      {/* Add Symptom Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-ojas-charcoal-gray rounded-2xl shadow-ojas-strong w-full max-w-md max-h-[95vh] overflow-y-auto">
            <SymptomLogger
              onSubmit={handleAddSymptom}
              onCancel={() => setShowAddForm(false)}
              userRole={userRole}
            />
          </div>
        </div>
      )}

      {/* Unified Floating Action Button - Only show symptoms option */}
      <UnifiedFloatingActionButton
        onSymptomAdd={handleFloatingAdd}
        showVitals={false}
        showSymptoms={true}
        showEvents={false}
      />
    </div>
  );
};

export default SymptomsPage;
