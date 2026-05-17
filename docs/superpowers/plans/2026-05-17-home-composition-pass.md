# Home-Page Composition Pass v2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse the home hero into one composed threshold scene (gate posts, soft frame, koi/waterline in-scene), tighten hero→specimens rhythm, and replace About with grounded engineer copy—without touching gallery cards.

**Architecture:** `Hero.jsx` uses a CSS Grid `.scene` as the composition and positioning root; calligraphy lives in a narrow left column; `sceneLower` is removed; koi/waterline are absolutely positioned inside `.scene`. Copy changes go through `brand.js`. Rhythm is padding-only on `.hero` and `GalleryTeaser`.

**Tech Stack:** React 19, Vite 7, React Router 7, CSS Modules, Vitest, Testing Library

**Spec:** `docs/superpowers/specs/2026-05-17-home-composition-pass-design.md`

---

## File map

| Path | Action | Responsibility |
|------|--------|----------------|
| `src/config/brand.js` | Modify | Add `ABOUT_TITLE`, `ABOUT_BODY` |
| `src/components/Hero/Hero.jsx` | Modify | Unified grid scene; remove `sceneLower` |
| `src/components/Hero/Hero.module.css` | Modify | Grid, soft threshold, posts, koi, waterline, hero padding |
| `src/components/Hero/Hero.test.jsx` | Modify | Structure + calligraphy column selectors |
| `src/components/Home/Home.test.jsx` | Create | Page-level single `h1` assertion |
| `src/components/About/About.jsx` | Modify | Wire `ABOUT_*` constants |
| `src/components/GalleryTeaser/GalleryTeaser.module.css` | Modify | Teaser padding only |

**Do not touch:** `src/data/gallery.js`, `GalleryCard/*`, gallery page copy/styles, new image assets.

---

### Task 1: About brand constants

**Files:**
- Modify: `src/config/brand.js`

- [ ] **Step 1: Append About constants**

Add to the end of `src/config/brand.js`:

```js
export const ABOUT_TITLE = 'About Gatewood Lab'

export const ABOUT_BODY = [
  'Gatewood Lab is my personal space for building small software experiments, tools, and prototypes.',
  'I’m a backend/platform engineer interested in systems, infrastructure, and turning odd ideas into working products. Some projects are polished, some are still growing, and each one helps me practice building better software.',
]
```

- [ ] **Step 2: Commit**

```bash
git add src/config/brand.js
git commit -m "feat: add grounded About copy constants"
```

---

### Task 2: Home page heading test (TDD)

**Files:**
- Create: `src/components/Home/Home.test.jsx`

- [ ] **Step 1: Write failing Home test**

Create `src/components/Home/Home.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Home from './Home'

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
}

describe('Home', () => {
  it('has exactly one h1 for the studio name', () => {
    renderHome()
    const h1s = screen.getAllByRole('heading', { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveAccessibleName('Gatewood Lab')
  })
})
```

- [ ] **Step 2: Run test to verify it passes on current code**

Run: `npm run test:run -- src/components/Home/Home.test.jsx`

Expected: PASS (repo already has only Hero `h1` on home). If FAIL, fix any stray `h1` in Home children before continuing.

- [ ] **Step 3: Commit**

```bash
git add src/components/Home/Home.test.jsx
git commit -m "test: assert single h1 on home page"
```

---

### Task 3: Hero JSX — unified scene structure

**Files:**
- Modify: `src/components/Hero/Hero.jsx`
- Modify: `src/components/Hero/Hero.test.jsx`

- [ ] **Step 1: Update Hero tests for new structure**

In `src/components/Hero/Hero.test.jsx`, replace the calligraphy test with:

```jsx
  it('keeps calligraphy in a gate-post column hidden from accessibility tree', () => {
    const { container } = renderHero()
    const column = container.querySelector('[class*="calligraphyColumn"]')
    expect(column).toBeInTheDocument()
    expect(column).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders waterline and koi inside the scene', () => {
    const { container } = renderHero()
    const scene = container.querySelector('[class*="scene"]')
    expect(scene.querySelector('[class*="waterline"]')).toBeInTheDocument()
    expect(scene.querySelector('[class*="koiWrap"]')).toBeInTheDocument()
    expect(scene.querySelector('[class*="sceneLower"]')).not.toBeInTheDocument()
  })
```

Run: `npm run test:run -- src/components/Hero/Hero.test.jsx`

Expected: FAIL (missing `calligraphyColumn`, `sceneLower` still present).

- [ ] **Step 2: Restructure Hero.jsx**

Replace `Hero.jsx` body with unified scene (no `sceneLower`):

