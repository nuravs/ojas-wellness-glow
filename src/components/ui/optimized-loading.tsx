
import React from 'react';
import { useAppStore } from '../../stores/appStore';
import { cn } from '@/lib/utils';

// Skeleton loading component
export const SkeletonLoader: React.FC<{
  className?: string;
  lines?: number;
  avatar?: boolean;
}> = ({ className, lines = 1, avatar = false }) => (
  <div className={cn("animate-pulse", className)}>
    {avatar && (
      <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
    )}
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-gray-200 rounded",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  </div>
);

// Enhanced loading states
export const LoadingSpinner: React.FC<{
  size?: 'small' | 'medium' | 'large';
  className?: string;
}> = ({ size = 'medium', className }) => {
  const sizeClass = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  }[size];

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-ojas-neutral-300 border-t-ojas-primary-blue",
        sizeClass,
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Progressive loading component
export const ProgressiveLoader: React.FC<{
  progress: number;
  label?: string;
  className?: string;
}> = ({ progress, label, className }) => (
  <div className={cn("w-full", className)}>
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium text-ojas-charcoal-gray">
        {label || 'Loading...'}
      </span>
      <span className="text-sm text-ojas-slate-gray">
        {Math.round(progress)}%
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-ojas-primary-blue h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  </div>
);

// Global loading overlay
export const GlobalLoadingOverlay: React.FC = () => {
  const isLoading = useAppStore((state) => state.isLoading);
  const error = useAppStore((state) => state.error);

  if (!isLoading && !error) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
        {isLoading && (
          <div className="flex items-center space-x-3">
            <LoadingSpinner size="medium" />
            <span className="text-ojas-charcoal-gray">Loading...</span>
          </div>
        )}
        {error && (
          <div className="text-center">
            <div className="text-red-500 text-2xl mb-2">⚠</div>
            <p className="text-ojas-charcoal-gray mb-4">{error}</p>
            <button
              onClick={() => useAppStore.getState().clearError()}
              className="bg-ojas-primary-blue text-white px-4 py-2 rounded-md hover:bg-ojas-primary-blue/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
