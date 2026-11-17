import { JALAALI_MONTHS } from './jalali';

const monthIndex: Record<string, number> = {};
JALAALI_MONTHS.forEach((m, i) => { monthIndex[m] = i + 1; });

// Official Iranian public holidays by Jalali year/month/day (based on time.ir annual calendars).
// Note: some lunar/religious holidays may vary by official announcement; Fridays are always treated as holidays in UI.
const OFFICIAL: Record<number, Record<number, number[]>> = {
  1404: {
    1: [1,2,3,4,12,13,14,23], // نوروز cluster, جمهوری اسلامی, سیزده‌بدر, شهادت امام علی(ع) etc as per 1404 calendar
    2: [11],
    3: [14,15,16,24,25],
    4: [14,15],
    6: [2,10,31],
    7: [2],
    8: [13],
    9: [20,30],
    10: [1,11,20],
    11: [15,22],
    12: [20,29,30],
  },
  1405: {
    1: [1,2,3,4,12,13,25],
    2: [10],
    3: [3,5,6,11,14,15,16],
    4: [3,4],
    5: [21,22,30],
    6: [3,8,31],
    8: [22],
    9: [9,22],
    10: [2,16],
    11: [4,22],
    12: [19,20,29],
  },
};

export function isOfficialHoliday(jy: number, jm: number, jd: number): boolean {
  const y = OFFICIAL[jy];
  if (!y) return false;
  const m = y[jm];
  if (!m) return false;
  return m.includes(jd);
}

export function isFriday(date: Date): boolean {
  return date.getDay() === 5;
}

export function isHolidayDate(date: Date, jy: number, jm: number, jd: number): boolean {
  return isFriday(date) || isOfficialHoliday(jy, jm, jd);
}
