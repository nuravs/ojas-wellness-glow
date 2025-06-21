
import React, { useState } from 'react';
import SymptomButton from '../components/SymptomButton';
import SymptomLogger from '../components/SymptomLogger';
import { Activity, Brain, Zap, Scale, Heart, Eye, Shuffle, Clock, Moon } from 'lucide-react';

const motorSymptoms = [
  { id: 'tremor', label: 'Tremor', icon: Zap, color: 'yellow' as const, quickOptions: ['Right side', 'Left side', 'Both sides'] },
  { id: 'stiffness', label: 'Stiffness', icon: Activity, color: 'blue' as const, quickOptions: ['Arms', 'Legs', 'Back', 'Neck'] },
  { id: 'balance', label: 'Balance', icon: Scale, color: 'red' as const, quickOptions: ['Walking', 'Standing', 'Turning'] },
  { id: 'movement', label: 'Slow Movement', icon: Shuffle, color: 'blue' as const, quickOptions: ['Getting up', 'Walking', 'Writing'] },
];

const nonMotorSymptoms = [
  { id: 'fatigue', label: 'Fatigue', icon: Clock, color: 'yellow' as const, quickOptions: ['Physical', 'Mental', 'Both'] },
  { id: 'sleep', label: 'Sleep Issues', icon: Moon, color: 'blue' as const, quickOptions: ['Trouble falling asleep', 'Frequent waking', 'Early waking'] },
  { id: 'vision', label: 'Vision', icon: Eye, color: 'yellow' as const, quickOptions: ['Blurry', 'Double vision', 'Dry eyes'] },
];

const cognitiveSymptoms = [
  { id: 'mood', label: 'Mood', icon: Heart, color: 'green' as const, quickOptions: ['Anxious', 'Sad', 'Frustrated', 'Content'] },
  { id: 'memory', label: 'Memory', icon: Brain, color: 'blue' as const, quickOptions: ['Forgetful', 'Confused', 'Focused'] },
];

const SymptomsPage: React.FC = () => {
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);

  const handleSymptomSelect = (symptomId: string) => {
    setSelectedSymptom(symptomId);
  };

  const handleSymptomSave = (severity: number, notes?: string) => {
    console.log('Saving symptom:', selectedSymptom, 'Severity:', severity, 'Notes:', notes);
    setSelectedSymptom(null);
  };

  const handleSymptomCancel = () => {
    setSelectedSymptom(null);
  };

  const allSymptoms = [...motorSymptoms, ...nonMotorSymptoms, ...cognitiveSymptoms];
  const currentSymptom = allSymptoms.find(s => s.id === selectedSymptom);

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
          <h1 className="text-3xl font-bold text-wellness-calm-800 mb-2">
            How are you feeling?
          </h1>
          <p className="text-wellness-calm-600 text-lg">
            Tap any symptom you'd like to log
          </p>
        </div>

        {/* Motor Symptoms */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-wellness-calm-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-wellness-blue" />
            Movement & Motor
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {motorSymptoms.map(symptom => (
              <SymptomButton
                key={symptom.id}
                icon={symptom.icon}
                label={symptom.label}
                color={symptom.color}
                onClick={() => handleSymptomSelect(symptom.id)}
              />
            ))}
          </div>
        </div>

        {/* Non-Motor Symptoms */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-wellness-calm-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-wellness-yellow" />
            Non-Motor
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {nonMotorSymptoms.map(symptom => (
              <SymptomButton
                key={symptom.id}
                icon={symptom.icon}
                label={symptom.label}
                color={symptom.color}
                onClick={() => handleSymptomSelect(symptom.id)}
              />
            ))}
          </div>
        </div>

        {/* Cognitive/Psychological Symptoms */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-wellness-calm-800 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-wellness-green" />
            Cognitive & Mood
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {cognitiveSymptoms.map(symptom => (
              <SymptomButton
                key={symptom.id}
                icon={symptom.icon}
                label={symptom.label}
                color={symptom.color}
                onClick={() => handleSymptomSelect(symptom.id)}
              />
            ))}
          </div>
        </div>

        {/* Recent Entries */}
        <div className="ojas-card">
          <h3 className="text-lg font-semibold text-wellness-calm-800 mb-4">
            Recent entries
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-wellness-yellow" />
                <span className="text-wellness-calm-700">Tremor</span>
                <span className="text-sm text-wellness-calm-500">Yesterday</span>
                <span className="text-xs bg-wellness-yellow/20 text-wellness-yellow px-2 py-1 rounded-full">Moderate</span>
              </div>
              <span className="font-medium text-wellness-calm-800">4/10</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-wellness-blue" />
                <span className="text-wellness-calm-700">Balance</span>
                <span className="text-sm text-wellness-calm-500">2 days ago</span>
                <span className="text-xs bg-wellness-green/20 text-wellness-green px-2 py-1 rounded-full">Mild</span>
              </div>
              <span className="font-medium text-wellness-calm-800">2/10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomsPage;
