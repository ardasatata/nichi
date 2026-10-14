import type { Profile, ProfileID } from '../model/profile';
import { renderDay, type DayText } from './render';

/** How far ahead widgets are pre-rendered, so they keep flipping without the app. */
export const WINDOW_DAYS = 366;

const pad = (n: number) => String(n).padStart(2, '0');

/** Local calendar day as `YYYY-MM-DD`. Widgets compute the same key themselves. */
export function localDayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Local noon of `from + offset` days; noon is safe across DST shifts. */
function dayAt(from: Date, offset: number, hour: number): Date {
  return new Date(from.getFullYear(), from.getMonth(), from.getDate() + offset, hour, 0, 0, 0);
}

/** Year table for one profile (Android: the widget picks today's key). */
export function buildYearTable(
  profile: Profile,
  from: Date = new Date(),
  days: number = WINDOW_DAYS
): Record<string, DayText> {
  const table: Record<string, DayText> = {};
  for (let i = 0; i < days; i++) {
    const noon = dayAt(from, i, 12);
    table[localDayKey(noon)] = renderDay(profile, noon);
  }
  return table;
}

export type TimelineProps = { p: Partial<Record<ProfileID, DayText>> };
export type TimelineEntry = { date: Date; props: TimelineProps };

/**
 * iOS timeline: one entry per local midnight. Each entry carries only that day's
 * text for every profile, so entries stay a few hundred bytes.
 */
export function buildTimeline(
  profiles: Profile[],
  from: Date = new Date(),
  days: number = WINDOW_DAYS
): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  for (let i = 0; i < days; i++) {
    const noon = dayAt(from, i, 12);
    const p: TimelineProps['p'] = {};
    for (const profile of profiles) p[profile.id] = renderDay(profile, noon);
    // The first entry starts now; the rest start at the local midnight that begins their day.
    entries.push({ date: i === 0 ? from : dayAt(from, i, 0), props: { p } });
  }
  return entries;
}
