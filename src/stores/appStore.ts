
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AppState {
  // UI State
  activeTab: 'home' | 'medications' | 'health-log' | 'more';
  currentPage: 'main' | 'doctors' | 'settings' | 'comorbidities' | 'support-groups' | 'events';
  isLoading: boolean;
  error: string | null;
  
  // User preferences
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  
  // Actions
  setActiveTab: (tab: AppState['activeTab']) => void;
  setCurrentPage: (page: AppState['currentPage']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTheme: (theme: AppState['theme']) => void;
  setFontSize: (size: AppState['fontSize']) => void;
  setHighContrast: (enabled: boolean) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        activeTab: 'home',
        currentPage: 'main',
        isLoading: false,
        error: null,
        theme: 'system',
        fontSize: 'medium',
        highContrast: false,
        
        // Actions
        setActiveTab: (tab) => set({ activeTab: tab }),
        setCurrentPage: (page) => set({ currentPage: page }),
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        setTheme: (theme) => set({ theme }),
        setFontSize: (size) => set({ fontSize: size }),
        setHighContrast: (enabled) => set({ highContrast: enabled }),
        clearError: () => set({ error: null }),
      }),
      {
        name: 'ojas-app-store',
        partialize: (state) => ({
          theme: state.theme,
          fontSize: state.fontSize,
          highContrast: state.highContrast,
        }),
      }
    ),
    { name: 'AppStore' }
  )
);
