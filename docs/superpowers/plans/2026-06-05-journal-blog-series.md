# Journal Blog Series Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `Journal` section — an MDX-backed blog series ("The Road to Senior, One Incident at a Time") with a timeline index at `/journal`, a long-form reader at `/journal/:slug`, and a themed "Upstream" invitation block on Home below Recent specimens.

**Architecture:** Posts are self-contained `.mdx` files in `src/content/journal/`, auto-discovered at build time via `import.meta.glob`. A pure data layer (`src/data/journal.js`) derives slugs, sorts by date, computes read time, and exposes gallery-style helpers. UI is split into focused components/pages reusing the existing CSS-token system, `useInView` reveal motion, and CSS-module structure.

**Tech Stack:** React 19, react-router-dom 7, Vite 7, Vitest + Testing Library, MDX (`@mdx-js/rollup`, `@mdx-js/react`, `remark-gfm`, `remark-frontmatter`, `remark-mdx-frontmatter`).

**Spec:** `docs/superpowers/specs/2026-06-05-journal-blog-series-design.md`

---

## File Structure

**Create:**
- `src/content/journal/2026-06-05-paged-at-3am.mdx` — seed post (also serves as test fixture content)
- `src/content/journal/2026-06-12-the-flaky-test.mdx` — second seed post (for prev/next + sorting)
- `src/data/journal.js` — discovery + pure helpers + public API
- `src/data/journal.test.js` — unit tests for pure helpers
- `src/components/JournalInvite/JournalInvite.jsx` + `.module.css` + `.test.jsx` — Home invite block
- `src/pages/Journal/Journal.jsx` + `.module.css` + `.test.jsx` — timeline index
- `src/pages/JournalPost/JournalPost.jsx` + `.module.css` + `.test.jsx` — post reader
- `src/components/ReadingProgress/ReadingProgress.jsx` + `.module.css` + `.test.jsx`
- `src/components/TableOfContents/TableOfContents.jsx` + `.module.css`
- `src/components/PostNav/PostNav.jsx` + `.module.css` + `.test.jsx`
- `src/components/ShareLink/ShareLink.jsx` + `.module.css` + `.test.jsx`
- `src/components/MdxContent/mdxComponents.jsx` — MDXProvider element map
- `src/components/MdxContent/MdxContent.module.css` — scoped MDX typography

**Modify:**
- `package.json` — add MDX deps
- `vite.config.js` — register MDX plugin
- `src/config/brand.js` — `JOURNAL_*` constants
- `src/components/Header/Header.jsx` — Journal nav link
- `src/App.jsx` — `/journal` + `/journal/:slug` routes
- `src/components/Home/Home.jsx` — insert `<JournalInvite />`
- `src/components/Home/Home.test.jsx` — assert invite renders

---

## Task 1: Install and wire MDX

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`

- [ ] **Step 1: Install dependencies**

Run:
```bash
npm install @mdx-js/rollup @mdx-js/react remark-gfm remark-frontmatter remark-mdx-frontmatter
```
Expected: packages added to `dependencies`, no peer warnings that fail install.

- [ ] **Step 2: Wire the MDX plugin into Vite**

Replace the full contents of `vite.config.js` with:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
          remarkGfm,
        ],
        providerImportSource: '@mdx-js/react',
      }),
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
  ],
  test: {
    environment: 'happy-dom',
    setupFiles: './src/test/setup.js',
    globals: true,
    passWithNoTests: true,
  },
})
```

- [ ] **Step 3: Verify the dev/build pipeline still boots**

Run: `npm run build`
Expected: build succeeds (no MDX files exist yet; React app builds as before).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json vite.config.js
git commit -m "build: add MDX pipeline for Journal posts"
```

---

## Task 2: Brand copy constants

**Files:**
- Modify: `src/config/brand.js`

- [ ] **Step 1: Append Journal constants**

Add to the end of `src/config/brand.js`:

```js
export const JOURNAL_NAV_LABEL = 'Journal'
export const JOURNAL_SERIES_TITLE = 'The Road to Senior, One Incident at a Time'
export const JOURNAL_EYEBROW = 'The Journal'
export const JOURNAL_EYEBROW_PAGE = 'Upstream'
export const JOURNAL_INVITE_BODY =
  'A running series on the climb from mid-level to senior — one incident, postmortem, and hard-won lesson at a time.'
export const JOURNAL_INVITE_CTA = 'Follow the climb'
export const JOURNAL_EMPTY = 'The first entry is still swimming upstream…'
export const JOURNAL_NOT_FOUND = 'This entry drifted away…'
export const JOURNAL_DRAGON_GLYPH = '龙'
```

- [ ] **Step 2: Commit**

```bash
git add src/config/brand.js
git commit -m "feat: add Journal brand copy constants"
```

---

## Task 3: Data layer (pure helpers, TDD)

**Files:**
- Create: `src/data/journal.js`
- Test: `src/data/journal.test.js`

- [ ] **Step 1: Write the failing test**

Create `src/data/journal.test.js`:

```js
import { describe, it, expect } from 'vitest'
import {
  deriveSlug,
  stripFrontmatter,
  computeReadTime,
  buildPost,
  sortByDateDesc,
  selectPosts,
  getAdjacent,
} from './journal'

const rawWithFm = `---
title: "X"
date: "2026-06-05"
---
one two three four five`

