
import React, { useState } from 'react';
import { X, Heart, Droplets, Activity, Weight, Thermometer } from 'lucide-react';

interface VitalEntryFormProps {
  selectedType?: string;
  onSubmit: (vitalData: any) => void;
  onCancel: () => void;
  userRole: 'patient' | 'caregiver';
}

const VitalEntryForm: React.FC<VitalEntryFormProps> = ({
  selectedType = '',
  onSubmit,
  onCancel,
  userRole
}) => {
  const [vitalType, setVitalType] = useState(selectedType);
  const [values, setValues] = useState<any>({});
  const [notes, setNotes] = useState('');
  const [measuredAt, setMeasuredAt] = useState(new Date().toISOString().slice(0, 16));

  const vitalTypes = [
    { type: 'blood_pressure', label: 'Blood Pressure', icon: Heart },
    { type: 'blood_sugar', label: 'Blood Sugar', icon: Droplets },
    { type: 'pulse', label: 'Pulse', icon: Activity },
    { type: 'weight', label: 'Weight', icon: Weight },
    { type: 'temperature', label: 'Temperature', icon: Thermometer }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vitalType || !values) return;

    onSubmit({
      vital_type: vitalType,
      values,
      notes: notes.trim() || undefined,
      measured_at: measuredAt
    });
  };

  const renderVitalInputs = () => {
    switch (vitalType) {
      case 'blood_pressure':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-2">
                  Systolic
                </label>
                <input
                  type="number"
                  placeholder="120"
                  value={values.systolic || ''}
                  onChange={(e) => setValues(prev => ({ ...prev, systolic: parseInt(e.target.value) || '' }))}
                  className="w-full px-4 py-3 rounded-xl border border-ojas-border dark:border-ojas-slate-gray bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white placeholder-ojas-text-secondary focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
                  style={{ minHeight: '44px' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-2">
                  Diastolic
                </label>
                <input
                  type="number"
                  placeholder="80"
                  value={values.diastolic || ''}
                  onChange={(e) => setValues(prev => ({ ...prev, diastolic: parseInt(e.target.value) || '' }))}
                  className="w-full px-4 py-3 rounded-xl border border-ojas-border dark:border-ojas-slate-gray bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white placeholder-ojas-text-secondary focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
                  style={{ minHeight: '44px' }}
                />
              </div>
            </div>
            <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">
              Normal: 90-120 / 60-80 mmHg
            </p>
          </div>
        );

      case 'blood_sugar':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-2">
                Blood Sugar Level
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="100"
                  value={values.value || ''}
                  onChange={(e) => setValues(prev => ({ ...prev, value: parseInt(e.target.value) || '' }))}
                  className="flex-1 px-4 py-3 rounded-xl border border-ojas-border dark:border-ojas-slate-gray bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white placeholder-ojas-text-secondary focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
                  style={{ minHeight: '44px' }}
                />
                <select
                  value={values.unit || 'mg/dL'}
                  onChange={(e) => setValues(prev => ({ ...prev, unit: e.target.value }))}
                  className="px-4 py-3 rounded-xl border border-ojas-border dark:border-ojas-slate-gray bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white"
                  style={{ minHeight: '44px' }}
                >
                  <option value="mg/dL">mg/dL</option>
                  <option value="mmol/L">mmol/L</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">
              Normal fasting: 70-100 mg/dL, Post-meal: 80-140 mg/dL
            </p>
          </div>
        );

      case 'pulse':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-2">
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                placeholder="72"
                value={values.value || ''}
                onChange={(e) => setValues(prev => ({ ...prev, value: parseInt(e.target.value) || '' }))}
                className="w-full px-4 py-3 rounded-xl border border-ojas-border dark:border-ojas-slate-gray bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white placeholder-ojas-text-secondary focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
                style={{ minHeight: '44px' }}
              />
            </div>
            <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">
              Normal: 60-100 bpm, Athletic: 40-60 bpm
            </p>
          </div>
        );

      case 'weight':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-2">
                Weight
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  placeholder="150"
                  value={values.value || ''}
                  onChange={(e) => setValues(prev => ({ ...prev, value: parseFloat(e.target.value) || '' }))}
                  className="flex-1 px-4 py-3 rounded-xl border border-ojas-border dark:border-ojas-slate-gray bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white placeholder-ojas-text-secondary focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
                  style={{ minHeight: '44px' }}
                />
                <select
                  value={values.unit || 'lbs'}
                  onChange={(e) => setValues(prev => ({ ...prev, unit: e.target.value }))}
                  className="px-4 py-3 rounded-xl border border-ojas-border dark:border-ojas-slate-gray bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white"
                  style={{ minHeight: '44px' }}
                >
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'temperature':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-2">
                Temperature
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  placeholder="98.6"
                  value={values.value || ''}
                  onChange={(e) => setValues(prev => ({ ...prev, value: parseFloat(e.target.value) || '' }))}
                  className="flex-1 px-4 py-3 rounded-xl border border-ojas-border dark:border-ojas-slate-gray bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white placeholder-ojas-text-secondary focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
                  style={{ minHeight: '44px' }}
                />
                <select
                  value={values.unit || 'F'}
                  onChange={(e) => setValues(prev => ({ ...prev, unit: e.target.value }))}
                  className="px-4 py-3 rounded-xl border border-ojas-border dark:border-ojas-slate-gray bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white"
                  style={{ minHeight: '44px' }}
                >
                  <option value="F">°F</option>
                  <option value="C">°C</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">
              Normal: 97.0-99.5°F (36.1-37.5°C)
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white">
          Add Vital Reading
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {!selectedType && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-3">
            Select Vital Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {vitalTypes.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => setVitalType(type)}
                className={`p-3 rounded-xl border transition-colors flex items-center gap-2 ${
                  vitalType === type
                    ? 'border-ojas-primary bg-ojas-primary/10 text-ojas-primary'
                    : 'border-ojas-border dark:border-ojas-slate-gray hover:border-ojas-primary/50'
                }`}
                style={{ minHeight: '44px' }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {vitalType && (
        <div className="space-y-6">
          {renderVitalInputs()}

          <div>
            <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-2">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={measuredAt}
              onChange={(e) => setMeasuredAt(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-ojas-border dark:border-ojas-slate-gray bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
              style={{ minHeight: '44px' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add context like fasting, post-meal, after exercise..."
              className="w-full px-4 py-3 rounded-xl border border-ojas-border dark:border-ojas-slate-gray bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white placeholder-ojas-text-secondary focus:ring-2 focus:ring-ojas-primary focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-xl border border-ojas-border dark:border-ojas-slate-gray text-ojas-text-main dark:text-ojas-mist-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              style={{ minHeight: '44px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!vitalType || !values || Object.keys(values).length === 0}
              className="flex-1 px-6 py-3 bg-ojas-primary text-white rounded-xl font-medium hover:bg-ojas-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ minHeight: '44px' }}
            >
              Add Reading
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default VitalEntryForm;
