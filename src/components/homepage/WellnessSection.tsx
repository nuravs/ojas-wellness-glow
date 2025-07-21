
import React, { useState, useEffect } from 'react';
import { TrendingUp, Heart, Pill, Activity, ChevronDown, ChevronUp, Info, Calculator, Brain, Sparkles } from 'lucide-react';
import { EnhancedWellnessCalculator, WellnessInsight } from '@/utils/enhancedWellnessScore';

interface WellnessSectionProps {
  score: number;
  status: 'good' | 'attention' | 'urgent';
  medsCount: { taken: number; total: number };
  symptomsLogged: boolean;
  vitalsCount?: number;
  vitals?: any[];
  symptoms?: any[];
  medications?: any[];
  medicationLogs?: any[];
}

const WellnessSection: React.FC<WellnessSectionProps> = ({ 
  score, 
  status, 
  medsCount, 
  symptomsLogged,
  vitalsCount = 72,
  vitals = [],
  symptoms = [],
  medications = [],
  medicationLogs = []
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showFormula, setShowFormula] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [enhancedData, setEnhancedData] = useState<any>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Generate enhanced wellness data
    const calculator = EnhancedWellnessCalculator.getInstance();
    const enhanced = calculator.calculateEnhancedWellnessScore(
      vitals,
      symptoms,
      medications,
      medicationLogs
    );
    setEnhancedData(enhanced);
  }, [vitals, symptoms, medications, medicationLogs]);

  useEffect(() => {
    // Animate score
    const targetScore = enhancedData?.score || score;
    const duration = 1000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentScore = Math.round(targetScore * easeOutQuart);
      
      setAnimatedScore(currentScore);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [enhancedData?.score, score]);

  const getStatusMessage = () => {
    if (!enhancedData) {
      switch (status) {
        case 'good': return 'Excellent';
        case 'attention': return 'Some areas need attention';
        case 'urgent': return 'Needs immediate attention';
        default: return 'Good';
      }
    }
    
    const finalScore = enhancedData.score;
    if (finalScore >= 80) return 'Excellent wellness today!';
    if (finalScore >= 60) return 'Good progress, keep it up';
    if (finalScore >= 40) return 'Some areas need attention';
    return 'Let\'s focus on your health priorities';
  };

  const getStatusColor = () => {
    const finalScore = enhancedData?.score || score;
    if (finalScore >= 80) return '#00B488';
    if (finalScore >= 60) return '#FFC300';
    if (finalScore >= 40) return '#FF8C00';
    return '#FF4E4E';
  };

  const shouldShowUrgentMessage = () => {
    const finalScore = enhancedData?.score || score;
    return finalScore < 40;
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const medsScore = medsCount.total > 0 ? Math.round((medsCount.taken / medsCount.total) * 100) : 100;
  const symptomsScore = symptomsLogged ? 85 : 65;

  const toggleBreakdown = () => {
    setShowBreakdown(!showBreakdown);
  };

  const toggleFormula = () => {
    setShowFormula(!showFormula);
  };

  const toggleInsights = () => {
    setShowInsights(!showInsights);
  };

  const getInsightIcon = (insight: WellnessInsight) => {
    switch (insight.impact) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-ojas-success" />;
      case 'negative': return <Activity className="w-4 h-4 text-ojas-alert" />;
      default: return <Info className="w-4 h-4 text-ojas-text-secondary" />;
    }
  };

  return (
    <div className="px-4 mb-8">
      <div className="bg-white rounded-2xl p-8 shadow-ojas-soft border border-ojas-border text-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-20 h-20 bg-ojas-primary rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-ojas-success rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-xl font-semibold text-ojas-text-main">
              Today's Wellness
            </h2>
            {enhancedData && (
              <Sparkles className="w-4 h-4 text-ojas-primary" />
            )}
          </div>
          
          {shouldShowUrgentMessage() ? (
            <p className="text-sm text-ojas-error mb-8 font-medium">
              {getStatusMessage()}
            </p>
          ) : (
            <p className="text-sm text-ojas-text-secondary mb-8">
              {getStatusMessage()}
            </p>
          )}

          {/* Enhanced Wellness Ring with Animation */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="#E1E4EA"
                strokeWidth="8"
                fill="none"
              />
              
              {/* Animated progress circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke={getStatusColor()}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: `drop-shadow(0 0 8px ${getStatusColor()}30)`,
                }}
              />
              
              {/* Glow effect for high scores */}
              {animatedScore >= 80 && (
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke={getStatusColor()}
                  strokeWidth="2"
                  fill="none"
                  opacity="0.3"
                  className="animate-pulse"
                />
              )}
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-ojas-text-main mb-1">
                {animatedScore}
              </div>
              <div className="text-sm text-ojas-text-secondary font-medium uppercase tracking-wide">
                SCORE
              </div>
              <TrendingUp className={`w-4 h-4 mt-1 ${
                animatedScore >= 80 ? 'text-ojas-success' : 
                animatedScore >= 60 ? 'text-ojas-alert' : 'text-ojas-error'
              }`} />
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button 
              onClick={toggleBreakdown}
              className="text-ojas-primary font-medium text-sm hover:text-ojas-primary-hover transition-colors flex items-center gap-2"
            >
              {showBreakdown ? 'Hide Details' : 'View Breakdown'}
              {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            <button 
              onClick={toggleFormula}
              className="text-ojas-text-secondary font-medium text-sm hover:text-ojas-primary transition-colors flex items-center gap-2"
              title="View calculation formula"
            >
              <Calculator className="w-4 h-4" />
              Formula
            </button>

            {enhancedData?.insights?.length > 0 && (
              <button 
                onClick={toggleInsights}
                className="text-ojas-primary font-medium text-sm hover:text-ojas-primary-hover transition-colors flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                Insights
              </button>
            )}
          </div>

          {/* Enhanced Formula Explanation */}
          {showFormula && enhancedData && (
            <div className="mt-6 p-4 bg-ojas-bg-light rounded-xl border border-ojas-border">
              <h4 className="font-semibold text-ojas-text-main mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Personalized Wellness Formula
              </h4>
              <div className="text-left space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-ojas-text-secondary">
                    Medication Adherence ({Math.round(enhancedData.personalizedWeights.medication * 100)}%)
                  </span>
                  <span className="font-medium text-ojas-text-main">
                    {Math.round(enhancedData.factors.medicationAdherence * enhancedData.personalizedWeights.medication)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ojas-text-secondary">
                    Vital Stability ({Math.round(enhancedData.personalizedWeights.vitals * 100)}%)
                  </span>
                  <span className="font-medium text-ojas-text-main">
                    {Math.round(enhancedData.factors.vitalStability * enhancedData.personalizedWeights.vitals)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ojas-text-secondary">
                    Symptom Management ({Math.round(enhancedData.personalizedWeights.symptoms * 100)}%)
                  </span>
                  <span className="font-medium text-ojas-text-main">
                    {Math.round((100 - enhancedData.factors.symptomSeverity) * enhancedData.personalizedWeights.symptoms)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ojas-text-secondary">
                    Consistency Bonus ({Math.round(enhancedData.personalizedWeights.consistency * 100)}%)
                  </span>
                  <span className="font-medium text-ojas-text-main">
                    {Math.round(enhancedData.factors.consistencyBonus * enhancedData.personalizedWeights.consistency)}
                  </span>
                </div>
                <div className="border-t border-ojas-border pt-2 mt-2">
                  <div className="flex justify-between items-center font-semibold">
                    <span className="text-ojas-text-main">Personalized Score</span>
                    <span className="text-ojas-primary">{enhancedData.score}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-ojas-text-secondary">
                  <p>💡 This formula learns from your patterns and adjusts weights based on what matters most for your wellness.</p>
                </div>
              </div>
            </div>
          )}

          {/* AI Insights Section */}
          {showInsights && enhancedData?.insights && (
            <div className="mt-6 p-4 bg-ojas-bg-light rounded-xl border border-ojas-border">
              <h4 className="font-semibold text-ojas-text-main mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Wellness Insights
              </h4>
              <div className="space-y-3 text-left">
                {enhancedData.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-ojas-border">
                    {getInsightIcon(insight)}
                    <div className="flex-1">
                      <div className="font-medium text-ojas-text-main text-sm mb-1">
                        {insight.factor}
                      </div>
                      <div className="text-sm text-ojas-text-secondary mb-2">
                        {insight.description}
                      </div>
                      {insight.recommendation && (
                        <div className="text-xs text-ojas-primary bg-ojas-primary/10 px-2 py-1 rounded">
                          💡 {insight.recommendation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Breakdown Section */}
          {showBreakdown && (
            <div className="mt-8 pt-6 border-t border-ojas-border animate-fade-in">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-ojas-text-main">
                    {enhancedData ? Math.round(enhancedData.factors.vitalStability) : vitalsCount}
                  </div>
                  <div className="text-sm text-ojas-text-secondary">Vitals</div>
                  <div className="text-xs text-ojas-text-secondary mt-1">
                    {enhancedData ? 'Stability score' : 'Last reading'}
                  </div>
                </div>
                
                <div className="text-center">
                  <Pill className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-ojas-text-main">
                    {enhancedData ? Math.round(enhancedData.factors.medicationAdherence) : medsScore}%
                  </div>
                  <div className="text-sm text-ojas-text-secondary">Meds</div>
                  <div className="text-xs text-ojas-text-secondary mt-1">
                    {enhancedData ? 'Adherence score' : `${medsCount.taken}/${medsCount.total} today`}
                  </div>
                </div>
                
                <div className="text-center">
                  <Activity className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-ojas-text-main">
                    {enhancedData ? Math.round(100 - enhancedData.factors.symptomSeverity) : symptomsScore}
                  </div>
                  <div className="text-sm text-ojas-text-secondary">Symptoms</div>
                  <div className="text-xs text-ojas-text-secondary mt-1">
                    {enhancedData ? 'Management score' : symptomsLogged ? 'Logged today' : 'Not logged'}
                  </div>
                </div>
              </div>
              
              {enhancedData?.factors.consistencyBonus > 0 && (
                <div className="mt-4 p-3 bg-ojas-success/10 rounded-lg border border-ojas-success/20">
                  <div className="flex items-center gap-2 text-ojas-success">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium text-sm">
                      Consistency Bonus: +{Math.round(enhancedData.factors.consistencyBonus)} points
                    </span>
                  </div>
                  <p className="text-xs text-ojas-text-secondary mt-1">
                    Great job maintaining regular health tracking!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WellnessSection;
