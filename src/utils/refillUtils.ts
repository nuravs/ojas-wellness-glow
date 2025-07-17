// Utility functions for medication refill calculations

export interface MedicationWithRefillData {
  id: string;
  name: string;
  next_refill_date?: string;
  pills_remaining?: number;
  daily_consumption?: number;
}

export interface RefillAlert {
  id: string;
  medicationName: string;
  daysLeft: number;
  pillsRemaining: number;
  nextRefillDate: string;
  urgency: 'low' | 'medium' | 'high';
}

/**
 * Calculate days left based on current pill count and consumption rate
 */
export const calculateDaysLeft = (pillsRemaining: number, dailyConsumption: number): number => {
  if (dailyConsumption <= 0) return 0;
  return Math.floor(pillsRemaining / dailyConsumption);
};

/**
 * Determine refill urgency based on days left
 */
export const getRefillUrgency = (daysLeft: number): 'low' | 'medium' | 'high' => {
  if (daysLeft <= 3) return 'high';
  if (daysLeft <= 7) return 'medium';
  return 'low';
};

/**
 * Calculate next refill date based on current pills and consumption
 */
export const calculateNextRefillDate = (
  pillsRemaining: number, 
  dailyConsumption: number
): string => {
  const daysLeft = calculateDaysLeft(pillsRemaining, dailyConsumption);
  const nextRefillDate = new Date();
  nextRefillDate.setDate(nextRefillDate.getDate() + Math.max(0, daysLeft - 2)); // 2 days buffer
  return nextRefillDate.toISOString();
};

/**
 * Generate refill alerts for medications that need attention
 */
export const generateRefillAlerts = (
  medications: MedicationWithRefillData[],
  reminderThreshold: number = 7
): RefillAlert[] => {
  return medications
    .filter(med => {
      if (!med.pills_remaining || !med.daily_consumption) return false;
      const daysLeft = calculateDaysLeft(med.pills_remaining, med.daily_consumption);
      return daysLeft <= reminderThreshold;
    })
    .map(med => {
      const pillsRemaining = med.pills_remaining || 0;
      const dailyConsumption = med.daily_consumption || 1;
      const daysLeft = calculateDaysLeft(pillsRemaining, dailyConsumption);
      const urgency = getRefillUrgency(daysLeft);
      const nextRefillDate = med.next_refill_date || calculateNextRefillDate(pillsRemaining, dailyConsumption);

      return {
        id: med.id,
        medicationName: med.name,
        daysLeft,
        pillsRemaining,
        nextRefillDate,
        urgency
      };
    })
    .sort((a, b) => {
      // Sort by urgency (high -> medium -> low) then by days left
      const urgencyOrder = { high: 0, medium: 1, low: 2 };
      if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      }
      return a.daysLeft - b.daysLeft;
    });
};

/**
 * Update medication refill data when pills are restocked
 */
export const updateMedicationAfterRefill = (
  medication: MedicationWithRefillData,
  newPillCount: number
): Partial<MedicationWithRefillData> => {
  const dailyConsumption = medication.daily_consumption || 1;
  const daysSupply = Math.floor(newPillCount / dailyConsumption);
  const nextRefillDate = new Date();
  nextRefillDate.setDate(nextRefillDate.getDate() + Math.max(0, daysSupply - 7)); // 7 days before running out

  return {
    pills_remaining: newPillCount,
    next_refill_date: nextRefillDate.toISOString()
  };
};