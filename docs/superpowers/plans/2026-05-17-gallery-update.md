# Gallery Update — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the gallery with Pomodoro Roulette (live + GitHub), llm_rpg and RateMySoft (GitHub-only shipped), WIP placeholders at the bottom off the home teaser, and an **Open app** CTA on cards when `liveUrl` is set.

**Architecture:** Data-driven gallery in `src/data/gallery.js`; `GalleryCard` gains conditional `liveUrl` link ahead of GitHub in the existing `.actions` row. Home teaser unchanged structurally — `getFeaturedItems()` returns three shipped entries. TDD on `GalleryCard` first, then replace gallery data.

**Tech Stack:** React 19, Vite 7, CSS Modules, Vitest, Testing Library

**Spec:** `docs/superpowers/specs/2026-05-17-pomodoro-roulette-gallery-card-design.md`

---

## File map

| Path | Action | Responsibility |
|------|--------|----------------|
| `src/components/GalleryCard/GalleryCard.test.jsx` | Modify | Tests for `liveUrl`, GitHub-only shipped |
| `src/components/GalleryCard/GalleryCard.jsx` | Modify | Render Open app + GitHub links |
| `src/components/GalleryCard/GalleryCard.module.css` | Modify | Flex/gap on `.actions` |
| `src/data/gallery.js` | Modify | Five entries, order, featured flags |

**Do not touch:** Hero, About copy, Header, `GalleryGrid` logic (already passes `displayIndex`), routes.

---

### Task 1: `GalleryCard` — failing tests for `liveUrl`

**Files:**
- Modify: `src/components/GalleryCard/GalleryCard.test.jsx`

- [ ] **Step 1: Add test fixtures and cases**

Append after existing `baseItem` (keep `baseItem` as GitHub-only shipped):

```jsx
const liveItem = {
  ...baseItem,
  id: 'pomodoro-roulette',
  title: 'Pomodoro Roulette',
  liveUrl: 'https://pomodororoulette-production.up.railway.app/',
  status: 'shipped',
}
```

Add tests:

```jsx
  it('shows Open app and GitHub links when both URLs are set', () => {
    render(<GalleryCard item={liveItem} />)
    const open = screen.getByRole('link', { name: /open pomodoro roulette/i })
    const github = screen.getByRole('link', { name: /view pomodoro roulette on github/i })
    expect(open).toHaveAttribute('href', liveItem.liveUrl)
    expect(github).toHaveAttribute('href', liveItem.githubUrl)
    expect(open.compareDocumentPosition(github) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('shows GitHub only when liveUrl is null', () => {
    render(<GalleryCard item={baseItem} />)
    expect(screen.getByRole('link', { name: /view test app on github/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /open test app/i })).not.toBeInTheDocument()
  })
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test:run -- src/components/GalleryCard/GalleryCard.test.jsx`

Expected: FAIL — Open app link not found (or `liveUrl` not destructured)

- [ ] **Step 3: Commit**

```bash
git add src/components/GalleryCard/GalleryCard.test.jsx
git commit -m "test: add GalleryCard liveUrl and GitHub-only cases"
```

---

### Task 2: `GalleryCard` — implement `liveUrl` CTA

**Files:**
- Modify: `src/components/GalleryCard/GalleryCard.jsx`
- Modify: `src/components/GalleryCard/GalleryCard.module.css`

- [ ] **Step 1: Update JSX**

Replace the component body destructuring and `.actions` block:

