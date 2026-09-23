import { PageDefinition } from './types';

export const abstractSubmissionPage: PageDefinition = {
  slug: 'abstract-submission',
  name: 'Abstract Submission',
  path: '/abstract-submission',
  category: 'Abstract Submission',
  status: 'Published',
  updated: 'Sep 14, 2025 09:32 AM',
  structure: [
    // ============ PAGE HERO ============
    {
      section: 'Page Hero',
      fields: [
        { key: 'hero.breadcrumb_home', label: 'Breadcrumb Home Text', type: 'text', value: 'Home' },
        { key: 'hero.breadcrumb_current', label: 'Breadcrumb Current Text', type: 'text', value: 'Abstract Submission' },
        { key: 'hero.title', label: 'Hero Title', type: 'text', value: 'Abstract Submission' },
        {
          key: 'hero.description',
          label: 'Hero Description',
          type: 'textarea',
          value:
            'We welcome original, unpublished abstracts that contribute to the advancement of knowledge and practice aligned with the conference themes. All submissions will undergo a rigorous peer-review process.',
        },
        { key: 'hero.cta_text', label: 'Hero CTA Button Text', type: 'text', value: 'Submit Your Abstract' },
        { key: 'hero.cta_link', label: 'Hero CTA Button Link', type: 'text', value: '/login' },
        { key: 'hero.image', label: 'Hero Image Path', type: 'image', value: '/images/laptop2.png' },
      ],
    },

    // ============ SUBMISSION PROCESS ============
    {
      section: 'Submission Process',
      fields: [
        { key: 'process.title', label: 'Section Title', type: 'text', value: 'Submission Process' },
      ],
      list: {
        key: 'process_steps',
        label: 'Process Steps',
        items: [
          { num: '1', title: 'Create an Account', desc: 'Register or log in to your account to get started.' },
          { num: '2', title: 'Start Submission', desc: 'Fill in the abstract details and upload your abstract.' },
          { num: '3', title: 'Review & Confirm', desc: 'Review all information and confirm your submission.' },
          { num: '4', title: 'Submit', desc: 'Submit your abstract and receive a confirmation.' },
          { num: '5', title: 'Track Status', desc: 'Monitor your abstract status through your dashboard.' },
        ],
      },
    },

    // ============ SUBMISSION GUIDELINES ============
    {
      section: 'Submission Guidelines',
      fields: [
        { key: 'guidelines.title', label: 'Section Title', type: 'text', value: 'SUBMISSION GUIDELINES' },
        {
          key: 'guidelines.description',
          label: 'Section Description',
          type: 'text',
          value: 'Please read the guidelines carefully before submitting your abstract.',
        },
      ],
      list: {
        key: 'guidelines_items',
        label: 'Guideline Items',
        items: [
          { title: 'Eligibility', desc: 'The abstract must be original, unpublished, and not currently under review or consideration elsewhere.' },
          { title: 'Language', desc: 'All abstracts must be written in English.' },
          { title: 'File Format', desc: 'Submit your abstract in Microsoft Word (.docx) or PDF (.pdf) format.' },
          { title: 'Template', desc: 'Use the official conference template for formatting your abstract.' },
          { title: 'Length', desc: 'The abstract must be between 200 and 300 words, including references and appendices.' },
          { title: 'Review Process', desc: 'All submissions will undergo a double-blind peer review.' },
        ],
      },
    },

    // ============ IMPORTANT DATES ============
    {
      section: 'Important Dates',
      fields: [
        { key: 'dates.title', label: 'Section Label', type: 'text', value: 'Important Dates' },
      ],
      list: {
        key: 'dates_items',
        label: 'Date Entries',
        items: [
          { label: 'Submission Deadline', date: 'June 15, 2025' },
          { label: 'Notification of Acceptance', date: 'July 15, 2025' },
        ],
      },
    },

    // ============ INFO NOTE ============
    {
      section: 'Info Note',
      fields: [
        {
          key: 'info_note.text',
          label: 'Info Note Text',
          type: 'textarea',
          value:
            'Incomplete or non-compliant submissions may be desk rejected. Please ensure your abstract follows all guidelines.',
        },
      ],
    },

    // ============ SUBMIT SECTION ============
    {
      section: 'Submit Section',
      fields: [
        { key: 'submit.title', label: 'Section Title', type: 'text', value: 'SUBMIT YOUR ABSTRACT' },
        {
          key: 'submit.description',
          label: 'Section Description',
          type: 'text',
          value: 'Ready to submit? Log in to your account and complete the submission form.',
        },
        { key: 'submit.login_text', label: 'Login Button Text', type: 'text', value: 'Login to Your Account' },
        { key: 'submit.login_link', label: 'Login Button Link', type: 'text', value: '/login' },
        { key: 'submit.divider_text', label: 'Divider Text', type: 'text', value: 'or' },
        { key: 'submit.register_text', label: 'Register Button Text', type: 'text', value: 'Create a New Account' },
        { key: 'submit.register_link', label: 'Register Button Link', type: 'text', value: '/register' },
      ],
    },

    // ============ WHAT YOU WILL NEED ============
    {
      section: 'What You Will Need',
      fields: [
        { key: 'needed.title', label: 'Section Title', type: 'text', value: 'What You Will Need' },
      ],
      list: {
        key: 'needed_items',
        label: 'Required Items',
        items: [
          { text: 'Abstract Title' },
          { text: 'Abstract (150 - 250 words)' },
          { text: 'Keywords (3-5)' },
          { text: 'Author Information' },
          { text: 'Abstract File' },
          { text: 'Supplementary Files (if any)' },
        ],
      },
    },

    // ============ NEED HELP ============
    {
      section: 'Need Help',
      fields: [
        { key: 'help.title', label: 'Section Title', type: 'text', value: 'Need Help?' },
        {
          key: 'help.description',
          label: 'Section Description',
          type: 'textarea',
          value:
            "If you have any questions or encounter issues during the submission process, we're here to help.",
        },
        { key: 'help.email_label', label: 'Email Label', type: 'text', value: 'Email us at' },
        { key: 'help.email', label: 'Email Address', type: 'text', value: 'info@icolloquium2025.org' },
        { key: 'help.faq_label', label: 'FAQ Label', type: 'text', value: 'Visit our FAQ' },
        { key: 'help.faq_cta', label: 'FAQ CTA Text', type: 'text', value: 'Frequently Asked Questions' },
        { key: 'help.faq_link', label: 'FAQ CTA Link', type: 'text', value: '#faq' },
      ],
    },

    // ============ FAQ SECTION ============
    {
      section: 'FAQ Section',
      fields: [
        { key: 'faq.title', label: 'Section Title', type: 'text', value: 'FREQUENTLY ASKED QUESTIONS' },
      ],
      list: {
        key: 'faq_items',
        label: 'FAQ Questions',
        items: [
          { question: 'Who can submit an abstract?', answer: '' },
          { question: 'What topics are suitable for submission?', answer: '' },
          { question: 'Is there a submission fee?', answer: '' },
          { question: 'Can I submit more than one abstract?', answer: '' },
          { question: 'How will I know if my abstract is accepted?', answer: '' },
          { question: 'Can I make changes after submission?', answer: '' },
        ],
      },
    },

    // ============ BOTTOM CTA ============
    {
      section: 'Bottom CTA',
      fields: [
        { key: 'bottom_cta.title', label: 'CTA Title', type: 'text', value: 'Have a great abstract to share?' },
        {
          key: 'bottom_cta.description',
          label: 'CTA Description',
          type: 'text',
          value: 'Join researchers, academics, and professionals from around the world.',
        },
        { key: 'bottom_cta.button_text', label: 'Button Text', type: 'text', value: 'Submit Your Abstract Now' },
        { key: 'bottom_cta.button_link', label: 'Button Link', type: 'text', value: '/login' },
      ],
    },
  ],
};