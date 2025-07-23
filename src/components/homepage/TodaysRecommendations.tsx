
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, X } from 'lucide-react';
import { EnhancedAIInsightsEngine, ProactiveInsight } from '@/utils/enhancedAIInsights';

interface TodaysRecommendationsProps {
  medications: any[];
  vitals: any[];
  symptoms: any[];
  medicationLogs: any[];
  userRole: 'patient' | 'caregiver';
}

const TodaysRecommendations: React.FC<TodaysRecommendationsProps> = ({
  medications,
  vitals,
  symptoms,
  medicationLogs,
  userRole
}) => {
  const [insights, setInsights] = useState<ProactiveInsight[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [topInsight, setTopInsight] = useState<ProactiveInsight | null>(null);

  useEffect(() => {
    const generateInsights = async () => {
      try {
        const aiEngine = EnhancedAIInsightsEngine.getInstance();
        const allInsights = aiEngine.generateProactiveInsights(
          vitals,
          symptoms,
          medications,
          medicationLogs,
          userRole
        );
        
        // Sort by priority (urgent > high > medium > low)
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        const sortedInsights = allInsights.sort((a, b) => 
          priorityOrder[b.priority as keyof typeof priorityOrder] - 
          priorityOrder[a.priority as keyof typeof priorityOrder]
        );
        
        setInsights(sortedInsights);
        setTopInsight(sortedInsights[0] || null);
      } catch (error) {
        console.error('Error generating insights:', error);
      }
    };

    generateInsights();
  }, [medications, vitals, symptoms, medicationLogs, userRole]);

  if (insights.length === 0) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-ojas-error';
      case 'high': return 'text-ojas-alert';
      case 'medium': return 'text-ojas-primary';
      case 'low': return 'text-ojas-success';
      default: return 'text-ojas-text-secondary';
    }
  };

  return (
    <div className="px-4 mb-6">
      <div className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-border p-4">
        {/* Header with top insight */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-ojas-primary/10 flex items-center justify-center">
              <Lightbulb className="w-3 h-3 text-ojas-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ojas-text-main">
                Today's Recommendations
              </h3>
              {topInsight && (
                <p className="text-xs text-ojas-text-secondary">
                  {topInsight.title}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-ojas-text-secondary bg-ojas-primary/10 px-2 py-1 rounded-full">
              {insights.length}
            </span>
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>

        {/* Expanded content */}
        {!isCollapsed && (
          <div className="mt-4 space-y-3 animate-accordion-down">
            {insights.slice(0, 3).map((insight) => (
              <div key={insight.id} className="p-3 bg-ojas-bg-light rounded-xl">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-medium text-ojas-text-main">
                    {insight.title}
                  </h4>
                  <span className={`text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                    {insight.priority}
                  </span>
                </div>
                <p className="text-xs text-ojas-text-secondary leading-relaxed">
                  {insight.message}
                </p>
                {insight.recommendations.length > 0 && (
                  <div className="mt-2 text-xs text-ojas-text-secondary">
                    <span className="font-medium">💡 </span>
                    {insight.recommendations[0]}
                  </div>
                )}
              </div>
            ))}
            
            {insights.length > 3 && (
              <button className="w-full text-xs text-ojas-primary font-medium py-2">
                View {insights.length - 3} more recommendations
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysRecommendations;
