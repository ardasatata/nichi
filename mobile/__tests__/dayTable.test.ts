import { WINDOW_DAYS, buildTimeline, buildYearTable, localDayKey } from '../src/format/dayTable';
import { defaultProfile, type Profile } from '../src/model/profile';

const from = new Date(2026, 9, 15, 9, 30, 0);

const four: Profile[] = [
  defaultProfile('1', 'ja-JP'),
  defaultProfile('2', 'zh-Hans'),
  defaultProfile('3', 'ko-KR'),
  { ...defaultProfile('4', 'th-TH'), calendarID: 'buddhist', style: 'monthDay' },
];

describe('buildYearTable', () => {
  it('covers a full year of consecutive days', () => {
    const table = buildYearTable(four[0], from);
    const keys = Object.keys(table);
    expect(keys).toHaveLength(WINDOW_DAYS);
    expect(keys[0]).toBe('2026-10-15');
    expect(keys[keys.length - 1]).toBe('2027-10-15');
    // Crosses the year boundary without gaps or duplicates.
    expect(table['2026-12-31'].main).toBe('木');
    expect(table['2027-01-01'].main).toBe('金');
    expect(new Set(keys).size).toBe(WINDOW_DAYS);
  });

  it('renders the same text a widget would pick for today', () => {
    expect(buildYearTable(four[0], from)[localDayKey(from)].main).toBe('木');
  });
});

describe('buildTimeline', () => {
  const entries = buildTimeline(four, from);

  it('has one entry per day, starting now then at each local midnight', () => {
    expect(entries).toHaveLength(WINDOW_DAYS);
    expect(entries[0].date).toEqual(from);
    expect(entries[1].date).toEqual(new Date(2026, 9, 16, 0, 0, 0));
    expect(entries[2].date).toEqual(new Date(2026, 9, 17, 0, 0, 0));
  });

  it('carries every profile for that day', () => {
    expect(entries[0].props.p['1']?.main).toBe('木');
    expect(entries[0].props.p['2']?.main).toBe('四');
    expect(entries[1].props.p['1']?.main).toBe('金');
    expect(entries[1].props.p['3']?.main).toBe('금');
  });

  it('keeps each entry small with four profiles', () => {
    const bytes = new TextEncoder().encode(JSON.stringify(entries[0].props)).length;
    expect(bytes).toBeLessThan(1024);
  });
});
