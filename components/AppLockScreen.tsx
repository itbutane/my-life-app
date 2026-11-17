import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, AppState } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useApp } from '../hooks/AppContext';
import { useTheme } from '../hooks/useTheme';

export const AppLockGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { backupConfig } = useApp();
  const { themeColors } = useTheme();
  const enabled = backupConfig?.security?.biometricLock ?? false;
  const [checking, setChecking] = React.useState(true);
  const [supported, setSupported] = React.useState<boolean | null>(null);
  const [unlocked, setUnlocked] = React.useState(!enabled);
  const [error, setError] = React.useState<string | null>(null);

  const authenticate = React.useCallback(async () => {
    if (!enabled) { setUnlocked(true); return; }
    if (Platform.OS === 'web') { setUnlocked(true); return; }
    setError(null);
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !enrolled) {
        setSupported(false);
        setUnlocked(true); // don't lock out if device cannot auth
        return;
      }
      setSupported(true);
      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: 'ورود به زندگی من',
        fallbackLabel: 'استفاده از رمز دستگاه',
        cancelLabel: 'انصراف',
        disableDeviceFallback: false,
      });
      if (res.success) setUnlocked(true);
      else if (res.error !== 'user_cancel' && res.error !== 'system_cancel' && res.error !== 'app_cancel') {
        setError('احراز هویت ناموفق بود. دوباره تلاش کنید.');
      }
    } catch (e) {
      setError('خطا در احراز هویت.');
      setUnlocked(true);
    } finally {
      setChecking(false);
    }
  }, [enabled]);

  React.useEffect(() => {
    if (!enabled) { setUnlocked(true); setChecking(false); return; }
    setUnlocked(false);
    setChecking(true);
    void authenticate();
  }, [enabled, authenticate]);

  React.useEffect(() => {
    if (!enabled) return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && !unlocked) void authenticate();
      if (state.match(/inactive|background/)) setUnlocked(false);
    });
    return () => sub.remove();
  }, [enabled, unlocked, authenticate]);

  if (!enabled || unlocked) return <>{children}</>;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={styles.icon}>🔒</Text>
      <Text style={[styles.title, { color: themeColors.text }]}>برنامه قفل است</Text>
      <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
        برای ورود از اثر انگشت یا تشخیص چهره استفاده کنید
      </Text>
      {checking ? (
        <ActivityIndicator size="large" color={themeColors.primary} style={{ marginTop: 24 }} />
      ) : (
        <>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.primary }]} onPress={() => void authenticate()}>
            <Text style={styles.buttonText}>ورود با اثر انگشت / تشخیص چهره</Text>
          </TouchableOpacity>
          <Text style={[styles.hint, { color: themeColors.textSecondary }]}>
            در صورت عدم پشتیبانی دستگاه، دسترسی بدون قفل ادامه می‌یابد.
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  error: { color: '#E17055', marginTop: 16, textAlign: 'center' },
  button: { marginTop: 24, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  hint: { marginTop: 20, fontSize: 12, textAlign: 'center', lineHeight: 18 },
});
