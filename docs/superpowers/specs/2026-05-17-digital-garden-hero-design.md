# Digital Garden Hero & Specimen Gallery — Design Spec

**Date:** 2026-05-17  
**Status:** Approved for v1 implementation  
**Scope:** Hero + gallery surfaces only; About and global nav unchanged  
**Builds on:** [2026-05-16-portfolio-rebrand-design.md](./2026-05-16-portfolio-rebrand-design.md)

---

## Summary

The home hero reads as a **calm threshold** into Gatewood Lab—a **quiet digital garden for small software experiments**—composed as one scene (abstract gate, ink calligraphy, waterline, koi guiding toward action). Past that threshold, the **gallery** adopts **specimen** language and greenhouse wit. **About** stays personal engineer voice. This fixes the “nice placeholder” problem: elements share one visual idea without becoming a lore page or gimmick.

---

## Goals

| Goal | How |
|------|-----|
| Integrated hero “world” | Abstract gate frame, waterline, koi toward CTA, calligraphy as framing |
| Credible hero tone | “Quiet digital garden / small software experiments”; no “strange/odd” on hero |
| Register split | Hero: zen threshold · Gallery: specimen wit · About: normal engineer |
| Specimen metaphor | Gallery `h1`, intro, teaser |
| Preserve engineering proof | Card `stack` + `proves` unchanged; GitHub CTA stays practical |
| 龙门 as atmosphere | Decorative calligraphy only; no explanatory copy |

## Non-goals (this spec)

- New mascot art or mirrored koi PNG
- 龙门 tooltip / easter egg
- “Specimen” chip on every card
- Heavy card border / catalog redesign
- About copy or nav label changes (`Gallery` stays in header)
- Koi hover reactions on gallery cards
- Meta/OG rewrites (optional later)
- Card catalog index (`01`, `02`) — v1.1 unless trivial during v1

---

## Concept & narrative

**North star:** Gatewood Lab is a quiet digital garden for small software experiments—stated once on the hero, then shown.

| Element | Role |
|---------|------|
| **Gate** | Abstract hero frame / threshold into the collection |
| **Koi** | Guide at the gate; faces inward toward CTA |
| **Ink / 鲤·龙门** | Visual system + dragon-gate lore (decorative only) |
| **Gallery (nav)** | Familiar wayfinding label |
| **Specimens (page)** | Branded collection framing past the threshold |
| **Apps** | Specimens—catalogued in section copy; cards stay practical |

**Language ladder:**

| Surface | Label |
|---------|--------|
| Header nav | Home · **Gallery** |
| Hero CTA | **Enter the gallery** |
| Home teaser CTA | **View all specimens** |
| Gallery page `h1` | **Specimens** |

Odd/questionable tone (“strange,” “odd,” “overbuilt weekend ideas”) belongs in **gallery intro and card taglines**, not the hero.

---

## Hero

### Copy (locked)

```html
<h1>Gatewood Lab</h1>
<p>A quiet digital garden for small software experiments.</p>
<a href="/gallery">Enter the gallery</a>
```

- **No** optional subtitle in v1—the scene is enough.
- **No** “strange / odd / questionable” on the hero.

### Semantic hierarchy

- `h1` = **Gatewood Lab** (brand name is what visitors remember)
- Supporting line = garden metaphor (single `p`)
- Primary action = link to `/gallery`, label **Enter the gallery**

### Visual hierarchy (eye path)

```
calligraphy / gate frame
  → Gatewood Lab + garden line
    → Enter the gallery
      → koi on waterline (guides eye toward CTA)
        → gallery content below fold
```

### Composition (medium — “The Gate”)

| Layer | Treatment |
|-------|-----------|
| **Gate frame** | Abstract only: soft inset border, top arch suggestion, faint vertical rhythm—**not** a literal temple gate or heavy ornament |
| **Calligraphy** | 鲤 + 龙门 as frame accents / seal; low opacity; never compete with headline; `aria-hidden`. Verify Chinese character rendering across macOS, Windows, and mobile fallback fonts (`--font-calligraphy` stack). |
| **Waterline** | Horizontal band at lower hero; koi anchored on/over it |
| **Koi** | Faces **inward** toward CTA/copy; decorative wrap `aria-hidden` if CTA is the real action |
| **Background** | Existing warm wash + radial; refine to support framed entrance |

**Guardrail:** Squint test—reads as “framed entrance,” not “themed restaurant menu.”

### Layout (desktop)

- Copy block inside gate frame (left or center-weighted).
- Calligraphy: left pillar / corner (鲤) + vertical accent (龙门) as gate posts or seal—not floating unrelated wallpaper.
- Koi + waterline: lower area, oriented toward CTA.

### Mobile

- Gate frame stacks; calligraphy scales to corners; headline remains legible.
- Koi order may move above copy but **orientation toward CTA** preserved.

### Motion

- Calligraphy: existing `ink-appear`; keep subtle/zen.
- Koi: existing gentle float on hero.
- Gate frame: optional shared `reveal` with copy block.

### Brand constants (`src/config/brand.js`)

```js
export const STUDIO_NAME = 'Gatewood Lab'

export const HERO_TAGLINE =
  'A quiet digital garden for small software experiments.'
export const HERO_CTA = 'Enter the gallery'

/** Decorative ink calligraphy (鲤 = koi; 龙门 = dragon gate) — lore, not required reading */
export const HERO_CALLIGRAPHY_MAIN = '鲤'
export const HERO_CALLIGRAPHY_ACCENT = '龙门'
```

