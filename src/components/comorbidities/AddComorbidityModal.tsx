
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Comorbidity } from '../../hooks/useComorbidities';

interface AddComorbidityModalProps {
  onClose: () => void;
  onAdd: (comorbidity: Omit<Comorbidity, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Comorbidity | undefined>;
}

const COMMON_CONDITIONS = [
  'Diabetes',
  'Hypertension',
  'Heart Disease',
  'Osteoporosis',
  'Depression',
  'Anxiety',
  'Sleep Disorders',
  'Arthritis',
  'High Cholesterol',
  'Cognitive Issues'
];

const AddComorbidityModal: React.FC<AddComorbidityModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    condition_name: '',
    severity: 'mild' as const,
    status: 'active' as const,
    diagnosed_date: '',
    notes: '',
    caregiver_visible: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.condition_name.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        ...formData,
        condition_name: formData.condition_name.trim(),
        diagnosed_date: formData.diagnosed_date || undefined,
        notes: formData.notes.trim() || undefined
      });
      onClose();
    } catch (error) {
      console.error('Error adding condition:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConditionSelect = (condition: string) => {
    setFormData(prev => ({ ...prev, condition_name: condition }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-ojas-strong max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ojas-border">
          <h2 className="text-xl font-bold text-ojas-text-main">
            Add Health Condition
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            style={{ minHeight: '44px', minWidth: '44px' }}
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-ojas-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Common Conditions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-ojas-text-main mb-3">
              Common Conditions
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_CONDITIONS.map(condition => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => handleConditionSelect(condition)}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors text-left ${
                    formData.condition_name === condition
                      ? 'bg-ojas-primary text-white'
                      : 'bg-gray-100 text-ojas-text-main hover:bg-gray-200'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Condition Name */}
          <div className="mb-4">
            <label htmlFor="condition_name" className="block text-sm font-medium text-ojas-text-main mb-2">
              Condition Name
            </label>
            <input
              type="text"
              id="condition_name"
              value={formData.condition_name}
              onChange={(e) => setFormData(prev => ({ ...prev, condition_name: e.target.value }))}
              className="w-full px-4 py-3 border border-ojas-border rounded-xl focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
              placeholder="Enter condition name"
              required
            />
          </div>

          {/* Severity */}
          <div className="mb-4">
            <label htmlFor="severity" className="block text-sm font-medium text-ojas-text-main mb-2">
              Severity
            </label>
            <select
              id="severity"
              value={formData.severity}
              onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as any }))}
              className="w-full px-4 py-3 border border-ojas-border rounded-xl focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>

          {/* Status */}
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-ojas-text-main mb-2">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-4 py-3 border border-ojas-border rounded-xl focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="controlled">Controlled</option>
              <option value="monitoring">Monitoring</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Diagnosed Date */}
          <div className="mb-4">
            <label htmlFor="diagnosed_date" className="block text-sm font-medium text-ojas-text-main mb-2">
              Diagnosed Date (Optional)
            </label>
            <input
              type="date"
              id="diagnosed_date"
              value={formData.diagnosed_date}
              onChange={(e) => setFormData(prev => ({ ...prev, diagnosed_date: e.target.value }))}
              className="w-full px-4 py-3 border border-ojas-border rounded-xl focus:ring-2 focus:ring-ojas-primary focus:border-transparent"
            />
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-ojas-text-main mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-ojas-border rounded-xl focus:ring-2 focus:ring-ojas-primary focus:border-transparent resize-none"
              placeholder="Add any notes about this condition..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-ojas-border text-ojas-text-main rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              style={{ minHeight: '44px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.condition_name.trim()}
              className="flex-1 px-6 py-3 bg-ojas-primary text-white rounded-xl font-semibold hover:bg-ojas-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              style={{ minHeight: '44px' }}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add Condition
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddComorbidityModal;
