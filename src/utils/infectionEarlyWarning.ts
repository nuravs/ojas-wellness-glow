import { Vital } from '@/hooks/useVitals';
import { Symptom } from '@/hooks/useSymptoms';

export interface InfectionRiskFactors {
  temperatureElevation: number;
  pulseAbnormalities: number;
  symptomCombinations: number;
  rapidChanges: number;
}

export interface InfectionWarning {
  riskLevel: 'low' | 'moderate' | 'high' | 'urgent';
  score: number;
  factors: InfectionRiskFactors;
  recommendations: string[];
  alertMessage?: string;
  symptomsToMonitor: string[];
}

// Infection-related symptoms
const INFECTION_SYMPTOMS = [
  'fever', 'chills', 'fatigue', 'weakness', 'nausea', 
  'loss_of_appetite', 'confusion', 'rapid_breathing',
  'chest_pain', 'cough', 'urinary_issues', 'headache'
];

export const assessInfectionRisk = (
  vitals: Vital[],
  symptoms: Symptom[]
): InfectionWarning => {
  const factors: InfectionRiskFactors = {
    temperatureElevation: assessTemperatureRisk(vitals),
    pulseAbnormalities: assessPulseAbnormalities(vitals),
    symptomCombinations: assessInfectionSymptoms(symptoms),
    rapidChanges: assessRapidVitalChanges(vitals)
  };

  const totalScore = Math.min(100,
    factors.temperatureElevation +
    factors.pulseAbnormalities +
    factors.symptomCombinations +
    factors.rapidChanges
  );

  const riskLevel = getInfectionRiskLevel(totalScore);
  const recommendations = generateInfectionRecommendations(factors, riskLevel);
  const alertMessage = generateInfectionAlert(riskLevel, factors);
  const symptomsToMonitor = getSymptomsToMonitor(factors);

  return {
    riskLevel,
    score: totalScore,
    factors,
    recommendations,
    alertMessage,
    symptomsToMonitor
  };
};

const assessTemperatureRisk = (vitals: Vital[]): number => {
  const recentTemps = vitals
    .filter(v => v.vital_type === 'temperature')
    .slice(0, 5)
    .sort((a, b) => new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime());

  if (recentTemps.length === 0) return 0;

  let riskScore = 0;
  const latestTemp = recentTemps[0].values as { value: number; unit: string };
  
  // Convert to Fahrenheit if needed
  const tempF = latestTemp.unit === 'C' ? (latestTemp.value * 9/5) + 32 : latestTemp.value;

  // Temperature-based scoring
  if (tempF >= 103) { // High fever
    riskScore += 40;
  } else if (tempF >= 101) { // Moderate fever
    riskScore += 25;
  } else if (tempF >= 99.5) { // Low-grade fever
    riskScore += 15;
  } else if (tempF <= 95) { // Hypothermia risk
    riskScore += 30;
  }

  // Check for temperature trends
  if (recentTemps.length >= 2) {
    const trend = calculateTemperatureTrend(recentTemps);
    if (trend === 'rising' && tempF > 99) {
      riskScore += 10; // Rising fever is concerning
    }
  }

  return Math.min(50, riskScore); // Cap at 50 points
};

const assessPulseAbnormalities = (vitals: Vital[]): number => {
  const recentPulse = vitals
    .filter(v => v.vital_type === 'pulse')
    .slice(0, 5)
    .sort((a, b) => new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime());

  if (recentPulse.length === 0) return 0;

  let riskScore = 0;
  const latestPulse = recentPulse[0].values as { value: number };
  const pulseRate = latestPulse.value;

  // Tachycardia (often accompanies infection)
  if (pulseRate > 120) {
    riskScore += 20;
  } else if (pulseRate > 100) {
    riskScore += 10;
  }

  // Bradycardia in context of other symptoms can be concerning
  if (pulseRate < 50) {
    riskScore += 15;
  }

  // Check for pulse trend with temperature
  const recentTemps = vitals.filter(v => v.vital_type === 'temperature').slice(0, 3);
  if (recentTemps.length > 0 && pulseRate > 100) {
    const latestTemp = recentTemps[0].values as { value: number; unit: string };
    const tempF = latestTemp.unit === 'C' ? (latestTemp.value * 9/5) + 32 : latestTemp.value;
    
    if (tempF > 99.5) {
      riskScore += 15; // Fever + tachycardia is significant
    }
  }

  return Math.min(30, riskScore); // Cap at 30 points
};

const assessInfectionSymptoms = (symptoms: Symptom[]): number => {
  const recentSymptoms = symptoms.filter(s => {
    const loggedAt = new Date(s.logged_at || s.id);
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    return loggedAt > threeDaysAgo;
  });

  const infectionSymptoms = recentSymptoms.filter(s => 
    INFECTION_SYMPTOMS.includes(s.symptom_type)
  );

  let riskScore = 0;

  // Score based on number and severity of infection-related symptoms
  infectionSymptoms.forEach(symptom => {
    const severity = symptom.severity || 1;
    riskScore += severity * 3;
  });

  // Bonus for concerning combinations
  const symptomTypes = infectionSymptoms.map(s => s.symptom_type);
  
  if (symptomTypes.includes('fever') && symptomTypes.includes('confusion')) {
    riskScore += 15; // Fever + confusion is very concerning
  }
  
  if (symptomTypes.includes('chills') && symptomTypes.includes('weakness')) {
    riskScore += 10;
  }

  if (symptomTypes.includes('rapid_breathing') && symptomTypes.includes('chest_pain')) {
    riskScore += 12; // Possible pneumonia
  }

  return Math.min(30, riskScore); // Cap at 30 points
};

