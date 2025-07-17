import React, { useState, useRef } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onTranscript, 
  disabled = false,
  placeholder = "Tap the microphone to speak..." 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        setTranscript(finalTranscript);
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleMicClick = () => {
    if (disabled) return;
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-ojas-cloud-silver">
      <button
        onClick={handleMicClick}
        disabled={disabled}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 ${
          isListening 
            ? 'bg-ojas-vibrant-coral text-white animate-pulse' 
            : 'bg-ojas-primary-blue text-white hover:bg-ojas-primary-blue-hover'
        }`}
        aria-label={isListening ? 'Stop recording' : 'Start voice input'}
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        {isListening ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>
      
      <div className="flex-1">
        {isListening ? (
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-ojas-vibrant-coral rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-ojas-vibrant-coral rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-ojas-vibrant-coral rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-ojas-slate-gray">Listening...</span>
          </div>
        ) : (
          <span className="text-sm text-ojas-slate-gray">
            {transcript || placeholder}
          </span>
        )}
      </div>
    </div>
  );
};

export default VoiceInput;