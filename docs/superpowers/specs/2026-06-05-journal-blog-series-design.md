# Journal — "The Road to Senior, One Incident at a Time" — Design Spec

**Date:** 2026-06-05  
**Status:** Approved (brainstorming)  
**Scope:** New `Journal` section — nav entry, MDX-backed blog series, `/journal` timeline index, `/journal/:slug` reader, and a themed "Upstream" invitation block on Home below Recent specimens.

---

## Summary

Add a blog series, **"The Road to Senior, One Incident at a Time"**, surfaced as a third nav item: **Journal**. Posts are authored as frontmatter-driven **MDX** files, auto-discovered at build time. The Journal index (`/journal`) presents entries as a vertical **timeline** ("The Climb") under the page identity **"Upstream"**. Each post (`/journal/:slug`) is a centered long-form reader with reading progress, sticky back-link, auto table of contents, prev/next navigation, and a copy-link/share control. A new **Upstream invitation block** on Home — decorated with the koi→dragon (鲤跃龙门) ink language, no post previews — guides visitors to the series.

The thematic spine: the koi leaping the dragon gate to become a dragon = a junior engineer's climb to senior. This ties the new section to the existing brand (`STUDIO_NAME`, "still swimming upstream") rather than bolting on a generic blog.

---

## Goals

| Goal | How |
|------|-----|
| Add Journal as a first-class section | Third `NavLink` (Home · Gallery · Journal); routes `/journal`, `/journal/:slug` |
| Author prose without touching code | Frontmatter MDX in `src/content/journal/`, auto-discovered via `import.meta.glob` |
| Support images now, rich components later | MDX + `remark-gfm`; React components droppable inline when needed |
| Reinforce the growth narrative | "Upstream" identity, "The Climb" timeline, dragon-gate ink motifs |
| Guide Home visitors to the series | Decorated, text-forward invitation block below Recent specimens |
| Stay on-brand and on-system | Existing CSS tokens, fonts, `useInView`/`.reveal`, CSS-module structure |

## Non-goals

- Comments, reactions, RSS/Atom feeds, newsletter capture
- Tag filtering / search / pagination (single chronological list for now)
- A CMS or runtime content fetching (build-time only)
- Author profiles or multi-author support
- Per-post Open Graph image generation (uses existing site OG image)

---

## Approach decision

**Selected: Frontmatter-driven, auto-discovered MDX (Approach A).**

- One `.mdx` file per post = one source of truth; adding a post never edits code.
- Rejected B (explicit `journal.js` index + body files): two places to update, drift risk.
- Rejected C (runtime `react-markdown`): contradicts the MDX decision; blocks inline components.

---

## Dependencies (`package.json` + `vite.config.js`)

Add (dev/build):

- `@mdx-js/rollup` — compile MDX at build time via Vite
- `@mdx-js/react` — `MDXProvider` for mapping MDX elements to styled components
- `remark-gfm` — tables, strikethrough, task lists, autolinks
- `remark-frontmatter` — parse YAML frontmatter block
- `remark-mdx-frontmatter` — export frontmatter as a named `frontmatter` export

`vite.config.js`: register `@mdx-js/rollup` **before** `@vitejs/plugin-react`, with
`remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: 'frontmatter' }], remarkGfm]`.
No runtime markdown parser ships to the client.

---

## Content model

Location: `src/content/journal/`  
Filename convention: `YYYY-MM-DD-<kebab-slug>.mdx` (date prefix sorts files on disk; slug is derived by stripping the date prefix and extension).

Frontmatter contract:

```mdx
---
title: "Paged at 3AM: My First Real Incident"
date: "2026-06-05"
summary: "What a flapping health check taught me about humility."
tags: ["incidents", "oncall"]
published: true
---

Body in Markdown. Drop a React component inline when something needs to be fancy.
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | Post + index display |
| `date` | string (ISO `YYYY-MM-DD`) | yes | Sort key; rendered in a `<time>` |
| `summary` | string | yes | One-line excerpt on timeline + meta description |
| `tags` | string[] | no | Defaults to `[]` |
| `published` | boolean | no | Defaults to `true`; `false` = draft |

---

## Data layer (`src/data/journal.js`)

Mirrors the gallery data API.

- Discover compiled modules: `import.meta.glob('../content/journal/*.mdx', { eager: true })` → `frontmatter` + default `Component`.
- Discover raw source for word counts: a parallel `import.meta.glob('../content/journal/*.mdx', { eager: true, query: '?raw', import: 'default' })` keyed by the same path. The frontmatter block is stripped before counting.
- For each module, build a `post` object:
  - `slug` — filename minus `YYYY-MM-DD-` prefix and `.mdx`
  - `title`, `date`, `summary`, `tags`, `published` — from `module.frontmatter`
  - `readTime` — `Math.max(1, Math.round(wordCount / 200))` minutes, where `wordCount` comes from the raw source (frontmatter removed, whitespace-split)
  - `Component` — `module.default` (the MDX component)
- Helpers:
  - `getAllPosts()` → published posts (in production), newest `date` first; ties broken by slug. In dev (`import.meta.env.DEV`), drafts are included and visually marked.
  - `getPostBySlug(slug)` → single post or `undefined`
  - `getAdjacentPosts(slug)` → `{ prev, next }` within `getAllPosts()` order (newer = `prev`, older = `next`)
- Validation: a post missing `title`/`date`/`summary` throws at build with a clear message naming the file.

---

## Routing & navigation

`src/App.jsx` — add routes:

- `/journal` → `pages/Journal/Journal.jsx`
- `/journal/:slug` → `pages/JournalPost/JournalPost.jsx`
- Unknown slug (no matching post) → themed not-found state rendered inside `JournalPost` (not a separate route): "This entry drifted away…" + link back to `/journal`.

`src/components/Header/Header.jsx` — add a third `NavLink` after Gallery:

```jsx
<li>
  <NavLink to="/journal" className={/* same active pattern */}>
    Journal
  </NavLink>
