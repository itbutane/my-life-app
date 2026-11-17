import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, Platform } from 'react-native';
import { 
  FamilyMember, 
  Memory, 
  CalendarEvent, 
  LifeFlowerState, 
  DailyPlan, 
  PlanTask,
  XPState, 
  ColoringPage, 
  AppSettings, 
  NightWonder, 
  WellnessProfile,
  TherapyExercise,
  EmotionEntry,
  WellnessCheckIn,
  TimeCapsule,
  TimeCapsuleContent,
  DreamEntry,
  DreamWorld,
  AccessibilitySettings,
  ParentingResource,
  FamilyTherapySession,
  SupportiveAvatar,
  UserProgressMap,
  DreamTherapyEnvironment,
  DreamTherapySession,
  BackupConfig,
  BackupRecord,
  CounselorIntegrationConfig,
  CounselorSession,
  ParentingQuickGuide,
  EmotionType,
  FamilyNotification,
  GalleryPhoto,
  HealthActivity,
  HealthPlan,
} from '../types';
import { 
  FAMILY_MEMBERS, 
  THERAPY_EXERCISES, 
  SPECIAL_NEEDS_PROFILES, 
  PARENTING_RESOURCES,
  PROGRESS_MAP_STATIONS,
  DREAM_THERAPY_ENVIRONMENTS,
  BACKUP_CONFIG,
  COUNSELOR_INTEGRATION,
  PARENTING_QUICK_GUIDES,
  DEFAULT_ACCESSIBILITY_SETTINGS,
  SUPPORTIVE_AVATARS,
  NIGHT_WONDERS,
} from '../constants/data';

interface AppState {
  // Family
  familyMembers: FamilyMember[];
  activeMemberId: FamilyMember['id'];
  setActiveMemberId: (id: FamilyMember['id']) => void;
  rolePermissions: { canManageFamily: boolean; canEditShared: boolean; canViewChildPrivate: boolean; canSync: boolean };
  daughterName: string;
  setDaughterName: (name: string) => void;
  updateFamilyMemberName: (id: FamilyMember['id'], name: string) => void;
  updateFamilyMemberAvatar: (id: FamilyMember['id'], updates: { avatarEmoji?: string; photoUri?: string | null }) => void;
  updateFamilyMemberBirthYear: (id: FamilyMember['id'], birthYear: number | undefined) => void;
  updateFamilyMemberBirthDate: (id: FamilyMember['id'], birthDate: string | undefined) => void;
  
  // Memories
  memories: Memory[];
  addMemory: (memory: Omit<Memory, 'id'>) => void;
  updateMemory: (id: string, updates: Partial<Memory>) => void;
  deleteMemory: (id: string) => void;
  
  // Gallery
  galleryPhotos: GalleryPhoto[];
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id'>) => void;
  updateGalleryPhoto: (id: string, updates: Partial<GalleryPhoto>) => void;
  deleteGalleryPhoto: (id: string) => void;

  // Calendar
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;
  
  // Life Flower
  lifeFlower: LifeFlowerState;
  bloomPetal: (message: string) => boolean;
  
  // Daily Plan & XP
  dailyPlan: DailyPlan;
  xpState: XPState;
  completeTask: (taskId: string) => void;
  addDailyTask: (task: Omit<PlanTask, 'id' | 'completed'>) => void;
  updateDailyTask: (id: string, updates: Partial<PlanTask>) => void;
  deleteDailyTask: (id: string) => void;
  addXP: (amount: number) => void;
  resetDailyPlan: () => void;
  
  // Coloring
  coloringPages: ColoringPage[];
  addColoringPage: (page: Omit<ColoringPage, 'id'>) => void;
  updateColoringPage: (id: string, updates: Partial<ColoringPage>) => void;
  deleteColoringPage: (id: string) => void;
  
  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Night Wonders
  nightWonders: NightWonder[];
  unlockNightWonder: (id: string) => void;
  getTodaysWonder: () => NightWonder | null;
  
  // Theme
  isDark: boolean;
  toggleTheme: () => void;
  
  // Wellness & Rehabilitation
  wellnessProfiles: Record<FamilyMember['id'], WellnessProfile>;
  updateWellnessProfile: (memberId: FamilyMember['id'], profile: Partial<WellnessProfile>) => void;
  therapyExercises: TherapyExercise[];
  getRecommendedExercises: (memberId: FamilyMember['id']) => TherapyExercise[];
  completeTherapyExercise: (exerciseId: string, memberId: FamilyMember['id'], rating?: number) => void;
  emotionEntries: EmotionEntry[];
  addEmotionEntry: (entry: Omit<EmotionEntry, 'id'>) => void;
  wellnessCheckIns: WellnessCheckIn[];
  addWellnessCheckIn: (checkIn: Omit<WellnessCheckIn, 'id'>) => void;

  // Health & Fitness
  healthActivities: HealthActivity[];
  healthPlans: HealthPlan[];
  dailySteps: Record<FamilyMember['id'], { date: string; steps: number; goal: number; goalRewardedDate?: string }>;
  addHealthActivity: (activity: Omit<HealthActivity, 'id'>) => void;
  updateHealthActivity: (id: string, updates: Partial<HealthActivity>) => void;
  deleteHealthActivity: (id: string) => void;
  addHealthPlan: (plan: Omit<HealthPlan, 'id'>) => void;
  updateHealthPlan: (id: string, updates: Partial<HealthPlan>) => void;
  deleteHealthPlan: (id: string) => void;
  setDailySteps: (memberId: FamilyMember['id'], steps: number, goal?: number) => void;
  
  // Time Capsule
  timeCapsules: TimeCapsule[];
  createTimeCapsule: (capsule: Omit<TimeCapsule, 'id' | 'createdAt'>) => void;
  updateTimeCapsule: (id: string, updates: Partial<TimeCapsule>) => void;
  deleteTimeCapsule: (id: string) => void;
  addTimeCapsuleContent: (capsuleId: string, content: Omit<TimeCapsuleContent, 'id' | 'createdAt'>) => void;
  updateTimeCapsuleContent: (capsuleId: string, contentId: string, updates: Partial<TimeCapsuleContent>) => void;
  deleteTimeCapsuleContent: (capsuleId: string, contentId: string) => void;
  openTimeCapsule: (capsuleId: string) => void;
  
  // Dream World
  dreamWorlds: DreamWorld[];
  createDreamWorld: (world: Omit<DreamWorld, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addDreamEntry: (worldId: string, entry: Omit<DreamEntry, 'id'>) => void;
  interpretDream: (entryId: string) => void;
  shareDream: (entryId: string, withMembers: FamilyMember['id'][]) => void;
  
  // Accessibility
  accessibilitySettings: AccessibilitySettings;
  updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => void;
  
  // Parenting Resources
  parentingResources: ParentingResource[];
  saveParentingResource: (resourceId: string, memberId: FamilyMember['id']) => void;
  
  // Family Therapy
  therapySessions: FamilyTherapySession[];
  createTherapySession: (session: Omit<FamilyTherapySession, 'id'>) => void;
  completeTherapySession: (sessionId: string) => void;
  deleteTherapySession: (sessionId: string) => void;

  // Supportive Avatar
  supportiveAvatar: SupportiveAvatar | null;
  setSupportiveAvatar: (avatar: SupportiveAvatar) => void;
  getDailyAvatarMessage: (memberId: FamilyMember['id'], timeOfDay: 'morning' | 'evening' | 'stress') => string;
  
  // Progress Map
  progressMaps: Record<FamilyMember['id'], UserProgressMap>;
  updateProgressMap: (memberId: FamilyMember['id'], updates: Partial<UserProgressMap>) => void;
  completeProgressStation: (memberId: FamilyMember['id'], stationId: string) => void;
  notifications: FamilyNotification[];
  addNotification: (n: Omit<FamilyNotification, 'id' | 'createdAt' | 'readBy'>) => void;
  markNotificationRead: (id: string, memberId: FamilyMember['id']) => void;
  awardCoursePart: (memberId: FamilyMember['id'], courseTitle: string, partTitle: string) => void;
  
  // Dream Therapy
  dreamTherapyEnvironments: DreamTherapyEnvironment[];
  dreamTherapySessions: DreamTherapySession[];
  startDreamTherapySession: (memberId: FamilyMember['id'], environmentId: string, moodBefore?: EmotionType) => void;
  completeDreamTherapySession: (sessionId: string, moodAfter: EmotionType, notes: string) => void;
  
  // Backup & Security
  backupConfig: BackupConfig;
  backupRecords: BackupRecord[];
  updateBackupConfig: (config: Partial<BackupConfig>) => void;
  setBiometricLock: (enabled: boolean) => void;
  createBackup: (type: 'auto' | 'manual', options?: Partial<BackupRecord['includes']>) => Promise<BackupRecord>;
  restoreBackup: (backupId: string) => Promise<void>;
  enableTwoFactorAuth: (memberId: FamilyMember['id']) => void;
  disableTwoFactorAuth: (memberId: FamilyMember['id']) => void;
  setPrivateMode: (memberId: FamilyMember['id'], dataType: 'childContent' | 'healthData' | 'dreamContent' | 'therapistNotes', enabled: boolean) => void;
  
  // Counselor Integration
  counselorConfig: CounselorIntegrationConfig;
  counselorSessions: CounselorSession[];
  updateCounselorConfig: (config: Partial<CounselorIntegrationConfig>) => void;
  bookCounselorSession: (session: Omit<CounselorSession, 'id'>) => void;
  updateCounselorSession: (id: string, updates: Partial<CounselorSession>) => void;
  deleteCounselorSession: (id: string) => void;
  shareProgressWithCounselor: (memberId: FamilyMember['id'], counselorId: string) => string;
  
  // Parenting Quick Guides
  parentingQuickGuides: ParentingQuickGuide[];
  getQuickGuide: (trigger: string) => ParentingQuickGuide | undefined;
  
  // App Updates
  appUpdateState: import('../types').AppUpdateState;
  checkForAppUpdates: () => Promise<void>;
  rollbackAppUpdate: () => Promise<void>;
  clearAppUpdateHistory: () => Promise<void>;

  // Persistence
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
  exportAppData: () => Promise<string>;
  importAppData: (json: string) => Promise<void>;
  exportSyncPackage: () => Promise<string>;
  importSyncPackage: (json: string) => Promise<void>;
  resetAllData: () => Promise<void>;
}

const STORAGE_KEY = 'my-life-app-data';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'auto',
  themePreset: 'joy',
  musicEnabled: true,
  notificationsEnabled: true,
  language: 'fa',
  memberName: 'دختر',
  subtitlesEnabled: true,
  subtitleLanguage: 'fa',
  highContrast: false,
  reducedMotion: false,
  dyslexiaFont: false,
  activeMemberId: 'maman',
  sync: {
    internetSyncEnabled: false,
    wifiSyncEnabled: false,
    autoSyncOnReconnect: false,
    lastSyncAt: undefined,
    lastSyncFrom: undefined,
    deviceName: 'FamilyDevice',
  },
};

