
import React, { useState, useEffect } from 'react';
import { Brain, Play, Target, Clock, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useComorbidities } from '../../hooks/useComorbidities';
import { useBrainGym } from '../../hooks/useBrainGym';
import { useNavigate } from 'react-router-dom';

interface DailyExercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 1 | 2 | 3;
  targetSkills: string[];
  recommendedFor: string[];
  instructions: string[];
}

interface DailyBrainExerciseProps {
  userRole: 'patient' | 'caregiver';
}

const DailyBrainExercise: React.FC<DailyBrainExerciseProps> = ({ userRole }) => {
  const [todaysExercise, setTodaysExercise] = useState<DailyExercise | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const { comorbidities } = useComorbidities();
  const { exercises, startSession } = useBrainGym();
  const navigate = useNavigate();

  // Curated exercises for neurological patients
  const neurologicalExercises: DailyExercise[] = [
    {
      id: 'finger-tapping',
      name: 'Finger Tapping Rhythm',
      description: 'Improve fine motor control and coordination with rhythmic finger exercises.',
      duration: 3,
      difficulty: 1,
      targetSkills: ['Fine Motor', 'Coordination'],
      recommendedFor: ['parkinson_disease', 'tremor', 'stiffness'],
      instructions: [
        'Place your hand flat on a surface',
        'Tap each finger in sequence: thumb, index, middle, ring, pinky',
        'Maintain a steady rhythm',
        'Repeat for 30 seconds with each hand'
      ]
    },
    {
      id: 'memory-sequence',
      name: 'Memory Pattern Challenge',
      description: 'Enhance working memory and cognitive flexibility with pattern recognition.',
      duration: 5,
      difficulty: 2,
      targetSkills: ['Memory', 'Attention'],
      recommendedFor: ['cognitive_decline', 'memory_issues', 'concentration'],
      instructions: [
        'Observe the sequence of colors/shapes',
        'Wait for the pattern to disappear',
        'Reproduce the sequence in correct order',
        'Sequences get longer as you progress'
      ]
    },
    {
      id: 'word-association',
      name: 'Word Connection Game',
      description: 'Strengthen language pathways and verbal fluency through word associations.',
      duration: 4,
      difficulty: 1,
      targetSkills: ['Language', 'Processing Speed'],
      recommendedFor: ['speech_issues', 'word_finding', 'cognitive_function'],
      instructions: [
        'A word will appear on screen',
        'Think of a related word',
        'Tap to reveal the connection',
        'Build chains of related words'
      ]
    },
    {
      id: 'balance-focus',
      name: 'Mental Balance Challenge',
      description: 'Combine cognitive tasks with balance awareness for dual-task training.',
      duration: 6,
      difficulty: 3,
      targetSkills: ['Balance', 'Dual-Task', 'Attention'],
      recommendedFor: ['balance_issues', 'falls_risk', 'postural_instability'],
      instructions: [
        'Stand comfortably (use support if needed)',
        'Count backwards from 100 by 7s',
        'Maintain your balance while counting',
        'Focus on both tasks simultaneously'
      ]
    }
  ];

  useEffect(() => {
    // Select today's exercise based on user's conditions and previous performance
    const selectTodaysExercise = () => {
      const userConditions = comorbidities.map(c => 
        c.condition_name.toLowerCase().replace(/\s+/g, '_')
      );
      
      // Add common neurological symptoms to consider
      const neurologicalFactors = [...userConditions, 'general_cognitive_health'];
      
      // Score exercises based on relevance to user's conditions
      const scoredExercises = neurologicalExercises.map(exercise => {
        const relevanceScore = exercise.recommendedFor.reduce((score, condition) => {
          return neurologicalFactors.includes(condition) ? score + 2 : score;
        }, 0);
        
        // Add variety - prefer exercises not done recently (simplified)
        const varietyBonus = Math.random() * 2;
        
        return {
          ...exercise,
          totalScore: relevanceScore + varietyBonus
        };
      });

      // Select the highest scoring exercise
      const selectedExercise = scoredExercises.sort((a, b) => b.totalScore - a.totalScore)[0];
      setTodaysExercise(selectedExercise);
    };

    selectTodaysExercise();
  }, [comorbidities]);

  const handleStartExercise = () => {
    if (todaysExercise) {
      setIsStarted(true);
      // In a real implementation, this would start the actual exercise
      // For now, we'll navigate to brain gym page
      navigate('/brain-gym');
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-ojas-success bg-ojas-success/10';
      case 2: return 'text-ojas-alert bg-ojas-alert/10';
      case 3: return 'text-ojas-error bg-ojas-error/10';
      default: return 'text-ojas-text-secondary bg-ojas-text-secondary/10';
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Gentle';
      case 2: return 'Moderate';
      case 3: return 'Challenge';
      default: return 'Unknown';
    }
  };

  if (!todaysExercise) return null;

  return (
    <Card className="shadow-ojas-soft border border-ojas-border">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-ojas-primary/10 flex items-center justify-center">
            <Brain className="w-6 h-6 text-ojas-primary" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-ojas-text-secondary" />
              <span className="text-xs font-medium text-ojas-text-secondary uppercase tracking-wide">
                Daily Brain Exercise
              </span>
            </div>
            
            <h3 className="font-semibold text-ojas-text-main mb-1">
              {todaysExercise.name}
            </h3>
            
            <p className="text-sm text-ojas-text-secondary leading-relaxed mb-3">
              {todaysExercise.description}
            </p>

            {/* Exercise Details */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-xs text-ojas-text-secondary">
                <Clock className="w-3 h-3" />
                {todaysExercise.duration} min
              </div>
              
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(todaysExercise.difficulty)}`}>
                {getDifficultyLabel(todaysExercise.difficulty)}
              </div>
              
              <div className="flex items-center gap-1">
                {todaysExercise.targetSkills.slice(0, 2).map((skill, index) => (
                  <span key={index} className="text-xs bg-ojas-primary/10 text-ojas-primary px-2 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleStartExercise}
                size="sm"
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Exercise
              </Button>
              
              <button
                onClick={() => navigate('/brain-gym')}
                className="text-xs text-ojas-primary hover:text-ojas-primary-hover font-medium"
              >
                Explore More
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyBrainExercise;
