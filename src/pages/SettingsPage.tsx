
import React, { useState } from 'react';
import { ArrowLeft, Eye, Type, Palette, Volume2, Bell, Shield, Contrast, ZoomIn } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeFonts, setLargeFonts] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [showColorblindPreview, setShowColorblindPreview] = useState(false);

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    if (!highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const toggleLargeFonts = () => {
    setLargeFonts(!largeFonts);
    if (!largeFonts) {
      document.documentElement.classList.add('large-fonts');
    } else {
      document.documentElement.classList.remove('large-fonts');
    }
  };

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const accessibilitySettings = [
    {
      id: 'contrast',
      title: 'High Contrast Mode',
      description: 'Dark background with high contrast text',
      icon: Contrast,
      toggle: highContrast,
      onToggle: toggleHighContrast
    },
    {
      id: 'fonts',
      title: 'Large Font Mode',
      description: 'Increase text size throughout the app',
      icon: Type,
      toggle: largeFonts,
      onToggle: toggleLargeFonts
    }
  ];

  const generalSettings = [
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Medication reminders and alerts',
      icon: Bell
    },
    {
      id: 'sounds',
      title: 'Sounds & Haptics',
      description: 'Feedback sounds and vibrations',
      icon: Volume2
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Data protection settings',
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-ojas-mist-white p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="w-14 h-14 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200 shadow-ojas-soft border-2 border-ojas-cloud-silver"
            aria-label="Go back to previous screen"
          >
            <ArrowLeft className="w-7 h-7 text-ojas-charcoal-gray" />
          </button>
          <h1 className="text-3xl font-bold text-ojas-charcoal-gray">
            Accessibility & Settings
          </h1>
        </div>

        {/* Accessibility Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-ojas-charcoal-gray mb-4">
            Accessibility Features
          </h2>
          <div className="space-y-4">
            {accessibilitySettings.map(setting => (
              <div key={setting.id} className="bg-white rounded-2xl shadow-ojas-soft border-2 border-ojas-cloud-silver p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-ojas-primary-blue/10 rounded-full flex items-center justify-center">
                      <setting.icon className="w-6 h-6 text-ojas-primary-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-ojas-charcoal-gray">
                        {setting.title}
                      </h3>
                      <p className="text-base text-ojas-slate-gray">
                        {setting.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={setting.onToggle}
                    className={`w-16 h-8 rounded-full transition-colors duration-200 ${
                      setting.toggle 
                        ? 'bg-ojas-calming-green' 
                        : 'bg-ojas-cloud-silver'
                    }`}
                    aria-label={`Toggle ${setting.title}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      setting.toggle ? 'translate-x-9' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Font Size Adjustment */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-ojas-soft border-2 border-ojas-cloud-silver p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-ojas-soft-gold/20 rounded-full flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-ojas-soft-gold" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-ojas-charcoal-gray">
                  Font Size Adjustment
                </h3>
                <p className="text-base text-ojas-slate-gray">
                  Fine-tune text size for better readability
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-ojas-slate-gray w-12">Small</span>
                <input
                  type="range"
                  min="14"
                  max="24"
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                  className="flex-1 h-3 bg-ojas-cloud-silver rounded-full appearance-none cursor-pointer"
                  aria-label="Adjust font size"
                />
                <span className="text-sm font-medium text-ojas-slate-gray w-12">Large</span>
              </div>
              
              <div className="text-center">
                <span className="text-base text-ojas-charcoal-gray" style={{ fontSize: `${fontSize}px` }}>
                  Preview text at {fontSize}px
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Colorblind Preview */}
        <div className="mb-8">
          <button
            onClick={() => setShowColorblindPreview(!showColorblindPreview)}
            className="w-full bg-white rounded-2xl shadow-ojas-soft border-2 border-ojas-cloud-silver p-6 text-left hover:shadow-ojas-medium transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-ojas-soft-gold/20 rounded-full flex items-center justify-center">
                <Palette className="w-6 h-6 text-ojas-soft-gold" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-ojas-charcoal-gray">
                  Colorblind-Friendly Mode
                </h3>
                <p className="text-base text-ojas-slate-gray">
                  View app with patterns and shapes for clarity
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Live Preview */}
        {(highContrast || largeFonts) && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-ojas-charcoal-gray mb-4">
              Live Preview
            </h3>
            <div className={`bg-white rounded-2xl shadow-ojas-soft border-2 border-ojas-cloud-silver p-6 ${
              highContrast ? 'bg-black text-white border-white' : ''
            } ${largeFonts ? 'text-2xl' : ''}`}>
              <h4 className="font-bold mb-3">Sample Interface</h4>
              <p className="mb-4">This shows how text appears with your current accessibility settings.</p>
              <button className={`px-6 py-3 rounded-xl font-semibold ${
                highContrast 
                  ? 'bg-white text-black' 
                  : 'bg-ojas-primary-blue text-white'
              }`}>
                Sample Button
              </button>
            </div>
          </div>
        )}

        {/* General Settings */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-ojas-charcoal-gray mb-4">
            General Settings
          </h2>
          <div className="space-y-4">
            {generalSettings.map(setting => (
              <button
                key={setting.id}
                className="w-full bg-white rounded-2xl shadow-ojas-soft border-2 border-ojas-cloud-silver p-6 text-left hover:shadow-ojas-medium transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-ojas-primary-blue/10 rounded-full flex items-center justify-center">
                    <setting.icon className="w-6 h-6 text-ojas-primary-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-ojas-charcoal-gray">
                      {setting.title}
                    </h3>
                    <p className="text-base text-ojas-slate-gray">
                      {setting.description}
                    </p>
                  </div>
                  <div className="w-6 h-6 border-r-2 border-b-2 border-ojas-charcoal-gray transform -rotate-45"></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
