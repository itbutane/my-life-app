import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Animated, Easing, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useApp } from '../../hooks/AppContext';
import { AI_ROADMAP, MIGRATION_COUNTRIES } from '../../constants/data';
import { PlanTask } from '../../types';

const PROMPT_TIPS = [
  { title: 'نقش بده', desc: 'مثلاً: «تو یک مربی زبان کودک هستی...» تا خروجی دقیق‌تر شود.', ex: 'تو مربی صبور زبان انگلیسی کودکان ۷ ساله هستی.' },
  { title: 'هدف و خروجی مشخص', desc: 'دقیق بگو چه می‌خواهی و با چه قالبی (لیست، جدول، JSON، متن کوتاه).', ex: '۳ بازی ۱۰ دقیقه‌ای برای تمرین جمع پیشنهاد بده در قالب لیست شماره‌دار.' },
  { title: 'زمینه و محدودیت', desc: 'سن، علاقه، زمان، ابزار و محدودیت‌ها را بنویس.', ex: 'برای خانواده‌ای با کودک ۶ ساله، بدون صفحه‌نمایش، بودجه کم.' },
  { title: 'مثال و تکرار', desc: 'یک نمونه بده و بخواه در چند مرحله بهترش کند.', ex: 'یک نمونه برنامه روزانه بده، سپس نسخه کوتاه‌تر و سرگرم‌کننده‌تر بساز.' },
];

const PROMPT_TEMPLATES = [
  { label: 'برنامه روز خانواده', prompt: 'برای یک خانواده ۳ نفره (بابا، مامان، دختر ۷ ساله) یک برنامه روزانه متعادل شامل یادگیری، بازی، ورزش سبک و زمان خانواده در ۶ آیتم پیشنهاد کن. خروجی: جدول ساعت/فعالیت/هدف.' },
  { label: 'داستان اختصاصی کودک', prompt: 'یک داستان ۸ پاراگرافی با قهرمان [نام کودک] بنویس که درباره [موضوع] باشد، طنز ملایم داشته باشد و در پایان یک پیام انگیزشی کوتاه بده.' },
  { label: 'تمرین زبان', prompt: 'یک درس ۱۵ دقیقه‌ای انگلیسی سطح مبتدی با ۵ کلمه جدید، ۳ جمله ساده و یک بازی گفتاری برای والد و کودک طراحی کن.' },
  { label: 'حل تعارض آرام', prompt: 'به عنوان مشاور والدگری مهربان، ۵ جمله جایگزین برای موقع عصبانیت والدین پیشنهاد کن که هم مرزگذاری کند هم همدلی داشته باشد.' },
  { label: 'تحلیل پیشرفت', prompt: 'با توجه به این داده‌ها: [عادت‌ها/وظایف/خلق]، ۳ نقطه قوت، ۲ چالش و ۳ پیشنهاد عملی هفته آینده بده.' },
];

