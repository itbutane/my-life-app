import React, { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {children}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};