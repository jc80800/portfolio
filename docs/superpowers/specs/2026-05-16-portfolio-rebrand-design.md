# Gatewood Lab — Portfolio Rebrand Design Spec

**Date:** 2026-05-16  
**Status:** Approved (brainstorming)  
**Scope:** Rebrand from Fufu & Co. to Gatewood Lab; gallery-first portfolio with koi mascot

---

## Summary

Replace the Fufu & Co. brand with **Gatewood Lab** — a warm, craft-studio umbrella for rapidly shipped micro-apps. The site leads with **personality** (funny About, koi mascot) and proves **capabilities** through gallery cards (stack + what each app demonstrates). v1 uses GitHub link-out only; data model supports live URLs, embeds, and detail pages later.

---

## Goals

| Goal | How |
|------|-----|
| Drop Fufu branding entirely | New name, copy, assets, meta, package metadata |
| Stay comedic | User-written About; card taglines; mascot derp |
| Show engineering via work | Gallery cards: `stack` + `proves` fields |
| Ship micro-apps fast | Simple grid; add entries to data file |
| Modern, warm UI | Terracotta/cream palette; playful scroll/hover motion |
| Koi mascot | Chibi 锦鲤, nerd glasses + derpy face (see Mascot) |

## Non-goals (v1)

- Backend Handbook page
- Tech journey diagram
- Contact form / EmailJS modal
- Live embeds or per-app detail routes
- Dark mode
- GitHub API integration
- Chaos mode / Fufu easter eggs

---

## Brand

### Name

**Gatewood Lab** — warm/craft studio; subtle nod to 鲤鱼跃龙门 (dragon gate) without literal dragon mascot.

### Voice

- Playful, self-aware, not corporate
- Humor lives in About + card taglines; hero stays clear
- No “foolish ideas” / Fufu philosophy copy; fresh tone under Gatewood Lab

### Tagline (suggested, editable)

> “Small apps. Warm studio. Still swimming upstream.”

---

## Information architecture

| Route | Content |
|-------|---------|
| `/` | Hero → About (user copy) → Gallery teaser (2–3 featured) → Footer |
| `/gallery` | Full app grid |

### Header nav

- Home
- Gallery

### Footer

- GitHub, LinkedIn, email (icons only, no modal)
- © Gatewood Lab

### Removed routes/components

- `/handbook` and `BackendHandbook`
- `Contact` modal and `@emailjs/browser`
- Placeholder enterprise project cards
- All Fufu & Co. copy and bear assets

---

## Visual system

### Color tokens

| Token | Value | Use |
|-------|-------|-----|
| `--bg-cream` | `#FFF8F0` | Page background start |
| `--bg-peach` | `#FFE8D6` | Gradient end |
| `--primary` | `#C75B39` | Buttons, links |
| `--primary-light` | `#E07A4F` | Hover |
| `--accent-honey` | `#E8B86D` | Tags, highlights |
| `--text-primary` | `#2C2419` | Body |
| `--text-muted` | `#6B5E52` | Secondary |
| `--card-bg` | `#FFFCF8` | Cards |
| `--shadow-warm` | `rgba(44, 36, 25, 0.08)` | Elevation |

Background: cream → soft peach gradient (not bright Fufu yellow).

### Typography

- **Headings:** Nunito, Outfit, or DM Sans (pick one at implementation)
- **Body:** Inter (existing)
- **Stack tags:** monospace pill (`JetBrains Mono` or system mono)

### Motion

- Hero: title + koi entrance (fade/slide)
- Gallery: staggered card reveal on load/scroll
- Mascot: CSS hover — glasses slip, derpy eyes, tail wiggle
- Gallery page: koi “peeks” toward hovered card (decorative, non-blocking)
- `prefers-reduced-motion`: static mascot, no stagger

**Implementation preference:** CSS + `IntersectionObserver` first; add `motion` (Framer) only if needed.

---

## Mascot specification

**Character:** Chibi **锦鲤 (koi fish)** — must read clearly as koi (fan tail, fish body; optional barbels).

**Expression:** Inspired by nerd emoji (🤓) — round glasses — with **derpy face** (mismatched/crossed eyes, goofy mouth).

**Role:** Gatewood Lab studio mascot; appears in header mark, hero, optional gallery reactions.

**Assets to create**

