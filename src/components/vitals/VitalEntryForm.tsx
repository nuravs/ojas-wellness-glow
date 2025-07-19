// src/components/vitals/VitalEntryForm.tsx

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
                <label>Systolic</label>
                <input
                  type="number"
                  placeholder="120"
                  value={values.systolic || ''}
                  onChange={(e) => setValues({ ...values, systolic: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label>Diastolic</label>
                <input
                  type="number"
                  placeholder="80"
                  value={values.diastolic || ''}
                  onChange={(e) => setValues({ ...values, diastolic: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <p className="text-xs">Normal: 90-120 / 60-80 mmHg</p>
          </div>
        );

      case 'blood_sugar':
        return (
          <div className="space-y-4">
            <label>Blood Sugar Level</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={values.value || ''}
                onChange={(e) => setValues({ ...values, value: parseFloat(e.target.value) })}
              />
              <select
                value={values.unit || 'mg/dL'}
                onChange={(e) => setValues({ ...values, unit: e.target.value })}
              >
                <option value="mg/dL">mg/dL</option>
                <option value="mmol/L">mmol/L</option>
              </select>
            </div>
            <p className="text-xs">Fasting: 70-100 | Post-meal: 80-140 mg/dL</p>
          </div>
        );

      case 'pulse':
        return (
          <div className="space-y-4">
            <label>Heart Rate (bpm)</label>
            <input
              type="number"
              value={values.value || ''}
              onChange={(e) => setValues({ ...values, value: parseInt(e.target.value) })}
            />
            <p className="text-xs">Normal: 60-100 bpm</p>
          </div>
        );

      case 'weight':
        return (
          <div className="space-y-4">
            <label>Weight</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={values.value || ''}
                onChange={(e) => setValues({ ...values, value: parseFloat(e.target.value) })}
              />
              <select
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
            <label>Temperature</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={values.value || ''}
                onChange={(e) => setValues({ ...values, value: parseFloat(e.target.value) })}
              />
              <select
                value={values.unit || 'F'}
                onChange={(e) => setValues({ ...values, unit: e.target.value })}
              >
                <option value="F">°F</option>
                <option value="C">°C</option>
              </select>
            </div>
            <p className="text-xs">Normal: 97.0–99.5°F</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3>Add Vital Reading</h3>
        <button type="button" onClick={onCancel}>
          <X />
        </button>
      </div>

      {!selectedType && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {vitalTypes.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => setVitalType(type)}
              className={vitalType === type ? 'bg-blue-100' : ''}
            >
              <Icon className="inline-block mr-2" />
              {label}
            </button>
          ))}
        </div>
      )}

      {vitalType && (
        <>
          {renderVitalInputs()}

          <div className="mt-4">
            <label>Date & Time</label>
            <input
              type="datetime-local"
              value={measuredAt}
              onChange={(e) => setMeasuredAt(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add context..."
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex gap-2 mt-6">
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit">Add Reading</button>
          </div>
        </>
      )}
    </form>
  );
};

export default VitalEntryForm;