const DEFAULT_FAMILY_MEMBERS: FamilyMember[] = FAMILY_MEMBERS.map(m => ({
  ...m,
  name: m.id === 'daughter' ? 'دختر' : m.name,
}));

const DEFAULT_LIFE_FLOWER: LifeFlowerState = {
  petals: 0,
  maxPetals: 12,
  lastBloom: '',
  messages: [],
};

const DEFAULT_XP_STATE: XPState = {
  totalXP: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  dailyXP: 0,
  weeklyXP: 0,
};

const DEFAULT_DAILY_PLAN: DailyPlan = {
  date: new Date().toISOString().split('T')[0],
  tasks: [],
  xpEarned: 0,
  streak: 0,
};

const DEFAULT_WELLNESS_PROFILES: Record<FamilyMember['id'], WellnessProfile> = {
  baba: { memberId: 'baba', conditions: [], sensoryPreferences: { lowStimulation: false, colorScheme: 'soft', soundEnabled: true, soundVolume: 0.5, hapticFeedback: true, fontSize: 'medium', fontFamily: 'system', reducedMotion: false, screenReaderOptimized: false }, therapyGoals: [], medications: [], emergencyContacts: [] },
  maman: { memberId: 'maman', conditions: [], sensoryPreferences: { lowStimulation: false, colorScheme: 'soft', soundEnabled: true, soundVolume: 0.5, hapticFeedback: true, fontSize: 'medium', fontFamily: 'system', reducedMotion: false, screenReaderOptimized: false }, therapyGoals: [], medications: [], emergencyContacts: [] },
  daughter: { memberId: 'daughter', conditions: [], sensoryPreferences: { lowStimulation: false, colorScheme: 'soft', soundEnabled: true, soundVolume: 0.5, hapticFeedback: true, fontSize: 'medium', fontFamily: 'system', reducedMotion: false, screenReaderOptimized: false }, therapyGoals: [], medications: [], emergencyContacts: [] },
};

const DEFAULT_THERAPY_EXERCISES: TherapyExercise[] = THERAPY_EXERCISES.map(ex => ({ ...ex, completed: false } as TherapyExercise));

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = DEFAULT_ACCESSIBILITY_SETTINGS as AccessibilitySettings;

const DEFAULT_SUPPORTIVE_AVATAR: SupportiveAvatar = SUPPORTIVE_AVATARS[0] as SupportiveAvatar;

const createDefaultProgressMap = (memberId: FamilyMember['id']): UserProgressMap => ({
  memberId,
  currentStation: 'station-1',
  completedStations: [],
  totalExercisesCompleted: 0,
  badges: [],
  lastUpdated: new Date().toISOString(),
});

const DEFAULT_PROGRESS_MAP: Record<FamilyMember['id'], UserProgressMap> = {
  baba: createDefaultProgressMap('baba'),
  maman: createDefaultProgressMap('maman'),
  daughter: createDefaultProgressMap('daughter'),
};

const DEFAULT_APP_UPDATE_STATE: import('../types').AppUpdateState = {
  history: [],
  sectionBaseline: {},
};

const DEFAULT_DREAM_THERAPY_ENVIRONMENTS: DreamTherapyEnvironment[] = DREAM_THERAPY_ENVIRONMENTS.map(env => ({
  ...env,
  completed: false,
  timesUsed: 0,
}));

const DEFAULT_BACKUP_CONFIG: BackupConfig = BACKUP_CONFIG as unknown as BackupConfig;

const DEFAULT_COUNSELOR_CONFIG: CounselorIntegrationConfig = COUNSELOR_INTEGRATION as unknown as CounselorIntegrationConfig;

