
import { Vital } from '@/hooks/useVitals';
import { Symptom } from '@/hooks/useSymptoms';
import { Medication } from '@/hooks/useMedications';
import { MedicationLog } from '@/hooks/useMedicationLogs';
import { addDays, subDays, format } from 'date-fns';

export interface WellnessFactors {
  medicationAdherence: number;
  vitalStability: number;
  symptomSeverity: number;
  consistencyBonus: number;
  personalizedFactors: Record<string, number>;
}

export interface PersonalizedWeights {
  medication: number;
  vitals: number;
  symptoms: number;
  consistency: number;
  lastUpdated: Date;
}

export interface WellnessInsight {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  strength: number;
  description: string;
  recommendation?: string;
}

export class EnhancedWellnessCalculator {
  private static instance: EnhancedWellnessCalculator;
  private personalizedWeights: PersonalizedWeights;
  
  static getInstance(): EnhancedWellnessCalculator {
    if (!EnhancedWellnessCalculator.instance) {
      EnhancedWellnessCalculator.instance = new EnhancedWellnessCalculator();
    }
    return EnhancedWellnessCalculator.instance;
  }

  constructor() {
    // Default weights - will be personalized over time
    this.personalizedWeights = {
      medication: 0.4,
      vitals: 0.3,
      symptoms: 0.2,
      consistency: 0.1,
      lastUpdated: new Date()
    };
    
    // Load personalized weights from localStorage
    this.loadPersonalizedWeights();
  }

  calculateEnhancedWellnessScore(
    vitals: Vital[],
    symptoms: Symptom[],
    medications: Medication[],
    medicationLogs: MedicationLog[]
  ): {
    score: number;
    factors: WellnessFactors;
    insights: WellnessInsight[];
    personalizedWeights: PersonalizedWeights;
  } {
    const factors = this.calculateFactors(vitals, symptoms, medications, medicationLogs);
    const insights = this.generateInsights(factors, vitals, symptoms, medicationLogs);
    
    // Calculate weighted score using personalized weights
    const score = Math.round(
      factors.medicationAdherence * this.personalizedWeights.medication +
      factors.vitalStability * this.personalizedWeights.vitals +
      (100 - factors.symptomSeverity) * this.personalizedWeights.symptoms +
      factors.consistencyBonus * this.personalizedWeights.consistency
    );
    
    // Update personalized weights based on user patterns
    this.updatePersonalizedWeights(vitals, symptoms, medicationLogs);
    
    return {
      score: Math.max(0, Math.min(100, score)),
      factors,
      insights,
      personalizedWeights: this.personalizedWeights
    };
  }

  private calculateFactors(
    vitals: Vital[],
    symptoms: Symptom[],
    medications: Medication[],
    medicationLogs: MedicationLog[]
  ): WellnessFactors {
    const medicationAdherence = this.calculateMedicationAdherence(medications, medicationLogs);
    const vitalStability = this.calculateVitalStability(vitals);
    const symptomSeverity = this.calculateSymptomSeverity(symptoms);
    const consistencyBonus = this.calculateConsistencyBonus(medicationLogs, symptoms, vitals);
    const personalizedFactors = this.calculatePersonalizedFactors(vitals, symptoms, medicationLogs);
    
    return {
      medicationAdherence,
      vitalStability,
      symptomSeverity,
      consistencyBonus,
      personalizedFactors
    };
  }

  private calculateMedicationAdherence(medications: Medication[], medicationLogs: MedicationLog[]): number {
    if (medications.length === 0) return 100;
    
    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);
    
