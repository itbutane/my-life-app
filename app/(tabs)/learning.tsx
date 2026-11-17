import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { ColoringBook } from '../../components/ColoringBook';
import { useApp } from '../../hooks/AppContext';
import { LANGUAGE_LEVELS, LANGUAGE_METHODS, LANGUAGE_LESSONS } from '../../constants/data';

export const LearningScreen: React.FC = () => {
  const { themeColors, isDark } = useTheme();
  styles = React.useMemo(() => createStyles(themeColors, isDark), [themeColors, isDark]);
  const { coloringPages, addColoringPage, updateColoringPage, dailyPlan, xpState, familyMembers, settings } = useApp();
  const [selectedTab, setSelectedTab] = React.useState<'language' | 'math' | 'music' | 'coloring'>('language');
  const [entranceAnim] = React.useState(() => new Animated.Value(0));

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

  const tabs = [
    { id: 'language', label: '🌍 زبان', icon: '🌍' },
    { id: 'math', label: '🔢 ریاضی', icon: '🔢' },
    { id: 'music', label: '🎵 موسیقی', icon: '🎵' },
    { id: 'coloring', label: '🎨 رنگ‌آمیزی', icon: '🎨' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top', 'left', 'right'] as const}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={themeColors.background} translucent />
      
      <View style={styles.container}>
        <View style={[styles.header, { borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>📚 یادگیری و رشد</Text>
          <Text style={[styles.headerSubtitle, { color: themeColors.textSecondary }]}>
            سطح {xpState.level} • {xpState.currentStreak} روز متوالی • {xpState.totalXP} XP
          </Text>
        </View>

        {/* Tab Bar */}
        <Animated.View
          style={[
            styles.tabBar,
            { opacity: entranceAnim, transform: [{ translateY: entranceAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] },
          ]}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                selectedTab === tab.id && styles.tabButtonActive,
              ]}
              onPress={() => setSelectedTab(tab.id as any)}
            >
              <Text style={[
                styles.tabIcon,
                selectedTab === tab.id && styles.tabIconActive,
              ]}>
                {tab.icon}
              </Text>
              <Text style={[
                styles.tabLabel,
                selectedTab === tab.id && styles.tabLabelActive,
              ]}>
                {tab.label.replace(tab.icon + ' ', '')}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Content */}
        <Animated.ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {selectedTab === 'language' && <LanguageSection />}
          {selectedTab === 'math' && <MathSection />}
          {selectedTab === 'music' && <MusicSection />}
          {selectedTab === 'coloring' && <ColoringSection />}
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
};

// Language Section
const LanguageSection: React.FC = () => {
  const { themeColors, isDark } = useTheme();
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🌍 ماجراجویی زبانی</Text>
      <Text style={styles.sectionSubtitle}>
        سه روش منحصر به فرد + یادگیری با مامان و بابا
      </Text>
      
      {/* Methods */}
      <View style={styles.methodsGrid}>
        {LANGUAGE_METHODS.map(method => (
          <TouchableOpacity key={method.id} style={[
            styles.methodCard,
            { borderColor: method.color },
          ]}>
            <Text style={styles.methodIcon}>{method.icon}</Text>
            <View style={[
              styles.methodColorBar,
              { backgroundColor: method.color },
            ]} />
            <Text style={[
              styles.methodTitle,
              { color: method.color },
            ]}>
              {method.label}
            </Text>
            <Text style={styles.methodDesc}>{method.description}</Text>
            <Text style={styles.methodLevel}>از سطح مبتدی تا آیلتس ۱۰</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Levels */}
      <Text style={styles.sectionTitle}>📊 سطوح پیشرفت</Text>
      <View style={styles.levelsList}>
        {LANGUAGE_LEVELS.map((level, i) => (
          <View key={level.id} style={styles.levelItem}>
            <View style={[
              styles.levelBadge,
              i < 3 && { backgroundColor: '#FF6B9D' },
              i >= 3 && i < 6 && { backgroundColor: '#A29BFE' },
              i >= 6 && { backgroundColor: '#4ECDC4' },
            ]}>
              <Text style={styles.levelNumber}>{i + 1}</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelLabel}>{level.label}</Text>
              <Text style={styles.levelDetail}>
                {i < 2 ? 'مبانی: حروف، اعداد، خانواده، احوالپرسی' :
                 i < 4 ? 'جمله‌سازی، مکالمه، توصیف، احساسات' :
                 i < 6 ? 'نوشتار، استدلال، اصطلاحات، رایتینگ' :
                 'آزمون آیلتس، مقاله‌نویسی، اسپیکینگ پیشرفته'}
              </Text>
            </View>
            <View style={styles.levelProgress}>
              <View style={[
                styles.progressBar,
                { backgroundColor: 'rgba(0,0,0,0.1)' },
              ]}>
                <View style={[
                  styles.progressFill,
                  { width: `${Math.max(0, (i - 1) * 14)}%` },
                  { backgroundColor: i < 3 ? '#FF6B9D' : i < 6 ? '#A29BFE' : '#4ECDC4' },
                ]} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Math Section
const MathSection: React.FC = () => {
  const { themeColors } = useTheme();
  
  const mathTopics = [
    { id: 'counting', label: 'شمارش و اعداد', icon: '1️⃣', color: '#FF6B9D', lessons: 20 },
    { id: 'addition', label: 'جمع و تفریق', icon: '➕', color: '#4ECDC4', lessons: 25 },
    { id: 'multiplication', label: 'ضرب و تقسیم', icon: '✖️', color: '#A29BFE', lessons: 30 },
    { id: 'geometry', label: 'هندسه و اشکال', icon: '🔷', color: '#FD9644', lessons: 18 },
    { id: 'fractions', label: 'کسورها و اعشار', icon: '📐', color: '#55EFC4', lessons: 22 },
    { id: 'algebra', label: 'جبر مقدماتی', icon: '🧮', color: '#FFEAA7', lessons: 15 },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🔢 بازی ریاضی</Text>
      <Text style={styles.sectionSubtitle}>
        یادگیری مفاهیم ریاضی به سبک بازی و مرحله‌ای
      </Text>
      
      <View style={styles.cardsGrid}>
        {mathTopics.map(topic => (
          <TouchableOpacity key={topic.id} style={[
            styles.topicCard,
            { borderColor: topic.color },
          ]}>
            <Text style={styles.topicIcon}>{topic.icon}</Text>
            <View style={[
              styles.topicColorBar,
              { backgroundColor: topic.color },
            ]} />
            <Text style={[
              styles.topicTitle,
              { color: topic.color },
            ]}>
              {topic.label}
            </Text>
            <Text style={styles.topicLessons}>{topic.lessons} درس • بازی‌محور</Text>
            <TouchableOpacity style={[
              styles.startButton,
              { backgroundColor: topic.color },
            ]}>
              <Text style={styles.startButtonText}>شروع 🎮</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Music Section
const MusicSection: React.FC = () => {
  const { themeColors } = useTheme();
  
  const musicTopics = [
    { id: 'notes', label: 'آشنایی با نت‌ها', icon: '🎼', color: '#FF6B9D', desc: 'دو، ر، می، فا، سول، لا، سی' },
    { id: 'rhythm', label: 'ریتم و ضرب', icon: '🥁', color: '#4ECDC4', desc: 'تپ کردن، کلک زدن، مترونوم' },
    { id: 'instruments', label: 'سازهای موسیقی', icon: '🎹', color: '#A29BFE', desc: 'پیانو، گیتار، ویولون، فلوت' },
    { id: 'ear_training', label: 'آموزش شنوایی', icon: '👂', color: '#FD9644', desc: 'تشخیص نت، فاصله، اکورد' },
    { id: 'composition', label: 'آهنگ‌سازی', icon: '✍️', color: '#55EFC4', desc: 'ساختن ملودی ساده' },
    { id: 'persian_music', label: 'موسیقی ایرانی', icon: '🎭', color: '#FFEAA7', desc: 'دستگاه، آواز، تنبک، ستار' },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🎵 موسیقی و زندگی</Text>
      <Text style={styles.sectionSubtitle}>
        از نت‌خوانی تا آهنگ‌سازی، viaje موسیقی را آغاز کنید
      </Text>
      
      <View style={styles.cardsGrid}>
        {musicTopics.map(topic => (
          <TouchableOpacity key={topic.id} style={[
            styles.topicCard,
            { borderColor: topic.color },
          ]}>
            <Text style={styles.topicIcon}>{topic.icon}</Text>
            <View style={[
              styles.topicColorBar,
              { backgroundColor: topic.color },
            ]} />
            <Text style={[
              styles.topicTitle,
              { color: topic.color },
            ]}>
              {topic.label}
            </Text>
            <Text style={styles.topicDesc}>{topic.desc}</Text>
            <TouchableOpacity style={[
              styles.startButton,
              { backgroundColor: topic.color },
            ]}>
              <Text style={styles.startButtonText}>تمرین 🎵</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Coloring Section
const ColoringSection: React.FC = () => {
  const { themeColors } = useTheme();
  const { coloringPages, addColoringPage, updateColoringPage, deleteColoringPage, familyMembers, settings } = useApp();
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🎨 دفتر رنگ‌آمیزی</Text>
      <Text style={styles.sectionSubtitle}>
        عکس خانواده را به نقاشی کارتونی تبدیل کنید
      </Text>
      
      <ColoringBook
        pages={coloringPages}
        familyMembers={familyMembers}
        onAddPage={addColoringPage}
        onUpdatePage={updateColoringPage}
        onDeletePage={deleteColoringPage}
        animated={!settings.reducedMotion}
      />
    </View>
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
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: tc.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 12,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255,107,157,0.1)',
    borderRadius: 12,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabIconActive: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: tc.textSecondary,
  },
  tabLabelActive: {
    color: '#FF6B9D',
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 160,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: tc.text,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: tc.textSecondary,
    marginBottom: 16,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  methodCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    alignItems: 'center',
    backgroundColor: tc.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  methodIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  methodColorBar: {
    width: '100%',
    height: 3,
    borderRadius: 1.5,
    marginBottom: 8,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  methodDesc: {
    fontSize: 11,
    color: tc.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  methodLevel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FF6B9D',
    backgroundColor: 'rgba(255,107,157,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  levelsList: {
    gap: 10,
  },
  levelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: tc.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  levelBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  levelNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  levelInfo: {
    flex: 1,
  },
  levelLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: tc.text,
  },
  levelDetail: {
    fontSize: 11,
    color: tc.textSecondary,
    marginTop: 2,
  },
  levelProgress: {
    width: 80,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  topicCard: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    backgroundColor: tc.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  topicIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  topicColorBar: {
    width: '100%',
    height: 3,
    borderRadius: 1.5,
    marginBottom: 8,
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  topicLessons: {
    fontSize: 11,
    color: tc.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  topicDesc: {
    fontSize: 11,
    color: tc.textSecondary,
    textAlign: 'center',
    marginBottom: 10,
  },
  startButton: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
});
let styles: any = createStyles({ background:"#FFF8F0", surface:"#fff", text:"#1F2937", textSecondary:"#4B5563", textMuted:"#9CA3AF", primary:"#FF6B9D" }, false);

export default LearningScreen;