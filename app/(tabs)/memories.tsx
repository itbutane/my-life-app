import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { MemoryBook } from '../../components/MemoryBook';
import { useApp } from '../../hooks/AppContext';

export const MemoriesScreen: React.FC = () => {
  const { themeColors, isDark } = useTheme();
  const { memories, addMemory, updateMemory, deleteMemory, familyMembers, daughterName, settings } = useApp();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top', 'left', 'right'] as const}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={themeColors.background} translucent />
      
      <View style={styles.container}>
        <View style={[styles.header, { borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>📖 دفتر خاطرات</Text>
          <Text style={[styles.headerSubtitle, { color: themeColors.textSecondary }]}>
            {memories.length} خاطره ثبت شده
          </Text>
        </View>
        
        <MemoryBook
          memories={memories}
          familyMembers={familyMembers}
          onAddMemory={addMemory}
          onUpdateMemory={updateMemory}
          onDeleteMemory={deleteMemory}
          animated={!settings.reducedMotion}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default MemoriesScreen;