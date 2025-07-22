
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface HealthState {
  // Health data
  wellnessScore: number;
  lastUpdated: string | null;
  todaysFocus: {
    title: string;
    action: string;
    priority: 'high' | 'medium' | 'low';
  } | null;
  
  // Quick stats
  medicationsPending: number;
  symptomsToday: number;
  vitalsOutOfRange: number;
  
  // Actions
  setWellnessScore: (score: number) => void;
  setTodaysFocus: (focus: HealthState['todaysFocus']) => void;
  setMedicationsPending: (count: number) => void;
  setSymptomsToday: (count: number) => void;
  setVitalsOutOfRange: (count: number) => void;
  updateLastUpdated: () => void;
}

export const useHealthStore = create<HealthState>()(
  devtools(
    (set) => ({
      // Initial state
      wellnessScore: 0,
      lastUpdated: null,
      todaysFocus: null,
      medicationsPending: 0,
      symptomsToday: 0,
      vitalsOutOfRange: 0,
      
      // Actions
      setWellnessScore: (score) => set({ wellnessScore: score }),
      setTodaysFocus: (focus) => set({ todaysFocus: focus }),
      setMedicationsPending: (count) => set({ medicationsPending: count }),
      setSymptomsToday: (count) => set({ symptomsToday: count }),
      setVitalsOutOfRange: (count) => set({ vitalsOutOfRange: count }),
      updateLastUpdated: () => set({ lastUpdated: new Date().toISOString() }),
    }),
    { name: 'HealthStore' }
  )
);
