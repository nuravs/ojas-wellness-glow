
import React, { useState } from 'react';
import SymptomButton from '../components/SymptomButton';
import SymptomLogger from '../components/SymptomLogger';
import { Activity, Brain, Zap, Scale, Heart, Eye } from 'lucide-react';

const symptoms = [
  { id: 'tremor', label: 'Tremor', icon: Zap, color: 'yellow' as const, quickOptions: ['Right side', 'Left side', 'Both sides'] },
  { id: 'stiffness', label: 'Stiffness', icon: Activity, color: 'blue' as const, quickOptions: ['Arms', 'Legs', 'Back', 'Neck'] },
  { id: 'balance', label: 'Balance', icon: Scale, color: 'red' as const, quickOptions: ['Walking', 'Standing', 'Turning'] },
  { id: 'mood', label: 'Mood', icon: Heart, color: 'green' as const, quickOptions: ['Anxious', 'Sad', 'Frustrated', 'Content'] },
  { id: 'fatigue', label: 'Fatigue', icon: Brain, color: 'blue' as const, quickOptions: ['Physical', 'Mental', 'Both'] },
  { id: 'vision', label: 'Vision', icon: Eye, color: 'yellow' as const, quickOptions: ['Blurry', 'Double vision', 'Dry eyes'] },
];

const SymptomsPage: React.FC = () => {
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);

  const handleSymptomSelect = (symptomId: string) => {
    setSelectedSymptom(symptomId);
  };

  const handleSymptomSave = (severity: number, notes?: string) => {
    console.log('Saving symptom:', selectedSymptom, 'Severity:', severity, 'Notes:', notes);
    // Here you would typically save to your state management system
    setSelectedSymptom(null);
    // You could also show a success toast here
  };

  const handleSymptomCancel = () => {
    setSelectedSymptom(null);
  };

  const currentSymptom = symptoms.find(s => s.id === selectedSymptom);

  if (selectedSymptom && currentSymptom) {
    return (
      <SymptomLogger
        symptomName={currentSymptom.label}
        onSave={handleSymptomSave}
        onCancel={handleSymptomCancel}
        quickOptions={currentSymptom.quickOptions}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-calm-800 mb-2">
            How are you feeling?
          </h1>
          <p className="text-calm-600 text-lg">
            Tap any symptom you'd like to log
          </p>
        </div>

        {/* Symptom Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {symptoms.map(symptom => (
            <SymptomButton
              key={symptom.id}
              icon={symptom.icon}
              label={symptom.label}
              color={symptom.color}
              onClick={() => handleSymptomSelect(symptom.id)}
            />
          ))}
        </div>

        {/* Recent Entries */}
        <div className="ojas-card">
          <h3 className="text-lg font-semibold text-calm-800 mb-4">
            Recent entries
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-wellness-yellow" />
                <span className="text-calm-700">Tremor</span>
                <span className="text-sm text-calm-500">Yesterday</span>
              </div>
              <span className="font-medium text-calm-800">4/10</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-wellness-blue" />
                <span className="text-calm-700">Balance</span>
                <span className="text-sm text-calm-500">2 days ago</span>
              </div>
              <span className="font-medium text-calm-800">2/10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomsPage;
