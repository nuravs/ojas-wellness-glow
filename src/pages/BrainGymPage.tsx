import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrainGymDashboard from '../components/BrainGymDashboard';
import BrainGymExercise from '../components/BrainGymExercise';
import { type BrainGymExercise as BrainGymExerciseType } from '../hooks/useBrainGym';

const BrainGymPage: React.FC = () => {
  const [currentExercise, setCurrentExercise] = useState<BrainGymExerciseType | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [lastScore, setLastScore] = useState<number>(0);
  const navigate = useNavigate();

  const handleBack = () => {
    if (currentExercise) {
      setCurrentExercise(null);
      setShowResults(false);
    } else {
      navigate(-1);
    }
  };

  const handleStartExercise = (exercise: BrainGymExerciseType) => {
    setCurrentExercise(exercise);
    setShowResults(false);
  };

  const handleExerciseComplete = (score: number) => {
    setLastScore(score);
    setShowResults(true);
  };

  const handleBackToDashboard = () => {
    setCurrentExercise(null);
    setShowResults(false);
  };

  if (showResults && currentExercise) {
    return (
      <div className="min-h-screen bg-ojas-mist-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-8 text-center">
            <div className="w-20 h-20 bg-ojas-calming-green rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎉</span>
            </div>
            
            <h2 className="text-2xl font-bold text-ojas-charcoal-gray mb-4">
              Exercise Complete!
            </h2>
            
            <div className="mb-6">
              <div className="text-4xl font-bold text-ojas-primary-blue mb-2">
                {lastScore}%
              </div>
              <div className="text-ojas-slate-gray">Final Score</div>
            </div>

            <p className="text-ojas-slate-gray mb-8">
              Great job completing the {currentExercise.name} exercise! 
              Your performance helps us adapt future exercises to your skill level.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => handleStartExercise(currentExercise)}
                className="flex-1 px-6 py-3 bg-ojas-primary-blue text-white rounded-xl font-medium hover:bg-ojas-primary-blue-hover transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleBackToDashboard}
                className="flex-1 px-6 py-3 bg-ojas-cloud-silver text-ojas-charcoal-gray rounded-xl font-medium hover:bg-ojas-slate-gray/20 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentExercise) {
    return (
      <BrainGymExercise
        exercise={currentExercise}
        onBack={handleBack}
        onComplete={handleExerciseComplete}
      />
    );
  }

  return (
    <BrainGymDashboard
      onBack={handleBack}
      onStartExercise={handleStartExercise}
    />
  );
};

export default BrainGymPage;