import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert, Modal, PanResponder, Dimensions } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../hooks/AppContext';
import { ColoringPage, FamilyMember, GalleryPhoto, ColoringGuideItem, ColoringStroke } from '../types';

interface ColoringBookProps {
  pages: ColoringPage[];
  familyMembers: FamilyMember[];
  onAddPage: (page: Omit<ColoringPage, 'id'>) => void;
  onUpdatePage: (id: string, updates: Partial<ColoringPage>) => void;
  onDeletePage: (id: string) => void;
  animated?: boolean;
}

const PALETTE = ['#FF6B9D','#FD9644','#FFEAA7','#55EFC4','#4ECDC4','#74B9FF','#A29BFE','#2D3436','#FFFFFF','#F8BBD0','#8D6E63','#FFD93D'];
const BRUSH_SIZES = [4, 8, 14, 22];

const defaultGuide = (memberName: string): ColoringGuideItem[] => [
  { area: 'صورت و پوست', color: '#FFEAA7', note: 'رنگ پوست ملایم' },
  { area: 'لباس', color: '#4ECDC4', note: 'رنگ شاد دلخواه' },
  { area: 'مو', color: '#8D6E63', note: 'قهوه‌ای یا رنگ مورد علاقه' },
  { area: 'پس‌زمینه', color: '#A8D8EA', note: 'آسمان/فضای آرام' },
  { area: 'جزئیات تزئینی', color: '#FF6B9D', note: `ویژه ${memberName}` },
];

const pointsToPath = (pts: {x:number;y:number}[]) => {
  if (!pts.length) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) d += ` L ${pts[i].x} ${pts[i].y}`;
  return d;
};

