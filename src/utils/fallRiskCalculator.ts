import { Vital } from '@/hooks/useVitals';
import { Symptom } from '@/hooks/useSymptoms';

export interface FallRiskFactors {
  bloodPressureChanges: number; // Recent drops or irregularities
  neurologicalSymptoms: number; // Balance, coordination, dizziness
  medicationChanges: number; // Recent medication adjustments
  mobilityIssues: number; // Walking difficulties, weakness
  cognitiveImpairment: number; // Confusion, disorientation
}

export interface FallRiskAssessment {
  score: number; // 0-100 scale
  level: 'low' | 'moderate' | 'high' | 'critical';
  factors: FallRiskFactors;
  recommendations: string[];
  alertMessage?: string;
}

// Fall risk symptoms that indicate increased risk
const HIGH_RISK_SYMPTOMS = [
  'dizziness', 'balance_issues', 'coordination_problems', 
  'weakness', 'confusion', 'disorientation', 'walking_difficulty',
  'tremor', 'stiffness', 'fatigue'
];

export const calculateFallRisk = (
  vitals: Vital[],
  symptoms: Symptom[],
  recentMedicationChanges: number = 0
): FallRiskAssessment => {
  const factors: FallRiskFactors = {
    bloodPressureChanges: assessBloodPressureRisk(vitals),
    neurologicalSymptoms: assessNeurologicalSymptoms(symptoms),
    medicationChanges: recentMedicationChanges * 15, // 15 points per medication change
    mobilityIssues: assessMobilityIssues(symptoms),
    cognitiveImpairment: assessCognitiveImpairment(symptoms)
  };

  const totalScore = Math.min(100, 
    factors.bloodPressureChanges + 
    factors.neurologicalSymptoms + 
    factors.medicationChanges + 
    factors.mobilityIssues + 
    factors.cognitiveImpairment
  );

  const level = getFallRiskLevel(totalScore);
  const recommendations = generateFallRiskRecommendations(factors, level);
  const alertMessage = generateAlertMessage(level, factors);

  return {
    score: totalScore,
    level,
    factors,
    recommendations,
    alertMessage
  };
};

const assessBloodPressureRisk = (vitals: Vital[]): number => {
  const recentBP = vitals
    .filter(v => v.vital_type === 'blood_pressure')
    .slice(0, 5); // Last 5 readings

  if (recentBP.length < 2) return 0;

  let riskScore = 0;
  
  recentBP.forEach(vital => {
    const { systolic, diastolic } = vital.values as { systolic: number; diastolic: number };
    
    // Hypotension risk (systolic < 90 or diastolic < 60)
    if (systolic < 90 || diastolic < 60) {
      riskScore += 20;
    }
    
    // Severe hypertension risk (systolic > 180 or diastolic > 110)
    if (systolic > 180 || diastolic > 110) {
      riskScore += 15;
    }
    
    // Out of range indicator
    if (vital.out_of_range) {
      riskScore += 10;
    }
  });

  // Check for rapid changes between readings
  if (recentBP.length >= 2) {
    const latest = recentBP[0].values as { systolic: number; diastolic: number };
    const previous = recentBP[1].values as { systolic: number; diastolic: number };
    
    const systolicChange = Math.abs(latest.systolic - previous.systolic);
    const diastolicChange = Math.abs(latest.diastolic - previous.diastolic);
    
    if (systolicChange > 20 || diastolicChange > 10) {
      riskScore += 15; // Rapid BP changes increase fall risk
    }
  }

  return Math.min(30, riskScore); // Cap at 30 points
};

const assessNeurologicalSymptoms = (symptoms: Symptom[]): number => {
  const recentSymptoms = symptoms.filter(s => {
    const loggedAt = new Date(s.logged_at || s.id);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return loggedAt > weekAgo;
  });

  let riskScore = 0;

  recentSymptoms.forEach(symptom => {
    if (HIGH_RISK_SYMPTOMS.includes(symptom.symptom_type)) {
      const severity = symptom.severity || 1;
      riskScore += severity * 5; // 5 points per severity level
    }
  });

  return Math.min(35, riskScore); // Cap at 35 points
};

const assessMobilityIssues = (symptoms: Symptom[]): number => {
  const mobilitySymptoms = ['walking_difficulty', 'weakness', 'stiffness', 'tremor'];
  const recentMobilityIssues = symptoms.filter(s => {
    const loggedAt = new Date(s.logged_at || s.id);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return loggedAt > weekAgo && mobilitySymptoms.includes(s.symptom_type);
  });

  let riskScore = 0;
  recentMobilityIssues.forEach(symptom => {
    const severity = symptom.severity || 1;
    riskScore += severity * 7; // Higher weight for mobility issues
  });

  return Math.min(20, riskScore); // Cap at 20 points
};

const assessCognitiveImpairment = (symptoms: Symptom[]): number => {
  const cognitiveSymptoms = ['confusion', 'disorientation', 'memory_issues'];
  const recentCognitiveIssues = symptoms.filter(s => {
    const loggedAt = new Date(s.logged_at || s.id);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return loggedAt > weekAgo && cognitiveSymptoms.includes(s.symptom_type);
  });

  let riskScore = 0;
  recentCognitiveIssues.forEach(symptom => {
    const severity = symptom.severity || 1;
    riskScore += severity * 6;
  });

  return Math.min(15, riskScore); // Cap at 15 points
};

const getFallRiskLevel = (score: number): 'low' | 'moderate' | 'high' | 'critical' => {
  if (score >= 70) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'moderate';
  return 'low';
};

const generateFallRiskRecommendations = (
  factors: FallRiskFactors, 
  level: string
): string[] => {
  const recommendations: string[] = [];

  if (factors.bloodPressureChanges > 15) {
    recommendations.push("Monitor blood pressure regularly and speak with your doctor about recent changes");
    recommendations.push("Rise slowly from sitting or lying positions to prevent dizziness");
  }

  if (factors.neurologicalSymptoms > 20) {
    recommendations.push("Use assistive devices like a cane or walker when moving around");
    recommendations.push("Ensure adequate lighting in all areas of your home");
  }

  if (factors.medicationChanges > 10) {
    recommendations.push("Review new medications with your doctor for side effects that may affect balance");
    recommendations.push("Have someone check on you more frequently during medication adjustments");
  }

  if (factors.mobilityIssues > 10) {
    recommendations.push("Consider physical therapy to improve strength and balance");
    recommendations.push("Remove trip hazards like loose rugs and clutter from walkways");
  }

  if (factors.cognitiveImpairment > 8) {
    recommendations.push("Have a caregiver assist with daily activities when confusion occurs");
    recommendations.push("Use medication reminders and safety alerts");
  }

  if (level === 'critical' || level === 'high') {
    recommendations.push("Consider wearing a fall detection device or emergency alert system");
    recommendations.push("Schedule an urgent consultation with your healthcare provider");
  }

  return recommendations;
};

const generateAlertMessage = (
  level: string, 
  factors: FallRiskFactors
): string | undefined => {
  if (level === 'critical') {
    return "Critical fall risk detected. Please contact your healthcare provider immediately and consider having someone stay with you.";
  }
  
  if (level === 'high') {
    if (factors.medicationChanges > 15 && factors.neurologicalSymptoms > 15) {
      return "Your recent medication changes combined with neurological symptoms may significantly increase your fall risk. Please be extra cautious.";
    }
    return "High fall risk identified. Please review safety recommendations and consider additional precautions.";
  }

  if (level === 'moderate' && factors.bloodPressureChanges > 20) {
    return "Recent blood pressure changes may affect your balance. Please move carefully and rise slowly.";
  }

  return undefined;
};