import { PageDefinition } from './types';

export const partnerInstitutionsPage: PageDefinition = {
  slug: 'partner-institutions',
  name: 'Partner Institutions',
  path: '/partner-institutions',
  category: 'Partner Institutions',
  status: 'Published',
  updated: 'Sep 12, 2025 11:06 AM',
  structure: [
    // ============ PAGE HERO ============
    {
      section: 'Page Hero',
      fields: [
        { key: 'hero.breadcrumb_home', label: 'Breadcrumb Home Text', type: 'text', value: 'Home' },
        { key: 'hero.breadcrumb_current', label: 'Breadcrumb Current Text', type: 'text', value: 'Partners' },
        { key: 'hero.title', label: 'Hero Title', type: 'text', value: 'Partners & Collaborating Institutions' },
        {
          key: 'hero.subtitle',
          label: 'Hero Subtitle',
          type: 'textarea',
          value: 'Advancing science through institutional partnership and international collaboration.',
        },
      ],
    },

    // ============ HOST INSTITUTION ============
    {
      section: 'Host Institution',
      fields: [
        { key: 'host.title', label: 'Section Title', type: 'text', value: 'Organized by' },
        { key: 'host.name', label: 'Institution Name', type: 'text', value: 'Capiz State University' },
        { key: 'host.role', label: 'Role', type: 'text', value: 'Implementing Institution' },
        { key: 'host.location', label: 'Location', type: 'text', value: 'Capiz, Philippines' },
        { key: 'host.logo', label: 'Logo Path', type: 'image', value: '/images/capsu-logo.png' },
        {
          key: 'host.description',
          label: 'Description',
          type: 'textarea',
          value:
            'Capiz State University serves as the implementing institution of the 3rd International Agri-Life & Bioresource Sciences Symposium.',
        },
      ],
    },

    // ============ CO-HOST INSTITUTIONS ============
    {
      section: 'Co-host Institutions',
      fields: [
        { key: 'cohosts.title', label: 'Section Title', type: 'text', value: 'Co-host Institutions' },
        {
          key: 'cohosts.description',
          label: 'Section Description',
          type: 'text',
          value: 'The symposium proposal identifies these institutions as co-hosts with CAPSU.',
        },
      ],
      list: {
        key: 'cohosts_items',
        label: 'Co-host Institutions',
        items: [
          { name: 'Hiroshima University', location: '', logo: '/images/hiroshima-logo.webp' },
          { name: 'Visayas State University', location: 'Philippines', logo: '/images/vsu-logo.png' },
          { name: 'University of San Carlos', location: 'Philippines', logo: '/images/usc-logo.svg' },
        ],
      },
    },

    // ============ ROLE OF PARTNER INSTITUTIONS ============
    {
      section: 'Role of Partner Institutions',
      fields: [
        { key: 'role.title', label: 'Section Title', type: 'text', value: 'The Role of Partner Institutions' },
        {
          key: 'role.summary',
          label: 'Summary Paragraph',
          type: 'textarea',
          value:
            'Partner institutions contribute to the international and scientific character of the symposium through participation in organizing and scientific committees, promotion of the Call for Abstracts, nomination of speakers and experts, abstract review, session facilitation, academic networking, and the development of future research and institutional collaborations.',
        },
      ],
      list: {
        key: 'role_items',
        label: 'Role Bullet Points',
        items: [
          { text: 'Participation in Organizing and Scientific Committees' },
          { text: 'Promotion of the Call for Abstracts' },
          { text: 'Nomination of speakers and experts' },
          { text: 'Abstract review and evaluation' },
          { text: 'Session facilitation and moderation' },
          { text: 'Academic networking' },
          { text: 'Development of future research collaborations' },
          { text: 'Institutional partnerships' },
          { text: 'International scientific exchange' },
        ],
      },
    },

    // ============ OTHER INSTITUTIONAL PARTNERS ============
    {
      section: 'Other Institutional Partners',
      fields: [
        { key: 'institutional.title', label: 'Section Title', type: 'text', value: 'Other Institutional Partners' },
        {
          key: 'institutional.description',
          label: 'Section Description',
          type: 'text',
          value: 'Only add organizations here after confirmation.',
        },
        {
          key: 'institutional.empty_message',
          label: 'Empty Message',
          type: 'text',
          value: 'Institutional partners will be displayed here once confirmed.',
        },
      ],
      list: {
        key: 'institutional_items',
        label: 'Institutional Partners',
        items: [
          // Empty by default - admin can add confirmed partners here
          // { name: 'Partner Name', logo: '/images/partners/partner-logo.png' },
        ],
      },
    },

    // ============ SPONSORS ============
    {
      section: 'Sponsors',
      fields: [
        { key: 'sponsors.title', label: 'Section Title', type: 'text', value: 'Sponsors' },
        {
          key: 'sponsors.description',
          label: 'Section Description',
          type: 'text',
          value: 'Sponsorship logos will be displayed once agreements are finalized.',
        },
        {
          key: 'sponsors.note',
          label: 'Bottom Note',
          type: 'textarea',
          value:
            'Avoid putting organizations listed merely as possible invitees in your internal proposal on the public page before they formally agree.',
        },
      ],
      list: {
        key: 'sponsors_items',
        label: 'Sponsors',
        items: [
          // Empty by default - admin can add confirmed sponsors here
          // { name: 'Sponsor Name', logo: '/images/partners/sponsor-logo.png' },
        ],
      },
    },

    // ============ BECOME A PARTNER CTA ============
    {
      section: 'Become a Partner CTA',
      fields: [
        { key: 'become_partner.title', label: 'CTA Title', type: 'text', value: 'Become a Partner' },
        {
          key: 'become_partner.description',
          label: 'CTA Description',
          type: 'textarea',
          value:
            'Collaborate with us. Institutions and organizations interested in supporting the symposium through scientific collaboration, institutional participation, sponsorship, or other forms of partnership may contact the Organizing Committee.',
        },
        { key: 'become_partner.button_text', label: 'Button Text', type: 'text', value: 'Contact the Secretariat' },
        { key: 'become_partner.button_link', label: 'Button Link', type: 'text', value: '#' },
      ],
    },
  ],
};