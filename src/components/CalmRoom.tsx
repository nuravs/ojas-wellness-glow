import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Heart, Brain, Leaf } from 'lucide-react';

interface CalmRoomProps {
  onBack: () => void;
  currentMood?: 'anxious' | 'stressed' | 'sad' | 'tired' | 'neutral';
}

interface AudioContent {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: 'breathing' | 'nature' | 'meditation' | 'music';
  icon: React.ReactNode;
  audioUrl: string;
  recommendedFor: string[];
}

const CalmRoom: React.FC<CalmRoomProps> = ({ onBack, currentMood = 'neutral' }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Curated content library
  const audioContent: AudioContent[] = [
    {
      id: 'deep-breathing',
      title: '4-7-8 Breathing Exercise',
      description: 'A calming breathing technique to reduce anxiety and promote relaxation',
      duration: '5 min',
      category: 'breathing',
      icon: <Heart className="w-5 h-5" />,
      audioUrl: '/audio/deep-breathing.mp3',
      recommendedFor: ['anxious', 'stressed']
    },
    {
      id: 'forest-sounds',
      title: 'Forest Rain',
      description: 'Gentle forest sounds with light rain for deep relaxation',
      duration: '10 min',
      category: 'nature',
      icon: <Leaf className="w-5 h-5" />,
      audioUrl: '/audio/forest-rain.mp3',
      recommendedFor: ['stressed', 'tired', 'neutral']
    },
    {
      id: 'body-scan',
      title: 'Progressive Muscle Relaxation',
      description: 'Guided body scan meditation for physical and mental relaxation',
      duration: '15 min',
      category: 'meditation',
      icon: <Brain className="w-5 h-5" />,
      audioUrl: '/audio/body-scan.mp3',
      recommendedFor: ['anxious', 'stressed', 'sad']
    },
    {
      id: 'ocean-waves',
      title: 'Peaceful Ocean Waves',
      description: 'Rhythmic ocean sounds to ease your mind and body',
      duration: '8 min',
      category: 'nature',
      icon: <Leaf className="w-5 h-5" />,
      audioUrl: '/audio/ocean-waves.mp3',
      recommendedFor: ['tired', 'sad', 'neutral']
    }
  ];

  // Get recommended content based on mood
  const getRecommendedContent = () => {
    return audioContent.filter(content => 
      content.recommendedFor.includes(currentMood)
    );
  };

  const handlePlayPause = (contentId: string, audioUrl: string) => {
    if (currentlyPlaying === contentId) {
      // Pause current audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentlyPlaying(null);
    } else {
      // Play new audio
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
      setCurrentlyPlaying(contentId);
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (currentlyPlaying) {
        audioRef.current.play();
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setCurrentlyPlaying(null);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'breathing': return 'bg-ojas-primary-blue/10 text-ojas-primary-blue';
      case 'nature': return 'bg-ojas-calming-green/10 text-ojas-calming-green';
      case 'meditation': return 'bg-ojas-soft-gold/10 text-ojas-soft-gold';
      case 'music': return 'bg-ojas-vibrant-coral/10 text-ojas-vibrant-coral';
      default: return 'bg-ojas-cloud-silver/10 text-ojas-slate-gray';
    }
  };

  const recommendedContent = getRecommendedContent();

  return (
    <div className="min-h-screen bg-gradient-to-b from-ojas-mist-white to-white p-6">
      <div className="max-w-md mx-auto">
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
              Calm Room
            </h1>
            <p className="text-ojas-slate-gray">Find your moment of peace</p>
          </div>
        </div>

        {/* Mood-based recommendations */}
        {recommendedContent.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-4">
              Recommended for you
            </h3>
            <div className="space-y-4">
              {recommendedContent.map(content => (
                <div key={content.id} className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${getCategoryColor(content.category)} flex items-center justify-center flex-shrink-0`}>
                      {content.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-ojas-charcoal-gray mb-1">
                        {content.title}
                      </h4>
                      <p className="text-sm text-ojas-slate-gray mb-2">
                        {content.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-ojas-slate-gray">
                        <span>{content.duration}</span>
                        <span>•</span>
                        <span className="capitalize">{content.category}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRestart}
                        disabled={currentlyPlaying !== content.id}
                        className="w-10 h-10 rounded-full bg-ojas-cloud-silver hover:bg-ojas-slate-gray/20 flex items-center justify-center transition-colors disabled:opacity-50"
                        aria-label="Restart"
                      >
                        <RotateCcw className="w-4 h-4 text-ojas-charcoal-gray" />
                      </button>
                      
                      <button
                        onClick={() => handlePlayPause(content.id, content.audioUrl)}
                        className="w-12 h-12 rounded-full bg-ojas-primary-blue hover:bg-ojas-primary-blue-hover text-white flex items-center justify-center transition-colors shadow-ojas-medium"
                        aria-label={currentlyPlaying === content.id ? 'Pause' : 'Play'}
                      >
                        {currentlyPlaying === content.id ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 ml-0.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  {currentlyPlaying === content.id && (
                    <div className="mt-4">
                      <div className="w-full bg-ojas-cloud-silver rounded-full h-2">
                        <div 
                          className="bg-ojas-primary-blue h-2 rounded-full transition-all duration-100"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All content */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-4">
            All Content
          </h3>
          <div className="grid gap-4">
            {audioContent.map(content => (
              <div key={content.id} className="bg-white rounded-xl shadow-ojas-soft border border-ojas-cloud-silver p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${getCategoryColor(content.category)} flex items-center justify-center`}>
                    {content.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-ojas-charcoal-gray">
                      {content.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-ojas-slate-gray">
                      <span>{content.duration}</span>
                      <span>•</span>
                      <span className="capitalize">{content.category}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePlayPause(content.id, content.audioUrl)}
                    className="w-10 h-10 rounded-full bg-ojas-primary-blue hover:bg-ojas-primary-blue-hover text-white flex items-center justify-center transition-colors"
                    aria-label={currentlyPlaying === content.id ? 'Pause' : 'Play'}
                  >
                    {currentlyPlaying === content.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-ojas-primary-blue/5 rounded-xl p-4 text-center">
          <p className="text-sm text-ojas-slate-gray">
            💡 Tip: Use headphones for the best experience. Find a comfortable position and let yourself relax.
          </p>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} preload="none" />
    </div>
  );
};

export default CalmRoom;