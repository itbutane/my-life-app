import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../hooks/AppContext';
import { toPersianDigits } from '../utils/jalali';

type ScopeKey = 'all' | 'calendar' | 'memories' | 'gallery' | 'dreams' | 'capsules' | 'wellness' | 'coloring' | 'notifications' | 'family' | 'settings';

interface SearchItem {
  id: string;
  scope: Exclude<ScopeKey, 'all'>;
  icon: string;
  title: string;
  subtitle: string;
  keywords: string;
  route: string;
  date?: string;
}

const SCOPES: { key: ScopeKey; label: string; icon: string }[] = [
  { key: 'all', label: 'همه', icon: '🔎' },
  { key: 'calendar', label: 'تقویم', icon: '📅' },
  { key: 'memories', label: 'خاطرات', icon: '📖' },
  { key: 'gallery', label: 'گالری', icon: '🖼️' },
  { key: 'dreams', label: 'رویاها', icon: '🌙' },
  { key: 'capsules', label: 'کپسول زمان', icon: '⏳' },
  { key: 'wellness', label: 'سلامت و روان', icon: '🌿' },
  { key: 'coloring', label: 'رنگ‌آمیزی', icon: '🎨' },
  { key: 'notifications', label: 'اعلان‌ها', icon: '🔔' },
  { key: 'family', label: 'خانواده', icon: '👨‍👩‍👧' },
  { key: 'settings', label: 'تنظیمات', icon: '⚙️' },
];

const SETTINGS_INDEX: SearchItem[] = [
  { id: 'set-family', scope: 'settings', icon: '👨‍👩‍👧', title: 'خانواده من و نقش‌ها', subtitle: 'پروفایل اعضا، نام، آواتار، تاریخ تولد و دسترسی‌ها', keywords: 'خانواده عضو پروفایل نقش نام آواتار تاریخ تولد دسترسی ویرایش', route: '/(tabs)/profile' },
  { id: 'set-appearance', scope: 'settings', icon: '🎨', title: 'ظاهر و تم', subtitle: 'روشن/تاریک/خودکار، رنگ، انیمیشن و تم‌های فصلی', keywords: 'ظاهر تم رنگ روشن تاریک خودکار انیمیشن حرکت فصل', route: '/(tabs)/profile' },
  { id: 'set-notify', scope: 'settings', icon: '🔔', title: 'اعلان‌ها، صدا و زبان', subtitle: 'اعلان روزانه، موسیقی پس‌زمینه، زبان و تقویم', keywords: 'اعلان صدا موسیقی زبان تقویم هشدار', route: '/(tabs)/profile' },
  { id: 'set-data', scope: 'settings', icon: '💾', title: 'داده، همگام‌سازی و بروزرسانی', subtitle: 'پشتیبان‌گیری، انتقال دستگاه، سینک و بروزرسانی', keywords: 'داده همگام سینک sync پشتیبان بکاپ خروجی بروزرسانی ذخیره آفلاین فایل', route: '/(tabs)/profile' },
  { id: 'set-security', scope: 'settings', icon: '🔒', title: 'امنیت و حریم خصوصی', subtitle: 'قفل بیومتریک، رمزنگاری، 2FA و حالت خصوصی', keywords: 'امنیت حریم بیومتریک اثر انگشت چهره رمز قفل 2FA رمزنگاری کپسول', route: '/(tabs)/profile' },
  { id: 'set-backup', scope: 'settings', icon: '🗂️', title: 'پشتیبان‌گیری و بازیابی', subtitle: 'ساخت فایل پشتیبان و بازگردانی داده‌ها', keywords: 'پشتیبان بکاپ بازیابی restore backup فایل json', route: '/(tabs)/profile' },
  { id: 'set-update', scope: 'settings', icon: '🔄', title: 'بروزرسانی برنامه', subtitle: 'بررسی بروزرسانی، تاریخچه و بازگردانی نسخه', keywords: 'بروزرسانی نسخه update rollback تاریخچه', route: '/(tabs)/profile' },
  { id: 'set-tech', scope: 'settings', icon: '🗺️', title: 'نقشه برنامه و اطلاعات فنی', subtitle: 'رودمپ، معماری، دیاگرام وابستگی و فلوچارت', keywords: 'نقشه رودمپ معماری دیاگرام وابستگی فلوچارت فنی الگوریتم', route: '/(tabs)/profile' },
  { id: 'set-devbridge', scope: 'settings', icon: '🛠️', title: 'پل توسعه (Dev Bridge)', subtitle: 'اجرای دستورهای محدود از گوشی روی کامپیوتر', keywords: 'پل توسعه dev bridge کامپیوتر دستور typecheck export', route: '/' },
];

