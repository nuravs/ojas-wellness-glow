
import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

interface SymptomLoggerProps {
  symptomName: string;
  onSave: (severity: number, notes?: string, quickOptions?: string[]) => Promise<void>;
  onCancel: () => void;
  quickOptions?: string[];
  loading?: boolean;
}

const SymptomLogger: React.FC<SymptomLoggerProps> = ({ 
  symptomName, 
  onSave, 
  onCancel, 
  quickOptions = [],
  loading = false
}) => {
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const [selectedQuickOptions, setSelectedQuickOptions] = useState<string[]>([]);

  const handleQuickOptionToggle = (option: string) => {
    setSelectedQuickOptions(prev => 
      prev.includes(option) 
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const handleSave = async () => {
    await onSave(severity, notes.trim() || undefined, selectedQuickOptions.length > 0 ? selectedQuickOptions : undefined);
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
    <div className="min-h-screen bg-ojas-mist-white p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-12 h-12 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200 shadow-ojas-soft disabled:opacity-50"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-ojas-charcoal-gray" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-ojas-charcoal-gray">
              Log {symptomName}
            </h1>
            <p className="text-ojas-slate-gray">How are you feeling right now?</p>
          </div>
        </div>

        {/* Severity Slider */}
        <div className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6 mb-6">
          <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-4">
            Severity Level
          </h3>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSeverity(Math.max(0, severity - 1))}
                disabled={loading}
                className="w-12 h-12 rounded-full bg-ojas-cloud-silver hover:bg-ojas-slate-gray/20 flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
              >
                <Minus className="w-5 h-5 text-ojas-charcoal-gray" />
              </button>
              
              <div className="flex-1 mx-6">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={severity}
                    onChange={(e) => setSeverity(parseInt(e.target.value))}
                    disabled={loading}
                    className="w-full h-3 bg-ojas-cloud-silver rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #00B488 0%, #FFC300 50%, #FF4E4E 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-ojas-slate-gray mt-2">
                    <span>No pain</span>
                    <span>Worst possible</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setSeverity(Math.min(10, severity + 1))}
                disabled={loading}
                className="w-12 h-12 rounded-full bg-ojas-cloud-silver hover:bg-ojas-slate-gray/20 flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
              >
                <Plus className="w-5 h-5 text-ojas-charcoal-gray" />
              </button>
            </div>

            {/* Severity Display */}
            <div className="flex items-center justify-center gap-4">
              <div className={`w-16 h-16 rounded-full ${getSeverityColor(severity)} flex items-center justify-center text-white font-bold text-2xl`}>
                {severity}
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-ojas-charcoal-gray">
                  {getSeverityLabel(severity)}
                </div>
                <div className="text-sm text-ojas-slate-gray">
                  Level {severity} of 10
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Options */}
        {quickOptions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6 mb-6">
            <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-4">
              Quick Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickOptions.map(option => (
                <button
                  key={option}
                  onClick={() => handleQuickOptionToggle(option)}
                  disabled={loading}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium disabled:opacity-50 ${
                    selectedQuickOptions.includes(option)
                      ? 'border-ojas-primary-blue bg-ojas-primary-blue/10 text-ojas-primary-blue'
                      : 'border-ojas-cloud-silver text-ojas-slate-gray hover:border-ojas-slate-gray'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6 mb-8">
          <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-4">
            Additional Notes
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional details about your symptoms..."
            disabled={loading}
            rows={4}
            className="w-full p-4 border border-ojas-cloud-silver rounded-xl focus:outline-none focus:ring-2 focus:ring-ojas-primary-blue focus:border-transparent resize-none disabled:opacity-50 disabled:bg-gray-50"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-6 py-4 bg-white border-2 border-ojas-cloud-silver text-ojas-slate-gray rounded-2xl font-semibold text-lg transition-all duration-200 hover:bg-gray-50 active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-6 py-4 bg-ojas-primary-blue text-white rounded-2xl font-semibold text-lg transition-all duration-200 hover:bg-ojas-primary-blue-hover active:scale-95 shadow-ojas-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              'Save Symptom'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SymptomLogger;
