export interface FamilyMember {
  id: 'baba' | 'maman' | 'daughter';
  name: string;
  avatar: string; // legacy key
  avatarEmoji?: string;
  photoUri?: string;
  birthYear?: number; // Gregorian year, for age-based planning (e.g. time capsules)
  birthDate?: string; // YYYY-MM-DD Gregorian birth date
  quote: string;
  color: string;
  gradient: string[];
}

export interface GalleryPhoto {
  id: string;
  uri: string;
  title: string;
  description?: string;
  memberId: FamilyMember['id'];
  date: string; // ISO
  tags?: string[];
}

export interface Memory {
  id: string;
  type: 'memory' | 'wish' | 'love' | 'legacy';
  author: FamilyMember['id'];
  content: string;
  imageUri?: string;
  audioUri?: string;
  date: string; // ISO
  isLocked: boolean;
  stickers: string[];
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  emoji: string;
  description?: string;
  photos: string[];
  color: string;
  memberId?: FamilyMember['id'];
  kind?: 'event' | 'achievement';
}

export interface FamilyNotification {
  id: string;
  createdAt: string;
  memberId: FamilyMember['id'];
  title: string;
  message: string;
  type: 'achievement' | 'info';
  readBy: FamilyMember['id'][];
  relatedId?: string;
}

export interface LifeFlowerState {
  petals: number; // 0-12
  maxPetals: 12;
  lastBloom: string; // ISO
  messages: string[];
}

export interface LanguageLesson {
  id: string;
  level: 'beginner' | 'elementary' | 'pre-intermediate' | 'intermediate' | 'upper-intermediate' | 'advanced' | 'ielts-9' | 'ielts-10';
  method: 'samurai' | 'nyc' | 'euro-lab' | 'mom' | 'dad';
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  locked: boolean;
  content: LessonContent;
}

export interface LessonContent {
  type: 'vocab' | 'grammar' | 'listening' | 'speaking' | 'reading' | 'writing' | 'conversation';
  items: LessonItem[];
}

export interface LessonItem {
  id: string;
  english: string;
  persian: string;
  audio?: string;
  image?: string;
  example?: string;
}

export interface DailyPlan {
  date: string;
  tasks: PlanTask[];
  xpEarned: number;
  streak: number;
}

export interface PlanTask {
  id: string;
  title: string;
  category: 'language' | 'math' | 'ai' | 'migration' | 'family' | 'health' | 'work';
  duration: number; // minutes
  completed: boolean;
  xp: number;
}

export interface NightWonder {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'animal' | 'constellation';
  name: string;
  nameFa: string;
  description: string;
  descriptionFa: string;
  image: string;
  funFact: string;
  funFactFa: string;
  unlocked: boolean;
}

export interface AIRoadmapStep {
  id: string;
  title: string;
  description: string;
  resources: string[];
  duration: string; // e.g., "2 weeks"
  completed: boolean;
  locked: boolean;
  category: 'basics' | 'prompting' | 'tools' | 'building' | 'advanced';
}

export interface MigrationPlan {
  country: string;
  reason: string;
  requirements: string[];
  timeline: string;
  cost: string;
  aiJobMarket: string;
  waterSecurity: string;
  qualityOfLife: number; // 1-10
  nostalgiaFactor: number; // 1-10
}

export interface XPState {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  dailyXP: number;
  weeklyXP: number;
}

export interface ColoringGuideItem {
  area: string;
  color: string;
  note?: string;
}

export interface ColoringStroke {
  points: { x: number; y: number }[];
  color: string;
  size: number;
  isEraser?: boolean;
}

export interface ColoringPage {
  id: string;
  memberId: FamilyMember['id'];
  title?: string;
  sourcePhotoId?: string;
  originalImageUri: string;
  sketchImageUri: string;
  coloredImageUri?: string;
  colors: string[];
  guide?: ColoringGuideItem[];
  strokes?: ColoringStroke[];
  date: string;
  note?: string;
}

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ThemePreset = 'joy' | 'sadness' | 'anxiety' | 'dream-studio';

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  themePreset?: ThemePreset;
  musicEnabled: boolean;
  notificationsEnabled: boolean;
  language: 'fa' | 'en';
  memberName: string;
  subtitlesEnabled: boolean;
  subtitleLanguage: 'fa' | 'en';
  highContrast: boolean;
  reducedMotion: boolean;
  dyslexiaFont: boolean;
  personalizationPrompt?: string;
  activeMemberId?: FamilyMember['id'];
  sync?: {
    internetSyncEnabled: boolean;
    wifiSyncEnabled: boolean;
    autoSyncOnReconnect: boolean;
    lastSyncAt?: string;
    lastSyncFrom?: string;
    deviceName?: string;
  };
  apkDownloadUrl?: string;
}