const RECENT_KEY = 'my-life-recent-searches';
const MAX_RECENT = 6;

interface HighlightProps {
  text: string;
  tokens: string[];
  highlightColor: string;
}

const Highlight: React.FC<HighlightProps> = ({ text, tokens, highlightColor }) => {
  const parts = React.useMemo(() => {
    const source = text || '';
    const usable = tokens.filter(token => token.length >= 2);
    if (!source || usable.length === 0) return [source];
    const escaped = usable
      .map(token => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .sort((a, b) => b.length - a.length)
      .join('|');
    let regex: RegExp;
    try {
      regex = new RegExp(`(${escaped})`, 'gi');
    } catch {
      return [source];
    }
    return source.split(regex).filter(part => part !== '');
  }, [text, tokens]);

  const lowered = tokens.map(token => token.toLowerCase());

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = lowered.includes(part.toLowerCase());
        if (!isMatch) return <Text key={index}>{part}</Text>;
        return (
          <Text key={index} style={{ color: highlightColor, fontWeight: '800' }}>
            {part}
          </Text>
        );
      })}
    </>
  );
};

const normalize = (value: string) =>
  (value || '')
    .toString()
    .replace(/[\u064A]/g, 'ی')
    .replace(/[\u0643]/g, 'ک')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/\u200c/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const fmtDate = (value?: string) => {
  if (!value) return '';
  try {
    return toPersianDigits(value.slice(0, 10));
  } catch {
    return value;
  }
};

