import { calculateFallRisk, FallRiskAssessment } from './fallRiskCalculator';
import { assessInfectionRisk, InfectionWarning } from './infectionEarlyWarning';
import { Vital } from '@/hooks/useVitals';
import { Symptom } from '@/hooks/useSymptoms';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  medication_id?: string;
  caregiver_visible?: boolean;
  logged_by?: string;
  logged_by_role?: 'patient' | 'caregiver';
  created_at?: string;
  updated_at?: string;
}

export interface AIInsight {
  id: string;
  type: 'fall_risk' | 'infection_warning' | 'medication_timing' | 'caregiver_support' | 'positive_pattern';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  recommendations: string[];
  actionable: boolean;
  dismissible: boolean;
  validUntil?: Date;
  data?: any;
}

export interface CaregiverBurnoutIndicators {
  lateNightActivity: number;
  frequentLogging: number;
  patientSymptomSpikes: number;
  overallRisk: 'low' | 'moderate' | 'high';
}

export interface MedicationTimingInsight {
  medicationName: string;
  currentTiming: string;
  suggestedTiming: string;
  reason: string;
  confidence: number;
}

export class AIInsightsEngine {
  private static instance: AIInsightsEngine;
  private insights: AIInsight[] = [];

  static getInstance(): AIInsightsEngine {
    if (!AIInsightsEngine.instance) {
      AIInsightsEngine.instance = new AIInsightsEngine();
    }
    return AIInsightsEngine.instance;
  }

  generateInsights(
    vitals: Vital[],
    symptoms: Symptom[],
    medications: Medication[],
    recentMedicationChanges: number = 0,
    userRole: 'patient' | 'caregiver' = 'patient'
  ): AIInsight[] {
    const newInsights: AIInsight[] = [];

    // Fall Risk Assessment
    const fallRisk = calculateFallRisk(vitals, symptoms, recentMedicationChanges);
    if (fallRisk.level !== 'low') {
      newInsights.push(this.createFallRiskInsight(fallRisk));
    }

    // Infection Early Warning
    const infectionWarning = assessInfectionRisk(vitals, symptoms);
    if (infectionWarning.riskLevel !== 'low') {
      newInsights.push(this.createInfectionWarningInsight(infectionWarning));
    }

    // Medication Timing Insights
    const medicationInsights = this.analyzeMedicationTiming(symptoms, medications);
    newInsights.push(...medicationInsights);

    // Positive Pattern Recognition
    const positiveInsights = this.identifyPositivePatterns(vitals, symptoms);
    newInsights.push(...positiveInsights);

    // Caregiver-specific insights
    if (userRole === 'caregiver') {
      const caregiverInsights = this.generateCaregiverInsights(vitals, symptoms);
      newInsights.push(...caregiverInsights);
    }

    // Update internal insights array
    this.insights = this.mergeInsights(this.insights, newInsights);
    
    return this.insights.filter(insight => !this.isExpired(insight));
  }

  private createFallRiskInsight(fallRisk: FallRiskAssessment): AIInsight {
    const priorityMap = {
      'low': 'low' as const,
      'moderate': 'medium' as const,
      'high': 'high' as const,
      'critical': 'urgent' as const
    };

    return {
      id: `fall_risk_${Date.now()}`,
      type: 'fall_risk',
      priority: priorityMap[fallRisk.level],
      title: `${fallRisk.level.charAt(0).toUpperCase() + fallRisk.level.slice(1)} Fall Risk Detected`,
      message: fallRisk.alertMessage || `Your current fall risk score is ${fallRisk.score}/100. Please review the safety recommendations.`,
      recommendations: fallRisk.recommendations,
      actionable: true,
      dismissible: fallRisk.level === 'low' || fallRisk.level === 'moderate',
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // Valid for 24 hours
      data: fallRisk
    };
  }