Hero `h1` uses `STUDIO_NAME` (no separate headline constant).

Deprecate/replace previous `HERO_TITLE` / `HERO_SUBTITLE` that read “Building small apps with big personality.”

---

## Gallery & teaser

### Register

Greenhouse specimen wit—catalogued, labeled, slightly scientific—with room for personality in intro and per-card taglines.

### Gallery page (`/gallery`)

| Element | Copy |
|---------|------|
| `h1` | **Specimens** (not “The specimens”) |
| Intro | Specimens grown from useful tools, odd games, and overbuilt weekend ideas. |

- Eyebrow “Gatewood Lab” optional; page title is **Specimens**.
- Existing gallery-page koi block may remain; no new behavior required for v1.

### Home teaser (`GalleryTeaser`)

| Element | Copy |
|---------|------|
| Section title (`h2`) | **Recent specimens** |
| Intro | A few small tools, games, and experiments from the lab. |
| CTA | **View all specimens** → `/gallery` |

### Brand constants

```js
export const GALLERY_EYEBROW = 'Specimens'

export const GALLERY_INTRO =
  'Specimens grown from useful tools, odd games, and overbuilt weekend ideas.'

export const GALLERY_TEASER_TITLE = 'Recent specimens'

export const GALLERY_TEASER_INTRO =
  'A few small tools, games, and experiments from the lab.'

export const GALLERY_TEASER_CTA = 'View all specimens'
```

### Gallery cards (v1)

- **No** “Specimen” chip on every card (redundant under Specimens section).
- Card structure unchanged: title → tagline → stack → proves → GitHub CTA.
- Wit lives in `gallery.js` taglines; engineering credibility in `proves`.

Example card (v1):

```
Badminton Queue
A court-rotation tool for keeping doubles nights moving.

Stack: Go / React / Postgres
Proves: queue modeling, session lifecycle, community workflow design
```

### Gallery card index (v1.1)

Catalog index (`01`, `02`, … from array order, zero-padded) is **v1.1** unless trivial to add during v1 implementation. When added: muted typography above title; no change to card schema required.

---

## Unchanged surfaces

| Surface | Notes |
|---------|--------|
| **About** | Personal engineer voice; no garden metaphor |
| **Header nav** | Home · Gallery |
| **Footer** | Gallery link label unchanged |
| **Error boundary** | Existing koi copy OK |
| **Gallery data schema** | `stack`, `proves`, URLs unchanged |

---

## Expected paths to touch

Paths below match the current repo layout; adjust if structure differs.

| Expected path | Change |
|---------------|--------|
| `src/config/brand.js` | Hero + gallery constants (locked copy) |
| `src/components/Hero/Hero.jsx` | `h1` (`STUDIO_NAME`) + tagline + CTA structure |
| `src/components/Hero/Hero.module.css` | Gate frame, waterline, koi/CTA composition |
| `src/components/GalleryTeaser/*` | Specimen titles, intro, CTA |
| `src/pages/Gallery/Gallery.jsx` | `h1` Specimens + intro |
| `src/pages/Gallery/Gallery.module.css` | Align with specimen intro if needed |
| `src/data/gallery.js` | Tagline tone pass only if needed |
| `src/components/GalleryCard/*` | v1.1 only: catalog index display |

---

## Success criteria

| Check | Pass if |
|-------|---------|
| Integrated world | Hero feels like one scene, not stacked widgets |
| Register split | Hero calm; gallery witty; About normal |
| Credibility | Hero uses “quiet digital garden”; odd words only in gallery |
| Brand memory | `h1` is Gatewood Lab |
| Eye path | Frame → name → garden line → Enter the gallery → koi |
| 龙门 | Decorative only; zero hero explanation |
| Language ladder | Nav Gallery / hero Enter / teaser View all specimens / page Specimens |
| Gate frame | Abstract; passes squint test |
| a11y | One `h1` per page; decorative layers hidden from AT |
| Responsive | Mobile legible; koi still guides toward CTA |

---

## Testing

- Visual: 375px, 768px, 1280px
- Calligraphy: 鲤 / 龙门 legible on macOS, Windows, and mobile fallback fonts
- Existing `GalleryCard` tests pass
- Add index display test only if v1.1 index is implemented

---

## Implementation order (suggested)

1. Update `brand.js` constants
2. Hero JSX semantics + copy
3. Hero CSS: gate frame, waterline, koi placement; verify calligraphy fallbacks
4. Gallery page header copy
5. GalleryTeaser copy + CTA
6. Tagline pass in `gallery.js` if any items need greenhouse tone
7. v1.1 (optional): card index in `GalleryCard` if trivial during v1

---

## Decisions log

| Decision | Choice |
|----------|--------|
| Scope | Hero + gallery only; About unchanged |
| Tone split | Zen hero · greenhouse gallery |
| Hero metaphor explicitness | Hybrid: one garden line, rest visual |
| Collection metaphor | Specimens |
| Hero visual ambition | Medium (abstract gate composition) |
| Hero CTA | Enter the gallery |
| Gallery `h1` | Specimens |
| Teaser CTA | View all specimens |
| Card chips | None in v1 |
| Card index | v1.1 unless trivial in v1 |
| 龙门 | Visual lore only |
