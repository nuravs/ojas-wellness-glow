export interface VitalRange {
  optimal?: { min: number; max: number };
  normal: { min: number; max: number };
  attention: { min: number; max: number };
  high: { min: number; max: number };
}

export interface VitalRanges {
  [key: string]: VitalRange;
}

// Age-adjusted and condition-specific vital ranges
export const VITAL_RANGES: VitalRanges = {
  blood_pressure: {
    optimal: { min: 90, max: 120 }, // Systolic
    normal: { min: 120, max: 130 },
    attention: { min: 130, max: 140 },
    high: { min: 140, max: 200 }
  },
  blood_sugar: {
    optimal: { min: 70, max: 100 }, // Fasting glucose
    normal: { min: 100, max: 125 },
    attention: { min: 125, max: 140 },
    high: { min: 140, max: 400 }
  },
  pulse: {
    optimal: { min: 60, max: 80 },
    normal: { min: 50, max: 100 },
    attention: { min: 100, max: 120 },
    high: { min: 120, max: 200 }
  },
  weight: {
    // Weight ranges are more personalized - these are general guidelines
    normal: { min: 40, max: 150 }, // kg
    attention: { min: 30, max: 200 },
    high: { min: 200, max: 300 }
  },
  temperature: {
    optimal: { min: 36.1, max: 37.2 }, // Celsius
    normal: { min: 35.5, max: 37.5 },
    attention: { min: 37.5, max: 38.5 },
    high: { min: 38.5, max: 42 }
  }
};

// Condition-specific adjustments
export const CONDITION_ADJUSTMENTS = {
  hypertension: {
    blood_pressure: {
      optimal: { min: 90, max: 115 }, // Stricter for hypertensive patients
      normal: { min: 115, max: 125 },
      attention: { min: 125, max: 135 },
      high: { min: 135, max: 200 }
    }
  },
  diabetes: {
    blood_sugar: {
      optimal: { min: 80, max: 110 }, // Stricter for diabetic patients
      normal: { min: 110, max: 130 },
      attention: { min: 130, max: 150 },
      high: { min: 150, max: 400 }
    }
  },
  'heart disease': {
    pulse: {
      optimal: { min: 55, max: 75 },
      normal: { min: 50, max: 90 },
      attention: { min: 90, max: 110 },
      high: { min: 110, max: 200 }
    }
  }
};

export interface VitalReading {
  systolic?: number;
  diastolic?: number;
  value?: number;
  unit?: string;
}

export interface MedicalSignificance {
  level: 'normal' | 'mild' | 'moderate' | 'severe' | 'critical';
  message: string;
  recommendations: string[];
  urgency: 'none' | 'routine' | 'soon' | 'urgent' | 'emergency';
}

/**
 * Check if a vital reading is out of normal range
 */
export function isOutOfRange(
  vitalType: string, 
  reading: VitalReading, 
  userConditions: string[] = [],
  userAge?: number
): boolean {
  const adjustedRanges = getAdjustedRanges(vitalType, userConditions, userAge);
  const value = getVitalValue(vitalType, reading);
  
  if (value === null) return false;
  
  return value < adjustedRanges.normal.min || value > adjustedRanges.high.max;
}

/**
 * Get the primary value from a vital reading
 */
export function getVitalValue(vitalType: string, reading: VitalReading): number | null {
  switch (vitalType) {
    case 'blood_pressure':
      return reading.systolic || null;
    case 'blood_sugar':
    case 'pulse':
    case 'weight':
    case 'temperature':
      return reading.value || null;
    default:
      return null;
  }
}

/**
 * Get range status for a vital reading
 */
export function getVitalRangeStatus(
  vitalType: string, 
  reading: VitalReading, 
  userConditions: string[] = [],
  userAge?: number
): 'optimal' | 'normal' | 'attention' | 'high' | 'low' {
  const adjustedRanges = getAdjustedRanges(vitalType, userConditions, userAge);
  const value = getVitalValue(vitalType, reading);
  
  if (value === null) return 'normal';
  
  if (adjustedRanges.optimal && value >= adjustedRanges.optimal.min && value <= adjustedRanges.optimal.max) {
    return 'optimal';
  }
  
  if (value >= adjustedRanges.normal.min && value <= adjustedRanges.normal.max) {
    return 'normal';
  }
  
  if (value >= adjustedRanges.attention.min && value <= adjustedRanges.attention.max) {
    return 'attention';
  }
  
  if (value >= adjustedRanges.high.min && value <= adjustedRanges.high.max) {
    return 'high';
  }
  
  if (value < adjustedRanges.normal.min) {
    return 'low';
  }
  
  return 'high';
}

/**
 * Get adjusted ranges based on user conditions and age
 */
export function getAdjustedRanges(
  vitalType: string, 
  userConditions: string[] = [],
  userAge?: number
): VitalRange {
  let baseRanges = VITAL_RANGES[vitalType];
  
  if (!baseRanges) {
    return {
      normal: { min: 0, max: 1000 },
      attention: { min: 1000, max: 2000 },
      high: { min: 2000, max: 3000 }
    };
  }
  
  // Apply condition-specific adjustments
  for (const condition of userConditions) {
    const adjustment = CONDITION_ADJUSTMENTS[condition.toLowerCase() as keyof typeof CONDITION_ADJUSTMENTS];
    if (adjustment && adjustment[vitalType as keyof typeof adjustment]) {
      baseRanges = adjustment[vitalType as keyof typeof adjustment] as VitalRange;
      break;
    }
  }
  
  // Apply age adjustments (simplified - in real app would be more comprehensive)
  if (userAge && userAge >= 65) {
    if (vitalType === 'blood_pressure') {
      baseRanges = {
        ...baseRanges,
        normal: { min: baseRanges.normal.min, max: baseRanges.normal.max + 10 }
      };
    }
  }
  
  return baseRanges;
}

