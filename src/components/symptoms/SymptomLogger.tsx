
import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from '../ui/button';

interface SymptomLoggerProps {
  onSubmit: (symptomData: any) => Promise<void>;
  onCancel: () => void;
  userRole?: 'patient' | 'caregiver';
}

const SYMPTOM_TYPES = [
  'Tremor', 'Stiffness', 'Balance', 'Mood', 'Vision', 
  'Sleep', 'Pain', 'Thinking', 'Giddiness/Dizziness'
];

const SymptomLogger: React.FC<SymptomLoggerProps> = ({ 
  onSubmit, 
  onCancel, 
  userRole = 'patient' 
}) => {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedSymptom) return;
    
    setLoading(true);
    try {
      await onSubmit({
        symptom_type: selectedSymptom,
        severity,
        notes: notes.trim() || null,
        logged_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error logging symptom:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (level: number) => {
    if (level <= 3) return 'bg-ojas-calming-green';
    if (level <= 6) return 'bg-ojas-soft-gold';
    return 'bg-ojas-vibrant-coral';
  };

  const getSeverityLabel = (level: number) => {
    if (level <= 2) return 'Very Mild';
    if (level <= 4) return 'Mild';
    if (level <= 6) return 'Moderate';
    if (level <= 8) return 'Severe';
    return 'Very Severe';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-ojas-text-main dark:text-ojas-mist-white">
          Log Symptom
        </h2>
        <button
          onClick={onCancel}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Symptom Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-3">
          Select Symptom
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SYMPTOM_TYPES.map(symptom => (
            <button
              key={symptom}
              onClick={() => setSelectedSymptom(symptom)}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                selectedSymptom === symptom
                  ? 'border-ojas-primary bg-ojas-primary/10 text-ojas-primary'
                  : 'border-ojas-border dark:border-ojas-slate-gray text-ojas-text-secondary dark:text-ojas-cloud-silver hover:border-ojas-primary/50'
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      {/* Severity Slider */}
      {selectedSymptom && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-3">
            Severity Level
          </label>
          
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setSeverity(Math.max(0, severity - 1))}
              className="w-10 h-10 rounded-full bg-ojas-cloud-silver hover:bg-ojas-slate-gray/20 flex items-center justify-center"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver mt-1">
                <span>No symptoms</span>
                <span>Worst possible</span>
              </div>
            </div>
            
            <button
              onClick={() => setSeverity(Math.min(10, severity + 1))}
              className="w-10 h-10 rounded-full bg-ojas-cloud-silver hover:bg-ojas-slate-gray/20 flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Severity Display */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-full ${getSeverityColor(severity)} flex items-center justify-center text-white font-bold text-lg`}>
              {severity}
            </div>
            <div className="text-center">
              <div className="font-semibold text-ojas-text-main dark:text-ojas-mist-white">
                {getSeverityLabel(severity)}
              </div>
              <div className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                Level {severity} of 10
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-ojas-text-main dark:text-ojas-mist-white mb-3">
          Additional Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional details about your symptoms..."
          rows={3}
          className="w-full p-3 border border-ojas-border dark:border-ojas-slate-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-ojas-primary bg-white dark:bg-ojas-charcoal-gray text-ojas-text-main dark:text-ojas-mist-white"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1 bg-ojas-primary hover:bg-ojas-primary-hover"
          disabled={loading || !selectedSymptom}
        >
          {loading ? 'Saving...' : 'Save Symptom'}
        </Button>
      </div>
    </div>
  );
};

export default SymptomLogger;
