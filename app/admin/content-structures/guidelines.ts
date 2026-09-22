import { PageDefinition } from './types';

export const guidelinesPage: PageDefinition = {
  slug: '/presentation-guidelines',
  name: 'Presentation Guidelines',
  path: '/presentation-guidelines',
  category: 'Guidelines',
  status: 'Published',
  updated: 'Sep 12, 2025 02:41 PM',
  structure: [
    // ============ PAGE HERO ============
    {
      section: 'Page Hero',
      fields: [
        { key: 'hero.breadcrumb_home', label: 'Breadcrumb Home Text', type: 'text', value: 'Home' },
        { key: 'hero.breadcrumb_current', label: 'Breadcrumb Current Text', type: 'text', value: 'Presentation Guidelines' },
        { key: 'hero.title', label: 'Hero Title', type: 'text', value: 'Presentation Guidelines' },
        {
          key: 'hero.subtitle',
          label: 'Hero Subtitle',
          type: 'text',
          value: '3rd International Agri-Life and Bioresource Sciences Symposium',
        },
        {
          key: 'hero.event_info',
          label: 'Event Date & Location',
          type: 'text',
          value: 'March 10-13, 2027 | Roxas City, Capiz, Philippines – The Seafood Capital of the Philippines',
        },
        { key: 'hero.image', label: 'Hero Image Path', type: 'image', value: '/images/guideline.png' },
      ],
    },

    // ============ ORAL PRESENTATION HEADER ============
    {
      section: 'Oral Presentation Header',
      fields: [
        { key: 'oral_header.title', label: 'Section Title', type: 'text', value: 'Guidelines for Oral Presentation' },
        {
          key: 'oral_header.description',
          label: 'Section Description',
          type: 'textarea',
          value:
            'If your presentation has already been accepted, please find the appropriate sections below on how to prepare it, and read them carefully.',
        },
      ],
    },

    // ============ ORAL GUIDELINES CARDS ============
    {
      section: 'Oral Guidelines Cards',
      fields: [],
      list: {
        key: 'oral_items',
        label: 'Oral Guideline Cards',
        items: [
          { title: 'Talk Duration', description: 'Each talk is allocated 10 minutes for presentation plus 5 minutes for Q&A, making 15 minutes total.', icon: 'clock' },
          { title: 'Language', description: 'All talks must be presented in English.', icon: 'microphone' },
          { title: 'Slide Management', description: 'Average of about one slide per minute. Complicated slides take longer.', icon: 'powerpoint' },
          { title: 'File Submission', description: 'Submit PowerPoint presentations at the registration desk upon check-in. Label your USB with your name.', icon: 'file' },
          { title: 'Compatibility Check', description: 'Test your presentation at least 15 minutes before your session. If using Mac, ensure PC compatibility.', icon: 'laptop' },
          { title: 'Arrival Time', description: 'Arrive at assigned rooms 30 minutes before the session starts. Introduce yourself to the chairperson.', icon: 'users' },
        ],
      },
    },

    // ============ AUDIOVISUAL AIDS ============
    {
      section: 'Audiovisual Aids',
      fields: [
        { key: 'av.title', label: 'Section Title', type: 'text', value: 'Audiovisual Aids' },
      ],
      list: {
        key: 'av_items',
        label: 'Audiovisual Points',
        items: [
          { text: "Speakers should hand over their PowerPoint presentation at the registration desk when they first check in to the conference so that it can be loaded onto our computer's hard disk." },
          { text: 'Please label your memory stick with your name.' },
          { text: 'Run through your presentation in advance (at least 15 minutes before your oral presentations) to ensure compatibility with local hardware and software.' },
          { text: 'If you have prepared your PowerPoint presentation on an Apple Macintosh computer, we strongly advise you to check that it works correctly on a PC before coming to the conference.' },
          { text: 'All speakers should arrive at the assigned rooms 30 minutes prior to the start of their session.' },
        ],
      },
    },

    // ============ FULL PAPER SUBMISSIONS ============
    {
      section: 'Full Paper Submissions',
      fields: [
        { key: 'fullpaper.title', label: 'Section Title', type: 'text', value: 'Full Paper Submissions' },
        {
          key: 'fullpaper.description',
          label: 'Section Description',
          type: 'textarea',
          value:
            'Presenters accepted for Oral Presentation are requested to submit their full manuscript to be considered for publication in the Special Issue.',
        },
        {
          key: 'fullpaper.formatting',
          label: 'Formatting Notes',
          type: 'textarea',
          value:
            'Formatting: Double-spaced on A4 (210 x 297 mm) paper size, with margins of 2.54 cm on all sides.\nFont: 12 points Times New Roman.\nSpacing: Sentences separated by one character space. Paragraphs separated by three (3) line spaces.\nFigures & Tables: Integrated in the flow of discussion. Mentioned separately in numerical sequence.',
        },
      ],
      list: {
        key: 'fullpaper_rows',
        label: 'Paper Structure Rows',
        items: [
          { page: 'Page 1', content: "Complete authors' and/or co-authors name, designation, agency/institutional affiliation, mailing addresses, email addresses" },
          { page: 'Page 2', content: 'Title of Article\nAbstract (at most 200 words in one paragraph)\nKey words (at least two)' },
          { page: 'Page 3 onwards', content: 'INTRODUCTION (with clearly specified objectives)\nMATERIALS AND METHODS\nRESULTS AND DISCUSSIONS\nCONCLUSIONS AND RECOMMENDATIONS\nACKNOWLEDGMENT (if any)\nREFERENCES' },
        ],
      },
    },

    // ============ POSTER PRESENTERS HEADER ============
    {
      section: 'Poster Presenters Header',
      fields: [
        { key: 'poster_header.title', label: 'Section Title', type: 'text', value: 'Guidelines for Poster Presenters' },
        {
          key: 'poster_header.description',
          label: 'Section Description',
          type: 'textarea',
          value:
            'The Poster Presentation Category provides participants with an opportunity to communicate their research in a concise, visually engaging, and interactive format.',
        },
      ],
    },

    // ============ POSTER FORMAT & LAYOUT ============
    {
      section: 'Poster Format and Layout',
      fields: [
        { key: 'poster_format.title', label: 'Section Title', type: 'text', value: 'A. Poster Format and Layout' },
        {
          key: 'poster_format.font_requirements',
          label: 'Font Requirements',
          type: 'textarea',
          value:
            'Title: At least 72 pt, bold, uppercase\nAuthor(s): At least 48 pt (include affiliation and email address)\nSection Headings: At least 36 pt\nBody Text: At least 24 pt\nFont Style: Arial',
        },
      ],
      list: {
        key: 'poster_format_cards',
        label: 'Format Cards',
        items: [
          { label: 'Poster Size', value: '36" × 48" (Portrait)', icon: 'ruler' },
          { label: 'Font', value: 'Arial, Multiple Sizes', icon: 'file' },
          { label: 'Design', value: 'High Contrast Colors', icon: 'palette' },
          { label: 'Setup', value: '1 Hour Before Session', icon: 'clock' },
        ],
      },
    },

    // ============ POSTER CONTENT ============
    {
      section: 'Poster Content',
      fields: [
        { key: 'poster_content.title', label: 'Section Title', type: 'text', value: 'B. Poster Content' },
      ],
      list: {
        key: 'poster_content_items',
        label: 'Content Items',
        items: [
          { text: 'Title – Concise and reflective of the study focus' },
          { text: 'Authors and Affiliations – Full names, institutions, and email addresses' },
          { text: 'Abstract – Maximum of 300 words' },
          { text: 'Introduction – Background, problem statement, and objectives' },
          { text: 'Methodology – Materials, methods, procedures (diagrams encouraged)' },
          { text: 'Results and Discussion – Key findings with tables, figures, or graphs' },
          { text: 'Conclusion and Recommendations – Summary and future directions' },
          { text: 'References – Key references (APA style recommended)' },
          { text: 'Acknowledgments (Optional) – Funding sources and contributors' },
        ],
      },
    },

    // ============ DISPLAY REQUIREMENTS ============
    {
      section: 'Display Requirements',
      fields: [
        { key: 'display.title', label: 'Section Title', type: 'text', value: 'C. Display Requirements' },
      ],
      list: {
        key: 'display_items',
        label: 'Display Requirements',
        items: [
          { text: 'Bring a printed poster for on-site display', icon: 'print', bold_prefix: 'Bring a printed poster' },
          { text: 'Mount the poster 1 hour before the presentation', icon: 'clock', bold_prefix: 'Mount the poster' },
          { text: 'Include a picture of yourself so attendees can easily find you', icon: 'user', bold_prefix: 'Include a picture' },
          { text: "Include collaborators' names and logos of funders or host institution", icon: 'university', bold_prefix: "Include collaborators' names" },
          { text: 'Share your poster on social media with #3rdIALSS', icon: 'share', bold_prefix: 'Share your poster' },
          { text: 'Print 15-20 copies of your poster on bond paper to place beside your mounted poster', icon: 'print', bold_prefix: 'Print 15-20 copies' },
        ],
      },
    },

    // ============ PRO TIPS ============
    {
      section: 'Pro Tips',
      fields: [
        { key: 'tips.title', label: 'Section Title', type: 'text', value: '💡 Pro Tips' },
      ],
      list: {
        key: 'tips_items',
        label: 'Tip Items',
        items: [
          { text: 'Consider including a picture of yourself (maybe in the field) so attendees can find you easily.' },
          { text: "Don't forget to include names of collaborators and logos of funders or your host institution." },
          { text: 'Include a web or email address, or a sign-up sheet for people to leave their email address.' },
          { text: 'Upload your poster to SlideShare and share on social media with #3rdIALSS.' },
        ],
      },
    },

    // ============ CONTACT SECTION ============
    {
      section: 'Contact Section',
      fields: [
        { key: 'contact.title', label: 'Section Title', type: 'text', value: 'For Additional Concerns' },
        { key: 'contact.description', label: 'Section Description', type: 'text', value: 'Please contact us through:' },
        { key: 'contact.email', label: 'Contact Email', type: 'text', value: 'rde@capsu.edu.ph' },
      ],
    },

    // ============ DOWNLOAD CTA ============
    {
      section: 'Download CTA',
      fields: [
        { key: 'download.title', label: 'CTA Title', type: 'text', value: 'Download Complete Guidelines' },
        {
          key: 'download.description',
          label: 'CTA Description',
          type: 'text',
          value: 'Get the full presentation guidelines document in PDF format.',
        },
        { key: 'download.button_text', label: 'Button Text', type: 'text', value: 'Download Presentation Guidelines (PDF)' },
        { key: 'download.file_url', label: 'PDF File URL', type: 'url', value: '/documents/presentation-guidelines.pdf' },
      ],
    },
  ],
};