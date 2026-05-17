# Gallery Update — Pomodoro, llm_rpg, RateMySoft — Design Spec

**Date:** 2026-05-17  
**Status:** Approved (brainstorming)  
**Scope:** Gallery data refresh (5 entries); `liveUrl` CTA on cards; home teaser shows first three shipped/repo apps

---

## Summary

Refresh `gallery.js` with five projects in a fixed order. **Pomodoro Roulette** is live (GitHub + Open app). **llm_rpg** and **RateMySoft** are **GitHub-only** (`shipped`, no `liveUrl`). **Weather or Not** and **Not-To-Do List** remain WIP placeholders, no longer on the home teaser. Extend `GalleryCard` to render **Open app** when `liveUrl` is set.

---

## Goals

| Goal | How |
|------|-----|
| Lead with real work | Pomodoro → llm_rpg → RateMySoft first |
| GitHub-only repos still count as shipped | `status: 'shipped'`, `githubUrl` set, `liveUrl: null`, no WIP badge |
| Home teaser stays tight | `featured: true` on first three only |
| Live demo where it exists | Pomodoro `liveUrl` + twin CTAs |
| Match Gatewood Lab voice | Playful taglines + `proves` (user-selected) |

## Non-goals

- Primary/secondary button styling for CTAs
- `embedUrl`, per-app detail routes, GitHub API
- Deploying llm_rpg or RateMySoft
- Rewriting Weather / Not-To-Do copy
- Removing Fufu/panda references inside RateMySoft repo README (portfolio card only)

---

## Gallery data (`src/data/gallery.js`)

### Remove

- Entire `gamble-gauge` object

### Entries (array order = grid order)

#### 1. Pomodoro Roulette

```js
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
}
```

#### 2. llm_rpg

```js
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
}
```

#### 3. RateMySoft

```js
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
}
```

#### 4–5. WIP placeholders (unchanged copy; `featured: false`)

- `weather-or-not` — keep existing fields; set `featured: false`
- `not-todo` — keep existing fields; set `featured: false`

### Display order summary

| # | `id` | `status` | `featured` | CTAs |
|---|------|----------|------------|------|
| 1 | `pomodoro-roulette` | `shipped` | `true` | Open app + GitHub |
| 2 | `llm-rpg` | `shipped` | `true` | GitHub only |
| 3 | `rate-my-soft` | `shipped` | `true` | GitHub only |
| 4 | `weather-or-not` | `wip` | `false` | Coming soon |
| 5 | `not-todo` | `wip` | `false` | Coming soon |

**Home teaser** (`getFeaturedItems`): cards `01`–`03` (Pomodoro, llm_rpg, RateMySoft).  
**`/gallery`**: all five in order; WIP badges on 4–5 only.

---

## `GalleryCard` behavior

### Fields used

`title`, `tagline`, `stack`, `proves`, `githubUrl`, `liveUrl`, `status`

### WIP badge

Shown only when `status === 'wip'`.

### Actions row (Approach 1 — twin text links)

| Condition | UI |
|-----------|-----|
| `liveUrl` set | Link: **Open app** → `liveUrl` |
| `githubUrl` set | Link: **View on GitHub** → `githubUrl` |
| Both set | Both links; **Open app** first, then GitHub |
| `githubUrl` only | GitHub only |
| Neither + `wip` | **Coming soon** |
| Neither + not `wip` | Empty actions |

### Link attributes

- `target="_blank"`
- `rel="noopener noreferrer"`
- `aria-label`: `Open ${title}` / `View ${title} on GitHub`

### CSS

- `.actions`: flex with `gap`; links wrap on narrow viewports
- Reuse existing `.link` for both CTAs

### Unchanged components

`GalleryGrid`, `GalleryTeaser`, `StackTags`, routes, brand config

---

## Tests (`GalleryCard.test.jsx`)

1. `liveUrl` + `githubUrl` → both links, correct `href`s, Open app before GitHub
2. `githubUrl` only (no `liveUrl`) → GitHub link only; no Open app
3. WIP without URLs → Coming soon
4. Existing displayIndex / heading tests remain passing

---

## Verification

- `npm test` passes
- Home `#work`: three cards, Pomodoro first, indices `01`–`03`, Pomodoro has both links; llm_rpg and RateMySoft GitHub only, no WIP badges
- `/gallery`: five cards; Weather and Not-To-Do at bottom with WIP badge and Coming soon

---

## Implementation touch list

| File | Change |
|------|--------|
| `src/data/gallery.js` | Five entries; order; featured flags; remove Gamble Gauge |
| `src/components/GalleryCard/GalleryCard.jsx` | `liveUrl` CTA |
| `src/components/GalleryCard/GalleryCard.module.css` | Actions flex/gap if needed |
| `src/components/GalleryCard/GalleryCard.test.jsx` | Live + GitHub-only cases |

---

## References

- https://pomodororoulette-production.up.railway.app/
- https://github.com/jc80800/pomodoro_roulette
- https://github.com/jc80800/llm_rpg
- https://github.com/jc80800/RateMySoft
- [2026-05-16-portfolio-rebrand-design.md](./2026-05-16-portfolio-rebrand-design.md)
