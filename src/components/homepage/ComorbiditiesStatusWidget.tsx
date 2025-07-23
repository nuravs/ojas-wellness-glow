
import React from 'react';
import { Heart, AlertCircle, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useComorbidities } from '../../hooks/useComorbidities';
import { useNavigate } from 'react-router-dom';

interface ComorbiditiesStatusWidgetProps {
  userRole: 'patient' | 'caregiver';
}

const ComorbiditiesStatusWidget: React.FC<ComorbiditiesStatusWidgetProps> = ({ userRole }) => {
  const { comorbidities } = useComorbidities();
  const navigate = useNavigate();

  if (comorbidities.length === 0) {
    return (
      <Card className="shadow-ojas-soft border border-ojas-border">
        <CardContent className="p-6">
          <div className="text-center">
            <Heart className="w-12 h-12 text-ojas-text-secondary mx-auto mb-3" />
            <h3 className="font-semibold text-ojas-text-main mb-2">Health Conditions</h3>
            <p className="text-sm text-ojas-text-secondary mb-4">
              Track your health conditions for better wellness insights
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/comorbidities')}
              className="flex items-center gap-2"
            >
              Add Conditions
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const controlledConditions = comorbidities.filter(c => c.status === 'controlled');
  const activeConditions = comorbidities.filter(c => c.status === 'active');
  const monitoringConditions = comorbidities.filter(c => c.status === 'monitoring');

  // Generate status text
  const getStatusText = () => {
    if (controlledConditions.length === comorbidities.length) {
      return `All ${comorbidities.length} condition${comorbidities.length > 1 ? 's' : ''} well managed`;
    }
    
    if (activeConditions.length > 0) {
      return `${activeConditions.length} condition${activeConditions.length > 1 ? 's' : ''} need attention`;
    }
    
    if (monitoringConditions.length > 0) {
      return `${monitoringConditions.length} condition${monitoringConditions.length > 1 ? 's' : ''} under monitoring`;
    }
    
    return 'Conditions status updated';
  };

  const getStatusColor = () => {
    if (activeConditions.length > 0) return 'text-ojas-alert';
    if (monitoringConditions.length > 0) return 'text-ojas-primary';
    return 'text-ojas-success';
  };

  const getStatusIcon = () => {
    if (activeConditions.length > 0) return AlertCircle;
    if (monitoringConditions.length > 0) return Clock;
    return CheckCircle;
  };

  const StatusIcon = getStatusIcon();

  return (
    <Card className="shadow-ojas-soft border border-ojas-border">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-ojas-primary/10 flex items-center justify-center">
            <Heart className="w-6 h-6 text-ojas-primary" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-ojas-text-main">Health Conditions</h3>
              <div className={`flex items-center gap-1 ${getStatusColor()}`}>
                <StatusIcon className="w-4 h-4" />
                <span className="text-xs font-medium">{comorbidities.length}</span>
              </div>
            </div>
            
            {/* Status Text Highlight */}
            <p className={`text-sm font-medium mb-3 ${getStatusColor()}`}>
              {getStatusText()}
            </p>

            {/* Condition Cards Grid */}
            <div className="grid grid-cols-1 gap-2 mb-4">
              {comorbidities.slice(0, 3).map((condition) => (
                <div 
                  key={condition.id} 
                  className="flex items-center justify-between p-3 bg-ojas-bg-light rounded-lg border border-ojas-border"
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-ojas-text-main">
                      {condition.condition_name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-ojas-text-secondary capitalize">
                        {condition.severity} severity
                      </span>
                      <span className="text-xs text-ojas-text-secondary">•</span>
                      <span className="text-xs text-ojas-text-secondary capitalize">
                        {condition.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`w-3 h-3 rounded-full ${
                    condition.status === 'controlled' ? 'bg-ojas-success' :
                    condition.status === 'monitoring' ? 'bg-ojas-primary' :
                    'bg-ojas-alert'
                  }`} />
                </div>
              ))}
              
              {comorbidities.length > 3 && (
                <div className="p-3 bg-ojas-bg-light rounded-lg border border-ojas-border text-center">
                  <span className="text-sm text-ojas-text-secondary">
                    +{comorbidities.length - 3} more condition{comorbidities.length - 3 > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Summary Stats */}
            <div className="flex items-center justify-between text-xs text-ojas-text-secondary mb-4">
              <div className="flex items-center gap-4">
                {controlledConditions.length > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-ojas-success" />
                    <span>{controlledConditions.length} controlled</span>
                  </div>
                )}
                {activeConditions.length > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-ojas-alert" />
                    <span>{activeConditions.length} active</span>
                  </div>
                )}
                {monitoringConditions.length > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-ojas-primary" />
                    <span>{monitoringConditions.length} monitoring</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/comorbidities')}
              className="w-full flex items-center justify-center gap-2"
            >
              Manage Conditions
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComorbiditiesStatusWidget;
