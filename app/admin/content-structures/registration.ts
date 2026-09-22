import { PageDefinition } from './types';

export const registrationPage: PageDefinition = {
  slug: '/registration',
  name: 'Registration',
  path: '/registration',
  category: 'Registration',
  status: 'Published',
  updated: 'Sep 13, 2025 05:17 PM',
  structure: [
    // ============ PAGE HERO ============
    {
      section: 'Page Hero',
      fields: [
        { key: 'hero.breadcrumb_home', label: 'Breadcrumb Home Text', type: 'text', value: 'Home' },
        { key: 'hero.breadcrumb_current', label: 'Breadcrumb Current Text', type: 'text', value: 'Registration' },
        { key: 'hero.title', label: 'Hero Title', type: 'text', value: 'Registration' },
        {
          key: 'hero.description',
          label: 'Hero Description',
          type: 'textarea',
          value:
            'Join researchers, innovators, and professionals from around the world and be part of the International Colloquium 2025.',
        },
        { key: 'hero.image', label: 'Hero Image Path', type: 'image', value: '/images/registration-clipboard.png' },
      ],
    },

    // ============ REGISTRATION FEES ============
    {
      section: 'Registration Fees',
      fields: [
        { key: 'fees.title', label: 'Card Title', type: 'text', value: 'Registration Fees' },
        { key: 'fees.subtitle', label: 'Sub Heading', type: 'text', value: 'A. Registration fees:' },
        { key: 'fees.amount', label: 'Fee Amount', type: 'text', value: 'P 4,500.00' },
        {
          key: 'fees.info_note',
          label: 'Info Note',
          type: 'textarea',
          value:
            'The registration fee covers participation in all sessions, conference materials, certificates, and meals during the event.',
        },
      ],
      list: {
        key: 'fees_items',
        label: 'Fee Applies To',
        items: [
          { text: 'International participants' },
          { text: 'Local professionals/researchers' },
          { text: 'Faculty' },
          { text: 'Graduate students' },
          { text: 'Undergraduate students' },
        ],
      },
    },

    // ============ REGISTRATION INFORMATION TABLE ============
    {
      section: 'Registration Information',
      fields: [
        { key: 'table.title', label: 'Table Title', type: 'text', value: 'Registration Information by Participant' },
      ],
      list: {
        key: 'table_rows',
        label: 'Participant Categories',
        items: [
          {
            cat: 'International Participants',
            desc: 'Participants from other countries',
            fee: '4,500.00',
            inc: ['Access to all sessions', 'Conference materials', 'Certificate', 'Meals & refreshments'],
          },
          {
            cat: 'Local Professionals / Researchers',
            desc: 'Professionals and researchers in the field',
            fee: '4,500.00',
            inc: ['Access to all sessions', 'Conference materials', 'Certificate', 'Meals & refreshments'],
          },
          {
            cat: 'Faculty',
            desc: 'Full-time faculty members',
            fee: '4,500.00',
            inc: ['Access to all sessions', 'Conference materials', 'Certificate', 'Meals & refreshments'],
          },
          {
            cat: 'Graduate Students',
            desc: 'Currently enrolled graduate students',
            fee: '4,500.00',
            inc: ['Access to all sessions', 'Conference materials', 'Certificate', 'Meals & refreshments'],
          },
          {
            cat: 'Undergraduate Students',
            desc: 'Currently enrolled undergraduate students',
            fee: '4,500.00',
            inc: ['Access to all sessions', 'Conference materials', 'Certificate', 'Meals & refreshments'],
          },
        ],
      },
    },

    // ============ IMPORTANT DATES ============
    {
      section: 'Important Dates',
      fields: [
        { key: 'dates.title', label: 'Card Title', type: 'text', value: 'Important Dates' },
      ],
      list: {
        key: 'dates_items',
        label: 'Date Entries',
        items: [
          { title: 'Call for Papers Open', date: 'April 15, 2025' },
          { title: 'Full Paper Submission Deadline', date: 'June 30, 2025' },
          { title: 'Notification of Acceptance', date: 'July 25, 2025' },
          { title: 'Early Bird Payment Deadline', date: 'July 31, 2025' },
          { title: 'Regular Payment Deadline', date: 'August 31, 2025' },
          { title: 'Colloquium Dates', date: 'October 15-17, 2025' },
        ],
      },
    },

    // ============ STEPS FOR REGISTRATION ============
    {
      section: 'Steps for Registration',
      fields: [
        { key: 'steps.title', label: 'Card Title', type: 'text', value: 'Steps for Registration' },
      ],
      list: {
        key: 'steps_items',
        label: 'Registration Steps',
        items: [
          { title: 'Fill out the Online Registration Form', desc: 'Provide all required information in the registration form.' },
          { title: 'Receive Confirmation Email', desc: 'You will receive a confirmation email with payment instructions.' },
          { title: 'Pay the Registration Fee', desc: 'Pay the registration fee through bank transfer.' },
          { title: 'Submit Proof of Payment', desc: 'Upload or email your proof of payment.' },
          { title: 'Registration Confirmation', desc: 'Your registration will be confirmed and a receipt will be sent to you.' },
        ],
      },
    },

    // ============ CANCEL POLICY ============
    {
      section: 'Cancel Policy',
      fields: [
        { key: 'cancel.title', label: 'Card Title', type: 'text', value: 'Cancel Policy' },
        {
          key: 'cancel.description',
          label: 'Section Description',
          type: 'text',
          value: 'Cancellations must be sent in writing to the Secretariat.',
        },
        {
          key: 'cancel.note',
          label: 'Bottom Note',
          type: 'textarea',
          value: 'Substitutions are allowed at any time by notifying the Secretariat.',
        },
      ],
      list: {
        key: 'cancel_items',
        label: 'Refund Rules',
        items: [
          { rule: 'On or before June 30, 2025', result: '50% refund' },
          { rule: 'On or before July 31, 2025', result: '25% refund' },
          { rule: 'After July 31, 2025', result: 'No refund' },
        ],
      },
    },

    // ============ PAYMENT INFO ============
    {
      section: 'Payment Information',
      fields: [
        { key: 'payment.title', label: 'Card Title', type: 'text', value: 'Paying Registration Account' },
        { key: 'payment.account_name', label: 'Account Name', type: 'text', value: 'IC2025 Organizing Committee' },
        { key: 'payment.bank_name', label: 'Bank Name', type: 'text', value: 'Banco de Oro (BDO)' },
        { key: 'payment.account_number', label: 'Account Number', type: 'text', value: '0123 4567 8901' },
        { key: 'payment.account_type', label: 'Account Type', type: 'text', value: 'Savings Account' },
        { key: 'payment.swift_bic', label: 'SWIFT / BIC', type: 'text', value: 'BNORPHMM' },
        { key: 'payment.instruction_title', label: 'Instruction Title', type: 'text', value: 'Please email or upload your proof of payment' },
        { key: 'payment.email', label: 'Contact Email', type: 'text', value: 'ic2025.secretariat@example.com' },
        { key: 'payment.subject', label: 'Email Subject Format', type: 'text', value: 'IC2025 Payment – [Your Name]' },
      ],
    },

    // ============ BOTTOM CTA ============
    {
      section: 'Bottom CTA',
      fields: [
        { key: 'bottom_cta.title', label: 'CTA Title', type: 'text', value: 'Be Part of Global Discussions' },
        {
          key: 'bottom_cta.description',
          label: 'CTA Description',
          type: 'textarea',
          value:
            'Secure your slot today and join us in shaping a sustainable future through research, innovation, and collaboration.',
        },
        { key: 'bottom_cta.button_text', label: 'Button Text', type: 'text', value: 'Register Now' },
        { key: 'bottom_cta.button_link', label: 'Button Link', type: 'text', value: '/registration' },
      ],
    },
  ],
};