const assessRapidVitalChanges = (vitals: Vital[]): number => {
  const last24Hours = vitals.filter(v => {
    const measuredAt = new Date(v.measured_at);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return measuredAt > oneDayAgo;
  });

  let riskScore = 0;

  // Look for rapid changes that might indicate developing infection
  const tempChanges = calculateVitalChanges(last24Hours, 'temperature');
  const pulseChanges = calculateVitalChanges(last24Hours, 'pulse');

  if (tempChanges.rapidIncrease) riskScore += 10;
  if (pulseChanges.rapidIncrease) riskScore += 8;

  // Multiple out-of-range readings in 24 hours
  const outOfRangeCount = last24Hours.filter(v => v.out_of_range).length;
  if (outOfRangeCount >= 3) {
    riskScore += 12;
  }

  return Math.min(20, riskScore); // Cap at 20 points
};

const calculateTemperatureTrend = (temps: Vital[]): 'rising' | 'falling' | 'stable' => {
  if (temps.length < 2) return 'stable';
  
  const latest = temps[0].values as { value: number };
  const previous = temps[1].values as { value: number };
  
  const difference = latest.value - previous.value;
  
  if (difference > 0.5) return 'rising';
  if (difference < -0.5) return 'falling';
  return 'stable';
};

const calculateVitalChanges = (vitals: Vital[], type: string) => {
  const typeVitals = vitals.filter(v => v.vital_type === type);
  if (typeVitals.length < 2) return { rapidIncrease: false, rapidDecrease: false };

  typeVitals.sort((a, b) => new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime());
  
  const first = typeVitals[0].values as { value: number };
  const last = typeVitals[typeVitals.length - 1].values as { value: number };
  
  const change = last.value - first.value;
  const threshold = type === 'temperature' ? 1.5 : 20; // Different thresholds for different vitals
  
  return {
    rapidIncrease: change > threshold,
    rapidDecrease: change < -threshold
  };
};

const getInfectionRiskLevel = (score: number): 'low' | 'moderate' | 'high' | 'urgent' => {
  if (score >= 70) return 'urgent';
  if (score >= 50) return 'high';
  if (score >= 25) return 'moderate';
  return 'low';
};

const generateInfectionRecommendations = (
  factors: InfectionRiskFactors,
  riskLevel: string
): string[] => {
  const recommendations: string[] = [];

  if (factors.temperatureElevation > 20) {
    recommendations.push("Monitor temperature every 2-4 hours");
    recommendations.push("Stay hydrated and rest");
    recommendations.push("Consider fever-reducing medication as directed by your doctor");
  }

  if (factors.pulseAbnormalities > 15) {
    recommendations.push("Monitor heart rate along with temperature");
    recommendations.push("Avoid strenuous activity until pulse normalizes");
  }

  if (factors.symptomCombinations > 15) {
    recommendations.push("Keep a detailed log of all symptoms");
    recommendations.push("Contact your healthcare provider if symptoms worsen");
  }

  if (riskLevel === 'urgent' || riskLevel === 'high') {
    recommendations.push("Seek immediate medical attention");
    recommendations.push("Do not delay treatment - infections can worsen rapidly in neurological patients");
    recommendations.push("Have someone stay with you or check on you frequently");
  }

  if (riskLevel === 'moderate') {
    recommendations.push("Contact your healthcare provider within 24 hours");
    recommendations.push("Continue monitoring symptoms closely");
  }

  return recommendations;
};

const generateInfectionAlert = (
  riskLevel: string,
  factors: InfectionRiskFactors
): string | undefined => {
  if (riskLevel === 'urgent') {
    return "Urgent: Possible infection detected. Seek immediate medical attention. Infections can be particularly serious for neurological patients.";
  }

  if (riskLevel === 'high') {
    if (factors.temperatureElevation > 30 && factors.symptomCombinations > 15) {
      return "High infection risk: Fever combined with concerning symptoms. Contact your doctor immediately.";
    }
    return "High infection risk detected. Please contact your healthcare provider as soon as possible.";
  }

  if (riskLevel === 'moderate' && factors.rapidChanges > 10) {
    return "Your vital signs are changing rapidly. Please monitor closely and be prepared to seek medical care.";
  }

  return undefined;
};

const getSymptomsToMonitor = (factors: InfectionRiskFactors): string[] => {
  const symptoms = ['Temperature changes', 'Unusual fatigue or weakness'];

  if (factors.pulseAbnormalities > 10) {
    symptoms.push('Heart rate changes');
  }

  if (factors.temperatureElevation > 15) {
    symptoms.push('Chills or sweating', 'Loss of appetite');
  }

  symptoms.push('Confusion or disorientation', 'Difficulty breathing', 'Persistent headache');

  return symptoms;
};