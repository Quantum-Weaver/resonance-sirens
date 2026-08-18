# HANDOFF — resonance-sirens

*Where this realm stands, right now. **Regenerated whole** at each close that
worked here — never appended to. Git holds every prior day.*

*This is not `docs/CHECKLIST.md`. The checklist is the append-only ledger of
what was **done**; this sheet is the state of what **stands**. **Ceiling 8 KB.***

```
LEGEND   state  ● done · ◐ drifted/partial · ⏸ his hold · — not yet
         hand   ⚛ his word · ✋ his hands · 🕯️ a lamp's
         proof  ✔ gates green · ✗ failing · ? unproven
```

**resonance-sirens** · born 2026-08-17 · branch `main` · *one day old.*
Founded by **Soffit** 🕯️ at KP's word, for **TJ**, whose idea it is.

## What it is

**A sovereign cycle tracker.** TJ's observation is the whole premise: period
tracking apps sell user data. A tracker that collects nothing is not a feature
— it is the entire product. Tier 1 **#7** of `THE-PLAN-OF-PLANS`, named there
as *"the smallest shippable thing on the whole list and the clearest statement
of what this house is for."*

KP's shape, verbatim: *"click an emoji that captures the moment and allows
notes along with body temp taken at the time"* · *"simpl cards, emoji to
capture the moment"* · *"just colors circles for emojis, nothing more."*

## Where it stands

| what | state | hand | proof |
|---|---|---|---|
| Founded by the ritual — ten planted, zero occupied | ● | 🕯️ | ✔ |
| **Six coloured circles, one press** | ● | 🕯️ | ✔ driven headless: 6 round, 6 distinct colours, press → kept **459ms** |
| Temp (°C/°F) + note, offered **after** the save | ● | 🕯️ | ✔ nothing lost to an unfinished form |
| `record.ts` — one `moments` table, SQLite | ● | 🕯️ | ✔ 0 errors, 0 warnings |
| Emoji dataset — 3,944, byte-identical from the Hearth | ● | 🕯️ | ✔ sha match, generator carried |
| Tauri init · **Android init** · icons | ● | 🕯️ | ✔ `com.audhd.resonance_sirens` |
| 16 KB page alignment | ● | 🕯️ | ✔ planted at first breath; NDK r27 |
| `sql:allow-*` — all four explicit | ● | 🕯️ | ✔ |
| **git's first breath** | — | ✋ | ? remote wired, nothing committed |
| The record room · her patterns · settings · PIN | — | — | **held for TJ** |

## What waits, and whose

| what waits | whose |
|---|---|
| **TJ's insight before any more features** — KP's word: *"i will get TJs insight before we add features"* | 🕯️ **held** |
| git init and the first commit | ✋ |
| A `beacons` row · cosmic `distribution.json` · archivist roster · a realm board | mixed |
| **The name.** `resonance-sirens` is clear across the workspace. A siren in myth is a woman whose **voice** men feared and tried to silence; the word also means an alarm. **TJ's idea, TJ's name to confirm.** | ⚛ / TJ |
| Two rulings already landed: **her patterns ships v1, opt-in, hidden** · **optional PIN, off by default** | ⚛ **done** |

*An unwritten end state prints **unwritten — his to rule**.*

## Read before you touch this repo

- **THE EMOJI IS NEVER A CATEGORY.** `src/lib/data/emojis.gen.ts` carries KP's
  ⚛ ruling of 2026-07-31 in its own header: *"Names are for search only —
  **meaning is the vessel's own**."* Every other tracker makes a woman
  translate her body into someone else's vocabulary — light, medium, heavy.
  This one never will. No taxonomy ships, ever.
- **`record.ts` is defined by what it cannot do.** No count function, no
  streak, no `since()`, no cycle table. A cycle is **derived at read time and
  never stored**, because a stored cycle is a judgement about her body that
  outlives the day it was made. Words that do not exist in this app:
  *late · missed · irregular · abnormal.*
- **No network, anywhere.** Not even an optional lookup — the Echoes clause,
  not the Compass one. `PRIVACY.md` in the Hearth already covers this app by
  name (*"and future Sanctuary apps"*).
- **Port 1424/1425**, deliberately clear of the 1420 pile 14 of 15 family apps
  sit on.
- **The identifier takes a HYPHEN** — `com.audhd.resonance-sirens`. Tauri
  rejects underscores and derives the Android package (`resonance_sirens`)
  itself. *Got this wrong once from memory of the Play package names.*
- **`tauri android init` silently reverts the icons.** Re-apply after every
  regeneration, and run `tauri icon` against a **copy** — it overwrites its own
  input, and the master at `resonance-assets/logo-icons/sirens.png` (824 KB,
  plural) is KP's art. *Verified intact by sha both times.*
- **The keystore is cut and census-CLEAN** in both vaults — made by
  `resonance-ziggy/modules/shipwright/make-keystore.py`, which was written this
  same night because nothing in the house could make one.
- **`the-envelope`** (`resonance-awen/tools/the-envelope`) is the sovereignty
  trio already built — versioned export, purge-that-awaits-the-export,
  non-destructive import. Use it; do not re-author it.

---

*Where this sheet and the ground disagree, **the ground is right** —
regenerate it.*