    // Get recent logs
    const recentLogs = medicationLogs.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate >= sevenDaysAgo;
    });
    
    if (recentLogs.length === 0) return 50; // No recent data
    
    // Calculate adherence rate
    const takenLogs = recentLogs.filter(log => log.status === 'taken');
    const adherenceRate = takenLogs.length / recentLogs.length;
    
    // Bonus for consistency over time
    const consistencyBonus = this.calculateAdherenceConsistency(recentLogs);
    
    return Math.min(100, (adherenceRate * 100) + consistencyBonus);
  }

  private calculateVitalStability(vitals: Vital[]): number {
    if (vitals.length === 0) return 70; // Neutral score for no data
    
    const recentVitals = vitals.filter(v => {
      const vitalDate = new Date(v.measured_at);
      return vitalDate >= subDays(new Date(), 14);
    });
    
    if (recentVitals.length === 0) return 60; // Lower score for no recent data
    
    // Calculate stability based on out-of-range readings
    const outOfRangeCount = recentVitals.filter(v => v.out_of_range).length;
    const stabilityRate = (recentVitals.length - outOfRangeCount) / recentVitals.length;
    
    // Bonus for regular monitoring
    const monitoringBonus = this.calculateMonitoringBonus(recentVitals);
    
    return Math.min(100, (stabilityRate * 100) + monitoringBonus);
  }

  private calculateSymptomSeverity(symptoms: Symptom[]): number {
    if (symptoms.length === 0) return 20; // Low severity for no symptoms
    
    const recentSymptoms = symptoms.filter(s => {
      const symptomDate = new Date(s.logged_at || s.id);
      return symptomDate >= subDays(new Date(), 7);
    });
    
    if (recentSymptoms.length === 0) return 15; // Very low severity
    
    // Calculate average severity
    const avgSeverity = recentSymptoms.reduce((sum, s) => sum + (s.severity || 5), 0) / recentSymptoms.length;
    
    // Weight by frequency - more frequent symptoms increase severity score
    const frequencyMultiplier = Math.min(2, recentSymptoms.length / 3);
    
    return Math.min(100, (avgSeverity * 10) * frequencyMultiplier);
  }

  private calculateConsistencyBonus(medicationLogs: MedicationLog[], symptoms: Symptom[], vitals: Vital[]): number {
    let bonus = 0;
    
    // Medication consistency bonus
    const recentMedLogs = medicationLogs.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate >= subDays(new Date(), 7);
    });
    
    if (recentMedLogs.length >= 7) bonus += 5; // Daily medication logging
    
    // Symptom tracking consistency
    const recentSymptoms = symptoms.filter(s => {
      const symptomDate = new Date(s.logged_at || s.id);
      return symptomDate >= subDays(new Date(), 7);
    });
    
    if (recentSymptoms.length >= 3) bonus += 3; // Regular symptom tracking
    
    // Vital monitoring consistency
    const recentVitals = vitals.filter(v => {
      const vitalDate = new Date(v.measured_at);
      return vitalDate >= subDays(new Date(), 7);
    });
    
    if (recentVitals.length >= 2) bonus += 2; // Regular vital monitoring
    
    return Math.min(10, bonus);
  }

  private calculatePersonalizedFactors(vitals: Vital[], symptoms: Symptom[], medicationLogs: MedicationLog[]): Record<string, number> {
    const factors: Record<string, number> = {};
    
    // Sleep quality factor (if user frequently logs sleep-related symptoms)
    const sleepSymptoms = symptoms.filter(s => 
      s.symptom_type === 'sleep' || 
      s.symptom_type === 'fatigue' ||
      s.notes?.toLowerCase().includes('sleep')
    );
    
    if (sleepSymptoms.length >= 3) {
      const avgSleepSeverity = sleepSymptoms.reduce((sum, s) => sum + (s.severity || 5), 0) / sleepSymptoms.length;
      factors.sleepQuality = Math.max(0, 100 - (avgSleepSeverity * 10));
    }
    
    // Activity level factor (based on symptom timing patterns)
    const morningSymptoms = symptoms.filter(s => {
      const hour = new Date(s.logged_at || s.id).getHours();
      return hour >= 6 && hour <= 11;
    });
    
    const eveningSymptoms = symptoms.filter(s => {
      const hour = new Date(s.logged_at || s.id).getHours();
      return hour >= 17 && hour <= 22;
    });
    
    if (morningSymptoms.length > 0 || eveningSymptoms.length > 0) {
      const morningRatio = morningSymptoms.length / (morningSymptoms.length + eveningSymptoms.length);
      factors.activityPattern = morningRatio > 0.6 ? 70 : 85; // Better scores for evening activity
    }
    
    // Stress management factor (based on mood-related symptoms)
    const stressSymptoms = symptoms.filter(s => 
      s.symptom_type === 'mood' || 
      s.symptom_type === 'anxiety' ||
      s.notes?.toLowerCase().includes('stress')
    );
    
    if (stressSymptoms.length >= 2) {
      const avgStressSeverity = stressSymptoms.reduce((sum, s) => sum + (s.severity || 5), 0) / stressSymptoms.length;
      factors.stressManagement = Math.max(0, 100 - (avgStressSeverity * 12));
    }
    
    return factors;
  }

  private calculateAdherenceConsistency(logs: MedicationLog[]): number {
    if (logs.length < 3) return 0;
    
    // Group logs by day
    const dailyLogs = logs.reduce((acc, log) => {
      const day = format(new Date(log.created_at), 'yyyy-MM-dd');
      if (!acc[day]) acc[day] = [];
      acc[day].push(log);
      return acc;
    }, {} as Record<string, MedicationLog[]>);
    
    // Calculate daily adherence rates
    const dailyRates = Object.values(dailyLogs).map(dayLogs => 
      dayLogs.filter(log => log.status === 'taken').length / dayLogs.length
    );
    
    // Consistency bonus based on standard deviation
    const avg = dailyRates.reduce((sum, rate) => sum + rate, 0) / dailyRates.length;
    const variance = dailyRates.reduce((sum, rate) => sum + Math.pow(rate - avg, 2), 0) / dailyRates.length;
    const stdDev = Math.sqrt(variance);
    
    return Math.max(0, 10 - (stdDev * 20)); // Lower deviation = higher bonus
  }

  private calculateMonitoringBonus(vitals: Vital[]): number {
    if (vitals.length === 0) return 0;
    
    // Group by days
    const dailyVitals = vitals.reduce((acc, vital) => {
      const day = format(new Date(vital.measured_at), 'yyyy-MM-dd');
      if (!acc[day]) acc[day] = [];
      acc[day].push(vital);
      return acc;
    }, {} as Record<string, Vital[]>);
    
    const daysWithReadings = Object.keys(dailyVitals).length;
    
    // Bonus for regular monitoring
    if (daysWithReadings >= 7) return 10;
    if (daysWithReadings >= 4) return 5;
    if (daysWithReadings >= 2) return 2;
    
    return 0;
  }

  private generateInsights(factors: WellnessFactors, vitals: Vital[], symptoms: Symptom[], medicationLogs: MedicationLog[]): WellnessInsight[] {
    const insights: WellnessInsight[] = [];
    
    // Medication adherence insights
    if (factors.medicationAdherence >= 90) {
      insights.push({
        factor: 'Medication Adherence',
        impact: 'positive',
        strength: 0.9,
        description: 'Excellent medication consistency is supporting your health goals',
        recommendation: 'Keep up the great work with your medication routine!'
      });
    } else if (factors.medicationAdherence < 70) {
      insights.push({
        factor: 'Medication Adherence',
        impact: 'negative',
        strength: 0.8,
        description: 'Inconsistent medication timing may be affecting your wellness',
        recommendation: 'Consider setting up reminders or using a pill organizer'
      });
    }
    
    // Vital stability insights
    if (factors.vitalStability >= 85) {
      insights.push({
        factor: 'Vital Signs',
        impact: 'positive',
        strength: 0.7,
        description: 'Your vital signs are staying within healthy ranges',
        recommendation: 'Continue your current monitoring routine'
      });
    } else if (factors.vitalStability < 60) {
      insights.push({
        factor: 'Vital Signs',
        impact: 'negative',
        strength: 0.8,
        description: 'Several vital readings have been outside normal ranges',
        recommendation: 'Consider discussing these patterns with your healthcare provider'
      });
    }
    
    // Symptom severity insights
    if (factors.symptomSeverity < 30) {
      insights.push({
        factor: 'Symptom Management',
        impact: 'positive',
        strength: 0.8,
        description: 'Your symptoms are well-managed with low severity',
        recommendation: 'Continue your current management strategies'
      });
    } else if (factors.symptomSeverity > 60) {
      insights.push({
        factor: 'Symptom Management',
        impact: 'negative',
        strength: 0.7,
        description: 'Recent symptoms have been more severe than usual',
        recommendation: 'Track potential triggers and consider discussing with your doctor'
      });
    }
    
    // Consistency insights
    if (factors.consistencyBonus >= 8) {
      insights.push({
        factor: 'Tracking Consistency',
        impact: 'positive',
        strength: 0.6,
        description: 'Your consistent health tracking is providing valuable insights',
        recommendation: 'Your dedication to tracking is helping optimize your care'
      });
    }
    
    // Personalized factor insights
    Object.entries(factors.personalizedFactors).forEach(([factor, value]) => {
      if (factor === 'sleepQuality' && value < 60) {
        insights.push({
          factor: 'Sleep Quality',
          impact: 'negative',
          strength: 0.6,
          description: 'Sleep-related symptoms are affecting your wellness',
          recommendation: 'Consider establishing a consistent bedtime routine'
        });
      } else if (factor === 'stressManagement' && value < 70) {
        insights.push({
          factor: 'Stress Management',
          impact: 'negative',
          strength: 0.5,
          description: 'Stress-related symptoms are impacting your well-being',
          recommendation: 'Try relaxation techniques or visit the Calm Room'
        });
      }
    });
    
    return insights.sort((a, b) => b.strength - a.strength);
  }

  private updatePersonalizedWeights(vitals: Vital[], symptoms: Symptom[], medicationLogs: MedicationLog[]): void {
    // Only update weights if we have sufficient data
    if (medicationLogs.length < 10 || symptoms.length < 5) return;
    
    const now = new Date();
    const daysSinceLastUpdate = Math.floor((now.getTime() - this.personalizedWeights.lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
    
    // Only update weights weekly
    if (daysSinceLastUpdate < 7) return;
    
    // Analyze which factors correlate most with user's wellbeing patterns
    const correlations = this.analyzeFactorCorrelations(vitals, symptoms, medicationLogs);
    
    // Adjust weights based on correlations
    const adjustment = 0.1; // Small adjustment to prevent drastic changes
    
    if (correlations.medication > 0.5) {
      this.personalizedWeights.medication = Math.min(0.6, this.personalizedWeights.medication + adjustment);
    }
    
    if (correlations.symptoms > 0.4) {
      this.personalizedWeights.symptoms = Math.min(0.4, this.personalizedWeights.symptoms + adjustment);
    }
    
    if (correlations.vitals > 0.3) {
      this.personalizedWeights.vitals = Math.min(0.4, this.personalizedWeights.vitals + adjustment);
    }
    
    // Normalize weights to sum to 1
    const totalWeight = this.personalizedWeights.medication + this.personalizedWeights.vitals + 
                       this.personalizedWeights.symptoms + this.personalizedWeights.consistency;
    
    this.personalizedWeights.medication /= totalWeight;
    this.personalizedWeights.vitals /= totalWeight;
    this.personalizedWeights.symptoms /= totalWeight;
    this.personalizedWeights.consistency /= totalWeight;
    
    this.personalizedWeights.lastUpdated = now;
    
    // Save to localStorage
    this.savePersonalizedWeights();
  }

  private analyzeFactorCorrelations(vitals: Vital[], symptoms: Symptom[], medicationLogs: MedicationLog[]): Record<string, number> {
    // Simple correlation analysis between factors and overall patterns
    // This is a simplified version - in a real app, you'd use more sophisticated ML techniques
    
    const recentLogs = medicationLogs.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate >= subDays(new Date(), 21);
    });
    
    const recentSymptoms = symptoms.filter(s => {
      const symptomDate = new Date(s.logged_at || s.id);
      return symptomDate >= subDays(new Date(), 21);
    });
    
    return {
      medication: recentLogs.length > 0 ? Math.min(1, recentLogs.length / 21) : 0.3,
      symptoms: recentSymptoms.length > 0 ? Math.min(1, recentSymptoms.length / 10) : 0.2,
      vitals: vitals.length > 0 ? Math.min(1, vitals.length / 14) : 0.3
    };
  }

  private loadPersonalizedWeights(): void {
    try {
      const stored = localStorage.getItem('ojas_personalized_weights');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.personalizedWeights = {
          ...this.personalizedWeights,
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated)
        };
      }
    } catch (error) {
      console.error('Failed to load personalized weights:', error);
    }
  }

  private savePersonalizedWeights(): void {
    try {
      localStorage.setItem('ojas_personalized_weights', JSON.stringify(this.personalizedWeights));
    } catch (error) {
      console.error('Failed to save personalized weights:', error);
    }
  }

  // Public method to get current weights for display
  getPersonalizedWeights(): PersonalizedWeights {
    return { ...this.personalizedWeights };
  }

  // Public method to reset weights to defaults
  resetPersonalizedWeights(): void {
    this.personalizedWeights = {
      medication: 0.4,
      vitals: 0.3,
      symptoms: 0.2,
      consistency: 0.1,
      lastUpdated: new Date()
    };
    this.savePersonalizedWeights();
  }
}
