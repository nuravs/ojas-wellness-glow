
import React, { useState } from 'react';
import { Plus, ArrowLeft, Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import SafeAreaContainer from '../components/SafeAreaContainer';
import { useComorbidities, Comorbidity } from '../hooks/useComorbidities';
import ComorbidityCard from '../components/comorbidities/ComorbidityCard';
import AddComorbidityModal from '../components/comorbidities/AddComorbidityModal';

interface ComorbiditiesPageProps {
  onBack?: () => void;
}

const ComorbiditiesPage: React.FC<ComorbiditiesPageProps> = ({ onBack }) => {
  const { comorbidities, loading, addComorbidity, updateComorbidity, deleteComorbidity } = useComorbidities();
  const [showAddModal, setShowAddModal] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'controlled':
        return <CheckCircle className="w-5 h-5 text-ojas-success" />;
      case 'monitoring':
        return <Clock className="w-5 h-5 text-ojas-alert" />;
      case 'active':
        return <AlertCircle className="w-5 h-5 text-ojas-error" />;
      default:
        return <Activity className="w-5 h-5 text-ojas-text-secondary" />;
    }
  };

  const getStatusCounts = () => {
    return comorbidities.reduce((acc, condition) => {
      acc[condition.status] = (acc[condition.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-ojas-bg-light pb-28">
        <SafeAreaContainer>
          <div className="text-center pt-20">
            <div className="w-12 h-12 border-4 border-ojas-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-ojas-text-secondary">Loading your conditions...</p>
          </div>
        </SafeAreaContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ojas-bg-light pb-28">
      <SafeAreaContainer>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              style={{ minHeight: '44px', minWidth: '44px' }}
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-ojas-text-main" />
            </button>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-ojas-text-main">
              Health Conditions
            </h1>
            <p className="text-ojas-text-secondary text-sm">
              Manage your health conditions and track their status
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-3 bg-ojas-primary text-white rounded-full hover:bg-ojas-primary-hover transition-colors shadow-ojas-medium"
            style={{ minHeight: '44px', minWidth: '44px' }}
            aria-label="Add new condition"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Status Summary */}
        {comorbidities.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-ojas-soft border border-ojas-border">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-ojas-success" />
                <div>
                  <p className="text-2xl font-bold text-ojas-text-main">
                    {statusCounts.controlled || 0}
                  </p>
                  <p className="text-sm text-ojas-text-secondary">Controlled</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-ojas-soft border border-ojas-border">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-ojas-error" />
                <div>
                  <p className="text-2xl font-bold text-ojas-text-main">
                    {(statusCounts.active || 0) + (statusCounts.monitoring || 0)}
                  </p>
                  <p className="text-sm text-ojas-text-secondary">Need Attention</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conditions List */}
        <div className="space-y-4">
          {comorbidities.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-ojas-text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-ojas-text-main mb-2">
                No conditions tracked yet
              </h3>
              <p className="text-ojas-text-secondary mb-6">
                Start by adding your health conditions to better manage your care
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-ojas-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-ojas-primary-hover transition-colors shadow-ojas-medium"
                style={{ minHeight: '44px' }}
              >
                Add Your First Condition
              </button>
            </div>
          ) : (
            comorbidities.map(condition => (
              <ComorbidityCard
                key={condition.id}
                comorbidity={condition}
                onUpdate={updateComorbidity}
                onDelete={deleteComorbidity}
              />
            ))
          )}
        </div>

        {/* Add Comorbidity Modal */}
        {showAddModal && (
          <AddComorbidityModal
            onClose={() => setShowAddModal(false)}
            onAdd={addComorbidity}
          />
        )}
      </SafeAreaContainer>
    </div>
  );
};

export default ComorbiditiesPage;
