
import React, { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, AlertTriangle, Clock, ExternalLink, Pill, Activity, Heart, Brain, Lightbulb, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { EnhancedAIInsightsEngine, ProactiveInsight } from '@/utils/enhancedAIInsights';

interface AIInsightsSectionProps {
  medications: any[];
  vitals: any[];
  symptoms: any[];
  medicationLogs: any[];
  userRole: 'patient' | 'caregiver';
  onViewAll: () => void;
}

const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ 
  medications, 
  vitals, 
  symptoms, 
  medicationLogs = [],
  userRole,
  onViewAll
}) => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState<ProactiveInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());

  useEffect(() => {
    const generateInsights = async () => {
      setLoading(true);
      try {
        const aiEngine = EnhancedAIInsightsEngine.getInstance();
        const proactiveInsights = aiEngine.generateProactiveInsights(
          vitals,
          symptoms,
          medications,
          medicationLogs,
          userRole
        );
        setInsights(proactiveInsights);
      } catch (error) {
        console.error('Error generating insights:', error);
        // Fallback to basic insights if enhanced fails
        setInsights(generateBasicInsights());
      } finally {
        setLoading(false);
      }
    };

    generateInsights();
  }, [medications, vitals, symptoms, medicationLogs, userRole]);

  const generateBasicInsights = (): ProactiveInsight[] => {
    const basicInsights: ProactiveInsight[] = [];
    
    // Basic medication insight
    const todaysTakenMeds = medications.filter(med => med.taken).length;
    const totalMeds = medications.length;
    const adherenceRate = totalMeds > 0 ? (todaysTakenMeds / totalMeds) * 100 : 100;
    
    if (adherenceRate >= 90) {
      basicInsights.push({
        id: 'basic_med_good',
        type: 'personalized',
        priority: 'low',
        title: 'Excellent Medication Adherence',
        message: `Great job maintaining ${Math.round(adherenceRate)}% medication adherence today.`,
        recommendations: ['Continue your current routine', 'Share this progress with your healthcare team'],
        confidence: 0.9,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
        actionable: false,
        dismissible: true
      });
    } else if (adherenceRate < 70) {
      basicInsights.push({
        id: 'basic_med_poor',
        type: 'personalized',
        priority: 'high',
        title: 'Medication Adherence Needs Attention',
        message: `Your medication adherence is at ${Math.round(adherenceRate)}%. Consistency is key for managing your health.`,
        recommendations: ['Set up medication reminders', 'Consider using a pill organizer', 'Discuss barriers with your healthcare provider'],
        confidence: 0.8,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
        actionable: true,
        dismissible: false
      });
    }
    
    return basicInsights;
  };

  const getInsightIcon = (insight: ProactiveInsight) => {
    switch (insight.type) {
      case 'trend':
        return insight.trend?.direction === 'improving' ? TrendingUp : 
               insight.trend?.direction === 'worsening' ? TrendingDown : Activity;
      case 'correlation':
        return Brain;
      case 'prediction':
        return AlertTriangle;
      case 'personalized':
        return Lightbulb;
      default:
        return CheckCircle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-ojas-error text-white';
      case 'high': return 'bg-ojas-alert text-ojas-text-main';
      case 'medium': return 'bg-ojas-primary text-white';
      case 'low': return 'bg-ojas-success text-white';
      default: return 'bg-ojas-text-secondary text-white';
    }
  };

  const getInsightBorderColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-ojas-error';
      case 'high': return 'border-l-ojas-alert';
      case 'medium': return 'border-l-ojas-primary';
      case 'low': return 'border-l-ojas-success';
      default: return 'border-l-ojas-text-secondary';
    }
  };

  const toggleExpanded = (insightId: string) => {
    const newExpanded = new Set(expandedInsights);
    if (newExpanded.has(insightId)) {
      newExpanded.delete(insightId);
    } else {
      newExpanded.add(insightId);
    }
    setExpandedInsights(newExpanded);
  };

  const handleInsightAction = (insight: ProactiveInsight) => {
    let navigationPath = '/more';
    
    // Smart navigation based on insight type
    if (insight.type === 'trend' && insight.title.toLowerCase().includes('medication')) {
      navigationPath = '/?tab=medications';
    } else if (insight.type === 'correlation' && insight.title.toLowerCase().includes('blood pressure')) {
      navigationPath = '/vitals';
    } else if (insight.title.toLowerCase().includes('symptom')) {
      navigationPath = '/symptoms';
    } else if (insight.title.toLowerCase().includes('refill')) {
      navigationPath = '/?tab=medications';
    } else if (insight.title.toLowerCase().includes('caregiver')) {
      navigationPath = '/calm-room';
    }
    
    toast({
      title: "Taking Action",
      description: `Opening relevant section for: ${insight.title}`,
      variant: "default"
    });
    
    navigate(navigationPath);
  };

  if (loading) {
    return (
      <div className="px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-ojas-primary flex items-center justify-center">
              <Brain className="w-3 h-3 text-white animate-pulse" />
            </div>
            <h2 className="text-lg font-semibold text-ojas-text-main">
              AI Insights
            </h2>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-ojas-soft border border-ojas-border animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-ojas-cloud-gray"></div>
                <div className="flex-1">
                  <div className="h-4 bg-ojas-cloud-gray rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-ojas-cloud-gray rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-ojas-primary flex items-center justify-center">
            <Brain className="w-3 h-3 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-ojas-text-main">
            AI Insights
          </h2>
          <div className="text-xs text-ojas-text-secondary bg-ojas-primary/10 px-2 py-1 rounded-full">
            {insights.length} active
          </div>
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
        {insights.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-ojas-soft border border-ojas-border text-center">
            <Lightbulb className="w-12 h-12 text-ojas-text-secondary mx-auto mb-3" />
            <p className="text-ojas-text-secondary">
              Keep logging your health data to receive personalized insights and recommendations.
            </p>
          </div>
        ) : (
          insights.map((insight) => {
            const IconComponent = getInsightIcon(insight);
            const isExpanded = expandedInsights.has(insight.id);
            
            return (
              <div 
                key={insight.id} 
                className={`bg-white rounded-xl p-4 shadow-ojas-soft border-l-4 border-r border-t border-b border-ojas-border ${getInsightBorderColor(insight.priority)}`}
              >
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
                        {insight.confidence && (
                          <span className="text-xs text-ojas-text-secondary bg-ojas-cloud-gray/50 px-2 py-1 rounded-full">
                            {Math.round(insight.confidence * 100)}% confident
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-ojas-text-secondary leading-relaxed mb-2">
                        {insight.message}
                      </p>

                      {insight.trend && (
                        <div className="text-xs text-ojas-text-secondary mb-2">
                          <span className="font-medium">Trend:</span> {insight.trend.direction} over {insight.trend.timeframe}
                        </div>
                      )}

                      {insight.recommendations.length > 0 && (
                        <div className="mt-3">
                          <button
                            onClick={() => toggleExpanded(insight.id)}
                            className="text-xs text-ojas-primary hover:text-ojas-primary-hover font-medium flex items-center gap-1"
                          >
                            {isExpanded ? 'Hide' : 'Show'} Recommendations
                            <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                              ▼
                            </span>
                          </button>
                          
                          {isExpanded && (
                            <div className="mt-2 bg-ojas-bg-light rounded-lg p-3">
                              <ul className="space-y-1 text-sm text-ojas-text-secondary">
                                {insight.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-ojas-primary text-xs mt-1">•</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
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
          })
        )}
      </div>
    </div>
  );
};

export default AIInsightsSection;
