import { PageDefinition } from './types';

export const programPage: PageDefinition = {
  slug: '/program',
  name: 'Program',
  path: '/program',
  category: 'Program',
  status: 'Published',
  updated: 'Sep 15, 2025 03:45 PM',
  structure: [
    // ============ PAGE HERO ============
    {
      section: 'Page Hero',
      fields: [
        { key: 'hero.breadcrumb_home', label: 'Breadcrumb Home Text', type: 'text', value: 'Home' },
        { key: 'hero.breadcrumb_current', label: 'Breadcrumb Current Text', type: 'text', value: 'Program' },
        { key: 'hero.title', label: 'Hero Title', type: 'text', value: 'Symposium Program' },
        {
          key: 'hero.description',
          label: 'Hero Description',
          type: 'textarea',
          value:
            'The symposium will be conducted face-to-face and will combine keynote and plenary presentations, technical sessions, panel discussions, oral and poster research presentations, networking opportunities, collaborative activities, and cultural experiences.',
        },
        { key: 'hero.background_image', label: 'Background Image', type: 'image', value: '/images/globe.jpg' },
      ],
    },

    // ============ KEY DATES HEADER ============
    {
      section: 'Key Dates Header',
      fields: [
        { key: 'key_dates.title', label: 'Section Title', type: 'text', value: 'Key Dates' },
        {
          key: 'key_dates.description',
          label: 'Section Description',
          type: 'text',
          value: 'Mark your calendars with these important deadlines for the 3rd International Agri-Life & Bioresource Science Symposium',
        },
        { key: 'key_dates.footer_note', label: 'Footer Note', type: 'text', value: 'All deadlines are at 11:59 PM (UTC+8)' },
      ],
    },

    // ============ KEY DATES TABLE ============
    {
      section: 'Key Dates Table',
      fields: [],
      list: {
        key: 'key_dates_items',
        label: 'Key Date Entries',
        items: [
          { date: 'October 5, 2026', event: 'Opening of Abstract Submission and Registration', description: 'Official launching and dissemination of the Call for Abstracts and Registration through partner institutions, networks, and online platforms.', icon: 'rocket' },
          { date: 'January 10, 2027', event: 'Abstract Submission Deadline', description: 'Final date for authors to submit abstracts for consideration in the scientific program.', icon: 'file' },
          { date: 'October 2026 - January 20, 2027', event: 'Review and Evaluation Period', description: 'Scientific evaluation of submitted abstracts by designated reviewers based on established criteria.', icon: 'file' },
          { date: 'Rolling (until Jan. 25, 2027)', event: 'Notification of Acceptance', description: 'Rolling notification of acceptance. Final notices to be issued by January 25, 2027.', icon: 'bell' },
          { date: 'December 18, 2026', event: 'Early Bird Registration Deadline', description: 'Period during which accepted presenters and other participants may avail of the applicable early registration rate.', icon: 'calendar-check' },
          { date: 'January 10, 2027', event: 'Final Registration Deadline', description: 'Final date for presenters and participants to confirm their participation. Only registered presenters shall be included in the final scientific program.', icon: 'envelope' },
          { date: 'January 29, 2027', event: 'Finalization of Scientific Program', description: 'Scientific program will be finalized.', icon: 'edit' },
          { date: 'February 6 – March 5, 2027', event: 'Preparation of Book of Abstracts', description: 'Compilation and preparation of the Book of Abstracts.', icon: 'book' },
          { date: 'Subject to Journal Partner', event: 'Submission of Full Papers', description: 'Authors of selected papers may be invited to submit full manuscripts for possible publication or inclusion in symposium proceedings, subject to applicable review and publication requirements.', icon: 'pen' },
          { date: 'February 26, 2027', event: 'Release of Final Program', description: 'Final program will be sent via email to all committee and focal persons and can be access through this portal.', icon: 'print' },
          { date: 'March 11–13, 2027', event: '3rd International Agri-Life & Bioresource Science Symposium 2027', description: 'Main conference program and activities.', icon: 'calendar' },
        ],
      },
    },

    // ============ PROGRAM AT A GLANCE ============
    {
      section: 'Program At A Glance',
      fields: [
        { key: 'glance.title', label: 'Section Title', type: 'text', value: 'Program At A Glance' },
      ],
      list: {
        key: 'glance_items',
        label: 'Glance Stats',
        items: [
          { value: '3', label: 'Days', icon: 'users' },
          { value: '5', label: 'Keynote Speeches', icon: 'microphone' },
          { value: '18+', label: 'Technical Sessions', icon: 'graduation' },
          { value: '4', label: 'Panel Discussions', icon: 'comments' },
          { value: '2', label: 'Networking Events', icon: 'bullhorn' },
        ],
      },
    },

    // ============ DAY TABS LABELS ============
    {
      section: 'Day Tabs',
      fields: [
        { key: 'day_tabs.day1_label', label: 'Day 1 Label', type: 'text', value: 'DAY 1' },
        { key: 'day_tabs.day1_date', label: 'Day 1 Date', type: 'text', value: 'March 11, 2027' },
        { key: 'day_tabs.day2_label', label: 'Day 2 Label', type: 'text', value: 'DAY 2' },
        { key: 'day_tabs.day2_date', label: 'Day 2 Date', type: 'text', value: 'March 12, 2027' },
        { key: 'day_tabs.day3_label', label: 'Day 3 Label', type: 'text', value: 'DAY 3' },
        { key: 'day_tabs.day3_date', label: 'Day 3 Date', type: 'text', value: 'March 13, 2027' },
      ],
    },

    // ============ DAY 1 SCHEDULE ============
    {
      section: 'Day 1 Schedule',
      fields: [],
      list: {
        key: 'day1_schedule',
        label: 'Day 1 Sessions',
        items: [
          { time: '07:30 – 08:30', title: 'Arrival and Registration of Participants', subtitle: '', icon: 'edit' },
          { time: '08:30 – 09:30', title: 'OPENING CEREMONY', subtitle: '', icon: 'bullhorn' },
          { time: '08:30 – 08:35', title: '', subtitle: 'Call to Order / Opening of the Symposium', icon: 'circle' },
          { time: '08:35 – 08:45', title: '', subtitle: 'Invocation and Philippine National Anthem', icon: 'circle' },
          { time: '08:45 – 08:50', title: '', subtitle: 'Recognition of Dignitaries, International Delegates, and Partner Institutions', icon: 'circle' },
          { time: '08:50 – 08:58', title: 'WELCOME AND OPENING REMARKS', subtitle: 'Dr. Efren L. Linan\nCapiz State University, Philippines', icon: 'microphone' },
          { time: '08:58 – 09:06', title: 'MESSAGE - HIROSHIMA UNIVERSITY', subtitle: 'Representative\nHiroshima University, Japan', icon: 'microphone' },
          { time: '09:06 – 09:14', title: 'MESSAGE - UNIVERSITY OF SAN CARLOS', subtitle: 'Representative\nUniversity of San Carlos, Philippines', icon: 'microphone' },
          { time: '09:14 – 09:22', title: 'MESSAGE - VISAYAS STATE UNIVERSITY', subtitle: 'Representative\nVisayas State University, Philippines', icon: 'microphone' },
          { time: '09:22 – 09:27', title: 'SYMPOSIUM OVERVIEW, RATIONALE, AND OBJECTIVES', subtitle: 'Dr. John King N. Layos\nChair, Organizing Committee\nCapiz State University, Philippines', icon: 'graduation' },
          { time: '09:27 – 09:30', title: 'OFFICIAL OPENING OF THE SYMPOSIUM', subtitle: 'Dr. Efren L. Linan\nCapiz State University, Philippines', icon: 'lightbulb' },
          { time: '09:30 – 10:15', title: 'MOU SIGNING CEREMONY', subtitle: 'University Presidents/Authorized Signatories of Partner Institutions', icon: 'marker' },
          { time: '', title: '', subtitle: 'Introduction of Partner Institutions and Signatories\nMaster of Ceremonies', icon: 'circle' },
          { time: '', title: '', subtitle: 'Presentation of the MOU\nDr. Leo Andrew B. Biclar\nCapiz State University, Philippines', icon: 'circle' },
          { time: '', title: '', subtitle: 'Ceremonial Signing of MOU\nUniversity Presidents / Authorized Signatories', icon: 'circle' },
          { time: '', title: '', subtitle: 'Exchange of Signed Documents\n Signatories', icon: 'circle' },
          { time: '', title: '', subtitle: 'Official Photo Session\nSignatories and Institutional Representatives', icon: 'circle' },
          { time: '10:15 – 10:30', title: 'HEALTH AND COFFEE BREAK', subtitle: '', icon: 'mug' },
          { time: '10:30 – 11:10', title: 'PLENARY TALK 1 - BIODIVERSITY', subtitle: 'Safeguarding Animal Genetic Resources in the Genomic Era: Perspectives from the ISAG–FAO Advisory Group on Animal Genetic Diversity\nDr. Licia Colli\nISAG–FAO Advisory Group on Animal Genetic Diversity Universita Cattolica del Sacro Coure, Piacenza, Italy', icon: 'graduation' },
          { time: '11:10 – 11:50', title: 'PLENARY TALK 2 - MARINE/AQUATIC SCIENCES', subtitle: 'Nominated HU Speaker; Preferably Dr. Koike', icon: 'graduation' },
          { time: '11:50 – 12:05', title: 'OPEN FORUM/DISCUSSION - PLENARY TALKS 1 & 2', subtitle: 'Session Moderator (CAPSU)', icon: 'comments' },
          { time: '12:05 – 13:05', title: 'LUNCH BREAK', subtitle: '', icon: 'utensils' },
          { time: '13:05 – 13:45', title: 'PLENARY TALK 3 - PLANT SCIENCE', subtitle: 'Invited Speaker (nominated by CAPSU), University of Zagreb, Croatia', icon: 'graduation' },
          { time: '13:45 – 14:25', title: 'PLENARY TALK 4 - FOOD SCIENCE/NUTRITION', subtitle: 'Invited Speaker (nominated by CAPSU), University of Zagreb, Croatia', icon: 'graduation' },
          { time: '14:25 – 15:05', title: 'PLENARY TALK 5 - LIVESTOCK SCIENCE', subtitle: 'Invited Speaker (nominated by CAPSU), University of Zagreb, Croatia', icon: 'graduation' },
          { time: '15:05 – 15:20', title: 'OPEN FORUM/DISCUSSION - PLENARY TALKS 3,4 & 5', subtitle: 'Session Moderator (CAPSU)', icon: 'comments' },
          { time: '15:20 – 15:30', title: 'HEALTH AND COFFEE BREAK', subtitle: '', icon: 'mug' },
          { time: '15:30 – 17:00', title: 'TECHNICAL PRESENTATIONS – BREAKOUT SESSION 1', subtitle: 'Scientific & Technical Committee', icon: 'book' },
          { time: '', title: '', subtitle: 'Track 1 – Agricultural and Animal Sciences\nPresentations (Entry 1–5)\nTrack Chair / Session Moderator / Evaluators', icon: 'leaf' },
          { time: '', title: '', subtitle: 'Track 2 – Life, Biological, and Biotechnology Sciences\nPresentations (Entry 1–5)\nTrack Chair / Session Moderator / Evaluators', icon: 'react' },
          { time: '', title: '', subtitle: 'Track 3 – Fisheries, Marine, Bioresource, and Environmental Sciences\nPresentations (Entry 1–5)\nTrack Chair / Session Moderator / Evaluators', icon: 'pastafarianism' },
          { time: '', title: '', subtitle: 'Track 4 – Food, Nutrition, and One Health\nPresentations (Entry 1–5)\nTrack Chair / Session Moderator / Evaluators', icon: 'mortar' },
          { time: '', title: '', subtitle: 'Track 5 – Innovation, Economics, and Sustainable Development\nPresentations (Entry 1–5)\nTrack Chair / Session Moderator / Evaluators', icon: 'viadeo' },
          { time: '17:00 – 17:15', title: 'DAY 1 SYNTHESIS / ANNOUNCEMENTS', subtitle: 'Scientific Committee / Secretariat', icon: 'users' },
          { time: '17:15', title: 'END OF DAY 1 SCIENTIFIC PROGRAM', subtitle: '', icon: 'users' },
          { time: '18:00 – 21:00', title: "FELLOWSHIP/GOVERNOR'S NIGHT", subtitle: 'Networking Dinner', icon: 'glass' },
        ],
      },
    },

    // ============ DAY 2 SCHEDULE ============
    {
      section: 'Day 2 Schedule',
      fields: [],
      list: {
        key: 'day2_schedule',
        label: 'Day 2 Sessions',
        items: [
          { time: '08:30 – 09:00', title: 'REGISTRATION AND MORNING COFFEE', subtitle: '', icon: 'coffee' },
          { time: '09:00 – 10:00', title: 'PLENARY TALK 6 - CLIMATE CHANGE AND ADAPTATION', subtitle: 'Invited Speaker\nInternational Expert on Climate Change', icon: 'graduation' },
          { time: '10:00 – 11:00', title: 'PLENARY TALK 7 - SUSTAINABLE AGRICULTURE', subtitle: 'Invited Speaker\nLeading Researcher in Sustainable Farming', icon: 'graduation' },
          { time: '11:00 – 11:15', title: 'HEALTH AND COFFEE BREAK', subtitle: '', icon: 'mug' },
          { time: '11:15 – 12:15', title: 'PANEL DISCUSSION', subtitle: "Theme: 'Future of Agri-Life Sciences'\nPanelists from Partner Institutions", icon: 'comments' },
          { time: '12:15 – 13:15', title: 'LUNCH BREAK', subtitle: '', icon: 'utensils' },
          { time: '13:15 – 15:15', title: 'TECHNICAL PRESENTATIONS – BREAKOUT SESSION 2', subtitle: 'Scientific & Technical Committee', icon: 'book' },
          { time: '', title: '', subtitle: 'Track 1 – Agricultural and Animal Sciences\nPresentations (Entry 6–10)\nTrack Chair / Session Moderator / Evaluators', icon: 'leaf' },
          { time: '', title: '', subtitle: 'Track 2 – Life, Biological, and Biotechnology Sciences\nPresentations (Entry 6–10)\nTrack Chair / Session Moderator / Evaluators', icon: 'react' },
          { time: '', title: '', subtitle: 'Track 3 – Fisheries, Marine, Bioresource, and Environmental Sciences\nPresentations (Entry 6–10)\nTrack Chair / Session Moderator / Evaluators', icon: 'pastafarianism' },
          { time: '', title: '', subtitle: 'Track 4 – Food, Nutrition, and One Health\nPresentations (Entry 6–10)\nTrack Chair / Session Moderator / Evaluators', icon: 'mortar' },
          { time: '', title: '', subtitle: 'Track 5 – Innovation, Economics, and Sustainable Development\nPresentations (Entry 6–10)\nTrack Chair / Session Moderator / Evaluators', icon: 'viadeo' },
          { time: '15:15 – 15:30', title: 'HEALTH AND COFFEE BREAK', subtitle: '', icon: 'mug' },
          { time: '15:30 – 17:00', title: 'WORKSHOP AND TRAINING SESSION', subtitle: 'Hands-on Workshop on Research Methodologies\nFacilitated by International Experts', icon: 'graduation' },
          { time: '17:00 – 17:15', title: 'DAY 2 SYNTHESIS / ANNOUNCEMENTS', subtitle: 'Scientific Committee / Secretariat', icon: 'users' },
          { time: '17:15', title: 'END OF DAY 2 SCIENTIFIC PROGRAM', subtitle: '', icon: 'users' },
        ],
      },
    },

    // ============ DAY 3 SCHEDULE ============
    {
      section: 'Day 3 Schedule',
      fields: [],
      list: {
        key: 'day3_schedule',
        label: 'Day 3 Sessions',
        items: [
          { time: '08:30 – 09:00', title: 'REGISTRATION AND MORNING COFFEE', subtitle: '', icon: 'coffee' },
          { time: '09:00 – 10:00', title: 'PLENARY TALK 8 - BIOTECHNOLOGY AND GENOMICS', subtitle: 'Invited Speaker\nBiotechnology Expert', icon: 'graduation' },
          { time: '10:00 – 11:00', title: 'PLENARY TALK 9 - FOOD SECURITY AND NUTRITION', subtitle: 'Invited Speaker\nFood Security Specialist', icon: 'graduation' },
          { time: '11:00 – 11:15', title: 'HEALTH AND COFFEE BREAK', subtitle: '', icon: 'mug' },
          { time: '11:15 – 12:15', title: 'CLOSING PLENARY TALK', subtitle: "Keynote Speaker\nTopic: 'Future Directions in Agri-Life Sciences'", icon: 'microphone' },
          { time: '12:15 – 13:15', title: 'LUNCH BREAK', subtitle: '', icon: 'utensils' },
          { time: '13:15 – 14:15', title: 'BEST PRESENTATION AWARDS', subtitle: 'Recognition of Outstanding Presentations\nAwarding Ceremony', icon: 'bullhorn' },
          { time: '14:15 – 15:15', title: 'CLOSING CEREMONY', subtitle: 'Closing Remarks\nDr. Efren L. Linan\nCapiz State University, Philippines', icon: 'microphone' },
          { time: '15:15 – 15:30', title: 'FAREWELL COFFEE AND SOCIAL GATHERING', subtitle: '', icon: 'mug' },
          { time: '15:30', title: 'END OF THE SYMPOSIUM', subtitle: '', icon: 'users' },
        ],
      },
    },

    // ============ DOWNLOAD CTA ============
    {
      section: 'Download CTA',
      fields: [
        { key: 'download.title', label: 'CTA Title', type: 'text', value: 'Download Program' },
        {
          key: 'download.description',
          label: 'CTA Description',
          type: 'text',
          value: 'Get the complete program schedule in PDF format.',
        },
        { key: 'download.button_text', label: 'Button Text', type: 'text', value: 'DOWNLOAD FULL PROGRAM (PDF)' },
        { key: 'download.file_url', label: 'PDF File URL', type: 'url', value: '/documents/program.pdf' },
        { key: 'download.cover_image', label: 'Program Cover Image', type: 'image', value: '/program-cover.png' },
      ],
    },

    // ============ PROGRAM HIGHLIGHTS ============
    {
      section: 'Program Highlights',
      fields: [
        { key: 'highlights.title', label: 'Section Title', type: 'text', value: 'Program Highlights' },
        { key: 'highlights.image', label: 'Highlights Image', type: 'image', value: '/conference-photo.jpg' },
      ],
      list: {
        key: 'highlights_items',
        label: 'Highlight Items',
        items: [
          { text: 'Renowned international keynote speakers' },
          { text: 'High-quality research presentations' },
          { text: 'Interdisciplinary and multi-track sessions' },
          { text: 'Networking opportunities with global experts' },
          { text: 'Cultural and social events' },
        ],
      },
    },
  ],
};