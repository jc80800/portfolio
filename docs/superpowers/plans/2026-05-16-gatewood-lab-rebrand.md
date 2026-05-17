# Gatewood Lab Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the portfolio from Fufu & Co. to Gatewood Lab with a gallery-first site, warm craft UI, playful motion, and a chibi koi nerd mascot.

**Architecture:** React 19 + Vite + React Router; data-driven gallery in `src/data/gallery.js`; shared UI primitives (`GalleryCard`, `StackTags`, `KoiMascot`); CSS variables in `globals.css` for the warm palette; scroll motion via `useInView` hook + CSS modules. Remove Handbook, Contact, EmailJS, and Fufu assets.

**Tech Stack:** React 19, Vite 7, React Router 7, CSS Modules, Vitest, Testing Library, Google Fonts (Outfit + Inter)

**Spec:** `docs/superpowers/specs/2026-05-16-portfolio-rebrand-design.md`

---

## File map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/config/brand.js` | Create | Studio name, tagline |
| `src/config/social.js` | Create | GitHub, LinkedIn, mailto URLs |
| `src/data/gallery.js` | Create | Gallery entries array + helpers |
| `src/hooks/useInView.js` | Create | IntersectionObserver for reveal animations |
| `src/components/StackTags/*` | Create | Monospace stack pills |
| `src/components/GalleryCard/*` | Create | Single app card |
| `src/components/GalleryGrid/*` | Create | Responsive grid |
| `src/components/GalleryTeaser/*` | Create | Home featured strip |
| `src/components/KoiMascot/*` | Create | Mascot img + hover classes |
| `src/pages/Gallery/*` | Create | `/gallery` page |
| `src/styles/globals.css` | Modify | Gatewood color tokens, fonts, motion prefs |
| `src/App.jsx` | Modify | `/gallery` route, drop handbook |
| `src/components/Home/Home.jsx` | Modify | Hero, About, GalleryTeaser |
| `src/components/Header/*` | Modify | Gatewood nav, logo, no contact modal |
| `src/components/Hero/*` | Modify | Gatewood copy + mascot slot |
| `src/components/About/*` | Modify | User funny copy shell |
| `src/components/Footer/*` | Modify | Icon links only |
| `src/components/ErrorBoundary/*` | Modify | Gatewood fallback copy |
| `index.html` | Modify | SEO, Outfit font |
| `vite.config.js` | Modify | Vitest config |
| `package.json` | Modify | Scripts, remove emailjs, add vitest |
| `public/mascot/koi-logo.png` | Create | Favicon + header (generated) |
| `public/mascot/koi-hero.png` | Create | Hero illustration (generated) |
| `public/favicon.svg` | Modify/Replace | Koi mark or link to PNG |
| `src/components/BackendHandbook/*` | Delete | Removed per spec |
| `src/components/Contact/*` | Delete | Removed per spec |
| `src/components/Projects/*` | Delete | Replaced by gallery |
| `README.md`, `FEATURES.md`, `LICENSE`, `CONTRIBUTING.md` | Modify | Gatewood branding |

---

### Task 1: Vitest + Testing Library setup

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`
- Create: `src/test/setup.js`

- [ ] **Step 1: Install dev dependencies**

Run:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 2: Add test script to `package.json`**

Inside `"scripts"`:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 3: Update `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
  },
})
```

- [ ] **Step 4: Create `src/test/setup.js`**

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Verify Vitest runs**

Run: `npm run test:run`
Expected: exit 0 (no tests yet, or "no test files")

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vite.config.js src/test/setup.js
git commit -m "chore: add Vitest and Testing Library for component tests"
```

---

### Task 2: Brand config + global design tokens

**Files:**
- Create: `src/config/brand.js`
- Create: `src/config/social.js`
- Modify: `src/styles/globals.css`
- Modify: `index.html`

- [ ] **Step 1: Create `src/config/brand.js`**

```js
export const STUDIO_NAME = 'Gatewood Lab'
export const TAGLINE = 'Small apps. Warm studio. Still swimming upstream.'
export const HERO_TITLE = 'Building small apps with big personality'
export const HERO_SUBTITLE =
  'A gallery of experiments, utilities, and questionable ideas—engineered with care.'
```

- [ ] **Step 2: Create `src/config/social.js`**