```jsx
function GalleryCard({ item, displayIndex, className = '', style }) {
  const { title, tagline, stack, proves, githubUrl, liveUrl, status } = item
  const isWip = status === 'wip'
  const showLive = Boolean(liveUrl)
  const showGithub = Boolean(githubUrl)
  const showSoon = !showLive && !showGithub && isWip

  return (
    <article className={`${styles.card} ${className}`.trim()} style={style}>
      {displayIndex != null && (
        <span className={styles.index} aria-hidden="true">
          {String(displayIndex).padStart(2, '0')}
        </span>
      )}
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
        {showLive && (
          <a
            className={styles.link}
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${title}`}
          >
            Open app
          </a>
        )}
        {showGithub && (
          <a
            className={styles.link}
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${title} on GitHub`}
          >
            View on GitHub
          </a>
        )}
        {showSoon && <span className={styles.soon}>Coming soon</span>}
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Update `.actions` CSS**

In `GalleryCard.module.css`, change `.actions` to:

```css
.actions {
  margin-top: var(--spacing-md);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  align-items: center;
}
```

- [ ] **Step 3: Run tests**

Run: `npm run test:run -- src/components/GalleryCard/GalleryCard.test.jsx`

Expected: PASS (all cases)

- [ ] **Step 4: Commit**

```bash
git add src/components/GalleryCard/GalleryCard.jsx src/components/GalleryCard/GalleryCard.module.css
git commit -m "feat: add Open app link when gallery liveUrl is set"
```

---

### Task 3: Replace `gallery.js` data

**Files:**
- Modify: `src/data/gallery.js`

- [ ] **Step 1: Replace entire `galleryItems` array**

```js
export const galleryItems = [
  {
    id: 'pomodoro-roulette',
    title: 'Pomodoro Roulette',
    tagline: 'Spin for focus length. Blame the wheel if you quit early.',
    description:
      'Random pomodoro duration between 5 and 45 minutes, spun from a small Go HTTP API.',
    stack: ['Go', 'Clerk', 'JavaScript'],
    proves: 'Small HTTP service, session tokens, honest WIP-to-shipped path',
    githubUrl: 'https://github.com/jc80800/pomodoro_roulette',
    liveUrl: 'https://pomodororoulette-production.up.railway.app/',
    embedUrl: null,
    slug: null,
    featured: true,
    tags: ['productivity', 'fun'],
    status: 'shipped',
  },
  {
    id: 'llm-rpg',
    title: 'llm_rpg',
    tagline: 'CRUD is boring. This terminal still won’t ship a live URL.',
    description:
      'Terminal RPG sandbox for hexagonal architecture, ports/adapters, and Bubble Tea UI experiments.',
    stack: ['Go', 'Bubble Tea'],
    proves: 'Domain boundaries, event-driven TUI, Go-only sandbox',
    githubUrl: 'https://github.com/jc80800/llm_rpg',
    liveUrl: null,
    embedUrl: null,
    slug: null,
    featured: true,
    tags: ['games', 'architecture'],
    status: 'shipped',
  },
  {
    id: 'rate-my-soft',
    title: 'RateMySoft',
    tagline: 'Software reviews, with a panda who takes this very seriously.',
    description:
      'Software review and discovery platform — browse categories, compare tools, read community reviews.',
    stack: ['Go', 'React'],
    proves: 'Echo backend, discovery UX, repo-ready product scaffold',
    githubUrl: 'https://github.com/jc80800/RateMySoft',
    liveUrl: null,
    embedUrl: null,
    slug: null,
    featured: true,
    tags: ['reviews', 'full-stack'],
    status: 'shipped',
  },
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
    featured: false,
    tags: ['weather', 'fun'],
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
    featured: false,
    tags: ['productivity', 'fun'],
    status: 'wip',
  },
]
```

Keep `getFeaturedItems` and `getAllItems` exports unchanged.

- [ ] **Step 2: Run full test suite**

Run: `npm run test:run`

Expected: PASS

- [ ] **Step 3: Manual smoke check**

Run: `npm run dev`

Verify:
- Home `#work`: Pomodoro, llm_rpg, RateMySoft — indices 01–03; Pomodoro has Open app + GitHub; others GitHub only; no WIP badges
- `/gallery`: five cards; Weather + Not-To-Do at bottom with WIP + Coming soon

- [ ] **Step 4: Commit**

```bash
git add src/data/gallery.js
git commit -m "feat: update gallery with Pomodoro, llm_rpg, and RateMySoft"
```

---

### Task 4: Commit plan doc (if not already committed)

- [ ] **Step 1: Commit plan**

```bash
git add docs/superpowers/plans/2026-05-17-gallery-update.md
git commit -m "docs: add gallery update implementation plan"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Remove Gamble Gauge | Task 3 |
| Pomodoro first, live + GitHub | Task 3 + Task 2 |
| llm_rpg + RateMySoft GitHub-only shipped | Task 3 |
| Order: Pomodoro → llm_rpg → RateMySoft → WIPs | Task 3 |
| Featured: first three only | Task 3 (`featured: false` on WIPs) |
| Open app before GitHub | Task 2 |
| Tests for dual + GitHub-only links | Task 1 |
| `.actions` flex/gap | Task 2 |

## Verification commands

```bash
npm run test:run
npm run lint
npm run build
```
