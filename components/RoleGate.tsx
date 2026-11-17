import React from 'react';
import { useApp } from '../hooks/AppContext';
import { RoleSelectScreen } from './RoleSelectScreen';

export const RoleGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, activeMemberId } = useApp();
  const [confirmed, setConfirmed] = React.useState(false);

  // Show role selection on first run or when user hasn't confirmed in this session
  // but keep activeMemberId persisted. Show once per app session if not explicitly set before? 
  // We'll show if settings.activeMemberId missing (first run).
  const needsSelection = !settings?.activeMemberId && !confirmed;

  if (needsSelection) {
    return <RoleSelectScreen onSelected={() => setConfirmed(true)} />;
  }
  return <>{children}</>;
};