export interface RolePermissions {
  canManageFamily: boolean;
  canEditShared: boolean;
  canViewChildPrivate: boolean;
  canSync: boolean;
}

// ============ WELLNESS & REHABILITATION ============
export interface WellnessProfile {
  memberId: FamilyMember['id'];
  conditions: string[]; // 'autism', 'adhd', 'dyslexia', 'physical', 'visual', 'hearing', 'speech', 'anxiety', 'depression'
  sensoryPreferences: SensoryPreferences;
  therapyGoals: TherapyGoal[];
  medications: Medication[];
  emergencyContacts: EmergencyContact[];
}

export interface SensoryPreferences {
  lowStimulation: boolean;
  colorScheme: 'soft' | 'high-contrast' | 'custom';
  soundEnabled: boolean;
  soundVolume: number;
  hapticFeedback: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  fontFamily: 'system' | 'dyslexia' | 'arabic';
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
}

export interface TherapyGoal {
  id: string;
  category: 'cognitive' | 'motor' | 'speech' | 'emotional' | 'social' | 'sensory' | 'behavioral';
  title: string;
  description: string;
  targetDate: string;
  progress: number; // 0-100
  exercises: TherapyExercise[];
  completed: boolean;
}

export interface TherapyExercise {
  id: string;
  goalId?: string;
  title: string;
  description: string;
  type?: 'breathing' | 'mindfulness' | 'cognitive' | 'motor' | 'speech' | 'emotional-regulation' | 'social-skill' | 'sensory-integration';
  category?: 'breathing' | 'mindfulness' | 'emotional-regulation' | 'cognitive' | 'motor' | 'speech' | 'social-skill' | 'sensory-integration';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // minutes
  instructions: string[];
  videoUri?: string;
  audioUri?: string;
  imageUris: string[];
  subtitles: SubtitleTrack[];
  completed: boolean;
  completedAt?: string;
  rating?: number; // 1-5 stars
}

export interface SubtitleTrack {
  language: 'fa' | 'en' | 'ar' | 'tr';
  text: string;
  startTime: number;
  endTime: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  startDate: string;
  endDate?: string;
  notes: string;
  reminderEnabled: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}


export interface HealthActivity {
  id: string;
  memberId: FamilyMember['id'];
  date: string; // YYYY-MM-DD
  category: 'cardio' | 'strength' | 'flexibility' | 'yoga' | 'walking' | 'sports' | 'mindfulness' | 'family';
  title: string;
  duration: number; // minutes
  intensity?: 'low' | 'medium' | 'high';
  steps?: number;
  calories?: number;
  notes?: string;
  completed: boolean;
}

export interface HealthPlan {
  id: string;
  memberId: FamilyMember['id'];
  title: string;
  category: HealthActivity['category'];
  weeklyTargetMinutes: number;
  weeklyTargetSteps?: number;
  active: boolean;
}

export interface EmotionEntry {
  id: string;
  memberId: FamilyMember['id'];
  date: string; // ISO
  time: string; // HH:mm
  emotion: EmotionType;
  intensity: number; // 1-10
  triggers: string[];
  notes: string;
  audioUri?: string;
  tags: string[];
}

export type EmotionType =
  | 'happy' | 'sad' | 'angry' | 'anxious' | 'calm' | 'excited'
  | 'frustrated' | 'proud' | 'lonely' | 'grateful' | 'overwhelmed' | 'peaceful'
  | 'fear' | 'disgust' | 'envy' | 'ennui' | 'embarrassment' | 'nostalgia';

export interface WellnessCheckIn {
  id: string;
  date: string;
  memberId: FamilyMember['id'];
  mood: EmotionType;
  energy: number; // 1-10
  sleep: number; // hours
  stress: number; // 1-10
  pain: number; // 1-10
  appetite: 'low' | 'normal' | 'high';
  notes: string;
  completedExercises: string[]; // therapy exercise IDs
}

// ============ TIME CAPSULE ============
export interface TimeCapsule {
  id: string;
  title: string;
  description: string;
  creatorId: FamilyMember['id'];
  targetDate: string; // ISO - when to open
  unlockCondition: 'date' | 'age' | 'event' | 'manual';
  targetAge?: number; // for age-based unlock
  targetEvent?: string; // for event-based unlock
  content: TimeCapsuleContent[];
  participants: FamilyMember['id'][];
  isLocked: boolean;
  openedAt?: string;
  createdAt: string;
}

