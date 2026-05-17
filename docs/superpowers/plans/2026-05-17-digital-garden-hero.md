# Digital Garden Hero & Specimen Gallery — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the home hero into a calm garden threshold (abstract gate, waterline, koi toward CTA) and reframe gallery surfaces with specimen language—without changing About, nav labels, or card chips.

**Architecture:** Copy and semantics live in `src/config/brand.js`. Hero composition is CSS-only (gate frame, waterline, calligraphy framing) around existing `KoiMascot` PNG. Gallery page and `GalleryTeaser` consume new gallery constants. Card catalog index (`01`, `02`) is **out of v1 scope** (v1.1 unless trivial).

**Tech Stack:** React 19, Vite 7, React Router 7, CSS Modules, Vitest, Testing Library, Google Fonts (Ma Shan Zheng for calligraphy)

**Spec:** `docs/superpowers/specs/2026-05-17-digital-garden-hero-design.md`

---

## File map

| Expected path | Action | Responsibility |
|---------------|--------|----------------|
| `src/config/brand.js` | Modify | Hero + gallery copy constants |
| `src/components/Hero/Hero.jsx` | Modify | `h1` = `STUDIO_NAME`, tagline, CTA link |
| `src/components/Hero/Hero.module.css` | Modify | Gate frame, waterline, scene layout |
| `src/components/Hero/Hero.test.jsx` | Create | Hero copy + CTA tests |
| `src/pages/Gallery/Gallery.jsx` | Modify | `h1` Specimens + `GALLERY_INTRO` |
| `src/components/GalleryTeaser/GalleryTeaser.jsx` | Modify | Specimen section copy + CTA |
| `src/styles/globals.css` | Modify | Calligraphy fallback stack (only if audit finds gaps) |

**Out of v1 scope:** `GalleryCard` index, About, Header nav, meta/OG, new mascot art.

---

### Task 1: Brand constants

**Files:**
- Modify: `src/config/brand.js`

- [ ] **Step 1: Replace hero constants and add gallery constants**

Replace entire `src/config/brand.js` with:

```js
export const STUDIO_NAME = 'Gatewood Lab'
export const TAGLINE = 'Small apps. Warm studio. Still swimming upstream.'

export const HERO_TAGLINE =
  'A quiet digital garden for small software experiments.'
export const HERO_CTA = 'Enter the gallery'

/** Decorative ink calligraphy on hero (鲤 = koi carp; 龙门 = dragon gate) */
export const HERO_CALLIGRAPHY_MAIN = '鲤'
export const HERO_CALLIGRAPHY_ACCENT = '龙门'

export const GALLERY_EYEBROW = 'Specimens'
export const GALLERY_INTRO =
  'Specimens grown from useful tools, odd games, and overbuilt weekend ideas.'

export const GALLERY_TEASER_TITLE = 'Recent specimens'
export const GALLERY_TEASER_INTRO =
  'A few small tools, games, and experiments from the lab.'
export const GALLERY_TEASER_CTA = 'View all specimens'
```

Remove `HERO_TITLE` and `HERO_SUBTITLE` exports.

- [ ] **Step 2: Commit**

```bash
git add src/config/brand.js
git commit -m "feat: add digital garden and specimen gallery copy constants"
```

---

### Task 2: Hero semantics and copy (TDD)

**Files:**
- Create: `src/components/Hero/Hero.test.jsx`
- Modify: `src/components/Hero/Hero.jsx`

- [ ] **Step 1: Write failing Hero tests**

Create `src/components/Hero/Hero.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Hero from './Hero'

function renderHero() {
  return render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>
  )
}

describe('Hero', () => {
  it('renders studio name as h1 and garden tagline', () => {
    renderHero()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Gatewood Lab' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'A quiet digital garden for small software experiments.'
      )
    ).toBeInTheDocument()
  })

  it('links Enter the gallery to /gallery', () => {
    renderHero()
    const cta = screen.getByRole('link', { name: 'Enter the gallery' })
    expect(cta).toHaveAttribute('href', '/gallery')
  })

  it('keeps calligraphy decorative and hidden from accessibility tree', () => {
    const { container } = renderHero()
    const calligraphy = container.querySelector('[class*="calligraphy"]')
    expect(calligraphy).toHaveAttribute('aria-hidden', 'true')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- src/components/Hero/Hero.test.jsx`

Expected: FAIL — missing exports or wrong heading text.

- [ ] **Step 3: Update `Hero.jsx`**