describe('journal data helpers', () => {
  it('derives slug from filename, stripping date prefix and extension', () => {
    expect(deriveSlug('../content/journal/2026-06-05-paged-at-3am.mdx')).toBe('paged-at-3am')
  })

  it('strips a leading frontmatter block', () => {
    expect(stripFrontmatter(rawWithFm).trim()).toBe('one two three four five')
  })

  it('computes read time as at least 1 minute', () => {
    expect(computeReadTime(rawWithFm)).toBe(1)
    const long = '---\na: b\n---\n' + 'word '.repeat(450)
    expect(computeReadTime(long)).toBe(2)
  })

  it('builds a post object from a module + raw source', () => {
    const mod = {
      frontmatter: { title: 'T', date: '2026-06-05', summary: 'S', tags: ['a'] },
      default: () => null,
    }
    const post = buildPost('../content/journal/2026-06-05-t.mdx', mod, rawWithFm)
    expect(post).toMatchObject({ slug: 't', title: 'T', summary: 'S', tags: ['a'], published: true })
    expect(post.readTime).toBeGreaterThanOrEqual(1)
    expect(typeof post.Component).toBe('function')
  })

  it('throws when required frontmatter is missing', () => {
    const mod = { frontmatter: { title: 'T' }, default: () => null }
    expect(() => buildPost('../content/journal/2026-06-05-t.mdx', mod, '')).toThrow(/missing required frontmatter/)
  })

  it('defaults published to true and tags to empty array', () => {
    const mod = { frontmatter: { title: 'T', date: '2026-06-05', summary: 'S' }, default: () => null }
    const post = buildPost('../content/journal/2026-06-05-t.mdx', mod, '')
    expect(post.published).toBe(true)
    expect(post.tags).toEqual([])
  })

  it('sorts posts newest date first, ties broken by slug ascending', () => {
    const posts = [
      { slug: 'b', date: '2026-06-05' },
      { slug: 'a', date: '2026-06-05' },
      { slug: 'c', date: '2026-06-12' },
    ]
    expect(sortByDateDesc(posts).map((p) => p.slug)).toEqual(['c', 'a', 'b'])
  })

  it('selectPosts excludes drafts unless includeDrafts is true', () => {
    const posts = [
      { slug: 'pub', date: '2026-06-12', published: true },
      { slug: 'draft', date: '2026-06-05', published: false },
    ]
    expect(selectPosts(posts, { includeDrafts: false }).map((p) => p.slug)).toEqual(['pub'])
    expect(selectPosts(posts, { includeDrafts: true }).map((p) => p.slug)).toEqual(['pub', 'draft'])
  })

  it('getAdjacent returns prev (newer) and next (older) within ordered list', () => {
    const ordered = [{ slug: 'c' }, { slug: 'b' }, { slug: 'a' }]
    expect(getAdjacent(ordered, 'b')).toEqual({ prev: { slug: 'c' }, next: { slug: 'a' } })
    expect(getAdjacent(ordered, 'c')).toEqual({ prev: null, next: { slug: 'b' } })
    expect(getAdjacent(ordered, 'a')).toEqual({ prev: { slug: 'b' }, next: null })
    expect(getAdjacent(ordered, 'missing')).toEqual({ prev: null, next: null })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/data/journal.test.js`
Expected: FAIL — cannot resolve exports from `./journal` (module not created).

- [ ] **Step 3: Write the implementation**

Create `src/data/journal.js`:

```js
const modules = import.meta.glob('../content/journal/*.mdx', { eager: true })
const rawModules = import.meta.glob('../content/journal/*.mdx', {
  eager: true,
  query: '?raw',
  import: 'default',
})

export function deriveSlug(path) {
  const file = path.split('/').pop().replace(/\.mdx$/, '')
  return file.replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

export function stripFrontmatter(raw) {
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
}

export function computeReadTime(raw) {
  const words = stripFrontmatter(raw).trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function buildPost(path, mod, raw = '') {
  const fm = mod.frontmatter ?? {}
  if (!fm.title || !fm.date || !fm.summary) {
    throw new Error(
      `Journal post ${path} is missing required frontmatter (title, date, summary)`
    )
  }
  return {
    slug: deriveSlug(path),
    title: fm.title,
    date: fm.date,
    summary: fm.summary,
    tags: fm.tags ?? [],
    published: fm.published ?? true,
    readTime: computeReadTime(raw),
    Component: mod.default,
  }
}

export function sortByDateDesc(posts) {
  return [...posts].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1
    return a.slug < b.slug ? -1 : 1
  })
}

export function selectPosts(posts, { includeDrafts }) {
  const filtered = includeDrafts ? posts : posts.filter((p) => p.published)
  return sortByDateDesc(filtered)
}

export function getAdjacent(orderedPosts, slug) {
  const i = orderedPosts.findIndex((p) => p.slug === slug)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: i > 0 ? orderedPosts[i - 1] : null,
    next: i < orderedPosts.length - 1 ? orderedPosts[i + 1] : null,
  }
}

const allPosts = Object.entries(modules).map(([path, mod]) =>
  buildPost(path, mod, rawModules[path] ?? '')
)

export function getAllPosts({ includeDrafts = import.meta.env.DEV } = {}) {
  return selectPosts(allPosts, { includeDrafts })
}

export function getPostBySlug(slug) {
  return getAllPosts().find((p) => p.slug === slug)
}

export function getAdjacentPosts(slug) {
  return getAdjacent(getAllPosts(), slug)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/data/journal.test.js`
Expected: PASS (all 9 cases).

- [ ] **Step 5: Commit**

```bash
git add src/data/journal.js src/data/journal.test.js
git commit -m "feat: add Journal data layer with TDD helpers"
```

---

## Task 4: Seed posts (MDX content)

**Files:**
- Create: `src/content/journal/2026-06-05-paged-at-3am.mdx`
- Create: `src/content/journal/2026-06-12-the-flaky-test.mdx`

- [ ] **Step 1: Create the first post**

Create `src/content/journal/2026-06-05-paged-at-3am.mdx`:

```mdx
---
title: "Paged at 3AM: My First Real Incident"
date: "2026-06-05"
summary: "What a flapping health check taught me about humility and runbooks."
tags: ["incidents", "oncall"]
published: true
---

## The page

The pager went off at 3:02AM. A health check was flapping, and I had no idea
why. This is the story of how I learned that calm is a skill, not a mood.

## What I missed

The first thing I did was the wrong thing: I started reading code. The dashboard
had the answer the whole time.

### The fix

We rolled back the deploy, the flapping stopped, and I wrote the runbook I wished
I had at 3AM.

## What I'd tell past me

Read the graphs first. Roll back early. Write the runbook after.
```

- [ ] **Step 2: Create the second post**

Create `src/content/journal/2026-06-12-the-flaky-test.mdx`:

```mdx
---
title: "The Flaky Test That Wasn't"
date: "2026-06-12"
summary: "A test that failed one time in fifty turned out to be a real race condition."
tags: ["testing", "concurrency"]
published: true
---

## One in fifty

Everyone called it flaky. I called it a lead. A test that fails one time in fifty
is telling you something true about your system.

## The race

Two goroutines, one shared map, zero synchronization. The test was the only honest
thing in the building.

## The lesson

"Flaky" is often just a bug you haven't respected yet.
```

- [ ] **Step 3: Verify the data layer reads them**

Run: `npm run build`
Expected: build succeeds and includes the MDX modules (no frontmatter errors thrown).

- [ ] **Step 4: Commit**

```bash
git add src/content/journal/
git commit -m "content: add two seed Journal posts"
```

---

## Task 5: Header Journal nav link

**Files:**
- Modify: `src/components/Header/Header.jsx`

- [ ] **Step 1: Add the Journal nav link**

In `src/components/Header/Header.jsx`, add a third `<li>` immediately after the Gallery `<li>` (before the closing `</ul>`):

```jsx
            <li>
              <NavLink
                to="/journal"
                className={({ isActive }) =>
                  [styles.navLink, isActive ? styles.active : ''].filter(Boolean).join(' ')
                }
              >
                Journal
              </NavLink>
            </li>
```

- [ ] **Step 2: Verify nav renders three links**

Run: `npm run dev`, open the site, confirm the header shows **Home · Gallery · Journal** and `/journal` highlights when active. (No route exists yet; link will 404 until Task 7 — that is expected.)

- [ ] **Step 3: Commit**

```bash
git add src/components/Header/Header.jsx
git commit -m "feat: add Journal link to header nav"
```

---

## Task 6: MDX component map + scoped typography

**Files:**
- Create: `src/components/MdxContent/mdxComponents.jsx`
- Create: `src/components/MdxContent/MdxContent.module.css`

- [ ] **Step 1: Create the heading id helper + component map**

Create `src/components/MdxContent/mdxComponents.jsx`:

```jsx
import styles from './MdxContent.module.css'

export function slugifyHeading(children) {
  return String(children)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function H2({ children, ...props }) {
  return (
    <h2 id={slugifyHeading(children)} className={styles.h2} {...props}>
      {children}
    </h2>
  )
}

function H3({ children, ...props }) {
  return (
    <h3 id={slugifyHeading(children)} className={styles.h3} {...props}>
      {children}
    </h3>
  )
}

function A({ href = '', children, ...props }) {
  const external = /^https?:\/\//.test(href)
  const extra = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <a href={href} className={styles.link} {...extra} {...props}>
      {children}
    </a>
  )
}

function Img({ alt = '', ...props }) {
  return <img alt={alt} className={styles.img} loading="lazy" {...props} />
}

export const mdxComponents = {
  h2: H2,
  h3: H3,
  a: A,
  img: Img,
  p: (props) => <p className={styles.p} {...props} />,
  ul: (props) => <ul className={styles.ul} {...props} />,
  ol: (props) => <ol className={styles.ol} {...props} />,
  blockquote: (props) => <blockquote className={styles.blockquote} {...props} />,
  pre: (props) => <pre className={styles.pre} {...props} />,
  code: (props) => <code className={styles.code} {...props} />,
}
```

- [ ] **Step 2: Create the scoped typography stylesheet**

Create `src/components/MdxContent/MdxContent.module.css`:

```css
.h2 {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  color: var(--text-primary);
  margin: var(--spacing-xl) 0 var(--spacing-sm);
  scroll-margin-top: calc(var(--header-height) + var(--spacing-md));
}

.h3 {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--text-primary);
  margin: var(--spacing-lg) 0 var(--spacing-xs);
  scroll-margin-top: calc(var(--header-height) + var(--spacing-md));
}

.p {
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md);
}

.ul,
.ol {
  margin: 0 0 var(--spacing-md);
  padding-left: var(--spacing-lg);
  color: var(--text-primary);
}

.link {
  color: var(--primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.link:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: 2px;
}

.blockquote {
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-sm) var(--spacing-md);
  border-left: 3px solid var(--accent-honey);
  background: var(--card-bg);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  font-style: italic;
}

.pre {
  background: var(--card-bg);
  border: 1px solid var(--bg-peach);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  overflow-x: auto;
  margin: 0 0 var(--spacing-md);
}

.code {
  font-family: var(--font-mono);
  font-size: 0.9em;
}

.img {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  margin: var(--spacing-md) 0;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/MdxContent/
git commit -m "feat: add MDX component map and post typography"
```

---

## Task 7: JournalInvite block on Home (TDD)

**Files:**
- Create: `src/components/JournalInvite/JournalInvite.jsx`
- Create: `src/components/JournalInvite/JournalInvite.module.css`
- Test: `src/components/JournalInvite/JournalInvite.test.jsx`
- Modify: `src/components/Home/Home.jsx`
- Modify: `src/components/Home/Home.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/JournalInvite/JournalInvite.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import JournalInvite from './JournalInvite'
import { JOURNAL_SERIES_TITLE, JOURNAL_INVITE_CTA } from '../../config/brand'

function renderInvite() {
  return render(
    <MemoryRouter>
      <JournalInvite />
    </MemoryRouter>
  )
}

describe('JournalInvite', () => {
  it('renders the series title', () => {
    renderInvite()
    expect(screen.getByText(JOURNAL_SERIES_TITLE)).toBeInTheDocument()
  })

  it('links to the journal via the CTA', () => {
    renderInvite()
    const cta = screen.getByRole('link', { name: new RegExp(JOURNAL_INVITE_CTA, 'i') })
    expect(cta).toHaveAttribute('href', '/journal')
  })

  it('does not render any post previews', () => {
    const { container } = renderInvite()
    expect(container.querySelectorAll('article')).toHaveLength(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/components/JournalInvite/JournalInvite.test.jsx`
Expected: FAIL — cannot resolve `./JournalInvite`.

- [ ] **Step 3: Write the component**

Create `src/components/JournalInvite/JournalInvite.jsx`:

```jsx
import { Link } from 'react-router-dom'
import {
  JOURNAL_DRAGON_GLYPH,
  JOURNAL_EYEBROW,
  JOURNAL_INVITE_BODY,
  JOURNAL_INVITE_CTA,
  JOURNAL_SERIES_TITLE,
} from '../../config/brand'
import { useInView } from '../../hooks/useInView'
import styles from './JournalInvite.module.css'

function JournalInvite() {
  const { ref, inView } = useInView()

  return (
    <section className={styles.section} aria-labelledby="journal-invite-heading">
      <div
        ref={ref}
        className={`${styles.inner} reveal ${inView ? 'reveal--visible' : ''}`}
      >
        <span className={styles.glyph} aria-hidden="true">
          {JOURNAL_DRAGON_GLYPH}
        </span>
        <p className={styles.eyebrow}>{JOURNAL_EYEBROW}</p>
        <h2 id="journal-invite-heading" className={styles.title}>
          {JOURNAL_SERIES_TITLE}
        </h2>
        <p className={styles.body}>{JOURNAL_INVITE_BODY}</p>
        <Link to="/journal" className={styles.cta}>
          {JOURNAL_INVITE_CTA} →
        </Link>
      </div>
    </section>
  )
}

export default JournalInvite
```

- [ ] **Step 4: Write the stylesheet**

Create `src/components/JournalInvite/JournalInvite.module.css`:

```css
.section {
  padding: var(--spacing-xl) var(--spacing-lg);
}

.inner {
  position: relative;
  max-width: 760px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-lg);
  text-align: center;
  background: var(--card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.glyph {
  position: absolute;
  top: 50%;
  right: var(--spacing-md);
  transform: translateY(-50%);
  font-family: var(--font-calligraphy);
  font-size: 12rem;
  line-height: 1;
  color: var(--primary);
  opacity: 0.07;
  pointer-events: none;
  user-select: none;
}

.eyebrow {
  position: relative;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: var(--spacing-xs);
}

.title {
  position: relative;
  font-family: var(--font-heading);
  font-size: clamp(1.4rem, 4vw, 2.1rem);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.body {
  position: relative;
  max-width: 52ch;
  margin: 0 auto var(--spacing-lg);
  color: var(--text-muted);
}

.cta {
  position: relative;
  display: inline-block;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.cta:hover {
  border-color: var(--primary);
  transform: translateY(-1px);
}

.cta:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 4px;
  border-radius: 2px;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:run -- src/components/JournalInvite/JournalInvite.test.jsx`
Expected: PASS (3 cases).

- [ ] **Step 6: Insert into Home and update Home test**

In `src/components/Home/Home.jsx`, import and place the invite between `<GalleryTeaser />` and `<About />`:

```jsx
import About from '../About/About'
import GalleryTeaser from '../GalleryTeaser/GalleryTeaser'
import Hero from '../Hero/Hero'
import JournalInvite from '../JournalInvite/JournalInvite'

function Home() {
  return (
    <>
      <Hero />
      <GalleryTeaser />
      <JournalInvite />
      <About />
    </>
  )
}

export default Home
```

In `src/components/Home/Home.test.jsx`, add a case inside the `describe('Home', ...)` block:

```jsx
  it('renders the Journal invitation linking to /journal', () => {
    renderHome()
    const cta = screen.getByRole('link', { name: /follow the climb/i })
    expect(cta).toHaveAttribute('href', '/journal')
  })
```

- [ ] **Step 7: Run the Home tests**

Run: `npm run test:run -- src/components/Home/Home.test.jsx`
Expected: PASS (existing h1 test + new invite test).

- [ ] **Step 8: Commit**

```bash
git add src/components/JournalInvite/ src/components/Home/Home.jsx src/components/Home/Home.test.jsx
git commit -m "feat: add Upstream Journal invite block to Home"
```

---

## Task 8: Journal index timeline page (TDD)

**Files:**
- Create: `src/pages/Journal/Journal.jsx`
- Create: `src/pages/Journal/Journal.module.css`
- Test: `src/pages/Journal/Journal.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/Journal/Journal.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'

vi.mock('../../data/journal', () => ({
  getAllPosts: vi.fn(),
}))

import { getAllPosts } from '../../data/journal'
import Journal from './Journal'

function renderJournal() {
  return render(
    <MemoryRouter>
      <Journal />
    </MemoryRouter>
  )
}

describe('Journal index', () => {
  it('renders an entry per post linking to its slug', () => {
    getAllPosts.mockReturnValue([
      { slug: 'a', title: 'Post A', date: '2026-06-12', summary: 'Sum A', tags: ['x'], readTime: 3 },
      { slug: 'b', title: 'Post B', date: '2026-06-05', summary: 'Sum B', tags: [], readTime: 1 },
    ])
    renderJournal()
    expect(screen.getByRole('link', { name: /post a/i })).toHaveAttribute('href', '/journal/a')
    expect(screen.getByRole('link', { name: /post b/i })).toHaveAttribute('href', '/journal/b')
    expect(screen.getByText('Sum A')).toBeInTheDocument()
  })

  it('renders an empty state when there are no posts', () => {
    getAllPosts.mockReturnValue([])
    renderJournal()
    expect(screen.getByText(/still swimming upstream/i)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /\/journal\// })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/pages/Journal/Journal.test.jsx`
Expected: FAIL — cannot resolve `./Journal`.

- [ ] **Step 3: Write the page**

Create `src/pages/Journal/Journal.jsx`:

```jsx
import { Link } from 'react-router-dom'
import KoiMascot from '../../components/KoiMascot/KoiMascot'
import {
  JOURNAL_EMPTY,
  JOURNAL_EYEBROW_PAGE,
  JOURNAL_SERIES_TITLE,
} from '../../config/brand'
import { getAllPosts } from '../../data/journal'
import { useInView } from '../../hooks/useInView'
import styles from './Journal.module.css'

function formatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function TimelineEntry({ post }) {
  const { ref, inView } = useInView()
  return (
    <li
      ref={ref}
      className={`${styles.entry} reveal ${inView ? 'reveal--visible' : ''}`}
    >
      <span className={styles.node} aria-hidden="true" />
      <article className={styles.card}>
        <p className={styles.meta}>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true"> · </span>
          <span>{post.readTime} min read</span>
        </p>
        <h2 className={styles.entryTitle}>
          <Link to={`/journal/${post.slug}`} className={styles.entryLink}>
            {post.title}
          </Link>
        </h2>
        <p className={styles.summary}>{post.summary}</p>
        {post.tags.length > 0 && (
          <ul className={styles.tags}>
            {post.tags.map((tag) => (
              <li key={tag} className={styles.tag}>
                {tag}
              </li>
            ))}
          </ul>
        )}
      </article>
    </li>
  )
}

function Journal() {
  const posts = getAllPosts()

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.mascotBlock}>
          <KoiMascot variant="hero" className={styles.heroMascot} />
        </div>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{JOURNAL_EYEBROW_PAGE}</p>
          <h1 className={styles.title}>{JOURNAL_SERIES_TITLE}</h1>
        </div>
      </header>

      {posts.length === 0 ? (
        <p className={styles.empty}>{JOURNAL_EMPTY}</p>
      ) : (
        <ol className={styles.timeline}>
          {posts.map((post) => (
            <TimelineEntry key={post.slug} post={post} />
          ))}
        </ol>
      )}
    </div>
  )
}

export default Journal
```

- [ ] **Step 4: Write the stylesheet**

Create `src/pages/Journal/Journal.module.css`:

```css
.page {
  max-width: 820px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-lg);
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.heroMascot {
  width: 120px;
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary);
}

.title {
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 5vw, 2.4rem);
  color: var(--text-primary);
}

.empty {
  text-align: center;
  color: var(--text-muted);
  padding: var(--spacing-xl) 0;
}

.timeline {
  list-style: none;
  position: relative;
  margin: 0;
  padding: 0 0 0 var(--spacing-lg);
}

.timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: linear-gradient(var(--accent-honey), var(--primary-light));
  opacity: 0.5;
}

.entry {
  position: relative;
  margin-bottom: var(--spacing-xl);
}

.node {
  position: absolute;
  left: calc(-1 * var(--spacing-lg) + 1px);
  top: 6px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 0 4px var(--bg-cream);
}

.card {
  background: var(--card-bg);
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.meta {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: var(--spacing-xs);
}

.entryTitle {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  margin-bottom: var(--spacing-xs);
}

.entryLink {
  color: var(--text-primary);
  text-decoration: none;
}

.entryLink:hover {
  color: var(--primary);
}

.entryLink:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: 2px;
}

.summary {
  color: var(--text-muted);
  margin-bottom: var(--spacing-sm);
}

.tags {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  padding: 0;
}

.tag {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--primary);
  background: var(--bg-peach);
  padding: 2px 10px;
  border-radius: var(--radius-lg);
}

@media (min-width: 768px) {
  .timeline {
    padding-left: var(--spacing-xl);
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:run -- src/pages/Journal/Journal.test.jsx`
Expected: PASS (2 cases).

- [ ] **Step 6: Commit**

```bash
git add src/pages/Journal/
git commit -m "feat: add Journal timeline index page"
```

---

## Task 9: ReadingProgress component (TDD)

**Files:**
- Create: `src/components/ReadingProgress/ReadingProgress.jsx`
- Create: `src/components/ReadingProgress/ReadingProgress.module.css`
- Test: `src/components/ReadingProgress/ReadingProgress.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/ReadingProgress/ReadingProgress.test.jsx`:

```jsx
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ReadingProgress from './ReadingProgress'

describe('ReadingProgress', () => {
  it('renders a decorative progress bar', () => {
    const { container } = render(<ReadingProgress />)
    const bar = container.querySelector('[aria-hidden="true"]')
    expect(bar).toBeInTheDocument()
  })

  it('initializes progress width at 0%', () => {
    const { container } = render(<ReadingProgress />)
    const fill = container.querySelector('[data-testid="progress-fill"]')
    expect(fill).toHaveStyle({ width: '0%' })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/components/ReadingProgress/ReadingProgress.test.jsx`
Expected: FAIL — cannot resolve `./ReadingProgress`.

- [ ] **Step 3: Write the component**

Create `src/components/ReadingProgress/ReadingProgress.jsx`:

```jsx
import { useEffect, useState } from 'react'
import styles from './ReadingProgress.module.css'

function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0
      setProgress(Math.min(100, Math.max(0, pct)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className={styles.track} aria-hidden="true">
      <div
        className={styles.fill}
        data-testid="progress-fill"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default ReadingProgress
```

- [ ] **Step 4: Write the stylesheet**

Create `src/components/ReadingProgress/ReadingProgress.module.css`:

```css
.track {
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  height: 3px;
  background: transparent;
  z-index: 40;
  pointer-events: none;
}

.fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-honey), var(--primary));
  transition: width 0.1s linear;
}

@media (prefers-reduced-motion: reduce) {
  .fill {
    transition: none;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:run -- src/components/ReadingProgress/ReadingProgress.test.jsx`
Expected: PASS (2 cases).

- [ ] **Step 6: Commit**

```bash
git add src/components/ReadingProgress/
git commit -m "feat: add reading progress indicator"
```

---

## Task 10: PostNav prev/next component (TDD)

**Files:**
- Create: `src/components/PostNav/PostNav.jsx`
- Create: `src/components/PostNav/PostNav.module.css`
- Test: `src/components/PostNav/PostNav.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/PostNav/PostNav.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import PostNav from './PostNav'

function renderNav(props) {
  return render(
    <MemoryRouter>
      <PostNav {...props} />
    </MemoryRouter>
  )
}

describe('PostNav', () => {
  it('renders prev and next links to the right slugs', () => {
    renderNav({
      prev: { slug: 'newer', title: 'Newer Post' },
      next: { slug: 'older', title: 'Older Post' },
    })
    expect(screen.getByRole('link', { name: /newer post/i })).toHaveAttribute('href', '/journal/newer')
    expect(screen.getByRole('link', { name: /older post/i })).toHaveAttribute('href', '/journal/older')
  })

  it('omits the prev side when prev is null', () => {
    renderNav({ prev: null, next: { slug: 'older', title: 'Older Post' } })
    expect(screen.queryByText(/newer/i)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /older post/i })).toBeInTheDocument()
  })

  it('renders nothing when both are null', () => {
    const { container } = renderNav({ prev: null, next: null })
    expect(container).toBeEmptyDOMElement()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/components/PostNav/PostNav.test.jsx`
Expected: FAIL — cannot resolve `./PostNav`.

- [ ] **Step 3: Write the component**

Create `src/components/PostNav/PostNav.jsx`:

```jsx
import { Link } from 'react-router-dom'
import styles from './PostNav.module.css'

function PostNav({ prev, next }) {
  if (!prev && !next) return null

  return (
    <nav className={styles.nav} aria-label="Journal entries">
      {prev ? (
        <Link to={`/journal/${prev.slug}`} className={`${styles.link} ${styles.prev}`}>
          <span className={styles.dir}>← Newer</span>
          <span className={styles.title}>{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link to={`/journal/${next.slug}`} className={`${styles.link} ${styles.next}`}>
          <span className={styles.dir}>Older →</span>
          <span className={styles.title}>{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}

export default PostNav
```

- [ ] **Step 4: Write the stylesheet**

Create `src/components/PostNav/PostNav.module.css`:

```css
.nav {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--bg-peach);
}

.link {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-decoration: none;
  max-width: 48%;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  transition: background 0.2s ease;
}

.link:hover {
  background: var(--card-bg);
}

.link:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.next {
  text-align: right;
  margin-left: auto;
}

.dir {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--primary);
}

.title {
  color: var(--text-primary);
  font-weight: 600;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:run -- src/components/PostNav/PostNav.test.jsx`
Expected: PASS (3 cases).

- [ ] **Step 6: Commit**

```bash
git add src/components/PostNav/
git commit -m "feat: add prev/next post navigation"
```

---

## Task 11: ShareLink component (TDD)

**Files:**
- Create: `src/components/ShareLink/ShareLink.jsx`
- Create: `src/components/ShareLink/ShareLink.module.css`
- Test: `src/components/ShareLink/ShareLink.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/ShareLink/ShareLink.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ShareLink from './ShareLink'

describe('ShareLink', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it('renders a copy-link button', () => {
    render(<ShareLink />)
    expect(screen.getByRole('button', { name: /copy link/i })).toBeInTheDocument()
  })

  it('copies the current URL and confirms', async () => {
    const user = userEvent.setup()
    render(<ShareLink />)
    await user.click(screen.getByRole('button', { name: /copy link/i }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href)
    expect(await screen.findByText(/copied/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/components/ShareLink/ShareLink.test.jsx`
Expected: FAIL — cannot resolve `./ShareLink`.

- [ ] **Step 3: Write the component**

Create `src/components/ShareLink/ShareLink.jsx`:

```jsx
import { useState } from 'react'
import styles from './ShareLink.module.css'

function ShareLink() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.button} onClick={handleCopy}>
        Copy link
      </button>
      <span className={styles.status} role="status" aria-live="polite">
        {copied ? 'Copied' : ''}
      </span>
    </div>
  )
}

export default ShareLink
```

- [ ] **Step 4: Write the stylesheet**

Create `src/components/ShareLink/ShareLink.module.css`:

```css
.wrap {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.button {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--primary);
  background: transparent;
  border: 1px solid var(--accent-honey);
  border-radius: var(--radius-lg);
  padding: 6px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.button:hover {
  background: var(--bg-peach);
}

.button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.status {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-muted);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:run -- src/components/ShareLink/ShareLink.test.jsx`
Expected: PASS (2 cases).

- [ ] **Step 6: Commit**

```bash
git add src/components/ShareLink/
git commit -m "feat: add copy-link share button"
```

---

## Task 12: TableOfContents component

**Files:**
- Create: `src/components/TableOfContents/TableOfContents.jsx`
- Create: `src/components/TableOfContents/TableOfContents.module.css`

This component reads rendered headings from the article DOM, so it is integration-tested via the post page (Task 13) rather than in isolation.

- [ ] **Step 1: Write the component**

Create `src/components/TableOfContents/TableOfContents.jsx`:

```jsx
import { useEffect, useState } from 'react'
import styles from './TableOfContents.module.css'

const MIN_HEADINGS = 3

function TableOfContents({ articleRef }) {
  const [headings, setHeadings] = useState([])

  useEffect(() => {
    const root = articleRef.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll('h2[id], h3[id]'))
    setHeadings(
      nodes.map((node) => ({
        id: node.id,
        text: node.textContent,
        level: Number(node.tagName.substring(1)),
      }))
    )
  }, [articleRef])

  if (headings.length < MIN_HEADINGS) return null

  return (
    <nav className={styles.toc} aria-label="On this page">
      <p className={styles.heading}>On this page</p>
      <ul className={styles.list}>
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? styles.sub : undefined}>
            <a href={`#${h.id}`} className={styles.link}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TableOfContents
```

- [ ] **Step 2: Write the stylesheet**

Create `src/components/TableOfContents/TableOfContents.module.css`:

```css
.toc {
  display: none;
}

.heading {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: var(--spacing-sm);
}

.list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.sub {
  padding-left: var(--spacing-md);
}

.link {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.88rem;
}

.link:hover {
  color: var(--primary);
}

.link:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

@media (min-width: 1024px) {
  .toc {
    display: block;
    position: sticky;
    top: calc(var(--header-height) + var(--spacing-lg));
    align-self: start;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/TableOfContents/
git commit -m "feat: add auto table of contents for posts"
```

---

## Task 13: JournalPost reader page (TDD) + routes

**Files:**
- Create: `src/pages/JournalPost/JournalPost.jsx`
- Create: `src/pages/JournalPost/JournalPost.module.css`
- Test: `src/pages/JournalPost/JournalPost.test.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/JournalPost/JournalPost.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'

vi.mock('../../data/journal', () => ({
  getPostBySlug: vi.fn(),
  getAdjacentPosts: vi.fn(() => ({ prev: null, next: null })),
}))

import { getPostBySlug, getAdjacentPosts } from '../../data/journal'
import JournalPost from './JournalPost'

function renderAt(slug) {
  return render(
    <MemoryRouter initialEntries={[`/journal/${slug}`]}>
      <Routes>
        <Route path="/journal/:slug" element={<JournalPost />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('JournalPost', () => {
  it('renders the post title, meta, and body', () => {
    getPostBySlug.mockReturnValue({
      slug: 'a',
      title: 'Post A',
      date: '2026-06-05',
      summary: 'Sum',
      tags: ['x'],
      readTime: 4,
      Component: () => <p>Body content here</p>,
    })
    getAdjacentPosts.mockReturnValue({ prev: null, next: { slug: 'b', title: 'Post B' } })
    renderAt('a')
    expect(screen.getByRole('heading', { level: 1, name: 'Post A' })).toBeInTheDocument()
    expect(screen.getByText('Body content here')).toBeInTheDocument()
    expect(screen.getByText(/4 min read/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /post b/i })).toHaveAttribute('href', '/journal/b')
  })

  it('renders a not-found state for an unknown slug', () => {
    getPostBySlug.mockReturnValue(undefined)
    renderAt('missing')
    expect(screen.getByText(/drifted away/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /journal/i })).toHaveAttribute('href', '/journal')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/pages/JournalPost/JournalPost.test.jsx`
Expected: FAIL — cannot resolve `./JournalPost`.

- [ ] **Step 3: Write the page**

Create `src/pages/JournalPost/JournalPost.jsx`:

```jsx
import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import PostNav from '../../components/PostNav/PostNav'
import ReadingProgress from '../../components/ReadingProgress/ReadingProgress'
import ShareLink from '../../components/ShareLink/ShareLink'
import TableOfContents from '../../components/TableOfContents/TableOfContents'
import { mdxComponents } from '../../components/MdxContent/mdxComponents'
import { JOURNAL_NOT_FOUND } from '../../config/brand'
import { getAdjacentPosts, getPostBySlug } from '../../data/journal'
import styles from './JournalPost.module.css'

function formatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function JournalPost() {
  const { slug } = useParams()
  const articleRef = useRef(null)
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <div className={styles.notFound}>
        <p>{JOURNAL_NOT_FOUND}</p>
        <Link to="/journal" className={styles.back}>
          ← Back to the Journal
        </Link>
      </div>
    )
  }

  const { prev, next } = getAdjacentPosts(slug)
  const Body = post.Component

  return (
    <>
      <ReadingProgress />
      <div className={styles.layout}>
        <div className={styles.main}>
          <Link to="/journal" className={styles.back}>
            ← Back to Journal
          </Link>
          <article ref={articleRef} className={styles.article}>
            <header className={styles.header}>
              <h1 className={styles.title}>{post.title}</h1>
              <p className={styles.meta}>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true"> · </span>
                <span>{post.readTime} min read</span>
              </p>
              {post.tags.length > 0 && (
                <ul className={styles.tags}>
                  {post.tags.map((tag) => (
                    <li key={tag} className={styles.tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </header>
            <div className={styles.body}>
              <MDXProvider components={mdxComponents}>
                <Body />
              </MDXProvider>
            </div>
          </article>
          <footer className={styles.footer}>
            <ShareLink />
            <PostNav prev={prev} next={next} />
          </footer>
        </div>
        <aside className={styles.aside}>
          <TableOfContents articleRef={articleRef} />
        </aside>
      </div>
    </>
  )
}

export default JournalPost
```

- [ ] **Step 4: Write the stylesheet**

Create `src/pages/JournalPost/JournalPost.module.css`:

```css
.layout {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-lg);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
}

.main {
  min-width: 0;
}

.back {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--primary);
  text-decoration: none;
  margin-bottom: var(--spacing-lg);
}

.back:hover {
  text-decoration: underline;
}

.back:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.article {
  max-width: 65ch;
}

.header {
  margin-bottom: var(--spacing-xl);
}

.title {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 5vw, 2.6rem);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.meta {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--text-muted);
}

.tags {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  padding: 0;
  margin-top: var(--spacing-sm);
}

.tag {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--primary);
  background: var(--bg-peach);
  padding: 2px 10px;
  border-radius: var(--radius-lg);
}

.footer {
  max-width: 65ch;
  margin-top: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.notFound {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-lg);
  text-align: center;
  color: var(--text-muted);
}

.notFound .back {
  margin-top: var(--spacing-md);
}

@media (min-width: 1024px) {
  .layout {
    grid-template-columns: minmax(0, 1fr) 220px;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:run -- src/pages/JournalPost/JournalPost.test.jsx`
Expected: PASS (2 cases).

- [ ] **Step 6: Register routes**

Replace the full contents of `src/App.jsx` with:

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Home from './components/Home/Home'
import GalleryPage from './pages/Gallery/Gallery'
import JournalPage from './pages/Journal/Journal'
import JournalPost from './pages/JournalPost/JournalPost'
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
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/journal/:slug" element={<JournalPost />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
```

- [ ] **Step 7: Commit**

```bash
git add src/pages/JournalPost/ src/App.jsx
git commit -m "feat: add Journal post reader page and routes"
```

---

## Task 14: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm run test:run`
Expected: PASS — all suites (data layer, JournalInvite, Journal index, JournalPost, ReadingProgress, PostNav, ShareLink, plus existing Home/Hero/GalleryCard).

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors (warnings acceptable if pre-existing).

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build succeeds; MDX posts compiled in.

- [ ] **Step 4: Manual smoke test**

Run: `npm run dev`, then verify:
- Header shows Home · Gallery · Journal; Journal active state works.
- Home shows the Upstream invite between Recent specimens and About, no post previews, CTA → `/journal`.
- `/journal` shows the timeline with two entries, newest first; entry links work.
- `/journal/paged-at-3am` renders the article, progress bar fills on scroll, back-link works, ToC appears on wide screens, prev/next show, Copy link confirms "Copied".
- `/journal/does-not-exist` shows the not-found state with a link back.
- Resize to ~375px: timeline and reader remain readable; ToC hidden on mobile.

- [ ] **Step 5: Commit any fixups**

```bash
git add -A
git commit -m "test: verify Journal feature end-to-end"
```

(Skip this commit if nothing changed.)

---

## Self-Review Notes

- **Spec coverage:** nav entry (T5), routes (T13), frontmatter MDX + auto-discovery (T1/T3/T4), data API incl. read time + prev/next + drafts (T3), Home Upstream invite with dragon glyph and no previews (T7), "Upstream"/"The Climb" timeline + empty state (T8), reader with progress/back-link/ToC/prev-next/share (T9–T13), MDX styling incl. images & ink callouts (T6), tokens/a11y throughout, tests per surface (T3,T7,T8,T9,T10,T11,T13), verification (T14). All covered.
- **Naming consistency:** `getAllPosts`/`getPostBySlug`/`getAdjacentPosts`, `JOURNAL_*` constants, `slug`/`Component`/`readTime` used identically across data layer, pages, and tests.
- **No placeholders:** every code/test/CSS step contains complete content.
