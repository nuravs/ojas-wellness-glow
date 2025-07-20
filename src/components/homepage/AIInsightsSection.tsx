
import React from 'react';
import { TrendingUp, CheckCircle, AlertTriangle, Clock, ExternalLink } from 'lucide-react';

interface AIInsightsSectionProps {
  medications: any[];
  vitals: any[];
  symptoms: any[];
  userRole: 'patient' | 'caregiver';
  onViewAll: () => void;
}

const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ 
  medications, 
  vitals, 
  symptoms, 
  userRole,
  onViewAll
}) => {
  // Generate AI insights based on real data
  const generateInsights = () => {
    const insights = [];
    
    // Medication adherence insight
    const todaysTakenMeds = medications.filter(med => med.taken).length;
    const totalMeds = medications.length;
    const adherenceRate = totalMeds > 0 ? (todaysTakenMeds / totalMeds) * 100 : 100;
    
    if (adherenceRate >= 90) {
      insights.push({
        id: 'med-adherence-good',
        icon: CheckCircle,
        title: 'Excellent Medication Adherence',
        description: `Great job maintaining ${Math.round(adherenceRate)}% medication adherence this week.`,
        priority: 'low',
        actionable: false,
        time: 'Today'
      });
    } else if (adherenceRate < 70) {
      insights.push({
        id: 'med-adherence-low',
        icon: AlertTriangle,
        title: 'Medication Adherence Alert',
        description: `Your medication adherence is at ${Math.round(adherenceRate)}%. Consider setting reminders to improve consistency.`,
        priority: 'high',
        actionable: true,
        time: 'Today'
      });
    }

    // Vitals trend insight
    if (vitals && vitals.length > 0) {
      const recentBP = vitals.find(v => v.vital_type === 'blood_pressure');
      if (recentBP && recentBP.values?.systolic > 140) {
        insights.push({
          id: 'bp-high',
          icon: TrendingUp,
          title: 'Blood Pressure Trending High',
          description: 'Your blood pressure has been elevated. Consider discussing this with your doctor.',
          priority: 'high',
          actionable: true,
          time: '2 days ago'
        });
      }
    }

    // Symptom pattern insight
    if (symptoms && symptoms.length > 0) {
      const recentSymptoms = symptoms.filter(s => {
        const symptomDate = new Date(s.logged_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return symptomDate >= weekAgo;
      });

      if (recentSymptoms.length > 5) {
        insights.push({
          id: 'symptom-pattern',
          icon: Clock,
          title: 'Symptom Pattern Detected',
          description: 'You\'ve logged multiple symptoms this week. Track patterns for your next appointment.',
          priority: 'medium',
          actionable: true,
          time: 'This week'
        });
      }
    }

    // Default insight if no data
    if (insights.length === 0) {
      insights.push({
        id: 'welcome',
        icon: CheckCircle,
        title: 'Welcome to OJAS',
        description: 'Start logging your medications and symptoms to receive personalized insights.',
        priority: 'low',
        actionable: false,
        time: 'Getting started'
      });
    }

    return insights.slice(0, 3); // Limit to 3 insights
  };

  const insights = generateInsights();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-ojas-error text-white';
      case 'medium': return 'bg-ojas-alert text-ojas-text-main';
      case 'low': return 'bg-ojas-success text-white';
      default: return 'bg-ojas-text-secondary text-white';
    }
  };

  const handleInsightAction = (insight: any) => {
    if (insight.id === 'med-adherence-low') {
      // Navigate to medications page
      window.location.href = '/medications';
    } else if (insight.id === 'bp-high') {
      // Navigate to vitals page
      window.location.href = '/vitals';
    } else if (insight.id === 'symptom-pattern') {
      // Navigate to symptoms page
      window.location.href = '/symptoms';
    }
  };

  return (
    <div className="px-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-ojas-primary flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-ojas-text-main">
            AI Insights
          </h2>
        </div>
        <button 
          onClick={onViewAll}
          className="text-ojas-primary text-sm font-medium hover:text-ojas-primary-hover transition-colors flex items-center gap-1"
        >
          View All
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => {
          const IconComponent = insight.icon;
          return (
            <div key={insight.id} className="bg-white rounded-xl p-4 shadow-ojas-soft border border-ojas-border">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 rounded-full bg-ojas-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <IconComponent className="w-4 h-4 text-ojas-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-ojas-text-main text-sm">
                        {insight.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                        {insight.priority}
                      </span>
                    </div>
                    
                    <p className="text-sm text-ojas-text-secondary leading-relaxed mb-2">
                      {insight.description}
                    </p>
                    
                    <p className="text-xs text-ojas-text-secondary">
                      {insight.time}
                    </p>
                  </div>
                </div>
                
                {insight.actionable && (
                  <button 
                    onClick={() => handleInsightAction(insight)}
                    className="px-3 py-1 bg-ojas-primary/10 text-ojas-primary rounded-lg text-xs font-medium hover:bg-ojas-primary/20 transition-colors flex-shrink-0"
                  >
                    Take Action
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIInsightsSection;