Replace `src/components/Hero/Hero.jsx` with:

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
      <div className={styles.calligraphy} aria-hidden="true">
        <span className={styles.calligraphyMain}>{HERO_CALLIGRAPHY_MAIN}</span>
        <span className={styles.calligraphyAccent}>{HERO_CALLIGRAPHY_ACCENT}</span>
      </div>

      <div
        ref={ref}
        className={`${styles.scene} reveal ${inView ? 'reveal--visible' : ''}`}
      >
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

        <div className={styles.sceneLower} aria-hidden="true">
          <div className={styles.waterline}></div>
          <div className={styles.mascotWrap}>
            <KoiMascot variant="hero" animated />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:run -- src/components/Hero/Hero.test.jsx`

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero/Hero.jsx src/components/Hero/Hero.test.jsx
git commit -m "feat: restructure hero copy for digital garden threshold"
```

---

### Task 3: Hero scene composition (CSS)

**Files:**
- Modify: `src/components/Hero/Hero.module.css`

- [ ] **Step 1: Remove obsolete two-column `.inner` grid rules**

Delete or stop using `.inner` and `.subtitle` if replaced by `.scene`, `.gateFrame`, `.tagline`.

- [ ] **Step 2: Add scene, gate frame, waterline, and koi placement styles**

Append to `Hero.module.css` (adjust `.hero` to keep existing calligraphy + `::before` radial):

```css

/* Add/replace in Hero.module.css — keep existing ink-appear keyframes */

.scene {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.threshold {
  display: flex;
  justify-content: center;
}

.gateFrame {
  width: 100%;
  max-width: 42rem;
  padding: clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 3vw, 2rem);
  border: 1px solid rgba(199, 91, 57, 0.22);
  border-bottom-width: 2px;
  border-radius: 2rem 2rem 1rem 1rem;
  background: rgba(255, 252, 248, 0.55);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    0 12px 40px rgba(44, 36, 25, 0.06);
  position: relative;
}

.gateFrame::before,
.gateFrame::after {
  content: '';
  position: absolute;
  top: 12%;
  bottom: 18%;
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(199, 91, 57, 0.2) 20%,
    rgba(199, 91, 57, 0.2) 80%,
    transparent
  );
  pointer-events: none;
}

.gateFrame::before { left: 1.25rem; }
.gateFrame::after { right: 1.25rem; }

.copy {
  text-align: left;
}

.tagline {
  font-size: 1.15rem;
  color: var(--text-muted);
  margin-bottom: var(--spacing-lg);
  line-height: 1.7;
  max-width: 36rem;
}

.sceneLower {
  position: relative;
  min-height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: var(--spacing-sm);
}

.waterline {
  position: absolute;
  left: 5%;
  right: 5%;
  bottom: 18%;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(199, 91, 57, 0.25) 15%,
    rgba(232, 184, 109, 0.45) 50%,
    rgba(199, 91, 57, 0.25) 85%,
    transparent 100%
  );
  box-shadow: 0 8px 32px rgba(232, 184, 109, 0.25);
}

.mascotWrap {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  width: min(100%, 520px);
  margin-left: auto;
  margin-right: clamp(0rem, 8vw, 4rem);
  transform: scaleX(-1);
}

@media (max-width: 768px) {
  .gateFrame {
    border-radius: 1.5rem;
  }

  .copy {
    text-align: center;
  }

  .tagline {
    margin-left: auto;
    margin-right: auto;
  }

  .sceneLower {
    min-height: 180px;
  }

  .mascotWrap {
    margin-right: auto;
    justify-content: center;
    transform: none;
  }
}

```

- [ ] **Step 3: Reposition calligraphy as gate accents**

Update `.calligraphy` in `Hero.module.css`:

```css
.calligraphy {
  left: clamp(0.5rem, 3vw, 2rem);
  top: 18%;
  transform: translateY(0);
  align-items: flex-end;
}
```

Ensure `.calligraphyMain` / `.calligraphyAccent` opacity stays ≤ 0.14 so headline wins.

- [ ] **Step 4: Visual check — koi faces CTA**

Run: `npm run dev`

Open `http://localhost:5173/` and verify:

- Gate frame is abstract (soft arch, faint side lines), not literal temple
- Koi sits on waterline and visually guides toward **Enter the gallery**
- If koi faces away, toggle `.mascotWrap { transform: scaleX(-1) }` on or off

- [ ] **Step 5: Responsive check**

At 375px width: centered copy inside gate; calligraphy not overlapping `h1`; koi still readable.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero/Hero.module.css
git commit -m "feat: compose hero as gate threshold with waterline and koi"
```

---

### Task 4: Gallery page specimen framing

**Files:**
- Modify: `src/pages/Gallery/Gallery.jsx`

- [ ] **Step 1: Replace gallery page header copy**

Replace `src/pages/Gallery/Gallery.jsx` with:

```jsx
import GalleryGrid from '../../components/GalleryGrid/GalleryGrid'
import KoiMascot from '../../components/KoiMascot/KoiMascot'
import { GALLERY_INTRO, GALLERY_EYEBROW } from '../../config/brand'
import { getAllItems } from '../../data/gallery'
import styles from './Gallery.module.css'

function GalleryPage() {
  const items = getAllItems()

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.mascotBlock}>
          <KoiMascot variant="hero" className={styles.heroMascot} />
        </div>
        <div className={styles.heroCopy}>
          <h1 className={styles.title}>{GALLERY_EYEBROW}</h1>
          <p className={styles.subtitle}>{GALLERY_INTRO}</p>
        </div>
      </header>
      <div className={styles.gridWrap}>
        <GalleryGrid items={items} />
      </div>
    </div>
  )
}

export default GalleryPage

```

- [ ] **Step 2: Manual check**

Run: `npm run dev` → visit `/gallery`

Expected: `h1` reads **Specimens**; intro uses `GALLERY_INTRO`; no “Gallery” page title.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Gallery/Gallery.jsx
git commit -m "feat: reframe gallery page as Specimens collection"
```

---

### Task 5: Home gallery teaser specimen copy

**Files:**
- Modify: `src/components/GalleryTeaser/GalleryTeaser.jsx`

- [ ] **Step 1: Replace teaser copy and CTA**

Replace `src/components/GalleryTeaser/GalleryTeaser.jsx` with:

```jsx
import { Link } from 'react-router-dom'
import {
  GALLERY_TEASER_CTA,
  GALLERY_TEASER_INTRO,
  GALLERY_TEASER_TITLE,
} from '../../config/brand'
import { getFeaturedItems } from '../../data/gallery'
import { useInView } from '../../hooks/useInView'
import GalleryGrid from '../GalleryGrid/GalleryGrid'
import styles from './GalleryTeaser.module.css'

function GalleryTeaser() {
  const { ref, inView } = useInView()
  const items = getFeaturedItems()

  return (
    <section id="work" className={styles.section} aria-labelledby="gallery-teaser-heading">
      <div
        ref={ref}
        className={`${styles.inner} reveal ${inView ? 'reveal--visible' : ''}`}
      >
        <div className={styles.intro}>
          <h2 id="gallery-teaser-heading" className={styles.title}>
            {GALLERY_TEASER_TITLE}
          </h2>
          <p className={styles.lead}>{GALLERY_TEASER_INTRO}</p>
          <Link to="/gallery" className={styles.link}>
            {GALLERY_TEASER_CTA} →
          </Link>
        </div>
        <GalleryGrid items={items} />
      </div>
    </section>
  )
}

export default GalleryTeaser

```

- [ ] **Step 2: Manual check**

On home page, below hero:

- Section title: **Recent specimens**
- CTA: **View all specimens →**
- Nav still says **Gallery**

- [ ] **Step 3: Commit**

```bash
git add src/components/GalleryTeaser/GalleryTeaser.jsx
git commit -m "feat: update home teaser with specimen collection copy"
```

---

### Task 6: Calligraphy font verification

**Files:**
- Modify: `src/styles/globals.css` (only if needed)

- [ ] **Step 1: Confirm Ma Shan Zheng loads**

`index.html` already includes `Ma+Shan+Zheng` in Google Fonts. No change required unless audit fails.

- [ ] **Step 2: Strengthen fallback stack (if glyphs look wrong offline)**

In `globals.css`, update:

```css
--font-calligraphy: 'Ma Shan Zheng', 'KaiTi', 'STKaiti', 'Noto Serif SC', serif;
```

- [ ] **Step 3: Spot-check 鲤 and 龙门**

Verify on macOS locally; note for manual check on Windows/mobile before deploy.

- [ ] **Step 4: Commit only if CSS changed**

```bash
git add src/styles/globals.css
git commit -m "fix: broaden calligraphy fallback fonts for hero glyphs"
```

---

### Task 7: Final verification

- [ ] **Step 1: Run full test suite**

Run: `npm run test:run`

Expected: all tests PASS (including new Hero tests and existing GalleryCard tests).

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: exit 0.

- [ ] **Step 3: Spec checklist (manual)**

| Check | Pass |
|-------|------|
| Hero `h1` is Gatewood Lab | |
| Hero has no odd/strange copy | |
| CTA is Enter the gallery | |
| Gallery page `h1` is Specimens | |
| Teaser CTA is View all specimens | |
| Nav still says Gallery | |
| About unchanged | |
| No specimen chips on cards | |
| 龙门 unexplained in copy | |

---

## Spec coverage (self-review)

| Spec requirement | Task |
|------------------|------|
| Hero copy hierarchy | Task 1–2 |
| Abstract gate + waterline + koi toward CTA | Task 3 |
| Calligraphy as frame, not content | Task 3, 6 |
| Gallery Specimens + intro | Task 4 |
| Teaser Recent specimens + View all specimens | Task 5 |
| No card index v1 | Out of scope |
| About/nav unchanged | No tasks (verified in Task 7) |
| No specimen chips | Out of scope |

No TBD placeholders in this plan.