export interface TimeCapsuleContent {
  id: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'drawing' | 'letter' | 'wish' | 'prediction';
  title: string;
  content: string; // text content or URI
  authorId: FamilyMember['id'];
  createdAt: string;
  metadata?: Record<string, any>;
}

// ============ DREAM WORLD ============
export interface DreamEntry {
  id: string;
  memberId: FamilyMember['id'];
  date: string; // ISO
  title: string;
  description: string;
  emotions: EmotionType[];
  symbols: DreamSymbol[];
  interpretation?: DreamInterpretation;
  isShared: boolean;
  sharedWith: FamilyMember['id'][];
  audioUri?: string;
  drawingUri?: string;
}

export interface DreamSymbol {
  symbol: string;
  meaning: string;
  personalMeaning?: string;
  category: 'person' | 'place' | 'object' | 'animal' | 'action' | 'feeling' | 'abstract';
}

export interface DreamInterpretation {
  id: string;
  dreamId: string;
  aiGenerated: boolean;
  jungianAnalysis: string;
  freudianAnalysis: string;
  modernPsychology: string;
  familyContext: string;
  suggestions: string[];
  generatedAt: string;
}

export interface DreamWorld {
  id: string;
  name: string;
  description: string;
  creatorId: FamilyMember['id'];
  entries: DreamEntry[];
  sharedEntries: DreamEntry[];
  themes: string[];
  createdAt: string;
  updatedAt: string;
}

// ============ ACCESSIBILITY ============
export interface AccessibilitySettings {
  subtitlesEnabled: boolean;
  subtitleLanguage: 'fa' | 'en' | 'ar' | 'tr';
  subtitleSize: 'small' | 'medium' | 'large';
  subtitleColor: string;
  subtitleBackground: string;
  audioDescriptionEnabled: boolean;
  signLanguageEnabled: boolean;
  signLanguageAvatar: 'joy' | 'sadness' | 'anxiety' | 'dream';
  highContrast: boolean;
  reducedMotion: boolean;
  dyslexiaFont: boolean;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  voiceControlEnabled: boolean;
  switchControlEnabled: boolean;
  touchAccommodations: TouchAccommodationSettings;
}

export interface TouchAccommodationSettings {
  holdDuration: number; // ms
  ignoreRepeat: boolean;
  tapAssistance: boolean;
  gestureDelay: number;
}

// ============ FAMILY THERAPY ============
export interface FamilyTherapySession {
  id: string;
  date: string;
  type: 'communication' | 'conflict-resolution' | 'bonding' | 'crisis' | 'routine' | 'celebration';
  participants: FamilyMember['id'][];
  facilitator: 'ai' | 'parent' | 'therapist';
  topic: string;
  exercises: TherapyExercise[];
  notes: string;
  moodBefore: Record<FamilyMember['id'], EmotionType>;
  moodAfter: Record<FamilyMember['id'], EmotionType>;
  duration: number;
  completed: boolean;
}

export interface ParentingResource {
  id: string;
  title: string;
  category: 'positive-parenting' | 'special-needs' | 'communication' | 'discipline' | 'development' | 'crisis' | 'self-care' | 'migration' | 'cultural';
  format: 'article' | 'video' | 'audio' | 'interactive' | 'worksheet';
  content: string;
  videoUri?: string;
  audioUri?: string;
  pdfUri?: string;
  duration?: number;
  ageRange: string;
  tags: string[];
  language: 'fa' | 'en';
  subtitles: SubtitleTrack[];
  rating: number;
  savedBy: FamilyMember['id'][];
}

// ============ SUPPORTIVE AVATAR ============
export interface SupportiveAvatar {
  id: 'joy' | 'sadness' | 'anxiety' | 'dream';
  name: string;
  emoji: string;
  color: string;
  gradient: string[];
  personality: string;
  voiceStyle: string;
  specialties: string[];
  character: string;
  source: string;
  messages: {
    morning: string;
    evening: string;
    stress: string;
    celebration: string;
    bedtime: string;
    encouragement: string;
  };
}

// ============ PROGRESS MAP ============
export interface ProgressMapStation {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  requiredExercises: number;
  reward: string;
  nextStation: string | null;
  completed: boolean;
  unlockedAt?: string;
  exercisesCompleted: number;
}

export interface UserProgressMap {
  memberId: FamilyMember['id'];
  currentStation: string;
  completedStations: string[];
  totalExercisesCompleted: number;
  badges: string[];
  lastUpdated: string;
}

