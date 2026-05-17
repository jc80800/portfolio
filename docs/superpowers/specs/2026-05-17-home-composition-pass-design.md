# Home-Page Composition Pass v2 — Design Spec

**Date:** 2026-05-17  
**Status:** Approved for v2 implementation  
**Scope:** Hero composition, home-page vertical rhythm, About copy — gallery cards unchanged  
**Builds on:** [2026-05-17-digital-garden-hero-design.md](./2026-05-17-digital-garden-hero-design.md)  
**Supersedes:** That spec’s “About unchanged” note for this iteration

---

## Summary

v1 hero implementation landed correct copy and gallery register, but the home page still reads as **disconnected sections**: a card-like frame, viewport-positioned calligraphy wallpaper, koi in a separate lower band, and excessive vertical emptiness. This pass collapses the hero into **one composed threshold scene**, tightens **hero → specimens → About** rhythm, and rewrites **About** into grounded engineer voice centralized in `brand.js`.

Gallery teaser and cards are already close for v1; do not touch card markup, copy, or card CSS.

---

## Goals

| Goal | How |
|------|-----|
| Hero reads as one threshold | Unified CSS Grid `.scene`; remove `sceneLower` as a visual compartment |
| Gate, not card | Soft threshold frame: lintel, thin border, minimal shadow, atmospheric depth |
| Calligraphy participates | Narrow gate-post column aligned to frame, not viewport wallpaper |
| Koi guides to CTA | Overlaps lower-right of frame; mirror only if it improves gaze toward CTA |
| Waterline continuity | Spans composed scene; meets frame bottom |
| Home rhythm | Content-sized hero; gallery teaser sooner; About spacing unchanged unless still loose |
| Engineering credibility | About: grounded copy in `brand.js`; wit stays in gallery taglines |

## Asset policy

No new generated assets for this pass. Use the existing koi image and calligraphy (text/CSS), plus CSS for the gate frame, waterline, and atmosphere.

Future v1.1 assets may include a transparent koi variant, subtle ink wash texture, or water ripple accent — **after** the composition works across breakpoints.

## Non-goals

- Gallery card markup, `gallery.js` taglines, or `GalleryCard` styles
- New mascot art, mirrored PNG assets, or AI-generated images (see Asset policy)
- Gallery page redesign
- Nav/footer changes
- Literal gate illustration or heavy “theme” ornament
- Negative margins between sections
- Full viewport hero (`min-height: 100vh` ceremony)

---

## Problem statement (v1 gaps)

| Issue | Cause today |
|-------|-------------|
| Frame reads as UI card | Rounded rect, drop shadow, elevated panel styling |
| Calligraphy feels like wallpaper | `position: absolute` at `left: 3vw` / `top: 18%` of viewport |
| Koi feels under content, not guiding | Separate `sceneLower` band; koi below frame |
| Horizontal disconnect | Three objects: far-left calligraphy, center card, lower-right koi |
| Vertical emptiness | `min-height: calc(100vh - 100px)` + large internal gaps |
| About weakens credibility | Joke placeholder copy conflicts with register split |

---

## Hero — unified scene (Approach 1)

### Structure

```
.hero
└─ .scene (CSS grid — composition root)
   ├─ .calligraphyColumn (gate posts, aria-hidden)
   │  ├─ 鲤 (main pillar, faint)
   │  └─ 龙门 (seal accent, smaller)
   ├─ .threshold
   │  └─ .gateFrame (soft threshold + copy + CTA)
   ├─ .waterline (spans scene; meets frame bottom)
   └─ .koiWrap (absolute; lower-right; overlaps frame)
```

- **Remove** `sceneLower` as a separate visual compartment (fold waterline + koi into `.scene`). This is the most important structural change: the current disconnect comes from treating koi/waterline as a separate lower zone.
- Koi wrap remains decorative (`aria-hidden` if not already on mascot); CTA is the real action.

### Positioning root

`.scene` is the positioning root for koi and waterline. Use `position: relative` on `.scene` and place koi/waterline relative to the composed scene — **not** viewport-relative placement.

### Grid layout

**Design requirement:** narrow calligraphy column close to the gate frame; calligraphy aligns vertically with the frame/copy block, not the full viewport. Avoid a wide empty left column that lopsides the hero.

