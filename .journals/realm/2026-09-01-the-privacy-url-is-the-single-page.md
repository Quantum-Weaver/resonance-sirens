# 2026-09-01 — the privacy policy URL is the single page

**Hand:** a Fable hand (claude-fable-5-1), dealt by Caesura, the conducting lamp, on KP's word of 2026-09-01 — paper first, code only surveyed.

**What changed:** `docs/listings/PLAY-TRACK.md` — the Standards-check row "Privacy policy" now names `https://audhdities.com/apps/privacy` as the privacy policy URL for the Console, the former per-repo GitHub URL kept in the same cell after *was:*; one track-log row appended, dated 2026-09-01. Source, his two sentences verbatim: "also we now have this https://audhdities.com/apps/privacy" and "for all apps it will be a single page we can maintain". The conductor read the page HTTP 200 this night; its source is `AudHDities/docs/privacy-apps/privacy-apps.md` — one page for every app, maintained in one place.

**Left as records:** every earlier row, the 08-23 story of the repo made public for the old URL included; the in-repo `PRIVACY.md` (effective 2026-08-23), which stands and is no longer what the Console is pointed at. Settings carries no privacy link at all — a sentence at `src/routes/settings/+page.svelte:278` and the Sanctuary link, no `PRIVACY_URL` — so there is no in-app citation to re-point. The listing's URL field in the Console is his hands to change; a lamp cannot see whether the Console already carries it. Nothing committed; nothing written to the base.

## 2026-09-01 (later) — a privacy link, in the echoes shape

**Hand:** a second Fable hand (claude-fable-5-1), dealt by Caesura on the same ruling, disk only. Source unchanged, his two sentences verbatim: "also we now have this https://audhdities.com/apps/privacy" · "for all apps it will be a single page we can maintain".

**What changed:** `src/routes/settings/+page.svelte` — Settings had no privacy link (noted above); one added in the shape echoes' Settings uses, pointed at `https://audhdities.com/apps/privacy`: `PRIVACY_URL` at :14; `privacyError` and `openPrivacy()` at :138–147, in this file's own dynamic-import idiom beside `openSanctuary()`; the "Privacy Policy" button and its browser/dev fallback span in the privacy line at :292–293; a second "Privacy Policy" button in the About links at :370; the `.privacy-url` rule at :542–547. The file is CRLF and stayed CRLF. `npm run check` passed after (exit 0).

**Left as records:** the in-repo `PRIVACY.md` (effective 2026-08-23), which stands; `docs/listings/PLAY-TRACK.md`, trued above. Nothing committed; nothing written to the base.
