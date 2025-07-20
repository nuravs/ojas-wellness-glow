
import React, { useState } from 'react';
import { Plus, Clock, Pill, TrendingUp } from 'lucide-react';
import MedicationTimeline from '../components/MedicationTimeline';
import SafeAreaContainer from '../components/SafeAreaContainer';
import MedicationActionsHeader from '../components/medication/MedicationActionsHeader';
import EnhancedRefillAlertsSection from '../components/medication/EnhancedRefillAlertsSection';
import MedicationsList from '../components/medication/MedicationsList';
import MedicationEmptyState from '../components/medication/MedicationEmptyState';
import { useMedications } from '../hooks/useMedications';
import { useRefillAlerts } from '../hooks/useRefillAlerts';
import { useMedicationLogs } from '../hooks/useMedicationLogs';
import { toast } from '../hooks/use-toast';

interface MedicationsPageProps {
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    time: string;
    taken: boolean;
    caregiver_visible?: boolean;
    logged_by_role?: 'patient' | 'caregiver';
  }>;
  onToggleMedication: (id: string) => void;
  onPostponeMedication: (id: string) => void;
  onAddMedication: () => void;
  userRole?: 'patient' | 'caregiver';
}

const MedicationsPage: React.FC<MedicationsPageProps> = ({ 
  medications: propMedications, 
  onToggleMedication: propOnToggleMedication, 
  onPostponeMedication: propOnPostponeMedication,
  onAddMedication: propOnAddMedication,
  userRole = 'patient'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'schedule' | 'medications' | 'adherence'>('schedule');
  
  const { 
    medications, 
    loading, 
    toggleMedication, 
    postponeMedication, 
    addMedication,
    toggleCaregiverVisibility 
  } = useMedications();
  const { refillAlerts, dismissAlert, handleRefill, loading: refillLoading } = useRefillAlerts();
  const { medicationLogs } = useMedicationLogs();
  
  // Use hook data if available, fallback to props
  const activeMedications = medications.length > 0 ? medications : propMedications;
  const pendingMeds = activeMedications.filter(med => !med.taken);
  const completedMeds = activeMedications.filter(med => med.taken);
  const overdueMeds = pendingMeds.filter(med => {
    const medTime = new Date(`2000/01/01 ${med.time}`);
    const now = new Date();
    const currentTime = new Date(`2000/01/01 ${now.getHours()}:${now.getMinutes()}`);
    return medTime < currentTime;
  });

  // Calculate stats for header cards
  const totalMeds = activeMedications.length;
  const takenToday = completedMeds.length;
  const overdueCount = overdueMeds.length;

  // Calculate adherence percentage
  const getAdherenceRate = () => {
    if (!medicationLogs || medicationLogs.length === 0) return 0;
    
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const recentLogs = medicationLogs.filter(log => 
      new Date(log.created_at) >= last7Days
    );
    
    const takenLogs = recentLogs.filter(log => log.status === 'taken');
    const expectedDoses = totalMeds * 7; // Assuming daily medications
    
    return expectedDoses > 0 ? Math.round((takenLogs.length / expectedDoses) * 100) : 0;
  };

  const adherenceRate = getAdherenceRate();

  const handleCameraUpload = async () => {
    setIsUploading(true);
    try {
      toast({
        title: "Camera scan",
        description: "Camera scan functionality will be implemented in a future update.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to scan prescription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddMedication = async () => {
    try {
      toast({
        title: "Add Medication",
        description: "Manual medication addition will be implemented in a future update.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add medication. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleToggleMedication = async (id: string) => {
    try {
      await toggleMedication(id);
      toast({
        title: "Medication logged",
        description: "Medication marked as taken successfully.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log medication. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePostponeMedication = async (id: string) => {
    try {
      await postponeMedication(id);
      toast({
        title: "Medication postponed",
        description: "Medication has been postponed.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to postpone medication. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-ojas-bg-light dark:bg-ojas-soft-midnight">
      <div className="overflow-y-auto pb-20" style={{ padding: '0 16px' }}>
        <SafeAreaContainer>
          {/* Header with Add Button */}
          <div className="flex items-center justify-between mb-6 pt-6">
            <div>
              <h1 className="text-2xl font-bold text-ojas-text-main mb-1">
                Medications
              </h1>
              <p className="text-sm text-ojas-text-secondary">
                Manage your medication schedule and track adherence
              </p>
            </div>
            <button
              onClick={handleAddMedication}
              className="px-4 py-2 bg-ojas-primary text-white rounded-lg font-medium hover:bg-ojas-primary-hover transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-ojas-text-main mb-1">{totalMeds}</div>
              <div className="text-sm text-ojas-text-secondary">Total Meds</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{takenToday}</div>
              <div className="text-sm text-blue-600">Taken Today</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">{overdueCount}</div>
              <div className="text-sm text-red-600">Overdue</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-6 bg-white rounded-xl p-1">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'schedule' 
                  ? 'bg-ojas-primary text-white' 
                  : 'text-ojas-text-secondary hover:text-ojas-text-main'
              }`}
            >
              <Clock className="w-4 h-4" />
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('medications')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'medications' 
                  ? 'bg-ojas-primary text-white' 
                  : 'text-ojas-text-secondary hover:text-ojas-text-main'
              }`}
            >
              <Pill className="w-4 h-4" />
              My Medications
            </button>
            <button
              onClick={() => setActiveTab('adherence')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'adherence' 
                  ? 'bg-ojas-primary text-white' 
                  : 'text-ojas-text-secondary hover:text-ojas-text-main'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Adherence
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'schedule' && (
            <div>
              {/* Today's Schedule */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-ojas-text-main">
                    Today's Schedule
                  </h2>
                  <span className="text-sm text-ojas-text-secondary">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                {activeMedications.length > 0 ? (
                  <MedicationTimeline medications={activeMedications} />
                ) : (
                  <div className="bg-white rounded-xl p-6 text-center">
                    <Pill className="w-12 h-12 text-ojas-text-secondary mx-auto mb-3" />
                    <p className="text-ojas-text-secondary">No medications scheduled for today</p>
                  </div>
                )}
              </div>

              {/* Upcoming Refills */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-ojas-text-main mb-4">
                  Upcoming Refills
                </h2>
                <EnhancedRefillAlertsSection
                  refillAlerts={refillAlerts}
                  onRefillAction={handleRefill}
                  onDismissRefill={dismissAlert}
                  loading={refillLoading}
                />
              </div>
            </div>
          )}

          {activeTab === 'medications' && (
            <div>
              {activeMedications.length === 0 ? (
                <MedicationEmptyState
                  onAddMedication={handleAddMedication}
                  onCameraUpload={handleCameraUpload}
                />
              ) : (
                <div className="space-y-4">
                  {activeMedications.map(medication => (
                    <div key={medication.id} className="bg-white rounded-xl p-4 border border-ojas-border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-ojas-primary/10 flex items-center justify-center">
                            <Pill className="w-4 h-4 text-ojas-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-ojas-text-main">{medication.name}</h3>
                            <p className="text-sm text-ojas-text-secondary">{medication.dosage} • 3x daily</p>
                          </div>
                        </div>
                        {medication.taken ? (
                          <span className="px-3 py-1 bg-ojas-success/10 text-ojas-success rounded-full text-sm font-medium">
                            Completed
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-ojas-error/10 text-ojas-error rounded-full text-sm font-medium">
                            Overdue
                          </span>
                        )}
                      </div>

                      <div className="mb-3">
                        <p className="text-sm font-medium text-ojas-text-main mb-1">Daily Schedule</p>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-ojas-bg-light rounded text-xs">08:00</span>
                          <span className="px-2 py-1 bg-ojas-bg-light rounded text-xs">14:00</span>
                          <span className="px-2 py-1 bg-ojas-bg-light rounded text-xs">20:00</span>
                        </div>
                      </div>

                      {/* Refill Alert */}
                      <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">⚠️ Refill needed by 20/1/2024</p>
                      </div>

                      <p className="text-sm text-ojas-text-secondary mb-3">Take with food to reduce nausea</p>

                      <div className="flex gap-2">
                        {!medication.taken && (
                          <button
                            onClick={() => handleToggleMedication(medication.id)}
                            className="flex-1 py-2 bg-ojas-primary text-white rounded-lg font-medium hover:bg-ojas-primary-hover transition-colors"
                          >
                            ✓ Mark as Taken
                          </button>
                        )}
                        <button className="px-4 py-2 border border-ojas-border rounded-lg text-ojas-text-secondary hover:text-ojas-text-main transition-colors">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'adherence' && (
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-lg font-semibold text-ojas-text-main mb-4">
                Medication Adherence
              </h2>
              
              {/* Adherence Score */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto relative">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#E1E4EA"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke={adherenceRate >= 80 ? '#00B488' : adherenceRate >= 60 ? '#FFC300' : '#FF4E4E'}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(adherenceRate / 100) * 314} 314`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-ojas-text-main">{adherenceRate}%</div>
                    <div className="text-sm text-ojas-text-secondary">This week</div>
                  </div>
                </div>
              </div>

              {/* Adherence Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-ojas-bg-light rounded-lg">
                  <span className="text-sm text-ojas-text-main">Doses taken on time</span>
                  <span className="text-sm font-medium text-ojas-success">{Math.round(adherenceRate * 0.9)}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-ojas-bg-light rounded-lg">
                  <span className="text-sm text-ojas-text-main">Missed doses</span>
                  <span className="text-sm font-medium text-ojas-error">{100 - adherenceRate}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-ojas-bg-light rounded-lg">
                  <span className="text-sm text-ojas-text-main">Current streak</span>
                  <span className="text-sm font-medium text-ojas-text-main">3 days</span>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">💡 Tips to improve adherence</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Set medication reminders on your phone</li>
                  <li>• Use a pill organizer for weekly planning</li>
                  <li>• Take medications at the same time daily</li>
                </ul>
              </div>
            </div>
          )}
        </SafeAreaContainer>
      </div>
    </div>
  );
};

export default MedicationsPage;
