# ETI-App — Project Context

## What this is
A Bangladeshi poultry farm management app being rebuilt for a client: **functionality copy of an existing app, with upgraded visual design.** Client provided the existing app to clone; I'm rebuilding it screen-by-screen from screen recordings, feature by feature.

Core features the full app needs (from client brief): Buy/Sell marketplace, doctor/vet appointment booking, blog, general poultry data management. The Home screen itself has three tabs: **General**, **Parent Stock**, **Hatchery**.

## Workflow being used
1. User sends a screen recording (via phone) of one feature/screen at a time.
2. I extract frames (ffmpeg) and identify distinct screens/states.
3. I build a **functionality-match** version first (matches structure/content of the original).
4. User reviews, then I do an **upgraded design pass** applying our design system.
5. Repeat per feature until the whole app is covered.

**Note on process history:** We started in Figma (via Figma MCP) but hit the Starter plan's MCP tool call rate limit partway through the upgraded design pass on the Home screen. Switched to building directly as HTML/CSS mockups instead — free, no rate limits, and the user can host and demo it directly. All further work should continue in this HTML/CSS/JS approach unless told otherwise.

## Design system (already established — reuse these exactly)

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
```

**Typography:** Google Fonts, loaded via `<link>`:
- **Baloo Da 2** (weights 500–800) — display/headers/section titles/price numbers. Rounded, friendly, supports Bengali.
- **Hind Siliguri** (weights 400–700) — body text, labels, UI chrome. Clean, supports Bengali.

**Spacing/radius:** `--r-sm:6px; --r-md:10px; --r-lg:16px; --r-pill:999px;` — 8px-based spacing scale used throughout (4/8/12/16/24/32).

**Signature design moves (apply to every new screen):**
- Color-coded circular icon badges per category (gold/rust/moss rotating) instead of plain photos
- Chip-style pill tags for data values (prices etc.) instead of plain text
- Floating rounded bottom nav with gold circle marking the active tab
- Cards: white background, `--r-lg` corners, soft drop shadow (`0 4px 14px rgba(35,40,31,0.07)`)

## Screens built so far
1. **Home / General tab** — banner carousel, date/location info strip, notice ticker, market price list (chip-style), 6-item icon grid menu (Accounting, Production Cost, Farm Management, Vaccine Info, Disease Diagnosis, Disease Info). ✅ Functionality-match + upgraded design both done.
2. **Home / Parent Stock tab** — banner carousel, 6-item icon grid (Broiler PS Guide, Color Chicken PS, Brown Layer PS, White Layer PS, Duck PS, All STD Data). ✅ Functionality-match + upgraded done. Note: used emoji placeholders for breed illustrations — real source images not yet provided.
3. **Home / Hatchery tab** — banner carousel (gold gradient, 3 dots), 6-item icon grid (Troubleshooting, Fine Tuning, Embryonic Stages, Important Topics, Management, Pull-Out Check). ✅ Functionality-match built (matches structure from `WhatsApp Video 2026-08-02 at 8.15.04 PM.mp4`). Note: original app uses custom illustrated icons + a real photo banner (chick tray); rebuilt with badge-circle/emoji treatment per design system since no real assets provided yet. Tapping grid items goes nowhere yet — sub-screens not recorded.
4. **Bottom nav shell + top tab shell** — real multi-page navigation between Home/Buy/Sell/Doctor/Data Bank (bottom nav, one HTML file each, in their own folders) and General/Parent Stock/Hatchery (top tabs, JS-toggled subpanels within `index.html`). Unbuilt sections show a "Not yet built" placeholder card rather than breaking.
5. **General / হিসাব নিকাশ (Accounting) drill-down** — `accounting/index.html`. Rust-colored sub-page header with back arrow (no bottom nav, matches recording), vertical list of 10 calculator tools (weight/uniformity, ROI/FCR, egg mass, breeder feed program, temp converter, layer egg production %, medicine dosage, space/feeder/drinker calc, chick quality check, standard data by age). ✅ Functionality-match built (matches structure from `WhatsApp Video 2026-08-02 at 8.41.12 PM.mp4`).
6. **মুরগীর ওজন ও ইউনিফির্মিটি (weight/uniformity) calculator** — `accounting/weight-uniformity.html`, linked from the first accounting list item. **Static visual mockup only — deliberately not wired up.** User explicitly said not to build working calculator logic for these tool screens, just replicate the visual states (matches structure from `WhatsApp Video 2026-08-02 at 8.44.43 PM.mp4`, default empty/zeroed state shown). Same pattern applies to the other 9 accounting tools and any future calculator/tool screens: **build the static UI, skip the actual computation.**
7. **ROI/FCR calculator** — `accounting/roi-fcr.html`, linked from the second accounting list item. Static mockup (matches structure from `WhatsApp Video 2026-08-02 at 8.54.27 PM.mp4`). Note: unlike weight-uniformity, this screen has **no colored header bar** in the original — just a plain background with a bold green title (new `.plain-header` component) and a **working** Broiler/Color bird vs Layer radio toggle above the form. The radio toggle actually switches which field set is shown (Broiler: 7 fields ending in Market price/kg; Layer: 4 fields — Daily feed (gm), Hen day %, Egg price, Feed price/kg) via a new generic `showFieldGroup(id)` helper in `app.js` + `.field-group`/`.field-group.active` CSS. **This is a visual state swap only, not a calculation** — still no working math, per the "static mockup" rule, but swapping which inputs are visible on radio-select is fair game since it's just showing another recorded UI state, not computing a result. Single CALCULATE button, no result panel shown in the default state (original only reveals results after tapping Calculate).

8. **এগ ম্যাস (Egg Mass) calculator** — `accounting/egg-mass.html`, linked from the third accounting list item. Static mockup, default empty state (matches structure from `WhatsApp Video 2026-08-02 at 9.00.04 PM.mp4`). Uses the rust `.subpage-header` (like weight-uniformity). New pattern here: **labeled fields** (bold label above each input box, via new `.calc-field` class) rather than placeholder-only inputs, a **two-button row** (`.calc-btn-row` — ফলাফল জানুন + মুছুন side by side instead of stacked), and a second results card using a new `.info-block`/`.info-row` component (stacked label + blank value, for the বর্তমান Egg Mass / স্ট্যান্ডার্ড সীমা / ফ্লকের বর্তমান অবস্থা / সংক্ষিপ্ত পরামর্শ summary — all blank by default since the original only fills them in live as you type, which we don't replicate). Note: the source recording briefly caught an unrelated WhatsApp call-notification popup mid-video — ignored, not part of the app UI.

9. **ব্রিডার ফার্মে স্কিপ ফিড প্রোগ্রাম (breeder skip-feed program) calculator** — `accounting/breeder-feed.html`, linked from the fourth accounting list item. Static mockup, default state (matches structure from `WhatsApp Video 2026-08-02 at 9.13.54 PM.mp4`). Plain header (no colored bar, like ROI/FCR). New pattern: a **vertical radio list** (new `.radio-col`/`.field-section-label` classes) for choosing between 4 named programs (৭/৭, ৬/৭, ৫/৭, ৪/৭ প্রোগ্রাম) — distinct from the ROI screen's horizontal 2-option `.radio-row`. CALCULATE (moss) + CLEAR (rust) side by side via `.calc-btn-row`, and an empty `.info-block` placeholder below (original shows a genuinely blank result card until Calculate is tapped — no labels pre-rendered here, unlike egg-mass which does show its labels by default). Note: original renders the "স্কিপ ফিড প্রোগ্রাম নির্বাচন করুন" section label in very low-contrast/near-invisible text — not replicated, given a normal readable label instead since that's very likely an unintentional contrast bug in the source app, not a deliberate design choice worth cloning.

10. **তাপমাত্রা পরিবর্তক (Temperature Unit Converter)** — `accounting/temp-converter.html`, linked from the fifth accounting list item. Static mockup, default state (matches structure from `WhatsApp Video 2026-08-02 at 9.18.01 PM.mp4` — note the user first pasted the *breeder-feed* video's filename again by mistake for this screen; caught it by checking the file timestamp against what was already processed, and asked for the correct one before building anything). Uses `.subpage-header` but in **moss**, not rust (original header is teal-green, English title "Temperature Unit Converter"). New patterns: the Celsius input has a distinct thick rust-colored border even at rest (new `.calc-input.accent`, not just a focus ring — both fields render this way with/without focus in the recording) and a `.calc-btn.dark` variant (mapped to `--text-charcoal`, standing in for the original's slate-gray CLEAR button since gray isn't one of our tokens). Two convert buttons (moss "→ Fahrenheit", rust "→ Celsius") plus CLEAR; no result bar shown by default (original only reveals `40°C = 104°F`-style output after tapping Convert).

11. **লেয়ার মুরগির ডিম উৎপাদন হার (%) (layer egg production rate) calculator** — `accounting/layer-egg-production.html`, linked from the sixth accounting list item. Static mockup, default state (matches structure from `WhatsApp Video 2026-08-02 at 9.25.50 PM.mp4`). Rust `.subpage-header`, 3 placeholder-only fields, `.calc-btn-row` (rust "হিসাব করুন" + `.calc-btn.dark` "মুছুন" — same dark/neutral button color as temp-converter's CLEAR). Two `.info-block` cards stacked: first has **live default values shown as "0%"** (not blank — new `.info-value.strong` variant, bold/larger) for ডিম উৎপাদন হার and স্ট্যান্ডার্ড উৎপাদন হার, plus a **moss-green label** (new `.info-label.moss` modifier) for ফ্লকের বর্তমান অবস্থা with a blank value; second card is a lone সংক্ষিপ্ত পরামর্শ row, blank. Another instance of "match what THIS screen's default state actually shows" — some tool screens default their numeric results to 0% (this one, matches weight-uniformity), others leave everything blank until Calculate (ROI/FCR, breeder-feed, temp-converter) — always check the recording rather than assuming one convention for all.

12. **মেডিসিনের মাত্রা (medicine dosage) calculator** — `accounting/medicine-dosage.html`, linked from the seventh accounting list item. Static mockup, default state (matches structure from `WhatsApp Video 2026-08-02 at 9.28.47 PM.mp4`). Rust `.subpage-header`, 4 `.calc-field` labeled inputs (মোরগ মুরগির সংখ্যা, গড় ওজন (g), ডোজ/কেজি, মেডিসিন/গ্রাম), rust+dark `.calc-btn-row`. Result card is the simplest yet — just a single line, "Result will appear here" (English placeholder text, in the original too), no label/value rows at all.

## Screens NOT yet built (placeholders currently shown)
- Home / Hatchery **sub-screens** (Troubleshooting, Fine Tuning, Embryonic Stages, Important Topics, Management, Pull-Out Check detail pages — grid tab itself is built, drill-down pages are not)
- Accounting **other 3 calculator screens** (weight/uniformity, ROI/FCR, egg mass, breeder feed program, temp converter, layer egg production %, and medicine dosage are built as static mockups; space/feeder/drinker calc, chick quality check, standard data by age still link nowhere)
- **Buy** (কিনুন)
- **Sell** (বেচুন)
- **Doctor** (ডাক্তার) — appointment booking
- **Data Bank** (ডাটা ব্যাংক)
- Other General-tab grid items: উৎপাদন খরচ, খামার ব্যবস্থাপনা, ভ্যাকসিন তথ্য, রোগ নির্ণয়, রোগ বালাই (not yet linked/built)
- Blog system (mentioned in original brief, no recording yet)

## Current file structure — multi-page static site, organized by folder
As the screen count grows, each top-level section gets its own folder (own `index.html` inside it) instead of piling flat files at the root. Shared CSS/JS/images live under `assets/`. **Root `index.html` is the single entry point** — that's what you open locally or point a static host at (Netlify Drop / Vercel / GitHub Pages all "just work" with zero config since routing is plain `<a href>` between real files, no server/build step needed).
```
eti-app/
├── index.html                       ← entry point / Home (General, Parent Stock, Hatchery tabs)
├── assets/
│   ├── css/styles.css                design tokens + component styles (shared by every page)
│   ├── js/app.js                     showSub() — toggles General/Parent Stock/Hatchery subpanels within index.html only
│   └── images/                       real images once available (currently using emoji placeholders)
├── buy/index.html
├── sell/index.html
├── doctor/index.html
├── databank/index.html
└── accounting/                       drill-down from Home's হিসাব নিকাশ grid card
    ├── index.html                    the 10-tool list
    ├── weight-uniformity.html        static mockup calculator (no working logic — by design)
    ├── roi-fcr.html                  static mockup calculator (no working logic — by design)
    ├── egg-mass.html                 static mockup calculator (no working logic — by design)
    ├── breeder-feed.html             static mockup calculator (no working logic — by design)
    ├── temp-converter.html           static mockup calculator (no working logic — by design)
    ├── layer-egg-production.html     static mockup calculator (no working logic — by design)
    └── medicine-dosage.html          static mockup calculator (no working logic — by design)