export const AppContext = createContext<AppState | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(DEFAULT_FAMILY_MEMBERS);
  const [activeMemberId, setActiveMemberId] = useState<FamilyMember['id']>('maman');
  const [daughterName, setDaughterName] = useState('دختر');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [lifeFlower, setLifeFlower] = useState<LifeFlowerState>(DEFAULT_LIFE_FLOWER);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan>(DEFAULT_DAILY_PLAN);
  const [xpState, setXpState] = useState<XPState>(DEFAULT_XP_STATE);
  const [coloringPages, setColoringPages] = useState<ColoringPage[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [nightWonders, setNightWonders] = useState<NightWonder[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  
  // Wellness
  const [wellnessProfiles, setWellnessProfiles] = useState<Record<FamilyMember['id'], WellnessProfile>>(DEFAULT_WELLNESS_PROFILES);
  const [therapyExercises, setTherapyExercises] = useState<TherapyExercise[]>(DEFAULT_THERAPY_EXERCISES);
  const [emotionEntries, setEmotionEntries] = useState<EmotionEntry[]>([]);
  const [wellnessCheckIns, setWellnessCheckIns] = useState<WellnessCheckIn[]>([]);
  
  // Time Capsule
  const [timeCapsules, setTimeCapsules] = useState<TimeCapsule[]>([]);
  
  // Dream World
  const [dreamWorlds, setDreamWorlds] = useState<DreamWorld[]>([]);
  
  // Accessibility
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY);
  
  // Parenting Resources
  const [parentingResources] = useState<ParentingResource[]>(PARENTING_RESOURCES as unknown as ParentingResource[]);
  
  // Family Therapy
  const [therapySessions, setTherapySessions] = useState<FamilyTherapySession[]>([]);

  // Supportive Avatar
  const [supportiveAvatar, setSupportiveAvatar] = useState<SupportiveAvatar>(DEFAULT_SUPPORTIVE_AVATAR);
  
  // Progress Map
  const [progressMaps, setProgressMaps] = useState<Record<FamilyMember['id'], UserProgressMap>>(DEFAULT_PROGRESS_MAP);
  const [notifications, setNotifications] = useState<FamilyNotification[]>([]);

  // Health & Fitness
  const todayStr = new Date().toISOString().split('T')[0];
  const [healthActivities, setHealthActivities] = useState<HealthActivity[]>([
    { id: 'ha1', memberId: 'baba', date: todayStr, category: 'walking', title: 'پیاده‌روی صبحگاهی', duration: 30, intensity: 'medium', steps: 3500, completed: true, notes: 'هوای تازه و انرژی خوب' },
    { id: 'ha2', memberId: 'maman', date: todayStr, category: 'yoga', title: 'یوگا و کشش', duration: 20, intensity: 'low', completed: true, notes: 'آرامش ذهن و بدن' },
    { id: 'ha3', memberId: 'daughter', date: todayStr, category: 'sports', title: 'بازی فعال', duration: 25, intensity: 'medium', steps: 2200, completed: false, notes: 'بازی در خانه/حیاط' },
  ]);
  const [healthPlans, setHealthPlans] = useState<HealthPlan[]>([
    { id: 'hp1', memberId: 'baba', title: 'فعالیت هوازی هفتگی', category: 'cardio', weeklyTargetMinutes: 150, weeklyTargetSteps: 50000, active: true },
    { id: 'hp2', memberId: 'maman', title: 'یوگا و انعطاف', category: 'yoga', weeklyTargetMinutes: 90, active: true },
    { id: 'hp3', memberId: 'daughter', title: 'بازی و حرکت روزانه', category: 'sports', weeklyTargetMinutes: 120, weeklyTargetSteps: 30000, active: true },
  ]);
  const [dailySteps, setDailyStepsState] = useState<Record<FamilyMember['id'], { date: string; steps: number; goal: number; goalRewardedDate?: string }>>({
    baba: { date: todayStr, steps: 4200, goal: 8000 },
    maman: { date: todayStr, steps: 5100, goal: 7000 },
    daughter: { date: todayStr, steps: 2600, goal: 6000 },
  });

  const normalizeDailyStepsForToday = (input: Record<FamilyMember['id'], { date: string; steps: number; goal: number; goalRewardedDate?: string }>) => {
    const today = new Date().toISOString().split('T')[0];
    const next: Record<FamilyMember['id'], { date: string; steps: number; goal: number; goalRewardedDate?: string }> = { ...input } as any;
    (Object.keys(next) as FamilyMember['id'][]).forEach(id => {
      const entry = next[id];
      if (!entry) return;
      if (entry.date !== today) {
        next[id] = { ...entry, date: today, steps: 0, goalRewardedDate: undefined };
      } else if ((entry.steps || 0) >= (entry.goal || 0) && (entry.goal || 0) > 0 && entry.goalRewardedDate !== today) {
        next[id] = { ...entry, goalRewardedDate: today };
      }
    });
    return next;
  };

  
  // Dream Therapy
  const [dreamTherapyEnvironments, setDreamTherapyEnvironments] = useState<DreamTherapyEnvironment[]>(DEFAULT_DREAM_THERAPY_ENVIRONMENTS);
  const [dreamTherapySessions, setDreamTherapySessions] = useState<DreamTherapySession[]>([]);
  
  // Backup & Security
  const [backupConfig, setBackupConfig] = useState<BackupConfig>(DEFAULT_BACKUP_CONFIG);
  const [backupRecords, setBackupRecords] = useState<BackupRecord[]>([]);
  const [appUpdateState, setAppUpdateState] = useState<import('../types').AppUpdateState>(DEFAULT_APP_UPDATE_STATE);
  
  // Counselor Integration
  const [counselorConfig, setCounselorConfig] = useState<CounselorIntegrationConfig>(DEFAULT_COUNSELOR_CONFIG);
  const [counselorSessions, setCounselorSessions] = useState<CounselorSession[]>([]);
  
  // Parenting Quick Guides
  const [parentingQuickGuides] = useState<ParentingQuickGuide[]>(PARENTING_QUICK_GUIDES);

  // Initialize theme
  useEffect(() => {
    const resolveTheme = (mode: AppSettings['theme']) =>
      mode === 'auto' ? Appearance.getColorScheme() === 'dark' : mode === 'dark';
    setIsDark(resolveTheme(settings.theme));
    setHydrated(true);
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      if (settings.theme === 'auto') setIsDark(colorScheme === 'dark');
    });
    return () => sub.remove();
  }, [settings.theme]);

  const mergeBackupConfig = (data?: Partial<BackupConfig> | null): BackupConfig => ({
    ...DEFAULT_BACKUP_CONFIG,
    ...(data || {}),
    autoBackup: { ...DEFAULT_BACKUP_CONFIG.autoBackup, ...(data?.autoBackup || {}) },
    manualBackup: {
      ...DEFAULT_BACKUP_CONFIG.manualBackup,
      ...(data?.manualBackup || {}),
      includeOptions: {
        ...DEFAULT_BACKUP_CONFIG.manualBackup.includeOptions,
        ...(data?.manualBackup?.includeOptions || {}),
      },
    },
    security: {
      ...DEFAULT_BACKUP_CONFIG.security,
      ...(data?.security || {}),
      privateMode: { ...DEFAULT_BACKUP_CONFIG.security.privateMode, ...(data?.security?.privateMode || {}) },
      alerts: { ...DEFAULT_BACKUP_CONFIG.security.alerts, ...(data?.security?.alerts || {}) },
      encryption: { ...DEFAULT_BACKUP_CONFIG.security.encryption, ...(data?.security?.encryption || {}) },
    },
    offlineMode: { ...DEFAULT_BACKUP_CONFIG.offlineMode, ...(data?.offlineMode || {}) },
  });

  const normalizeDailyPlan = (plan?: Partial<DailyPlan> | null): DailyPlan => {
    const today = new Date().toISOString().split('T')[0];
    if (!plan || plan.date !== today) {
      return { date: today, tasks: [], xpEarned: 0, streak: 0 };
    }
    return {
      date: today,
      tasks: Array.isArray(plan.tasks) ? (plan.tasks as PlanTask[]) : [],
      xpEarned: typeof plan.xpEarned === 'number' ? plan.xpEarned : 0,
      streak: typeof plan.streak === 'number' ? plan.streak : 0,
    };
  };

  const migrateMemberIds = (value: any): any => {
    if (Array.isArray(value)) return value.map(migrateMemberIds);
    if (value && typeof value === 'object') {
      const out: any = {};
      for (const [k, v] of Object.entries(value)) {
        const nk = k === 'mahsa' ? 'maman' : k;
        out[nk] = migrateMemberIds(v);
      }
      return out;
    }
    if (value === 'mahsa') return 'maman';
    if (value === 'مهسا') return 'مامان';
    return value;
  };

  // Load data
  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = migrateMemberIds(JSON.parse(stored));
        if (data.familyMembers) setFamilyMembers((Array.isArray(data.familyMembers) ? data.familyMembers : []).map((m: any) => {
          if (m && m.birthDate && !m.birthYear) {
            const y = new Date(m.birthDate + 'T00:00:00').getFullYear();
            return { ...m, birthYear: isNaN(y) ? m.birthYear : y };
          }
          return m;
        }));
        if (data.daughterName) setDaughterName(data.daughterName);
        if (Array.isArray(data.memories)) setMemories(data.memories);
        if (Array.isArray(data.galleryPhotos)) setGalleryPhotos(data.galleryPhotos);
        if (Array.isArray(data.calendarEvents)) setCalendarEvents(data.calendarEvents);
        if (data.lifeFlower) setLifeFlower(data.lifeFlower);
        if (data.dailyPlan) setDailyPlan(normalizeDailyPlan(data.dailyPlan));
        if (data.xpState) setXpState(data.xpState);
        if (Array.isArray(data.coloringPages)) setColoringPages(data.coloringPages);
        if (data.settings) {
          const mapPreset = (x: any) => ({ spring: 'joy', summer: 'joy', autumn: 'anxiety', winter: 'sadness' } as any)[x] || x || 'joy';
          const mergedSettings = { ...DEFAULT_SETTINGS, ...data.settings, themePreset: mapPreset(data.settings?.themePreset), sync: { ...(DEFAULT_SETTINGS.sync || {}), ...(data.settings.sync || {}) } };
          setSettings(mergedSettings);
          setIsDark((mergedSettings.theme || DEFAULT_SETTINGS.theme) === 'auto' ? Appearance.getColorScheme() === 'dark' : mergedSettings.theme === 'dark');
          if (mergedSettings.activeMemberId) setActiveMemberId(mergedSettings.activeMemberId);
        }
        if (Array.isArray(data.nightWonders)) setNightWonders(data.nightWonders);
        if (data.wellnessProfiles) setWellnessProfiles({ ...DEFAULT_WELLNESS_PROFILES, ...data.wellnessProfiles });
        if (Array.isArray(data.therapyExercises)) setTherapyExercises(data.therapyExercises);
        if (Array.isArray(data.emotionEntries)) setEmotionEntries(data.emotionEntries);
        if (Array.isArray(data.wellnessCheckIns)) setWellnessCheckIns(data.wellnessCheckIns);
        if (Array.isArray(data.timeCapsules)) setTimeCapsules(data.timeCapsules);
        if (Array.isArray(data.dreamWorlds)) setDreamWorlds(data.dreamWorlds);
        if (data.accessibilitySettings) setAccessibilitySettings({ ...DEFAULT_ACCESSIBILITY, ...data.accessibilitySettings });
        if (Array.isArray(data.therapySessions)) setTherapySessions(data.therapySessions);
        if (data.supportiveAvatar) {
          const m: any = { unicorn: 'joy', dragon: 'anxiety', robot: 'sadness', light: 'dream' };
          const id = m[data.supportiveAvatar.id] || data.supportiveAvatar.id;
          setSupportiveAvatar((SUPPORTIVE_AVATARS as any).find((a: any) => a.id === id) || (SUPPORTIVE_AVATARS as any)[0] || data.supportiveAvatar);
        }
        if (data.progressMaps || data.progressMap) {
          const pm = data.progressMaps || data.progressMap;
          setProgressMaps({
            baba: { ...DEFAULT_PROGRESS_MAP.baba, ...(pm?.baba || (!pm?.baba && pm?.memberId === 'baba' ? pm : {}) || {}) },
            maman: { ...DEFAULT_PROGRESS_MAP.maman, ...(pm?.maman || (!pm?.maman && pm?.memberId === 'maman' ? pm : {}) || {}) },
            daughter: { ...DEFAULT_PROGRESS_MAP.daughter, ...(pm?.daughter || (!pm?.daughter && (!pm?.memberId || pm?.memberId === 'daughter') ? pm : {}) || {}) },
          });
        }
        if (Array.isArray(data.notifications)) setNotifications(data.notifications);
        if (Array.isArray(data.healthActivities)) setHealthActivities(data.healthActivities);
        if (Array.isArray(data.healthPlans)) setHealthPlans(data.healthPlans);
        if (data.dailySteps) setDailyStepsState(normalizeDailyStepsForToday({ baba: { date: todayStr, steps: 0, goal: 8000 }, maman: { date: todayStr, steps: 0, goal: 7000 }, daughter: { date: todayStr, steps: 0, goal: 6000 }, ...data.dailySteps }));
        if (Array.isArray(data.dreamTherapyEnvironments)) setDreamTherapyEnvironments(data.dreamTherapyEnvironments);
        if (Array.isArray(data.dreamTherapySessions)) setDreamTherapySessions(data.dreamTherapySessions);
        if (data.backupConfig) setBackupConfig(mergeBackupConfig(data.backupConfig));
        if (Array.isArray(data.backupRecords)) setBackupRecords(data.backupRecords);
        if (data.counselorConfig) setCounselorConfig({ ...DEFAULT_COUNSELOR_CONFIG, ...(data.counselorConfig || {}), features: { ...(DEFAULT_COUNSELOR_CONFIG as any).features, ...(data.counselorConfig?.features || {}) } } as any);
        if (Array.isArray(data.counselorSessions)) setCounselorSessions(data.counselorSessions);
        if (data.appUpdateState) {
          setAppUpdateState({ ...DEFAULT_APP_UPDATE_STATE, ...data.appUpdateState, history: Array.isArray(data.appUpdateState.history) ? data.appUpdateState.history : [], sectionBaseline: data.appUpdateState.sectionBaseline || {} });
        } else {
          setAppUpdateState(prev => ({
            ...prev,
            sectionBaseline: buildAppSectionBaseline(data),
          }));
        }
      } else {
        setAppUpdateState(prev => ({
          ...prev,
          sectionBaseline: prev.sectionBaseline && Object.keys(prev.sectionBaseline).length ? prev.sectionBaseline : buildAppSectionBaseline(getPersistedData()),
        }));
      }
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setHydrated(true);
    }
  };

  // Save data
  const getPersistedData = () => ({
    familyMembers,
    daughterName,
    memories,
    galleryPhotos,
    calendarEvents,
    lifeFlower,
    dailyPlan,
    xpState,
    coloringPages,
    settings,
    nightWonders,
    wellnessProfiles,
    therapyExercises,
    emotionEntries,
    wellnessCheckIns,
    timeCapsules,
    dreamWorlds,
    accessibilitySettings,
    therapySessions,
    supportiveAvatar,
    progressMaps,
    notifications,
    healthActivities,
    healthPlans,
    dailySteps,
    dreamTherapyEnvironments,
    dreamTherapySessions,
    backupConfig,
    backupRecords,
    counselorConfig,
    counselorSessions,
    appUpdateState,
  });

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(getPersistedData()));
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const exportAppData = async () => JSON.stringify(getPersistedData(), null, 2);

  const importAppData = async (json: string) => {
    try {
      const data = migrateMemberIds(JSON.parse(json));
      if (Array.isArray(data.familyMembers)) setFamilyMembers(data.familyMembers);
      if (typeof data.daughterName === 'string' && data.daughterName) setDaughterName(data.daughterName);
      if (data.activeMemberId) setActiveMemberId(data.activeMemberId);
      if (Array.isArray(data.memories)) setMemories(data.memories);
      if (Array.isArray(data.galleryPhotos)) setGalleryPhotos(data.galleryPhotos);
      if (Array.isArray(data.calendarEvents)) setCalendarEvents(data.calendarEvents);
      if (data.lifeFlower) setLifeFlower(data.lifeFlower);
      if (data.dailyPlan) setDailyPlan(normalizeDailyPlan(data.dailyPlan));
      if (data.xpState) setXpState(data.xpState);
      if (Array.isArray(data.coloringPages)) setColoringPages(data.coloringPages);
      if (data.settings) {
        const mapPreset = (x: any) => ({ spring: 'joy', summer: 'joy', autumn: 'anxiety', winter: 'sadness' } as any)[x] || x || 'joy';
        const mergedSettings = { ...DEFAULT_SETTINGS, ...data.settings, themePreset: mapPreset(data.settings?.themePreset), sync: { ...(DEFAULT_SETTINGS.sync || {}), ...(data.settings.sync || {}) } };
        setSettings(mergedSettings);
        if (mergedSettings.activeMemberId) setActiveMemberId(mergedSettings.activeMemberId);
        if (data.activeMemberId) setActiveMemberId(data.activeMemberId);
        setIsDark((mergedSettings.theme || DEFAULT_SETTINGS.theme) === 'auto' ? Appearance.getColorScheme() === 'dark' : mergedSettings.theme === 'dark');
      }
      if (Array.isArray(data.nightWonders)) setNightWonders(data.nightWonders);
      if (data.wellnessProfiles) setWellnessProfiles({ ...DEFAULT_WELLNESS_PROFILES, ...data.wellnessProfiles });
      if (Array.isArray(data.therapyExercises)) setTherapyExercises(data.therapyExercises);
      if (Array.isArray(data.emotionEntries)) setEmotionEntries(data.emotionEntries);
      if (Array.isArray(data.wellnessCheckIns)) setWellnessCheckIns(data.wellnessCheckIns);
      if (Array.isArray(data.timeCapsules)) setTimeCapsules(data.timeCapsules);
      if (Array.isArray(data.dreamWorlds)) setDreamWorlds(data.dreamWorlds);
      if (data.accessibilitySettings) setAccessibilitySettings({ ...DEFAULT_ACCESSIBILITY, ...data.accessibilitySettings });
      if (Array.isArray(data.therapySessions)) setTherapySessions(data.therapySessions);
      if (data.supportiveAvatar) {
        const m: any = { unicorn: 'joy', dragon: 'anxiety', robot: 'sadness', light: 'dream' };
        const id = m[data.supportiveAvatar.id] || data.supportiveAvatar.id;
        setSupportiveAvatar((SUPPORTIVE_AVATARS as any).find((a: any) => a.id === id) || (SUPPORTIVE_AVATARS as any)[0] || data.supportiveAvatar);
      }
      if (data.progressMaps || data.progressMap) {
        const pm = data.progressMaps || data.progressMap;
        setProgressMaps({
          baba: { ...DEFAULT_PROGRESS_MAP.baba, ...(pm?.baba || (!pm?.baba && pm?.memberId === 'baba' ? pm : {}) || {}) },
          maman: { ...DEFAULT_PROGRESS_MAP.maman, ...(pm?.maman || (!pm?.maman && pm?.memberId === 'maman' ? pm : {}) || {}) },
          daughter: { ...DEFAULT_PROGRESS_MAP.daughter, ...(pm?.daughter || (!pm?.daughter && (!pm?.memberId || pm?.memberId === 'daughter') ? pm : {}) || {}) },
        });
      }
      if (Array.isArray(data.notifications)) setNotifications(data.notifications);
      if (Array.isArray(data.healthActivities)) setHealthActivities(data.healthActivities);
      if (Array.isArray(data.healthPlans)) setHealthPlans(data.healthPlans);
      if (data.dailySteps) setDailyStepsState(normalizeDailyStepsForToday({ baba: { date: todayStr, steps: 0, goal: 8000 }, maman: { date: todayStr, steps: 0, goal: 7000 }, daughter: { date: todayStr, steps: 0, goal: 6000 }, ...data.dailySteps }));
      if (Array.isArray(data.dreamTherapyEnvironments)) setDreamTherapyEnvironments(data.dreamTherapyEnvironments);
      if (Array.isArray(data.dreamTherapySessions)) setDreamTherapySessions(data.dreamTherapySessions);
      if (data.backupConfig) setBackupConfig(mergeBackupConfig(data.backupConfig));
      if (Array.isArray(data.backupRecords)) setBackupRecords(data.backupRecords);
      if (data.counselorConfig) setCounselorConfig({ ...DEFAULT_COUNSELOR_CONFIG, ...(data.counselorConfig || {}), features: { ...(DEFAULT_COUNSELOR_CONFIG as any).features, ...(data.counselorConfig?.features || {}) } } as any);
      if (Array.isArray(data.counselorSessions)) setCounselorSessions(data.counselorSessions);
      if (data.appUpdateState) setAppUpdateState({ ...DEFAULT_APP_UPDATE_STATE, ...data.appUpdateState, history: Array.isArray(data.appUpdateState.history) ? data.appUpdateState.history : [], sectionBaseline: data.appUpdateState.sectionBaseline || {} });
    } catch (error) {
      console.error('Import error:', error);
      throw error;
    }
  };

  const buildAppSectionBaseline = (data: any): Record<string, string> => {
    const sections: Record<string, any> = {
      memories: data.memories || [],
      galleryPhotos: data.galleryPhotos || [],
      calendarEvents: data.calendarEvents || [],
      dailyPlan: data.dailyPlan || {},
      xpState: data.xpState || {},
      coloringPages: data.coloringPages || [],
      settings: data.settings || {},
      wellnessProfiles: data.wellnessProfiles || {},
      therapyExercises: data.therapyExercises || [],
      emotionEntries: data.emotionEntries || [],
      wellnessCheckIns: data.wellnessCheckIns || [],
      healthActivities: data.healthActivities || [],
      healthPlans: data.healthPlans || [],
      dailySteps: data.dailySteps || {},
      timeCapsules: data.timeCapsules || [],
      dreamWorlds: data.dreamWorlds || [],
      notifications: data.notifications || [],
      progressMaps: data.progressMaps || {},
      familyMembers: data.familyMembers || [],
      dreamTherapyEnvironments: data.dreamTherapyEnvironments || [],
      dreamTherapySessions: data.dreamTherapySessions || [],
      backupConfig: data.backupConfig || {},
      backupRecords: data.backupRecords || [],
      counselorConfig: data.counselorConfig || {},
      counselorSessions: data.counselorSessions || [],
    };
    const out: Record<string, string> = {};
    Object.keys(sections).forEach((k) => {
      try {
        const s = JSON.stringify(sections[k]);
        let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
        const size = Array.isArray(sections[k]) ? sections[k].length : (sections[k] && typeof sections[k] === 'object' ? Object.keys(sections[k]).length : 1);
        out[k] = `${size}:${h}`;
      } catch { out[k] = '0:0'; }
    });
    return out;
  };

  const appSectionLabels: Record<string, string> = {
    memories: 'خاطرات',
    galleryPhotos: 'گالری',
    calendarEvents: 'تقویم/رویدادها',
    dailyPlan: 'برنامه روزانه',
    xpState: 'پیشرفت و XP',
    coloringPages: 'کتاب رنگ‌آمیزی',
    settings: 'تنظیمات',
    wellnessProfiles: 'پروفایل تندرستی',
    therapyExercises: 'تمرین‌ها',
    emotionEntries: 'احساسات',
    wellnessCheckIns: 'چک‌این تندرستی',
    healthActivities: 'فعالیت‌های سلامت',
    healthPlans: 'برنامه سلامت',
    dailySteps: 'قدم‌ها و فعالیت روزانه',
    timeCapsules: 'کپسول زمان',
    dreamWorlds: 'دنیای رویا',
    notifications: 'اعلان‌ها',
    progressMaps: 'نقشه پیشرفت',
    familyMembers: 'اعضای خانواده',
    dreamTherapyEnvironments: 'محیط‌های درمان رویا',
    dreamTherapySessions: 'جلسات درمان رویا',
    backupConfig: 'تنظیمات پشتیبان‌گیری',
    backupRecords: 'سوابق پشتیبان‌گیری',
    counselorConfig: 'تنظیمات مشاوره',
    counselorSessions: 'جلسات مشاوره',
  };

  const checkForAppUpdates = async () => {
    const checkedAt = new Date().toISOString();
    let internetConnected = false;
    try {
      if (typeof navigator !== 'undefined' && navigator && 'onLine' in navigator) {
        internetConnected = !!(navigator as any).onLine;
      }
    } catch {}
    try {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const t = setTimeout(() => { try { controller?.abort(); } catch {} }, 4000);
      await fetch('https://clients3.google.com/generate_204', { method: 'GET', mode: 'no-cors', signal: controller?.signal as any });
      clearTimeout(t);
      internetConnected = true;
    } catch {}

    const currentData = getPersistedData();
    const prevBaseline = (appUpdateState.sectionBaseline && Object.keys(appUpdateState.sectionBaseline).length) ? appUpdateState.sectionBaseline : buildAppSectionBaseline(currentData);
    const currentSig = buildAppSectionBaseline(currentData);
    const sections: any[] = [];
    Object.keys(currentSig).forEach((k) => {
      if (prevBaseline[k] !== currentSig[k]) {
        sections.push({ section: k, label: appSectionLabels[k] || k, detail: `تغییر شناسایی شد` });
      }
    });
    const updated = sections.length > 0;
    const record: import('../types').AppUpdateRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      checkedAt,
      internetConnected,
      updated,
      sections,
      note: internetConnected ? (updated ? 'اتصال برقرار بود و تغییرات بخش‌ها ثبت شد.' : 'اتصال برقرار بود؛ تغییری نسبت به مبنای قبلی یافت نشد.') : 'اتصال اینترنت شناسایی نشد؛ بررسی محلی انجام شد.',
    };
    setAppUpdateState(prev => {
      const history = [record, ...(prev.history || [])].slice(0, 30);
      return {
        ...prev,
        lastCheckedAt: checkedAt,
        lastConnectedAt: internetConnected ? checkedAt : prev.lastConnectedAt,
        lastUpdatedAt: updated ? checkedAt : prev.lastUpdatedAt,
        history,
        preUpdateSnapshot: updated ? (prev.preUpdateSnapshot || currentData) : prev.preUpdateSnapshot,
        sectionBaseline: currentSig,
      };
    });
  };

  const rollbackAppUpdate = async () => {
    const snap = appUpdateState.preUpdateSnapshot;
    if (!snap) return;
    await importAppData(JSON.stringify(snap));
    setAppUpdateState(prev => ({
      ...prev,
      history: [
        {
          id: `${Date.now()}-rollback`,
          checkedAt: new Date().toISOString(),
          internetConnected: typeof navigator !== 'undefined' ? !!(navigator as any).onLine : false,
          updated: false,
          sections: [{ section: 'rollback', label: 'بازگشت', detail: 'بازگشت به وضعیت قبل از بروزرسانی' }],
          note: 'برنامه به وضعیت قبل از بروزرسانی بازگردانده شد.',
        },
        ...(prev.history || []),
      ].slice(0, 30),
      preUpdateSnapshot: undefined,
      sectionBaseline: buildAppSectionBaseline(snap),
    }));
  };

  const clearAppUpdateHistory = async () => {
    setAppUpdateState(prev => ({
      ...DEFAULT_APP_UPDATE_STATE,
      lastCheckedAt: prev.lastCheckedAt,
      lastConnectedAt: prev.lastConnectedAt,
      sectionBaseline: buildAppSectionBaseline(getPersistedData()),
      history: [],
      preUpdateSnapshot: undefined,
    }));
  };


  const exportSyncPackage = async () => {
    const data = getPersistedData();
    const payload = {
      kind: 'my-life-sync',
      version: 2,
      appVersion: '1.0.0',
      createdAt: new Date().toISOString(),
      device: settings.sync?.deviceName || 'FamilyDevice',
      memberId: activeMemberId,
      summary: {
        memories: (data.memories || []).length,
        galleryPhotos: (data.galleryPhotos || []).length,
        calendarEvents: (data.calendarEvents || []).length,
        coloringPages: (data.coloringPages || []).length,
        notifications: (data.notifications || []).length,
        familyMembers: (data.familyMembers || []).length,
        timeCapsules: (data.timeCapsules || []).length,
        dreamWorlds: (data.dreamWorlds || []).length,
        healthActivities: (data.healthActivities || []).length,
        healthPlans: (data.healthPlans || []).length,
        counselorSessions: (data.counselorSessions || []).length,
        xpLevel: data.xpState?.level ?? 1,
        xpTotal: data.xpState?.totalXP ?? 0,
        petals: data.lifeFlower?.petals ?? 0,
        sections: Object.keys(data).length,
        dailySteps: (() => {
          const list = Object.entries(data.dailySteps || {}).map(([id, s]: [string, any]) => {
            const steps = s?.steps ?? 0;
            const goal = s?.goal ?? 0;
            return { memberId: id, date: s?.date || '', steps, goal, done: steps >= goal && goal > 0 };
          }).filter((s: any) => s.date);
          return list;
        })(),
        dailyStepsGoalsMet: Object.values(data.dailySteps || {}).filter((s: any) => (s?.steps ?? 0) >= (s?.goal ?? 0) && (s?.goal ?? 0) > 0).length,
        dailyStepsFamilyTotal: Object.values(data.dailySteps || {}).reduce((sum: number, s: any) => sum + (s?.steps ?? 0), 0),
      },
      data,
    };
    return JSON.stringify(payload, null, 2);
  };

  const importSyncPackage = async (json: string) => {
    let parsed: any;
    try {
      parsed = migrateMemberIds(JSON.parse(json));
    } catch {
      throw new Error('فایل JSON نامعتبر است');
    }
    let data: any = parsed;
    if (parsed && typeof parsed === 'object' && parsed.kind === 'my-life-sync') {
      if (!parsed.data || typeof parsed.data !== 'object') throw new Error('بسته همگام‌سازی معتبر نیست');
      data = parsed.data;
    }
    await importAppData(JSON.stringify(data));
    const now = new Date().toISOString();
    const sourceDevice = parsed?.kind === 'my-life-sync' ? (parsed?.device || '') : '';
    setSettings(prev => ({
      ...prev,
      sync: {
        ...(prev.sync || {}),
        lastSyncAt: now,
        ...(sourceDevice ? { lastSyncFrom: sourceDevice } : {}),
      } as any,
    }));
  };

  const resetAllData = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setFamilyMembers(DEFAULT_FAMILY_MEMBERS);
    setActiveMemberId('maman');
    setDaughterName('دختر');
    setMemories([]);
    setGalleryPhotos([]);
    setCalendarEvents([]);
    setLifeFlower(DEFAULT_LIFE_FLOWER);
    setDailyPlan({ ...DEFAULT_DAILY_PLAN, date: new Date().toISOString().split('T')[0] });
    setXpState(DEFAULT_XP_STATE);
    setColoringPages([]);
    setSettings(DEFAULT_SETTINGS);
    setNightWonders([]);
    setIsDark(false);
    setWellnessProfiles(DEFAULT_WELLNESS_PROFILES);
    setTherapyExercises(DEFAULT_THERAPY_EXERCISES);
    setEmotionEntries([]);
    setWellnessCheckIns([]);
    setTimeCapsules([]);
    setDreamWorlds([]);
    setAccessibilitySettings(DEFAULT_ACCESSIBILITY);
    setTherapySessions([]);
    setSupportiveAvatar(DEFAULT_SUPPORTIVE_AVATAR);
    setProgressMaps(DEFAULT_PROGRESS_MAP);
    setNotifications([]);
    setHealthActivities([]);
    setHealthPlans([]);
    setDailyStepsState({ baba: { date: new Date().toISOString().split('T')[0], steps: 0, goal: 8000 }, maman: { date: new Date().toISOString().split('T')[0], steps: 0, goal: 7000 }, daughter: { date: new Date().toISOString().split('T')[0], steps: 0, goal: 6000 } });
    setDreamTherapyEnvironments(DEFAULT_DREAM_THERAPY_ENVIRONMENTS);
    setDreamTherapySessions([]);
    setBackupConfig(DEFAULT_BACKUP_CONFIG);
    setBackupRecords([]);
    setCounselorConfig(DEFAULT_COUNSELOR_CONFIG);
    setCounselorSessions([]);
    setAppUpdateState(DEFAULT_APP_UPDATE_STATE);
  };

  // Auto-save on changes
  useEffect(() => { if (hydrated) saveData(); }, [memories, galleryPhotos, calendarEvents, lifeFlower, dailyPlan, xpState, coloringPages, settings, nightWonders, familyMembers, daughterName, hydrated, wellnessProfiles, therapyExercises, emotionEntries, wellnessCheckIns, timeCapsules, dreamWorlds, accessibilitySettings, therapySessions, supportiveAvatar, progressMaps, notifications, healthActivities, healthPlans, dailySteps, dreamTherapyEnvironments, dreamTherapySessions, backupConfig, backupRecords, counselorConfig, counselorSessions, appUpdateState]);

  // Track local data changes for sync/update status
  useEffect(() => {
    if (!hydrated) return;
    const currentData = getPersistedData();
    const currentSig = buildAppSectionBaseline(currentData);
    setAppUpdateState(prev => {
      const prevBaseline = (prev.sectionBaseline && Object.keys(prev.sectionBaseline).length) ? prev.sectionBaseline : currentSig;
      const prevStr = JSON.stringify(prevBaseline);
      const currStr = JSON.stringify(currentSig);
      if (prevStr === currStr) {
        if (Object.keys(prev.sectionBaseline || {}).length === 0) return { ...prev, sectionBaseline: currentSig };
        return prev;
      }
      return {
        ...prev,
        lastUpdatedAt: new Date().toISOString(),
        sectionBaseline: currentSig,
      };
    });
  }, [hydrated, memories, galleryPhotos, calendarEvents, lifeFlower, dailyPlan, xpState, coloringPages, settings, nightWonders, familyMembers, daughterName, wellnessProfiles, therapyExercises, emotionEntries, wellnessCheckIns, timeCapsules, dreamWorlds, accessibilitySettings, therapySessions, supportiveAvatar, progressMaps, notifications, healthActivities, healthPlans, dailySteps, dreamTherapyEnvironments, dreamTherapySessions, backupConfig, backupRecords, counselorConfig, counselorSessions]);

  // Load on mount
  useEffect(() => { loadData(); }, []);

  // Normalize daily steps for a new day (keep goals, reset counts)
  useEffect(() => {
    if (!hydrated) return;
    const normalize = () => {
      setDailyStepsState(prev => {
        const normalized = normalizeDailyStepsForToday(prev);
        return JSON.stringify(normalized) === JSON.stringify(prev) ? prev : normalized;
      });
    };
    normalize();
    const id = setInterval(normalize, 60 * 1000);
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('focus', normalize);
      return () => {
        clearInterval(id);
        window.removeEventListener('focus', normalize);
      };
    }
    return () => clearInterval(id);
  }, [hydrated]);

  const checkForAppUpdatesRef = useRef(checkForAppUpdates);
  useEffect(() => { checkForAppUpdatesRef.current = checkForAppUpdates; });
  const lastAutoSyncCheckRef = useRef(0);

  // Auto-check/sync preparation on reconnect (web online/visible event) when enabled
  useEffect(() => {
    if (!hydrated) return;
    if (!settings.sync?.autoSyncOnReconnect || !settings.sync?.internetSyncEnabled) return;
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.addEventListener) return;
    const onOnline = () => {
      const now = Date.now();
      if (now - lastAutoSyncCheckRef.current < 30000) return;
      lastAutoSyncCheckRef.current = now;
      void checkForAppUpdatesRef.current();
    };
    const onVisible = () => {
      try {
        if (typeof document !== 'undefined' && document.visibilityState === 'visible') onOnline();
      } catch {}
    };
    window.addEventListener('online', onOnline);
    if (typeof document !== 'undefined' && document.addEventListener) document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('online', onOnline);
      if (typeof document !== 'undefined' && document.removeEventListener) document.removeEventListener('visibilitychange', onVisible);
    };
  }, [hydrated, settings.sync?.autoSyncOnReconnect, settings.sync?.internetSyncEnabled]);

  // One-time sync/check when ready or when auto-sync settings become enabled (and online)
  useEffect(() => {
    if (!hydrated) return;
    if (!settings.sync?.autoSyncOnReconnect || !settings.sync?.internetSyncEnabled) return;
    const online = Platform.OS === 'web' ? (typeof navigator !== 'undefined' ? navigator.onLine : true) : true;
    if (!online) return;
    const now = Date.now();
    if (now - lastAutoSyncCheckRef.current < 30000) return;
    lastAutoSyncCheckRef.current = now;
    void checkForAppUpdatesRef.current();
  }, [hydrated, settings.sync?.autoSyncOnReconnect, settings.sync?.internetSyncEnabled]);

  // Helpers
  const addMemory = (memory: Omit<Memory, 'id'>) => {
    const newMemory = { ...memory, id: Date.now().toString() };
    setMemories(prev => [newMemory, ...prev]);
    addXP(10);
  };

  const updateMemory = (id: string, updates: Partial<Memory>) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const addGalleryPhoto = (photo: Omit<GalleryPhoto, 'id'>) => {
    const newPhoto = { ...photo, id: Date.now().toString() };
    setGalleryPhotos(prev => [newPhoto, ...prev]);
    addXP(5);
  };

  const updateGalleryPhoto = (id: string, updates: Partial<GalleryPhoto>) => {
    setGalleryPhotos(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteGalleryPhoto = (id: string) => {
    setGalleryPhotos(prev => prev.filter(p => p.id !== id));
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = { ...event, id: Date.now().toString() };
    setCalendarEvents(prev => [...prev, newEvent]);
    addXP(15);
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
  };

  const bloomPetal = (message: string) => {
    let didBloom = false;
    setLifeFlower(prev => {
      if (prev.petals >= prev.maxPetals) return prev;
      didBloom = true;
      return {
        petals: prev.petals + 1,
        maxPetals: prev.maxPetals,
        lastBloom: new Date().toISOString(),
        messages: [...prev.messages, message],
      };
    });
    if (didBloom) addXP(25);
    return didBloom;
  };

  const completeTask = (taskId: string) => {
    const task = dailyPlan.tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;
    addXP(task.xp);
    setDailyPlan(prev => {
      const current = prev.tasks.find(t => t.id === taskId);
      if (!current || current.completed) return prev;
      const newTasks = prev.tasks.map(t => t.id === taskId ? { ...t, completed: true } : t);
      return { ...prev, tasks: newTasks, xpEarned: prev.xpEarned + (current.xp || 0) };
    });
  };

  const addDailyTask = (task: Omit<PlanTask, 'id' | 'completed'>) => {
    const newTask: PlanTask = { ...task, id: Date.now().toString(), completed: false };
    const today = new Date().toISOString().split('T')[0];
    setDailyPlan(prev => {
      const base = prev.date === today ? prev : { date: today, tasks: [], xpEarned: 0, streak: prev.streak };
      return { ...base, tasks: [...base.tasks, newTask] };
    });
  };

  const updateDailyTask = (id: string, updates: Partial<PlanTask>) => {
    setDailyPlan(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t) }));
  };

  const deleteDailyTask = (id: string) => {
    setDailyPlan(prev => {
      const task = prev.tasks.find(t => t.id === id);
      const xpEarned = task?.completed ? Math.max(0, prev.xpEarned - (task.xp || 0)) : prev.xpEarned;
      return { ...prev, tasks: prev.tasks.filter(t => t.id !== id), xpEarned };
    });
  };

  const addXP = (amount: number) => {
    setXpState(prev => {
      const newTotal = prev.totalXP + amount;
      const newLevel = Math.floor(newTotal / 100) + 1;
      const today = new Date().toISOString().split('T')[0];
      let newStreak = prev.currentStreak;
      let newLongest = prev.longestStreak;
      
      if (prev.lastActiveDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (prev.lastActiveDate === yesterday) {
          newStreak = prev.currentStreak + 1;
        } else if (prev.lastActiveDate) {
          newStreak = 1;
        }
        newLongest = Math.max(newLongest, newStreak);
      }
      
      return {
        ...prev,
        totalXP: newTotal,
        level: newLevel,
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActiveDate: today,
        dailyXP: prev.dailyXP + amount,
        weeklyXP: prev.weeklyXP + amount,
      };
    });
  };

  const resetDailyPlan = () => {
    const today = new Date().toISOString().split('T')[0];
    setDailyPlan({
      date: today,
      tasks: [],
      xpEarned: 0,
      streak: xpState.currentStreak,
    });
  };

  const addColoringPage = (page: Omit<ColoringPage, 'id'>) => {
    const newPage = { ...page, id: Date.now().toString() };
    setColoringPages(prev => [newPage, ...prev]);
    addXP(20);
  };

  const updateColoringPage = (id: string, updates: Partial<ColoringPage>) => {
    setColoringPages(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteColoringPage = (id: string) => {
    setColoringPages(prev => prev.filter(p => p.id !== id));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.theme) {
        setIsDark(newSettings.theme === 'auto' ? Appearance.getColorScheme() === 'dark' : newSettings.theme === 'dark');
      }
      return updated;
    });
  };

  const unlockNightWonder = (id: string) => {
    setNightWonders(prev => prev.map(w => w.id === id ? { ...w, unlocked: true } : w));
  };

  const getTodaysWonder = () => {
    const today = new Date().toISOString().split('T')[0];
    const existing = nightWonders.find(w => w.date === today);
    if (existing) return existing;
    if (!NIGHT_WONDERS.length) return null;
    const dayIndex = Math.floor(Date.now() / 86400000);
    const base = NIGHT_WONDERS[dayIndex % NIGHT_WONDERS.length] as any;
    return { ...base, date: today, unlocked: base.unlocked ?? true } as NightWonder;
  };

  const toggleTheme = () => {
    const next: 'light' | 'dark' = (settings.theme === 'dark' || (settings.theme === 'auto' && isDark)) ? 'light' : 'dark';
    updateSettings({ theme: next });
  };

  // Wellness & Rehabilitation
  const updateWellnessProfile = (memberId: FamilyMember['id'], profile: Partial<WellnessProfile>) => {
    setWellnessProfiles(prev => ({
      ...prev,
      [memberId]: { ...prev[memberId], ...profile }
    }));
  };

  const getRecommendedExercises = (memberId: FamilyMember['id']) => {
    const profile = wellnessProfiles[memberId];
    if (!profile || profile.conditions.length === 0) return therapyExercises.filter(e => e.difficulty === 'easy');
    
    const recommendedIds = new Set<string>();
    profile.conditions.forEach(condition => {
      const specialProfile = SPECIAL_NEEDS_PROFILES.find(p => p.id === condition);
      if (specialProfile) {
        specialProfile.recommendedExercises.forEach(id => recommendedIds.add(id));
      }
    });
    
    return therapyExercises.filter(e => recommendedIds.has(e.id) || e.difficulty === 'easy');
  };

  const completeTherapyExercise = (exerciseId: string, memberId: FamilyMember['id'], rating?: number) => {
    setTherapyExercises(prev => prev.map(ex => 
      ex.id === exerciseId ? { ...ex, completed: true, completedAt: new Date().toISOString(), rating } : ex
    ));
    addXP(15);
  };

  const addEmotionEntry = (entry: Omit<EmotionEntry, 'id'>) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setEmotionEntries(prev => [newEntry, ...prev]);
    addXP(10);
  };

  const addWellnessCheckIn = (checkIn: Omit<WellnessCheckIn, 'id'>) => {
    const newCheckIn = { ...checkIn, id: Date.now().toString() };
    setWellnessCheckIns(prev => [newCheckIn, ...prev]);
    addXP(20);
  };

  // Time Capsule
  const createTimeCapsule = (capsule: Omit<TimeCapsule, 'id' | 'createdAt'>) => {
    const newCapsule = { 
      ...capsule, 
      id: Date.now().toString(), 
      createdAt: new Date().toISOString() 
    };
    setTimeCapsules(prev => [newCapsule, ...prev]);
    addXP(50);
  };

  const updateTimeCapsule = (id: string, updates: Partial<TimeCapsule>) => {
    setTimeCapsules(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteTimeCapsule = (id: string) => {
    setTimeCapsules(prev => prev.filter(c => c.id !== id));
  };

  const addTimeCapsuleContent = (capsuleId: string, content: Omit<TimeCapsuleContent, 'id' | 'createdAt'>) => {
    const newContent = { ...content, id: Date.now().toString(), createdAt: new Date().toISOString() };
    setTimeCapsules(prev => prev.map(c => 
      c.id === capsuleId ? { ...c, content: [...c.content, newContent] } : c
    ));
    addXP(10);
  };

  const updateTimeCapsuleContent = (capsuleId: string, contentId: string, updates: Partial<TimeCapsuleContent>) => {
    setTimeCapsules(prev => prev.map(c =>
      c.id === capsuleId
        ? { ...c, content: c.content.map(item => item.id === contentId ? { ...item, ...updates } : item) }
        : c
    ));
  };

  const deleteTimeCapsuleContent = (capsuleId: string, contentId: string) => {
    setTimeCapsules(prev => prev.map(c =>
      c.id === capsuleId ? { ...c, content: c.content.filter(item => item.id !== contentId) } : c
    ));
  };

  const openTimeCapsule = (capsuleId: string) => {
    setTimeCapsules(prev => prev.map(c => 
      c.id === capsuleId ? { ...c, isLocked: false, openedAt: new Date().toISOString() } : c
    ));
    addXP(100);
  };

  // Dream World
  const createDreamWorld = (world: Omit<DreamWorld, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newWorld = { ...world, id: Date.now().toString(), createdAt: now, updatedAt: now };
    setDreamWorlds(prev => [newWorld, ...prev]);
  };

  const addDreamEntry = (worldId: string, entry: Omit<DreamEntry, 'id'>) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setDreamWorlds(prev => prev.map(w => 
      w.id === worldId ? { 
        ...w, 
        entries: [newEntry, ...w.entries], 
        updatedAt: new Date().toISOString() 
      } : w
    ));
    addXP(15);
  };

  const interpretDream = (entryId: string) => {
    // Find the entry and world
    let targetEntry: DreamEntry | null = null;
    let targetWorld: DreamWorld | null = null;
    
    for (const world of dreamWorlds) {
      const entry = world.entries.find(e => e.id === entryId);
      if (entry) {
        targetEntry = entry;
        targetWorld = world;
        break;
      }
    }
    
    if (!targetEntry || !targetWorld) return;
    
    // AI Interpretation logic (simplified)
    const interpretation = {
      id: Date.now().toString(),
      dreamId: entryId,
      aiGenerated: true,
      jungianAnalysis: 'تحلیل یونگی: این رویا می‌تواند نماد تحول درونی، رهایی از قیدها و حرکت به‌سوی رشد فردی باشد.',
      freudianAnalysis: 'تحلیل فرویدی: ممکن است بازتابی از آرزوها، نگرانی‌ها یا احساسات ناآگاهانه باشد.',
      modernPsychology: 'روان‌شناسی مدرن: نشان‌دهنده پردازش تجربه‌های روزانه، آمادگی برای چالش‌های جدید و نیاز به آرامش/رشد است.',
      familyContext: 'در بافت خانواده، این رویا می‌تواند بیانگر نیاز به حمایت، استقلال، یا گفت‌وگوی عاطفی با اعضای خانواده باشد.',
      suggestions: ['احساسات و نمادهای مهم رویا را یادداشت کنید', 'یک هدف کوچک و عملی برای فردا انتخاب کنید', 'در صورت تمایل، رویا را با یکی از اعضای خانواده به اشتراک بگذارید'],
      generatedAt: new Date().toISOString(),
    };
    
    setDreamWorlds(prev => prev.map(w => 
      w.id === targetWorld!.id ? {
        ...w,
        entries: w.entries.map(e => 
          e.id === entryId ? { ...e, interpretation } : e
        ),
        updatedAt: new Date().toISOString()
      } : w
    ));
    addXP(25);
  };

  const shareDream = (entryId: string, withMembers: FamilyMember['id'][]) => {
    setDreamWorlds(prev => prev.map(w => ({
      ...w,
      entries: w.entries.map(e => (e.id === entryId ? { ...e, isShared: true, sharedWith: withMembers } : e)),
    })));
  };

  // Accessibility
  const updateAccessibilitySettings = (newSettings: Partial<AccessibilitySettings>) => {
    setAccessibilitySettings(prev => ({ ...prev, ...newSettings }));
  };

  // Parenting Resources
  const saveParentingResource = (resourceId: string, memberId: FamilyMember['id']) => {
    // Resources are static, just track saved status
    addXP(5);
  };

  // Family Therapy
  const createTherapySession = (session: Omit<FamilyTherapySession, 'id'>) => {
    const newSession = { ...session, id: Date.now().toString() };
    setTherapySessions(prev => [newSession, ...prev]);
    addXP(30);
  };

  const completeTherapySession = (sessionId: string) => {
    setTherapySessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, completed: true } : s
    ));
    addXP(50);
  };

  const deleteTherapySession = (sessionId: string) => {
    setTherapySessions(prev => prev.filter(s => s.id !== sessionId));
  };

  // Supportive Avatar
  const getDailyAvatarMessage = (memberId: FamilyMember['id'], timeOfDay: 'morning' | 'evening' | 'stress') => {
    const profile = wellnessProfiles[memberId];
    if (profile?.conditions.length) {
      const condition = profile.conditions[0];
      const specialProfile = SPECIAL_NEEDS_PROFILES.find(p => p.id === condition);
      if (specialProfile?.avatarMessages) {
        return specialProfile.avatarMessages[timeOfDay] || supportiveAvatar.messages[timeOfDay];
      }
    }
    return supportiveAvatar.messages[timeOfDay];
  };

  // Progress Map
  const updateProgressMap = (memberId: FamilyMember['id'], updates: Partial<UserProgressMap>) => {
    setProgressMaps(prev => ({
      ...prev,
      [memberId]: { ...(prev[memberId] || createDefaultProgressMap(memberId)), ...updates, memberId, lastUpdated: new Date().toISOString() },
    }));
  };

  const addNotification = (n: Omit<FamilyNotification, 'id' | 'createdAt' | 'readBy'>) => {
    const notif: FamilyNotification = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      createdAt: new Date().toISOString(),
      readBy: [n.memberId],
      ...n,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationRead = (id: string, memberId: FamilyMember['id']) => {
    setNotifications(prev => prev.map(n => n.id === id && !n.readBy.includes(memberId) ? { ...n, readBy: [...n.readBy, memberId] } : n));
  };


  // Health & Fitness
  const addHealthActivity = (activity: Omit<HealthActivity, 'id'>) => {
    const newA: HealthActivity = { ...activity, id: Date.now().toString() };
    setHealthActivities(prev => [newA, ...prev]);
    if (activity.completed) {
      addXP(10);
      awardCoursePart(activity.memberId, 'تندرستی خانواده', activity.title);
    }
  };
  const updateHealthActivity = (id: string, updates: Partial<HealthActivity>) => {
    setHealthActivities(prev => prev.map(a => {
      if (a.id !== id) return a;
      const next = { ...a, ...updates };
      if (!a.completed && next.completed) { addXP(10); awardCoursePart(next.memberId, 'تندرستی خانواده', next.title); }
      return next;
    }));
  };
  const deleteHealthActivity = (id: string) => setHealthActivities(prev => prev.filter(a => a.id !== id));
  const addHealthPlan = (plan: Omit<HealthPlan, 'id'>) => setHealthPlans(prev => [{ ...plan, id: Date.now().toString() }, ...prev]);
  const updateHealthPlan = (id: string, updates: Partial<HealthPlan>) => setHealthPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const deleteHealthPlan = (id: string) => setHealthPlans(prev => prev.filter(p => p.id !== id));
  const setDailySteps = (memberId: FamilyMember['id'], steps: number, goal?: number) => {
    const d = new Date().toISOString().split('T')[0];
    const prevEntry = dailySteps[memberId];
    const prevRewarded = prevEntry?.date === d ? prevEntry.goalRewardedDate : undefined;
    const finalGoal = Math.max(1, Math.floor(goal ?? prevEntry?.goal ?? 6000));
    const finalSteps = Math.max(0, Math.floor(Number.isFinite(steps) ? steps : 0));
    const shouldReward = finalSteps >= finalGoal && prevRewarded !== d;
    setDailyStepsState(prev => ({
      ...prev,
      [memberId]: {
        date: d,
        steps: finalSteps,
        goal: finalGoal,
        goalRewardedDate: shouldReward ? d : (prev[memberId]?.date === d ? prev[memberId]?.goalRewardedDate : undefined),
      },
    }));
    if (shouldReward) {
      addXP(20);
      const memberName = familyMembers.find(m => m.id === memberId)?.name || (memberId === 'baba' ? 'بابا' : memberId === 'maman' ? 'مامان' : 'دختر');
      addNotification({
        memberId,
        type: 'achievement',
        title: '🎉 هدف گام روزانه تکمیل شد!',
        message: `${memberName} به هدف ${finalSteps.toLocaleString('fa-IR')} / ${finalGoal.toLocaleString('fa-IR')} گام رسید (+۲۰ XP).`,
      });
    }
  };

  const awardCoursePart = (memberId: FamilyMember['id'], courseTitle: string, partTitle: string) => {
    const today = new Date().toISOString().split('T')[0];
    const member = familyMembers.find(m => m.id === memberId);
    const memberName = member?.name || (memberId === 'baba' ? 'بابا' : memberId === 'maman' ? 'مامان' : 'دختر');
    const reward = '🏅 مدال پیشرفت';
    const xpReward = 50;
    addXP(xpReward);
    const event: CalendarEvent = {
      id: 'ach-' + Date.now().toString(),
      date: today,
      title: `دستاورد: ${partTitle}`,
      emoji: '🏆',
      description: `${memberName} بخش «${partTitle}» از دوره «${courseTitle}» را گذراند و جایزه ${reward} (+${xpReward} XP) دریافت کرد.`,
      photos: [],
      color: '#FFD93D',
      memberId,
      kind: 'achievement',
    };
    setCalendarEvents(prev => [event, ...prev]);
    addNotification({
      memberId,
      title: 'دستاورد جدید 🎉',
      message: `${memberName} بخش «${partTitle}» از دوره «${courseTitle}» را گذراند و ${reward} گرفت.`,
      type: 'achievement',
      relatedId: event.id,
    });
  };

  const completeProgressStation = (memberId: FamilyMember['id'], stationId: string) => {
    const station = PROGRESS_MAP_STATIONS.find(s => s.id === stationId);
    if (!station) return;
    let awarded = false;
    setProgressMaps(prev => {
      const pm = prev[memberId] || createDefaultProgressMap(memberId);
      if (pm.completedStations.includes(stationId)) return prev;
      awarded = true;
      const completedStations = [...pm.completedStations, stationId];
      const stationIndex = PROGRESS_MAP_STATIONS.findIndex(s => s.id === stationId);
      const nextStation = stationIndex < PROGRESS_MAP_STATIONS.length - 1 ? PROGRESS_MAP_STATIONS[stationIndex + 1].id : pm.currentStation;
      return {
        ...prev,
        [memberId]: {
          ...pm,
          memberId,
          currentStation: nextStation,
          completedStations,
          totalExercisesCompleted: (pm.totalExercisesCompleted || 0) + station.requiredExercises,
          badges: [...(pm.badges || []), station.reward],
          lastUpdated: new Date().toISOString(),
        },
      };
    });
    if (awarded) {
      awardCoursePart(memberId, 'نقشه مسیر رشد', station.name);
      addXP(50);
    }
  };

  // Dream Therapy
  const startDreamTherapySession = (memberId: FamilyMember['id'], environmentId: string, moodBefore: EmotionType = 'calm') => {
    const environment = dreamTherapyEnvironments.find(e => e.id === environmentId);
    if (!environment) return;
    
    const newSession: DreamTherapySession = {
      id: Date.now().toString(),
      memberId,
      environmentId,
      date: new Date().toISOString(),
      duration: 0,
      moodBefore,
      moodAfter: moodBefore,
      notes: '',
    };
    setDreamTherapySessions(prev => [newSession, ...prev]);
    
    setDreamTherapyEnvironments(prev => prev.map(env => 
      env.id === environmentId ? { ...env, timesUsed: env.timesUsed + 1 } : env
    ));
  };

  const completeDreamTherapySession = (sessionId: string, moodAfter: EmotionType, notes: string) => {
    setDreamTherapySessions(prev => prev.map(s => 
      s.id === sessionId ? { 
        ...s, 
        duration: Math.floor((Date.now() - new Date(s.date).getTime()) / 1000 / 60), // minutes
        moodAfter,
        notes,
      } : s
    ));
    addXP(30);
  };

  // Backup & Security
  const updateBackupConfig = (config: Partial<BackupConfig>) => {
    setBackupConfig(prev => ({ ...prev, ...config }));
  };

  const setBiometricLock = (enabled: boolean) => {
    setBackupConfig(prev => ({
      ...prev,
      security: { ...prev.security, biometricLock: enabled },
    }));
  };

  const createBackup = async (type: 'auto' | 'manual', options?: Partial<BackupRecord['includes']>): Promise<BackupRecord> => {
    const includes: string[] = options
      ? Object.keys(options).filter((key) => (options as any)[key] === true)
      : ['memories', 'calendar', 'wellness', 'timeCapsules', 'dreams', 'progress', 'settings', 'media', 'models3D'];
    let snapshot: any = null;
    try { snapshot = getPersistedData(); } catch { snapshot = null; }
    let size = 0;
    try { size = JSON.stringify(snapshot || {}).length; } catch { size = 0; }
    const record: BackupRecord = {
      id: Date.now().toString(),
      type,
      date: new Date().toISOString(),
      size,
      encrypted: !!(backupConfig.autoBackup.encrypt || backupConfig.manualBackup.encrypt),
      cloudProvider: type === 'auto' ? (backupConfig.autoBackup.cloudProviders?.[0] || null) : null,
      version: backupRecords.length + 1,
      includes,
      status: 'completed',
      snapshot,
    };
    setBackupRecords(prev => [record, ...prev]);
    return record;
  };

  const restoreBackup = async (backupId: string) => {
    const record = backupRecords.find(r => r.id === backupId);
    if (!record) throw new Error('backup-not-found');
    if (!record.snapshot) throw new Error('backup-no-snapshot');
    await importAppData(JSON.stringify(record.snapshot));
  };

  const enableTwoFactorAuth = (memberId: FamilyMember['id']) => {
    setBackupConfig(prev => ({
      ...prev,
      security: {
        ...prev.security,
        twoFactorAuth: true,
      },
    }));
    // In real implementation, would set up 2FA for the member
  };

  const disableTwoFactorAuth = (memberId: FamilyMember['id']) => {
    setBackupConfig(prev => ({
      ...prev,
      security: {
        ...prev.security,
        twoFactorAuth: false,
      },
    }));
  };

  const setPrivateMode = (memberId: FamilyMember['id'], dataType: 'childContent' | 'healthData' | 'dreamContent' | 'therapistNotes', enabled: boolean) => {
    setBackupConfig(prev => ({
      ...prev,
      security: {
        ...prev.security,
        privateMode: {
          ...prev.security.privateMode,
          [dataType]: enabled,
        },
      },
    }));
  };

  // Counselor Integration
  const updateCounselorConfig = (config: Partial<CounselorIntegrationConfig>) => {
    setCounselorConfig(prev => ({ ...prev, ...config }));
  };

  const bookCounselorSession = (session: Omit<CounselorSession, 'id'>) => {
    const newSession = { ...session, id: Date.now().toString() };
    setCounselorSessions(prev => [newSession, ...prev]);
    addXP(50);
  };

  const updateCounselorSession = (id: string, updates: Partial<CounselorSession>) => {
    setCounselorSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteCounselorSession = (id: string) => {
    setCounselorSessions(prev => prev.filter(s => s.id !== id));
  };

  const shareProgressWithCounselor = (memberId: FamilyMember['id'], counselorId: string) => {
    const provider = (counselorConfig.providers || []).find(p => p.id === counselorId);
    const member = familyMembers.find(m => m.id === memberId);
    const pm = progressMaps[memberId];
    const completed = pm?.completedStations?.length || 0;
    const total = PROGRESS_MAP_STATIONS.length || 0;
    const badges = pm?.badges?.length || 0;
    const exercises = pm?.totalExercisesCompleted || 0;
    const summary = `پیشرفت ${member?.name || memberId}: ${completed}/${total} ایستگاه، ${badges} مدال، ${exercises} تمرین.`;
    const msg = `${summary}${provider ? ` (مشاور: ${provider.name})` : ''}`;
    addNotification({
      memberId,
      title: 'اشتراک پیشرفت با مشاور',
      message: `${msg} — خروجی محلی برای اشتراک‌گذاری آماده شد.`,
      type: 'achievement',
      relatedId: `counselor-${counselorId}-${Date.now()}`,
    });
    addXP(25);
    return msg;
  };

  // Parenting Quick Guides
  const getQuickGuide = (trigger: string) => {
    return parentingQuickGuides.find(g => g.trigger.includes(trigger) || g.id === trigger);
  };

  // Update daughter name in family members
  useEffect(() => {
    setFamilyMembers(prev => prev.map(m => 
      m.id === 'daughter' ? { ...m, name: daughterName } : m
    ));
  }, [daughterName]);

  const updateFamilyMemberName = (id: FamilyMember['id'], name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setFamilyMembers(prev => prev.map(m => m.id === id ? { ...m, name: trimmed } : m));
    if (id === 'daughter') setDaughterName(trimmed);
  };

  const updateFamilyMemberAvatar = (id: FamilyMember['id'], updates: { avatarEmoji?: string; photoUri?: string | null }) => {
    setFamilyMembers(prev => prev.map(m => {
      if (m.id !== id) return m;
      const next = { ...m } as FamilyMember;
      if (updates.avatarEmoji !== undefined) {
        next.avatarEmoji = updates.avatarEmoji;
        next.photoUri = undefined;
      }
      if (updates.photoUri !== undefined) {
        next.photoUri = updates.photoUri || undefined;
        if (updates.photoUri) next.avatarEmoji = next.avatarEmoji || m.avatarEmoji;
      }
      return next;
    }));
  };

  const updateFamilyMemberBirthYear = (id: FamilyMember['id'], birthYear: number | undefined) => {
    setFamilyMembers(prev => prev.map(m => m.id === id ? { ...m, birthYear } : m));
  };

  const updateFamilyMemberBirthDate = (id: FamilyMember['id'], birthDate: string | undefined) => {
    setFamilyMembers(prev => prev.map(m => {
      if (m.id !== id) return m;
      const by = birthDate ? new Date(birthDate + 'T00:00:00').getFullYear() : undefined;
      return { ...m, birthDate, birthYear: by && !isNaN(by) ? by : (birthDate ? m.birthYear : undefined) };
    }));
  };

  const setActiveMemberIdAndPersist = (id: FamilyMember['id']) => {
    setActiveMemberId(id);
    setSettings(prev => ({ ...prev, activeMemberId: id }));
  };

  const rolePermissions = {
    baba: { canManageFamily: true, canEditShared: true, canViewChildPrivate: true, canSync: true },
    maman: { canManageFamily: true, canEditShared: true, canViewChildPrivate: true, canSync: true },
    daughter: { canManageFamily: false, canEditShared: true, canViewChildPrivate: false, canSync: true },
  } as const;

  const value: AppState = {
    familyMembers,
    activeMemberId,
    setActiveMemberId: setActiveMemberIdAndPersist,
    rolePermissions: rolePermissions[activeMemberId],
    daughterName,
    setDaughterName,
    updateFamilyMemberName,
    updateFamilyMemberAvatar,
    updateFamilyMemberBirthYear,
    updateFamilyMemberBirthDate,
    memories,
    addMemory,
    updateMemory,
    deleteMemory,

    // Gallery
    galleryPhotos,
    addGalleryPhoto,
    updateGalleryPhoto,
    deleteGalleryPhoto,

    calendarEvents,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    lifeFlower,
    bloomPetal,
    dailyPlan,
    xpState,
    completeTask,
    addDailyTask,
    updateDailyTask,
    deleteDailyTask,
    addXP,
    resetDailyPlan,
    coloringPages,
    addColoringPage,
    updateColoringPage,
    deleteColoringPage,
    settings,
    updateSettings,
    nightWonders,
    unlockNightWonder,
    getTodaysWonder,
    isDark,
    toggleTheme,
    // Wellness
    wellnessProfiles,
    updateWellnessProfile,
    therapyExercises,
    getRecommendedExercises,
    completeTherapyExercise,
    emotionEntries,
    addEmotionEntry,
    wellnessCheckIns,
    addWellnessCheckIn,
    // Time Capsule
    timeCapsules,
    createTimeCapsule,
    updateTimeCapsule,
    deleteTimeCapsule,
    addTimeCapsuleContent,
    updateTimeCapsuleContent,
    deleteTimeCapsuleContent,
    openTimeCapsule,
    // Dream World
    dreamWorlds,
    createDreamWorld,
    addDreamEntry,
    interpretDream,
    shareDream,
    // Accessibility
    accessibilitySettings,
    updateAccessibilitySettings,
    // Parenting Resources
    parentingResources,
    saveParentingResource,
    // Family Therapy
    therapySessions,
    createTherapySession,
    completeTherapySession,
    deleteTherapySession,
    // Supportive Avatar
    supportiveAvatar,
    setSupportiveAvatar,
    getDailyAvatarMessage,
    // Progress Map
    progressMaps,
    updateProgressMap,
    completeProgressStation,
    notifications,
    addNotification,
    markNotificationRead,
    awardCoursePart,
    // Health & Fitness
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
    // Dream Therapy
    dreamTherapyEnvironments,
    dreamTherapySessions,
    startDreamTherapySession,
    completeDreamTherapySession,
    // Backup & Security
    backupConfig,
    backupRecords,
    updateBackupConfig,
    setBiometricLock,
    createBackup,
    restoreBackup,
    enableTwoFactorAuth,
    disableTwoFactorAuth,
    setPrivateMode,
    // Counselor Integration
    counselorConfig,
    counselorSessions,
    updateCounselorConfig,
    bookCounselorSession,
    updateCounselorSession,
    deleteCounselorSession,
    shareProgressWithCounselor,
    // Parenting Quick Guides
    parentingQuickGuides,
    getQuickGuide,
    // App Updates
    appUpdateState,
    checkForAppUpdates,
    rollbackAppUpdate,
    clearAppUpdateHistory,
    // Persistence
    loadData,
    saveData,
    exportAppData,
    importAppData,
    exportSyncPackage,
    importSyncPackage,
    resetAllData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};