# DISTRIBUTED MIRROR — the source of truth lives in resonance-awen

As of 2026-08-18 (the rebuild, and TJ's calendar), the clock reader's single
editable truth is:

    ../resonance-awen/tools/the-now/src/index.ts

Do not edit `index.ts` in THIS folder — it is a byte-faithful mirror
(SHA256 verified at the copy: D825B37945A2A907), refreshed by distribution runs, the
same road the cosmic mirror travels.

`src/lib/days.ts` imports from here and is the ONLY place in this app that
asks what day it is. Its own reason, verbatim: *"'what is today' is the one
fact a program most often assumes and most often gets wrong."*

Why a mirror and not a link: Sirens is a standalone, given-away-whole repo —
a link reaching outside it would break a lone clone's build. The mirror keeps
Sirens sovereign.

Record: `docs/CHECKLIST.md`.