  private createInfectionWarningInsight(warning: InfectionWarning): AIInsight {
    const priorityMap = {
      'low': 'low' as const,
      'moderate': 'medium' as const,
      'high': 'high' as const,
      'urgent': 'urgent' as const
    };

    return {
      id: `infection_warning_${Date.now()}`,
      type: 'infection_warning',
      priority: priorityMap[warning.riskLevel],
      title: `${warning.riskLevel.charAt(0).toUpperCase() + warning.riskLevel.slice(1)} Infection Risk`,
      message: warning.alertMessage || `Potential infection indicators detected. Risk score: ${warning.score}/100.`,
      recommendations: warning.recommendations,
      actionable: true,
      dismissible: warning.riskLevel === 'low',
      validUntil: new Date(Date.now() + 12 * 60 * 60 * 1000), // Valid for 12 hours
      data: warning
    };
  }

  private analyzeMedicationTiming(symptoms: Symptom[], medications: Medication[]): AIInsight[] {
    const insights: AIInsight[] = [];
    
    // Analyze symptom patterns to suggest better medication timing
    const symptomPatterns = this.analyzeSymptomPatterns(symptoms);
    
    medications.forEach(medication => {
      const timingInsight = this.generateMedicationTimingInsight(medication, symptomPatterns);
      if (timingInsight) {
        insights.push({
          id: `med_timing_${medication.id}_${Date.now()}`,
          type: 'medication_timing',
          priority: 'medium',
          title: `Optimize ${medication.name} Timing`,
          message: `Consider adjusting ${medication.name} timing: ${timingInsight.reason}`,
          recommendations: [
            `Current timing: ${timingInsight.currentTiming}`,
            `Suggested timing: ${timingInsight.suggestedTiming}`,
            "Discuss this change with your healthcare provider before adjusting"
          ],
          actionable: true,
          dismissible: true,
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Valid for 7 days
          data: timingInsight
        });
      }
    });

    return insights;
  }

  private identifyPositivePatterns(vitals: Vital[], symptoms: Symptom[]): AIInsight[] {
    const insights: AIInsight[] = [];
    
    // Identify improvement patterns
    const improvements = this.detectImprovements(vitals, symptoms);
    
    if (improvements.length > 0) {
      insights.push({
        id: `positive_pattern_${Date.now()}`,
        type: 'positive_pattern',
        priority: 'low',
        title: 'Positive Health Trends Detected! 🎉',
        message: `Great progress! ${improvements.join(', ')}`,
        recommendations: [
          'Keep up the great work with your current routine',
          'Consider noting what made today successful in your symptom log',
          'Share this positive trend with your healthcare team'
        ],
        actionable: false,
        dismissible: true,
        validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Valid for 3 days
        data: { improvements }
      });
    }

    return insights;
  }

  private generateCaregiverInsights(vitals: Vital[], symptoms: Symptom[]): AIInsight[] {
    const insights: AIInsight[] = [];
    
    const burnoutRisk = this.assessCaregiverBurnout(vitals, symptoms);
    
    if (burnoutRisk.overallRisk !== 'low') {
      insights.push({
        id: `caregiver_burnout_${Date.now()}`,
        type: 'caregiver_support',
        priority: burnoutRisk.overallRisk === 'high' ? 'high' : 'medium',
        title: 'Caregiver Wellness Check',
        message: 'Your caregiving activity suggests you may benefit from additional support.',
        recommendations: [
          'Consider asking family or friends for help with daily tasks',
          'Take short breaks throughout the day',
          'Connect with caregiver support groups',
          'Remember: Taking care of yourself helps you care for your loved one'
        ],
        actionable: true,
        dismissible: true,
        validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Valid for 2 days
        data: burnoutRisk
      });
    }

    return insights;
  }

  private analyzeSymptomPatterns(symptoms: Symptom[]): Record<string, number[]> {
    const patterns: Record<string, number[]> = {};
    
    symptoms.forEach(symptom => {
      const hour = new Date(symptom.logged_at || symptom.id).getHours();
      if (!patterns[symptom.symptom_type]) {
        patterns[symptom.symptom_type] = new Array(24).fill(0);
      }
      patterns[symptom.symptom_type][hour]++;
    });

    return patterns;
  }

