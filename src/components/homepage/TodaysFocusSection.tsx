
import React from 'react';
import { useHealthStore } from '../../stores/healthStore';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export const TodaysFocusSection: React.FC = () => {
  const { todaysFocus } = useHealthStore();

  if (!todaysFocus) return null;

  const getPriorityIcon = () => {
    switch (todaysFocus.priority) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getPriorityColor = () => {
    switch (todaysFocus.priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-green-200 bg-green-50';
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-ojas-charcoal-gray">
        Today's Focus
      </h2>
      
      <Card className={`${getPriorityColor()} border-2 transition-all duration-200 hover:shadow-md`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getPriorityIcon()}
              <div>
                <h3 className="font-medium text-ojas-charcoal-gray">
                  {todaysFocus.title}
                </h3>
                <p className="text-sm text-ojas-slate-gray">
                  Priority: {todaysFocus.priority}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0"
              aria-label={`${todaysFocus.action} - ${todaysFocus.title}`}
            >
              <span className="mr-2">{todaysFocus.action}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
