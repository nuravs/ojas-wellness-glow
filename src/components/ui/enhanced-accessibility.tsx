
import React from 'react';
import { useAppStore } from '../../stores/appStore';
import { cn } from '@/lib/utils';

// Enhanced screen reader announcements
export const LiveRegion: React.FC<{
  message: string;
  priority?: 'polite' | 'assertive';
  className?: string;
}> = ({ message, priority = 'polite', className }) => (
  <div
    role="status"
    aria-live={priority}
    aria-atomic="true"
    className={cn("sr-only", className)}
  >
    {message}
  </div>
);

// Focus management component
export const FocusManager: React.FC<{
  children: React.ReactNode;
  autoFocus?: boolean;
  restoreFocus?: boolean;
}> = ({ children, autoFocus = false, restoreFocus = false }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    if (autoFocus && containerRef.current) {
      const firstFocusable = containerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    }

    return () => {
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [autoFocus, restoreFocus]);

  return <div ref={containerRef}>{children}</div>;
};

// Enhanced keyboard navigation
export const KeyboardNavigationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show focus indicators when navigating with keyboard
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return <>{children}</>;
};

// Accessible form field wrapper
export const FormField: React.FC<{
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  description?: string;
  children: React.ReactNode;
}> = ({ id, label, error, required, description, children }) => {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-ojas-charcoal-gray"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-ojas-slate-gray">
          {description}
        </p>
      )}
      
      <div
        {...(descriptionId && { 'aria-describedby': descriptionId })}
        {...(errorId && { 'aria-describedby': errorId })}
      >
        {children}
      </div>
      
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Accessible notification component
export const AccessibleNotification: React.FC<{
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onDismiss?: () => void;
}> = ({ message, type, onDismiss }) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
    }
  };

  const getColorClass = () => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div
      role="alert"
      className={cn(
        "p-4 rounded-md border flex items-start space-x-3",
        getColorClass()
      )}
    >
      <span className="text-lg flex-shrink-0" aria-hidden="true">
        {getIcon()}
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-lg hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      )}
    </div>
  );
};

// Accessibility settings component
export const AccessibilitySettings: React.FC = () => {
  const {
    fontSize,
    highContrast,
    setFontSize,
    setHighContrast,
  } = useAppStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-4">
          Accessibility Settings
        </h3>
        
        <div className="space-y-4">
          <FormField
            id="font-size"
            label="Font Size"
            description="Choose a comfortable reading size"
          >
            <select
              id="font-size"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value as any)}
              className="w-full px-3 py-2 border border-ojas-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-ojas-primary-blue"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </FormField>
          
          <FormField
            id="high-contrast"
            label="High Contrast"
            description="Increase contrast for better visibility"
          >
            <button
              id="high-contrast"
              role="switch"
              aria-checked={highContrast}
              onClick={() => setHighContrast(!highContrast)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ojas-primary-blue focus:ring-offset-2",
                highContrast ? "bg-ojas-primary-blue" : "bg-gray-200"
              )}
            >
              <span className="sr-only">Enable high contrast</span>
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  highContrast ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </FormField>
        </div>
      </div>
    </div>
  );
};
