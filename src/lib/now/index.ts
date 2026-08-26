/**
 * the-now — the machine's clock, read and reported. Never interpreted.
 *
 *   readMoment(d)  PURE — a Date in, a Reading out.
 *   now()          the ONE impure line in this tool. It touches the
 *                  clock and hands the result to readMoment.
 */

export interface Reading {
  /** Local time, ISO-8601 with the machine's own offset. */
  iso: string;
  /** The same moment in UTC, ISO-8601 with `Z`. */
  isoUtc: string;
  /** Local calendar date, `YYYY-MM-DD`. */
  date: string;
  /** Local wall-clock time, `HH:MM:SS`. */
  time: string;
  /** Day name, in English, from a fixed table — no locale variance. */
  weekday: string;
  /** Minutes east of UTC. Negative west. `-300` is US Central in summer. */
  offsetMinutes: number;
  /** The offset as `+HH:MM` / `-HH:MM`. */
  offsetLabel: string;
  /** IANA zone if this runtime knows it, otherwise null — never guessed. */
  zone: string | null;
  epochMs: number;
  epochSeconds: number;
  /** What produced this reading. Always the system clock. */
  source: 'system-clock';
}

const WEEKDAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
] as const;

const pad = (n: number, width = 2): string => String(Math.abs(n)).padStart(width, '0');

/**
 * PURE. A moment in, its reading out. No clock is touched here.
 */
export function readMoment(d: Date): Reading {
  if (Number.isNaN(d.getTime())) {
    throw new RangeError('the-now: invalid Date. A reading is never invented.');
  }

  // getTimezoneOffset() is minutes BEHIND UTC — inverted here to match ISO-8601.
  const offsetMinutes = -d.getTimezoneOffset();
  const sign = offsetMinutes < 0 ? '-' : '+';
  const offsetLabel = `${sign}${pad(Math.trunc(offsetMinutes / 60))}:${pad(offsetMinutes % 60)}`;

  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

  // Zone name is a runtime courtesy; absent is null, never inferred from the offset.
  let zone: string | null = null;
  try {
    zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
  } catch {
    zone = null;
  }

  return {
    iso: `${date}T${time}${offsetLabel}`,
    isoUtc: d.toISOString(),
    date,
    time,
    weekday: WEEKDAYS[d.getDay()]!,
    offsetMinutes,
    offsetLabel,
    zone,
    epochMs: d.getTime(),
    epochSeconds: Math.floor(d.getTime() / 1000),
    source: 'system-clock',
  };
}

/** The one impure line in this tool: it asks the machine what time it is. */
export function now(): Reading {
  return readMoment(new Date());
}

/** The plain human report — the same shape the `clock` agent returns. */
export function format(r: Reading): string {
  return [
    `local   ${r.date} ${r.time} (UTC${r.offsetLabel})`,
    `day     ${r.weekday}`,
    `zone    ${r.zone ?? '(not known to this runtime — not guessed)'}`,
    `iso     ${r.iso}`,
    `utc     ${r.isoUtc}`,
    `epoch   ${r.epochSeconds}`,
  ].join('\n');
}
