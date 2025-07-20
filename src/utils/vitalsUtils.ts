
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
    normal_celsius: { min: 36.1, max: 37.2 },
    low_celsius: { min: 0, max: 36.1 },
    fever_celsius: { min: 37.2, max: 50 },
    normal_fahrenheit: { min: 97.0, max: 99.0 },
    low_fahrenheit: { min: 0, max: 97.0 },
    fever_fahrenheit: { min: 99.0, max: 110 }
  },
  weight: {
    // Weight ranges are highly individual, so we use very broad ranges
    normal: { min: 30, max: 300 } // kg
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
        values.systolic < bpRanges.optimal.systolic[0] ||
        values.systolic > bpRanges.high.systolic[1] ||
        values.diastolic < bpRanges.optimal.diastolic[0] ||
        values.diastolic > bpRanges.high.diastolic[1]
      );

    case 'blood_sugar':
      if (!values.value) return false;
      const bsRanges = VITAL_RANGES.blood_sugar;
      return (
        values.value < bsRanges.normal_fasting.min ||
        values.value > bsRanges.diabetic_fasting.max
      );

    case 'pulse':
      if (!values.value) return false;
      const pulseRanges = VITAL_RANGES.pulse;
      return (
        values.value < pulseRanges.normal.min ||
        values.value > pulseRanges.normal.max
      );

    case 'temperature':
      if (!values.value) return false;
      // Check if it's Celsius or Fahrenheit based on unit or value range
      const isFahrenheit = values.unit === '°F' || (values.value > 50);
      const tempRanges = isFahrenheit 
        ? VITAL_RANGES.temperature.normal_fahrenheit 
        : VITAL_RANGES.temperature.normal_celsius;
      
      return (
        values.value < tempRanges.min ||
        values.value > tempRanges.max
      );

    case 'weight':
      if (!values.value) return false;
      const weightRanges = VITAL_RANGES.weight;
      return (
        values.value < weightRanges.normal.min ||
        values.value > weightRanges.normal.max
      );

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
      const isFahrenheit = values.unit === '°F' || (values.value > 50);
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
