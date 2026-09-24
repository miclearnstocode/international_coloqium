import { PageDefinition } from './types';

export const contactPage: PageDefinition = {
  slug: 'contact-us',
  name: 'Contact Us',
  path: '/contact-us',
  category: 'Contact Us',
  status: 'Published',
  updated: 'Sep 10, 2025 01:14 PM',
  structure: [
    // ============ PAGE HERO ============
    {
      section: 'Page Hero',
      fields: [
        { key: 'hero.breadcrumb_home', label: 'Breadcrumb Home Text', type: 'text', value: 'Home' },
        { key: 'hero.breadcrumb_current', label: 'Breadcrumb Current Text', type: 'text', value: 'Contact Us' },
        { key: 'hero.title', label: 'Hero Title', type: 'text', value: 'Contact Us' },
        {
          key: 'hero.subtitle',
          label: 'Hero Subtitle',
          type: 'textarea',
          value: 'Connect with us for inquiries, assistance, and symposium support.',
        },
      ],
    },

    // ============ SECRETARIAT INFO BLOCK ============
    {
      section: 'Secretariat Info',
      fields: [
        {
          key: 'secretariat.title',
          label: 'Section Title',
          type: 'text',
          value: 'Contact the Symposium Secretariat',
        },
        {
          key: 'secretariat.description',
          label: 'Description',
          type: 'textarea',
          value:
            'Have questions about abstract submission, registration, travel, participation, or institutional collaboration? The 3rd International Agri-Life & Bioresource Sciences Symposium Secretariat is available to assist participants, presenters, partner institutions, and international delegates.',
        },
        { key: 'secretariat.office_label', label: 'Office Label', type: 'text', value: 'Symposium Secretariat' },
        { key: 'secretariat.office_name', label: 'Office Full Name', type: 'text', value: '3rd International Agri-Life & Bioresource Sciences Symposium' },
        { key: 'secretariat.university_label', label: 'University Label', type: 'text', value: 'Capiz State University' },
        { key: 'secretariat.university_location', label: 'University Location', type: 'text', value: 'Roxas City, Capiz, Philippines' },
        { key: 'secretariat.email_label', label: 'Email Label', type: 'text', value: 'Email' },
        { key: 'secretariat.email', label: 'Email Address', type: 'text', value: 'rde@capsu.edu.ph' },
        { key: 'secretariat.phone_label', label: 'Phone Label', type: 'text', value: 'Telephone' },
        { key: 'secretariat.phone', label: 'Phone Number', type: 'text', value: 'To be announced' },
      ],
    },

    // ============ HOW CAN WE HELP - HEADER ============
    {
      section: 'How Can We Help Header',
      fields: [
        { key: 'help_header.title', label: 'Section Title', type: 'text', value: 'How Can We Help?' },
      ],
    },

    // ============ HELP CARDS (list) ============
    // Each item is a help card. `bullets` is a nested array edited as one-per-line.
    {
      section: 'Help Cards',
      fields: [],
      list: {
        key: 'help_cards',
        label: 'Help Cards',
        items: [
          {
            icon: 'info',
            title: 'General Inquiries',
            description:
              'For general questions about the symposium, program, participation, schedules, and other event-related concerns.',
            bullets: [],
            email: 'rde@capsu.edu.ph',
            phone: 'To be announced',
            cta_text: '',
            cta_link: '',
          },
          {
            icon: 'clipboard',
            title: 'Registration & Payment Concerns',
            description: 'For assistance regarding:',
            bullets: [
              'Participant & Presenter registration',
              'Registration status & fee',
              'Proof of payment & verification',
              'Symposium kit and certificates',
            ],
            email: 'To be announced',
            phone: 'To be announced',
            cta_text: '',
            cta_link: '',
          },
          {
            icon: 'handshake',
            title: 'Partnership & Sponsorship',
            description:
              'Universities, research institutions, government agencies, professional organizations, industry partners, and other organizations interested in supporting or collaborating with the symposium.',
            bullets: [
              'Institutional & scientific collaboration',
              'Speaker, reviewer, or session chair nomination',
              'Sponsorship support & exhibition',
              'Post-symposium research collaboration',
            ],
            email: 'To be announced',
            phone: '',
            cta_text: 'Explore Our Partners',
            cta_link: '/partner-institutions',
          },
        ],
      },
    },

    // ============ CONTACT FORM SIDEBAR INFO ============
    {
      section: 'Contact Form Sidebar',
      fields: [
        { key: 'sidebar.title', label: 'Sidebar Title', type: 'text', value: 'Send Us a Message' },
        {
          key: 'sidebar.description',
          label: 'Sidebar Description',
          type: 'textarea',
          value: 'Have a specific question? Send your inquiry using the form.',
        },
        { key: 'sidebar.email_label', label: 'Email Label', type: 'text', value: 'Email' },
        { key: 'sidebar.email', label: 'Email', type: 'text', value: 'rde@capsu.edu.ph' },
        { key: 'sidebar.phone_label', label: 'Phone Label', type: 'text', value: 'Telephone' },
        { key: 'sidebar.phone', label: 'Phone', type: 'text', value: 'To be announced' },
        { key: 'sidebar.address_label', label: 'Address Label', type: 'text', value: 'Address' },
        { key: 'sidebar.address', label: 'Address', type: 'textarea', value: 'Capiz State University\nRoxas City, Capiz, Philippines' },
      ],
    },

    // ============ FORM SUCCESS STATE ============
    {
      section: 'Form Success State',
      fields: [
        { key: 'form_success.title', label: 'Success Title', type: 'text', value: 'Message Sent!' },
        {
          key: 'form_success.description',
          label: 'Success Description',
          type: 'textarea',
          value: 'Thank you for your message. We will get back to you as soon as possible.',
        },
        { key: 'form_success.cta_text', label: 'Reset Button Text', type: 'text', value: 'Send another message' },
      ],
    },

    // ============ FORM CONFIGURATION ============
    {
      section: 'Form Configuration',
      fields: [
        { key: 'form.submit_button_text', label: 'Submit Button Text', type: 'text', value: 'SEND MESSAGE' },
        { key: 'form.submitting_button_text', label: 'Submitting Button Text', type: 'text', value: 'Sending...' },
        {
          key: 'form.privacy_note',
          label: 'Privacy Note',
          type: 'textarea',
          value:
            'By submitting this form, you agree that the information you provide may be used by the Symposium Secretariat to respond to your inquiry and provide relevant symposium-related assistance.',
        },
        { key: 'form.privacy_link_text', label: 'Privacy Link Text', type: 'text', value: 'View Privacy Notice' },
        { key: 'form.privacy_link_url', label: 'Privacy Link URL', type: 'text', value: '#' },
      ],
    },

    // ============ COUNTRIES (form dropdown) ============
    {
      section: 'Countries List',
      fields: [],
      list: {
        key: 'countries',
        label: 'Countries',
        items: [
          { label: 'Select your country' },
          { label: 'Philippines' },
          { label: 'Japan' },
          { label: 'United States' },
          { label: 'United Kingdom' },
          { label: 'Australia' },
          { label: 'Canada' },
          { label: 'Germany' },
          { label: 'France' },
          { label: 'Italy' },
          { label: 'Spain' },
          { label: 'South Korea' },
          { label: 'China' },
          { label: 'India' },
          { label: 'Indonesia' },
          { label: 'Malaysia' },
          { label: 'Thailand' },
          { label: 'Vietnam' },
          { label: 'Singapore' },
          { label: 'New Zealand' },
          { label: 'Netherlands' },
          { label: 'Sweden' },
          { label: 'Norway' },
          { label: 'Denmark' },
          { label: 'Switzerland' },
          { label: 'Belgium' },
          { label: 'Austria' },
          { label: 'Greece' },
          { label: 'Portugal' },
          { label: 'Ireland' },
          { label: 'Brazil' },
          { label: 'Mexico' },
          { label: 'South Africa' },
          { label: 'Egypt' },
          { label: 'Saudi Arabia' },
          { label: 'United Arab Emirates' },
          { label: 'Qatar' },
          { label: 'Kuwait' },
          { label: 'Oman' },
          { label: 'Bahrain' },
          { label: 'Other' },
        ],
      },
    },

    // ============ INQUIRY TYPES (form dropdown) ============
    {
      section: 'Inquiry Types List',
      fields: [],
      list: {
        key: 'inquiry_types',
        label: 'Inquiry Types',
        items: [
          { label: 'Select inquiry type' },
          { label: 'General Inquiry' },
          { label: 'Abstract Submission' },
          { label: 'Scientific Tracks' },
          { label: 'Oral Presentation' },
          { label: 'Poster Presentation' },
          { label: 'Registration' },
          { label: 'Payment' },
          { label: 'International Delegate Assistance' },
          { label: 'Venue & Travel' },
          { label: 'Accommodation' },
          { label: 'Partnership / Sponsorship' },
          { label: 'Technical Support' },
          { label: 'Other' },
        ],
      },
    },

    // ============ FORM FIELD LABELS ============
    {
      section: 'Form Field Labels',
      fields: [
        { key: 'fields.fullName', label: 'Full Name Label', type: 'text', value: 'Full Name' },
        { key: 'fields.email', label: 'Email Label', type: 'text', value: 'Email Address' },
        { key: 'fields.institution', label: 'Institution Label', type: 'text', value: 'Institution / Organization' },
        { key: 'fields.country', label: 'Country Label', type: 'text', value: 'Country' },
        { key: 'fields.inquiryType', label: 'Inquiry Type Label', type: 'text', value: 'Inquiry Type' },
        { key: 'fields.subject', label: 'Subject Label', type: 'text', value: 'Subject' },
        { key: 'fields.message', label: 'Message Label', type: 'text', value: 'Message' },
        { key: 'fields.fullName_placeholder', label: 'Full Name Placeholder', type: 'text', value: 'Enter your complete name' },
        { key: 'fields.email_placeholder', label: 'Email Placeholder', type: 'text', value: 'Enter a valid email address' },
        { key: 'fields.institution_placeholder', label: 'Institution Placeholder', type: 'text', value: 'Enter your university, agency, company, or organization' },
        { key: 'fields.subject_placeholder', label: 'Subject Placeholder', type: 'text', value: 'Briefly describe your concern' },
        { key: 'fields.message_placeholder', label: 'Message Placeholder', type: 'text', value: 'Provide the details of your inquiry' },
      ],
    },
  ],
};