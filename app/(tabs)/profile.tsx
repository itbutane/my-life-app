import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Switch, Alert, Platform, TextInput, Linking, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useApp } from '../../hooks/AppContext';
import { UnicornAvatar } from '../../components/UnicornAvatar';
import { themePresets, getThemeDecor } from '../../constants/design';
import { gregorianToJalaaliDate, jalaaliMonthLength, jalaaliToGregorianDate, JALAALI_MONTHS, toPersianDigits, toEnglishDigits, formatGregorian, formatJalaali } from '../../utils/jalali';
import { buildColoringRelief } from '../../utils/export3d';

export const ProfileScreen: React.FC = () => {
  const { themeColors, isDark, setTheme, themePreset } = useTheme();
  styles = React.useMemo(() => createStyles(themeColors, isDark), [themeColors, isDark]);
  const { 
    settings, 
    updateSettings, 
    familyMembers, 
    activeMemberId,
    setActiveMemberId,
    rolePermissions,
    updateFamilyMemberName,
    updateFamilyMemberAvatar,
    updateFamilyMemberBirthYear,
    updateFamilyMemberBirthDate,
    xpState,
    memories,
    calendarEvents,
    coloringPages,
    lifeFlower,
    galleryPhotos,
    timeCapsules,
    dreamWorlds,
    exportAppData,
    importAppData,
    exportSyncPackage,
    importSyncPackage,
    resetAllData: resetAllAppData,
    dailySteps,
    healthActivities,
    healthPlans,
    counselorSessions,
    backupConfig,
    setBiometricLock,
    enableTwoFactorAuth,
    disableTwoFactorAuth,
    setPrivateMode,
    appUpdateState,
    checkForAppUpdates,
    rollbackAppUpdate,
    clearAppUpdateHistory,
  } = useApp();

  const [editingMemberId, setEditingMemberId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState('');
  const [avatarMemberId, setAvatarMemberId] = React.useState<string | null>(null);
  const [birthPickerId, setBirthPickerId] = React.useState<string | null>(null);
  const [birthDraftDate, setBirthDraftDate] = React.useState<string>(''); // YYYY-MM-DD
  const [birthManualInput, setBirthManualInput] = React.useState<string>('');
  const [birthJy, setBirthJy] = React.useState(() => gregorianToJalaaliDate(new Date()).jy);
  const [birthJm, setBirthJm] = React.useState(() => gregorianToJalaaliDate(new Date()).jm);
  const [checkingUpdates, setCheckingUpdates] = React.useState(false);
  const [syncingNow, setSyncingNow] = React.useState(false);
  const [exportingSync, setExportingSync] = React.useState(false);
  const [importingSync, setImportingSync] = React.useState(false);
  const [exporting3D, setExporting3D] = React.useState(false);
  const [exportingBackup, setExportingBackup] = React.useState(false);
  const [importingBackup, setImportingBackup] = React.useState(false);
  const [selectedMemberId, setSelectedMemberId] = React.useState<string>(() => activeMemberId || 'maman');
  const [showTechInfo, setShowTechInfo] = React.useState(false);
  const [showRoadmapTree, setShowRoadmapTree] = React.useState(true);
  const [showDepsFlow, setShowDepsFlow] = React.useState(false);
  const [showFullFlow, setShowFullFlow] = React.useState(false);
  const [showArchitectureDiagram, setShowArchitectureDiagram] = React.useState(true);
  const [showFamilySection, setShowFamilySection] = React.useState(false);
  const [showStatsSection, setShowStatsSection] = React.useState(false);
  const [showAppearanceSection, setShowAppearanceSection] = React.useState(true);
  const [showNotificationsSection, setShowNotificationsSection] = React.useState(false);
  const [showDataSection, setShowDataSection] = React.useState(false);
  const [showSecuritySection, setShowSecuritySection] = React.useState(false);
  const [showAboutSection, setShowAboutSection] = React.useState(false);
  const [showSeasonalThemes, setShowSeasonalThemes] = React.useState(false);
  const [showDisplayMode, setShowDisplayMode] = React.useState(false);
  const [showMotionSettings, setShowMotionSettings] = React.useState(false);
  const [showNotifySoundGroup, setShowNotifySoundGroup] = React.useState(false);
  const [showLanguageCalendarGroup, setShowLanguageCalendarGroup] = React.useState(false);
  const [showSyncSection, setShowSyncSection] = React.useState(false);
  const [showBackupSection, setShowBackupSection] = React.useState(false);
  const [showUpdateSection, setShowUpdateSection] = React.useState(true);
  const [showApkShareSection, setShowApkShareSection] = React.useState(false);
  const [showSecurityEncryption, setShowSecurityEncryption] = React.useState(false);
  const [showSecurityBiometric, setShowSecurityBiometric] = React.useState(false);
  const [showSecurity2FA, setShowSecurity2FA] = React.useState(false);
  const [showSecurityOffline, setShowSecurityOffline] = React.useState(false);
  const [showSecurityCapsule, setShowSecurityCapsule] = React.useState(false);
  const [showFamilyProfileEdit, setShowFamilyProfileEdit] = React.useState(false);
  const [showFamilyBirthAccess, setShowFamilyBirthAccess] = React.useState(false);
  const [showDataStorageInfo, setShowDataStorageInfo] = React.useState(false);
  const [showFamilyRoleCard, setShowFamilyRoleCard] = React.useState(false);
  const [settingsQuery, setSettingsQuery] = React.useState('');
  const router = useRouter();

  const containerStyle = isDark ? styles.containerDark : styles.containerLight;

  const AVATAR_EMOJIS = ['👨‍🦱','👩‍🦰','🌸','👨','👩','🧑','👧','👦','🦄','⭐','🌈','🐱','🐶','🦋','🌷','🙂','😎','🤍'];

  const onToggleBiometric = async (enabled: boolean) => {
    if (!enabled) {
      setBiometricLock(false);
      Alert.alert('غیرفعال شد', 'قفل اثر انگشت/تشخیص چهره غیرفعال شد.');
      return;
    }
    if (Platform.OS === 'web') {
      Alert.alert('پشتیبانی نمی‌شود', 'احراز هویت بیومتریک روی وب در دسترس نیست. از دستگاه موبایل استفاده کنید.');
      return;
    }
    try {
      const LocalAuthentication = await import('expo-local-authentication');
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !enrolled) {
        Alert.alert('در دسترس نیست', 'این دستگاه سخت‌افزار بیومتریک ندارد یا اثر انگشت/چهره روی دستگاه تنظیم نشده است.');
        return;
      }
      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: 'تأیید برای فعال‌سازی ورود بیومتریک',
        fallbackLabel: 'استفاده از رمز دستگاه',
        disableDeviceFallback: false,
      });
      if (res.success) {
        setBiometricLock(true);
        Alert.alert('قفل بیومتریک فعال شد', 'از این پس با باز شدن برنامه، ورود با اثر انگشت یا تشخیص چهره پرسیده می‌شود. برای خروج، قفل را از همین بخش غیرفعال کنید.');
      } else {
        Alert.alert('لغو شد', 'فعال‌سازی تأیید نشد.');
      }
    } catch {
      Alert.alert('خطا', 'امکان بررسی احراز هویت بیومتریک وجود ندارد.');
    }
  };

  const exportData = async () => {
    try {
      const json = await exportAppData();
      const fileName = `my-life-backup-${new Date().toISOString().split('T')[0]}.json`;
      if (Platform.OS === 'web') {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        Alert.alert('پشتیبان آماده شد', 'فایل JSON پشتیبان دانلود شد.');
        return;
      }
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, json);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: 'application/json', dialogTitle: 'پشتیبان‌گیری داده‌ها' });
      } else {
        Alert.alert('پشتیبان آماده شد', `فایل در مسیر برنامه ذخیره شد:\n${fileUri}`);
      }
    } catch (error) {
      Alert.alert('خطا', 'امکان ایجاد پشتیبان وجود ندارد.');
    }
  };

  const importData = async () => {
    try {
      const doImport = async (json: string) => {
        await importAppData(json);
        Alert.alert('بازیابی شد', 'داده‌ها با موفقیت بازیابی شدند.');
      };

      if (Platform.OS === 'web') {
        await new Promise<void>((resolve) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'application/json,.json';
          const done = () => resolve();
          input.onchange = async () => {
            try {
              const file = input.files?.[0];
              if (!file) { done(); return; }
              const json = await file.text();
              const ok = globalThis.confirm?.('بازیابی پشتیبان باعث جایگزینی داده‌های فعلی می‌شود. ادامه می‌دهید؟');
              if (!ok) { done(); return; }
              await doImport(json);
            } catch {
              Alert.alert('خطا', 'فایل پشتیبان معتبر نیست یا بازیابی انجام نشد.');
            } finally {
              done();
            }
          };
          input.oncancel = done;
          input.click();
        });
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json', copyToCacheDirectory: true });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) return;
      const json = await FileSystem.readAsStringAsync(asset.uri);
      await new Promise<void>((resolve) => {
        Alert.alert(
          'بازیابی پشتیبان کامل',
          'داده‌های فعلی با محتوای فایل پشتیبان جایگزین می‌شوند. ادامه می‌دهید؟',
          [
            { text: 'انصراف', style: 'cancel', onPress: () => resolve() },
            { text: 'بازیابی', style: 'destructive', onPress: () => { void doImport(json).catch(() => Alert.alert('خطا', 'فایل پشتیبان معتبر نیست یا بازیابی انجام نشد.')).finally(resolve); } },
          ]
        );
      });
    } catch (error) {
      Alert.alert('خطا', 'فایل پشتیبان معتبر نیست یا بازیابی انجام نشد.');
    }
  };

  const exportSyncFile = async (opts?: { silent?: boolean }) => {
    try {
      const json = await exportSyncPackage();
      const fileName = `my-life-sync-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      if (Platform.OS === 'web') {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        updateSettings({ sync: { ...(settings.sync || {}), lastSyncAt: new Date().toISOString() } as any });
        if (!opts?.silent) Alert.alert('بسته آماده شد', 'فایل JSON همگام‌سازی دانلود شد.');
        return { ok: true as const, fileUri: fileName };
      }
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, json);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: 'application/json', dialogTitle: 'اشتراک بسته همگام‌سازی (وای‌فای/بلوتوث/...)' });
      } else if (!opts?.silent) {
        Alert.alert('بسته آماده شد', `فایل همگام‌سازی ذخیره شد:\n${fileUri}`);
      }
      updateSettings({ sync: { ...(settings.sync || {}), lastSyncAt: new Date().toISOString() } as any });
      return { ok: true as const, fileUri };
    } catch {
      if (!opts?.silent) Alert.alert('خطا', 'امکان ایجاد بسته همگام‌سازی وجود ندارد.');
      return { ok: false as const };
    }
  };

  const importSyncFile = async () => {
    try {
      const applySyncJson = async (json: string) => {
        let summaryText = '';
        try {
          const p = JSON.parse(json);
          const s = p?.summary;
          const parts: string[] = [];
          if (p?.device) parts.push(`دستگاه: ${p.device}`);
          if (p?.createdAt) {
            try { parts.push(`زمان ساخت: ${new Date(p.createdAt).toLocaleString('fa-IR')}`); } catch {}
          }
          if (p?.appVersion) parts.push(`نسخه: ${p.appVersion}`);
          if (s) {
            parts.push(`خاطرات ${toPersianDigits(s.memories ?? 0)}، گالری ${toPersianDigits(s.galleryPhotos ?? 0)}، رویدادها ${toPersianDigits(s.calendarEvents ?? 0)}، رنگ‌آمیزی ${toPersianDigits(s.coloringPages ?? 0)}، سلامت ${toPersianDigits(s.healthActivities ?? 0)}${s.healthPlans != null ? ` (برنامه ${toPersianDigits(s.healthPlans ?? 0)})` : ''}، کپسول ${toPersianDigits(s.timeCapsules ?? 0)}، رویا ${toPersianDigits(s.dreamWorlds ?? 0)}`);
            if (s.counselorSessions != null) parts.push(`جلسات مشاوره ${toPersianDigits(s.counselorSessions ?? 0)}`);
            if (s.xpLevel != null || s.petals != null) parts.push(`سطح ${toPersianDigits(s.xpLevel ?? 1)}، XP ${toPersianDigits(s.xpTotal ?? 0)}، گلبرگ ${toPersianDigits(s.petals ?? 0)}/۱۲`);
            if (Array.isArray(s.dailySteps) && s.dailySteps.length) {
              const label = (id: string) => (familyMembers.find(m => m.id === id)?.name || (id === 'baba' ? 'بابا' : id === 'maman' ? 'مامان' : id === 'daughter' ? 'دختر' : id));
              const doneCount = s.dailyStepsGoalsMet ?? s.dailySteps.filter((d: any) => d?.done || ((d?.steps ?? 0) >= (d?.goal ?? 0) && (d?.goal ?? 0) > 0)).length;
              const totalSteps = s.dailyStepsFamilyTotal ?? s.dailySteps.reduce((sum: number, d: any) => sum + (d?.steps ?? 0), 0);
              const stepsText = s.dailySteps.map((d: any) => {
                const done = d?.done || ((d?.steps ?? 0) >= (d?.goal ?? 0) && (d?.goal ?? 0) > 0);
                return `${label(String(d.memberId || ''))}: ${toPersianDigits(d.steps ?? 0)}/${toPersianDigits(d.goal ?? 0)}${done ? ' ✓' : ''}`;
              }).join('، ');
              parts.push(`گام‌ها (${toPersianDigits(doneCount)}/${toPersianDigits(s.dailySteps.length)} هدف، مجموع ${toPersianDigits(totalSteps)}): ${stepsText}`);
            }
          }
          if (parts.length) summaryText = `\n\n${parts.join('\n')}`;
        } catch {}

        await new Promise<void>((resolve) => {
          const confirmAndImport = async () => {
            await importSyncPackage(json);
            Alert.alert('همگام‌سازی شد', `بسته همگام‌سازی با موفقیت وارد و داده‌ها به‌روزرسانی شدند.${summaryText}`);
          };

          if (Platform.OS === 'web') {
            void (async () => {
              try {
                const ok = globalThis.confirm?.(`وارد کردن بسته همگام‌سازی باعث جایگزینی داده‌های فعلی می‌شود. ادامه می‌دهید؟${summaryText.replace(/\n/g, '\n')}`);
                if (ok) await confirmAndImport();
              } catch {
                Alert.alert('خطا', 'فایل همگام‌سازی معتبر نیست یا وارد نشد.');
              } finally {
                resolve();
              }
            })();
            return;
          }

          Alert.alert(
            'وارد کردن بسته همگام‌سازی',
            `داده‌های فعلی با محتوای بسته جایگزین می‌شوند. ادامه می‌دهید؟${summaryText}`,
            [
              { text: 'انصراف', style: 'cancel', onPress: () => resolve() },
              { text: 'وارد کردن', style: 'destructive', onPress: () => { void confirmAndImport().catch(() => Alert.alert('خطا', 'فایل همگام‌سازی معتبر نیست یا وارد نشد.')).finally(resolve); } },
            ]
          );
        });
      };

      if (Platform.OS === 'web') {
        await new Promise<void>((resolve) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'application/json,.json';
          const done = () => resolve();
          input.onchange = async () => {
            try {
              const file = input.files?.[0];
              if (!file) { done(); return; }
              const json = await file.text();
              await applySyncJson(json);
            } catch {
              Alert.alert('خطا', 'فایل همگام‌سازی معتبر نیست یا وارد نشد.');
            } finally {
              done();
            }
          };
          input.oncancel = done;
          input.click();
        });
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json', copyToCacheDirectory: true });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) return;
      const json = await FileSystem.readAsStringAsync(asset.uri);
      await applySyncJson(json);
    } catch {
      Alert.alert('خطا', 'فایل همگام‌سازی معتبر نیست یا وارد نشد.');
    }
  };

  const syncNow = async () => {
    const online = Platform.OS === 'web' ? (typeof navigator !== 'undefined' ? navigator.onLine : true) : true;
    if (!online) {
      Alert.alert('آفلاین', 'اینترنت در دسترس نیست. هنگام اتصال اینترنت می‌توانید دوباره تلاش کنید یا از همگام‌سازی فایل/وای‌فای/بلوتوث استفاده کنید.');
      return;
    }
    if (!settings.sync?.internetSyncEnabled) {
      Alert.alert('غیرفعال', 'همگام‌سازی اینترنتی غیرفعال است. آن را فعال کنید یا از روش فایل (وای‌فای/بلوتوث) استفاده کنید.');
      return;
    }
    try {
      await checkForAppUpdates();
    } catch {}
    const res = await exportSyncFile({ silent: true });
    if (res.ok) {
      const msg = Platform.OS === 'web'
        ? 'اتصال/تغییرات بررسی شد و فایل بسته همگام‌سازی دانلود شد. برای سینک ابری کامل، اتصال به سرویس ابری پروژه لازم است؛ می‌توانید این فایل را برای دستگاه دیگر ارسال کنید.'
        : 'اتصال/تغییرات بررسی و بسته همگام‌سازی آماده شد. برای سینک ابری کامل، اتصال به سرویس ابری پروژه لازم است؛ فعلاً می‌توانید این بسته را برای دستگاه دیگر ارسال کنید.';
      Alert.alert('همگام‌سازی اینترنتی', msg);
    } else {
      Alert.alert('خطا', 'امکان ایجاد بسته همگام‌سازی وجود ندارد.');
    }
  };

  const export3DData = async () => {
    try {
      const relief = buildColoringRelief(coloringPages || []);
      const payload = {
        exportedAt: new Date().toISOString(),
        format: 'my-life-3d-export-v2',
        note: 'مدلهای مش واقعی (OBJ/STL) از قلمضربههای رنگآمیزی ساخته شدهاند؛ فایل JSON بقیه دادهها را نگه میدارد.',
        mesh: {
          pages: relief.pages,
          segments: relief.segments,
          triangles: relief.triangles,
          units: 'millimeter',
          pageWidth: 80,
          pageHeight: 80,
          baseThickness: 1.6,
          reliefHeight: 1.1,
        },
        familyMembers: (familyMembers || []).map(m => ({ id: m.id, name: m.name, avatarEmoji: m.avatarEmoji, photoUri: m.photoUri || null })),
        galleryPhotos: (galleryPhotos || []).map(p => ({ id: p.id, title: p.title, uri: p.uri, description: p.description || '', date: p.date || '' })),
        coloringPages: (coloringPages || []).map(p => ({ id: p.id, title: p.title, strokesCount: (p.strokes || []).length, guide: p.guide || [] })),
      };
      const json = JSON.stringify(payload, null, 2);
      const noRelief = relief.pages === 0;

      const download = (content: string, filename: string, mime: string) => {
        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      if (Platform.OS === 'web') {
        const stamp = new Date().toISOString().slice(0, 10);
        download(json, `my-life-export-${stamp}.json`, 'application/json');
        if (!noRelief) {
          download(relief.obj, `my-life-relief-${stamp}.obj`, 'text/plain');
          download(relief.stl, `my-life-relief-${stamp}.stl`, 'model/stl');
        }
        Alert.alert(
          noRelief ? 'خروجی JSON آماده شد' : 'خروجی سهبعدی آماده شد',
          noRelief
            ? 'برای ساخت مدل سهبعدی، ابتدا در بخش رنگ‌آمیزی با قلم‌مو طرحی بکشید (قلم پاک‌کن در خروجی نادیده گرفته می‌شود).\nفایل JSON داده‌ها دانلود شد.'
            : `${toPersianDigits(relief.pages)} صفحه، ${toPersianDigits(relief.segments)} قلم‌ضربه و ${toPersianDigits(relief.triangles)} مثلث.\nفایل‌های JSON، OBJ و STL دانلود شدند.`
        );
        return;
      }

      const base = `${FileSystem.documentDirectory}my-life-3d-export-${Date.now()}`;
      const jsonUri = `${base}.json`;
      await FileSystem.writeAsStringAsync(jsonUri, json);
      const created: { uri: string; mimeType: string; label: string }[] = [{ uri: jsonUri, mimeType: 'application/json', label: 'JSON' }];
      if (!noRelief) {
        const objUri = `${base}.obj`;
        const stlUri = `${base}.stl`;
        await FileSystem.writeAsStringAsync(objUri, relief.obj);
        await FileSystem.writeAsStringAsync(stlUri, relief.stl);
        created.push({ uri: objUri, mimeType: 'text/plain', label: 'OBJ' }, { uri: stlUri, mimeType: 'model/stl', label: 'STL' });
      }
      if (await Sharing.isAvailableAsync()) {
        for (const file of created) {
          await Sharing.shareAsync(file.uri, { mimeType: file.mimeType, dialogTitle: `خروجی سهبعدی (${file.label})` });
        }
      }
      Alert.alert(
        noRelief ? 'خروجی JSON آماده شد' : 'خروجی آماده شد',
        noRelief
          ? `برای ساخت مدل سهبعدی، ابتدا در بخش رنگ‌آمیزی با قلم‌مو طرحی بکشید.\nفایل JSON ساخته شد:\n${jsonUri}`
          : `${toPersianDigits(relief.pages)} صفحه، ${toPersianDigits(relief.segments)} قلم‌ضربه و ${toPersianDigits(relief.triangles)} مثلث.\nفایل‌ها: ${created.map(f => f.label).join(', ')}\n${created.map(f => f.uri).join('\n')}`
      );
    } catch {
      Alert.alert('خطا', 'خروجی داده سهبعدی انجام نشد.');
    }
  };

  const resetAllData = () => {
    const doReset = async () => {
      try {
        await resetAllAppData();
        Alert.alert('انجام شد', 'تمام داده‌ها بازنشانی شدند.');
      } catch {
        Alert.alert('خطا', 'بازنشانی انجام نشد.');
      }
    };
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.('آیا از بازنشانی تمام داده‌ها مطمئن هستید؟ این کار قابل بازگشت نیست.')) {
        void doReset();
      }
      return;
    }
    Alert.alert(
      'بازنشانی کامل داده‌ها',
      'آیا از بازنشانی تمام داده‌ها مطمئن هستید؟ این کار قابل بازگشت نیست.',
      [
        { text: 'انصراف', style: 'cancel' },
        { text: 'بازنشانی', style: 'destructive', onPress: () => { void doReset(); } },
      ]
    );
  };

  const formatFaDateTime = (iso?: string) => {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleString('fa-IR'); } catch { return iso; }
  };

  const onCheckUpdates = async () => {
    try {
      setCheckingUpdates(true);
      await checkForAppUpdates();
      Alert.alert('بررسی انجام شد', 'وضعیت اتصال و بخش‌های تغییر یافته ثبت شد.');
    } catch {
      Alert.alert('خطا', 'بررسی بروزرسانی انجام نشد.');
    } finally {
      setCheckingUpdates(false);
    }
  };

  const onRollbackUpdate = () => {
    if (!appUpdateState?.preUpdateSnapshot) {
      Alert.alert('موجود نیست', 'نسخه/وضعیت قبلی برای بازگشت در دسترس نیست.');
      return;
    }
    const doRollback = async () => {
      try {
        await rollbackAppUpdate();
        Alert.alert('انجام شد', 'برنامه به وضعیت قبل از بروزرسانی بازگردانده شد.');
      } catch {
        Alert.alert('خطا', 'بازگشت انجام نشد.');
      }
    };
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.('به وضعیت قبل از بروزرسانی برگردد؟')) void doRollback();
      return;
    }
    Alert.alert('بازگشت به قبل از بروزرسانی', 'آیا مطمئن هستید؟ وضعیت فعلی با نسخه ذخیره‌شده قبل از بروزرسانی جایگزین می‌شود.', [
      { text: 'انصراف', style: 'cancel' },
      { text: 'بازگشت', style: 'destructive', onPress: () => { void doRollback(); } },
    ]);
  };

  const onClearUpdateHistory = () => {
    const doClear = async () => {
      try { await clearAppUpdateHistory(); Alert.alert('پاک شد', 'تاریخچه بررسی‌ها پاک شد.'); } catch { Alert.alert('خطا', 'پاک‌سازی انجام نشد.'); }
    };
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.('تاریخچه بررسی بروزرسانی پاک شود؟')) void doClear();
      return;
    }
    Alert.alert('پاک‌سازی تاریخچه', 'تاریخچه بررسی بروزرسانی پاک شود؟', [
      { text: 'انصراف', style: 'cancel' },
      { text: 'پاک کن', style: 'destructive', onPress: () => { void doClear(); } },
    ]);
  };

  const startEditMember = (member: { id: string; name: string }) => {
    if (Platform.OS === 'web') {
      const promptFn = (globalThis as any).prompt;
      if (typeof promptFn === 'function') {
        const name = promptFn(`نام جدید ${member.name}:`, member.name);
        if (name && name.trim()) updateFamilyMemberName(member.id as any, name.trim());
      }
      return;
    }
    setEditingMemberId(member.id);
    setEditingName(member.name);
  };

  const saveEditedMember = () => {
    if (editingMemberId && editingName.trim()) {
      updateFamilyMemberName(editingMemberId as any, editingName.trim());
    }
    setEditingMemberId(null);
    setEditingName('');
  };

  const openBirthPicker = (member: any) => {
    if (birthPickerId === member.id) {
      setBirthPickerId(null);
      return;
    }
    const base = member.birthDate ? new Date(member.birthDate + 'T00:00:00') : new Date();
    const safe = isNaN(base.getTime()) ? new Date() : base;
    const j = gregorianToJalaaliDate(safe);
    setBirthPickerId(member.id);
    setBirthDraftDate(member.birthDate || '');
    setBirthManualInput(member.birthDate ? formatJalaali(j) : '');
    setBirthJy(j.jy);
    setBirthJm(j.jm);
  };

  const parseManualBirthDate = (input: string): string | null => {
    const raw = toEnglishDigits(input || '').trim();
    if (!raw) return null;
    let m = raw.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
    if (m) {
      const y = parseInt(m[1], 10), mo = parseInt(m[2], 10), d = parseInt(m[3], 10);
      if (y >= 1300 && y <= 1500 && mo >= 1 && mo <= 12 && d >= 1 && d <= 31) {
        try {
          const g = jalaaliToGregorianDate(y, mo, d);
          const gs = formatGregorian(g);
          const check = gregorianToJalaaliDate(g);
          if (check.jy === y && check.jm === mo && check.jd === d) return gs;
        } catch {}
      }
      if (y >= 1900 && y <= 2100 && mo >= 1 && mo <= 12 && d >= 1 && d <= 31) {
        const gs = `${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const dt = new Date(gs + 'T00:00:00');
        if (!isNaN(dt.getTime())) return gs;
      }
    }
    m = raw.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (m) {
      const y = parseInt(m[1], 10), mo = parseInt(m[2], 10), d = parseInt(m[3], 10);
      if (y >= 1300 && y <= 1500 && mo >= 1 && mo <= 12 && d >= 1 && d <= 31) {
        try {
          const g = jalaaliToGregorianDate(y, mo, d);
          const check = gregorianToJalaaliDate(g);
          if (check.jy === y && check.jm === mo && check.jd === d) return formatGregorian(g);
        } catch {}
      }
    }
    return null;
  };

  const saveBirthDate = (memberId: string) => {
    let dateToSave = birthDraftDate;
    if (birthManualInput.trim()) {
      const parsed = parseManualBirthDate(birthManualInput);
      if (!parsed) {
        Alert.alert('تاریخ نامعتبر', 'فرمت درست: ۱۳۹۸/۰۵/۱۰ (شمسی) یا 2019-08-01 (میلادی)');
        return;
      }
      dateToSave = parsed;
    }
    if (!dateToSave) {
      Alert.alert('انتخاب نشده', 'یک روز از تقویم انتخاب کنید یا تاریخ را دستی وارد کنید.');
      return;
    }
    updateFamilyMemberBirthDate(memberId as any, dateToSave);
    setBirthPickerId(null);
    setBirthManualInput('');
    Alert.alert('ذخیره شد', 'تاریخ تولد با موفقیت ذخیره شد.');
  };

  const resetBirthDate = (memberId: string) => {
    updateFamilyMemberBirthDate(memberId as any, undefined);
    if (birthPickerId === memberId) { setBirthDraftDate(''); setBirthManualInput(''); }
    Alert.alert('ریست شد', 'تاریخ تولد حذف شد.');
  };

  const renderBirthCalendar = (member: any) => {
    if (birthPickerId !== member.id) return null;
    const daysInMonth = jalaaliMonthLength(birthJy, birthJm);
    const firstG = jalaaliToGregorianDate(birthJy, birthJm, 1);
    const firstDayIndex = (firstG.getDay() + 1) % 7; // Sat-first
    const prevMonth = () => { if (birthJm === 1) { setBirthJy(y => y - 1); setBirthJm(12); } else setBirthJm(m => m - 1); };
    const nextMonth = () => { if (birthJm === 12) { setBirthJy(y => y + 1); setBirthJm(1); } else setBirthJm(m => m + 1); };
    const pickDay = (jd: number) => {
      const g = jalaaliToGregorianDate(birthJy, birthJm, jd);
      const gs = formatGregorian(g);
      setBirthDraftDate(gs);
      try { setBirthManualInput(formatJalaali(gregorianToJalaaliDate(g))); } catch { setBirthManualInput(gs); }
    };
    const monthLabel = `${JALAALI_MONTHS[birthJm - 1]} ${toPersianDigits(birthJy)}`;
    const selectedLabel = birthDraftDate
      ? (() => { try { const g = new Date(birthDraftDate + 'T00:00:00'); const j = gregorianToJalaaliDate(g); return `انتخاب: ${formatJalaali(j)} (${birthDraftDate})`; } catch { return `انتخاب: ${birthDraftDate}`; } })()
      : 'تاریخی انتخاب نشده';
    const savedLabel = member.birthDate
      ? (() => { try { const g = new Date(member.birthDate + 'T00:00:00'); const j = gregorianToJalaaliDate(g); return `ذخیره‌شده: ${formatJalaali(j)}`; } catch { return `ذخیره‌شده: ${member.birthDate}`; } })()
      : 'بدون تاریخ تولد';
    return (
      <View style={[styles.birthPickerCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
        <Text style={[styles.emojiPickerTitle, { color: themeColors.text, fontSize: 13, marginBottom: 2 }]}>تاریخ تولد {member.name} (شمسی)</Text>
        <Text style={{ color: themeColors.textSecondary, fontSize: 11 }}>{savedLabel}</Text>
        <View style={styles.birthCalHeader}>
          <TouchableOpacity onPress={() => setBirthJy(y => y - 1)} style={[styles.birthNavBtn, { borderColor: themeColors.primary }]}><Text style={{ color: themeColors.text, fontSize: 10 }}>«سال</Text></TouchableOpacity>
          <TouchableOpacity onPress={prevMonth} style={[styles.birthNavBtn, { borderColor: themeColors.primary }]}><Text style={{ color: themeColors.text, fontSize: 14 }}>‹</Text></TouchableOpacity>
          <Text style={{ color: themeColors.text, fontWeight: '700', flex: 1, textAlign: 'center', fontSize: 12 }}>{monthLabel}</Text>
          <TouchableOpacity onPress={nextMonth} style={[styles.birthNavBtn, { borderColor: themeColors.primary }]}><Text style={{ color: themeColors.text, fontSize: 14 }}>›</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setBirthJy(y => y + 1)} style={[styles.birthNavBtn, { borderColor: themeColors.primary }]}><Text style={{ color: themeColors.text, fontSize: 10 }}>سال»</Text></TouchableOpacity>
        </View>
        <View style={styles.birthCalCompactWrap}>
          <View style={styles.birthWeekRow}>
            {['ش','ی','د','س','چ','پ','ج'].map(d => (
              <View key={d} style={styles.birthWeekCell}><Text style={[styles.birthWeekDay, { color: themeColors.textSecondary }]}>{d}</Text></View>
            ))}
          </View>
          <View style={styles.birthDaysGrid}>
            {Array.from({ length: firstDayIndex }).map((_, i) => <View key={'e'+i} style={styles.birthDayCell} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const jd = i + 1;
              const g = jalaaliToGregorianDate(birthJy, birthJm, jd);
              const gs = formatGregorian(g);
              const selected = birthDraftDate === gs;
              return (
                <TouchableOpacity key={jd} style={styles.birthDayCell} onPress={() => pickDay(jd)} accessibilityRole="button">
                  <View style={[styles.birthDayBtn, selected && { backgroundColor: themeColors.primary }]}>
                    <Text style={{ color: selected ? '#fff' : themeColors.text, fontWeight: selected ? '700' : '500', fontSize: 11 }}>{toPersianDigits(jd)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <Text style={{ color: themeColors.text, fontSize: 11, marginTop: 2, fontWeight: '600' }}>{selectedLabel}</Text>

        <View style={styles.birthManualBox}>
          <Text style={{ color: themeColors.textSecondary, fontSize: 11, marginBottom: 4 }}>یا ورود دستی (شمسی ۱۴۰۲/۰۵/۱۰ یا میلادی 2019-08-01):</Text>
          <TextInput
            value={birthManualInput}
            onChangeText={setBirthManualInput}
            placeholder="مثال: ۱۳۹۸/۰۵/۱۰"
            placeholderTextColor={themeColors.textSecondary}
            style={[styles.birthManualInput, { color: themeColors.text, borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)', backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fafafa' }]}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.birthActionRow}>
          <TouchableOpacity style={[styles.birthActionBtn, { borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }]} onPress={() => { setBirthPickerId(null); }}>
            <Text style={[styles.birthActionText, { color: themeColors.textSecondary }]}>بستن</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.birthActionBtn, { backgroundColor: '#E17055', borderColor: '#E17055' }]} onPress={() => resetBirthDate(member.id)}>
            <Text style={[styles.birthActionText, { color: '#fff' }]}>ریست</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.birthActionBtn, { backgroundColor: themeColors.secondary || '#4ECDC4', borderColor: themeColors.secondary || '#4ECDC4' }]} onPress={() => saveBirthDate(member.id)}>
            <Text style={[styles.birthActionText, { color: '#fff' }]}>ذخیره</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const pickAvatarPhoto = async (memberId: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['image/*'], copyToCacheDirectory: true });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) return;
      let uri = asset.uri;
      if (Platform.OS !== 'web' && FileSystem.documentDirectory) {
        const ext = (asset.name?.split('.').pop() || 'jpg').replace(/[^a-zA-Z0-9]/g, '') || 'jpg';
        const dest = `${FileSystem.documentDirectory}avatar-${memberId}-${Date.now()}.${ext}`;
        try {
          await FileSystem.copyAsync({ from: asset.uri, to: dest });
          uri = dest;
        } catch {}
      }
      updateFamilyMemberAvatar(memberId as any, { photoUri: uri });
      setAvatarMemberId(null);
      Alert.alert('ذخیره شد', 'عکس پروفایل با موفقیت ثبت شد.');
    } catch {
      Alert.alert('خطا', 'انتخاب عکس انجام نشد.');
    }
  };


  // ---- Settings search ----
  const normalizeQuery = (value: string) => value.replace(/\s+/g, ' ').trim().toLowerCase();
  const activeQuery = normalizeQuery(settingsQuery);
  const matchesSettings = (label: string, keywords: string[] = []) =>
    !activeQuery || normalizeQuery(`${label} ${keywords.join(' ')}`).includes(activeQuery);
  const settingsMatches = [
    { key: 'family', label: 'خانواده من', words: ['خانواده','پروفایل','نقش','عضو','نام','آواتار','تاریخ تولد','دسترسی','ویرایش'] },
    { key: 'stats', label: 'آمار کلی', words: ['آمار','XP','سطح','استریک','گلبرگ','خاطره','دستاورد'] },
    { key: 'appearance', label: 'ظاهر و تم', words: ['ظاهر','تم','رنگ','روشن','تاریک','خودکار','انیمیشن','حرکت','فصل'] },
    { key: 'notifications', label: 'اعلان‌ها، صدا و زبان', words: ['اعلان','صدا','موسیقی','زبان','تقویم','هشدار'] },
    { key: 'data', label: 'داده، همگام‌سازی و بروزرسانی', words: ['داده','همگام','سینک','sync','پشتیبان','بکاپ','خروجی','بروزرسانی','ذخیره','آفلاین','فایل','apk','اپک','دانلود','اشتراک','نصب'] },
    { key: 'security', label: 'امنیت و حریم خصوصی', words: ['امنیت','حریم','بیومتریک','اثر انگشت','چهره','رمز','قفل','2FA','رمزنگاری','کپسول'] },
    { key: 'about', label: 'درباره برنامه', words: ['درباره','نسخه','ویژگی','اعتبار'] },
    { key: 'tech', label: 'نقشه برنامه و اطلاعات فنی', words: ['نقشه','رودمپ','معماری','دیاگرام','وابستگی','فلوچارت','فنی','الگوریتم'] },
  ].filter(item => matchesSettings(item.label, item.words));
  const matchedSettingsCount = settingsMatches.length;
  const openSettingsResults = (key: string) => {
    const q = activeQuery;
    const map: Record<string, () => void> = {
      family: () => setShowFamilySection(true),
      stats: () => setShowStatsSection(true),
      appearance: () => setShowAppearanceSection(true),
      notifications: () => setShowNotificationsSection(true),
      data: () => setShowDataSection(true),
      security: () => setShowSecuritySection(true),
      about: () => setShowAboutSection(true),
      tech: () => setShowTechInfo(true),
    };
    map[key]?.();

    // expand the most relevant sub-sections for the searched keyword
    if (key === 'security') {
      if (/(بیومتریک|اثر انگشت|چهره|face|fingerprint)/.test(q)) setShowSecurityBiometric(true);
      if (/(2fa|دو مرحله|رمز یکبار)/.test(q)) setShowSecurity2FA(true);
      if (/(رمزنگاری|رمزگذاری|encryption)/.test(q)) setShowSecurityEncryption(true);
      if (/(کپسول)/.test(q)) setShowSecurityCapsule(true);
      if (/(آفلاین|offline)/.test(q)) setShowSecurityOffline(true);
    }
    if (key === 'data') {
      if (/(بکاپ|پشتیبان|backup|بازیابی|restore)/.test(q)) setShowBackupSection(true);
      if (/(همگام|سینک|sync)/.test(q)) setShowSyncSection(true);
      if (/(بروزرسانی|update)/.test(q)) setShowUpdateSection(true);
      if (/(apk|اپک|دانلود|اشتراک|نصب|share)/.test(q)) setShowApkShareSection(true);
      if (/(ذخیره|آفلاین|offline|وضعیت)/.test(q)) setShowDataStorageInfo(true);
    }
    if (key === 'appearance') {
      if (/(فصل|season)/.test(q)) setShowSeasonalThemes(true);
      if (/(حالت نمایش|روشن|تاریک|خودکار)/.test(q)) setShowDisplayMode(true);
      if (/(انیمیشن|حرکت|motion)/.test(q)) setShowMotionSettings(true);
    }
    if (key === 'notifications') {
      if (/(صدا|موسیقی|هشدار|اعلان)/.test(q)) setShowNotifySoundGroup(true);
      if (/(زبان|تقویم)/.test(q)) setShowLanguageCalendarGroup(true);
    }
    if (key === 'family') {
      if (/(آواتار|نام|پروفایل)/.test(q)) setShowFamilyProfileEdit(true);
      if (/(تولد|سن|دسترسی)/.test(q)) setShowFamilyBirthAccess(true);
      setShowFamilyRoleCard(true);
    }
  };


  const getApkDownloadUrl = () => String((settings as any)?.apkDownloadUrl || '').trim();

  const openApkDownload = async () => {
    const url = getApkDownloadUrl();
    if (!url) {
      Alert.alert('لینک تنظیم نشده', 'ابتدا لینک دانلود APK (مثلاً خروجی ساخت EAS یا فایل میزبانی‌شده) را وارد و ذخیره کنید.');
      return;
    }
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    try {
      if (Platform.OS === 'web') {
        (globalThis as any).open?.(normalized, '_blank', 'noopener,noreferrer');
        return;
      }
      const supported = await Linking.canOpenURL(normalized);
      if (!supported) {
        Alert.alert('خطا', 'امکان باز کردن این لینک وجود ندارد. آدرس را بررسی کنید.');
        return;
      }
      await Linking.openURL(normalized);
    } catch {
      Alert.alert('خطا', 'دانلود/باز کردن لینک APK انجام نشد.');
    }
  };

  const shareApkDownload = async () => {
    const url = getApkDownloadUrl();
    if (!url) {
      Alert.alert('لینک تنظیم نشده', 'ابتدا لینک دانلود APK را وارد کنید تا بتوانید آن را به اشتراک بگذارید.');
      return;
    }
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const message = `دانلود نرم‌افزار «زندگی من» (APK):\n${normalized}`;
    try {
      if (Platform.OS === 'web' && (globalThis as any).navigator?.share) {
        await (globalThis as any).navigator.share({ title: 'دانلود اپ زندگی من', text: message, url: normalized });
        return;
      }
      await Share.share(
        Platform.OS === 'ios'
          ? { message, url: normalized }
          : { message, title: 'دانلود اپ زندگی من' }
      );
    } catch {
      Alert.alert('خطا', 'اشتراک‌گذاری لینک APK انجام نشد.');
    }
  };

  const focusSettingsSection = (target: string) => {
    if (target === 'data' || target === 'sync' || target === 'backup' || target === 'update' || target === 'apk') {
      setShowDataSection(true);
      if (target === 'sync') setShowSyncSection(true);
      if (target === 'backup') setShowBackupSection(true);
      if (target === 'update') setShowUpdateSection(true);
      if (target === 'apk') setShowApkShareSection(true);
    }
    if (target === 'security') {
      setShowSecuritySection(true);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, containerStyle]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={themeColors.background} />
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>⚙️</Text>
          <Text style={styles.headerTitle}>تنظیمات</Text>
          <Text style={styles.headerSubtitle}>
            شخصی‌سازی تجربه خانواده
          </Text>
        </View>

        {/* Settings Search */}
        <View style={[styles.searchCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.95)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }]}>
          <Text style={[styles.searchTitle, { color: themeColors.text }]}>🔎 جستجوی تنظیمات</Text>
          <TextInput
            value={settingsQuery}
            onChangeText={setSettingsQuery}
            placeholder="مثلاً: همگام‌سازی، اثر انگشت، تم، پشتیبان..."
            placeholderTextColor={themeColors.textSecondary}
            style={[styles.searchInput, { color: themeColors.text, borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)', backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff' }]}
            autoCorrect={false}
            returnKeyType="search"
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8, flexWrap: 'wrap' }}>
            <TouchableOpacity
              style={[styles.headerSearchBtn, { flexGrow: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)' }]}
              onPress={() => router.push('/search' as any)}
              accessibilityRole="button"
              accessibilityLabel="جستجو در کل برنامه"
              hitSlop={8}
            >
              <Text style={styles.headerSearchText}>🔎 جستجو در کل برنامه</Text>
            </TouchableOpacity>
            {settingsQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSettingsQuery('')} hitSlop={8} accessibilityRole="button">
                <Text style={[styles.settingsSearchClear, { color: themeColors.textSecondary }]}>✕ پاک کردن</Text>
              </TouchableOpacity>
            )}
          </View>
          {activeQuery.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={[styles.searchResultMeta, { color: themeColors.textSecondary }]}>
                {matchedSettingsCount > 0 ? `${toPersianDigits(matchedSettingsCount)} بخش منطبق:` : 'بخشی پیدا نشد. عبارت دیگری امتحان کنید.'}
              </Text>
              <View style={styles.settingsSearchChips}>
                {settingsMatches.map(item => (
                  <TouchableOpacity key={item.key} style={[styles.settingsSearchChip, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,107,157,0.1)', borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,107,157,0.25)' }]} onPress={() => openSettingsResults(item.key)}>
                    <Text style={[styles.settingsSearchChipText, { color: themeColors.primary }]}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Family Overview */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,107,157,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,157,0.18)' }]}
            onPress={() => setShowFamilySection(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showFamilySection ? '▾' : '▸'} 👨‍👩‍👧 خانواده من</Text>
          </TouchableOpacity>
          {showFamilySection && matchesSettings('خانواده من', ['خانواده','پروفایل','نقش','عضو','نام','آواتار','تاریخ تولد','دسترسی','ویرایش']) && (
            <View style={{ marginTop: 10 }}>
          {(() => {
            const currentSelectedId = familyMembers.find(m => m.id === selectedMemberId)?.id || activeMemberId || familyMembers[0]?.id || 'maman';
            const member = familyMembers.find(m => m.id === currentSelectedId) || familyMembers[0];
            if (!member) return null;
            const roleLabel = member.id === 'baba' ? 'بابا' : member.id === 'maman' ? 'مامان' : 'دختر';
            const roleEmoji = member.id === 'baba' ? '👨‍🦱' : member.id === 'maman' ? '👩‍🦰' : '🌸';
            return (
              <View style={{ gap: 10 }}>
                <TouchableOpacity
                  style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,107,157,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,157,0.18)' }]}
                  onPress={() => setShowFamilyRoleCard(v => !v)}
                >
                  <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showFamilyRoleCard ? '▾' : '▸'} پروفایل و نقش فعلی ({member.name})</Text>
                </TouchableOpacity>
                {showFamilyRoleCard && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => {
                      const idx = Math.max(0, familyMembers.findIndex(m => m.id === currentSelectedId));
                      const next = familyMembers[(idx + 1) % Math.max(1, familyMembers.length)];
                      if (next) {
                        setSelectedMemberId(next.id);
                        setAvatarMemberId(null);
                        setBirthPickerId(null);
                        setEditingMemberId(null);
                      }
                    }}
                    style={[styles.roleUnifiedCard, { marginTop: 8, marginBottom: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff', borderColor: member.id === activeMemberId ? themeColors.primary : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)') }]}
                  >
                    <View style={styles.roleUnifiedHeader}>
                      <UnicornAvatar member={member} size={64} showQuote={false} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.roleUnifiedTitle, { color: themeColors.text }]}>{roleEmoji} نقش: {roleLabel}</Text>
                        <Text style={[styles.roleUnifiedSub, { color: themeColors.textSecondary }]}>
                          {member.name} {member.id === activeMemberId ? '• نقش فعال برنامه' : '• برای تغییر نقش فعال یا ویرایش، این کارت را لمس کنید'}
                        </Text>
                        <Text style={[styles.roleUnifiedHint, { color: themeColors.primary }]}>با لمس، نقش بعدی نمایش داده می‌شود (تنظیمات برای همان فرد)</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.subAccordionHeader, { marginTop: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,107,157,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,157,0.18)' }]}
                  onPress={() => setShowFamilyProfileEdit(v => !v)}
                >
                  <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showFamilyProfileEdit ? '▾' : '▸'} ویرایش نام و آواتار ({member.name})</Text>
                </TouchableOpacity>
                {showFamilyProfileEdit && (
                  <View style={[styles.memberEditForm, { marginTop: 8, marginBottom: 8, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', borderWidth: 1 }]}>
                    <View style={{ gap: 8 }}>
                      <TouchableOpacity
                        style={[styles.memberEditRow, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}
                        onPress={() => startEditMember(member)}
                      >
                        <Text style={[styles.memberEditName, { color: themeColors.text }]}>{roleEmoji} {member.name}</Text>
                        <Text style={[styles.memberEditAction, { color: themeColors.primary }]}>ویرایش نام</Text>
                      </TouchableOpacity>

                      {editingMemberId === member.id && Platform.OS !== 'web' && (
                        <View style={[styles.memberEditForm, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f9fafb', marginTop: 0 }]}>
                          <Text style={[styles.memberEditLabel, { color: themeColors.text }]}>نام جدید:</Text>
                          <TextInput
                            value={editingName}
                            onChangeText={setEditingName}
                            placeholder="نام جدید عضو خانواده"
                            placeholderTextColor={themeColors.textSecondary}
                            style={[styles.memberEditInput, { color: themeColors.text, borderColor: themeColors.primary }]}
                            autoFocus
                            onSubmitEditing={saveEditedMember}
                          />
                          <View style={styles.memberEditButtons}>
                            <TouchableOpacity style={styles.memberCancelButton} onPress={() => { setEditingMemberId(null); setEditingName(''); }}>
                              <Text style={styles.memberCancelButtonText}>انصراف</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.memberSaveButton, { backgroundColor: themeColors.primary }]} onPress={saveEditedMember}>
                              <Text style={styles.memberSaveButtonText}>ذخیره</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}

                      <View style={styles.avatarActionsRow}>
                        <TouchableOpacity style={[styles.smallActionButton, { borderColor: themeColors.primary }]} onPress={() => setAvatarMemberId(avatarMemberId === member.id ? null : member.id)}>
                          <Text style={[styles.smallActionButtonText, { color: themeColors.primary }]}>🙂 آواتار</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.smallActionButton, { borderColor: themeColors.primary }]} onPress={() => { void pickAvatarPhoto(member.id); }}>
                          <Text style={[styles.smallActionButtonText, { color: themeColors.primary }]}>🖼️ آپلود عکس</Text>
                        </TouchableOpacity>
                        {member.photoUri ? (
                          <TouchableOpacity style={[styles.smallActionButton, { borderColor: '#E17055' }]} onPress={() => updateFamilyMemberAvatar(member.id as any, { photoUri: null })}>
                            <Text style={[styles.smallActionButtonText, { color: '#E17055' }]}>حذف عکس</Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>

                      {avatarMemberId === member.id && (
                        <View style={[styles.emojiPicker, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                          <Text style={[styles.emojiPickerTitle, { color: themeColors.text }]}>انتخاب آواتار برای {member.name}</Text>
                          <View style={styles.emojiGrid}>
                            {AVATAR_EMOJIS.map(e => (
                              <TouchableOpacity key={e} style={styles.emojiOption} onPress={() => { updateFamilyMemberAvatar(member.id as any, { avatarEmoji: e }); setAvatarMemberId(null); }}>
                                <Text style={styles.emojiOptionText}>{e}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.subAccordionHeader, { marginTop: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,107,157,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,157,0.18)' }]}
                  onPress={() => setShowFamilyBirthAccess(v => !v)}
                >
                  <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showFamilyBirthAccess ? '▾' : '▸'} تاریخ تولد، نقش فعال و دسترسی‌ها</Text>
                </TouchableOpacity>
                {showFamilyBirthAccess && (
                  <View style={[styles.groupCard, { marginTop: 8, marginBottom: 4, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)' }]}>
                    <View style={{ gap: 8 }}>
                      <View style={styles.avatarActionsRow}>
                        <TouchableOpacity style={[styles.smallActionButton, { borderColor: themeColors.secondary || '#4ECDC4' }]} onPress={() => openBirthPicker(member as any)}>
                          <Text style={[styles.smallActionButtonText, { color: themeColors.secondary || '#4ECDC4' }]}>🎂 تاریخ تولد</Text>
                        </TouchableOpacity>
                        <Text style={[styles.memberEditAction, { color: themeColors.textSecondary, flex: 1 }]}>
                          {member.birthDate ? (() => { try { const g = new Date(member.birthDate + 'T00:00:00'); const j = gregorianToJalaaliDate(g); const age = Math.max(0, new Date().getFullYear() - g.getFullYear()); return `سن: ${age} • ${formatJalaali(j)} (${member.birthDate})`; } catch { return member.birthDate; } })() : member.birthYear ? `سن: ${Math.max(0, new Date().getFullYear() - member.birthYear)} سال (فقط سال ثبت شده)` : 'تاریخ تولد ثبت نشده'}
                        </Text>
                      </View>
                      {renderBirthCalendar(member)}

                      <View style={styles.avatarActionsRow}>
                        <TouchableOpacity
                          style={[styles.smallActionButton, { borderColor: member.id === activeMemberId ? themeColors.primary : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'), backgroundColor: member.id === activeMemberId ? themeColors.primary : 'transparent' }]}
                          onPress={() => setActiveMemberId(member.id as any)}
                        >
                          <Text style={[styles.smallActionButtonText, { color: member.id === activeMemberId ? '#fff' : themeColors.text }]}>
                            {member.id === activeMemberId ? '✅ نقش فعال برنامه' : 'انتخاب به‌عنوان نقش فعال'}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <Text style={{ color: themeColors.textSecondary, fontSize: 11, lineHeight: 17 }}>
                        دسترسی‌های این نقش: {rolePermissions?.canManageFamily ? 'مدیریت خانواده' : 'بدون مدیریت خانواده'} • {rolePermissions?.canEditShared ? 'ویرایش مشترک' : 'ویرایش محدود'} • {rolePermissions?.canSync ? 'همگام‌سازی' : 'بدون همگام‌سازی'}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })()}
            </View>
          )}
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(116,185,255,0.08)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(116,185,255,0.22)' }]}
            onPress={() => setShowStatsSection(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showStatsSection ? '▾' : '▸'} 📊 آمار کلی</Text>
          </TouchableOpacity>
          {showStatsSection && matchesSettings('آمار کلی', ['آمار','XP','سطح','استریک','گلبرگ','خاطره','دستاورد']) && (
            <View style={{ marginTop: 10 }}>
              <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🏆</Text>
              <Text style={styles.statValue}>سطح {xpState.level}</Text>
              <Text style={styles.statLabel}>پیشرفت</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statValue}>{xpState.currentStreak}</Text>
              <Text style={styles.statLabel}>روز متوالی</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statValue}>{xpState.totalXP}</Text>
              <Text style={styles.statLabel}>XP کل</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🌸</Text>
              <Text style={styles.statValue}>{lifeFlower.petals}/12</Text>
              <Text style={styles.statLabel}>گلبرگ‌های زندگی</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📸</Text>
              <Text style={styles.statValue}>{memories.length}</Text>
              <Text style={styles.statLabel}>خاطره</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📅</Text>
              <Text style={styles.statValue}>{calendarEvents.length}</Text>
              <Text style={styles.statLabel}>رویداد تقویم</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🎨</Text>
              <Text style={styles.statValue}>{coloringPages.length}</Text>
              <Text style={styles.statLabel}>نقاشی</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>💎</Text>
              <Text style={styles.statValue}>{xpState.longestStreak}</Text>
              <Text style={styles.statLabel}>بیشترین استرک</Text>
            </View>
          </View>
            </View>
          )}
        </View>

        {/* Appearance Settings */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,107,157,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,157,0.18)' }]}
            onPress={() => setShowAppearanceSection(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showAppearanceSection ? '▾' : '▸'} 🎨 ظاهر و تم</Text>
          </TouchableOpacity>
          {showAppearanceSection && matchesSettings('ظاهر و تم', ['ظاهر','تم','رنگ','روشن','تاریک','خودکار','انیمیشن','حرکت','فصل']) && (
            <View style={{ marginTop: 10 }}>

          <TouchableOpacity
            style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,107,157,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,157,0.18)' }]}
            onPress={() => setShowDisplayMode(v => !v)}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showDisplayMode ? '▾' : '▸'} حالت نمایش</Text>
              <Text style={[styles.settingDescription, { marginTop: 2 }]}>روشن، تاریک، یا خودکار بر اساس تنظیمات سیستم</Text>
            </View>
          </TouchableOpacity>
          {showDisplayMode && (
            <View style={[styles.groupCard, { marginTop: 8, marginBottom: 10, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)' }]}>
              <View style={styles.themeModeRow}>
                {([
                  { id: 'light', label: '☀️ روشن' },
                  { id: 'dark', label: '🌙 تاریک' },
                  { id: 'auto', label: '⚙️ خودکار سیستم' },
                ] as const).map(opt => {
                  const active = (settings.theme || 'auto') === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.themeModeButton,
                        active && { backgroundColor: themeColors.primary, borderColor: themeColors.primary },
                      ]}
                      onPress={() => { updateSettings({ theme: opt.id }); setTheme(opt.id); }}
                    >
                      <Text style={[styles.themeModeButtonText, active && styles.themeModeButtonTextActive]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          <View style={styles.settingItemColumn}>
            {(() => {
              const currentPreset = themePresets.find(p => p.id === (settings.themePreset || 'joy')) || themePresets[0];
              return (
                <>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setShowSeasonalThemes(v => !v)}
                    style={[
                      styles.subAccordionHeader,
                      {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,107,157,0.06)',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,157,0.18)',
                        marginBottom: showSeasonalThemes ? 10 : 0,
                      },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>
                        {showSeasonalThemes ? '▾' : '▸'} تم و دنیای شخصیت‌ها
                      </Text>
                      <Text style={[styles.settingDescription, { marginTop: 2 }]}>
                        انتخاب‌شده: {currentPreset.emoji} {currentPreset.label} • با لمس، تم‌ها نمایش داده می‌شوند
                      </Text>
                    </View>
                    <View style={[styles.seasonThemeBadge, { backgroundColor: currentPreset.primaryLight }]}>
                      <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>فعال</Text>
                    </View>
                  </TouchableOpacity>

                  {showSeasonalThemes && (
                    <View style={{ gap: 10 }}>
                      <Text style={styles.settingDescription}>
                        با انتخاب هر تم، رنگ‌بندی و حال‌وهوای کل برنامه با شخصیت‌های Inside Out و Dream Productions تغییر می‌کند (پیش‌فرض: جوی)
                      </Text>
                      {themePresets.map((preset) => {
                        const active = (settings.themePreset || 'joy') === preset.id;
                        return (
                          <TouchableOpacity
                            key={preset.id}
                            activeOpacity={0.85}
                            onPress={() => { updateSettings({ themePreset: preset.id } as any); setShowSeasonalThemes(false); }}
                            style={[
                              styles.seasonThemeCard,
                              {
                                borderColor: active ? preset.primaryLight : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'),
                                backgroundColor: active ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.98)') : (isDark ? 'rgba(255,255,255,0.03)' : '#fff'),
                              },
                            ]}
                          >
                            <View style={styles.seasonThemeHeader}>
                              <Text style={{ fontSize: 22 }}>{preset.emoji}</Text>
                              <View style={{ flex: 1 }}>
                                <Text style={[styles.seasonThemeTitle, { color: themeColors.text }]}>{preset.label}</Text>
                                <Text style={[styles.seasonThemeDesc, { color: themeColors.textSecondary }]}>{preset.description}</Text>
                              </View>
                              <View style={[styles.seasonThemeBadge, { backgroundColor: active ? preset.primaryLight : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)') }]}>
                                <Text style={{ color: active ? '#fff' : themeColors.textSecondary, fontSize: 11, fontWeight: '700' }}>
                                  {active ? 'فعال ✓' : 'انتخاب'}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.seasonDotsRow}>
                              {preset.decor.map((c, i) => (
                                <View key={`${preset.id}-${i}`} style={[styles.seasonDot, { backgroundColor: c, borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }]} />
                              ))}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </>
              );
            })()}
          </View>

          <TouchableOpacity
            style={[styles.subAccordionHeader, { marginTop: 8, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,107,157,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,157,0.18)' }]}
            onPress={() => setShowMotionSettings(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showMotionSettings ? '▾' : '▸'} انیمیشن‌های پیشرفته</Text>
          </TouchableOpacity>
          {showMotionSettings && (
            <View style={[styles.groupCard, { marginTop: 8, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)' }]}>
              <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>انیمیشن‌های پیشرفته</Text>
                  <Text style={styles.settingDescription}>
                    حرکات شخصیت‌ها، گل زندگی، و انتقالات (در حالت کاهش حرکت غیرفعال می‌شود)
                  </Text>
                </View>
                <Switch
                  value={!settings.reducedMotion}
                  onValueChange={(value) => updateSettings({ reducedMotion: !value })}
                  thumbColor={themeColors.primary}
                  trackColor={{ false: '#B2BEC3', true: themeColors.primary }}
                />
              </View>
            </View>
          )}
            </View>
          )}
        </View>

        {/* Notifications, Sound & Language */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(78,205,196,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(78,205,196,0.18)' }]}
            onPress={() => setShowNotificationsSection(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showNotificationsSection ? '▾' : '▸'} 🔔 اعلان‌ها، صدا و زبان</Text>
          </TouchableOpacity>
          {showNotificationsSection && matchesSettings('اعلان‌ها، صدا و زبان', ['اعلان','صدا','موسیقی','زبان','تقویم','هشدار']) && (
            <View style={{ marginTop: 10 }}>

          <TouchableOpacity
            style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(78,205,196,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(78,205,196,0.18)' }]}
            onPress={() => setShowNotifySoundGroup(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showNotifySoundGroup ? '▾' : '▸'} اعلان و صدا</Text>
          </TouchableOpacity>
          {showNotifySoundGroup && (
            <View style={[styles.groupCard, { marginTop: 8, marginBottom: 10, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)' }]}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>اعلان‌های روزانه</Text>
                  <Text style={styles.settingDescription}>یادآوری برنامه‌ریزی، شگفتی شب و تشویق</Text>
                </View>
                <Switch
                  value={settings.notificationsEnabled}
                  onValueChange={(value) => updateSettings({ notificationsEnabled: value })}
                  thumbColor={themeColors.primary}
                  trackColor={{ false: isDark ? '#475569' : '#CBD5E1', true: themeColors.primary }}
                />
              </View>
              <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>موسیقی پس‌زمینه</Text>
                  <Text style={styles.settingDescription}>ملودی‌های آرام‌بخش در بخش‌های مختلف</Text>
                </View>
                <Switch
                  value={settings.musicEnabled}
                  onValueChange={(value) => updateSettings({ musicEnabled: value })}
                  thumbColor={themeColors.primary}
                  trackColor={{ false: isDark ? '#475569' : '#CBD5E1', true: themeColors.primary }}
                />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.subAccordionHeader, { marginTop: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(78,205,196,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(78,205,196,0.18)' }]}
            onPress={() => setShowLanguageCalendarGroup(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showLanguageCalendarGroup ? '▾' : '▸'} زبان و تقویم</Text>
          </TouchableOpacity>
          {showLanguageCalendarGroup && (
            <View style={[styles.groupCard, { marginTop: 8, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)' }]}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>زبان برنامه</Text>
                  <Text style={styles.settingDescription}>فارسی (پیش‌فرض) / English</Text>
                </View>
                <View style={styles.languageButton}><Text style={styles.languageButtonText}>فارسی 🇮🇷</Text></View>
              </View>
              <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>تقویم</Text>
                  <Text style={styles.settingDescription}>شمسی (هجری خورشیدی) با رویدادهای ایرانی</Text>
                </View>
                <View style={styles.languageButton}><Text style={styles.languageButtonText}>شمسی 🇮🇷</Text></View>
              </View>
            </View>
          )}
            </View>
          )}
        </View>

        {/* Data, Sync & Updates */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(116,185,255,0.08)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(116,185,255,0.22)' }]}
            onPress={() => setShowDataSection(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showDataSection ? '▾' : '▸'} 💾 داده، همگام‌سازی و بروزرسانی</Text>
          </TouchableOpacity>
          {showDataSection && matchesSettings('داده، همگام‌سازی و بروزرسانی', ['داده','همگام','سینک','sync','پشتیبان','بکاپ','خروجی','بروزرسانی','ذخیره','آفلاین','فایل']) && (
            <View style={{ marginTop: 10 }}>
          <TouchableOpacity
            style={[styles.subAccordionHeader, { marginBottom: 8, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(116,185,255,0.08)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(116,185,255,0.22)' }]}
            onPress={() => setShowDataStorageInfo(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showDataStorageInfo ? '▾' : '▸'} ذخیره آفلاین و وضعیت همگام‌سازی</Text>
          </TouchableOpacity>
          {showDataStorageInfo && (
            <View style={{ marginBottom: 10 }}>
              <Text style={[styles.sectionSubtitleInline, { color: themeColors.textSecondary, marginBottom: 8 }]}>پشتیبان‌گیری، انتقال بین دستگاه‌ها و وضعیت بروزرسانی/اتصال</Text>
              <View style={[styles.syncInfoBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(78,205,196,0.08)', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(78,205,196,0.25)' }]}>
                <Text style={[styles.syncInfoTitle, { color: themeColors.text }]}>ذخیره آفلاین + همگام‌سازی چنددستگاهی</Text>
                <Text style={[styles.syncInfoText, { color: themeColors.textSecondary }]}>
                  • داده‌ها همیشه به‌صورت آفلاین روی دستگاه ذخیره می‌شوند.{"\n"}
                  • همگام‌سازی اینترنتی/وای‌فای/دستی: بسته همگام‌سازی را ارسال/دریافت کنید.{"\n"}
                  دستگاه: {settings.sync?.deviceName || 'FamilyDevice'}{"\n"}
                  آخرین همگام‌سازی (بسته): {settings.sync?.lastSyncAt ? new Date(settings.sync.lastSyncAt).toLocaleString('fa-IR') : 'هنوز انجام نشده'}
                  {settings.sync?.lastSyncFrom ? `\nآخرین دریافت از: ${settings.sync.lastSyncFrom}` : ''}
                  {"\n"}آخرین بررسی اتصال: {formatFaDateTime(appUpdateState?.lastConnectedAt)}
                  {"\n"}آخرین تغییر ثبت‌شده: {formatFaDateTime(appUpdateState?.lastUpdatedAt)}
                  {"\n"}همگام‌سازی خودکار (وب): {(settings.sync?.autoSyncOnReconnect && settings.sync?.internetSyncEnabled) ? 'فعال' : 'غیرفعال'}
                  {(() => {
                    const updatedTs = appUpdateState?.lastUpdatedAt ? Date.parse(appUpdateState.lastUpdatedAt) : 0;
                    const syncTs = settings?.sync?.lastSyncAt ? Date.parse(settings.sync.lastSyncAt) : 0;
                    const unsynced = !!(updatedTs && (!syncTs || updatedTs > syncTs + 1000));
                    return `\nوضعیت همگام‌سازی: ${unsynced ? '⚠️ تغییرات جدید همگام‌سازی نشده‌اند (بسته جدید صادر/ارسال کنید)' : '✓ تا زمان آخرین تغییر ثبت‌شده همگام‌سازی انجام شده'}`;
                  })()}
                  {"\n\n"}خلاصه داده‌های محلی: خاطرات {toPersianDigits((memories || []).length)}، گالری {toPersianDigits((galleryPhotos || []).length)}، رویدادها {toPersianDigits((calendarEvents || []).length)}، رنگ‌آمیزی {toPersianDigits((coloringPages || []).length)}، کپسول زمان {toPersianDigits((timeCapsules || []).length)}، دنیای رویا {toPersianDigits((dreamWorlds || []).length)}، اعضای خانواده {toPersianDigits((familyMembers || []).length)}، فعالیت سلامت {toPersianDigits((healthActivities || []).length)} (برنامه {toPersianDigits((healthPlans || []).length)})، جلسات مشاوره {toPersianDigits((counselorSessions || []).length)}، گلبرگ‌ها {toPersianDigits(lifeFlower?.petals ?? 0)}/{toPersianDigits(12)}، XP {toPersianDigits(xpState?.totalXP ?? 0)} (سطح {toPersianDigits(xpState?.level ?? 1)})
                  {`\nگام امروز: ${(familyMembers || []).map((m: any) => {
                    const e = (dailySteps as any)?.[m.id];
                    const today = new Date().toISOString().split('T')[0];
                    const s = e?.date === today ? (e.steps || 0) : 0;
                    const g = e?.goal || 0;
                    const done = g > 0 && s >= g;
                    return `${m.name || m.id}: ${toPersianDigits(s)}/${toPersianDigits(g)}${done ? ' ✓' : ''}`;
                  }).join('، ')}`}
                  {(() => {
                    const today = new Date().toISOString().split('T')[0];
                    const r = (familyMembers || []).reduce((acc: { met: number; total: number; sum: number }, m: any) => {
                      const e = (dailySteps as any)?.[m.id];
                      const s = e?.date === today ? (e.steps || 0) : 0;
                      const g = e?.goal || 0;
                      acc.sum += s;
                      if (g > 0) { acc.total += 1; if (s >= g) acc.met += 1; }
                      return acc;
                    }, { met: 0, total: 0, sum: 0 });
                    if (r.total <= 0 && r.sum <= 0) return '';
                    const parts = [];
                    if (r.total > 0) parts.push(`هدف‌های گام تکمیل‌شده امروز: ${toPersianDigits(r.met)}/${toPersianDigits(r.total)}`);
                    if (r.sum > 0) parts.push(`مجموع گام خانواده امروز: ${toPersianDigits(r.sum)}`);
                    return `\n${parts.join(' • ')}`;
                  })()}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(78,205,196,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(78,205,196,0.18)' }]}
            onPress={() => setShowSyncSection(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showSyncSection ? '▾' : '▸'} همگام‌سازی دستگاه‌ها</Text>
          </TouchableOpacity>
          {showSyncSection && (
            <View style={[styles.groupCard, { marginTop: 8, marginBottom: 10, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)' }]}>
              <View style={[styles.settingItem, { alignItems: 'flex-start' }]}>
                <View style={[styles.settingInfo, { width: '100%' }]}>
                  <Text style={styles.settingLabel}>نام این دستگاه (برای بسته همگام‌سازی)</Text>
                  <TextInput
                    value={settings.sync?.deviceName || ''}
                    onChangeText={(v) => updateSettings({ sync: { ...(settings.sync || {}), deviceName: v } as any })}
                    placeholder="مثلاً FamilyPhone"
                    placeholderTextColor={themeColors.textSecondary}
                    style={[styles.memberEditInput, { color: themeColors.text, borderColor: isDark ? 'rgba(255,255,255,0.18)' : '#d9d9d9', marginTop: 6, width: '100%' }]}
                  />
                </View>
              </View>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>همگام‌سازی هنگام اتصال اینترنت</Text>
                  <Text style={styles.settingDescription}>آماده‌سازی/ارسال بسته هنگام آنلاین بودن</Text>
                </View>
                <Switch value={!!settings.sync?.internetSyncEnabled} onValueChange={(v) => updateSettings({ sync: { ...(settings.sync || {}), internetSyncEnabled: v } as any })} thumbColor={themeColors.primary} trackColor={{ false: '#B2BEC3', true: themeColors.primary }} />
              </View>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>همگام‌سازی از طریق وای‌فای (انتقال فایل)</Text>
                  <Text style={styles.settingDescription}>ارسال/دریافت بسته در شبکه محلی/اشتراک‌گذاری</Text>
                </View>
                <Switch value={!!settings.sync?.wifiSyncEnabled} onValueChange={(v) => updateSettings({ sync: { ...(settings.sync || {}), wifiSyncEnabled: v } as any })} thumbColor={themeColors.primary} trackColor={{ false: '#B2BEC3', true: themeColors.primary }} />
              </View>
              <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>همگام‌سازی خودکار پس از اتصال</Text>
                  <Text style={styles.settingDescription}>با فعال بودن همگام‌سازی اینترنتی، هنگام اتصال مجدد (وب) بررسی وضعیت/تغییرات انجام و زمان همگام‌سازی ثبت می‌شود</Text>
                </View>
                <Switch value={!!settings.sync?.autoSyncOnReconnect} onValueChange={(v) => updateSettings({ sync: { ...(settings.sync || {}), autoSyncOnReconnect: v } as any })} thumbColor={themeColors.primary} trackColor={{ false: '#B2BEC3', true: themeColors.primary }} />
              </View>
              <TouchableOpacity style={[styles.actionButton, syncingNow && { opacity: 0.6 }]} disabled={syncingNow} onPress={() => { void (async () => { setSyncingNow(true); try { await syncNow(); } finally { setSyncingNow(false); } })(); }}><Text style={styles.actionButtonText}>{syncingNow ? '⏳ در حال همگام‌سازی...' : '🌐 همگام‌سازی اینترنتی (آماده‌سازی/ارسال)'}</Text><Text style={styles.actionButtonDesc}>بررسی اتصال/تغییرات و آماده‌سازی بسته همگام‌سازی</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, exportingSync && { opacity: 0.6 }]} disabled={exportingSync} onPress={() => { void (async () => { setExportingSync(true); try { await exportSyncFile(); } finally { setExportingSync(false); } })(); }}><Text style={styles.actionButtonText}>{exportingSync ? '⏳ در حال ساخت بسته...' : '📡 ارسال بسته همگام‌سازی (وای‌فای/اشتراک‌گذاری)'}</Text><Text style={styles.actionButtonDesc}>فایل JSON همگام‌سازی بسازید و ارسال کنید</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, importingSync && { opacity: 0.6 }]} disabled={importingSync} onPress={() => { void (async () => { setImportingSync(true); try { await importSyncFile(); } finally { setImportingSync(false); } })(); }}><Text style={styles.actionButtonText}>{importingSync ? '⏳ در حال وارد کردن...' : '📥 دریافت و وارد کردن بسته همگام‌سازی'}</Text><Text style={styles.actionButtonDesc}>فایل دریافتی را انتخاب و همگام‌سازی کنید</Text></TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(116,185,255,0.08)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(116,185,255,0.22)' }]}
            onPress={() => setShowBackupSection(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showBackupSection ? '▾' : '▸'} پشتیبان‌گیری و بازیابی</Text>
          </TouchableOpacity>
          {showBackupSection && (
            <View style={[styles.groupCard, { marginTop: 8, marginBottom: 10, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)' }]}>
              <TouchableOpacity style={[styles.actionButton, exportingBackup && { opacity: 0.6 }]} disabled={exportingBackup} onPress={() => { void (async () => { setExportingBackup(true); try { await exportData(); } finally { setExportingBackup(false); } })(); }}><Text style={styles.actionButtonText}>{exportingBackup ? '⏳ در حال ساخت پشتیبان...' : '📤 صدور پشتیبان کامل (Backup JSON)'}</Text><Text style={styles.actionButtonDesc}>خروجی JSON کامل از تمام داده‌ها</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, importingBackup && { opacity: 0.6 }]} disabled={importingBackup} onPress={() => { void (async () => { setImportingBackup(true); try { await importData(); } finally { setImportingBackup(false); } })(); }}><Text style={styles.actionButtonText}>{importingBackup ? '⏳ در حال بازیابی...' : '📥 بازیابی پشتیبان کامل (Restore)'}</Text><Text style={styles.actionButtonDesc}>وارد کردن فایل پشتیبان قبلی</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, exporting3D && { opacity: 0.6 }]} disabled={exporting3D} onPress={() => { void (async () => { setExporting3D(true); try { await export3DData(); } finally { setExporting3D(false); } })(); }}><Text style={styles.actionButtonText}>{exporting3D ? '⏳ در حال ساخت خروجی 3D...' : '🖨️ خروجی پرینت سه‌بعدی (STL/OBJ/JSON)'}</Text><Text style={styles.actionButtonDesc}>مدل مش واقعی از قلم‌موهای رنگ‌آمیزی (OBJ/STL) + داده‌های JSON</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={resetAllData}><Text style={styles.actionButtonText}>🗑️ بازنشانی کامل داده‌ها</Text><Text style={styles.actionButtonDesc}>حذف تمام اطلاعات (غیرقابل بازگشت)</Text></TouchableOpacity>
            </View>
          )}


          <TouchableOpacity
            style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,184,148,0.08)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,184,148,0.22)' }]}
            onPress={() => setShowApkShareSection(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showApkShareSection ? '▾' : '▸'} اشتراک و دانلود APK</Text>
          </TouchableOpacity>
          {showApkShareSection && (
            <View style={[styles.groupCard, { marginTop: 8, marginBottom: 10, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)' }]}>
              <View style={[styles.settingItem, { alignItems: 'flex-start', borderBottomWidth: 0 }]}>
                <View style={[styles.settingInfo, { width: '100%' }]}>
                  <Text style={styles.settingLabel}>لینک دانلود APK</Text>
                  <Text style={styles.settingDescription}>لینک مستقیم فایل APK یا لینک ساخت EAS/میزبان را وارد کنید تا کاربران دیگر بتوانند دانلود و نصب کنند.</Text>
                  <TextInput
                    value={String((settings as any).apkDownloadUrl || '')}
                    onChangeText={(v) => updateSettings({ apkDownloadUrl: v } as any)}
                    placeholder="https://.../app-release.apk"
                    placeholderTextColor={themeColors.textSecondary}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                    style={[styles.memberEditInput, { color: themeColors.text, borderColor: isDark ? 'rgba(255,255,255,0.18)' : '#d9d9d9', marginTop: 8, width: '100%', textAlign: 'left', writingDirection: 'ltr' }]}
                  />
                  <Text style={[styles.settingDescription, { marginTop: 8 }]}>راهنما: با `eas build --platform android --profile preview` فایل APK بسازید، سپس لینک دانلود خروجی را اینجا قرار دهید.</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.actionButton, !getApkDownloadUrl() && { opacity: 0.6 }]} disabled={!getApkDownloadUrl()} onPress={() => { void openApkDownload(); }}>
                <Text style={styles.actionButtonText}>⬇️ دانلود / باز کردن APK</Text>
                <Text style={styles.actionButtonDesc}>باز کردن لینک دانلود برای دریافت و نصب برنامه</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, !getApkDownloadUrl() && { opacity: 0.6 }]} disabled={!getApkDownloadUrl()} onPress={() => { void shareApkDownload(); }}>
                <Text style={styles.actionButtonText}>🔗 اشتراک‌گذاری لینک APK</Text>
                <Text style={styles.actionButtonDesc}>ارسال لینک دانلود برای کاربران دیگر (واتساپ، تلگرام، پیامک و...)</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(116,185,255,0.08)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(116,185,255,0.22)' }]}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowUpdateSection(v => !v)} activeOpacity={0.8}>
              <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showUpdateSection ? '▾' : '▸'} وضعیت بروزرسانی و اتصال</Text>
              <Text style={[styles.settingDescription, { marginTop: 2 }]}>آخرین بررسی: {formatFaDateTime(appUpdateState?.lastCheckedAt)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { void onCheckUpdates(); }} style={[styles.smallActionButton, { borderColor: themeColors.primary, marginLeft: 8 }]}>
              <Text style={[styles.smallActionButtonText, { color: themeColors.primary }]}>{checkingUpdates ? '⏳' : '🔄'}</Text>
            </TouchableOpacity>
          </View>
          {showUpdateSection && (
            <View style={[styles.groupCard, { marginTop: 8, marginBottom: 4, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)' }]}>
              <View style={[styles.syncInfoBox, { marginBottom: 10, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(116,185,255,0.08)', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(116,185,255,0.25)' }]}>
                <Text style={[styles.syncInfoText, { color: themeColors.textSecondary }]}>آخرین اتصال اینترنت ثبت‌شده: {formatFaDateTime(appUpdateState?.lastConnectedAt)}{"\n"}آخرین بروزرسانی/تغییر ثبت‌شده: {formatFaDateTime(appUpdateState?.lastUpdatedAt)}{"\n"}وضعیت فعلی اینترنت: {(typeof navigator !== 'undefined' && (navigator as any)?.onLine) ? 'آنلاین' : 'آفلاین/نامشخص'}</Text>
              </View>
              <TouchableOpacity style={styles.actionButton} onPress={() => { void onCheckUpdates(); }} disabled={checkingUpdates}><Text style={styles.actionButtonText}>{checkingUpdates ? '⏳ در حال بررسی...' : '🌐 بررسی اتصال اینترنت و بروزرسانی‌ها'}</Text><Text style={styles.actionButtonDesc}>ثبت زمان اتصال و شناسایی بخش‌های تغییرکرده</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, !appUpdateState?.preUpdateSnapshot && { opacity: 0.55 }]} onPress={onRollbackUpdate} disabled={!appUpdateState?.preUpdateSnapshot}><Text style={styles.actionButtonText}>↩️ بازگشت به قبل از بروزرسانی</Text><Text style={styles.actionButtonDesc}>بازگردانی به وضعیت قبل از آخرین تغییر ثبت‌شده</Text></TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={onClearUpdateHistory}><Text style={styles.actionButtonText}>🧹 پاک‌سازی تاریخچه بررسی‌ها</Text><Text style={styles.actionButtonDesc}>حذف لیست بررسی‌ها (بدون حذف داده‌ها)</Text></TouchableOpacity>
              <View style={{ marginTop: 8 }}>
                <Text style={[styles.syncInfoTitle, { color: themeColors.text, marginBottom: 6 }]}>بخش‌های دارای تغییر (آخرین بررسی‌ها)</Text>
                {(appUpdateState?.history || []).length === 0 ? (
                  <Text style={{ color: themeColors.textSecondary, fontSize: 12 }}>هنوز بررسی‌ای انجام نشده است.</Text>
                ) : (
                  (appUpdateState.history || []).slice(0, 5).map((rec: any) => (
                    <View key={rec.id} style={[styles.updateHistoryCard, { borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#fff' }]}>
                      <Text style={{ color: themeColors.text, fontSize: 12, fontWeight: '700' }}>{formatFaDateTime(rec.checkedAt)} • {rec.internetConnected ? 'متصل' : 'قطع/نامشخص'} • {rec.updated ? 'تغییر ثبت شد' : 'بدون تغییر جدید'}</Text>
                      {!!rec.note && <Text style={{ color: themeColors.textSecondary, fontSize: 11, marginTop: 2 }}>{rec.note}</Text>}
                      {Array.isArray(rec.sections) && rec.sections.length > 0 ? (
                        <View style={{ marginTop: 4, gap: 2 }}>
                          {rec.sections.slice(0, 8).map((s: any, idx: number) => (
                            <Text key={`${rec.id}-${idx}`} style={{ color: themeColors.textSecondary, fontSize: 11 }}>• {s.label || s.section}{s.detail ? ` — ${s.detail}` : ''}</Text>
                          ))}
                        </View>
                      ) : null}
                    </View>
                  ))
                )}
              </View>
            </View>
          )}
            </View>
          )}
        </View>

        {/* Security & Privacy */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,107,157,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,157,0.18)' }]}
            onPress={() => setShowSecuritySection(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showSecuritySection ? '▾' : '▸'} 🔒 امنیت و حریم خصوصی</Text>
          </TouchableOpacity>
          {showSecuritySection && matchesSettings('امنیت و حریم خصوصی', ['امنیت','حریم','بیومتریک','اثر انگشت','چهره','رمز','قفل','2FA','رمزنگاری','کپسول']) && (
            <View style={{ marginTop: 10 }}>
          
          <TouchableOpacity
            style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,107,157,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,157,0.18)' }]}
            onPress={() => setShowSecurityEncryption(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showSecurityEncryption ? '▾' : '▸'} رمزگذاری داده‌ها</Text>
          </TouchableOpacity>
          {showSecurityEncryption && (
            <View style={[styles.securityItem, { marginTop: 8, marginBottom: 8 }]}>
              <Text style={styles.securityDesc}>ذخیره‌سازی محلی امن؛ گزینه‌های رمزنگاری پیشرفته در پیکربندی امنیتی گنجانده شده‌اند</Text>
              <View style={styles.securityBadge}><Text>🔐 فعال</Text></View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.subAccordionHeader, { marginTop: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,107,157,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,157,0.18)' }]}
            onPress={() => setShowSecurityBiometric(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showSecurityBiometric ? '▾' : '▸'} ورود با اثر انگشت / تشخیص چهره</Text>
          </TouchableOpacity>
          {showSecurityBiometric && (
            <View style={[styles.groupCard, { marginTop: 8, marginBottom: 8, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)' }]}>
              <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>قفل بیومتریک برنامه</Text>
                  <Text style={styles.settingDescription}>قفل کردن برنامه و ورود امن با Face ID / اثر انگشت. در صورت عدم پشتیبانی، دسترسی بدون قفل ادامه می‌یابد.</Text>
                </View>
                <Switch
                  value={!!backupConfig?.security?.biometricLock}
                  onValueChange={onToggleBiometric}
                  thumbColor={themeColors.primary}
                  trackColor={{ false: '#B2BEC3', true: themeColors.primary }}
                />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.subAccordionHeader, { marginTop: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,107,157,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,157,0.18)' }]}
            onPress={() => setShowSecurity2FA(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showSecurity2FA ? '▾' : '▸'} احراز هویت دو مرحله‌ای</Text>
          </TouchableOpacity>
          {showSecurity2FA && (
            <View style={[styles.groupCard, { marginTop: 8, marginBottom: 8, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)' }]}>
              <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>احراز هویت دو مرحله‌ای (محلی)</Text>
                  <Text style={styles.settingDescription}>فعال‌سازی علامت امنیتی محلی برای نقش فعال و تنظیمات حساس. تأیید کد/SMS سروری در صورت اتصال سرویس خارجی قابل افزودن است.</Text>
                </View>
                <Switch
                  value={!!backupConfig?.security?.twoFactorAuth}
                  onValueChange={(v) => v ? enableTwoFactorAuth(activeMemberId as any) : disableTwoFactorAuth(activeMemberId as any)}
                  thumbColor={themeColors.primary}
                  trackColor={{ false: '#B2BEC3', true: themeColors.primary }}
                />
              </View>
              <View style={{ marginTop: 10, gap: 8 }}>
                <Text style={[styles.settingLabel, { color: themeColors.text, fontSize: 13 }]}>حالت خصوصی داده‌ها</Text>
                {([
                  { k: 'childContent', l: 'محتوای کودک' },
                  { k: 'healthData', l: 'داده‌های سلامت' },
                  { k: 'dreamContent', l: 'محتوای رویاها' },
                  { k: 'therapistNotes', l: 'یادداشت‌های درمانگر' },
                ] as const).map(item => (
                  <View key={item.k} style={styles.settingItem}>
                    <View style={styles.settingInfo}><Text style={styles.settingLabel}>{item.l}</Text></View>
                    <Switch
                      value={!!backupConfig?.security?.privateMode?.[item.k]}
                      onValueChange={(v) => setPrivateMode(activeMemberId as any, item.k, v)}
                      thumbColor={themeColors.primary}
                      trackColor={{ false: '#B2BEC3', true: themeColors.primary }}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.subAccordionHeader, { marginTop: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,107,157,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,157,0.18)' }]}
            onPress={() => setShowSecurityOffline(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showSecurityOffline ? '▾' : '▸'} حالت آفلاین کامل</Text>
          </TouchableOpacity>
          {showSecurityOffline && (
            <View style={[styles.securityItem, { marginTop: 8, marginBottom: 8 }]}>
              <Text style={styles.securityDesc}>برنامه بدون اینترنت کار می‌کند، همگام‌سازی در اتصال</Text>
              <View style={styles.securityBadge}><Text>✅ فعال</Text></View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.subAccordionHeader, { marginTop: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,107,157,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,157,0.18)' }]}
            onPress={() => setShowSecurityCapsule(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showSecurityCapsule ? '▾' : '▸'} کپسول زمان خانواده</Text>
          </TouchableOpacity>
          {showSecurityCapsule && (
            <View style={[styles.securityItem, { marginTop: 8, marginBottom: 4 }]}>
              <Text style={styles.securityDesc}>پیام‌های قفل‌شده برای آینده (تولد ۱۸ سالگی و...)</Text>
              <View style={styles.securityBadge}><Text>✅ فعال</Text></View>
            </View>
          )}
            </View>
          )}
        </View>

        {/* About */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(116,185,255,0.08)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(116,185,255,0.22)' }]}
            onPress={() => setShowAboutSection(v => !v)}
          >
            <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showAboutSection ? '▾' : '▸'} ℹ️ درباره برنامه</Text>
          </TouchableOpacity>
          {showAboutSection && matchesSettings('درباره برنامه', ['درباره','نسخه','ویژگی','اعتبار']) && (
            <View style={{ marginTop: 10 }}>
          
          <View style={styles.aboutCard}>
            <View style={styles.aboutHeader}>
              <Text style={styles.aboutIcon}>🏠</Text>
              <View style={styles.aboutInfo}>
                <Text style={styles.aboutTitle}>زندگی من (مامان، بابا، دختر)</Text>
                <Text style={styles.aboutVersion}>نسخه 1.0.0 • Build 2024</Text>
              </View>
            </View>
            
            <Text style={styles.aboutDescription}>
              اپلیکیشن جامع خانواده برای رشد، یادگیری، خاطره‌سازی و برنامه‌ریزی آینده.
              طراحی شده با عشق برای خانواده‌های ایرانی، با استانداردهای جهانی و آینده‌نگر.
            </Text>

            <View style={styles.featuresList}>
              {[
                '🌸 گل زندگی شکوفا و تقویم خوشبختی',
                '📖 دفتر خاطرات چندحسی (متن، عکس، استیکر)',
                '🎨 رنگ‌آمیزی با عکس‌های کارتونی خانواده',
                '🌍 یادگیری زبان تا آیلتس ۱۰ (۳ روش + مامان/بابا)',
                '🔢 بازی ریاضی و 🎵 موسیقی پایه تا پیشرفته',
                '🤖 راهنمای هوش مصنوعی از صفر تا حرفه‌ای',
                '🌍 مهاجرت هوشمند با تحلیل کشورها',
                '✨ شگفتی‌های شب: حیوان، ستاره، فرهنگ ایران',
                '📋 برنامه‌ریزی روزانه با XP و Streak',
                '🌿 خانه سبز، اقتصاد خانواده، سرزمین آرزوها',
                '🔒 امنیت بالا، آفلاین‌فیرست، پشتیبان‌گیری',
                '♿ دسترسی‌پذیری کامل برای نیازهای خاص',
              ].map((feature, i) => (
                <Text key={i} style={styles.featureItem}>{feature}</Text>
              ))}
            </View>

            <View style={styles.credits}>
              <Text style={styles.creditsTitle}>طراحی و توسعه</Text>
              <Text style={styles.creditsText}>
                با الهام از Duolingo، Pixar، و عشق به خانواده
              </Text>
              <Text style={styles.creditsText}>
                تم بهاری، گل‌های ارغوانی، شخصیت یونیکورن سه‌بعدی
              </Text>
              <Text style={styles.creditsText}>
                برای ۵۰ سال آینده، برای همه نسل‌ها
              </Text>
            </View>
          </View>
            </View>
          )}
        </View>

        {/* نقشه برنامه و اطلاعات فنی */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🗺️ نقشه برنامه و اطلاعات فنی</Text>
          <TouchableOpacity
            style={[styles.actionButton, { marginBottom: 0 }]}
            onPress={() => setShowTechInfo(v => !v)}
          >
            <Text style={styles.actionButtonText}>{showTechInfo ? '▾' : '▸'} رودمپ، وابستگی‌ها و فلوچارت کامل برنامه</Text>
            <Text style={styles.actionButtonDesc}>نمایش درختی نقشه برنامه، فلوچارت وابستگی‌ها و الگوریتم/فلوچارت کامل سایت (با جزئیات)</Text>
          </TouchableOpacity>

          {showTechInfo && matchesSettings('نقشه برنامه و اطلاعات فنی', ['نقشه','رودمپ','معماری','دیاگرام','وابستگی','فلوچارت','فنی','الگوریتم']) && (
            <View style={{ marginTop: 10, gap: 10 }}>
              <TouchableOpacity
                style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(116,185,255,0.08)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(116,185,255,0.22)' }]}
                onPress={() => setShowArchitectureDiagram(v => !v)}
              >
                <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showArchitectureDiagram ? '▾' : '▸'} معماری کلی (System Architecture) — دیاگرام سطح بالا</Text>
              </TouchableOpacity>
              {showArchitectureDiagram && (
                <View style={[styles.diagramCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : themeColors.surface, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
                  <Text selectable style={[styles.monoDiagram, { color: themeColors.text }]}>{`┌─────────────────────────────────────────────────────────────┐
│                    React Native App                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│  │   UI Layer  │ │ Logic Layer │ │  Data Layer │             │
│  │ (Components)│ │ (Hooks/Ctx) │ │(AsyncStorage│             │
│  │             │ │             │ │  /Persist)  │             │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘             │
│         └───────────────┼───────────────┘                    │
│                         v                                    │
│              [ State / Events / Actions ]                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│  │  Animation  │ │    Audio    │ │   Network   │             │
│  │ (Reanimated)│ │  (Expo AV)  │ │(Sync/Update │             │
│  │             │ │             │ │  /Future)   │             │
│  └─────────────┘ └─────────────┘ └─────────────┘             │
└─────────────────────────────────────────────────────────────┘`}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,107,157,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,157,0.18)' }]}
                onPress={() => setShowRoadmapTree(v => !v)}
              >
                <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showRoadmapTree ? '▾' : '▸'} رودمپ / نقشه برنامه (نمایش درختی Tree)</Text>
              </TouchableOpacity>
              {showRoadmapTree && (
                <View style={[styles.diagramCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : themeColors.surface, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
                  <Text selectable style={[styles.monoDiagram, { color: themeColors.text }]}>{`زندگی من (My Life App)
├─ ۱) هسته و تجربه کاربری (Core / UX)
│  ├─ راه‌اندازی و ناوبری
│  │  ├─ Expo Router (تب‌ها: خانه، تقویم، تندرستی، AI، گالری، پروفایل و...)
│  │  ├─ RTL/fa و چیدمان فارسی
│  │  └─ Providerها: Theme → App(State/Persist) → Music → AppLock → RoleGate → Slot
│  ├─ تم و دسترس‌پذیری
│  │  ├─ حالت نمایش: روشن / تاریک / خودکار سیستم
│  │  ├─ تم‌های شخصیتی: 🌸 بهاری (پیش‌فرض) | ☀️ تابستانی | 🍂 پاییزی | ❄️ زمستانی
│  │  ├─ پالت خوانا برای هر تم در هر دو حالت (متن/سطح/مرز)
│  │  └─ تنظیمات دسترس‌پذیری (کاهش حرکت، کنتراست/فونت در ساختار)
│  └─ پروفایل و نقش‌ها
│     ├─ کارت نقش یکپارچه (انتخاب/چرخش نقش) + تعیین نقش فعال برنامه
│     └─ تنظیمات هر فرد: نام، آواتار/ایموجی/عکس، تاریخ تولد (تقویم شمسی + ورود دستی)
│
├─ ۲) خاطرات و محتوای خانواده (Memories & Content)
│  ├─ خانه: آواتارها، گل زندگی/گلبرگ‌ها، نقل‌قول، آمار سریع، شگفتی امروز
│  ├─ دفتر خاطرات: متن/عکس/استیکر، ویرایش و حذف
│  ├─ گالری: افزودن/ویرایش/حذف عکس و متادیتا
│  ├─ تقویم شمسی: تبدیل/امروز پویا، رویداد/دستاورد (افزودن/ویرایش/حذف)
│  └─ کتاب رنگ‌آمیزی: بوم SVG + PanResponder (رنگ/براش/پاک‌کن/undo/clear)،
│     واردسازی از گالری/دستگاه، طرح/راهنمای رنگ، ذخیره strokes/guide
│
├─ ۳) رشد، تندرستی و برنامه‌ریزی (Growth & Wellness)
│  ├─ برنامه روزانه و XP: تسک‌ها، تکمیل، streak/level، نقشه پیشرفت
│  ├─ مسیر AI: تب‌ها (ai/migration/planning/wonders)، استودیو/قالب پرامپت
│  ├─ تندرستی و احساسات: پروفایل، تمرین‌ها، ثبت احساس/چک‌این، برنامه/فعالیت سلامت
│  ├─ کپسول زمان: ایجاد/ویرایش/محتوا/باز کردن
│  ├─ شگفتی‌های شب/دانستنی‌ها: انتخاب و نمایش روزانه
│  └─ دنیای رویا/رویا‌درمانی: ساختار ورود و جلسات
│
├─ ۴) داده، همگام‌سازی و امنیت (Data & Security)
│  ├─ ذخیره‌سازی: آفلاین محلی (AsyncStorage) + بارگذاری/مهاجرت/ذخیره خودکار
│  ├─ پشتیبان‌گیری: صدور/بازیابی JSON کامل، بسته همگام‌سازی (اشتراک‌گذاری/واردسازی)
│  ├─ همگام‌سازی: تنظیمات اینترنت/وای‌فای/خودکار، آماده‌سازی/ارسال بسته
│  ├─ بروزرسانی برنامه (ردیابی): بررسی اتصال، ثبت زمان‌ها، شناسایی بخش‌های تغییر کرده،
│  │  تاریخچه، بازگشت به اسنپ‌شات قبل از آخرین تغییر ثبت‌شده
│  └─ امنیت: قفل بیومتریک اختیاری، حالت خصوصی/تنظیمات امنیتی
│
└─ ۵) در برنامه / تکمیل‌شونده (Roadmap Next)
   ├─ ویرایشگر Canvas/sketch پیشرفته (ابزارها/لایه‌ها/UX تکمیلی)
   ├─ همگام‌سازی ابری کامل + E2E encryption + احراز هویت دو مرحله‌ای واقعی
   ├─ دارایی‌های صوتی باندل و تست کامل دستگاه (EAS projectId/owner واقعی)
   ├─ تندرستی خانواده: گام‌شمار/Health APIs و پاداش‌های دسته‌بندی‌شده
   └─ «دنیای من»، بررسی خودکار راهنمای مهاجرت، تقویت آموزش پرامپت AI`}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(78,205,196,0.06)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(78,205,196,0.18)' }]}
                onPress={() => setShowDepsFlow(v => !v)}
              >
                <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showDepsFlow ? '▾' : '▸'} وابستگی‌های برنامه (الگوریتم / فلوچارت)</Text>
              </TouchableOpacity>
              {showDepsFlow && (
                <View style={[styles.diagramCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : themeColors.surface, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
                  <Text selectable style={[styles.monoDiagram, { color: themeColors.text }]}>{`[وابستگی‌ها / Dependencies Flowchart]

┌─────────────────────────────────────────────────────────────────────┐
│                         package.json (app)                          │
└───────────────┬───────────────────────────────┬─────────────────────┘
                │ Runtime (dependencies)         │ Dev (devDependencies)
                v                               v
┌───────────────────────────────┐   ┌─────────────────────────────────┐
│ هسته UI/پلتفرم                │   │ ابزار توسعه و ساخت               │
│ react, react-dom, react-native │   │ typescript, @types/react        │
│ react-native-web               │   │ @babel/core                     │
│ react-native-gesture-handler   │   │ babel-plugin-module-resolver    │
│ react-native-reanimated        │   │ react-native-svg-transformer    │
│ react-native-svg               │   │ eas-cli                         │
│ react-native-worklets          │   └─────────────────────────────────┘
│ @react-native-community/slider │
│ lottie-react-native            │
└───────────────┬───────────────┘
                v
┌───────────────────────────────┐
│ چارچوب و ناوبری Expo          │
│ expo (~51)                    │
│ expo-router (file-based tabs) │
└───────────────┬───────────────┘
                v
┌─────────────────────────────────────────────────────────────────────┐
│ سرویس‌ها و ماژول‌های Expo (دستگاه/ذخیره/رسانه/اشتراک)              │
├───────────────┬───────────────┬───────────────┬────────────────────┤
│ ذخیره/امنیت   │ رسانه/گرافیک  │ فایل/اشتراک   │ سیستم/احراز هویت    │
│ async-storage │ expo-av       │ expo-file-    │ expo-haptics       │
│ expo-secure-  │ expo-linear-  │   system      │ expo-screen-       │
│   store       │   gradient    │ expo-sharing  │   orientation      │
│ expo-crypto   │ expo-speech   │ expo-document-│ expo-local-        │
│               │ (react-native │   picker      │   authentication   │
│               │   -svg)       │               │                    │
└───────────────┴───────────────┴───────────────┴────────────────────┘
                v
┌───────────────────────────────┐
│ ابزار کمکی                    │
│ date-fns (تاریخ)              │
│ zustand (امکان state)         │
│ @expo/vector-icons (آیکن)     │
└───────────────┬───────────────┘
                v
        [ادغام در UI، هوک‌ها و منطق برنامه]`}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.subAccordionHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(116,185,255,0.08)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(116,185,255,0.22)' }]}
                onPress={() => setShowFullFlow(v => !v)}
              >
                <Text style={[styles.subAccordionTitle, { color: themeColors.text }]}>{showFullFlow ? '▾' : '▸'} الگوریتم و فلوچارت کامل سایت (تمام جزئیات)</Text>
              </TouchableOpacity>
              {showFullFlow && (
                <View style={[styles.diagramCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : themeColors.surface, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
                  <Text selectable style={[styles.monoDiagram, { color: themeColors.text }]}>{`[الگوریتم / فلوچارت کامل سایت (با جزئیات)]

(شروع برنامه)
     │
     v
[Providers / app/_layout.tsx]
     │  ThemeProvider ──(themeMode, themePreset)──┐
     │  AppProvider   ──(state + settings)───────┤
     │  MusicProvider                             │
     v                                            v
[ThemeSync] <── useEffect(settings.theme, settings.themePreset)
     │  setTheme(mode) + setThemePreset(preset) ⇒ themeColors سراسری
     v
[AppLockGate]
     │
     ├─(قفل غیرفعال یا وب/بدون بیومتریک/ثبت‌نشده)──> عبور
     └─(قفل فعال)──> بررسی سخت‌افزار/ثبت‌نام ──> Prompt بیومتریک
                         │ موفق ────────────────┘
                         │ خطا/لغو ──> صفحه قفل (fallback دستگاه)
     v
[RoleGate] ──(نقش/دسترسی)──> عبور
     v
[expo-router Slot / Tab Navigation]
     │
     ├─ Home: آواتارها، گل زندگی، نقل‌قول، آمار، شگفتی امروز
     ├─ Calendar: تقویم شمسی، رویداد/دستاورد (CRUD)
     ├─ Memories: خاطرات چندحسی (CRUD)
     ├─ Gallery: عکس‌ها (CRUD + import)
     ├─ Coloring: SVG drawing/import/guide/strokes (CRUD)
     ├─ Wellness/AI/Planning/...: تب‌ها و ابزارهای تخصصی
     └─ Profile/Settings: مدیریت کاربر و سیستم
            │
            ├─ [پروفایل و نقش‌ها] انتخاب نقش فعال، نام، آواتار/عکس، تاریخ تولد (تقویم+دستی)
            ├─ [ظاهر و تم] حالت روشن/تاریک/خودکار + تم فصلی (اعمال فوری سراسری، خوانا در هر دو حالت)
            ├─ [اعلان‌ها، صدا و زبان] سوئیچ‌ها و تنظیمات محلی
            ├─ [داده، همگام‌سازی و بروزرسانی]
            │    ├─ Backup JSON: export/import کامل
            │    ├─ Sync package: export/import + تنظیمات internet/wifi/auto
            │    ├─ syncNow: آماده‌سازی/ارسال بسته (در صورت آنلاین/فعال)
            │    ├─ reset: بازنشانی کامل داده‌ها
            │    └─ App update tracking: check اتصال + baseline بخش‌ها → history/snapshot
            │         └─ rollback به preUpdateSnapshot / clear history
            ├─ [امنیت و حریم خصوصی] قفل بیومتریک، وضعیت‌های امنیتی/آفلاین
            └─ [نقشه برنامه و اطلاعات فنی] درخت رودمپ، فلوچارت وابستگی‌ها، فلوچارت کامل سایت

[چرخه داده (Data Lifecycle) - AppContext]
     ├─ loadData() @hydrate: AsyncStorage → migrate/merge defaults → setState
     ├─ getPersistedData(): تجمیع stateها (+ appUpdateState, themePreset, ...)
     ├─ saveData() auto: تغییر state ⇒ persist
     ├─ export/import Backup JSON ⇄ فایل کاربر
     ├─ sync package ⇄ دستگاه دیگر
     ├─ resetAllData(): defaults + پاک‌سازی persisted
     └─ checkForAppUpdates(): probe اینترنت + امضای بخش‌ها
          ├─ تغییر ⇒ record + preUpdateSnapshot + baseline/زمان‌ها
          └─ بدون تغییر ⇒ record بررسی

[چرخه تم (Theme Pipeline)]
  کلیک تم/حالت → updateSettings({theme|themePreset}) → settings تغییر/persist
      → ThemeSync → useTheme.setTheme/setThemePreset
      → themeColors = palette[preset][mode] (خوانا در روشن/تاریک)
      → بازآرایی UI سراسری`}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.springFlowers}>
            {getThemeDecor((settings.themePreset as any) || 'joy').slice(0, 8).map((color, i) => (
              <View key={i} style={[styles.flowerDot, { backgroundColor: color }]} />
            ))}
          </View>
          <Text style={styles.footerText}>
            «هر روز فرصت جدیدی است برای شکوفا شدن، یادگیری و عشق ورزیدن»
          </Text>
          <Text style={styles.footerVersion}>
            Made with ❤️ for Iranian Families Worldwide
          </Text>
        </View>
      </ScrollView>
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
    paddingBottom: 140,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: tc.text,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: tc.textSecondary,
    marginTop: 4,
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
    gap: 12,
    marginBottom: 16,
  },
  memberEditList: {
    gap: 10,
    marginTop: 4,
  },
  memberEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  memberEditName: {
    fontSize: 14,
    fontWeight: '600',
  },
  memberEditAction: {
    fontSize: 12,
    fontWeight: '700',
  },
  memberEditForm: {
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
  },
  memberEditLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  memberEditInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  memberEditButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  memberCancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  memberCancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: tc.textSecondary,
  },
  memberSaveButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  memberSaveButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  avatarActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 4,
  },
  smallActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)',
  },
  smallActionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emojiPicker: {
    marginTop: 4,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  emojiPickerTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiOption: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
  },
  emojiOptionText: {
    fontSize: 20,
  },
  editNameButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,107,157,0.1)',
    borderWidth: 1,
    borderColor: '#FF6B9D',
    alignSelf: 'center',
  },
  editNameButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tc.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF6B9D',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: tc.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
  },
  settingItemColumn: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: tc.text,
  },
  settingDescription: {
    fontSize: 12,
    color: tc.textSecondary,
    marginTop: 2,
  },
  themeModeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  themeModeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
    alignItems: 'center',
  },
  themeModeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: tc.text,
    textAlign: 'center',
  },
  themeModeButtonTextActive: {
    color: '#FFFFFF',
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,107,157,0.1)',
    borderWidth: 1,
    borderColor: tc.primary,
  },
  languageButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: tc.primary,
  },
  actionButton: {
    flexDirection: 'column',
    padding: 16,
    borderRadius: 12,
    backgroundColor: tc.surface,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  dangerButton: {
    borderColor: '#E17055',
    backgroundColor: 'rgba(225,112,85,0.05)',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: tc.text,
    marginBottom: 2,
  },
  actionButtonDesc: {
    fontSize: 11,
    color: tc.textSecondary,
  },
  securityItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  securityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: tc.text,
    marginBottom: 4,
  },
  securityDesc: {
    fontSize: 12,
    color: tc.textSecondary,
    marginBottom: 8,
  },
  securityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,184,148,0.1)',
  },
  aboutCard: {
    backgroundColor: tc.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aboutIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  aboutInfo: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: tc.text,
  },
  aboutVersion: {
    fontSize: 12,
    fontWeight: '500',
    color: tc.textSecondary,
    marginTop: 2,
  },
  aboutDescription: {
    fontSize: 14,
    color: tc.text,
    lineHeight: 22,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  featuresList: {
    gap: 6,
    marginBottom: 16,
  },
  featureItem: {
    fontSize: 12,
    color: tc.text,
    lineHeight: 18,
  },
  credits: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  creditsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: tc.text,
    marginBottom: 6,
  },
  creditsText: {
    fontSize: 12,
    color: tc.textSecondary,
    lineHeight: 18,
    marginBottom: 2,
  },
  roleBox: {
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  roleDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  roleChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: tc.text,
  },
  rolePerms: {
    fontSize: 11,
    lineHeight: 16,
  },
  syncInfoBox: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  syncInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  syncInfoText: {
    fontSize: 12,
    lineHeight: 19,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  springFlowers: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  flowerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
    color: tc.primary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 8,
  },
  footerVersion: {
    fontSize: 11,
    color: tc.textMuted,
  },
  birthPickerCard: { marginTop: 8, padding: 10, borderRadius: 14, borderWidth: 1, gap: 2 },
  birthCalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, gap: 4 },
  birthNavBtn: { minWidth: 30, height: 28, paddingHorizontal: 4, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  birthWeekRow: { flexDirection: 'row', marginBottom: 2 },
  birthWeekCell: { width: '14.2857%', alignItems: 'center', justifyContent: 'center' },
  birthWeekDay: { textAlign: 'center', fontSize: 10, fontWeight: '600' },
  birthDaysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  birthDayCell: { width: '14.2857%', height: 28, alignItems: 'center', justifyContent: 'center' },
  birthDayBtn: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  birthActionRow: { flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  birthActionBtn: { flex: 1, minWidth: 70, paddingVertical: 8, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  birthActionText: { fontSize: 12, fontWeight: '700' },
  birthCalCompactWrap: { alignSelf: 'center', width: '100%', maxWidth: 280 },
  birthManualBox: { marginTop: 8 },
  birthManualInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, fontSize: 13 },
  roleUnifiedCard: { borderWidth: 1.5, borderRadius: 16, padding: 12 },
  roleUnifiedHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  roleUnifiedTitle: { fontSize: 16, fontWeight: '800' },
  roleUnifiedSub: { fontSize: 12, marginTop: 2 },
  roleUnifiedHint: { fontSize: 11, marginTop: 4, fontWeight: '600' },
  roleChoiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  roleChoiceChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1 },
  seasonThemeCard: { borderWidth: 1.5, borderRadius: 14, padding: 12, gap: 8 },
  seasonThemeHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  seasonThemeTitle: { fontSize: 14, fontWeight: '800' },
  seasonThemeDesc: { fontSize: 11, lineHeight: 17, marginTop: 2 },
  seasonThemeBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  seasonDotsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  seasonDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1 },
  groupCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  groupCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 2,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 10,
  },
  subSectionDivider: {
    borderTopWidth: 1,
    marginTop: 14,
  },
  sectionSubtitleInline: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: -8,
    marginBottom: 12,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerSearchBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerSearchText: { fontSize: 17 },
  settingsSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  settingsSearchIcon: { fontSize: 14 },
  settingsSearchInput: { flex: 1, fontSize: 14, paddingVertical: 2 },
  settingsSearchClear: { fontSize: 14, fontWeight: '700', paddingHorizontal: 4 },
  settingsSearchHint: { fontSize: 12, marginBottom: 6 },
  settingsSearchChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  settingsSearchChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  settingsSearchChipText: { fontSize: 12, fontWeight: '700' },
  subAccordionHeader: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  subAccordionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  diagramCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  monoDiagram: {
    fontSize: 11,
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  updateHistoryCard: { marginTop: 8, padding: 10, borderRadius: 12, borderWidth: 1 }
});
let styles: any = createStyles({ background:"#FFF8F0", surface:"#fff", text:"#1F2937", textSecondary:"#4B5563", textMuted:"#9CA3AF", primary:"#FF6B9D" }, false);

export default ProfileScreen;