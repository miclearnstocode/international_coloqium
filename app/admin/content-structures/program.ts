import { PageDefinition } from './types';

export const programPage: PageDefinition = {
  slug: 'program',
  name: 'Program',
  path: '/program',
  category: 'Program',
  status: 'Published',
  updated: 'Sep 15, 2025 03:45 PM',
  structure: [
    //  PAGE HERO 
    {
      section: 'Page Hero',
      fields: [
        { key: 'hero.breadcrumb_home', label: 'Breadcrumb Home Text', type: 'text', placeholder: 'Home' },
        { key: 'hero.breadcrumb_current', label: 'Breadcrumb Current Text', type: 'text', placeholder: 'Program' },
        { key: 'hero.title', label: 'Hero Title', type: 'text', placeholder: 'Symposium Program' },
        {
          key: 'hero.description',
          label: 'Hero Description',
          type: 'textarea',
          placeholder: 'The symposium will be conducted face-to-face and will combine keynote and plenary presentations, technical sessions, panel discussions, oral and poster research presentations, networking opportunities, collaborative activities, and cultural experiences.',
        },
        { key: 'hero.background_image', label: 'Background Image', type: 'image', placeholder: '/images/globe.jpg' },
      ],
    },

    //  KEY DATES HEADER 
    {
      section: 'Key Dates Header',
      fields: [
        { key: 'key_dates.title', label: 'Section Title', type: 'text', placeholder: 'Key Dates' },
        {
          key: 'key_dates.description',
          label: 'Section Description',
          type: 'text',
          placeholder: 'Mark your calendars with these important deadlines for the 3rd International Agri-Life & Bioresource Science Symposium',
        },
        { key: 'key_dates.footer_note', label: 'Footer Note', type: 'text', placeholder: 'All deadlines are at 11:59 PM (UTC+8)' },
      ],
    },

    //  KEY DATES TABLE 
    {
      section: 'Key Dates Table',
      fields: [],
      list: {
        key: 'key_dates_items',
        label: 'Key Date Entries',
        items: [
          { date: '', event: '', description: '', icon: 'rocket' },
          { date: '', event: '', description: '', icon: 'file' },
          { date: '', event: '', description: '', icon: 'file' },
          { date: '', event: '', description: '', icon: 'bell' },
          { date: '', event: '', description: '', icon: 'calendar-check' },
          { date: '', event: '', description: '', icon: 'envelope' },
          { date: '', event: '', description: '', icon: 'edit' },
          { date: '', event: '', description: '', icon: 'book' },
          { date: '', event: '', description: '', icon: 'pen' },
          { date: '', event: '', description: '', icon: 'print' },
          { date: '', event: '', description: '', icon: 'calendar' },
        ],
      },
    },

    //  PROGRAM AT A GLANCE 
    {
      section: 'Program At A Glance',
      fields: [
        { key: 'glance.title', label: 'Section Title', type: 'text', placeholder: 'Program At A Glance' },
      ],
      list: {
        key: 'glance_items',
        label: 'Glance Stats',
        items: [
          { value: '', label: '', icon: 'users' },
          { value: '', label: '', icon: 'microphone' },
          { value: '', label: '', icon: 'graduation' },
          { value: '', label: '', icon: 'comments' },
          { value: '', label: '', icon: 'bullhorn' },
        ],
      },
    },

    //  DAY TABS LABELS 
    {
      section: 'Day Tabs',
      fields: [
        { key: 'day_tabs.day1_label', label: 'Day 1 Label', type: 'text', placeholder: 'DAY 1' },
        { key: 'day_tabs.day1_date', label: 'Day 1 Date', type: 'text', placeholder: 'March 11, 2027' },
        { key: 'day_tabs.day2_label', label: 'Day 2 Label', type: 'text', placeholder: 'DAY 2' },
        { key: 'day_tabs.day2_date', label: 'Day 2 Date', type: 'text', placeholder: 'March 12, 2027' },
        { key: 'day_tabs.day3_label', label: 'Day 3 Label', type: 'text', placeholder: 'DAY 3' },
        { key: 'day_tabs.day3_date', label: 'Day 3 Date', type: 'text', placeholder: 'March 13, 2027' },
      ],
    },

    //  DAY 1 SCHEDULE (EMPTY) 
    {
      section: 'Day 1 Schedule',
      fields: [],
      list: {
        key: 'day1_schedule',
        label: 'Day 1 Sessions',
        items: [], 
      },
    },

    //  DAY 2 SCHEDULE (EMPTY) 
    {
      section: 'Day 2 Schedule',
      fields: [],
      list: {
        key: 'day2_schedule',
        label: 'Day 2 Sessions',
        items: [], 
      },
    },

    //  DAY 3 SCHEDULE (EMPTY) 
    {
      section: 'Day 3 Schedule',
      fields: [],
      list: {
        key: 'day3_schedule',
        label: 'Day 3 Sessions',
        items: [], 
      },
    },

    //  DOWNLOAD CTA 
    {
      section: 'Download CTA',
      fields: [
        { key: 'download.title', label: 'CTA Title', type: 'text', placeholder: 'Download Program' },
        {
          key: 'download.description',
          label: 'CTA Description',
          type: 'text',
          placeholder: 'Get the complete program schedule in PDF format.',
        },
        { key: 'download.button_text', label: 'Button Text', type: 'text', placeholder: 'DOWNLOAD FULL PROGRAM (PDF)' },
        { key: 'download.file_url', label: 'PDF File URL', type: 'url', placeholder: '/documents/program.pdf' },
        { key: 'download.cover_image', label: 'Program Cover Image', type: 'image', placeholder: '/program-cover.png' },
      ],
    },

    //  PROGRAM HIGHLIGHTS 
    {
      section: 'Program Highlights',
      fields: [
        { key: 'highlights.title', label: 'Section Title', type: 'text', placeholder: 'Program Highlights' },
        { key: 'highlights.image', label: 'Highlights Image', type: 'image', placeholder: '/conference-photo.jpg' },
      ],
      list: {
        key: 'highlights_items',
        label: 'Highlight Items',
        items: [
          { text: '' },
          { text: '' },
          { text: '' },
          { text: '' },
          { text: '' },
        ],
      },
    },
  ],
};