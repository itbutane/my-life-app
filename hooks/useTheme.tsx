import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { getThemeColors, ThemeColors } from '../constants/design';
import type { ThemePreset } from '../types';

interface ThemeContextType {
  isDark: boolean;
  themeColors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark' | 'auto') => void;
  themeMode: 'light' | 'dark' | 'auto';
  themePreset: ThemePreset;
  setThemePreset: (preset: ThemePreset) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: ReactNode; initialMode?: 'light' | 'dark' | 'auto'; initialPreset?: ThemePreset }> = ({ 
  children, 
  initialMode = 'auto',
  initialPreset = 'joy',
}) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>(initialMode);
  const [isDark, setIsDark] = useState(false);
  const [themePreset, setThemePresetState] = useState<ThemePreset>(initialPreset);
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    const updateTheme = () => {
      if (themeMode === 'auto') {
        setIsDark(systemColorScheme === 'dark');
      } else {
        setIsDark(themeMode === 'dark');
      }
    };
    updateTheme();
    
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeMode === 'auto') {
        setIsDark(colorScheme === 'dark');
      }
    });
    return () => listener.remove();
  }, [themeMode, systemColorScheme]);

  const themeColors = getThemeColors(isDark, themePreset);

  const toggleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'auto';
      return 'light';
    });
  };

  const setTheme = (mode: 'light' | 'dark' | 'auto') => {
    setThemeMode(mode);
  };

  const setThemePreset = (preset: ThemePreset) => {
    setThemePresetState(preset);
  };

  return (
    <ThemeContext.Provider value={{ isDark, themeColors, toggleTheme, setTheme, themeMode, themePreset, setThemePreset }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};