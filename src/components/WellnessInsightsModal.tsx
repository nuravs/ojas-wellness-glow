
import React, { useState } from 'react';
import { X, TrendingUp, Heart, Brain, CheckCircle, AlertCircle, Calendar, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useComorbidities } from '../hooks/useComorbidities';
import { useVitals } from '../hooks/useVitals';
import { useSymptoms } from '../hooks/useSymptoms';
import { useMedications } from '../hooks/useMedications';

interface WellnessInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  wellnessScore: number;
  medsCount: { taken: number; total: number };
  symptomsLogged: boolean;
  userRole: 'patient' | 'caregiver';
}

const WellnessInsightsModal: React.FC<WellnessInsightsModalProps> = ({
  isOpen,
  onClose,
  wellnessScore,
  medsCount,
  symptomsLogged,
  userRole
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'conditions'>('overview');
  const navigate = useNavigate();
  
  const { comorbidities } = useComorbidities();
  const { vitals } = useVitals();
  const { symptoms } = useSymptoms();
  const { medications } = useMedications();

  if (!isOpen) return null;

  const getWellnessZone = (score: number) => {
    if (score >= 80) return { zone: 'excellent', color: 'text-ojas-success', bgColor: 'bg-ojas-success/10' };
    if (score >= 60) return { zone: 'good', color: 'text-ojas-alert', bgColor: 'bg-ojas-alert/10' };
    return { zone: 'needs attention', color: 'text-ojas-error', bgColor: 'bg-ojas-error/10' };
  };

  const scoreZone = getWellnessZone(wellnessScore);
  
  // Calculate comorbidity status
  const controlledConditions = comorbidities.filter(c => c.status === 'controlled').length;
  const activeConditions = comorbidities.filter(c => c.status === 'active').length;
  
  // Generate positive insights
  const positiveInsights = [];
  if (medsCount.taken === medsCount.total && medsCount.total > 0) {
    positiveInsights.push("🎉 Perfect medication adherence today!");
  }
  if (controlledConditions > 0) {
    positiveInsights.push(`💪 ${controlledConditions} condition${controlledConditions > 1 ? 's' : ''} well managed`);
  }
  if (symptomsLogged) {
    positiveInsights.push("📝 Great job tracking your symptoms today");
  }

  // Areas needing attention
  const attentionAreas = [];
  if (medsCount.taken < medsCount.total) {
    attentionAreas.push(`${medsCount.total - medsCount.taken} medication${medsCount.total - medsCount.taken > 1 ? 's' : ''} pending`);
  }
  if (activeConditions > 0) {
    attentionAreas.push(`${activeConditions} condition${activeConditions > 1 ? 's' : ''} need monitoring`);
  }

  const handleViewDetails = (section: string) => {
    onClose();
    switch (section) {
      case 'medications':
        navigate('/?tab=medications');
        break;
      case 'symptoms':
        navigate('/symptoms');
        break;
      case 'vitals':
        navigate('/vitals');
        break;
      case 'conditions':
        navigate('/comorbidities');
        break;
      default:
        navigate('/more');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-ojas-charcoal-gray rounded-3xl shadow-ojas-strong max-w-lg w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ojas-border">
          <div>
            <h2 className="text-xl font-semibold text-ojas-text-main">Your Wellness Insights</h2>
            <p className="text-sm text-ojas-text-secondary">
              Score: {wellnessScore}/100 - {scoreZone.zone}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-ojas-bg-light transition-colors"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-ojas-border">
          {[
            { id: 'overview', label: 'Overview', icon: Heart },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'conditions', label: 'Conditions', icon: Brain }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 p-4 text-sm font-medium transition-colors ${
                activeTab === id 
                  ? 'text-ojas-primary border-b-2 border-ojas-primary' 
                  : 'text-ojas-text-secondary hover:text-ojas-text-main'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content - Fixed height and scrollable */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Positive Highlights */}
              {positiveInsights.length > 0 && (
                <Card className="border-ojas-success/20 bg-ojas-success/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-ojas-success" />
                      <h3 className="font-semibold text-ojas-success">Positive Progress</h3>
                    </div>
                    <div className="space-y-2">
                      {positiveInsights.map((insight, index) => (
                        <p key={index} className="text-sm text-ojas-text-main">{insight}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Areas for Attention */}
              {attentionAreas.length > 0 && (
                <Card className="border-ojas-alert/20 bg-ojas-alert/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-ojas-alert" />
                      <h3 className="font-semibold text-ojas-alert">Gentle Reminders</h3>
                    </div>
                    <div className="space-y-2">
                      {attentionAreas.map((area, index) => (
                        <p key={index} className="text-sm text-ojas-text-main">{area}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails('medications')}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Medications
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails('symptoms')}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Log Symptoms
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails('vitals')}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Record Vitals
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails('conditions')}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Conditions
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-ojas-text-secondary mx-auto mb-3" />
                <h3 className="font-semibold text-ojas-text-main mb-2">Trend Analysis</h3>
                <p className="text-sm text-ojas-text-secondary mb-4">
                  Track your health patterns over time
                </p>
                <Button onClick={() => handleViewDetails('symptoms')}>
                  View Detailed Trends
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'conditions' && (
            <div className="space-y-4">
              {comorbidities.length > 0 ? (
                <div className="space-y-3">
                  {comorbidities.slice(0, 3).map((condition) => (
                    <div key={condition.id} className="p-3 bg-ojas-bg-light rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-ojas-text-main">{condition.condition_name}</h4>
                          <p className="text-sm text-ojas-text-secondary capitalize">{condition.status}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          condition.status === 'controlled' ? 'bg-ojas-success' : 'bg-ojas-alert'
                        }`} />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails('conditions')}
                    className="w-full"
                  >
                    View All Conditions
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-ojas-text-secondary mx-auto mb-3" />
                  <h3 className="font-semibold text-ojas-text-main mb-2">Health Conditions</h3>
                  <p className="text-sm text-ojas-text-secondary mb-4">
                    Track and manage your health conditions
                  </p>
                  <Button onClick={() => handleViewDetails('conditions')}>
                    Add Conditions
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WellnessInsightsModal;
