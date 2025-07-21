
import React from 'react';
import { TrendingUp, CheckCircle, AlertTriangle, Clock, ExternalLink, Pill, Activity, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

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
  const navigate = useNavigate();

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
        time: 'Today',
        actionText: 'View Details',
        actionRoute: '/medications'
      });
    } else if (adherenceRate < 70) {
      insights.push({
        id: 'med-adherence-low',
        icon: AlertTriangle,
        title: 'Medication Adherence Alert',
        description: `Your medication adherence is at ${Math.round(adherenceRate)}%. Consider setting reminders to improve consistency.`,
        priority: 'high',
        actionable: true,
        time: 'Today',
        actionText: 'Set Reminders',
        actionRoute: '/medications'
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
          time: '2 days ago',
          actionText: 'Log Reading',
          actionRoute: '/vitals'
        });
      }

      // Missing vitals insight
      const lastVitalDate = new Date(Math.max(...vitals.map(v => new Date(v.measured_at).getTime())));
      const daysSinceLastVital = Math.floor((Date.now() - lastVitalDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLastVital > 7) {
        insights.push({
          id: 'vitals-missing',
          icon: Heart,
          title: 'Vitals Check Overdue',
          description: `It's been ${daysSinceLastVital} days since your last vital reading. Regular monitoring is important.`,
          priority: 'medium',
          actionable: true,
          time: `${daysSinceLastVital} days ago`,
          actionText: 'Log Vitals',
          actionRoute: '/vitals'
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
          time: 'This week',
          actionText: 'View Trends',
          actionRoute: '/symptoms'
        });
      }
    }

    // Medication refill reminder
    const medicationsNeedingRefill = medications.filter(med => {
      if (!med.next_refill_date || !med.pills_remaining) return false;
      const refillDate = new Date(med.next_refill_date);
      const daysUntilRefill = Math.ceil((refillDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilRefill <= 7 || med.pills_remaining <= 7;
    });

    if (medicationsNeedingRefill.length > 0) {
      insights.push({
        id: 'refill-reminder',
        icon: Pill,
        title: 'Medication Refill Due',
        description: `${medicationsNeedingRefill.length} medication${medicationsNeedingRefill.length > 1 ? 's' : ''} need refilling soon.`,
        priority: 'medium',
        actionable: true,
        time: 'This week',
        actionText: 'Manage Refills',
        actionRoute: '/medications'
      });
    }

    // Default insight if no data
    if (insights.length === 0) {
      insights.push({
        id: 'welcome',
        icon: CheckCircle,
        title: 'Welcome to OJAS',
        description: 'Start logging your medications and symptoms to receive personalized insights.',
        priority: 'low',
        actionable: true,
        time: 'Getting started',
        actionText: 'Get Started',
        actionRoute: '/medications'
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
    // Provide user feedback
    toast({
      title: "Taking Action",
      description: `Navigating to ${insight.actionText.toLowerCase()}...`,
      variant: "default"
    });

    // Navigate to appropriate page
    navigate(insight.actionRoute);
  };

  const handleViewAll = () => {
    // For now, navigate to more page where detailed insights could be shown
    navigate('/more');
    toast({
      title: "AI Insights",
      description: "Viewing all health insights and recommendations.",
      variant: "default"
    });
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
          onClick={handleViewAll}
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
                    {insight.actionText || 'Take Action'}
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
