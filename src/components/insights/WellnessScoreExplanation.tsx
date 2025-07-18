
import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Info, ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react';

interface WellnessScoreExplanationProps {
  score: number;
  breakdown?: {
    medications: number;
    symptoms: number;
    vitals: number;
    events: number;
    activities: number;
  };
  trends?: {
    direction: 'up' | 'down' | 'stable';
    change: number;
    period: string;
  };
}

const WellnessScoreExplanation: React.FC<WellnessScoreExplanationProps> = ({
  score,
  breakdown,
  trends
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-ojas-success';
    if (score >= 60) return 'text-ojas-alert';
    return 'text-ojas-error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const getTrendIcon = () => {
    if (!trends) return null;
    
    switch (trends.direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-ojas-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-ojas-error" />;
      default:
        return <div className="h-4 w-4 bg-ojas-text-secondary rounded-full" />;
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Score Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div>
              <Badge variant="outline" className={getScoreColor(score)}>
                {getScoreLabel(score)}
              </Badge>
              {trends && (
                <div className="flex items-center gap-1 mt-1 text-xs text-ojas-text-secondary">
                  {getTrendIcon()}
                  <span>
                    {trends.change > 0 ? '+' : ''}{trends.change} over {trends.period}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-ojas-text-secondary hover:text-ojas-text-main"
          >
            <Info className="h-4 w-4 mr-1" />
            {isExpanded ? 'Hide' : 'Show'} Details
            {isExpanded ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </Button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-4 border-t pt-4">
            <div>
              <h4 className="font-semibold text-ojas-text-main mb-2">How Your Score is Calculated</h4>
              <p className="text-sm text-ojas-text-secondary mb-3">
                Your wellness score is based on multiple factors from your daily health data:
              </p>
            </div>

            {breakdown && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Medication Adherence</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-16 h-2 bg-ojas-cloud-gray rounded-full overflow-hidden`}>
                      <div 
                        className="h-full bg-ojas-success rounded-full"
                        style={{ width: `${breakdown.medications}%` }}
                      />
                    </div>
                    <span className="font-medium">{breakdown.medications}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span>Symptom Management</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-16 h-2 bg-ojas-cloud-gray rounded-full overflow-hidden`}>
                      <div 
                        className="h-full bg-ojas-primary rounded-full"
                        style={{ width: `${breakdown.symptoms}%` }}
                      />
                    </div>
                    <span className="font-medium">{breakdown.symptoms}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span>Vital Signs Stability</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-16 h-2 bg-ojas-cloud-gray rounded-full overflow-hidden`}>
                      <div 
                        className="h-full bg-ojas-calming-green rounded-full"
                        style={{ width: `${breakdown.vitals}%` }}
                      />
                    </div>
                    <span className="font-medium">{breakdown.vitals}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span>Safety Events</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-16 h-2 bg-ojas-cloud-gray rounded-full overflow-hidden`}>
                      <div 
                        className="h-full bg-ojas-alert rounded-full"
                        style={{ width: `${breakdown.events}%` }}
                      />
                    </div>
                    <span className="font-medium">{breakdown.events}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span>Activity & Wellness</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-16 h-2 bg-ojas-cloud-gray rounded-full overflow-hidden`}>
                      <div 
                        className="h-full bg-ojas-soft-gold rounded-full"
                        style={{ width: `${breakdown.activities}%` }}
                      />
                    </div>
                    <span className="font-medium">{breakdown.activities}%</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-ojas-bg-light p-3 rounded-lg text-xs text-ojas-text-secondary">
              <p className="font-medium mb-1">💡 Understanding Your Score:</p>
              <ul className="space-y-1 ml-4">
                <li>• 80-100: Excellent health management with consistent routines</li>
                <li>• 60-79: Good progress with room for minor improvements</li>
                <li>• 40-59: Fair management, consider focusing on key areas</li>
                <li>• Below 40: May need additional support or care plan adjustments</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WellnessScoreExplanation;
