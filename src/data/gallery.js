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
