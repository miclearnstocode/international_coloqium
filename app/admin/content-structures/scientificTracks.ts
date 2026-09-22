import { PageDefinition } from './types';

export const scientificTracksPage: PageDefinition = {
  slug: '/scientific-tracks',
  name: 'Scientific Tracks',
  path: '/scientific-tracks',
  category: 'Scientific Tracks',
  status: 'Published',
  updated: 'Sep 14, 2025 11:20 AM',
  structure: [
    // ============ PAGE HERO ============
    {
      section: 'Page Hero',
      fields: [
        { key: 'hero.breadcrumb_home', label: 'Breadcrumb Home Text', type: 'text', value: 'Home' },
        { key: 'hero.breadcrumb_current', label: 'Breadcrumb Current Text', type: 'text', value: 'Scientific Tracks' },
        { key: 'hero.title', label: 'Hero Title', type: 'text', value: 'Scientific Tracks' },
        {
          key: 'hero.subtitle',
          label: 'Hero Subtitle',
          type: 'textarea',
          value:
            'The 3rd International Agri-Life & Bioresource Science Symposium welcomes original research and innovative ideas across a wide range of scientific disciplines.',
        },
      ],
    },

    // ============ SECTION TITLE ============
    {
      section: 'Tracks Section Header',
      fields: [
        { key: 'tracks_section.title', label: 'Section Title', type: 'text', value: 'Our Scientific Tracks' },
      ],
    },

    // ============ TRACK CARDS (list) ============
    // Each item in the list is one track card.
    // The admin can edit: id (TRACK 1), title, subtitle, color, icon path, and items[].
    {
      section: 'Track Cards',
      fields: [], // no scalar fields at this level - only a list
      list: {
        key: 'tracks',
        label: 'Scientific Tracks',
        items: [
          {
            id: 'TRACK 1',
            title: 'Agriculture, Animal',
            subtitle: 'and Plant Science',
            icon: '/images/tracks/leaf.png',
            color: 'bg-[#4CAF50]',
            iconColor: '#4CAF50',
            items: [
              'Crop science and sustainable crop production',
              'Animal science and livestock production',
              'Soil science and crop protection',
              'Agricultural and aquatic biotechnology',
              'Sustainable production systems',
            ],
          },
          {
            id: 'TRACK 2',
            title: 'Life, Biological, and',
            subtitle: 'Biotechnology Sciences',
            icon: '/images/tracks/dna.png',
            color: 'bg-[#1D3D6D]',
            iconColor: '#1D3D6D',
            items: [
              'Molecular biology and biotechnology',
              'Genetics and genomics',
              'Microbiology',
              'Ecology and biodiversity',
              'Plant, animal, and aquatic biology',
              'Genetic resources and conservation',
            ],
          },
          {
            id: 'TRACK 3',
            title: 'Bioresource, Fisheries, Marine,',
            subtitle: 'and Environmental Sciences',
            icon: '/images/tracks/fish.png',
            color: 'bg-[#1E88E5]',
            iconColor: '#1E88E5',
            items: [
              'Marine and coastal ecosystems',
              'Marine biodiversity and conservation',
              'Fisheries science and management',
              'Aquatic and marine bioresources',
              'Natural resource management',
              'Forestry and agroforestry',
              'Climate change and resilience',
              'Environmental science',
              'Circular bioeconomy',
              'Fisheries and aquaculture',
              'Aquatic animal health and nutrition',
            ],
          },
          {
            id: 'TRACK 4',
            title: 'Food, Nutrition, and One Health',
            subtitle: '',
            icon: '/images/tracks/nutrition.png',
            color: 'bg-[#8E24AA]',
            iconColor: '#8E24AA',
            items: [
              'Food science and technology',
              'Food safety and quality',
              'Nutrition',
              'One Health',
              'Plant, animal, and aquatic health',
              'Sustainable food systems',
              'Seafood safety and processing',
            ],
          },
          {
            id: 'TRACK 5',
            title: 'Innovation, Economics, and',
            subtitle: 'Sustainable Development',
            icon: '/images/tracks/innovation.png',
            color: 'bg-[#F57C00]',
            iconColor: '#F57C00',
            items: [
              'Agricultural and fisheries economics',
              'Extension and communication',
              'Rural and coastal community development',
              'Agribusiness and entrepreneurship',
              'Digital and precision agriculture',
              'Smart farming and aquaculture',
              'Artificial intelligence and emerging technologies',
              'Policy, governance, and sustainable development',
            ],
          },
        ],
      },
    },

    // ============ SUBMIT CTA ============
    {
      section: 'Submit CTA',
      fields: [
        { key: 'cta.title', label: 'CTA Title', type: 'text', value: 'Submit Your Research' },
        {
          key: 'cta.description',
          label: 'CTA Description',
          type: 'textarea',
          value:
            'Share your innovative research and be part of global discussions that shape the future of science, technology, and society.',
        },
        { key: 'cta.button_text', label: 'Button Text', type: 'text', value: 'Submit Abstract' },
        { key: 'cta.button_link', label: 'Button Link', type: 'text', value: '/abstract-submission' },
      ],
    },
  ],
};