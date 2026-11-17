import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { FamilyMember } from '../../types';
import { UnicornAvatar } from '../../components/UnicornAvatar';
import { LifeFlower } from '../../components/LifeFlower';
import { HappyCalendar } from '../../components/HappyCalendar';
import { MemoryBook } from '../../components/MemoryBook';
import { ColoringBook } from '../../components/ColoringBook';
import { MOTIVATIONAL_QUOTES } from '../../constants/data';
import { toPersianDigits } from '../../utils/jalali';
import { getThemeDecor } from '../../constants/design';
import { useApp } from '../../hooks/AppContext';

import EmotionCharacterWorld from '../../components/EmotionCharacters';

export const HomeScreen: React.FC = () => {
  const { themeColors, isDark } = useTheme();
  const router = useRouter();
  styles = React.useMemo(() => createStyles(themeColors, isDark), [themeColors, isDark]);
  const {
    familyMembers,
    daughterName,
    lifeFlower,
    bloomPetal,
    memories,
    calendarEvents,
    coloringPages,
    addCalendarEvent,
    dailyPlan,
    xpState,
    nightWonders,
    getTodaysWonder,
    settings,
    toggleTheme,
    notifications,
    activeMemberId,
    markNotificationRead,
    dailySteps,
    setDailySteps,
    addXP,
    appUpdateState,
  } = useApp();
  const unreadForMember = (notifications || []).filter((n: any) => !(n.readBy || []).includes(activeMemberId));
  const unreadCount = unreadForMember.length;
  const activeMember = (familyMembers || []).find((m: any) => m.id === activeMemberId) || (familyMembers || [])[0];
  const activeMemberName = activeMember?.name || 'من';
  const todayStr = new Date().toISOString().split('T')[0];
  const stepsInfo = dailySteps?.[activeMemberId as keyof typeof dailySteps] || { date: todayStr, steps: 0, goal: 6000 };
  const stepsToday = stepsInfo.date === todayStr ? (stepsInfo.steps || 0) : 0;
  const stepsGoal = stepsInfo.goal || 6000;
  const stepsPct = Math.min(100, Math.round((stepsToday / Math.max(1, stepsGoal)) * 100));
  const familyStepsGoals = (familyMembers || []).reduce((acc: { met: number; total: number }, m: any) => {
    const e = (dailySteps as any)?.[m.id];
    const s = e?.date === todayStr ? (e.steps || 0) : 0;
    const g = e?.goal || 0;
    if (g > 0) { acc.total += 1; if (s >= g) acc.met += 1; }
    return acc;
  }, { met: 0, total: 0 });
  const familyStepsTotal = (familyMembers || []).reduce((sum: number, m: any) => {
    const e = (dailySteps as any)?.[m.id];
    return sum + (e?.date === todayStr ? (e.steps || 0) : 0);
  }, 0);
  const quickAddSteps = (amount: number) => {
    const next = stepsToday + amount;
    const reachedNow = next >= stepsGoal && stepsToday < stepsGoal;
    setDailySteps(activeMemberId as any, next, stepsGoal);
    addXP(amount >= 1000 ? 5 : 2);
    if (reachedNow) {
      Alert.alert('🎉 هدف انجام شد!', `گام امروز: ${toPersianDigits(next)} • هدف: ${toPersianDigits(stepsGoal)}\nهدف روزانه تکمیل شد (+۲۰ XP پاداش هدف).`);
    }
  };
  const formatFaDateTime = (iso?: string) => {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleString('fa-IR'); } catch { return iso; }
  };
  const onlineNow = typeof navigator !== 'undefined' ? !!(navigator as any).onLine : true;
  const lastUpdatedTs = appUpdateState?.lastUpdatedAt ? Date.parse(appUpdateState.lastUpdatedAt) : 0;
  const lastSyncTs = settings?.sync?.lastSyncAt ? Date.parse(settings.sync.lastSyncAt) : 0;
  const hasUnsyncedChanges = !!(lastUpdatedTs && (!lastSyncTs || lastUpdatedTs > lastSyncTs + 1000));

  const [entranceAnim] = React.useState(() => new Animated.Value(0));
  const [quoteAnim] = React.useState(() => new Animated.Value(0));

  React.useEffect(() => {
    if (settings.reducedMotion) {
      entranceAnim.setValue(1);
      quoteAnim.setValue(1);
      return;
    }
    Animated.sequence([
      Animated.timing(entranceAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.delay(300),
      Animated.timing(quoteAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [entranceAnim, quoteAnim, settings.reducedMotion]);

  const todayWonder = getTodaysWonder();
  const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];

  const themeDecor = getThemeDecor((settings.themePreset as any) || 'joy');
  const containerStyle = isDark ? styles.containerDark : styles.containerLight;

  return (
    <SafeAreaView style={[styles.safeArea, containerStyle]} edges={['top', 'left', 'right'] as const}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={themeColors.background} translucent />
      
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { opacity: entranceAnim, transform: [{ translateY: entranceAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }] },
          ]}
        >
          <View style={styles.headerLeft}>
            <Text style={styles.appTitle}>🏠 زندگی من</Text>
            <Text style={styles.appSubtitle}>(مامان، بابا، {daughterName})</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => router.push('/notifications' as any)}
              accessibilityRole="button"
              accessibilityLabel="مرکز اعلان‌ها"
              hitSlop={8}
            >
              <Text style={styles.headerIconText}>🔔</Text>
              {unreadCount > 0 && (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{unreadCount > 9 ? '۹+' : toPersianDigits(unreadCount)}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => router.push('/search' as any)}
              accessibilityRole="button"
              accessibilityLabel="جستجو در برنامه"
              hitSlop={8}
            >
              <Text style={styles.headerIconText}>🔎</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.themeButton} onPress={toggleTheme} accessibilityRole="button">
              <Text style={styles.themeButtonText}>
                {settings.theme === 'auto' ? '⚙️' : isDark ? '☀️' : '🌙'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Family Avatars */}
        <Animated.View
          style={[
            styles.section,
            { opacity: entranceAnim, transform: [{ translateY: entranceAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] },
          ]}
        >
          <Text style={styles.sectionTitle}>👨‍👩‍👧 خانواده من</Text>
          <View style={styles.avatarRow}>
            {familyMembers.map((member: FamilyMember) => (
              <UnicornAvatar
                key={member.id}
                member={member}
                size={100}
                showQuote={true}
                animated={!settings.reducedMotion}
              />
            ))}
          </View>
        </Animated.View>

        {/* Life Flower */}
        <Animated.View
          style={[
            styles.section,
            { opacity: entranceAnim, transform: [{ translateY: entranceAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] },
          ]}
        >
          <LifeFlower state={lifeFlower} onBloom={bloomPetal} size={260} animated={!settings.reducedMotion} />
        </Animated.View>

        {/* Daily Quote */}
        <Animated.View
          style={[
            styles.quoteCard,
            { opacity: quoteAnim, transform: [{ scale: quoteAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] },
          ]}
        >
          <Text style={styles.quoteIcon}>💫</Text>
          <Text style={styles.quoteText}>{randomQuote}</Text>
          <Text style={styles.quoteAuthor}>— گل زندگی</Text>
        </Animated.View>

        {/* XP & Streak */}
        <Animated.View
          style={[
            styles.statsRow,
            { opacity: entranceAnim, transform: [{ translateY: entranceAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] },
          ]}
        >
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{xpState.currentStreak}</Text>
            <Text style={styles.statLabel}>روز متوالی</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>{xpState.totalXP}</Text>
            <Text style={styles.statLabel}>امتیاز کل</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statValue}>سطح {xpState.level}</Text>
            <Text style={styles.statLabel}>پیشرفت</Text>
          </View>
        </Animated.View>

        {/* Today's Wonder */}
        {todayWonder && (
          <Animated.View
            style={[
              styles.wonderCard,
              { opacity: entranceAnim, transform: [{ translateY: entranceAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] },
            ]}
          >
            <View style={styles.wonderHeader}>
              <Text style={styles.wonderEmoji}>{todayWonder.type === 'animal' ? '🦋' : '⭐'}</Text>
              <View style={styles.wonderInfo}>
                <Text style={styles.wonderTitle}>{todayWonder.nameFa} ({todayWonder.name})</Text>
                <Text style={styles.wonderCategory}>{todayWonder.type === 'animal' ? 'حیوانات شگفت‌انگیز' : 'صورت‌های فلکی'}</Text>
              </View>
            </View>
            <Text style={styles.wonderDescription}>{todayWonder.descriptionFa}</Text>
            <View style={styles.wonderFunFact}>
              <Text style={styles.funFactLabel}>💡 دانستنی:</Text>
              <Text style={styles.funFactText}>{todayWonder.funFactFa}</Text>
            </View>
          </Animated.View>
        )}

        {/* Quick Stats */}
        <Animated.View
          style={[
            styles.quickStats,
            { opacity: entranceAnim, transform: [{ translateY: entranceAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) }] },
          ]}
        >
          <Text style={styles.sectionTitle}>📊 امروز</Text>
          <TouchableOpacity
            style={styles.statusHomeCard}
            onPress={() => router.push('/(tabs)/profile' as any)}
            accessibilityRole="button"
            accessibilityLabel="وضعیت همگام‌سازی و بروزرسانی"
          >
            <View style={styles.stepsHomeHeader}>
              <Text style={styles.stepsHomeIcon}>{onlineNow ? '☁️' : '📴'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepsHomeTitle}>وضعیت داده و همگام‌سازی</Text>
                <Text style={styles.statusHomeValue}>{onlineNow ? 'آنلاین' : 'آفلاین/نامشخص'} • آخرین همگام‌سازی: {formatFaDateTime(settings?.sync?.lastSyncAt)}{settings?.sync?.lastSyncFrom ? ` (از ${settings.sync.lastSyncFrom})` : ''}</Text>
              </View>
              <Text style={[styles.stepsHomePct, hasUnsyncedChanges ? { color: '#E17055' } : null]}>{hasUnsyncedChanges ? 'نیاز به همگام‌سازی' : ((settings?.sync?.autoSyncOnReconnect && settings?.sync?.internetSyncEnabled) ? 'خودکار' : 'دستی')}</Text>
            </View>
            <Text style={styles.stepsHomeHint}>آخرین بررسی اتصال: {formatFaDateTime(appUpdateState?.lastConnectedAt)} • آخرین تغییر ثبت‌شده: {formatFaDateTime(appUpdateState?.lastUpdatedAt)}{hasUnsyncedChanges ? ' • تغییرات جدید همگام‌سازی نشده‌اند' : ''} • مدیریت در تنظیمات</Text>
          </TouchableOpacity>
          <View style={styles.stepsHomeCard}>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/wellness' as any)}
              accessibilityRole="button"
              accessibilityLabel="رفتن به تندرستی و ثبت گام"
            >
              <View style={styles.stepsHomeHeader}>
                <Text style={styles.stepsHomeIcon}>👣</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepsHomeTitle}>گام امروز • {activeMemberName}</Text>
                  <Text style={styles.stepsHomeValue}>{toPersianDigits(stepsToday)}/{toPersianDigits(stepsGoal)}</Text>
                </View>
                <Text style={styles.stepsHomePct}>{toPersianDigits(stepsPct)}٪</Text>
              </View>
              <View style={styles.stepsHomeTrack}>
                <View style={[styles.stepsHomeFill, { width: `${stepsPct}%`, backgroundColor: stepsPct >= 100 ? '#00B894' : themeColors.primary }]} />
              </View>
              <Text style={styles.stepsHomeHint}>
                {stepsPct >= 100 ? '🎉 هدف امروز تکمیل شد (+۲۰ XP) — جزئیات در تندرستی' : `باقی‌مانده: ${toPersianDigits(Math.max(0, stepsGoal - stepsToday))} گام`}
                {familyStepsGoals.total > 0 ? ` • خانواده: ${toPersianDigits(familyStepsGoals.met)}/${toPersianDigits(familyStepsGoals.total)} هدف` : ''}
                {familyStepsTotal > 0 ? ` • مجموع: ${toPersianDigits(familyStepsTotal)} گام` : ''}
              </Text>
            </TouchableOpacity>
            <View style={styles.stepsHomeActions}>
              <TouchableOpacity style={styles.stepsHomeActionBtn} onPress={() => quickAddSteps(500)} accessibilityRole="button">
                <Text style={styles.stepsHomeActionText}>+۵۰۰</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.stepsHomeActionBtn, { backgroundColor: isDark ? 'rgba(78,205,196,0.18)' : 'rgba(78,205,196,0.15)' }]} onPress={() => quickAddSteps(1000)} accessibilityRole="button">
                <Text style={styles.stepsHomeActionText}>+۱۰۰۰</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.stepsHomeActionBtn, { flex: 1 }]} onPress={() => router.push('/(tabs)/wellness' as any)} accessibilityRole="button">
                <Text style={styles.stepsHomeActionText}>ثبت دقیق</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.statsGrid}>
            <TouchableOpacity style={styles.quickStatCard} onPress={() => router.push('/(tabs)/memories' as any)} accessibilityRole="button" accessibilityLabel="رفتن به خاطرات">
              <Text style={styles.quickStatIcon}>📸</Text>
              <Text style={styles.quickStatValue}>{toPersianDigits(memories.length)}</Text>
              <Text style={styles.quickStatLabel}>خاطره</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickStatCard} onPress={() => router.push('/(tabs)/calendar' as any)} accessibilityRole="button" accessibilityLabel="رفتن به تقویم و رویدادها">
              <Text style={styles.quickStatIcon}>📅</Text>
              <Text style={styles.quickStatValue}>{toPersianDigits(calendarEvents.length)}</Text>
              <Text style={styles.quickStatLabel}>رویداد</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickStatCard} onPress={() => router.push('/(tabs)/coloring' as any)} accessibilityRole="button" accessibilityLabel="رفتن به رنگ‌آمیزی">
              <Text style={styles.quickStatIcon}>🎨</Text>
              <Text style={styles.quickStatValue}>{toPersianDigits(coloringPages.length)}</Text>
              <Text style={styles.quickStatLabel}>نقاشی</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickStatCard} onPress={() => router.push('/(tabs)/profile' as any)} accessibilityRole="button" accessibilityLabel="رفتن به پروفایل و گل زندگی">
              <Text style={styles.quickStatIcon}>🌸</Text>
              <Text style={styles.quickStatValue}>{toPersianDigits(lifeFlower.petals)}/{toPersianDigits(12)}</Text>
              <Text style={styles.quickStatLabel}>گلبرگ</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Inside Out & Dream Productions characters */}
        <EmotionCharacterWorld />

        


        {/* Notifications */}
        {unreadCount > 0 && (
          <Animated.View style={[styles.section, { opacity: entranceAnim }]}>
            <Text style={styles.sectionTitle}>🔔 اعلان‌های جدید ({unreadCount})</Text>
            <View style={[styles.wonderCard, { borderLeftWidth: 4, borderLeftColor: themeColors.primary }]}>
              <Text style={styles.wonderEmoji}>📣</Text>
              <View style={styles.wonderContent}>
                <Text style={styles.wonderTitle}>اعلان‌های جدید برای شما</Text>
                <Text style={styles.wonderText}>
                  {unreadForMember.slice(0,3).map((n: any) => `• ${n.title}: ${n.message}`).join('\n')}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  <TouchableOpacity
                    style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, backgroundColor: themeColors.primary }}
                    onPress={() => router.push('/notifications' as any)}
                    accessibilityRole="button"
                  >
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>مرکز اعلان‌ها ({toPersianDigits(unreadCount)})</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: themeColors.primary }}
                    onPress={() => { unreadForMember.forEach((n: any) => markNotificationRead(n.id, activeMemberId as any)); }}
                    accessibilityRole="button"
                  >
                    <Text style={{ color: themeColors.primary, fontWeight: '700', fontSize: 13 }}>خواندن همه</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Motivational Footer */}
        <Animated.View
          style={[
            styles.motivationalFooter,
            { opacity: entranceAnim, transform: [{ translateY: entranceAnim.interpolate({ inputRange: [0, 1], outputRange: [70, 0] }) }] },
          ]}
        >
          <Text style={styles.motivationalText}>
            «با جوی، غم، اضطراب و تیم استودیو رویا، هر روز یک ماجراجوی تازه در ذهن توست»
          </Text>
          <View style={styles.springFlowers}>
            {themeDecor.slice(0, 6).map((color: string, i: number) => (
              <View key={i} style={[styles.flowerDot, { backgroundColor: color }]} />
            ))}
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (tc: any, isDark: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: tc.background,
  },
  containerDark: {
    backgroundColor: tc.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 160,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flex: 1,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: tc.text,
  },
  appSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: tc.textSecondary,
    marginTop: 2,
  },
  themeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    fontSize: 18,
  },
  headerBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: '#E17055',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  themeButtonText: {
    fontSize: 22,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: tc.text,
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  quoteCard: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#FF6B9D',
    alignItems: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  quoteIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  quoteAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: tc.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    minWidth: 80,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FF6B9D',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: tc.textSecondary,
    marginTop: 2,
  },
  wonderCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(162,155,254,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(162,155,254,0.3)',
  },
  wonderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wonderEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  wonderInfo: {
    flex: 1,
  },
  wonderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: tc.text,
  },
  wonderCategory: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A29BFE',
    marginTop: 2,
  },
  wonderDescription: {
    fontSize: 14,
    color: tc.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  wonderFunFact: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(162,155,254,0.3)',
  },
  funFactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A29BFE',
    marginBottom: 4,
  },
  funFactText: {
    fontSize: 13,
    color: tc.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  quickStats: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  quickStatCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: tc.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  quickStatIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickStatValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF6B9D',
  },
  quickStatLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: tc.textSecondary,
    marginTop: 4,
  },
  stepsHomeCard: {
    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
  },
  stepsHomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepsHomeIcon: {
    fontSize: 28,
  },
  stepsHomeTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: tc.textSecondary,
  },
  stepsHomeValue: {
    fontSize: 18,
    fontWeight: '800',
    color: tc.text,
    marginTop: 2,
  },
  stepsHomePct: {
    fontSize: 14,
    fontWeight: '700',
    color: tc.primary,
  },
  stepsHomeTrack: {
    height: 8,
    borderRadius: 6,
    backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : '#EAECEF',
    overflow: 'hidden',
    marginTop: 10,
  },
  stepsHomeFill: {
    height: '100%',
    borderRadius: 6,
  },
  stepsHomeHint: {
    marginTop: 8,
    fontSize: 12,
    color: tc.textSecondary,
  },
  stepsHomeActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  stepsHomeActionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsHomeActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: tc.text,
  },
  motivationalFooter: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255,107,157,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,157,0.2)',
    alignItems: 'center',
  },
  motivationalText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B9D',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 16,
  },
  springFlowers: {
    flexDirection: 'row',
    gap: 8,
  },
  flowerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
let styles: any = createStyles({ background:"#FFF8F0", surface:"#fff", text:"#1F2937", textSecondary:"#4B5563", textMuted:"#9CA3AF", primary:"#FF6B9D" }, false);

export default HomeScreen;