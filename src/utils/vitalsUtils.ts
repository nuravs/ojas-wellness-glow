
export interface VitalReading {
  systolic?: number;
  diastolic?: number;
  value?: number;
  unit?: string;
}

export const VITAL_RANGES = {
  blood_pressure: {
    optimal: { systolic: [90, 120], diastolic: [60, 80] },
    normal: { systolic: [120, 130], diastolic: [80, 85] },
    high_normal: { systolic: [130, 140], diastolic: [85, 90] },
    high: { systolic: [140, 999], diastolic: [90, 999] }
  },
  blood_sugar: {
    normal_fasting: { min: 70, max: 100 },
    prediabetic_fasting: { min: 100, max: 126 },
    diabetic_fasting: { min: 126, max: 999 },
    normal_random: { min: 70, max: 140 },
    high_random: { min: 140, max: 999 }
  },
  pulse: {
    normal: { min: 60, max: 100 },
    low: { min: 0, max: 60 },
    high: { min: 100, max: 999 }
  },
  temperature: {
    normal_celsius: { min: 35.0, max: 37.5 },
    low_celsius: { min: 32.0, max: 35.0 },
    fever_celsius: { min: 37.5, max: 42.0 },
    normal_fahrenheit: { min: 95.0, max: 99.5 },
    low_fahrenheit: { min: 89.6, max: 95.0 },
    fever_fahrenheit: { min: 99.5, max: 107.6 }
  },
  weight: {
    // Weight ranges are highly individual, using very broad ranges
    normal: { min: 25, max: 500 } // kg - very permissive range
  }
};

export const isOutOfRange = (
  vitalType: string,
  values: VitalReading
): boolean => {
  switch (vitalType) {
    case 'blood_pressure':
      if (!values.systolic || !values.diastolic) return false;
      const bpRanges = VITAL_RANGES.blood_pressure;
      return (
        values.systolic < 80 || values.systolic > 200 ||
        values.diastolic < 50 || values.diastolic > 120
      );

    case 'blood_sugar':
      if (!values.value) return false;
      // Allow wide range for blood sugar (40-400 mg/dL)
      return values.value < 40 || values.value > 400;

    case 'pulse':
      if (!values.value) return false;
      // Allow wide range for pulse (30-200 bpm)
      return values.value < 30 || values.value > 200;

    case 'temperature':
      if (!values.value) return false;
      // Detect unit and validate accordingly
      const isFahrenheit = values.unit === '°F' || values.unit === 'F' || 
                          (values.value > 50 && !values.unit?.includes('C'));
      
      if (isFahrenheit) {
        // Fahrenheit range: 89.6°F to 107.6°F (very permissive)
        return values.value < 89.6 || values.value > 107.6;
      } else {
        // Celsius range: 32°C to 42°C (very permissive)
        return values.value < 32.0 || values.value > 42.0;
      }

    case 'weight':
      if (!values.value) return false;
      // Very permissive weight range
      return values.value < 25 || values.value > 500;

    default:
      return false;
  }
};

export const getVitalRangeStatus = (
  vitalType: string,
  values: VitalReading
): 'optimal' | 'normal' | 'attention' | 'urgent' => {
  switch (vitalType) {
    case 'blood_pressure':
      if (!values.systolic || !values.diastolic) return 'normal';
      const bpRanges = VITAL_RANGES.blood_pressure;
      
      if (
        values.systolic >= bpRanges.optimal.systolic[0] &&
        values.systolic <= bpRanges.optimal.systolic[1] &&
        values.diastolic >= bpRanges.optimal.diastolic[0] &&
        values.diastolic <= bpRanges.optimal.diastolic[1]
      ) {
        return 'optimal';
      } else if (
        values.systolic <= bpRanges.normal.systolic[1] &&
        values.diastolic <= bpRanges.normal.diastolic[1]
      ) {
        return 'normal';
      } else if (
        values.systolic <= bpRanges.high_normal.systolic[1] &&
        values.diastolic <= bpRanges.high_normal.diastolic[1]
      ) {
        return 'attention';
      } else {
        return 'urgent';
      }

    case 'blood_sugar':
      if (!values.value) return 'normal';
      const bsRanges = VITAL_RANGES.blood_sugar;
      
      if (values.value <= bsRanges.normal_fasting.max) {
        return 'optimal';
      } else if (values.value <= bsRanges.prediabetic_fasting.max) {
        return 'attention';
      } else {
        return 'urgent';
      }

    case 'pulse':
      if (!values.value) return 'normal';
      const pulseRanges = VITAL_RANGES.pulse;
      
      if (
        values.value >= pulseRanges.normal.min &&
        values.value <= pulseRanges.normal.max
      ) {
        return 'optimal';
      } else {
        return 'attention';
      }

    case 'temperature':
      if (!values.value) return 'normal';
      const isFahrenheit = values.unit === '°F' || values.unit === 'F' || 
                          (values.value > 50 && !values.unit?.includes('C'));
      const tempRanges = isFahrenheit 
        ? VITAL_RANGES.temperature.normal_fahrenheit 
        : VITAL_RANGES.temperature.normal_celsius;
      
      if (
        values.value >= tempRanges.min &&
        values.value <= tempRanges.max
      ) {
        return 'optimal';
      } else {
        return 'attention';
      }

    case 'weight':
      // Weight is highly individual, so we're more lenient
      return 'normal';

    default:
      return 'normal';
  }
};

export const formatVitalValue = (vitalType: string, values: VitalReading): string => {
  switch (vitalType) {
    case 'blood_pressure':
      return `${values.systolic}/${values.diastolic} mmHg`;
    case 'blood_sugar':
      return `${values.value} ${values.unit || 'mg/dL'}`;
    case 'pulse':
      return `${values.value} bpm`;
    case 'temperature':
      return `${values.value}${values.unit || '°F'}`;
    case 'weight':
      return `${values.value} ${values.unit || 'kg'}`;
    default:
      return `${values.value}`;
  }
};
