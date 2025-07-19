import React, { useState } from 'react';
import { X, Heart, Droplets, Activity, Weight, Thermometer } from 'lucide-react';
import { z } from 'zod';

interface VitalEntryFormProps {
  selectedType?: string;
  onSubmit: (vitalData: any) => void;
  onCancel: () => void;
  userRole: 'patient' | 'caregiver';
}

// Updated Zod validation schemas based on safe clinical ranges
const schemas: Record<string, z.ZodSchema<any>> = {
  blood_pressure: z.object({
    systolic: z.number().min(60).max(250),
    diastolic: z.number().min(30).max(140),
  }),
  blood_sugar: z.object({
    value: z.number().min(40).max(600),
    unit: z.string(),
  }),
  pulse: z.object({
    value: z.number().min(20).max(250),
  }),
  weight: z.object({
    value: z.number().min(10).max(300),
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
                <label className="block text-sm font-medium mb-2">Systolic</label>
                <input
                  type="number"
                  placeholder="120"
                  className="input"
                  value={values.systolic || ''}
                  onChange={(e) => setValues({ ...values, systolic: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Diastolic</label>
                <input
                  type="number"
                  placeholder="80"
                  className="input"
                  value={values.diastolic || ''}
                  onChange={(e) => setValues({ ...values, diastolic: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <p className="text-xs text-ojas-text-secondary">Normal: 90–120 / 60–80 mmHg</p>
          </div>
        );

      case 'blood_sugar':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium mb-2">Blood Sugar Level</label>
            <div className="flex gap-2">
              <input
                type="number"
                className="flex-1 input"
                value={values.value || ''}
                onChange={(e) => setValues({ ...values, value: parseFloat(e.target.value) })}
              />
              <select
                className="input"
                value={values.unit || 'mg/dL'}
                onChange={(e) => setValues({ ...values, unit: e.target.value })}
              >
                <option value="mg/dL">mg/dL</option>
                <option value="mmol/L">mmol/L</option>
              </select>
            </div>
            <p className="text-xs text-ojas-text-secondary">Fasting: 70–100 | Post-meal: 80–140 mg/dL</p>
          </div>
        );

      case 'pulse':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium mb-2">Heart Rate (bpm)</label>
            <input
              type="number"
              className="input"
              value={values.value || ''}
              onChange={(e) => setValues({ ...values, value: parseInt(e.target.value) })}
            />
            <p className="text-xs text-ojas-text-secondary">Normal: 60–100 bpm</p>
          </div>
        );

      case 'weight':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium mb-2">Weight</label>
            <div className="flex gap-2">
              <input
                type="number"
                className="flex-1 input"
                value={values.value || ''}
                onChange={(e) => setValues({ ...values, value: parseFloat(e.target.value) })}
              />
              <select
                className="input"
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
            <label className="block text-sm font-medium mb-2">Temperature</label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                className="flex-1 input"
                value={values.value || ''}
                onChange={(e) => setValues({ ...values, value: parseFloat(e.target.value) })}
              />
              <select
                className="input"
                value={values.unit || 'F'}
                onChange={(e) => setValues({ ...values, unit: e.target.value })}
              >
                <option value="F">°F</option>
                <option value="C">°C</option>
              </select>
            </div>
            <p className="text-xs text-ojas-text-secondary">Normal: 97–99°F</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Add Vital Reading</h3>
        <button onClick={onCancel} type="button" className="rounded-full hover:bg-gray-100">
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
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${
                  vitalType === type
                    ? 'border-ojas-primary bg-ojas-primary/10'
                    : 'border-ojas-border hover:border-ojas-primary/50'
                }`}
              >
                <Icon className="w-6 h-6 text-ojas-primary" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        )}

        {vitalType && (
          <>
            {renderVitalInputs()}

            <div>
              <label className="block text-sm font-medium mb-2">Date & Time</label>
              <input
                type="datetime-local"
                className="input"
                value={measuredAt}
                onChange={(e) => setMeasuredAt(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes (optional)</label>
              <textarea
                className="input"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add context..."
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-ojas-primary text-white rounded-lg hover:bg-ojas-primary-hover"
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
