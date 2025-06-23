
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface SymptomTrendsChartProps {
  symptomName: string;
  onClose: () => void;
}

const SymptomTrendsChart: React.FC<SymptomTrendsChartProps> = ({ symptomName, onClose }) => {
  // Sample data - in real app this would come from logged symptoms
  const weeklyData = [
    { day: 'Mon', severity: 3 },
    { day: 'Tue', severity: 2 },
    { day: 'Wed', severity: 4 },
    { day: 'Thu', severity: 1 },
    { day: 'Fri', severity: 3 },
    { day: 'Sat', severity: 2 },
    { day: 'Sun', severity: 1 }
  ];

  const getBarColor = (value: number) => {
    if (value <= 2) return '#00B488'; // Calming Green
    if (value <= 4) return '#FFC300'; // Soft Gold
    return '#FF4E4E'; // Vibrant Coral
  };

  // Custom Bar component to handle dynamic colors
  const CustomBar = (props: any) => {
    const { fill, ...restProps } = props;
    const color = getBarColor(props.payload?.severity || 0);
    return <Bar {...restProps} fill={color} />;
  };

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
              <p className="text-sm text-ojas-slate-gray">Severity levels (0-10)</p>
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
        </div>

        {/* Insights Card */}
        <div className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6 mb-6">
          <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-4">This Week's Insights</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-ojas-calming-green rounded-full"></div>
              <span className="text-ojas-slate-gray">3 low-severity days</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-ojas-soft-gold rounded-full"></div>
              <span className="text-ojas-slate-gray">3 moderate days</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-ojas-vibrant-coral rounded-full"></div>
              <span className="text-ojas-slate-gray">1 high-severity day</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-ojas-calming-green/10 rounded-xl">
            <p className="text-sm text-ojas-charcoal-gray">
              <strong>Good news!</strong> Your symptoms have been mostly mild this week. 
              Keep up your current routine.
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
