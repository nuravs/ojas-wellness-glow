import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Image } from 'lucide-react';

interface PhotoInputProps {
  onPhotoCapture: (file: File) => void;
  onPhotoRemove?: () => void;
  capturedPhoto?: string;
  disabled?: boolean;
  label?: string;
}

const PhotoInput: React.FC<PhotoInputProps> = ({
  onPhotoCapture,
  onPhotoRemove,
  capturedPhoto,
  disabled = false,
  label = "Add photo (optional)"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onPhotoCapture(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  if (capturedPhoto) {
    return (
      <div className="relative">
        <h4 className="text-sm font-medium text-ojas-charcoal-gray dark:text-ojas-mist-white mb-2">
          {label}
        </h4>
        <div className="relative inline-block">
          <img
            src={capturedPhoto}
            alt="Captured"
            className="w-32 h-32 object-cover rounded-xl border-2 border-ojas-cloud-silver"
          />
          {onPhotoRemove && (
            <button
              onClick={onPhotoRemove}
              className="absolute -top-2 -right-2 w-6 h-6 bg-ojas-vibrant-coral text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              aria-label="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h4 className="text-sm font-medium text-ojas-charcoal-gray dark:text-ojas-mist-white mb-2">
        {label}
      </h4>
      
      <div
        onClick={openFileDialog}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
          ${isDragOver && !disabled
            ? 'border-ojas-primary-blue bg-ojas-primary-blue/5'
            : 'border-ojas-cloud-silver hover:border-ojas-slate-gray'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
        `}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-ojas-cloud-silver flex items-center justify-center">
            <Camera className="w-6 h-6 text-ojas-slate-gray" />
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-ojas-charcoal-gray">
              Tap to take photo or upload
            </p>
            <p className="text-xs text-ojas-slate-gray mt-1">
              Drag and drop files here
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Camera className="w-4 h-4 text-ojas-slate-gray" />
            <span className="text-xs text-ojas-slate-gray">Camera</span>
            <Upload className="w-4 h-4 text-ojas-slate-gray ml-2" />
            <span className="text-xs text-ojas-slate-gray">Upload</span>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default PhotoInput;