import { PageDefinition } from './types';

export const hotelMappingPage: PageDefinition = {
  slug: '/hotel-mapping',
  name: 'Hotel & Mapping',
  path: '/hotel-mapping',
  category: 'Hotel & Mapping',
  status: 'Published',
  updated: 'Sep 11, 2025 03:22 PM',
  structure: [
    // ============ PAGE HERO ============
    {
      section: 'Page Hero',
      fields: [
        { key: 'hero.breadcrumb_home', label: 'Breadcrumb Home Text', type: 'text', value: 'Home' },
        { key: 'hero.breadcrumb_current', label: 'Breadcrumb Current Text', type: 'text', value: 'Hotel & Mapping' },
        { key: 'hero.title', label: 'Hero Title', type: 'text', value: 'Hotel & Mapping' },
        {
          key: 'hero.description',
          label: 'Hero Description',
          type: 'textarea',
          value:
            'Find your way to the 3rd International Agri-Life & Bioresource Science Symposium venues. All venues are located within the campus of Capiz State University, Roxas City, Capiz, Philippines.',
        },
      ],
    },

    // ============ MAP SECTION ============
    {
      section: 'Map Section',
      fields: [
        { key: 'map.title', label: 'Section Title', type: 'text', value: 'Event Venue & Map' },
        {
          key: 'map.description',
          label: 'Section Description',
          type: 'text',
          value: 'Explore the event locations and navigate easily within the campus.',
        },
        { key: 'map.center_lat', label: 'Map Center Latitude', type: 'text', value: '11.5867' },
        { key: 'map.center_lng', label: 'Map Center Longitude', type: 'text', value: '122.7506' },
        { key: 'map.zoom', label: 'Map Default Zoom', type: 'text', value: '16' },
      ],
    },

    // ============ IMPORTANT NOTE ============
    {
      section: 'Important Note',
      fields: [
        { key: 'note.title', label: 'Note Title', type: 'text', value: 'Important Note' },
        {
          key: 'note.text',
          label: 'Note Text',
          type: 'textarea',
          value:
            'All venues are within walking distance of each other. Shuttle services will be available during the event.',
        },
      ],
    },

    // ============ VENUES (list) ============
    // Each item is a venue. `pos` is stored as a comma-separated string
    // ("lat,lng") so the admin editor can handle it as a simple text field.
    {
      section: 'Venues',
      fields: [
        { key: 'venues.title', label: 'Section Title', type: 'text', value: 'Venue List' },
        {
          key: 'venues.description',
          label: 'Section Description',
          type: 'text',
          value: 'Click a venue to view details and highlight the location on the map.',
        },
      ],
      list: {
        key: 'venues_items',
        label: 'Venues',
        items: [
          {
            num: '1',
            name: 'Capiz State University Main Campus',
            desc: 'Plenary sessions, keynotes, and general assemblies',
            loc: 'Roxas City, Capiz',
            color: 'bg-[#1D3D6D]',
            icon: 'building',
            pos: '11.5867,122.7506',
          },
          {
            num: '2',
            name: 'Conference Hall A',
            desc: 'Parallel sessions – Track 1 & 2',
            loc: 'Roxas City, Capiz',
            color: 'bg-[#4CAF50]',
            icon: 'users',
            pos: '11.5875,122.7515',
          },
          {
            num: '3',
            name: 'Conference Hall B',
            desc: 'Parallel sessions – Track 3 & 4',
            loc: 'Roxas City, Capiz',
            color: 'bg-[#F57C00]',
            icon: 'building',
            pos: '11.5858,122.7520',
          },
          {
            num: '4',
            name: 'Student Center',
            desc: 'Poster presentations, exhibits, and networking area',
            loc: 'Roxas City, Capiz',
            color: 'bg-[#8E24AA]',
            icon: 'university',
            pos: '11.5849,122.7535',
          },
          {
            num: '5',
            name: 'Capiz SU Guesthouse',
            desc: 'Official accommodation for invited guests',
            loc: 'Roxas City, Capiz',
            color: 'bg-[#E53935]',
            icon: 'bed',
            pos: '11.5840,122.7540',
          },
        ],
      },
    },

    // ============ TRAVEL INFORMATION ============
    {
      section: 'Travel Information',
      fields: [
        { key: 'travel.title', label: 'Section Title', type: 'text', value: 'Travel Information' },
      ],
      list: {
        key: 'travel_items',
        label: 'Travel Entries',
        items: [
          {
            icon: 'car',
            title: 'From Manila',
            description:
              'Approximately 10 – 12 hours by car via NLEX • SCTEX • TPLEX • Roxas-Iloilo Road, or via RORO.',
          },
          {
            icon: 'plane',
            title: 'Roxas City Airport (RXS)',
            description:
              'Approximately 15 minutes by car from Roxas City Airport to Capiz State University.',
          },
          {
            icon: 'globe',
            title: 'From Iloilo City',
            description: 'Approximately 2.5 hours by car via Roxas-Iloilo Road.',
          },
          {
            icon: 'walking',
            title: 'Campus Access',
            description: 'Enter through Capiz SU Main Gate. Follow signage to event venues.',
          },
        ],
      },
    },

    // ============ DOWNLOAD BOX ============
    {
      section: 'Download Box',
      fields: [
        { key: 'download.title', label: 'Box Title', type: 'text', value: 'Download Campus Map' },
        {
          key: 'download.description',
          label: 'Box Description',
          type: 'text',
          value: 'Get the campus map in PDF format for offline use.',
        },
        { key: 'download.button_text', label: 'Button Text', type: 'text', value: 'Download PDF' },
        { key: 'download.file_url', label: 'File URL', type: 'url', value: '/documents/campus-map.pdf' },
      ],
    },

    // ============ BOTTOM CTA ============
    {
      section: 'Bottom CTA',
      fields: [
        { key: 'bottom_cta.title', label: 'CTA Title', type: 'text', value: 'Need Assistance?' },
        {
          key: 'bottom_cta.description',
          label: 'CTA Description',
          type: 'text',
          value: 'Our secretariat is ready to help you with directions and other inquiries.',
        },
        { key: 'bottom_cta.button_text', label: 'Button Text', type: 'text', value: 'Contact Secretariat' },
        { key: 'bottom_cta.button_link', label: 'Button Link', type: 'text', value: '/contact-us' },
      ],
    },
  ],
};