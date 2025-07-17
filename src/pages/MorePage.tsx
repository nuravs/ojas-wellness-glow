
import React from 'react';
import { 
  UserCircle, 
  Settings, 
  Stethoscope, 
  HelpCircle, 
  Shield, 
  Phone, 
  Info,
  ChevronRight,
  Users
} from 'lucide-react';
import SafeAreaContainer from '../components/SafeAreaContainer';

interface MorePageProps {
  onNavigateToDoctors?: () => void;
  onNavigateToSettings?: () => void;
  onNavigateToComorbidities?: () => void;
  onNavigateToSupportGroups?: () => void;
}

const MorePage: React.FC<MorePageProps> = ({ 
  onNavigateToDoctors, 
  onNavigateToSettings,
  onNavigateToComorbidities,
  onNavigateToSupportGroups
}) => {
  const menuItems = [
    {
      id: 'doctors',
      title: 'My Doctors',
      icon: Stethoscope,
      onTap: onNavigateToDoctors
    },
    {
      id: 'support-groups',
      title: 'Support Groups',
      icon: Users,
      onTap: onNavigateToSupportGroups
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      onTap: onNavigateToSettings
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
      onTap: () => console.log('Navigate to Privacy & Security')
    },
    {
      id: 'about',
      title: 'About',
      icon: Info,
      onTap: () => console.log('Navigate to About')
    }
  ];

  return (
    <div className="min-h-screen bg-ojas-bg-light pb-28">
      <SafeAreaContainer>
        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <h1 className="text-2xl font-semibold text-ojas-text-main">
            More
          </h1>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-ojas-soft overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={item.onTap}
              className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left ${
                index !== menuItems.length - 1 ? 'border-b border-ojas-border' : ''
              }`}
              style={{ minHeight: '64px' }}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-ojas-bg-light">
                <item.icon className="w-5 h-5 text-ojas-text-secondary" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-ojas-text-main">{item.title}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-ojas-text-secondary" />
            </button>
          ))}
        </div>
      </SafeAreaContainer>
    </div>
  );
};

export default MorePage;
