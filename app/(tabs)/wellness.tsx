import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Animated, Easing, Switch, Modal, TextInput, Alert, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '../../hooks/useTheme';
import { useApp } from '../../hooks/AppContext';
import { toEnglishDigits } from '../../utils/jalali';
import { 
  EMOTION_TYPES, 
  THERAPY_CATEGORIES, 
  THERAPY_EXERCISES, 
  SPECIAL_NEEDS_PROFILES, 
  TIME_CAPSULE_TEMPLATES, 
  DREAM_SYMBOLS, 
  PARENTING_RESOURCES, 
  DEFAULT_ACCESSIBILITY_SETTINGS,
  SUPPORTIVE_AVATARS,
  PROGRESS_MAP_STATIONS,
  DREAM_THERAPY_ENVIRONMENTS,
  BACKUP_CONFIG,
  COUNSELOR_INTEGRATION,
  PARENTING_QUICK_GUIDES,
} from '../../constants/data';
import { 
  FamilyMember, 
  WellnessProfile, 
  TherapyExercise, 
  EmotionEntry, 
  TimeCapsule, 
  DreamEntry, 
  AccessibilitySettings,
  SupportiveAvatar,
  UserProgressMap,
  ProgressMapStation,
  DreamTherapyEnvironment,
  BackupConfig,
  BackupRecord,
  CounselorIntegrationConfig,
  CounselorProvider,
  CounselorSession,
  ParentingQuickGuide,
  EmotionType,
  DreamTherapySession,
  TherapyGoal,
} from '../../types';

// Forward declaration for styles (defined at bottom)
let styles: any;

