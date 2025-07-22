
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { useHealthData } from '../hooks/useHealthData';
import { ThemeProvider } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { KeyboardNavigationProvider } from '../components/ui/enhanced-accessibility';
import { GlobalLoadingOverlay } from '../components/ui/optimized-loading';

import HomePage from './HomePage';
import MedicationsPage from './MedicationsPage';
import HealthLogPage from './HealthLogPage';
import MorePage from './MorePage';
import DoctorsHubPage from './DoctorsHubPage';
import EnhancedSettingsPage from './EnhancedSettingsPage';
import ComorbiditiesPage from './ComorbiditiesPage';
import SupportGroupsPage from './SupportGroupsPage';
import EventsPage from './EventsPage';
import Navigation from '../components/Navigation';

const Index = () => {
  const location = useLocation();
  const { user, userProfile } = useAuth();
  
  // Zustand store
  const {
    activeTab,
    currentPage,
    setActiveTab,
    setCurrentPage,
    fontSize,
    highContrast,
  } = useAppStore();

  // Initialize health data
  useHealthData();

  // Handle URL-based routing
  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes('settings')) {
      setCurrentPage('settings');
    } else if (path.includes('doctors')) {
      setCurrentPage('doctors');
    } else if (path.includes('comorbidities')) {
      setCurrentPage('comorbidities');
    } else if (path.includes('support-groups')) {
      setCurrentPage('support-groups');
    } else if (path.includes('events')) {
      setCurrentPage('events');
    } else if (path.includes('more')) {
      setActiveTab('more');
      setCurrentPage('main');
    } else if (path.includes('medications')) {
      setActiveTab('medications');
      setCurrentPage('main');
    } else if (path.includes('health-log')) {
      setActiveTab('health-log');
      setCurrentPage('main');
    } else {
      setActiveTab('home');
      setCurrentPage('main');
    }
  }, [location.pathname, setActiveTab, setCurrentPage]);

  // Navigation handlers
  const handleNavigateToDoctors = () => setCurrentPage('doctors');
  const handleNavigateToSettings = () => setCurrentPage('settings');
  const handleNavigateToComorbidities = () => setCurrentPage('comorbidities');
  const handleNavigateToSupportGroups = () => setCurrentPage('support-groups');
  const handleNavigateToEvents = () => setCurrentPage('events');
  const handleBackToMore = () => {
    setCurrentPage('main');
    setActiveTab('more');
    window.history.pushState({}, '', '/more');
  };

  // Apply accessibility classes
  const accessibilityClasses = {
    'text-sm': fontSize === 'small',
    'text-base': fontSize === 'medium',
    'text-lg': fontSize === 'large',
    'contrast-more': highContrast,
  };

  // Handle special page navigation
  if (currentPage === 'doctors') {
    return (
      <ThemeProvider>
        <KeyboardNavigationProvider>
          <div className={Object.entries(accessibilityClasses).filter(([_, active]) => active).map(([cls]) => cls).join(' ')}>
            <DoctorsHubPage onBack={handleBackToMore} />
            <GlobalLoadingOverlay />
          </div>
        </KeyboardNavigationProvider>
      </ThemeProvider>
    );
  }

  if (currentPage === 'settings') {
    return (
      <ThemeProvider>
        <KeyboardNavigationProvider>
          <div className={Object.entries(accessibilityClasses).filter(([_, active]) => active).map(([cls]) => cls).join(' ')}>
            <EnhancedSettingsPage onBack={handleBackToMore} />
            <GlobalLoadingOverlay />
          </div>
        </KeyboardNavigationProvider>
      </ThemeProvider>
    );
  }

  if (currentPage === 'comorbidities') {
    return (
      <ThemeProvider>
        <KeyboardNavigationProvider>
          <div className={Object.entries(accessibilityClasses).filter(([_, active]) => active).map(([cls]) => cls).join(' ')}>
            <ComorbiditiesPage onBack={handleBackToMore} />
            <GlobalLoadingOverlay />
          </div>
        </KeyboardNavigationProvider>
      </ThemeProvider>
    );
  }

  if (currentPage === 'support-groups') {
    return (
      <ThemeProvider>
        <KeyboardNavigationProvider>
          <div className={Object.entries(accessibilityClasses).filter(([_, active]) => active).map(([cls]) => cls).join(' ')}>
            <SupportGroupsPage />
            <GlobalLoadingOverlay />
          </div>
        </KeyboardNavigationProvider>
      </ThemeProvider>
    );
  }

  if (currentPage === 'events') {
    return (
      <ThemeProvider>
        <KeyboardNavigationProvider>
          <div className={Object.entries(accessibilityClasses).filter(([_, active]) => active).map(([cls]) => cls).join(' ')}>
            <EventsPage />
            <GlobalLoadingOverlay />
          </div>
        </KeyboardNavigationProvider>
      </ThemeProvider>
    );
  }

  const renderCurrentPage = () => {
    const userRole = userProfile?.role as 'patient' | 'caregiver' || 'patient';
    
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'medications':
        return <MedicationsPage userRole={userRole} />;
      case 'health-log':
        return <HealthLogPage userRole={userRole} />;
      case 'more':
        return (
          <MorePage 
            onNavigateToDoctors={handleNavigateToDoctors}
            onNavigateToSettings={handleNavigateToSettings}
            onNavigateToComorbidities={handleNavigateToComorbidities}
            onNavigateToSupportGroups={handleNavigateToSupportGroups}
          />
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <ThemeProvider>
      <KeyboardNavigationProvider>
        <div className={`min-h-screen bg-ojas-bg-light dark:bg-ojas-soft-midnight font-ojas transition-colors duration-300 ${Object.entries(accessibilityClasses).filter(([_, active]) => active).map(([cls]) => cls).join(' ')}`}>
          {renderCurrentPage()}
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          <GlobalLoadingOverlay />
        </div>
      </KeyboardNavigationProvider>
    </ThemeProvider>
  );
};

export default Index;