/**
 * Assess medical significance of a vital reading
 */
export function assessMedicalSignificance(
  vitalType: string, 
  reading: VitalReading, 
  userConditions: string[] = [],
  userAge?: number
): MedicalSignificance {
  const status = getVitalRangeStatus(vitalType, reading, userConditions, userAge);
  const value = getVitalValue(vitalType, reading);
  
  switch (status) {
    case 'optimal':
      return {
        level: 'normal',
        message: 'Excellent reading within optimal range',
        recommendations: ['Continue current health routine'],
        urgency: 'none'
      };
      
    case 'normal':
      return {
        level: 'normal',
        message: 'Reading within normal range',
        recommendations: ['Maintain current lifestyle'],
        urgency: 'none'
      };
      
    case 'attention':
      return {
        level: 'mild',
        message: 'Reading slightly elevated - monitor closely',
        recommendations: [
          'Track readings more frequently',
          'Consider lifestyle modifications',
          'Discuss with healthcare provider if trend continues'
        ],
        urgency: 'routine'
      };
      
    case 'high':
      return {
        level: getCriticalityLevel(vitalType, value),
        message: 'Reading significantly elevated',
        recommendations: [
          'Contact healthcare provider',
          'Continue monitoring',
          'Review medications with doctor'
        ],
        urgency: value && isCriticalValue(vitalType, value) ? 'urgent' : 'soon'
      };
      
    case 'low':
      return {
        level: 'moderate',
        message: 'Reading below normal range',
        recommendations: [
          'Monitor for symptoms',
          'Consult healthcare provider',
          'Review current medications'
        ],
        urgency: value && isCriticallyLow(vitalType, value) ? 'urgent' : 'soon'
      };
      
    default:
      return {
        level: 'normal',
        message: 'Unable to assess reading',
        recommendations: ['Retake measurement'],
        urgency: 'none'
      };
  }
}

/**
 * Determine criticality level based on how far outside normal range
 */
function getCriticalityLevel(vitalType: string, value: number | null): 'mild' | 'moderate' | 'severe' | 'critical' {
  if (!value) return 'mild';
  
  const ranges = VITAL_RANGES[vitalType];
  if (!ranges) return 'mild';
  
  const deviationRatio = value / ranges.normal.max;
  
  if (deviationRatio > 2) return 'critical';
  if (deviationRatio > 1.5) return 'severe';
  if (deviationRatio > 1.2) return 'moderate';
  return 'mild';
}

/**
 * Check if value is critically high
 */
function isCriticalValue(vitalType: string, value: number): boolean {
  switch (vitalType) {
    case 'blood_pressure':
      return value > 180; // Hypertensive crisis
    case 'blood_sugar':
      return value > 250; // Severe hyperglycemia
    case 'pulse':
      return value > 150 || value < 40; // Severe tachycardia or bradycardia
    case 'temperature':
      return value > 39.5; // High fever
    default:
      return false;
  }
}

/**
 * Check if value is critically low
 */
function isCriticallyLow(vitalType: string, value: number): boolean {
  switch (vitalType) {
    case 'blood_pressure':
      return value < 70; // Severe hypotension
    case 'blood_sugar':
      return value < 50; // Severe hypoglycemia
    case 'pulse':
      return value < 40; // Severe bradycardia
    case 'temperature':
      return value < 35; // Hypothermia
    default:
      return false;
  }
}

/**
 * Format vital reading for display
 */
export function formatVitalReading(vitalType: string, reading: VitalReading): string {
  switch (vitalType) {
    case 'blood_pressure':
      return `${reading.systolic || 0}/${reading.diastolic || 0} mmHg`;
    case 'blood_sugar':
      return `${reading.value || 0} mg/dL`;
    case 'pulse':
      return `${reading.value || 0} bpm`;
    case 'weight':
      return `${reading.value || 0} ${reading.unit || 'kg'}`;
    case 'temperature':
      return `${reading.value || 0}°${reading.unit || 'C'}`;
    default:
      return `${reading.value || 0}`;
  }
}

/**
 * Get appropriate color for vital status
 */
export function getVitalStatusColor(status: string): string {
  switch (status) {
    case 'optimal':
      return 'text-ojas-success';
    case 'normal':
      return 'text-ojas-text-main';
    case 'attention':
      return 'text-ojas-alert';
    case 'high':
    case 'low':
      return 'text-ojas-error';
    default:
      return 'text-ojas-text-secondary';
  }
}

/**
 * Get background color for vital status
 */
export function getVitalStatusBgColor(status: string): string {
  switch (status) {
    case 'optimal':
      return 'bg-ojas-success/10';
    case 'normal':
      return 'bg-ojas-primary/10';
    case 'attention':
      return 'bg-ojas-alert/10';
    case 'high':
    case 'low':
      return 'bg-ojas-error/10';
    default:
      return 'bg-gray-100';
  }
}