</li>
```

Order: **Home · Gallery · Journal**. Reuses the existing `active`/`navLink` class logic verbatim.

---

## UI Surface 1 — Home "Upstream" invitation block

**File:** `src/components/JournalInvite/JournalInvite.jsx` (+ `.module.css`)  
**Placement:** `Home.jsx`, between `<GalleryTeaser />` and `<About />`.

- **Form:** full-width calm band on the cream/peach gradient — deliberately **not** a card grid, to contrast with the gallery teaser directly above. **No post previews.**
- **Decoration:** oversized faint calligraphy glyph **龙** (dragon — the koi's destination) as an `aria-hidden` background watermark, echoing the hero's `calligraphyMain`/`calligraphyAccent` ink treatment.
- **Content hierarchy:**
  - Eyebrow: `JOURNAL_EYEBROW` → "The Journal"
  - Headline: `JOURNAL_SERIES_TITLE` → "The Road to Senior, One Incident at a Time"
  - Description: `JOURNAL_INVITE_BODY` → one line framing the series as the climb toward senior
  - CTA: `JOURNAL_INVITE_CTA` → "Follow the climb" rendered as `Follow the climb →`, `Link` to `/journal`
- **Motion:** `useInView` + `.reveal`/`.reveal--visible` fade-up; honors `prefers-reduced-motion`.
- **Why:** themed (carp→dragon = junior→senior), text-forward, rhythmically distinct from the grid above.

---

## UI Surface 2 — Journal index `/journal` ("Upstream" / "The Climb")

**File:** `src/pages/Journal/Journal.jsx` (+ `.module.css`)

- **Header:** mirrors `Gallery.jsx` structure — `KoiMascot` block + eyebrow **"Upstream"** (`JOURNAL_EYEBROW_PAGE`) + series title as subtitle (`JOURNAL_SERIES_TITLE`).
- **Body — vertical timeline ("The Climb"):**
  - A subtle vertical "ink current" line runs down one side (rendered via CSS pseudo-element, `aria-hidden`).
  - Each entry is a node: small ink/koi dot marker + **date · read time** (in a `<time>`), **title** (`Link` to `/journal/:slug`), one-line **summary**, **tags** (reusing the visual language of `StackTags` where it fits, or a lightweight tag pill).
  - Newest at top.
  - Entries fade up on scroll via `useInView`/`.reveal`.
- **States:**
  - **Empty** (no published posts): "The first entry is still swimming upstream…" with koi mascot, no broken timeline.
  - **Draft marker** (dev only): drafts show a small "Draft" pill.
- **Responsive:** timeline line hugs the left edge at ~375px; opens with more horizontal breathing room at ≥768px/desktop. Flexible widths, no fixed pixel content widths.

---

## UI Surface 3 — Journal post `/journal/:slug`

**File:** `src/pages/JournalPost/JournalPost.jsx` (+ `.module.css`)  
Supporting components (each own folder + `.module.css`):

- `ReadingProgress` — thin top ink line, width driven by scroll fraction; `aria-hidden`, pointer-events none; disabled under reduced-motion (or jumps without transition).
- `TableOfContents` — built from `h2`/`h3` in the rendered post; hidden on mobile and when fewer than ~3 headings; current-section highlight via `IntersectionObserver`. Rendered as `<nav aria-label="On this page">`.
- `PostNav` — prev/next footer cards from `getAdjacentPosts(slug)`; omits a side when absent.
- `ShareLink` — copy-current-URL button with transient "Copied" confirmation (`aria-live="polite"`).

**Layout:**

- Sticky **"← Back to Journal"** breadcrumb (`Link` to `/journal`).
- `<article>`: header (title `h1`, `<time>` date, read time, tags), then MDX body in a centered column, ~65ch measure.
- Typography: Outfit headings, Inter body, JetBrains Mono code — existing fonts/tokens.
- Footer: `ShareLink` + `PostNav`.

**MDX element styling** via `MDXProvider` components map + a scoped post stylesheet:

- Headings (with anchor ids for the ToC), paragraphs, lists
- Blockquotes styled as **ink callouts**
- `pre`/`code` blocks (warm card background, mono font, horizontal scroll)
- Images: rounded corners, soft `--shadow-md`, `max-width: 100%`, responsive; require meaningful `alt`
- Links: themed, accessible focus state; external links get `target="_blank"` + `rel="noopener noreferrer"`

**Not-found:** if `getPostBySlug` returns `undefined`, render themed "This entry drifted away…" + link back to `/journal` (HTTP-agnostic SPA fallback).

---

## Brand copy (`src/config/brand.js`)

New constants (final wording may be refined during implementation):

```js
export const JOURNAL_NAV_LABEL = 'Journal'
export const JOURNAL_SERIES_TITLE = 'The Road to Senior, One Incident at a Time'
export const JOURNAL_EYEBROW = 'The Journal'          // Home invite eyebrow
export const JOURNAL_EYEBROW_PAGE = 'Upstream'         // /journal page eyebrow
export const JOURNAL_INVITE_BODY =
  'A running series on the climb from mid-level to senior — one incident, postmortem, and hard-won lesson at a time.'
