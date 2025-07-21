
import { Vital } from '@/hooks/useVitals';
import { Symptom } from '@/hooks/useSymptoms';
import { Medication } from '@/hooks/useMedications';
import { MedicationLog } from '@/hooks/useMedicationLogs';
import { addDays, subDays, format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

export interface TrendAnalysis {
  direction: 'improving' | 'worsening' | 'stable';
  confidence: number;
  timeframe: string;
  dataPoints: number;
}

export interface CorrelationInsight {
  type: 'medication_symptom' | 'vital_symptom' | 'medication_vital';
  correlation: number;
  description: string;
  confidence: number;
  actionable: boolean;
}

export interface ProactiveInsight {
  id: string;
  type: 'trend' | 'correlation' | 'prediction' | 'personalized';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  recommendations: string[];
  confidence: number;
  validUntil: Date;
  correlations?: CorrelationInsight[];
  trend?: TrendAnalysis;
  actionable: boolean;
  dismissible: boolean;
}

export class EnhancedAIInsightsEngine {
  private static instance: EnhancedAIInsightsEngine;
  
  static getInstance(): EnhancedAIInsightsEngine {
    if (!EnhancedAIInsightsEngine.instance) {
      EnhancedAIInsightsEngine.instance = new EnhancedAIInsightsEngine();
    }
    return EnhancedAIInsightsEngine.instance;
  }

  generateProactiveInsights(
    vitals: Vital[],
    symptoms: Symptom[],
    medications: Medication[],
    medicationLogs: MedicationLog[],
    userRole: 'patient' | 'caregiver' = 'patient'
  ): ProactiveInsight[] {
    const insights: ProactiveInsight[] = [];
    
    // Analyze trends
    const trendInsights = this.analyzeTrends(vitals, symptoms, medicationLogs);
    insights.push(...trendInsights);
    
    // Analyze correlations
    const correlationInsights = this.analyzeCorrelations(vitals, symptoms, medications, medicationLogs);
    insights.push(...correlationInsights);
    
    // Generate predictive insights
    const predictiveInsights = this.generatePredictiveInsights(vitals, symptoms, medications, medicationLogs);
    insights.push(...predictiveInsights);
    
    // Add personalized insights
    const personalizedInsights = this.generatePersonalizedInsights(vitals, symptoms, medications, medicationLogs, userRole);
    insights.push(...personalizedInsights);
    
    return this.prioritizeInsights(insights);
  }

  private analyzeTrends(vitals: Vital[], symptoms: Symptom[], medicationLogs: MedicationLog[]): ProactiveInsight[] {
    const insights: ProactiveInsight[] = [];
    
    // Blood pressure trend analysis
    const bpTrend = this.analyzeBPTrend(vitals);
    if (bpTrend) {
      insights.push({
        id: `bp_trend_${Date.now()}`,
        type: 'trend',
        priority: bpTrend.direction === 'worsening' ? 'high' : 'medium',
        title: `Blood Pressure ${bpTrend.direction === 'improving' ? 'Improving' : bpTrend.direction === 'worsening' ? 'Rising' : 'Stable'}`,
        message: `Your blood pressure has been ${bpTrend.direction} over the past ${bpTrend.timeframe}. ${bpTrend.confidence > 0.8 ? 'This is a clear trend.' : 'Keep monitoring closely.'}`,
        recommendations: this.getBPRecommendations(bpTrend),
        confidence: bpTrend.confidence,
        validUntil: addDays(new Date(), 7),
        trend: bpTrend,
        actionable: true,
        dismissible: bpTrend.direction === 'improving'
      });
    }
    
    // Medication adherence trend
    const adherenceTrend = this.analyzeMedicationAdherenceTrend(medicationLogs);
    if (adherenceTrend) {
      insights.push({
        id: `adherence_trend_${Date.now()}`,
        type: 'trend',
        priority: adherenceTrend.direction === 'worsening' ? 'high' : 'low',
        title: `Medication Adherence ${adherenceTrend.direction === 'improving' ? 'Improving' : adherenceTrend.direction === 'worsening' ? 'Declining' : 'Stable'}`,
        message: `Your medication consistency has been ${adherenceTrend.direction} over the past ${adherenceTrend.timeframe}.`,
        recommendations: this.getAdherenceRecommendations(adherenceTrend),
        confidence: adherenceTrend.confidence,
        validUntil: addDays(new Date(), 3),
        trend: adherenceTrend,
        actionable: true,
        dismissible: false
      });
    }
    
    // Symptom severity trend
    const symptomTrend = this.analyzeSymptomTrend(symptoms);
    if (symptomTrend) {
      insights.push({
        id: `symptom_trend_${Date.now()}`,
        type: 'trend',
        priority: symptomTrend.direction === 'worsening' ? 'high' : 'medium',
        title: `Overall Symptoms ${symptomTrend.direction === 'improving' ? 'Improving' : symptomTrend.direction === 'worsening' ? 'Worsening' : 'Stable'}`,
        message: `Your symptom severity has been ${symptomTrend.direction} over the past ${symptomTrend.timeframe}.`,
        recommendations: this.getSymptomRecommendations(symptomTrend),
        confidence: symptomTrend.confidence,
        validUntil: addDays(new Date(), 5),
        trend: symptomTrend,
        actionable: true,
        dismissible: symptomTrend.direction === 'improving'
      });
    }
    
    return insights;
  }

  private analyzeCorrelations(vitals: Vital[], symptoms: Symptom[], medications: Medication[], medicationLogs: MedicationLog[]): ProactiveInsight[] {
    const insights: ProactiveInsight[] = [];
    
    // Medication adherence vs symptom severity correlation
    const medSymptomCorr = this.analyzeMedicationSymptomCorrelation(medicationLogs, symptoms);
    if (medSymptomCorr && Math.abs(medSymptomCorr.correlation) > 0.3) {
      insights.push({
        id: `med_symptom_corr_${Date.now()}`,
        type: 'correlation',
        priority: medSymptomCorr.correlation < -0.5 ? 'medium' : 'low',
        title: 'Medication Impact on Symptoms',
        message: medSymptomCorr.description,
        recommendations: [
          medSymptomCorr.correlation < -0.3 ? 'Your medication consistency is helping reduce symptoms. Keep up the good work!' : 'Consider discussing your medication timing with your doctor.',
          'Track symptoms before and after medication doses for better insights.',
          'Set medication reminders to maintain consistency.'
        ],
        confidence: medSymptomCorr.confidence,
        validUntil: addDays(new Date(), 14),
        correlations: [medSymptomCorr],
        actionable: medSymptomCorr.actionable,
        dismissible: true
      });
    }
    
    // Blood pressure vs symptom correlation
    const bpSymptomCorr = this.analyzeBPSymptomCorrelation(vitals, symptoms);
    if (bpSymptomCorr && Math.abs(bpSymptomCorr.correlation) > 0.4) {
      insights.push({
        id: `bp_symptom_corr_${Date.now()}`,
        type: 'correlation',
        priority: 'medium',
        title: 'Blood Pressure & Symptom Connection',
        message: bpSymptomCorr.description,
        recommendations: [
          'Monitor blood pressure when experiencing dizziness or headaches',
          'Keep a note of activities before high/low readings',
          'Consider discussing this pattern with your healthcare provider'
        ],
        confidence: bpSymptomCorr.confidence,
        validUntil: addDays(new Date(), 10),
        correlations: [bpSymptomCorr],
        actionable: bpSymptomCorr.actionable,
        dismissible: true
      });
    }
    
    return insights;
  }

  private generatePredictiveInsights(vitals: Vital[], symptoms: Symptom[], medications: Medication[], medicationLogs: MedicationLog[]): ProactiveInsight[] {
    const insights: ProactiveInsight[] = [];
    
    // Predict medication refill needs
    const refillPrediction = this.predictMedicationRefills(medications, medicationLogs);
    if (refillPrediction.length > 0) {
      insights.push({
        id: `refill_prediction_${Date.now()}`,
        type: 'prediction',
        priority: 'medium',
        title: 'Upcoming Medication Refills',
        message: `Based on your usage patterns, ${refillPrediction.length} medication${refillPrediction.length > 1 ? 's' : ''} will need refilling soon.`,
        recommendations: [
          'Contact your pharmacy to schedule refills',
          'Set up auto-refill if available',
          'Keep a 7-day buffer of medications'
        ],
        confidence: 0.85,
        validUntil: addDays(new Date(), 7),
        actionable: true,
        dismissible: false
      });
    }
    
    // Predict potential health events based on patterns
    const healthEventPrediction = this.predictHealthEvents(vitals, symptoms, medicationLogs);
    if (healthEventPrediction) {
      insights.push(healthEventPrediction);
    }
    
    return insights;
  }

  private generatePersonalizedInsights(vitals: Vital[], symptoms: Symptom[], medications: Medication[], medicationLogs: MedicationLog[], userRole: 'patient' | 'caregiver'): ProactiveInsight[] {
    const insights: ProactiveInsight[] = [];
    
    // Personalized timing recommendations
    const timingInsight = this.generatePersonalizedTimingInsight(symptoms, medicationLogs);
    if (timingInsight) {
      insights.push(timingInsight);
    }
    
    // Personalized activity suggestions
    const activityInsight = this.generatePersonalizedActivityInsight(symptoms, vitals);
    if (activityInsight) {
      insights.push(activityInsight);
    }
    
    // Caregiver-specific insights
    if (userRole === 'caregiver') {
      const caregiverInsight = this.generateCaregiverInsight(vitals, symptoms, medicationLogs);
      if (caregiverInsight) {
        insights.push(caregiverInsight);
      }
    }
    
    return insights;
  }

  private analyzeBPTrend(vitals: Vital[]): TrendAnalysis | null {
    const bpReadings = vitals
      .filter(v => v.vital_type === 'blood_pressure' && v.values?.systolic && v.values?.diastolic)
      .sort((a, b) => new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime())
      .slice(-14); // Last 14 readings
    
    if (bpReadings.length < 3) return null;
    
    const systolicValues = bpReadings.map(v => v.values.systolic);
    const trend = this.calculateTrend(systolicValues);
    
    return {
      direction: trend > 0.1 ? 'worsening' : trend < -0.1 ? 'improving' : 'stable',
      confidence: Math.min(0.9, Math.abs(trend) * 2),
      timeframe: `${bpReadings.length} readings`,
      dataPoints: bpReadings.length
    };
  }

  private analyzeMedicationAdherenceTrend(medicationLogs: MedicationLog[]): TrendAnalysis | null {
    const recentLogs = medicationLogs
      .filter(log => {
        const logDate = new Date(log.created_at);
        return logDate >= subDays(new Date(), 14);
      })
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    if (recentLogs.length < 5) return null;
    
    // Calculate daily adherence rates
    const dailyRates = this.calculateDailyAdherenceRates(recentLogs);
    const trend = this.calculateTrend(dailyRates);
    
    return {
      direction: trend > 0.05 ? 'improving' : trend < -0.05 ? 'worsening' : 'stable',
      confidence: Math.min(0.85, Math.abs(trend) * 3),
      timeframe: '14 days',
      dataPoints: dailyRates.length
    };
  }

  private analyzeSymptomTrend(symptoms: Symptom[]): TrendAnalysis | null {
    const recentSymptoms = symptoms
      .filter(s => {
        const symptomDate = new Date(s.logged_at || s.id);
        return symptomDate >= subDays(new Date(), 14);
      })
      .sort((a, b) => new Date(a.logged_at || a.id).getTime() - new Date(b.logged_at || b.id).getTime());
    
    if (recentSymptoms.length < 3) return null;
    
    const severityValues = recentSymptoms.map(s => s.severity || 5);
    const trend = this.calculateTrend(severityValues);
    
    return {
      direction: trend > 0.1 ? 'worsening' : trend < -0.1 ? 'improving' : 'stable',
      confidence: Math.min(0.8, Math.abs(trend) * 2),
      timeframe: '14 days',
      dataPoints: recentSymptoms.length
    };
  }

  private analyzeMedicationSymptomCorrelation(medicationLogs: MedicationLog[], symptoms: Symptom[]): CorrelationInsight | null {
    // Group data by day and calculate correlation
    const dailyData = this.groupDataByDay(medicationLogs, symptoms);
    if (dailyData.length < 7) return null;
    
    const adherenceRates = dailyData.map(d => d.adherenceRate);
    const symptomSeverities = dailyData.map(d => d.avgSymptomSeverity);
    
    const correlation = this.calculateCorrelation(adherenceRates, symptomSeverities);
    
    if (Math.abs(correlation) < 0.3) return null;
    
    return {
      type: 'medication_symptom',
      correlation,
      description: correlation < -0.3 
        ? 'Better medication adherence is associated with reduced symptom severity.' 
        : 'There may be a connection between medication timing and symptom patterns.',
      confidence: Math.min(0.9, Math.abs(correlation)),
      actionable: true
    };
  }

  private analyzeBPSymptomCorrelation(vitals: Vital[], symptoms: Symptom[]): CorrelationInsight | null {
    const bpReadings = vitals.filter(v => v.vital_type === 'blood_pressure' && v.values?.systolic);
    const dizzinessSymptoms = symptoms.filter(s => s.symptom_type === 'dizziness' || s.symptom_type === 'giddiness');
    
    if (bpReadings.length < 5 || dizzinessSymptoms.length < 3) return null;
    
    const dailyData = this.groupBPSymptomsByDay(bpReadings, dizzinessSymptoms);
    if (dailyData.length < 5) return null;
    
    const bpValues = dailyData.map(d => d.avgBP);
    const dizzinessValues = dailyData.map(d => d.dizzinessCount);
    
    const correlation = this.calculateCorrelation(bpValues, dizzinessValues);
    
    if (Math.abs(correlation) < 0.4) return null;
    
    return {
      type: 'vital_symptom',
      correlation,
      description: correlation > 0.4 
        ? 'Higher blood pressure readings often coincide with dizziness episodes.'
        : 'Lower blood pressure readings may be associated with dizziness.',
      confidence: Math.min(0.85, Math.abs(correlation)),
      actionable: true
    };
  }

  private predictMedicationRefills(medications: Medication[], medicationLogs: MedicationLog[]): string[] {
    const refillNeeded: string[] = [];
    
    medications.forEach(med => {
      if (!med.pills_remaining || !med.daily_consumption) return;
      
      const daysRemaining = med.pills_remaining / med.daily_consumption;
      if (daysRemaining <= 7) {
        refillNeeded.push(med.name);
      }
    });
    
    return refillNeeded;
  }

  private predictHealthEvents(vitals: Vital[], symptoms: Symptom[], medicationLogs: MedicationLog[]): ProactiveInsight | null {
    // Simple prediction based on recent patterns
    const recentHighBP = vitals.filter(v => 
      v.vital_type === 'blood_pressure' && 
      v.values?.systolic > 140 &&
      new Date(v.measured_at) >= subDays(new Date(), 3)
    );
    
    const recentDizziness = symptoms.filter(s => 
      (s.symptom_type === 'dizziness' || s.symptom_type === 'giddiness') &&
      new Date(s.logged_at || s.id) >= subDays(new Date(), 3)
    );
    
    if (recentHighBP.length >= 2 && recentDizziness.length >= 2) {
      return {
        id: `health_event_prediction_${Date.now()}`,
        type: 'prediction',
        priority: 'high',
        title: 'Potential Health Event Risk',
        message: 'Recent patterns suggest increased risk of dizziness or balance issues.',
        recommendations: [
          'Move slowly when changing positions',
          'Keep a glass of water nearby',
          'Consider contacting your healthcare provider',
          'Avoid driving if feeling dizzy'
        ],
        confidence: 0.7,
        validUntil: addDays(new Date(), 2),
        actionable: true,
        dismissible: false
      };
    }
    
    return null;
  }

  private generatePersonalizedTimingInsight(symptoms: Symptom[], medicationLogs: MedicationLog[]): ProactiveInsight | null {
    // Analyze when symptoms occur vs medication timing
    const timingAnalysis = this.analyzeSymptomMedicationTiming(symptoms, medicationLogs);
    
    if (!timingAnalysis) return null;
    
    return {
      id: `timing_insight_${Date.now()}`,
      type: 'personalized',
      priority: 'medium',
      title: 'Personalized Medication Timing',
      message: `Your symptoms tend to be ${timingAnalysis.severity} ${timingAnalysis.timing}. Consider adjusting medication timing.`,
      recommendations: [
        'Discuss optimal timing with your healthcare provider',
        'Track symptoms before and after medication doses',
        'Consider splitting doses if approved by your doctor'
      ],
      confidence: 0.6,
      validUntil: addDays(new Date(), 21),
      actionable: true,
      dismissible: true
    };
  }

  private generatePersonalizedActivityInsight(symptoms: Symptom[], vitals: Vital[]): ProactiveInsight | null {
    // Analyze patterns to suggest activities
    const morningSymptoms = symptoms.filter(s => {
      const hour = new Date(s.logged_at || s.id).getHours();
      return hour >= 6 && hour <= 11;
    });
    
    if (morningSymptoms.length >= 3) {
      return {
        id: `activity_insight_${Date.now()}`,
        type: 'personalized',
        priority: 'low',
        title: 'Morning Wellness Routine',
        message: 'You often experience symptoms in the morning. A gentle routine might help.',
        recommendations: [
          'Try light stretching or breathing exercises',
          'Consider visiting the Calm Room for relaxation',
          'Stay hydrated first thing in the morning',
          'Take medications with breakfast for better absorption'
        ],
        confidence: 0.5,
        validUntil: addDays(new Date(), 7),
        actionable: true,
        dismissible: true
      };
    }
    
    return null;
  }

  private generateCaregiverInsight(vitals: Vital[], symptoms: Symptom[], medicationLogs: MedicationLog[]): ProactiveInsight | null {
    // Analyze caregiver activity patterns
    const recentActivity = medicationLogs.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate >= subDays(new Date(), 7);
    });
    
    const lateNightLogs = recentActivity.filter(log => {
      const hour = new Date(log.created_at).getHours();
      return hour >= 22 || hour <= 6;
    });
    
    if (lateNightLogs.length >= 3) {
      return {
        id: `caregiver_insight_${Date.now()}`,
        type: 'personalized',
        priority: 'medium',
        title: 'Caregiver Wellness Check',
        message: 'You\'ve been logging activity during late hours. Remember to take care of yourself too.',
        recommendations: [
          'Try to maintain regular sleep hours',
          'Consider asking family or friends for help',
          'Visit the Calm Room for relaxation',
          'Connect with caregiver support groups'
        ],
        confidence: 0.8,
        validUntil: addDays(new Date(), 3),
        actionable: true,
        dismissible: true
      };
    }
    
    return null;
  }

  // Helper methods
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, i) => sum + val * i, 0);
    const sumXX = values.reduce((sum, _, i) => sum + i * i, 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length < 2) return 0;
    
    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    const sumYY = y.reduce((sum, val) => sum + val * val, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  private groupDataByDay(medicationLogs: MedicationLog[], symptoms: Symptom[]): Array<{adherenceRate: number, avgSymptomSeverity: number}> {
    const grouped: Record<string, {logs: MedicationLog[], symptoms: Symptom[]}> = {};
    
    medicationLogs.forEach(log => {
      const day = format(new Date(log.created_at), 'yyyy-MM-dd');
      if (!grouped[day]) grouped[day] = {logs: [], symptoms: []};
      grouped[day].logs.push(log);
    });
    
    symptoms.forEach(symptom => {
      const day = format(new Date(symptom.logged_at || symptom.id), 'yyyy-MM-dd');
      if (!grouped[day]) grouped[day] = {logs: [], symptoms: []};
      grouped[day].symptoms.push(symptom);
    });
    
    return Object.values(grouped).map(data => ({
      adherenceRate: data.logs.filter(log => log.status === 'taken').length / Math.max(1, data.logs.length),
      avgSymptomSeverity: data.symptoms.reduce((sum, s) => sum + (s.severity || 5), 0) / Math.max(1, data.symptoms.length)
    }));
  }

  private groupBPSymptomsByDay(bpReadings: Vital[], symptoms: Symptom[]): Array<{avgBP: number, dizzinessCount: number}> {
    const grouped: Record<string, {bpReadings: Vital[], symptoms: Symptom[]}> = {};
    
    bpReadings.forEach(reading => {
      const day = format(new Date(reading.measured_at), 'yyyy-MM-dd');
      if (!grouped[day]) grouped[day] = {bpReadings: [], symptoms: []};
      grouped[day].bpReadings.push(reading);
    });
    
    symptoms.forEach(symptom => {
      const day = format(new Date(symptom.logged_at || symptom.id), 'yyyy-MM-dd');
      if (!grouped[day]) grouped[day] = {bpReadings: [], symptoms: []};
      grouped[day].symptoms.push(symptom);
    });
    
    return Object.values(grouped).map(data => ({
      avgBP: data.bpReadings.reduce((sum, reading) => sum + reading.values.systolic, 0) / Math.max(1, data.bpReadings.length),
      dizzinessCount: data.symptoms.length
    }));
  }

  private calculateDailyAdherenceRates(logs: MedicationLog[]): number[] {
    const grouped = logs.reduce((acc, log) => {
      const day = format(new Date(log.created_at), 'yyyy-MM-dd');
      if (!acc[day]) acc[day] = [];
      acc[day].push(log);
      return acc;
    }, {} as Record<string, MedicationLog[]>);
    
    return Object.values(grouped).map(dayLogs => 
      dayLogs.filter(log => log.status === 'taken').length / dayLogs.length
    );
  }

  private analyzeSymptomMedicationTiming(symptoms: Symptom[], medicationLogs: MedicationLog[]): {severity: string, timing: string} | null {
    if (symptoms.length < 3) return null;
    
    const morningSymptoms = symptoms.filter(s => {
      const hour = new Date(s.logged_at || s.id).getHours();
      return hour >= 6 && hour <= 11;
    });
    
    const eveningSymptoms = symptoms.filter(s => {
      const hour = new Date(s.logged_at || s.id).getHours();
      return hour >= 17 && hour <= 22;
    });
    
    if (morningSymptoms.length > eveningSymptoms.length) {
      return {
        severity: 'more severe',
        timing: 'in the morning'
      };
    } else if (eveningSymptoms.length > morningSymptoms.length) {
      return {
        severity: 'more noticeable',
        timing: 'in the evening'
      };
    }
    
    return null;
  }

  private getBPRecommendations(trend: TrendAnalysis): string[] {
    if (trend.direction === 'worsening') {
      return [
        'Monitor blood pressure more frequently',
        'Consider dietary changes (reduce sodium)',
        'Contact your healthcare provider',
        'Review current medications with your doctor'
      ];
    } else if (trend.direction === 'improving') {
      return [
        'Continue current management plan',
        'Maintain healthy lifestyle habits',
        'Keep up with regular monitoring',
        'Share this progress with your healthcare team'
      ];
    }
    
    return [
      'Continue regular monitoring',
      'Maintain current management plan',
      'Note any changes in symptoms'
    ];
  }

  private getAdherenceRecommendations(trend: TrendAnalysis): string[] {
    if (trend.direction === 'worsening') {
      return [
        'Set up medication reminders',
        'Consider using a pill organizer',
        'Link medication time to daily routines',
        'Discuss barriers with your healthcare provider'
      ];
    } else if (trend.direction === 'improving') {
      return [
        'Great job maintaining consistency!',
        'Continue current reminder system',
        'Share this progress with your healthcare team',
        'Consider helping others with similar challenges'
      ];
    }
    
    return [
      'Keep up the good work',
      'Continue current medication routine',
      'Stay consistent with timing'
    ];
  }

  private getSymptomRecommendations(trend: TrendAnalysis): string[] {
    if (trend.direction === 'worsening') {
      return [
        'Track potential triggers in symptom notes',
        'Consider discussing with your healthcare provider',
        'Review recent medication or lifestyle changes',
        'Practice stress management techniques'
      ];
    } else if (trend.direction === 'improving') {
      return [
        'Excellent progress! Keep doing what\'s working',
        'Note successful strategies for future reference',
        'Share this positive trend with your healthcare team',
        'Consider gradually increasing activity levels'
      ];
    }
    
    return [
      'Continue monitoring symptoms',
      'Maintain current management strategies',
      'Note any changes in patterns'
    ];
  }

  private prioritizeInsights(insights: ProactiveInsight[]): ProactiveInsight[] {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    
    return insights
      .sort((a, b) => {
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return b.confidence - a.confidence;
      })
      .slice(0, 5); // Limit to top 5 insights
  }
}
