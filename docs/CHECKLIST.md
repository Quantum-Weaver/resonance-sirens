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
| 2026-08-22 | **THE CUMDACH FIX CARRIED — THE MINIMUM, at KP's word "hearth and sirens will be getting special attention soon, no need to get lost on them right now" (Fable 🎻, claude-fable-5, at KP's ⚛ word — *"in resonance-awen, there is a fix for the cumdach that needs applied then passed to all its consumers around the hamburger icon and around the epagoge regarding the background color and font size changes"* · *"echoes got the fix the cumdach needs"*).** The toggle that floated TOP RIGHT at KP's word of 2026-08-18 moved INSIDE the ComfortBar with the rest of the family (his 08-18 reasons kept whole in the Sidebar's styles — one word of his puts it back); `navOpen` in `uiStore`; the theme body from the origin (now carrying the family's own **Rose** preset — `sirens.rose`, THIS app's founding rose brought into cosmic at his word: *"there is a rose color in the sirens onboarding and settings we should bring into the cosmic design system"*); `TintLevel` + `tint`; the theme store's `setPreset` colour-only (the rose included — choosing it no longer resets mode or text size) + `setTint`; the tint row in its own Settings shape. **`SIRENS_THEMES` and the rose default stand untouched** — reconciling them with the shelf's Rose waits for the special-attention sitting. Cosmic: this repo has NO row in `resonance-ziggy/modules/cosmic/config/distribution.json`, so `src/lib/cosmic/colors.ts` was hand-laid byte-verbatim from the origin (the run's own bytes) — a manifest row is KP's to add. Gate `npm run check` **331 files · 0 errors · 0 warnings**. Nothing committed — rides the ⚛ sync word. |
| 2026-08-23 | **THE SPECIAL-ATTENTION SITTING — RAINBOW · PROGRESS PRIDE AT THE DOOR AND ON THE WALL, AND SETTINGS IN ECHOES' SHAPE (Fable 🎻, claude-fable-5, at KP's word — *"update the resonance-sirens to include the rainbow and pride theme setting and epagoge and make its settings screen match the layout our envelope has in echoes so it better resembles our apps settings layout"*).** **(1) The theme store reconciled with the shelf** — the 08-22 row's held thread: `SIRENS_ROSE` now reads `PRESET_THEMES.rose.accentColor` (cosmic `sirens.rose`, #E78FAE — the same hex the app was founded in), and `SIRENS_THEMES` is DERIVED from the shelf's table, Rose leading, every preset after it with `presetSwatch()` — so Rainbow and Progress Pride arrive on both walls without a line written for them, and any preset born later will too; `setPreset`'s 08-18 rose special-case retired; each entry carries the stored `presetName` so the active card is matched on what the store actually writes (Dark and AMOLED share an accent; AMOLED's label is shortened). **(2) The epagoge walk** — the offers were already the store's, so the door now shows eight (every preset but AMOLED — KP's 08-18 word *"swap out one and use rose in the onboarding, but keep all 7 choices in the settings"* kept as his standing word on the roster); the cards wear the stripe swatch. **(3) Settings rebuilt in Echoes' layout, section for section** — header · THEME (nine cards, the three pill rows in the mother's order: mode · tint · size) · YOUR CIRCLES · THE SKY (Sirens' own rooms, same measures) · DATA SOVEREIGNTY (stacked `Export All Data` · `Import Data` · `Export & Purge`, the import report, the privacy line, the DANGER ZONE card with the two-step confirm, the uninstall guide) · ABOUT (name · version · tagline · built-by · the Sanctuary link) — the styles carried from `resonance-echoes/src/routes/settings/+page.svelte`, the WORDS Sirens' own. **Where Echoes counts, Sirens says**: no number on the Data line and no button gated on one (the `totalCount` door this app forbids, Phase 1). The purge now does what the mother's does — `purgeAfter` (the envelope's order: file in hand first), then `localStorage.clear()` and a reload to the first screen — the purge truly purges, the name she gave at the door included. **Gates:** `npm run check` 332 files · 0 errors · 0 warnings · `npm run build` clean · headless-Edge screenshots (phone 390×844 @3×, Rose in dark and light) of Settings top to foot, the purge's first confirm, and the onboarding theme step with Progress Pride chosen — session-local frames. **TJ's word outranks all of it** — the About card's Sanctuary link and any phrasing here are hers to strike. Nothing committed — rides the ⚛ sync word. |
| 2026-08-23 | **THE PLAY PACK — SCREENSHOTS · README · PRIVACY · THE 512 ICON (Fable 🎻, the Stretto lamp, claude-fable-5, at KP's word — *"can you help organing and name the screen shot files i took of sirens … then need readme updated to show screen shots, similarly to how echoes does. also need a PRIVACY.md like echoes does so we can get this free app into close testing … we also need this in the size for the play store"*).** KP's ten captures (`resonance-assets/screenshots/sirens/`, 2026-08-23 19:29–20:08) viewed one by one by a hand, ordered as a walk (welcome → how it works → atmosphere → home and menu → a moment → calendar → settings: circles · sky · data sovereignty) and COPIED byte-identical (`cmp` ×10, originals untouched) to `screenshots/` in Echoes' convention. Two were the same welcome screen, one with the sigil misrendered as a compass — **KP purged that one the same evening** (*"i deleted the compass one, it was not supposed to be there"*): his hand removed the original, the conductor removed its copy, and the nine were renumbered `sirens-01..09.jpg` and re-verified byte-identical to their originals. README gained `## Screenshots` in Echoes' shape (the nine, each alt line the screen's own words). `PRIVACY.md` written from the family policy and CHECKED AGAINST THE CODE, not the README: no `fetch`, no HTTP crate, `INTERNET` only as Tauri's default, storage local — so "no network, not even optional" is a verified sentence; effective 2026-08-23. The Play icon cut `resonance-assets/logo-icons/sirens-512-play.png` (512×512, 264 KB) from the 896² logo, and a DRAFT feature graphic `resonance-assets/store/sirens-feature-graphic-1024x500.png` (his art's to replace). The pack founded at `docs/listings/PLAY-TRACK.md`: standards read from the signed v0.1.1 artifact's own badging (`aapt2`: versionCode 1001 · target 36 · `INTERNET` only) and certificate (`CN=AudHDities Sanctuary`, the family key of 08-17 — a first upload, no reset pending); copy paste-ready (short 77/80). **Two gates his ⚛:** the repo is PRIVATE today (404 unauthenticated) and the privacy URL needs it public at upload; the category (Lifestyle per Echoes' precedent, or Health — the app makes no medical claim either way). Upload at his hand. Nothing committed — rides the ⚛ sync word. |
