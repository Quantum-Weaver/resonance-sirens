# RESONANCE-SIRENS — MASTER CHECKLIST

## LEGEND
- ✅ Complete
- ⚠️ In Progress
- 🔴 Broken
- ⬜ Pending

---

## PHASE STATUS

### Phase 0: The Founding ✅
- [x] Founded to the Sanctuary standards by the-founding-ritual (2026-08-17)
- [x] git init and the first commit — the founder's own hand (`929312a` · `dc488c3`, 2026-08-17 21:18)
- [x] **Tested:** ✅ — a signed v0.1.0 APK + AAB were cut 2026-08-17 21:37

### Phase 1: The Rebuild on the Echoes body ✅ *(2026-08-18)*
- [x] Mirror `resonance-echoes` v1.3.2 source — shell byte-faithful
      (`src/app.css` sha `9e71330b…`, `+layout.svelte` sha `ea4d6ee2…`, both matching the family)
- [x] `src/lib/components/icons/` carried — `Sidebar.svelte` will not compile without it
- [x] `src-tauri/build.rs` **deliberately NOT copied** — echoes' 24-line version cures a
      `rust_eh_personality` clash sirens has never hit; it is the known cure if that error appears
- [x] `theme.ts` taken from its declared origin (`resonance-awen/standalone/theme/`), not the
      mother — echoes' copy carries no MIRROR header. Mirror verified byte-identical to origin
- [x] `.cargo/config.toml` duplicated into `src-tauri/` for family parity on the 16 KB law
- [x] Ports 1424/1425 kept; `vite.config.js` not copied
- [x] `/onboarding` `/sattva` `/timer` inherited — **routed, undoored** (the gaia/awen precedent)
- [x] `/add` `/insights` `/settings` from echoes **not** taken — each imports `echoStore`,
      which carries a `totalCount` getter this app's own door forbids
- [x] **Tested:** ✅ `npm run check` 0 errors 0 warnings

