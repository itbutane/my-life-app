import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, TextInput } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { CalendarEvent } from '../types';
import { format, isSameDay } from 'date-fns';
import {
  toJalaali, toGregorian, jalaaliMonthLength, JALAALI_MONTHS,
  toPersianDigits, gregorianToJalaaliDate, jalaaliToGregorianDate,
  formatJalaali, formatGregorian,
} from '../utils/jalali';
import { isHolidayDate, isFriday } from '../utils/holidays';

interface CalendarProps {
  events: CalendarEvent[];
  onAddEvent: (date: string) => void;
  onEventPress: (event: CalendarEvent) => void;
  selectedDate: string;
  onDateSelect: (date: string) => void;
  animated?: boolean;
}

export const HappyCalendar: React.FC<CalendarProps> = ({
  events,
  onAddEvent,
  onEventPress,
  selectedDate,
  onDateSelect,
  animated = true,
}) => {
  const { themeColors, isDark } = useTheme();
  const [todayTick, setTodayTick] = React.useState(0);
  const today = React.useMemo(() => new Date(), [todayTick]);
  const todayJ = React.useMemo(() => gregorianToJalaaliDate(today), [today]);
  const [jy, setJy] = React.useState(() => gregorianToJalaaliDate(new Date()).jy);
  const [jm, setJm] = React.useState(() => gregorianToJalaaliDate(new Date()).jm);

  React.useEffect(() => {
    // sync to real today on mount/focus-like tick
    const now = new Date();
    const tj = gregorianToJalaaliDate(now);
    setJy(tj.jy); setJm(tj.jm);
  }, []);
  const [entranceAnim] = React.useState(() => new Animated.Value(1));
  const [showConverter, setShowConverter] = React.useState(true);
  const [convJ, setConvJ] = React.useState(`${todayJ.jy}/${String(todayJ.jm).padStart(2,'0')}/${String(todayJ.jd).padStart(2,'0')}`);
  const [convG, setConvG] = React.useState(formatGregorian(today));
  const [convMsg, setConvMsg] = React.useState('');

  React.useEffect(() => {
    if (!animated) { entranceAnim.setValue(1); return; }
    entranceAnim.setValue(1);
  }, [animated, entranceAnim]);

  const daysInMonth = jalaaliMonthLength(jy, jm);
  const firstOfMonthG = jalaaliToGregorianDate(jy, jm, 1);
  // Persian week starts Saturday: [ش,ی,د,س,چ,پ,ج]
  const firstDayIndex = (firstOfMonthG.getDay() + 1) % 7;

  const monthName = `${JALAALI_MONTHS[jm - 1]} ${toPersianDigits(jy)}`;
  const gregRangeStart = formatGregorian(firstOfMonthG);
  const gregRangeEnd = formatGregorian(jalaaliToGregorianDate(jy, jm, daysInMonth));

  const prevMonth = () => {
    if (jm === 1) { setJy(jy - 1); setJm(12); } else setJm(jm - 1);
  };
  const nextMonth = () => {
    if (jm === 12) { setJy(jy + 1); setJm(1); } else setJm(jm + 1);
  };
  const goToday = () => {
    const now = new Date();
    setTodayTick(t => t + 1);
    const tj = gregorianToJalaaliDate(now);
    setJy(tj.jy); setJm(tj.jm);
    const gs = formatGregorian(now);
    onDateSelect(gs);
    setConvG(gs);
    setConvJ(`${tj.jy}/${String(tj.jm).padStart(2,'0')}/${String(tj.jd).padStart(2,'0')}`);
    setConvMsg('به امروز منتقل شد');
  };

  const selectedDateObj = React.useMemo(() => { try { const d = new Date((selectedDate || formatGregorian(today)) + 'T00:00:00'); return isNaN(d.getTime()) ? new Date() : d; } catch { return new Date(); } }, [selectedDate]);
  const selectedJ = React.useMemo(() => gregorianToJalaaliDate(selectedDateObj), [selectedDateObj]);

  const getEventsForDay = (date: Date) => {
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      return (events || []).filter(e => e && e.date === dateStr);
    } catch { return []; }
  };

  const hasEvent = (date: Date) => getEventsForDay(date).length > 0;
  const isSelected = (date: Date) => isSameDay(date, selectedDateObj);
  const isTodayDate = (date: Date) => isSameDay(date, today);

  const dayOpacity = entranceAnim;

  const renderDay = (jd: number) => {
    const gDate = jalaaliToGregorianDate(jy, jm, jd);
    const dateStr = formatGregorian(gDate);
    let dayEvents: CalendarEvent[] = [];
    try { dayEvents = getEventsForDay(gDate); } catch { dayEvents = []; }
    const selected = isSelected(gDate);
    const todayFlag = isTodayDate(gDate);
    const holidayFlag = isHolidayDate(gDate, jy, jm, jd);
    const fridayFlag = isFriday(gDate);
    const event = dayEvents[0];

    return (
      <Animated.View key={dateStr} style={[styles.dayContainer, { opacity: dayOpacity }]}>
        <TouchableOpacity
          style={[
            styles.dayButton,
            selected && styles.daySelected,
            todayFlag && !selected && styles.dayToday,
            todayFlag && !selected && holidayFlag && styles.dayTodayHoliday,
            holidayFlag && !selected && styles.dayHoliday,
            hasEvent(gDate) && styles.dayHasEvent,
            { backgroundColor: selected ? themeColors.primary : 'transparent' },
          ]}
          onPress={() => onDateSelect(dateStr)}
          onLongPress={() => onAddEvent(dateStr)}
        >
          <Text style={[
            styles.dayNumber,
            { color: selected ? '#fff' : holidayFlag ? '#D63031' : themeColors.text },
            todayFlag && !selected && !holidayFlag && { color: themeColors.primary, fontWeight: '700' },
            todayFlag && !selected && holidayFlag && { color: '#D63031', fontWeight: '700' },
          ]}>
            {toPersianDigits(jd)}
          </Text>
          {hasEvent(gDate) && (
            <View style={[styles.eventDot, { backgroundColor: event?.color || themeColors.primary }]} />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyDays = (count: number) => Array.from({ length: count }, (_, i) => (
    <View key={`empty-${i}`} style={styles.dayContainer} />
  ));

  const onConvertJ2G = () => {
    const m = convJ.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()).match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
    if (!m) { setConvMsg('فرمت شمسی: 1403/01/15'); return; }
    const jyy = parseInt(m[1],10), jmm = parseInt(m[2],10), jdd = parseInt(m[3],10);
    if (jmm < 1 || jmm > 12 || jdd < 1 || jdd > jalaaliMonthLength(jyy, jmm)) { setConvMsg('تاریخ شمسی نامعتبر است'); return; }
    const g = jalaaliToGregorianDate(jyy, jmm, jdd);
    const gs = formatGregorian(g);
    setConvG(gs);
    onDateSelect(gs);
    setJy(jyy); setJm(jmm);
    setConvMsg(`شمسی → میلادی: ${gs}`);
  };

  const onConvertG2J = () => {
    const m = convG.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (!m) { setConvMsg('فرمت میلادی: 2026-11-10'); return; }
    const gy = parseInt(m[1],10), gm = parseInt(m[2],10), gd = parseInt(m[3],10);
    const dt = new Date(gy, gm - 1, gd);
    if (isNaN(dt.getTime()) || dt.getFullYear() !== gy || dt.getMonth() !== gm - 1 || dt.getDate() !== gd) { setConvMsg('تاریخ میلادی نامعتبر است'); return; }
    const j = toJalaali(gy, gm, gd);
    setConvJ(`${j.jy}/${String(j.jm).padStart(2,'0')}/${String(j.jd).padStart(2,'0')}`);
    const gs = formatGregorian(dt);
    onDateSelect(gs);
    setJy(j.jy); setJm(j.jm);
    setConvMsg(`میلادی → شمسی: ${formatJalaali(j)}`);
  };

  const selectedEvents = getEventsForDay(selectedDateObj);

  return (
    <Animated.View style={[styles.container, { opacity: dayOpacity }]}>
      {/* Header - Jalali */}
      <View style={[styles.header, { borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
        <TouchableOpacity onPress={prevMonth} style={[styles.navButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)' }]}>
          <Text style={[styles.navIcon, { color: themeColors.text }]}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToday} style={styles.monthTitleContainer}>
          <Text style={[styles.monthTitle, { color: themeColors.text }]}>{monthName}</Text>
          <Text style={[styles.monthSubTitle, { color: themeColors.textSecondary }]}>
            امروز: {formatJalaali(todayJ)} ({formatGregorian(today)}) • معادل میلادی: {gregRangeStart} تا {gregRangeEnd}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextMonth} style={[styles.navButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)' }]}>
          <Text style={[styles.navIcon, { color: themeColors.text }]}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToday} style={[styles.todayButton, { backgroundColor: themeColors.primary }]}>
          <Text style={styles.todayButtonText}>امروز</Text>
        </TouchableOpacity>
      </View>

      {/* Weekdays (Sat-first) */}
      <View style={[styles.weekdays, { borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
        {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((day, i) => (
          <Text key={i} style={[styles.weekday, { color: i === 6 ? '#D63031' : themeColors.textSecondary }]}>{day}</Text>
        ))}
      </View>

      {/* Days Grid */}
      <View style={styles.daysGrid}>
        {renderEmptyDays(firstDayIndex)}
        {Array.from({ length: daysInMonth }, (_, i) => renderDay(i + 1))}
      </View>

      {/* Selected date + Converter */}
      <View style={[styles.converterCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.95)', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
        <TouchableOpacity style={styles.converterHeader} onPress={() => setShowConverter(s => !s)}>
          <Text style={[styles.converterTitle, { color: themeColors.text }]}>🔁 تبدیل تاریخ (شمسی ↔ میلادی)</Text>
          <Text style={{ color: themeColors.textSecondary }}>{showConverter ? 'بستن' : 'باز کردن'}</Text>
        </TouchableOpacity>
        <View style={styles.selectedRow}>
          <Text style={[styles.selectedLabel, { color: themeColors.textSecondary }]}>تاریخ انتخاب‌شده:</Text>
          <Text style={[styles.selectedValue, { color: themeColors.text }]}>شمسی {formatJalaali(selectedJ)}</Text>
          <Text style={[styles.selectedValue, { color: themeColors.text }]}>میلادی {formatGregorian(selectedDateObj)}</Text>
        </View>
        {showConverter && (
          <View style={{ marginTop: 10, gap: 10 }}>
            <View style={styles.convRow}>
              <Text style={[styles.convLabel, { color: themeColors.text }]}>شمسی (سال/ماه/روز)</Text>
              <TextInput
                style={[styles.convInput, { color: themeColors.text, borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)', backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#fff' }]}
                value={convJ}
                onChangeText={setConvJ}
                placeholder="1405/08/19"
                placeholderTextColor={themeColors.textSecondary}
              />
              <TouchableOpacity style={[styles.convBtn, { backgroundColor: themeColors.primary }]} onPress={onConvertJ2G}>
                <Text style={styles.convBtnText}>تبدیل به میلادی</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.convRow}>
              <Text style={[styles.convLabel, { color: themeColors.text }]}>میلادی (YYYY-MM-DD)</Text>
              <TextInput
                style={[styles.convInput, { color: themeColors.text, borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)', backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#fff' }]}
                value={convG}
                onChangeText={setConvG}
                placeholder="2026-11-10"
                placeholderTextColor={themeColors.textSecondary}
                autoCapitalize="none"
              />
              <TouchableOpacity style={[styles.convBtn, { backgroundColor: '#4ECDC4' }]} onPress={onConvertG2J}>
                <Text style={styles.convBtnText}>تبدیل به شمسی</Text>
              </TouchableOpacity>
            </View>
            {convMsg ? <Text style={{ color: themeColors.primary, fontSize: 12, textAlign: 'center' }}>{convMsg}</Text> : null}
          </View>
        )}
      </View>

      {/* Events List for Selected Date */}
      <View style={styles.eventsSection}>
        <View style={styles.eventsHeader}>
          <Text style={[styles.eventsTitle, { color: themeColors.text }]}>
            رویدادهای {formatJalaali(selectedJ)} ({formatGregorian(selectedDateObj)})
          </Text>
          <TouchableOpacity onPress={() => onAddEvent(formatGregorian(selectedDateObj))} style={[styles.addEventButton, { backgroundColor: themeColors.primary }]}>
            <Text style={styles.addEventText}>+ افزودن</Text>
          </TouchableOpacity>
        </View>
        {selectedEvents.length === 0 ? (
          <View style={styles.emptyEvents}>
            <Text style={[styles.emptyEventsText, { color: themeColors.textSecondary }]}>هیچ رویدادی برای این روز ثبت نشده</Text>
            <TouchableOpacity onPress={() => onAddEvent(formatGregorian(selectedDateObj))} style={[styles.addFirstEvent, { borderColor: themeColors.primary }]}>
              <Text style={[styles.addFirstEventText, { color: themeColors.primary }]}>اولین خاطره را ثبت کنید ✨</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {selectedEvents.map(item => (
              <TouchableOpacity key={item.id} style={[styles.eventItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)' }]} onPress={() => onEventPress(item)}>
                <View style={[styles.eventColorBar, { backgroundColor: item.color }]} />
                <View style={styles.eventContent}>
                  <Text style={styles.eventEmoji}>{item.emoji}</Text>
                  <Text style={[styles.eventTitle, { color: themeColors.text }]}>{item.title}</Text>
                  {item.description ? <Text style={[styles.eventDescription, { color: themeColors.textSecondary }]}>{item.description}</Text> : null}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, marginBottom: 4, borderBottomWidth: 1 },
  navButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  navIcon: { fontSize: 28, fontWeight: '300' },
  monthTitleContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  todayButton: { marginLeft: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  todayButtonText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  monthTitle: { fontSize: 20, fontWeight: '700' },
  monthSubTitle: { fontSize: 10, marginTop: 2, textAlign: 'center' },
  weekdays: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, marginBottom: 4, borderBottomWidth: 1 },
  weekday: { fontSize: 13, fontWeight: '600', width: 40, textAlign: 'center' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  dayContainer: { width: '14.2857%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  dayButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  dayNumber: { fontSize: 14, fontWeight: '500' },
  daySelected: {},
  dayToday: { borderWidth: 2, borderColor: '#FF6B9D' },
  dayTodayHoliday: { borderColor: '#D63031' },
  dayHoliday: { backgroundColor: 'rgba(214,48,49,0.08)' },
  dayHasEvent: {},
  eventDot: { position: 'absolute', bottom: 3, width: 5, height: 5, borderRadius: 2.5 },
  converterCard: { borderRadius: 14, padding: 12, borderWidth: 1, marginBottom: 12 },
  converterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  converterTitle: { fontSize: 14, fontWeight: '700' },
  selectedRow: { marginTop: 8, gap: 2 },
  selectedLabel: { fontSize: 11 },
  selectedValue: { fontSize: 13, fontWeight: '600' },
  convRow: { gap: 6 },
  convLabel: { fontSize: 12, fontWeight: '600' },
  convInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14 },
  convBtn: { paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  convBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  eventsSection: { marginTop: 4 },
  eventsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  eventsTitle: { fontSize: 14, fontWeight: '700', flex: 1, marginRight: 8 },
  addEventButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  addEventText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  eventItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 10, marginBottom: 8 },
  eventColorBar: { width: 4, height: '80%', borderRadius: 2, marginRight: 10 },
  eventContent: { flex: 1 },
  eventEmoji: { fontSize: 16, marginBottom: 2 },
  eventTitle: { fontSize: 14, fontWeight: '600' },
  eventDescription: { fontSize: 12, marginTop: 2 },
  emptyEvents: { alignItems: 'center', paddingVertical: 20 },
  emptyEventsText: { fontSize: 13, marginBottom: 10 },
  addFirstEvent: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  addFirstEventText: { fontSize: 13, fontWeight: '600' },
});

export default HappyCalendar;
