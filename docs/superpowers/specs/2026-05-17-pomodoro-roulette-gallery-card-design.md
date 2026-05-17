# Pomodoro Roulette Gallery Card — Design Spec

**Date:** 2026-05-17  
**Status:** Approved (brainstorming)  
**Scope:** Replace Gamble Gauge with Pomodoro Roulette; add `liveUrl` CTA to gallery cards; reorder gallery so shipped work leads WIP entries

---

## Summary

Add **Pomodoro Roulette** as the first gallery entry (shipped, featured) with GitHub and live Railway links. Remove **Gamble Gauge**. Extend `GalleryCard` to render an **Open app** link when `liveUrl` is set, using twin text links (Approach 1).

---

## Goals

| Goal | How |
|------|-----|
| Showcase a real shipped app | `status: 'shipped'`, `liveUrl` + `githubUrl` populated |
| Lead with proof, not placeholders | Pomodoro first in `galleryItems`; WIP cards follow |
| Match Gatewood Lab voice | Playful tagline + `proves` line (user-selected copy) |
| Minimal UI change | Second link in existing `.actions` row; no card redesign |

## Non-goals

- Primary/secondary button styling for CTAs (future polish)
- `embedUrl`, per-app detail routes, GitHub API
- Changes to hero, About, nav, or mascot
- Editing Weather or Not / Not-To-Do copy or status

---

## Gallery data (`src/data/gallery.js`)

### Remove

- Entire `gamble-gauge` object

### Add (first in array)

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

### Display order (array index = grid order)

| # | `id` | `status` | `featured` |
|---|------|----------|------------|
| 1 | `pomodoro-roulette` | `shipped` | `true` |
| 2 | `weather-or-not` | `wip` | `true` |
| 3 | `not-todo` | `wip` | `true` |

Home teaser (`getFeaturedItems`) and `/gallery` both show three cards in this order. Card index labels (`01`, `02`, `03`) follow render order via existing `displayIndex` behavior.

---

## `GalleryCard` behavior

### Fields used

`title`, `tagline`, `stack`, `proves`, `githubUrl`, `liveUrl`, `status`

### WIP badge

Shown only when `status === 'wip'`. Pomodoro Roulette does not show a badge.

### Actions row (Approach 1 — twin text links)

| Condition | UI |
|-----------|-----|
| `liveUrl` set | Link: **Open app** → `liveUrl` |
| `githubUrl` set | Link: **View on GitHub** → `githubUrl` |
| Both set | Both links; **Open app** first, then GitHub |
| `liveUrl` only | Open app only |
| `githubUrl` only | GitHub only (current behavior) |
| Neither + `wip` | **Coming soon** |
| Neither + not `wip` | Empty actions (no new copy required for v1) |

### Link attributes

- `target="_blank"`
- `rel="noopener noreferrer"`
- `aria-label`: `Open ${title}` / `View ${title} on GitHub`

### CSS

- `.actions`: flex with `gap`; links wrap on narrow viewports
- Reuse existing `.link` class for both CTAs (no filled primary button in this change)

### Unchanged components

`GalleryGrid`, `GalleryTeaser`, `StackTags`, routes, brand config

---

## Tests (`GalleryCard.test.jsx`)

Add cases:

1. Item with `liveUrl` and `githubUrl` → both links visible with correct `href`s
2. Item with `liveUrl` only → Open app link; no GitHub link
3. Existing WIP / GitHub-only / displayIndex tests remain passing

Optional: assert link order in DOM (Open app before GitHub) if straightforward.

---

## Verification

- `npm test` — gallery card tests pass
- Manual: home `#work` teaser shows Pomodoro first, no WIP badge, both links work
- Manual: `/gallery` same order; Weather and Not-To-Do still show WIP badge and “Coming soon”

---

## Implementation touch list

| File | Change |
|------|--------|
| `src/data/gallery.js` | Remove Gamble Gauge; add Pomodoro first; reorder |
| `src/components/GalleryCard/GalleryCard.jsx` | Render `liveUrl` CTA |
| `src/components/GalleryCard/GalleryCard.module.css` | Actions flex/gap if needed |
| `src/components/GalleryCard/GalleryCard.test.jsx` | Live URL cases |

---

## References

- Live app: https://pomodororoulette-production.up.railway.app/
- Repo: https://github.com/jc80800/pomodoro_roulette
- Prior model: [2026-05-16-portfolio-rebrand-design.md](./2026-05-16-portfolio-rebrand-design.md) (`liveUrl` extension noted as Phase 3; implementing now for this card only)
