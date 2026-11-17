import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../hooks/AppContext';
import { toPersianDigits } from '../utils/jalali';

type Filter = 'unread' | 'all' | 'achievement';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'unread', label: 'خوانده‌نشده' },
  { key: 'all', label: 'همه' },
  { key: 'achievement', label: 'دستاوردها' },
];

const TYPE_ICON: Record<string, string> = {
  achievement: '🏆',
  info: 'ℹ️',
};

const formatDate = (iso?: string) => {
  if (!iso) return '';
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    const day = date.toLocaleDateString('fa-IR', { month: 'long', day: 'numeric' });
    const time = date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    return `${day} • ${time}`;
  } catch {
    return '';
  }
};

export default function NotificationsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filter?: string }>();
  const { themeColors, isDark } = useTheme();
  const { notifications, familyMembers, activeMemberId, markNotificationRead } = useApp();

  const initialFilter = (FILTERS.find(item => item.key === params?.filter)?.key || 'unread') as Filter;
  const [filter, setFilter] = React.useState<Filter>(initialFilter);

  const memberName = (id: string) => familyMembers.find(m => m.id === id)?.name || id;

  const sorted = React.useMemo(
    () => [...(notifications || [])].sort((a: any, b: any) => (b.createdAt || '').localeCompare(a.createdAt || '')),
    [notifications]
  );

  const unreadCount = sorted.filter((n: any) => !(n.readBy || []).includes(activeMemberId)).length;

  const visible = React.useMemo(() => {
    if (filter === 'unread') return sorted.filter((n: any) => !(n.readBy || []).includes(activeMemberId));
    if (filter === 'achievement') return sorted.filter((n: any) => n.type === 'achievement');
    return sorted;
  }, [sorted, filter, activeMemberId]);

  const markAll = () => {
    sorted
      .filter((n: any) => !(n.readBy || []).includes(activeMemberId))
      .forEach((n: any) => markNotificationRead(n.id, activeMemberId));
  };

  const openRelated = (item: any) => {
    markNotificationRead(item.id, activeMemberId);
    const route = item.type === 'achievement' ? '/(tabs)/calendar' : '/(tabs)/wellness';
    try {
      router.push(route as any);
    } catch {
      router.push('/(tabs)' as any);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top', 'left', 'right'] as const}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={themeColors.background} translucent />

      <View style={[styles.header, { borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={10}
          style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)' }]}
          accessibilityRole="button"
          accessibilityLabel="بازگشت"
        >
          <Text style={{ color: themeColors.text, fontSize: 16 }}>→</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>اعلان‌ها</Text>
          <Text style={[styles.headerSubtitle, { color: themeColors.textSecondary }]}>
            {unreadCount > 0
              ? `${toPersianDigits(unreadCount)} خوانده‌نشده برای ${memberName(activeMemberId)}`
              : 'همه اعلان‌ها خوانده شده‌اند'}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAll} style={[styles.markAllBtn, { backgroundColor: themeColors.primary }]} accessibilityRole="button">
            <Text style={styles.markAllText}>خواندن همه</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map(item => {
          const active = filter === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => setFilter(item.key)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: active ? themeColors.primary : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
                  borderColor: active ? themeColors.primary : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'),
                },
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.filterText, { color: active ? '#fff' : themeColors.text }]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
        {visible.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
              {filter === 'unread' ? 'اعلان خوانده‌نشده‌ای نیست' : 'اعلانی ثبت نشده است'}
            </Text>
            <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
              با انجام فعالیت‌ها (تکمیل تمرین، کسب دستاورد، ثبت چک‌این) اعلان‌های جدید اینجا نمایش داده می‌شوند.
            </Text>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {visible.map((item: any) => {
              const unread = !(item.readBy || []).includes(activeMemberId);
              const relatedMember = familyMembers.find(m => m.id === item.memberId);
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => openRelated(item)}
                  onLongPress={() => markNotificationRead(item.id, activeMemberId)}
                  delayLongPress={350}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.title} ${item.message}`}
                  style={[
                    styles.card,
                    {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
                      borderColor: unread ? themeColors.primary : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
                      borderLeftWidth: unread ? 4 : 1,
                    },
                  ]}
                >
                  <View style={styles.cardTop}>
                    <Text style={styles.cardIcon}>{TYPE_ICON[item.type] || '🔔'}</Text>
                    <Text style={[styles.cardTitle, { color: themeColors.text }]} numberOfLines={1}>
                      {item.title || 'اعلان'}
                    </Text>
                    {unread && <View style={[styles.unreadDot, { backgroundColor: themeColors.primary }]} />}
                  </View>
                  <Text style={[styles.cardMessage, { color: themeColors.textSecondary }]}>{item.message || ''}</Text>
                  <View style={styles.cardMeta}>
                    <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
                      {[formatDate(item.createdAt), relatedMember?.name, unread ? 'خوانده‌نشده' : 'خوانده‌شده']
                        .filter(Boolean)
                        .join(' • ')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            <Text style={[styles.hint, { color: themeColors.textSecondary }]}>
              برای خواندن سریع یک اعلان، انگشت خود را روی آن نگه دارید.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  headerSubtitle: { fontSize: 12, marginTop: 2 },
  markAllBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  markAllText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 12 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  filterText: { fontSize: 12, fontWeight: '700' },
  card: { borderRadius: 14, borderWidth: 1, padding: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardIcon: { fontSize: 18 },
  cardTitle: { fontSize: 14, fontWeight: '700', flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  cardMessage: { fontSize: 12, marginTop: 4, lineHeight: 18 },
  cardMeta: { marginTop: 8 },
  metaText: { fontSize: 11 },
  emptyState: { alignItems: 'center', gap: 8, paddingVertical: 48 },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '800' },
  emptyText: { fontSize: 13, lineHeight: 20, textAlign: 'center', paddingHorizontal: 12 },
  hint: { fontSize: 11, textAlign: 'center', marginTop: 6 },
});