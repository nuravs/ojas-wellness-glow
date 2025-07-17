interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: any;
  active: boolean;
  user_id: string;
  instructions?: string;
  created_at: string;
  updated_at: string;
}

interface Comorbidity {
  id: string;
  condition_name: string;
  status: 'active' | 'controlled' | 'monitoring' | 'inactive';
  severity: 'mild' | 'moderate' | 'severe';
  updated_at: string;
}

interface Vital {
  id: string;
  vital_type: string;
  values: any;
  measured_at: string;
  out_of_range: boolean;
}

interface Symptom {
  id: string;
  symptom_type: string;
  severity: number;
  logged_at: string;
}

interface WellnessData {
  medications: Medication[];
  medicationLogs: any[];
  comorbidities: Comorbidity[];
  vitals: Vital[];
  symptoms: Symptom[];
}

export interface WellnessScore {
  overall: number;
  breakdown: {
    medicationAdherence: number;
    comorbidityManagement: number;
    neurologicalSymptoms: number;
    vitalsStability: number;
    generalWellness: number;
  };
  insights: string[];
  alertLevel: 'good' | 'attention' | 'urgent';
}

/**
 * Enhanced wellness scoring algorithm with comorbidity integration
 * Weighting: Medication 30%, Comorbidity 25%, Neurological 20%, Vitals 15%, General 10%
 */
export function calculateWellnessScore(data: WellnessData): WellnessScore {
  const { medications, medicationLogs, comorbidities, vitals, symptoms } = data;
  
  // Calculate medication adherence (30% weight)
  const medicationScore = calculateMedicationAdherence(medications, medicationLogs);
  
  // Calculate comorbidity management (25% weight)
  const comorbidityScore = calculateComorbidityManagement(comorbidities);
  
  // Calculate neurological symptoms impact (20% weight)
  const neurologicalScore = calculateNeurologicalImpact(symptoms);
  
  // Calculate vitals stability (15% weight)
  const vitalsScore = calculateVitalsStability(vitals, comorbidities);
  
  // Calculate general wellness (10% weight)
  const generalScore = calculateGeneralWellness(symptoms, vitals);
  
  // Calculate weighted overall score
  const overall = Math.round(
    medicationScore * 0.30 +
    comorbidityScore * 0.25 +
    neurologicalScore * 0.20 +
    vitalsScore * 0.15 +
    generalScore * 0.10
  );
  
  const insights = generateInsights(data, {
    medicationAdherence: medicationScore,
    comorbidityManagement: comorbidityScore,
    neurologicalSymptoms: neurologicalScore,
    vitalsStability: vitalsScore,
    generalWellness: generalScore
  });
  
  const alertLevel = determineAlertLevel(overall, data);
  
  return {
    overall,
    breakdown: {
      medicationAdherence: medicationScore,
      comorbidityManagement: comorbidityScore,
      neurologicalSymptoms: neurologicalScore,
      vitalsStability: vitalsScore,
      generalWellness: generalScore
    },
    insights,
    alertLevel
  };
}

function calculateMedicationAdherence(medications: Medication[], logs: any[]): number {
  if (!medications.length) return 85; // Neutral score if no medications
  
  const now = new Date();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const recentLogs = logs.filter(log => new Date(log.created_at) >= last7Days);
  const expectedDoses = medications.reduce((total, med) => {
    if (!med.active) return total;
    const frequency = med.frequency as any;
    return total + (frequency?.times_per_day || 1) * 7;
  }, 0);
  
  if (expectedDoses === 0) return 85;
  
  const takenDoses = recentLogs.filter(log => log.status === 'taken').length;
  const adherenceRate = (takenDoses / expectedDoses) * 100;
  
  return Math.min(100, Math.max(0, adherenceRate));
}

function calculateComorbidityManagement(comorbidities: Comorbidity[]): number {
  if (!comorbidities.length) return 90; // Good score if no comorbidities
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  let totalScore = 0;
  let weightedTotal = 0;
  
  comorbidities.forEach(condition => {
    const daysSinceUpdate = Math.floor(
      (now.getTime() - new Date(condition.updated_at).getTime()) / (24 * 60 * 60 * 1000)
    );
    
    // Weight based on severity
    const severityWeight = condition.severity === 'severe' ? 3 : 
                          condition.severity === 'moderate' ? 2 : 1;
    
    let conditionScore = 50; // Base score
    
    // Status-based scoring
    switch (condition.status) {
      case 'controlled':
        conditionScore = 90;
        break;
      case 'monitoring':
        conditionScore = 70;
        break;
      case 'active':
        conditionScore = 50;
        break;
      case 'inactive':
        conditionScore = 95;
        break;
    }
    
    // Penalize for outdated information
    if (daysSinceUpdate > 30) {
      conditionScore -= Math.min(30, daysSinceUpdate - 30);
    }
    
    totalScore += conditionScore * severityWeight;
    weightedTotal += severityWeight;
  });
  
  return weightedTotal > 0 ? Math.round(totalScore / weightedTotal) : 90;
}

