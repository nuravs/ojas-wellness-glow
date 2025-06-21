
import React from 'react';
import { 
  UserCircle, 
  Settings, 
  Stethoscope, 
  HelpCircle, 
  Shield, 
  Phone, 
  Info,
  ChevronRight 
} from 'lucide-react';

const MorePage: React.FC = () => {
  const menuItems = [
    {
      id: 'doctors',
      title: 'My Doctors',
      description: 'Healthcare team and appointments',
      icon: Stethoscope,
      color: 'wellness-blue',
      priority: 'high'
    },
    {
      id: 'profile',
      title: 'Patient Profile',
      description: 'Personal information and preferences',
      icon: UserCircle,
      color: 'wellness-green',
      priority: 'medium'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'App preferences and notifications',
      icon: Settings,
      color: 'calm-600',
      priority: 'medium'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Data protection and security settings',
      icon: Shield,
      color: 'wellness-yellow',
      priority: 'low'
    },
    {
      id: 'support',
      title: 'Contact Support',
      description: 'Get help when you need it',
      icon: Phone,
      color: 'wellness-green',
      priority: 'medium'
    },
    {
      id: 'about',
      title: 'About Ojas',
      description: 'App version and information',
      icon: Info,
      color: 'calm-600',
      priority: 'low'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'wellness-green': return 'text-wellness-green bg-wellness-green/10';
      case 'wellness-blue': return 'text-wellness-blue bg-wellness-blue/10';
      case 'wellness-yellow': return 'text-wellness-yellow bg-wellness-yellow/10';
      default: return 'text-calm-600 bg-calm-100';
    }
  };

  const handleItemTap = (itemId: string) => {
    switch (itemId) {
      case 'doctors':
        // TODO: Navigate to DoctorsHubScreen
        console.log('Navigate to Doctors Hub');
        break;
      case 'profile':
        console.log('Navigate to Profile');
        break;
      case 'settings':
        console.log('Navigate to Settings');
        break;
      default:
        console.log(`Navigate to ${itemId}`);
    }
  };

  const priorityItems = menuItems.filter(item => item.priority === 'high');
  const regularItems = menuItems.filter(item => item.priority !== 'high');

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-calm-800 mb-2">
            More
          </h1>
          <p className="text-calm-600 text-lg">
            Settings, support, and additional features
          </p>
        </div>

        {/* High Priority Items */}
        {priorityItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-calm-800 mb-4">
              Quick Access
            </h2>
            <div className="space-y-3">
              {priorityItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleItemTap(item.id)}
                  className="ojas-card hover:shadow-md transition-all duration-200 w-full text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${getColorClasses(item.color)} flex items-center justify-center flex-shrink-0`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-calm-800 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-calm-600 text-sm">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-calm-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Regular Items */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-calm-800 mb-4">
            Settings & Support
          </h2>
          <div className="space-y-3">
            {regularItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleItemTap(item.id)}
                className="ojas-card hover:shadow-md transition-all duration-200 w-full text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${getColorClasses(item.color)} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-calm-800 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-calm-600 text-sm">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-calm-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MorePage;
