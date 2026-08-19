/**
 * the-now — the machine's clock, read and reported. Never interpreted.
 *
 * Born 2026-08-03 from KP's ⚛ real need, verbatim: *"i would like a tool
 * in awen that does that as well. so others including apps on this
 * machine can use it."* The sibling is `.claude/agents/clock.md`, which
 * gives a session the same reading; this gives it to everything else.
 *
 * WHY A TOOL FOR SOMETHING SO SMALL. Because "what is today" is the one
 * fact a program most often assumes and most often gets wrong: a build
 * stamps a hardcoded year, a log writes a date parsed from a filename, a
 * model states today's date from its training. Every one of those is a
 * guess wearing a fact's clothes. There is a clock on this machine. Ask
 * it.
 *
 * THE SHAPE, and it is deliberate:
 *
 *   readMoment(d)  PURE — a Date in, a Reading out. Testable, frozen,
 *                  same answer forever for the same input.
 *   now()          the ONE impure line in this tool. It touches the
 *                  clock and hands the result to readMoment.
 *
 * Everything a caller might want to compute — "three days from now",
 * "is this stale" — is the caller's arithmetic on a Reading, not work
 * this tool volunteers. Reading, never ruling. `the-temporal` is the
 * sibling that does windows; this one only says when it is.
 *
 * Framework-free. Zero dependencies. Zero imports.
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
 * PURE. A moment in, its reading out. No clock is touched here, which is
 * what makes this testable and what makes `now()` the only line in the
 * tool that can surprise you.
 */
export function readMoment(d: Date): Reading {
  if (Number.isNaN(d.getTime())) {
    throw new RangeError('the-now: invalid Date. A reading is never invented.');
  }

  // getTimezoneOffset() is minutes BEHIND UTC — positive west. Inverted
  // here so the sign matches how humans and ISO-8601 both write it.
  const offsetMinutes = -d.getTimezoneOffset();
  const sign = offsetMinutes < 0 ? '-' : '+';
  const offsetLabel = `${sign}${pad(Math.trunc(offsetMinutes / 60))}:${pad(offsetMinutes % 60)}`;

  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

  // The zone NAME is a courtesy the runtime may not have. Absent is
  // reported as null rather than filled in from the offset — two zones
  // can share an offset, so inferring one would be a guess.
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
