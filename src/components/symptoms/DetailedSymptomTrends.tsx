
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Calendar, Filter, Eye, ArrowLeft, ChevronRight } from 'lucide-react';
import { format, subDays, startOfDay, isSameDay, subMonths } from 'date-fns';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Symptom {
  id: string;
  symptom_type: string;
  severity: number;
  details?: any;
  notes?: string;
  logged_at: string;
}

interface DetailedSymptomTrendsProps {
  symptoms: Symptom[];
  userRole?: 'patient' | 'caregiver';
  onBack?: () => void;
}

const SYMPTOM_CATEGORIES = {
  'Motor Symptoms': {
    tremor: { 
      label: 'Tremor', 
      locations: ['right_hand', 'left_hand', 'both_hands', 'head', 'voice', 'legs'],
      triggers: ['rest', 'action', 'stress', 'medication_wearing_off', 'fatigue']
    },
    stiffness: { 
      label: 'Rigidity/Stiffness', 
      locations: ['neck', 'arms', 'legs', 'back', 'whole_body'],
      triggers: ['morning', 'evening', 'medication_wearing_off', 'cold_weather']
    },
    balance: { 
      label: 'Balance & Gait', 
      locations: ['walking', 'standing', 'turning', 'stairs'],
      triggers: ['fatigue', 'medication_wearing_off', 'rushing', 'uneven_surfaces']
    }
  },
  'Non-Motor Symptoms': {
    mood: { 
      label: 'Mood Changes', 
      types: ['depression', 'anxiety', 'apathy', 'irritability'],
      triggers: ['disease_progression', 'medication_changes', 'social_isolation']
    },
    thinking: { 
      label: 'Cognitive Function', 
      types: ['memory', 'attention', 'executive_function', 'confusion'],
      triggers: ['fatigue', 'medication_timing', 'stress', 'multitasking']
    },
    sleep: { 
      label: 'Sleep Disturbances', 
      types: ['insomnia', 'rem_sleep_disorder', 'restless_legs', 'excessive_daytime_sleepiness'],
      triggers: ['medication_timing', 'anxiety', 'physical_discomfort']
    }
  },
  'Autonomic Symptoms': {
    'giddiness': { 
      label: 'Dizziness/Orthostatic', 
      types: ['standing', 'position_change', 'medication_related'],
      triggers: ['medication_timing', 'dehydration', 'blood_pressure_changes']
    }
  }
};

const TIME_PERIODS = [
  { value: '7', label: '7 Days' },
  { value: '30', label: '1 Month' },
  { value: '90', label: '3 Months' },
  { value: '180', label: '6 Months' },
  { value: '365', label: '1 Year' }
];

