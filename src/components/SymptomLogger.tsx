
import React, { useState } from 'react';
import { ArrowLeft, Minus, Plus } from 'lucide-react';

interface SymptomLoggerProps {
  symptomName: string;
  onSave: (severity: number, notes?: string) => void;
  onCancel: () => void;
  quickOptions?: string[];
}

const SymptomLogger: React.FC<SymptomLoggerProps> = ({ 
  symptomName, 
  onSave, 
  onCancel, 
  quickOptions = [] 
}) => {
  const [severity, setSeverity] = useState(3);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const adjustSeverity = (delta: number) => {
    setSeverity(prev => Math.max(0, Math.min(10, prev + delta)));
  };

  const handleSave = () => {
    const notes = selectedOption || undefined;
    onSave(severity, notes);
  };

  const getSeverityColor = (value: number) => {
    if (value <= 3) return 'text-ojas-calming-green';
    if (value <= 6) return 'text-ojas-soft-gold';
    return 'text-ojas-vibrant-coral';
  };

  const getSeverityEmoji = (value: number) => {
    if (value === 0) return '😊';
    if (value <= 2) return '😌';
    if (value <= 4) return '😐';
    if (value <= 6) return '😕';
    if (value <= 8) return '😰';
    return '😣';
  };

  const getSeverityLabel = (value: number) => {
    if (value === 0) return 'None';
    if (value <= 2) return 'Mild';
    if (value <= 4) return 'Light';
    if (value <= 6) return 'Moderate';
    if (value <= 8) return 'Strong';
    return 'Severe';
  };

  const getProgressBarColor = (value: number) => {
    if (value <= 3) return 'bg-ojas-calming-green';
    if (value <= 6) return 'bg-ojas-soft-gold';
    return 'bg-ojas-vibrant-coral';
  };

  return (
    <div className="min-h-screen bg-ojas-mist-white p-6 animate-gentle-fade-in">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onCancel}
            className="w-12 h-12 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200 shadow-ojas-soft"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-ojas-charcoal-gray" />
          </button>
          <h1 className="text-2xl font-semibold text-ojas-charcoal-gray">
            How is your {symptomName.toLowerCase()} today?
          </h1>
        </div>

        {/* Severity Selector */}
        <div className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-8 mb-6">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              {getSeverityEmoji(severity)}
            </div>
            <div className={`text-6xl font-bold ${getSeverityColor(severity)} mb-2`}>
              {severity}
            </div>
            <div className={`text-xl font-medium ${getSeverityColor(severity)}`}>
              {getSeverityLabel(severity)}
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mb-6">
            <button
              onClick={() => adjustSeverity(-1)}
              className="w-16 h-16 rounded-full bg-ojas-cloud-silver hover:bg-gray-300 flex items-center justify-center transition-all duration-200 active:scale-95"
              disabled={severity === 0}
              aria-label="Decrease severity"
            >
              <Minus className="w-8 h-8 text-ojas-charcoal-gray" />
            </button>

            <div className="flex-1 mx-4">
              <div className="h-3 bg-ojas-cloud-silver rounded-full relative overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${getProgressBarColor(severity)}`}
                  style={{ width: `${(severity / 10) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-ojas-slate-gray mt-2">
                <span>None</span>
                <span>Severe</span>
              </div>
            </div>

            <button
              onClick={() => adjustSeverity(1)}
              className="w-16 h-16 rounded-full bg-ojas-cloud-silver hover:bg-gray-300 flex items-center justify-center transition-all duration-200 active:scale-95"
              disabled={severity === 10}
              aria-label="Increase severity"
            >
              <Plus className="w-8 h-8 text-ojas-charcoal-gray" />
            </button>
          </div>
        </div>

        {/* Quick Options */}
        {quickOptions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6 mb-8">
            <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-4">
              Additional details (optional)
            </h3>
            <div className="flex flex-wrap gap-3">
              {quickOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedOption(
                    selectedOption === option ? null : option
                  )}
                  className={`px-4 py-2 rounded-xl border-2 transition-all duration-200 ${
                    selectedOption === option
                      ? 'bg-ojas-primary-blue text-white border-ojas-primary-blue'
                      : 'bg-white text-ojas-charcoal-gray border-ojas-cloud-silver hover:border-ojas-primary-blue/50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-8 py-4 bg-white border-2 border-ojas-cloud-silver text-ojas-charcoal-gray rounded-2xl font-semibold text-lg transition-all duration-200 hover:bg-gray-50 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-8 py-4 bg-ojas-primary-blue text-white rounded-2xl font-semibold text-lg transition-all duration-200 hover:bg-ojas-primary-blue-hover active:scale-95 shadow-ojas-medium"
          >
            Save & Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default SymptomLogger;
