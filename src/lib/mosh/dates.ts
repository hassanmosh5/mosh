/**
 * Date helpers for period anchors.
 *
 * Every period in the system is anchored to a `@db.Date` column: the day, the
 * Monday of the ISO week, the first of the month. Postgres hands those back as
 * a `Date` at UTC midnight, so all arithmetic here is done in UTC and every
 * anchor is produced by these functions — never by `new Date()` in a service.
 * That is what keeps "today's entry" a single row instead of one per timezone.
 */

export type IsoDate = string; // YYYY-MM-DD

const MS_PER_DAY = 86_400_000;

/** Normalise any date to UTC midnight of the same calendar day. */
export function toDayStart(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

/** Format as YYYY-MM-DD. */
export function toIsoDate(value: Date): IsoDate {
  return toDayStart(value).toISOString().slice(0, 10);
}

/** Parse YYYY-MM-DD into a UTC-midnight Date. Throws on anything else. */
export function fromIsoDate(value: IsoDate): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error(`Invalid date: ${value}`);
  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid date: ${value}`);
  return date;
}

export function addDays(value: Date, days: number): Date {
  return new Date(toDayStart(value).getTime() + days * MS_PER_DAY);
}

export function addMonths(value: Date, months: number): Date {
  const start = toDayStart(value);
  return new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + months, start.getUTCDate()));
}

/** Whole days from `a` to `b` (positive when `b` is later). */
export function daysBetween(a: Date, b: Date): number {
  return Math.round((toDayStart(b).getTime() - toDayStart(a).getTime()) / MS_PER_DAY);
}

/** Monday of the ISO week containing `value`. */
export function weekStart(value: Date): Date {
  const day = toDayStart(value);
  const weekday = day.getUTCDay(); // 0 = Sunday
  const offset = weekday === 0 ? -6 : 1 - weekday;
  return addDays(day, offset);
}

export function weekEnd(value: Date): Date {
  return addDays(weekStart(value), 6);
}

/** First day of the month containing `value`. */
export function monthStart(value: Date): Date {
  const day = toDayStart(value);
  return new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), 1));
}

export function monthEnd(value: Date): Date {
  const day = toDayStart(value);
  return new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth() + 1, 0));
}

/** First day of the quarter (1-4) in a given year. */
export function quarterStart(year: number, quarter: number): Date {
  return new Date(Date.UTC(year, (quarter - 1) * 3, 1));
}

/** The quarter (1-4) a date falls in. */
export function quarterOf(value: Date): number {
  return Math.floor(toDayStart(value).getUTCMonth() / 3) + 1;
}

/** Inclusive list of days from `from` to `to`. */
export function eachDay(from: Date, to: Date): Date[] {
  const days: Date[] = [];
  for (let cursor = toDayStart(from); cursor <= toDayStart(to); cursor = addDays(cursor, 1)) {
    days.push(cursor);
  }
  return days;
}

/** Inclusive list of month anchors from `from` to `to`. */
export function eachMonth(from: Date, to: Date): Date[] {
  const months: Date[] = [];
  const last = monthStart(to);
  for (let cursor = monthStart(from); cursor <= last; cursor = addMonths(cursor, 1)) {
    months.push(cursor);
  }
  return months;
}

/** Inclusive list of week anchors (Mondays) from `from` to `to`. */
export function eachWeek(from: Date, to: Date): Date[] {
  const weeks: Date[] = [];
  const last = weekStart(to);
  for (let cursor = weekStart(from); cursor <= last; cursor = addDays(cursor, 7)) {
    weeks.push(cursor);
  }
  return weeks;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "Monday, 16 August 2026" — rendered in UTC so server and client agree. */
export function formatLongDate(value: Date): string {
  const day = toDayStart(value);
  return `${DAY_NAMES[day.getUTCDay()]}, ${day.getUTCDate()} ${MONTH_NAMES[day.getUTCMonth()]} ${day.getUTCFullYear()}`;
}

/** "16 Aug" */
export function formatShortDate(value: Date): string {
  const day = toDayStart(value);
  return `${day.getUTCDate()} ${MONTH_NAMES[day.getUTCMonth()].slice(0, 3)}`;
}

/** "August 2026" */
export function formatMonth(value: Date): string {
  const day = toDayStart(value);
  return `${MONTH_NAMES[day.getUTCMonth()]} ${day.getUTCFullYear()}`;
}

/** "Aug 2026" */
export function formatShortMonth(value: Date): string {
  const day = toDayStart(value);
  return `${MONTH_NAMES[day.getUTCMonth()].slice(0, 3)} ${day.getUTCFullYear()}`;
}

/** "Week of 16 Aug" */
export function formatWeek(value: Date): string {
  return `Week of ${formatShortDate(value)}`;
}

/** Today, as a UTC-midnight anchor. */
export function today(): Date {
  return toDayStart(new Date());
}