```jsx
import { Link } from 'react-router-dom'
import {
  HERO_CALLIGRAPHY_ACCENT,
  HERO_CALLIGRAPHY_MAIN,
  HERO_CTA,
  HERO_TAGLINE,
  STUDIO_NAME,
} from '../../config/brand'
import { useInView } from '../../hooks/useInView'
import KoiMascot from '../KoiMascot/KoiMascot'
import styles from './Hero.module.css'

function Hero() {
  const { ref, inView } = useInView()

  return (
    <section id="home" className={styles.hero}>
      <div
        ref={ref}
        className={`${styles.scene} reveal ${inView ? 'reveal--visible' : ''}`}
      >
        <div className={styles.calligraphyColumn} aria-hidden="true">
          <span className={styles.calligraphyMain}>{HERO_CALLIGRAPHY_MAIN}</span>
          <span className={styles.calligraphyAccent}>{HERO_CALLIGRAPHY_ACCENT}</span>
        </div>

        <div className={styles.threshold}>
          <div className={styles.gateFrame}>
            <div className={styles.copy}>
              <h1 className={styles.title}>{STUDIO_NAME}</h1>
              <p className={styles.tagline}>{HERO_TAGLINE}</p>
              <Link to="/gallery" className={styles.cta}>
                {HERO_CTA}
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.waterline} aria-hidden="true" />
        <div className={styles.koiWrap} aria-hidden="true">
          <KoiMascot variant="hero" animated />
        </div>
      </div>
    </section>
  )
}

export default Hero
```

(Use the same `ref` / `reveal` pattern as today; only structure changes.)

- [ ] **Step 3: Run Hero tests**

Run: `npm run test:run -- src/components/Hero/Hero.test.jsx`

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero/Hero.jsx src/components/Hero/Hero.test.jsx
git commit -m "refactor: unify hero scene structure without sceneLower band"
```

---

### Task 4: Hero CSS — composition, soft threshold, rhythm

**Files:**
- Modify: `src/components/Hero/Hero.module.css`

- [ ] **Step 1: Hero section rhythm**

Replace `.hero` min-height block with:

```css
.hero {
  min-height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg) var(--spacing-lg);
  padding-top: clamp(3rem, 7vw, 5.5rem);
  padding-bottom: clamp(2rem, 4vw, 3rem);
  margin-top: -100px;
  padding-top: calc(100px + clamp(3rem, 7vw, 5.5rem));
  background: var(--bg-gradient);
  position: relative;
  overflow: hidden;
}
```

(Keep nav offset; only drop `calc(100vh - 100px)`.)

- [ ] **Step 2: Remove viewport-absolute calligraphy; add grid scene**

Remove the old `.calligraphy` absolute block. Add:

```css
.scene {
  position: relative;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  z-index: 1;
  display: grid;
  grid-template-columns: clamp(56px, 10vw, 140px) minmax(0, 1fr);
  align-items: center;
  gap: clamp(0.5rem, 2vw, 1.25rem);
}

.calligraphyColumn {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 0.25rem;
  pointer-events: none;
  user-select: none;
  align-self: center;
}

.calligraphyMain {
  font-family: var(--font-calligraphy);
  font-size: clamp(3.5rem, 8vw, 6rem);
  line-height: 1;
  color: var(--text-primary);
  opacity: 0.08;
  animation: ink-appear 1.4s ease-out both;
}

.calligraphyAccent {
  font-family: var(--font-calligraphy);
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  letter-spacing: 0.15em;
  color: var(--primary);
  opacity: 0.1;
  padding-bottom: 0.35rem;
  animation: ink-appear 1.6s ease-out 0.2s both;
}
```

- [ ] **Step 3: Soft threshold gate frame**

Update `.gateFrame`:

```css
.gateFrame {
  width: 100%;
  max-width: 40rem;
  padding: clamp(1.5rem, 4vw, 2.25rem) clamp(1.25rem, 3vw, 1.75rem);
  border: 1px solid rgba(199, 91, 57, 0.16);
  border-bottom-width: 1px;
  border-radius: 1.75rem 1.75rem 0.75rem 0.75rem;
  background: rgba(255, 252, 248, 0.42);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
  position: relative;
}

.gateFrame::before {
  content: '';
  position: absolute;
  top: 0;
  left: 8%;
  right: 8%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(199, 91, 57, 0.35) 20%,
    rgba(232, 184, 109, 0.5) 50%,
    rgba(199, 91, 57, 0.35) 80%,
    transparent
  );
  pointer-events: none;
}
```

Extend side pseudo-lines (`::after` on frame or keep separate left/right rules) so verticals run slightly below the frame bottom.

Remove outer drop shadow from `.gateFrame` (keep inset lintel only).

- [ ] **Step 4: Waterline + koi inside scene**

Remove `.sceneLower` rules entirely. Add:

```css
.waterline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 14%;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(199, 91, 57, 0.2) 12%,
    rgba(232, 184, 109, 0.4) 50%,
    rgba(199, 91, 57, 0.2) 88%,
    transparent 100%
  );
  box-shadow: 0 6px 24px rgba(232, 184, 109, 0.2);
  pointer-events: none;
}