export default function SearchScreen() {
  const router = useRouter();
  const { themeColors, isDark } = useTheme();
  const app = useApp();
  const params = useLocalSearchParams<{ q?: string; scope?: string }>();
  const initialQuery = typeof params?.q === 'string' ? params.q : '';
  const initialScope = (SCOPES.find(item => item.key === params?.scope)?.key || 'all') as ScopeKey;
  const [query, setQuery] = React.useState(initialQuery);
  const [scope, setScope] = React.useState<ScopeKey>(initialScope);
  const [recent, setRecent] = React.useState<string[]>([]);

  React.useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(RECENT_KEY)
      .then(value => {
        if (!alive || !value) return;
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) setRecent(parsed.filter(item => typeof item === 'string').slice(0, MAX_RECENT));
        } catch {
          /* ignore malformed cache */
        }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const rememberQuery = React.useCallback((value: string) => {
    const trimmed = (value || '').trim();
    if (trimmed.length < 2) return;
    setRecent(prev => {
      const next = [trimmed, ...prev.filter(item => item !== trimmed)].slice(0, MAX_RECENT);
      AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const clearRecent = () => {
    setRecent([]);
    AsyncStorage.removeItem(RECENT_KEY).catch(() => {});
  };
  const inputRef = React.useRef<TextInput | null>(null);

  const items = React.useMemo<SearchItem[]>(() => {
    const out: SearchItem[] = [];

    (app.calendarEvents || []).forEach((ev: any) => {
      out.push({
        id: `ev-${ev.id}`,
        scope: 'calendar',
        icon: ev.emoji || '📌',
        title: ev.title || 'بدون عنوان',
        subtitle: ev.kind === 'achievement' ? 'دستاورد' : 'رویداد تقویم',
        keywords: `${ev.title} ${ev.description || ''} ${ev.kind || ''} ${ev.date || ''}`,
        route: '/(tabs)/calendar',
        date: fmtDate(ev.date),
      });
    });

    (app.memories || []).forEach((m: any) => {
      out.push({
        id: `mem-${m.id}`,
        scope: 'memories',
        icon: '📖',
        title: (m.content || '').slice(0, 60) || 'خاطره',
        subtitle: `${m.type === 'memory' ? 'خاطره' : m.type === 'wish' ? 'آرزو' : m.type === 'love' ? 'عشق' : 'میراث'} • ${m.author || ''}`,
        keywords: `${m.content || ''} ${m.type || ''} ${m.author || ''} ${(m.stickers || []).join(' ')}`,
        route: '/(tabs)/memories',
        date: fmtDate(m.date),
      });
    });

    (app.galleryPhotos || []).forEach((p: any) => {
      out.push({
        id: `gal-${p.id}`,
        scope: 'gallery',
        icon: '🖼️',
        title: p.title || 'عکس',
        subtitle: `${p.description || 'بدون توضیح'} • ${p.memberId || ''}`,
        keywords: `${p.title || ''} ${p.description || ''} ${(p.tags || []).join(' ')} ${p.memberId || ''}`,
        route: '/(tabs)/gallery',
        date: fmtDate(p.date),
      });
    });

    (app.dreamWorlds || []).forEach((w: any) => {
      out.push({
        id: `dw-${w.id}`,
        scope: 'dreams',
        icon: '🌙',
        title: `دنیای رویا: ${w.name || ''}`,
        subtitle: w.description || 'دنیای رویا',
        keywords: `${w.name || ''} ${w.description || ''} ${(w.themes || []).join(' ')}`,
        route: '/(tabs)/wellness',
      });
      (w.entries || []).forEach((e: any) => {
        out.push({
          id: `de-${e.id}`,
          scope: 'dreams',
          icon: '💤',
          title: e.title || 'رویا',
          subtitle: `${e.date ? fmtDate(e.date) : ''} ${e.symbols?.length ? `• ${e.symbols.length} نماد` : ''}`.trim(),
          keywords: `${e.title || ''} ${e.description || ''} ${(e.symbols || []).map((s: any) => s.symbol).join(' ')} ${(e.emotions || []).join(' ')} ${e.interpretation?.modernPsychology || ''}`,
          route: '/(tabs)/wellness',
          date: fmtDate(e.date),
        });
      });
    });

    (app.timeCapsules || []).forEach((c: any) => {
      out.push({
        id: `tc-${c.id}`,
        scope: 'capsules',
        icon: '⏳',
        title: c.title || 'کپسول زمان',
        subtitle: `${c.isLocked ? 'قفل' : 'باز'} • بازگشایی: ${c.targetDate ? fmtDate(c.targetDate) : '—'}`,
        keywords: `${c.title || ''} ${c.description || ''} ${c.targetEvent || ''} ${(c.content || []).map((x: any) => x.title + ' ' + x.content).join(' ')}`,
        route: '/(tabs)/wellness',
        date: fmtDate(c.targetDate),
      });
    });

    (app.therapyExercises || []).forEach((ex: any) => {
      out.push({
        id: `th-${ex.id}`,
        scope: 'wellness',
        icon: '🧘',
        title: ex.title || 'تمرین درمانی',
        subtitle: `${ex.category || ex.type || 'تمرین'} • ${ex.duration || 0} دقیقه${ex.completed ? ' • انجام شده' : ''}`,
        keywords: `${ex.title || ''} ${ex.description || ''} ${ex.category || ''} ${(ex.instructions || []).join(' ')}`,
        route: '/(tabs)/wellness',
      });
    });

    (app.therapySessions || []).forEach((s: any) => {
      out.push({
        id: `ts-${s.id}`,
        scope: 'wellness',
        icon: '🗣️',
        title: s.title || 'جلسه درمان خانواده',
        subtitle: `${s.date ? fmtDate(s.date) : ''} ${s.completed ? '• انجام شده' : '• در انتظار'}`,
        keywords: `${s.title || ''} ${s.description || ''} ${s.focus || ''}`,
        route: '/(tabs)/wellness',
        date: fmtDate(s.date),
      });
    });

    (app.healthActivities || []).forEach((h: any) => {
      out.push({
        id: `ha-${h.id}`,
        scope: 'wellness',
        icon: '🏃',
        title: h.title || 'فعالیت سلامت',
        subtitle: `${h.category || ''} • ${h.duration || 0} دقیقه${h.completed ? ' • انجام شده' : ''}`,
        keywords: `${h.title || ''} ${h.notes || ''} ${h.category || ''}`,
        route: '/(tabs)/wellness',
        date: fmtDate(h.date),
      });
    });

    (app.healthPlans || []).forEach((h: any) => {
      out.push({
        id: `hp-${h.id}`,
        scope: 'wellness',
        icon: '📋',
        title: h.title || 'برنامه سلامت',
        subtitle: `هدف هفتگی: ${h.weeklyTargetMinutes || 0} دقیقه`,
        keywords: `${h.title || ''} ${h.category || ''}`,
        route: '/(tabs)/wellness',
      });
    });

    (app.emotionEntries || []).forEach((e: any) => {
      out.push({
        id: `em-${e.id}`,
        scope: 'wellness',
        icon: '💭',
        title: `احساس: ${e.emotion || ''}`,
        subtitle: `${e.date ? fmtDate(e.date) : ''} ${e.time || ''} • شدت ${e.intensity || 0}/10`,
        keywords: `${e.emotion || ''} ${e.notes || ''} ${(e.triggers || []).join(' ')} ${(e.tags || []).join(' ')}`,
        route: '/(tabs)/wellness',
        date: fmtDate(e.date),
      });
    });

    (app.wellnessCheckIns || []).forEach((c: any) => {
      out.push({
        id: `wc-${c.id}`,
        scope: 'wellness',
        icon: '✅',
        title: `چک‌این: ${c.mood || ''}`,
        subtitle: `انرژی ${c.energy || 0}/10 • خواب ${c.sleep || 0} ساعت • استرس ${c.stress || 0}/10`,
        keywords: `${c.mood || ''} ${c.notes || ''} ${c.appetite || ''}`,
        route: '/(tabs)/wellness',
        date: fmtDate(c.date),
      });
    });

    (app.coloringPages || []).forEach((p: any) => {
      out.push({
        id: `cp-${p.id}`,
        scope: 'coloring',
        icon: '🎨',
        title: p.title || 'صفحه رنگ‌آمیزی',
        subtitle: `${p.strokes?.length || 0} قلم‌ضربه • ${p.guide?.length || 0} راهنما`,
        keywords: `${p.title || ''} ${p.note || ''} ${(p.guide || []).map((g: any) => g.label || g.color || '').join(' ')}`,
        route: '/',
        date: fmtDate(p.date),
      });
    });

    (app.notifications || []).forEach((n: any) => {
      out.push({
        id: `nt-${n.id}`,
        scope: 'notifications',
        icon: '🔔',
        title: n.title || 'اعلان',
        subtitle: n.message || '',
        keywords: `${n.title || ''} ${n.message || ''} ${n.type || ''}`,
        route: '/',
        date: fmtDate(n.createdAt),
      });
    });

    (app.familyMembers || []).forEach((m: any) => {
      out.push({
        id: `fm-${m.id}`,
        scope: 'family',
        icon: m.avatarEmoji || '🙂',
        title: m.name || m.id,
        subtitle: `${m.birthDate ? fmtDate(m.birthDate) : 'بدون تاریخ تولد'} • ${m.id === app.activeMemberId ? 'نقش فعال' : 'عضو خانواده'}`,
        keywords: `${m.name || ''} ${m.id || ''} ${m.birthDate || ''}`,
        route: '/(tabs)/profile',
      });
    });

    (app.parentingResources || []).forEach((r: any) => {
      out.push({
        id: `pr-${r.id}`,
        scope: 'wellness',
        icon: '👶',
        title: r.title || 'منبع فرزندپروری',
        subtitle: r.category || 'فرزندپروری',
        keywords: `${r.title || ''} ${r.description || ''} ${r.category || ''}`,
        route: '/(tabs)/wellness',
      });
    });

    (app.parentingQuickGuides || []).forEach((g: any) => {
      out.push({
        id: `pg-${g.id}`,
        scope: 'wellness',
        icon: '📘',
        title: g.title || 'راهنمای سریع',
        subtitle: g.category || 'راهنمای فرزندپروری',
        keywords: `${g.title || ''} ${g.description || ''} ${g.category || ''}`,
        route: '/(tabs)/wellness',
      });
    });

    (app.counselorSessions || []).forEach((c: any) => {
      out.push({
        id: `cs-${c.id}`,
        scope: 'wellness',
        icon: '🧑‍⚕️',
        title: c.title || 'جلسه مشاور',
        subtitle: `${c.date ? fmtDate(c.date) : ''} ${c.status || ''}`,
        keywords: `${c.title || ''} ${c.notes || ''} ${c.focus || ''}`,
        route: '/(tabs)/wellness',
        date: fmtDate(c.date),
      });
    });

    SETTINGS_INDEX.forEach(item => out.push(item));

    return out;
  }, [app]);

  const tokens = React.useMemo(() => normalize(query).split(' ').filter(Boolean), [query]);
  const queryTokens = React.useMemo(() => query.split(/\s+/).map(part => part.trim()).filter(part => part.length >= 2), [query]);

  // remember a query once typing settles (deep-linked queries included)
  React.useEffect(() => {
    if (tokens.length === 0) return undefined;
    const handle = setTimeout(() => rememberQuery(query), 1500);
    return () => clearTimeout(handle);
  }, [query, tokens.length, rememberQuery]);

  const results = React.useMemo(() => {
    if (tokens.length === 0) return [] as SearchItem[];
    return items
      .filter(item => scope === 'all' || item.scope === scope)
      .map(item => {
        const haystack = normalize(`${item.title} ${item.subtitle} ${item.keywords}`);
        const score = tokens.reduce((acc, token) => (haystack.includes(token) ? acc + (normalize(item.title).includes(token) ? 2 : 1) : acc - 100), 0);
        return { item, score };
      })
      .filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(entry => entry.item);
  }, [items, tokens, scope]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, SearchItem[]>();
    results.forEach(item => {
      const list = map.get(item.scope) || [];
      list.push(item);
      map.set(item.scope, list);
    });
    return Array.from(map.entries());
  }, [results]);

  const scopeLabel = (key: string) => SCOPES.find(s => s.key === key)?.label || key;

  React.useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery]);

  React.useEffect(() => {
    if (params?.scope) setScope(initialScope);
  }, [params?.scope, initialScope]);

  const go = (item: SearchItem) => {
    rememberQuery(query);
    const path = item.route === '/' ? '/' : item.route;
    try {
      router.push(path as any);
    } catch {
      router.replace('/(tabs)' as any);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top', 'left', 'right'] as const}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={themeColors.background} translucent />

      <View style={[styles.header, { borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10} style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)' }]}>
          <Text style={{ color: themeColors.text, fontSize: 16 }}>→</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>جستجو در زندگی من</Text>
      </View>

      <View style={[styles.searchBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
        <Text style={styles.searchIcon}>🔎</Text>
        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={setQuery}
          placeholder="جستجوی رویداد، خاطره، رویا، کپسول، تنظیمات..."
          placeholderTextColor={themeColors.textSecondary}
          style={[styles.searchInput, { color: themeColors.text }]}
          autoFocus={Platform.OS !== 'web'}
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={() => rememberQuery(query)}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); inputRef.current?.focus(); }} hitSlop={8}>
            <Text style={[styles.searchClear, { color: themeColors.textSecondary }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scopeRow}
        keyboardShouldPersistTaps="handled"
        style={styles.scopeScroll}
      >
        {SCOPES.map(item => {
          const active = scope === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => setScope(item.key)}
              style={[
                styles.scopeChip,
                {
                  backgroundColor: active ? themeColors.primary : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
                  borderColor: active ? themeColors.primary : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'),
                },
              ]}
            >
              <Text style={[styles.scopeText, { color: active ? '#fff' : themeColors.text }]}>{item.icon} {item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
        {tokens.length === 0 ? (
          <View>
            <Text style={[styles.sectionHint, { color: themeColors.textSecondary }]}>
              عبارت موردنظر را بنویسید؛ جستجو در همه بخش‌های برنامه انجام می‌شود.
            </Text>
            <View style={styles.quickRow}>
              {['تولد', 'بکاپ', 'رویا', 'کپسول', 'آیلتس', 'بیومتریک', 'ورزش'].map(word => (
                <TouchableOpacity key={word} onPress={() => setQuery(word)} style={[styles.quickChip, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,107,157,0.08)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,157,0.2)' }]}>
                  <Text style={[styles.quickText, { color: themeColors.primary }]}>{word}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.statLine, { color: themeColors.textSecondary }]}>
              {toPersianDigits(items.length)} مورد قابل جستجو ایندکس شده است.
            </Text>

            {recent.length > 0 && (
              <View style={{ marginTop: 16 }}>
                <View style={styles.recentHeader}>
                  <Text style={[styles.recentTitle, { color: themeColors.text }]}>جستجوهای اخیر</Text>
                  <TouchableOpacity onPress={clearRecent} hitSlop={8} accessibilityRole="button">
                    <Text style={[styles.recentClear, { color: themeColors.textSecondary }]}>پاک کردن</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.quickRow}>
                  {recent.map(word => (
                    <TouchableOpacity
                      key={word}
                      onPress={() => setQuery(word)}
                      style={[styles.quickChip, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)' }]}
                      accessibilityRole="button"
                    >
                      <Text style={[styles.quickText, { color: themeColors.text }]}>🕘 {word}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={[styles.emptyTitle, { color: themeColors.text }]}>چیزی پیدا نشد</Text>
            <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
              عبارت «{query}» در این بخش نتیجه‌ای نداشت. محدوده جستجو را روی «همه» بگذارید یا عبارت کوتاه‌تری بنویسید.
            </Text>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            <Text style={[styles.resultCount, { color: themeColors.textSecondary }]}>
              {toPersianDigits(results.length)} نتیجه برای «{query}»
            </Text>
            {grouped.map(([key, list]) => (
              <View key={key}>
                <Text style={[styles.groupTitle, { color: themeColors.text }]}>{scopeLabel(key)} ({toPersianDigits(list.length)})</Text>
                <View style={{ gap: 8, marginTop: 6 }}>
                  {list.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => go(item)}
                      style={[styles.resultCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}
                      accessibilityRole="button"
                    >
                      <Text style={styles.resultIcon}>{item.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.resultTitle, { color: themeColors.text }]} numberOfLines={1}>
                          <Highlight text={item.title} tokens={queryTokens} highlightColor={themeColors.primary} />
                        </Text>
                        <Text style={[styles.resultSubtitle, { color: themeColors.textSecondary }]} numberOfLines={2}>
                          <Highlight text={item.subtitle} tokens={queryTokens} highlightColor={themeColors.primary} />
                        </Text>
                        <Text style={[styles.resultMeta, { color: themeColors.textSecondary }]}>
                          {item.date ? `${item.date} • ` : ''}{scopeLabel(item.scope)}
                        </Text>
                      </View>
                      <Text style={[styles.resultArrow, { color: themeColors.primary }]}>›</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
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
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginTop: 12, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14, borderWidth: 1 },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 2 },
  searchClear: { fontSize: 14, fontWeight: '700', paddingHorizontal: 4 },
  scopeScroll: { flexGrow: 0, marginTop: 10 },
  scopeRow: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  scopeChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12, borderWidth: 1 },
  scopeText: { fontSize: 12, fontWeight: '700' },
  sectionHint: { fontSize: 13, lineHeight: 20, marginBottom: 12 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  quickChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12, borderWidth: 1 },
  quickText: { fontSize: 12, fontWeight: '700' },
  statLine: { fontSize: 12 },
  recentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  recentTitle: { fontSize: 13, fontWeight: '800' },
  recentClear: { fontSize: 12 },
  resultCount: { fontSize: 13, fontWeight: '700' },
  groupTitle: { fontSize: 14, fontWeight: '800' },
  resultCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 14, borderWidth: 1 },
  resultIcon: { fontSize: 20 },
  resultTitle: { fontSize: 14, fontWeight: '700' },
  resultSubtitle: { fontSize: 12, marginTop: 2 },
  resultMeta: { fontSize: 11, marginTop: 3 },
  resultArrow: { fontSize: 20, fontWeight: '800' },
  emptyState: { alignItems: 'center', gap: 8, paddingVertical: 40 },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '800' },
  emptyText: { fontSize: 13, lineHeight: 20, textAlign: 'center', paddingHorizontal: 12 },
});