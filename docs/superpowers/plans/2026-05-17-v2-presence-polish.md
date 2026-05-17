# V2 Presence & Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish home hero presence, threshold linework, hero→gallery flow, contextual card catalog index, and gallery→about rhythm—without new assets, copy changes, or card redesign.

**Architecture:** CSS-only hero refinements in `Hero.module.css` (group scale, linework, bottom wash). `displayIndex` is derived in `GalleryGrid` and rendered decoratively in `GalleryCard`. Section rhythm via padding + About `::before` wash behind content.

**Tech Stack:** React 19, Vite 7, React Router 7, CSS Modules, Vitest, Testing Library

**Spec:** `docs/superpowers/specs/2026-05-17-v2-presence-polish-design.md`

---

## File map

| Path | Action | Responsibility |
|------|--------|----------------|
| `src/components/Hero/Hero.module.css` | Modify | `1280px` scale, gate/waterline, hero `::after` wash |
| `src/components/GalleryGrid/GalleryGrid.jsx` | Modify | Pass `displayIndex={index + 1}` |
| `src/components/GalleryCard/GalleryCard.jsx` | Modify | Optional `displayIndex` prop, decorative index |
| `src/components/GalleryCard/GalleryCard.module.css` | Modify | `.index` styles |
| `src/components/GalleryCard/GalleryCard.test.jsx` | Modify | Index render / omit tests |
| `src/components/GalleryTeaser/GalleryTeaser.module.css` | Modify | Increased bottom padding |
| `src/components/About/About.module.css` | Modify | Top padding, wash, border soften, z-index |

**Do not touch:** `gallery.js`, `brand.js`, `Hero.jsx`, About copy, Header, nav, new assets, `1536px` scale unless visual review fails.

---

### Task 1: Wide-desktop hero scale (`1280px`)

**Files:**
- Modify: `src/components/Hero/Hero.module.css`

- [ ] **Step 1: Add `1280px` media block**

Inside the existing `@media (min-width: 769px)` block, `.scene` already has `scale(1.06)`. Add **after** that block (sibling media query):

```css
@media (min-width: 1280px) {
  .scene {
    transform: translateY(-2vh) scale(1.10);
  }
}
```

- [ ] **Step 2: Verify no `1536px` scale**

Do **not** add `scale(1.12)` at `1536px` unless manual review at wide desktop still shows undersized scene.

- [ ] **Step 3: Run tests**

Run: `npm run test:run -- src/components/Hero/Hero.test.jsx`

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero/Hero.module.css
git commit -m "style: scale hero scene to 1.10 on wide desktop"
```

---

### Task 2: Gate frame linework

**Files:**
- Modify: `src/components/Hero/Hero.module.css`

- [ ] **Step 1: Bump vertical post gradient stops (starting points)**

In `.gateFrame` `background-image` side gradients, change terracotta stops from `0.2` → `0.28` and tail from `0.1` → `0.14`:

```css
      rgba(199, 91, 57, 0.28) 16%,
      rgba(199, 91, 57, 0.28) 86%,
      rgba(199, 91, 57, 0.14) 100%
```

(both left and right gradient layers)

- [ ] **Step 2: Strengthen lintel `::before`**

In `.gateFrame::before` gradient, bump center/opaque stops roughly +0.08:

```css
    rgba(199, 91, 57, 0.66) 18%,
    rgba(232, 184, 109, 0.86) 50%,
    rgba(199, 91, 57, 0.66) 82%,
```

- [ ] **Step 3: Strengthen secondary lintel `::after`**

Change `0.26` → `0.34` on side stops.

- [ ] **Step 4: Visual tune**

Run: `npm run dev` — squint test at `1280px`: soft threshold, not UI card. Reduce stops if lines feel heavy.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero/Hero.module.css
git commit -m "style: strengthen hero gate frame linework"
```

---

### Task 3: Waterline refinement

**Files:**
- Modify: `src/components/Hero/Hero.module.css`

- [ ] **Step 1: Strengthen near-koi gradient stops**

In `.waterline` `background` gradient, bump center stops (starting points):

```css
    rgba(199, 91, 57, 0.24) 10%,
    rgba(199, 91, 57, 0.34) 38%,
    rgba(232, 184, 109, 0.58) 68%,
    rgba(232, 184, 109, 0.62) 78%,
    rgba(199, 91, 57, 0.38) 88%,
```

- [ ] **Step 2: Soften decorative glow**

Replace heavy `box-shadow` with lighter single shadow or remove:

```css
  box-shadow: 0 8px 24px rgba(232, 184, 109, 0.14);
```

- [ ] **Step 3: Visual tune**

Confirm waterline still fades at edges and connects to gate bottom; tune `bottom: 10%` only if scale step misaligns.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero/Hero.module.css
git commit -m "style: refine hero waterline near koi"
```

---

### Task 4: Hero bottom wash (`::after`)

**Files:**
- Modify: `src/components/Hero/Hero.module.css`

- [ ] **Step 1: Confirm `.hero` positioning**

Ensure `.hero` retains:

```css
  position: relative;
  overflow: hidden;
```

If `overflow: hidden` clips koi/waterline/wash after adding `::after`, remove it or use `overflow-x: hidden` only after visual check.

- [ ] **Step 2: Add `.hero::after` wash**

After `.hero::before` block, add:

```css
.hero::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: clamp(80px, 10vw, 120px);
  pointer-events: none;
  z-index: 1;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 248, 240, 0.35) 45%,
    rgba(255, 232, 214, 0.55) 100%
  );
}
```

Gradient direction: transparent at top of wash band → page background at bottom.

- [ ] **Step 3: Visual tune**

Scroll hero → gallery at `768px` and `1280px`. Wash should be barely visible; adjust alpha down if decorative.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero/Hero.module.css
git commit -m "style: add soft hero-to-gallery bottom wash"
```

