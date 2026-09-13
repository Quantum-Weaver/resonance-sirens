# 2026-09-13 · opener · built

The settings page calls `openUrl` at `src/routes/settings/+page.svelte:131-141`
(`openSanctuary`, `openPrivacy`). Before this sitting the JS package stood alone.

What was found:

- `package.json:20` — `@tauri-apps/plugin-opener` `^2` present (lock: 2.5.4).
- `src-tauri/Cargo.toml` — crate absent.
- `src-tauri/src/lib.rs` — plugin not registered in the builder.
- `src-tauri/capabilities/default.json` — no `opener:` permission.

What is now:

- `src-tauri/Cargo.toml:26` — `tauri-plugin-opener = "2"` (resolved 2.5.5).
- `src-tauri/src/lib.rs:57` — `.plugin(tauri_plugin_opener::init())`, first in the
  builder chain, before the SQL plugin.
- `src-tauri/capabilities/default.json` — `opener:allow-open-url` as an extended
  entry scoped to `https://audhdities.com` and `https://audhdities.com/*`, not
  `opener:default` (which carries `allow-default-urls`: `http://*`, `https://*`,
  `mailto:*`, `tel:*`). `allow-open-url` without a scope forbids every URL —
  `tauri-plugin-opener-2.5.5/src/commands.rs:36` returns `Error::ForbiddenUrl`.
- `src-tauri/Cargo.lock` — updated by `cargo check`.

Android: `src-tauri/gen/` is gitignored and regenerated; the opener crate ships
`android/` and enters `gen/android/tauri.settings.gradle` on the next
`tauri android dev`/`build`. That file was not touched.

Gates: `cargo check` finished, no errors. `npm run check` — 337 files, 0 errors,
0 warnings. `src-tauri/gen/schemas/desktop-schema.json` now carries the eight
`opener:` identifiers; `src-tauri/gen/schemas/capabilities.json` carries the
scoped entry as written.

The envelope, read only: `src/lib/envelope/index.ts` with `MIRROR.md` beside it,
imported at `src/routes/settings/+page.svelte:10` (`seal`, `filename`, `open`,
`purgeAfter`). It is a copy of `../resonance-awen/tools/the-envelope/src/index.ts`
lines 15-124, differing in two comment lines; the source has since grown to 567
lines (`deliver`, `openFrom`, `provePurge`, `host-surface`). Delivery in
`exportData` is a Blob and an anchor click, not the tool's `deliver`.
`@tauri-apps/plugin-dialog` and `@tauri-apps/plugin-fs` stand in `package.json:18-19`
with no Rust crate, no capability entry and no import anywhere in `src/`.
