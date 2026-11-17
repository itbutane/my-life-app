import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const COMMANDS = ['typecheck', 'export-web', 'status'];

export const DevBridgePanel: React.FC = () => {
  const { themeColors, isDark } = useTheme();
  const [url, setUrl] = React.useState('http://192.168.1.2:8787');
  const [token, setToken] = React.useState('dev-token-change-me');
  const [log, setLog] = React.useState<string>('پل توسعه محلی (dev-only): به سرور روی کامپیوتر وصل شوید. اکستنشن Kilo Code داخل اپ قابل درج نیست؛ برای ویرایش کامل کد از IDE استفاده کنید.');
  const [busy, setBusy] = React.useState<string | null>(null);

  const run = async (name: string) => {
    setBusy(name);
    setLog(prev => prev + `\n\n$ ${name} ...`);
    try {
      const res = await fetch(url.replace(/\/$/, '') + '/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': token },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      setLog(prev => prev + `\n[${data.ok ? 'OK' : 'FAIL'} code=${data.code ?? ''}]\n${data.out || data.error || JSON.stringify(data)}`);
    } catch (e: any) {
      setLog(prev => prev + `\n[ERROR] ${e?.message || String(e)} (آیا سرور روی کامپیوتر اجرا و گوشی در همان شبکه است؟)`);
    } finally {
      setBusy(null);
    }
  };

  if (!__DEV__) return null;

  return (
    <View style={[styles.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>🛠️ پل توسعه (روی گوشی / dev-only)</Text>
      <Text style={[styles.note, { color: themeColors.textSecondary }]}>
        Kilo Code اکستنشن VS Code است و داخل اپ اجرا نمی‌شود. این پنل فقط به سرور محلی روی کامپیوتر شما وصل می‌شود تا دستورات مجاز (typecheck/build/status) را اجرا کند.
      </Text>
      <TextInput value={url} onChangeText={setUrl} placeholder="http://LAN-IP:8787" placeholderTextColor={themeColors.textMuted} autoCapitalize="none" style={[styles.input, { color: themeColors.text, borderColor: themeColors.primary }]} />
      <TextInput value={token} onChangeText={setToken} placeholder="token" placeholderTextColor={themeColors.textMuted} autoCapitalize="none" secureTextEntry style={[styles.input, { color: themeColors.text, borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' }]} />
      <View style={styles.row}>
        {COMMANDS.map(c => (
          <TouchableOpacity key={c} style={[styles.btn, { backgroundColor: themeColors.primary, opacity: busy ? 0.6 : 1 }]} onPress={() => run(c)} disabled={!!busy}>
            {busy === c ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{c}</Text>}
          </TouchableOpacity>
        ))}
      </View>
      <Text style={[styles.logTitle, { color: themeColors.text }]}>خروجی</Text>
      <ScrollView style={[styles.logBox, { backgroundColor: isDark ? '#0b1220' : '#f6f7f9' }]} nestedScrollEnabled>
        <Text selectable style={[styles.logText, { color: isDark ? '#d1d5db' : '#374151' }]}>{log}</Text>
      </ScrollView>
      <Text style={[styles.note, { color: themeColors.textSecondary, marginTop: 6 }]}>اجرای سرور در کامپیوتر: `DEV_BRIDGE_TOKEN=... node scripts/dev-bridge.mjs`</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { marginHorizontal: 20, marginBottom: 24, padding: 14, borderRadius: 16, borderWidth: 1 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  note: { fontSize: 12, lineHeight: 18, marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8, fontSize: 13 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, minWidth: 90, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  logTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  logBox: { maxHeight: 220, borderRadius: 10, padding: 10 },
  logText: { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 11, lineHeight: 16 },
});

export default DevBridgePanel;
