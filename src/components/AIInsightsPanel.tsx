import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Heart, 
  X, 
  ChevronDown, 
  ChevronUp,
  Lightbulb,
  Shield,
  Activity,
  Leaf
} from 'lucide-react';
import { AIInsightsEngine, AIInsight } from '@/utils/aiInsights';
import { useVitals } from '@/hooks/useVitals';
import { useSymptoms } from '@/hooks/useSymptoms';
import { useMedications } from '@/hooks/useMedications';
import { useNavigate } from 'react-router-dom';

interface AIInsightsPanelProps {
  userRole?: 'patient' | 'caregiver';
  className?: string;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ 
  userRole = 'patient',
  className = '' 
}) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  
  const { vitals } = useVitals();
  const { symptoms } = useSymptoms();
  const { medications } = useMedications();
  const navigate = useNavigate();

  const aiEngine = AIInsightsEngine.getInstance();

  useEffect(() => {
    if (vitals && symptoms && medications) {
      setLoading(true);
      
      // Calculate recent medication changes (placeholder - would need actual tracking)
      const recentMedicationChanges = 0;
      
      const generatedInsights = aiEngine.generateInsights(
        vitals,
        symptoms,
        medications,
        recentMedicationChanges,
        userRole
      );
      
      setInsights(generatedInsights);
      setLoading(false);
    }
  }, [vitals, symptoms, medications, userRole]);

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'fall_risk':
        return <Shield className="h-5 w-5" />;
      case 'infection_warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'medication_timing':
        return <Clock className="h-5 w-5" />;
      case 'caregiver_support':
        return <Heart className="h-5 w-5" />;
      case 'positive_pattern':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: AIInsight['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-ojas-error text-ojas-mist-white';
      case 'high':
        return 'bg-ojas-alert text-ojas-mist-white';
      case 'medium':
        return 'bg-ojas-primary text-ojas-mist-white';
      case 'low':
        return 'bg-ojas-success text-ojas-mist-white';
      default:
        return 'bg-ojas-text-secondary text-ojas-mist-white';
    }
  };

  const toggleInsightExpansion = (insightId: string) => {
    const newExpanded = new Set(expandedInsights);
    if (newExpanded.has(insightId)) {
      newExpanded.delete(insightId);
    } else {
      newExpanded.add(insightId);
    }
    setExpandedInsights(newExpanded);
  };

  const dismissInsight = (insightId: string) => {
    aiEngine.dismissInsight(insightId);
    setInsights(prev => prev.filter(insight => insight.id !== insightId));
  };

  const urgentInsights = insights.filter(i => i.priority === 'urgent' || i.priority === 'high');
  const normalInsights = insights.filter(i => i.priority === 'medium' || i.priority === 'low');

  if (loading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 animate-pulse text-ojas-primary" />
          <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
            AI Health Insights
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-ojas-cloud-gray dark:bg-ojas-slate-800 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-ojas-cloud-gray dark:bg-ojas-slate-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-ojas-primary" />
          <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
            AI Health Insights
          </h3>
        </div>
        <div className="text-center py-6">
          <Lightbulb className="h-12 w-12 text-ojas-text-secondary dark:text-ojas-cloud-silver mx-auto mb-3" />
          <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver">
            No insights available yet. Keep logging your health data for personalized recommendations.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-ojas-primary" />
          <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
            AI Health Insights
          </h3>
          <Badge variant="secondary">
            {insights.length} insight{insights.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/calm-room')}
          className="flex items-center gap-2 text-ojas-calming-green border-ojas-calming-green hover:bg-ojas-calming-green/10"
        >
          <Leaf className="h-4 w-4" />
          Calm Room
        </Button>
      </div>

      <div className="space-y-4">
        {/* Urgent/High Priority Insights */}
        {urgentInsights.map((insight) => (
          <Alert 
            key={insight.id}
            className={`border-l-4 ${
              insight.priority === 'urgent' 
                ? 'border-l-ojas-error bg-ojas-error/5' 
                : 'border-l-ojas-alert bg-ojas-alert/5'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-1 rounded-full ${
                insight.priority === 'urgent' ? 'text-ojas-error' : 'text-ojas-alert'
              }`}>
                {getInsightIcon(insight.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-ojas-text-main dark:text-ojas-mist-white">
                    {insight.title}
                  </h4>
                  <Badge className={getPriorityColor(insight.priority)}>
                    {insight.priority}
                  </Badge>
                </div>
                
                <AlertDescription className="text-ojas-text-secondary dark:text-ojas-cloud-silver mb-3">
                  {insight.message}
                </AlertDescription>

                {insight.recommendations.length > 0 && (
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleInsightExpansion(insight.id)}
                      className="mb-2 text-ojas-primary hover:text-ojas-primary-hover"
                    >
                      {expandedInsights.has(insight.id) ? (
                        <>Hide Recommendations <ChevronUp className="h-4 w-4 ml-1" /></>
                      ) : (
                        <>View Recommendations <ChevronDown className="h-4 w-4 ml-1" /></>
                      )}
                    </Button>

                    {expandedInsights.has(insight.id) && (
                      <ul className="list-disc list-inside space-y-1 text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver ml-4">
                        {insight.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {insight.dismissible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissInsight(insight.id)}
                  className="text-ojas-text-secondary hover:text-ojas-text-main"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Alert>
        ))}

        {/* Normal Priority Insights */}
        {normalInsights.map((insight) => (
          <Card key={insight.id} className="p-4 border border-ojas-cloud-gray dark:border-ojas-slate-700">
            <div className="flex items-start gap-3">
              <div className={`p-1 rounded-full ${
                insight.type === 'positive_pattern' 
                  ? 'text-ojas-success' 
                  : 'text-ojas-primary'
              }`}>
                {getInsightIcon(insight.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-ojas-text-main dark:text-ojas-mist-white">
                    {insight.title}
                  </h4>
                  <Badge className={getPriorityColor(insight.priority)}>
                    {insight.priority}
                  </Badge>
                </div>
                
                <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver mb-3">
                  {insight.message}
                </p>

                {insight.recommendations.length > 0 && (
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleInsightExpansion(insight.id)}
                      className="mb-2 text-ojas-primary hover:text-ojas-primary-hover"
                    >
                      {expandedInsights.has(insight.id) ? (
                        <>Hide Details <ChevronUp className="h-4 w-4 ml-1" /></>
                      ) : (
                        <>View Details <ChevronDown className="h-4 w-4 ml-1" /></>
                      )}
                    </Button>

                    {expandedInsights.has(insight.id) && (
                      <ul className="list-disc list-inside space-y-1 text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver ml-4">
                        {insight.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {insight.dismissible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissInsight(insight.id)}
                  className="text-ojas-text-secondary hover:text-ojas-text-main"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};