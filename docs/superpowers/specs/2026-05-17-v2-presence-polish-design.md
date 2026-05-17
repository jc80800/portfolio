# V2 Presence & Polish — Design Spec

**Date:** 2026-05-17  
**Status:** Approved for implementation  
**Scope:** Visual polish on home hero, hero→gallery flow, gallery card catalog index, gallery→about rhythm  
**Builds on:** [2026-05-17-home-composition-pass-design.md](./2026-05-17-home-composition-pass-design.md)

---

## Summary

V2 is **not a redesign**. It improves presence, threshold clarity, section flow, and light specimen identity while preserving v1 information architecture.

**North star:** Gatewood Lab feels like a calm threshold into a small digital garden, then transitions into a catalogued specimen gallery, then grounds in About.

**Locked implementation order:**

1. `1280px` hero scale to `1.10`
2. Slightly stronger gate/waterline linework (tune by eye)
3. Soft hero bottom wash
4. Contextual `displayIndex` on `GalleryCard`
5. Gallery/About spacing + subtle About wash
6. No new assets, no card redesign, no copy changes

---

## Goals & non-goals

### In scope

| Area | Change |
|------|--------|
| Hero presence | Whole `.scene` scale step at `1280px+` |
| Gate frame | Lintel, vertical posts, soft threshold read |
| Waterline | Stronger near koi, fade at edges |
| Hero → Gallery | Soft bottom wash on `.hero` |
| Gallery cards | Contextual `displayIndex` (`01`, `02`, …) |
| Gallery → About | Modest padding + subtle About top wash |

### Out of scope

- New hero illustration or mascot art
- Major gallery card redesign
- Nav, footer, About copy changes
- New metaphor system or lore
- Heavy animation
- Literal temple/gate artwork
- Scroll cue (Option B) or waterline echo into gallery (Option C)
- `displayIndex` stored in `gallery.js`
- `1536px` `scale(1.12)` unless visual review proves `1.10` is still undersized

### Asset policy

No new generated assets. Use existing koi, calligraphy, CSS linework, gradients, opacity, and the warm background token system.

---

## 1. Hero presence (wide desktop scale)

### Problem

On wide desktop, the composed hero scene can feel slightly under-scaled relative to empty space.

### Solution

Scale the **entire `.scene`** as a group — not koi alone, not CTA, not individual elements.

| Breakpoint | `.scene` transform |
|------------|-------------------|
| `< 769px` | No scale (current mobile layout) |
| `≥ 769px` | `translateY(-2vh) scale(1.06)` — **unchanged** |
| `≥ 1280px` | `translateY(-2vh) scale(1.10)` |
| `≥ 1536px` | **Do not add** unless `1.10` still feels undersized after visual review at large desktop widths |

```css
@media (min-width: 769px) {
  .scene {
    transform: translateY(-2vh) scale(1.06);
    transform-origin: center center;
  }
}

@media (min-width: 1280px) {
  .scene {
    transform: translateY(-2vh) scale(1.10);
  }
}
```

### Guardrails

- First viewport remains hero-only; gallery must not peek into the first screen.
- Preserve calm spacing; do not add copy.
- If horizontal clipping appears after scale, `.hero { overflow: hidden }` may help — **verify it does not clip the koi, waterline, or bottom wash** before keeping it. Do not scale koi independently.

**Files:** `src/components/Hero/Hero.module.css`

---

## 2. Gate frame refinement

### Problem

The frame no longer reads as a heavy UI card (good), but the threshold/entrance cue is still faint.

### Solution

Strengthen architectural linework only:

| Element | Direction |
|---------|-----------|
| Lintel (`::before`) | Slightly increase gradient stop opacity on terracotta/honey |
| Secondary lintel (`::after`) | Modest increase |
| Vertical posts | Side linear-gradient stops slightly stronger |
| Panel surface | Keep transparent wash; no fill card, no drop shadow, no thick border |

**Opacity guidance:** Current rgba stops are **starting points** (e.g. bump lintel/sides by roughly `+0.08–0.12` where needed). **Tune by visual check** — do not blindly max out contrast.

### Squint test

Should read as:

```text
soft threshold / entrance
```

Not:

```text
UI card
themed ornament
```

**Files:** `src/components/Hero/Hero.module.css` (`.gateFrame`, `::before`, `::after`, side gradients)

---

## 3. Waterline refinement

### Problem

Waterline anchors koi but can be slightly stronger near the character.

### Solution

- Keep single thin bar; no ripple asset in v2.
- Strengthen center / near-koi gradient stops (starting points only — tune by eye).
- Keep fade to transparent at left/right edges.
- Prefer gradient opacity over heavy decorative `box-shadow`; reduce glow if it reads busy.
- Ensure vertical position still visually connects waterline to lower gate/frame after scale changes (tune `bottom` % if needed).

### Do not

- Thick divider, decorative wave, or busy ripple effects.

**Files:** `src/components/Hero/Hero.module.css` (`.waterline`)

---

## 4. Hero → Gallery transition (Option A — soft wash)

### Problem

Scroll from hero to Gallery feels plain; weak sense of crossing from threshold into specimen layer.

### Solution

Add a **soft wash at the bottom of `.hero`** (not a scroll cue, not waterline continuation into gallery).

```text
.hero (position: relative)
  └─ ::after — bottom wash, pointer-events: none
GalleryTeaser — stays transparent; reads as continuation
```

`.hero` must be `position: relative` so `::after` positions against the hero section, not a distant ancestor. (`.hero` already uses `position: relative` in the codebase — preserve it.)

**Gradient direction (explicit):** The wash sits at the **bottom of `.hero`** and fades from **transparent at the top** to the **page/section background at the bottom**.