export const WellnessScreen: React.FC = () => {
  const { themeColors, isDark } = useTheme();
  styles = React.useMemo(() => createStyles(themeColors, isDark), [themeColors, isDark]);
  const { 
    wellnessProfiles, 
    updateWellnessProfile, 
    therapyExercises, 
    getRecommendedExercises, 
    completeTherapyExercise,
    emotionEntries,
    addEmotionEntry,
    wellnessCheckIns,
    addWellnessCheckIn,
    timeCapsules,
    createTimeCapsule,
    addTimeCapsuleContent,
    deleteTimeCapsuleContent,
    openTimeCapsule,
    updateTimeCapsule,
    deleteTimeCapsule,
    dreamWorlds,
    createDreamWorld,
    addDreamEntry,
    interpretDream,
    shareDream,
    accessibilitySettings,
    updateAccessibilitySettings,
    parentingResources,
    therapySessions,
    createTherapySession,
    completeTherapySession,
    deleteTherapySession,
    familyMembers,
    xpState,
    addXP,
    // New features
    activeMemberId,
    setActiveMemberId,
    supportiveAvatar,
    setSupportiveAvatar,
    getDailyAvatarMessage,
    progressMaps,
    updateProgressMap,
    completeProgressStation,
    healthActivities,
    healthPlans,
    dailySteps,
    addHealthActivity,
    updateHealthActivity,
    deleteHealthActivity,
    addHealthPlan,
    updateHealthPlan,
    deleteHealthPlan,
    setDailySteps,
    dreamTherapyEnvironments,
    dreamTherapySessions,
    startDreamTherapySession,
    completeDreamTherapySession,
    backupConfig,
    backupRecords,
    updateBackupConfig,
    createBackup,
    restoreBackup,
    enableTwoFactorAuth,
    disableTwoFactorAuth,
    setPrivateMode,
    counselorConfig,
    counselorSessions,
    updateCounselorConfig,
    bookCounselorSession,
    updateCounselorSession,
    deleteCounselorSession,
    shareProgressWithCounselor,
    parentingQuickGuides,
    getQuickGuide,
    settings,
  } = useApp();
  
  const [selectedTab, setSelectedTab] = React.useState<
    'dashboard' | 'emotions' | 'therapy' | 'health' | 'time-capsule' | 'dreams' | 'accessibility' | 'parenting' | 'progress-map' | 'dream-therapy' | 'backup-security' | 'counselor'
  >('dashboard');
  const [entranceAnim] = React.useState(() => new Animated.Value(0));
  const [selectedMember, setSelectedMember] = React.useState<FamilyMember['id']>((activeMemberId as FamilyMember['id']) || 'daughter');
  React.useEffect(() => { if (activeMemberId) setSelectedMember(activeMemberId as any); }, [activeMemberId]);
  const [showEmotionModal, setShowEmotionModal] = React.useState(false);
  const [showCheckInModal, setShowCheckInModal] = React.useState(false);
  const [showCapsuleModal, setShowCapsuleModal] = React.useState(false);
  const [showDreamModal, setShowDreamModal] = React.useState(false);
  const [showAccessibilityModal, setShowAccessibilityModal] = React.useState(false);
  // New modals
  const [showAvatarModal, setShowAvatarModal] = React.useState(false);
  const [showBackupModal, setShowBackupModal] = React.useState(false);
  const [showCounselorModal, setShowCounselorModal] = React.useState(false);
  const [showQuickGuideModal, setShowQuickGuideModal] = React.useState<ParentingQuickGuide | null>(null);
  const [showTherapyGoalModal, setShowTherapyGoalModal] = React.useState(false);
  const [editingTherapyGoal, setEditingTherapyGoal] = React.useState<any>(null);
  const [goalTitle, setGoalTitle] = React.useState('');
  const [goalDesc, setGoalDesc] = React.useState('');
  const [goalCategory, setGoalCategory] = React.useState<TherapyGoal['category']>('emotional');
  const [goalProgress, setGoalProgress] = React.useState(0);
  const [goalTargetDate, setGoalTargetDate] = React.useState('');
  const [capsuleContentModalId, setCapsuleContentModalId] = React.useState<string | null>(null);
  const [capsuleContentTitle, setCapsuleContentTitle] = React.useState('');
  const [capsuleContentText, setCapsuleContentText] = React.useState('');
  const [capsuleContentType, setCapsuleContentType] = React.useState<'text' | 'letter' | 'wish' | 'prediction'>('text');
  const [editingCapsule, setEditingCapsule] = React.useState<TimeCapsule | null>(null);
  const [capsuleActionConfirm, setCapsuleActionConfirm] = React.useState<{ id: string; action: 'edit' | 'delete' } | null>(null);

  React.useEffect(() => {
    if (settings.reducedMotion) {
      entranceAnim.setValue(1);
      return;
    }
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entranceAnim, settings.reducedMotion]);

  const containerStyle = isDark ? styles.containerDark : styles.containerLight;
  const profile = wellnessProfiles[selectedMember];
  const recommendedExercises = getRecommendedExercises(selectedMember);
  const memberEmoji = selectedMember === 'baba' ? '👨‍🦱' : selectedMember === 'maman' ? '👩‍🦰' : '🌸';
  const memberName = selectedMember === 'baba' ? 'بابا' : selectedMember === 'maman' ? 'مامان' : 'دختر';

  const tabs = [
    { id: 'dashboard', label: 'داشبورد', icon: '📊' },
    { id: 'emotions', label: 'احساسات', icon: '💚' },
    { id: 'therapy', label: 'درمان', icon: '🌿' },
    { id: 'health', label: 'تندرستی', icon: '🏃' },
    { id: 'time-capsule', label: 'کپسول زمان', icon: '⏳' },
    { id: 'dreams', label: 'دنیای رویا', icon: '🌙' },
    { id: 'accessibility', label: 'دسترسی', icon: '♿' },
    { id: 'parenting', label: 'والدین', icon: '👨‍👩‍👧' },
    { id: 'progress-map', label: 'نقشه پیشرفت', icon: '🗺️' },
    { id: 'dream-therapy', label: 'درمان رویا', icon: '✨' },
    { id: 'backup-security', label: 'پشتیبان/امنیت', icon: '🔒' },
    { id: 'counselor', label: 'مشاور آنلاین', icon: '👨‍⚕️' },
  ];

  const opacity = entranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = entranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <SafeAreaView style={[styles.safeArea, containerStyle]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={themeColors.background} translucent />
      
      <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>🌿 دنیای من به سبک من</Text>
            <Text style={styles.headerSubtitle}>
              سلامت، احساسات، تندرستی، رشد و خاطرات برای {memberName}
            </Text>
          </View>
          <TouchableOpacity style={styles.memberSelector} onPress={() => setShowEmotionModal(true)}>
            <Text style={styles.memberEmoji}>{memberEmoji}</Text>
            <Text style={styles.memberName}>{memberName}</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Bar */}
        <ScrollView
          horizontal
          nestedScrollEnabled
          directionalLockEnabled
          showsHorizontalScrollIndicator={Platform.OS === 'web'}
          style={styles.tabBarScroll}
          contentContainerStyle={styles.tabContainer}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                selectedTab === tab.id && styles.tabButtonActive,
              ]}
              onPress={() => setSelectedTab(tab.id as any)}
              accessibilityRole="tab"
              accessibilityState={{ selected: selectedTab === tab.id }}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[
                styles.tabLabel,
                selectedTab === tab.id && styles.tabLabelActive,
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          {selectedTab === 'dashboard' && <DashboardTab />}
          {selectedTab === 'emotions' && <EmotionsTab />}
          {selectedTab === 'therapy' && <TherapyTab />}
          {selectedTab === 'health' && <HealthTab />}
          {selectedTab === 'time-capsule' && <TimeCapsuleTab />}
          {selectedTab === 'dreams' && <DreamsTab />}
          {selectedTab === 'accessibility' && <AccessibilityTab />}
          {selectedTab === 'parenting' && <ParentingTab />}
          {selectedTab === 'progress-map' && <ProgressMapTab />}
          {selectedTab === 'dream-therapy' && <DreamTherapyTab />}
          {selectedTab === 'backup-security' && <BackupSecurityTab />}
          {selectedTab === 'counselor' && <CounselorTab />}
        </ScrollView>
      </Animated.View>

      {/* Modals */}
      {showEmotionModal && <MemberSelectorModal selectedMember={selectedMember} onSelect={(id) => { setSelectedMember(id as FamilyMember["id"]); setActiveMemberId(id as any); setShowEmotionModal(false); }} onClose={() => setShowEmotionModal(false)} />}
      {showCheckInModal && <EmotionCheckInModal memberId={selectedMember} onClose={() => setShowCheckInModal(false)} />}
      {showCapsuleModal && <TimeCapsuleModal memberId={selectedMember} capsule={editingCapsule} onClose={() => { setShowCapsuleModal(false); setEditingCapsule(null); setCapsuleActionConfirm(null); }} />}
      {showDreamModal && <DreamEntryModal memberId={selectedMember} onClose={() => setShowDreamModal(false)} />}
      {capsuleContentModalId && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalLarge}>
            <Text style={styles.modalTitle}>افزودن آیتم به کپسول</Text>
            <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>نوع آیتم</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {([{id:'text',l:'یادداشت'},{id:'letter',l:'نامه'},{id:'wish',l:'آرزو'},{id:'prediction',l:'پیش‌بینی'}] as const).map(t => (
                    <TouchableOpacity key={t.id} style={[styles.includeOption, capsuleContentType===t.id && styles.includeSelected, { paddingVertical: 6, paddingHorizontal: 10 }]} onPress={() => setCapsuleContentType(t.id)}>
                      <Text style={styles.includeLabel}>{t.l}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>عنوان</Text>
                <TextInput style={styles.modalInput} value={capsuleContentTitle} onChangeText={setCapsuleContentTitle} placeholder="عنوان آیتم" />
              </View>
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>متن</Text>
                <TextInput style={[styles.modalInput,{minHeight:100,textAlignVertical:'top'}]} value={capsuleContentText} onChangeText={setCapsuleContentText} placeholder="متن، نامه، آرزو یا پیش‌بینی..." multiline />
              </View>
              <TouchableOpacity style={styles.modalSubmit} onPress={() => {
                if (!capsuleContentText.trim()) { Alert.alert('متن لازم است', 'لطفاً متن آیتم را وارد کنید.'); return; }
                addTimeCapsuleContent(capsuleContentModalId!, { type: capsuleContentType, title: capsuleContentTitle.trim() || 'آیتم جدید', content: capsuleContentText.trim(), authorId: selectedMember });
                setCapsuleContentModalId(null); setCapsuleContentTitle(''); setCapsuleContentText('');
              }}>
                <Text style={styles.modalSubmitText}>ذخیره آیتم</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setCapsuleContentModalId(null)}>
                <Text style={styles.modalCancelText}>انصراف</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}
      {showAccessibilityModal && <AccessibilityModal onClose={() => setShowAccessibilityModal(false)} />}
      {showAvatarModal && <AvatarSelectorModal onClose={() => setShowAvatarModal(false)} />}
      {showBackupModal && <BackupModal onClose={() => setShowBackupModal(false)} />}
      {showCounselorModal && <CounselorModal onClose={() => setShowCounselorModal(false)} />}
      {showQuickGuideModal && <QuickGuideModal guide={showQuickGuideModal} onClose={() => setShowQuickGuideModal(null)} />}
    </SafeAreaView>
  );

  const openTherapyGoalModal = (goal?: any) => {
    setEditingTherapyGoal(goal || null);
    setGoalTitle(goal?.title || '');
    setGoalDesc(goal?.description || '');
    setGoalCategory(goal?.category || 'emotional');
    setGoalProgress(typeof goal?.progress === 'number' ? goal.progress : 0);
    setGoalTargetDate(goal?.targetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setShowTherapyGoalModal(true);
  };
  const saveTherapyGoal = () => {
    if (!goalTitle.trim()) { Alert.alert('عنوان لازم است', 'لطفاً عنوان هدف درمانی را وارد کنید.'); return; }
    const profileNow = wellnessProfiles[selectedMember];
    const existing = profileNow?.therapyGoals || [];
    if (editingTherapyGoal?.id) {
      const nextGoals = existing.map((g: any) => g.id === editingTherapyGoal.id ? { ...g, title: goalTitle.trim(), description: goalDesc.trim(), category: goalCategory, progress: Math.max(0, Math.min(100, Math.round(goalProgress))), targetDate: goalTargetDate || g.targetDate, completed: Math.max(0, Math.min(100, Math.round(goalProgress))) >= 100 } : g);
      updateWellnessProfile(selectedMember, { therapyGoals: nextGoals });
    } else {
      const newGoal: TherapyGoal = {
        id: Date.now().toString(),
        category: goalCategory,
        title: goalTitle.trim(),
        description: goalDesc.trim(),
        targetDate: goalTargetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: Math.max(0, Math.min(100, Math.round(goalProgress))),
        exercises: [],
        completed: Math.max(0, Math.min(100, Math.round(goalProgress))) >= 100,
      };
      updateWellnessProfile(selectedMember, { therapyGoals: [...existing, newGoal] });
      addXP(10);
    }
    setShowTherapyGoalModal(false);
    setEditingTherapyGoal(null);
  };
  const toggleTherapyGoalComplete = (goalId: string) => {
    const profileNow = wellnessProfiles[selectedMember];
    const existing = profileNow?.therapyGoals || [];
    const nextGoals = existing.map((g: any) => g.id === goalId ? { ...g, completed: !g.completed, progress: !g.completed ? 100 : g.progress } : g);
    updateWellnessProfile(selectedMember, { therapyGoals: nextGoals });
    if (existing.find((g:any)=>g.id===goalId && !g.completed)) addXP(20);
  };
  const deleteTherapyGoal = (goalId: string) => {
    const profileNow = wellnessProfiles[selectedMember];
    const existing = profileNow?.therapyGoals || [];
    updateWellnessProfile(selectedMember, { therapyGoals: existing.filter((g: any) => g.id !== goalId) });
  };

  // Dashboard Tab
  function DashboardTab() {
    const today = new Date().toISOString().split('T')[0];
    const todayCheckIn = wellnessCheckIns.find(c => c.memberId === selectedMember && c.date.startsWith(today));
    const recentEmotions = emotionEntries.filter(e => e.memberId === selectedMember).slice(0, 5);
    const activeGoals = profile?.therapyGoals.filter(g => !g.completed).length || 0;
    const completedExercises = therapyExercises.filter(e => e.completed && e.id.startsWith(selectedMember)).length;
    const stepsInfo = (dailySteps && dailySteps[selectedMember]) || { date: today, steps: 0, goal: 6000 };
    const stepsToday = stepsInfo.date === today ? stepsInfo.steps : 0;
    const stepsGoal = stepsInfo.goal || 6000;
    const stepsPct = Math.min(100, Math.round((stepsToday / Math.max(1, stepsGoal)) * 100));
    const familyStepsSummary = (familyMembers || []).reduce((acc: { met: number; total: number; sum: number }, m: any) => {
      const e = (dailySteps as any)?.[m.id];
      const s = e?.date === today ? (e.steps || 0) : 0;
      const g = e?.goal || 0;
      acc.sum += s;
      if (g > 0) { acc.total += 1; if (s >= g) acc.met += 1; }
      return acc;
    }, { met: 0, total: 0, sum: 0 });
    const familyStepsGoals = { met: familyStepsSummary.met, total: familyStepsSummary.total };
    const familyStepsTotal = familyStepsSummary.sum;
    const memberActivitiesToday = (healthActivities || []).filter(a => a.memberId === selectedMember && a.date === today).length;
    const avatarMsg = typeof getDailyAvatarMessage === 'function' ? getDailyAvatarMessage(selectedMember, 'morning') : 'امروز هم قدمی کوچک برای حال خوب خودت بردار.';

    return (
      <View style={styles.tabContent}>
        {/* My World Hero */}
        <View style={[styles.sectionCard, { backgroundColor: isDark ? 'rgba(116,185,255,0.12)' : 'rgba(255,107,157,0.08)', borderColor: isDark ? 'rgba(116,185,255,0.25)' : 'rgba(255,107,157,0.2)', borderWidth: 1 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: 40 }}>{supportiveAvatar?.emoji || memberEmoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionTitle, { marginBottom: 4 }]}>{memberName}، به دنیای خودت خوش آمدی ✨</Text>
              <Text style={[styles.headerSubtitle, { lineHeight: 20 }]}>{avatarMsg}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            <View style={[styles.quickAction, { flex: 1, minWidth: 110 }]}>
              <Text style={styles.quickActionIcon}>👣</Text>
              <Text style={styles.quickActionLabel}>گام امروز</Text>
              <Text style={{ fontSize: 12, fontWeight: '700', color: themeColors.primary }}>{stepsToday.toLocaleString('fa-IR')}/{stepsGoal.toLocaleString('fa-IR')}</Text>
              <View style={{ marginTop: 6, height: 6, borderRadius: 4, width: '100%', backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : '#EAECEF', overflow: 'hidden' }}>
                <View style={{ width: `${stepsPct}%`, height: '100%', backgroundColor: stepsPct >= 100 ? '#00B894' : '#74B9FF' }} />
              </View>
              <Text style={{ fontSize: 10, marginTop: 2, color: themeColors.textSecondary || '#636E72' }}>{stepsPct}% {stepsPct >= 100 ? '✓ هدف تکمیل' : ''}</Text>
              {familyStepsGoals.total > 0 ? <Text style={{ fontSize: 10, marginTop: 2, color: themeColors.textSecondary || '#636E72' }}>خانواده: {familyStepsGoals.met.toLocaleString('fa-IR')}/{familyStepsGoals.total.toLocaleString('fa-IR')} هدف • {familyStepsTotal.toLocaleString('fa-IR')} گام</Text> : null}
            </View>
            <View style={[styles.quickAction, { flex: 1, minWidth: 90 }]}>
              <Text style={styles.quickActionIcon}>🏃</Text>
              <Text style={styles.quickActionLabel}>فعالیت امروز</Text>
              <Text style={{ fontSize: 12, fontWeight: '700', color: themeColors.primary }}>{memberActivitiesToday.toLocaleString('fa-IR')}</Text>
            </View>
            <TouchableOpacity style={[styles.quickAction, { flex: 1, minWidth: 90, borderColor: '#4ECDC4' }]} onPress={() => setSelectedTab('health')}>
              <Text style={styles.quickActionIcon}>💪</Text>
              <Text style={styles.quickActionLabel}>رفتن به تندرستی</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Wellness Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>85</Text>
            <Text style={styles.scoreLabel}>امتیاز سلامت</Text>
          </View>
          <View style={styles.scoreStats}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>💚</Text>
              <Text style={styles.statValue}>{activeGoals}</Text>
              <Text style={styles.statLabel}>هدف فعال</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>✅</Text>
              <Text style={styles.statValue}>{completedExercises}</Text>
              <Text style={styles.statLabel}>تمرین تکمیل</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📝</Text>
              <Text style={styles.statValue}>{recentEmotions.length}</Text>
              <Text style={styles.statLabel}>ثبت احساس</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>⏳</Text>
              <Text style={styles.statValue}>{timeCapsules.filter(c => c.creatorId === selectedMember).length}</Text>
              <Text style={styles.statLabel}>کپسول زمان</Text>
            </View>
          </View>
        </View>

        {/* Today's Check-in */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📅 چک‌ان امروز</Text>
          {todayCheckIn ? (
            <View style={styles.checkInDone}>
              <Text style={styles.checkInEmoji}>{EMOTION_TYPES.find(e => e.id === todayCheckIn.mood)?.emoji}</Text>
              <View style={styles.checkInInfo}>
                <Text style={styles.checkInMood}>{EMOTION_TYPES.find(e => e.id === todayCheckIn.mood)?.label}</Text>
                <Text style={styles.checkInDetails}>
                  انرژی: {todayCheckIn.energy}/10 • استرس: {todayCheckIn.stress}/10 • خواب: {todayCheckIn.sleep} ساعت
                </Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.checkInButton} onPress={() => setShowCheckInModal(true)} activeOpacity={0.8}>
              <Text style={styles.checkInButtonText}>+ ثبت چک‌ان روزانه</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⚡ عملیات سریع</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.quickAction, { borderColor: '#FF6B9D' }]} onPress={() => setShowCheckInModal(true)}>
              <Text style={styles.quickActionIcon}>💚</Text>
              <Text style={styles.quickActionLabel}>ثبت احساس</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickAction, { borderColor: '#74B9FF' }]} onPress={() => setSelectedTab('therapy')}>
              <Text style={styles.quickActionIcon}>🌿</Text>
              <Text style={styles.quickActionLabel}>شروع درمان</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickAction, { borderColor: '#A29BFE' }]} onPress={() => setShowCapsuleModal(true)}>
              <Text style={styles.quickActionIcon}>⏳</Text>
              <Text style={styles.quickActionLabel}>کپسول زمان</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickAction, { borderColor: '#55EFC4' }]} onPress={() => setShowDreamModal(true)}>
              <Text style={styles.quickActionIcon}>🌙</Text>
              <Text style={styles.quickActionLabel}>ثبت رویا</Text>
            </TouchableOpacity>
          </View>
          {familyStepsGoals.total > 0 && (
            <View style={{ marginTop: 12, padding: 10, borderRadius: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(116,185,255,0.08)', borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(116,185,255,0.2)' }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: themeColors.text }}>👣 اهداف گام امروز خانواده: {familyStepsGoals.met.toLocaleString('fa-IR')} / {familyStepsGoals.total.toLocaleString('fa-IR')}</Text>
              <View style={{ marginTop: 6, height: 8, borderRadius: 6, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#EAECEF', overflow: 'hidden' }}>
                <View style={{ width: `${Math.min(100, Math.round((familyStepsGoals.met / Math.max(1, familyStepsGoals.total)) * 100))}%`, height: '100%', backgroundColor: familyStepsGoals.met >= familyStepsGoals.total ? '#00B894' : '#74B9FF' }} />
              </View>
              <Text style={{ marginTop: 4, fontSize: 11, color: themeColors.textSecondary || '#636E72' }}>
                {familyStepsGoals.met >= familyStepsGoals.total ? 'همه اعضا به هدف امروز رسیدند!' : 'پیشرفت خانواده در رسیدن به هدف گام روزانه'} • مجموع: {familyStepsTotal.toLocaleString('fa-IR')} گام
              </Text>
            </View>
          )}
        </View>

        {/* Member Conditions */}
        {profile?.conditions.length && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>🎯 پروفایل نیازهای ویژه</Text>
            <View style={styles.conditionsList}>
              {profile.conditions.map(condId => {
                const cond = SPECIAL_NEEDS_PROFILES.find(p => p.id === condId);
                return cond && (
                  <View key={condId} style={styles.conditionItem}>
                    <Text style={styles.conditionEmoji}>{cond.emoji}</Text>
                    <Text style={styles.conditionLabel}>{cond.label}</Text>
                    <View style={[
                      styles.conditionBadge,
                      { backgroundColor: cond.color },
                    ]}>
                      <Text style={styles.conditionBadgeText}>پشتیبانی فعال</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Recent Emotions */}
        {recentEmotions.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>📈 اخیرین احساسات</Text>
            <View style={styles.emotionsTimeline}>
              {recentEmotions.map(emotion => {
                const emo = EMOTION_TYPES.find(e => e.id === emotion.emotion);
                return (
                  <View key={emotion.id} style={styles.emotionItem}>
                    <View style={[
                      styles.emotionDot,
                      { backgroundColor: emo?.color },
                    ]} />
                    <View style={styles.emotionInfo}>
                      <Text style={styles.emotionTime}>
                        {new Date(emotion.date).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      <View style={styles.emotionRow}>
                        <Text style={[
                          styles.emotionBadge,
                          { backgroundColor: emo?.color },
                        ]}>
                          {emo?.emoji} {emo?.label}
                        </Text>
                        <Text style={styles.emotionIntensity}>شدت: {emotion.intensity}/10</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Motivation */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationText}>
            «هر روز فرصت جدیدی است برای مراقبت از خود و عزیزانتان»
          </Text>
        </View>
      </View>
    );
  }

  // Emotions Tab
  function EmotionsTab() {
    return (
      <View style={styles.tabContent}>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💚 ثبت احساس جدید</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setShowEmotionModal(true)}>
              <Text style={styles.addButtonText}>+ احساس</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.exerciseDescription, { marginBottom: 10 }]}>شخصیت‌ها از Inside Out، Inside Out 2 و Dream Productions (استودیو رویاها) برای شناخت و ثبت احساسات</Text>
          
          <View style={styles.emotionGrid}>
            {EMOTION_TYPES.map(emotion => (
              <TouchableOpacity
                key={emotion.id}
                style={[
                  styles.emotionCard,
                  { borderColor: emotion.color },
                ]}
                onPress={() => {
                  addEmotionEntry({
                    memberId: selectedMember,
                    date: new Date().toISOString().split('T')[0],
                    time: new Date().toISOString().split('T')[1].substring(0, 5),
                    emotion: emotion.id as any,
                    intensity: 5,
                    triggers: [],
                    notes: `${(emotion as any).character || ''} • ${(emotion as any).source || ''}`.trim(),
                    tags: [(emotion as any).source, (emotion as any).character].filter(Boolean) as string[],
                  });
                  setShowEmotionModal(false);
                }}
              >
                <Text style={styles.emotionCardEmoji}>{emotion.emoji}</Text>
                <Text style={[
                  styles.emotionCardLabel,
                  { color: emotion.color },
                ]}>
                  {emotion.label}
                </Text>
                {(emotion as any).character ? (
                  <Text style={{ fontSize: 9, color: isDark ? '#cbd5e1' : '#636e72', textAlign: 'center', marginTop: 2 }} numberOfLines={2}>
                    {(emotion as any).character}
                  </Text>
                ) : null}
                {(emotion as any).source ? (
                  <Text style={{ fontSize: 8, color: (emotion as any).color || themeColors.textSecondary, textAlign: 'center' }} numberOfLines={1}>
                    {(emotion as any).source}
                  </Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📊 نمودار احساسات هفتگی</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}>📈 نمودار تعاملی احساسات (نمایش بصری)</Text>
            <Text style={styles.chartSubtext}>نمایش روند شادی، استرس، اضطراب در ۷ روز گذشته</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📋 تاریخچه احساسات</Text>
          {emotionEntries.filter(e => e.memberId === selectedMember).slice(0, 10).map(emotion => {
            const emo = EMOTION_TYPES.find(e => e.id === emotion.emotion);
            return (
              <View key={emotion.id} style={styles.historyItem}>
                <View style={[
                  styles.historyEmoji,
                  { backgroundColor: emo?.color },
                ]}>
                  {emo?.emoji}
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyDate}>
                    {new Date(emotion.date).toLocaleDateString('fa-IR')}
                  </Text>
                  <Text style={styles.historyEmotion}>{emo?.label} • شدت {emotion.intensity}/10</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  // Therapy Tab
  function TherapyTab() {
    const exercisesByCategory = THERAPY_CATEGORIES.map(cat => ({
      ...cat,
      exercises: therapyExercises.filter(ex => ex.category === cat.id),
    }));

    return (
      <View style={styles.tabContent}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🎯 تمرین‌های پیشنهادی برای {memberName}</Text>
          <View style={styles.exerciseList}>
            {recommendedExercises.slice(0, 5).map(ex => (
              <TouchableOpacity key={ex.id} style={styles.exerciseCard} onPress={() => completeTherapyExercise(ex.id, selectedMember)}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseIcon}>{THERAPY_CATEGORIES.find(c => c.id === ex.category)?.emoji}</Text>
                  <View style={[
                    styles.exerciseCategory,
                    { backgroundColor: THERAPY_CATEGORIES.find(c => c.id === ex.category)?.color },
                  ]}>
                    <Text style={styles.exerciseCategoryText}>{THERAPY_CATEGORIES.find(c => c.id === ex.category)?.label}</Text>
                  </View>
                  <View style={[
                    styles.exerciseDifficulty,
                    { backgroundColor: ex.difficulty === 'easy' ? '#00B894' : ex.difficulty === 'medium' ? '#FDCB6E' : '#E17055' },
                  ]}>
                    <Text style={styles.exerciseDifficultyText}>{ex.difficulty === 'easy' ? 'ساده' : ex.difficulty === 'medium' ? 'متوسط' : 'سخت'}</Text>
                  </View>
                </View>
                <Text style={styles.exerciseTitle}>{ex.title}</Text>
                <Text style={styles.exerciseDescription}>{ex.description}</Text>
                <View style={styles.exerciseMeta}>
                  <Text style={styles.exerciseDuration}>⏱ {ex.duration} دقیقه</Text>
                  <Text style={styles.exerciseXP}>+{15} XP</Text>
                  {ex.completed && <Text style={styles.exerciseDone}>✅ تکمیل شده</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📚 تمام دسته‌بندی‌ها</Text>
          <View style={styles.categoryGrid}>
            {exercisesByCategory.filter(c => c.exercises.length > 0).map(cat => (
              <TouchableOpacity key={cat.id} style={[styles.categoryCard, { borderColor: cat.color }]} onPress={() => setSelectedTab('therapy')}>
                <Text style={styles.categoryIcon}>{cat.emoji}</Text>
                <View style={[
                  styles.categoryColorBar,
                  { backgroundColor: cat.color },
                ]} />
                <Text style={[
                  styles.categoryTitle,
                  { color: cat.color },
                ]}>
                  {cat.label}
                </Text>
                <Text style={styles.categoryCount}>{cat.exercises.length} تمرین</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏆 اهداف درمانی</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => openTherapyGoalModal()}>
              <Text style={styles.addButtonText}>+ افزودن هدف</Text>
            </TouchableOpacity>
          </View>
          {profile?.therapyGoals.length ? (
            <View style={styles.goalsList}>
              {profile.therapyGoals.map(goal => (
                <View key={goal.id} style={styles.goalItem}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={[
                      styles.goalProgress,
                      { color: goal.progress >= 100 ? '#00B894' : themeColors.primary },
                    ]}>
                      {Math.round(goal.progress)}%
                    </Text>
                  </View>
                  <View style={[
                    styles.progressBar,
                    { backgroundColor: 'rgba(0,0,0,0.1)' },
                  ]}>
                    <View style={[
                      styles.progressFill,
                      { width: `${Math.max(0, Math.min(100, goal.progress))}%` },
                      { backgroundColor: goal.progress >= 100 ? '#00B894' : themeColors.primary },
                    ]} />
                  </View>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                  <Text style={[styles.goalDescription, { marginTop: 4 }]}>دسته: {THERAPY_CATEGORIES.find(c => c.id === goal.category)?.label || goal.category} • موعد: {goal.targetDate || '—'}</Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    <TouchableOpacity style={[styles.addButton, { paddingVertical: 6, paddingHorizontal: 10 }]} onPress={() => toggleTherapyGoalComplete(goal.id)}>
                      <Text style={styles.addButtonText}>{goal.completed || goal.progress >= 100 ? 'بازگشت به در حال انجام' : 'علامت تکمیل ✓'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.addButton, { paddingVertical: 6, paddingHorizontal: 10 }]} onPress={() => openTherapyGoalModal(goal)}>
                      <Text style={styles.addButtonText}>ویرایش</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.addButton, { paddingVertical: 6, paddingHorizontal: 10, borderColor: '#E17055' }]} onPress={() => deleteTherapyGoal(goal.id)}>
                      <Text style={[styles.addButtonText, { color: '#E17055' }]}>حذف</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyGoals}>
              <Text style={styles.emptyGoalsText}>هنوز هدفی تعریف نشده</Text>
              <TouchableOpacity style={styles.addGoalButton} onPress={() => openTherapyGoalModal()}>
                <Text style={styles.addGoalButtonText}>+ افزودن هدف</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }

  // Health Tab
  function HealthTab() {
    const today = new Date().toISOString().split('T')[0];
    const stepsInfo = (dailySteps && dailySteps[selectedMember]) || { date: today, steps: 0, goal: 6000 };
    const currentSteps = stepsInfo.date === today ? stepsInfo.steps : 0;
    const goalSteps = stepsInfo.goal || 6000;
    const memberActivities = (healthActivities || []).filter(a => a.memberId === selectedMember).sort((a,b)=> (b.date||'').localeCompare(a.date||''));
    const todayActivities = memberActivities.filter(a => a.date === today);
    const activePlans = (healthPlans || []).filter(p => p.memberId === selectedMember && p.active);
    const completedToday = todayActivities.filter(a => a.completed).length;
    const weeklyCompleted = memberActivities.filter(a => { const d=new Date(a.date); const n=new Date(); const diff=(n.getTime()-d.getTime())/(1000*60*60*24); return diff>=0 && diff<7 && a.completed; });
    const weeklyMinutes = weeklyCompleted.reduce((s,a)=>s+(a.duration||0),0);
    const weeklyStepsFromActivities = weeklyCompleted.reduce((s,a)=>s+((a as any).steps||0),0);
    const familyStepsSummary = (familyMembers || []).reduce((acc: { met: number; total: number; sum: number }, m: any) => {
      const e = (dailySteps as any)?.[m.id];
      const s = e?.date === today ? (e.steps || 0) : 0;
      const g = e?.goal || 0;
      acc.sum += s;
      if (g > 0) { acc.total += 1; if (s >= g) acc.met += 1; }
      return acc;
    }, { met: 0, total: 0, sum: 0 });
    const familyStepsGoals = { met: familyStepsSummary.met, total: familyStepsSummary.total };
    const familyStepsTotal = familyStepsSummary.sum;
    const [showStepsModal, setShowStepsModal] = React.useState(false);
    const [stepsInput, setStepsInput] = React.useState(String(currentSteps));
    const [goalInput, setGoalInput] = React.useState(String(goalSteps));
    const [confirmDeletePlanId, setConfirmDeletePlanId] = React.useState<string | null>(null);
    const [confirmDeleteActivityId, setConfirmDeleteActivityId] = React.useState<string | null>(null);

    React.useEffect(() => {
      setStepsInput(String(currentSteps));
      setGoalInput(String(goalSteps));
    }, [selectedMember, currentSteps, goalSteps]);

    const quickActivities = [
      { title: 'پیاده‌روی سبک', category: 'walking' as const, duration: 20, emoji: '🚶' },
      { title: 'ورزش خانوادگی', category: 'family' as const, duration: 15, emoji: '🤸' },
      { title: 'یوگا/کشش', category: 'yoga' as const, duration: 10, emoji: '🧘' },
      { title: 'بازی فعال', category: 'sports' as const, duration: 20, emoji: '⚽' },
      { title: 'مدیتیشن آرام', category: 'mindfulness' as const, duration: 5, emoji: '🌿' },
      { title: 'تمرین انعطاف/کشش سبک', category: 'flexibility' as const, duration: 5, emoji: '💧' },
    ];

    const logSteps = () => {
      setStepsInput(String(currentSteps));
      setGoalInput(String(goalSteps));
      setShowStepsModal(true);
    };

    const saveSteps = () => {
      const n = parseInt(toEnglishDigits(stepsInput || '0').replace(/[^\d]/g, ''), 10);
      const g = parseInt(toEnglishDigits(goalInput || '6000').replace(/[^\d]/g, ''), 10);
      if (isNaN(n) || n < 0) { Alert.alert('عدد نامعتبر', 'تعداد گام باید عدد معتبر (۰ یا بیشتر) باشد.'); return; }
      if (isNaN(g) || g <= 0) { Alert.alert('عدد نامعتبر', 'هدف گام روزانه باید بزرگ‌تر از صفر باشد.'); return; }
      const reachedNow = n >= g && currentSteps < g;
      const gained = n > currentSteps ? Math.min(20, Math.floor((n - currentSteps) / 1000) + 1) : 0;
      setDailySteps(selectedMember, n, g);
      if (gained > 0) addXP(gained);
      setShowStepsModal(false);
      Alert.alert(
        reachedNow ? '🎉 هدف انجام شد!' : 'ثبت شد',
        reachedNow
          ? `گام امروز: ${n.toLocaleString('fa-IR')} • هدف: ${g.toLocaleString('fa-IR')}\nهدف روزانه تکمیل شد (+۲۰ XP پاداش هدف).`
          : `گام امروز: ${n.toLocaleString('fa-IR')} • هدف: ${g.toLocaleString('fa-IR')}${gained > 0 ? `\n+${gained} XP` : ''}`
      );
    };

    const toggleActivity = (a: any) => {
      updateHealthActivity(a.id, { completed: !a.completed });
    };

    const addQuickPlan = (qa: {title:string; category:any; duration:number}) => {
      addHealthPlan({ memberId: selectedMember, title: qa.title, category: qa.category, weeklyTargetMinutes: qa.duration * 3, active: true });
      Alert.alert('برنامه اضافه شد', `«${qa.title}» به برنامه هفتگی ${memberName} اضافه شد.`);
    };

    const stepsPct = Math.min(100, Math.round((currentSteps / Math.max(1, goalSteps)) * 100));

    return (
      <View style={styles.tabContent}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🏃 تندرستی و تحرک خانواده</Text>
          <Text style={[styles.headerSubtitle, { marginBottom: 12 }]}>ثبت فعالیت، هدف گام و برنامه سلامتی با پاداش/XP. گام روزانه را دستی یا با دکمه‌های سریع (+۵۰۰/+۱۰۰۰) ثبت کنید؛ با رسیدن به هدف روزانه پاداش دریافت می‌شود (اتصال خودکار به سنسور گام/Health دستگاه در نسخه‌های بعدی).</Text>
          <View style={styles.progressOverview}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercent}>{stepsPct}%</Text>
              <Text style={styles.progressLabel}>هدف گام</Text>
            </View>
            <View style={styles.progressStats}>
              <View style={styles.statItem}><Text style={styles.statValue}>{currentSteps}</Text><Text style={styles.statLabel}>گام امروز</Text></View>
              <View style={styles.statItem}><Text style={styles.statValue}>{goalSteps}</Text><Text style={styles.statLabel}>هدف روزانه</Text></View>
              <View style={styles.statItem}><Text style={styles.statValue}>{weeklyMinutes}</Text><Text style={styles.statLabel}>دقیقه/هفته</Text></View>
              <View style={styles.statItem}><Text style={styles.statValue}>{completedToday}</Text><Text style={styles.statLabel}>فعالیت امروز</Text></View>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <View style={{ height: 10, borderRadius: 8, backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : '#EAECEF', overflow: 'hidden' }}>
              <View style={{ width: `${stepsPct}%`, height: '100%', backgroundColor: stepsPct >= 100 ? '#00B894' : '#74B9FF' }} />
            </View>
            <Text style={{ marginTop: 6, fontSize: 12, color: themeColors.textSecondary || '#636E72' }}>
              {currentSteps >= goalSteps ? '🎉 هدف امروز انجام شد! (پاداش روزانه +۲۰ XP)' : `باقی‌مانده: ${Math.max(0, goalSteps - currentSteps).toLocaleString('fa-IR')} گام`}
            </Text>
            <Text style={{ marginTop: 4, fontSize: 12, color: themeColors.textSecondary || '#636E72' }}>
              این هفته (فعالیت‌های تکمیل‌شده): {weeklyMinutes.toLocaleString('fa-IR')} دقیقه{weeklyStepsFromActivities > 0 ? ` • ${weeklyStepsFromActivities.toLocaleString('fa-IR')} گام ثبت‌شده در فعالیت‌ها` : ''}
            </Text>
            {familyStepsGoals.total > 0 ? (
              <View style={{ marginTop: 8, padding: 10, borderRadius: 10, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(116,185,255,0.08)', borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(116,185,255,0.2)' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: themeColors.text }}>اهداف گام امروز خانواده: {familyStepsGoals.met.toLocaleString('fa-IR')} / {familyStepsGoals.total.toLocaleString('fa-IR')} • مجموع: {familyStepsTotal.toLocaleString('fa-IR')} گام</Text>
                <View style={{ marginTop: 6, height: 8, borderRadius: 6, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#EAECEF', overflow: 'hidden' }}>
                  <View style={{ width: `${Math.min(100, Math.round((familyStepsGoals.met / Math.max(1, familyStepsGoals.total)) * 100))}%`, height: '100%', backgroundColor: familyStepsGoals.met >= familyStepsGoals.total ? '#00B894' : '#74B9FF' }} />
                </View>
              </View>
            ) : null}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <TouchableOpacity style={[styles.addButton, { paddingHorizontal: 14 }]} onPress={logSteps}><Text style={styles.addButtonText}>ثبت گام دستی</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.addButton, { paddingHorizontal: 14, backgroundColor: '#00B894' }]} onPress={() => {
              const next = currentSteps + 500;
              const reachedNow = next >= goalSteps && currentSteps < goalSteps;
              setDailySteps(selectedMember, next);
              addXP(2);
              if (reachedNow) Alert.alert('🎉 هدف انجام شد!', `گام امروز: ${next.toLocaleString('fa-IR')} • هدف: ${goalSteps.toLocaleString('fa-IR')}\nهدف روزانه تکمیل شد (+۲۰ XP پاداش هدف).`);
            }}><Text style={styles.addButtonText}>+۵۰۰ گام</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.addButton, { paddingHorizontal: 14, backgroundColor: '#4ECDC4' }]} onPress={() => {
              const next = currentSteps + 1000;
              const reachedNow = next >= goalSteps && currentSteps < goalSteps;
              setDailySteps(selectedMember, next);
              addXP(5);
              if (reachedNow) Alert.alert('🎉 هدف انجام شد!', `گام امروز: ${next.toLocaleString('fa-IR')} • هدف: ${goalSteps.toLocaleString('fa-IR')}\nهدف روزانه تکمیل شد (+۲۰ XP پاداش هدف).`);
            }}><Text style={styles.addButtonText}>+۱۰۰۰ گام</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.addButton, { paddingHorizontal: 14, backgroundColor: '#A29BFE' }]} onPress={() => { setDailySteps(selectedMember, 0); }}><Text style={styles.addButtonText}>ریست امروز</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⚡ فعالیت سریع + پاداش</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {quickActivities.map(q => (
              <View key={q.title} style={[styles.exerciseCard, { width: '47%' }]}>
                <Text style={{ fontSize: 22 }}>{q.emoji}</Text>
                <Text style={styles.exerciseTitle}>{q.title}</Text>
                <Text style={styles.exerciseDescription}>{q.duration} دقیقه • +XP</Text>
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                  <TouchableOpacity style={[styles.addButton, { flex: 1 }]} onPress={() => addHealthActivity({ memberId: selectedMember, date: today, title: q.title, category: q.category, duration: q.duration, completed: true })}><Text style={styles.addButtonText}>انجام شد</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.addButton, { flex: 1, borderColor: '#A29BFE' }]} onPress={() => addQuickPlan(q)}><Text style={[styles.addButtonText, { color: '#A29BFE' }]}>برنامه</Text></TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📋 برنامه‌های سلامتی فعال</Text>
          {activePlans.length === 0 ? <Text style={styles.emptyGoalsText}>هنوز برنامه سلامتی ثبت نشده. از فعالیت‌های سریع «برنامه» بسازید.</Text> : (
            <View style={styles.exerciseList}>
              {activePlans.map(p => (
                <View key={p.id} style={styles.exerciseCard}>
                  <Text style={styles.exerciseTitle}>{p.title}</Text>
                  <Text style={styles.exerciseDescription}>هدف هفتگی: {p.weeklyTargetMinutes} دقیقه{p.weeklyTargetSteps ? ` • ${p.weeklyTargetSteps} گام` : ''}</Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                    <TouchableOpacity style={styles.addButton} onPress={() => addHealthActivity({ memberId: selectedMember, date: today, title: p.title, category: p.category, duration: 15, completed: true })}><Text style={styles.addButtonText}>ثبت انجام</Text></TouchableOpacity>
                    {confirmDeletePlanId === p.id ? (
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        <TouchableOpacity style={[styles.addButton, { borderColor: '#E17055', backgroundColor: 'rgba(225,112,85,0.12)' }]} onPress={() => { deleteHealthPlan(p.id); setConfirmDeletePlanId(null); }}><Text style={[styles.addButtonText, { color: '#E17055' }]}>تأیید حذف (۲)</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.addButton, { borderColor: '#B2BEC3' }]} onPress={() => setConfirmDeletePlanId(null)}><Text style={[styles.addButtonText, { color: '#636E72' }]}>انصراف</Text></TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity style={[styles.addButton, { borderColor: '#E17055' }]} onPress={() => setConfirmDeletePlanId(p.id)}><Text style={[styles.addButtonText, { color: '#E17055' }]}>حذف</Text></TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🗓️ فعالیت‌های ثبت‌شده</Text>
          {memberActivities.length === 0 ? <Text style={styles.emptyGoalsText}>هنوز فعالیتی ثبت نشده است.</Text> : (
            <View style={styles.exerciseList}>
              {memberActivities.slice(0, 20).map(a => (
                <TouchableOpacity key={a.id} style={[styles.exerciseCard, a.completed && { borderColor: '#00B894' }]} onPress={() => toggleActivity(a)}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                    <Text style={styles.exerciseTitle}>{a.completed ? '✅ ' : '⬜ '}{a.title}</Text>
                    {confirmDeleteActivityId === a.id ? (
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        <TouchableOpacity onPress={() => { deleteHealthActivity(a.id); setConfirmDeleteActivityId(null); }} style={[styles.addButton, { paddingVertical: 4, paddingHorizontal: 8, borderColor: '#E17055', backgroundColor: 'rgba(225,112,85,0.12)' }]}><Text style={{ color: '#E17055', fontSize: 12, fontWeight: '700' }}>تأیید حذف (۲)</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => setConfirmDeleteActivityId(null)} style={[styles.addButton, { paddingVertical: 4, paddingHorizontal: 8, borderColor: '#B2BEC3' }]}><Text style={{ color: '#636E72', fontSize: 12 }}>انصراف</Text></TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity onPress={() => setConfirmDeleteActivityId(a.id)}><Text style={{ color: '#E17055', fontWeight: '600' }}>حذف</Text></TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.exerciseDescription}>{a.date} • {a.duration} دقیقه • {a.category}{a.steps ? ` • ${a.steps} گام` : ''}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {showStepsModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalLarge}>
              <Text style={styles.modalTitle}>ثبت گام و هدف روزانه</Text>
              <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>تعداد گام امروز ({memberName})</Text>
                  <TextInput style={styles.modalInput} value={stepsInput} onChangeText={setStepsInput} keyboardType="numeric" placeholder="مثال: 4500" />
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>هدف گام روزانه</Text>
                  <TextInput style={styles.modalInput} value={goalInput} onChangeText={setGoalInput} keyboardType="numeric" placeholder="مثال: 6000" />
                </View>
                <TouchableOpacity style={styles.modalSubmit} onPress={saveSteps}>
                  <Text style={styles.modalSubmitText}>ذخیره گام و هدف</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setShowStepsModal(false)}>
                  <Text style={styles.modalCancelText}>انصراف</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    );
  }

  // Time Capsule Tab
  function TimeCapsuleTab() {
    const memberCapsules = timeCapsules.filter(c => c.creatorId === selectedMember || c.participants.includes(selectedMember));

    const onCapsuleEditPress = (capsule: TimeCapsule) => {
      if (capsuleActionConfirm?.id === capsule.id && capsuleActionConfirm.action === 'edit') {
        setEditingCapsule(capsule);
        setShowCapsuleModal(true);
        setCapsuleActionConfirm(null);
      } else {
        setCapsuleActionConfirm({ id: capsule.id, action: 'edit' });
      }
    };
    const onCapsuleDeletePress = (capsule: TimeCapsule) => {
      if (capsuleActionConfirm?.id === capsule.id && capsuleActionConfirm.action === 'delete') {
        deleteTimeCapsule(capsule.id);
        setCapsuleActionConfirm(null);
      } else {
        setCapsuleActionConfirm({ id: capsule.id, action: 'delete' });
      }
    };

    return (
      <View style={styles.tabContent}>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⏳ کپسول‌های زمان</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => { setEditingCapsule(null); setCapsuleActionConfirm(null); setShowCapsuleModal(true); }}>
              <Text style={styles.addButtonText}>+ کپسول جدید</Text>
            </TouchableOpacity>
          </View>

          {memberCapsules.length === 0 ? (
            <View style={styles.emptyGoalsText}>
              <Text style={styles.emptyIcon}>⏳</Text>
              <Text style={styles.emptyTitle}>هنوز کپسول زمان ساخته نشده</Text>
              <Text style={styles.emptySubtitle}>خاطرات، آرزوها و پیش‌بینی‌ها را برای آینده ذخیره کنید</Text>
            </View>
          ) : (
            <View style={styles.capsulesList}>
              {memberCapsules.map(capsule => {
                const editConfirm = capsuleActionConfirm?.id === capsule.id && capsuleActionConfirm.action === 'edit';
                const deleteConfirm = capsuleActionConfirm?.id === capsule.id && capsuleActionConfirm.action === 'delete';
                return (
                <View key={capsule.id} style={styles.capsuleCard}>
                  <View style={styles.capsuleHeader}>
                    <View style={[
                      styles.capsuleTypeIcon,
                      { backgroundColor: capsule.isLocked ? '#A29BFE' : '#00B894' },
                    ]}>
                      <Text style={styles.capsuleTypeEmoji}>{capsule.isLocked ? '🔒' : '🔓'}</Text>
                    </View>
                    <View style={styles.capsuleInfo}>
                      <Text style={styles.capsuleTitle}>{capsule.title}</Text>
                      <Text style={styles.capsuleTarget}>
                        {capsule.unlockCondition === 'age' && `بازشود در ${capsule.targetAge} سالگی`}
                        {capsule.unlockCondition === 'date' && `بازشود در ${new Date(capsule.targetDate).toLocaleDateString('fa-IR')}`}
                        {capsule.unlockCondition === 'event' && `بازشود در رویداد: ${capsule.targetEvent}`}
                        {capsule.unlockCondition === 'manual' && 'بازشود دستی'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.capsuleDescription}>{capsule.description}</Text>
                  <View style={styles.capsuleMeta}>
                    <Text style={styles.capsuleContentCount}>{capsule.content.length} آیتم</Text>
                    <Text style={styles.capsuleCreated}>ساخته شده: {new Date(capsule.createdAt).toLocaleDateString('fa-IR')}</Text>
                  </View>
                  {!capsule.isLocked && capsule.content.length > 0 && (
                    <View style={{ marginTop: 10, gap: 6 }}>
                      {capsule.content.slice(-5).map(item => (
                        <View key={item.id} style={{ padding: 10, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.04)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                            <Text style={{ fontWeight: '700', fontSize: 13, color: '#2D3436', flex: 1 }}>{item.type === 'letter' ? '✉️' : item.type === 'wish' ? '🌟' : item.type === 'prediction' ? '🔮' : '📝'} {item.title}</Text>
                            <TouchableOpacity
                              hitSlop={8}
                              accessibilityRole="button"
                              accessibilityLabel="حذف آیتم کپسول"
                              onPress={() => {
                                Alert.alert(
                                  'حذف آیتم',
                                  `آیتم «${item.title}» حذف شود؟`,
                                  [
                                    { text: 'انصراف', style: 'cancel' },
                                    { text: 'حذف', style: 'destructive', onPress: () => deleteTimeCapsuleContent(capsule.id, item.id) },
                                  ]
                                );
                              }}
                            >
                              <Text style={{ fontSize: 12, color: '#E17055', fontWeight: '700' }}>حذف</Text>
                            </TouchableOpacity>
                          </View>
                          <Text style={{ fontSize: 12, color: '#636E72', marginTop: 2 }} numberOfLines={3}>{item.content}</Text>
                        </View>
                      ))}
                      {capsule.content.length > 5 ? <Text style={{ fontSize: 11, color: '#636E72' }}>+ {capsule.content.length - 5} آیتم دیگر</Text> : null}
                    </View>
                  )}
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                    {capsule.isLocked ? (
                      <TouchableOpacity style={[styles.openButton, { flex: 1, backgroundColor: '#A29BFE' }]} onPress={() => {
                        Alert.alert(
                          'باز کردن کپسول',
                          capsule.unlockCondition === 'manual' ? 'این کپسول دستی است. اکنون باز شود؟' : 'شرط باز شدن این کپسول هنوز ممکن است فرا نرسیده باشد. آیا می‌خواهید اکنون آن را باز کنید؟',
                          [
                            { text: 'انصراف', style: 'cancel' },
                            { text: 'باز کن', onPress: () => openTimeCapsule(capsule.id) },
                          ]
                        );
                      }}>
                        <Text style={styles.openButtonText}>باز کردن/گشودن 🔓</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={[styles.openButton, { flex: 1 }]} onPress={() => openTimeCapsule(capsule.id)}>
                        <Text style={styles.openButtonText}>مشاهده محتوای بازشده 🔓</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={[styles.addButton, { borderColor: '#00B894', paddingVertical: 8, paddingHorizontal: 12 }]} onPress={() => { setCapsuleContentModalId(capsule.id); setCapsuleContentTitle(''); setCapsuleContentText(''); setCapsuleContentType('text'); }}>
                      <Text style={[styles.addButtonText, { color: '#00B894' }]}>+ افزودن آیتم</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.addButton, { borderColor: editConfirm ? '#FDCB6E' : '#74B9FF', backgroundColor: editConfirm ? 'rgba(253,203,110,0.12)' : 'transparent', paddingVertical: 8, paddingHorizontal: 12 }]}
                      onPress={() => onCapsuleEditPress(capsule)}
                    >
                      <Text style={[styles.addButtonText, { color: editConfirm ? '#B7791F' : '#0984E3' }]}>{editConfirm ? 'تأیید ویرایش (مرحله ۲)' : 'ویرایش'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.addButton, { borderColor: deleteConfirm ? '#E17055' : '#E17055', backgroundColor: deleteConfirm ? 'rgba(225,112,85,0.12)' : 'transparent', paddingVertical: 8, paddingHorizontal: 12 }]}
                      onPress={() => onCapsuleDeletePress(capsule)}
                    >
                      <Text style={[styles.addButtonText, { color: '#E17055' }]}>{deleteConfirm ? 'تأیید حذف (مرحله ۲)' : 'حذف'}</Text>
                    </TouchableOpacity>
                    {(editConfirm || deleteConfirm) && (
                      <TouchableOpacity style={[styles.addButton, { borderColor: '#B2BEC3', paddingVertical: 8, paddingHorizontal: 12 }]} onPress={() => setCapsuleActionConfirm(null)}>
                        <Text style={[styles.addButtonText, { color: '#636E72' }]}>انصراف</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );})}
            </View>
          )}

          <View style={styles.templatesSection}>
            <Text style={styles.sectionTitle}>📋 قالب‌های آماده</Text>
            <View style={styles.templatesGrid}>
              {TIME_CAPSULE_TEMPLATES.map(template => (
                <TouchableOpacity key={template.id} style={styles.templateCard} onPress={() => {
                  createTimeCapsule({
                    title: template.title,
                    description: template.description,
                    creatorId: selectedMember,
                    targetDate: template.targetDate || new Date(Date.now() + 365*24*60*60*1000).toISOString(),
                    unlockCondition: template.unlockCondition as 'date' | 'age' | 'event' | 'manual',
                    targetAge: template.targetAge,
                    targetEvent: template.targetEvent,
                    content: [],
                    participants: familyMembers.map(m => m.id),
                    isLocked: true,
                  });
                  setShowCapsuleModal(false);
                }}>
                  <Text style={styles.templateEmoji}>📦</Text>
                  <Text style={styles.templateTitle}>{template.title}</Text>
                  <Text style={styles.templateDesc}>{template.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Dreams Tab
  function DreamsTab() {
    const memberDreams = dreamWorlds.flatMap(w => w.entries.filter(e => e.memberId === selectedMember));
    const [expandedDreamId, setExpandedDreamId] = React.useState<string | null>(null);

    return (
      <View style={styles.tabContent}>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🌙 ثبت رویای جدید</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setShowDreamModal(true)}>
              <Text style={styles.addButtonText}>+ رویا</Text>
            </TouchableOpacity>
          </View>

          {memberDreams.length === 0 ? (
            <View style={styles.emptyGoalsText}>
              <Text style={styles.emptyIcon}>🌙</Text>
              <Text style={styles.emptyTitle}>هنوز رویایی ثبت نشده</Text>
              <Text style={styles.emptySubtitle}>رویاهای خود را ثبت کنید و معناهای پنهانشان را کشف کنید</Text>
            </View>
          ) : (
            <View style={styles.dreamsList}>
              {memberDreams.slice(0, 10).map(dream => (
                <View key={dream.id} style={styles.dreamCard}>
                  <View style={styles.dreamHeader}>
                    <Text style={styles.dreamDate}>{new Date(dream.date).toLocaleDateString('fa-IR')}</Text>
                    <View style={styles.dreamTags}>
                      {dream.emotions.slice(0, 3).map(em => (
                        <Text key={em} style={[
                          styles.dreamEmotionTag,
                          { backgroundColor: EMOTION_TYPES.find(e => e.id === em)?.color },
                        ]}>
                          {EMOTION_TYPES.find(e => e.id === em)?.emoji} {EMOTION_TYPES.find(e => e.id === em)?.label}
                        </Text>
                      ))}
                    </View>
                  </View>
                  <Text style={styles.dreamTitle}>{dream.title}</Text>
                  <Text style={styles.dreamDescription}>{dream.description}</Text>
                  {dream.symbols.length > 0 && (
                    <View style={styles.dreamSymbols}>
                      <Text style={styles.dreamSymbolsLabel}>نمادها: </Text>
                      {dream.symbols.slice(0, 5).map((sym, i) => (
                        <Text key={i} style={styles.dreamSymbol}>
                          {sym.symbol} ({sym.meaning})
                        </Text>
                      ))}
                    </View>
                  )}
                  {dream.interpretation && (
                    <View style={styles.dreamInterpretation}>
                      <TouchableOpacity onPress={() => setExpandedDreamId(expandedDreamId === dream.id ? null : dream.id)}>
                        <Text style={styles.interpretationLabel}>🤖 تفسیر رویا {expandedDreamId === dream.id ? '▾' : '▸'}</Text>
                      </TouchableOpacity>
                      <Text style={styles.interpretationText}>{dream.interpretation.modernPsychology}</Text>
                      {expandedDreamId === dream.id && (
                        <View style={{ marginTop: 8, gap: 6 }}>
                          <Text style={styles.interpretationText}><Text style={{ fontWeight: '700' }}>یونگی: </Text>{dream.interpretation.jungianAnalysis}</Text>
                          <Text style={styles.interpretationText}><Text style={{ fontWeight: '700' }}>فرویدی: </Text>{dream.interpretation.freudianAnalysis}</Text>
                          <Text style={styles.interpretationText}><Text style={{ fontWeight: '700' }}>بافت خانواده: </Text>{dream.interpretation.familyContext}</Text>
                          {Array.isArray(dream.interpretation.suggestions) && dream.interpretation.suggestions.length > 0 && (
                            <View style={{ marginTop: 4 }}>
                              <Text style={[styles.interpretationLabel, { fontSize: 12 }]}>پیشنهادها:</Text>
                              {dream.interpretation.suggestions.map((s: string, i: number) => <Text key={i} style={styles.interpretationText}>• {s}</Text>)}
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  )}
                  <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {!dream.interpretation && (
                      <TouchableOpacity style={styles.interpretButton} onPress={() => interpretDream(dream.id)}>
                        <Text style={styles.interpretButtonText}>تفسیر با AI 🤖</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={[styles.interpretButton, { borderColor: dream.isShared ? '#00B894' : '#A29BFE' }]} onPress={() => {
                      if (dream.isShared) { Alert.alert('اشتراک‌گذاری شده', 'این رویا قبلاً با خانواده به اشتراک گذاشته شده است.'); return; }
                      const others = familyMembers.map(m => m.id).filter(id => id !== selectedMember) as any;
                      shareDream(dream.id, others);
                      Alert.alert('اشتراک گذاشته شد', 'رویا با اعضای خانواده به اشتراک گذاشته شد.');
                    }}>
                      <Text style={styles.interpretButtonText}>{dream.isShared ? '✅ با خانواده به اشتراک گذاشته شد' : 'اشتراک با خانواده'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.symbolsGuide}>
            <Text style={styles.sectionTitle}>🔮 راهنمای نمادهای رایج رویا</Text>
            <View style={styles.symbolsGrid}>
              {DREAM_SYMBOLS.slice(0, 12).map(sym => (
                <View key={sym.symbol} style={styles.symbolItem}>
                  <Text style={styles.symbolEmoji}>{sym.symbol.split(' ')[0]}</Text>
                  <Text style={styles.symbolName}>{sym.symbol.split(' ').slice(1).join(' ')}</Text>
                  <Text style={styles.symbolMeaning}>{sym.meaning}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Helper Components
  const SettingToggle: React.FC<{ label: string; description: string; value: boolean; onChange: (v: boolean) => void }> = ({ label, description, value, onChange }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} thumbColor="#FF6B9D" trackColor={{ false: '#B2BEC3', true: '#FF6B9D' }} />
    </View>
  );

  // Accessibility Tab
  function AccessibilityTab() {
    try {
      const s = accessibilitySettings || ({} as any);
      const profiles = Array.isArray(SPECIAL_NEEDS_PROFILES) ? SPECIAL_NEEDS_PROFILES : [];
      const clampPct = (n: number) => Math.max(0, Math.min(100, isFinite(n) ? n : 0));
      const fontPct = clampPct((((Number(s.fontSize) || 16) - 12) / 12) * 100);
      const linePct = clampPct((((Number(s.lineHeight) || 1.5) - 1) / 1) * 100);
      const letterPct = clampPct(((Number(s.letterSpacing) || 0) / 4) * 100);
      const set = (patch: any) => { try { updateAccessibilitySettings(patch); } catch {} };
      const Row = ({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) => (
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>{label}</Text>
            <Text style={styles.settingDescription}>{description}</Text>
          </View>
          <Switch value={!!value} onValueChange={onChange} thumbColor={themeColors.primary || '#FF6B9D'} trackColor={{ false: '#B2BEC3', true: themeColors.primary || '#FF6B9D' }} />
        </View>
      );
      return (
        <View style={styles.tabContent}>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>♿ تنظیمات دسترسی‌پذیری</Text>
            <View style={styles.settingsList}>
              <Row label="زیرنویس‌ها" description="نمایش متن برای محتوای صوتی و ویدیویی" value={!!s.subtitlesEnabled} onChange={(v) => set({ subtitlesEnabled: v })} />
              <Row label="توصیف صوتی" description="توصیف بصری صحنه‌ها" value={!!s.audioDescriptionEnabled} onChange={(v) => set({ audioDescriptionEnabled: v })} />
              <Row label="زبان اشاره" description="فعال‌سازی زبان اشاره" value={!!s.signLanguageEnabled} onChange={(v) => set({ signLanguageEnabled: v })} />
              <Row label="کنتراست بالا" description="افزایش کنتراست برای خوانایی بهتر" value={!!s.highContrast} onChange={(v) => set({ highContrast: v })} />
              <Row label="کاهش حرکت" description="کاهش انیمیشن‌ها" value={!!s.reducedMotion} onChange={(v) => set({ reducedMotion: v })} />
              <Row label="فونت دیسلکسی" description="فونت خواناتر برای دیسلکسی" value={!!s.dyslexiaFont} onChange={(v) => set({ dyslexiaFont: v })} />
              <Row label="کنترل صوتی" description="ناوبری با دستورات صوتی" value={!!s.voiceControlEnabled} onChange={(v) => set({ voiceControlEnabled: v })} />
              <Row label="کنترل سوئیچ" description="پشتیبانی از سوئیچ‌های دسترسی‌پذیر" value={!!s.switchControlEnabled} onChange={(v) => set({ switchControlEnabled: v })} />
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>🎨 تنظیمات ظاهری</Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>اندازه فونت</Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderValue}>کوچک</Text>
                <View style={styles.sliderTrack}><View style={[styles.sliderThumb, { left: `${fontPct}%` as any }]} /></View>
                <Text style={styles.sliderValue}>بزرگ</Text>
              </View>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>فاصله خطوط</Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderValue}>فشرده</Text>
                <View style={styles.sliderTrack}><View style={[styles.sliderThumb, { left: `${linePct}%` as any }]} /></View>
                <Text style={styles.sliderValue}>باز</Text>
              </View>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>فاصله حروف</Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderValue}>طبیعی</Text>
                <View style={styles.sliderTrack}><View style={[styles.sliderThumb, { left: `${letterPct}%` as any }]} /></View>
                <Text style={styles.sliderValue}>بسیار باز</Text>
              </View>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>رنگ زیرنویس</Text>
              <View style={styles.colorPicker}>
                {['#FFFFFF', '#FFD93D', '#00B894', '#74B9FF', '#FD9644', '#A29BFE'].map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[styles.colorOption, s.subtitleColor === color && styles.colorOptionSelected, { backgroundColor: color }]}
                    onPress={() => set({ subtitleColor: color })}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>👁️ پروفایل‌های دسترسی‌پذیر سریع</Text>
            <View style={styles.profileGrid}>
              {profiles.map((profile: any) => (
                <TouchableOpacity key={profile.id || profile.label} style={[styles.profileCard, { borderColor: profile.color || themeColors.primary }]} onPress={() => set(profile.defaultSettings || {})}>
                  <Text style={styles.profileEmoji}>{profile.emoji || '♿'}</Text>
                  <Text style={[styles.profileTitle, { color: profile.color || themeColors.text }]}>{profile.label || 'پروفایل'}</Text>
                  <Text style={styles.profileDesc}>تنظیمات پیشنهادی برای {profile.label || 'این نیاز'}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      );
    } catch (e) {
      return (
        <View style={styles.tabContent}>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>♿ دسترسی‌پذیری</Text>
            <Text style={styles.exerciseDescription}>نمایش این بخش با خطا مواجه شد. لطفاً برنامه را به‌روزرسانی/رفرش کنید.</Text>
          </View>
        </View>
      );
    }
  }

  // Parenting Tab
  function ParentingTab() {
    const [confirmDeleteTherapySessionId, setConfirmDeleteTherapySessionId] = React.useState<string | null>(null);
    return (
      <View style={styles.tabContent}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>👨‍👩‍👧 مشاوره و والدین</Text>
          <View style={styles.resourceList}>
            {PARENTING_RESOURCES.map(resource => (
              <TouchableOpacity key={resource.id} style={styles.resourceCard}>
                <View style={styles.resourceHeader}>
                  <Text style={styles.resourceIcon}>{resource.format === 'video' ? '🎬' : resource.format === 'audio' ? '🎧' : resource.format === 'interactive' ? '🎮' : '📄'}</Text>
                  <View style={[
                    styles.resourceCategory,
                    { backgroundColor: resource.category === 'special-needs' ? '#A29BFE' : resource.category === 'crisis' ? '#E17055' : '#4ECDC4' },
                  ]}>
                    <Text style={styles.resourceCategoryText}>{resource.category}</Text>
                  </View>
                </View>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceMeta}>
                  {resource.duration} دقیقه • {resource.ageRange} • ⭐ {resource.rating}
                </Text>
                {resource.subtitles.length > 0 && (
                  <View style={styles.resourceSubtitles}>
                    <Text style={styles.subtitleBadge}>📝 زیرنویس: {resource.subtitles[0].language}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🏠 جلسات درمان خانوادگی</Text>
          {therapySessions.length === 0 ? (
            <View style={styles.emptyGoalsText}>
              <Text style={styles.emptyIcon}>👨‍👩‍👧</Text>
              <Text style={styles.emptyTitle}>هنوز جلسه‌ای برگزار نشده</Text>
              <TouchableOpacity style={styles.addSessionButton} onPress={() => {
                createTherapySession({
                  date: new Date().toISOString(),
                  type: 'bonding',
                  participants: familyMembers.map(m => m.id),
                  facilitator: 'parent',
                  topic: 'ارتباط مثبت',
                  exercises: [],
                  notes: '',
                  moodBefore: { baba: 'calm', maman: 'calm', daughter: 'happy' },
                  moodAfter: { baba: 'calm', maman: 'calm', daughter: 'happy' },
                  duration: 30,
                  completed: false,
                });
              }}>
                <Text style={styles.addSessionButtonText}>+ جلسه جدید</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.sessionsList}>
              {therapySessions.map(session => (
                <View key={session.id} style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.sessionType}>{session.type}</Text>
                    <Text style={styles.sessionDate}>{new Date(session.date).toLocaleDateString('fa-IR')}</Text>
                  </View>
                  <Text style={styles.sessionTopic}>{session.topic}</Text>
                  <Text style={styles.sessionParticipants}>
                    شرکت‌کنندگان: {session.participants.map(p => p === 'baba' ? '👨' : p === 'maman' ? '👩' : '🌸').join(' ')}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    {!session.completed && (
                      <TouchableOpacity style={styles.completeSessionButton} onPress={() => completeTherapySession(session.id)}>
                        <Text style={styles.completeSessionButtonText}>تکمیل جلسه ✅</Text>
                      </TouchableOpacity>
                    )}
                    {confirmDeleteTherapySessionId === session.id ? (
                      <>
                        <TouchableOpacity style={[styles.completeSessionButton, { backgroundColor: 'rgba(225,112,85,0.12)', borderColor: '#E17055', borderWidth: 1 }]} onPress={() => { deleteTherapySession(session.id); setConfirmDeleteTherapySessionId(null); }}>
                          <Text style={[styles.completeSessionButtonText, { color: '#E17055' }]}>تأیید حذف (۲)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.completeSessionButton, { backgroundColor: 'transparent', borderColor: '#B2BEC3', borderWidth: 1 }]} onPress={() => setConfirmDeleteTherapySessionId(null)}>
                          <Text style={[styles.completeSessionButtonText, { color: '#636E72' }]}>انصراف</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity style={[styles.completeSessionButton, { backgroundColor: 'transparent', borderColor: '#E17055', borderWidth: 1 }]} onPress={() => setConfirmDeleteTherapySessionId(session.id)}>
                        <Text style={[styles.completeSessionButtonText, { color: '#E17055' }]}>حذف</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
</View>
      </View>
    );
  }


function MemberSelectorModal({ onClose, selectedMember, onSelect }: { onClose: () => void; selectedMember: FamilyMember['id']; onSelect: (id: FamilyMember['id']) => void }) {
  const { familyMembers } = useApp();
  const label = (id: string) => id === 'baba' ? '👨‍🦱' : id === 'maman' ? '👩‍🦰' : '🌸';
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>انتخاب عضو خانواده</Text>
        <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {familyMembers.map(member => {
            const active = member.id === selectedMember;
            return (
              <TouchableOpacity key={member.id} style={[styles.modalMember, active && { borderWidth: 2, borderColor: '#FF6B9D', backgroundColor: 'rgba(255,107,157,0.08)', borderRadius: 14, padding: 8 }]} onPress={() => onSelect(member.id as FamilyMember['id'])}>
                <Text style={styles.modalMemberEmoji}>{label(member.id)}</Text>
                <Text style={styles.modalMemberName}>{member.name}{active ? ' ✓' : ''}</Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity style={styles.modalCancel} onPress={onClose}>
            <Text style={styles.modalCancelText}>بستن</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

function EmotionCheckInModal({ onClose, memberId }: { onClose: () => void; memberId: FamilyMember['id'] }) {
  const { addWellnessCheckIn } = useApp();
  const [mood, setMood] = React.useState<EmotionType>('calm');
  const [energy, setEnergy] = React.useState(5);
  const [sleep, setSleep] = React.useState(8);
  const [stress, setStress] = React.useState(3);
  
  const handleSubmit = () => {
    addWellnessCheckIn({
      date: new Date().toISOString().split('T')[0],
      memberId,
      mood,
      energy,
      sleep,
      stress,
      pain: 1,
      appetite: 'normal',
      notes: '',
      completedExercises: [],
    });
    onClose();
  };

  const Stepper = ({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) => {
    const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
    return (
      <View style={styles.sliderContainer}>
        <TouchableOpacity style={styles.stepperBtn} onPress={() => onChange(Math.max(min, value - 1))} accessibilityRole="button">
          <Text style={styles.stepperBtnText}>−</Text>
        </TouchableOpacity>
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${pct}%` as any }]} />
          <View style={[styles.sliderThumb, { left: `${pct}%` as any }]} />
        </View>
        <TouchableOpacity style={styles.stepperBtn} onPress={() => onChange(Math.min(max, value + 1))} accessibilityRole="button">
          <Text style={styles.stepperBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>چک‌ان روزانه</Text>
        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={styles.modalScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>احساس امروز (Inside Out / Inside Out 2 / Dream Productions)</Text>
            <View style={styles.emotionPicker}>
              {EMOTION_TYPES.map(e => (
                <TouchableOpacity key={e.id} style={[styles.emotionPickerItem, mood === e.id && styles.emotionPickerSelected, { borderColor: mood === e.id ? e.color : 'transparent', borderWidth: mood === e.id ? 1 : 0 }]} onPress={() => setMood(e.id as EmotionType)}>
                  <Text style={styles.emotionPickerEmoji}>{e.emoji}</Text>
                  <Text style={styles.emotionPickerLabel}>{e.label}</Text>
                  {(e as any).character ? <Text style={{ fontSize: 9, color: e.color, textAlign: 'center' }} numberOfLines={1}>{(e as any).character}</Text> : null}
                  {(e as any).source ? <Text style={{ fontSize: 8, color: '#888', textAlign: 'center' }} numberOfLines={1}>{(e as any).source}</Text> : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>انرژی: {energy}/10</Text>
            <Stepper value={energy} min={1} max={10} onChange={setEnergy} />
          </View>
          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>خواب: {sleep} ساعت</Text>
            <Stepper value={sleep} min={0} max={12} onChange={setSleep} />
          </View>
          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>استرس: {stress}/10</Text>
            <Stepper value={stress} min={1} max={10} onChange={setStress} />
          </View>
          <TouchableOpacity style={styles.modalSubmit} onPress={handleSubmit}>
            <Text style={styles.modalSubmitText}>ثبت چک‌ان ✨</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalCancel} onPress={onClose}>
            <Text style={styles.modalCancelText}>انصراف</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

function TimeCapsuleModal({ onClose, capsule, memberId }: { onClose: () => void; capsule?: TimeCapsule | null; memberId: FamilyMember['id'] }) {
  const { createTimeCapsule, updateTimeCapsule, familyMembers } = useApp();
  const isEdit = !!capsule;
  const [title, setTitle] = React.useState(capsule?.title || '');
  const [description, setDescription] = React.useState(capsule?.description || '');
  const [unlockCondition, setUnlockCondition] = React.useState<'age' | 'date' | 'event' | 'manual'>((capsule?.unlockCondition as any) || 'age');
  const [targetAge, setTargetAge] = React.useState(capsule?.targetAge ?? 18);
  const [targetDate, setTargetDate] = React.useState(
    capsule?.targetDate ? new Date(capsule.targetDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [targetEvent, setTargetEvent] = React.useState(capsule?.targetEvent || '');

  React.useEffect(() => {
    setTitle(capsule?.title || '');
    setDescription(capsule?.description || '');
    setUnlockCondition(((capsule?.unlockCondition as any) || 'age'));
    setTargetAge(capsule?.targetAge ?? 18);
    setTargetDate(capsule?.targetDate ? new Date(capsule.targetDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    setTargetEvent(capsule?.targetEvent || '');
  }, [capsule?.id]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    if (isEdit && capsule) {
      updateTimeCapsule(capsule.id, {
        title,
        description,
        targetDate: unlockCondition === 'date' ? targetDate : (capsule.targetDate || new Date(Date.now() + 365*24*60*60*1000).toISOString()),
        unlockCondition: unlockCondition as any,
        targetAge: unlockCondition === 'age' ? targetAge : undefined,
        targetEvent: unlockCondition === 'event' ? targetEvent : undefined,
      });
    } else {
      createTimeCapsule({
        title,
        description,
        creatorId: memberId,
        targetDate: unlockCondition === 'date' ? targetDate : new Date(Date.now() + 365*24*60*60*1000).toISOString(),
        unlockCondition: unlockCondition as any,
        targetAge: unlockCondition === 'age' ? targetAge : undefined,
        targetEvent: unlockCondition === 'event' ? targetEvent : undefined,
        content: [],
        participants: Array.from(new Set([memberId, ...familyMembers.map(m => m.id)])),
        isLocked: true,
      });
    }
    onClose();
  };

  const agePct = ((targetAge - 10) / 50) * 100;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>{isEdit ? 'ویرایش کپسول زمان' : 'ساخت کپسول زمان'}</Text>
        <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <TextInput style={styles.modalInput} placeholder="عنوان کپسول" value={title} onChangeText={setTitle} />
          <TextInput style={styles.modalInput} placeholder="توضیحات" value={description} onChangeText={setDescription} multiline />
          
          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>شرط باز شدن</Text>
            <View style={styles.conditionPicker}>
              {(['age', 'date', 'event'] as const).map(cond => (
                <TouchableOpacity key={cond} style={[styles.conditionOption, unlockCondition === cond && styles.conditionSelected]} onPress={() => setUnlockCondition(cond)}>
                  <Text style={styles.conditionLabel}>{cond === 'age' ? 'سن' : cond === 'date' ? 'تاریخ' : 'رویداد'}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {unlockCondition === 'age' && (
            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>سن هدف: {targetAge} سال</Text>
              <View style={styles.sliderContainer}>
                <TouchableOpacity style={styles.stepperBtn} onPress={() => setTargetAge(v => Math.max(10, v - 1))}><Text style={styles.stepperBtnText}>−</Text></TouchableOpacity>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderFill, { width: `${agePct}%` as any }]} />
                  <View style={[styles.sliderThumb, { left: `${agePct}%` as any }]} />
                </View>
                <TouchableOpacity style={styles.stepperBtn} onPress={() => setTargetAge(v => Math.min(60, v + 1))}><Text style={styles.stepperBtnText}>+</Text></TouchableOpacity>
              </View>
            </View>
          )}

          {unlockCondition === 'date' && (
            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>تاریخ هدف</Text>
              <TextInput style={styles.modalInput} value={targetDate} onChangeText={setTargetDate} placeholder="YYYY-MM-DD" />
            </View>
          )}

          {unlockCondition === 'event' && (
            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>رویداد</Text>
              <TextInput style={styles.modalInput} placeholder="مثال: عروسی، فارغ‌التحصیلی" value={targetEvent} onChangeText={setTargetEvent} />
            </View>
          )}

          <TouchableOpacity style={styles.modalSubmit} onPress={handleSubmit}>
            <Text style={styles.modalSubmitText}>{isEdit ? 'ذخیره تغییرات ✏️' : 'ساخت کپسول ⏳'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalCancel} onPress={onClose}>
            <Text style={styles.modalCancelText}>انصراف</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

function DreamEntryModal({ onClose, memberId }: { onClose: () => void; memberId: FamilyMember['id'] }) {
  const { addDreamEntry, dreamWorlds, createDreamWorld } = useApp();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [emotions, setEmotions] = React.useState<EmotionType[]>([]);
  const [worldId, setWorldId] = React.useState(dreamWorlds.find(w => w.creatorId === memberId)?.id || dreamWorlds[0]?.id || '');

  React.useEffect(() => {
    const preferred = dreamWorlds.find(w => w.creatorId === memberId)?.id || dreamWorlds[0]?.id || '';
    if (!worldId || !dreamWorlds.some(w => w.id === worldId)) setWorldId(preferred);
  }, [dreamWorlds, memberId, worldId]);

  const ensureWorldId = () => {
    if (worldId && dreamWorlds.some(w => w.id === worldId)) return worldId;
    const preferred = dreamWorlds.find(w => w.creatorId === memberId)?.id || dreamWorlds[0]?.id;
    if (preferred) return preferred;
    createDreamWorld({
      creatorId: memberId,
      name: 'دنیای رویاهای من',
      description: 'محیط شخصی برای ثبت و مرور رویاها',
      entries: [],
      sharedEntries: [],
      themes: [],
    });
    return null; // will be available next render
  };

  const handleSubmit = () => {
    if (!title.trim()) { Alert.alert('عنوان لازم است', 'لطفاً عنوان رویا را وارد کنید.'); return; }
    let wid = (worldId && dreamWorlds.some(w => w.id === worldId)) ? worldId : (dreamWorlds.find(w => w.creatorId === memberId)?.id || dreamWorlds[0]?.id || '');
    if (!wid) {
      ensureWorldId();
      Alert.alert('در حال آماده‌سازی', 'دنیای رویا ساخته شد؛ لطفاً یک‌بار دیگر «ذخیره رویا» را بزنید.');
      return;
    }
    addDreamEntry(wid, {
      memberId,
      date: new Date().toISOString().split('T')[0],
      title: title.trim(),
      description: description.trim(),
      emotions,
      symbols: [],
      isShared: false,
      sharedWith: [],
    });
    onClose();
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>ثبت رویای جدید</Text>
        <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <TextInput style={styles.modalInput} placeholder="عنوان رویا" value={title} onChangeText={setTitle} />
          <TextInput style={styles.modalInput} placeholder="توضیح رویا" value={description} onChangeText={setDescription} multiline />
          
          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>احساسات رویا</Text>
            <View style={styles.emotionPicker}>
              {EMOTION_TYPES.map(e => (
                <TouchableOpacity key={e.id} style={[styles.emotionPickerItem, emotions.includes(e.id as EmotionType) && styles.emotionPickerSelected]} onPress={() => setEmotions(prev => prev.includes(e.id as EmotionType) ? prev.filter(x => x !== e.id) : [...prev, e.id as EmotionType])}>
                  <Text style={styles.emotionPickerEmoji}>{e.emoji}</Text>
                  <Text style={styles.emotionPickerLabel}>{e.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.modalSubmit} onPress={handleSubmit}>
            <Text style={styles.modalSubmitText}>ذخیره رویا 🌙</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalCancel} onPress={onClose}>
            <Text style={styles.modalCancelText}>انصراف</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

function AccessibilityModal({ onClose }: { onClose: () => void }) {
  const { updateAccessibilitySettings, accessibilitySettings } = useApp();
  const s = accessibilitySettings || ({} as any);
  const ToggleRow = ({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch value={!!value} onValueChange={onChange} thumbColor="#FF6B9D" trackColor={{ false: '#B2BEC3', true: '#FF6B9D' }} />
    </View>
  );
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalLarge}>
        <Text style={styles.modalTitle}>تنظیمات دسترسی‌پذیری</Text>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <ToggleRow label="زیرنویس‌ها" description="نمایش متن برای تمام محتوای صوتی و ویدیویی" value={!!s.subtitlesEnabled} onChange={(v) => updateAccessibilitySettings({ subtitlesEnabled: v })} />
          <ToggleRow label="توصیف صوتی" description="توصیف بصری صحنه‌ها برای نابینا" value={!!s.audioDescriptionEnabled} onChange={(v) => updateAccessibilitySettings({ audioDescriptionEnabled: v })} />
          <ToggleRow label="زبان اشاره" description="آواتار سه‌بعدی برای ترجمه به زبان اشاره" value={!!s.signLanguageEnabled} onChange={(v) => updateAccessibilitySettings({ signLanguageEnabled: v })} />
          <ToggleRow label="کنتراست بالا" description="افزایش کنتراست برای کم‌بینان" value={!!s.highContrast} onChange={(v) => updateAccessibilitySettings({ highContrast: v })} />
          <ToggleRow label="کاهش حرکت" description="غیرفعال کردن انیمیشن‌ها" value={!!s.reducedMotion} onChange={(v) => updateAccessibilitySettings({ reducedMotion: v })} />
          <ToggleRow label="فونت دیسلکسی" description="فونت مخصوص دیسلکسی" value={!!s.dyslexiaFont} onChange={(v) => updateAccessibilitySettings({ dyslexiaFont: v })} />
          <ToggleRow label="کنترل صوتی" description="ناوبری با دستورات صوتی" value={!!s.voiceControlEnabled} onChange={(v) => updateAccessibilitySettings({ voiceControlEnabled: v })} />
          <ToggleRow label="کنترل سوئیچ" description="پشتیبانی از سوئیچ‌های دسترسی‌پذیر" value={!!s.switchControlEnabled} onChange={(v) => updateAccessibilitySettings({ switchControlEnabled: v })} />

          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>آواتار زبان اشاره (شخصیت‌ها)</Text>
            <View style={styles.avatarPicker}>
              {([
                { id: 'joy', emoji: '😊', label: 'جوی', sub: 'Inside Out' },
                { id: 'sadness', emoji: '😢', label: 'سدنِس', sub: 'Inside Out' },
                { id: 'anxiety', emoji: '😰', label: 'اَنگزایتی', sub: 'Inside Out 2' },
                { id: 'dream', emoji: '🎬', label: 'استودیو رویا', sub: 'Dream Productions' },
              ] as const).map(avatar => (
                <TouchableOpacity key={avatar.id} style={[styles.avatarOption, s.signLanguageAvatar === avatar.id && styles.avatarSelected]} onPress={() => updateAccessibilitySettings({ signLanguageAvatar: avatar.id as any })}>
                  <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                  <Text style={styles.avatarLabel}>{avatar.label}</Text>
                  <Text style={{ fontSize: 9, color: '#888', textAlign: 'center' }}>{avatar.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.modalSubmit} onPress={onClose}>
          <Text style={styles.modalSubmitText}>بستن ✨</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
  // Progress Map Tab
  function ProgressMapTab() {
    const memberProgress = progressMaps[selectedMember] || progressMaps.daughter;
    const currentStation = PROGRESS_MAP_STATIONS.find(s => s.id === memberProgress?.currentStation) || PROGRESS_MAP_STATIONS[0];
    const completedCount = memberProgress?.completedStations.length || 0;
    const totalStations = PROGRESS_MAP_STATIONS.length;
    const progressPercent = (completedCount / totalStations) * 100;

    return (
      <View style={styles.tabContent}>
        {/* Progress Overview */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🗺️ نقشه مسیر رشد</Text>
          <View style={styles.progressOverview}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercent}>{Math.round(progressPercent)}%</Text>
              <Text style={styles.progressLabel}>تکمیل شده</Text>
            </View>
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completedCount}</Text>
                <Text style={styles.statLabel}>از {totalStations} ایستگاه</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{memberProgress?.badges.length || 0}</Text>
                <Text style={styles.statLabel}>مدال‌ها</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{memberProgress?.totalExercisesCompleted || 0}</Text>
                <Text style={styles.statLabel}>تمرین تکمیل</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stations */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🚉 ایستگاه‌ها</Text>
          <View style={styles.stationsContainer}>
            {PROGRESS_MAP_STATIONS.map((station, index) => {
              const isCompleted = memberProgress?.completedStations.includes(station.id);
              const isCurrent = memberProgress?.currentStation === station.id;
              const isLocked = index > 0 && !memberProgress?.completedStations.includes(PROGRESS_MAP_STATIONS[index - 1].id);
              
              return (
                <View key={station.id} style={[
                  styles.stationCard,
                  isCompleted && styles.stationCompleted,
                  isCurrent && !isCompleted && styles.stationCurrent,
                  isLocked && styles.stationLocked,
                ]}>
                  <View style={styles.stationNumber}>
                    <Text style={styles.stationNumberText}>
                      {isCompleted ? '✓' : station.emoji}
                    </Text>
                  </View>
                  <View style={styles.stationInfo}>
                    <Text style={[
                      styles.stationName,
                      isCurrent && !isCompleted && styles.stationNameCurrent,
                    ]}>
                      {station.name}
                    </Text>
                    <Text style={styles.stationDescription}>{station.description}</Text>
                    <View style={styles.stationMeta}>
                      <Text style={styles.stationMetaItem}>
                        🎯 {station.requiredExercises} تمرین
                      </Text>
                      <Text style={styles.stationMetaItem}>
                        🏆 {station.reward}
                      </Text>
                    </View>
                  </View>
                  {isCurrent && !isCompleted && !isLocked && (
                    <TouchableOpacity style={styles.stationActionButton} onPress={() => completeProgressStation(selectedMember, station.id)}>
                      <Text style={styles.stationActionText}>تکمیل ایستگاه و دریافت جایزه</Text>
                    </TouchableOpacity>
                  )}
                  {isCompleted && (
                    <View style={styles.stationCompletedBadge}>
                      <Text style={styles.stationCompletedText}>تکمیل شده ✓</Text>
                    </View>
                  )}
                  {isLocked && (
                    <View style={styles.stationLockedBadge}>
                      <Text style={styles.stationLockedText}>قفل شده 🔒</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Badges */}
        {(memberProgress?.badges?.length || 0) > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>🏆 مدال‌های کسب شده</Text>
            <View style={styles.badgesGrid}>
              {memberProgress.badges.map((badge: string, index: number) => (
                <View key={index} style={styles.badgeCard}>
                  <Text style={styles.badgeEmoji}>🏅</Text>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Supportive Avatar Message */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationText}>
            {supportiveAvatar?.emoji} {getDailyAvatarMessage(selectedMember, 'morning')}
          </Text>
          <TouchableOpacity style={styles.avatarChangeButton} onPress={() => setShowAvatarModal(true)}>
            <Text style={styles.avatarChangeText}>تغییر همراه 🦄</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Dream Therapy Tab
  function DreamTherapyTab() {
    const [selectedEnvironment, setSelectedEnvironment] = React.useState<DreamTherapyEnvironment | null>(null);
    const [showEnvironmentModal, setShowEnvironmentModal] = React.useState(false);
    const [activeSessionId, setActiveSessionId] = React.useState<string | null>(null);
    const [completeSession, setCompleteSession] = React.useState<DreamTherapySession | null>(null);
    const [moodBefore, setMoodBefore] = React.useState<EmotionType>('calm');
    const [moodAfter, setMoodAfter] = React.useState<EmotionType>('calm');
    const [sessionNotes, setSessionNotes] = React.useState('');

    const memberSessions = dreamTherapySessions.filter(s => s.memberId === selectedMember);
    const completedSessions = memberSessions.filter(s => s.duration > 0 || (s.notes || '').trim().length > 0 || s.moodAfter !== s.moodBefore).length;

    return (
      <View style={styles.tabContent}>
        {/* Overview */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>✨ دنیای درمان رویا</Text>
          <View style={styles.dreamTherapyOverview}>
            <View style={styles.overviewCard}>
              <Text style={styles.overviewIcon}>🌙</Text>
              <Text style={styles.overviewValue}>{memberSessions.length}</Text>
              <Text style={styles.overviewLabel}>جلسه کل</Text>
            </View>
            <View style={styles.overviewCard}>
              <Text style={styles.overviewIcon}>✅</Text>
              <Text style={styles.overviewValue}>{completedSessions}</Text>
              <Text style={styles.overviewLabel}>تکمیل شده</Text>
            </View>
            <View style={styles.overviewCard}>
              <Text style={styles.overviewIcon}>⏱️</Text>
              <Text style={styles.overviewValue}>{memberSessions.reduce((sum, s) => sum + s.duration, 0)}</Text>
              <Text style={styles.overviewLabel}>دقیقه</Text>
            </View>
          </View>
        </View>

        {/* Environments */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🌌 محیط‌های رویا</Text>
          <View style={styles.environmentsGrid}>
            {dreamTherapyEnvironments.map(env => (
              <TouchableOpacity
                key={env.id}
                style={[
                  styles.environmentCard,
                  env.completed && styles.environmentCompleted,
                ]}
                onPress={() => {
                  setSelectedEnvironment(env);
                  setShowEnvironmentModal(true);
                }}
              >
                <Text style={styles.environmentEmoji}>{env.emoji}</Text>
                <Text style={styles.environmentName}>{env.name}</Text>
                <Text style={styles.environmentDescription}>{env.description}</Text>
                <View style={styles.environmentMeta}>
                  <Text style={styles.environmentMetaItem}>
                    🎯 {env.therapeuticGoal}
                  </Text>
                  <Text style={styles.environmentMetaItem}>
                    ⏱️ {env.duration} دقیقه
                  </Text>
                  <Text style={styles.environmentMetaItem}>
                    🔁 {env.timesUsed} بار استفاده
                  </Text>
                </View>
                {env.completed && (
                  <View style={styles.environmentCompletedBadge}>
                    <Text style={styles.environmentCompletedText}>تکمیل شده ✨</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Sessions */}
        {memberSessions.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>📋 جلسات اخیر</Text>
            <View style={styles.dreamSessionsList}>
              {memberSessions.slice(0, 5).map(session => {
                const env = dreamTherapyEnvironments.find(e => e.id === session.environmentId);
                const moodBefore = EMOTION_TYPES.find(e => e.id === session.moodBefore);
                const moodAfter = EMOTION_TYPES.find(e => e.id === session.moodAfter);
                return (
                  <View key={session.id} style={styles.dreamSessionCard}>
                    <View style={styles.dreamSessionHeader}>
                      <Text style={styles.dreamSessionEnvName}>{env?.name}</Text>
                      <Text style={styles.dreamSessionDate}>
                        {new Date(session.date).toLocaleDateString('fa-IR')}
                      </Text>
                    </View>
                    <View style={styles.sessionMoods}>
                      <View style={styles.sessionMood}>
                        <Text style={styles.sessionMoodLabel}>قبل</Text>
                        <Text style={styles.sessionMoodEmoji}>{moodBefore?.emoji}</Text>
                        <Text style={styles.sessionMoodText}>{moodBefore?.label}</Text>
                      </View>
                      <Text style={styles.sessionArrow}>→</Text>
                      <View style={styles.sessionMood}>
                        <Text style={styles.sessionMoodLabel}>بعد</Text>
                        <Text style={styles.sessionMoodEmoji}>{moodAfter?.emoji}</Text>
                        <Text style={styles.sessionMoodText}>{moodAfter?.label}</Text>
                      </View>
                    </View>
                    <Text style={styles.sessionDuration}>⏱️ {session.duration} دقیقه</Text>
                    {session.notes && (
                      <Text style={styles.sessionNotes}>{session.notes}</Text>
                    )}
                    {(activeSessionId === session.id || session.duration === 0) && (
                      <TouchableOpacity style={[styles.stationActionButton, { marginTop: 8 }]} onPress={() => { setCompleteSession(session); setMoodAfter(session.moodAfter || moodBefore || 'calm'); setSessionNotes(session.notes || ''); }}>
                        <Text style={styles.stationActionText}>پایان جلسه و ثبت احساس</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Environment Modal */}
        {showEnvironmentModal && selectedEnvironment && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalLarge}>
              <Text style={styles.modalTitle}>{selectedEnvironment.emoji} {selectedEnvironment.name}</Text>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <Text style={styles.modalSectionText}>{selectedEnvironment.description}</Text>
                <Text style={styles.modalSectionText}>🎯 هدف درمانی: {selectedEnvironment.therapeuticGoal}</Text>
                <Text style={styles.modalSectionText}>⏱️ مدت زمان پیشنهادی: {selectedEnvironment.duration} دقیقه</Text>
                <Text style={styles.modalSectionText}>🔁 تعداد استفاده: {selectedEnvironment.timesUsed}</Text>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>حس قبل از جلسه</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {EMOTION_TYPES.map(e => (
                      <TouchableOpacity key={e.id} style={[styles.includeOption, moodBefore === e.id && styles.includeSelected, { paddingVertical: 6, paddingHorizontal: 10 }]} onPress={() => setMoodBefore(e.id as EmotionType)}>
                        <Text style={styles.includeLabel}>{e.emoji} {e.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <TouchableOpacity style={styles.modalSubmit} onPress={() => {
                  startDreamTherapySession(selectedMember, selectedEnvironment.id, moodBefore);
                  setTimeout(() => {
                    const latest = dreamTherapySessions.find(s => s.memberId === selectedMember && s.environmentId === selectedEnvironment.id) || null;
                    if (latest) setActiveSessionId(latest.id);
                  }, 0);
                  setShowEnvironmentModal(false);
                  Alert.alert('جلسه شروع شد', 'پس از انجام تمرین، از بخش «جلسات اخیر» روی «پایان جلسه» بزنید و حس بعد/یادداشت را ثبت کنید.');
                }}>
                  <Text style={styles.modalSubmitText}>شروع جلسه 🌙</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setShowEnvironmentModal(false)}>
                  <Text style={styles.modalCancelText}>انصراف</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        )}

        {/* Complete Session Modal */}
        {completeSession && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalLarge}>
              <Text style={styles.modalTitle}>پایان جلسه رویا‌درمانی</Text>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>حس بعد از جلسه</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {EMOTION_TYPES.map(e => (
                      <TouchableOpacity key={e.id} style={[styles.includeOption, moodAfter === e.id && styles.includeSelected, { paddingVertical: 6, paddingHorizontal: 10 }]} onPress={() => setMoodAfter(e.id as EmotionType)}>
                        <Text style={styles.includeLabel}>{e.emoji} {e.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>یادداشت جلسه (اختیاری)</Text>
                  <TextInput style={styles.modalInput} placeholder="احساس، تجربه یا نکته مهم..." value={sessionNotes} onChangeText={setSessionNotes} multiline />
                </View>
                <TouchableOpacity style={styles.modalSubmit} onPress={() => {
                  completeDreamTherapySession(completeSession.id, moodAfter, sessionNotes.trim());
                  setCompleteSession(null);
                  setSessionNotes('');
                  setActiveSessionId(null);
                }}>
                  <Text style={styles.modalSubmitText}>ثبت و پایان جلسه ✅</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalCancel} onPress={() => { setCompleteSession(null); setSessionNotes(''); }}>
                  <Text style={styles.modalCancelText}>انصراف</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Backup & Security Tab
  function BackupSecurityTab() {
    const [showCreateBackup, setShowCreateBackup] = React.useState(false);
    const [backupType, setBackupType] = React.useState<'auto' | 'manual'>('manual');
    const [backupBusy, setBackupBusy] = React.useState(false);
    const [lastBackupNote, setLastBackupNote] = React.useState<string | null>(null);
    const [selectedIncludes, setSelectedIncludes] = React.useState({
      memories: true,
      calendar: true,
      wellness: true,
      timeCapsules: true,
      dreams: true,
      progress: true,
      settings: true,
      media: true,
      models3D: true,
    });

    const toggleInclude = (key: keyof typeof selectedIncludes) => {
      setSelectedIncludes(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleCreateBackup = async () => {
      try {
        setBackupBusy(true);
        const includeKeys = Object.entries(selectedIncludes).filter(([, v]) => v).map(([k]) => k);
        await createBackup(backupType, selectedIncludes as any);
        const at = new Date().toLocaleString('fa-IR');
        setLastBackupNote(`پشتیبان (${backupType === 'auto' ? 'خودکار' : 'دستی'}) ثبت شد: ${at} — بخش‌ها: ${includeKeys.length ? includeKeys.join('، ') : '—'}`);
        setShowCreateBackup(false);
        Alert.alert('پشتیبان‌گیری انجام شد', 'نسخه پشتیبان در این دستگاه ثبت شد.');
      } catch {
        Alert.alert('خطا', 'ثبت پشتیبان انجام نشد.');
      } finally {
        setBackupBusy(false);
      }
    };

    return (
      <View style={styles.tabContent}>
        {/* Auto Backup Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⚙️ تنظیمات پشتیبان‌گیری خودکار</Text>
          <View style={styles.settingsList}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>پشتیبان‌گیری خودکار</Text>
                <Text style={styles.settingDescription}>
                  هر روز ساعت {backupConfig.autoBackup.time} به صورت خودکار
                </Text>
              </View>
              <Switch
                value={backupConfig.autoBackup.enabled}
                onValueChange={(v) => updateBackupConfig({ autoBackup: { ...backupConfig.autoBackup, enabled: v } })}
                thumbColor={backupConfig.autoBackup.enabled ? '#FF6B9D' : '#B2BEC3'}
                trackColor={{ false: '#B2BEC3', true: 'rgba(255,107,157,0.3)' }}
              />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>رمزنگاری</Text>
                <Text style={styles.settingDescription}>AES-256-GCM برای امنیت داده‌ها</Text>
              </View>
              <Switch
                value={backupConfig.autoBackup.encrypt}
                onValueChange={(v) => updateBackupConfig({ autoBackup: { ...backupConfig.autoBackup, encrypt: v } })}
                thumbColor={backupConfig.autoBackup.encrypt ? '#FF6B9D' : '#B2BEC3'}
                trackColor={{ false: '#B2BEC3', true: 'rgba(255,107,157,0.3)' }}
              />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>شامل رسانه‌ها</Text>
                <Text style={styles.settingDescription}>عکس، ویدیو، و فایل‌های صوتی</Text>
              </View>
              <Switch
                value={backupConfig.autoBackup.includeMedia}
                onValueChange={(v) => updateBackupConfig({ autoBackup: { ...backupConfig.autoBackup, includeMedia: v } })}
                thumbColor={backupConfig.autoBackup.includeMedia ? '#FF6B9D' : '#B2BEC3'}
                trackColor={{ false: '#B2BEC3', true: 'rgba(255,107,157,0.3)' }}
              />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>شامل مدل‌های ۳D</Text>
                <Text style={styles.settingDescription}>آواتارهای یونس، اژدها، ربات، نورانی</Text>
              </View>
              <Switch
                value={backupConfig.autoBackup.include3DModels}
                onValueChange={(v) => updateBackupConfig({ autoBackup: { ...backupConfig.autoBackup, include3DModels: v } })}
                thumbColor={backupConfig.autoBackup.include3DModels ? '#FF6B9D' : '#B2BEC3'}
                trackColor={{ false: '#B2BEC3', true: 'rgba(255,107,157,0.3)' }}
              />
            </View>
          </View>
        </View>

        {/* Security Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🔒 تنظیمات امنیتی</Text>
          <View style={styles.settingsList}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>احراز هویت دو عاملی</Text>
                <Text style={styles.settingDescription}>محافظت از داده‌های حساس سلامت</Text>
              </View>
              <Switch
                value={backupConfig.security.twoFactorAuth}
                onValueChange={(v) => v ? enableTwoFactorAuth(selectedMember) : disableTwoFactorAuth(selectedMember)}
                thumbColor={backupConfig.security.twoFactorAuth ? '#FF6B9D' : '#B2BEC3'}
                trackColor={{ false: '#B2BEC3', true: 'rgba(255,107,157,0.3)' }}
              />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>قفل بیومتریک</Text>
                <Text style={styles.settingDescription}>اثر انگشت یا Face ID</Text>
              </View>
              <Switch
                value={backupConfig.security.biometricLock}
                onValueChange={(v) => updateBackupConfig({ security: { ...backupConfig.security, biometricLock: v } })}
                thumbColor={backupConfig.security.biometricLock ? '#FF6B9D' : '#B2BEC3'}
                trackColor={{ false: '#B2BEC3', true: 'rgba(255,107,157,0.3)' }}
              />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>حالت خصوصی - محتوای کودک</Text>
                <Text style={styles.settingDescription}>فقط والدین و کودک دسترسی دارند</Text>
              </View>
              <Switch
                value={backupConfig.security.privateMode.childContent}
                onValueChange={(v) => setPrivateMode(selectedMember, 'childContent', v)}
                thumbColor={backupConfig.security.privateMode.childContent ? '#FF6B9D' : '#B2BEC3'}
                trackColor={{ false: '#B2BEC3', true: 'rgba(255,107,157,0.3)' }}
              />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>حالت خصوصی - داده‌های سلامت</Text>
                <Text style={styles.settingDescription}>رمزنگاری جداگانه برای اطلاعات پزشکی</Text>
              </View>
              <Switch
                value={backupConfig.security.privateMode.healthData}
                onValueChange={(v) => setPrivateMode(selectedMember, 'healthData', v)}
                thumbColor={backupConfig.security.privateMode.healthData ? '#FF6B9D' : '#B2BEC3'}
                trackColor={{ false: '#B2BEC3', true: 'rgba(255,107,157,0.3)' }}
              />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>حالت خصوصی - محتوای رویا</Text>
                <Text style={styles.settingDescription}>حفاظت از رویاهای شخصی</Text>
              </View>
              <Switch
                value={backupConfig.security.privateMode.dreamContent}
                onValueChange={(v) => setPrivateMode(selectedMember, 'dreamContent', v)}
                thumbColor={backupConfig.security.privateMode.dreamContent ? '#FF6B9D' : '#B2BEC3'}
                trackColor={{ false: '#B2BEC3', true: 'rgba(255,107,157,0.3)' }}
              />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>هشدار دسترسی غیرمجاز</Text>
                <Text style={styles.settingDescription}>اطلاع‌رسانی در صورت ورود مشکوک</Text>
              </View>
              <Switch
                value={backupConfig.security.alerts.unauthorizedAccess}
                onValueChange={(v) => updateBackupConfig({ security: { ...backupConfig.security, alerts: { ...backupConfig.security.alerts, unauthorizedAccess: v } } })}
                thumbColor={backupConfig.security.alerts.unauthorizedAccess ? '#FF6B9D' : '#B2BEC3'}
                trackColor={{ false: '#B2BEC3', true: 'rgba(255,107,157,0.3)' }}
              />
            </View>
          </View>
        </View>

        {/* Manual Backup */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📦 پشتیبان‌گیری دستی</Text>
          <TouchableOpacity style={styles.backupButton} onPress={() => setShowCreateBackup(true)}>
            <Text style={styles.backupButtonText}>+ ایجاد پشتیبان جدید</Text>
          </TouchableOpacity>
          {lastBackupNote ? <Text style={styles.settingDescription}>{lastBackupNote}</Text> : null}
          
          {backupRecords.length > 0 && (
            <View style={styles.backupHistory}>
              <Text style={styles.sectionTitle}>📜 تاریخچه پشتیبان‌ها</Text>
              <View style={styles.backupList}>
                {backupRecords.slice(0, 10).map(record => (
                  <View key={record.id} style={styles.backupItem}>
                    <View style={styles.backupInfo}>
                      <Text style={styles.backupType}>
                        {record.type === 'auto' ? '🤖 خودکار' : '👤 دستی'}
                      </Text>
                      <Text style={styles.backupDate}>
                        {new Date(record.date).toLocaleDateString('fa-IR')} - {new Date(record.date).toLocaleTimeString('fa-IR')}
                      </Text>
                      <Text style={styles.backupSize}>
                        {(record.size / 1024 / 1024).toFixed(1)} MB • {record.status === 'completed' ? '✅' : record.status === 'in-progress' ? '⏳' : '❌'}
                      </Text>
                    </View>
                    {record.status === 'completed' && (
                      <TouchableOpacity style={styles.restoreButton} onPress={() => {
                        Alert.alert(
                          'بازگردانی پشتیبان',
                          'داده‌های فعلی این دستگاه با نسخه پشتیبان جایگزین می‌شوند. ادامه می‌دهید؟',
                          [
                            { text: 'انصراف', style: 'cancel' },
                            { text: 'بازگردانی', style: 'destructive', onPress: async () => {
                              try {
                                await restoreBackup(record.id);
                                Alert.alert('بازگردانی انجام شد', 'نسخه پشتیبان با موفقیت بازیابی شد.');
                              } catch {
                                Alert.alert('خطا', 'بازگردانی انجام نشد. ممکن است این نسخه اسنپ‌شات محلی نداشته باشد.');
                              }
                            } },
                          ]
                        );
                      }}>
                        <Text style={styles.restoreButtonText}>بازگردانی</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Create Backup Modal */}
        {showCreateBackup && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalLarge}>
              <Text style={styles.modalTitle}>ایجاد پشتیبان دستی</Text>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>نوع پشتیبان</Text>
                  <View style={styles.backupTypePicker}>
                    <TouchableOpacity style={[styles.backupTypeOption, backupType === 'manual' && styles.backupTypeSelected]} onPress={() => setBackupType('manual')}>
                      <Text style={styles.backupTypeOptionText}>👤 دستی</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.backupTypeOption, backupType === 'auto' && styles.backupTypeSelected]} onPress={() => setBackupType('auto')}>
                      <Text style={styles.backupTypeOptionText}>🤖 خودکار (تنظیمات پیش‌فرض)</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>شامل داده‌ها</Text>
                  <View style={styles.includesGrid}>
                    {Object.entries(selectedIncludes).map(([key, value]) => (
                      <TouchableOpacity key={key} style={[styles.includeOption, value && styles.includeSelected]} onPress={() => toggleInclude(key as keyof typeof selectedIncludes)}>
                        <Text style={styles.includeCheckbox}>{value ? '☑️' : '☐'}</Text>
                        <Text style={styles.includeLabel}>
                          {key === 'memories' ? 'خاطرات' : 
                           key === 'calendar' ? 'تقویم' :
                           key === 'wellness' ? 'سلامت' :
                           key === 'timeCapsules' ? 'کپسول زمان' :
                           key === 'dreams' ? 'رویاها' :
                           key === 'progress' ? 'پیشرفت' :
                           key === 'settings' ? 'تنظیمات' :
                           key === 'media' ? 'رسانه‌ها' : 'مدل‌های ۳D'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity style={[styles.modalSubmit, backupBusy && { opacity: 0.7 }]} onPress={handleCreateBackup} disabled={backupBusy}>
                  <Text style={styles.modalSubmitText}>{backupBusy ? 'در حال ایجاد...' : 'ایجاد پشتیبان 🔐'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setShowCreateBackup(false)}>
                  <Text style={styles.modalCancelText}>انصراف</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Counselor Tab
  function CounselorTab() {
    const [showBookSession, setShowBookSession] = React.useState(false);
    const [selectedProvider, setSelectedProvider] = React.useState<CounselorProvider | null>(null);
    const [sessionDate, setSessionDate] = React.useState('');
    const [sessionTopic, setSessionTopic] = React.useState('');
    const [editingSession, setEditingSession] = React.useState<CounselorSession | null>(null);
    const [editSessionTopic, setEditSessionTopic] = React.useState('');
    const [editSessionDate, setEditSessionDate] = React.useState('');
    const [editSessionNotes, setEditSessionNotes] = React.useState('');
    const [deleteSessionConfirmId, setDeleteSessionConfirmId] = React.useState<string | null>(null);
    const memberSessions = counselorSessions.filter(s => s.memberId === selectedMember);

    return (
      <View style={styles.tabContent}>
        {/* Providers */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>👨‍⚕️ مشاوران در دسترس</Text>
          {counselorConfig.enabled ? (
            <View style={styles.providersList}>
              {counselorConfig.providers.map(provider => (
                <TouchableOpacity key={provider.id} style={[styles.providerCard, selectedProvider?.id === provider.id && { borderWidth: 2, borderColor: '#FF6B9D' }]} onPress={() => {
                  setSelectedProvider(provider);
                  setShowBookSession(true);
                }}>
                  <View style={styles.providerInfo}>
                    <Text style={styles.providerName}>{provider.name}</Text>
                    <Text style={styles.providerSpecialties}>
                      تخصص‌ها: {provider.specialties.join('، ')}
                    </Text>
                    <Text style={styles.providerLanguages}>
                      زبان‌ها: {provider.languages.join('، ')}
                    </Text>
                    <Text style={styles.providerInsurance}>
                      {provider.insurance ? '✅ پوشش بیمه' : '❌ بدون بیمه'}
                    </Text>
                  </View>
                  <Text style={styles.providerAction}>رزرو جلسه →</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonText}>پیش‌نمایش محلی: مدیریت مشاور و جلسات</Text>
              <Text style={styles.comingSoonDesc}>
                می‌توانید فهرست مشاوران و رزرو/ثبت جلسات را به‌صورت محلی مدیریت کنید. اتصال ویدیویی/سرویس آنلاین خارجی در نسخه‌های بعدی قابل افزوده‌شدن است.
              </Text>
              <TouchableOpacity style={styles.enableButton} onPress={() => updateCounselorConfig({ enabled: true })}>
                <Text style={styles.enableButtonText}>نمایش مشاوران و ثبت جلسه</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Features */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>✨ امکانات</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📅</Text>
              <Text style={styles.featureTitle}>رزرو در برنامه</Text>
              <Text style={styles.featureDesc}>زمان‌بندی جلسات داخل برنامه</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📝</Text>
              <Text style={styles.featureTitle}>یادداشت جلسه</Text>
              <Text style={styles.featureDesc}>ثبت نکات مهم و تکالیف</Text>
            </View>
            <TouchableOpacity style={styles.featureCard} onPress={() => {
              const provider = selectedProvider || counselorConfig.providers?.[0] || null;
              if (!provider?.id) { Alert.alert('مشاوری ثبت نشده', 'ابتدا یک مشاور را فعال/انتخاب کنید.'); return; }
              const summary = shareProgressWithCounselor(selectedMember, provider.id);
              Alert.alert('خلاصه پیشرفت آماده شد', summary);
            }}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureTitle}>اشتراک پیشرفت</Text>
              <Text style={styles.featureDesc}>ایجاد و نمایش خلاصه محلی پیشرفت برای مشاور (لمس کنید)</Text>
            </TouchableOpacity>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🚨</Text>
              <Text style={styles.featureTitle}>تماس اضطراری</Text>
              <Text style={styles.featureDesc}>دسترسی سریع به خطوط امداد</Text>
            </View>
          </View>
        </View>

        {/* Recent Sessions */}
        {memberSessions.length > 0 ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>📋 جلسات {memberName} ({memberSessions.length})</Text>
            <View style={styles.sessionsList}>
              {memberSessions.slice(0, 8).map(session => {
                const provider = counselorConfig.providers.find(p => p.id === session.providerId);
                const deleting = deleteSessionConfirmId === session.id;
                return (
                  <View key={session.id} style={styles.sessionCard}>
                    <View style={styles.sessionHeader}>
                      <Text style={styles.sessionProvider}>{provider?.name}</Text>
                      <Text style={styles.sessionDate}>
                        {new Date(session.date).toLocaleDateString('fa-IR')}
                      </Text>
                    </View>
                    <Text style={styles.sessionTopic}>{session.topic}</Text>
                    <Text style={styles.sessionDuration}>⏱️ {session.duration} دقیقه</Text>
                    {session.notes ? <Text style={styles.sessionNotes}>{session.notes}</Text> : null}
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      <TouchableOpacity style={[styles.addButton, { paddingVertical: 6, paddingHorizontal: 10 }]} onPress={() => { setEditingSession(session); setEditSessionTopic(session.topic || ''); setEditSessionDate(session.date || ''); setEditSessionNotes(session.notes || ''); }}>
                        <Text style={styles.addButtonText}>ویرایش/یادداشت</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.addButton, { paddingVertical: 6, paddingHorizontal: 10, borderColor: '#E17055', backgroundColor: deleting ? 'rgba(225,112,85,0.12)' : 'transparent' }]} onPress={() => {
                        if (deleting) { deleteCounselorSession(session.id); setDeleteSessionConfirmId(null); }
                        else setDeleteSessionConfirmId(session.id);
                      }}>
                        <Text style={[styles.addButtonText, { color: '#E17055' }]}>{deleting ? 'تأیید حذف (مرحله ۲)' : 'حذف'}</Text>
                      </TouchableOpacity>
                      {deleting && (
                        <TouchableOpacity style={[styles.addButton, { paddingVertical: 6, paddingHorizontal: 10, borderColor: '#B2BEC3' }]} onPress={() => setDeleteSessionConfirmId(null)}>
                          <Text style={[styles.addButtonText, { color: '#636E72' }]}>انصراف</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : counselorSessions.length > 0 ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>📋 جلسات {memberName}</Text>
            <Text style={styles.exerciseDescription}>برای {memberName} جلسه‌ای ثبت نشده است (جلسات سایر اعضا در پروفایل همان عضو نمایش داده می‌شود).</Text>
          </View>
        ) : null}

        {/* Book Session Modal */}
        {showBookSession && selectedProvider && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalLarge}>
              <Text style={styles.modalTitle}>رزرو جلسه با {selectedProvider.name}</Text>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>موضوع جلسه</Text>
                  <TextInput style={styles.modalInput} placeholder="مثال: اضطراب کودک، راهنمایی والدین، ..." value={sessionTopic} onChangeText={setSessionTopic} />
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>تاریخ و ساعت (ISO)</Text>
                  <TextInput style={styles.modalInput} placeholder="2026-01-15T10:00:00" value={sessionDate} onChangeText={setSessionDate} />
                </View>
                <TouchableOpacity style={styles.modalSubmit} onPress={() => {
                  const trimmedTopic = sessionTopic.trim();
                  const trimmedDate = sessionDate.trim();
                  if (trimmedDate) {
                    const d = new Date(trimmedDate);
                    if (isNaN(d.getTime())) { Alert.alert('تاریخ نامعتبر', 'لطفاً تاریخ/ساعت را به شکل معتبر وارد کنید (مثال: 2026-11-20T10:00:00).'); return; }
                  }
                  bookCounselorSession({
                    memberId: selectedMember,
                    providerId: selectedProvider.id,
                    date: trimmedDate || new Date().toISOString(),
                    duration: 50,
                    topic: trimmedTopic || 'مشاوره عمومی',
                    notes: '',
                    sharedWithParents: true,
                    resources: [],
                  });
                  setShowBookSession(false);
                  setSessionTopic('');
                  setSessionDate('');
                }}>
                  <Text style={styles.modalSubmitText}>تأیید رزرو 📅</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setShowBookSession(false)}>
                  <Text style={styles.modalCancelText}>انصراف</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        )}

        {editingSession && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalLarge}>
              <Text style={styles.modalTitle}>ویرایش جلسه مشاوره</Text>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>موضوع</Text>
                  <TextInput style={styles.modalInput} value={editSessionTopic} onChangeText={setEditSessionTopic} placeholder="موضوع جلسه" />
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>تاریخ و ساعت (ISO)</Text>
                  <TextInput style={styles.modalInput} value={editSessionDate} onChangeText={setEditSessionDate} placeholder="2026-11-20T10:00:00" />
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>یادداشت</Text>
                  <TextInput style={styles.modalInput} value={editSessionNotes} onChangeText={setEditSessionNotes} placeholder="یادداشت‌ها، تکالیف، نکات..." multiline />
                </View>
                <TouchableOpacity style={styles.modalSubmit} onPress={() => {
                  const t = editSessionTopic.trim();
                  const d = editSessionDate.trim();
                  if (d) { const dt = new Date(d); if (isNaN(dt.getTime())) { Alert.alert('تاریخ نامعتبر', 'فرمت تاریخ/ساعت معتبر نیست.'); return; } }
                  updateCounselorSession(editingSession.id, { topic: t || 'مشاوره عمومی', date: d || editingSession.date, notes: editSessionNotes.trim() });
                  setEditingSession(null);
                }}>
                  <Text style={styles.modalSubmitText}>ذخیره تغییرات</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setEditingSession(null)}>
                  <Text style={styles.modalCancelText}>انصراف</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    );
  }

  // New Modals
  function AvatarSelectorModal({ onClose }: { onClose: () => void }) {
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>انتخاب همراه روزانه</Text>
          <View style={styles.avatarModalPicker}>
            {SUPPORTIVE_AVATARS.map(avatar => (
              <TouchableOpacity
                key={avatar.id}
                style={[
                  styles.avatarModalOption,
                  supportiveAvatar?.id === avatar.id && styles.avatarModalSelected,
                ]}
                onPress={() => {
                  setSupportiveAvatar(avatar as SupportiveAvatar);
                  onClose();
                }}
              >
                <Text style={styles.avatarModalEmoji}>{avatar.emoji}</Text>
                <View style={styles.avatarModalInfo}>
                  <Text style={styles.avatarModalName}>{avatar.name}</Text>
                  <Text style={styles.avatarModalPersonality}>{avatar.personality}</Text>
                </View>
                {supportiveAvatar?.id === avatar.id && (
                  <View style={styles.avatarModalCheck}>✓</View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.modalCancel} onPress={onClose}>
            <Text style={styles.modalCancelText}>انصراف</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  function BackupModal({ onClose }: { onClose: () => void }) {
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalLarge}>
          <Text style={styles.modalTitle}>مدیریت پشتیبان‌گیری</Text>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>تنظیمات پیشرفته در تب «پشتیبان/امنیت»</Text>
            </View>
            <TouchableOpacity style={styles.modalSubmit} onPress={onClose}>
              <Text style={styles.modalSubmitText}>باشه، مرسی ✨</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  };

  function CounselorModal({ onClose }: { onClose: () => void }) {
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalLarge}>
          <Text style={styles.modalTitle}>مشاور</Text>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>مدیریت مشاوران و ثبت/مشاهده جلسات از تب «مشاور» در دنیای من در دسترس است. اتصال آنلاین ویدیویی در صورت پشتیبانی سرویس خارجی قابل افزودن است.</Text>
            </View>
            <TouchableOpacity style={styles.modalSubmit} onPress={onClose}>
              <Text style={styles.modalSubmitText}>باشه ✨</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  };

  function QuickGuideModal({ guide, onClose }: { guide: ParentingQuickGuide | null; onClose: () => void }) {
    if (!guide) return null;
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalLarge}>
          <Text style={styles.modalTitle}>{guide.emoji} {guide.trigger}</Text>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>مراحل اقدام</Text>
              {guide.steps.map(step => (
                <View key={step.step} style={styles.guideStep}>
                  <Text style={styles.guideStepNumber}>مرحله {step.step}</Text>
                  <Text style={styles.guideStepAction}>{step.action}</Text>
                  <Text style={styles.guideStepDetail}>{step.detail}</Text>
                </View>
              ))}
            </View>
            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>پیشگیری</Text>
              {guide.prevention.map((item, index) => (
                <Text key={index} style={styles.preventionItem}>• {item}</Text>
              ))}
            </View>
            <TouchableOpacity style={styles.modalSubmit} onPress={onClose}>
              <Text style={styles.modalSubmitText}>فهمیدم ✨</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
);
  };
};

const createStyles = (tc: any, isDark: boolean) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: tc.background },
  container: { flex: 1, backgroundColor: tc.background },
  containerLight: { backgroundColor: tc.background },
  containerDark: { backgroundColor: tc.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: tc.text },
  headerSubtitle: { fontSize: 12, color: tc.textSecondary, marginTop: 2 },
  memberSelector: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 20, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,107,157,0.12)' },
  memberEmoji: { fontSize: 18, marginRight: 6 },
  memberName: { fontSize: 13, fontWeight: '700', color: tc.text },
  tabBarScroll: { flexGrow: 0, flexShrink: 0 },
  tabContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, flexGrow: 1 },
  tabButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', marginRight: 8 },
  tabButtonActive: { backgroundColor: isDark ? 'rgba(255,107,157,0.22)' : 'rgba(255,107,157,0.15)' },
  tabIcon: { fontSize: 14, marginRight: 6 },
  tabLabel: { fontSize: 12, color: tc.textSecondary, fontWeight: '600' },
  tabLabelActive: { color: tc.primary || '#FF6B9D', fontWeight: '700' },
  content: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 140 },
  tabContent: { gap: 12 },
  sectionCard: { backgroundColor: tc.surface || (isDark ? '#1B2436' : '#FFFFFF'), borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: tc.text, marginBottom: 8 },
  addButton: { backgroundColor: tc.primary || '#FF6B9D', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  scoreCard: { backgroundColor: tc.surface || (isDark ? '#1B2436' : '#FFFFFF'), borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', flexDirection: 'row', alignItems: 'center' },
  scoreCircle: { width: 92, height: 92, borderRadius: 46, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? 'rgba(255,107,157,0.15)' : 'rgba(255,107,157,0.1)', marginRight: 12 },
  scoreNumber: { fontSize: 28, fontWeight: '800', color: tc.primary || '#FF6B9D' },
  scoreLabel: { fontSize: 11, color: tc.textSecondary, marginTop: 2, textAlign: 'center' },
  scoreStats: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statItem: { width: '47%', alignItems: 'center', padding: 8, borderRadius: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' },
  statIcon: { fontSize: 18 },
  statValue: { fontSize: 16, fontWeight: '700', color: tc.text },
  statLabel: { fontSize: 11, color: tc.textSecondary, textAlign: 'center' },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickAction: { flex: 1, minWidth: '45%', alignItems: 'center', padding: 12, borderRadius: 14, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)' },
  quickActionIcon: { fontSize: 22, marginBottom: 4 },
  quickActionLabel: { fontSize: 12, fontWeight: '600', color: tc.text, textAlign: 'center' },
  exerciseList: { gap: 10 },
  exerciseCard: { padding: 12, borderRadius: 14, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', backgroundColor: tc.surface || (isDark ? '#1B2436' : '#FFFFFF') },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  exerciseIcon: { fontSize: 18 },
  exerciseCategory: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  exerciseCategoryText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  exerciseDifficulty: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  exerciseDifficultyText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  exerciseTitle: { fontSize: 14, fontWeight: '700', color: tc.text },
  exerciseDescription: { fontSize: 12, color: tc.textSecondary, marginTop: 4 },
  exerciseMeta: { flexDirection: 'row', gap: 10, marginTop: 8, flexWrap: 'wrap' },
  exerciseDuration: { fontSize: 11, color: tc.textSecondary },
  exerciseXP: { fontSize: 11, color: tc.primary || '#FF6B9D', fontWeight: '700' },
  exerciseDone: { fontSize: 11, color: '#00B894', fontWeight: '700' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryCard: { width: '47%', padding: 12, borderRadius: 14, borderWidth: 1, backgroundColor: tc.surface || (isDark ? '#1B2436' : '#FFFFFF'), alignItems: 'center' },
  categoryIcon: { fontSize: 22, marginBottom: 4 },
  categoryColorBar: { width: 28, height: 4, borderRadius: 2, marginBottom: 6 },
  categoryTitle: { fontSize: 13, fontWeight: '700', color: tc.text, textAlign: 'center' },
  categoryCount: { fontSize: 11, color: tc.textSecondary, marginTop: 2 },
  goalsList: { gap: 10 },
  goalItem: { padding: 10, borderRadius: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalTitle: { fontSize: 14, fontWeight: '700', color: tc.text },
  goalProgress: { fontSize: 12, fontWeight: '700' },
  progressBar: { height: 8, borderRadius: 4, marginTop: 8, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  goalDescription: { fontSize: 12, color: tc.textSecondary, marginTop: 6 },
  emptyGoals: { alignItems: 'center', padding: 20 },
  emptyGoalsText: { fontSize: 13, color: tc.textSecondary, textAlign: 'center' },
  addGoalButton: { marginTop: 10, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: tc.primary || '#FF6B9D' },
  addGoalButtonText: { color: tc.primary || '#FF6B9D', fontWeight: '700' },
  motivationCard: { backgroundColor: isDark ? 'rgba(255,107,157,0.12)' : 'rgba(255,107,157,0.08)', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: isDark ? 'rgba(255,107,157,0.2)' : 'rgba(255,107,157,0.15)' },
  motivationText: { fontSize: 14, color: tc.text, lineHeight: 22, textAlign: 'center' },
  checkInDone: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkInEmoji: { fontSize: 28 },
  checkInInfo: { flex: 1 },
  checkInMood: { fontSize: 15, fontWeight: '700', color: tc.text },
  checkInDetails: { fontSize: 12, color: tc.textSecondary, marginTop: 2 },
  checkInButton: { backgroundColor: tc.primary || '#FF6B9D', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  checkInButtonText: { color: '#fff', fontWeight: '700' },
  emotionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  emotionCard: { width: '30%', alignItems: 'center', padding: 10, borderRadius: 12, borderWidth: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)' },
  emotionCardEmoji: { fontSize: 22 },
  emotionCardLabel: { fontSize: 12, fontWeight: '700', color: tc.text, marginTop: 4 },
  emotionsTimeline: { gap: 10 },
  emotionItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  emotionDot: { width: 10, height: 10, borderRadius: 5 },
  emotionInfo: { flex: 1 },
  emotionTime: { fontSize: 11, color: tc.textSecondary },
  emotionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2, flexWrap: 'wrap' },
  emotionBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, color: '#fff', fontSize: 11, overflow: 'hidden' },
  emotionIntensity: { fontSize: 11, color: tc.textSecondary },
  historyItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' },
  historyEmoji: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', textAlign: 'center', lineHeight: 34 },
  historyInfo: { flex: 1 },
  historyDate: { fontSize: 11, color: tc.textSecondary },
  historyEmotion: { fontSize: 13, color: tc.text, fontWeight: '600' },
  chartPlaceholder: { alignItems: 'center', padding: 20, borderRadius: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' },
  chartText: { fontSize: 14, color: tc.text, fontWeight: '600' },
  chartSubtext: { fontSize: 12, color: tc.textSecondary, marginTop: 4, textAlign: 'center' },
  emptyState: { alignItems: 'center', padding: 24 },
  emptyIcon: { fontSize: 36, marginBottom: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: tc.text },
  emptySubtitle: { fontSize: 12, color: tc.textSecondary, marginTop: 4, textAlign: 'center' },
  capsulesList: { gap: 10 },
  capsuleCard: { padding: 12, borderRadius: 14, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', backgroundColor: tc.surface || (isDark ? '#1B2436' : '#FFFFFF') },
  capsuleHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  capsuleTypeIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  capsuleTypeEmoji: { fontSize: 16 },
  capsuleInfo: { flex: 1 },
  capsuleTitle: { fontSize: 14, fontWeight: '700', color: tc.text },
  capsuleTarget: { fontSize: 11, color: tc.textSecondary },
  capsuleDescription: { fontSize: 12, color: tc.textSecondary, marginTop: 6 },
  capsuleMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  capsuleContentCount: { fontSize: 11, color: tc.textSecondary },
  capsuleCreated: { fontSize: 11, color: tc.textSecondary },
  openButton: { marginTop: 10, backgroundColor: '#00B894', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  openButtonText: { color: '#fff', fontWeight: '700' },
  templatesSection: { marginTop: 16 },
  templatesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  templateCard: { width: '47%', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' },
  templateEmoji: { fontSize: 20, marginBottom: 4 },
  templateTitle: { fontSize: 13, fontWeight: '700', color: tc.text },
  templateDesc: { fontSize: 11, color: tc.textSecondary, marginTop: 2 },
  dreamsList: { gap: 10 },
  dreamCard: { padding: 12, borderRadius: 14, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', backgroundColor: tc.surface || (isDark ? '#1B2436' : '#FFFFFF') },
  dreamHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  dreamDate: { fontSize: 11, color: tc.textSecondary },
  dreamTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  dreamEmotionTag: { fontSize: 10, color: '#fff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  dreamTitle: { fontSize: 14, fontWeight: '700', color: tc.text },
  dreamDescription: { fontSize: 12, color: tc.textSecondary, marginTop: 4 },
  dreamSymbols: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, alignItems: 'center' },
  dreamSymbolsLabel: { fontSize: 11, color: tc.textSecondary, fontWeight: '600' },
  dreamSymbol: { fontSize: 11, color: tc.text, marginRight: 6 },
  dreamInterpretation: { marginTop: 8, padding: 10, borderRadius: 10, backgroundColor: isDark ? 'rgba(116,185,255,0.12)' : 'rgba(116,185,255,0.08)' },
  interpretationLabel: { fontSize: 12, fontWeight: '700', color: tc.text, marginBottom: 4 },
  interpretationText: { fontSize: 12, color: tc.text, lineHeight: 18 },
  interpretButton: { marginTop: 8, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: tc.primary || '#FF6B9D', alignItems: 'center' },
  interpretButtonText: { color: tc.primary || '#FF6B9D', fontWeight: '700', fontSize: 12 },
  symbolsGuide: { marginTop: 16 },
  symbolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  symbolItem: { width: '30%', padding: 8, borderRadius: 10, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', alignItems: 'center' },
  symbolEmoji: { fontSize: 18 },
  symbolName: { fontSize: 11, fontWeight: '700', color: tc.text, textAlign: 'center' },
  symbolMeaning: { fontSize: 10, color: tc.textSecondary, textAlign: 'center' },
  settingsList: { gap: 10 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' },
  settingInfo: { flex: 1, paddingRight: 10 },
  settingLabel: { fontSize: 14, fontWeight: '700', color: tc.text },
  settingDescription: { fontSize: 12, color: tc.textSecondary, marginTop: 2 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  progressOverview: { flexDirection: 'row', alignItems: 'center' },
  progressCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: isDark ? 'rgba(255,107,157,0.15)' : 'rgba(255,107,157,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  progressPercent: { fontSize: 22, fontWeight: '800', color: tc.primary || '#FF6B9D' },
  progressLabel: { fontSize: 11, color: tc.textSecondary },
  progressStats: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stationsContainer: { gap: 10 },
  stationCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', backgroundColor: tc.surface || (isDark ? '#1B2436' : '#FFFFFF') },
  stationCompleted: { borderColor: '#00B894' },
  stationCurrent: { borderColor: tc.primary || '#FF6B9D' },
  stationLocked: { opacity: 0.6 },
  stationNumber: { width: 34, height: 34, borderRadius: 17, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', alignItems: 'center', justifyContent: 'center' },
  stationNumberText: { fontSize: 14, color: tc.text, fontWeight: '700' },
  stationInfo: { flex: 1 },
  stationName: { fontSize: 14, fontWeight: '700', color: tc.text },
  stationNameCurrent: { color: tc.primary || '#FF6B9D' },
  stationDescription: { fontSize: 12, color: tc.textSecondary, marginTop: 2 },
  stationMeta: { flexDirection: 'row', gap: 10, marginTop: 6, flexWrap: 'wrap' },
  stationMetaItem: { fontSize: 11, color: tc.textSecondary },
  stationActionButton: { marginTop: 8, backgroundColor: tc.primary || '#FF6B9D', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10 },
  stationActionText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  stationCompletedBadge: { marginTop: 6, backgroundColor: 'rgba(0,184,148,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  stationCompletedText: { color: '#00B894', fontSize: 11, fontWeight: '700' },
  stationLockedBadge: { marginTop: 6 },
  stationLockedText: { color: tc.textSecondary, fontSize: 11 },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeCard: { width: '30%', alignItems: 'center', padding: 10, borderRadius: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' },
  badgeEmoji: { fontSize: 22 },
  badgeText: { fontSize: 11, color: tc.text, textAlign: 'center', marginTop: 4 },
  avatarChangeButton: { marginTop: 10, alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: tc.primary || '#FF6B9D' },
  avatarChangeText: { color: tc.primary || '#FF6B9D', fontWeight: '700', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  modal: { backgroundColor: tc.surface || (isDark ? '#1B2436' : '#FFFFFF'), borderRadius: 16, padding: 16, maxHeight: '90%', width: '100%' },
  modalLarge: { backgroundColor: tc.surface || (isDark ? '#1B2436' : '#FFFFFF'), borderRadius: 16, padding: 16, maxHeight: '90%', width: '100%' },
  modalScroll: { flexGrow: 0 },
  modalScrollContent: { paddingBottom: 24 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: tc.text, marginBottom: 12 },
  modalContent: { paddingBottom: 8 },
  modalLabel: { fontSize: 12, color: tc.textSecondary, marginTop: 8, marginBottom: 4 },
  modalInput: { borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: tc.text, backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#fff' },
  modalSubmit: { backgroundColor: tc.primary || '#FF6B9D', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  modalSubmitText: { color: '#fff', fontWeight: '700' },
  modalCancel: { paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  modalCancelText: { color: tc.textSecondary, fontWeight: '600' },
  modalSection: { marginTop: 12 },
  modalSectionText: { fontSize: 14, color: tc.text, marginBottom: 8, lineHeight: 22 },
  modalMember: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', marginBottom: 8 },
  modalMemberEmoji: { fontSize: 20, marginRight: 10 },
  modalMemberName: { fontSize: 14, fontWeight: '600', color: tc.text },
  avatarPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  avatarOption: { width: '22%', alignItems: 'center', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' },
  avatarSelected: { borderColor: tc.primary || '#FF6B9D', borderWidth: 2 },
  avatarEmoji: { fontSize: 22 },
  avatarLabel: { fontSize: 11, color: tc.text, marginTop: 4 },
  conditionPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  conditionOption: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' },
  conditionSelected: { borderColor: tc.primary || '#FF6B9D', borderWidth: 2 },
  conditionsList: { gap: 8 },
  conditionItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  conditionEmoji: { fontSize: 16 },
  conditionLabel: { fontSize: 13, color: tc.text, fontWeight: '600' },
  conditionBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  conditionBadgeText: { fontSize: 10, color: '#fff' },
  colorPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  colorOption: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' },
  colorOptionSelected: { borderWidth: 3, borderColor: tc.primary || '#FF6B9D' },
  emotionPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emotionPickerItem: { width: '22%', alignItems: 'center', padding: 8, borderRadius: 10, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' },
  emotionPickerSelected: { borderColor: tc.primary || '#FF6B9D', borderWidth: 2 },
  emotionPickerEmoji: { fontSize: 20 },
  emotionPickerLabel: { fontSize: 10, color: tc.text, marginTop: 2 },
  sliderContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sliderTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)', position: 'relative', overflow: 'visible' },
  sliderFill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 4, backgroundColor: tc.primary || '#FF6B9D' },
  sliderThumb: { position: 'absolute', top: -5, marginLeft: -9, width: 18, height: 18, borderRadius: 9, backgroundColor: tc.primary || '#FF6B9D', borderWidth: 2, borderColor: tc.surface || (isDark ? '#1B2436' : '#FFFFFF') },
  sliderValue: { fontSize: 12, color: tc.text, fontWeight: '700' },
  stepperBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' },
  stepperBtnText: { fontSize: 20, fontWeight: '700', color: tc.text, lineHeight: 22 },
  profileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  profileCard: { width: '47%', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', backgroundColor: tc.surface || (isDark ? '#1B2436' : '#FFFFFF') },
  profileEmoji: { fontSize: 22, marginBottom: 4 },
  profileTitle: { fontSize: 13, fontWeight: '700', color: tc.text },
  profileDesc: { fontSize: 11, color: tc.textSecondary, marginTop: 2 },
  resourceList: { gap: 10 },
  resourceCard: { padding: 12, borderRadius: 12, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', backgroundColor: tc.surface || (isDark ? '#1B2436' : '#FFFFFF') },
  resourceHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resourceIcon: { fontSize: 18 },
  resourceCategory: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
  resourceCategoryText: { fontSize: 10, color: tc.textSecondary },
  resourceTitle: { fontSize: 14, fontWeight: '700', color: tc.text, marginTop: 6 },
  resourceMeta: { fontSize: 11, color: tc.textSecondary, marginTop: 2 },
  resourceSubtitles: { fontSize: 11, color: tc.textSecondary },
  subtitleBadge: { fontSize: 11, color: tc.primary || '#FF6B9D', fontWeight: '600' },
  backupButton: { paddingVertical: 14, borderRadius: 12, backgroundColor: tc.primary || '#FF6B9D', alignItems: 'center', marginBottom: 16 },
  backupButtonText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  backupHistory: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
  backupList: { gap: 10 },
  backupItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, backgroundColor: tc.surface || (isDark ? '#1B2436' : '#FFFFFF'), borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
  backupInfo: { flex: 1 },
  backupType: { fontSize: 13, fontWeight: '700', color: tc.text },
  backupDate: { fontSize: 11, color: tc.textSecondary, marginTop: 2 },
  backupSize: { fontSize: 11, color: tc.textSecondary, marginTop: 2 },
  restoreButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(0,184,148,0.12)', borderWidth: 1, borderColor: '#00B894' },
  restoreButtonText: { fontSize: 12, fontWeight: '700', color: '#00B894' },
  backupTypePicker: { gap: 8 },
  backupTypeOption: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' },
  backupTypeSelected: { borderColor: tc.primary || '#FF6B9D', backgroundColor: isDark ? 'rgba(255,107,157,0.15)' : 'rgba(255,107,157,0.1)', borderWidth: 2 },
  backupTypeOptionText: { fontSize: 14, fontWeight: '600', color: tc.text },
  includesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  includeOption: { flex: 1, minWidth: '30%', flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', gap: 8 },
  includeSelected: { borderColor: tc.primary || '#FF6B9D', backgroundColor: isDark ? 'rgba(255,107,157,0.15)' : 'rgba(255,107,157,0.1)', borderWidth: 2 },
  includeCheckbox: { fontSize: 18, color: tc.text },
  includeLabel: { fontSize: 13, fontWeight: '600', color: tc.text },
  providersList: { gap: 12 },
  providerCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, backgroundColor: tc.surface || (isDark ? '#1B2436' : '#FFFFFF'), borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
  providerInfo: { flex: 1 },
  providerName: { fontSize: 15, fontWeight: '700', color: tc.text },
  providerSpecialties: { fontSize: 12, color: tc.textSecondary, marginTop: 2 },
  providerLanguages: { fontSize: 11, color: tc.textSecondary, marginTop: 1 },
  providerInsurance: { fontSize: 11, fontWeight: '600', marginTop: 4, color: tc.textSecondary },
  providerAction: { fontSize: 13, fontWeight: '600', color: tc.primary || '#FF6B9D' },
  comingSoon: { alignItems: 'center', padding: 32 },
  comingSoonText: { fontSize: 18, fontWeight: '700', color: tc.primary || '#FF6B9D', marginBottom: 8 },
  comingSoonDesc: { fontSize: 13, color: tc.textSecondary, textAlign: 'center', marginBottom: 16, lineHeight: 20 },
  enableButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20, backgroundColor: isDark ? 'rgba(255,107,157,0.15)' : 'rgba(255,107,157,0.1)', borderWidth: 1, borderColor: tc.primary || '#FF6B9D' },
  enableButtonText: { fontSize: 13, fontWeight: '600', color: tc.primary || '#FF6B9D' },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featureCard: { flex: 1, minWidth: '45%', padding: 16, borderRadius: 16, backgroundColor: tc.surface || (isDark ? '#1B2436' : '#FFFFFF'), borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
  featureIcon: { fontSize: 28, marginBottom: 8, textAlign: 'center' },
  featureTitle: { fontSize: 14, fontWeight: '700', color: tc.text, textAlign: 'center', marginBottom: 4 },
  featureDesc: { fontSize: 11, color: tc.textSecondary, textAlign: 'center' },
  avatarModalPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  avatarModalOption: { flex: 1, minWidth: '45%', flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', gap: 12 },
  avatarModalSelected: { borderColor: tc.primary || '#FF6B9D', backgroundColor: isDark ? 'rgba(255,107,157,0.15)' : 'rgba(255,107,157,0.1)', borderWidth: 2 },
  avatarModalEmoji: { fontSize: 32 },
  avatarModalInfo: { flex: 1 },
  avatarModalName: { fontSize: 14, fontWeight: '700', color: tc.text },
  avatarModalPersonality: { fontSize: 11, color: tc.textSecondary },
  avatarModalCheck: { fontSize: 20, color: tc.primary || '#FF6B9D' },
  guideStep: { marginBottom: 16, padding: 12, borderRadius: 12, backgroundColor: isDark ? 'rgba(255,107,157,0.1)' : 'rgba(255,107,157,0.05)', borderWidth: 1, borderColor: isDark ? 'rgba(255,107,157,0.25)' : 'rgba(255,107,157,0.2)' },
  guideStepNumber: { fontSize: 12, fontWeight: '700', color: tc.primary || '#FF6B9D', marginBottom: 4 },
  guideStepAction: { fontSize: 14, fontWeight: '700', color: tc.text, marginBottom: 2 },
  guideStepDetail: { fontSize: 12, color: tc.textSecondary },
  preventionItem: { fontSize: 12, color: tc.textSecondary, marginBottom: 4 },
  dreamSessionsList: { gap: 12 },
  dreamSessionCard: { padding: 16, borderRadius: 16, backgroundColor: tc.surface || (isDark ? '#1B2436' : '#FFFFFF'), borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
  dreamSessionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dreamSessionEnvName: { fontSize: 14, fontWeight: '700', color: tc.text },
  dreamSessionDate: { fontSize: 11, color: tc.textSecondary },
  sessionMoods: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginVertical: 8 },
  sessionMood: { alignItems: 'center' },
  sessionMoodLabel: { fontSize: 11, fontWeight: '600', color: tc.textSecondary },
  sessionMoodEmoji: { fontSize: 24, marginVertical: 2 },
  sessionMoodText: { fontSize: 12, fontWeight: '600', color: tc.text },
  sessionArrow: { fontSize: 20, color: tc.primary || '#FF6B9D' },
  sessionDuration: { fontSize: 11, color: tc.textSecondary, textAlign: 'center' },
  sessionNotes: { fontSize: 12, color: tc.textSecondary, marginTop: 8, fontStyle: 'italic' },
  environmentsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  environmentCard: { width: '47%', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', backgroundColor: tc.surface || (isDark ? '#1B2436' : '#FFFFFF') },
  environmentEmoji: { fontSize: 22, marginBottom: 4 },
  environmentName: { fontSize: 13, fontWeight: '700', color: tc.text },
  environmentDescription: { fontSize: 11, color: tc.textSecondary, marginTop: 2 },
  environmentMeta: { flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' },
  environmentMetaItem: { fontSize: 11, color: tc.textSecondary },
  environmentCompleted: { borderColor: '#00B894' },
  environmentCompletedBadge: { marginTop: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: 'rgba(0,184,148,0.12)', alignItems: 'center' },
  environmentCompletedText: { fontSize: 11, fontWeight: '700', color: '#00B894' },
  dreamTherapyOverview: { gap: 10 },
  overviewCard: { flex: 1, alignItems: 'center', padding: 10, borderRadius: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' },
  overviewIcon: { fontSize: 20 },
  overviewLabel: { fontSize: 11, color: tc.textSecondary, marginTop: 2 },
  overviewValue: { fontSize: 14, fontWeight: '700', color: tc.text },
  sessionsList: { gap: 10 },
  sessionCard: { padding: 12, borderRadius: 12, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', backgroundColor: tc.surface || (isDark ? '#1B2436' : '#FFFFFF') },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sessionProvider: { fontSize: 14, fontWeight: '700', color: tc.text },
  sessionDate: { fontSize: 11, color: tc.textSecondary },
  sessionTopic: { fontSize: 12, color: tc.text, marginTop: 4 },
  sessionType: { fontSize: 11, color: tc.textSecondary },
  sessionParticipants: { fontSize: 11, color: tc.textSecondary },
  addSessionButton: { marginTop: 10, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: tc.primary || '#FF6B9D', alignItems: 'center' },
  addSessionButtonText: { color: '#fff', fontWeight: '700' },
  completeSessionButton: { marginTop: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: tc.primary || '#FF6B9D', alignItems: 'center' },
  completeSessionButtonText: { color: tc.primary || '#FF6B9D', fontWeight: '700', fontSize: 12 },
});

export default WellnessScreen;