export const AIPathScreen: React.FC = () => {
  const { themeColors, isDark } = useTheme();
  const { settings } = useApp();
  const [selectedTab, setSelectedTab] = React.useState<'ai' | 'migration' | 'planning' | 'wonders'>('ai');
  const [entranceAnim] = React.useState(() => new Animated.Value(0));

  React.useEffect(() => {
    if (settings.reducedMotion) { entranceAnim.setValue(1); return; }
    Animated.timing(entranceAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [entranceAnim, settings.reducedMotion]);

  const opacity = entranceAnim;
  const translateY = entranceAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });

  const tabs = [
    { id: 'ai', label: '🤖 هوش مصنوعی', icon: '🤖' },
    { id: 'migration', label: '🌍 مهاجرت', icon: '🌍' },
    { id: 'planning', label: '📋 برنامه‌ریزی', icon: '📋' },
    { id: 'wonders', label: '✨ شگفتی‌ها', icon: '✨' },
  ] as const;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top', 'left', 'right'] as const}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={themeColors.background} translucent />
      <View style={styles.container}>
        <View style={[styles.header, { borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>🚀 مسیر رشد و آینده</Text>
          <Text style={[styles.headerSubtitle, { color: themeColors.textSecondary }]}>AI، مهاجرت، برنامه‌ریزی، شگفتی‌ها</Text>
        </View>
        <View style={[styles.tabBar, { backgroundColor: isDark ? themeColors.surface : 'rgba(255,255,255,0.9)', borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
          {tabs.map(tab => (
            <TouchableOpacity key={tab.id} style={[styles.tabButton, selectedTab === tab.id && styles.tabButtonActive]} onPress={() => setSelectedTab(tab.id)}>
              <Text style={[styles.tabIcon, selectedTab === tab.id && styles.tabIconActive]}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, { color: themeColors.textSecondary }, selectedTab === tab.id && styles.tabLabelActive]}>{tab.label.split(' ')[1]}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Animated.View style={{ flex: 1, opacity, transform: [{ translateY }] }}>
          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
            {selectedTab === 'ai' && <AISection />}
            {selectedTab === 'migration' && <MigrationSection />}
            {selectedTab === 'planning' && <PlanningSection />}
            {selectedTab === 'wonders' && <WondersSection />}
          </ScrollView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const AISection: React.FC = () => {
  const { themeColors, isDark } = useTheme();
  const { settings, updateSettings } = useApp();
  const [promptDraft, setPromptDraft] = React.useState('');
  const [studioPrompt, setStudioPrompt] = React.useState('یک برنامه هفتگی سرگرم‌کننده برای یادگیری زبان انگلیسی و ریاضی برای دختر ۷ ساله پیشنهاد کن.');

  const appPrompt = settings.personalizationPrompt || '';
  const applyPrompt = () => {
    updateSettings({ personalizationPrompt: promptDraft.trim() || undefined });
    Alert.alert('ذخیره شد', 'پرامپت شخصی‌سازی برنامه ذخیره شد و در تنظیمات قابل ویرایش/حذف است.');
  };

  const categoryColors: Record<string, string> = { basics: '#FF6B9D', tools: '#A29BFE', prompting: '#4ECDC4', building: '#FD9644', advanced: '#2D3436' };
  const categoryLabels: Record<string, string> = { basics: 'مبانی', tools: 'ابزارها', prompting: 'پرامپت‌نویسی', building: 'ساختن', advanced: 'پیشرفته' };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>🤖 مسیر یادگیری هوش مصنوعی</Text>
      <Text style={[styles.sectionSubtitle, { color: themeColors.textSecondary }]}>از پایه تا کاربرد حرفه‌ای برای خانواده و رشد فردی</Text>

      <View style={[styles.promptStudio, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.95)', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
        <Text style={[styles.blockTitle, { color: themeColors.text }]}>✍️ آموزش کاربردی پرامپت‌نویسی</Text>
        <Text style={[styles.blockDesc, { color: themeColors.textSecondary }]}>برای گرفتن نتیجه بهتر: نقش + هدف + زمینه + محدودیت + قالب خروجی + مثال.</Text>
        <View style={styles.tipsGrid}>
          {PROMPT_TIPS.map(t => (
            <View key={t.title} style={[styles.tipCard, { borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
              <Text style={[styles.tipTitle, { color: themeColors.primary }]}>{t.title}</Text>
              <Text style={[styles.tipDesc, { color: themeColors.textSecondary }]}>{t.desc}</Text>
              <Text style={[styles.tipEx, { color: themeColors.text }]}>نمونه: {t.ex}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.blockTitle, { color: themeColors.text, marginTop: 14 }]}>🧪 استودیوی پرامپت (تمرین و شخصی‌سازی)</Text>
        <Text style={[styles.blockDesc, { color: themeColors.textSecondary }]}>با پرامپت می‌توانید سبک برنامه، پیشنهادها و اولویت‌ها را برای خانواده شخصی‌سازی کنید.</Text>
        <TextInput
          style={[styles.promptInput, { color: themeColors.text, borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)', backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#fff' }]}
          value={studioPrompt}
          onChangeText={setStudioPrompt}
          placeholder="پرامپت خود را بنویسید..."
          placeholderTextColor={themeColors.textMuted}
          multiline
        />
        <View style={styles.templateRow}>
          {PROMPT_TEMPLATES.map(t => (
            <TouchableOpacity key={t.label} style={[styles.templateChip, { borderColor: themeColors.primary }]} onPress={() => setStudioPrompt(t.prompt)}>
              <Text style={{ color: themeColors.primary, fontSize: 11, fontWeight: '600' }}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={[styles.previewBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(78,205,196,0.08)' }]}>
          <Text style={[styles.previewTitle, { color: themeColors.text }]}>پیش‌نمایش پرامپت آماده</Text>
          <Text style={[styles.previewText, { color: themeColors.textSecondary }]}>{studioPrompt}</Text>
        </View>

        <Text style={[styles.blockTitle, { color: themeColors.text, marginTop: 14 }]}>⚙️ پرامپت شخصی‌سازی برنامه (ذخیره/ویرایش/حذف)</Text>
        <TextInput
          style={[styles.promptInput, { minHeight: 90, color: themeColors.text, borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)', backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#fff' }]}
          value={promptDraft || appPrompt}
          onChangeText={setPromptDraft}
          placeholder="مثال: پیشنهادها را ساده، خانواده‌محور و با تمرکز بر سلامت و یادگیری دخترم بده..."
          placeholderTextColor={themeColors.textMuted}
          multiline
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[styles.smallPrimaryBtn, { backgroundColor: themeColors.primary }]} onPress={applyPrompt}><Text style={styles.smallPrimaryBtnText}>ذخیره/اعمال</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.smallPrimaryBtn, { backgroundColor: '#E17055' }]} onPress={() => { setPromptDraft(''); updateSettings({ personalizationPrompt: undefined }); }}><Text style={styles.smallPrimaryBtnText}>حذف</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.smallPrimaryBtn, { backgroundColor: '#636E72' }]} onPress={() => setPromptDraft(appPrompt)}><Text style={styles.smallPrimaryBtnText}>بارگذاری ذخیره‌شده</Text></TouchableOpacity>
        </View>
        <Text style={[styles.blockDesc, { color: themeColors.textSecondary, marginTop: 8 }]}>وضعیت: {appPrompt ? 'یک پرامپت شخصی‌سازی ذخیره شده است.' : 'هنوز پرامپت شخصی‌سازی ذخیره نشده.'}</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
        <Text style={[styles.sectionTitle, { color: themeColors.text, marginTop: 0 }]}>نقشه راه AI</Text>
        <TouchableOpacity style={[styles.smallPrimaryBtn, { backgroundColor: themeColors.primary }]} onPress={() => Alert.alert('بروزرسانی نقشه راه', 'وضعیت مراحل و محتوای نقشه راه بازبینی شد. برای دریافت محتوای جدید آنلاین، اتصال اینترنت و بروزرسانی برنامه را بررسی کنید.')}>
          <Text style={styles.smallPrimaryBtnText}>🔄 بروزرسانی</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.roadmapList}>
        {AI_ROADMAP.map((step, i) => (
          <View key={step.id} style={[styles.roadmapCard, { borderLeftColor: categoryColors[step.category], backgroundColor: isDark ? themeColors.surface : 'rgba(255,255,255,0.9)' }, step.locked && styles.roadmapCardLocked]}>
            <View style={styles.roadmapHeader}>
              <View style={[styles.stepBadge, { backgroundColor: categoryColors[step.category] }]}><Text style={styles.stepNumber}>{i + 1}</Text></View>
              <View style={styles.stepInfo}>
                <Text style={[styles.stepTitle, { color: themeColors.text }]}>{step.title}</Text>
                <View style={styles.stepMeta}>
                  <View style={[styles.categoryTag, { backgroundColor: categoryColors[step.category] }]}><Text style={styles.categoryTagText}>{categoryLabels[step.category]}</Text></View>
                  <Text style={[styles.duration, { color: themeColors.textSecondary }]}>⏱ {step.duration}</Text>
                </View>
              </View>
              {step.locked && <Text style={styles.lockIcon}>🔒</Text>}
            </View>
            <Text style={[styles.stepDescription, { color: themeColors.text }]}>{step.description}</Text>
            <View style={styles.stepResources}>
              {step.resources.slice(0, 2).map((res, j) => (<Text key={j} style={[styles.resourceText, { color: themeColors.textSecondary }]}>• {res}</Text>))}
            </View>
            {!step.locked ? (
              <TouchableOpacity style={[styles.actionButton, step.completed && styles.actionButtonDone]}><Text style={styles.actionButtonText}>{step.completed ? '✅ تکمیل شده' : 'شروع یادگیری 🚀'}</Text></TouchableOpacity>
            ) : (
              <Text style={[styles.lockedText, { color: themeColors.textMuted }]}>باز می‌شود پس از تکمیل مراحل قبلی</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const MigrationSection: React.FC = () => {
  const { themeColors, isDark } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>🌍 راهنمای مهاجرت خانوادگی</Text>
      <Text style={[styles.sectionSubtitle, { color: themeColors.textSecondary }]}>کشورهای پیشنهادی بر اساس کیفیت زندگی، بازار کار AI، امنیت آب و شرایط خانواده</Text>
      <View style={styles.cardsGrid}>
        {MIGRATION_COUNTRIES.map(country => (
          <View key={country.country} style={[styles.countryCard, { backgroundColor: isDark ? themeColors.surface : 'rgba(255,255,255,0.9)' }]}>
            <View style={styles.countryHeader}>
              <Text style={styles.countryFlag}>🏳️</Text>
              <Text style={[styles.countryName, { color: themeColors.text }]}>{country.country}</Text>
            </View>
            <View style={styles.countryScores}>
              <ScoreBar label="کیفیت زندگی" value={country.qualityOfLife} color="#FF6B9D" />
              <ScoreBar label="بازار کار AI" value={8} color="#A29BFE" />
              <ScoreBar label="امنیت آب" value={country.country === 'نروژ' || country.country === 'سوئد' ? 10 : 8} color="#4ECDC4" />
              <ScoreBar label="دوست‌داشتنی ایرانیان" value={country.nostalgiaFactor} color="#FD9644" />
            </View>
            <Text style={[styles.countryReason, { color: themeColors.textSecondary }]}>{country.reason}</Text>
            <View style={styles.countryMeta}>
              <Text style={[styles.metaItem, { color: themeColors.textSecondary }]}>⏱ {country.timeline}</Text>
              <Text style={[styles.metaItem, { color: themeColors.textSecondary }]}>💰 {country.cost}</Text>
            </View>
            <Text style={[styles.countryRequirements, { color: themeColors.textMuted }]}>نیاز: {country.requirements.slice(0, 2).join('، ')}...</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const ScoreBar: React.FC<{label: string, value: number, color: string}> = ({ label, value, color }) => {
  const { themeColors } = useTheme();
  return (
    <View style={styles.scoreItem}>
      <Text style={[styles.scoreLabel, { color: themeColors.textSecondary }]}>{label}</Text>
      <View style={[styles.scoreBar, { backgroundColor: 'rgba(0,0,0,0.1)' }]}><View style={[styles.scoreFill, { width: `${value * 10}%`, backgroundColor: color }]} /></View>
      <Text style={[styles.scoreValue, { color: themeColors.text }]}>{value}/10</Text>
    </View>
  );
};

const PlanningSection: React.FC = () => {
  const { themeColors, isDark } = useTheme();
  const { dailyPlan, xpState, completeTask, addDailyTask, updateDailyTask, deleteDailyTask, resetDailyPlan } = useApp();
  const tasks = dailyPlan.tasks || [];
  const [showAddTask, setShowAddTask] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [newTask, setNewTask] = React.useState({ title: '', category: 'language' as PlanTask['category'], duration: 15 });

  const categories = [
    { id: 'language', label: '🌍 زبان', color: '#FF6B9D' },
    { id: 'math', label: '🔢 ریاضی', color: '#4ECDC4' },
    { id: 'ai', label: '🤖 AI', color: '#A29BFE' },
    { id: 'migration', label: '🌍 مهاجرت', color: '#FD9644' },
    { id: 'family', label: '👨‍👩‍👧 خانواده', color: '#FFEAA7' },
    { id: 'health', label: '💪 سلامتی', color: '#55EFC4' },
    { id: 'work', label: '💼 کار', color: '#74B9FF' },
  ] as const;

  const openAdd = () => { setEditingId(null); setNewTask({ title: '', category: 'language', duration: 15 }); setShowAddTask(true); };
  const openEdit = (task: PlanTask) => { setEditingId(task.id); setNewTask({ title: task.title, category: task.category, duration: task.duration }); setShowAddTask(true); };
  const toggleTask = (id: string) => { const t = tasks.find(x => x.id === id); if (!t || t.completed) return; completeTask(id); };

  const saveTask = () => {
    if (!newTask.title.trim()) return;
    const xp = newTask.category === 'family' ? 20 : 15;
    if (editingId) updateDailyTask(editingId, { title: newTask.title.trim(), category: newTask.category, duration: newTask.duration, xp });
    else addDailyTask({ title: newTask.title.trim(), category: newTask.category, duration: newTask.duration, xp });
    setShowAddTask(false); setEditingId(null); setNewTask({ title: '', category: 'language', duration: 15 });
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalXP = tasks.filter(t => t.completed).reduce((sum, t) => sum + (t.xp || 0), 0);

  return (
    <View style={styles.section}>
      <View style={styles.planningHeader}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>📋 برنامه‌ریزی روزانه</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[styles.addTaskButton, { backgroundColor: '#636E72' }]} onPress={resetDailyPlan}><Text style={styles.addTaskButtonText}>ریست روز</Text></TouchableOpacity>
          <TouchableOpacity style={styles.addTaskButton} onPress={openAdd}><Text style={styles.addTaskButtonText}>+ افزودن</Text></TouchableOpacity>
        </View>
      </View>
      <View style={[styles.dayProgress, { backgroundColor: isDark ? themeColors.surface : 'rgba(255,255,255,0.9)' }]}>
        <View style={styles.progressCircle}>
          <Text style={[styles.progressText, { color: themeColors.text }]}>{completedCount}/{tasks.length}</Text>
          <Text style={[styles.progressSubtext, { color: themeColors.textSecondary }]}>{totalXP} XP امروز</Text>
        </View>
        <View style={styles.progressStats}>
          <Text style={[styles.statItem, { color: themeColors.textSecondary }]}>🔥 {xpState.currentStreak} روز متوالی</Text>
          <Text style={[styles.statItem, { color: themeColors.textSecondary }]}>⭐ {xpState.totalXP} XP کل</Text>
          <Text style={[styles.statItem, { color: themeColors.textSecondary }]}>🏆 سطح {xpState.level}</Text>
        </View>
      </View>

      <View style={styles.tasksList}>
        {tasks.length === 0 ? (
          <Text style={{ textAlign: 'center', color: themeColors.textSecondary, paddingVertical: 20 }}>هنوز وظیفه‌ای برای امروز ثبت نشده. یک وظیفه اضافه کنید.</Text>
        ) : tasks.map(task => {
          const cat = categories.find(c => c.id === task.category);
          return (
            <View key={task.id} style={[styles.taskItem, { backgroundColor: isDark ? themeColors.surface : 'rgba(255,255,255,0.9)' }, task.completed && styles.taskItemDone]}>
              <TouchableOpacity onPress={() => toggleTask(task.id)} style={[styles.taskCheckbox, task.completed && styles.taskCheckboxDone, { backgroundColor: task.completed ? cat?.color : 'transparent', borderColor: cat?.color }]}>
                {task.completed && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
              <View style={styles.taskInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={[styles.taskCategoryDot, { backgroundColor: cat?.color }]} />
                  <Text style={[styles.taskTitle, { color: themeColors.text }, task.completed && styles.taskTitleDone]}>{task.title}</Text>
                </View>
                <View style={styles.taskMeta}>
                  <Text style={[styles.taskCategory, { color: themeColors.textSecondary }]}>{cat?.label}</Text>
                  <Text style={[styles.taskDuration, { color: themeColors.textSecondary }]}>⏱ {task.duration} دقیقه</Text>
                  <Text style={styles.taskXP}>+{task.xp} XP</Text>
                </View>
              </View>
              <View style={styles.taskActions}>
                <TouchableOpacity style={[styles.smallAction, { borderColor: themeColors.primary }]} onPress={() => openEdit(task)}><Text style={{ color: themeColors.primary, fontSize: 11, fontWeight: '600' }}>ویرایش</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.smallAction, { borderColor: '#E17055' }]} onPress={() => deleteDailyTask(task.id)}><Text style={{ color: '#E17055', fontSize: 11, fontWeight: '600' }}>حذف</Text></TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {showAddTask && (
        <View style={[styles.addTaskModal, { backgroundColor: isDark ? themeColors.surface : '#fff' }]}>
          <Text style={[styles.modalTitle, { color: themeColors.text }]}>{editingId ? 'ویرایش وظیفه' : 'افزودن وظیفه جدید'}</Text>
          <TextInput style={[styles.textInput, { color: themeColors.text, borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)', backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff' }]} placeholder="عنوان وظیفه" placeholderTextColor={themeColors.textMuted} value={newTask.title} onChangeText={(title: string) => setNewTask(prev => ({ ...prev, title }))} autoFocus />
          <Text style={[styles.modalLabel, { color: themeColors.text }]}>دسته‌بندی</Text>
          <View style={styles.categorySelector}>
            {categories.map(cat => (
              <TouchableOpacity key={cat.id} style={[styles.categoryOption, newTask.category === cat.id && styles.categoryOptionSelected, { borderColor: cat.color }]} onPress={() => setNewTask(prev => ({ ...prev, category: cat.id }))}>
                <Text style={[styles.categoryOptionText, { color: themeColors.text }]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.durationSelector}>
            <Text style={[styles.modalLabel, { color: themeColors.text }]}>مدت زمان (دقیقه)</Text>
            <View style={styles.durationButtons}>
              {[10, 15, 20, 30, 45, 60].map(min => (
                <TouchableOpacity key={min} style={[styles.durationButton, newTask.duration === min && styles.durationButtonActive]} onPress={() => setNewTask(prev => ({ ...prev, duration: min }))}>
                  <Text style={[styles.durationButtonText, { color: newTask.duration === min ? '#fff' : themeColors.textSecondary }]}>{min}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => { setShowAddTask(false); setEditingId(null); }}><Text style={styles.cancelButtonText}>انصراف</Text></TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={saveTask}><Text style={styles.saveButtonText}>{editingId ? 'ذخیره تغییرات' : 'افزودن ✨'}</Text></TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const WondersSection: React.FC = () => {
  const { themeColors, isDark } = useTheme();
  const { nightWonders, unlockNightWonder, getTodaysWonder } = useApp();
  const todayWonder = getTodaysWonder();
  const categories = [
    { id: 'animal', label: '🦋 حیوانات', color: '#FF6B9D' },
    { id: 'constellation', label: '⭐ ستاره‌ها', color: '#A29BFE' },
    { id: 'iranian_heritage', label: '🏛️ ایران کهن', color: '#FD9644' },
    { id: 'iranian_pride', label: '🏆 مفاخر ایرانی', color: '#4ECDC4' },
    { id: 'iranian_astronomy', label: '🔭 نجوم ایران', color: '#74B9FF' },
  ];
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>✨ شگفتی‌های شب</Text>
      <Text style={[styles.sectionSubtitle, { color: themeColors.textSecondary }]}>هر شب یک کشف جدید: حیوان، ستاره، فرهنگ ایران</Text>
      {todayWonder && (
        <View style={[styles.todayWonderCard, { borderColor: todayWonder.type === 'animal' ? '#FF6B9D' : '#A29BFE', backgroundColor: isDark ? themeColors.surface : 'rgba(255,255,255,0.95)' }]}>
          <View style={styles.todayWonderHeader}>
            <Text style={styles.todayWonderEmoji}>{todayWonder.type === 'animal' ? '🦋' : '⭐'}</Text>
            <View style={styles.todayWonderInfo}>
              <Text style={[styles.todayWonderTitle, { color: themeColors.text }]}>{todayWonder.nameFa} ({todayWonder.name})</Text>
              <Text style={[styles.todayWonderCategory, { color: themeColors.textSecondary }]}>{categories.find(c => c.id === todayWonder.type)?.label}</Text>
            </View>
            {!todayWonder.unlocked && <TouchableOpacity style={styles.unlockButton} onPress={() => unlockNightWonder(todayWonder.id)}><Text style={styles.unlockButtonText}>باز کردن 🔓</Text></TouchableOpacity>}
          </View>
          <Text style={[styles.todayWonderDescription, { color: themeColors.text }]}>{todayWonder.descriptionFa}</Text>
          <View style={styles.todayWonderFunFact}>
            <Text style={styles.funFactLabel}>💡 دانستنی شگفت‌انگیز:</Text>
            <Text style={[styles.funFactText, { color: themeColors.textSecondary }]}>{todayWonder.funFactFa}</Text>
          </View>
        </View>
      )}
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>📚 آرشیو شگفتی‌ها</Text>
      <View style={styles.categoriesGrid}>
        {categories.map(cat => (
          <View key={cat.id} style={[styles.categoryCard, { borderColor: cat.color, backgroundColor: isDark ? themeColors.surface : 'rgba(255,255,255,0.9)' }]}>
            <Text style={styles.categoryIcon}>{cat.label.split(' ')[0]}</Text>
            <View style={[styles.categoryColorBar, { backgroundColor: cat.color }]} />
            <Text style={[styles.categoryCardTitle, { color: cat.color }]}>{cat.label.split(' ').slice(1).join(' ')}</Text>
            <Text style={[styles.categoryCount, { color: themeColors.textSecondary }]}>{nightWonders.filter(w => w.type === cat.id).length} مورد</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  headerSubtitle: { fontSize: 13, fontWeight: '500', marginTop: 4 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 12 },
  tabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6 },
  tabButtonActive: { backgroundColor: 'rgba(255,107,157,0.1)', borderRadius: 12 },
  tabIcon: { fontSize: 18 },
  tabIconActive: { transform: [{ scale: 1.1 }] },
  tabLabel: { fontSize: 11, fontWeight: '600' },
  tabLabelActive: { color: '#FF6B9D', fontWeight: '700' },
  content: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingBottom: 160 },
  section: { marginBottom: 24, marginTop: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  sectionSubtitle: { fontSize: 13, marginBottom: 16 },
  promptStudio: { borderRadius: 16, padding: 14, borderWidth: 1 },
  blockTitle: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
  blockDesc: { fontSize: 12, lineHeight: 18, marginBottom: 10 },
  tipsGrid: { gap: 8 },
  tipCard: { borderWidth: 1, borderRadius: 12, padding: 10 },
  tipTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  tipDesc: { fontSize: 12, lineHeight: 17 },
  tipEx: { fontSize: 11, marginTop: 6 },
  promptInput: { borderWidth: 1, borderRadius: 12, padding: 12, minHeight: 110, textAlignVertical: 'top', fontSize: 13, marginBottom: 10 },
  templateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  templateChip: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6 },
  previewBox: { borderRadius: 12, padding: 10, marginBottom: 10 },
  previewTitle: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  previewText: { fontSize: 12, lineHeight: 18 },
  smallPrimaryBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  smallPrimaryBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  roadmapList: { gap: 12 },
  roadmapCard: { borderRadius: 16, borderLeftWidth: 4, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  roadmapCardLocked: { opacity: 0.6 },
  roadmapHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  stepBadge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  stepNumber: { fontSize: 14, fontWeight: '800', color: '#fff' },
  stepInfo: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: '700' },
  stepMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  categoryTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  categoryTagText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  duration: { fontSize: 11, fontWeight: '500' },
  lockIcon: { fontSize: 18 },
  stepDescription: { fontSize: 13, lineHeight: 20, marginBottom: 8, marginLeft: 48 },
  stepResources: { marginLeft: 48, marginBottom: 12 },
  resourceText: { fontSize: 11, marginBottom: 2 },
  actionButton: { paddingVertical: 10, borderRadius: 12, backgroundColor: '#FF6B9D', alignItems: 'center', marginLeft: 48 },
  actionButtonDone: { backgroundColor: '#00B894' },
  actionButtonText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  lockedText: { fontSize: 12, fontStyle: 'italic', marginLeft: 48, marginTop: 8 },
  updateCard: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 12 },
  cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  countryCard: { width: '48%', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2, marginBottom: 12 },
  countryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  countryFlag: { fontSize: 24, marginRight: 8 },
  countryName: { fontSize: 16, fontWeight: '800' },
  countryScores: { gap: 8, marginBottom: 10 },
  scoreItem: { flexDirection: 'row', alignItems: 'center' },
  scoreLabel: { fontSize: 10, fontWeight: '600', width: 60 },
  scoreBar: { flex: 1, height: 4, borderRadius: 2, marginRight: 6, overflow: 'hidden' },
  scoreFill: { height: '100%', borderRadius: 2 },
  scoreValue: { fontSize: 10, fontWeight: '700', width: 28 },
  countryReason: { fontSize: 11, lineHeight: 18, marginBottom: 8 },
  countryMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  metaItem: { fontSize: 10, fontWeight: '500' },
  countryRequirements: { fontSize: 10, fontStyle: 'italic' },
  planningHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  addTaskButton: { backgroundColor: '#FF6B9D', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  addTaskButtonText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  dayProgress: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderRadius: 16, padding: 16, marginBottom: 16 },
  progressCircle: { alignItems: 'center' },
  progressText: { fontSize: 22, fontWeight: '800' },
  progressSubtext: { fontSize: 12 },
  progressStats: { gap: 6 },
  statItem: { fontSize: 12, fontWeight: '600' },
  tasksList: { gap: 10 },
  taskItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 12, gap: 10 },
  taskItemDone: { opacity: 0.7 },
  taskCheckbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  taskCheckboxDone: { borderColor: 'transparent' },
  checkIcon: { color: '#fff', fontSize: 12, fontWeight: '700' },
  taskInfo: { flex: 1 },
  taskCategoryDot: { width: 8, height: 8, borderRadius: 4 },
  taskTitle: { fontSize: 14, fontWeight: '600' },
  taskTitleDone: { textDecorationLine: 'line-through' },
  taskMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  taskCategory: { fontSize: 11 },
  taskDuration: { fontSize: 11 },
  taskXP: { fontSize: 11, fontWeight: '700', color: '#00B894' },
  taskActions: { gap: 6 },
  smallAction: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, alignItems: 'center' },
  addTaskModal: { borderRadius: 16, padding: 16, marginTop: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  textInput: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 12 },
  modalLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  categorySelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  categoryOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1 },
  categoryOptionSelected: { backgroundColor: 'rgba(255,107,157,0.1)' },
  categoryOptionText: { fontSize: 12 },
  durationSelector: { marginBottom: 16 },
  durationButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  durationButton: { width: 44, height: 36, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.05)', alignItems: 'center', justifyContent: 'center' },
  durationButtonActive: { backgroundColor: '#FF6B9D' },
  durationButtonText: { fontSize: 13, fontWeight: '600' },
  modalButtons: { flexDirection: 'row', gap: 12 },
  cancelButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.05)', alignItems: 'center' },
  cancelButtonText: { fontSize: 14, fontWeight: '600', color: '#636E72' },
  saveButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#FF6B9D', alignItems: 'center' },
  saveButtonText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  todayWonderCard: { borderRadius: 16, padding: 16, borderWidth: 2, marginBottom: 16 },
  todayWonderHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  todayWonderEmoji: { fontSize: 36, marginRight: 12 },
  todayWonderInfo: { flex: 1 },
  todayWonderTitle: { fontSize: 16, fontWeight: '700' },
  todayWonderCategory: { fontSize: 12, marginTop: 2 },
  unlockButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, backgroundColor: '#FF6B9D' },
  unlockButtonText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  todayWonderDescription: { fontSize: 14, lineHeight: 22, marginBottom: 10 },
  todayWonderFunFact: { backgroundColor: 'rgba(255,217,61,0.2)', borderRadius: 12, padding: 12 },
  funFactLabel: { fontSize: 12, fontWeight: '700', color: '#D35400', marginBottom: 4 },
  funFactText: { fontSize: 13, lineHeight: 20 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryCard: { width: '48%', borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 10, alignItems: 'center' },
  categoryIcon: { fontSize: 28, marginBottom: 6 },
  categoryColorBar: { width: 30, height: 3, borderRadius: 2, marginBottom: 6 },
  categoryCardTitle: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  categoryCount: { fontSize: 11 },
});

export default AIPathScreen;
