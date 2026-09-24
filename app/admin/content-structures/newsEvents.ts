import { PageDefinition } from './types';

export const newsEventsPage: PageDefinition = {
  slug: 'news-events',
  name: 'News & Events',
  path: '/news-events',
  category: 'Content',
  status: 'Published',
  updated: 'Sep 01, 2025 09:12 AM',
  structure: [
    {
      section: 'News & Events List',
      fields: [],
      list: {
        key: 'events',
        label: 'News & Events',
        items: [],
      },
    },
  ],
};