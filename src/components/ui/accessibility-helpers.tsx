
import React from 'react';
import { cn } from '@/lib/utils';

// Screen reader only text
export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sr-only">{children}</span>
);

// Skip to main content link
export const SkipToMain: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-ojas-primary text-white px-4 py-2 rounded z-50"
  >
    Skip to main content
  </a>
);

// Focus trap for modals
export const FocusTrap: React.FC<{ 
  children: React.ReactNode;
  className?: string;
  autoFocus?: boolean;
}> = ({ children, className, autoFocus = true }) => {
  const trapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!autoFocus) return;

    const trap = trapRef.current;
    if (!trap) return;

    const focusableElements = trap.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [autoFocus]);

  return (
    <div ref={trapRef} className={cn('focus-trap', className)}>
      {children}
    </div>
  );
};

// High contrast indicator
export const HighContrastIndicator: React.FC = () => {
  const [highContrast, setHighContrast] = React.useState(false);

  React.useEffect(() => {
    const checkHighContrast = () => {
      const isHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      setHighContrast(isHighContrast);
    };

    checkHighContrast();
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    mediaQuery.addEventListener('change', checkHighContrast);

    return () => mediaQuery.removeEventListener('change', checkHighContrast);
  }, []);

  if (!highContrast) return null;

  return (
    <div className="fixed top-0 right-0 bg-white text-black px-2 py-1 text-xs z-50 border border-black">
      High Contrast Mode
    </div>
  );
};
