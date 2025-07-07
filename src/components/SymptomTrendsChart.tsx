
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

interface SymptomTrendsChartProps {
  symptomName: string;
  onClose: () => void;
}

interface DayData {
  day: string;
  severity: number;
  count: number;
}

const SymptomTrendsChart: React.FC<SymptomTrendsChartProps> = ({ symptomName, onClose }) => {
  const [weeklyData, setWeeklyData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState({
    lowSeverityDays: 0,
    moderateDays: 0,
    highSeverityDays: 0,
    totalEntries: 0
  });

  const { user } = useAuth();

  useEffect(() => {
    const loadSymptomData = async () => {
      if (!user) return;

      try {
        // Get last 7 days of symptom data
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        console.log('Loading symptoms from', startDate.toISOString(), 'to', endDate.toISOString());

        const { data: symptoms, error } = await supabase
          .from('symptoms')
          .select('*')
          .gte('logged_at', startDate.toISOString())
          .lte('logged_at', endDate.toISOString())
          .order('logged_at', { ascending: true });

        if (error) {
          console.error('Error loading symptoms:', error);
          setLoading(false);
          return;
        }

        console.log('Loaded symptoms:', symptoms);

        // Process data by day
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const processedData: DayData[] = [];
        
        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayName = dayNames[date.getDay()];
          
          // Get symptoms for this day
          const daySymptoms = symptoms?.filter(symptom => {
            const symptomDate = new Date(symptom.logged_at);
            return symptomDate.toDateString() === date.toDateString();
          }) || [];

          // Calculate average severity for the day
          let avgSeverity = 0;
          if (daySymptoms.length > 0) {
            const totalSeverity = daySymptoms.reduce((sum, symptom) => 
              sum + (symptom.severity || 0), 0);
            avgSeverity = Math.round(totalSeverity / daySymptoms.length);
          }

          processedData.push({
            day: dayName,
            severity: avgSeverity,
            count: daySymptoms.length
          });
        }

        setWeeklyData(processedData);

        // Calculate insights
        const totalEntries = symptoms?.length || 0;
        const severityData = symptoms?.map(s => s.severity || 0) || [];
        
        const lowSeverityDays = processedData.filter(d => d.severity > 0 && d.severity <= 3).length;
        const moderateDays = processedData.filter(d => d.severity >= 4 && d.severity <= 6).length;
        const highSeverityDays = processedData.filter(d => d.severity >= 7).length;

        setInsights({
          lowSeverityDays,
          moderateDays,
          highSeverityDays,
          totalEntries
        });

      } catch (error) {
        console.error('Error loading symptom trends:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSymptomData();
  }, [user]);

  const getBarColor = (value: number) => {
    if (value === 0) return '#E5E7EB'; // Gray for no data
    if (value <= 3) return '#00B488'; // Calming Green
    if (value <= 6) return '#FFC300'; // Soft Gold
    return '#FF4E4E'; // Vibrant Coral
  };

  const getInsightMessage = () => {
    if (insights.totalEntries === 0) {
      return "No symptom data recorded this week. Start logging to see trends!";
    }
    
    if (insights.lowSeverityDays >= 4) {
      return "Great news! Most of your symptoms have been mild this week. Keep up your current routine.";
    } else if (insights.highSeverityDays >= 3) {
      return "You've had several high-severity days. Consider discussing this pattern with your healthcare provider.";
    } else {
      return "Your symptoms show a mixed pattern this week. Continue tracking to identify trends.";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ojas-mist-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ojas-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ojas-slate-gray">Loading symptom trends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ojas-mist-white p-6 animate-gentle-fade-in">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200 shadow-ojas-soft"
            aria-label="Go back"
          >
            <div className="w-6 h-6 border-l-2 border-b-2 border-ojas-charcoal-gray transform rotate-45"></div>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-ojas-charcoal-gray">
              {symptomName} Trends
            </h1>
            <p className="text-ojas-slate-gray">Past 7 days</p>
          </div>
        </div>

        {/* Chart Card */}
        <div className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-ojas-primary-blue/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-ojas-primary-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ojas-charcoal-gray">Weekly Overview</h3>
              <p className="text-sm text-ojas-slate-gray">Average severity levels (0-10)</p>
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

          {insights.totalEntries === 0 && (
            <div className="text-center py-4">
              <p className="text-ojas-slate-gray text-sm">No data recorded this week</p>
            </div>
          )}
        </div>

        {/* Insights Card */}
        <div className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6 mb-6">
          <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-4">This Week's Insights</h3>
          
          {insights.totalEntries > 0 ? (
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-ojas-calming-green rounded-full"></div>
                <span className="text-ojas-slate-gray">{insights.lowSeverityDays} low-severity days</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-ojas-soft-gold rounded-full"></div>
                <span className="text-ojas-slate-gray">{insights.moderateDays} moderate days</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-ojas-vibrant-coral rounded-full"></div>
                <span className="text-ojas-slate-gray">{insights.highSeverityDays} high-severity days</span>
              </div>
              <div className="pt-2 border-t border-ojas-cloud-silver">
                <span className="text-sm text-ojas-slate-gray">
                  Total entries: {insights.totalEntries}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 mb-4">
              <p className="text-ojas-slate-gray">Start logging symptoms to see insights</p>
            </div>
          )}

          <div className="p-3 bg-ojas-calming-green/10 rounded-xl">
            <p className="text-sm text-ojas-charcoal-gray">
              <strong>Insight:</strong> {getInsightMessage()}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full px-8 py-4 bg-ojas-primary-blue text-white rounded-2xl font-semibold text-lg transition-all duration-200 hover:bg-ojas-primary-blue-hover active:scale-95 shadow-ojas-medium"
        >
          Back to Symptoms
        </button>
      </div>
    </div>
  );
};

export default SymptomTrendsChart;