Replace URLs with your real profiles before deploy:

```js
export const SOCIAL = {
  github: 'https://github.com/YOUR_USERNAME',
  linkedin: 'https://www.linkedin.com/in/YOUR_PROFILE',
  email: 'mailto:you@example.com',
}
```

- [ ] **Step 3: Replace `:root` block in `src/styles/globals.css`**

```css
:root {
  --bg-cream: #fff8f0;
  --bg-peach: #ffe8d6;
  --primary: #c75b39;
  --primary-light: #e07a4f;
  --accent-honey: #e8b86d;
  --text-primary: #2c2419;
  --text-muted: #6b5e52;
  --card-bg: #fffcf8;
  --shadow-warm: rgba(44, 36, 25, 0.08);

  --bg-gradient: linear-gradient(135deg, var(--bg-cream) 0%, var(--bg-peach) 100%);

  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 50px;

  --shadow-sm: 0 2px 8px var(--shadow-warm);
  --shadow-md: 0 4px 20px var(--shadow-warm);
  --shadow-lg: 0 8px 30px var(--shadow-warm);

  --font-heading: 'Outfit', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

Update `body` to use `var(--font-body)` and keep `background: var(--bg-gradient)`.

Update `.text-gradient` and `.btn-primary` to use `--primary` / `--primary-light`.

Add:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.reveal--visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 4: Update Google Fonts in `index.html`**

Replace the fonts link with:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
```

- [ ] **Step 5: Commit**

```bash
git add src/config/brand.js src/config/social.js src/styles/globals.css index.html
git commit -m "feat: add Gatewood Lab brand config and warm design tokens"
```

---

### Task 3: Remove Fufu routes, components, and EmailJS

**Files:**
- Modify: `src/App.jsx`
- Delete: `src/components/BackendHandbook/`
- Delete: `src/components/Contact/`
- Delete: `src/components/Projects/`
- Modify: `package.json`

- [ ] **Step 1: Update `src/App.jsx`**

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Home from './components/Home/Home'
import GalleryPage from './pages/Gallery/Gallery'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<GalleryPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
```

- [ ] **Step 2: Delete folders**

```bash
rm -rf src/components/BackendHandbook src/components/Contact src/components/Projects
```

- [ ] **Step 3: Remove EmailJS**

```bash
npm uninstall @emailjs/browser
```

- [ ] **Step 4: Create stub `src/pages/Gallery/Gallery.jsx`** (temporary until Task 10)

```jsx
function GalleryPage() {
  return <div>Gallery</div>
}
export default GalleryPage
```

- [ ] **Step 5: Run build**

Run: `npm run build`
Expected: PASS (fix any broken imports in Header from Contact removal)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: remove Fufu handbook, contact modal, and placeholder projects"
```

---

### Task 4: Gallery data module

**Files:**
- Create: `src/data/gallery.js`

- [ ] **Step 1: Create `src/data/gallery.js`**

```js
export const galleryItems = [
  {
    id: 'weather-or-not',
    title: 'Weather or Not',
    tagline: 'Forecasts for people who trust vibes over radar',
    description: 'Simple weather lookups with comedic copy.',
    stack: ['Go', 'React'],
    proves: 'REST APIs, clean component boundaries',
    githubUrl: null,
    liveUrl: null,
    embedUrl: null,
    slug: null,
    featured: true,
    tags: ['weather', 'fun'],
    status: 'wip',
  },
  {
    id: 'gamble-gauge',
    title: 'Gamble Gauge',
    tagline: 'Should you do the thing? Statistics-ish.',
    description: 'Absurd decision helper with configurable odds.',
    stack: ['JavaScript', 'Vite'],
    proves: 'Fast UI iteration, stateful interactions',
    githubUrl: null,
    liveUrl: null,
    embedUrl: null,
    slug: null,
    featured: true,
    tags: ['fun', 'utility'],
    status: 'wip',
  },
  {
    id: 'not-todo',
    title: 'Not-To-Do List',
    tagline: 'Celebrate what you are not doing today',
    description: 'Anti-productivity list with shareable shame.',
    stack: ['React'],
    proves: 'CRUD patterns, playful UX writing',
    githubUrl: null,
    liveUrl: null,
    embedUrl: null,
    slug: null,
    featured: true,
    tags: ['productivity', 'fun'],
    status: 'wip',
  },
]

export function getFeaturedItems() {
  return galleryItems.filter((item) => item.featured)
}

export function getAllItems() {
  return galleryItems
}
```

