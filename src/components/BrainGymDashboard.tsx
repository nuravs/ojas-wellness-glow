import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Trophy, Target, Clock, Brain, Zap } from 'lucide-react';
import { useBrainGym, type BrainGymExercise } from '../hooks/useBrainGym';

interface BrainGymDashboardProps {
  onBack: () => void;
  onStartExercise: (exercise: BrainGymExercise) => void;
}

const BrainGymDashboard: React.FC<BrainGymDashboardProps> = ({ onBack, onStartExercise }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { exercises, loading, getExercisesByCategory, getAverageScore, getRecommendedDifficulty, getPerformanceStats } = useBrainGym();
  
  const categories = [
    { id: 'all', name: 'All Exercises', icon: Brain, color: 'text-ojas-primary-blue' },
    { id: 'memory', name: 'Memory', icon: Brain, color: 'text-ojas-soft-gold' },
    { id: 'attention', name: 'Attention', icon: Target, color: 'text-ojas-vibrant-coral' },
    { id: 'coordination', name: 'Coordination', icon: Zap, color: 'text-ojas-calming-green' },
    { id: 'problem_solving', name: 'Problem Solving', icon: Trophy, color: 'text-ojas-primary-blue' }
  ];

  const filteredExercises = selectedCategory === 'all' 
    ? exercises 
    : getExercisesByCategory(selectedCategory);

  const performanceStats = getPerformanceStats();

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-ojas-calming-green text-white';
      case 2: return 'bg-ojas-soft-gold text-white';
      case 3: return 'bg-ojas-primary-blue text-white';
      case 4: return 'bg-ojas-vibrant-coral text-white';
      case 5: return 'bg-red-600 text-white';
      default: return 'bg-ojas-cloud-silver text-ojas-charcoal-gray';
    }
  };

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Easy';
      case 3: return 'Medium';
      case 4: return 'Hard';
      case 5: return 'Expert';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ojas-mist-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-ojas-cloud-silver rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-ojas-cloud-silver rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ojas-mist-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200 shadow-ojas-soft"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-ojas-charcoal-gray" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-ojas-charcoal-gray">Brain Gym</h1>
            <p className="text-ojas-slate-gray">Cognitive exercises designed for neurological wellness</p>
          </div>
        </div>

        {/* Performance Stats */}
        {performanceStats.totalSessions > 0 && (
          <div className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6 mb-8">
            <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-4">Your Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-ojas-primary-blue mb-2">
                  {performanceStats.totalSessions}
                </div>
                <div className="text-sm text-ojas-slate-gray">Sessions Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-ojas-soft-gold mb-2">
                  {Math.round(performanceStats.averageScore)}%
                </div>
                <div className="text-sm text-ojas-slate-gray">Average Score</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  performanceStats.improvementTrend === 'improving' ? 'text-ojas-calming-green' :
                  performanceStats.improvementTrend === 'declining' ? 'text-ojas-vibrant-coral' :
                  'text-ojas-slate-gray'
                }`}>
                  {performanceStats.improvementTrend === 'improving' ? '↗' :
                   performanceStats.improvementTrend === 'declining' ? '↘' : '→'}
                </div>
                <div className="text-sm text-ojas-slate-gray">Trend</div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map(category => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-ojas-primary-blue text-white shadow-ojas-medium'
                      : 'bg-white text-ojas-charcoal-gray hover:bg-ojas-primary-blue/10 shadow-ojas-soft'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map(exercise => {
            const averageScore = getAverageScore(exercise.id);
            const recommendedDifficulty = getRecommendedDifficulty(exercise.id);
            
            return (
              <div key={exercise.id} className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver overflow-hidden hover:shadow-ojas-medium transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-2">
                        {exercise.name}
                      </h3>
                      <p className="text-sm text-ojas-slate-gray mb-4">
                        {exercise.description}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(exercise.difficulty_level)}`}>
                      {getDifficultyLabel(exercise.difficulty_level)}
                    </div>
                  </div>

                  {/* Exercise Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-ojas-slate-gray" />
                      <span className="text-sm text-ojas-slate-gray">{exercise.estimated_duration} minutes</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {exercise.target_skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-ojas-cloud-silver text-xs text-ojas-charcoal-gray rounded-md">
                          {skill.replace('_', ' ')}
                        </span>
                      ))}
                      {exercise.target_skills.length > 3 && (
                        <span className="px-2 py-1 bg-ojas-cloud-silver text-xs text-ojas-charcoal-gray rounded-md">
                          +{exercise.target_skills.length - 3} more
                        </span>
                      )}
                    </div>

                    {averageScore > 0 && (
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-ojas-soft-gold" />
                        <span className="text-sm text-ojas-slate-gray">
                          Best: {Math.round(averageScore)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => onStartExercise(exercise)}
                    className="w-full px-4 py-3 bg-ojas-primary-blue text-white rounded-xl font-medium hover:bg-ojas-primary-blue-hover transition-colors duration-200 flex items-center justify-center gap-2 shadow-ojas-medium"
                  >
                    <Play className="w-5 h-5" />
                    Start Exercise
                  </button>

                  {recommendedDifficulty !== exercise.difficulty_level && (
                    <div className="mt-3 text-center">
                      <span className="text-xs text-ojas-slate-gray">
                        💡 Recommended: Level {recommendedDifficulty}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-ojas-slate-gray mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-ojas-charcoal-gray mb-2">
              No exercises found
            </h3>
            <p className="text-ojas-slate-gray">
              Try selecting a different category or check back later for new exercises.
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 bg-ojas-primary-blue/5 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-2">
            How Brain Gym Works
          </h3>
          <p className="text-ojas-slate-gray mb-4">
            These exercises are designed by occupational therapists to target specific cognitive skills 
            relevant to neurological conditions. The difficulty adapts based on your performance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 justify-center">
              <Target className="w-4 h-4 text-ojas-primary-blue" />
              <span>Targeted skill training</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Zap className="w-4 h-4 text-ojas-primary-blue" />
              <span>Adaptive difficulty</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Trophy className="w-4 h-4 text-ojas-primary-blue" />
              <span>Progress tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrainGymDashboard;