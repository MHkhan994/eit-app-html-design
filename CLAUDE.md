# CLAUDE.md — ETI-App

Engineering reference for this repo: tech stack, design system, architecture, and standing
conventions. For the screen-by-screen build history, what's built vs. not, and per-screen
decisions/evidence notes, see `CONTEXT.md`.

## What this is

A Bangladeshi poultry farm management app being rebuilt for a client: a functionality copy of
an existing app, with upgraded visual design. Rebuilt screen-by-screen from client-provided
screen recordings or pre-extracted screenshot folders.

Core features (from client brief): Buy/Sell marketplace, doctor/vet appointment booking, blog,
general poultry data management. The Home screen has three tabs: **General**, **Parent Stock**,
**Hatchery**.

## Tech stack

Plain multi-page static site — **HTML + CSS + vanilla JS, no framework, no build step, no
server dependency.** Pages work directly over `file://` or any static host (Netlify Drop /
Vercel / GitHub Pages "just work" since routing is plain `<a href>` between real files).

**Fonts:** Google Fonts via `<link>`:
- **Baloo Da 2** (weights 500–800) — display/headers/section titles/price numbers. Rounded,
  friendly, supports Bengali.
- **Hind Siliguri** (weights 400–700) — body text, labels, UI chrome. Clean, supports Bengali.

We started in Figma (via Figma MCP) but hit the Starter plan's MCP tool-call rate limit
partway through the Home screen's design pass. Switched to building directly as HTML/CSS
mockups instead — no rate limits, and the user can host/demo it directly. **All work continues
in this HTML/CSS/JS approach unless told otherwise.**

## Design system (established — reuse exactly, don't invent new colors/fonts)

**Colors:**
```css
--moss:#3D6B4F;         /* primary */
--moss-dark:#2E5540;
--gold:#E8A93E;         /* accent/CTA */
--gold-soft:#FBEBCB;    /* badge background */
--rust:#C1502E;         /* alerts/secondary accent */
--rust-soft:#F5DCD3;
--moss-soft:#DCE8DF;
--bg-sand:#EFF2E9;      /* app background, NOT pure white */
--card-white:#FFFFFF;
--text-charcoal:#23281F;
--text-secondary:#5B6355;
--border-soft:#E2E0D3;
--info-blue:#3B6E91;    /* status-only use (e.g. "Recovery" stat tile) */
--indigo-soft:#E7E8F3;  /* pale tint for indigo-tagged report cards */
```
When the source recording shows a color with no matching token (e.g. Android system accents,
a stray brand color used once), map it to the nearest existing token rather than inventing a
new one — e.g. Android's teal "today" accent → `--moss`, a slate CLEAR button →
`--text-charcoal`, a bright blue Calculate button → `--moss`. Only add a genuinely new token
(like `--info-blue`, `--indigo-soft`) when nothing in the palette is close and the color repeats
across screens.

**Spacing/radius:** `--r-sm:6px; --r-md:10px; --r-lg:16px; --r-pill:999px;` — 8px-based spacing
scale used throughout (4/8/12/16/24/32).

**Signature design moves (apply to every new screen):**
- Color-coded circular icon badges per category (gold/rust/moss rotating) instead of plain
  photos — real product photography/illustrations aren't available yet, so emoji placeholders
  stand in everywhere real assets are missing.
- Chip-style pill tags for data values (prices etc.) instead of plain text
- Floating rounded bottom nav with gold circle marking the active tab
- Cards: white background, `--r-lg` corners, soft drop shadow (`0 4px 14px rgba(35,40,31,0.07)`)

**Header patterns** — four exist; match whichever the source recording actually shows, don't
assume one applies to a whole section:
- `.subpage-header` — full-width colored bar (rust or moss) + back arrow
- `.plain-header` — no colored bar, just a back arrow (sometimes with a title, sometimes bare)
- `.inset-header` — a rounded colored block set in from the screen edges (not full-width)
- `.page-head` — bare bold-black left-aligned title, no colored bar, moss back arrow

## Architecture / file structure

Multi-page static site, organized by folder. Shared CSS/JS live under `assets/`. **Root
`index.html` is the single entry point.**

```
eti-app/
├── index.html                  ← entry point / Home (General, Parent Stock, Hatchery tabs)
├── assets/
│   ├── css/styles.css          design tokens + component styles (shared by every page)
│   ├── js/app.js               showSub() — toggles Home's subpanels; showFieldGroup() — generic radio-driven field-set swap
│   ├── js/shop.js              Buy: catalog + Cart + Orders. Sell loads it too, for Shop's money/date/qs/toast/storage helpers
│   ├── js/sell.js              Sell: Listings + form collect helpers. Load AFTER shop.js — it calls Shop.readJSON/dateLabel
│   └── images/                 real images once available (currently emoji placeholders)
├── buy/                        catalog → product → cart → checkout → success → orders → tracking
├── sell/                       lead capture — landing + 4 category forms → success → submissions → tracking
├── doctor/index.html
├── databank/                   9-tool list + each tool's full inner flow
├── accounting/                 drill-down from Home's হিসাব নিকাশ grid card — 10-tool list + calculators
├── production-cost/            drill-down from Home's উৎপাদন খরচ grid card — 3-tool list + calculators
├── farm-management/            drill-down from Home's খামার ব্যবস্থাপনা grid card — article list + detail
├── vaccine-info/                drill-down from Home's ভ্যাকসিন তথ্য grid card — article list
├── disease-diagnosis/          drill-down from Home's রোগ নির্ণয় grid card — article list
└── disease-control/            drill-down from Home's রোগ বালাই grid card — article list + detail
```