Update `githubUrl` when repos exist.

- [ ] **Step 2: Commit**

```bash
git add src/data/gallery.js
git commit -m "feat: add extensible gallery data for Gatewood Lab apps"
```

---

### Task 5: StackTags component

**Files:**
- Create: `src/components/StackTags/StackTags.jsx`
- Create: `src/components/StackTags/StackTags.module.css`

- [ ] **Step 1: Create `StackTags.jsx`**

```jsx
import styles from './StackTags.module.css'

function StackTags({ stack = [] }) {
  if (!stack.length) return null
  return (
    <ul className={styles.list} aria-label="Tech stack">
      {stack.map((tech) => (
        <li key={tech} className={styles.tag}>
          {tech}
        </li>
      ))}
    </ul>
  )
}

export default StackTags
```

- [ ] **Step 2: Create `StackTags.module.css`**

```css
.list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.tag {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-sm);
  background: var(--accent-honey);
  color: var(--text-primary);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/StackTags/
git commit -m "feat: add StackTags component for gallery cards"
```

---

### Task 6: GalleryCard (TDD)

**Files:**
- Create: `src/components/GalleryCard/GalleryCard.jsx`
- Create: `src/components/GalleryCard/GalleryCard.module.css`
- Create: `src/components/GalleryCard/GalleryCard.test.jsx`

- [ ] **Step 1: Write failing test `GalleryCard.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import GalleryCard from './GalleryCard'

const baseItem = {
  id: 'test-app',
  title: 'Test App',
  tagline: 'A test tagline',
  stack: ['Go', 'React'],
  proves: 'Testing things',
  githubUrl: 'https://github.com/example/test-app',
  status: 'shipped',
}

describe('GalleryCard', () => {
  it('renders title, tagline, stack, and proves', () => {
    render(<GalleryCard item={baseItem} />)
    expect(screen.getByRole('heading', { name: 'Test App' })).toBeInTheDocument()
    expect(screen.getByText('A test tagline')).toBeInTheDocument()
    expect(screen.getByText('Go')).toBeInTheDocument()
    expect(screen.getByText('Testing things')).toBeInTheDocument()
  })

  it('shows GitHub link when githubUrl is set', () => {
    render(<GalleryCard item={baseItem} />)
    const link = screen.getByRole('link', { name: /view test app on github/i })
    expect(link).toHaveAttribute('href', baseItem.githubUrl)
  })

  it('shows Coming soon for wip without githubUrl', () => {
    render(
      <GalleryCard
        item={{ ...baseItem, githubUrl: null, status: 'wip' }}
      />
    )
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /github/i })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `npm run test:run -- src/components/GalleryCard/GalleryCard.test.jsx`
Expected: FAIL — module not found

- [ ] **Step 3: Implement `GalleryCard.jsx`**

```jsx
import StackTags from '../StackTags/StackTags'
import styles from './GalleryCard.module.css'

