
import React, { useState } from 'react';
import { X, Heart, Droplets, Activity, Weight, Thermometer } from 'lucide-react';
import { z } from 'zod';

interface VitalEntryFormProps {
  selectedType?: string;
  onSubmit: (vitalData: any) => void;
  onCancel: () => void;
  userRole: 'patient' | 'caregiver';
}

// Zod validation schemas
const schemas: Record<string, z.ZodSchema<any>> = {
  blood_pressure: z.object({
    systolic: z.number().min(70).max(200),
    diastolic: z.number().min(40).max(120),
  }),
  blood_sugar: z.object({
    value: z.number().min(50).max(500),
    unit: z.string(),
  }),
  pulse: z.object({
    value: z.number().min(30).max(200),
  }),
  weight: z.object({
    value: z.number().min(20).max(250),
    unit: z.string(),
  }),
  temperature: z.object({
    value: z.number().min(90).max(110),
    unit: z.string(),
  }),
};

const VitalEntryForm: React.FC<VitalEntryFormProps> = ({
  selectedType = '',
  onSubmit,
  onCancel,
  userRole,
}) => {
  const [vitalType, setVitalType] = useState(selectedType);
  const [values, setValues] = useState<any>({});
  const [notes, setNotes] = useState('');
  const [measuredAt, setMeasuredAt] = useState(new Date().toISOString().slice(0, 16));
  const [error, setError] = useState<string | null>(null);

  const vitalTypes = [
    { type: 'blood_pressure', label: 'Blood Pressure', icon: Heart },
    { type: 'blood_sugar', label: 'Blood Sugar', icon: Droplets },
    { type: 'pulse', label: 'Pulse', icon: Activity },
    { type: 'weight', label: 'Weight', icon: Weight },
    { type: 'temperature', label: 'Temperature', icon: Thermometer },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vitalType) return;

    const schema = schemas[vitalType];
    const parse = schema.safeParse(values);

    if (!parse.success) {
      setError('Please enter valid values for this vital.');
      return;
    }

    setError(null);
    onSubmit({
      vital_type: vitalType,
      values: parse.data,
      notes: notes.trim() || undefined,
      measured_at: measuredAt,
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
                  className="w-full px-3 py-2 border border-ojas-border dark:border-ojas-slate-gray rounded-lg bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
                  value={values.systolic || ''}
                  onChange={(e) => setValues({ ...values, systolic: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-2">
                  Diastolic
                </label>
                <input
                  type="number"
                  placeholder="80"
                  className="w-full px-3 py-2 border border-ojas-border dark:border-ojas-slate-gray rounded-lg bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
                  value={values.diastolic || ''}
                  onChange={(e) => setValues({ ...values, diastolic: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">Normal: 90-120 / 60-80 mmHg</p>
          </div>
        );

      case 'blood_sugar':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-2">
              Blood Sugar Level
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                className="flex-1 px-3 py-2 border border-ojas-border dark:border-ojas-slate-gray rounded-lg bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
                value={values.value || ''}
                onChange={(e) => setValues({ ...values, value: parseFloat(e.target.value) })}
              />
              <select
                className="px-3 py-2 border border-ojas-border dark:border-ojas-slate-gray rounded-lg bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
                value={values.unit || 'mg/dL'}
                onChange={(e) => setValues({ ...values, unit: e.target.value })}
              >
                <option value="mg/dL">mg/dL</option>
                <option value="mmol/L">mmol/L</option>
              </select>
            </div>
            <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">Fasting: 70-100 | Post-meal: 80-140 mg/dL</p>
          </div>
        );

      case 'pulse':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-2">
              Heart Rate (bpm)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-ojas-border dark:border-ojas-slate-gray rounded-lg bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
              value={values.value || ''}
              onChange={(e) => setValues({ ...values, value: parseInt(e.target.value) })}
            />
            <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">Normal: 60-100 bpm</p>
          </div>
        );

      case 'weight':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-2">
              Weight
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                className="flex-1 px-3 py-2 border border-ojas-border dark:border-ojas-slate-gray rounded-lg bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
                value={values.value || ''}
                onChange={(e) => setValues({ ...values, value: parseFloat(e.target.value) })}
              />
              <select
                className="px-3 py-2 border border-ojas-border dark:border-ojas-slate-gray rounded-lg bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
                value={values.unit || 'kg'}
                onChange={(e) => setValues({ ...values, unit: e.target.value })}
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
          </div>
        );

      case 'temperature':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-2">
              Temperature
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                className="flex-1 px-3 py-2 border border-ojas-border dark:border-ojas-slate-gray rounded-lg bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
                value={values.value || ''}
                onChange={(e) => setValues({ ...values, value: parseFloat(e.target.value) })}
              />
              <select
                className="px-3 py-2 border border-ojas-border dark:border-ojas-slate-gray rounded-lg bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
                value={values.unit || 'F'}
                onChange={(e) => setValues({ ...values, unit: e.target.value })}
              >
                <option value="F">°F</option>
                <option value="C">°C</option>
              </select>
            </div>
            <p className="text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">Normal: 97.0–99.5°F</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white">
          Add Vital Reading
        </h3>
        <button 
          type="button" 
          onClick={onCancel}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!selectedType && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {vitalTypes.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => setVitalType(type)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                  vitalType === type 
                    ? 'border-ojas-primary bg-ojas-primary/10' 
                    : 'border-ojas-border dark:border-ojas-slate-gray hover:border-ojas-primary/50'
                }`}
              >
                <Icon className="w-6 h-6 text-ojas-primary" />
                <span className="text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white">
                  {label}
                </span>
              </button>
            ))}
          </div>
        )}

        {vitalType && (
          <>
            {renderVitalInputs()}

            <div>
              <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-2">
                Date & Time
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border border-ojas-border dark:border-ojas-slate-gray rounded-lg bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
                value={measuredAt}
                onChange={(e) => setMeasuredAt(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-2">
                Notes (optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-ojas-border dark:border-ojas-slate-gray rounded-lg bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add context..."
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex gap-3 pt-4">
              <button 
                type="button" 
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-ojas-border dark:border-ojas-slate-gray rounded-lg text-ojas-text-main dark:text-ojas-mist-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 px-4 py-2 bg-ojas-primary text-white rounded-lg hover:bg-ojas-primary-hover transition-colors"
              >
                Add Reading
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default VitalEntryForm;
