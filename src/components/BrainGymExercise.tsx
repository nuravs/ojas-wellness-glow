import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Timer, RotateCcw } from 'lucide-react';
import { type BrainGymExercise as BrainGymExerciseType, useBrainGym } from '../hooks/useBrainGym';

interface BrainGymExerciseProps {
  exercise: BrainGymExerciseType;
  onBack: () => void;
  onComplete: (score: number) => void;
}

// Memory Sequence Exercise Component
const MemorySequenceExercise: React.FC<{
  instructions: any;
  onComplete: (score: number, mistakes: number, sessionData: any) => void;
}> = ({ instructions, onComplete }) => {
  const [phase, setPhase] = useState<'instructions' | 'show' | 'input' | 'result'>('instructions');
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const colors = instructions.colors || ['red', 'blue', 'green', 'yellow'];
  const maxRounds = 5;

  const generateSequence = () => {
    const newSequence = [];
    const sequenceLength = instructions.sequence_length + Math.floor(round / 2); // Increase length over rounds
    for (let i = 0; i < sequenceLength; i++) {
      newSequence.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    setSequence(newSequence);
    setUserSequence([]);
    setCurrentIndex(0);
  };

  const startSequence = () => {
    generateSequence();
    setPhase('show');
    
    // Auto-advance through sequence
    setTimeout(() => {
      setPhase('input');
    }, instructions.display_time * sequence.length);
  };

  const handleColorClick = (color: string) => {
    if (phase !== 'input') return;

    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    if (color !== sequence[currentIndex]) {
      setMistakes(prev => prev + 1);
    }

    if (newUserSequence.length === sequence.length) {
      // Round complete
      const roundScore = Math.max(0, 100 - (mistakes * 20));
      setScore(prev => prev + roundScore);

      if (round < maxRounds) {
        setRound(prev => prev + 1);
        setTimeout(() => {
          setPhase('show');
          generateSequence();
          setTimeout(() => {
            setPhase('input');
          }, instructions.display_time * sequence.length);
        }, 1000);
      } else {
        // Exercise complete
        const finalScore = Math.round(score / maxRounds);
        onComplete(finalScore, mistakes, { rounds: maxRounds, sequences: sequence });
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const getColorStyle = (color: string) => {
    const colorMap: Record<string, string> = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  if (phase === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold text-ojas-charcoal-gray mb-4">
          Memory Sequence
        </h3>
        <p className="text-ojas-slate-gray mb-6">
          {instructions.instructions}
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {colors.map(color => (
            <div
              key={color}
              className={`w-20 h-20 rounded-xl ${getColorStyle(color)} mx-auto`}
            />
          ))}
        </div>
        <button
          onClick={startSequence}
          className="px-6 py-3 bg-ojas-primary-blue text-white rounded-xl font-medium hover:bg-ojas-primary-blue-hover transition-colors"
        >
          Start Exercise
        </button>
      </div>
    );
  }

  if (phase === 'show') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold text-ojas-charcoal-gray mb-4">
          Round {round} of {maxRounds}
        </h3>
        <p className="text-ojas-slate-gray mb-6">Watch the sequence carefully</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {colors.map((color, index) => (
            <div
              key={color}
              className={`w-24 h-24 rounded-xl transition-all duration-300 mx-auto ${
                sequence[Math.floor(Date.now() / instructions.display_time) % sequence.length] === color
                  ? `${getColorStyle(color)} scale-110 shadow-lg`
                  : `${getColorStyle(color)} opacity-30`
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (phase === 'input') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold text-ojas-charcoal-gray mb-4">
          Round {round} of {maxRounds}
        </h3>
        <p className="text-ojas-slate-gray mb-6">
          Repeat the sequence ({userSequence.length + 1} of {sequence.length})
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => handleColorClick(color)}
              className={`w-24 h-24 rounded-xl ${getColorStyle(color)} hover:scale-105 transition-transform mx-auto shadow-ojas-medium`}
            />
          ))}
        </div>
        <div className="text-sm text-ojas-slate-gray">
          Score: {Math.round(score / round)} | Mistakes: {mistakes}
        </div>
      </div>
    );
  }

  return null;
};

const BrainGymExercise: React.FC<BrainGymExerciseProps> = ({ exercise, onBack, onComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { startSession, completeSession } = useBrainGym();

  const handleStart = async () => {
    const session = await startSession(exercise.id, exercise.difficulty_level);
    if (session && typeof session === 'object' && 'id' in session) {
      setSessionId(session.id);
      setStartTime(Date.now());
      setIsRunning(true);
    }
  };

  const handleExerciseComplete = async (score: number, mistakes: number = 0, sessionData: any = {}) => {
    if (sessionId) {
      const completionTime = Math.floor((Date.now() - startTime) / 1000);
      const success = await completeSession(sessionId, score, completionTime, mistakes, sessionData);
      if (success) {
        onComplete(score);
      }
    }
  };

  const renderExercise = () => {
    switch (exercise.instructions.type) {
      case 'sequence':
        return (
          <MemorySequenceExercise
            instructions={exercise.instructions}
            onComplete={handleExerciseComplete}
          />
        );
      default:
        return (
          <div className="text-center">
            <h3 className="text-xl font-semibold text-ojas-charcoal-gray mb-4">
              Exercise Not Implemented
            </h3>
            <p className="text-ojas-slate-gray mb-6">
              This exercise type is coming soon!
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-ojas-primary-blue text-white rounded-xl font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-ojas-mist-white p-6">
      <div className="max-w-2xl mx-auto">
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
            <h1 className="text-2xl font-semibold text-ojas-charcoal-gray">
              {exercise.name}
            </h1>
            <p className="text-ojas-slate-gray">{exercise.description}</p>
          </div>
          {isRunning && (
            <div className="flex items-center gap-2 text-ojas-primary-blue">
              <Timer className="w-5 h-5" />
              <span className="text-sm font-medium">Active</span>
            </div>
          )}
        </div>

        {/* Exercise Content */}
        <div className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-8">
          {!isRunning ? (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-ojas-charcoal-gray mb-4">
                Ready to Start?
              </h3>
              <p className="text-ojas-slate-gray mb-6">
                {exercise.instructions.instructions || exercise.description}
              </p>
              
              {/* Exercise Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-ojas-cloud-silver/30 rounded-xl p-4">
                  <div className="text-2xl font-bold text-ojas-primary-blue mb-1">
                    {exercise.estimated_duration}
                  </div>
                  <div className="text-sm text-ojas-slate-gray">Minutes</div>
                </div>
                <div className="bg-ojas-cloud-silver/30 rounded-xl p-4">
                  <div className="text-2xl font-bold text-ojas-soft-gold mb-1">
                    Level {exercise.difficulty_level}
                  </div>
                  <div className="text-sm text-ojas-slate-gray">Difficulty</div>
                </div>
                <div className="bg-ojas-cloud-silver/30 rounded-xl p-4">
                  <div className="text-2xl font-bold text-ojas-calming-green mb-1">
                    {exercise.target_skills.length}
                  </div>
                  <div className="text-sm text-ojas-slate-gray">Skills</div>
                </div>
              </div>

              <button
                onClick={handleStart}
                className="px-8 py-4 bg-ojas-primary-blue text-white rounded-xl font-semibold text-lg hover:bg-ojas-primary-blue-hover transition-colors shadow-ojas-medium"
              >
                Begin Exercise
              </button>
            </div>
          ) : (
            renderExercise()
          )}
        </div>

        {/* Target Skills */}
        <div className="mt-6 bg-white rounded-xl shadow-ojas-soft border border-ojas-cloud-silver p-4">
          <h4 className="font-semibold text-ojas-charcoal-gray mb-3">Target Skills</h4>
          <div className="flex flex-wrap gap-2">
            {exercise.target_skills.map(skill => (
              <span
                key={skill}
                className="px-3 py-1 bg-ojas-primary-blue/10 text-ojas-primary-blue rounded-lg text-sm font-medium"
              >
                {skill.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrainGymExercise;
