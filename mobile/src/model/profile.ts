export type DisplayStyle =
  | 'weekdayNarrow'
  | 'weekdayShort'
  | 'weekdayFull'
  | 'dayNumber'
  | 'monthDay'
  | 'monthDayWeekday'
  | 'fullDate'
  | 'eraDate'
  | 'custom';

export type CalendarID =
  | 'gregory'
  | 'japanese'
  | 'chinese'
  | 'buddhist'
  | 'hebrew'
  | 'islamic-umalqura'
  | 'persian';

export type ProfileID = '1' | '2' | '3' | '4';

export type Profile = {
  id: ProfileID;
  localeID: string;
  calendarID: CalendarID;
  style: DisplayStyle;
  customPattern: string;
};

export const PROFILE_IDS: ProfileID[] = ['1', '2', '3', '4'];
export const MAX_PROFILES = PROFILE_IDS.length;

export const DISPLAY_STYLES: { value: DisplayStyle; label: string }[] = [
  { value: 'weekdayNarrow', label: 'Weekday, one character' },
  { value: 'weekdayShort', label: 'Weekday, short' },
  { value: 'weekdayFull', label: 'Weekday, full' },
  { value: 'dayNumber', label: 'Day number' },
  { value: 'monthDay', label: 'Month and day' },
  { value: 'monthDayWeekday', label: 'Month/day and weekday' },
  { value: 'fullDate', label: 'Full date' },
  { value: 'eraDate', label: 'Date with era' },
  { value: 'custom', label: 'Custom pattern' },
];

/** Locale names are shown in their own script. */
export const LOCALES: { value: string; label: string; calendar?: CalendarID }[] = [
  { value: 'ja-JP', label: '日本語', calendar: 'japanese' },
  { value: 'zh-Hans', label: '简体中文', calendar: 'chinese' },
  { value: 'zh-Hant', label: '繁體中文', calendar: 'chinese' },
  { value: 'ko-KR', label: '한국어' },
  { value: 'th-TH', label: 'ไทย', calendar: 'buddhist' },
  { value: 'he-IL', label: 'עברית', calendar: 'hebrew' },
  { value: 'ar', label: 'العربية', calendar: 'islamic-umalqura' },
  { value: 'fa-IR', label: 'فارسی', calendar: 'persian' },
  { value: 'hi-IN', label: 'हिन्दी' },
  { value: 'vi-VN', label: 'Tiếng Việt' },
  { value: 'en-US', label: 'English' },
];

export const CALENDARS: { value: CalendarID; label: string }[] = [
  { value: 'gregory', label: 'Gregorian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'chinese', label: 'Chinese lunar' },
  { value: 'buddhist', label: 'Buddhist' },
  { value: 'hebrew', label: 'Hebrew' },
  { value: 'islamic-umalqura', label: 'Islamic' },
  { value: 'persian', label: 'Persian' },
];

export function defaultProfile(id: ProfileID, localeID = 'ja-JP'): Profile {
  return { id, localeID, calendarID: 'gregory', style: 'weekdayNarrow', customPattern: 'EEEEE' };
}

export function localeLabel(localeID: string): string {
  return LOCALES.find((l) => l.value === localeID)?.label ?? localeID;
}

/** Next unused id, or null when all slots are taken. */
export function nextProfileID(profiles: Profile[]): ProfileID | null {
  return PROFILE_IDS.find((id) => !profiles.some((p) => p.id === id)) ?? null;
}
