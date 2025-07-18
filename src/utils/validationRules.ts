
// Common validation rules for forms across the app

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

// Medication validation
export const validateMedicationName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, message: 'Medication name is required' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: 'Medication name must be at least 2 characters' };
  }
  return { isValid: true, message: '' };
};

export const validateDosage = (dosage: string): ValidationResult => {
  if (!dosage || dosage.trim().length === 0) {
    return { isValid: false, message: 'Dosage is required' };
  }
  const dosagePattern = /^\d+(\.\d+)?\s*(mg|ml|g|tablets?|pills?|units?|drops?)/i;
  if (!dosagePattern.test(dosage.trim())) {
    return { isValid: false, message: 'Dosage must include amount and unit (e.g., "25mg", "2 tablets")' };
  }
  return { isValid: true, message: '' };
};

export const validatePillCount = (count: string | number): ValidationResult => {
  const numCount = typeof count === 'string' ? parseInt(count) : count;
  if (isNaN(numCount) || numCount <= 0) {
    return { isValid: false, message: 'Pill count must be a positive number' };
  }
  if (numCount > 1000) {
    return { isValid: false, message: 'Pill count seems unusually high (max 1000)' };
  }
  return { isValid: true, message: '' };
};

// Symptom validation
export const validateSeverity = (severity: number): ValidationResult => {
  if (severity < 1 || severity > 10) {
    return { isValid: false, message: 'Severity must be between 1 and 10' };
  }
  return { isValid: true, message: '' };
};

export const validateSymptomNotes = (notes: string): ValidationResult => {
  if (notes && notes.length > 500) {
    return { isValid: false, message: 'Notes must be less than 500 characters' };
  }
  return { isValid: true, message: '' };
};

// Vitals validation
export const validateBloodPressure = (systolic: number, diastolic: number): ValidationResult => {
  if (systolic < 50 || systolic > 300) {
    return { isValid: false, message: 'Systolic pressure must be between 50-300 mmHg' };
  }
  if (diastolic < 30 || diastolic > 200) {
    return { isValid: false, message: 'Diastolic pressure must be between 30-200 mmHg' };
  }
  if (systolic <= diastolic) {
    return { isValid: false, message: 'Systolic pressure must be higher than diastolic' };
  }
  return { isValid: true, message: '' };
};

export const validateHeartRate = (heartRate: number): ValidationResult => {
  if (heartRate < 30 || heartRate > 200) {
    return { isValid: false, message: 'Heart rate must be between 30-200 bpm' };
  }
  return { isValid: true, message: '' };
};

export const validateBloodSugar = (bloodSugar: number): ValidationResult => {
  if (bloodSugar < 20 || bloodSugar > 600) {
    return { isValid: false, message: 'Blood sugar must be between 20-600 mg/dL' };
  }
  return { isValid: true, message: '' };
};

export const validateWeight = (weight: number): ValidationResult => {
  if (weight < 50 || weight > 500) {
    return { isValid: false, message: 'Weight must be between 50-500 lbs' };
  }
  return { isValid: true, message: '' };
};

// General validation helpers
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value || value.trim().length === 0) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true, message: '' };
};

export const validateEmail = (email: string): ValidationResult => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, message: '' };
};

export const validatePhone = (phone: string): ValidationResult => {
  const phonePattern = /^\+?[\d\s\-\(\)]{10,}$/;
  if (!phonePattern.test(phone)) {
    return { isValid: false, message: 'Please enter a valid phone number' };
  }
  return { isValid: true, message: '' };
};
