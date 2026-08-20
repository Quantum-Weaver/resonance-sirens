# CLAUDE.md — resonance-sirens

**Stack:** Tauri v2 · SvelteKit · Svelte 5 · Tailwind v4 · SQLite via @tauri-apps/plugin-sql — local-first, no network at all

**Authors:** see [HANDS.md](HANDS.md) — the voices are named there, each
in their own words, per the Hands Standard.

---

## SESSION PROTOCOL

1. Read `docs/CHECKLIST.md` for current state.
2. One phase at a time — complete, verify, update the checklist, move on.
3. **The checklist updates in the same sitting as the work it records.**
4. Zero errors before commit.

## Essential rules

*This repo's own laws land here as they are ruled — identity, not
settings. Nothing is invented at the founding.*

**TJ's word outranks everyone's here.** KP's ⚛ ruling, 2026-08-18, verbatim
(spelling kept): *"my words mean nothing over a wommans in this app."* The
build road is his; anything she sees or feels is hers.

**The vocabulary is ten circles and will never be eleven.** 🔴🟠🟡🟢🔵🟣🟤⚫⚪⭕
— `src/lib/circles.ts`. KP's correction, 2026-08-18: *"only keeping the circle
emojis the colored circle emojis no other emojis as the clickable triggers."*
A colour is the one mark that carries meaning without declaring it, so no
taxonomy can form here. **The app never learns what any circle means.**

**No count, no streak, no missed-day language, ever** (KP's word). The words
*late · missed · irregular · abnormal* do not exist in this app. A cycle is
derived at read time and never stored, because a stored cycle is a judgement
about her body that outlives the day it was made. `src/lib/record.ts` and
`src/lib/days.ts` are both defined by what they refuse to compute.

**The sky is facts, never meanings**, and **nothing in this repo may ever
compute a relationship between the sky and her moments.** It attaches context
to a captured moment (KP, 2026-08-18) and it has a switch, because some will
not be interested.

**Lineage.** Rebuilt on the **Resonance Echoes v1.3.2** body, 2026-08-18 —
the shell (`app.css`, `+layout.svelte`, Sidebar, ComfortBar, cosmic, cumdach,
epagoge, theme, stores, the 21 generated stylesheets) mirrored byte-for-byte;
`record.ts` and the `moments` schema are sirens' own and were never touched.
**Echoes itself is never altered.** Android: Tauri v2 capabilities and the
16 KB page alignment **inherited from Echoes**.

**Ports 1424/1425**, deliberately clear of the 1420 pile the rest of the
family sits on. `vite.config.js` and `tauri.conf.json`'s `devUrl` must stay in
lockstep.

## Project structure

```
src/lib/circles.ts        the ten glyphs, the tint, and nothing else
src/lib/record.ts         the data layer — defined by what it cannot do
src/lib/moments.svelte.ts the one live copy every room reads (runes: .svelte.ts)
src/lib/days.ts           moments -> calendar. Refuses every length and every count
src/lib/prefs.svelte.ts   the sky switch. localStorage, never the database
src/lib/temperature.ts    Celsius is the one stored unit; °F is a keyboard
src/lib/now/  src/lib/sky/   MIRRORS of resonance-awen tools — do not edit
src/routes/               / (the circles) · /calendar · /settings
                          /onboarding /sattva /timer — inherited, routed, undoored
src-tauri/src/lib.rs      two migrations: moments (v1), marks (v2). ASCII to the byte
```

## Standards

This repo follows the
[Sanctuary Standards](https://github.com/Quantum-Weaver/resonance-standards).
`.gitignore`, this file, and `docs/CHECKLIST.md` are **SEED-class** —
planted once from the standards and this repo's own from then on. No
agent overwrites them (DOC-CLASSES law).


## The forge and the link tender

*(Landed 2026-08-19 at KP's word: each CLAUDE.md carries how THIS realm uses
them. tend.py is the one button — it sets UTF-8 once and never commits.)*

- **Blueprint forge** — one forge, every realm, no local copies (KP ⚛
  2026-08-03). Regenerate this realm's structure map (lands whole at
  `docs/blueprints/` + one journal line; structure is DISCOVERED, never
  declared — never hand-draw a tree):

      python c:/_superposition/resonance-ziggy/tend.py forge run --root c:/_superposition/resonance-sirens

- **Link tender** — every markdown pointer in this realm, both house shapes,
  resolved three ways; every mend ledgered at
  `resonance-ziggy/modules/link-tender/MENDS.md`. **Dry first, always**, and
  read the report before mending:

      python c:/_superposition/resonance-ziggy/tend.py links dry --root c:/_superposition/resonance-sirens
      python c:/_superposition/resonance-ziggy/tend.py links mend --root c:/_superposition/resonance-sirens

  Its laws hold here as everywhere: homes are never entered, history is
  reported never rewritten, a pointer it may not verify is never "fixed,"
  and mimirs-well is sealed absolutely.
