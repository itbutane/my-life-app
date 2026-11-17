import React from 'react';
import { View, Text, StyleSheet, StatusBar, Alert, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { HappyCalendar } from '../../components/HappyCalendar';
import { useApp } from '../../hooks/AppContext';
import { CalendarEvent } from '../../types';

export const CalendarScreen: React.FC = () => {
  const { themeColors, isDark } = useTheme();
  const { calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent, settings } = useApp();
  const [selectedDate, setSelectedDate] = React.useState<string>(() => new Date().toISOString().split('T')[0]);
  React.useEffect(() => { setSelectedDate(new Date().toISOString().split('T')[0]); }, []);
  const [editEvent, setEditEvent] = React.useState<CalendarEvent | null>(null);
  const [createDate, setCreateDate] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [emoji, setEmoji] = React.useState('😊');
  const [renderError] = React.useState<string | null>(null);

  const handleAddEvent = (date: string) => {
    setCreateDate(date);
    setEditEvent(null);
    setTitle('');
    setDescription('');
    setEmoji('😊');
  };

  const openEdit = (event: CalendarEvent) => {
    setCreateDate(null);
    setEditEvent(event);
    setTitle(event.title);
    setDescription(event.description || '');
    setEmoji(event.emoji || '😊');
  };

  const closeModal = () => { setEditEvent(null); setCreateDate(null); };

  const saveEvent = () => {
    const t = title.trim() || 'رویداد';
    const d = description.trim();
    const e = emoji.trim() || '😊';
    if (editEvent) {
      updateCalendarEvent(editEvent.id, { title: t, description: d, emoji: e });
    } else if (createDate) {
      addCalendarEvent({
        date: createDate,
        title: t,
        emoji: e,
        description: d,
        photos: [],
        color: '#FF6B9D',
      });
    }
    closeModal();
  };

  const handleEventPress = (event: CalendarEvent) => {
    if (event.kind === 'achievement') {
      Alert.alert(`${event.emoji} ${event.title}`, event.description || '', [
        { text: 'حذف', style: 'destructive', onPress: () => deleteCalendarEvent(event.id) },
        { text: 'بستن', style: 'cancel' },
      ]);
      return;
    }
    Alert.alert(
      `${event.emoji} ${event.title}`,
      event.description || 'جزئیاتی ثبت نشده است.',
      [
        { text: 'ویرایش', onPress: () => openEdit(event) },
        { text: 'حذف', style: 'destructive', onPress: () => deleteCalendarEvent(event.id) },
        { text: 'بستن', style: 'cancel' },
      ]
    );
  };

  if (renderError) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top', 'left', 'right'] as const}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ color: themeColors.text, fontSize: 18, fontWeight: '700', marginBottom: 8 }}>تقویم در نمایش خطا داشت</Text>
          <Text style={{ color: themeColors.textSecondary, textAlign: 'center', marginBottom: 16 }}>{renderError}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top', 'left', 'right'] as const}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={themeColors.background} translucent />
      
      <View style={styles.container}>
        <View style={[styles.header, { borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>📅 تقویم خوشبختی (شمسی)</Text>
          <Text style={[styles.headerSubtitle, { color: themeColors.textSecondary }]}>
            {calendarEvents.length} رویداد/دستاورد • نمایش و تبدیل شمسی ↔ میلادی
          </Text>
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
          <HappyCalendar
            events={calendarEvents}
            onAddEvent={handleAddEvent}
            onEventPress={handleEventPress}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            animated={!settings.reducedMotion}
          />

          <View style={[styles.dayEventsCard, { backgroundColor: isDark ? themeColors.surface : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>رویدادهای {selectedDate || ''}</Text>
            {(calendarEvents || []).filter(e => e.date === selectedDate).length === 0 ? (
              <Text style={{ color: themeColors.textSecondary, fontSize: 13 }}>رویدادی برای این روز ثبت نشده. برای افزودن، روی روز موردنظر لمس طولانی کنید.</Text>
            ) : (
              (calendarEvents || []).filter(e => e.date === selectedDate).map(ev => (
                <View key={ev.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => openEdit(ev)}>
                    <Text style={{ color: themeColors.text, fontWeight: '700', fontSize: 14 }}>{ev.emoji || '📌'} {ev.title}</Text>
                    {ev.description ? <Text style={{ color: themeColors.textSecondary, fontSize: 12, marginTop: 2 }}>{ev.description}</Text> : null}
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity onPress={() => openEdit(ev)}><Text style={{ color: themeColors.primary, fontWeight: '700' }}>ویرایش</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteCalendarEvent(ev.id)}><Text style={{ color: '#E17055', fontWeight: '700' }}>حذف</Text></TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>

      <Modal visible={!!editEvent || !!createDate} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? themeColors.surface : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>{editEvent ? 'ویرایش رویداد' : 'افزودن رویداد'}</Text>
            {createDate ? <Text style={[styles.label, { color: themeColors.textSecondary, marginTop: 0 }]}>تاریخ: {createDate}</Text> : null}
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>عنوان</Text>
            <TextInput value={title} onChangeText={setTitle} style={[styles.input, { color: themeColors.text, borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)', backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff' }]} placeholder="عنوان" placeholderTextColor={themeColors.textMuted} />
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>ایموجی</Text>
            <TextInput value={emoji} onChangeText={setEmoji} style={[styles.input, { color: themeColors.text, borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)', backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff' }]} placeholder="😊" placeholderTextColor={themeColors.textMuted} />
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>توضیح</Text>
            <TextInput value={description} onChangeText={setDescription} style={[styles.input, { minHeight: 80, textAlignVertical: 'top', color: themeColors.text, borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)', backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff' }]} placeholder="توضیح" placeholderTextColor={themeColors.textMuted} multiline />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]} onPress={closeModal}><Text style={{ color: themeColors.text, fontWeight: '600' }}>انصراف</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: themeColors.primary }]} onPress={saveEvent}><Text style={{ color: '#fff', fontWeight: '700' }}>{editEvent ? 'ذخیره' : 'افزودن'}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  headerSubtitle: { fontSize: 13, fontWeight: '500', marginTop: 4 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 20 },
  modalCard: { borderRadius: 20, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  label: { fontSize: 12, marginBottom: 6, marginTop: 6 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  dayEventsCard: { marginHorizontal: 16, marginTop: 12, marginBottom: 8, padding: 14, borderRadius: 16, borderWidth: 1 },
});

export default CalendarScreen;
