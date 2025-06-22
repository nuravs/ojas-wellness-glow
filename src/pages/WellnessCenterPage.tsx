
import React from 'react';
import { Activity, Apple, Dumbbell, Brain, Users, BookOpen, Heart, Sparkles } from 'lucide-react';

const WellnessCenterPage: React.FC = () => {
  const wellnessCategories = [
    {
      id: 'routine',
      title: 'My Routine',
      description: 'Daily wellness activities and gentle exercises',
      icon: Heart,
      color: 'wellness-green'
    },
    {
      id: 'physiotherapy',
      title: 'Physiotherapy',
      description: 'Movement therapy and gentle exercises',
      icon: Dumbbell,
      color: 'wellness-blue'
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      description: 'Brain-healthy meal planning and tips',
      icon: Apple,
      color: 'wellness-green'
    },
    {
      id: 'mindfulness',
      title: 'Mindfulness',
      description: 'Meditation and stress management',
      icon: Brain,
      color: 'wellness-purple'
    },
    {
      id: 'activity',
      title: 'Daily Activities',
      description: 'Adaptive strategies for daily living',
      icon: Activity,
      color: 'wellness-blue'
    },
    {
      id: 'support',
      title: 'Support Groups',
      description: 'Connect with others on similar journeys',
      icon: Users,
      color: 'wellness-yellow'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'wellness-green': return 'bg-wellness-green/10 hover:bg-wellness-green/20 text-wellness-green border-wellness-green/30';
      case 'wellness-blue': return 'bg-wellness-blue/10 hover:bg-wellness-blue/20 text-wellness-blue border-wellness-blue/30';
      case 'wellness-yellow': return 'bg-wellness-yellow/10 hover:bg-wellness-yellow/20 text-wellness-yellow border-wellness-yellow/30';
      case 'wellness-purple': return 'bg-wellness-purple/10 hover:bg-wellness-purple/20 text-wellness-purple border-wellness-purple/30';
      default: return 'bg-calm-100 hover:bg-calm-200 text-calm-700 border-calm-200';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-wellness-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-wellness-green" />
          </div>
          <h1 className="text-3xl font-bold text-calm-800 mb-3 font-heading">
            Wellness Center
          </h1>
          <p className="text-calm-600 text-lg">
            Your hub for holistic health and wellbeing
          </p>
        </div>

        {/* Wellness Categories Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {wellnessCategories.map(category => (
            <button
              key={category.id}
              className={`ojas-card ${getColorClasses(category.color)} hover:scale-102 active:scale-98 transition-all duration-200 text-left border-2`}
              aria-label={`Open ${category.title} section`}
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/60 flex items-center justify-center flex-shrink-0">
                  <category.icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 font-heading">
                    {category.title}
                  </h3>
                  <p className="text-sm opacity-90 font-medium">
                    {category.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Daily Wellness Tip */}
        <div className="ojas-card bg-gradient-to-br from-wellness-green/5 to-wellness-blue/5 border-2 border-wellness-green/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-wellness-green/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-wellness-green" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-calm-800 mb-3 font-heading">
                💡 Today's Wellness Tip
              </h3>
              <p className="text-calm-700 leading-relaxed">
                "Take three deep breaths before getting out of bed each morning. This simple practice can help set a calm, positive tone for your day and improve your overall sense of wellbeing."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessCenterPage;
