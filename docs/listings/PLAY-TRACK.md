# Sirens — Google Play test track

*Founded 2026-08-23 by Fable 🎻 (the Stretto lamp, claude-fable-5) at KP's ask
("we need a PRIVACY.md like echoes does so we can get this free app into close
testing … which means we also need this in the size for the play store").
Companion shape to echoes' and bubbles' PLAY-TRACK.md — the Console is the
truth; this file is the pack KP transcribes from, so his hands never have to
compose at the upload screen.*

## Standards check — verified against the signed artifact, 2026-08-23

| Requirement | State |
|---|---|
| Target API level | ✅ targetSdk **36** / compileSdk 36 — read from the signed APK's own badging (`aapt2 dump badging release/resonance-sirens-v0.1.1.apk`) |
| 16 KB page size | ✅ `src-tauri/.cargo/config.toml` carries `max-page-size=16384` — the family-wide law |
| App Bundle | ✅ `release/resonance-sirens-v0.1.1.aab` (19.6 MB), signed 2026-08-23 20:05 by KP's hand; `v0.1.0.aab` (2026-08-18) stands beside it |
| versionCode | ✅ **1001** (v0.1.1) — machine-read from `src-tauri/gen/android/app/tauri.properties` and the APK's badging. **If v0.1.0 (1000) was ever uploaded, 1000 is consumed — the Console knows, this file does not.** |
| Package | ✅ `com.audhd.resonance_sirens` (badging); identifier `com.audhd.resonance-sirens` (tauri.conf.json) |
| Upload key | ✅ the artifact is signed `CN=AudHDities Sanctuary, O=AudHDities Sanctuary, C=US` — the family key cut 2026-08-17, SHA-256 `2E:24:DA:4D:…:F5:F6:FB` (`keytool -printcert -jarfile`). **A first upload registers this as the upload key; no reset is pending here** — the reset walk in the `play-track` skill is for apps that shipped on the old key. |
| Permissions | ✅ minimal: `INTERNET` (Tauri webview default; the app makes no network calls — verified by grep: no `fetch`, no HTTP crate) + the system's own self-scoped `DYNAMIC_RECEIVER_NOT_EXPORTED` — data-safety answers stay "collects nothing" |
| Privacy policy | ✅ `PRIVACY.md` in-repo (effective 2026-08-23, the family policy adapted: no network, not even optional) → URL `https://github.com/Quantum-Weaver/resonance-sirens/blob/main/PRIVACY.md` — ⚠ **the repo answered 404 to an unauthenticated GET on 2026-08-23: it is PRIVATE today. The URL only works once the repo is public, and whether it goes public is KP's ⚛ gate.** |
| Content rating | ✅ no UGC · no ads · no purchases · no collection → answer the literal questions; see below |
| Category | ✅ **Lifestyle — not health. RULED ⚛ 2026-08-23:** *"keep in mind we are not listing anything about health for this, it is a simple calendar app to track moments with the emoji definitions belonging to the user."* Echoes' precedent holds (KP ⚛ 2026-08-21: *"echoes does not need to be a heath app"*), which is what avoids the health declarations. The listing below carries no health word; the app makes no claim — it has no vocabulary, counts nothing, predicts nothing. Answer the Console's literal questions; never claim a feature it does not have. |

## The upload pack (KP's hands)

- **Artifact:** `release/resonance-sirens-v0.1.1.aab` (versionCode 1001)
- **Path:** Console → Create app (Resonance Sirens, App, **Free** — his word: "this free app") → Testing →
  Closed testing → Create track → Create new release → upload the AAB →
  paste below → **Review release → Start rollout** (an upload alone is a draft).
  Testers: the family's one list.
- **Store listing icon:** `resonance-assets/logo-icons/sirens-512-play.png` (512×512, 264 KB, cut 2026-08-23 from the 896² `sirens.png`)
- **Feature graphic (DRAFT, his to replace):** `resonance-assets/store/sirens-feature-graphic-1024x500.png` — the icon centred on its own corner colour; a real one is his art's to be
- **Phone screenshots:** `screenshots/sirens-01.jpg` … `sirens-09.jpg` in this repo (listing order = README order; originals at `resonance-assets/screenshots/sirens/`). *A tenth capture with the sigil misrendered was purged at KP's word the same evening — "it was not supposed to be there."*
- **Tablet screenshots:** none yet — Play accepts a phone-only listing for a test track; 7"/10" canvases are a later sitting if wanted.

### App name (30 char max — this is 16)

```
Resonance Sirens
```

### Short description (80 char max — this is 74)

```
A simple calendar for your moments. The emoji mean what you say they mean.
```

### Full description — paste-ready (KP's ⚛ framing, 2026-08-23: a simple calendar app to track moments with the emoji definitions belonging to the user)

```
A simple calendar for your moments.

Ten emoji. You press one, and that moment is kept — the day, the time, and
a note if you feel like writing one. That is the whole of it.

The emoji have no names and no definitions until you give them one. Nothing
in this app decides what a red circle means, or a green one, or the hollow
one — you can write your own word under any of them, on your own device,
and even then the app only ever hands it back to you. The meanings belong
to you. It doesn't have a vocabulary of its own, and it never learns yours.

There are no counts, no streaks, no missed days. Nothing is measured against
an average, because nothing is counted. The calendar shows your emoji on the
days you pressed them and says nothing at all about the days you didn't — a
day you skipped looks exactly like a day you didn't.

Nothing leaves your device. There is no account, no sync, and no network
call anywhere in the code — not even an optional one. The way not to sell
what an app learns about you is for it not to learn anything.

★ Ten emoji, and their meanings are yours to write — or leave unwritten.
★ One press keeps a moment; a note only if you want one.
★ A calendar with a moon on every day, and no judgement on any of them.
★ Eight themes, Rose leading; the sky shown or hidden.
★ Export everything, import it back, or purge it — truly gone.

Sovereign by design: Resonance Sirens runs entirely on your device. No
account, no cloud, no ads, no tracking, no data collection.

Part of the AudHDities Sanctuary — software built by neurodivergent makers,
with sensory consideration and dignity as the ground floor.
```

### Release notes — first upload (under the 500-char limit)

```
<en-US>
The first release: ten emoji whose meanings are yours to write, a moment
kept at one press — with a note if you want one — a calendar that counts
nothing, eight themes, and a data sovereignty room where export, import and
purge are real. No account, no network, nothing leaves your device.
</en-US>
```

### Data safety form — the answers

- Does your app collect or share user data? **No.**
- All sections thereafter: no collection, no sharing, no data processed
  ephemerally. Data is stored on-device only and never transmitted.
- Security practices: data is not transmitted (n/a) · users can request
  deletion via the in-app purge (Settings → Data Sovereignty) — answer
  honestly per the form's exact wording at time of filing.

### Content rating questionnaire

- Category: app (lifestyle/tracker — his ruling above). No violence, no
  sexuality, no profanity, no controlled substances, no gambling, no UGC, no
  location sharing, no personal-data sharing. → expect **Everyone**; the
  Console decides.
- A calendar of moments with user-defined emoji: no health, medical or
  fitness feature is offered, claimed or listed (KP ⚛ 2026-08-23). Answer the
  questionnaire's literal questions as asked.

## Track log

| Date | State |
|---|---|
| 2026-08-23 | Pack founded: 512 icon cut · draft feature graphic · nine phone shots placed and named from KP's captures (a tenth, misrendered, purged at his word the same evening; the nine renumbered 01–09 and re-verified byte-identical) · PRIVACY.md written from the code (no network, not even optional) · standards read from the signed v0.1.1 artifact's own badging and certificate. **Two gates his:** the repo is private and the privacy URL needs it public; the category. Upload at his hand. Lesson inherited from echoes' log: **a versionCode is consumed at UPLOAD, not at publish** — a deleted draft does not return it; "Add from library" is the way back in. |

— Fable 🎻, the Stretto lamp
