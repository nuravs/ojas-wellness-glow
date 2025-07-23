
import React, { useState, useEffect } from 'react';
import { Brain, ChevronRight, X, Lightbulb, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedAIInsightsEngine, ProactiveInsight } from '@/utils/enhancedAIInsights';

interface SmartHealthAssistantProps {
  medications: any[];
  vitals: any[];
  symptoms: any[];
  medicationLogs: any[];
  userRole: 'patient' | 'caregiver';
}

const SmartHealthAssistant: React.FC<SmartHealthAssistantProps> = ({
  medications,
  vitals,
  symptoms,
  medicationLogs,
  userRole
}) => {
  const [currentInsight, setCurrentInsight] = useState<ProactiveInsight | null>(null);
  const [allInsights, setAllInsights] = useState<ProactiveInsight[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const generateInsights = async () => {
      try {
        const aiEngine = EnhancedAIInsightsEngine.getInstance();
        const insights = aiEngine.generateProactiveInsights(
          vitals,
          symptoms,
          medications,
          medicationLogs,
          userRole
        );
        setAllInsights(insights);
        if (insights.length > 0) {
          setCurrentInsight(insights[0]);
        }
      } catch (error) {
        console.error('Error generating insights:', error);
      }
    };

    generateInsights();
  }, [medications, vitals, symptoms, medicationLogs, userRole]);

  useEffect(() => {
    if (allInsights.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = (prev + 1) % allInsights.length;
          setCurrentInsight(allInsights[next]);
          return next;
        });
      }, 5000); // Cycle every 5 seconds

      return () => clearInterval(interval);
    }
  }, [allInsights]);

  if (!currentInsight) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-ojas-error bg-ojas-error/5';
      case 'high': return 'border-l-ojas-alert bg-ojas-alert/5';
      case 'medium': return 'border-l-ojas-primary bg-ojas-primary/5';
      case 'low': return 'border-l-ojas-success bg-ojas-success/5';
      default: return 'border-l-ojas-text-secondary bg-ojas-text-secondary/5';
    }
  };

  return (
    <div className="px-4 mb-6">
      {/* Smart Card - Cycling Insights */}
      <div 
        className={`bg-white rounded-2xl shadow-ojas-soft border-l-4 border-r border-t border-b border-ojas-border ${getPriorityColor(currentInsight.priority)} p-4 transition-all duration-500 hover:shadow-ojas-medium cursor-pointer`}
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-8 h-8 rounded-full bg-ojas-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <Brain className="w-4 h-4 text-ojas-primary" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-ojas-text-main text-sm">
                  {currentInsight.title}
                </h3>
                {allInsights.length > 1 && (
                  <div className="flex gap-1">
                    {allInsights.map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          index === currentIndex ? 'bg-ojas-primary' : 'bg-ojas-border'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <p className="text-sm text-ojas-text-secondary leading-relaxed">
                {currentInsight.message}
              </p>
            </div>
          </div>
          
          <ChevronRight className="w-5 h-5 text-ojas-text-secondary flex-shrink-0 mt-1" />
        </div>
      </div>

      {/* Expanded Modal */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-ojas-charcoal-gray rounded-t-3xl shadow-ojas-strong max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-ojas-border">
              <div>
                <h2 className="text-xl font-semibold text-ojas-text-main">Health Assistant</h2>
                <p className="text-sm text-ojas-text-secondary">
                  {allInsights.length} insight{allInsights.length > 1 ? 's' : ''} available
                </p>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-ojas-bg-light transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96 space-y-4">
              {allInsights.map((insight, index) => (
                <div key={insight.id} className={`p-4 rounded-xl border-l-4 ${getPriorityColor(insight.priority)}`}>
                  <h3 className="font-semibold text-ojas-text-main mb-2">{insight.title}</h3>
                  <p className="text-sm text-ojas-text-secondary mb-3">{insight.message}</p>
                  {insight.recommendations.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-xs font-medium text-ojas-text-main">Recommendations:</h4>
                      {insight.recommendations.map((rec, idx) => (
                        <p key={idx} className="text-xs text-ojas-text-secondary pl-2 border-l-2 border-ojas-border">
                          {rec}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartHealthAssistant;