---

### Task 5: Contextual `displayIndex` on GalleryCard (TDD)

**Files:**
- Modify: `src/components/GalleryCard/GalleryCard.test.jsx`
- Modify: `src/components/GalleryCard/GalleryCard.jsx`
- Modify: `src/components/GalleryCard/GalleryCard.module.css`
- Modify: `src/components/GalleryGrid/GalleryGrid.jsx`

- [ ] **Step 1: Write failing tests**

Append to `GalleryCard.test.jsx`:

```jsx
  it('renders zero-padded display index when displayIndex is provided', () => {
    const { container } = render(<GalleryCard item={baseItem} displayIndex={1} />)
    expect(container.querySelector('[class*="index"]')).toHaveTextContent('01')
  })

  it('does not render display index when displayIndex is omitted', () => {
    const { container } = render(<GalleryCard item={baseItem} />)
    expect(container.querySelector('[class*="index"]')).not.toBeInTheDocument()
  })

  it('does not prepend index to accessible card title', () => {
    render(<GalleryCard item={baseItem} displayIndex={1} />)
    expect(screen.getByRole('heading', { name: 'Test App' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /01/i })).not.toBeInTheDocument()
  })
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test:run -- src/components/GalleryCard/GalleryCard.test.jsx`

Expected: FAIL (index element missing)

- [ ] **Step 3: Implement `GalleryCard.jsx`**

```jsx
function GalleryCard({ item, displayIndex, className = '', style }) {
  // ...existing destructuring...

  return (
    <article className={`${styles.card} ${className}`.trim()} style={style}>
      {displayIndex != null && (
        <span className={styles.index} aria-hidden="true">
          {String(displayIndex).padStart(2, '0')}
        </span>
      )}
      <div className={styles.header}>
```

Place index **before** `.header`, above title.

- [ ] **Step 4: Add `.index` styles to `GalleryCard.module.css`**

```css
.index {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  opacity: 0.72;
  margin-bottom: var(--spacing-xs);
}
```

- [ ] **Step 5: Pass `displayIndex` from `GalleryGrid.jsx`**

```jsx
        <GalleryCard
          key={item.id}
          item={item}
          displayIndex={index + 1}
          className={styles.card}
          style={{ transitionDelay: `${index * 80}ms` }}
        />
```

- [ ] **Step 6: Run tests**

Run: `npm run test:run -- src/components/GalleryCard/GalleryCard.test.jsx`

Expected: PASS (all 6 tests)

- [ ] **Step 7: Commit**

```bash
git add src/components/GalleryCard/ src/components/GalleryGrid/GalleryGrid.jsx
git commit -m "feat: add contextual catalog index to gallery cards"
```

---

### Task 6: Gallery → About rhythm

**Files:**
- Modify: `src/components/GalleryTeaser/GalleryTeaser.module.css`
- Modify: `src/components/About/About.module.css`

- [ ] **Step 1: Increase gallery teaser bottom padding**

In `.section`, set:

```css
  padding-bottom: clamp(4rem, 7vw, 6rem);
```

(keep existing `padding-top` rules)

- [ ] **Step 2: About padding, wash, z-index, border**

Update `.about`:

```css
.about {
  position: relative;
  padding: clamp(4rem, 7vw, 6rem) 0 var(--spacing-xl);
  background: var(--card-bg);
  border-top: none;
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
    rgba(255, 248, 240, 0.45) 0%,
    rgba(255, 232, 214, 0.2) 55%,
    transparent 100%
  );
}

.container {
  position: relative;
  z-index: 1;
  /* ...existing max-width/margin/padding... */
}
```

Tune alphas down if a visible stripe appears.

- [ ] **Step 3: Visual tune**

Confirm About title/body sit above wash; section feels separated from gallery without a hard divider.

- [ ] **Step 4: Commit**

```bash
git add src/components/GalleryTeaser/GalleryTeaser.module.css src/components/About/About.module.css
git commit -m "style: add gallery-to-about spacing and soft wash"
```

---

### Task 7: Regression & visual verification

**Files:** (none — verification only)

- [ ] **Step 1: Run full test suite**

Run: `npm run test:run`

Expected: all tests PASS

- [ ] **Step 2: Build**

Run: `npm run build`

Expected: build succeeds

- [ ] **Step 3: Manual breakpoints**

Run: `npm run dev`

Check at `375px`, `768px`, `1280px`, and wide desktop:

| Check | Pass |
|-------|------|
| Hero scene intentional on wide desktop | |
| Gate reads threshold, not card | |
| Waterline anchors koi, not cluttered | |
| Hero→gallery scroll smooth | |
| Cards show `01`…`03` on home, full order on `/gallery` | |
| About separated, no wash band over text | |
| No koi/waterline/wash clipping | |

- [ ] **Step 4: Optional `1536px` scale**

Only if step 3 shows undersized scene at very wide widths—otherwise skip.

- [ ] **Step 5: Final commit (if any tune tweaks)**

```bash
git add -A
git commit -m "style: tune V2 polish from visual review"
```

---

## Spec coverage checklist

| Spec section | Task |
|--------------|------|
| §1 Hero `1280px` scale | Task 1 |
| §2 Gate linework | Task 2 |
| §3 Waterline | Task 3 |
| §4 Hero bottom wash | Task 4 |
| §5 `displayIndex` | Task 5 |
| §6 Gallery/About rhythm | Task 6 |
| Success criteria / regression | Task 7 |