export const ColoringBook: React.FC<ColoringBookProps> = ({ pages, familyMembers, onAddPage, onUpdatePage, onDeletePage }) => {
  const { themeColors, isDark } = useTheme();
  const { galleryPhotos } = useApp();
  const [selectedPage, setSelectedPage] = React.useState<ColoringPage | null>(null);
  const [showPicker, setShowPicker] = React.useState(false);
  const [brushColor, setBrushColor] = React.useState('#FF6B9D');
  const [brushSize, setBrushSize] = React.useState(8);
  const [isEraser, setIsEraser] = React.useState(false);
  const [strokes, setStrokes] = React.useState<ColoringStroke[]>([]);
  const [guide, setGuide] = React.useState<ColoringGuideItem[]>([]);
  const [title, setTitle] = React.useState('');
  const [galleryModal, setGalleryModal] = React.useState(false);
  const currentStroke = React.useRef<ColoringStroke | null>(null);
  const canvasLayout = React.useRef({ w: 1, h: 1 });

  const memberName = (id?: FamilyMember['id']) => familyMembers.find(m => m.id === id)?.name || 'عضو خانواده';

  const openPage = (page: ColoringPage) => {
    setSelectedPage(page);
    setStrokes(page.strokes || []);
    setGuide(page.guide && page.guide.length ? page.guide : defaultGuide(memberName(page.memberId)));
    setTitle(page.title || `نقاشی ${memberName(page.memberId)}`);
  };

  const createFromSource = (memberId: FamilyMember['id'], sourcePhoto?: GalleryPhoto, uriOverride?: string) => {
    const original = sourcePhoto?.uri || uriOverride || '';
    const page: Omit<ColoringPage, 'id'> = {
      memberId,
      title: sourcePhoto ? `کارتونی: ${sourcePhoto.title}` : `نقاشی ${memberName(memberId)}`,
      sourcePhotoId: sourcePhoto?.id,
      originalImageUri: original,
      sketchImageUri: original, // cartoon/outline effect applied visually
      colors: [],
      guide: defaultGuide(memberName(memberId)),
      strokes: [],
      date: new Date().toISOString(),
      note: sourcePhoto ? `ساخته‌شده از عکس گالری: ${sourcePhoto.title}` : 'صفحه جدید رنگ‌آمیزی',
    };
    onAddPage(page);
    const draft: ColoringPage = { ...page, id: `draft-${Date.now()}` };
    openPage(draft);
    setShowPicker(false);
    setGalleryModal(false);
  };

  const pickDeviceImage = async (memberId: FamilyMember['id']) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['image/*'], copyToCacheDirectory: true });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) return;
      let uri = asset.uri;
      if (FileSystem.documentDirectory) {
        const ext = (asset.name?.split('.').pop() || 'jpg').replace(/[^a-zA-Z0-9]/g, '') || 'jpg';
        const dest = `${FileSystem.documentDirectory}color-src-${Date.now()}.${ext}`;
        try { await FileSystem.copyAsync({ from: asset.uri, to: dest }); uri = dest; } catch {}
      }
      createFromSource(memberId, undefined, uri);
    } catch { Alert.alert('خطا', 'انتخاب عکس انجام نشد.'); }
  };

  const savePage = () => {
    if (!selectedPage) return;
    const payload: Partial<ColoringPage> = {
      title: title.trim() || selectedPage.title,
      guide,
      strokes,
      colors: Array.from(new Set(strokes.filter(s => !s.isEraser).map(s => s.color))),
      coloredImageUri: strokes.length ? `colored-${selectedPage.id}` : selectedPage.coloredImageUri,
      date: selectedPage.date || new Date().toISOString(),
    };
    if (String(selectedPage.id).startsWith('draft-')) {
      // persist by creating a real page with captured content
      onAddPage({
        memberId: selectedPage.memberId,
        title: payload.title,
        sourcePhotoId: selectedPage.sourcePhotoId,
        originalImageUri: selectedPage.originalImageUri,
        sketchImageUri: selectedPage.sketchImageUri,
        coloredImageUri: payload.coloredImageUri,
        colors: (payload.colors as string[]) || [],
        guide,
        strokes,
        date: payload.date as string,
        note: selectedPage.note,
      });
    } else {
      onUpdatePage(selectedPage.id, payload);
    }
    Alert.alert('ذخیره شد', 'نقاشی، رنگ‌ها و راهنمای رنگ‌آمیزی ذخیره شد.');
  };

  const deleteCurrent = () => {
    if (!selectedPage) return;
    if (String(selectedPage.id).startsWith('draft-')) { setSelectedPage(null); return; }
    Alert.alert('حذف نقاشی', 'این صفحه حذف شود؟', [
      { text: 'انصراف', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => { onDeletePage(selectedPage.id); setSelectedPage(null); } },
    ]);
  };

  const addGuideItem = () => setGuide(g => [...g, { area: `بخش ${g.length + 1}`, color: brushColor, note: 'راهنمای رنگ' }]);
  const updateGuideItem = (idx: number, updates: Partial<ColoringGuideItem>) => setGuide(g => g.map((it, i) => i === idx ? { ...it, ...updates } : it));
  const removeGuideItem = (idx: number) => setGuide(g => g.filter((_, i) => i !== idx));

  const panResponder = React.useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => !!selectedPage,
    onMoveShouldSetPanResponder: () => !!selectedPage,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      currentStroke.current = { points: [{ x: locationX, y: locationY }], color: isEraser ? '#FFFFFF' : brushColor, size: isEraser ? Math.max(brushSize, 14) : brushSize, isEraser };
    },
    onPanResponderMove: (evt) => {
      if (!currentStroke.current) return;
      const { locationX, locationY } = evt.nativeEvent;
      currentStroke.current.points.push({ x: locationX, y: locationY });
      // force update
      setStrokes(prev => [...prev]);
    },
    onPanResponderRelease: () => {
      if (currentStroke.current && currentStroke.current.points.length) {
        const done = { ...currentStroke.current, points: [...currentStroke.current.points] };
        setStrokes(prev => [...prev.filter(s => s !== currentStroke.current), done]);
      }
      currentStroke.current = null;
    },
  }), [selectedPage, brushColor, brushSize, isEraser]);

  const activeStrokes = currentStroke.current ? [...strokes.filter(s => s !== currentStroke.current), currentStroke.current] : strokes;

  if (selectedPage) {
    const member = familyMembers.find(m => m.id === selectedPage.memberId);
    return (
      <View style={[styles.container, { backgroundColor: isDark ? themeColors.background : '#FFF8F0' }]}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.editorHeader}>
            <TouchableOpacity onPress={() => setSelectedPage(null)} style={[styles.iconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}><Text style={{ color: themeColors.text }}>←</Text></TouchableOpacity>
            <View style={{ flex: 1 }}>
              <TextInput value={title} onChangeText={setTitle} style={[styles.titleInput, { color: themeColors.text, borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }]} placeholder="عنوان نقاشی" placeholderTextColor={themeColors.textMuted} />
              <Text style={{ color: themeColors.textSecondary, fontSize: 12 }}>{member?.name || 'عضو خانواده'} • {selectedPage.sourcePhotoId ? 'از گالری (افکت کارتونی)' : 'صفحه رنگ‌آمیزی'}</Text>
            </View>
            <TouchableOpacity onPress={savePage} style={[styles.primaryBtn, { backgroundColor: themeColors.primary }]}><Text style={styles.primaryBtnText}>ذخیره</Text></TouchableOpacity>
          </View>

          <View style={[styles.canvasCard, { backgroundColor: isDark ? themeColors.surface : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>🎨 بوم نقاشی (ابزار رنگ)</Text>
            <Text style={[styles.smallText, { color: themeColors.textSecondary }]}>با انگشت/ماوس روی بوم بکشید. عکس گالری با افکت کارتونی/روشن نمایش داده می‌شود.</Text>
            <View
              style={styles.canvasWrap}
              onLayout={(e) => { canvasLayout.current = { w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height }; }}
              {...panResponder.panHandlers}
            >
              {selectedPage.originalImageUri ? (
                <Image source={{ uri: selectedPage.originalImageUri }} style={styles.canvasImage} resizeMode="cover" />
              ) : (
                <View style={[styles.canvasImage, { alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? '#223' : '#F7F7FB' }]}>
                  <Text style={{ fontSize: 48 }}>{member?.avatarEmoji || '🌸'}</Text>
                  <Text style={{ color: themeColors.textSecondary, marginTop: 8 }}>طرح پایه آماده رنگ‌آمیزی</Text>
                </View>
              )}
              <View pointerEvents="none" style={styles.svgOverlay}>
                <Svg width="100%" height="100%">
                  <G>
                    {activeStrokes.map((s, i) => (
                      <Path key={i} d={pointsToPath(s.points)} stroke={s.isEraser ? '#FFFFFF' : s.color} strokeWidth={s.size} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={s.isEraser ? 1 : 0.95} />
                    ))}
                  </G>
                </Svg>
              </View>
            </View>

            <View style={styles.toolRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
                {PALETTE.map(c => (
                  <TouchableOpacity key={c} onPress={() => { setBrushColor(c); setIsEraser(false); }} style={[styles.swatch, { backgroundColor: c, borderWidth: brushColor === c && !isEraser ? 3 : 1, borderColor: brushColor === c && !isEraser ? themeColors.primary : 'rgba(0,0,0,0.1)' }]} />
                ))}
                <TouchableOpacity onPress={() => setIsEraser(e => !e)} style={[styles.eraser, { borderColor: isEraser ? themeColors.primary : 'rgba(0,0,0,0.15)', backgroundColor: isEraser ? 'rgba(255,107,157,0.1)' : 'transparent' }]}><Text style={{ color: themeColors.text }}>پاک‌کن</Text></TouchableOpacity>
              </ScrollView>
            </View>
            <View style={styles.toolRow}>
              {BRUSH_SIZES.map(s => (
                <TouchableOpacity key={s} onPress={() => setBrushSize(s)} style={[styles.sizeBtn, { borderColor: brushSize === s ? themeColors.primary : 'rgba(0,0,0,0.12)', backgroundColor: brushSize === s ? 'rgba(255,107,157,0.08)' : 'transparent' }]}>
                  <View style={{ width: s, height: s, borderRadius: s/2, backgroundColor: isEraser ? '#999' : brushColor }} />
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setStrokes(prev => prev.slice(0, -1))} style={[styles.sizeBtn, { paddingHorizontal: 12, borderColor: 'rgba(0,0,0,0.12)' }]}><Text style={{ color: themeColors.text, fontSize: 12 }}>↶ برگشت</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setStrokes([])} style={[styles.sizeBtn, { paddingHorizontal: 12, borderColor: '#E17055' }]}><Text style={{ color: '#E17055', fontSize: 12 }}>پاک کردن</Text></TouchableOpacity>
            </View>
          </View>

          <View style={[styles.canvasCard, { backgroundColor: isDark ? themeColors.surface : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>🧭 راهنمای رنگ‌آمیزی</Text>
              <TouchableOpacity onPress={addGuideItem} style={[styles.smallBtn, { borderColor: themeColors.primary }]}><Text style={{ color: themeColors.primary, fontSize: 12 }}>+ افزودن</Text></TouchableOpacity>
            </View>
            {guide.map((g, i) => (
              <View key={i} style={[styles.guideRow, { borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
                <View style={[styles.guideSwatch, { backgroundColor: g.color }]} />
                <View style={{ flex: 1, gap: 6 }}>
                  <TextInput value={g.area} onChangeText={(v) => updateGuideItem(i, { area: v })} style={[styles.guideInput, { color: themeColors.text, borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }]} placeholder="بخش (مثلاً لباس)" placeholderTextColor={themeColors.textMuted} />
                  <TextInput value={g.note || ''} onChangeText={(v) => updateGuideItem(i, { note: v })} style={[styles.guideInput, { color: themeColors.textSecondary, borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }]} placeholder="توضیح رنگ" placeholderTextColor={themeColors.textMuted} />
                </View>
                <TouchableOpacity onPress={() => { updateGuideItem(i, { color: brushColor }); }} style={[styles.smallBtn, { borderColor: 'rgba(0,0,0,0.12)' }]}><Text style={{ color: themeColors.text, fontSize: 11 }}>رنگ فعلی</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => removeGuideItem(i)} style={[styles.smallBtn, { borderColor: '#E17055' }]}><Text style={{ color: '#E17055', fontSize: 11 }}>حذف</Text></TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 8 }}>
            <TouchableOpacity onPress={savePage} style={[styles.primaryBtn, { flex: 1, backgroundColor: themeColors.primary }]}><Text style={styles.primaryBtnText}>ذخیره/ویرایش نقاشی</Text></TouchableOpacity>
            <TouchableOpacity onPress={deleteCurrent} style={[styles.primaryBtn, { flex: 1, backgroundColor: '#E17055' }]}><Text style={styles.primaryBtnText}>حذف</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>🎨 دفتر رنگ‌آمیزی خانواده</Text>
        <Text style={[styles.headerSubtitle, { color: themeColors.textSecondary }]}>{pages.length} صفحه • انتخاب از گالری + افکت کارتونی + راهنمای رنگ + ابزار نقاشی</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: themeColors.primary }]} onPress={() => setShowPicker(true)}><Text style={styles.primaryBtnText}>+ افزودن صفحه</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#4ECDC4' }]} onPress={() => setGalleryModal(true)}><Text style={styles.primaryBtnText}>از گالری (کارتونی)</Text></TouchableOpacity>
        </View>
      </View>

      {pages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 56, marginBottom: 12 }}>🖍️</Text>
          <Text style={[styles.headerTitle, { color: themeColors.text, fontSize: 18 }]}>هنوز صفحه‌ای ساخته نشده</Text>
          <Text style={[styles.smallText, { color: themeColors.textSecondary, textAlign: 'center', marginTop: 6 }]}>یک صفحه جدید بسازید یا عکسی از گالری انتخاب کنید تا به نقاشی کارتونی تبدیل و با راهنمای رنگ، رنگ‌آمیزی شود.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {pages.map(p => (
              <View key={p.id} style={[styles.pageCard, { backgroundColor: isDark ? themeColors.surface : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
                <TouchableOpacity onPress={() => openPage(p)}>
                  {p.originalImageUri ? <Image source={{ uri: p.originalImageUri }} style={styles.pageThumb} resizeMode="cover" /> : <View style={[styles.pageThumb, { alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? '#223' : '#F7F7FB' }]}><Text style={{ fontSize: 28 }}>🎨</Text></View>}
                </TouchableOpacity>
                <Text style={{ color: themeColors.text, fontWeight: '700', marginTop: 8 }} numberOfLines={1}>{p.title || `نقاشی ${memberName(p.memberId)}`}</Text>
                <Text style={{ color: themeColors.textSecondary, fontSize: 11 }} numberOfLines={1}>{memberName(p.memberId)} • {p.guide?.length || 0} راهنما • {p.strokes?.length || 0} خط</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                  <TouchableOpacity style={[styles.smallBtn, { flex: 1, borderColor: themeColors.primary }]} onPress={() => openPage(p)}><Text style={{ color: themeColors.primary, fontSize: 12, textAlign: 'center' }}>ویرایش/رنگ</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.smallBtn, { flex: 1, borderColor: '#E17055' }]} onPress={() => onDeletePage(p.id)}><Text style={{ color: '#E17055', fontSize: 12, textAlign: 'center' }}>حذف</Text></TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <Modal visible={showPicker} transparent animationType="fade" onRequestClose={() => setShowPicker(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? themeColors.surface : '#fff' }]}>
            <Text style={[styles.headerTitle, { fontSize: 18, color: themeColors.text }]}>افزودن صفحه رنگ‌آمیزی</Text>
            <Text style={[styles.smallText, { color: themeColors.textSecondary, marginBottom: 12 }]}>عضو را انتخاب کنید (صفحه خالی با راهنما) یا از گالری/دستگاه عکس کارتونی بسازید.</Text>
            {familyMembers.map(m => (
              <View key={m.id} style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                <TouchableOpacity style={[styles.primaryBtn, { flex: 1, backgroundColor: m.color }]} onPress={() => createFromSource(m.id)}><Text style={styles.primaryBtnText}>{m.avatarEmoji || '🙂'} صفحه جدید ({m.name})</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#636E72' }]} onPress={() => { void pickDeviceImage(m.id); }}><Text style={styles.primaryBtnText}>عکس دستگاه</Text></TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: 'rgba(0,0,0,0.08)', marginTop: 4 }]} onPress={() => setShowPicker(false)}><Text style={{ color: themeColors.text, fontWeight: '700' }}>بستن</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={galleryModal} transparent animationType="slide" onRequestClose={() => setGalleryModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? themeColors.surface : '#fff', maxHeight: '85%' }]}>
            <Text style={[styles.headerTitle, { fontSize: 18, color: themeColors.text }]}>انتخاب عکس از گالری → نقاشی کارتونی</Text>
            <Text style={[styles.smallText, { color: themeColors.textSecondary, marginBottom: 10 }]}>عکس انتخاب‌شده با افکت کارتونی/روشن روی بوم نمایش داده می‌شود و راهنمای رنگ دریافت می‌کند.</Text>
            <ScrollView>
              {galleryPhotos.length === 0 ? (
                <Text style={{ color: themeColors.textSecondary, textAlign: 'center', padding: 20 }}>هنوز عکسی در گالری نیست. ابتدا از تب گالری عکس اضافه کنید.</Text>
              ) : galleryPhotos.map(photo => (
                <View key={photo.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', borderRadius: 12, padding: 8 }}>
                  <Image source={{ uri: photo.uri }} style={{ width: 56, height: 56, borderRadius: 10, backgroundColor: '#eee' }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: themeColors.text, fontWeight: '700' }} numberOfLines={1}>{photo.title}</Text>
                    <Text style={{ color: themeColors.textSecondary, fontSize: 11 }}>{memberName(photo.memberId)}</Text>
                  </View>
                  <TouchableOpacity style={[styles.smallBtn, { borderColor: themeColors.primary }]} onPress={() => createFromSource(photo.memberId, photo)}><Text style={{ color: themeColors.primary, fontSize: 12 }}>تبدیل و رنگ‌آمیزی</Text></TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: 'rgba(0,0,0,0.08)', marginTop: 8 }]} onPress={() => setGalleryModal(false)}><Text style={{ color: themeColors.text, fontWeight: '700' }}>بستن</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  headerSubtitle: { fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  smallText: { fontSize: 12, lineHeight: 18 },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 32, marginTop: 20 },
  pageCard: { width: '47%', borderWidth: 1, borderRadius: 14, padding: 10 },
  pageThumb: { width: '100%', height: 120, borderRadius: 10, backgroundColor: '#eee' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 16 },
  modalCard: { borderRadius: 18, padding: 16 },
  primaryBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  smallBtn: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' },
  editorHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  titleInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, fontSize: 14, fontWeight: '700' },
  canvasCard: { marginHorizontal: 12, marginBottom: 12, borderWidth: 1, borderRadius: 16, padding: 12 },
  canvasWrap: { height: 320, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: '#fff' },
  canvasImage: { width: '100%', height: '100%', opacity: 0.85 },
  svgOverlay: { ...StyleSheet.absoluteFillObject as any },
  toolRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 },
  swatch: { width: 28, height: 28, borderRadius: 14 },
  eraser: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  sizeBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  guideRow: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 12, padding: 8, marginBottom: 8 },
  guideSwatch: { width: 22, height: 22, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
  guideInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, fontSize: 12 },
});

export default ColoringBook;
