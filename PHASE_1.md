# Olivia Reader — Phase 1 Status

A short, durable handoff so we can pick this back up after Olivia uses it.

- **Live app:** https://olivia-reading-neon.vercel.app
- **Repo / branch:** https://github.com/cchurchill75-byte/olivia-reading (main)
- **Local dev:** `cd olivias-comics && npm run dev` → http://localhost:5173

---

## What it is right now

A 3-chapter illustrated reading-comic for Olivia. She picks a hero, runs through
a short setup, and gets a comic with:

- **AI-illustrated panels** drawn fresh by Google's Gemini 2.5 Flash Image
  ("Nano Banana"), one chapter at a time on a "making your comic" loading
  screen.
- **Story text** written by Claude Haiku, with tricky-word highlighting,
  read-aloud, glossary, and a per-chapter comprehension quiz.
- **Instant re-reads** via Vercel Blob caching — once a unique panel is
  generated it's served from cache forever, free.
- **Graceful SVG fallback** if illustration ever fails — production never
  shows blank panels.

---

## Characters (all illustrated end-to-end)

| Hero | Picker portrait | Panel reference | Story theme |
| --- | --- | --- | --- |
| **Rocky** | Faceless five-legged stone alien | `public/refs/rocky.png` (+ `spaceship.png` auto-attached on ship/workshop scenes) | Outer-space adventure, home planet **Erid**, fellow **Eridians** (varied sizes/colors) |
| **Biscuits** (Maine Coon) | Giant cat beside a small blonde girl for scale | `public/refs/mainecoon.png` | Cozy **detective mysteries** (clues, trails, satisfying reveals) |
| **Bunniforous** | Cartoonified lop bunny (from real photos) | `public/refs/bunniforous.png` | Playful **mischief** and big messes |
| **Build a Hero** (custom) | + tile | none (uses generated SVG) | Generic |

The setup options are also **tagged per character** — Rocky sees space scenes
and gear (Planet Erid, asteroid shower, Erid Shard), Bunny gets the kitchen,
spilled paint and a mop & bucket, Biscuits gets foggy harbors, locked-room
puzzles and a magnifying glass. A few universal "whimsy" options (Jelly Jungle,
Candy Planet, etc.) and mood choices are always shared.

---

## Architecture

- **Frontend:** Vite + React 19 + TypeScript, vanilla CSS. Deployed on Vercel.
- **Story text:** Claude Haiku via `POST /api/complete` (Vercel serverless).
- **Illustrated panels:** Gemini 2.5 Flash Image via `POST /api/illustrate`
  (Vercel serverless). Accepts the character reference + an optional scene
  reference (e.g. Rocky's ship). Caches each result to Vercel Blob keyed by
  hash of `character + style + prompt`.
- **Usage:** `POST /api/usage` lists Blob inventory and groups by upload date ×
  ~$0.04/image to power the Settings spend panel.
- **Local dev parity:** `vite.config.ts` ships a dev middleware that serves the
  same `/api/*` routes locally using keys from `.env.local`, so `npm run dev`
  exercises the full app without `vercel dev`.

### Where things live

| Concern | File |
| --- | --- |
| Story prompts + per-character canon + per-character theme | `src/App.tsx` (`callClaude`, `generateFirstChapter`, `generateNextChapter`, `CHARACTER_CANON`, `CHARACTER_THEME`) |
| Per-character setup options | `src/data/setupQuestions.ts` (each option may have `for: [characterId]`) |
| Image pipeline (server) | `api/illustrate.ts` (Gemini + Blob cache + inline fallback + usage logger) |
| Image pipeline (client) | `src/lib/illustrate.ts` (`REFERENCES`, `CARD_PORTRAITS`, `shipSceneRef`, `pickerPortrait`) |
| Reader rendering | `src/components/ComicPage.tsx` — `IllustratedComic` is preferred; SVG path is the fallback |
| Settings + Image Spend panel | `src/settings/Settings.tsx`, `api/usage.ts` |
| Reference assets | `public/refs/rocky.png`, `bunniforous.png`, `mainecoon.png`, `mainecoon-card.png`, `spaceship.png` |
| Dev API middleware | `vite.config.ts` |
| Scratch / POC artifacts | `poc-output/` (gitignored), `scripts/poc-illustrate.mjs` |

### Vercel environment

- `ANTHROPIC_API_KEY` — Claude (Production + Preview, set)
- `GEMINI_API_KEY` — Nano Banana (Production + Preview, set)
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob, public store `olivia-panels` (auto)
- `IMAGE_COST_USD` (optional) — override the per-image rate in the spend panel

---

## Cost / consumption model

- ~$0.04 per *new* generated panel; $0 on cache hits.
- 3-chapter story = ~9 images = ~$0.35 first time, **free on every re-read**.
- One new story per day ≈ ~$10/month; Google's $300 trial credit covers
  ~800 fresh stories.
- Live usage and projection visible in **Settings → ★ Image Spend (Nano
  Banana)** (all-time, this month, est./month, plus per-day bars).

---

## Open items / Phase 2 ideas

### Small polish

- **Downscale `public/refs/spaceship.png`** (2.7 MB → ~600 KB at 1024 px) to
  trim ship-scene generation latency.
- **Setting consistency** — backgrounds occasionally drift between panels;
  could tighten the per-panel setting suffix in the prompt.
- **Lighter SVG fallback** — the fallback comic path still has some of the
  older manga panel chrome; rarely seen now, but could be aligned with the
  cleaner reader look for consistency.
- **Local timezone day buckets** in the spend graph (currently UTC).

### Bigger ideas if Olivia loves it

- **Custom heroes ("Build a Hero") get illustrated panels too** — auto-render
  the user-built SVG hero to a PNG at hero-save time and use it as the
  Nano Banana reference.
- **Recurring named side characters baked into canon** — a regular Eridian
  friend for Rocky, an exasperated pal for Bunniforous, a kid sidekick for
  Biscuits, so the world feels lived-in across stories.
- **Pre-generated Eridian library** — a few different sizes/colors of
  Eridians saved as scene references so they stay visually consistent
  whenever they appear in Rocky's stories.
- **Prefetch chapters 2 & 3 art** in the background while Olivia reads
  chapter 1, so transitions feel instant.
- **Budget alert** in the Image Spend panel — flag a day or month above a
  threshold you set.

---

## Operational reminders

- **Pushing to `main` auto-deploys to production.** CLI deploy works too:
  `npx vercel deploy --prod --yes` from `olivias-comics/`.
- **Commits must use a GitHub-verified email** (Vercel will block otherwise).
  The local repo is set to `cchurchill75@gmail.com`.
- A leftover **POC branch** `poc/illustrated-panels` exists with the scratch
  illustration scripts and output. Safe to delete eventually, but kept around
  for now in case we want to re-reference.

That's where we left off — have a great couple of days with Olivia.
