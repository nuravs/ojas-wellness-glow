
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('ojas-dark-mode');
    const savedFontSize = localStorage.getItem('ojas-font-size');
    const savedHighContrast = localStorage.getItem('ojas-high-contrast');
    const savedReducedMotion = localStorage.getItem('ojas-reduced-motion');
    
    if (savedTheme === 'true') {
      setIsDarkMode(true);
    }
    
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
    }

    if (savedHighContrast === 'true') {
      setHighContrast(true);
    }
    
    if (savedReducedMotion === 'true') {
      setReducedMotion(true);
    }

    // Respect system preferences
    const mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mediaQueryContrast = window.matchMedia('(prefers-contrast: high)');
    
    if (mediaQueryMotion.matches && savedReducedMotion === null) {
      setReducedMotion(true);
    }
    
    if (mediaQueryContrast.matches && savedHighContrast === null) {
      setHighContrast(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ojas-dark-mode', isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('ojas-font-size', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('ojas-high-contrast', highContrast.toString());
  }, [highContrast]);

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    localStorage.setItem('ojas-reduced-motion', reducedMotion.toString());
  }, [reducedMotion]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleHighContrast = () => setHighContrast(!highContrast);
  const toggleReducedMotion = () => setReducedMotion(!reducedMotion);

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode, 
      fontSize, 
      setFontSize, 
      highContrast, 
      toggleHighContrast, 
      reducedMotion, 
      toggleReducedMotion 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