.koiWrap {
  position: absolute;
  right: clamp(0rem, 4vw, 2rem);
  bottom: 6%;
  width: min(52%, 380px);
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  pointer-events: none;
  z-index: 2;
}
```

**Koi orientation:** Load hero in browser. If koi gaze already points toward CTA, leave transform unset. If not, add `transform: scaleX(-1)` on `.koiWrap` or `.koiWrap img` wrapper—do not mirror by default.

Optionally reduce hero koi max-width in `KoiMascot.module.css` (`.wrap.hero .img { max-width: 360px; }`) if it dominates.

- [ ] **Step 5: Mobile overrides**

Update `@media (max-width: 768px)`:

```css
@media (max-width: 768px) {
  .scene {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .calligraphyColumn {
    position: absolute;
    left: var(--spacing-sm);
    top: 0;
    opacity: 0.9;
    z-index: 0;
  }

  .calligraphyMain {
    font-size: 3.5rem;
  }

  .threshold {
    position: relative;
    z-index: 1;
  }

  .gateFrame {
    border-radius: 1.25rem 1.25rem 0.65rem 0.65rem;
  }

  .copy {
    text-align: center;
  }

  .koiWrap {
    right: 0;
    bottom: 4%;
    width: min(70%, 280px);
  }
}
```

Tune after visual pass—goal is gate-adjacent calligraphy, not centered wallpaper.

- [ ] **Step 6: Run tests**

Run: `npm run test:run`

Expected: All tests PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/Hero/Hero.module.css
git commit -m "style: hero unified scene, soft threshold, in-scene koi"
```

---

### Task 5: Gallery teaser rhythm

**Files:**
- Modify: `src/components/GalleryTeaser/GalleryTeaser.module.css`

- [ ] **Step 1: Adjust section padding**

Change `.section` to:

```css
.section {
  padding-top: var(--spacing-lg);
  padding-bottom: var(--spacing-xl);
  background: transparent;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GalleryTeaser/GalleryTeaser.module.css
git commit -m "style: pull gallery teaser closer to hero"
```

---

### Task 6: About section copy

**Files:**
- Modify: `src/components/About/About.jsx`

- [ ] **Step 1: Wire brand constants**

Replace `About.jsx` with:

```jsx
import { ABOUT_BODY, ABOUT_TITLE } from '../../config/brand'
import styles from './About.module.css'

function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <h2 className={styles.title}>{ABOUT_TITLE}</h2>
        <div className={styles.content}>
          <div className={styles.text}>
            {ABOUT_BODY.map((paragraph) => (
              <p key={paragraph} className={styles.description}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
```

- [ ] **Step 2: Run full test suite**

Run: `npm run test:run`

Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/About/About.jsx
git commit -m "feat: grounded About copy from brand constants"
```

---

### Task 7: Visual verification & lint

**Files:** none (verification only)

- [ ] **Step 1: Run lint and build**

```bash
npm run lint
npm run build
```

Expected: no errors

- [ ] **Step 2: Visual check at 375px, 768px, 1280px**

Confirm against spec success criteria:

| Check | Pass if |
|-------|---------|
| Squint test | Frame = threshold, not card |
| Scene unity | No separate lower koi band |
| Calligraphy | Gate posts, close to frame |
| Waterline | Meets frame; spans scene |
| Koi | Overlaps lower-right frame; guides to CTA |
| Rhythm | Specimens hinted with short scroll at 1280px |
| About | Two grounded paragraphs, no jokes |

- [ ] **Step 3: Final commit if any visual tuning**

```bash
git add -A
git commit -m "fix: hero composition tuning from visual pass"
```

(Only if adjustments were needed.)

---

## Plan self-review (spec coverage)

| Spec requirement | Task |
|------------------|------|
| Unified `.scene` grid | Task 3–4 |
| Remove `sceneLower` | Task 3 |
| `.scene` positioning root | Task 4 |
| Soft threshold frame | Task 4 |
| Gate-post calligraphy | Task 3–4 |
| Koi/waterline in scene | Task 4 |
| Koi mirror only if needed | Task 4 step 4 |
| Content-sized hero | Task 4 step 1 |
| Teaser padding | Task 5 |
| About in `brand.js` | Task 1, 6 |
| No gallery card changes | Out of scope |
| Asset policy (no new assets) | Out of scope |
| Home single `h1` test | Task 2 |
| No viewport calligraphy | Task 4 |

No placeholders remain in task steps.
