
import React from 'react';
import { ArrowLeft, Moon, Sun, Type } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Slider } from '../components/ui/slider';

interface EnhancedSettingsPageProps {
  onBack: () => void;
}

const EnhancedSettingsPage: React.FC<EnhancedSettingsPageProps> = ({ onBack }) => {
  const { isDarkMode, toggleDarkMode, fontSize, setFontSize, highContrast, toggleHighContrast, reducedMotion, toggleReducedMotion } = useTheme();

  const fontSizeOptions = [14, 16, 18, 20];
  const fontSizeLabels = ['Small', 'Medium', 'Large', 'Extra Large'];
  
  const getFontSizeIndex = () => fontSizeOptions.indexOf(fontSize);
  const handleFontSizeChange = (value: number[]) => {
    setFontSize(fontSizeOptions[value[0]]);
  };

  return (
    <div className="min-h-screen bg-ojas-bg-light dark:bg-ojas-soft-midnight">
      <div className="overflow-y-auto pb-32" style={{ padding: '0 16px' }}>
        {/* Header */}
        <div className="flex items-center gap-4 pt-12 pb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-ojas-slate-gray transition-colors"
            aria-label="Go back"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <ArrowLeft className="w-6 h-6 text-ojas-text-main dark:text-ojas-mist-white" />
          </button>
          <h1 className="text-2xl font-bold text-ojas-text-main dark:text-ojas-mist-white">
            Settings
          </h1>
        </div>

        {/* Settings Options */}
        <div className="space-y-6">
          {/* Dark Mode Toggle */}
          <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-ojas-primary/10 flex items-center justify-center">
                  {isDarkMode ? <Moon className="w-5 h-5 text-ojas-primary" /> : <Sun className="w-5 h-5 text-ojas-primary" />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
                    Dark Mode
                  </h3>
                  <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                    Switch between light and dark themes
                  </p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-ojas-primary/50 ${
                  isDarkMode ? 'bg-ojas-primary' : 'bg-gray-300'
                }`}
                aria-label={`Turn ${isDarkMode ? 'off' : 'on'} dark mode`}
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    isDarkMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Font Size Control */}
          <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-ojas-primary/10 flex items-center justify-center">
                <Type className="w-5 h-5 text-ojas-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white">
                  Text Size
                </h3>
                <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                  Adjust text size for better readability
                </p>
              </div>
            </div>

            {/* Font Size Slider */}
            <div className="space-y-4">
              <Slider
                value={[getFontSizeIndex()]}
                onValueChange={handleFontSizeChange}
                max={fontSizeOptions.length - 1}
                min={0}
                step={1}
                className="w-full"
              />
              
              {/* Size Labels */}
              <div className="flex justify-between text-xs text-ojas-text-secondary dark:text-ojas-cloud-silver">
                {fontSizeLabels.map((label, index) => (
                  <span key={index} className={index === getFontSizeIndex() ? 'font-semibold text-ojas-primary' : ''}>
                    {label}
                  </span>
                ))}
              </div>

              {/* Live Preview */}
              <div className="mt-6 p-4 bg-ojas-bg-light dark:bg-ojas-slate-gray/20 rounded-lg">
                <p className="text-ojas-text-main dark:text-ojas-mist-white" style={{ fontSize: `${fontSize}px`, lineHeight: 1.4 }}>
                  The quick brown fox jumps over the lazy dog. This preview shows how text will appear at your selected size.
                </p>
              </div>
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="bg-white dark:bg-ojas-charcoal-gray rounded-xl shadow-ojas-soft border border-ojas-border dark:border-ojas-slate-gray p-6">
            <h3 className="text-lg font-semibold text-ojas-text-main dark:text-ojas-mist-white mb-4">
              Accessibility
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-ojas-text-main dark:text-ojas-mist-white">
                    High Contrast
                  </h4>
                  <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                    Increase contrast for better visibility
                  </p>
                </div>
                <button
                  onClick={toggleHighContrast}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-ojas-primary/50 ${
                    highContrast ? 'bg-ojas-primary' : 'bg-gray-300'
                  }`}
                  aria-label={`Turn ${highContrast ? 'off' : 'on'} high contrast mode`}
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      highContrast ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-ojas-text-main dark:text-ojas-mist-white">
                    Reduced Motion
                  </h4>
                  <p className="text-sm text-ojas-text-secondary dark:text-ojas-cloud-silver">
                    Minimize animations and transitions
                  </p>
                </div>
                <button
                  onClick={toggleReducedMotion}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-ojas-primary/50 ${
                    reducedMotion ? 'bg-ojas-primary' : 'bg-gray-300'
                  }`}
                  aria-label={`Turn ${reducedMotion ? 'off' : 'on'} reduced motion mode`}
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      reducedMotion ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSettingsPage;
