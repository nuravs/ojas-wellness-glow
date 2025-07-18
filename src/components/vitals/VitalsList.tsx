import React, { useState } from 'react';
import { Heart, Droplets, Activity, Weight, Thermometer, TrendingUp } from 'lucide-react';
import { Vital } from '../../hooks/useVitals';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';

interface VitalsListProps {
  vitals: Vital[];
  userRole: 'patient' | 'caregiver';
  getVitalRangeStatus: (type: string, values: any) => any;
}

const VITAL_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'blood_pressure', label: 'Blood Pressure' },
  { value: 'blood_sugar', label: 'Blood Sugar' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'weight', label: 'Weight' },
  { value: 'temperature', label: 'Temperature' },
];

const MAX_TO_SHOW = 5;

const VitalsList: React.FC<VitalsListProps> = ({
  vitals,
  userRole,
  getVitalRangeStatus,
}) => {
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  if (!vitals || vitals.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-ojas-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-ojas-primary" />
        </div>
        <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-2">
          No Vitals Yet
        </h3>
        <p className="text-ojas-text-secondary dark:text-ojas-cloud-silver">
          Start tracking your health by adding your first vital reading above.
        </p>
      </div>
    );
  }

  // Filter by vital type
  const filteredVitals =
    filter === 'all'
      ? vitals
      : vitals.filter((v) => v.vital_type === filter);

  // Sort most recent first
  const sortedVitals = [...filteredVitals].sort(
    (a, b) =>
      new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime()
  );

  // Paginate unless showing all
  const displayedVitals = showAll ? sortedVitals : sortedVitals.slice(0, MAX_TO_SHOW);

  // Group by date buckets
  const groupVitalsByDate = (vitalsToGroup: Vital[]) => {
    const groups: Record<string, Vital[]> = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Older: [],
    };
    vitalsToGroup.forEach((vital) => {
      const date = new Date(vital.measured_at);
      if (isToday(date)) {
        groups.Today.push(vital);
      } else if (isYesterday(date)) {
        groups.Yesterday.push(vital);
      } else if (isThisWeek(date, { weekStartsOn: 1 })) {
        groups['This Week'].push(vital);
      } else {
        groups.Older.push(vital);
      }
    });
    return groups;
  };

  const grouped = groupVitalsByDate(displayedVitals);
  const mostRecentId = sortedVitals[0]?.id;

  // --- Utility functions ---

  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'blood_pressure': return Heart;
      case 'blood_sugar': return Droplets;
      case 'pulse': return Activity;
      case 'weight': return Weight;
      case 'temperature': return Thermometer;
      default: return Activity;
    }
  };

  const formatVitalValue = (vital: Vital) => {
    switch (vital.vital_type) {
      case 'blood_pressure':
        return `${vital.values.systolic ?? '--'}/${vital.values.diastolic ?? '--'} mmHg`;
      case 'blood_sugar':
        return `${vital.values.value} ${vital.values.unit || 'mg/dL'}`;
      case 'pulse':
        return `${vital.values.value} bpm`;
      case 'weight':
        return `${vital.values.value} ${vital.values.unit || 'lbs'}`;
      case 'temperature':
        return `${vital.values.value}°${vital.values.unit || 'F'}`;
      default:
        return 'N/A';
    }
  };

  const getVitalLabel = (type: string) => {
    switch (type) {
      case 'blood_pressure': return 'Blood Pressure';
      case 'blood_sugar': return 'Blood Sugar';
      case 'pulse': return 'Pulse';
      case 'weight': return 'Weight';
      case 'temperature': return 'Temperature';
      default: return type;
    }
  };

  const getVitalColor = (vital: Vital) => {
    if (vital.out_of_range) {
      return 'text-ojas-error';
    }
    return 'text-ojas-success';
  };

  // --- Render ---

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
        Latest Readings
      </h2>
      {/* Filter dropdown */}
      <div className="mb-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-1 text-ojas-text-main"
        >
          {VITAL_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {/* Grouped list */}
      <div className="space-y-3">
        {Object.entries(grouped).map(
          ([label, items]) =>
            items.length > 0 && (
              <div key={label}>
                <div className="font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-2 mt-4">
                  {label}
                </div>
                {items.map((vital, idx) => {
                  const Icon = getVitalIcon(vital.vital_type);
                  const status = getVitalRangeStatus(vital.vital_type, vital.values);
                  const highlight =
                    vital.id === mostRecentId && label === 'Today' && idx === 0;
                  return (
                    <div
                      key={vital.id}
                      className={`bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-4 mb-2 ${
                        highlight
                          ? 'ring-2 ring-ojas-primary ring-offset-2'
                          : ''
                      }`}
                      style={highlight ? { background: '#e6f7ff' } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-ojas-primary/10 rounded-full flex items-center justify-center">
                            <Icon className="w-5 h-5 text-ojas-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-ojas-text-main dark:text-ojas-mist-white">
                              {getVitalLabel(vital.vital_type)}
                            </h3>
                            <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                              {new Date(vital.measured_at).toLocaleDateString()}{' '}
                              at{' '}
                              {new Date(vital.measured_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-semibold ${getVitalColor(vital)}`}>
                            {formatVitalValue(vital)}
                          </p>
                          {status && (
                            <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                              {status.label}
                            </p>
                          )}
                        </div>
                      </div>
                      {vital.notes && (
                        <div className="mt-3 pt-3 border-t border-ojas-border dark:border-ojas-slate-gray">
                          <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                            <span className="font-medium">Notes:</span> {vital.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
        )}
        {/* Show more button */}
        {!showAll && sortedVitals.length > MAX_TO_SHOW && (
          <div className="text-center mt-4">
            <button
              className="px-4 py-2 bg-ojas-primary text-white rounded hover:bg-ojas-primary-dark transition"
              onClick={() => setShowAll(true)}
            >
              Show more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VitalsList;