**Recommended starting point:**

```css
.scene {
  position: relative;
  display: grid;
  grid-template-columns: clamp(56px, 10vw, 140px) minmax(0, 1fr);
}
```

Adjust column width at implementation time to satisfy the requirement above; exact clamp values are not mandatory.

### Gate frame (soft threshold)

| Property | Direction |
|----------|-----------|
| Shadow | Remove or greatly reduce drop shadow; no “elevated card” |
| Border | Thinner, lower-contrast terracotta; atmospheric |
| Corners | Flatter bottom radius; more intentional top radius (arch suggestion) |
| Top | Thin gradient top border + faint horizontal lintel line |
| Sides | Vertical lines extend slightly below frame into waterline zone |
| Background | More transparent / wash-like |

**Squint test:** framed entrance, not themed restaurant menu or literal gate illustration.

### Calligraphy (gate posts — restrained)

| Element | Treatment |
|---------|-----------|
| 鲤 | Left grid column; vertically aligned with frame; lower opacity than v1 (~0.06–0.10) |
| 龙门 | Smaller seal beside/under 鲤; accent only |
| Position | Close to frame left edge; not viewport `left: 3vw` |
| Layout | Slight asymmetry OK — ink mark supporting entrance, not symmetric branding |
| a11y | `aria-hidden` on calligraphy container |

### Koi + waterline

| Element | Treatment |
|---------|-----------|
| Koi | `position: absolute` on `.scene`; bottom-right; overlaps lower-right of gate frame; **up** from current under-card placement |
| Orientation | Must visually guide toward CTA; use `scaleX(-1)` **only if** asset reads better toward button after flip — verify, do not mirror by default |
| Waterline | Full scene width (calligraphy through frame); continuous with frame bottom, not a floating strip below |
| Size | Reduce max-width slightly if koi dominates |

### Mobile

- Stack or tuck calligraphy beside frame (gate-adjacent, not centered wallpaper).
- Preserve koi orientation toward CTA.
- Simplify arch suggestion; keep one-scene read.

---

## Home-page rhythm

### Hero vertical sizing

**Design requirement:** On desktop, the hero **owns the first viewport** — complete and composed before scroll. The gallery is the next “room” after the threshold; specimen **cards must not appear** on the initial screen. At most, the next section edge may be subtly hinted.

**Recommended starting point:**

```css
.hero {
  min-height: calc(100svh - var(--header-height));
  margin-top: calc(-1 * var(--header-height));
  padding-top: max(var(--header-height), clamp(3rem, 7vw, 6rem));
  padding-bottom: clamp(3rem, 6vw, 5rem);
  display: flex;
  align-items: center;
}

.scene {
  width: min(980px, 90vw);
  transform: translateY(-2vh);
  /* scale calligraphy, gate, koi so the viewport feels inhabited, not empty */
}
```

Mobile: `min-height: auto` with content-sized scene; avoid dead vertical stretch.

Use `--header-height` token in `globals.css` (currently `100px`).

### Gallery teaser

**Design requirement:** pull specimens section up — less top padding than today.

**Recommended starting point:**

```css
.section {
  padding-top: var(--spacing-lg);   /* was xl */
  padding-bottom: var(--spacing-xl);
}
```

Tighten further only if 1280px visual check still feels loose.

### About

- Leave `About.module.css` spacing unchanged unless hero + teaser pass still leaves excess gap.
- No layout changes required for this pass.

### Rhythm success check

| Viewport | Pass if |
|----------|---------|
| 1280px desktop | Hero owns first viewport; gallery begins **after scroll**; specimen cards not visible initially; section edge may hint subtly |
| 375px mobile | Hero ends without feeling like a dead vertical stretch |

---

## About copy

### Constants (`src/config/brand.js`)

```js
export const ABOUT_TITLE = 'About Gatewood Lab'

export const ABOUT_BODY = [
  'Gatewood Lab is my personal space for building small software experiments, tools, and prototypes.',
  'I’m a backend/platform engineer interested in systems, infrastructure, and turning odd ideas into working products. Some projects are polished, some are still growing, and each one helps me practice building better software.',
]
```

