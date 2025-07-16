
import React, { useState } from 'react';
import { useVitals } from '../hooks/useVitals';
import VitalEntryForm from '../components/vitals/VitalEntryForm';
import VitalsList from '../components/vitals/VitalsList';
import VitalsDashboard from '../components/vitals/VitalsDashboard';
import SafeAreaContainer from '../components/SafeAreaContainer';
import { ArrowLeft, Plus } from 'lucide-react';

interface VitalsPageProps {
  onBack?: () => void;
  userRole?: 'patient' | 'caregiver';
}

const VitalsPage: React.FC<VitalsPageProps> = ({ 
  onBack,
  userRole = 'patient' 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVitalType, setSelectedVitalType] = useState<string>('');
  const { vitals, loading, addVital, getVitalRangeStatus } = useVitals();

  const handleAddVital = async (vitalData: any) => {
    try {
      await addVital(vitalData);
      setShowAddForm(false);
      setSelectedVitalType('');
    } catch (error) {
      console.error('Error adding vital:', error);
    }
  };

  const handleQuickAdd = (vitalType: string) => {
    setSelectedVitalType(vitalType);
    setShowAddForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ojas-bg-light dark:bg-ojas-soft-midnight flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ojas-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver">Loading vitals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ojas-bg-light dark:bg-ojas-soft-midnight">
      <div className="overflow-y-auto pb-32">
        <SafeAreaContainer>
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-4">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-semibold text-ojas-text-main dark:text-ojas-mist-white">
                  {userRole === 'caregiver' ? "Jane's Vitals" : "My Vitals"}
                </h1>
                <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                  Track your health measurements
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="w-12 h-12 flex items-center justify-center bg-ojas-primary text-white rounded-full hover:bg-ojas-primary-hover transition-colors"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {/* Dashboard Overview */}
          <div className="mb-8">
            <VitalsDashboard 
              vitals={vitals} 
              userRole={userRole}
              onQuickAdd={handleQuickAdd}
            />
          </div>

          {/* Vitals List */}
          <VitalsList 
            vitals={vitals} 
            userRole={userRole}
            getVitalRangeStatus={getVitalRangeStatus}
          />

          {/* Add Vital Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-ojas-charcoal-gray rounded-2xl shadow-ojas-strong max-w-md w-full max-h-[90vh] overflow-y-auto">
                <VitalEntryForm
                  selectedType={selectedVitalType}
                  onSubmit={handleAddVital}
                  onCancel={() => {
                    setShowAddForm(false);
                    setSelectedVitalType('');
                  }}
                  userRole={userRole}
                />
              </div>
            </div>
          )}
        </SafeAreaContainer>
      </div>
    </div>
  );
};

export default VitalsPage;
