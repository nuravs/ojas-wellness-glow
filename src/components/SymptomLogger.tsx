
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
    if (value <= 3) return 'text-wellness-green';
    if (value <= 6) return 'text-wellness-yellow';
    return 'text-wellness-red';
  };

  const getSeverityLabel = (value: number) => {
    if (value === 0) return 'None';
    if (value <= 2) return 'Mild';
    if (value <= 4) return 'Light';
    if (value <= 6) return 'Moderate';
    if (value <= 8) return 'Strong';
    return 'Severe';
  };

  return (
    <div className="min-h-screen bg-background p-6 animate-gentle-fade-in">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onCancel}
            className="w-12 h-12 rounded-full bg-calm-100 hover:bg-calm-200 flex items-center justify-center transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-calm-700" />
          </button>
          <h1 className="text-2xl font-semibold text-calm-800">
            How is your {symptomName.toLowerCase()} today?
          </h1>
        </div>

        {/* Severity Selector */}
        <div className="ojas-card mb-6">
          <div className="text-center mb-8">
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
              className="w-16 h-16 rounded-full bg-calm-100 hover:bg-calm-200 flex items-center justify-center transition-all duration-200 active:scale-95"
              disabled={severity === 0}
              aria-label="Decrease severity"
            >
              <Minus className="w-8 h-8 text-calm-700" />
            </button>

            <div className="flex-1 mx-4">
              <div className="h-2 bg-calm-200 rounded-full relative overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    severity <= 3 ? 'bg-wellness-green' : 
                    severity <= 6 ? 'bg-wellness-yellow' : 
                    'bg-wellness-red'
                  }`}
                  style={{ width: `${(severity / 10) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-calm-500 mt-2">
                <span>None</span>
                <span>Severe</span>
              </div>
            </div>

            <button
              onClick={() => adjustSeverity(1)}
              className="w-16 h-16 rounded-full bg-calm-100 hover:bg-calm-200 flex items-center justify-center transition-all duration-200 active:scale-95"
              disabled={severity === 10}
              aria-label="Increase severity"
            >
              <Plus className="w-8 h-8 text-calm-700" />
            </button>
          </div>
        </div>

        {/* Quick Options */}
        {quickOptions.length > 0 && (
          <div className="ojas-card mb-8">
            <h3 className="text-lg font-semibold text-calm-800 mb-4">
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
                      ? 'bg-wellness-blue text-white border-wellness-blue'
                      : 'bg-white text-calm-700 border-calm-200 hover:border-wellness-blue/50'
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
            className="ojas-button-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="ojas-button-primary flex-1"
          >
            Save & Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SymptomLogger;
