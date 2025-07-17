import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Vital } from '../../hooks/useVitals';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface VitalTrendsChartProps {
  vitals: Vital[];
  vitalType: string;
  userRole: 'patient' | 'caregiver';
}

const VitalTrendsChart: React.FC<VitalTrendsChartProps> = ({ 
  vitals, 
  vitalType, 
  userRole 
}) => {
  const filteredVitals = vitals
    .filter(v => v.vital_type === vitalType)
    .slice(0, 30) // Last 30 readings
    .reverse(); // Show oldest to newest

  const formatDataForChart = () => {
    return filteredVitals.map((vital, index) => {
      const date = new Date(vital.measured_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });

      switch (vitalType) {
        case 'blood_pressure':
          return {
            date,
            systolic: vital.values.systolic,
            diastolic: vital.values.diastolic,
            reading: `${vital.values.systolic}/${vital.values.diastolic}`,
            outOfRange: vital.out_of_range
          };
        case 'blood_sugar':
        case 'pulse':
        case 'weight':
        case 'temperature':
          return {
            date,
            value: vital.values.value,
            reading: `${vital.values.value}${vital.values.unit ? ' ' + vital.values.unit : ''}`,
            outOfRange: vital.out_of_range
          };
        default:
          return { date, value: 0, reading: 'N/A', outOfRange: false };
      }
    });
  };

  const getTrendDirection = () => {
    if (filteredVitals.length < 2) return 'stable';
    
    const recent = filteredVitals.slice(-3);
    const older = filteredVitals.slice(-6, -3);
    
    if (recent.length === 0 || older.length === 0) return 'stable';

    let recentAvg = 0;
    let olderAvg = 0;

    if (vitalType === 'blood_pressure') {
      recentAvg = recent.reduce((acc, v) => acc + v.values.systolic, 0) / recent.length;
      olderAvg = older.reduce((acc, v) => acc + v.values.systolic, 0) / older.length;
    } else {
      recentAvg = recent.reduce((acc, v) => acc + v.values.value, 0) / recent.length;
      olderAvg = older.reduce((acc, v) => acc + v.values.value, 0) / older.length;
    }

    const diff = recentAvg - olderAvg;
    const threshold = recentAvg * 0.05; // 5% change threshold

    if (Math.abs(diff) < threshold) return 'stable';
    return diff > 0 ? 'up' : 'down';
  };

  const getVitalName = () => {
    const names = {
      blood_pressure: 'Blood Pressure',
      blood_sugar: 'Blood Sugar',
      pulse: 'Heart Rate',
      weight: 'Weight',
      temperature: 'Temperature'
    };
    return names[vitalType as keyof typeof names] || vitalType;
  };

  const getNormalRange = () => {
    const ranges = {
      blood_pressure: '90-120 / 60-80 mmHg',
      blood_sugar: '70-140 mg/dL',
      pulse: '60-100 bpm',
      weight: 'Varies by individual',
      temperature: '97.0-99.5°F'
    };
    return ranges[vitalType as keyof typeof ranges] || '';
  };

  const chartData = formatDataForChart();
  const trend = getTrendDirection();

  if (filteredVitals.length === 0) {
    return (
      <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-6">
        <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-4">
          {getVitalName()} Trends
        </h3>
        <div className="text-center py-8">
          <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver">
            No {getVitalName().toLowerCase()} data available yet
          </p>
          <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver mt-2">
            Start logging readings to see trends
          </p>
        </div>
      </div>
    );
  }

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-ojas-primary' : trend === 'down' ? 'text-ojas-alert' : 'text-ojas-text-secondary';

  return (
    <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
            {getVitalName()} Trends
          </h3>
          <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
            Last {filteredVitals.length} readings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TrendIcon className={`w-5 h-5 ${trendColor}`} />
          <span className={`text-sm font-medium ${trendColor} capitalize`}>
            {trend}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">
          Normal Range: {getNormalRange()}
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E1E4EA',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            {vitalType === 'blood_pressure' ? (
              <>
                <Line 
                  type="monotone" 
                  dataKey="systolic" 
                  stroke="#0077B6" 
                  strokeWidth={2}
                  dot={{ fill: '#0077B6', strokeWidth: 2, r: 4 }}
                  name="Systolic"
                />
                <Line 
                  type="monotone" 
                  dataKey="diastolic" 
                  stroke="#FF4E4E" 
                  strokeWidth={2}
                  dot={{ fill: '#FF4E4E', strokeWidth: 2, r: 4 }}
                  name="Diastolic"
                />
              </>
            ) : (
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0077B6" 
                strokeWidth={2}
                dot={{ fill: '#0077B6', strokeWidth: 2, r: 4 }}
                name={getVitalName()}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">Latest Reading</p>
          <p className="text-sm font-semibold text-ojas-text-main dark:text-ojas-mist-white">
            {chartData[chartData.length - 1]?.reading || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">Readings This Month</p>
          <p className="text-sm font-semibold text-ojas-text-main dark:text-ojas-mist-white">
            {filteredVitals.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VitalTrendsChart;