- Height: approximately `80–120px`, absolute at hero bottom.
- Colors: existing warm tokens (`--bg-cream`, `--bg-peach`, light `rgba` from `--primary` at very low alpha) — no new palette.
- Opacity target: barely visible at rest; improves flow on scroll, not decoration.

**Files:** `src/components/Hero/Hero.module.css`; adjust `GalleryTeaser.module.css` top padding only if overlap looks wrong after implementation.

---

## 5. Gallery specimen index (`displayIndex`)

### Problem

Cards read like standard portfolio cards; light catalog numbering adds specimen feel without redesign.

### Behavior (contextual collection numbering)

The index is **catalog position within the current collection being viewed**, not a permanent global ID.

| Context | Numbering |
|---------|-----------|
| Home `GalleryTeaser` | `01`, `02`, `03` from featured array order |
| `/gallery` page | `01`…`N` from `getAllItems()` order in `gallery.js` |

Do **not** add index fields to `gallery.js`. Derive at render time only.

### API

The `displayIndex` **prop is optional** at the component level so callers that omit it behave as today. V2 **requires** `GalleryGrid` to pass it for home and gallery grids.

```jsx
// GalleryGrid.jsx — use the existing stable card key from the current codebase (today: item.id)
items.map((item, index) => (
  <GalleryCard
    key={item.id}
    item={item}
    displayIndex={index + 1}
    ...
  />
))
```

```jsx
// GalleryCard.jsx — render index when displayIndex is provided
{displayIndex != null && (
  <span className={styles.index} aria-hidden="true">
    {String(displayIndex).padStart(2, '0')}
  </span>
)}
```

### Presentation

- Small, muted typography (`--text-muted`, ~`0.75rem`; tabular or mono acceptable).
- Position: top-left or directly above title.
- No “Specimen” chip; no full card layout change.

### Accessibility

- `aria-hidden="true"` on the index element.
- **Do not** include the index in accessible card names (e.g. do not prepend `01` to `aria-label` on links or titles).
- Index is **catalog chrome**, not semantic content.

### Tests

- `displayIndex={1}` renders `01`.
- Omitting `displayIndex` renders no index node.
- Existing card behavior unchanged.

**Files:** `GalleryGrid.jsx`, `GalleryCard.jsx`, `GalleryCard.module.css`, `GalleryCard.test.jsx`

---

## 6. Gallery → About rhythm

### Problem

Gallery and About can feel compressed; About should feel like the grounded personal section after the specimen gallery.

### Solution (padding + subtle wash)

```css
/* GalleryTeaser.module.css */
.section {
  padding-bottom: clamp(4rem, 7vw, 6rem);
}

/* About.module.css */
.about {
  position: relative;
  padding-top: clamp(4rem, 7vw, 6rem);
}

.about::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 120px;
  pointer-events: none;
  z-index: 0;
  background: linear-gradient(
    to bottom,
    /* warm tokens at very low alpha */
    transparent
  );
}

/* Ensure wash sits behind About content */
.about .container {
  position: relative;
  z-index: 1;
}
```

Use existing `--bg-cream`, `--bg-peach`, and `--primary` rgba values — no new colors. Ensure the wash sits **behind** About text (not covering titles or body copy).

### Border treatment

**Soften or remove** the existing `border-top` on `.about`. Do not stack a hard `1px` line with the wash — that reads as a separate document section.

### Wash guardrail

The About wash should be noticeable **only as a softer transition**, not as a visible colored stripe. If a band reads on screen, reduce height or alpha.

### Do not

- Overdesign About, add garden/specimen language, or large decorative separators.
- Change About copy or structure.

**Files:** `GalleryTeaser.module.css`, `About.module.css`

---

## Implementation order

1. `1280px` hero `scale(1.10)` on `.scene`
2. Gate frame linework (tune by eye)
3. Waterline near-koi strength (tune by eye)
4. Hero bottom wash (`::after`)
5. `displayIndex` on `GalleryCard` + tests
6. Gallery bottom / About top spacing + About wash; soften border
7. Visual check: `375px`, `768px`, `1280px`, wide desktop
8. **Only if needed:** `1536px` `scale(1.12)` after review — otherwise skip

---

## Success criteria

| Area | Pass if |
|------|---------|
| Hero presence | Wide desktop scene feels intentional, not floating/undersized |
| Gate frame | Reads as soft threshold, not card or ornament |
| Waterline | Anchors koi clearly without decorative clutter |
| Transition | Hero scrolls into Gallery smoothly, not abruptly |
| Gallery cards | Index adds catalog feel; cards still practical |
| About spacing | About feels separated but same page; no visible wash band |
| Scope | No new major art, nav changes, About rewrite, or card redesign |
| A11y | Index is decorative only; card names unchanged |

---

## Testing & regression

- `npm run test:run` — Hero and GalleryCard tests pass.
- Manual breakpoints: `375px`, `768px`, `1280px`, `1536px+`.
- `prefers-reduced-motion`: no new motion (scale is static).
- Watch for horizontal overflow after hero scale.

---

## Files touched (expected)

| File | Changes |
|------|---------|
| `Hero.module.css` | Scale step, gate, waterline, hero `::after` wash |
| `GalleryTeaser.module.css` | Bottom padding |
| `About.module.css` | Top padding, `::before` wash, border soften |
| `GalleryGrid.jsx` | Pass `displayIndex` |
| `GalleryCard.jsx` | Render contextual index when `displayIndex` prop is set |
| `GalleryCard.module.css` | `.index` styles |
| `GalleryCard.test.jsx` | Index display tests |

**Untouched:** `gallery.js`, `brand.js`, About copy, Header, nav, new assets.
