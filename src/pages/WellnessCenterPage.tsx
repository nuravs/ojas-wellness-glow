
import React from 'react';
import { Activity, Apple, Dumbbell, Brain, Users, BookOpen } from 'lucide-react';

const WellnessCenterPage: React.FC = () => {
  const wellnessCategories = [
    {
      id: 'physiotherapy',
      title: 'Physiotherapy',
      description: 'Gentle exercises and movement therapy',
      icon: Dumbbell,
      color: 'wellness-green'
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      description: 'Brain-healthy meal planning and tips',
      icon: Apple,
      color: 'wellness-blue'
    },
    {
      id: 'mindfulness',
      title: 'Mindfulness',
      description: 'Meditation and stress management',
      icon: Brain,
      color: 'wellness-yellow'
    },
    {
      id: 'activity',
      title: 'Daily Activities',
      description: 'Adaptive strategies for daily living',
      icon: Activity,
      color: 'wellness-green'
    },
    {
      id: 'support',
      title: 'Support Groups',
      description: 'Connect with others on similar journeys',
      icon: Users,
      color: 'wellness-blue'
    },
    {
      id: 'education',
      title: 'Learn & Grow',
      description: 'Understanding your condition better',
      icon: BookOpen,
      color: 'wellness-yellow'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'wellness-green': return 'bg-wellness-green/10 hover:bg-wellness-green/20 text-wellness-green border-wellness-green/20';
      case 'wellness-blue': return 'bg-wellness-blue/10 hover:bg-wellness-blue/20 text-wellness-blue border-wellness-blue/20';
      case 'wellness-yellow': return 'bg-wellness-yellow/10 hover:bg-wellness-yellow/20 text-wellness-yellow border-wellness-yellow/20';
      default: return 'bg-calm-100 hover:bg-calm-200 text-calm-700 border-calm-200';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-calm-800 mb-2">
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
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center flex-shrink-0">
                  <category.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">
                    {category.title}
                  </h3>
                  <p className="text-sm opacity-80">
                    {category.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Daily Wellness Tip */}
        <div className="ojas-card bg-gradient-to-r from-wellness-green/5 to-wellness-blue/5 border-2 border-wellness-green/20">
          <h3 className="text-lg font-semibold text-calm-800 mb-2">
            💡 Today's Wellness Tip
          </h3>
          <p className="text-calm-700">
            "Take three deep breaths before getting out of bed each morning. This simple practice can help set a calm, positive tone for your day."
          </p>
        </div>
      </div>
    </div>
  );
};

export default WellnessCenterPage;
