import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../hooks/AppContext';
import { FamilyMember } from '../types';

const roleMeta: Record<FamilyMember['id'], { emoji: string; label: string; desc: string }> = {
  baba: { emoji: '👨‍🦱', label: 'بابا', desc: 'دسترسی کامل به مدیریت خانواده، تنظیمات و همگام‌سازی' },
  maman: { emoji: '👩‍🦰', label: 'مامان', desc: 'دسترسی کامل به مدیریت خانواده، سلامت، خاطرات و همگام‌سازی' },
  daughter: { emoji: '🌸', label: 'دختر', desc: 'دسترسی به خاطرات، یادگیری، برنامه روزانه و بخش‌های شخصی' },
};

export const RoleSelectScreen: React.FC<{ onSelected?: () => void }> = ({ onSelected }) => {
  const { themeColors, isDark } = useTheme();
  const { familyMembers, setActiveMemberId, activeMemberId } = useApp();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: themeColors.text }]}>ورود به خانواده</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          نقش خود را انتخاب کنید. اطلاعات روی این دستگاه به‌صورت آفلاین ذخیره می‌شود و می‌توانید بعداً با دستگاه‌های دیگر همگام‌سازی کنید.
        </Text>
        <View style={styles.cards}>
          {familyMembers.map((m) => {
            const meta = roleMeta[m.id];
            const active = activeMemberId === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.card,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#fff', borderColor: active ? themeColors.primary : 'rgba(0,0,0,0.08)' },
                  active && { borderWidth: 2 },
                ]}
                onPress={() => { setActiveMemberId(m.id); onSelected?.(); }}
              >
                <Text style={styles.emoji}>{meta.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.name, { color: themeColors.text }]}>{meta.label}</Text>
                  <Text style={[styles.desc, { color: themeColors.textSecondary }]}>{meta.desc}</Text>
                  <Text style={[styles.quote, { color: themeColors.primary }]}>{m.quote}</Text>
                </View>
                {active ? <Text style={[styles.badge, { color: themeColors.primary }]}>فعال</Text> : null}
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={[styles.infoBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,107,157,0.08)' }]}>
          <Text style={[styles.infoTitle, { color: themeColors.text }]}>ارتباط نقش‌ها و همگام‌سازی</Text>
          <Text style={[styles.infoText, { color: themeColors.textSecondary }]}>
            • بابا و مامان دسترسی مدیریتی و مشاهده/ویرایش داده‌های مشترک خانواده را دارند.{"\n"}
            • دختر به بخش‌های شخصی، یادگیری و خاطرات خود دسترسی دارد و داده‌های مشترک با خانواده در ارتباط است.{"\n"}
            • همگام‌سازی: هنگام اتصال اینترنت، یا از طریق فایل همگام‌سازی در وای‌فای، یا انتقال دستی فایل با بلوتوث/اشتراک‌گذاری از بخش تنظیمات.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  cards: { gap: 12 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, gap: 12 },
  emoji: { fontSize: 40 },
  name: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  desc: { fontSize: 13, lineHeight: 18, marginBottom: 4 },
  quote: { fontSize: 12, fontStyle: 'italic' },
  badge: { fontSize: 12, fontWeight: '700' },
  infoBox: { marginTop: 24, padding: 16, borderRadius: 16 },
  infoTitle: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
  infoText: { fontSize: 13, lineHeight: 20 },
});