function GalleryCard({ item, className = '', style }) {
  const { title, tagline, stack, proves, githubUrl, status } = item
  const isWip = status === 'wip'
  const showGithub = Boolean(githubUrl)

  return (
    <article className={`${styles.card} ${className}`} style={style}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {isWip && <span className={styles.badge}>WIP</span>}
      </div>
      <p className={styles.tagline}>{tagline}</p>
      <StackTags stack={stack} />
      <p className={styles.proves}>
        <span className={styles.provesLabel}>Proves:</span> {proves}
      </p>
      <div className={styles.actions}>
        {showGithub ? (
          <a
            className={styles.link}
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${title} on GitHub`}
          >
            View on GitHub
          </a>
        ) : (
          <span className={styles.soon}>Coming soon</span>
        )}
      </div>
    </article>
  )
}

export default GalleryCard
```

Fix typo: remove erroneous `</div>` → use `</div>` → should be `</div>`:

```jsx
      </div>
```
→
```jsx
      </div>
```

- [ ] **Step 4: Create `GalleryCard.module.css`**

```css
.card {
  background: var(--card-bg);
  border: 1px solid rgba(199, 91, 57, 0.12);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--text-primary);
}

.badge {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  background: var(--accent-honey);
  color: var(--text-primary);
}

.tagline {
  color: var(--text-muted);
  margin-bottom: var(--spacing-sm);
}

.proves {
  margin-top: var(--spacing-sm);
  font-size: 0.9rem;
  color: var(--text-primary);
}

.provesLabel {
  font-weight: 600;
  color: var(--primary);
}

.actions {
  margin-top: var(--spacing-md);
}

.link {
  display: inline-block;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
}

.link:hover {
  color: var(--primary-light);
}

.link:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.soon {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-style: italic;
}
```

- [ ] **Step 5: Run tests — expect PASS**

Run: `npm run test:run -- src/components/GalleryCard/GalleryCard.test.jsx`
Expected: 3 passed

- [ ] **Step 6: Commit**

```bash
git add src/components/GalleryCard/
git commit -m "feat: add GalleryCard with stack, proves, and GitHub CTA"
```

---

### Task 7: GalleryGrid + useInView hook

**Files:**
- Create: `src/hooks/useInView.js`
- Create: `src/components/GalleryGrid/GalleryGrid.jsx`
- Create: `src/components/GalleryGrid/GalleryGrid.module.css`

- [ ] **Step 1: Create `src/hooks/useInView.js`**

```js
import { useEffect, useRef, useState } from 'react'

export function useInView(options = { threshold: 0.15 }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.disconnect()
      }
    }, options)

    observer.observe(el)
    return () => observer.disconnect()
  }, [options])

  return { ref, inView }
}
```

- [ ] **Step 2: Create `GalleryGrid.jsx`**

```jsx
import GalleryCard from '../GalleryCard/GalleryCard'
import { useInView } from '../../hooks/useInView'
import styles from './GalleryGrid.module.css'

function GalleryGrid({ items }) {
  const { ref, inView } = useInView()

  return (
    <div
      ref={ref}
      className={`${styles.grid} reveal ${inView ? 'reveal--visible' : ''}`}
    >
      {items.map((item, index) => (
        <GalleryCard
          key={item.id}
          item={item}
          className={styles.card}
          style={{ transitionDelay: `${index * 80}ms` }}
        />
      ))}
    </div>
  )
}

export default GalleryGrid
```

Pass `style` through GalleryCard — add optional `style` prop to GalleryCard root `article`.

Update `GalleryCard.jsx` root:
```jsx
<article className={...} style={style}>
```
and destructure `style` from props.

- [ ] **Step 3: Create `GalleryGrid.module.css`**

```css
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.card {
  /* delay applied via inline style on GalleryCard */
}
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useInView.js src/components/GalleryGrid/ src/components/GalleryCard/GalleryCard.jsx
git commit -m "feat: add GalleryGrid with scroll-reveal stagger"
```

---

### Task 8: Koi mascot assets

**Files:**
- Create: `public/mascot/koi-logo.png`
- Create: `public/mascot/koi-hero.png`
- Modify: `index.html` (favicon link)

- [ ] **Step 1: Generate logo asset**

Use image generation (or external tool) with prompt:

> Chibi koi fish mascot portrait, cute Chinese 锦鲤, round nerd glasses, derpy crossed eyes, warm terracotta and cream color palette, flat illustration, transparent background, favicon-friendly simple shapes, no text

Save as `public/mascot/koi-logo.png` (512×512, optimize later).

- [ ] **Step 2: Generate hero asset**

Prompt:

> Full-body chibi koi fish character wearing nerd glasses, derpy expression, fan tail, warm craft studio style, terracotta orange and cream colors, friendly maker mascot, transparent background, 1024×1024

Save as `public/mascot/koi-hero.png`.

- [ ] **Step 3: Update favicon in `index.html`**

```html
<link rel="icon" type="image/png" href="/mascot/koi-logo.png" />
```

- [ ] **Step 4: Commit assets**

```bash
git add public/mascot/ index.html
git commit -m "feat: add Gatewood Lab koi mascot image assets"
```

---

### Task 9: KoiMascot component

**Files:**
- Create: `src/components/KoiMascot/KoiMascot.jsx`
- Create: `src/components/KoiMascot/KoiMascot.module.css`

- [ ] **Step 1: Create `KoiMascot.jsx`**

```jsx
import styles from './KoiMascot.module.css'

function KoiMascot({ variant = 'hero', className = '' }) {
  const src =
    variant === 'logo' ? '/mascot/koi-logo.png' : '/mascot/koi-hero.png'
  const width = variant === 'logo' ? 48 : 320
  const alt = 'Gatewood Lab koi mascot with nerd glasses'

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height="auto"
      className={`${styles.mascot} ${styles[variant]} ${className}`}
      fetchPriority={variant === 'hero' ? 'high' : 'auto'}
      loading={variant === 'hero' ? 'eager' : 'lazy'}
    />
  )
}

export default KoiMascot
```

- [ ] **Step 2: Create `KoiMascot.module.css`**

```css
.mascot {
  display: block;
  user-select: none;
  transition: transform 0.3s ease;
}

.hero {
  max-width: 320px;
  filter: drop-shadow(0 8px 24px var(--shadow-warm));
}

.logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

@media (hover: hover) {
  .hero:hover {
    transform: rotate(-2deg) scale(1.02);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero:hover {
    transform: none;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/KoiMascot/
git commit -m "feat: add KoiMascot component for logo and hero variants"
```

---

### Task 10: Header rebrand

**Files:**
- Modify: `src/components/Header/Header.jsx`
- Modify: `src/components/Header/Header.module.css`

- [ ] **Step 1: Replace `Header.jsx`**

```jsx
import { Link, NavLink } from 'react-router-dom'
import { STUDIO_NAME } from '../../config/brand'
import KoiMascot from '../KoiMascot/KoiMascot'
import styles from './Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <KoiMascot variant="logo" />
          <span className={styles.logoText}>{STUDIO_NAME}</span>
        </Link>

        <nav className={styles.nav} aria-label="Main">
          <ul className={styles.navList}>
            <li>
              <NavLink to="/" className={styles.navLink} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/gallery" className={styles.navLink}>
                Gallery
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
```

Remove Contact import/state entirely.

- [ ] **Step 2: Update nav link active styles in `Header.module.css`**

Add:
```css
.navLink.active {
  color: var(--primary);
  font-weight: 600;
}
```

Remove `.ctaButton` rules if unused.

- [ ] **Step 3: Run dev server and verify header**

Run: `npm run dev` — check Home + Gallery links, logo shows koi.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header/
git commit -m "feat: rebrand header for Gatewood Lab with koi logo"
```

---

### Task 11: Hero + About rebrand

**Files:**
- Modify: `src/components/Hero/Hero.jsx`, `Hero.module.css`
- Modify: `src/components/About/About.jsx`, `About.module.css`

- [ ] **Step 1: Replace `Hero.jsx`**

```jsx
import { Link } from 'react-router-dom'
import { HERO_TITLE, HERO_SUBTITLE, TAGLINE } from '../../config/brand'
import KoiMascot from '../KoiMascot/KoiMascot'
import { useInView } from '../../hooks/useInView'
import styles from './Hero.module.css'

function Hero() {
  const { ref, inView } = useInView()

  return (
    <section id="home" className={styles.hero} ref={ref}>
      <div className={`${styles.inner} reveal ${inView ? 'reveal--visible' : ''}`}>
        <div className={styles.copy}>
          <h1 className={styles.title}>{HERO_TITLE}</h1>
          <p className={styles.subtitle}>{HERO_SUBTITLE}</p>
          <p className={styles.tagline}>{TAGLINE}</p>
          <Link to="/gallery" className={`btn-primary ${styles.cta}`}>
            View Gallery
          </Link>
        </div>
        <KoiMascot variant="hero" className={styles.mascot} />
      </div>
    </section>
  )
}

export default Hero
```

- [ ] **Step 2: Simplify `Hero.module.css`** — two-column layout on desktop:

```css
.hero {
  padding: var(--spacing-xl) 0;
}

.inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

@media (min-width: 768px) {
  .inner {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 5vw, 3rem);
  color: var(--text-primary);
}

.subtitle {
  color: var(--text-muted);
  margin: var(--spacing-sm) 0;
  max-width: 36ch;
}

.tagline {
  font-style: italic;
  color: var(--primary);
  margin-bottom: var(--spacing-md);
}

.cta {
  text-decoration: none;
  display: inline-block;
}
```

- [ ] **Step 3: Replace `About.jsx`** — remove journey diagram; user-editable copy:

```jsx
import styles from './About.module.css'

function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <h2 className={styles.title}>About</h2>
        <div className={styles.content}>
          <p className={styles.description}>
            {/* EDIT: Your funny bio below */}
            I build small apps at Gatewood Lab because shipping beats manifesting.
            My code reviews are 10% logic and 90% asking if we really need another microservice.
          </p>
          <p className={styles.description}>
            When I am not pushing to main, I am probably ranking bad ideas on a spreadsheet
            or debating whether koi can pass system design interviews.
          </p>
        </div>
      </div>
    </section>
  )
}

export default About
```

- [ ] **Step 4: Strip journey styles from `About.module.css`** (remove `.journeyFlow`, `.journeyStep`, etc.)

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero/ src/components/About/
git commit -m "feat: rebrand Hero and About for Gatewood Lab"
```

---

### Task 12: GalleryTeaser + Gallery page

**Files:**
- Create: `src/components/GalleryTeaser/GalleryTeaser.jsx`
- Create: `src/components/GalleryTeaser/GalleryTeaser.module.css`
- Modify: `src/pages/Gallery/Gallery.jsx`
- Create: `src/pages/Gallery/Gallery.module.css`
- Modify: `src/components/Home/Home.jsx`

- [ ] **Step 1: Create `GalleryTeaser.jsx`**

```jsx
import { Link } from 'react-router-dom'
import { getFeaturedItems } from '../../data/gallery'
import GalleryGrid from '../GalleryGrid/GalleryGrid'
import styles from './GalleryTeaser.module.css'

function GalleryTeaser() {
  const items = getFeaturedItems().slice(0, 3)

  return (
    <section id="gallery-teaser" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>From the Gallery</h2>
        <GalleryGrid items={items} />
        <Link to="/gallery" className={styles.more}>
          View full gallery →
        </Link>
      </div>
    </section>
  )
}

export default GalleryTeaser
```

- [ ] **Step 2: Implement full `Gallery.jsx` page**

```jsx
import { getAllItems } from '../../data/gallery'
import GalleryGrid from '../../components/GalleryGrid/GalleryGrid'
import KoiMascot from '../../components/KoiMascot/KoiMascot'
import styles from './Gallery.module.css'

function GalleryPage() {
  return (
    <div className={styles.page}>
      <div className={`${styles.header} container`}>
        <div>
          <h1 className={styles.title}>Gallery</h1>
          <p className={styles.intro}>
            Small apps, honest stacks, and proof I can ship. Still swimming toward the dragon gate.
          </p>
        </div>
        <KoiMascot variant="hero" className={styles.mascot} />
      </div>
      <div className="container">
        <GalleryGrid items={getAllItems()} />
      </div>
    </div>
  )
}

export default GalleryPage
```

Fix closing tag to `</div>` → `</div>`.

- [ ] **Step 3: Update `Home.jsx`**

```jsx
import Hero from '../Hero/Hero'
import About from '../About/About'
import GalleryTeaser from '../GalleryTeaser/GalleryTeaser'

function Home() {
  return (
    <>
      <Hero />
      <About />
      <GalleryTeaser />
    </>
  )
}

export default Home
```

- [ ] **Step 4: Commit**

```bash
git add src/components/GalleryTeaser/ src/pages/Gallery/ src/components/Home/Home.jsx
git commit -m "feat: add Gallery page and home teaser section"
```

---

### Task 13: Footer social icons

**Files:**
- Modify: `src/components/Footer/Footer.jsx`
- Modify: `src/components/Footer/Footer.module.css`

- [ ] **Step 1: Replace `Footer.jsx`**

```jsx
import { Link } from 'react-router-dom'
import { STUDIO_NAME, TAGLINE } from '../../config/brand'
import { SOCIAL } from '../../config/social'
import styles from './Footer.module.css'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <p className={styles.logo}>{STUDIO_NAME}</p>
          <p className={styles.tagline}>{TAGLINE}</p>
        </div>
        <nav className={styles.social} aria-label="Social links">
          <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            GitHub
          </a>
          <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            LinkedIn
          </a>
          <a href={SOCIAL.email} aria-label="Email">
            Email
          </a>
        </nav>
        <p className={styles.copyright}>© {year} {STUDIO_NAME}</p>
      </div>
    </footer>
  )
}

export default Footer
```

Remove unused `Link` import if not used.

Optional: swap text links for SVG icons (inline SVG or simple Unicode) in same step.

- [ ] **Step 2: Simplify footer CSS** — flex column, centered social row, focus-visible outlines.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer/
git commit -m "feat: Gatewood Lab footer with social links only"
```

---

### Task 14: ErrorBoundary + SEO meta

**Files:**
- Modify: `src/components/ErrorBoundary/ErrorBoundary.jsx`
- Modify: `index.html`

- [ ] **Step 1: Update ErrorBoundary message** to reference Gatewood Lab (no Fufu).

- [ ] **Step 2: Update SEO in `index.html`**

```html
<title>Gatewood Lab — Small apps, warm studio</title>
<meta name="description" content="Gatewood Lab is a gallery of small, interesting apps—playful personality, real engineering. Built by Jason C." />
<meta name="author" content="Gatewood Lab" />
<meta property="og:title" content="Gatewood Lab" />
<meta property="og:description" content="Gallery of micro-apps and experiments with warm craft and real stacks." />
<meta property="og:image" content="/mascot/koi-logo.png" />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ErrorBoundary/ index.html
git commit -m "chore: update ErrorBoundary and SEO meta for Gatewood Lab"
```

---

### Task 15: package.json + docs sweep

**Files:**
- Modify: `package.json`, `README.md`, `FEATURES.md`, `LICENSE`, `CONTRIBUTING.md`

- [ ] **Step 1: Update `package.json`**

```json
"name": "gatewood-lab-portfolio",
"description": "Gatewood Lab — gallery-first portfolio of small apps",
"keywords": ["portfolio", "react", "gatewood-lab", "gallery"],
"author": "Jason C."
```

Remove `fufu-and-co` keyword.

- [ ] **Step 2: Rewrite `README.md`** — Gatewood Lab overview, link to spec, dev commands, mascot attribution.

- [ ] **Step 3: Rewrite `FEATURES.md`** — phases: gallery extensibility, motion polish, live URLs, filter tags (align spec non-goals).

- [ ] **Step 4: Update `LICENSE` brand section** — Gatewood Lab koi assets replace Fufu bear.

- [ ] **Step 5: Update `CONTRIBUTING.md`** — remove Fufu IP references.

- [ ] **Step 6: Commit**

```bash
git add package.json README.md FEATURES.md LICENSE CONTRIBUTING.md
git commit -m "docs: rebrand repository metadata and docs for Gatewood Lab"
```

---

### Task 16: Manual QA checklist

- [ ] `npm run test:run` — all tests pass
- [ ] `npm run build` — production build succeeds
- [ ] `npm run lint` — no errors (fix if any)
- [ ] Home: Hero, About, teaser, koi images load
- [ ] `/gallery`: full grid, WIP badges, Coming soon when no GitHub URL
- [ ] Header `NavLink` active states on Home vs Gallery
- [ ] Footer links open correct URLs (after updating `social.js`)
- [ ] `prefers-reduced-motion`: no stagger/jank; content still visible
- [ ] Mobile 375px: hero stacks vertically, grid single column
- [ ] No references to “Fufu” in `src/` (run `rg -i fufu src`)

- [ ] **Final commit if any QA fixes**

```bash
git commit -m "fix: address Gatewood Lab rebrand QA findings"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Gatewood Lab name | 2, 10–15 |
| Drop Fufu / handbook / contact | 3, 15 |
| Gallery data model + extensibility | 4, 6 |
| GitHub-only v1 CTA | 6 |
| Home + `/gallery` IA | 3, 12 |
| Capabilities via `proves` + `stack` | 5, 6 |
| Warm palette | 2 |
| Outfit + Inter fonts | 2 |
| Playful motion + reduced-motion | 2, 7, 11 |
| Koi mascot (锦鲤, glasses, derp) | 8, 9 |
| Footer social only | 13 |
| SEO | 14 |
| Remove EmailJS | 3 |
| Optional GalleryCard test | 6 |

## Open items (user before deploy)

1. Edit About copy in `About.jsx`
2. Set real URLs in `src/config/social.js`
3. Add real `githubUrl` values in `gallery.js` as repos ship
4. Replace placeholder koi images if regenerating mascot
