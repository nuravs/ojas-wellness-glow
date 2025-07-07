
import React, { useState, useEffect } from 'react';
import SymptomButton from '../components/SymptomButton';
import SymptomLogger from '../components/SymptomLogger';
import SymptomTrendsChart from '../components/SymptomTrendsChart';
import SuccessAnimation from '../components/SuccessAnimation';
import SafeAreaContainer from '../components/SafeAreaContainer';
import { getCopyForRole } from '../utils/roleBasedCopy';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../integrations/supabase/client';
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
  const [loading, setLoading] = useState(false);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  console.log('SymptomsPage - user:', !!user);

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

  // Check if user has logged symptoms today
  useEffect(() => {
    const checkTodayLogs = async () => {
      // If no user, skip database check
      if (!user) {
        console.log('No user logged in, skipping today logs check');
        return;
      }

      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { data, error } = await supabase
          .from('symptoms')
          .select('id')
          .gte('logged_at', today.toISOString())
          .lt('logged_at', tomorrow.toISOString())
          .limit(1);

        if (error) {
          console.error('Error checking today logs:', error);
          return;
        }

        setHasLoggedToday((data || []).length > 0);
      } catch (error) {
        console.error('Error in checkTodayLogs:', error);
      }
    };

    checkTodayLogs();
  }, [user]);

  const handleSymptomClick = (symptomId: string) => {
    setSelectedSymptom(symptomId);
  };

  const handleSymptomSave = async (severity: number, notes?: string, quickOptions?: string[]) => {
    if (!selectedSymptom) return;

    setLoading(true);
    try {
      console.log('Saving symptom:', {
        symptomType: selectedSymptom,
        severity,
        notes,
        quickOptions
      });

      // If no user, just show success for demo
      if (!user) {
        const symptom = symptoms.find(s => s.id === selectedSymptom);
        setSelectedSymptom(null);
        setSuccessMessage(`${symptom?.label} logged successfully!`);
        setShowSuccess(true);
        setHasLoggedToday(true);

        toast({
          title: "Symptom logged (Demo)",
          description: `${symptom?.label} has been recorded`,
          duration: 3000,
        });
        return;
      }

      const { error } = await supabase
        .from('symptoms')
        .insert({
          user_id: user.id,
          symptom_type: selectedSymptom,
          severity: severity,
          details: quickOptions ? { options: quickOptions } : null,
          notes: notes || null,
          logged_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving symptom:', error);
        toast({
          title: "Error saving symptom",
          description: "Please try again",
          variant: "destructive"
        });
        return;
      }

      const symptom = symptoms.find(s => s.id === selectedSymptom);
      setSelectedSymptom(null);
      setSuccessMessage(`${symptom?.label} logged successfully!`);
      setShowSuccess(true);
      setHasLoggedToday(true);

      // Update localStorage for quick tips
      localStorage.setItem('lastSymptomLog', new Date().toDateString());

      toast({
        title: "Symptom logged",
        description: `${symptom?.label} has been recorded`,
        duration: 3000,
      });

    } catch (error) {
      console.error('Error in handleSymptomSave:', error);
      toast({
        title: "Error",
        description: "Failed to save symptom data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
      <div className="pb-24">
        <SymptomLogger
          symptomName={selectedSymptomData.label}
          onSave={handleSymptomSave}
          onCancel={handleSymptomCancel}
          quickOptions={selectedSymptomData.quickOptions}
          loading={loading}
        />
      </div>
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
          {hasLoggedToday && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-ojas-calming-green/20 text-ojas-calming-green rounded-full text-sm">
              <div className="w-2 h-2 bg-ojas-calming-green rounded-full"></div>
              Symptoms logged today
            </div>
          )}
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
