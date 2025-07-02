
import React, { useState } from 'react';
import SymptomButton from '../components/SymptomButton';
import SymptomLogger from '../components/SymptomLogger';
import SymptomTrendsChart from '../components/SymptomTrendsChart';
import SuccessAnimation from '../components/SuccessAnimation';
import SafeAreaContainer from '../components/SafeAreaContainer';
import { getCopyForRole } from '../utils/roleBasedCopy';
import { 
  Brain, 
  Zap, 
  Users, 
  Eye, 
  Activity, 
  Moon,
  TrendingUp,
  Thermometer,
  RotateCcw
} from 'lucide-react';

interface SymptomsPageProps {
  userRole?: 'patient' | 'caregiver';
}

const SymptomsPage: React.FC<SymptomsPageProps> = ({ userRole = 'patient' }) => {
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [showTrends, setShowTrends] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const symptoms = [
    {
      id: 'tremor',
      label: 'Tremor',
      icon: Zap,
      color: 'blue' as const,
      quickOptions: ['Resting', 'Action', 'Postural', 'Mild shaking']
    },
    {
      id: 'stiffness',
      label: 'Stiffness',
      icon: Activity,
      color: 'red' as const,
      quickOptions: ['Neck', 'Arms', 'Legs', 'Back']
    },
    {
      id: 'balance',
      label: 'Balance',
      icon: Users,
      color: 'yellow' as const,
      quickOptions: ['Unsteady', 'Dizzy', 'Falling', 'Walking difficulty']
    },
    {
      id: 'mood',
      label: 'Mood',
      icon: Brain,
      color: 'green' as const,
      quickOptions: ['Anxious', 'Sad', 'Frustrated', 'Worried']
    },
    {
      id: 'vision',
      label: 'Vision',
      icon: Eye,
      color: 'blue' as const,
      quickOptions: ['Blurry', 'Double vision', 'Dry eyes', 'Light sensitive']
    },
    {
      id: 'sleep',
      label: 'Sleep',
      icon: Moon,
      color: 'green' as const,
      quickOptions: ['Restless', 'Insomnia', 'Vivid dreams', 'Fatigue']
    },
    {
      id: 'pain',
      label: 'Pain',
      icon: Thermometer,
      color: 'red' as const,
      quickOptions: ['Headache', 'Joint pain', 'Muscle pain', 'Cramping']
    },
    {
      id: 'cognitive',
      label: 'Thinking',
      icon: Brain,
      color: 'yellow' as const,
      quickOptions: ['Forgetful', 'Confused', 'Slow thinking', 'Word finding']
    },
    {
      id: 'giddiness',
      label: 'Giddiness/Dizziness',
      icon: RotateCcw,
      color: 'blue' as const,
      quickOptions: ['Light-headed', 'Spinning', 'Off-balance', 'Nauseous']
    }
  ];

  const handleSymptomClick = (symptomId: string) => {
    setSelectedSymptom(symptomId);
  };

  const handleSymptomSave = (severity: number, notes?: string) => {
    const symptom = symptoms.find(s => s.id === selectedSymptom);
    setSelectedSymptom(null);
    setSuccessMessage(`${symptom?.label} logged successfully!`);
    setShowSuccess(true);
  };

  const handleSymptomCancel = () => {
    setSelectedSymptom(null);
  };

  const handleViewTrends = () => {
    setShowTrends(true);
  };

  const handleCloseTrends = () => {
    setShowTrends(false);
  };

  const selectedSymptomData = symptoms.find(s => s.id === selectedSymptom);

  if (showTrends) {
    return <SymptomTrendsChart symptomName="All Symptoms" onClose={handleCloseTrends} />;
  }

  if (selectedSymptom && selectedSymptomData) {
    return (
      <SymptomLogger
        symptomName={selectedSymptomData.label}
        onSave={handleSymptomSave}
        onCancel={handleSymptomCancel}
        quickOptions={selectedSymptomData.quickOptions}
      />
    );
  }

  return (
    <div className="min-h-screen bg-ojas-mist-white pb-28">
      <SafeAreaContainer>
        {/* Header with Role-Based Copy */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ojas-charcoal-gray mb-3">
            {getCopyForRole('symptomPrompt', userRole)}
          </h1>
          <p className="text-ojas-slate-gray text-lg">
            Track symptoms to help your care team
          </p>
        </div>

        {/* Symptoms Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {symptoms.map(symptom => (
            <SymptomButton
              key={symptom.id}
              icon={symptom.icon}
              label={symptom.label}
              onClick={() => handleSymptomClick(symptom.id)}
              color={symptom.color}
            />
          ))}
        </div>

        {/* View Trends Button */}
        <div className="mb-8">
          <button
            onClick={handleViewTrends}
            className="w-full px-8 py-4 bg-white border-2 border-ojas-primary-blue text-ojas-primary-blue rounded-2xl font-semibold text-lg transition-all duration-200 hover:bg-ojas-primary-blue hover:text-white active:scale-95 shadow-ojas-soft flex items-center justify-center gap-3"
            style={{ minHeight: '44px' }}
          >
            <TrendingUp className="w-6 h-6" />
            View Trends & Insights
          </button>
        </div>

        {/* Quick Tips */}
        <div className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6">
          <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-4">
            💡 Tracking Tips
          </h3>
          <div className="space-y-3 text-sm text-ojas-slate-gray">
            <p>• Log symptoms as they happen for the most accurate tracking</p>
            <p>• Rate severity honestly - this helps your doctor understand patterns</p>
            <p>• Add notes about what might have triggered or helped symptoms</p>
          </div>
        </div>
      </SafeAreaContainer>

      {/* Success Animation */}
      {showSuccess && (
        <SuccessAnimation
          message={successMessage}
          onComplete={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
};

export default SymptomsPage;