```
**Conventions to keep following as more screens land:**
- Every bottom-nav-level screen gets `<section>/index.html` (mirrors `buy/`, `sell/`, etc.) — makes room for that section growing its own sub-pages later without a rename.
- A drill-down/detail screen reached from a grid card or list item lives as a sibling file inside the same folder as its parent list (e.g. all accounting calculator tools stay inside `accounting/`, next to `accounting/index.html`), not scattered elsewhere.
- CSS/JS are always referenced relative to the file's own depth: root pages use `assets/css/styles.css`; anything one folder deep uses `../assets/css/styles.css`.
- Bottom-nav pages link to each other with `../<section>/index.html`; the Home link from inside a section folder is `../index.html`.
- Each file still repeats the small shell markup (status-bar + app-bar + bottom-nav) itself — plain HTML has no includes without a build step, and this keeps every page a fully standalone, hostable file.
- Drill-down pages (like `accounting/index.html`) replace the app-bar with a colored `.subpage-header` + back arrow instead of showing the bottom nav, matching the recordings. Some tool screens instead use the plain `.plain-header` (no colored bar) — match whatever the recording actually shows, don't force one style onto both.
- **"Static mockup, no working logic" means no calculation** — it does NOT mean no interactivity. Toggles that just switch which recorded UI state is visible (e.g. the ROI calculator's Broiler/Layer radio swapping field sets via `showFieldGroup()`) are fine and expected; the line is "shows another real state from the recording" (yes) vs. "computes a result from user input" (no).

## How to continue a new screen
1. User provides a screen recording of the feature.
2. Extract frames (ffmpeg — installed via winget as `Gyan.FFmpeg`; if missing on a fresh machine, `winget install --id Gyan.FFmpeg -e --silent` and refresh PATH), identify distinct states/screens.
3. Decide: is this a **new top-level bottom-nav screen** (new `<section>/index.html` folder, copy the shell from an existing page) or a **drill-down from an existing grid card/list item** (new file inside the parent section's folder, styled like `accounting/index.html`, linked via `<a class="grid-card" href="...">` or `<a class="list-card" href="...">`)?
4. Build functionality-match markup first, using the same CSS variables — don't invent new colors/fonts. If it's a calculator/tool screen, build the **static UI only** — no working computation — unless told otherwise.
5. Wire up the link from wherever it's launched (bottom nav and/or a grid-card/list-card), double-checking relative path depth (`../assets/...` vs `assets/...`).
6. Apply the upgraded design treatment (badges, chips, shadows) once functionality is confirmed correct.
7. Test navigation by clicking through in browser before considering the screen done. Note: `file://` works fine for this site since there's no fetch/server dependency — just open `index.html` directly.

## Known gaps / open items
- Real product photography/illustrations needed to replace emoji placeholders (chicks, eggs, chicken breeds, vaccine vials, medicine bottles, etc.)
- Hatchery sub-screens and Accounting calculator forms unknown — need recordings
- Buy/Sell/Doctor/Data Bank/Blog all unbuilt — need recordings or specs
- Deployment: plan was Netlify Drop / Vercel / GitHub Pages once enough screens are done to show the client — current multi-page structure is already deploy-ready as-is