1. Logo mark — koi portrait, 32–48px favicon-safe
2. Hero illustration — transparent PNG or SVG, ~400px
3. (v1.1) Reaction variants or SVG layers for eyes/glasses

**Lore (optional copy):** “Still swimming toward the dragon gate” — ties gallery growth to 鲤鱼跃龙门; mascot remains koi, not dragon.

**Explicitly not:** bear, Fufu reskin, generic blob, full dragon form.

---

## Gallery data model

**Source:** `src/data/gallery.js` (or JSON imported in JS).

```js
{
  id: "weather-gamble",
  title: "Should I Bring an Umbrella?",
  tagline: "Weather meets questionable life choices",
  description: "Optional longer blurb for card or future detail page",
  stack: ["Go", "React"],
  proves: "API integration, fast UI polish",
  githubUrl: "https://github.com/...",
  liveUrl: null,
  embedUrl: null,
  slug: null,
  featured: true,
  tags: ["weather", "fun"],
  status: "shipped" // shipped | wip | archived
}
```

### v1 card behavior

- Display: `title`, `tagline`, `stack` pills, `proves`, status badge if `wip`
- Primary CTA: link to `githubUrl` (“View on GitHub”)
- Hide GitHub CTA if `githubUrl` is null; show “Coming soon” for `wip`

### Future extensions (no schema break)

- `liveUrl` → second CTA “Open app”
- `embedUrl` + `DemoEmbed` component
- `slug` + route `/apps/:slug` for case studies

### Launch content

Start with 2–3 entries (e.g. weather, gambling, not-to-do) — real repos or honest `wip` placeholders.

---

## Components

| Component | Responsibility |
|-----------|----------------|
| `src/config/brand.js` | `STUDIO_NAME = "Gatewood Lab"`, tagline constant |
| `Header` | Logo (koi mark) + studio name; nav Home, Gallery |
| `Footer` | Social icons only |
| `Hero` | Headline, subline, koi art, CTA → `/gallery` |
| `About` | User-provided funny copy; layout only |
| `GalleryTeaser` | Featured cards + “View Gallery” |
| `GalleryGrid` | Full `/gallery` grid |
| `GalleryCard` | Card UI, GitHub link, stack/proves |
| `KoiMascot` | Shared mascot with hover states |
| `StackTags` | Renders `stack[]` |
| `ErrorBoundary` | Updated fallback copy |

---

## Engineering

### Stack

- React 19, Vite, React Router (existing)
- CSS Modules + global CSS variables
- Remove EmailJS dependency when Contact is deleted

### Performance

- Lazy-load below-fold images; hero mascot `fetchpriority="high"`
- No iframes in v1
- Target Lighthouse performance ≥ 90

### Accessibility

- Mascot `alt`: descriptive (e.g. “Gatewood Lab koi mascot with glasses”)
- Card links: named CTAs, not whole-card-only click targets
- Visible focus rings; WCAG AA contrast on primary buttons

### SEO

Update `index.html`: title `Gatewood Lab`, description mentioning gallery + engineering; OG image = koi mark when available.

### Repo cleanup

- Rename `package.json` name/description/keywords
- Update README, CONTRIBUTING, LICENSE brand section (Fufu → Gatewood Lab / koi assets)
- Delete Fufu mascot files (`logo_200x200.png`, etc.) after koi assets added
- Rewrite `FEATURES.md` for new roadmap

---

## Testing

- Manual: both routes, mobile layout, external links, reduced-motion
- Optional: single RTL test for `GalleryCard` with fixture data

---

## Studio name decision

**Chosen:** Gatewood Lab  

Alternatives considered: Koi & Kettle, Warm Current Studio — not used.

---

## Implementation order (high level)

1. Brand constants + global CSS tokens
2. Remove Fufu routes/components/deps
3. Generate koi assets; wire favicon + header
4. Build `gallery` data + `GalleryCard` / `GalleryGrid`
5. Home: Hero, About shell, GalleryTeaser
6. `/gallery` page + routing
7. Footer social links
8. Motion + mascot hover polish
9. Meta/README/LICENSE sweep

---

## Open items for implementation plan

- User to supply About copy and initial gallery entries (titles, URLs)
- Final heading font choice (Nunito vs Outfit vs DM Sans)
- Generate koi mascot assets before UI polish pass