// ============ DREAM THERAPY ============
export interface DreamTherapyEnvironment {
  id: string;
  name: string;
  emoji: string;
  description: string;
  audio: string;
  visual: string;
  therapeuticGoal: string;
  duration: number;
  completed: boolean;
  completedAt?: string;
  timesUsed: number;
}

export interface DreamTherapySession {
  id: string;
  memberId: FamilyMember['id'];
  environmentId: string;
  date: string;
  duration: number;
  moodBefore: EmotionType;
  moodAfter: EmotionType;
  notes: string;
  voiceRecordingUri?: string;
}

// ============ BACKUP & SECURITY ============
export interface BackupConfig {
  autoBackup: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
    time: string;
    encrypt: boolean;
    cloudProviders: string[];
    includeMedia: boolean;
    include3DModels: boolean;
    maxVersions: number;
  };
  manualBackup: {
    encrypt: boolean;
    formats: string[];
    includeOptions: {
      memories: boolean;
      calendar: boolean;
      wellness: boolean;
      timeCapsules: boolean;
      dreams: boolean;
      progress: boolean;
      settings: boolean;
      media: boolean;
      models3D: boolean;
    };
  };
  security: {
    twoFactorAuth: boolean;
    biometricLock: boolean;
    pinFallback: boolean;
    privateMode: {
      childContent: boolean;
      healthData: boolean;
      dreamContent: boolean;
      therapistNotes: boolean;
    };
    alerts: {
      unauthorizedAccess: boolean;
      dataBreach: boolean;
      backupFailure: boolean;
      loginNewDevice: boolean;
    };
    encryption: {
      algorithm: string;
      keyDerivation: string;
      iterations: number;
    };
  };
  offlineMode: {
    enabled: boolean;
    syncOnReconnect: boolean;
    conflictResolution: 'last-write-wins' | 'manual' | 'merge';
    cacheSize: string;
  };
}


export interface AppUpdateSectionChange {
  section: string;
  label: string;
  detail?: string;
}

export interface AppUpdateRecord {
  id: string;
  checkedAt: string;
  internetConnected: boolean;
  updated: boolean;
  sections: AppUpdateSectionChange[];
  note?: string;
}

export interface AppUpdateState {
  lastCheckedAt?: string;
  lastConnectedAt?: string;
  lastUpdatedAt?: string;
  history: AppUpdateRecord[];
  preUpdateSnapshot?: any; // persisted app data snapshot before last applied update
  sectionBaseline?: Record<string, string>; // lightweight signatures per section
}

export interface BackupRecord {
  id: string;
  type: 'auto' | 'manual';
  date: string;
  size: number;
  encrypted: boolean;
  cloudProvider: string | null;
  version: number;
  includes: string[];
  status: 'completed' | 'failed' | 'in-progress';
  error?: string;
  snapshot?: any; // local app data snapshot for restore
}

// ============ COUNSELOR INTEGRATION ============
export interface CounselorProvider {
  id: string;
  name: string;
  url: string;
  specialties: string[];
  languages: string[];
  insurance: boolean;
}

export interface CounselorIntegrationConfig {
  enabled: boolean;
  providers: CounselorProvider[];
  features: {
    inAppBooking: boolean;
    sessionNotes: boolean;
    sharedResources: boolean;
    progressSharing: 'parent-consent' | 'auto' | 'disabled';
    emergencyContact: boolean;
  };
}

export interface CounselorSession {
  id: string;
  memberId: FamilyMember['id'];
  providerId: string;
  date: string;
  duration: number;
  topic: string;
  notes: string;
  sharedWithParents: boolean;
  resources: string[];
}

// ============ PARENTING QUICK GUIDES ============
export interface ParentingQuickGuide {
  id: string;
  trigger: string;
  emoji: string;
  steps: {
    step: number;
    action: string;
    detail: string;
  }[];
  prevention: string[];
  resources: string[];
}

export interface SpecialNeedsProfile {
  id: string;
  label: string;
  emoji: string;
  color: string;
  defaultSettings: Partial<AccessibilitySettings> & {
    fontFamily?: string;
    lineHeight?: number;
    letterSpacing?: number;
    touchAccommodations?: TouchAccommodationSettings;
    switchControlEnabled?: boolean;
    voiceControlEnabled?: boolean;
    audioDescriptionEnabled?: boolean;
    screenReaderOptimized?: boolean;
    subtitlesEnabled?: boolean;
    signLanguageEnabled?: boolean;
    hapticFeedback?: boolean;
  };
  recommendedExercises: string[];
  avatarMessages: {
    morning: string;
    evening: string;
    stress: string;
  };
}