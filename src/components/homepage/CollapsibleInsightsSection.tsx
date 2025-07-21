
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Brain, Activity, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AIInsightsSection from './AIInsightsSection';
import LatestVitalsSection from './LatestVitalsSection';

interface CollapsibleInsightsSectionProps {
  medications: any[];
  vitals: any[];
  symptoms: any[];
  medicationLogs: any[];
  userRole: 'patient' | 'caregiver';
}

const CollapsibleInsightsSection: React.FC<CollapsibleInsightsSectionProps> = ({
  medications,
  vitals,
  symptoms,
  medicationLogs,
  userRole
}) => {
  const [aiInsightsExpanded, setAiInsightsExpanded] = useState(false);
  const [vitalsExpanded, setVitalsExpanded] = useState(false);

  const getSummaryStats = () => {
    const todaySymptoms = symptoms.filter(symptom => {
      const today = new Date();
      const symptomDate = new Date(symptom.logged_at);
      return symptomDate.toDateString() === today.toDateString();
    }).length;

    const todayVitals = vitals.filter(vital => {
      const today = new Date();
      const vitalDate = new Date(vital.measured_at);
      return vitalDate.toDateString() === today.toDateString();
    }).length;

    return {
      todaySymptoms,
      todayVitals,
      totalMeds: medications.length
    };
  };

  const stats = getSummaryStats();

  return (
    <div className="px-4 mb-8 space-y-4">
      {/* AI Insights Collapsible */}
      <Card className="shadow-ojas-soft border border-ojas-border">
        <CardContent className="p-0">
          <button
            onClick={() => setAiInsightsExpanded(!aiInsightsExpanded)}
            className="w-full flex items-center justify-between p-4 hover:bg-ojas-bg-light transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ojas-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-ojas-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-ojas-text-main">AI Insights</h3>
                <p className="text-sm text-ojas-text-secondary">
                  Personalized recommendations and trends
                </p>
              </div>
            </div>
            {aiInsightsExpanded ? (
              <ChevronUp className="w-5 h-5 text-ojas-text-secondary" />
            ) : (
              <ChevronDown className="w-5 h-5 text-ojas-text-secondary" />
            )}
          </button>
          
          {aiInsightsExpanded && (
            <div className="border-t border-ojas-border p-0 animate-accordion-down">
              <AIInsightsSection
                medications={medications}
                vitals={vitals}
                symptoms={symptoms}
                medicationLogs={medicationLogs}
                userRole={userRole}
                onViewAll={() => {}}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Latest Vitals Collapsible */}
      <Card className="shadow-ojas-soft border border-ojas-border">
        <CardContent className="p-0">
          <button
            onClick={() => setVitalsExpanded(!vitalsExpanded)}
            className="w-full flex items-center justify-between p-4 hover:bg-ojas-bg-light transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ojas-alert/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-ojas-alert" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-ojas-text-main">Latest Vitals</h3>
                <p className="text-sm text-ojas-text-secondary">
                  {stats.todayVitals} recorded today
                </p>
              </div>
            </div>
            {vitalsExpanded ? (
              <ChevronUp className="w-5 h-5 text-ojas-text-secondary" />
            ) : (
              <ChevronDown className="w-5 h-5 text-ojas-text-secondary" />
            )}
          </button>
          
          {vitalsExpanded && (
            <div className="border-t border-ojas-border p-0 animate-accordion-down">
              <LatestVitalsSection
                vitals={vitals}
                userRole={userRole}
                onViewAll={() => {}}
                onQuickAdd={() => {}}
                onAddReading={() => {}}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CollapsibleInsightsSection;
