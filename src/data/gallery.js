export const galleryItems = [
  {
    id: 'pomodoro-roulette',
    title: 'Pomodoro Roulette',
    tagline: 'Spin for focus length. Blame the wheel if you quit early.',
    description:
      'Random pomodoro duration between 5 and 45 minutes, spun from a small Go HTTP API.',
    stack: ['Go', 'Clerk', 'JavaScript'],
    githubUrl: 'https://github.com/jc80800/pomodoro_roulette',
    liveUrl: 'https://pomodororoulette-production.up.railway.app/',
    embedUrl: null,
    slug: null,
    featured: true,
    tags: ['productivity', 'fun'],
    status: 'shipped',
  },
  {
    id: 'peasants-in-the-shell',
    title: 'Peasants in the Shell',
    tagline: 'CRUD is boring. This terminal still won’t ship a live URL.',
    description:
      'Terminal idle RPG — gather grain and lumber, recruit peasants, and build your first structures.',
    stack: ['Go', 'Bubble Tea'],
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
    githubUrl: null,
    liveUrl: null,
    embedUrl: null,
    slug: null,
    featured: false,
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
