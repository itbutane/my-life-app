import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

const icons: Record<string, string> = {
  index: '🏠',
  memories: '📖',
  gallery: '🖼️',
  calendar: '📅',
  learning: '📚',
  'ai-path': '🚀',
  wellness: '🌿',
  profile: '⚙️',
};

export default function TabLayout() {
  const { themeColors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const active = themeColors.primary;
  const inactive = isDark ? '#636E72' : '#B2BEC3';
  const bg = isDark ? themeColors.surface : '#FFFFFF';

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: inactive,
        tabBarStyle: {
          backgroundColor: bg,
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: 8 + insets.bottom,
          paddingHorizontal: 8,
          height: 72 + insets.bottom,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 2 },
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.55 }}>
            {icons[route.name] || '•'}
          </Text>
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'خانه' }} />
      <Tabs.Screen name="memories" options={{ title: 'خاطرات' }} />
      <Tabs.Screen name="gallery" options={{ title: 'گالری' }} />
      <Tabs.Screen name="calendar" options={{ title: 'تقویم' }} />
      <Tabs.Screen name="learning" options={{ title: 'یادگیری' }} />
      <Tabs.Screen name="ai-path" options={{ title: 'رشد' }} />
      <Tabs.Screen name="wellness" options={{ title: 'دنیای من' }} />
      <Tabs.Screen name="profile" options={{ title: 'تنظیمات' }} />
    </Tabs>
  );
}