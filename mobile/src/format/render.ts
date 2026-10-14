import type { Profile } from '../model/profile';

export type DayText = { main: string; sub: string };

type Opts = Intl.DateTimeFormatOptions;

function formatter(profile: Profile, options: Opts, timeZone?: string): Intl.DateTimeFormat {
  // The calendar goes in the locale extension so it works on every Hermes Intl backend.
  const locale = `${profile.localeID}-u-ca-${profile.calendarID}`;
  return new Intl.DateTimeFormat(locale, timeZone ? { ...options, timeZone } : options);
}

function format(profile: Profile, date: Date, options: Opts, timeZone?: string): string {
  return formatter(profile, options, timeZone).format(date);
}

/** Pattern letters we support, with how each run length maps to Intl options. */
const TOKENS: Record<string, (len: number) => { type: Intl.DateTimeFormatPartTypes; opts: Opts } | null> = {
  E: (n) => ({
    type: 'weekday',
    opts: { weekday: n >= 5 ? 'narrow' : n === 4 ? 'long' : 'short' },
  }),
  d: (n) => ({ type: 'day', opts: { day: n >= 2 ? '2-digit' : 'numeric' } }),
  M: (n) => ({
    type: 'month',
    opts: { month: n >= 4 ? 'long' : n === 3 ? 'short' : n === 2 ? '2-digit' : 'numeric' },
  }),
  y: (n) => ({ type: 'year', opts: { year: n === 2 ? '2-digit' : 'numeric' } }),
  G: (n) => ({ type: 'era', opts: { era: n >= 4 ? 'long' : 'short' } }),
};

export const SUPPORTED_PATTERN_LETTERS = Object.keys(TOKENS).join('');

type PatternPart = { literal: string } | { letter: string; length: number };

function parsePattern(pattern: string): PatternPart[] | { error: string } {
  const parts: PatternPart[] = [];
  let i = 0;
  while (i < pattern.length) {
    const ch = pattern[i];
    if (ch === "'") {
      // 'quoted text'; '' is a literal quote.
      if (pattern[i + 1] === "'") {
        parts.push({ literal: "'" });
        i += 2;
        continue;
      }
      const end = pattern.indexOf("'", i + 1);
      if (end === -1) return { error: 'Unclosed quote' };
      parts.push({ literal: pattern.slice(i + 1, end) });
      i = end + 1;
    } else if (/[A-Za-z]/.test(ch)) {
      let j = i;
      while (pattern[j] === ch) j++;
      if (!(ch in TOKENS)) return { error: `Unsupported letter "${ch}"` };
      parts.push({ letter: ch, length: j - i });
      i = j;
    } else {
      parts.push({ literal: ch });
      i++;
    }
  }
  return parts;
}

/** Returns an error message for an unsupported pattern, or null when it is fine. */
export function validatePattern(pattern: string): string | null {
  const parsed = parsePattern(pattern);
  return Array.isArray(parsed) ? null : parsed.error;
}

export function formatPattern(
  profile: Profile,
  date: Date,
  pattern: string,
  timeZone?: string
): string {
  const parsed = parsePattern(pattern);
  if (!Array.isArray(parsed)) return '';
  return parsed
    .map((part) => {
      if ('literal' in part) return part.literal;
      const token = TOKENS[part.letter](part.length);
      if (!token) return '';
      const parts = formatter(profile, token.opts, timeZone).formatToParts(date);
      let value = parts.find((p) => p.type === token.type)?.value ?? '';
      if (part.letter === 'y' && part.length >= 4) value = value.padStart(part.length, '0');
      return value;
    })
    .join('');
}

/** What a profile shows on `date`: a big main string and a smaller sub line. */
export function renderDay(profile: Profile, date: Date, timeZone?: string): DayText {
  const f = (options: Opts) => format(profile, date, options, timeZone);
  const monthDay = () => f({ month: 'long', day: 'numeric' });
  const weekdayLong = () => f({ weekday: 'long' });

  switch (profile.style) {
    case 'weekdayNarrow':
      return { main: f({ weekday: 'narrow' }), sub: monthDay() };
    case 'weekdayShort':
      return { main: f({ weekday: 'short' }), sub: monthDay() };
    case 'weekdayFull':
      return { main: weekdayLong(), sub: monthDay() };
    case 'dayNumber':
      return { main: f({ day: 'numeric' }), sub: weekdayLong() };
    case 'monthDay':
      return { main: monthDay(), sub: weekdayLong() };
    case 'monthDayWeekday':
      return {
        main: f({ month: 'numeric', day: 'numeric', weekday: 'short' }),
        sub: f({ year: 'numeric' }),
      };
    case 'fullDate':
      return { main: f({ dateStyle: 'full' }), sub: '' };
    case 'eraDate':
      return {
        main: f({ era: 'short', year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }),
        sub: '',
      };
    case 'custom':
      return { main: formatPattern(profile, date, profile.customPattern || 'EEEEE', timeZone), sub: '' };
  }
}
