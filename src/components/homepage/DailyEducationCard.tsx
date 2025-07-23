
import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, Brain, Heart, Activity, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useComorbidities } from '../../hooks/useComorbidities';
import { useSymptoms } from '../../hooks/useSymptoms';

interface EducationalContent {
  id: string;
  title: string;
  category: 'tip' | 'exercise' | 'insight' | 'reminder';
  content: string;
  actionText?: string;
  icon: any;
  relevantTo: string[];
  priority: number;
}

interface DailyEducationCardProps {
  userRole: 'patient' | 'caregiver';
  onViewMore?: () => void;
}

const DailyEducationCard: React.FC<DailyEducationCardProps> = ({ 
  userRole, 
  onViewMore 
}) => {
  const [currentContent, setCurrentContent] = useState<EducationalContent | null>(null);
  const { comorbidities } = useComorbidities();
  const { symptoms } = useSymptoms();

  // Educational content database - would be AI-powered in production
  const educationalDatabase: EducationalContent[] = [
    {
      id: 'parkinson-morning-routine',
      title: 'Morning Movement Matters',
      category: 'tip',
      content: 'Starting your day with gentle stretching can help reduce morning stiffness. Try simple neck rolls and shoulder shrugs before getting out of bed.',
      actionText: 'Try Morning Routine',
      icon: Activity,
      relevantTo: ['parkinson_disease', 'stiffness'],
      priority: 8
    },
    {
      id: 'medication-timing',
      title: 'Consistent Timing Helps',
      category: 'insight',
      content: 'Taking medications at the same time daily helps maintain steady therapeutic levels and can reduce fluctuations in symptoms.',
      actionText: 'Set Reminders',
      icon: Calendar,
      relevantTo: ['medication_adherence'],
      priority: 9
    },
    {
      id: 'brain-exercise',
      title: 'Keep Your Mind Active',
      category: 'exercise',
      content: 'Simple cognitive exercises like word puzzles or memory games can help maintain mental sharpness. Just 10 minutes daily makes a difference.',
      actionText: 'Start Brain Gym',
      icon: Brain,
      relevantTo: ['cognitive_function', 'memory'],
      priority: 7
    },
    {
      id: 'hydration-reminder',
      title: 'Stay Hydrated for Wellness',
      category: 'reminder',
      content: 'Proper hydration supports medication effectiveness and can help reduce dizziness. Aim for small, frequent sips throughout the day.',
      actionText: 'Set Water Reminder',
      icon: Heart,
      relevantTo: ['dizziness', 'general_wellness'],
      priority: 6
    },
    {
      id: 'stress-management',
      title: 'Gentle Stress Relief',
      category: 'tip',
      content: 'Deep breathing exercises can help manage stress and may reduce symptom severity. Try the 4-7-8 technique: inhale for 4, hold for 7, exhale for 8.',
      actionText: 'Try Breathing Exercise',
      icon: Heart,
      relevantTo: ['stress', 'anxiety', 'mood'],
      priority: 7
    }
  ];

  useEffect(() => {
    // Intelligent content selection based on user's conditions and recent symptoms
    const selectDailyContent = () => {
      const userConditions = comorbidities.map(c => c.condition_name.toLowerCase().replace(/\s+/g, '_'));
      const recentSymptoms = symptoms
        .filter(s => {
          const loggedDate = new Date(s.logged_at);
          const threeDaysAgo = new Date();
          threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
          return loggedDate >= threeDaysAgo;
        })
        .map(s => s.symptom_type);

      const relevantFactors = [...userConditions, ...recentSymptoms, 'general_wellness'];
      
      // Score content based on relevance
      const scoredContent = educationalDatabase.map(content => {
        const relevanceScore = content.relevantTo.reduce((score, factor) => {
          return relevantFactors.includes(factor) ? score + 2 : score;
        }, 0);
        
        return {
          ...content,
          totalScore: content.priority + relevanceScore
        };
      });

      // Sort by score and select the most relevant
      const bestContent = scoredContent.sort((a, b) => b.totalScore - a.totalScore)[0];
      setCurrentContent(bestContent);
    };

    selectDailyContent();
  }, [comorbidities, symptoms]);

  if (!currentContent) return null;

  const IconComponent = currentContent.icon;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tip': return 'text-ojas-primary bg-ojas-primary/10';
      case 'exercise': return 'text-ojas-success bg-ojas-success/10';
      case 'insight': return 'text-ojas-alert bg-ojas-alert/10';
      case 'reminder': return 'text-ojas-error bg-ojas-error/10';
      default: return 'text-ojas-text-secondary bg-ojas-text-secondary/10';
    }
  };

  return (
    <Card className="shadow-ojas-soft border border-ojas-border">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryColor(currentContent.category)}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-ojas-text-secondary" />
              <span className="text-xs font-medium text-ojas-text-secondary uppercase tracking-wide">
                Daily Wellness Tip
              </span>
            </div>
            
            <h3 className="font-semibold text-ojas-text-main mb-2">
              {currentContent.title}
            </h3>
            
            <p className="text-sm text-ojas-text-secondary leading-relaxed mb-4">
              {currentContent.content}
            </p>

            <div className="flex items-center justify-between">
              {currentContent.actionText && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewMore}
                  className="flex items-center gap-2"
                >
                  {currentContent.actionText}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
              
              <button
                onClick={onViewMore}
                className="text-xs text-ojas-primary hover:text-ojas-primary-hover font-medium"
              >
                View More Tips
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyEducationCard;