export const JOURNAL_INVITE_CTA = 'Follow the climb'
export const JOURNAL_EMPTY = 'The first entry is still swimming upstream…'
export const JOURNAL_NOT_FOUND = 'This entry drifted away…'
```

---

## Theming & accessibility

- **Tokens only** — reuse existing CSS variables (`--primary`, `--bg-*`, spacing, radii, shadows), fonts, and the `.reveal` motion utility. No new hex values or one-off spacing.
- Each component/page gets its own `.module.css`, matching current structure.
- Semantic HTML: `article`, `nav`, `time`, real `button`/`a`; headings in order.
- Visible focus states on every interactive element; decorative glyphs/lines `aria-hidden`; meaningful `alt` on post images.
- Contrast kept within the established warm palette; meaning never conveyed by color alone (draft pill has text, not just color).
- `prefers-reduced-motion` respected by reveal, reading progress, and any koi drift.
- Responsive sanity at ~375 / 768 / 1024 / desktop; empty/draft/not-found states all handled.

---

## Testing (Vitest + Testing Library)

Match existing `Home.test.jsx` / `GalleryCard.test.jsx` style.

1. **Data layer** (`journal.js`): slug derivation strips date prefix; `getAllPosts` sorts newest-first and excludes drafts in prod; `getAdjacentPosts` returns correct prev/next at ends and middle.
2. **JournalInvite**: renders eyebrow, series title, body, and CTA linking to `/journal`; no post content rendered.
3. **Journal index**: renders entries (title links, dates, summaries, tags); renders empty state when no posts.
4. **JournalPost**: renders MDX body + meta; prev/next reflect adjacency; unknown slug → not-found message + back link.
5. Header renders the Journal nav link to `/journal`; existing Home/Header/Gallery tests still pass.

(MDX modules are mocked in unit tests; a small fixture post can back integration-style tests.)

---

## Verification

- `npm run dev` and `npm run build` succeed with MDX wired in.
- `npm test` passes (new + existing).
- Header shows Home · Gallery · Journal; Journal route active state works.
- Home shows the Upstream invite block between Recent specimens and About; CTA → `/journal`; no post previews.
- `/journal` renders the timeline (or empty state); entries link to posts.
- `/journal/:slug` renders a post with progress bar, back-link, ToC (long posts), prev/next, share; unknown slug shows not-found.
- Responsive + reduced-motion + keyboard focus all behave.

---

## Implementation touch list

| File | Change |
|------|--------|
| `package.json` | Add MDX + remark deps |
| `vite.config.js` | Register `@mdx-js/rollup` + remark plugins before React plugin |
| `src/content/journal/*.mdx` | New post files (incl. one seed/fixture post) |
| `src/data/journal.js` | Discovery, metadata, `readTime`, `getAllPosts`/`getPostBySlug`/`getAdjacentPosts` |
| `src/App.jsx` | Routes `/journal`, `/journal/:slug` |
| `src/components/Header/Header.jsx` | Journal `NavLink` |
| `src/components/JournalInvite/` | Home invitation block (jsx + module.css) |
| `src/pages/Journal/` | Timeline index (jsx + module.css) |
| `src/pages/JournalPost/` | Post reader (jsx + module.css) |
| `src/components/ReadingProgress/` | Scroll progress line |
| `src/components/TableOfContents/` | Auto ToC |
| `src/components/PostNav/` | Prev/next |
| `src/components/ShareLink/` | Copy-link button |
| `src/components/Home/Home.jsx` | Insert `<JournalInvite />` after `<GalleryTeaser />` |
| `src/config/brand.js` | `JOURNAL_*` constants |
| Tests | Data layer, JournalInvite, index, post, header |

---

## References

- Brand spine: 鲤跃龙门 (koi leaps the dragon gate → becomes a dragon)
- [2026-05-16-portfolio-rebrand-design.md](./2026-05-16-portfolio-rebrand-design.md)
- [2026-05-17-home-composition-pass-design.md](./2026-05-17-home-composition-pass-design.md)
- [2026-05-17-pomodoro-roulette-gallery-card-design.md](./2026-05-17-pomodoro-roulette-gallery-card-design.md)