const DetailedSymptomTrends: React.FC<DetailedSymptomTrendsProps> = ({ 
  symptoms, 
  userRole = 'patient',
  onBack 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  const periodDays = parseInt(selectedPeriod);
  const filteredSymptoms = useMemo(() => {
    const cutoffDate = subDays(new Date(), periodDays);
    return symptoms.filter(symptom => 
      new Date(symptom.logged_at) >= cutoffDate
    );
  }, [symptoms, periodDays]);

  const trendData = useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = periodDays - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const daySymptoms = filteredSymptoms.filter(symptom => 
        isSameDay(new Date(symptom.logged_at), date)
      );
      
      // Calculate average by symptom type
      const symptomsByType = daySymptoms.reduce((acc, symptom) => {
        if (!acc[symptom.symptom_type]) {
          acc[symptom.symptom_type] = [];
        }
        acc[symptom.symptom_type].push(symptom.severity);
        return acc;
      }, {} as Record<string, number[]>);

      const dayData: any = {
        date: format(date, 'MMM d'),
        fullDate: date,
        total: daySymptoms.length
      };

      Object.entries(symptomsByType).forEach(([type, severities]) => {
        dayData[type] = severities.reduce((sum, s) => sum + s, 0) / severities.length;
      });

      days.push(dayData);
    }
    
    return days;
  }, [filteredSymptoms, periodDays]);

  const symptomInsights = useMemo(() => {
    const insights: any = {};
    
    Object.entries(SYMPTOM_CATEGORIES).forEach(([category, symptoms]) => {
      Object.entries(symptoms).forEach(([symptomKey, config]) => {
        const symptomData = filteredSymptoms.filter(s => 
          s.symptom_type.toLowerCase() === symptomKey.toLowerCase()
        );
        
        if (symptomData.length > 0) {
          const avgSeverity = symptomData.reduce((sum, s) => sum + s.severity, 0) / symptomData.length;
          const recentWeek = symptomData.filter(s => 
            new Date(s.logged_at) >= subDays(new Date(), 7)
          );
          const previousWeek = symptomData.filter(s => {
            const date = new Date(s.logged_at);
            return date >= subDays(new Date(), 14) && date < subDays(new Date(), 7);
          });
          
          const recentAvg = recentWeek.length > 0 ? 
            recentWeek.reduce((sum, s) => sum + s.severity, 0) / recentWeek.length : 0;
          const previousAvg = previousWeek.length > 0 ? 
            previousWeek.reduce((sum, s) => sum + s.severity, 0) / previousWeek.length : 0;
          
          const trend = recentAvg > previousAvg ? 'worsening' : 
                       recentAvg < previousAvg ? 'improving' : 'stable';
          
          // Analyze details for clinical insights
          const detailAnalysis = symptomData.reduce((acc, symptom) => {
            if (symptom.details) {
              Object.entries(symptom.details).forEach(([key, value]) => {
                if (!acc[key]) acc[key] = {};
                if (!acc[key][value as string]) acc[key][value as string] = 0;
                acc[key][value as string]++;
              });
            }
            return acc;
          }, {} as Record<string, Record<string, number>>);
          
          insights[symptomKey] = {
            ...config,
            category,
            count: symptomData.length,
            avgSeverity,
            recentAvg,
            previousAvg,
            trend,
            detailAnalysis,
            mostRecentEntry: symptomData[symptomData.length - 1]
          };
        }
      });
    });
    
    return insights;
  }, [filteredSymptoms]);

  const getSymptomColor = (severity: number) => {
    if (severity <= 3) return '#00B488';
    if (severity <= 6) return '#FFC300';
    return '#FF4E4E';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingDown className="w-4 h-4 text-ojas-calming-green" />;
      case 'worsening': return <TrendingUp className="w-4 h-4 text-ojas-vibrant-coral" />;
      default: return <Minus className="w-4 h-4 text-ojas-soft-gold" />;
    }
  };

  const getTrendMessage = (trend: string, symptom: string) => {
    switch (trend) {
      case 'improving': return `${symptom} symptoms are improving compared to last week`;
      case 'worsening': return `${symptom} symptoms need attention - consider discussing with your care team`;
      default: return `${symptom} symptoms are stable`;
    }
  };

  // Sort symptoms by clinical priority (worsening first, then by severity)
  const sortedSymptoms = Object.entries(symptomInsights).sort(([, a], [, b]) => {
    if (a.trend === 'worsening' && b.trend !== 'worsening') return -1;
    if (b.trend === 'worsening' && a.trend !== 'worsening') return 1;
    if (a.trend === 'improving' && b.trend !== 'improving') return 1;
    if (b.trend === 'improving' && a.trend !== 'improving') return -1;
    return b.avgSeverity - a.avgSeverity;
  });

  const impactSymptoms = sortedSymptoms.filter(([, data]) => 
    data.trend === 'worsening' || data.avgSeverity >= 6
  );

  const positiveSymptoms = sortedSymptoms.filter(([, data]) => 
    data.trend === 'improving' || data.avgSeverity <= 3
  );

  if (selectedSymptom) {
    const symptomData = symptomInsights[selectedSymptom];
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedSymptom(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Overview
          </Button>
          <h2 className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white">
            {symptomData.label} Details
          </h2>
        </div>

        <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl p-6 shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-ojas-text-main dark:text-ojas-mist-white">
                {symptomData.avgSeverity.toFixed(1)}
              </div>
              <div className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                Average Severity
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                {getTrendIcon(symptomData.trend)}
                <span className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
                  {symptomData.trend}
                </span>
              </div>
              <div className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                7-Day Trend
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-ojas-text-main dark:text-ojas-mist-white">
                {symptomData.count}
              </div>
              <div className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                Total Entries
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey={selectedSymptom} 
                stroke={getSymptomColor(symptomData.avgSeverity)} 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {Object.keys(symptomData.detailAnalysis).length > 0 && (
          <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl p-6 shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray">
            <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-4">
              Clinical Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(symptomData.detailAnalysis).map(([key, values]) => (
                <div key={key} className="space-y-2">
                  <h4 className="font-medium text-ojas-text-main dark:text-ojas-mist-white capitalize">
                    {key.replace('_', ' ')}
                  </h4>
                  {Object.entries(values).map(([value, count]) => (
                    <div key={value} className="flex justify-between items-center">
                      <span className="text-ojas-text-secondary dark:text-ojas-cloud-silver capitalize">
                        {value.replace('_', ' ')}
                      </span>
                      <span className="text-ojas-text-main dark:text-ojas-mist-white font-medium">
                        {count} times
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-ojas-text-main dark:text-ojas-mist-white">
              {userRole === 'caregiver' ? "Patient's Symptoms" : "My Symptoms"}
            </h1>
            <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
              Comprehensive neurological symptom tracking
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_PERIODS.map(period => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Priority Symptoms Alert */}
      {impactSymptoms.length > 0 && (
        <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl p-6 shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-ojas-vibrant-coral" />
            <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
              Symptoms Requiring Attention
            </h3>
          </div>
          <div className="space-y-3">
            {impactSymptoms.slice(0, 3).map(([symptom, data]) => (
              <div key={symptom} className="flex items-center justify-between p-3 bg-ojas-vibrant-coral/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-ojas-vibrant-coral`}>
                    {data.avgSeverity.toFixed(0)}
                  </div>
                  <div>
                    <div className="font-medium text-ojas-text-main dark:text-ojas-mist-white">
                      {data.label}
                    </div>
                    <div className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                      {getTrendMessage(data.trend, data.label)}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSymptom(symptom)}
                  className="flex items-center gap-2"
                >
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Positive Progress */}
      {positiveSymptoms.length > 0 && (
        <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl p-6 shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-5 h-5 text-ojas-calming-green" />
            <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
              Positive Progress
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {positiveSymptoms.map(([symptom, data]) => (
              <div key={symptom} className="flex items-center justify-between p-3 bg-ojas-calming-green/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-ojas-calming-green`}>
                    {data.avgSeverity.toFixed(0)}
                  </div>
                  <div>
                    <div className="font-medium text-ojas-text-main dark:text-ojas-mist-white">
                      {data.label}
                    </div>
                    <div className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                      {getTrendMessage(data.trend, data.label)}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSymptom(symptom)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comprehensive Symptom Overview */}
      <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl p-6 shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray">
        <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-4">
          All Symptoms Overview
        </h3>
        
        <div className="space-y-6">
          {Object.entries(SYMPTOM_CATEGORIES).map(([category, categorySymptoms]) => {
            const categoryData = Object.entries(categorySymptoms).filter(([symptom]) => 
              symptomInsights[symptom]
            );
            
            if (categoryData.length === 0) return null;
            
            return (
              <div key={category} className="space-y-3">
                <h4 className="font-medium text-ojas-text-main dark:text-ojas-mist-white border-b border-ojas-border dark:border-ojas-slate-gray pb-2">
                  {category}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryData.map(([symptom, config]) => {
                    const data = symptomInsights[symptom];
                    return (
                      <div
                        key={symptom}
                        className="p-4 border border-ojas-border dark:border-ojas-slate-gray rounded-lg hover:shadow-ojas-soft transition-shadow cursor-pointer"
                        onClick={() => setSelectedSymptom(symptom)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold`}
                                 style={{ backgroundColor: getSymptomColor(data.avgSeverity) }}>
                              {data.avgSeverity.toFixed(0)}
                            </div>
                            <span className="font-medium text-ojas-text-main dark:text-ojas-mist-white">
                              {data.label}
                            </span>
                          </div>
                          {getTrendIcon(data.trend)}
                        </div>
                        <div className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                          {data.count} entries • {data.trend}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DetailedSymptomTrends;
