# DISTRIBUTED MIRROR — the source of truth lives in resonance-awen

As of 2026-08-18, the envelope's single editable truth is:

    ../resonance-awen/tools/the-envelope/src/index.ts

Do not edit `index.ts` in THIS folder — it is a byte-faithful mirror
(SHA256 verified at the copy: 58FD04DFE57EA5CA).

Sirens uses the tool rather than the shape. Echoes hand-rolls the same envelope
inline in its own settings page (it predates the tool); this app calls `seal`,
`filename`, `open` and `purgeAfter` directly, so the family's format is read
from one place instead of two.

Why a mirror and not a link: Sirens is a standalone, given-away-whole repo — a
link reaching outside it would break a lone clone's build.

Record: `docs/CHECKLIST.md`.