function calculateNeurologicalImpact(symptoms: Symptom[]): number {
  const now = new Date();
  const last14Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  
  const recentSymptoms = symptoms.filter(symptom => 
    new Date(symptom.logged_at) >= last14Days
  );
  
  if (!recentSymptoms.length) return 85; // Good score if no recent symptoms
  
  const neurologicalSymptoms = recentSymptoms.filter(symptom =>
    ['tremor', 'stiffness', 'balance', 'coordination', 'speech', 'cognitive'].includes(symptom.symptom_type.toLowerCase())
  );
  
  if (!neurologicalSymptoms.length) return 85;
  
  const avgSeverity = neurologicalSymptoms.reduce((sum, symptom) => sum + symptom.severity, 0) / neurologicalSymptoms.length;
  const frequencyPenalty = Math.min(20, neurologicalSymptoms.length * 2);
  
  return Math.max(30, 100 - (avgSeverity * 15) - frequencyPenalty);
}

function calculateVitalsStability(vitals: Vital[], comorbidities: Comorbidity[]): number {
  if (!vitals.length) return 80; // Neutral score if no vitals
  
  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const recentVitals = vitals.filter(vital => 
    new Date(vital.measured_at) >= last30Days
  );
  
  if (!recentVitals.length) return 75; // Slight penalty for no recent readings
  
  const outOfRangeCount = recentVitals.filter(vital => vital.out_of_range).length;
  const outOfRangeRate = (outOfRangeCount / recentVitals.length) * 100;
  
  // Apply stricter standards for relevant comorbidities
  const hasHypertension = comorbidities.some(c => 
    c.condition_name.toLowerCase().includes('hypertension') && c.status === 'active'
  );
  const hasDiabetes = comorbidities.some(c => 
    c.condition_name.toLowerCase().includes('diabetes') && c.status === 'active'
  );
  
  let baseScore = 100 - (outOfRangeRate * 2);
  
  // Additional penalties for condition-specific concerns
  if (hasHypertension || hasDiabetes) {
    baseScore -= outOfRangeRate * 0.5; // Extra penalty for high-risk patients
  }
  
  return Math.max(30, Math.round(baseScore));
}

function calculateGeneralWellness(symptoms: Symptom[], vitals: Vital[]): number {
  const now = new Date();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const recentSymptoms = symptoms.filter(symptom => 
    new Date(symptom.logged_at) >= last7Days
  );
  
  const recentVitals = vitals.filter(vital => 
    new Date(vital.measured_at) >= last7Days
  );
  
  let score = 85; // Base wellness score
  
  // General symptom impact
  const generalSymptoms = recentSymptoms.filter(symptom =>
    !['tremor', 'stiffness', 'balance', 'coordination', 'speech', 'cognitive'].includes(symptom.symptom_type.toLowerCase())
  );
  
  if (generalSymptoms.length > 0) {
    const avgSeverity = generalSymptoms.reduce((sum, symptom) => sum + symptom.severity, 0) / generalSymptoms.length;
    score -= avgSeverity * 5;
  }
  
  // Consistency bonus for regular monitoring
  if (recentVitals.length >= 3) {
    score += 5; // Bonus for regular monitoring
  }
  
  return Math.max(40, Math.round(score));
}

function generateInsights(data: WellnessData, scores: any): string[] {
  const insights: string[] = [];
  
  // Medication insights
  if (scores.medicationAdherence < 70) {
    insights.push("Consider setting medication reminders to improve adherence");
  } else if (scores.medicationAdherence > 90) {
    insights.push("Excellent medication adherence! Keep up the great work");
  }
  
  // Comorbidity insights
  if (scores.comorbidityManagement < 60) {
    insights.push("Schedule follow-up with your healthcare team for condition management");
  }
  
  // Vitals insights
  if (scores.vitalsStability < 70) {
    insights.push("Recent vital signs show some concerns - discuss with your doctor");
  }
  
  // General insights
  if (data.vitals.length === 0) {
    insights.push("Start tracking your vital signs for better health monitoring");
  }
  
  if (insights.length === 0) {
    insights.push("Your health metrics are looking good - maintain your current routine");
  }
  
  return insights;
}

function determineAlertLevel(overall: number, data: WellnessData): 'good' | 'attention' | 'urgent' {
  // Check for urgent conditions first
  const hasUrgentVitals = data.vitals.some(vital => 
    vital.out_of_range && new Date(vital.measured_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  );
  
  const hasActiveSevereConditions = data.comorbidities.some(c => 
    c.status === 'active' && c.severity === 'severe'
  );
  
  if (hasUrgentVitals || hasActiveSevereConditions || overall < 50) {
    return 'urgent';
  }
  
  if (overall < 70) {
    return 'attention';
  }
  
  return 'good';
}