  private generateMedicationTimingInsight(
    medication: Medication, 
    symptomPatterns: Record<string, number[]>
  ): MedicationTimingInsight | null {
    // Look for symptoms that might be helped by better timing
    const relevantSymptoms = ['stiffness', 'pain', 'tremor', 'fatigue'];
    
    for (const symptom of relevantSymptoms) {
      if (symptomPatterns[symptom]) {
        const peakHour = this.findPeakHour(symptomPatterns[symptom]);
        if (peakHour !== -1) {
          const suggestedTime = this.calculateOptimalMedicationTime(peakHour, symptom);
          return {
            medicationName: medication.name,
            currentTiming: 'Current schedule', // Would need actual timing data
            suggestedTiming: suggestedTime,
            reason: `You often experience ${symptom} around ${this.formatHour(peakHour)}`,
            confidence: 0.75
          };
        }
      }
    }

    return null;
  }

  private detectImprovements(vitals: Vital[], symptoms: Symptom[]): string[] {
    const improvements: string[] = [];
    
    // Check for reducing symptom frequency
    const recentSymptoms = symptoms.filter(s => {
      const loggedAt = new Date(s.logged_at || s.id);
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return loggedAt > weekAgo;
    });

    const thisWeekCount = recentSymptoms.filter(s => {
      const loggedAt = new Date(s.logged_at || s.id);
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      return loggedAt > threeDaysAgo;
    }).length;

    const lastWeekCount = recentSymptoms.filter(s => {
      const loggedAt = new Date(s.logged_at || s.id);
      const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      return loggedAt <= threeDaysAgo && loggedAt > sixDaysAgo;
    }).length;

    if (thisWeekCount < lastWeekCount * 0.7) {
      improvements.push('symptom frequency has decreased');
    }

    // Check for stable vitals
    const stableVitals = this.checkVitalsStability(vitals);
    if (stableVitals) {
      improvements.push('vital signs are staying within normal ranges');
    }

    return improvements;
  }

  private assessCaregiverBurnout(vitals: Vital[], symptoms: Symptom[]): CaregiverBurnoutIndicators {
    // This would analyze usage patterns, frequency of entries, etc.
    // For now, return a basic assessment
    return {
      lateNightActivity: 20,
      frequentLogging: 30,
      patientSymptomSpikes: 15,
      overallRisk: 'moderate'
    };
  }

  private findPeakHour(hourlyData: number[]): number {
    const maxCount = Math.max(...hourlyData);
    return maxCount > 1 ? hourlyData.indexOf(maxCount) : -1;
  }

  private calculateOptimalMedicationTime(peakSymptomHour: number, symptom: string): string {
    // Suggest taking medication 30-60 minutes before peak symptom time
    const optimalHour = (peakSymptomHour - 1 + 24) % 24;
    return this.formatHour(optimalHour);
  }

  private formatHour(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  }

  private checkVitalsStability(vitals: Vital[]): boolean {
    const recentVitals = vitals.filter(v => {
      const measuredAt = new Date(v.measured_at);
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      return measuredAt > threeDaysAgo;
    });

    const outOfRangeCount = recentVitals.filter(v => v.out_of_range).length;
    return outOfRangeCount === 0 && recentVitals.length >= 3;
  }

  private mergeInsights(existing: AIInsight[], newInsights: AIInsight[]): AIInsight[] {
    // Remove expired insights and avoid duplicates
    const validExisting = existing.filter(insight => !this.isExpired(insight));
    
    const merged = [...validExisting];
    
    newInsights.forEach(newInsight => {
      const existingIndex = merged.findIndex(existing => 
        existing.type === newInsight.type && 
        this.isSimilarInsight(existing, newInsight)
      );
      
      if (existingIndex >= 0) {
        merged[existingIndex] = newInsight; // Update existing
      } else {
        merged.push(newInsight); // Add new
      }
    });

    return merged.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private isExpired(insight: AIInsight): boolean {
    return insight.validUntil ? new Date() > insight.validUntil : false;
  }

  private isSimilarInsight(insight1: AIInsight, insight2: AIInsight): boolean {
    return insight1.type === insight2.type && 
           insight1.title === insight2.title;
  }

  dismissInsight(insightId: string): void {
    this.insights = this.insights.filter(insight => insight.id !== insightId);
  }

  getInsightsByPriority(priority: 'low' | 'medium' | 'high' | 'urgent'): AIInsight[] {
    return this.insights.filter(insight => insight.priority === priority);
  }

  getActionableInsights(): AIInsight[] {
    return this.insights.filter(insight => insight.actionable);
  }
}