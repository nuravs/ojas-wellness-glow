
import React, { useState } from 'react';
import { Activity, Apple, Dumbbell, Brain, Users, BookOpen, Heart, Sparkles, Play, Star } from 'lucide-react';
import SuccessAnimation from '../components/SuccessAnimation';
import SafeAreaContainer from '../components/SafeAreaContainer';

const WellnessCenterPage: React.FC = () => {
  const [currentStreak, setCurrentStreak] = useState(3);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const todaysActivity = {
    type: 'Gentle Stretching',
    duration: '10 minutes',
    description: 'Start your day with gentle neck and shoulder stretches',
    icon: Dumbbell,
    completed: false
  };

  const wellnessCategories = [
    {
      id: 'routine',
      title: 'My Routine',
      description: 'Daily wellness activities and gentle exercises',
      icon: Heart,
      color: 'calming-green'
    },
    {
      id: 'physiotherapy',
      title: 'Physiotherapy',
      description: 'Movement therapy and gentle exercises',
      icon: Dumbbell,
      color: 'primary-blue'
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      description: 'Brain-healthy meal planning and tips',
      icon: Apple,
      color: 'calming-green'
    },
    {
      id: 'mindfulness',
      title: 'Mindfulness',
      description: 'Meditation and stress management',
      icon: Brain,
      color: 'primary-blue'
    },
    {
      id: 'activity',
      title: 'Daily Activities',
      description: 'Adaptive strategies for daily living',
      icon: Activity,
      color: 'primary-blue'
    },
    {
      id: 'support',
      title: 'Support Groups',
      description: 'Connect with others on similar journeys',
      icon: Users,
      color: 'soft-gold'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'calming-green': return 'bg-ojas-calming-green/10 hover:bg-ojas-calming-green/20 text-ojas-calming-green border-ojas-calming-green/30';
      case 'primary-blue': return 'bg-ojas-primary-blue/10 hover:bg-ojas-primary-blue/20 text-ojas-primary-blue border-ojas-primary-blue/30';
      case 'soft-gold': return 'bg-ojas-soft-gold/10 hover:bg-ojas-soft-gold/20 text-ojas-soft-gold border-ojas-soft-gold/30';
      default: return 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200';
    }
  };

  const handleStartActivity = () => {
    setSuccessMessage('Great job completing your stretching routine! 🎉');
    setShowSuccess(true);
    setCurrentStreak(prev => prev + 1);
  };

  const handleBreathingExercise = () => {
    setSuccessMessage('Wonderful! You completed a breathing exercise. Feel more relaxed? 🌱');
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-ojas-mist-white pb-28">
      <SafeAreaContainer>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-ojas-calming-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-ojas-calming-green" />
          </div>
          <h1 className="text-3xl font-bold text-ojas-charcoal-gray mb-3 font-heading">
            Wellness Center
          </h1>
          <p className="text-ojas-slate-gray text-lg">
            Your hub for holistic health and wellbeing
          </p>
        </div>

        {/* Today's Activity Card */}
        <div className="bg-gradient-to-br from-ojas-calming-green/10 to-ojas-primary-blue/5 rounded-2xl shadow-ojas-soft border-2 border-ojas-calming-green/30 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-ojas-calming-green/20 rounded-full flex items-center justify-center">
              <todaysActivity.icon className="w-6 h-6 text-ojas-calming-green" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-ojas-charcoal-gray">
                Today's Activity
              </h3>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-ojas-soft-gold" />
                <span className="text-sm text-ojas-slate-gray">{currentStreak} day streak!</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-xl font-semibold text-ojas-charcoal-gray mb-2">
              {todaysActivity.type}
            </h4>
            <p className="text-ojas-slate-gray mb-1">{todaysActivity.description}</p>
            <p className="text-sm text-ojas-primary-blue font-medium">{todaysActivity.duration}</p>
          </div>

          <button
            onClick={handleStartActivity}
            className="w-full px-8 py-4 bg-ojas-calming-green text-white rounded-2xl font-semibold text-lg transition-all duration-200 hover:bg-ojas-calming-green-hover active:scale-95 shadow-ojas-medium flex items-center justify-center gap-3"
          >
            <Play className="w-6 h-6" />
            Start Activity
          </button>
        </div>

        {/* Breathing Exercise Quick Access */}
        <div className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-ojas-primary-blue/20 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-ojas-primary-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ojas-charcoal-gray">
                Quick Relaxation
              </h3>
              <p className="text-sm text-ojas-slate-gray">3-minute breathing exercise</p>
            </div>
          </div>
          
          <button
            onClick={handleBreathingExercise}
            className="w-full px-6 py-3 bg-ojas-primary-blue/10 text-ojas-primary-blue rounded-xl font-medium transition-all duration-200 hover:bg-ojas-primary-blue/20 active:scale-95"
          >
            Start Breathing Exercise
          </button>
        </div>

        {/* Wellness Categories Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <h2 className="text-xl font-semibold text-ojas-charcoal-gray mb-4">
            Explore Wellness
          </h2>
          {wellnessCategories.map(category => (
            <button
              key={category.id}
              className={`bg-white rounded-2xl shadow-ojas-soft hover:scale-102 active:scale-98 transition-all duration-200 text-left border-2 p-6 ${getColorClasses(category.color)}`}
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
        <div className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-ojas-soft-gold/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-ojas-soft-gold" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-3 font-heading">
                💡 Today's Wellness Tip
              </h3>
              <p className="text-ojas-charcoal-gray leading-relaxed">
                "Take three deep breaths before getting out of bed each morning. This simple practice can help set a calm, positive tone for your day and improve your overall sense of wellbeing."
              </p>
            </div>
          </div>
        </div>
      </SafeAreaContainer>

      {/* Success Animation */}
      {showSuccess && (
        <SuccessAnimation
          message={successMessage}
          onComplete={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
};

export default WellnessCenterPage;
