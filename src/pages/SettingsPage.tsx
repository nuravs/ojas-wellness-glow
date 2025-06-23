
import React, { useState } from 'react';
import { ArrowLeft, Eye, Type, Palette, Volume2, Bell, Shield } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeFonts, setLargeFonts] = useState(false);
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

  const accessibilitySettings = [
    {
      id: 'contrast',
      title: 'High Contrast',
      description: 'Increase contrast for better visibility',
      icon: Eye,
      toggle: highContrast,
      onToggle: toggleHighContrast
    },
    {
      id: 'fonts',
      title: 'Large Fonts',
      description: 'Make text larger throughout the app',
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
            className="w-12 h-12 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200 shadow-ojas-soft"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-ojas-charcoal-gray" />
          </button>
          <h1 className="text-2xl font-semibold text-ojas-charcoal-gray">
            Settings
          </h1>
        </div>

        {/* Accessibility Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-ojas-charcoal-gray mb-4">
            Accessibility
          </h2>
          <div className="space-y-3">
            {accessibilitySettings.map(setting => (
              <div key={setting.id} className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-ojas-primary-blue/10 rounded-full flex items-center justify-center">
                      <setting.icon className="w-5 h-5 text-ojas-primary-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-ojas-charcoal-gray">
                        {setting.title}
                      </h3>
                      <p className="text-sm text-ojas-slate-gray">
                        {setting.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={setting.onToggle}
                    className={`w-12 h-7 rounded-full transition-colors duration-200 ${
                      setting.toggle 
                        ? 'bg-ojas-calming-green' 
                        : 'bg-ojas-cloud-silver'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      setting.toggle ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colorblind Preview */}
        <div className="mb-8">
          <button
            onClick={() => setShowColorblindPreview(!showColorblindPreview)}
            className="w-full bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6 text-left hover:shadow-ojas-medium transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-ojas-soft-gold/20 rounded-full flex items-center justify-center">
                <Palette className="w-5 h-5 text-ojas-soft-gold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ojas-charcoal-gray">
                  Colorblind Preview
                </h3>
                <p className="text-sm text-ojas-slate-gray">
                  See how the app looks with patterns and shapes
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Live Preview */}
        {(highContrast || largeFonts) && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-4">
              Live Preview
            </h3>
            <div className={`bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6 ${
              highContrast ? 'bg-black text-white border-white' : ''
            } ${largeFonts ? 'text-xl' : ''}`}>
              <h4 className="font-semibold mb-2">Sample Text</h4>
              <p className="mb-4">This is how your text will appear with the current settings.</p>
              <button className={`px-4 py-2 rounded-xl font-medium ${
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
          <h2 className="text-xl font-semibold text-ojas-charcoal-gray mb-4">
            General
          </h2>
          <div className="space-y-3">
            {generalSettings.map(setting => (
              <button
                key={setting.id}
                className="w-full bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6 text-left hover:shadow-ojas-medium transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-ojas-primary-blue/10 rounded-full flex items-center justify-center">
                    <setting.icon className="w-5 h-5 text-ojas-primary-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-ojas-charcoal-gray">
                      {setting.title}
                    </h3>
                    <p className="text-sm text-ojas-slate-gray">
                      {setting.description}
                    </p>
                  </div>
                  <div className="w-5 h-5 border-r-2 border-b-2 border-ojas-charcoal-gray transform -rotate-45"></div>
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
