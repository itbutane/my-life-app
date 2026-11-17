import React from 'react';
import { Slot } from 'expo-router';
import { Providers } from '../providers';
import { ThemeProvider, useTheme } from '../hooks/useTheme';
import { AppProvider, useApp } from '../hooks/AppContext';
import { MusicProvider } from '../hooks/useMusic';
import { AppLockGate } from '../components/AppLockScreen';
import { RoleGate } from '../components/RoleGate';

const ThemeSync: React.FC = () => {
  const { settings } = useApp();
  const { setTheme, themeMode, setThemePreset, themePreset } = useTheme();
  React.useEffect(() => {
    const mode = settings?.theme || 'auto';
    if (mode !== themeMode) setTheme(mode);
  }, [settings?.theme, themeMode, setTheme]);
  React.useEffect(() => {
    const preset = (settings as any)?.themePreset || 'joy';
    if (preset !== themePreset) setThemePreset(preset);
  }, [(settings as any)?.themePreset, themePreset, setThemePreset]);
  return null;
};

export default function RootLayout() {
  return (
    <Providers>
      <ThemeProvider initialMode="auto">
        <AppProvider>
          <ThemeSync />
          <MusicProvider>
            <AppLockGate>
              <RoleGate>
                <Slot />
              </RoleGate>
            </AppLockGate>
          </MusicProvider>
        </AppProvider>
      </ThemeProvider>
    </Providers>
  );
}