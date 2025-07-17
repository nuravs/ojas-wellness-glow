import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Target, Clock, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface ExerciseData {
  id: string;
  name: string;
  category: string;
  difficulty_level: number;
  description: string;
  instructions: {
    steps: string[];
    rules: string;
  };
  target_skills: string[];
  estimated_duration: number;
}

interface MemorySequenceGame {
  sequence: number[];
  userInput: number[];
  currentLevel: number;
  isPlaying: boolean;
  showingSequence: boolean;
  score: number;
  mistakes: number;
}

interface AdvancedBrainGymExerciseProps {
  exercise: ExerciseData;
  onComplete: (results: {
    score: number;
    completion_time: number;
    mistakes_count: number;
    difficulty_level: number;
  }) => void;
  onBack: () => void;
}

const AdvancedBrainGymExercise: React.FC<AdvancedBrainGymExerciseProps> = ({
  exercise,
  onComplete,
  onBack
}) => {
  const [gameState, setGameState] = useState<MemorySequenceGame>({
    sequence: [],
    userInput: [],
    currentLevel: 1,
    isPlaying: false,
    showingSequence: false,
    score: 0,
    mistakes: 0
  });
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [highlightedButton, setHighlightedButton] = useState<number | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.isPlaying && gameStartTime) {
      interval = setInterval(() => {
        setTimeElapsed(Date.now() - gameStartTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameState.isPlaying, gameStartTime]);

  const generateSequence = useCallback((length: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 4));
  }, []);

  const startGame = () => {
    const newSequence = generateSequence(3); // Start with 3 items
    setGameState(prev => ({
      ...prev,
      sequence: newSequence,
      userInput: [],
      currentLevel: 1,
      isPlaying: true,
      showingSequence: true,
      score: 0,
      mistakes: 0
    }));
    setGameStartTime(Date.now());
    setTimeElapsed(0);
    showSequence(newSequence);
  };

  const showSequence = async (sequence: number[]) => {
    setGameState(prev => ({ ...prev, showingSequence: true }));
    
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setHighlightedButton(sequence[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
      setHighlightedButton(null);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setGameState(prev => ({ ...prev, showingSequence: false }));
  };

  const handleButtonClick = (buttonIndex: number) => {
    if (gameState.showingSequence || !gameState.isPlaying) return;

    const newUserInput = [...gameState.userInput, buttonIndex];
    
    // Check if current input is correct
    const isCorrect = buttonIndex === gameState.sequence[gameState.userInput.length];
    
    if (!isCorrect) {
      // Mistake made
      setGameState(prev => ({
        ...prev,
        mistakes: prev.mistakes + 1,
        userInput: []
      }));
      
      if (gameState.mistakes >= 2) {
        // Game over after 3 mistakes
        endGame();
        return;
      }
      
      // Restart current level
      setTimeout(() => showSequence(gameState.sequence), 1000);
      return;
    }

    setGameState(prev => ({ ...prev, userInput: newUserInput }));

    // Check if sequence is complete
    if (newUserInput.length === gameState.sequence.length) {
      // Level complete!
      const newScore = gameState.score + (gameState.currentLevel * 10);
      const newLevel = gameState.currentLevel + 1;
      
      if (newLevel > 10) {
        // Game complete!
        setGameState(prev => ({ ...prev, score: newScore, isPlaying: false }));
        endGame(newScore);
        return;
      }

      // Next level
      const nextSequence = generateSequence(2 + newLevel); // Increase difficulty
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          sequence: nextSequence,
          userInput: [],
          currentLevel: newLevel,
          score: newScore
        }));
        showSequence(nextSequence);
      }, 1000);
    }
  };

  const endGame = (finalScore?: number) => {
    const score = finalScore || gameState.score;
    const completionTime = Math.floor(timeElapsed / 1000);
    
    setGameState(prev => ({ ...prev, isPlaying: false }));
    
    onComplete({
      score,
      completion_time: completionTime,
      mistakes_count: gameState.mistakes,
      difficulty_level: exercise.difficulty_level
    });
  };

  const resetGame = () => {
    setGameState({
      sequence: [],
      userInput: [],
      currentLevel: 1,
      isPlaying: false,
      showingSequence: false,
      score: 0,
      mistakes: 0
    });
    setTimeElapsed(0);
    setGameStartTime(null);
    setHighlightedButton(null);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const getButtonColor = (index: number) => {
    const colors = [
      'bg-red-500 hover:bg-red-600',
      'bg-blue-500 hover:bg-blue-600', 
      'bg-green-500 hover:bg-green-600',
      'bg-yellow-500 hover:bg-yellow-600'
    ];
    
    if (highlightedButton === index) {
      return colors[index].replace('bg-', 'bg-opacity-100 bg-') + ' ring-4 ring-white';
    }
    
    return colors[index] + ' bg-opacity-70';
  };

  return (
    <div className="min-h-screen bg-ojas-bg-light p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-ojas-text-primary">{exercise.name}</h1>
            <p className="text-sm text-ojas-text-secondary">{exercise.description}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-ojas-primary">
          Level {exercise.difficulty_level}
        </Badge>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <Card className="text-center border-ojas-border">
          <CardContent className="p-3">
            <div className="text-lg font-bold text-ojas-primary">{gameState.currentLevel}</div>
            <div className="text-xs text-ojas-text-secondary">Level</div>
          </CardContent>
        </Card>
        <Card className="text-center border-ojas-border">
          <CardContent className="p-3">
            <div className="text-lg font-bold text-ojas-primary">{gameState.score}</div>
            <div className="text-xs text-ojas-text-secondary">Score</div>
          </CardContent>
        </Card>
        <Card className="text-center border-ojas-border">
          <CardContent className="p-3">
            <div className="text-lg font-bold text-red-500">{gameState.mistakes}</div>
            <div className="text-xs text-ojas-text-secondary">Mistakes</div>
          </CardContent>
        </Card>
        <Card className="text-center border-ojas-border">
          <CardContent className="p-3">
            <div className="text-lg font-bold text-ojas-primary">{formatTime(timeElapsed)}</div>
            <div className="text-xs text-ojas-text-secondary">Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      {!gameState.isPlaying && (
        <Card className="mb-6 border-ojas-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-ojas-primary" />
              <span>How to Play</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-ojas-text-secondary">
              {exercise.instructions.steps.map((step, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="font-medium text-ojas-primary">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Rules:</strong> {exercise.instructions.rules}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Area */}
      <Card className="border-ojas-border">
        <CardContent className="p-6">
          {!gameState.isPlaying ? (
            <div className="text-center">
              <div className="mb-6">
                <Award className="w-16 h-16 text-ojas-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-ojas-text-primary mb-2">
                  Ready to Challenge Your Memory?
                </h2>
                <p className="text-ojas-text-secondary">
                  Watch the sequence, then repeat it by clicking the colored buttons
                </p>
              </div>
              <div className="flex justify-center space-x-3">
                <Button onClick={startGame} size="lg" className="bg-ojas-primary hover:bg-ojas-primary/90">
                  <Play className="w-5 h-5 mr-2" />
                  Start Game
                </Button>
                {gameState.score > 0 && (
                  <Button onClick={resetGame} variant="outline" size="lg">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div>
              {/* Game Status */}
              <div className="text-center mb-6">
                {gameState.showingSequence ? (
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-ojas-text-primary">Watch the sequence</h3>
                    <Progress value={(gameState.userInput.length / gameState.sequence.length) * 100} className="w-48 mx-auto" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-ojas-text-primary">Repeat the sequence</h3>
                    <Progress value={(gameState.userInput.length / gameState.sequence.length) * 100} className="w-48 mx-auto" />
                    <p className="text-sm text-ojas-text-secondary">
                      {gameState.userInput.length} / {gameState.sequence.length} correct
                    </p>
                  </div>
                )}
              </div>

              {/* Game Buttons */}
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                {Array.from({ length: 4 }, (_, index) => (
                  <Button
                    key={index}
                    onClick={() => handleButtonClick(index)}
                    disabled={gameState.showingSequence}
                    className={`h-24 w-full text-white font-bold text-xl transition-all duration-200 ${getButtonColor(index)}`}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>

              {/* Game Controls */}
              <div className="flex justify-center space-x-3 mt-6">
                <Button onClick={() => endGame()} variant="outline">
                  End Game
                </Button>
                <Button onClick={resetGame} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restart
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Target Skills */}
      <Card className="mt-6 border-ojas-border">
        <CardHeader>
          <CardTitle className="text-sm">Target Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {exercise.target_skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedBrainGymExercise;