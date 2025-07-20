
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';

interface Symptom {
  id: string;
  symptom_type: string;
  severity: number;
  logged_at: string;
}

interface SymptomsTrendsProps {
  symptoms: Symptom[];
  getRecentSymptoms: (days: number) => Symptom[];
  getSymptomTrends: () => { current: number; previous: number; trend: string };
  userRole?: 'patient' | 'caregiver';
}

const SymptomsTrends: React.FC<SymptomsTrendsProps> = ({ 
  symptoms, 
  getRecentSymptoms, 
  getSymptomTrends, 
  userRole = 'patient' 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(7);

  const weeklyData = useMemo(() => {
    const days = [];
    const today = new Date();
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const daySymptoms = symptoms.filter(symptom => 
        isSameDay(new Date(symptom.logged_at), date)
      );
      
      // Calculate average severity for the day
      let avgSeverity = 0;
      if (daySymptoms.length > 0) {
        const totalSeverity = daySymptoms.reduce((sum, symptom) => sum + symptom.severity, 0);
        avgSeverity = Math.round(totalSeverity / daySymptoms.length);
      }
      
      days.push({
        day: format(date, 'EEE'),
        date: format(date, 'MMM d'),
        severity: avgSeverity,
        count: daySymptoms.length
      });
    }
    
    return days;
  }, [symptoms]);

  const getBarColor = (value: number) => {
    if (value === 0) return '#E5E7EB';
    if (value <= 3) return '#00B488';
    if (value <= 6) return '#FFC300';
    return '#FF4E4E';
  };

  const topSymptoms = useMemo(() => {
    const symptomCounts = symptoms.reduce((acc, symptom) => {
      acc[symptom.symptom_type] = (acc[symptom.symptom_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(symptomCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type, count]) => ({ type, count }));
  }, [symptoms]);

  const trendData = getSymptomTrends();

  if (symptoms.length === 0) {
    return (
      <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl p-6 shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray">
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-ojas-text-tertiary dark:text-ojas-slate-gray mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-2">
            No Trends Available
          </h3>
          <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver">
            Log more symptoms to see trends and patterns
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Weekly Chart */}
      <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl p-6 shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-ojas-primary/10 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-ojas-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
              Weekly Symptom Trends
            </h3>
            <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
              Average severity levels (0-10)
            </p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6C7683', fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 10]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6C7683', fontSize: 12 }}
            />
            <Bar 
              dataKey="severity" 
              radius={[4, 4, 0, 0]}
              fill="#00B488"
              shape={(props: any) => {
                const color = getBarColor(props.payload?.severity || 0);
                return <rect {...props} fill={color} />;
              }}
            />
          </BarChart>
        </ResponsiveContainer>

        <div className="flex items-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-ojas-calming-green rounded-full"></div>
            <span className="text-ojas-text-secondary dark:text-ojas-cloud-silver">Mild (1-3)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-ojas-soft-gold rounded-full"></div>
            <span className="text-ojas-text-secondary dark:text-ojas-cloud-silver">Moderate (4-6)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-ojas-vibrant-coral rounded-full"></div>
            <span className="text-ojas-text-secondary dark:text-ojas-cloud-silver">Severe (7-10)</span>
          </div>
        </div>
      </div>

      {/* Trend Summary */}
      {trendData.current > 0 && (
        <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl p-6 shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-ojas-primary" />
            <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
              7-Day Trend Summary
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                Current average severity: <span className="font-semibold">{trendData.current.toFixed(1)}</span>
              </p>
              <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                Previous week average: <span className="font-semibold">{trendData.previous.toFixed(1)}</span>
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              trendData.trend === 'improving' ? 'bg-ojas-calming-green/10 text-ojas-calming-green' :
              trendData.trend === 'worsening' ? 'bg-ojas-vibrant-coral/10 text-ojas-vibrant-coral' :
              'bg-ojas-soft-gold/10 text-ojas-soft-gold'
            }`}>
              {trendData.trend}
            </div>
          </div>
        </div>
      )}

      {/* Top Symptoms */}
      {topSymptoms.length > 0 && (
        <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl p-6 shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-ojas-primary" />
            <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
              Most Frequent Symptoms
            </h3>
          </div>
          
          <div className="space-y-3">
            {topSymptoms.map((symptom, index) => (
              <div key={symptom.type} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-ojas-primary' : 
                    index === 1 ? 'bg-ojas-soft-gold' : 'bg-ojas-vibrant-coral'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium text-ojas-text-main dark:text-ojas-mist-white">
                    {symptom.type}
                  </span>
                </div>
                <span className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                  {symptom.count} {symptom.count === 1 ? 'time' : 'times'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomsTrends;
