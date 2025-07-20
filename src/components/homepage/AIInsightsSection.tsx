
import React from 'react';
import { TrendingUp, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface AIInsightsSectionProps {
  medications: any[];
  vitals: any[];
  symptoms: any[];
  userRole: 'patient' | 'caregiver';
}

const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ 
  medications, 
  vitals, 
  symptoms, 
  userRole 
}) => {
  const insights = [
    {
      id: 1,
      icon: TrendingUp,
      title: 'Blood Pressure Trending High',
      description: 'Your blood pressure has been elevated for 3 consecutive days. Consider discussing this with your doctor.',
      time: '551d ago',
      priority: 'high',
      actionable: true
    },
    {
      id: 2,
      icon: CheckCircle,
      title: 'Medication Adherence',
      description: 'Great job maintaining consistent medication timing this week.',
      priority: 'low',
      actionable: false
    },
    {
      id: 3,
      icon: AlertTriangle,
      title: 'Tremor Pattern',
      description: 'Tremor episodes have increased in the morning hours. Track patterns for your next appointment.',
      priority: 'medium',
      actionable: false
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-ojas-error text-white';
      case 'medium': return 'bg-ojas-alert text-ojas-text-main';
      case 'low': return 'bg-ojas-success text-white';
      default: return 'bg-ojas-text-secondary text-white';
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
        <button className="text-ojas-primary text-sm font-medium hover:text-ojas-primary-hover transition-colors">
          View All
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
                    
                    {insight.time && (
                      <p className="text-xs text-ojas-text-secondary">
                        {insight.time}
                      </p>
                    )}
                  </div>
                </div>
                
                {insight.actionable && (
                  <button className="px-3 py-1 bg-ojas-primary/10 text-ojas-primary rounded-lg text-xs font-medium hover:bg-ojas-primary/20 transition-colors flex-shrink-0">
                    Actionable
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
