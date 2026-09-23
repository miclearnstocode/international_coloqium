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
      section: 'Announcement Card',
      fields: [
        { key: 'announcement_card.title', label: 'Card Title', type: 'textarea', value: '3rd International Agri-Life & Bioresource Science Symposium' },
        { key: 'announcement_card.description', label: 'Card Description', type: 'textarea', value: 'Join researchers, scientists, educators, students, industry partners, and institutional leaders from the Philippines and around the world for three days of scientific exchange, interdisciplinary dialogue, and international collaboration.' },
        { key: 'announcement_card.button_text', label: 'Button Text', type: 'text', value: 'View Event Details' },
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
    {
      section: 'About Card',
      fields: [
        { key: 'about_card.title', label: 'Card Title', type: 'text', value: 'ABOUT THE SYMPOSIUM' },
        { key: 'about_card.paragraph1', label: 'Paragraph 1', type: 'textarea', value: 'The 3rd International Agri-Life & Bioresource Sciences Symposium brings together researchers, faculty members, students, scientists, government representatives, industry partners, and other stakeholders from the Philippines and abroad.' },
        { key: 'about_card.paragraph2', label: 'Paragraph 2', type: 'textarea', value: 'Through research presentations, scientific discussions, and collaborative activities, the symposium provides a platform for sharing knowledge and advancing innovative and sustainable solutions in agriculture, life sciences, and bioresource sciences.' },
        { key: 'about_card.link_text', label: 'Link Text', type: 'text', value: 'Read More' },
      ],
    },
    {
      section: 'Attendees Card',
      fields: [
        { key: 'attendees_card.title', label: 'Card Title', type: 'text', value: 'WHO SHOULD ATTEND' },
        { key: 'attendees_card.description', label: 'Description', type: 'textarea', value: 'The symposium welcomes members of the academic, scientific, government, and industry communities who are interested in advancing research, innovation, and collaboration in agri-life and bioresource sciences.' },
        { key: 'attendees_card.link_text', label: 'Link Text', type: 'text', value: 'See Who Can Participate' },
      ],
      list: {
        key: 'attendees',
        label: 'Attendee List Items',
        items: [
          { text: 'Researchers & Scientists' },
          { text: 'Faculty & Educators' },
          { text: 'Graduate & Undergraduate Students' },
          { text: 'Government & Research Institutions' },
          { text: 'Industry & Development Partners' },
        ],
      },
    },
    {
      section: 'Announcements List',
      fields: [
        { key: 'announcements.title', label: 'Section Title', type: 'text', value: 'ANNOUNCEMENTS' },
      ],
      list: {
        key: 'announcements',
        label: 'Announcement Items',
        items: [
          { month: 'OCT', day: '05', category: 'CALL FOR ABSTRACTS', title: 'Abstract Submission Opens', description: 'The Call for Abstracts and symposium registration officially open on October 5, 2026.', link_text: 'View Call for Abstracts', link_url: '/abstract-submission' },
          { month: 'DEC', day: '18', category: 'REGISTRATION', title: 'Early Registration Deadline', description: 'Participants may avail themselves of the applicable early registration rate until December 18, 2026.', link_text: 'Registration Details', link_url: '/registration' },
          { month: 'JAN', day: '10', category: 'IMPORTANT', title: 'Abstract Submission Deadline', description: 'Authors must submit their abstracts through the official symposium portal on or before January 10, 2027.', link_text: 'Submit Abstract', link_url: '/abstract-submission' },
        ],
      },
    },
  ],
};