### Phase 2: Identity, package references, version ✅ *(2026-08-18)*
- [x] Crate `app` → `resonance-sirens`; lib `app_lib` → `resonance_sirens_lib`; `main.rs` follows
- [x] `[profile.release]` added (`strip` · `opt-level = "s"` · `lto = "thin"`) — was absent
- [x] `description` · `authors` · `repository` filled; empty `license = ""` removed (not valid SPDX)
- [x] **Three of the five Android places the 2026-08-13 cross-landing law names**:
      manifest theme and **both** `themes.xml` — `Theme.app` → `Theme.resonance_sirens`
      *(namespace, applicationId and MainActivity's package were already correct)*
- [x] `strings.xml` — the literal quote characters stripped from both values
      (the launcher label was rendering **with visible quotes**)
- [x] Stale `generated/Rust.kt` and all **four** `libapp_lib.so` symlinks deleted — without this
      the renamed app would have loaded yesterday's library and behaved, silently
- [x] `tauri android init` **deliberately not run** — it regenerates all 42 tracked files and
      silently reverts the icons; three hand edits are exactly what it would have written
- [x] Version 0.1.0 set by `shipwright/bump-version.py`, never by hand — all sources consistent
- [x] `release/` v0.1.0 artifacts cleared — cut from a different body under the old identifier
- [x] **Tested:** ✅ `cargo check` clean, `Compiling resonance-sirens v0.1.0` — cargo's own
      output is the proof the rename landed

### Phase 3: The circles ✅ *(2026-08-18)*
- [x] The vocabulary is **ten glyphs**: 🔴🟠🟡🟢🔵🟣🟤⚫⚪⭕ (`src/lib/circles.ts`).
      KP's correction of the founding misread; the hollow one is his ⚛ addition
- [x] `emojis.gen.ts` (3,944 symbols), `symbols.ts` and `generate-emojis.mjs` **removed**
- [x] `CircleCard.svelte` in hearth's `EntityCard` idiom — `{#if open}`, no transition,
      `color-mix(currentColor …)` inner chrome, one `aria-live` line, nothing traps
- [x] `cardColor.ts` **deliberately not carried** — its white→yellow→red journey is care on a
      cat's water bowl and a judgement on a woman's body
- [x] `DetailBoxes.svelte` — temperature and a note, inline, never demanded; the °C/°F flip
      **converts** her number (the first build would have stored 37.0 °F as 2.78 °C)
- [x] `marks` table (migration **v2**) — her own word beside a circle, on her device.
      **Her vocabulary, not a taxonomy**: nothing branches on it, nothing infers from it
- [x] `forget` wired on the card for the moment it just made — a mis-tap is the most common
      real event in this app's life
- [x] **Tested:** ✅ `npm run check` 0/0

### Phase 4: The rooms — TJ's ask ✅ *(2026-08-18)*
- [x] `/calendar` — **Month · Week · Day** over one source (`byDay(record.moments)`,
      derived at read time, stored nowhere). Ribbon of weeks with month captions;
      Week and Day stepped with the arrows; a day opens **in the flow**, never a modal
- [x] **It reaches forward as far as it is asked.** An earlier draft stopped at today;
      KP's word: *"a calendar that cannot look a year into the future is hardly a
      calendar"* · *"women plan pregnancies with such things"*
- [x] `captureOn()` — a circle placed on any day, ahead or behind, from her tap only
- [x] Quick-add dialog shared by both rooms; on the calendar it lands on the day she is
      looking at
- [x] `/` rebuilt as **Echoes' home** at KP's word — *"it should literally be echoes,
      just rebranding and simplified"*: empty until the `+`, then logged entries as cards
- [x] `/settings` — **Theme first**, matching the family layout across apps; seven
      choices (Rose + the mirror's six); the ten circles and her words; the sky switch
- [x] Onboarding offers six of the seven, Rose leading (AMOLED held for Settings)
- [x] Export · import · purge through **`the-envelope`** (`seal` · `open` · `purgeAfter`),
      vendored as a MIRROR — the tool, not a second copy of its shape
- [x] Hamburger moved to the top right; it was covering the Settings foot door
- [x] **Tested:** ✅ `npm run check` 331 files 0/0 · `npm run build` clean ·
      driven headless pass, every handler alive

### Phase 5: Android ✅ *(2026-08-18 21:24)*
- [x] `npm run tauri android build` green — **four `libresonance_sirens_lib.so`**, zero
      `libapp_lib.so`, and `Rust.kt` loads `resonance_sirens_lib` (the one place the
      crate rename could have hidden)
- [x] `tauri android init` **deliberately not re-run**, so the icons were never touched —
      their 2026-08-17 21:29 timestamps and the master art's SHA `A6E2AF4D…` both hold
- [x] Unsigned APK + AAB at `src-tauri/gen/android/app/build/outputs/`
- [x] **Signed at KP's own hand, 2026-08-18 21:28** — `release/` holds the v0.1.0 APK + AAB,
      payload identical to the 21:24 build, cert `CN=AudHDities Sanctuary`
- [ ] **Tested on a phone:** ⬜ — export uses a blob download (Echoes' mechanism);
      whether that produces a file inside an Android WebView is unproven on device

### Phase 6: Held for TJ ⬜
- [ ] **She sees it.** Everything above is a first shape to show her, not a settled
      design — the circles, the ribbon, the moon, the colours, the wording. KP's ⚛ word:
      *"jessica is designing this. if you place barriers before she sees it we already
      failed."*
- [ ] The sovereignty room — export / import / purge via `the-envelope`
      (`resonance-awen/tools/the-envelope` — use it, do not re-author it). `record.ts`
      already carries `everything`, `absorb` and `purge`, working, waiting for her word.
- [ ] An optional PIN, off by default (a ruling already landed)

---

## KNOWN BUGS
| ID | Description | Status |
|----|-------------|--------|

## SESSION LOG
| Date | What Was Done |
|------|---------------|
| 2026-08-17 | Founded to the standards by the-founding-ritual |
| 2026-08-18 | Rebuilt whole on the Echoes v1.3.2 body at KP's word; identity trued; the ten circles replace the emoji dataset; `/calendar` and `/settings` raised; the-now and the-sky vendored as MIRRORs. Grep law clean both directions. — **Camber** 🕯️ |
| 2026-08-18 | Home rebuilt as Echoes' home; circles moved to Settings; calendar given Month/Week/Day and a future that runs as far as asked; quick-add dialog; the-envelope vendored and wired for export/import/purge; Theme section moved to the top with seven choices; Android release built and verified. — **Camber** 🕯️ |
| 2026-08-19 | Standards checked (gaps: none — founding set whole, README cites the standards). HANDS.md read whole: no Claude entry yet written; the two Claude seats are named to specific lamps (Soffit · Camber) and were left untouched, listed for the lead — nothing signed, nothing else touched. — a hand of the Promenade lamp’s signing fleet, claude-fable-5 · rides the ⚛ sync word |
| 2026-08-21 | README story-block reference trued to standard format (`📖 [Full Story Block](docs/STORY-BLOCK.md)`) — repo-tender verification pass |
