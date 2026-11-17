import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, TextInput, ScrollView, KeyboardAvoidingView, Platform, FlatList, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Memory, FamilyMember } from '../types';

interface MemoryBookProps {
  memories: Memory[];
  familyMembers: FamilyMember[];
  onAddMemory: (memory: Omit<Memory, 'id'>) => void;
  onUpdateMemory: (id: string, updates: Partial<Memory>) => void;
  onDeleteMemory: (id: string) => void;
  animated?: boolean;
}

const TYPE_OPTIONS: { value: Memory['type']; label: string; emoji: string; color: string }[] = [
  { value: 'memory', label: 'خاطره', emoji: '📸', color: '#FF6B9D' },
  { value: 'wish', label: 'آرزو', emoji: '⭐', color: '#A29BFE' },
  { value: 'love', label: 'پیام عاشقانه', emoji: '💕', color: '#FD9644' },
  { value: 'legacy', label: 'یادگاری', emoji: '🏛️', color: '#4ECDC4' },
];

const STICKERS = ['✨', '🌸', '💖', '🌟', '🦋', '🌈', '🌿', '💫', '🎈', '🍀', '🌙', '☀️'];

export const MemoryBook: React.FC<MemoryBookProps> = ({
  memories,
  familyMembers,
  onAddMemory,
  onUpdateMemory,
  onDeleteMemory,
  animated = true,
}) => {
  const { themeColors, isDark } = useTheme();
  const [showForm, setShowForm] = React.useState(false);
  const [editingMemory, setEditingMemory] = React.useState<Memory | null>(null);
  const [formData, setFormData] = React.useState({
    type: 'memory' as Memory['type'],
    author: 'baba' as FamilyMember['id'],
    content: '',
    imageUri: '',
    stickers: [] as string[],
    isLocked: false,
  });
  const [entranceAnim] = React.useState(() => new Animated.Value(0));
  const [filterType, setFilterType] = React.useState<Memory['type'] | 'all'>('all');

  React.useEffect(() => {
    if (!animated) { entranceAnim.setValue(1); return; }
    entranceAnim.setValue(0);
    Animated.timing(entranceAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [animated, entranceAnim]);

  const filteredMemories = filterType === 'all' ? memories : memories.filter(m => m.type === filterType);

  const handleSubmit = () => {
    if (!formData.content.trim()) return;
    const memoryData = { ...formData, date: editingMemory?.date || new Date().toISOString() };
    if (editingMemory) onUpdateMemory(editingMemory.id, memoryData);
    else onAddMemory(memoryData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ type: 'memory', author: 'baba', content: '', imageUri: '', stickers: [], isLocked: false });
    setEditingMemory(null);
    setShowForm(false);
  };

  const startEdit = (memory: Memory) => {
    setEditingMemory(memory);
    setFormData({ type: memory.type, author: memory.author, content: memory.content, imageUri: memory.imageUri || '', stickers: memory.stickers || [], isLocked: memory.isLocked });
    setShowForm(true);
  };

  const addSticker = (sticker: string) => { if (!formData.stickers.includes(sticker)) setFormData(prev => ({ ...prev, stickers: [...prev.stickers, sticker] })); };
  const removeSticker = (sticker: string) => { setFormData(prev => ({ ...prev, stickers: prev.stickers.filter(s => s !== sticker) })); };

  const opacity = entranceAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const translateY = entranceAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] });

  const confirmDelete = (memory: Memory) => {
    Alert.alert('حذف خاطره', 'این خاطره حذف شود؟', [
      { text: 'انصراف', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => onDeleteMemory(memory.id) },
    ]);
  };

  if (showForm) {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.formContainer}>
        <Animated.View style={[styles.formModal, { opacity, transform: [{ translateY }], backgroundColor: isDark ? themeColors.surface : '#fff' }]}>
          <View style={[styles.formHeader, { borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
            <Text style={[styles.formTitle, { color: themeColors.text }]}>{editingMemory ? 'ویرایش خاطره' : 'خاطره جدید ✨'}</Text>
            <TouchableOpacity onPress={resetForm} style={[styles.closeButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)' }]}>
              <Text style={[styles.closeIcon, { color: themeColors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formSection}>
              <Text style={[styles.formLabel, { color: themeColors.text }]}>نوع خاطره</Text>
              <View style={styles.typeSelector}>
                {TYPE_OPTIONS.map(opt => (
                  <TouchableOpacity key={opt.value} style={[styles.typeOption, formData.type === opt.value && styles.typeOptionSelected, { borderColor: opt.color }]} onPress={() => setFormData(prev => ({ ...prev, type: opt.value }))}>
                    <Text style={styles.typeEmoji}>{opt.emoji}</Text>
                    <Text style={[styles.typeLabel, { color: formData.type === opt.value ? opt.color : themeColors.textSecondary }]}>{opt.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.formLabel, { color: themeColors.text }]}>نویسنده</Text>
              <View style={styles.authorSelector}>
                {familyMembers.map(member => (
                  <TouchableOpacity key={member.id} style={[styles.authorOption, formData.author === member.id && styles.authorOptionSelected, { borderColor: member.color }]} onPress={() => setFormData(prev => ({ ...prev, author: member.id }))}>
                    <Text style={styles.authorEmoji}>{member.id === 'baba' ? '👨‍🦱' : member.id === 'maman' ? '👩‍🦰' : '🌸'}</Text>
                    <Text style={[styles.authorName, { color: formData.author === member.id ? member.color : themeColors.text }]}>{member.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.formLabel, { color: themeColors.text }]}>متن خاطره</Text>
              <TextInput style={[styles.textInput, { color: themeColors.text, borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)', backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff' }]} multiline numberOfLines={6} placeholder="خاطره، آرزو یا پیام خود را بنویسید..." value={formData.content} onChangeText={text => setFormData(prev => ({ ...prev, content: text }))} placeholderTextColor={themeColors.textMuted} />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.formLabel, { color: themeColors.text }]}>استیکرها</Text>
              <View style={styles.stickerPicker}>
                {STICKERS.map(sticker => (
                  <TouchableOpacity key={sticker} style={[styles.stickerButton, formData.stickers.includes(sticker) && styles.stickerButtonSelected]} onPress={() => formData.stickers.includes(sticker) ? removeSticker(sticker) : addSticker(sticker)}>
                    <Text style={styles.stickerEmoji}>{sticker}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {formData.stickers.length > 0 && (
                <View style={styles.selectedStickers}>{formData.stickers.map((s, i) => (<Text key={i} style={styles.selectedSticker}>{s}</Text>))}</View>
              )}
            </View>

            <View style={styles.formSection}>
              <TouchableOpacity style={[styles.toggleRow, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }, formData.isLocked && styles.toggleRowActive]} onPress={() => setFormData(prev => ({ ...prev, isLocked: !prev.isLocked }))}>
                <View style={[styles.toggleTrack, formData.isLocked && styles.toggleTrackActive]}>
                  <Animated.View style={[styles.toggleThumb, { transform: [{ translateX: formData.isLocked ? 24 : 0 }] }]} />
                </View>
                <Text style={[styles.toggleLabel, { color: themeColors.text }]}>قفل خاطره (شخصی)</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>{editingMemory ? 'ذخیره تغییرات ✨' : 'ذخیره خاطره ✨'}</Text>
            </TouchableOpacity>
            {editingMemory && (
              <TouchableOpacity style={styles.deleteButton} onPress={() => { onDeleteMemory(editingMemory.id); resetForm(); }}>
                <Text style={styles.deleteButtonText}>حذف این خاطره</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.header}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
          {(['all', 'memory', 'wish', 'love', 'legacy'] as const).map(type => (
            <TouchableOpacity key={type} style={[styles.filterChip, filterType === type && styles.filterChipActive, type !== 'all' && { backgroundColor: TYPE_OPTIONS.find(o => o.value === type)?.color + '20' }]} onPress={() => setFilterType(type)}>
              <Text style={[styles.filterChipText, { color: themeColors.textSecondary }, filterType === type && styles.filterChipTextActive, type !== 'all' && { color: TYPE_OPTIONS.find(o => o.value === type)?.color }]}>
                {type === 'all' ? 'همه' : TYPE_OPTIONS.find(o => o.value === type)?.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredMemories.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📖</Text>
          <Text style={[styles.emptyTitle, { color: themeColors.text }]}>{filterType === 'all' ? 'هنوز خاطره‌ای ثبت نشده' : 'خاطره‌ای از این نوع وجود ندارد'}</Text>
          <Text style={[styles.emptySubtitle, { color: themeColors.textSecondary }]}>اولین خاطره خانوادگی خود را ثبت کنید</Text>
          <TouchableOpacity style={styles.addFirstButton} onPress={() => setShowForm(true)}>
            <Text style={styles.addFirstButtonText}>+ ایجاد خاطره جدید</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredMemories}
          keyExtractor={(m: Memory) => m.id}
          renderItem={({ item }: { item: Memory }) => (
            <TouchableOpacity onPress={() => startEdit(item)} onLongPress={() => confirmDelete(item)} style={styles.memoryItem}>
              <View style={[styles.memoryCard, { borderLeftColor: TYPE_OPTIONS.find(o => o.value === item.type)?.color, backgroundColor: isDark ? themeColors.surface : 'rgba(255,255,255,0.95)' }]}>
                <View style={styles.memoryCardHeader}>
                  <View style={[styles.memoryTypeBadge, { backgroundColor: TYPE_OPTIONS.find(o => o.value === item.type)?.color }]}>
                    <Text style={styles.memoryTypeEmoji}>{TYPE_OPTIONS.find(o => o.value === item.type)?.emoji}</Text>
                  </View>
                  <View style={styles.memoryAuthor}>
                    <Text style={styles.memoryAuthorEmoji}>{item.author === 'baba' ? '👨‍🦱' : item.author === 'maman' ? '👩‍🦰' : '🌸'}</Text>
                    <Text style={[styles.memoryAuthorName, { color: themeColors.text }]}>{item.author === 'baba' ? 'بابا' : item.author === 'maman' ? 'مامان' : 'دختر'}</Text>
                  </View>
                  {item.isLocked && <Text style={styles.lockIcon}>🔒</Text>}
                </View>
                <Text style={[styles.memoryContent, { color: themeColors.text }]}>{item.content}</Text>
                {item.stickers?.length > 0 && <View style={styles.memoryStickers}>{item.stickers.map((s, i) => (<Text key={i} style={styles.memorySticker}>{s}</Text>))}</View>}
                <View style={styles.memoryFooter}>
                  <Text style={[styles.memoryDate, { color: themeColors.textMuted }]}>{new Date(item.date).toLocaleString('fa-IR')}</Text>
                  <Text style={[styles.memoryHint, { color: themeColors.textMuted }]}>لمس: ویرایش • نگه‌داشتن: حذف</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setShowForm(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  header: { paddingHorizontal: 16, paddingBottom: 12 },
  filterContainer: { flexDirection: 'row', gap: 8, paddingRight: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.03)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  filterChipActive: { borderWidth: 2 },
  filterChipText: { fontSize: 12, fontWeight: '600' },
  filterChipTextActive: { fontWeight: '700' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24 },
  addFirstButton: { paddingHorizontal: 28, paddingVertical: 14, borderRadius: 28, backgroundColor: '#FF6B9D', shadowColor: '#FF6B9D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  addFirstButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  memoryItem: { marginBottom: 12 },
  memoryCard: { borderRadius: 16, padding: 16, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  memoryCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  memoryTypeBadge: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  memoryTypeEmoji: { fontSize: 14 },
  memoryAuthor: { flexDirection: 'row', alignItems: 'center' },
  memoryAuthorEmoji: { fontSize: 18, marginRight: 6 },
  memoryAuthorName: { fontSize: 13, fontWeight: '600' },
  lockIcon: { fontSize: 14 },
  memoryContent: { fontSize: 15, lineHeight: 24, marginBottom: 8 },
  memoryStickers: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  memorySticker: { fontSize: 16, marginRight: 6 },
  memoryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  memoryDate: { fontSize: 11, fontWeight: '500' },
  memoryHint: { fontSize: 10 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: '#FF6B9D', alignItems: 'center', justifyContent: 'center', shadowColor: '#FF6B9D', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  fabIcon: { fontSize: 28, fontWeight: '300', color: '#fff' },
  formContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 16 },
  formModal: { borderRadius: 24, maxHeight: '90%', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.3, shadowRadius: 40, elevation: 20 },
  formHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1 },
  formTitle: { fontSize: 18, fontWeight: '700' },
  closeButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  closeIcon: { fontSize: 18, fontWeight: '300' },
  formContent: { padding: 20 },
  formSection: { marginBottom: 24 },
  formLabel: { fontSize: 13, fontWeight: '600', marginBottom: 10 },
  typeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeOption: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 2, backgroundColor: 'rgba(0,0,0,0.02)' },
  typeOptionSelected: { backgroundColor: 'rgba(255,107,157,0.1)' },
  typeEmoji: { fontSize: 16, marginRight: 6 },
  typeLabel: { fontSize: 13, fontWeight: '600' },
  authorSelector: { flexDirection: 'row', gap: 12 },
  authorOption: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 16, borderWidth: 2, backgroundColor: 'rgba(0,0,0,0.02)', justifyContent: 'center' },
  authorOptionSelected: { backgroundColor: 'rgba(255,107,157,0.1)' },
  authorEmoji: { fontSize: 20, marginRight: 8 },
  authorName: { fontSize: 14, fontWeight: '600' },
  textInput: { borderWidth: 1, borderRadius: 16, padding: 16, fontSize: 15, textAlignVertical: 'top' },
  stickerPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stickerButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.03)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  stickerButtonSelected: { borderColor: '#FF6B9D', backgroundColor: 'rgba(255,107,157,0.1)' },
  stickerEmoji: { fontSize: 20 },
  selectedStickers: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  selectedSticker: { fontSize: 18 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12 },
  toggleRowActive: { backgroundColor: 'rgba(255,107,157,0.1)' },
  toggleTrack: { width: 52, height: 28, borderRadius: 14, backgroundColor: '#B2BEC3', marginRight: 12 },
  toggleTrackActive: { backgroundColor: '#FF6B9D' },
  toggleThumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },
  toggleLabel: { fontSize: 14, fontWeight: '500' },
  submitButton: { paddingVertical: 16, borderRadius: 16, backgroundColor: '#FF6B9D', alignItems: 'center', marginTop: 8, shadowColor: '#FF6B9D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  submitButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  deleteButton: { paddingVertical: 14, borderRadius: 16, borderWidth: 1, borderColor: '#E17055', alignItems: 'center', marginTop: 10 },
  deleteButtonText: { fontSize: 14, fontWeight: '700', color: '#E17055' },
});

export default MemoryBook;
