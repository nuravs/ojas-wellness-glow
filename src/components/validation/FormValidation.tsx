
import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export interface ValidationRule {
  field: string;
  message: string;
  isValid: boolean;
}

export interface FormValidationProps {
  rules: ValidationRule[];
  showSuccess?: boolean;
  className?: string;
}

const FormValidation: React.FC<FormValidationProps> = ({ 
  rules, 
  showSuccess = false,
  className = ''
}) => {
  const errors = rules.filter(rule => !rule.isValid);
  const validCount = rules.filter(rule => rule.isValid).length;

  if (errors.length === 0 && !showSuccess) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Show success state */}
      {showSuccess && errors.length === 0 && (
        <div className="flex items-center gap-2 text-sm text-ojas-success">
          <CheckCircle className="h-4 w-4" />
          <span>All fields are valid ({validCount}/{rules.length})</span>
        </div>
      )}

      {/* Show errors */}
      {errors.map((rule, index) => (
        <div key={index} className="flex items-center gap-2 text-sm text-ojas-error">
          <AlertCircle className="h-4 w-4" />
          <span>{rule.message}</span>
        </div>
      ))}
    </div>
  );
};

export default FormValidation;