| Rule | Detail |
|------|--------|
| Voice | Grounded backend/platform engineer |
| Light metaphor | “still growing” — one garden/lab tie, not a joke |
| Removed | Joke placeholders (coffee/grep, bugs-as-personality) |
| Wit | Gallery card taglines only |

### `About.jsx`

- Import `ABOUT_TITLE` and `ABOUT_BODY`.
- Render `h2` with `ABOUT_TITLE`; map `ABOUT_BODY` to paragraphs.
- Remove inline placeholder copy and editor TODOs.

---

## Semantic headings (home page)

| Element | Level |
|---------|-------|
| Gatewood Lab (hero) | `h1` |
| Recent specimens (teaser) | `h2` (already) |
| About Gatewood Lab | `h2` (already) |

**Current repo:** Only `Hero` uses `h1` on `/`; gallery page has its own `h1`. No downstream home sections need demotion.

**Tests:** Assert **page-level** outcome — e.g. render `Home` and expect exactly one `h1` with name “Gatewood Lab”, not only `Hero` in isolation.

---

## Files to touch

| Path | Change |
|------|--------|
| `src/config/brand.js` | `ABOUT_TITLE`, `ABOUT_BODY` |
| `src/components/Hero/Hero.jsx` | Unified grid scene; remove `sceneLower` compartment |
| `src/components/Hero/Hero.module.css` | Grid, soft threshold, gate posts, koi/waterline, hero padding |
| `src/components/Hero/Hero.test.jsx` | Update for new structure |
| `src/components/Home/Home.test.jsx` (or equivalent) | Page-level: exactly one `h1` on home |
| `src/components/About/About.jsx` | Brand constants |
| `src/components/GalleryTeaser/GalleryTeaser.module.css` | Teaser padding only |

**Do not touch:** `src/data/gallery.js`, `GalleryCard/*`, gallery page copy/styles (unless spacing regression).

---

## Success criteria

| # | Criterion |
|---|-----------|
| 1 | Hero reads as **one threshold scene**, not card + lower band + wallpaper |
| 2 | Gate frame passes squint test (soft threshold, not elevated card) |
| 3 | Calligraphy reads as **gate posts** in narrow column, close to frame |
| 4 | Waterline continuous with frame; koi overlaps lower-right and guides toward CTA |
| 5 | Koi mirroring only when it improves CTA guidance |
| 6 | Desktop hero owns first viewport (`100svh - header`); scene fills space (not empty ceremony) |
| 7 | Gallery begins after scroll at 1280px; cards not on first screen |
| 8 | About grounded; constants in `brand.js` |
| 9 | Exactly one `h1` on home (`Gatewood Lab`) |
| 10 | Gallery cards unchanged; existing card tests pass |

---

## Testing

- Visual: 375px, 768px, 1280px
- Calligraphy: 鲤 / 龙门 legible; fallbacks on macOS / Windows / mobile
- `Hero.test.jsx`: structure, CTA, decorative `aria-hidden`
- `Home` test: exactly one `h1` (“Gatewood Lab”) — avoids passing `Hero` tests while accidentally adding another page-level `h1`
- Regression: `GalleryCard` tests unchanged

---

## Implementation order

1. `brand.js` — About constants
2. `Hero.jsx` — grid scene structure
3. `Hero.module.css` — frame, posts, koi, waterline, hero padding
4. Verify koi orientation (mirror only if needed)
5. `GalleryTeaser.module.css` — padding
6. `About.jsx` — wired copy
7. Visual pass at three breakpoints; adjust teaser padding if still loose
8. Update tests

---

## Decisions log

| Decision | Choice |
|----------|--------|
| Hero architecture | Unified CSS Grid scene (not minimal absolute nudge) |
| Calligraphy | Gate posts (A), restrained opacity, narrow column |
| Frame top | Soft threshold (A), not pronounced arch or pillar-only |
| Hero height | Desktop: `calc(100svh - var(--header-height))`; mobile: content-sized |
| Teaser | `padding-top: lg`, `padding-bottom: xl` |
| About | `brand.js` constants; tightened second paragraph |
| Koi mirror | Only if improves CTA gaze |
| Scope | Home composition pass, not full redesign |
