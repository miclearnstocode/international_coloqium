import { PageDefinition } from './types';

export const homePage: PageDefinition = {
  slug: 'home',
  name: 'Home',
  path: '/',
  category: 'Home',
  status: 'Published',
  updated: 'Sep 16, 2025 10:24 AM',
  structure: [
    {
      section: 'Hero Section',
      fields: [
        { key: 'hero.welcome_badge', label: 'Welcome Badge', type: 'text', value: 'Welcome to' },
        { key: 'hero.title', label: 'Main Title', type: 'textarea', value: '3rd International Agri- Life & Bioresource Science Symposium' },
        { key: 'hero.subtitle', label: 'Subtitle', type: 'textarea', value: 'Converging Frontiers in Agri-Life and Bioresource Sciences' },
        { key: 'hero.description', label: 'Description', type: 'textarea', value: 'Science, Innovation & Collaboration for a Resilient and Sustainable Future' },
        { key: 'hero.event_date', label: 'Event Date', type: 'text', value: 'March 11-13, 2027' },
        { key: 'hero.event_location', label: 'Event Location', type: 'text', value: 'Roxas City, Capiz, Philippines' },
        { key: 'hero.cta_text', label: 'CTA Button Text', type: 'text', value: 'Learn More' },
      ],
    },
    {
      section: 'Countdown Section',
      fields: [
        { key: 'countdown.title', label: 'Section Title', type: 'text', value: 'SYMPOSIUM COUNTDOWN' },
        { key: 'countdown.event_date', label: 'Event Date', type: 'text', value: 'March 11-13, 2027' },
        { key: 'countdown.event_location', label: 'Event Location', type: 'text', value: 'Roxas City, Capiz Philippines' },
      ],
    },
  ],
};