**Conventions to keep following as more screens land:**
- Every bottom-nav-level screen gets `<section>/index.html` (mirrors `buy/`, `sell/`, etc.) —
  leaves room for that section growing its own sub-pages later without a rename.
- A drill-down/detail screen reached from a grid card or list item lives as a sibling file
  inside the same folder as its parent list (e.g. all accounting calculator tools stay inside
  `accounting/`), not scattered elsewhere.
- CSS/JS are always referenced relative to the file's own depth: root pages use
  `assets/css/styles.css`; anything one folder deep uses `../assets/css/styles.css`.
- Bottom-nav pages link to each other with `../<section>/index.html`; the Home link from
  inside a section folder is `../index.html`.
- Each file repeats the small shell markup (status-bar + app-bar + bottom-nav) itself — plain
  HTML has no includes without a build step, and this keeps every page a standalone, hostable
  file.
- Drill-down pages replace the app-bar with a colored `.subpage-header` + back arrow instead of
  the bottom nav (or another header pattern — see above), matching the recording. Screens that
  hide the app-bar/bottom nav need an added back arrow; nav-level destinations (reachable again
  via the bottom nav) don't.

## Development rules

- **"Static mockup, no working logic" means no calculation** — it does NOT mean no
  interactivity. Toggles that just switch which recorded UI state is visible (radio buttons
  swapping field sets, dropdowns changing which fields show, checkboxes toggling) are fine and
  expected. The line is "shows another real state from the recording" (yes) vs. "computes a
  result from user input" (no).
- **Every field is typeable — no `disabled` on inputs**, except a field the *original app
  itself* renders greyed and locked. Typing is not computing: what we don't build is the
  result, not the ability to enter a value.
- **Every calculator/tool screen ships with its result section pre-filled with realistic
  example data**, not a blank/placeholder state — real captured values when the recording shows
  a computed result, plausible synthesized ones otherwise. This applies to the results/output
  only; form inputs above stay empty placeholders.
- No real product photography/illustrations yet — use color-coded emoji badges (gold/rust/moss
  rotating) as placeholders everywhere the original uses real images.
- Sibling-looking screens (e.g. near-identical calculator forms) still differ in field sets,
  option lists, button labels, and result units — read each recording/screenshot directly
  rather than cloning a previous file and assuming.
- Before treating a visual detail (e.g. a colored border) as a persistent style, check focused
  vs. unfocused frames — it may just be a transient focus ring.
- Only include dropdown/select options that are actually confirmed in the source material.
  Generic 3-tier scale labels (Low/Medium/High, Good/Fair/Poor) are a looser evidence bar and
  can be reasonably completed; specific domain facts (breed names, disease names) should not be
  invented.
- If a workflow's scope is too large to transcribe in full from the available frames (e.g. a
  60-question checklist), ship a representative subset and label it explicitly in the file
  rather than inventing the rest or silently truncating.
- The user does their own visual verification (opening pages, checking layout) — building from
  the recording/images plus established CSS components is trusted as-is; only reach for a
  browser check if something is genuinely ambiguous and can't be resolved by re-reading the
  source frames.

## How to add a new screen

1. User provides a screen recording (phone) of the feature, **or** a folder path containing
   pre-extracted screenshots — read images directly, no extraction step needed for the latter.
2. If it's a video, extract frames with ffmpeg and identify distinct screens/states.
   - **macOS:** `brew install ffmpeg` (Apple Silicon → `/opt/homebrew/bin/ffmpeg`)
   - **Windows:** `winget install --id Gyan.FFmpeg -e --silent`, then refresh PATH
   - For a long, near-static recording, don't just sample every Nth frame — compare frame file
     sizes (`stat -f "%N %z" f_*.jpg`) to spot outliers (e.g. a dropdown-open state briefly
     covering detail); cheaper than reviewing every frame by eye.
3. Decide: is this a **new top-level bottom-nav screen** (new `<section>/index.html` folder,
   copy the shell from an existing page) or a **drill-down from an existing grid card/list
   item** (new file inside the parent section's folder, linked via
   `<a class="grid-card" href="...">` or `<a class="list-card" href="...">`)?
4. Build functionality-match markup first, using the existing CSS variables — don't invent new
   colors/fonts. If it's a calculator/tool screen, build the static UI only (see Development
   rules above) unless told otherwise. Always fill the result section with realistic example
   output.
5. Wire up the link from wherever it's launched (bottom nav and/or grid-card/list-card),
   double-checking relative path depth (`../assets/...` vs `assets/...`).
6. Apply the upgraded design treatment (badges, chips, shadows) once functionality is confirmed
   correct.
7. Test navigation by clicking through in browser before considering the screen done —
   `file://` works fine since there's no fetch/server dependency.
8. Log the new screen in `CONTEXT.md`'s "Screens built so far" list, and update "Screens NOT
   yet built" / "Known gaps" as needed.
