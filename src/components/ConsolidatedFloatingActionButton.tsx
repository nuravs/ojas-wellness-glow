import React, { useState } from 'react';
import { Plus, Pill, Activity, Heart, Calendar, HelpCircle, Bot, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface FloatingAction {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  description: string;
  action: () => void;
  color: string;
}

const ConsolidatedFloatingActionButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile } = useAuth();

  const getContextualActions = (): FloatingAction[] => {
    const currentPath = location.pathname;
    const baseActions: FloatingAction[] = [];

    // Context-aware actions based on current page
    if (currentPath === '/' || currentPath === '/home') {
      baseActions.push(
        {
          id: 'add-medication',
          icon: Pill,
          label: 'Add Medication',
          description: 'Add a new medication to your list',
          action: () => {
            navigate('/?tab=medications&action=add');
            setIsExpanded(false);
          },
          color: 'bg-ojas-primary hover:bg-ojas-primary-hover'
        },
        {
          id: 'log-symptom',
          icon: Heart,
          label: 'Log Symptom',
          description: 'Record how you\'re feeling',
          action: () => {
            navigate('/symptoms');
            setIsExpanded(false);
          },
          color: 'bg-ojas-calming-green hover:bg-ojas-calming-green/90'
        },
        {
          id: 'add-vital',
          icon: Activity,
          label: 'Add Vital',
          description: 'Record blood pressure, weight, etc.',
          action: () => {
            navigate('/vitals?action=add');
            setIsExpanded(false);
          },
          color: 'bg-ojas-alert hover:bg-ojas-alert/90'
        }
      );
    } else if (currentPath === '/medications') {
      baseActions.push(
        {
          id: 'add-medication',
          icon: Pill,
          label: 'Add Medication',
          description: 'Add a new medication',
          action: () => {
            navigate('/medications?action=add');
            setIsExpanded(false);
          },
          color: 'bg-ojas-primary hover:bg-ojas-primary-hover'
        },
        {
          id: 'scan-prescription',
          icon: Calendar,
          label: 'Scan Prescription',
          description: 'Scan prescription label',
          action: () => {
            navigate('/medications?action=scan');
            setIsExpanded(false);
          },
          color: 'bg-ojas-secondary hover:bg-ojas-secondary/90'
        }
      );
    } else if (currentPath === '/vitals') {
      baseActions.push(
        {
          id: 'add-vital',
          icon: Activity,
          label: 'Add Vital',
          description: 'Record a new vital sign',
          action: () => {
            navigate('/vitals?action=add');
            setIsExpanded(false);
          },
          color: 'bg-ojas-alert hover:bg-ojas-alert/90'
        }
      );
    } else if (currentPath === '/symptoms') {
      baseActions.push(
        {
          id: 'log-symptom',
          icon: Heart,
          label: 'Log Symptom',
          description: 'Record how you\'re feeling',
          action: () => {
            navigate('/symptoms?action=add');
            setIsExpanded(false);
          },
          color: 'bg-ojas-calming-green hover:bg-ojas-calming-green/90'
        }
      );
    }

    // Always available actions
    baseActions.push(
      {
        id: 'ai-help',
        icon: Bot,
        label: 'AI Assistant',
        description: 'Get personalized health insights',
        action: () => {
          navigate('/more');
          setIsExpanded(false);
        },
        color: 'bg-ojas-secondary hover:bg-ojas-secondary/90'
      },
      {
        id: 'help',
        icon: HelpCircle,
        label: 'Help',
        description: 'Get help and support',
        action: () => {
          navigate('/help');
          setIsExpanded(false);
        },
        color: 'bg-ojas-text-secondary hover:bg-ojas-text-secondary/90'
      }
    );

    return baseActions;
  };

  const contextualActions = getContextualActions();

  const handleMainButtonClick = () => {
    if (contextualActions.length === 1) {
      // If only one action, execute it directly
      contextualActions[0].action();
    } else {
      // Otherwise, expand the menu
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Floating Action Menu */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Action Items */}
        {isExpanded && (
          <div className="absolute bottom-20 right-0 space-y-3 animate-scale-in">
            {contextualActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Card 
                  key={action.id} 
                  className="shadow-ojas-strong border border-ojas-border hover:shadow-ojas-strong transition-all duration-200"
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: 'fade-in 0.2s ease-out forwards'
                  }}
                >
                  <CardContent className="p-0">
                    <Button
                      onClick={action.action}
                      className={`${action.color} text-white flex items-center gap-3 px-4 py-3 w-full justify-start rounded-lg border-none shadow-none hover:shadow-none`}
                      style={{ minHeight: '56px', minWidth: '200px' }}
                    >
                      <IconComponent className="w-5 h-5 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-semibold text-sm">{action.label}</div>
                        <div className="text-xs opacity-90">{action.description}</div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Main FAB */}
        <Button
          onClick={handleMainButtonClick}
          className={`w-16 h-16 rounded-full shadow-ojas-strong hover:shadow-ojas-strong transition-all duration-200 active:scale-95 ${
            isExpanded 
              ? 'bg-ojas-error hover:bg-ojas-error/90' 
              : 'bg-ojas-primary hover:bg-ojas-primary-hover'
          }`}
          style={{ minHeight: '64px', minWidth: '64px' }}
        >
          {isExpanded ? (
            <X className="w-8 h-8 text-white" />
          ) : (
            <Plus className="w-8 h-8 text-white" />
          )}
        </Button>
      </div>
    </>
  );
};

export default ConsolidatedFloatingActionButton;
