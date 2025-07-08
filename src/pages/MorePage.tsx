
import React, { useState } from 'react';
import { 
  UserCircle, 
  Settings, 
  Stethoscope, 
  HelpCircle, 
  Shield, 
  Phone, 
  Info,
  ChevronRight,
  Activity
} from 'lucide-react';
import SafeAreaContainer from '../components/SafeAreaContainer';

interface MorePageProps {
  onNavigateToDoctors?: () => void;
  onNavigateToSettings?: () => void;
  onNavigateToComorbidities?: () => void;
}

const MorePage: React.FC<MorePageProps> = ({ 
  onNavigateToDoctors, 
  onNavigateToSettings,
  onNavigateToComorbidities
}) => {
  const menuItems = [
    {
      id: 'doctors',
      title: 'My Doctors',
      description: 'Healthcare team and appointments',
      icon: Stethoscope,
      color: 'primary-blue',
      priority: 'high'
    },
    {
      id: 'comorbidities',
      title: 'Health Conditions',
      description: 'Track and manage your health conditions',
      icon: Activity,
      color: 'calming-green',
      priority: 'high'
    },
    {
      id: 'profile',
      title: 'Patient Profile',
      description: 'Personal information and preferences',
      icon: UserCircle,
      color: 'calming-green',
      priority: 'medium'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'App preferences and accessibility',
      icon: Settings,
      color: 'charcoal-gray',
      priority: 'high'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Data protection and security settings',
      icon: Shield,
      color: 'soft-gold',
      priority: 'low'
    },
    {
      id: 'support',
      title: 'Contact Support',
      description: 'Get help when you need it',
      icon: Phone,
      color: 'calming-green',
      priority: 'medium'
    },
    {
      id: 'about',
      title: 'About Ojas',
      description: 'App version and information',
      icon: Info,
      color: 'charcoal-gray',
      priority: 'low'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'calming-green': return 'text-ojas-calming-green bg-ojas-calming-green/10';
      case 'primary-blue': return 'text-ojas-primary-blue bg-ojas-primary-blue/10';
      case 'soft-gold': return 'text-ojas-soft-gold bg-ojas-soft-gold/10';
      case 'charcoal-gray': return 'text-ojas-charcoal-gray bg-ojas-charcoal-gray/10';
      default: return 'text-ojas-charcoal-gray bg-gray-100';
    }
  };

  const handleItemTap = (itemId: string) => {
    switch (itemId) {
      case 'doctors':
        onNavigateToDoctors?.();
        break;
      case 'settings':
        onNavigateToSettings?.();
        break;
      case 'comorbidities':
        onNavigateToComorbidities?.();
        break;
      case 'profile':
        console.log('Navigate to Profile');
        break;
      default:
        console.log(`Navigate to ${itemId}`);
    }
  };

  const priorityItems = menuItems.filter(item => item.priority === 'high');
  const regularItems = menuItems.filter(item => item.priority !== 'high');

  return (
    <div className="min-h-screen bg-ojas-mist-white pb-28">
      <SafeAreaContainer>
        {/* Header with proper spacing */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-ojas-charcoal-gray mb-2">
            More
          </h1>
          <p className="text-ojas-slate-gray text-base">
            Settings, support, and additional features
          </p>
        </div>

        {/* High Priority Items */}
        {priorityItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-ojas-charcoal-gray mb-4">
              Quick Access
            </h2>
            <div className="space-y-3">
              {priorityItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleItemTap(item.id)}
                  className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver hover:shadow-ojas-medium transition-all duration-200 w-full text-left p-6"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${getColorClasses(item.color)} flex items-center justify-center flex-shrink-0`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-1">
                        {item.title}
                      </h3>
                      <p className="text-ojas-slate-gray text-sm">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-ojas-slate-gray" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Regular Items */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-ojas-charcoal-gray mb-4">
            Settings & Support
          </h2>
          <div className="space-y-3">
            {regularItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleItemTap(item.id)}
                className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver hover:shadow-ojas-medium transition-all duration-200 w-full text-left p-6"
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${getColorClasses(item.color)} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-ojas-charcoal-gray mb-1">
                      {item.title}
                    </h3>
                    <p className="text-ojas-slate-gray text-sm">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-ojas-slate-gray" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </SafeAreaContainer>
    </div>
  );
};

export default MorePage;
