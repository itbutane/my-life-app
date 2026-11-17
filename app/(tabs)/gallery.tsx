import React from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, TouchableOpacity, Image, Modal, TextInput, Alert, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useTheme } from '../../hooks/useTheme';
import { useApp } from '../../hooks/AppContext';
import { GalleryPhoto, FamilyMember } from '../../types';

export const GalleryScreen: React.FC = () => {
  const { themeColors, isDark } = useTheme();
  const { galleryPhotos, addGalleryPhoto, updateGalleryPhoto, deleteGalleryPhoto, familyMembers, settings } = useApp();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editing, setEditing] = React.useState<GalleryPhoto | null>(null);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [uri, setUri] = React.useState('');
  const [memberId, setMemberId] = React.useState<FamilyMember['id']>('daughter');

  const openAdd = () => {
    setEditing(null);
    setTitle('');
    setDescription('');
    setUri('');
    setMemberId((settings.activeMemberId || 'maman') as FamilyMember['id']);
    setModalVisible(true);
  };

  const openEdit = (photo: GalleryPhoto) => {
    setEditing(photo);
    setTitle(photo.title);
    setDescription(photo.description || '');
    setUri(photo.uri);
    setMemberId(photo.memberId);
    setModalVisible(true);
  };

  const pickImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['image/*'], copyToCacheDirectory: true, multiple: false });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) return;
      let finalUri = asset.uri;
      if (Platform.OS !== 'web' && FileSystem.documentDirectory) {
        const ext = (asset.name?.split('.').pop() || 'jpg').replace(/[^a-zA-Z0-9]/g, '') || 'jpg';
        const dest = `${FileSystem.documentDirectory}gallery-${Date.now()}.${ext}`;
        try { await FileSystem.copyAsync({ from: asset.uri, to: dest }); finalUri = dest; } catch {}
      }
      setUri(finalUri);
      if (!title.trim()) setTitle(asset.name?.replace(/\.[^.]+$/, '') || 'عکس جدید');
    } catch {
      Alert.alert('خطا', 'انتخاب عکس انجام نشد.');
    }
  };

  const save = () => {
    if (!uri) { Alert.alert('عکس لازم است', 'ابتدا یک عکس انتخاب کنید.'); return; }
    const payload = {
      uri,
      title: title.trim() || 'عکس بدون عنوان',
      description: description.trim(),
      memberId,
      date: editing?.date || new Date().toISOString(),
      tags: editing?.tags || [],
    };
    if (editing) updateGalleryPhoto(editing.id, payload);
    else addGalleryPhoto(payload);
    setModalVisible(false);
  };

  const confirmDelete = (photo: GalleryPhoto) => {
    Alert.alert('حذف عکس', `«${photo.title}» حذف شود؟`, [
      { text: 'انصراف', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => deleteGalleryPhoto(photo.id) },
    ]);
  };

  const memberName = (id: FamilyMember['id']) => familyMembers.find(m => m.id === id)?.name || id;

  const renderItem = ({ item }: { item: GalleryPhoto }) => (
    <View style={[styles.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
      <TouchableOpacity onPress={() => openEdit(item)} activeOpacity={0.9}>
        <Image source={{ uri: item.uri }} style={styles.image} resizeMode="cover" />
      </TouchableOpacity>
      <View style={styles.cardBody}>
        <Text style={[styles.cardTitle, { color: themeColors.text }]} numberOfLines={1}>{item.title}</Text>
        {!!item.description && <Text style={[styles.cardDesc, { color: themeColors.textSecondary }]} numberOfLines={2}>{item.description}</Text>}
        <Text style={[styles.cardMeta, { color: themeColors.textSecondary }]}>{memberName(item.memberId)} • {new Date(item.date).toLocaleDateString('fa-IR')}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionBtn, { borderColor: themeColors.primary }]} onPress={() => openEdit(item)}>
            <Text style={[styles.actionText, { color: themeColors.primary }]}>ویرایش</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { borderColor: '#E17055' }]} onPress={() => confirmDelete(item)}>
            <Text style={[styles.actionText, { color: '#E17055' }]}>حذف</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top', 'left', 'right'] as const}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={themeColors.background} translucent />
      <View style={styles.container}>
        <View style={[styles.header, { borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: themeColors.text }]}>🖼️ گالری خانواده</Text>
            <Text style={[styles.headerSubtitle, { color: themeColors.textSecondary }]}>{galleryPhotos.length} عکس • ذخیره آفلاین</Text>
          </View>
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: themeColors.primary }]} onPress={openAdd}>
            <Text style={styles.addBtnText}>+ افزودن</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={galleryPhotos}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          numColumns={2}
          columnWrapperStyle={galleryPhotos.length ? { gap: 12 } : undefined}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📷</Text>
              <Text style={[styles.emptyTitle, { color: themeColors.text }]}>هنوز عکسی ثبت نشده</Text>
              <Text style={[styles.emptyDesc, { color: themeColors.textSecondary }]}>عکس‌های خانواده را اضافه، ویرایش یا حذف کنید. عکس‌ها در دستگاه ذخیره می‌شوند و می‌توان از آن‌ها در دفتر رنگ‌آمیزی استفاده کرد.</Text>
              <TouchableOpacity style={[styles.addBtn, { backgroundColor: themeColors.primary, marginTop: 12 }]} onPress={openAdd}>
                <Text style={styles.addBtnText}>افزودن اولین عکس</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? themeColors.surface : '#fff' }]}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>{editing ? 'ویرایش عکس' : 'افزودن عکس'}</Text>
              <TouchableOpacity style={[styles.pickBtn, { borderColor: themeColors.primary }]} onPress={pickImage}>
                <Text style={[styles.pickBtnText, { color: themeColors.primary }]}>{uri ? 'تغییر عکس' : 'انتخاب عکس از دستگاه'}</Text>
              </TouchableOpacity>
              {uri ? <Image source={{ uri }} style={styles.preview} resizeMode="cover" /> : null}
              <Text style={[styles.label, { color: themeColors.text }]}>عنوان</Text>
              <TextInput style={[styles.input, { color: themeColors.text, borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' }]} value={title} onChangeText={setTitle} placeholder="عنوان عکس" placeholderTextColor={themeColors.textSecondary} />
              <Text style={[styles.label, { color: themeColors.text }]}>توضیح</Text>
              <TextInput style={[styles.input, styles.inputMulti, { color: themeColors.text, borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' }]} value={description} onChangeText={setDescription} placeholder="توضیح (اختیاری)" placeholderTextColor={themeColors.textSecondary} multiline />
              <Text style={[styles.label, { color: themeColors.text }]}>صاحب عکس</Text>
              <View style={styles.memberRow}>
                {familyMembers.map(m => (
                  <TouchableOpacity key={m.id} style={[styles.memberChip, { borderColor: memberId === m.id ? themeColors.primary : 'rgba(0,0,0,0.12)', backgroundColor: memberId === m.id ? themeColors.primary : 'transparent' }]} onPress={() => setMemberId(m.id)}>
                    <Text style={{ color: memberId === m.id ? '#fff' : themeColors.text, fontSize: 12, fontWeight: '600' }}>{m.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]} onPress={() => setModalVisible(false)}>
                  <Text style={{ color: themeColors.text, fontWeight: '600' }}>انصراف</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: themeColors.primary }]} onPress={save}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>{editing ? 'ذخیره تغییرات' : 'افزودن'}</Text>
                </TouchableOpacity>
              </View>
              {editing && (
                <TouchableOpacity style={[styles.deleteFull, { borderColor: '#E17055' }]} onPress={() => { setModalVisible(false); confirmDelete(editing); }}>
                  <Text style={{ color: '#E17055', fontWeight: '700' }}>حذف این عکس</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, gap: 12 },
  headerTitle: { fontSize: 22, fontWeight: '800' },
  headerSubtitle: { fontSize: 12, marginTop: 2 },
  addBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  list: { padding: 16, paddingBottom: 140 },
  card: { flex: 1, borderRadius: 16, overflow: 'hidden', marginBottom: 12, borderWidth: 1, minWidth: '47%' },
  image: { width: '100%', height: 140, backgroundColor: 'rgba(0,0,0,0.04)' },
  cardBody: { padding: 10 },
  cardTitle: { fontSize: 14, fontWeight: '700' },
  cardDesc: { fontSize: 11, marginTop: 2, lineHeight: 16 },
  cardMeta: { fontSize: 10, marginTop: 6 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  actionBtn: { flex: 1, paddingVertical: 7, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  actionText: { fontSize: 12, fontWeight: '600' },
  empty: { alignItems: 'center', padding: 24, marginTop: 40, width: '100%' },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyDesc: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%' },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  pickBtn: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 14, padding: 14, alignItems: 'center', marginBottom: 12 },
  pickBtnText: { fontWeight: '700' },
  preview: { width: '100%', height: 180, borderRadius: 14, marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 4 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, marginBottom: 8 },
  inputMulti: { minHeight: 70, textAlignVertical: 'top' },
  memberRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  memberChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 8, marginBottom: 10 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  deleteFull: { borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 20 },
});

export default GalleryScreen;
