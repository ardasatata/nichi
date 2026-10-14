import { formatPattern, renderDay, validatePattern } from '../src/format/render';
import { defaultProfile, type Profile } from '../src/model/profile';

// Thursday, 15 October 2026 (tests run with TZ=UTC).
const date = new Date(2026, 9, 15, 12, 0, 0);

const profile = (patch: Partial<Profile>): Profile => ({ ...defaultProfile('1'), ...patch });

describe('renderDay', () => {
  it('shows a single kanji for Japanese by default', () => {
    expect(renderDay(profile({}), date)).toEqual({ main: '木', sub: '10月15日' });
  });

  it('formats full weekday and month/day in Japanese', () => {
    expect(renderDay(profile({ style: 'weekdayFull' }), date).main).toBe('木曜日');
    expect(renderDay(profile({ style: 'monthDay' }), date).main).toBe('10月15日');
  });

  it('uses the native character in Chinese and Korean', () => {
    expect(renderDay(profile({ localeID: 'zh-Hans' }), date).main).toBe('四');
    expect(renderDay(profile({ localeID: 'ko-KR' }), date).main).toBe('목');
  });

  it('adds the Japanese era with the Japanese calendar', () => {
    const era = renderDay(profile({ calendarID: 'japanese', style: 'eraDate' }), date);
    expect(era.main).toContain('令和8年');
  });

  it('uses the Buddhist year in Thai', () => {
    const thai = renderDay(
      profile({ localeID: 'th-TH', calendarID: 'buddhist', style: 'fullDate' }),
      date
    );
    expect(thai.main).toContain('2569');
  });
});

describe('custom patterns', () => {
  it('formats weekday, numbers and literals', () => {
    expect(formatPattern(profile({}), date, 'M/d(EEEEE)')).toBe('10/15(木)');
    expect(formatPattern(profile({}), date, 'yyyy-MM-dd')).toBe('2026-10-15');
  });

  it('supports quoted text', () => {
    expect(formatPattern(profile({ localeID: 'en-US' }), date, "EEEE 'the' d")).toBe(
      'Thursday the 15'
    );
  });

  it('reports unsupported letters and unclosed quotes', () => {
    expect(validatePattern('M/d(EEEEE)')).toBeNull();
    expect(validatePattern('HH:mm')).toBe('Unsupported letter "H"');
    expect(validatePattern("EEEE 'oops")).toBe('Unclosed quote');
  });
});
